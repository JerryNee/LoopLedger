# Product

## Register

product

## Users

LoopLedger is for builders using coding agents and TestSprite CLI loops during a short hackathon or fast product sprint. They are usually switching between code, terminal output, TestSprite results, GitHub commits, and submission docs. Their job is to prove that an agent did more than generate code: it observed failures, made fixes, reran tests, and left a trustworthy evidence trail.

## Product Purpose

For Season 4, LoopLedger captures public GitHub PR evidence for the exact observed head commit: checks, statuses, bot-comment links, and locally saved snapshots. Success means a reviewer can distinguish current-commit evidence from historical passes and download a report with explicit limitations. It is not a branch-protection or publisher-identity verifier.

The Season 3 ledger remains available for manually recording requirements, CLI runs, failures, fixes, and `LOOP.md` exports. Those historical records must not imply that a current PR has passed.

## Brand Personality

Clear, forensic, composed. The product should feel like a serious engineering workspace that reduces panic during a deadline. It should make proof feel calm, not bureaucratic.

## Anti-references

Avoid marketing-site hero pages, decorative AI-gradient dashboards, generic three-card SaaS layouts, fake analytics with no workflow, and playful gamified task boards. This should not look like a crypto dashboard, a dark hacker terminal, or a note-taking app with vague cards.

## Design Principles

1. Evidence first: every screen should make the next proof artifact easier to capture or verify.
2. Loop over logs: organize around the repeated cycle of plan, test, fail, fix, rerun, and submit.
3. Calm density: show enough operational detail for repeated use without turning the workspace into noise.
4. Export confidence: every tracked item should help the final `LOOP.md` read like an honest build record.
5. Practice the product: the app should itself be easy to test through a deployed web URL and TestSprite CLI.

## Accessibility & Inclusion

Target WCAG AA contrast for all text and controls. Support keyboard-first operation for forms, filters, tabs, and export actions. Motion should be brief, state-driven, and reduced when `prefers-reduced-motion` is enabled. Color must not be the only indicator for run status, failure severity, or completion.
