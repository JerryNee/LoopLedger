import type { LedgerState } from './types';

export const starterState: LedgerState = {
  project: {
    name: 'LoopLedger',
    liveUrl: 'https://jerrynee.github.io/LoopLedger/',
    repoUrl: 'https://github.com/JerryNee/LoopLedger',
    testCommand:
      'testsprite test run <test-id> --target-url https://jerrynee.github.io/LoopLedger/ --wait --output json',
    submissionGoal:
      'Use TestSprite CLI failures and reruns to prove LoopLedger was hardened through an agent-led QA loop.',
  },
  requirements: [
    {
      id: 'req-loop-md',
      title: 'Keep an agent-written LOOP.md in the repo and app export',
      owner: 'Agent',
      priority: 'P0',
      status: 'implemented',
      acceptance:
        'The repository includes LOOP.md and the export produces submission context, readiness checks, one-line loop iterations, CLI runs, and detailed evidence.',
    },
    {
      id: 'req-readiness',
      title: 'Show submission readiness before the final Discord post',
      owner: 'Agent',
      priority: 'P0',
      status: 'implemented',
      acceptance:
        'The workspace flags live URL, public repo, CLI command, requirements, run evidence, failure/fix evidence, LOOP.md export, and CI/CD status.',
    },
    {
      id: 'req-cli',
      title: 'Record real TestSprite CLI runs against the deployed app',
      owner: 'Builder',
      priority: 'P0',
      status: 'planned',
      acceptance:
        'After deployment, each TestSprite run records the command, target URL, outcome, notes, and follow-up fix or rerun.',
    },
  ],
  runs: [],
  entries: [
    {
      id: 'entry-start-001',
      kind: 'plan',
      status: 'verified',
      title: 'Confirmed Season 3 loop rules and repository baseline',
      detail:
        'After the hackathon window opened, Codex verified the GitHub remote, existing CI, local lint/build status, and intended live URL before changing the product.',
      evidence: 'git remote, npm run lint, npm run build, curl https://loopledger.vercel.app',
      linkedRequirementId: 'req-loop-md',
      createdAt: '2026-07-01T22:46:00.000Z',
    },
    {
      id: 'entry-gap-001',
      kind: 'failure',
      status: 'resolved',
      title: 'Found missing committed LOOP.md evidence',
      detail:
        'The app could export markdown, but the public repository did not yet carry the required agent-written LOOP.md artifact for judges to inspect.',
      evidence: 'Repository root scan before this change',
      linkedRequirementId: 'req-loop-md',
      createdAt: '2026-07-01T22:48:00.000Z',
    },
    {
      id: 'entry-fix-001',
      kind: 'fix',
      status: 'verified',
      title: 'Added readiness checks and stronger LOOP.md timeline export',
      detail:
        'Codex added a submission readiness panel, replaced first-run demo data with a truthful hackathon starter ledger, and expanded the export with one-line agent loop iterations.',
      evidence: 'commit: feat: harden hackathon loop evidence',
      linkedRequirementId: 'req-readiness',
      createdAt: '2026-07-01T22:52:00.000Z',
    },
    {
      id: 'entry-deploy-001',
      kind: 'decision',
      status: 'in-progress',
      title: 'Changed live target to GitHub Pages after Vercel alias mismatch',
      detail:
        'Codex found that loopledger.vercel.app served an unrelated Next.js crochet tracker, so LoopLedger now targets the GitHub Pages URL and includes a Pages deployment workflow for the public repository.',
      evidence: 'curl https://loopledger.vercel.app returned crochet metadata; .github/workflows/pages.yml',
      linkedRequirementId: 'req-cli',
      createdAt: '2026-07-01T22:58:00.000Z',
    },
  ],
};

export const demoState: LedgerState = {
  project: {
    name: 'LoopLedger',
    liveUrl: 'https://jerrynee.github.io/LoopLedger/',
    repoUrl: 'https://github.com/JerryNee/LoopLedger',
    testCommand: 'testsprite test run <test-id> --target-url https://jerrynee.github.io/LoopLedger/ --wait --output json',
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
        'testsprite test run test_export_preview --target-url https://jerrynee.github.io/LoopLedger/ --wait --output json',
      targetUrl: 'https://jerrynee.github.io/LoopLedger/',
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
        'testsprite test rerun test_export_preview --target-url https://jerrynee.github.io/LoopLedger/ --wait --output json',
      targetUrl: 'https://jerrynee.github.io/LoopLedger/',
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
