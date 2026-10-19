// @vitest-environment jsdom
import { act, StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PullRequestsView from './PullRequestsView';
import { fetchPullRequestEvidence, generateEvidenceMarkdown, parsePullRequestUrl, saveSnapshots, type EvidenceSnapshot } from './prEvidence';

vi.mock('./prEvidence', async importOriginal => ({
  ...await importOriginal<typeof import('./prEvidence')>(),
  fetchPullRequestEvidence: vi.fn(),
}));

const snapshot: EvidenceSnapshot = {
  pr: parsePullRequestUrl('https://github.com/TestSprite/testsprite-cli/pull/218'),
  title: 'Download evidence', headSha: 'a'.repeat(40), branch: 'feature',
  state: 'merged', draft: false, capturedAt: '2026-10-19T18:00:00.000Z',
  checks: [], comments: [],
};

let container: HTMLDivElement;
let root: Root;
const blobs: Blob[] = [];
const createObjectURL = vi.fn((blob: Blob) => {
  blobs.push(blob);
  return `blob:http://localhost/report-${blobs.length}`;
});
const revokeObjectURL = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  blobs.length = 0;
  window.localStorage.clear();
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.stubGlobal('URL', class extends URL {
    static createObjectURL = createObjectURL;
    static revokeObjectURL = revokeObjectURL;
  });
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

async function render(history: EvidenceSnapshot[] = [snapshot], strict = false) {
  saveSnapshots(window.localStorage, history);
  await act(async () => root.render(strict ? <StrictMode><PullRequestsView /></StrictMode> : <PullRequestsView />));
}

function download() {
  const link = container.querySelector<HTMLAnchorElement>('a[download]');
  expect(link).not.toBeNull();
  return link!;
}

async function blobText(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(blob);
  });
}

describe('native PR report download', () => {
  it('offers no download before evidence has been captured', async () => {
    await render([]);
    expect(container.querySelector('a[download]')).toBeNull();
    expect(createObjectURL).not.toHaveBeenCalled();
  });

  it('prepares a named, focusable download with the same bytes as the report', async () => {
    await render();
    const link = download();
    expect(link.download).toBe('PR-218-evidence.md');
    expect(link.getAttribute('aria-label')).toBe('Download evidence report');
    expect(link.href).toBe('blob:http://localhost/report-1');
    link.focus();
    expect(document.activeElement).toBe(link);
    await act(async () => container.querySelector<HTMLButtonElement>('#tab-report')!.click());
    expect(blobs[0].type).toBe('text/markdown;charset=utf-8');
    expect(await blobText(blobs[0])).toBe(container.querySelector('pre')!.textContent);
    expect(await blobText(blobs[0])).toBe(generateEvidenceMarkdown(snapshot, [snapshot]));
    expect(revokeObjectURL).not.toHaveBeenCalled();
  });

  it('does not replace the download URL when switching tabs', async () => {
    await render();
    const href = download().href;
    for (const tab of ['report', 'history', 'checks']) {
      await act(async () => container.querySelector<HTMLButtonElement>(`#tab-${tab}`)!.click());
      expect(download().href).toBe(href);
    }
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).not.toHaveBeenCalled();
  });

  it('replaces the content and releases the old URL after a successful refresh', async () => {
    await render();
    const next = { ...snapshot, headSha: 'b'.repeat(40), capturedAt: '2026-10-19T18:01:00.000Z' };
    vi.mocked(fetchPullRequestEvidence).mockResolvedValueOnce(next);
    await act(async () => container.querySelector<HTMLButtonElement>('[aria-label="Refresh evidence"]')!.click());
    expect(download().href).toBe('blob:http://localhost/report-2');
    expect(revokeObjectURL).toHaveBeenCalledExactlyOnceWith('blob:http://localhost/report-1');
    expect(await blobText(blobs[1])).toBe(generateEvidenceMarkdown(next, [next, snapshot]));
  });

  it('keeps the previous download intact when refreshing fails', async () => {
    await render();
    const href = download().href;
    vi.mocked(fetchPullRequestEvidence).mockRejectedValueOnce(new Error('Network unavailable'));
    await act(async () => container.querySelector<HTMLButtonElement>('[aria-label="Refresh evidence"]')!.click());
    expect(container.querySelector('[role="alert"]')!.textContent).toContain('Network unavailable');
    expect(download().href).toBe(href);
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).not.toHaveBeenCalled();
  });

  it('releases every URL on unmount, including StrictMode setup/cleanup', async () => {
    await render([snapshot], true);
    const urls = createObjectURL.mock.results.map(result => result.value);
    expect(urls).toHaveLength(2);
    await act(async () => root.render(null));
    expect(revokeObjectURL.mock.calls.map(([url]) => url)).toEqual(urls);
  });
});
