import { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  CheckCircle2,
  Clipboard,
  Download,
  FileText,
  Gauge,
  GitBranch,
  History,
  Link,
  ListChecks,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from 'lucide-react';
import { generateLoopMarkdown } from './exportLoop';
import { clearLedgerState, loadLedgerState, restoreDemoState, saveLedgerState } from './storage';
import type {
  EntryKind,
  EntryStatus,
  LedgerEntry,
  LedgerState,
  Requirement,
  RequirementStatus,
  RunStatus,
  TestRun,
} from './types';

type ViewMode = 'ledger' | 'runs' | 'export';

const entryKinds: EntryKind[] = ['plan', 'test', 'failure', 'fix', 'rerun', 'decision'];
const entryStatuses: EntryStatus[] = ['open', 'in-progress', 'resolved', 'verified'];
const runStatuses: RunStatus[] = ['queued', 'passed', 'failed', 'blocked'];
const requirementStatuses: RequirementStatus[] = ['planned', 'implemented', 'verified'];

const initialRequirement = {
  title: '',
  owner: 'Builder',
  priority: 'P1' as Requirement['priority'],
  status: 'planned' as RequirementStatus,
  acceptance: '',
};

const initialRun = {
  requirementId: '',
  label: '',
  command: '',
  targetUrl: '',
  status: 'queued' as RunStatus,
  durationSec: 120,
  credits: 0.2,
  notes: '',
};

const initialEntry = {
  kind: 'test' as EntryKind,
  status: 'open' as EntryStatus,
  title: '',
  detail: '',
  evidence: '',
  linkedRunId: '',
  linkedRequirementId: '',
};

function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function statusIcon(status: RunStatus | EntryStatus | RequirementStatus) {
  if (status === 'passed' || status === 'verified') return <CheckCircle2 size={15} />;
  if (status === 'failed' || status === 'blocked' || status === 'open') {
    return <TriangleAlert size={15} />;
  }
  return <Gauge size={15} />;
}

export default function App() {
  const [state, setState] = useState<LedgerState>(() => loadLedgerState());
  const [view, setView] = useState<ViewMode>('ledger');
  const [entryFilter, setEntryFilter] = useState<EntryKind | 'all'>('all');
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const [requirementDraft, setRequirementDraft] = useState(initialRequirement);
  const [runDraft, setRunDraft] = useState(initialRun);
  const [entryDraft, setEntryDraft] = useState(initialEntry);

  useEffect(() => {
    saveLedgerState(state);
  }, [state]);

  const loopMarkdown = useMemo(() => generateLoopMarkdown(state), [state]);

  const stats = useMemo(() => {
    const passedRuns = state.runs.filter(run => run.status === 'passed').length;
    const openEntries = state.entries.filter(entry => entry.status === 'open').length;
    const verifiedRequirements = state.requirements.filter(req => req.status === 'verified').length;
    const credits = state.runs.reduce((sum, run) => sum + run.credits, 0);
    return {
      passRate: state.runs.length === 0 ? 0 : Math.round((passedRuns / state.runs.length) * 100),
      openEntries,
      verifiedRequirements,
      credits,
    };
  }, [state]);

  const filteredEntries = useMemo(() => {
    const entries =
      entryFilter === 'all'
        ? state.entries
        : state.entries.filter(entry => entry.kind === entryFilter);
    return [...entries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [entryFilter, state.entries]);

  function updateProject(field: keyof LedgerState['project'], value: string) {
    setState(current => ({
      ...current,
      project: { ...current.project, [field]: value },
    }));
  }

  function addRequirement(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!requirementDraft.title.trim()) return;

    const requirement: Requirement = {
      id: createId('req'),
      title: requirementDraft.title.trim(),
      owner: requirementDraft.owner.trim() || 'Builder',
      priority: requirementDraft.priority,
      status: requirementDraft.status,
      acceptance: requirementDraft.acceptance.trim(),
    };

    setState(current => ({
      ...current,
      requirements: [requirement, ...current.requirements],
    }));
    setRequirementDraft(initialRequirement);
  }

  function addRun(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!runDraft.label.trim()) return;

    const run: TestRun = {
      id: createId('run'),
      requirementId: runDraft.requirementId || state.requirements[0]?.id || '',
      label: runDraft.label.trim(),
      command: runDraft.command.trim(),
      targetUrl: runDraft.targetUrl.trim() || state.project.liveUrl,
      status: runDraft.status,
      durationSec: Number(runDraft.durationSec) || 0,
      credits: Number(runDraft.credits) || 0,
      notes: runDraft.notes.trim(),
      createdAt: new Date().toISOString(),
    };

    const entry: LedgerEntry = {
      id: createId('entry'),
      kind: run.status === 'passed' ? 'rerun' : run.status === 'queued' ? 'test' : 'failure',
      status: run.status === 'passed' ? 'verified' : run.status === 'queued' ? 'in-progress' : 'open',
      title: `${run.label}: ${run.status}`,
      detail: run.notes || `Recorded TestSprite CLI run ${run.id}.`,
      evidence: run.command,
      linkedRunId: run.id,
      linkedRequirementId: run.requirementId,
      createdAt: run.createdAt,
    };

    setState(current => ({
      ...current,
      runs: [run, ...current.runs],
      entries: [entry, ...current.entries],
    }));
    setRunDraft(initialRun);
  }

  function addEntry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!entryDraft.title.trim()) return;

    const entry: LedgerEntry = {
      id: createId('entry'),
      kind: entryDraft.kind,
      status: entryDraft.status,
      title: entryDraft.title.trim(),
      detail: entryDraft.detail.trim(),
      evidence: entryDraft.evidence.trim(),
      linkedRunId: entryDraft.linkedRunId || undefined,
      linkedRequirementId: entryDraft.linkedRequirementId || undefined,
      createdAt: new Date().toISOString(),
    };

    setState(current => ({
      ...current,
      entries: [entry, ...current.entries],
    }));
    setEntryDraft(initialEntry);
  }

  async function copyMarkdown() {
    await navigator.clipboard.writeText(loopMarkdown);
    setCopyState('copied');
    window.setTimeout(() => setCopyState('idle'), 1600);
  }

  function downloadMarkdown() {
    const blob = new Blob([loopMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const linkEl = document.createElement('a');
    linkEl.href = url;
    linkEl.download = 'LOOP.md';
    linkEl.click();
    URL.revokeObjectURL(url);
  }

  function resetBlank() {
    setState(clearLedgerState());
    setRequirementDraft(initialRequirement);
    setRunDraft(initialRun);
    setEntryDraft(initialEntry);
  }

  function restoreDemo() {
    setState(restoreDemoState());
  }

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Workspace navigation">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            <ShieldCheck size={19} />
          </span>
          <div>
            <strong>LoopLedger</strong>
            <span>Evidence workspace</span>
          </div>
        </div>

        <nav className="nav-list">
          <button className={view === 'ledger' ? 'nav-item active' : 'nav-item'} onClick={() => setView('ledger')}>
            <History size={17} />
            Ledger
            <span>{state.entries.length}</span>
          </button>
          <button className={view === 'runs' ? 'nav-item active' : 'nav-item'} onClick={() => setView('runs')}>
            <ListChecks size={17} />
            CLI runs
            <span>{state.runs.length}</span>
          </button>
          <button className={view === 'export' ? 'nav-item active' : 'nav-item'} onClick={() => setView('export')}>
            <FileText size={17} />
            LOOP.md
            <span>{Math.round(loopMarkdown.length / 100) / 10}k</span>
          </button>
        </nav>

        <div className="sidebar-note">
          <Sparkles size={16} />
          <p>Track the proof while the agent builds, not after the memory fades.</p>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="section-label">Hackathon loop</p>
            <h1>{state.project.name}</h1>
          </div>
          <div className="top-actions">
            <button className="button secondary" onClick={restoreDemo}>
              <RotateCcw size={16} />
              Demo
            </button>
            <button className="button secondary" onClick={resetBlank}>
              <Archive size={16} />
              Clear
            </button>
            <button className="button primary" onClick={() => setView('export')}>
              <FileText size={16} />
              Export
            </button>
          </div>
        </header>

        <section className="project-strip" aria-label="Project profile">
          <label>
            Project
            <input
              value={state.project.name}
              onChange={event => updateProject('name', event.target.value)}
            />
          </label>
          <label>
            Live URL
            <input
              value={state.project.liveUrl}
              onChange={event => updateProject('liveUrl', event.target.value)}
              placeholder="https://your-app.example"
            />
          </label>
          <label>
            Repo
            <input
              value={state.project.repoUrl}
              onChange={event => updateProject('repoUrl', event.target.value)}
              placeholder="https://github.com/..."
            />
          </label>
          <label className="wide-field">
            Primary CLI command
            <input
              value={state.project.testCommand}
              onChange={event => updateProject('testCommand', event.target.value)}
              placeholder="testsprite test run ..."
            />
          </label>
          <label className="wide-field">
            Submission goal
            <textarea
              value={state.project.submissionGoal}
              onChange={event => updateProject('submissionGoal', event.target.value)}
              placeholder="What should the loop prove?"
            />
          </label>
        </section>

        <section className="metric-grid" aria-label="Loop summary">
          <Metric icon={<Gauge size={18} />} label="Pass rate" value={`${stats.passRate}%`} detail={`${state.runs.length} runs tracked`} />
          <Metric icon={<TriangleAlert size={18} />} label="Open evidence" value={String(stats.openEntries)} detail="Needs fix or rerun" />
          <Metric icon={<CheckCircle2 size={18} />} label="Verified reqs" value={`${stats.verifiedRequirements}/${state.requirements.length}`} detail="Ready for LOOP.md" />
          <Metric icon={<GitBranch size={18} />} label="Credits" value={stats.credits.toFixed(2)} detail="Manual estimate" />
        </section>

        <div className="content-grid">
          <section className="main-panel">
            {view === 'ledger' && (
              <LedgerView
                entries={filteredEntries}
                entryFilter={entryFilter}
                setEntryFilter={setEntryFilter}
                state={state}
                entryDraft={entryDraft}
                setEntryDraft={setEntryDraft}
                addEntry={addEntry}
              />
            )}

            {view === 'runs' && (
              <RunsView
                state={state}
                runDraft={runDraft}
                setRunDraft={setRunDraft}
                addRun={addRun}
                requirementDraft={requirementDraft}
                setRequirementDraft={setRequirementDraft}
                addRequirement={addRequirement}
              />
            )}

            {view === 'export' && (
              <ExportView
                markdown={loopMarkdown}
                copyState={copyState}
                copyMarkdown={copyMarkdown}
                downloadMarkdown={downloadMarkdown}
              />
            )}
          </section>

          <aside className="side-panel" aria-label="LOOP.md preview">
            <div className="panel-heading">
              <div>
                <p className="section-label">Live preview</p>
                <h2>LOOP.md</h2>
              </div>
              <button className="icon-button" onClick={copyMarkdown} aria-label="Copy LOOP.md">
                <Clipboard size={16} />
              </button>
            </div>
            <pre className="markdown-preview">{loopMarkdown}</pre>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Metric(props: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return (
    <article className="metric">
      <div className="metric-icon">{props.icon}</div>
      <div>
        <span>{props.label}</span>
        <strong>{props.value}</strong>
        <p>{props.detail}</p>
      </div>
    </article>
  );
}

function LedgerView(props: {
  entries: LedgerEntry[];
  entryFilter: EntryKind | 'all';
  setEntryFilter: (value: EntryKind | 'all') => void;
  state: LedgerState;
  entryDraft: typeof initialEntry;
  setEntryDraft: React.Dispatch<React.SetStateAction<typeof initialEntry>>;
  addEntry: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <>
      <div className="panel-heading">
        <div>
          <p className="section-label">Evidence trail</p>
          <h2>Loop ledger</h2>
        </div>
        <div className="segmented" aria-label="Entry filter">
          <button className={props.entryFilter === 'all' ? 'active' : ''} onClick={() => props.setEntryFilter('all')}>
            All
          </button>
          {entryKinds.map(kind => (
            <button
              key={kind}
              className={props.entryFilter === kind ? 'active' : ''}
              onClick={() => props.setEntryFilter(kind)}
            >
              {kind}
            </button>
          ))}
        </div>
      </div>

      <form className="entry-form" onSubmit={props.addEntry}>
        <div className="form-row compact">
          <label>
            Kind
            <select
              value={props.entryDraft.kind}
              onChange={event =>
                props.setEntryDraft(current => ({ ...current, kind: event.target.value as EntryKind }))
              }
            >
              {entryKinds.map(kind => (
                <option key={kind} value={kind}>
                  {kind}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select
              value={props.entryDraft.status}
              onChange={event =>
                props.setEntryDraft(current => ({
                  ...current,
                  status: event.target.value as EntryStatus,
                }))
              }
            >
              {entryStatuses.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label>
            Run
            <select
              value={props.entryDraft.linkedRunId}
              onChange={event =>
                props.setEntryDraft(current => ({ ...current, linkedRunId: event.target.value }))
              }
            >
              <option value="">None</option>
              {props.state.runs.map(run => (
                <option key={run.id} value={run.id}>
                  {run.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Title
          <input
            value={props.entryDraft.title}
            onChange={event =>
              props.setEntryDraft(current => ({ ...current, title: event.target.value }))
            }
            placeholder="Failure, fix, rerun, or decision"
          />
        </label>
        <label>
          Detail
          <textarea
            value={props.entryDraft.detail}
            onChange={event =>
              props.setEntryDraft(current => ({ ...current, detail: event.target.value }))
            }
            placeholder="What happened, what changed, and why it matters"
          />
        </label>
        <label>
          Evidence
          <input
            value={props.entryDraft.evidence}
            onChange={event =>
              props.setEntryDraft(current => ({ ...current, evidence: event.target.value }))
            }
            placeholder="PR, commit, TestSprite run id, or artifact URL"
          />
        </label>
        <button className="button primary" type="submit">
          <Plus size={16} />
          Add evidence
        </button>
      </form>

      <div className="timeline">
        {props.entries.length === 0 ? (
          <EmptyState title="No evidence yet" detail="Add a test run, failure, fix, or rerun to start the ledger." />
        ) : (
          props.entries.map(entry => <EntryRow key={entry.id} entry={entry} />)
        )}
      </div>
    </>
  );
}

function EntryRow({ entry }: { entry: LedgerEntry }) {
  return (
    <article className={`entry-row kind-${entry.kind}`}>
      <div className="entry-pin">{statusIcon(entry.status)}</div>
      <div>
        <div className="entry-meta">
          <span>{entry.kind}</span>
          <span>{entry.status}</span>
          <time>{formatDate(entry.createdAt)}</time>
        </div>
        <h3>{entry.title}</h3>
        <p>{entry.detail}</p>
        {entry.evidence && (
          <div className="evidence-line">
            <Link size={14} />
            {entry.evidence}
          </div>
        )}
      </div>
    </article>
  );
}

function RunsView(props: {
  state: LedgerState;
  runDraft: typeof initialRun;
  setRunDraft: React.Dispatch<React.SetStateAction<typeof initialRun>>;
  addRun: (event: React.FormEvent<HTMLFormElement>) => void;
  requirementDraft: typeof initialRequirement;
  setRequirementDraft: React.Dispatch<React.SetStateAction<typeof initialRequirement>>;
  addRequirement: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <>
      <div className="panel-heading">
        <div>
          <p className="section-label">TestSprite CLI</p>
          <h2>Runs and requirements</h2>
        </div>
      </div>

      <div className="two-column">
        <form className="entry-form" onSubmit={props.addRequirement}>
          <h3>Requirement</h3>
          <label>
            Title
            <input
              value={props.requirementDraft.title}
              onChange={event =>
                props.setRequirementDraft(current => ({ ...current, title: event.target.value }))
              }
              placeholder="What must be proven?"
            />
          </label>
          <div className="form-row compact">
            <label>
              Priority
              <select
                value={props.requirementDraft.priority}
                onChange={event =>
                  props.setRequirementDraft(current => ({
                    ...current,
                    priority: event.target.value as Requirement['priority'],
                  }))
                }
              >
                <option value="P0">P0</option>
                <option value="P1">P1</option>
                <option value="P2">P2</option>
              </select>
            </label>
            <label>
              Status
              <select
                value={props.requirementDraft.status}
                onChange={event =>
                  props.setRequirementDraft(current => ({
                    ...current,
                    status: event.target.value as RequirementStatus,
                  }))
                }
              >
                {requirementStatuses.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Acceptance
            <textarea
              value={props.requirementDraft.acceptance}
              onChange={event =>
                props.setRequirementDraft(current => ({
                  ...current,
                  acceptance: event.target.value,
                }))
              }
              placeholder="How will the loop prove this?"
            />
          </label>
          <button className="button secondary" type="submit">
            <Plus size={16} />
            Add requirement
          </button>
        </form>

        <form className="entry-form" onSubmit={props.addRun}>
          <h3>CLI run</h3>
          <label>
            Label
            <input
              value={props.runDraft.label}
              onChange={event =>
                props.setRunDraft(current => ({ ...current, label: event.target.value }))
              }
              placeholder="Checkout rerun"
            />
          </label>
          <label>
            Command
            <input
              value={props.runDraft.command}
              onChange={event =>
                props.setRunDraft(current => ({ ...current, command: event.target.value }))
              }
              placeholder="testsprite test run ..."
            />
          </label>
          <div className="form-row compact">
            <label>
              Status
              <select
                value={props.runDraft.status}
                onChange={event =>
                  props.setRunDraft(current => ({ ...current, status: event.target.value as RunStatus }))
                }
              >
                {runStatuses.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Credits
              <input
                type="number"
                step="0.1"
                min="0"
                value={props.runDraft.credits}
                onChange={event =>
                  props.setRunDraft(current => ({ ...current, credits: Number(event.target.value) }))
                }
              />
            </label>
          </div>
          <label>
            Notes
            <textarea
              value={props.runDraft.notes}
              onChange={event =>
                props.setRunDraft(current => ({ ...current, notes: event.target.value }))
              }
              placeholder="Failure summary, fix reason, or rerun result"
            />
          </label>
          <button className="button primary" type="submit">
            <Plus size={16} />
            Add run
          </button>
        </form>
      </div>

      <section className="requirements-list" aria-label="Requirements">
        {props.state.requirements.map(req => (
          <article className="requirement-row" key={req.id}>
            <div>
              <span className="status-pill">{req.priority}</span>
              <span className={`status-pill status-${req.status}`}>{statusIcon(req.status)} {req.status}</span>
            </div>
            <h3>{req.title}</h3>
            <p>{req.acceptance}</p>
          </article>
        ))}
      </section>

      <section className="run-table" aria-label="Recorded CLI runs">
        {props.state.runs.map(run => (
          <article className="run-row" key={run.id}>
            <div>
              <strong>{run.label}</strong>
              <span>{run.targetUrl}</span>
            </div>
            <span className={`status-pill status-${run.status}`}>{statusIcon(run.status)} {run.status}</span>
            <code>{run.command}</code>
          </article>
        ))}
      </section>
    </>
  );
}

function ExportView(props: {
  markdown: string;
  copyState: 'idle' | 'copied';
  copyMarkdown: () => void;
  downloadMarkdown: () => void;
}) {
  return (
    <>
      <div className="panel-heading">
        <div>
          <p className="section-label">Submission artifact</p>
          <h2>Export LOOP.md</h2>
        </div>
        <div className="top-actions">
          <button className="button secondary" onClick={props.copyMarkdown}>
            <Clipboard size={16} />
            {props.copyState === 'copied' ? 'Copied' : 'Copy'}
          </button>
          <button className="button primary" onClick={props.downloadMarkdown}>
            <Download size={16} />
            Download
          </button>
        </div>
      </div>
      <pre className="export-preview">{props.markdown}</pre>
    </>
  );
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="empty-state">
      <FileText size={22} />
      <h3>{title}</h3>
      <p>{detail}</p>
    </div>
  );
}
