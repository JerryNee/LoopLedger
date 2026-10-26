export interface PullRequestRef {
  owner: string;
  repo: string;
  number: number;
  url: string;
}

export interface CheckEvidence {
  id: number;
  name: string;
  source: string;
  kind: 'check' | 'status';
  status: string;
  conclusion: string | null;
  url: string;
  testSprite: boolean;
}

export interface EvidenceSnapshot {
  pr: PullRequestRef;
  title: string;
  headSha: string;
  branch: string;
  state: 'open' | 'closed' | 'merged';
  draft: boolean;
  capturedAt: string;
  origin?: 'recorded-case';
  checks: CheckEvidence[];
  comments: { url: string; author: string; updatedAt: string }[];
}

export type EvidenceVerdict = 'passed' | 'failed' | 'pending' | 'missing' | 'unverified';

const SNAPSHOTS_KEY = 'loopledger-pr-evidence-v1';

export function parsePullRequestUrl(input: string): PullRequestRef {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    throw new Error('Enter a public GitHub pull request URL.');
  }
  const match = url.pathname.match(/^\/([a-z\d-]+)\/([a-z\d_.-]+)\/pull\/([1-9]\d*)\/?$/i);
  if (url.protocol !== 'https:' || url.hostname !== 'github.com' || url.port ||
      url.username || url.password || !match || !Number.isSafeInteger(Number(match[3]))) {
    throw new Error('Use https://github.com/owner/repository/pull/123.');
  }
  return { owner: match[1], repo: match[2], number: Number(match[3]),
    url: `https://github.com/${match[1]}/${match[2]}/pull/${match[3]}` };
}

export function safeHttpsUrl(value: unknown): string {
  if (typeof value !== 'string') return '';
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
  } catch {
    return '';
  }
}

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('GitHub returned incomplete evidence. Please refresh.');
  }
  return value as Record<string, unknown>;
}

function requiredString(value: unknown): string {
  if (typeof value !== 'string' || !value) throw new Error('GitHub returned incomplete evidence. Please refresh.');
  return value;
}

function numericId(value: unknown): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value)) throw new Error('GitHub returned an invalid check ID.');
  return value;
}

function isTestSprite(value: string): boolean {
  return /test[\s_-]?sprite/i.test(value);
}

export function latestChecks(checks: CheckEvidence[]): CheckEvidence[] {
  const latest = new Map<string, CheckEvidence>();
  for (const check of checks) {
    const key = JSON.stringify([check.kind, check.source, check.name]);
    const previous = latest.get(key);
    if (!previous || check.id > previous.id) latest.set(key, check);
  }
  return [...latest.values()].sort((a, b) => Number(b.testSprite) - Number(a.testSprite) || a.name.localeCompare(b.name));
}

export function checkVerdict(check: CheckEvidence): EvidenceVerdict {
  if (check.status !== 'completed') return 'pending';
  if (check.conclusion === 'success') return 'passed';
  if (['failure', 'error', 'cancelled', 'timed_out', 'action_required', 'startup_failure', 'stale'].includes(check.conclusion ?? '')) return 'failed';
  return 'unverified';
}

export function testSpriteVerdict(snapshot: EvidenceSnapshot): EvidenceVerdict {
  const checks = latestChecks(snapshot.checks).filter(check => check.testSprite);
  if (!checks.length) return 'missing';
  const verdicts = checks.map(checkVerdict);
  if (verdicts.includes('failed')) return 'failed';
  if (verdicts.includes('pending')) return 'pending';
  if (verdicts.includes('unverified')) return 'unverified';
  return 'passed';
}

export async function fetchPullRequestEvidence(
  input: string,
  signal?: AbortSignal,
  request: typeof fetch = fetch,
): Promise<EvidenceSnapshot> {
  const pr = parsePullRequestUrl(input);
  const base = `https://api.github.com/repos/${pr.owner}/${pr.repo}`;
  async function get(path: string): Promise<unknown> {
    const response = await request(`${base}${path}`, {
      signal, credentials: 'omit', cache: 'no-store',
      headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
    });
    if (!response.ok) {
      if (response.status === 404) throw new Error('PR not found. This workspace can read public GitHub repositories only.');
      if (response.status === 403 || response.status === 429) throw new Error('GitHub limited this request. Try again later; the last snapshot has not been refreshed.');
      throw new Error(`GitHub request failed (${response.status}). Please retry.`);
    }
    return response.json();
  }
  async function pages(path: string, key?: string): Promise<unknown[]> {
    const items: unknown[] = [];
    for (let page = 1; page <= 10; page++) {
      const response = await get(`${path}${path.includes('?') ? '&' : '?'}per_page=100&page=${page}`);
      const rows = key ? object(response)[key] : response;
      if (!Array.isArray(rows)) throw new Error('GitHub returned incomplete evidence. Please refresh.');
      items.push(...rows);
      if (rows.length < 100) return items;
    }
    throw new Error('This PR exceeds the 1,000-record evidence limit. No partial snapshot was saved.');
  }
  const rawPr = object(await get(`/pulls/${pr.number}`));
  const head = object(rawPr.head);
  const headSha = requiredString(head.sha);
  if (!/^[a-f\d]{40}$/i.test(headSha)) throw new Error('GitHub returned an invalid commit SHA.');
  const [rawChecks, rawStatuses, rawComments] = await Promise.all([
    pages(`/commits/${headSha}/check-runs?filter=all`, 'check_runs'),
    pages(`/commits/${headSha}/statuses`),
    pages(`/issues/${pr.number}/comments`),
  ]);
  const checks: CheckEvidence[] = rawChecks.map(value => {
    const row = object(value);
    if (row.head_sha !== headSha) throw new Error('Check evidence belongs to a different commit. Please refresh.');
    const name = requiredString(row.name);
    const app = object(row.app);
    const source = requiredString(app.slug);
    const status = requiredString(row.status);
    return { id: numericId(row.id), name, source, kind: 'check', status,
      conclusion: typeof row.conclusion === 'string' ? row.conclusion : null,
      url: safeHttpsUrl(row.html_url), testSprite: isTestSprite(`${source} ${name}`) };
  });
  checks.push(...rawStatuses.map(value => {
    const row = object(value);
    const name = requiredString(row.context);
    const status = requiredString(row.state);
    return { id: numericId(row.id), name, source: 'Commit status', kind: 'status' as const,
      status: status === 'pending' ? 'in_progress' : 'completed',
      conclusion: status === 'pending' ? null : status, url: safeHttpsUrl(row.target_url),
      testSprite: isTestSprite(name) };
  }));
  const comments = rawComments.flatMap(value => {
    const row = object(value);
    const user = object(row.user);
    const author = requiredString(user.login);
    if (user.type !== 'Bot' || !isTestSprite(author)) return [];
    return [{ url: safeHttpsUrl(row.html_url), author, updatedAt: requiredString(row.updated_at) }];
  });
  // A push during collection must not turn an old commit's green checks into current evidence.
  const currentPr = object(await get(`/pulls/${pr.number}`));
  if (object(currentPr.head).sha !== headSha) throw new Error('A new commit was pushed while evidence was loading. Refresh to inspect the latest commit.');
  return {
    pr, title: requiredString(currentPr.title), headSha, branch: requiredString(head.ref),
    state: currentPr.merged_at ? 'merged' : currentPr.state === 'closed' ? 'closed' : 'open',
    draft: currentPr.draft === true, capturedAt: new Date().toISOString(), checks: latestChecks(checks), comments,
  };
}

