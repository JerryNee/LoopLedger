# Season 4 Work Log

## Scope

Started October 16, 2026 (America/Chicago), on `feat/season4-pr-evidence`. Existing Season 3 ledger data is historical; the new default view reads public GitHub evidence bound to the observed head SHA.

## Verified Locally

- `npm test`: 29 passing unit tests.
- `npm run lint` and `npm run build`: passed.
- `npm audit`: zero reported vulnerabilities after updating test/tooling dependencies.
- Browser inspection at desktop and 390px mobile widths: real TestSprite CLI PR #218 loaded 13 checks, correctly reporting no TestSprite-labelled check rather than treating unrelated green CI as proof.
- Checks, history, and report views operate; arrow-key navigation changes selected tabs.

These are local checks, not hosted TestSprite results.

## Deployment and PR

- Live app: https://loopledger-s4.vercel.app
- Deployment ID used by the cloud suite: `dpl_BGi6EHkn7z5doxKC2a5zGQ6BWR2t`.
- Deployed source: `ff3ecb23e833b5f5344e329704b3c73a0d9089d3` (same application code as `2dd85e2f15b73d810a34a02c5cd05bae129d56ee`).
- PR: https://github.com/JerryNee/LoopLedger/pull/1 (draft).
- GitHub CI for that source: https://github.com/JerryNee/LoopLedger/actions/runs/38998790007 passed lint, 29 tests, and build.
- Unauthenticated HTTP access returned 200. Browser verification on the deployed app fetched PR #1, displayed its exact source SHA and passing ordinary CI, and correctly displayed `No TestSprite check`.
- Vercel CLI deployment succeeded; automatic GitHub repository connection did not. Do not assume preview deployments exist. Connect the repository with appropriate user authorization before configuring an automated deployment-backed TestSprite trigger.
- Follow-up documentation commits do not alter the deployed JavaScript/CSS. Redeploy the final PR head before attaching commit-specific cloud evidence.

## Hosted Verification: October 17 UTC / October 16 Chicago

Project `28ffbf1d-d12b-4c52-b3c8-51ec6407ebd8`, environment `default` (`47518934-283b-4e2c-9777-3c9825e36825`), target https://loopledger-s4.vercel.app.

