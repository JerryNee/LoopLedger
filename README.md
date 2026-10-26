# LoopLedger

**What changed since the last review, and does the evidence support a pass?**

LoopLedger compares public pull-request checks across commits and reruns. It highlights new failures, actual recoveries, pending retries, and checks that stopped appearing, then exports the observations with source links.

[Open the Season 4 app](https://loopledger-s4-git-feat-season4-b35ea5-jerrys-projects-82705168.vercel.app) | [Implementation PR](https://github.com/JerryNee/LoopLedger/pull/1) | [Test coverage](docs/season4-test-coverage.md)

## Try the Real Investigation

1. Open **Recorded case**. No account, token, API request, or installation is needed.
2. Compare `babd5af` with `213172a`: the strict workflow recovered after its scheduling conflict was fixed. Open **Before**, **After**, and **Source diff**.
3. Read the separate finding: the GitHub App reported green with **7 passed / 1 blocked**; an independent strict replay read the downloaded file and passed **8/8**. These are different executions, not a repaired agent result.
4. Download the report with both full commit SHAs and before/after source URLs.
5. Return to your workspace and inspect a public PR. Refresh after a push or rerun to compare your own observations.

The case is real historical GitHub data retrieved on October 26, not a current PR-head snapshot or an invented failure. It never changes personal history. [Capture source](scripts/capture-review-case.mjs) and [recorded data](src/recordedCase.json).

## Review Without Stale Green Checks

- Capture checks for the observed PR head; re-read the head before saving to reject a concurrent push.
- Keep the latest attempt per check name, publisher, and kind. Pending retries supersede older passes.
- Compare earlier observations of the same PR, including reruns on one commit.
- Separate failed-to-passed recovery from missing, skipped, neutral, and pending results. Missing does not mean fixed.
- Show failures across all checks, not only TestSprite-labelled checks.
- Retain up to 20 browser-local observations. Failed requests preserve previous evidence.
- Export the selected baseline, complete SHAs, outcome changes, and source URLs.

Requests go directly to GitHub's public REST API. No token or backend is required. Private repositories are unsupported; unauthenticated rate limits apply.

## Verified Evidence

The October 26 comparison feature has **67 passing local tests**, plus lint and production build checks. Its deployed nine-case cloud replay is pending in this commit. Use the [PR checks](https://github.com/JerryNee/LoopLedger/pull/1/checks) for the latest result; an older pass does not verify newer code.

The earlier `213172a` implementation has these results:

| Evidence | Observed result |
| --- | --- |
| [Strict cloud workflow](https://github.com/JerryNee/LoopLedger/actions/runs/40145526729) | 8/8 passed, auto-heal disabled |
| [Local CI](https://github.com/JerryNee/LoopLedger/actions/runs/40145529916) | 48 tests, lint and build passed at that commit |
| [GitHub App execution](https://www.testsprite.com/dashboard-v3/o/77167281-b0a3-5213-a18d-6af0a2168c02/projects/28ffbf1d-d12b-4c52-b3c8-51ec6407ebd8/execution/0b7d5d6c-8b61-4894-ac1c-3a4c62ffc9b0) | 7 passed / 1 blocked despite green GitHub status |

The [strict workflow](.github/workflows/testsprite-s4.yml) waits for this commit's Vercel deployment and GitHub App run, verifies reviewed scripts, disables auto-heal, and requires exactly the successful receipts in the [nine-case manifest](.testsprite/s4-suite.json). Blocked, missing, duplicate, wrong-project, or timed-out results fail it. A moving branch is rejected before and after replay. App status is a scheduling signal, not passing evidence.

## Scope and Honesty

This is an inspection aid, **not a merge gate**. TestSprite recognition uses check/app labels, not authenticated publisher identity. It does not verify branch protection, required checks, arbitrary deployment identity, or complete test coverage. Local history is editable, not a signed audit log.

Automation currently covers only `feat/season4-pr-evidence`. The live URL above is its deployment; the older GitHub Pages site and Vercel production alias are not the Season 4 entry.

The blocked-download finding is a curated, source-linked investigation, not automated parsing of private TestSprite reports. [Execution history](docs/season4.md) retains the failures and fixes.

## Development

```bash
npm ci
npm run dev
npm run lint
npm test
npm run build
```

[Cloud scripts and replay instructions](docs/season4-test-coverage.md) target the public deployed app, not localhost.

## Provenance and AI Disclosure

This extends the Season 3 project; it is not a from-scratch claim. PR inspection, comparison, the recorded investigation, and commit-specific test automation are Season 4 additions. The older Ledger, CLI runs, and LOOP.md views remain manual/historical tools. [Season 3 archive](docs/season3.md).

Code, tests, and documentation were developed with OpenAI Codex assistance. Outcomes are observed executions, not generated demonstrations. No failures were planted for the hackathon narrative.
