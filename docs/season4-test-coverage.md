# Season 4 Cloud Test Scope

The suite was generated in the TestSprite V3 portal against the publicly deployed app, then reviewed before execution. Project: `28ffbf1d-d12b-4c52-b3c8-51ec6407ebd8` (LoopLedger S4).

The portal proposed 26 cases with substantial duplication across categories. Eight were selected. Ambiguous steps were made explicit; a ledger assertion was moved before navigating away from the ledger. These are test-plan corrections, not claimed product bugs or red-to-green evidence.

## Selected Cases

1. **Fresh state and navigation:** no selected PR or fabricated pass in a fresh session; Ledger, CLI runs, and LOOP.md open their functional views.
2. **Real public PR evidence:** inspect TestSprite/testsprite-cli #218; match the actual title, PR identity, head SHA prefix, and populated checks. Ordinary green CI must not imply a TestSprite pass.
3. **Invalid URL preserves evidence:** after inspecting the fixture, submit `https://example.com/nope`. The GitHub-only validation alert appears and the prior PR identity, SHA, and capture time remain unchanged.
4. **History, report, and persistence:** refresh once, inspect two snapshots, verify the report's full SHA and scope, reload, and recover the same evidence and history.
5. **Keyboard tabs:** ArrowRight, ArrowLeft, Home, and End move tab selection, panel, and focus together.
6. **Markdown download:** `PR-218-evidence.md` contains the PR URL, full SHA, and scope.
7. **Manual ledger:** add `S4 QA ledger entry` with a test-only detail and evidence reference; verify the ledger and LOOP.md contain them.
8. **Manual CLI run:** add `S4 QA local run`, command `echo s4-test-only`, status `queued`, zero credits, and a note explicitly saying it is not a cloud execution. Verify the recorded run and export. The command is only form text and is not executed.

## Fixture and Limits

- Fixture: https://github.com/TestSprite/testsprite-cli/pull/218
- Expected title: `fix(dry-run): include failed run-scoped step sample`
- Full fixture head SHA: `79054cff490203c7ae4b6bb3ca4f737734cabd9e`
- It had no TestSprite-labelled check when the suite was authored. Reassess that expectation if upstream adds one.
- Tests use isolated browser-local data. They do not change GitHub repositories or real account data.
- GitHub's unauthenticated rate limit is a real external dependency. Diagnose rate-limit/network failures separately; never substitute fabricated API results to obtain a passing cloud run.
- Current-commit races, pagination, malformed data, check retries, and conservative verdict logic also have local unit tests. Do not claim those unit cases were exercised by this browser suite.

Execution results and remaining integration work are recorded in [season4.md](season4.md). A test plan is not evidence of a passing execution.

## Reviewed Replay Scripts

The portal-generated suite is retained in the same project. Four scripts were repaired/strengthened after inspecting execution steps and available failure artifacts; the other four retained their generated code and passed strict replay.

| Test ID | Local replay source | Uploaded version |
| --- | --- | --- |
| `2feb0aa9-9405-40f9-8fd3-d918d070540d` | [Invalid URL](../.testsprite/tests/invalid-url-preserves-evidence.py) | `v-19aed8972f71` |
| `d2a4b5ca-1813-432d-a6e0-d588a8962af7` | [Download](../.testsprite/tests/download-evidence-report.py) | `v-19b1b25c4fdd` |
| `8b9e3da9-1907-4c9f-9fc7-9c9202500785` | [Keyboard](../.testsprite/tests/keyboard-tabs.py) | `v-46e1bf6b6b3d` |
| `9bd365d0-55fa-49cc-938f-c98115245e83` | [Persistence](../.testsprite/tests/history-persistence.py) | `v-8a31ae1efeab` |

`VAR_{url}` is substituted by the TestSprite cloud runner. These files are not local browser automation commands. Runtime launch flags match the generated cloud harness. The download/persistence/keyboard cases had no saved code version after their failed/cancelled initial execution, so their first upload required `code put --force`; later edits should use `--expected-version` from a fresh `test code get`.

To replay the saved suite without AI healing:

```bash
npx --yes @testsprite/testsprite-cli@0.14.0 test rerun --all \
  --project 28ffbf1d-d12b-4c52-b3c8-51ec6407ebd8 \
  --no-auto-heal --wait --timeout 600 --output json
```

The original plan describes intended coverage. In the unedited generated scripts, some assertions are narrower: the fixture replay checks title/check-tab/absence of a TestSprite check but not the full SHA; the legacy replays chiefly assert exported content, not every form field. Full fixture SHA and downloaded content are checked by the reviewed download/persistence cases. Do not count planned assertions as executed assertions.
