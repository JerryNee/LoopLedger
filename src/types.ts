export type RequirementStatus = 'planned' | 'implemented' | 'verified';
export type RunStatus = 'queued' | 'passed' | 'failed' | 'blocked';
export type EntryKind = 'plan' | 'test' | 'failure' | 'fix' | 'rerun' | 'decision';
export type EntryStatus = 'open' | 'in-progress' | 'resolved' | 'verified';

export interface Requirement {
  id: string;
  title: string;
  owner: string;
  priority: 'P0' | 'P1' | 'P2';
  status: RequirementStatus;
  acceptance: string;
}

export interface TestRun {
  id: string;
  requirementId: string;
  label: string;
  command: string;
  targetUrl: string;
  status: RunStatus;
  durationSec: number;
  credits: number;
  notes: string;
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  kind: EntryKind;
  status: EntryStatus;
  title: string;
  detail: string;
  evidence: string;
  linkedRunId?: string;
  linkedRequirementId?: string;
  createdAt: string;
}

export interface ProjectProfile {
  name: string;
  liveUrl: string;
  repoUrl: string;
  testCommand: string;
  submissionGoal: string;
}

export interface LedgerState {
  project: ProjectProfile;
  requirements: Requirement[];
  runs: TestRun[];
  entries: LedgerEntry[];
}
