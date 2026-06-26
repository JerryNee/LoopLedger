# LoopLedger

LoopLedger is an evidence workspace for agent-built projects that use TestSprite CLI loops. It helps a builder track requirements, CLI test runs, failures, fixes, reruns, and submission notes in one place, then export a judge-readable `LOOP.md`.

The project is designed for TestSprite Hackathon Season 3, where the important artifact is not only the final app, but the visible loop: plan, test, observe, fix, rerun, and document.

## What It Does

- Tracks requirements with owner, priority, status, and evidence links.
- Records TestSprite CLI runs with command, target URL, pass/fail counts, duration, and follow-up notes.
- Captures loop evidence as ledger entries across plan, test, failure, fix, rerun, and submit stages.
- Filters the ledger by lifecycle stage.
- Generates a structured `LOOP.md` preview that can be copied or downloaded.
- Stores work locally in the browser so the workspace survives refreshes.

## Why It Exists

Hackathon builders often have proof scattered across terminal output, commits, screenshots, issue notes, and memory. LoopLedger turns that scattered process into a compact record that is easier to inspect and easier to submit.

It is intentionally a product workspace rather than a marketing page. The first screen is the working surface.

## Local Development

```bash
npm install
npm run dev
```

Open the Vite URL printed in the terminal, usually:

```text
http://127.0.0.1:5173/
```

## Quality Checks

```bash
npm run lint
npm run build
```

## Deployment

The TestSprite CLI flow expects a live deployed app. A simple deployment path is:

1. Push this repository to GitHub.
2. Import it into Vercel, Netlify, or another static host.
3. Use the deployed URL as the `Live app URL` inside LoopLedger.
4. Run the TestSprite CLI against that deployed URL.
5. Record each run and export the final `LOOP.md`.

## Suggested TestSprite Loop

1. Define the core requirements in LoopLedger.
2. Deploy the current build.
3. Run the TestSprite CLI against the live URL.
4. Record the command, result summary, and affected requirements.
5. Fix the highest-impact issue.
6. Commit the fix with a clear message.
7. Redeploy, rerun, and record the result.
8. Export `LOOP.md` for the final submission.

## Current Status

This repository contains the MVP product shell, data model, local persistence, ledger workflow, CLI run tracking, and markdown export. The next major phase is to use the app during the actual hackathon loop and let the recorded evidence shape the final submission.
