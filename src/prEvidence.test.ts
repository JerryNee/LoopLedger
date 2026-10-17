import { describe, expect, it, vi } from 'vitest';
import { checkVerdict, fetchPullRequestEvidence, generateEvidenceMarkdown, latestChecks, parsePullRequestUrl, readSnapshots, safeHttpsUrl, testSpriteVerdict, type CheckEvidence, type EvidenceSnapshot } from './prEvidence';

const sha = 'a'.repeat(40);
const prUrl = 'https://github.com/JerryNee/LoopLedger/pull/1';
const check = (overrides: Partial<CheckEvidence> = {}): CheckEvidence => ({
  id: 1, name: 'TestSprite', source: 'testsprite', kind: 'check', status: 'completed',
  conclusion: 'success', url: prUrl, testSprite: true, ...overrides,
});
const snapshot = (checks: CheckEvidence[] = []): EvidenceSnapshot => ({
  pr: parsePullRequestUrl(prUrl), title: 'Evidence import', headSha: sha, branch: 'feature',
  state: 'open', draft: false, capturedAt: '2026-10-16T22:00:00.000Z', checks, comments: [],
});
const rawPr = { title: 'Evidence import', head: { sha, ref: 'feature' }, state: 'open', draft: false };
const rawCheck = (id: number, conclusion = 'success') => ({
  id, name: `TestSprite ${id}`, app: { slug: 'testsprite' }, head_sha: sha,
  status: 'completed', conclusion, html_url: prUrl,
});
function api(overrides: (url: URL, calls: number) => unknown = () => undefined) {
  let prCalls = 0;
  return vi.fn<typeof fetch>(async (input) => {
    const url = new URL(String(input));
    if (url.pathname.endsWith('/pulls/1')) prCalls++;
    const override = overrides(url, prCalls);
    if (override instanceof Response) return override;
    const body = override ?? (url.pathname.endsWith('/pulls/1') ? rawPr :
      url.pathname.endsWith('/check-runs') ? { check_runs: [rawCheck(1)] } : []);
    return Response.json(body);
  });
}

describe('PR URL validation', () => {
  it('normalizes pasted links without forwarding query parameters', () => {
    expect(parsePullRequestUrl(` ${prUrl}/?tab=checks#event `).url).toBe(prUrl);
  });
  it.each([
    'https://github.com.evil.example/a/b/pull/1', 'http://github.com/a/b/pull/1',
    'https://token@github.com/a/b/pull/1', 'https://github.com:8443/a/b/pull/1',
    'https://github.com/a/b/issues/1', 'https://github.com/a/b/pull/0',
    'https://github.com/a/b/pull/99999999999999999999', 'not a URL',
  ])('rejects unsupported input: %s', url => expect(() => parsePullRequestUrl(url)).toThrow());
  it('does not render executable or credential-bearing URLs', () => {
    expect(safeHttpsUrl('javascript:alert(1)')).toBe('');
    expect(safeHttpsUrl('https://secret@github.com')).toBe('');
  });
});

describe('check evidence', () => {
  it('does not let an older pass hide a running retry', () => {
    const checks = [check(), check({ id: 2, status: 'queued', conclusion: null })];
    expect(testSpriteVerdict(snapshot(checks))).toBe('pending');
  });
  it('uses the latest attempt, regardless of API order', () => {
    expect(latestChecks([check({ id: 4 }), check({ id: 2, conclusion: 'failure' })])).toHaveLength(1);
    expect(testSpriteVerdict(snapshot([check({ id: 4 }), check({ conclusion: 'failure' })]))).toBe('passed');
  });
  it.each(['skipped', 'neutral', null, 'future-status'])('does not count %s as passing', conclusion => {
    expect(checkVerdict(check({ conclusion }))).toBe('unverified');
  });
  it('keeps checks from distinct publishers separate', () => {
    expect(latestChecks([check(), check({ id: 2, source: 'another-app', conclusion: 'failure' })])).toHaveLength(2);
  });
  it('does not infer a pass from bot comments or unrelated CI', () => {
    const value = snapshot([check({ testSprite: false })]);
    value.comments = [{ url: prUrl, author: 'testsprite[bot]', updatedAt: value.capturedAt }];
    expect(testSpriteVerdict(value)).toBe('missing');
  });
  it('failure takes precedence over another pending check', () => {
    expect(testSpriteVerdict(snapshot([check({ conclusion: 'failure' }), check({ name: 'TestSprite next', status: 'queued' })]))).toBe('failed');
  });
});

