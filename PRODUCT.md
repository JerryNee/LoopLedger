# Product

## Register

product

## Users

LoopLedger is for builders using coding agents and TestSprite CLI loops during a short hackathon or fast product sprint. They are usually switching between code, terminal output, TestSprite results, GitHub commits, and submission docs. Their job is to prove that an agent did more than generate code: it observed failures, made fixes, reran tests, and left a trustworthy evidence trail.

## Product Purpose

LoopLedger organizes the agent QA loop into a visible ledger: requirements, implementation checkpoints, TestSprite CLI runs, failures, fixes, reruns, costs, and final submission notes. Success means a builder can open the app, reconstruct what happened, and export a credible `LOOP.md` without digging through terminal scrollback or scattered notes.

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
