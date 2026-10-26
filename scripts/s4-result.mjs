import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

export function verifySuite(result, suite) {
  const ids = suite.tests.map(test => test.id);
  assert.ok(ids.length > 0 && new Set(ids).size === ids.length, 'Expected test IDs must be unique and nonempty');
  assert.equal(result.summary?.total, ids.length, 'Wrong number of dispatched tests');
  assert.equal(result.summary?.passed, ids.length, 'Not every test passed');
  for (const key of ['failed', 'timedOut', 'deferred', 'conflicts', 'notFound']) {
    assert.equal(result.summary[key], 0, `${key} must be zero`);
  }
  assert.ok(Array.isArray(result.accepted), 'Missing run receipts');
  assert.deepEqual(result.accepted.map(run => run.testId).sort(), [...ids].sort(), 'Wrong test selection');
  const runIds = result.accepted.map(run => run.runId);
  assert.equal(new Set(runIds).size, ids.length, 'Duplicate run receipts');
  for (const run of result.accepted) {
    assert.equal(run.status, 'passed', `Test ${run.testId} did not pass`);
    assert.equal(run.projectId, suite.projectId, 'Wrong TestSprite project');
    assert.equal(typeof run.runId, 'string', 'Missing run ID');
    assert.ok(run.runId.length > 0, 'Empty run ID');
  }
  return result.accepted.map(({ testId, runId, status }) => ({ testId, runId, status }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const suite = JSON.parse(readFileSync('.testsprite/s4-suite.json', 'utf8'));
  const result = JSON.parse(readFileSync(process.argv[2], 'utf8'));
  const runs = verifySuite(result, suite);
  const receipt = { commit: process.env.GITHUB_SHA, targetUrl: suite.targetUrl, projectId: suite.projectId, runs };
  writeFileSync('testsprite-s4-evidence.json', JSON.stringify(receipt, null, 2) + '\n');
  const summary = `## TestSprite S4 strict replay\n\n${runs.length}/${runs.length} passed; no blocked, deferred, missing or timed-out tests.\n\nCommit: \`${receipt.commit}\`\n\nTarget: ${suite.targetUrl}\n\nDownload coverage reads the actual file after both pointer and keyboard activation and compares the complete Markdown.\n`;
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
  process.stdout.write(summary);
}
