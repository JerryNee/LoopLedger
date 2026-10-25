import { describe, expect, it } from 'vitest';
import { verifySuite } from './s4-result.mjs';

const suite = { projectId: 'project', tests: [{ id: 'a' }, { id: 'b' }] };
const result = () => ({
  summary: { total: 2, passed: 2, failed: 0, timedOut: 0, deferred: 0, conflicts: 0, notFound: 0 },
  accepted: ['a', 'b'].map(id => ({ testId: id, runId: `run-${id}`, projectId: 'project', status: 'passed' })),
});

describe('strict S4 result gate', () => {
  it('accepts exactly the expected successful runs', () => {
    expect(verifySuite(result(), suite)).toHaveLength(2);
  });
  it.each(['blocked', 'failed', 'cancelled', 'running'])('rejects a %s run even with a green summary', status => {
    const data = result();
    data.accepted[0].status = status;
    expect(() => verifySuite(data, suite)).toThrow();
  });
  it.each(['failed', 'timedOut', 'deferred', 'conflicts', 'notFound'])('rejects %s tests', key => {
    const data = result();
    data.summary[key] = 1;
    expect(() => verifySuite(data, suite)).toThrow();
  });
  it('rejects missing and duplicate tests', () => {
    const data = result();
    data.accepted.pop();
    expect(() => verifySuite(data, suite)).toThrow();
    data.accepted.push(data.accepted[0]);
    expect(() => verifySuite(data, suite)).toThrow();
  });
  it('rejects another project or duplicate run IDs', () => {
    const data = result();
    data.accepted[0].projectId = 'other';
    expect(() => verifySuite(data, suite)).toThrow();
    data.accepted[0].projectId = 'project';
    data.accepted[1].runId = data.accepted[0].runId;
    expect(() => verifySuite(data, suite)).toThrow();
  });
  it('rejects an empty selection', () => {
    expect(() => verifySuite({ summary: { total: 0, passed: 0 }, accepted: [] }, { tests: [] })).toThrow();
  });
});
