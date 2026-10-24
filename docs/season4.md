# Season 4 Work Log

## Scope

Started October 16, 2026 (America/Chicago), on `feat/season4-pr-evidence`. Existing Season 3 ledger data is historical; the new default view reads public GitHub evidence bound to the observed head SHA.

## Submission Preparation: October 24

The official Discord deadline was extended to October 26, 11:59 PM Pacific.
The Season 4 submission channel is now open. The October 19 support question
has been posted; no technical reply was found during the October 24 check.
Submission does not wait on a support reply, and unresolved behavior is disclosed.

This documentation update corrects the live README link to the tested public
feature-branch alias and removes stale submission-preparation wording. It makes
no application, test, permission, billing, or trigger changes. The previous
verified remote application head is `19eed173e127fc4710b84617caddbbee46c47659`.
New deployment-triggered outcomes will be recorded on PR #1 after this push;
the October 19 results below must not be relabeled as a test of a new commit.

## Verified Results: October 19

### Final Outcome

Remote head **`19eed173e127fc4710b84617caddbbee46c47659`** deployed as
`dpl_9TG8DRFrqbhxn5GwJfRbKYTGHGA3` (Ready `18:32:13Z`; Vercel commit status
at `18:32:14Z`). [CI 39303286325](https://github.com/JerryNee/LoopLedger/actions/runs/39303286325)
passed. There are no application/dependency changes between `cd77ef7` and this
head; the latter records the target correction and verification evidence.

The real deployment event started automatic execution
[`954c0a2b-6960-447e-a3bb-cabd334721e5`](https://www.testsprite.com/dashboard-v3/o/77167281-b0a3-5213-a18d-6af0a2168c02/projects/28ffbf1d-d12b-4c52-b3c8-51ec6407ebd8/execution/954c0a2b-6960-447e-a3bb-cabd334721e5)
at `18:32:15Z`: **7 passed / 0 failed / 1 blocked / 8 total**. The download
run is `e8398834-3ac5-444b-89f3-f7344a193330`, blocked at `18:35:30.537Z`.
The agent reports click timeouts and no verifiable file after keyboard
activation. Unlike the earlier run, its step 4/5 snapshots contain the correct
preview origin, `index-DM2F1wG7.js`, `index-D0iCk5sd.css`, and an actual `<a>`
with `download="PR-218-evidence.md"` and a Blob URL on that preview origin.
The wrong-target issue is corrected for this automatic download run; the
remaining agent download-verification issue is unresolved.

The same application code passed strict cloud replay
`41f29b45-f262-468f-95e5-9e1a07eb44fc` (details below), including reading the
actual file and comparing its entire content. This contradicts the generated
failure hypothesis that the app has no real download, but does not prove the
platform's internal root cause. Keep both results visible. No assertion was
relaxed, no success toast substituted for a file, and no failure was planted.
The saved strict script remains version `v-70ee21fc2c32` after the final run.

GitHub wrote `TestSprite V3` state `success` at `18:35:36Z`, description
`7/8 passed - 1 blocked` (API middle-dot separator), pointing to the same
execution. **Not an automatic all-pass or mandatory merge gate.** The precise
branch rule remains Active; PR #1 remains draft and no hackathon submission
was made. Free balance is **118 credits** (127.5 at the start of this repair:
two eight-case automatic executions plus three focused replays). No upgrades,
trials, permission expansion, source deletion, or new monitoring was performed.

Next: ask TestSprite whether the deployment-triggered agent supports Blob
downloads and can use the reviewed strict replay, and how `VAR_{url}` is bound
after an environment URL change. Do not keep rerunning unchanged cases or
rewrite the app into a server-backed download merely on an AI fix suggestion.
Failure bundles remain ignored because they include signed artifact URLs.
Final-result docs are saved locally without a further push, to avoid another
documentation-only automatic run; the verified remote head is the one above.

### Native Download Compatibility Follow-up

Before changing application code, the reviewed strict download replay was
restored over the generated `v1.0` script, whose final assertion unconditionally
raised an old blocked-result message. The strict replay **passed against the
unchanged deployed application** at `2026-10-19T18:19:11Z`: run
`ceed0d2b-4569-4566-8973-6410fb428666`, execution
[`abc15429-eb5f-4431-ae81-80c381472d71`](https://www.testsprite.com/dashboard-v3/o/77167281-b0a3-5213-a18d-6af0a2168c02/projects/28ffbf1d-d12b-4c52-b3c8-51ec6407ebd8/execution/abc15429-eb5f-4431-ae81-80c381472d71).
It checked the actual downloaded file, exact filename, complete content equality
with the report, fixture URL, full SHA, and Scope section. This is evidence that
the old app can download correctly, not that the automatic agent passed.

The follow-up replaces the scripted detached-anchor click with a persistent
native download link. Its Blob URL stays available until the report changes or
the view unmounts. The report preview and download share the same generated
content. The saved plan and strict replay now target that link; file assertions
have not been weakened. The updated five-step plan was saved at `18:24:06Z`.

Local verification: **35 tests passed**, including six DOM regressions covering
empty state, content/filename/focus, tab changes, successful/failed refresh, and
StrictMode cleanup. Lint, TypeScript/production build, and npm audit passed
(zero reported vulnerabilities). Desktop and 390px mobile inspection found no
horizontal overflow or overlapping download controls; keyboard focus is visible.
Commit `cd77ef75f5b7baea5bee765088bcf9b4a8b7eb03` was pushed and deployed as
`dpl_GwEr41rbR3eGDgqgjoHafAUtT4T3`, Ready at `18:24:52Z`; the deployment page
confirmed the source SHA and existing public branch alias. [CI 39302248588](https://github.com/JerryNee/LoopLedger/actions/runs/39302248588)
passed all 35 tests, lint and build. Its automatically dispatched execution
[`5ce547c3-de5c-40cf-977e-e8ab0a1d69cf`](https://www.testsprite.com/dashboard-v3/o/77167281-b0a3-5213-a18d-6af0a2168c02/projects/28ffbf1d-d12b-4c52-b3c8-51ec6407ebd8/execution/5ce547c3-de5c-40cf-977e-e8ab0a1d69cf)
finished **7 passed / 1 blocked**. GitHub again reported green, with description
`7/8 passed - 1 blocked`, not an all-pass result.

**Target mismatch discovered:** the blocked download run
`7364521e-487d-4ee7-86fe-afb43ace87a6` names the preview as its target, but its
fresh step snapshot (`18:25:51Z`) contains the old download button and assets
from `https://loopledger-s4.vercel.app`, including `index-XnT-ekCK.js`.
The new preview visibly has a download link. A strict replay using `VAR_{url}`
then failed to find that link (run `b3d37d44-b515-4f37-985e-4f2988ca9761`,
execution `7b41eddb-337d-494c-8cb7-f916fa1cec71`). Consequently, neither the
automatic blocked result nor the baseline pass above proves it tested the
branch deployment. Do not infer actual navigation from target metadata alone.

Both the project target and default environment already name the correct
preview. The Sources page still contained an old-production Site Overview.
Re-Explore completed and added a Ready preview Site Overview; the old source
was not deleted. This may explain agent navigation but does not establish the
backend cause of the `VAR_{url}` substitution mismatch.

The download plan now explicitly requires the exact preview hostname. The
strict replay also explicitly navigates there and asserts the hostname. With
all file/content assertions unchanged, version `v-70ee21fc2c32` **passed**:
run `41f29b45-f262-468f-95e5-9e1a07eb44fc`, finished `18:30:44.195Z`,
[`df8fd22b-2f0b-4d69-8941-95df68c09716`](https://www.testsprite.com/dashboard-v3/o/77167281-b0a3-5213-a18d-6af0a2168c02/projects/28ffbf1d-d12b-4c52-b3c8-51ec6407ebd8/execution/df8fd22b-2f0b-4d69-8941-95df68c09716).
This verifies the actual branch app download, not the automatic agent. The
workaround is intentionally branch-bound, not portable to other environments.
The corrected-plan automatic outcome is recorded in Final Outcome above.

### Previous Automatic Execution

After the user's explicit **enable and verify** confirmation, the existing
Push rule was enabled. Its scope is unchanged: `JerryNee/LoopLedger`, branch
`feat/season4-pr-evidence`, `Vercel` commit-status event, `default` environment.
The portal showed **Active** before the push. No new PR rule, permission grant,
public-access exception, subscription, or merge-protection change was made.

The real push of `683355c98b09b13dbb54a8f392b444498022ac61` produced:

- [GitHub CI](https://github.com/JerryNee/LoopLedger/actions/runs/39299719604):
  success; 29 unit tests, lint/type checks, and build passed.
- [Vercel deployment](https://vercel.com/jerrys-projects-82705168/loopledger-s4/BwbFrjVSR1KdSQkHbDwYzTMYHSCR),
  ID `dpl_BwbFrjVSR1KdSQkHbDwYzTMYHSCR`: Ready at `2026-10-19T18:06:18Z`.
  Its source commit and branch are the ones above; the deployment page lists
  the existing public branch alias as its domain.
- TestSprite trigger activity: the branch's Vercel event linked to that exact
  GitHub commit and **Tests started**. No Send Test Event or Run Now was used.
- [Automatic execution `4a946e5d-7803-4635-8557-7872f5f678ed`](https://www.testsprite.com/dashboard-v3/o/77167281-b0a3-5213-a18d-6af0a2168c02/projects/28ffbf1d-d12b-4c52-b3c8-51ec6407ebd8/execution/4a946e5d-7803-4635-8557-7872f5f678ed):
  eight tests on the expected branch preview, starting at `18:06:20Z`.
  Final result: **7 passed, 1 failed, 0 blocked, 8 total**.
- `TestSprite V3` commit StatusContext `56717269953` on the exact pushed head:
  `success` at `18:09:04Z`, description **7/8 passed - 1 failed** (the API
  uses a middle dot separator), linking that automatic execution.
  **Green does not mean all tests passed or that merging would be blocked.**
- The old PR bot comment still links the earlier manual PR-mode execution;
  the new branch-triggered result was written as a commit status, not a new
  PR bot comment.

The download failure is run `a339a3df-63c2-4763-a561-8707467af13a`, source
`github_action`, finished at `18:08:58.524Z`. Its result says the file could not
be confirmed or read. The ignored bundle is under `.testsprite/runs/<run-id>/`.
Its exported `code.py` is byte-identical to the preceding manual failure's
export (SHA-256 `2aab81e3f01b13a33fc8c0e005249a604fc352ee36b201c77c2010339e0a30b9`),
including older blocked-result comments. Do not present those comments as a
fresh trace proving the current run's exact timeout cause. Keep the observed
file-verification failure separate from the generated root-cause hypothesis.

The account remains Free, with **127.5 credits** after this eight-case run
(131.5 before it). The trigger remains enabled. This verifies automatic
deployment dispatch and GitHub result delivery for the selected branch; it
does not verify all-PR routing or a mandatory merge gate. PR #1 remains draft;
no hackathon entry was submitted. No application code changed in this pass.

These final-result documentation updates are initially local so recording the
result does not immediately spend another four credits on a documentation-only
deployment. The verified remote head remains `683355c`; include the updates
with the next intentional push and validate that new head separately.

## Earlier Manual PR Dispatch: October 19

The Free-plan GitHub PR entitlement block did **not** recur in a real portal
**Send Test Event** recheck. This one-off PR-mode verification created execution
[`1da74c33-d74b-4668-a54d-37bac74db104`](https://www.testsprite.com/dashboard-v3/o/77167281-b0a3-5213-a18d-6af0a2168c02/projects/28ffbf1d-d12b-4c52-b3c8-51ec6407ebd8/execution/1da74c33-d74b-4668-a54d-37bac74db104)
for PR #1 at head `eeac617e1af686e42ab10d25dd2bbb7674ac590f`. The portal showed
**Running, 8 in progress**, with the expected public branch preview URL and
`github-pr-1` label. The account remained Free; credits went from 136 to 132.

GitHub independently shows:

- A `TestSprite V3` **commit StatusContext**, not a CheckRun, on that exact head.
  Initial status ID `56714300172`, `pending`, description `8 tests queued`,
  timestamp `2026-10-19T17:35:46Z`.
- A real [TestSprite bot comment](https://github.com/JerryNee/LoopLedger/pull/1#issuecomment-6273318655)
  created at `2026-10-19T17:35:44Z`, linking the same execution and preview.

Final result, checked October 19: **7 passed, 1 blocked, 8 total**. The blocked
case is **Download the evidence report as Markdown**, logical test
`d2a4b5ca-1813-432d-a6e0-d588a8962af7`, run
`5a248a98-3552-4d45-a2f1-8881ff85cd05`. The bot report says the runner could see the
report text but could not confirm the downloaded file or a download confirmation.
That does not yet establish an application bug: inspect the actual steps and
download behavior before changing product code or the test.

Despite that blocked case, the `TestSprite V3` commit status changed to
**SUCCESS** at `2026-10-19T17:38:31Z`; the bot comment updated at
`2026-10-19T17:38:29Z` explicitly warns about the blocked test and scores only the
seven runnable tests. **Do not describe this green status as 8/8 passed.**

The test event is a
portal-triggered integration verification, not evidence that a new Git push
automatically triggered it. The old branch-scoped Push rule remains disabled;
no PR rule was saved, no new deployment/commit was pushed, and no subscription
or trial was activated. Next: resolve the blocked export verification, then
enable an appropriate persistent trigger and validate a real deployed commit
before final submission. Check that the saved rule's scope meets the event's
PR-automation expectations rather than assuming a branch Push rule covers every PR.

Submission audit: repo remains public; PR #1 remains draft; README's S4 status
now distinguishes the successful dispatch, blocked download case, and pending automation.
Keep root LOOP.md explicitly historical rather than repurposing its July S3
results as S4 evidence. The official S4 page was rechecked October 19: README,
public live URL and a PR with TestSprite evidence are required; demo video is
optional. Submission is via Discord, not the old S3 form. Advertised project
deadline remains October 22, 23:59 Pacific (October 23, 01:59 Chicago), also
confirmed in the Discord rules after the user restored login. The rules require
the participant badge and an entry in the dedicated submission channel. That
channel's links currently render **No Access** for this account; do not post in
the general discussion channel as a substitute. Whether the channel has not yet
opened or access depends on a role is not established. No submission was made.

Official announcement independently read after login: [Holly's October 18 reply](https://discord.com/channels/1227394620623949934/1556776381894099117/1561517955882418297)
says the team is rolling out Free-plan GitHub CI support without a promo code
or upgrade, and to follow up if unavailable by Monday evening. The reply itself
does not announce completed rollout; the successful October 19 dispatch above
is the direct evidence that it works for this account. No Discord message was
sent on the user's behalf.

### Download Case Investigation

The PR execution's five recorded runtime steps were: navigate, fill the PR URL,
click Inspect PR, click Report, then a blocked assertion about the visible PR
URL. **There was no completed download click in the recorded steps.** This
alone does not establish that the agent never attempted it (see the artifact
finding below). Its generated
code is different from the reviewed strict replay script in
`.testsprite/tests/download-evidence-report.py`. The CLI still returned that
reviewed code at version `v-19b1b25c4fdd` before the following plan edit. This
shows that the prior strict replay and the PR-mode execution are not equivalent;
it does not establish why their runtime paths differed.

The saved plan's fourth and fifth steps were clarified in the portal to name
the download button explicitly and require the actual file and its contents,
not merely the visible report. The original filename, PR URL, full SHA and
Scope assertions remain required. A focused **Save & Run** started at
`2026-10-19T17:50:30.512Z`, run `93e38e57-08d0-4d40-b49f-b6c2b3b6386f`, using
the same public branch preview in the `default` environment. This is a manual
portal run, not a replacement GitHub PR execution. Credits changed from 132 to
131.5; no subscription or trial was started. It finished **failed** at
`2026-10-19T17:52:59.794Z`: four actions passed, then the file-verification
assertion failed. [Focused execution](https://www.testsprite.com/dashboard-v3/o/77167281-b0a3-5213-a18d-6af0a2168c02/projects/28ffbf1d-d12b-4c52-b3c8-51ec6407ebd8/execution/9fead07d-7d73-4539-9625-23aefd797b58/test/93e38e57-08d0-4d40-b49f-b6c2b3b6386f).

The downloaded failure bundle's `code.py` includes an attempted click on the
download button and a `DefaultActionWatchdog.on_ClickElementEvent` timeout
after 15 seconds. Therefore the five-step runtime log is not a complete record
of failed interaction attempts. The exported code also retains an earlier
blocked-result message, so do not assume all its comments describe only this
latest run. These artifacts do not establish whether the application or the
agent's download handling caused the timeout. The generated fix suggestions
about server endpoints/filesystem writes are hypotheses, not facts; this app
creates a client-side Blob download.

Failure bundle: ignored `.testsprite/runs/93e38e57-08d0-4d40-b49f-b6c2b3b6386f/`.
Do not commit it because metadata includes signed artifact URLs. The clarified
plan is saved in `.testsprite/plans/s4-download-evidence-report.json`; its final
button-location wording is "next to Refresh evidence", not "above the tabs".
That wording-only follow-up is not a new passing run. No repeated rerun loop
was started and the original PR report remains 7 passed / 1 blocked.

A separate desktop browser check loaded the fixture and report successfully,
but waiting for a download event timed out. That check did not confirm a file
or its contents and must not be reported as a manual download pass. No product
code was changed to create a superficial download confirmation.

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

## Integration Progress

1. Git preview deployment is working: commit `3747a8c21d55ee05ecf2cb6deda669c302cf1229` produced `dpl_HqJ18ik6Uz3LcGhLGQV2vBRF6LLz` automatically. Its build log confirms the feature branch and commit, and GitHub CI plus the `Vercel` status passed. [Vercel bot comment](https://github.com/JerryNee/LoopLedger/pull/1#issuecomment-6230091756). The preview still requires Vercel login; unauthenticated access returned HTTP 302.
2. Account confirmed: browser and CLI now use the same original Gmail account. A separate portal-created `LoopLedger S4` project (`28ffbf1d-d12b-4c52-b3c8-51ec6407ebd8`) preserves the old Season 3 suite unchanged. Local configuration now points to S4; the historical checker is manual-only.
3. Completed October 17: after explicit user confirmation, TestSprite's GitHub App was installed for `JerryNee/LoopLedger` only. The portal confirmed connection to JerryNee. The existing Vercel GitHub App retained its three prior repositories and added LoopLedger; `vercel git connect` then succeeded.
4. Portal suite generation and strict cloud replays are complete for the deployed source above. Preserve the reviewed scripts; a fresh AI generation may replace them.
5. Completed October 17: after the user's separate confirmation, the exact branch preview domain was added to Vercel's public-access exceptions. Unauthenticated access returned HTTP 200; project-wide Require Log In remains enabled with Standard Protection. The existing S4 `default` environment now points to this preview. A saved Push rule watches `JerryNee/LoopLedger`, branch `feat/season4-pr-evidence`, and the `Vercel` commit status. Use this exact branch scope: Vercel truncated/hashed the long branch name in its alias, so a generic `{branch-slug}` URL pattern would be incorrect. The rule was disabled after its first real event was blocked by billing, as recorded below.
6. October 19: the PR-mode test event dispatched on Free (7 passed, 1 blocked). After explicit user confirmation, the saved branch rule was enabled and a real push automatically dispatched execution `4a946e5d-7803-4635-8557-7872f5f678ed` (7 passed, 1 failed). Its result reached the exact commit as a StatusContext. Automatic branch dispatch is verified; download verification and any all-PR routing/mandatory merge gate remain unresolved. Do not upgrade or accept a renewing trial without the user's separate authorization.
7. Record run IDs, URLs, failures/fixes (if any), and final status here before submission.
8. Submit the PR link, live URL, and TestSprite account email/name in Discord `#hackathon-submissions` according to the current S4 page. Do not reuse the S3 form instructions. No entry has been submitted yet.

Official references:
- https://www.testsprite.com/zh/hackathon-s4
- https://docs.testsprite.com/web-portal/integrations/github-integration

Project deadline advertised: October 22, 2026, 23:59 PT (October 23, 01:59 Chicago). CLI contribution window ends October 29. Verify announcements before final submission.

## First Deployment-Triggered Attempt

On October 17, commit `661c578026c74956e2a0de7f87a179f493930997` triggered [GitHub CI](https://github.com/JerryNee/LoopLedger/actions/runs/39006581455) and Vercel deployment `dpl_8NWH7CHEgmHYeZ5WsEQdUtiLxMh3`. Both passed. Vercel's build log confirms this source commit and branch; the application bundles remain `index-XnT-ekCK.js` and `index-ZekMqHO8.css`.

The real `Vercel` success event reached TestSprite. GitHub check `117320216990`, named `TestSprite V3`, completed with failure and the title **GitHub CI runs not on the Free plan. No tests were run.** The portal [trigger activity](https://www.testsprite.com/dashboard-v3/o/77167281-b0a3-5213-a18d-6af0a2168c02/projects/28ffbf1d-d12b-4c52-b3c8-51ec6407ebd8/settings/github-action?delivery=0d2a306c-c9ec-11f1-8f69-963ca8ba8f05) records **Blocked by billing** for that same SHA. Delivery ID: `0d2a306c-c9ec-11f1-8f69-963ca8ba8f05`.

This is a billing/entitlement block, not an application test failure or a test pass. No execution/run IDs were issued. The portal still showed 136 credits. The trigger was disabled, not deleted, to preserve its configuration and avoid repeating the blocked attempt.

The [public pricing page](https://www.testsprite.com/pricing), checked the same day, advertises GitHub PR auto-test on one repository in Free, whereas the integration refused to run. Starter's advertised first month is free but then renews at $19/month; no trial, subscription, or purchase was started.

### PR-Mode Cross-Check

To distinguish a Push-only restriction from a general entitlement block, the portal's Add Trigger dialog was switched to Pull Request mode for PR #1 at head `4015215350a2e65fe0b32d0d06e792a5f51a05f4`. CI and its Vercel deployment were successful, and the exact branch preview returned HTTP 200 without authentication. The selected signal was the same `Vercel` commit status. The literal preview URL was used only for this one-off verification, not saved as a rule for future PRs.

Clicking **Send Test Event** returned: **The Free plan does not include GitHub CI runs - upgrade to Starter in Settings > Billing.** The accompanying title was **GitHub CI runs not on the Free plan**. No TestSprite check or bot comment appeared on that head, no test execution was created, and the balance remained 136 credits. The dialog was cancelled without creating a PR trigger; the original Push rule remains disabled.

Both the real Push event and the PR-mode test event were blocked for this account on October 17. Simply switching trigger modes did not resolve the observed restriction then. This historical observation is superseded for PR-mode dispatch by the successful October 19 recheck above; the backend cause and scope of TestSprite's change are not independently established.

## Handoff Rules

The first S4 portal suite contains eight reviewed cases; see [coverage and fixture details](season4-test-coverage.md). Repository authorizations and Git preview deployment are verified. The branch-scoped trigger is **active**, and the October 19 push of `683355c` automatically ran the suite and posted its result to that commit. The result was **7 passed, 1 failed**, despite a green GitHub status. Investigate the download failure without weakening file-content assertions. The earlier CLI passes and manual PR-mode event are separate evidence. Do not say every PR is covered or mandatory merge blocking is configured.

Saved scopes: TestSprite only `JerryNee/LoopLedger`; Vercel adds only `LoopLedger` while retaining `JerryNee.github.io`, `Immersive_Intelligence`, and `the-room`. Vercel's separate permission-upgrade request was not accepted. Project-wide preview authentication remains enabled (Standard Protection), and protected sourcemaps remain enabled.

Authorized exception: only `loopledger-s4-git-feat-season4-b35ea5-jerrys-projects-82705168.vercel.app` is public. The user confirmed the request and the saved exception was verified in Vercel. It affects that domain's present and future deployments, not every project/preview. Anyone with the URL can view the app; this does not grant account access or expose another browser's local storage. Do not broaden this exception without a new confirmation.

TestSprite Free permits one environment. Creating `s4-pr-1` was refused with `FEATURE_GATED`; no extra environment or paid plan was created. The existing S4 `default` environment now uses the branch preview, preserving ID `47518934-283b-4e2c-9777-3c9825e36825` and old run history. The trigger selects that environment. The Push trigger settings expose no Merge gate toggle; do not claim branch protection or mandatory gating. Inspect real run counts and target URL, not just a green check. TestSprite installation ID: `172295278`; Vercel installation ID: `71790721`.

Never reuse the four Season 3 passes as Season 4 evidence. Never claim GitHub App configuration is complete merely because the old CLI workflow exists. Do not commit API keys, `.env*`, or credential files. Keep source commits, deployment URLs, and test run IDs explicit. Follow `AGENTS.md` for deployed TestSprite verification.
