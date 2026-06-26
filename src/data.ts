import type { LedgerState } from './types';

export const demoState: LedgerState = {
  project: {
    name: 'LoopLedger',
    liveUrl: 'https://loopledger.vercel.app',
    repoUrl: 'https://github.com/JerryNee/loopledger',
    testCommand: 'testsprite test run <test-id> --target-url https://loopledger.vercel.app --wait --output json',
    submissionGoal:
      'Prove that the agent used TestSprite CLI failures and reruns to harden the final web app.',
  },
  requirements: [
    {
      id: 'req-export',
      title: 'Export a credible LOOP.md from tracked evidence',
      owner: 'Builder',
      priority: 'P0',
      status: 'verified',
      acceptance:
        'The export includes requirements, CLI commands, run outcomes, failure notes, fixes, reruns, and final submission status.',
    },
    {
      id: 'req-runs',
      title: 'Track TestSprite CLI runs against a deployed URL',
      owner: 'Agent',
      priority: 'P0',
      status: 'implemented',
      acceptance:
        'Each run stores command, target URL, status, duration, credits, and notes for later audit.',
    },
    {
      id: 'req-failure',
      title: 'Convert failures into fixable ledger items',
      owner: 'Builder',
      priority: 'P1',
      status: 'planned',
      acceptance:
        'Failed or blocked runs can be tied to failure entries, fix entries, and rerun evidence.',
    },
  ],
  runs: [
    {
      id: 'run-001',
      requirementId: 'req-export',
      label: 'Export preview smoke',
      command:
        'testsprite test run test_export_preview --target-url https://loopledger.vercel.app --wait --output json',
      targetUrl: 'https://loopledger.vercel.app',
      status: 'failed',
      durationSec: 184,
      credits: 0.6,
      notes: 'Initial export preview did not include blocked run notes.',
      createdAt: '2026-06-30T20:15:00.000Z',
    },
    {
      id: 'run-002',
      requirementId: 'req-export',
      label: 'Export preview rerun',
      command:
        'testsprite test rerun test_export_preview --target-url https://loopledger.vercel.app --wait --output json',
      targetUrl: 'https://loopledger.vercel.app',
      status: 'passed',
      durationSec: 126,
      credits: 0.2,
      notes: 'Rerun passed after adding blocked-run section to LOOP.md export.',
      createdAt: '2026-06-30T21:04:00.000Z',
    },
  ],
  entries: [
    {
      id: 'entry-plan-001',
      kind: 'plan',
      status: 'verified',
      title: 'Defined evidence schema',
      detail:
        'Captured project profile, requirements, TestSprite CLI runs, ledger entries, and export fields.',
      evidence: 'PRODUCT.md and initial schema commit',
      linkedRequirementId: 'req-export',
      createdAt: '2026-06-30T19:42:00.000Z',
    },
    {
      id: 'entry-failure-001',
      kind: 'failure',
      status: 'resolved',
      title: 'LOOP.md missed failed-run notes',
      detail:
        'TestSprite failure showed that the export preview flattened run history and hid the failed attempt.',
      evidence: 'run-001 failure bundle',
      linkedRunId: 'run-001',
      linkedRequirementId: 'req-export',
      createdAt: '2026-06-30T20:18:00.000Z',
    },
    {
      id: 'entry-fix-001',
      kind: 'fix',
      status: 'verified',
      title: 'Added chronological run evidence',
      detail:
        'Updated the export generator so failed attempts, fixes, and reruns stay visible in order.',
      evidence: 'commit fix/export-run-history',
      linkedRunId: 'run-002',
      linkedRequirementId: 'req-export',
      createdAt: '2026-06-30T20:52:00.000Z',
    },
  ],
};

export const blankState: LedgerState = {
  project: {
    name: 'Untitled loop',
    liveUrl: '',
    repoUrl: '',
    testCommand: '',
    submissionGoal: '',
  },
  requirements: [],
  runs: [],
  entries: [],
};
