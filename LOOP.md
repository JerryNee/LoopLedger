# LOOP.md - LoopLedger

## Submission Context

- Live URL: https://jerrynee.github.io/LoopLedger/
- Repository: https://github.com/JerryNee/LoopLedger
- Primary CLI command: `testsprite test create-batch --plan-from-dir .testsprite/plans --run --wait --target-url https://jerrynee.github.io/LoopLedger/ --timeout 900 --max-concurrency 2 --output json`
- Goal: Use TestSprite CLI failures and reruns to prove LoopLedger was hardened through an agent-led QA loop.

## Submission Readiness

- [x] Live app URL: https://jerrynee.github.io/LoopLedger/
- [x] Repository URL: https://github.com/JerryNee/LoopLedger
- [x] External access: Unauthenticated access to the repo and live app has been confirmed.
- [x] Primary CLI command: testsprite test create-batch --plan-from-dir .testsprite/plans --run --wait --target-url https://jerrynee.github.io/LoopLedger/ --timeout 900 --max-concurrency 2 --output json
- [x] Requirements: 3 requirements captured.
- [x] CLI run evidence: 4 TestSprite cloud runs passed against the live app.
- [x] Failure/fix loop: Failure and fix evidence are linked in the ledger.
- [x] LOOP.md export: Agent loop timeline and detailed evidence are exportable.
- [x] CI/CD bonus: GitHub Actions runs lint, build, and Pages deployment workflows.

## Requirements

- [ ] P0 Keep an agent-written LOOP.md in the repo and app export (implemented)
- [ ] P0 Show submission readiness before the final Discord post (implemented)
- [x] P0 Record real TestSprite CLI runs against the deployed app (verified)

## Agent Loop Timeline

1. Jul 1, 2026, 5:46 PM - plan/verified: Confirmed Season 3 loop rules and repository baseline. After the hackathon window opened, Codex verified the GitHub remote, existing CI, local lint/build status, and intended live URL before changing the product. Evidence: git remote, npm run lint, npm run build, curl https://loopledger.vercel.app.
2. Jul 1, 2026, 5:48 PM - failure/resolved: Found missing committed LOOP.md evidence. The app could export markdown, but the public repository did not yet carry the required agent-written LOOP.md artifact for judges to inspect. Evidence: Repository root scan before this change.
3. Jul 1, 2026, 5:52 PM - fix/verified: Added readiness checks and stronger LOOP.md timeline export. Codex added a submission readiness panel, replaced first-run demo data with a truthful hackathon starter ledger, and expanded the export with one-line agent loop iterations. Evidence: commit: feat: harden hackathon loop evidence.
4. Jul 1, 2026, 5:58 PM - decision/verified: Changed live target to GitHub Pages after Vercel alias mismatch. Codex found that loopledger.vercel.app served an unrelated Next.js crochet tracker, so LoopLedger now targets the GitHub Pages URL and includes a Pages deployment workflow for the public repository. Evidence: curl https://loopledger.vercel.app returned crochet metadata; .github/workflows/pages.yml.
5. Jul 1, 2026, 6:08 PM - decision/verified: External access confirmed for repo and live app. Codex made the GitHub repository public, enabled GitHub Pages with workflow deployment, dispatched the Pages build, and confirmed unauthenticated access to both the repo and the live LoopLedger page. Evidence: GitHub API visibility public; raw LOOP.md accessible; Pages run 28553664509 success; curl https://jerrynee.github.io/LoopLedger/ returned 200.
6. Jul 1, 2026, 6:32 PM - test/verified: Ran first TestSprite cloud suite against LoopLedger. Codex created a TestSprite frontend project and ran four cloud browser plans against the deployed GitHub Pages app. All four passed: default workspace readiness, manual evidence capture, CLI run recording, and LOOP.md export. Evidence: project 9a0f2053-4ee8-409d-bc24-9b339f6e7593; runs 7aad0a87-61f5-48e8-ab25-d88d4de1383e, 1a318e13-b289-44db-97ba-46549601e863, e325e7f6-b2d6-4cdb-9039-60826624c4fd, 7c23e2e3-d4cc-4d71-9988-482a5ff5bb46; 4/4 passed; 8 credits used.

## TestSprite CLI Runs

Summary: 4/4 passing, 8.00 credits tracked.

### Default workspace readiness and LOOP.md preview

- Status: passed
- Target URL: https://jerrynee.github.io/LoopLedger/
- Duration: 84s
- Credits: 2.00
- Command: `testsprite test create-batch --plan-from-dir .testsprite/plans --run --wait --target-url https://jerrynee.github.io/LoopLedger/ --timeout 900 --max-concurrency 2 --output json`
- Notes: Test id 4ef99732-d5c6-47e0-bae7-cf8d85d757dd, run id 7aad0a87-61f5-48e8-ab25-d88d4de1383e. Verified the default workspace, readiness checklist, and LOOP.md preview.

