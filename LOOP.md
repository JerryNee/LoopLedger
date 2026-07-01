# LOOP.md - LoopLedger

## Submission Context

- Live URL: https://loopledger.vercel.app
- Repository: https://github.com/JerryNee/LoopLedger
- Primary CLI command: `testsprite test run <test-id> --target-url https://loopledger.vercel.app --wait --output json`
- Goal: Use TestSprite CLI failures and reruns to prove LoopLedger was hardened through an agent-led QA loop.

## Submission Readiness

- [x] Live app URL: https://loopledger.vercel.app
- [x] Public repository: https://github.com/JerryNee/LoopLedger
- [x] Primary CLI command: testsprite test run <test-id> --target-url https://loopledger.vercel.app --wait --output json
- [x] Requirements: 3 requirements captured.
- [ ] CLI run evidence: Pending until TestSprite CLI is run against the live app.
- [x] Failure/fix loop: Failure and fix evidence are linked in the ledger.
- [x] LOOP.md export: Agent loop timeline and detailed evidence are exportable.
- [x] CI/CD bonus: GitHub Actions runs lint and build on push and pull request.

## Requirements

- [ ] P0 Keep an agent-written LOOP.md in the repo and app export (implemented)
- [ ] P0 Show submission readiness before the final Discord post (implemented)
- [ ] P0 Record real TestSprite CLI runs against the deployed app (planned)

## Agent Loop Timeline

1. Jul 1, 2026, 5:46 PM - plan/verified: Confirmed Season 3 loop rules and repository baseline. After the hackathon window opened, Codex verified the live Vercel URL, GitHub remote, existing CI, and local lint/build status before changing the product. Evidence: curl https://loopledger.vercel.app, git remote, npm run lint, npm run build.
2. Jul 1, 2026, 5:48 PM - failure/resolved: Found missing committed LOOP.md evidence. The app could export markdown, but the public repository did not yet carry the required agent-written LOOP.md artifact for judges to inspect. Evidence: Repository root scan before this change.
3. Jul 1, 2026, 5:52 PM - fix/verified: Added readiness checks and stronger LOOP.md timeline export. Codex added a submission readiness panel, replaced first-run demo data with a truthful hackathon starter ledger, and expanded the export with one-line agent loop iterations. Evidence: commit: feat: harden hackathon loop evidence.

## TestSprite CLI Runs

Summary: 0/0 passing, 0.00 credits tracked.

No CLI runs recorded yet. The next iteration should run the TestSprite CLI against https://loopledger.vercel.app after this deployment lands, then record the failure, fix, and rerun evidence here.

## Evidence Ledger

### Confirmed Season 3 loop rules and repository baseline

- Kind: plan
- Status: verified
- Captured: Jul 1, 2026, 5:46 PM
- Evidence: curl https://loopledger.vercel.app, git remote, npm run lint, npm run build

After the hackathon window opened, Codex verified the live Vercel URL, GitHub remote, existing CI, and local lint/build status before changing the product.

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

## Final Notes

This file is agent-written and will be updated after the real TestSprite CLI loop. The first committed version records the start-of-hackathon product hardening pass and explicitly marks CLI run evidence as pending instead of inventing results.
