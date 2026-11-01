# HYNT Scope Compass — Mobile Prototype

Build the full 10-screen interactive prototype from the brief, as a single mobile-framed experience at `/`.

## What you'll get
- Phone-width frame (centered on desktop) with persistent 5-tab bottom bar (Home, Explore, Ask +, Events, Profile).
- HYNT look: forest-green gradients and verified badges, charcoal pill buttons, white rounded cards, pill chips.
- Screens in order: Home hook → Flat Snapshot → Room Map → Kitchen bottom sheet → Reality Budget → 3 Matched Pros (with OTP box) → Quote Inbox (with simulated offline-quote upload) → Comparison & Audit table → Milestone Contract → Kickoff celebration modal → back to Home showing an "Active Project" widget.
- Back arrows on every step; all chips, steppers, toggles live.

## Live calculations
- Base = carpet area × ₹1,750/sq ft; finish tier (Basic/Standard/Premium) adjusts kitchen cost.
- Rooms set to "Later" move 18% of value into a Deferred bucket; "Skip" removes it.
- Safety buffer by flat age: 5% / 15% / 25%.
- Range = Essential × 0.95 to × 1.15, plus buffer; stacked bar shows Essential / Deferred / Buffer shares.
- BHK switch resets carpet area (750 / 1050); stepper ±25 sq ft; amber deadline badge when move-in < 6 weeks.
- Item counts, weeks estimate and the explanatory callout (flat age, %) update from inputs.

Screens 5–9 (pros, quotes, audit, milestones) use the fixed demo figures from the brief (₹13.8L, ₹11.9L → ₹13.4L adjusted, 20/30/30/20 tranches).

## Technical details
- Client-side state via React context + reducer in `src/features/scope/store.tsx`; pure calc functions in `calc.ts` with a small vitest test for the formulas.
- Screens as components under `src/features/scope/screens/`, switched by a step value (prototype flow, not separate routes).
- Brand tokens (green, charcoal, amber, blue) added to `src/styles.css`; lucide-react icons; distinctive font loaded via `<link>` in root.
- Replace placeholder `index.tsx` with app + proper head metadata; update root title.
