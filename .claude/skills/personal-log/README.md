# personal-log

The only write path into `personal-data/` — enforces schema, bullet quality, and tag taxonomy at input time.

## Idea

If `personal-data/` is the source of truth, it needs a gatekeeper. Free-form notes become unreliable input for `/draft-cv` — tags get missed, bullets stay vague, stack names don't match the taxonomy. This skill funnels every career data update through a structured intake flow so the dataset stays clean, consistently tagged, and ready to generate strong CV content on demand.

## Scope

**Handles:**
- New project entry (with achievement probing questions)
- Update to an existing project (dates, new achievements, stack additions)
- New company
- Role promotion or responsibility change at existing company
- Profile additions: certifications, awards, publications, skills/technologies, languages, education
- First-time profile setup from scratch
- Bulk import from an existing CV (PDF, Word, or pasted text)

**Does not handle:** CV generation — use `/draft-cv`

## Capabilities

- Probes for concrete achievements when descriptions are vague ("what was the outcome? any numbers?")
- Selects and suggests tags using the taxonomy in `agents-ref/schema.md` — over-tagging is preferred to under-tagging
- Normalises stack names to the project naming convention (e.g. `react` → `ReactJS`, `tailwind` → `TailwindCSS`)
- Handles bulk CV import with a review loop: extracts companies, projects, and profile sections, then confirms each item before writing
- Flags fields that cannot be inferred (type, size, team_size) rather than silently guessing
- Asks before overwriting any file that already exists

## Input / Output

**Input:** Free-form user description, or a file path to an existing CV (PDF, Word, plain text)

**Output:** New or updated files in:
- `personal-data/companies/[slug].md`
- `personal-data/projects/[company_slug]-[project_name].md`
- `personal-data/profile.md`

## Works with

**Before `/draft-cv`:** Keep this dataset current — run `/personal-log` whenever a new project, job, or credential needs recording.

**No hard prerequisites** — this is the starting point of the pipeline.