The [initial portal execution](https://www.testsprite.com/dashboard-v3/o/jerry-nis-workspace-77167281/projects/28ffbf1d-d12b-4c52-b3c8-51ec6407ebd8/execution/4dbad6b4-cb50-47e9-9186-353464dafad1) ended with **5 passed, 1 failed, and 2 deliberately cancelled**. The cancelled agents repeatedly clicked Checks or reloaded without completing their intended assertions. Cancellation returned no downloadable artifact bundles; their step histories were inspected before cancellation.

Four saved replay scripts were authored/repaired in `.testsprite/tests/`:

- Invalid URL: strict replay `d49cebda-31b6-4533-a2f1-1e10dbcf5299` failed because the generated selector looked for alert text inside an SVG. Its video showed the actual alert and retained snapshot. Use the alert role and compare the whole selected-PR section before/after, including timestamp.
- Download: initial run `85d337c0-3133-427a-864f-c5e53b1dc3f2` failed. The exported script had no actual download click and searched the DOM for a filename. The corrected test observes the download event and reads the downloaded file, comparing it to the displayed report.
- Keyboard: explicitly press each key and assert focus, selected tab, and active panel after each transition.
- Persistence: explicitly assert exactly two snapshots, then compare overview/history/report before and after reload.

The first hand-edited invalid-URL script also failed in run `047627f8-f664-4f5b-b6e3-6cb44f1e1fd3` with `TargetClosedError`. Restoring the browser launch flags from TestSprite's generated runtime fixed that replay. Failure artifacts are local under ignored `.testsprite/runs/`; they are not committed because bundles contain signed URLs.

**No application code changed during this test-hardening pass. These are test-generation/runtime corrections, not a claimed product bug fix.**

All eight cases subsequently passed strict cloud replay using CLI `0.14.0` and `test rerun --no-auto-heal --wait`, across three batches:

| Case | Passing run ID | Execution |
| --- | --- | --- |
| Manual ledger | `12ad4dc8-f404-49c2-a472-77da06dd5da2` | [Run](https://www.testsprite.com/dashboard-v3/o/77167281-b0a3-5213-a18d-6af0a2168c02/projects/28ffbf1d-d12b-4c52-b3c8-51ec6407ebd8/execution/04d7754c-875f-4440-a6ef-7fc3437e081e) |
| Manual CLI record | `4679a19b-dc90-4f38-b452-e436a009207c` | [Run](https://www.testsprite.com/dashboard-v3/o/77167281-b0a3-5213-a18d-6af0a2168c02/projects/28ffbf1d-d12b-4c52-b3c8-51ec6407ebd8/execution/a54fdca5-b14f-4815-9f5b-85fe276a106e) |
| Public PR fixture | `44be4742-58e5-49a2-9a56-549b2e67ef1d` | [Run](https://www.testsprite.com/dashboard-v3/o/77167281-b0a3-5213-a18d-6af0a2168c02/projects/28ffbf1d-d12b-4c52-b3c8-51ec6407ebd8/execution/6d1aa1a3-5105-425d-8d96-f2cf8cf30502) |
| Fresh state/navigation | `e5c4c0b6-1a2c-4183-a2f3-653da293cacf` | [Run](https://www.testsprite.com/dashboard-v3/o/77167281-b0a3-5213-a18d-6af0a2168c02/projects/28ffbf1d-d12b-4c52-b3c8-51ec6407ebd8/execution/51deca61-8cd9-4cb4-8c6e-554b34e91d32) |
| Invalid URL | `7fd16a45-9cc4-44e2-85b0-08438619edc5` | [Run](https://www.testsprite.com/dashboard-v3/o/77167281-b0a3-5213-a18d-6af0a2168c02/projects/28ffbf1d-d12b-4c52-b3c8-51ec6407ebd8/execution/3b904384-4b0d-4064-871d-58e79aa8021d) |
| Markdown download | `f979541c-acda-4954-80d8-0d90693ad4b8` | [Run](https://www.testsprite.com/dashboard-v3/o/77167281-b0a3-5213-a18d-6af0a2168c02/projects/28ffbf1d-d12b-4c52-b3c8-51ec6407ebd8/execution/5a9407bb-053c-4a53-9d10-26c03a3e1c6e) |
| Persistence | `b27acea2-e6c8-4951-b091-5de26eede7f2` | [Run](https://www.testsprite.com/dashboard-v3/o/77167281-b0a3-5213-a18d-6af0a2168c02/projects/28ffbf1d-d12b-4c52-b3c8-51ec6407ebd8/execution/32798b22-7b9c-4c46-9379-c51230556b8f) |
| Keyboard tabs | `7879ba3c-3531-4970-a934-7cf2c384b544` | [Run](https://www.testsprite.com/dashboard-v3/o/77167281-b0a3-5213-a18d-6af0a2168c02/projects/28ffbf1d-d12b-4c52-b3c8-51ec6407ebd8/execution/e10e5c45-9a1d-4555-b728-3fcc15c46534) |

This is manual cloud verification, **not** a GitHub-triggered suite or a passing TestSprite PR check. The portal/CLI account is the user's original Gmail account; 136 free credits remained at the last check. No plan purchase or paid upgrade was made.

## Remaining Integration Work

1. Git preview deployment is working: commit `3747a8c21d55ee05ecf2cb6deda669c302cf1229` produced `dpl_HqJ18ik6Uz3LcGhLGQV2vBRF6LLz` automatically. Its build log confirms the feature branch and commit, and GitHub CI plus the `Vercel` status passed. [Vercel bot comment](https://github.com/JerryNee/LoopLedger/pull/1#issuecomment-6230091756). The preview still requires Vercel login; unauthenticated access returned HTTP 302.
2. Account confirmed: browser and CLI now use the same original Gmail account. A separate portal-created `LoopLedger S4` project (`28ffbf1d-d12b-4c52-b3c8-51ec6407ebd8`) preserves the old Season 3 suite unchanged. Local configuration now points to S4; the historical checker is manual-only.
3. Completed October 17: after explicit user confirmation, TestSprite's GitHub App was installed for `JerryNee/LoopLedger` only. The portal confirmed connection to JerryNee. The existing Vercel GitHub App retained its three prior repositories and added LoopLedger; `vercel git connect` then succeeded.
4. Portal suite generation and strict cloud replays are complete for the deployed source above. Preserve the reviewed scripts; a fresh AI generation may replace them.
5. Configure a deployment-backed trigger only after preview access is approved and verified. The prepared rule watches `JerryNee/LoopLedger`, branch `feat/season4-pr-evidence`, and the `Vercel` commit status. It is not saved. Use this exact branch scope: Vercel truncated/hashed the long branch name in its alias, so a generic `{branch-slug}` URL pattern would be incorrect. A branch-scoped trigger can publish the real test check on the same head commit shown in PR #1.
6. Observe a real TestSprite bot check/comment on the project PR, fix any genuine failures, and rerun.
7. Record run IDs, URLs, failures/fixes (if any), and final status here before submission.
8. Submit the PR link, live URL, and TestSprite account email/name in Discord `#hackathon-submissions` according to the current S4 page. Do not reuse the S3 form instructions. No entry has been submitted yet.

Official references:
- https://www.testsprite.com/zh/hackathon-s4
- https://docs.testsprite.com/web-portal/integrations/github-integration

Project deadline advertised: October 22, 2026, 23:59 PT (October 23, 01:59 Chicago). CLI contribution window ends October 29. Verify announcements before final submission.

## Handoff Rules

The first S4 portal suite contains eight reviewed cases; see [coverage and fixture details](season4-test-coverage.md). The two repository authorizations have been saved and verified. The next step is a real Git-triggered preview deployment, followed by a deployment-backed TestSprite trigger.

Saved scopes: TestSprite only `JerryNee/LoopLedger`; Vercel adds only `LoopLedger` while retaining `JerryNee.github.io`, `Immersive_Intelligence`, and `the-room`. Vercel's separate permission-upgrade request was not accepted. Preview authentication is currently enabled (Standard Protection); changing public preview access requires separate user confirmation. Prefer a specific preview-domain exception over disabling project-wide protection.

Pending user decision: make only `loopledger-s4-git-feat-season4-b35ea5-jerrys-projects-82705168.vercel.app` public. Vercel's Remove Protection confirmation dialog is prepared but has NOT been submitted. The requested exception affects that domain's present and future deployments, not every project/preview. Do not submit until the user explicitly approves this additional access change.

TestSprite Free permits one environment. Creating `s4-pr-1` was refused with `FEATURE_GATED`; no extra environment or paid plan was created. After preview access approval, update the existing S4 `default` environment URL to the branch preview (preserving its ID and old run history), then select it for the prepared branch trigger. Do not select the current production URL by mistake. Enable a merge gate after validating an actual successful trigger run; until then a non-blocking TestSprite check is not proof of a pass. TestSprite installation ID: `172295278`; Vercel installation ID: `71790721`.

Never reuse the four Season 3 passes as Season 4 evidence. Never claim GitHub App configuration is complete merely because the old CLI workflow exists. Do not commit API keys, `.env*`, or credential files. Keep source commits, deployment URLs, and test run IDs explicit. Follow `AGENTS.md` for deployed TestSprite verification.
