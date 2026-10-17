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

## Remaining Integration Work

1. Deploy the branch and record the public deployment URL and source commit.
2. Confirm the intended TestSprite account. The signed-in browser account differs from the existing CLI account. Do not mix project IDs, credentials, or results across accounts.
3. In TestSprite Workspace Settings > Connections > Integrations, install/connect its GitHub App for `JerryNee/LoopLedger` only. User authorization is required.
4. Generate/run the Season 4 browser suite against the deployed app.
5. In the project's GitHub Action settings, configure a PR trigger using a successful preview deployment event. Check that the preview corresponds to that PR's source commit. A PR-open event alone is not a deployment.
6. Observe a real TestSprite bot check/comment on the project PR, fix any genuine failures, and rerun.
7. Record run IDs, URLs, failures/fixes (if any), and final status here before submission.

Official references:
- https://www.testsprite.com/zh/hackathon-s4
- https://docs.testsprite.com/web-portal/integrations/github-integration

Project deadline advertised: October 22, 2026, 23:59 PT (October 23, 01:59 Chicago). CLI contribution window ends October 29. Verify announcements before final submission.

## Handoff Rules

Never reuse the four Season 3 passes as Season 4 evidence. Never claim GitHub App configuration is complete merely because the old CLI workflow exists. Do not commit API keys, `.env*`, or credential files. Keep source commits, deployment URLs, and test run IDs explicit. Follow `AGENTS.md` for deployed TestSprite verification.
