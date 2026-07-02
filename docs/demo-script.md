# LoopLedger Demo Script

Use this for a 60-90 second hackathon demo video or Discord write-up.

## Short Pitch

LoopLedger turns TestSprite CLI runs into a judge-readable `LOOP.md`.

It is not another demo app with tests bolted on afterward. It is the workspace that records the loop itself: what the agent built, what TestSprite checked, what failed or changed, what got fixed, and which evidence is ready for submission.

## Walkthrough

1. Open the live app: <https://jerrynee.github.io/LoopLedger/>
2. Show the first-screen submission packet: live URL, public repo, 4/4 TestSprite runs, and readiness checks.
3. Open the ledger tab and point out the actual build loop: baseline check, missing `LOOP.md` failure, fix, deploy decision, external access confirmation, TestSprite cloud suite, and clarity/CI follow-up.
4. Open CLI runs and show the four TestSprite cloud checks against the deployed app.
5. Open the `LOOP.md` export and show that the same evidence becomes the final judge-readable artifact.
6. Mention CI/CD: GitHub Pages deploys the app, and the TestSprite checker workflow can rerun the saved suite when the repository secret is configured.

## Submission Blurb

LoopLedger is an evidence workspace for TestSprite Season 3. It helps builders using Codex, Claude Code, or similar agents keep the real testing loop visible: requirements, TestSprite CLI verdicts, failure/fix evidence, reruns, costs, and final `LOOP.md` export. The live app is already backed by 4/4 passing TestSprite cloud runs against the deployed GitHub Pages URL.

