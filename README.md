# LoopLedger

LoopLedger is a public pull-request evidence workspace. Inspect checks on a PR's exact head commit, save local snapshots, and export a reviewable Markdown report.

## Season 4

- [Live Season 4 app](https://loopledger-s4-git-feat-season4-b35ea5-jerrys-projects-82705168.vercel.app)
- [Implementation and submission PR](https://github.com/JerryNee/LoopLedger/pull/1)

This existing Season 3 project is being extended for TestSprite Hackathon Season 4. The PR workspace is now the default screen; the earlier ledger, CLI runs, and `LOOP.md` editor remain available as historical/manual records.

**Verification update (October 24):** the live link above is the tested feature-branch deployment, not the older production alias. A strict cloud replay passed all eight cases, including reading the actual downloaded Markdown after both pointer and keyboard activation. The GitHub App's agent path still reports the download as blocked; these are distinct execution paths. See [suite coverage](docs/season4-test-coverage.md) for the assertions and [PR #1](https://github.com/JerryNee/LoopLedger/pull/1) for the latest commit-specific results.

The new [strict replay workflow](.github/workflows/testsprite-s4.yml) waits for the current commit's Vercel deployment and existing GitHub App run to finish, checks the reviewed test code, disables auto-heal, and requires exactly eight successful run receipts. The App's terminal status is only a scheduling signal, never accepted as passing evidence. Blocked, missing, duplicate, timed-out, or wrong-project results fail the strict check. It also rejects a branch that moves during testing. Its first completed strict GitHub replay is pending at the time of this commit; local lint, build, and all 48 tests pass. This does not enable required-check branch protection or fix the platform's separate AI-agent behavior.

**Status (October 19):** pushing `19eed17` deployed the feature branch and automatically ran [eight TestSprite tests](https://www.testsprite.com/dashboard-v3/o/77167281-b0a3-5213-a18d-6af0a2168c02/projects/28ffbf1d-d12b-4c52-b3c8-51ec6407ebd8/execution/954c0a2b-6960-447e-a3bb-cabd334721e5): **7 passed, 0 failed, 1 blocked**. The automatic agent still cannot verify the Markdown download. A separate strict cloud replay [passed actual-file, filename, and complete-content checks](https://www.testsprite.com/dashboard-v3/o/77167281-b0a3-5213-a18d-6af0a2168c02/projects/28ffbf1d-d12b-4c52-b3c8-51ec6407ebd8/execution/df8fd22b-2f0b-4d69-8941-95df68c09716) against the same application code. These are distinct results, not 8/8 automatically passed.

The download is a native link, backed by six DOM regressions. An earlier run visited the old production site despite preview-target metadata; all four reviewed replay scripts now explicitly target the approved branch hostname. The remaining automatic-agent behavior needs platform investigation. The original GitHub App status reports SUCCESS even with a blocked test; this is not an all-pass result or a verified merge gate. Its active rule covers only `feat/season4-pr-evidence` and is retained; strict replay follows it rather than racing it. See [the execution record](docs/season4.md) and [coverage and replay instructions](docs/season4-test-coverage.md).

### PR Evidence

- Retrieves public GitHub check runs and commit statuses for the observed head SHA.
- Keeps the newest attempt per check name and publisher, including pending reruns.
- Separates missing, pending, failed, passed, and unverified results. Skipped and neutral do not count as passes.
- Links TestSprite bot comments without interpreting them as a passing check.
- Re-reads the PR head before saving, rejecting evidence collected during a new push.
- Saves up to 20 snapshots in this browser and exports Markdown with source links.

No GitHub token, account, or backend is required. Requests go directly to GitHub's public REST API. Unauthenticated rate limits apply; failed requests leave the previous snapshot intact. Private repositories are unsupported.

### Evidence Limits

This is an inspection aid, not a merge gate. TestSprite results are recognized by check/app labels, not authenticated publisher identity. Branch protection, required checks, deployment identity, and test coverage require separate verification. Local history is editable and not a signed audit log. A saved pass does not establish that the PR still passes now.

### AI Disclosure

Code, tests, and documentation were developed with OpenAI Codex assistance. Reported outcomes are observed executions, not generated demonstrations. No failures were planted to create a hackathon narrative.

## Season 3 Archive

**Everything below describes the earlier version. The July 2026 results do not verify the Season 4 interface or establish the new GitHub App integration.**

## 10-Second Explanation

If Codex or Claude Code builds the app, TestSprite is the checker. LoopLedger is the audit desk between them.

It answers the judging questions quickly:

- What did the agent try to build?
- What did TestSprite actually test against the live app?
- What broke or changed during the loop?
- Which fixes and reruns are backed by evidence?
- Is the final `LOOP.md` ready to submit?

## Historical Submission Evidence

- Live app: <https://jerrynee.github.io/LoopLedger/>
- Repository: <https://github.com/JerryNee/LoopLedger>
- Loop artifact: [`LOOP.md`](./LOOP.md)
- TestSprite cloud suite: 4/4 runs passed against the deployed app.
- Historical CI/CD: TestSprite Checker run `28557891464` reran the saved S3 cloud suite from GitHub Actions and passed 4/4. The old checker is now manual-only to keep it separate from S4 testing.
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
npm test
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

During S3, the workflow ran after a successful GitHub Pages deployment. It is now named `Historical Season 3 Checker` and runs only on manual dispatch. It is not the S4 GitHub App integration. With the repository `TESTSPRITE_API_KEY` secret configured, it configures the CLI and reruns the old S3 suite. If any rerun fails, the workflow fails.

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

## Historical Status

This repository contains the product shell, data model, local persistence, readiness checklist, ledger workflow, CLI run tracking, markdown export, committed `LOOP.md`, TestSprite cloud run evidence, GitHub Pages deployment, and a TestSprite checker workflow for CI/CD reruns.