export function readSnapshots(storage: Pick<Storage, 'getItem'>): EvidenceSnapshot[] {
  try {
    const snapshots: unknown = JSON.parse(storage.getItem(SNAPSHOTS_KEY) || '[]');
    if (!Array.isArray(snapshots)) return [];
    return snapshots.filter((value): value is EvidenceSnapshot => {
      try {
        const row = object(value);
        const pr = object(row.pr);
        const ref = parsePullRequestUrl(requiredString(pr.url));
        return ref.owner === pr.owner && ref.repo === pr.repo && ref.number === pr.number &&
          typeof row.title === 'string' && typeof row.branch === 'string' &&
          typeof row.draft === 'boolean' && ['open', 'closed', 'merged'].includes(String(row.state)) &&
          typeof row.headSha === 'string' && /^[a-f\d]{40}$/i.test(row.headSha) &&
          typeof row.capturedAt === 'string' && Number.isFinite(Date.parse(row.capturedAt)) &&
          Array.isArray(row.checks) && row.checks.every(value => {
            const c = object(value);
            return typeof c.id === 'number' && typeof c.name === 'string' && typeof c.source === 'string' &&
              ['check', 'status'].includes(String(c.kind)) && typeof c.status === 'string' &&
              (c.conclusion === null || typeof c.conclusion === 'string') && typeof c.url === 'string' &&
              typeof c.testSprite === 'boolean';
          }) && Array.isArray(row.comments) && row.comments.every(value => {
            const c = object(value);
            return typeof c.url === 'string' && typeof c.author === 'string' && typeof c.updatedAt === 'string';
          });
      } catch { return false; }
    }).slice(0, 20);
  } catch { return []; }
}

export function saveSnapshots(storage: Pick<Storage, 'setItem'>, snapshots: EvidenceSnapshot[]): void {
  storage.setItem(SNAPSHOTS_KEY, JSON.stringify(snapshots.slice(0, 20)));
}

export function generateEvidenceMarkdown(snapshot: EvidenceSnapshot, history: EvidenceSnapshot[]): string {
  const escape = (text: string) => text.replace(/[\r\n]+/g, ' ').replace(/[\\`*_{}[\]<>|]/g, '\\$&');
  return [
    `# PR evidence: ${escape(snapshot.title)}`,
    ...(snapshot.origin === 'recorded-case' ? ['', '> Recorded case: historical commit checks retrieved later from GitHub. Not the current PR head or a live verification.'] : []),
    '', `- Pull request: ${snapshot.pr.url}`, `- Head commit: ${snapshot.headSha}`,
    `- Captured: ${snapshot.capturedAt}`, `- TestSprite-labelled checks: ${testSpriteVerdict(snapshot)}`,
    '', '## Checks on this commit', '',
    ...snapshot.checks.map(check => `- ${escape(check.name)} (${escape(check.source)}): ${checkVerdict(check)}. ${safeHttpsUrl(check.url)}`),
    ...(snapshot.checks.length ? [] : ['No check runs or commit statuses found.']),
    '', '## TestSprite bot comments', '',
    ...snapshot.comments.map(comment => `- ${safeHttpsUrl(comment.url)}`),
    ...(snapshot.comments.length ? [] : ['No TestSprite bot comments found.']),
    '', '## Observed history', '',
    ...history.filter(item => item.pr.url === snapshot.pr.url).map(item =>
      `- ${item.capturedAt} | ${item.headSha} | ${testSpriteVerdict(item)}`),
    '', '## Scope', '',
    'This is a snapshot of public GitHub API data, not a live merge authorization. Check names identify TestSprite-labelled results; they do not authenticate the publisher. Bot comments are linked as supporting evidence and never interpreted as a passing check. Branch protection, deployment identity, and portal test coverage require separate verification. Local history can be edited and is not a signed audit log.',
  ].join('\n');
}
