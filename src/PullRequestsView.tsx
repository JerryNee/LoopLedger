import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock3, Download, ExternalLink, GitCommitHorizontal, GitCompareArrows, GitPullRequest, History, LoaderCircle, RefreshCw, Search, ShieldQuestion, TriangleAlert } from 'lucide-react';
import { checkVerdict, fetchPullRequestEvidence, readSnapshots, safeHttpsUrl, saveSnapshots, testSpriteVerdict, type EvidenceSnapshot, type EvidenceVerdict } from './prEvidence';
import { changeLabels, compareEvidence, earlierSnapshots, generateReviewMarkdown, reviewCounts, samePullRequest } from './evidenceReview';
import { recordedDescription, recordedHistory } from './recordedEvidence';

const labels: Record<EvidenceVerdict, string> = {
  passed: 'Passed', failed: 'Needs a fix', pending: 'In progress', missing: 'No TestSprite check', unverified: 'Not verified',
};
const evidenceTabs = ['checks', 'history', 'report'] as const;

function Verdict({ value }: { value: EvidenceVerdict }) {
  const Icon = value === 'passed' ? CheckCircle2 : value === 'pending' ? Clock3 : value === 'failed' ? TriangleAlert : ShieldQuestion;
  return <span className={`evidence-verdict verdict-${value}`}><Icon size={16} />{labels[value]}</span>;
}

function EvidenceLink({ url, children }: { url: string; children: React.ReactNode }) {
  const safe = safeHttpsUrl(url);
  return safe ? <a href={safe} target="_blank" rel="noreferrer">{children}<ExternalLink size={13} /></a> : <span>{children}</span>;
}

