# Test: Vague project description

**Purpose:** Test that `/personal-log` asks follow-up questions before drafting, rather than accepting vague input.

## Sample input to provide the command

"I worked on a dashboard project at my last job. It was a React app and I helped improve the performance and added some new features."

## Expected behavior

The command should NOT draft immediately. It should identify missing information and ask follow-up questions covering at minimum:
- What company / what context?
- What timeframe (dates)?
- What specifically was improved — what changed about performance?
- What features were added — what did they do?
- What was the outcome for users or the business?

## Failure condition

Command drafts a project file with vague bullets like:
- "Improved performance of the dashboard"
- "Added new features to the React app"

These would fail the bullet quality criteria in `criteria.md`.