describe('GitHub import', () => {
  it('loads checks from the exact head and omits credentials', async () => {
    const request = api();
    const result = await fetchPullRequestEvidence(prUrl, undefined, request);
    expect(result.headSha).toBe(sha);
    expect(testSpriteVerdict(result)).toBe('passed');
    expect(request.mock.calls.some(([url]) => String(url).includes(`/commits/${sha}/check-runs`))).toBe(true);
    expect(request.mock.calls.every(([, options]) => options?.credentials === 'omit')).toBe(true);
  });
  it('loads later pages so a failure beyond the first 100 checks cannot be lost', async () => {
    const request = api(url => url.pathname.endsWith('/check-runs') ? {
      check_runs: url.searchParams.get('page') === '1'
        ? Array.from({ length: 100 }, (_, i) => rawCheck(i + 1)) : [rawCheck(101, 'failure')],
    } : undefined);
    expect(testSpriteVerdict(await fetchPullRequestEvidence(prUrl, undefined, request))).toBe('failed');
  });
  it('rejects a snapshot if a commit is pushed during collection', async () => {
    const request = api((url, calls) => url.pathname.endsWith('/pulls/1') && calls === 2
      ? { ...rawPr, head: { sha: 'b'.repeat(40) } } : undefined);
    await expect(fetchPullRequestEvidence(prUrl, undefined, request)).rejects.toThrow('new commit');
  });
  it('rejects checks returned for a different commit', async () => {
    const request = api(url => url.pathname.endsWith('/check-runs')
      ? { check_runs: [{ ...rawCheck(1), head_sha: 'b'.repeat(40) }] } : undefined);
    await expect(fetchPullRequestEvidence(prUrl, undefined, request)).rejects.toThrow('different commit');
  });
  it('keeps the latest commit status per context', async () => {
    const request = api(url => url.pathname.endsWith('/statuses') ? [
      { id: 2, context: 'TestSprite status', state: 'pending', target_url: prUrl },
      { id: 1, context: 'TestSprite status', state: 'success', target_url: prUrl },
    ] : undefined);
    expect(testSpriteVerdict(await fetchPullRequestEvidence(prUrl, undefined, request))).toBe('pending');
  });
  it('reports rate limits without constructing a partial result', async () => {
    const request = api(url => url.pathname.endsWith('/statuses') ? new Response('', { status: 403 }) : undefined);
    await expect(fetchPullRequestEvidence(prUrl, undefined, request)).rejects.toThrow('limited');
  });
  it('rejects malformed check responses', async () => {
    await expect(fetchPullRequestEvidence(prUrl, undefined, api(url => url.pathname.endsWith('/check-runs') ? {} : undefined))).rejects.toThrow('incomplete');
  });
});

describe('saved evidence', () => {
  it('ignores corrupted and incompatible browser records', () => {
    expect(readSnapshots({ getItem: () => 'broken' })).toEqual([]);
    expect(readSnapshots({ getItem: () => JSON.stringify([{ ...snapshot(), checks: [{}] }]) })).toEqual([]);
    expect(readSnapshots({ getItem: () => JSON.stringify([snapshot([check()])]) })).toEqual([snapshot([check()])]);
  });
  it('handles unavailable browser storage', () => {
    expect(readSnapshots({ getItem: () => { throw new Error('denied'); } })).toEqual([]);
  });
  it('exports only history for the selected PR and includes evidence scope', () => {
    const other = { ...snapshot(), pr: parsePullRequestUrl('https://github.com/other/repo/pull/2') };
    const text = generateEvidenceMarkdown(snapshot(), [snapshot(), other]);
    expect(text).toContain(sha);
    expect(text).not.toContain('other/repo');
    expect(text).toContain('not a live merge authorization');
    expect(text).toContain('missing');
  });
});