### Manual evidence entry updates ledger and LOOP.md

- Status: passed
- Target URL: https://jerrynee.github.io/LoopLedger/
- Duration: 171s
- Credits: 2.00
- Command: `testsprite test create-batch --plan-from-dir .testsprite/plans --run --wait --target-url https://jerrynee.github.io/LoopLedger/ --timeout 900 --max-concurrency 2 --output json`
- Notes: Test id d51164fa-c4ee-4392-aed4-408348a8ad96, run id 1a318e13-b289-44db-97ba-46549601e863. Added evidence through the form and observed it in the ledger and LOOP.md preview.

### CLI run recording creates run evidence

- Status: passed
- Target URL: https://jerrynee.github.io/LoopLedger/
- Duration: 271s
- Credits: 2.00
- Command: `testsprite test create-batch --plan-from-dir .testsprite/plans --run --wait --target-url https://jerrynee.github.io/LoopLedger/ --timeout 900 --max-concurrency 2 --output json`
- Notes: Test id 84bb4d00-5be9-4c32-82e5-9fbe87078d97, run id e325e7f6-b2d6-4cdb-9039-60826624c4fd. Recorded a CLI run in the app and verified the passed status.

### Export view exposes judge-readable LOOP.md

- Status: passed
- Target URL: https://jerrynee.github.io/LoopLedger/
- Duration: 353s
- Credits: 2.00
- Command: `testsprite test create-batch --plan-from-dir .testsprite/plans --run --wait --target-url https://jerrynee.github.io/LoopLedger/ --timeout 900 --max-concurrency 2 --output json`
- Notes: Test id 84094177-45a3-4f82-82c1-c23ec68a76b7, run id 7c23e2e3-d4cc-4d71-9988-482a5ff5bb46. Verified the Export LOOP.md view, sections, copy action, and download action.

## Evidence Ledger

### Confirmed Season 3 loop rules and repository baseline

- Kind: plan
- Status: verified
- Captured: Jul 1, 2026, 5:46 PM
- Evidence: git remote, npm run lint, npm run build, curl https://loopledger.vercel.app

After the hackathon window opened, Codex verified the GitHub remote, existing CI, local lint/build status, and intended live URL before changing the product.

### Found missing committed LOOP.md evidence

- Kind: failure
- Status: resolved
- Captured: Jul 1, 2026, 5:48 PM
- Evidence: Repository root scan before this change

The app could export markdown, but the public repository did not yet carry the required agent-written LOOP.md artifact for judges to inspect.

### Added readiness checks and stronger LOOP.md timeline export

- Kind: fix
- Status: verified
- Captured: Jul 1, 2026, 5:52 PM
- Evidence: commit: feat: harden hackathon loop evidence

Codex added a submission readiness panel, replaced first-run demo data with a truthful hackathon starter ledger, and expanded the export with one-line agent loop iterations.

### Changed live target to GitHub Pages after Vercel alias mismatch

- Kind: decision
- Status: verified
- Captured: Jul 1, 2026, 5:58 PM
- Evidence: curl https://loopledger.vercel.app returned crochet metadata; .github/workflows/pages.yml

Codex found that loopledger.vercel.app served an unrelated Next.js crochet tracker, so LoopLedger now targets the GitHub Pages URL and includes a Pages deployment workflow for the public repository.

### External access confirmed for repo and live app

- Kind: decision
- Status: verified
- Captured: Jul 1, 2026, 6:08 PM
- Evidence: GitHub API visibility public; raw LOOP.md accessible; Pages run 28553664509 success; curl https://jerrynee.github.io/LoopLedger/ returned 200

Codex made the GitHub repository public, enabled GitHub Pages with workflow deployment, dispatched the Pages build, and confirmed unauthenticated access to both the repo and the live LoopLedger page.

### Ran first TestSprite cloud suite against LoopLedger

- Kind: test
- Status: verified
- Captured: Jul 1, 2026, 6:32 PM
- Evidence: project 9a0f2053-4ee8-409d-bc24-9b339f6e7593; runs 7aad0a87-61f5-48e8-ab25-d88d4de1383e, 1a318e13-b289-44db-97ba-46549601e863, e325e7f6-b2d6-4cdb-9039-60826624c4fd, 7c23e2e3-d4cc-4d71-9988-482a5ff5bb46; 4/4 passed; 8 credits used

Codex created a TestSprite frontend project and ran four cloud browser plans against the deployed GitHub Pages app. All four passed: default workspace readiness, manual evidence capture, CLI run recording, and LOOP.md export.

## Final Notes

This file is agent-written and now includes the first real TestSprite CLI loop. Future feature changes should rerun the relevant TestSprite tests and record any failure, fix, and rerun evidence here.
