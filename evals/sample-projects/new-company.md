# Test: Project at a company not yet in personal-data/companies/

**Purpose:** Test that `/personal-log` detects a missing company file and offers to create one before saving the project.

## Sample input to provide the command

"I did a 3-month contract for a startup called Orbitly (they build HR tools). I built their onboarding flow from scratch — it was a multi-step wizard with form validation, file upload, and email notifications. The stack was NextJS and Supabase. After shipping it, new employee onboarding time dropped from 3 days to under 4 hours according to their HR team."

## Expected behavior

1. Command gathers information (dates, role title, type = freelance/contract)
2. Before drafting or saving: checks `personal-data/companies/` — "orbitly" does not exist
3. Offers to create `personal-data/companies/orbitly.md` first
4. Creates company file, then drafts the project file
5. Saves to `personal-data/projects/orbitly-onboarding-flow.md`

## Failure condition

Command saves `personal-data/projects/orbitly-onboarding-flow.md` with `company: orbitly` without creating the corresponding `personal-data/companies/orbitly.md`.
