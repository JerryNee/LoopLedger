# Design

## Visual Direction

LoopLedger is an operational product UI, not a landing page. The first viewport should feel like a working evidence ledger: navigable, structured, and ready for repeated use. The mood is "safedesk after a late-night test run": focused white workspace, dark ink, and a restrained red signal for proof, risk, and primary actions.

## Color Palette

Use OKLCH tokens only.

```css
:root {
  --bg: oklch(1 0 0);
  --surface: oklch(0.972 0.006 270);
  --surface-strong: oklch(0.936 0.012 270);
  --ink: oklch(0.19 0.018 270);
  --muted: oklch(0.46 0.024 270);
  --primary: oklch(0.48 0.18 0);
  --primary-strong: oklch(0.38 0.16 0);
  --accent: oklch(0.62 0.12 205);
  --success: oklch(0.55 0.13 150);
  --warning: oklch(0.72 0.14 76);
  --danger: oklch(0.55 0.18 25);
  --line: oklch(0.88 0.012 270);
}
```

Primary red is used sparingly for selected states, export actions, and evidence risk. Blue accent is for informational metadata and links. Status colors must always include labels or icons.

## Typography

Use a system sans stack for the product shell. Keep type fixed in rem units. Labels and dense metadata should be compact but readable; prose and exported preview text should keep comfortable line length.

## Layout

Default surface is a full product workspace with a left rail, top context bar, main ledger, and right-side evidence/export panel on desktop. On mobile, navigation collapses into top tabs and the export panel stacks below the ledger.

## Components

- Sidebar items: icon, label, count, selected state.
- Segmented controls for views and filters.
- Status pills with icon, label, and subdued fills.
- Timeline rows for loop events.
- Forms with labels above inputs, helper text below, and inline validation.
- Export preview with stable monospace formatting.

## Motion

Motion is limited to state feedback: hover, active, filter changes, copied/exported confirmation, and row insertion. Transitions should be 150-220 ms. Disable nonessential transitions under reduced motion.