export default function PullRequestsView() {
  const [history, setHistory] = useState(() => {
    try { return readSnapshots(window.localStorage); } catch { return []; }
  });
  const [snapshot, setSnapshot] = useState<EvidenceSnapshot | null>(() => history[0] ?? null);
  const [input, setInput] = useState(history[0]?.pr.url ?? '');
  const [recorded, setRecorded] = useState(false);
  const [baselineIndex, setBaselineIndex] = useState(0);
  const [showUnchanged, setShowUnchanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [storageError, setStorageError] = useState('');
  const [tab, setTab] = useState<'checks' | 'history' | 'report'>('checks');
  const controller = useRef<AbortController | null>(null);
  const downloadLink = useRef<HTMLAnchorElement | null>(null);
  const displayedHistory = recorded ? recordedHistory : history;
  const baselines = snapshot ? earlierSnapshots(snapshot, displayedHistory) : [];
  const baseline = baselines[baselineIndex] ?? baselines[0];
  const report = snapshot ? generateReviewMarkdown(snapshot, displayedHistory, baseline) : null;
  useEffect(() => () => { controller.current?.abort(); controller.current = null; }, []);

  useLayoutEffect(() => {
    const link = downloadLink.current;
    if (!link || report === null) return;
    // Keep a native download target available until the report changes or unmounts.
    const url = URL.createObjectURL(new Blob([report], { type: 'text/markdown;charset=utf-8' }));
    link.href = url;
    return () => {
      link.removeAttribute('href');
      URL.revokeObjectURL(url);
    };
  }, [report]);

  async function inspect(event?: React.FormEvent, url = input) {
    event?.preventDefault();
    controller.current?.abort();
    const request = new AbortController();
    controller.current = request;
    setLoading(true);
    setError('');
    const timeout = window.setTimeout(() => request.abort(), 30_000);
    try {
      const evidence = await fetchPullRequestEvidence(url, request.signal);
      if (controller.current !== request) return;
      const next = [evidence, ...history].slice(0, 20);
      setSnapshot(evidence);
      setRecorded(false);
      setBaselineIndex(0);
      setHistory(next);
      setInput(evidence.pr.url);
      setTab('checks');
      setStorageError('');
      try { saveSnapshots(window.localStorage, next); }
      catch { setStorageError('Browser storage is unavailable. Download the report to keep this evidence.'); }
    } catch (cause) {
      if (controller.current !== request) return;
      setError(request.signal.aborted ? 'The request timed out. Try again.' : cause instanceof Error ? cause.message : 'Could not load GitHub evidence. Check your connection.');
    } finally {
      window.clearTimeout(timeout);
      if (controller.current === request) setLoading(false);
    }
  }

  function openRecordedCase() {
    controller.current?.abort();
    controller.current = null;
    setLoading(false);
    setError('');
    setSnapshot(recordedHistory[0]);
    setInput(recordedHistory[0].pr.url);
    setRecorded(true);
    setBaselineIndex(0);
    setTab('checks');
  }

  function returnToWorkspace() {
    controller.current?.abort();
    controller.current = null;
    setLoading(false);
    setError('');
    setRecorded(false);
    setSnapshot(history[0] ?? null);
    setInput(history[0]?.pr.url ?? '');
    setBaselineIndex(0);
    setTab('checks');
  }

  const relatedHistory = snapshot ? displayedHistory.filter(item => samePullRequest(item, snapshot)) : [];
  const verdict = snapshot ? testSpriteVerdict(snapshot) : 'missing';
  const counts = snapshot ? reviewCounts(snapshot) : null;
  const changes = snapshot && baseline ? compareEvidence(snapshot, baseline) : [];
  const visibleChanges = changes.filter(change => showUnchanged || !['unchanged', 'rerun'].includes(change.kind));

  function navigateTabs(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = evidenceTabs.indexOf(tab);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (index + (event.key === 'ArrowRight' ? 1 : 2)) % 3;
    setTab(evidenceTabs[next]);
    event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  }

  return <section className="pr-workspace" aria-label="Pull request evidence">
    <div className="pr-heading"><h2>Pull request review</h2><span className="privacy-label">Public repos · No token stored</span></div>
    <form className="pr-lookup" onSubmit={inspect}>
      <label htmlFor="pr-url">Pull request URL</label>
      <div className="lookup-row"><input id="pr-url" type="url" required disabled={loading} value={input} onChange={event => setInput(event.target.value)} placeholder="https://github.com/owner/repo/pull/123" autoComplete="off" spellCheck={false} />
        <button className="button primary" disabled={loading} type="submit">{loading ? <LoaderCircle className="loading-icon" size={17} /> : <Search size={17} />}{loading ? 'Loading evidence' : 'Inspect PR'}</button></div>
    </form>
    {error && <p className="evidence-error" role="alert"><TriangleAlert size={18} />{error}</p>}
    {storageError && <p className="evidence-error" role="alert">{storageError}</p>}
    <div aria-live="polite" className="sr-only">{loading ? 'Loading evidence from GitHub.' : snapshot ? `Evidence loaded. ${labels[verdict]}.` : ''}</div>
    {snapshot ? <>
      {recorded && <aside className="recorded-banner" aria-label="Recorded case">
        <div><strong>Recorded case · October 24</strong><p>{recordedDescription}</p></div>
        <button className="button secondary" onClick={returnToWorkspace}>Back to my workspace</button>
      </aside>}
      <section className="pr-overview" aria-label="Selected pull request">
        <div className="pr-title-row"><GitPullRequest size={22} /><div><EvidenceLink url={snapshot.pr.url}>{snapshot.pr.owner}/{snapshot.pr.repo} #{snapshot.pr.number}</EvidenceLink><h3>{snapshot.title}</h3></div><span className="status-pill">{snapshot.draft ? 'Draft' : snapshot.state}</span></div>
        <div className="pr-meta"><span><GitCommitHorizontal size={16} /><code>{snapshot.headSha.slice(0, 12)}</code></span><span>{snapshot.branch}</span><span>Retrieved: {new Date(snapshot.capturedAt).toLocaleString()}</span></div>
        <div className="evidence-summary"><Verdict value={verdict} /><p>{verdict === 'missing' ? (snapshot.comments.length ? 'Bot comment found; no commit-bound TestSprite check was returned.' : 'GitHub returned no TestSprite-labelled check for this commit.') : verdict === 'passed' ? 'TestSprite-labelled checks succeeded on the captured head commit.' : verdict === 'failed' ? 'At least one TestSprite-labelled check needs attention.' : verdict === 'pending' ? 'The captured check is still running or queued.' : 'Skipped, neutral, or unknown results do not establish a pass.'}</p></div>
        {counts && <div className="review-counts" aria-label="All check results"><span className="verdict-failed">{counts.failed} failed</span><span className="verdict-pending">{counts.pending} pending</span><span>{counts.unverified} unverified</span><span className="verdict-passed">{counts.passed} succeeded</span></div>}
        <p className="snapshot-note">Saved snapshot, not a live merge decision. Required checks and the deployment tested are not verified.</p>
      </section>
      {recorded && <section className="case-context" aria-label="Case findings">
        <h3>A green status did not mean every test passed</h3>
        <p>At <code>213172a</code>, the GitHub App reported success with 7 passed / 1 blocked. A separate strict replay read the downloaded file and passed 8/8. The replay did not fix or replace the blocked agent result.</p>
        <p>The comparison below records a separate fix: waiting for the agent run to finish prevented concurrent runs of the same tests from failing the strict workflow.</p>
        <div className="case-sources"><EvidenceLink url="https://github.com/JerryNee/LoopLedger/actions/runs/40145526729">Strict replay: 8/8</EvidenceLink><EvidenceLink url="https://www.testsprite.com/dashboard-v3/o/77167281-b0a3-5213-a18d-6af0a2168c02/projects/28ffbf1d-d12b-4c52-b3c8-51ec6407ebd8/execution/0b7d5d6c-8b61-4894-ac1c-3a4c62ffc9b0">Agent: 1 blocked</EvidenceLink></div>
      </section>}
      <div className="evidence-toolbar"><div className="segmented" role="tablist" aria-label="Evidence views" onKeyDown={navigateTabs}>{evidenceTabs.map(value => <button key={value} role="tab" tabIndex={tab === value ? 0 : -1} id={`tab-${value}`} aria-controls={`panel-${value}`} aria-selected={tab === value} className={tab === value ? 'active' : ''} onClick={() => setTab(value)}>{value === 'checks' ? `Checks (${snapshot.checks.length})` : value === 'history' ? `History (${relatedHistory.length})` : 'Report'}</button>)}</div>
        <div className="top-actions"><button className="icon-button" title="Refresh evidence" aria-label="Refresh evidence" disabled={loading || input.trim() !== snapshot.pr.url} onClick={() => void inspect()}><RefreshCw size={17} /></button><a ref={downloadLink} className="icon-button" title="Download evidence report" aria-label="Download evidence report" download={`PR-${snapshot.pr.number}-evidence.md`}><Download size={17} /></a></div></div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === 'checks' && <>
          <section className="review-diff" aria-label="Changes since baseline">
            <div className="diff-heading"><h3><GitCompareArrows size={18} />Changes since baseline</h3>{baseline && <label>Baseline<select aria-label="Comparison baseline" value={baselineIndex} onChange={event => setBaselineIndex(Number(event.target.value))}>{baselines.map((item, index) => <option value={index} key={`${item.capturedAt}-${index}`}>{item.headSha.slice(0, 7)} · {new Date(item.capturedAt).toLocaleString()}</option>)}</select></label>}</div>
            {baseline ? <>
              <div className="commit-comparison"><code>{baseline.headSha.slice(0, 12)}</code><ArrowRight size={16} /><code>{snapshot.headSha.slice(0, 12)}</code><span>{baseline.headSha === snapshot.headSha ? 'Same commit, later observation' : 'Different commits'}</span><EvidenceLink url={`https://github.com/${snapshot.pr.owner}/${snapshot.pr.repo}/compare/${baseline.headSha}...${snapshot.headSha}`}>Source diff</EvidenceLink></div>
              {visibleChanges.length > 0 ? <ul className="change-list">{visibleChanges.map(change => {
                const check = (change.after ?? change.before)!;
                return <li className={`change-${change.kind}`} key={change.key}><span className={`change-label change-${change.kind}`}>{changeLabels[change.kind]}</span><div><strong>{check.name}</strong><span>{check.source} · {change.before ? checkVerdict(change.before) : 'not observed'} → {change.after ? checkVerdict(change.after) : 'not returned'}</span></div><div className="change-sources">{change.before && <EvidenceLink url={change.before.url}>Before</EvidenceLink>}{change.after && <EvidenceLink url={change.after.url}>After</EvidenceLink>}</div></li>;
              })}</ul> : <p className="diff-empty">No changed outcomes between these observations.</p>}
              <label className="unchanged-toggle"><input type="checkbox" checked={showUnchanged} onChange={event => setShowUnchanged(event.target.checked)} />Include unchanged outcomes and new attempts ({changes.filter(change => ['unchanged', 'rerun'].includes(change.kind)).length})</label>
              {changes.some(change => change.kind === 'missing') && <p className="snapshot-note">Not returned means missing from this snapshot, not proven deleted or resolved.</p>}
            </> : <p className="diff-empty">No earlier observation of this PR in this workspace.</p>}
          </section>
          <h3 className="checks-heading">Checks on selected commit</h3>
          {snapshot.checks.length ? <div className="checks-list">{snapshot.checks.map(check => <article className="check-row" key={`${check.kind}-${check.source}-${check.id}`}><div><strong>{check.name}</strong><span>{check.source} · {check.kind === 'check' ? 'Check run' : 'Commit status'}</span></div><Verdict value={checkVerdict(check)} /><EvidenceLink url={check.url}>View result</EvidenceLink></article>)}</div> : <p className="empty-checks">No check runs or commit statuses were returned for this commit.</p>}
          {snapshot.comments.length > 0 && <div className="bot-comments"><h3>TestSprite bot comments</h3>{snapshot.comments.map(comment => <p key={comment.url}><EvidenceLink url={comment.url}>{comment.author}</EvidenceLink></p>)}</div>}
        </>}
        {tab === 'history' && <ol className="snapshot-history">{relatedHistory.map((item, index) => <li key={`${item.capturedAt}-${index}`}><History size={17} /><div><time>{new Date(item.capturedAt).toLocaleString()}</time><code>{item.headSha.slice(0, 12)}</code></div><Verdict value={testSpriteVerdict(item)} /><span>{item.headSha === snapshot.headSha ? 'Same commit' : 'Earlier observed commit'}</span></li>)}</ol>}
        {tab === 'report' && <pre className="export-preview">{report}</pre>}
      </div>
    </> : <section className="recorded-entry" aria-label="Recorded investigation"><div className="case-heading"><GitCompareArrows size={24} /><span>LoopLedger #1 · Real investigation</span></div><h3>One green badge. Two different outcomes.</h3><p>The agent could not verify a download. Its GitHub status was green anyway.</p><div className="case-timeline"><span>Agent: 7 passed / 1 blocked</span><ArrowRight size={18} /><span>Strict replay: 8/8 passed</span></div><div className="case-actions"><button className="button primary" onClick={openRecordedCase}>Open recorded case<ArrowRight size={16} /></button><button className="button secondary" disabled={loading} onClick={() => void inspect(undefined, 'https://github.com/JerryNee/LoopLedger/pull/1')}><RefreshCw size={16} />Inspect live PR</button></div><p className="snapshot-note">October 24 evidence · Sources linked · Recorded case does not alter your saved history.</p></section>}
    {snapshot && !recorded && <button className="case-switch" onClick={openRecordedCase}><GitCompareArrows size={16} />Open recorded investigation</button>}
    <footer className="evidence-footer"><span>Source: GitHub REST API</span><span>Check labels identify TestSprite results; publisher identity is not authenticated.</span></footer>
  </section>;
}
