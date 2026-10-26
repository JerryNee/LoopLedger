import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import process from 'node:process';

const repo = 'JerryNee/LoopLedger';
const get = path => JSON.parse(execFileSync('gh', ['api', `repos/${repo}${path}`], { encoding: 'utf8' }));
const pr = get('/pulls/1');
const shas = ['babd5af', '213172a'].map(ref => get(`/commits/${ref}`).sha);
const snapshots = shas.map(sha => {
  const runs = get(`/commits/${sha}/check-runs?filter=all&per_page=100`).check_runs;
  const statuses = get(`/commits/${sha}/statuses?per_page=100`);
  if (runs.length >= 100 || statuses.length >= 100) throw new Error('Case capture requires pagination.');
  const checks = [...runs.map(row => {
    if (row.head_sha !== sha) throw new Error('Wrong commit');
    return { id: row.id, name: row.name, source: row.app.slug, kind: 'check',
      status: row.status, conclusion: row.conclusion, url: row.html_url,
      testSprite: /test[\s_-]?sprite/i.test(`${row.name} ${row.app.slug}`) };
  }), ...statuses.map(row => ({ id: row.id, name: row.context, source: 'Commit status', kind: 'status',
    status: row.state === 'pending' ? 'in_progress' : 'completed',
    conclusion: row.state === 'pending' ? null : row.state, url: row.target_url || '',
    testSprite: /test[\s_-]?sprite/i.test(row.context) }))];
  return { pr: { owner: 'JerryNee', repo: 'LoopLedger', number: 1, url: pr.html_url },
    title: pr.title, headSha: sha, branch: pr.head.ref, state: 'open', draft: false,
    capturedAt: new Date().toISOString(), checks, comments: [], origin: 'recorded-case' };
});
const result = { description: 'Historical commit checks retrieved from the public GitHub API, not snapshots captured during the original runs. Not the current PR head.',
  snapshots: snapshots.reverse() };
writeFileSync('src/recordedCase.json', JSON.stringify(result, null, 2) + '\n');
process.stdout.write(`Captured ${snapshots.length} historical commits with source URLs.\n`);
