import { checkVerdict, generateEvidenceMarkdown, latestChecks, safeHttpsUrl, type CheckEvidence, type EvidenceSnapshot } from './prEvidence';

export type ChangeKind = 'regression' | 'missing' | 'pending' | 'unverified' | 'recovered' | 'added' | 'updated' | 'rerun' | 'unchanged';
export interface EvidenceChange {
  key: string;
  kind: ChangeKind;
  before?: CheckEvidence;
  after?: CheckEvidence;
}

export const changeLabels: Record<ChangeKind, string> = {
  regression: 'New failure', missing: 'Not returned', pending: 'Now pending',
  unverified: 'Not verified', recovered: 'Recovered', added: 'New check',
  updated: 'Outcome changed', rerun: 'New attempt', unchanged: 'Unchanged',
};

export function checkKey(check: CheckEvidence): string {
  return JSON.stringify([check.kind, check.source, check.name]);
}

export function samePullRequest(a: EvidenceSnapshot, b: EvidenceSnapshot): boolean {
  return a.pr.url.toLowerCase() === b.pr.url.toLowerCase();
}

export function earlierSnapshots(current: EvidenceSnapshot, history: EvidenceSnapshot[]): EvidenceSnapshot[] {
  return history.filter(item => samePullRequest(current, item) &&
    Date.parse(item.capturedAt) <= Date.parse(current.capturedAt) &&
    (item.capturedAt !== current.capturedAt || item.headSha !== current.headSha))
    .sort((a, b) => Date.parse(b.capturedAt) - Date.parse(a.capturedAt));
}

export function compareEvidence(current: EvidenceSnapshot, baseline: EvidenceSnapshot): EvidenceChange[] {
  if (!samePullRequest(current, baseline)) throw new Error('Snapshots must belong to the same pull request.');
  if (Date.parse(baseline.capturedAt) > Date.parse(current.capturedAt)) throw new Error('The baseline must not be newer than the selected snapshot.');
  const before = new Map(latestChecks(baseline.checks).map(check => [checkKey(check), check]));
  const after = new Map(latestChecks(current.checks).map(check => [checkKey(check), check]));
  const priority: ChangeKind[] = ['regression', 'missing', 'pending', 'unverified', 'recovered', 'added', 'updated', 'rerun', 'unchanged'];
  return [...new Set([...before.keys(), ...after.keys()])].map(key => {
    const old = before.get(key);
    const next = after.get(key);
    const oldVerdict = old && checkVerdict(old);
    const nextVerdict = next && checkVerdict(next);
    let kind: ChangeKind = 'unchanged';
    if (!next) kind = 'missing';
    else if (nextVerdict === 'failed' && oldVerdict !== 'failed') kind = 'regression';
    else if (!old) kind = 'added';
    else if (nextVerdict === 'pending' && oldVerdict !== 'pending') kind = 'pending';
    else if (nextVerdict === 'unverified' && oldVerdict !== 'unverified') kind = 'unverified';
    else if (nextVerdict === 'passed' && oldVerdict === 'failed') kind = 'recovered';
    else if (oldVerdict !== nextVerdict) kind = 'updated';
    else if (old.id !== next.id) kind = 'rerun';
    return { key, kind, before: old, after: next };
  }).sort((a, b) => priority.indexOf(a.kind) - priority.indexOf(b.kind) ||
    (a.after ?? a.before)!.name.localeCompare((b.after ?? b.before)!.name));
}

export function reviewCounts(snapshot: EvidenceSnapshot) {
  const checks = latestChecks(snapshot.checks);
  const count = (verdict: string) => checks.filter(check => checkVerdict(check) === verdict).length;
  return { total: checks.length, failed: count('failed'), pending: count('pending'),
    unverified: count('unverified'), passed: count('passed') };
}

export function generateReviewMarkdown(snapshot: EvidenceSnapshot, history: EvidenceSnapshot[], baseline = earlierSnapshots(snapshot, history)[0]): string {
  const text = generateEvidenceMarkdown(snapshot, history) + (snapshot.origin === 'recorded-case' ? [
    '', '', '## Recorded investigation context', '',
    'At commit 213172ab23e4ed85a3aeb4e1c2aa9829bc98dc59, the GitHub App reported success with 7 passed / 1 blocked. A separate strict replay passed 8/8 and read the actual downloaded file; it did not fix or replace the blocked agent result.',
    'Agent: https://www.testsprite.com/dashboard-v3/o/77167281-b0a3-5213-a18d-6af0a2168c02/projects/28ffbf1d-d12b-4c52-b3c8-51ec6407ebd8/execution/0b7d5d6c-8b61-4894-ac1c-3a4c62ffc9b0',
    'Strict replay: https://github.com/JerryNee/LoopLedger/actions/runs/40145526729',
    'The before/after comparison records a separate scheduling fix: waiting for the agent run prevented conflicts from simultaneous runs of the same tests. This context is a curated investigation, not automatically inferred from check statuses.',
  ].join('\n') : '');
  if (!baseline) return text;
  const escape = (value: string) => value.replace(/[\r\n]+/g, ' ').replace(/[\\`*_{}[\]<>|]/g, '\\$&');
  const changes = compareEvidence(snapshot, baseline);
  return [text, '', '## Changes since baseline', '',
    `- Baseline: ${baseline.headSha} (retrieved ${baseline.capturedAt})`,
    `- Selected: ${snapshot.headSha} (retrieved ${snapshot.capturedAt})`,
    '', ...changes.map(change => {
      const check = (change.after ?? change.before)!;
      return `- ${changeLabels[change.kind]}: ${escape(check.name)} (${escape(check.source)}). ` +
        `${change.before ? checkVerdict(change.before) : 'not observed'} -> ${change.after ? checkVerdict(change.after) : 'not returned'}. ` +
        `Before: ${safeHttpsUrl(change.before?.url) || 'none'}. After: ${safeHttpsUrl(change.after?.url) || 'none'}.`;
    }), '', 'Not returned means absent from this snapshot, not proven deleted, resolved, or no longer required. A recovered check does not prove all scenarios passed.'].join('\n');
}
