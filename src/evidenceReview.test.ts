import { describe, expect, it } from 'vitest';
import { compareEvidence, earlierSnapshots, generateReviewMarkdown, reviewCounts } from './evidenceReview';
import { parsePullRequestUrl, type CheckEvidence, type EvidenceSnapshot } from './prEvidence';
import { recordedHistory } from './recordedEvidence';

const check = (overrides: Partial<CheckEvidence> = {}): CheckEvidence => ({ id: 1,
  name: 'TestSprite', source: 'testsprite', kind: 'check', status: 'completed',
  conclusion: 'success', url: 'https://github.com/o/r/actions/runs/1', testSprite: true, ...overrides });
const before: EvidenceSnapshot = { pr: parsePullRequestUrl('https://github.com/o/r/pull/1'),
  title: 'A review', headSha: 'a'.repeat(40), capturedAt: '2026-10-24T12:00:00Z',
  branch: 'feature', state: 'open', draft: false, checks: [check()], comments: [] };
const after = (checks: CheckEvidence[]): EvidenceSnapshot => ({ ...before, headSha: 'b'.repeat(40),
  capturedAt: '2026-10-24T13:00:00Z', checks });

describe('review deltas', () => {
  it.each([
    ['failure', 'regression'], ['skipped', 'unverified'], ['neutral', 'unverified'], [null, 'unverified'],
  ])('classifies success to %s as %s', (conclusion, kind) => {
    expect(compareEvidence(after([check({ id: 2, conclusion })]), before)[0].kind).toBe(kind);
  });
  it('does not carry a green result into a running retry', () => {
    const current = after([check({ id: 2 }), check({ id: 3, status: 'queued', conclusion: null })]);
    expect(compareEvidence(current, before)[0].kind).toBe('pending');
    expect(reviewCounts(current)).toEqual({ total: 1, passed: 0, pending: 1, failed: 0, unverified: 0 });
  });
  it('keeps a missing failed check unresolved', () => {
    const old = { ...before, checks: [check({ conclusion: 'failure' })] };
    expect(compareEvidence(after([]), old)[0]).toMatchObject({ kind: 'missing', after: undefined });
    expect(generateReviewMarkdown(after([]), [old])).toContain('not proven deleted, resolved');
  });
  it('calls only failed-to-passed recovery, not skipped or a renamed check', () => {
    const old = { ...before, checks: [check({ conclusion: 'failure' })] };
    expect(compareEvidence(after([check({ id: 2 })]), old)[0].kind).toBe('recovered');
    expect(compareEvidence(after([check({ id: 2, conclusion: 'skipped' })]), old)[0].kind).toBe('unverified');
    expect(compareEvidence(after([check({ id: 2, name: 'Another name' })]), old).map(row => row.kind)).toEqual(['missing', 'added']);
  });
  it('does not match a different publisher or status kind', () => {
    for (const change of [{ source: 'other' }, { kind: 'status' as const }]) {
      expect(compareEvidence(after([check(change)]), before).map(row => row.kind)).toEqual(['missing', 'added']);
    }
  });
  it('shows new failures ahead of new successful checks', () => {
    const rows = compareEvidence(after([check({ id: 2, name: 'A pass' }), check({ id: 3, name: 'Z fail', conclusion: 'failure' })]), { ...before, checks: [] });
    expect(rows.map(row => row.kind)).toEqual(['regression', 'added']);
  });
  it('supports reruns on the same commit and separates unchanged attempts', () => {
    const current = { ...after([check({ id: 2 })]), headSha: before.headSha };
    expect(compareEvidence(current, before)[0].kind).toBe('rerun');
    expect(compareEvidence({ ...current, checks: [check()] }, before)[0].kind).toBe('unchanged');
  });
  it('does not call completion of the same attempt a new attempt', () => {
    const old = { ...before, checks: [check({ status: 'queued', conclusion: null })] };
    expect(compareEvidence(after([check()]), old)[0].kind).toBe('updated');
  });
  it('rejects different PRs and future baselines', () => {
    expect(() => compareEvidence({ ...after([]), pr: parsePullRequestUrl('https://github.com/o/other/pull/1') }, before)).toThrow('same pull request');
    expect(() => compareEvidence(before, after([]))).toThrow('newer');
  });
  it('selects only earlier observations of the same case-insensitive PR', () => {
    const current = after([]);
    const old = { ...before, pr: parsePullRequestUrl('https://github.com/O/R/pull/1') };
    const other = { ...before, pr: parsePullRequestUrl('https://github.com/o/r/pull/2') };
    const future = { ...current, capturedAt: '2026-10-25T13:00:00Z' };
    expect(earlierSnapshots(current, [other, current, future, old])).toEqual([old]);
  });
  it('counts unrelated failures even when TestSprite reports success', () => {
    expect(reviewCounts(after([check(), check({ id: 2, name: 'Build', testSprite: false, conclusion: 'failure' })])).failed).toBe(1);
  });
  it('exports before/after sources, baseline SHA and escaped names', () => {
    const current = after([check({ id: 2, name: '[bad](javascript:alert(1))\n## heading', url: 'javascript:alert(1)' })]);
    const text = generateReviewMarkdown(current, [current, before], before);
    expect(text).toContain(`Baseline: ${before.headSha}`);
    expect(text).toContain('Before: https://github.com/o/r/actions/runs/1');
    expect(text).toContain('After: none');
    expect(text).not.toContain('\n## heading');
  });
});

describe('real recorded investigation', () => {
  it('contains two validated historical snapshots and one real recovery', () => {
    expect(recordedHistory).toHaveLength(2);
    const [current, baseline] = recordedHistory;
    expect(current.origin).toBe('recorded-case');
    expect(current.headSha).toBe('213172ab23e4ed85a3aeb4e1c2aa9829bc98dc59');
    const recovered = compareEvidence(current, baseline).filter(row => row.kind === 'recovered');
    expect(recovered).toHaveLength(1);
    expect(recovered[0].after?.name).toBe('TestSprite S4 strict suite');
    expect(recovered[0].before?.url).toContain('/40145334008/');
    expect(recovered[0].after?.url).toContain('/40145526729/');
    expect(generateReviewMarkdown(current, recordedHistory)).toContain('Not the current PR head');
    expect(generateReviewMarkdown(current, recordedHistory)).toContain('7 passed / 1 blocked');
  });
});
