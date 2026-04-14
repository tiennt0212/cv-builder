# Test: Update to a project that already exists

**Purpose:** Test that `/personal-log` detects a potential duplicate when the user describes something that matches an existing project file, and offers an update flow instead of creating a new file.

## Sample input to provide the command

"I want to add something about the Orbitly onboarding project — I forgot to mention that after we shipped it, I also built an admin dashboard for their HR team to track onboarding progress. It took about 6 weeks and we used the same NextJS + Supabase stack. This was still under the same contract."

## Context

This scenario assumes `personal-data/projects/orbitly-onboarding-flow.md` already exists (created by the `new-company.md` eval scenario). The user is describing **new work done under the same project/engagement**, not a separate project.

## Expected behavior

1. Command searches `personal-data/projects/` for files matching "orbitly"
2. Finds `orbitly-onboarding-flow.md` — detects potential overlap
3. Shows the user what already exists and asks: "This sounds related to the existing Orbitly Onboarding Flow project. Do you want to (a) add this as a sub-project/phase within the existing file, (b) create a separate project file, or (c) describe more so I can decide?"
4. If user chooses (a): appends new achievements to the existing file under a clear phase marker
5. If user chooses (b): creates `orbitly-hr-dashboard.md` as a distinct project file

## Failure condition

Command creates a second project file (e.g. `orbitly-admin-dashboard.md`) without checking whether the existing `orbitly-onboarding-flow.md` already covers this engagement, resulting in a duplicate entry for the same company/contract period.
