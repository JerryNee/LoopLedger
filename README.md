# LoopLedger

LoopLedger turns TestSprite CLI runs into a judge-readable `LOOP.md`.

It is an evidence workspace for agent-built projects: a builder records requirements, TestSprite cloud runs, failures, fixes, reruns, and submission notes in one place, then exports the proof judges read first.

The project is designed for TestSprite Hackathon Season 3, where the important artifact is not only the final app, but the visible loop: plan, test, observe, fix, rerun, and document.

## 10-Second Explanation

If Codex or Claude Code builds the app, TestSprite is the checker. LoopLedger is the audit desk between them.

It answers the judging questions quickly:

- What did the agent try to build?
- What did TestSprite actually test against the live app?
- What broke or changed during the loop?
- Which fixes and reruns are backed by evidence?
- Is the final `LOOP.md` ready to submit?

## Current Submission Evidence

- Live app: <https://jerrynee.github.io/LoopLedger/>
- Repository: <https://github.com/JerryNee/LoopLedger>
- Loop artifact: [`LOOP.md`](./LOOP.md)
- TestSprite cloud suite: 4/4 runs passed against the deployed app.
- CI/CD: lint/build, GitHub Pages deploy, and TestSprite checker workflows are active. TestSprite Checker run `28557891464` reran the saved cloud suite from GitHub Actions and passed 4/4.
- Demo script: [`docs/demo-script.md`](./docs/demo-script.md)

## What It Does

- Tracks requirements with owner, priority, status, and evidence links.
- Records TestSprite CLI runs with command, target URL, pass/fail counts, duration, and follow-up notes.
- Captures loop evidence as ledger entries across plan, test, failure, fix, rerun, and decision stages.
- Filters the ledger by lifecycle stage.
- Generates a structured `LOOP.md` preview with readiness checks and one-line agent loop iterations.
- Shows a final submission checklist for the live URL, public repo, CLI command, run evidence, failure/fix loop, export, and CI/CD bonus.
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

To rerun the saved TestSprite cloud checker locally:

```bash
npx --yes @testsprite/testsprite-cli@latest test rerun --all --project 9a0f2053-4ee8-409d-bc24-9b339f6e7593 --wait --timeout 900 --max-concurrency 2 --output json
```

## Deployment

The TestSprite CLI flow expects a live deployed app. This repository includes a GitHub Pages workflow:

1. Push this repository to GitHub.
2. Make the repository public for hackathon judging.
3. Enable GitHub Pages with GitHub Actions as the source if it is not already enabled.
4. Use `https://jerrynee.github.io/LoopLedger/` as the `Live app URL` inside LoopLedger.
5. Run the TestSprite CLI against that deployed URL.
6. Record each run and export the final `LOOP.md`.

## CI/CD Checker

The optional hackathon CI/CD bonus is supported by `.github/workflows/testsprite.yml`.

The workflow runs after the GitHub Pages deployment workflow succeeds. With the repository `TESTSPRITE_API_KEY` secret configured, it configures the CLI and reruns the saved TestSprite project checks. If any rerun fails, the workflow fails.

Verified CI checker evidence:

- GitHub Actions run: `28557891464`
- Result artifact: `testsprite-result`
- Summary: 4 passed, 0 failed, 0 deferred, total 4

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

This repository contains the product shell, data model, local persistence, readiness checklist, ledger workflow, CLI run tracking, markdown export, committed `LOOP.md`, TestSprite cloud run evidence, GitHub Pages deployment, and a TestSprite checker workflow for CI/CD reruns.
