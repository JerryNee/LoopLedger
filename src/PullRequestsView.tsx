import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Clock3, Download, ExternalLink, GitCommitHorizontal, GitPullRequest, History, LoaderCircle, RefreshCw, Search, ShieldQuestion, TriangleAlert } from 'lucide-react';
import { checkVerdict, fetchPullRequestEvidence, generateEvidenceMarkdown, readSnapshots, safeHttpsUrl, saveSnapshots, testSpriteVerdict, type EvidenceSnapshot, type EvidenceVerdict } from './prEvidence';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [storageError, setStorageError] = useState('');
  const [tab, setTab] = useState<'checks' | 'history' | 'report'>('checks');
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => { controller.current?.abort(); controller.current = null; }, []);

  async function inspect(event?: React.FormEvent) {
    event?.preventDefault();
    controller.current?.abort();
    const request = new AbortController();
    controller.current = request;
    setLoading(true);
    setError('');
    const timeout = window.setTimeout(() => request.abort(), 30_000);
    try {
      const evidence = await fetchPullRequestEvidence(input, request.signal);
      if (controller.current !== request) return;
      const next = [evidence, ...history].slice(0, 20);
      setSnapshot(evidence);
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

  function download() {
    if (!snapshot) return;
    const blob = new Blob([generateEvidenceMarkdown(snapshot, history)], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `PR-${snapshot.pr.number}-evidence.md`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const relatedHistory = history.filter(item => item.pr.url === snapshot?.pr.url);
  const verdict = snapshot ? testSpriteVerdict(snapshot) : 'missing';
  const otherFailures = snapshot?.checks.filter(check => !check.testSprite && checkVerdict(check) === 'failed') ?? [];

  function navigateTabs(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = evidenceTabs.indexOf(tab);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (index + (event.key === 'ArrowRight' ? 1 : 2)) % 3;
    setTab(evidenceTabs[next]);
    event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  }

  return <section className="pr-workspace" aria-label="Pull request evidence">
    <div className="pr-heading"><div><p className="section-label">GitHub evidence</p><h2>Pull requests</h2></div><span className="privacy-label">Public repos · No token stored</span></div>
    <form className="pr-lookup" onSubmit={inspect}>
      <label htmlFor="pr-url">Pull request URL</label>
      <div className="lookup-row"><input id="pr-url" type="url" required disabled={loading} value={input} onChange={event => setInput(event.target.value)} placeholder="https://github.com/owner/repo/pull/123" autoComplete="off" spellCheck={false} />
        <button className="button primary" disabled={loading} type="submit">{loading ? <LoaderCircle className="loading-icon" size={17} /> : <Search size={17} />}{loading ? 'Loading evidence' : 'Inspect PR'}</button></div>
    </form>
    {error && <p className="evidence-error" role="alert"><TriangleAlert size={18} />{error}</p>}
    {storageError && <p className="evidence-error" role="alert">{storageError}</p>}
    <div aria-live="polite" className="sr-only">{loading ? 'Loading evidence from GitHub.' : snapshot ? `Evidence loaded. ${labels[verdict]}.` : ''}</div>
    {snapshot ? <>
      <section className="pr-overview" aria-label="Selected pull request">
        <div className="pr-title-row"><GitPullRequest size={22} /><div><EvidenceLink url={snapshot.pr.url}>{snapshot.pr.owner}/{snapshot.pr.repo} #{snapshot.pr.number}</EvidenceLink><h3>{snapshot.title}</h3></div><span className="status-pill">{snapshot.draft ? 'Draft' : snapshot.state}</span></div>
        <div className="pr-meta"><span><GitCommitHorizontal size={16} /><code>{snapshot.headSha.slice(0, 12)}</code></span><span>{snapshot.branch}</span><span>Snapshot: {new Date(snapshot.capturedAt).toLocaleString()}</span></div>
        <div className="evidence-summary"><Verdict value={verdict} /><p>{verdict === 'missing' ? (snapshot.comments.length ? 'Bot comment found; no commit-bound TestSprite check was returned.' : 'GitHub returned no TestSprite-labelled check for this commit.') : verdict === 'passed' ? 'TestSprite-labelled checks succeeded on the captured head commit.' : verdict === 'failed' ? 'At least one TestSprite-labelled check needs attention.' : verdict === 'pending' ? 'The captured check is still running or queued.' : 'Skipped, neutral, or unknown results do not establish a pass.'}</p></div>
        {otherFailures.length > 0 && <p className="evidence-error"><TriangleAlert size={16} />{otherFailures.length} other check{otherFailures.length === 1 ? '' : 's'} failed.</p>}
        <p className="snapshot-note">Saved snapshot, not a live merge decision. Required checks and the deployment tested are not verified.</p>
      </section>
      <div className="evidence-toolbar"><div className="segmented" role="tablist" aria-label="Evidence views" onKeyDown={navigateTabs}>{evidenceTabs.map(value => <button key={value} role="tab" tabIndex={tab === value ? 0 : -1} id={`tab-${value}`} aria-controls={`panel-${value}`} aria-selected={tab === value} className={tab === value ? 'active' : ''} onClick={() => setTab(value)}>{value === 'checks' ? `Checks (${snapshot.checks.length})` : value === 'history' ? `History (${relatedHistory.length})` : 'Report'}</button>)}</div>
        <div className="top-actions"><button className="icon-button" title="Refresh evidence" aria-label="Refresh evidence" disabled={loading || input.trim() !== snapshot.pr.url} onClick={() => void inspect()}><RefreshCw size={17} /></button><button className="icon-button" title="Download evidence report" aria-label="Download evidence report" onClick={download}><Download size={17} /></button></div></div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === 'checks' && <>
          {snapshot.checks.length ? <div className="checks-list">{snapshot.checks.map(check => <article className="check-row" key={`${check.kind}-${check.source}-${check.id}`}><div><strong>{check.name}</strong><span>{check.source} · {check.kind === 'check' ? 'Check run' : 'Commit status'}</span></div><Verdict value={checkVerdict(check)} /><EvidenceLink url={check.url}>View result</EvidenceLink></article>)}</div> : <p className="empty-checks">No check runs or commit statuses were returned for this commit.</p>}
          {snapshot.comments.length > 0 && <div className="bot-comments"><h3>TestSprite bot comments</h3>{snapshot.comments.map(comment => <p key={comment.url}><EvidenceLink url={comment.url}>{comment.author}</EvidenceLink></p>)}</div>}
        </>}
        {tab === 'history' && <ol className="snapshot-history">{relatedHistory.map((item, index) => <li key={`${item.capturedAt}-${index}`}><History size={17} /><div><time>{new Date(item.capturedAt).toLocaleString()}</time><code>{item.headSha.slice(0, 12)}</code></div><Verdict value={testSpriteVerdict(item)} /><span>{item.headSha === snapshot.headSha ? 'Same commit' : 'Earlier observed commit'}</span></li>)}</ol>}
        {tab === 'report' && <pre className="export-preview">{generateEvidenceMarkdown(snapshot, history)}</pre>}
      </div>
    </> : <div className="pr-empty"><GitPullRequest size={36} strokeWidth={1.3} /><h3>No pull request selected</h3><p>No GitHub evidence has been captured.</p></div>}
    <footer className="evidence-footer"><span>Source: GitHub REST API</span><span>Check labels identify TestSprite results; publisher identity is not authenticated.</span></footer>
  </section>;
}
