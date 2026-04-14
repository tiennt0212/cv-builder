# Test: Project with vague achievements and no measurable results

**Purpose:** Test that `/personal-log` pushes for specific, measurable outcomes before accepting achievement bullets — not just strong verbs.

## Sample input to provide the command

"At my previous company I worked on their main e-commerce platform. I optimized the checkout flow which made it faster, and I also improved the overall UX which users appreciated. I also refactored a big chunk of the legacy codebase to use modern React patterns."

## Expected behavior

The command should gather dates and stack first, then when it reaches achievements, it should **not** accept the vague claims as-is. It should probe for specifics on at minimum:

- "Optimized the checkout flow which made it faster" — faster by how much? What was the before/after metric? Page load time? Conversion rate? Drop-off rate?
- "Improved the overall UX which users appreciated" — what evidence? User feedback scores, support ticket reduction, session length?
- "Refactored a big chunk of the legacy codebase" — what scope? How many components/files? What was the measurable improvement (build time, test coverage, PR review time)?

Only after extracting at least one number or specific outcome per achievement should it proceed to draft.

## Failure condition

Command accepts the vague inputs and drafts bullets like:
- "Optimized checkout flow, improving load performance"
- "Improved UX of the e-commerce platform"
- "Refactored legacy codebase to modern React patterns"

These pass the verb test but fail the result test. A bullet with no result is not a CAR bullet — it's a task description.
