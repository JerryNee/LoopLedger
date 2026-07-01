import type { LedgerState } from './types';

export type ReadinessStatus = 'ready' | 'attention';

export interface ReadinessItem {
  id: string;
  label: string;
  status: ReadinessStatus;
  detail: string;
}

function hasHttpUrl(value: string): boolean {
  return /^https?:\/\/\S+\.\S+/.test(value.trim());
}

export function getReadinessItems(state: LedgerState, markdown = ''): ReadinessItem[] {
  const entryKinds = new Set(state.entries.map(entry => entry.kind));
  const hasFailureLoop =
    entryKinds.has('failure') && (entryKinds.has('fix') || entryKinds.has('rerun'));
  const testSpriteRuns = state.runs.filter(run => run.command.toLowerCase().includes('testsprite'));
  const hasExportableLoop = state.entries.length > 0 && (markdown.length === 0 || markdown.length > 800);

  return [
    {
      id: 'live-url',
      label: 'Live app URL',
      status: hasHttpUrl(state.project.liveUrl) ? 'ready' : 'attention',
      detail: state.project.liveUrl || 'Add the deployed URL before running TestSprite CLI.',
    },
    {
      id: 'repo-url',
      label: 'Public repository',
      status:
        hasHttpUrl(state.project.repoUrl) && state.project.repoUrl.includes('github.com')
          ? 'ready'
          : 'attention',
      detail: state.project.repoUrl || 'Add the GitHub repository URL.',
    },
    {
      id: 'cli-command',
      label: 'Primary CLI command',
      status: state.project.testCommand.toLowerCase().includes('testsprite') ? 'ready' : 'attention',
      detail: state.project.testCommand || 'Record the TestSprite CLI command for the loop.',
    },
    {
      id: 'requirements',
      label: 'Requirements',
      status: state.requirements.length > 0 ? 'ready' : 'attention',
      detail: `${state.requirements.length} requirement${state.requirements.length === 1 ? '' : 's'} captured.`,
    },
    {
      id: 'cli-runs',
      label: 'CLI run evidence',
      status: testSpriteRuns.length > 0 ? 'ready' : 'attention',
      detail:
        testSpriteRuns.length > 0
          ? `${testSpriteRuns.length} TestSprite run${testSpriteRuns.length === 1 ? '' : 's'} recorded.`
          : 'Pending until TestSprite CLI is run against the live app.',
    },
    {
      id: 'failure-loop',
      label: 'Failure/fix loop',
      status: hasFailureLoop ? 'ready' : 'attention',
      detail: hasFailureLoop
        ? 'Failure and fix evidence are linked in the ledger.'
        : 'Add a failure plus fix or rerun entry after the first CLI result.',
    },
    {
      id: 'loop-md',
      label: 'LOOP.md export',
      status: hasExportableLoop ? 'ready' : 'attention',
      detail:
        state.entries.length > 0
          ? 'Agent loop timeline and detailed evidence are exportable.'
          : 'Add ledger entries before exporting LOOP.md.',
    },
    {
      id: 'ci',
      label: 'CI/CD bonus',
      status: 'ready',
      detail: 'GitHub Actions runs lint and build on push and pull request.',
    },
  ];
}
