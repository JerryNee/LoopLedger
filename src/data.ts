import type { LedgerState } from './types';

export const starterState: LedgerState = {
  project: {
    name: 'LoopLedger',
    liveUrl: 'https://jerrynee.github.io/LoopLedger/',
    repoUrl: 'https://github.com/JerryNee/LoopLedger',
    testCommand:
      'testsprite test create-batch --plan-from-dir .testsprite/plans --run --wait --target-url https://jerrynee.github.io/LoopLedger/ --timeout 900 --max-concurrency 2 --output json',
    submissionGoal:
      'Turn the TestSprite CLI build loop into a judge-readable evidence packet: live app, public repo, run history, failure/fix trail, and LOOP.md.',
  },
  requirements: [
    {
      id: 'req-loop-md',
      title: 'Keep an agent-written LOOP.md in the repo and app export',
      owner: 'Agent',
      priority: 'P0',
      status: 'verified',
      acceptance:
        'The repository includes LOOP.md and the export produces submission context, readiness checks, one-line loop iterations, CLI runs, and detailed evidence.',
    },
    {
      id: 'req-readiness',
      title: 'Show submission readiness before the final Discord post',
      owner: 'Agent',
      priority: 'P0',
      status: 'verified',
      acceptance:
        'The workspace flags live URL, public repo, CLI command, requirements, run evidence, failure/fix evidence, LOOP.md export, and CI/CD status.',
    },
    {
      id: 'req-cli',
      title: 'Record real TestSprite CLI runs against the deployed app',
      owner: 'Builder',
      priority: 'P0',
      status: 'verified',
      acceptance:
        'Four TestSprite cloud frontend runs passed against the deployed GitHub Pages app and are recorded with test ids, run ids, commands, target URL, status, duration, and credits.',
    },
  ],
  runs: [
    {
      id: '7aad0a87-61f5-48e8-ab25-d88d4de1383e',
      requirementId: 'req-cli',
      label: 'Default workspace readiness and LOOP.md preview',
      command:
        'testsprite test create-batch --plan-from-dir .testsprite/plans --run --wait --target-url https://jerrynee.github.io/LoopLedger/ --timeout 900 --max-concurrency 2 --output json',
      targetUrl: 'https://jerrynee.github.io/LoopLedger/',
      status: 'passed',
      durationSec: 84,
      credits: 2,
      notes:
        'Passed. Test id 4ef99732-d5c6-47e0-bae7-cf8d85d757dd verified the default workspace, readiness checklist, and LOOP.md preview.',
      createdAt: '2026-07-01T23:28:04.924Z',
    },
    {
      id: '1a318e13-b289-44db-97ba-46549601e863',
      requirementId: 'req-cli',
      label: 'Manual evidence entry updates ledger and LOOP.md',
      command:
        'testsprite test create-batch --plan-from-dir .testsprite/plans --run --wait --target-url https://jerrynee.github.io/LoopLedger/ --timeout 900 --max-concurrency 2 --output json',
      targetUrl: 'https://jerrynee.github.io/LoopLedger/',
      status: 'passed',
      durationSec: 171,
      credits: 2,
      notes:
        'Passed. Test id d51164fa-c4ee-4392-aed4-408348a8ad96 added evidence through the form and observed it in the ledger and LOOP.md preview.',
      createdAt: '2026-07-01T23:29:32.506Z',
    },
    {
      id: 'e325e7f6-b2d6-4cdb-9039-60826624c4fd',
      requirementId: 'req-cli',
      label: 'CLI run recording creates run evidence',
      command:
        'testsprite test create-batch --plan-from-dir .testsprite/plans --run --wait --target-url https://jerrynee.github.io/LoopLedger/ --timeout 900 --max-concurrency 2 --output json',
      targetUrl: 'https://jerrynee.github.io/LoopLedger/',
      status: 'passed',
      durationSec: 271,
      credits: 2,
      notes:
        'Passed. Test id 84bb4d00-5be9-4c32-82e5-9fbe87078d97 recorded a CLI run in the app and verified the passed status.',
      createdAt: '2026-07-01T23:31:12.224Z',
    },
    {
      id: '7c23e2e3-d4cc-4d71-9988-482a5ff5bb46',
      requirementId: 'req-cli',
      label: 'Export view exposes judge-readable LOOP.md',
      command:
        'testsprite test create-batch --plan-from-dir .testsprite/plans --run --wait --target-url https://jerrynee.github.io/LoopLedger/ --timeout 900 --max-concurrency 2 --output json',
      targetUrl: 'https://jerrynee.github.io/LoopLedger/',
      status: 'passed',
      durationSec: 353,
      credits: 2,
      notes:
        'Passed. Test id 84094177-45a3-4f82-82c1-c23ec68a76b7 verified the Export LOOP.md view, sections, copy action, and download action.',
      createdAt: '2026-07-01T23:32:34.158Z',
    },
  ],
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
      status: 'verified',
      title: 'Changed live target to GitHub Pages after Vercel alias mismatch',
      detail:
        'Codex found that loopledger.vercel.app served an unrelated Next.js crochet tracker, so LoopLedger now targets the GitHub Pages URL and includes a Pages deployment workflow for the public repository.',
      evidence: 'curl https://loopledger.vercel.app returned crochet metadata; .github/workflows/pages.yml',
      linkedRequirementId: 'req-cli',
      createdAt: '2026-07-01T22:58:00.000Z',
    },
    {
      id: 'entry-public-001',
      kind: 'decision',
      status: 'verified',
      title: 'External access confirmed for repo and live app',
      detail:
        'Codex made the GitHub repository public, enabled GitHub Pages with workflow deployment, dispatched the Pages build, and confirmed unauthenticated access to both the repo and the live LoopLedger page.',
      evidence:
        'GitHub API visibility public; raw LOOP.md accessible; Pages run 28553664509 success; curl https://jerrynee.github.io/LoopLedger/ returned 200',
      linkedRequirementId: 'req-cli',
      createdAt: '2026-07-01T23:08:00.000Z',
    },
    {
      id: 'entry-testsprite-suite-001',
      kind: 'test',
      status: 'verified',
      title: 'Ran first TestSprite cloud suite against LoopLedger',
      detail:
        'Codex created a TestSprite frontend project and ran four cloud browser plans against the deployed GitHub Pages app. All four passed: default workspace readiness, manual evidence capture, CLI run recording, and LOOP.md export.',
      evidence:
        'project 9a0f2053-4ee8-409d-bc24-9b339f6e7593; runs 7aad0a87-61f5-48e8-ab25-d88d4de1383e, 1a318e13-b289-44db-97ba-46549601e863, e325e7f6-b2d6-4cdb-9039-60826624c4fd, 7c23e2e3-d4cc-4d71-9988-482a5ff5bb46; 4/4 passed; 8 credits used',
      linkedRequirementId: 'req-cli',
      createdAt: '2026-07-01T23:32:34.000Z',
    },
    {
      id: 'entry-clarity-ci-001',
      kind: 'fix',
      status: 'verified',
      title: 'Clarified the judge-facing story and wired TestSprite checker CI',
      detail:
        'Codex added a first-screen summary explaining that LoopLedger turns TestSprite CLI verdicts into a judge-readable LOOP.md packet, refreshed the README/current status, and added a GitHub Actions checker workflow that reruns the saved TestSprite cloud suite when the repository secret is configured.',
      evidence:
        'UI briefing panel; README current status; .github/workflows/testsprite.yml; docs/demo-script.md',
      linkedRequirementId: 'req-readiness',
      createdAt: '2026-07-02T00:44:32.000Z',
    },
    {
      id: 'entry-ci-checker-001',
      kind: 'test',
      status: 'verified',
      title: 'Verified TestSprite checker workflow in GitHub Actions',
      detail:
        'Codex configured the GitHub Actions TESTSPRITE_API_KEY secret, manually dispatched the TestSprite Checker workflow, and confirmed the CI job configured the CLI, reran the saved cloud suite, uploaded the result artifact, and finished successfully.',
      evidence:
        'GitHub Actions run 28557891464; testsprite-result artifact summary: 4 passed, 0 failed, 0 deferred, total 4.',
      linkedRequirementId: 'req-cli',
      createdAt: '2026-07-02T01:02:00.000Z',
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
