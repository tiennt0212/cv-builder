# Claude Code Instructions

## Project overview

This is a **public template repository**. Anyone can clone or fork it and use it as a personal CV management tool. The repo itself contains no personal data — users populate `personal-data/` and `jobs/` after cloning. An `examples` branch exists with sample data for reference and testing.

Each user (referred to below as "the user") uses slash commands to maintain a structured dataset of their own work experience and generate tailored CVs from it. When Claude is running in a cloned copy of this repo, it is acting as a personal assistant to that specific user — `personal-data/` contains their data, not the repo maintainer's.

## Key files to know

- `agents-ref/schema.md` — read this first before touching any data files. Defines all enums, tag taxonomy, naming conventions, and section rules.
- `personal-data/profile.md` — candidate's personal info, skills, education, awards (created by `/personal-log` from `agents-ref/profile-template.md`)
- `personal-data/companies/*.md` — one file per employer
- `personal-data/projects/*.md` — one file per project/role
- `jobs/[company-role]/` — output files land here. Each application folder contains a `YYYY-MM-DD_HH-MM_jd.md` (saved manually) and one timestamped subfolder per `/draft-cv` run containing `analysis.md` + `draft-cv.yaml`. Renderer outputs go into further subfolders (`resumx-cv/`, `latex-cv/`, `html-cv/`) inside the run folder.
- `agents-ref/archetypes.yaml` — live archetype data, populated by `/setup-archetypes`. Run once before first `/draft-cv` use. Archetype field schema is documented in `agents-ref/schema.md`.

## Data architecture

The system has three layers. Each layer has a strict responsibility boundary:

1. **`personal-data/`** — raw facts, format-agnostic. `profile.md` stores all candidate sections as-is: languages, certifications, awards, education, skills. Companies and projects are each in their own files. Nothing here is tailored to any specific job.

2. **`draft-cv`** — selects, filters, aggregates, and transforms data into a seed YAML. It decides *what* goes into the CV and *how it is structured*: which projects to include, which bullets to write, how to group experience, whether to show role progression. The seed contains actual prose.

3. **Renderer commands** (`resumx-cv`, `latex-cv`, etc.) — take a seed YAML and apply format-specific styling. They make *zero content decisions*. Layout, heading style, date format, link rendering — all theirs. Content — not theirs.

**Rule:** if a decision affects what the reader learns, it belongs in `draft-cv`. If it only affects how it looks, it belongs in the renderer.

## Commands

- `/personal-log` — add or update any career data: companies, projects, profile sections (certifications, awards, skills, languages, etc.)
- `/setup-archetypes` — bootstrap or update `agents-ref/archetypes.yaml`. Run once before first `/draft-cv` use; re-run when target roles change.
- `/draft-cv [JD]` — analyse JD, detect archetype, select and score projects, produce `analysis.md` + `draft-cv.yaml`
- `/resumx-cv [seed]` — render a seed YAML into ResumeX-compatible Markdown for paste into the browser playground *(frozen — no new features)*
- `/latex-cv [seed]` — render a seed YAML into a compilable LaTeX `.tex` file (Harvard style, xelatex)
- `/html-cv [seed]` — render a seed YAML into a browser-previewable HTML file; export PDF via browser print or `./html-to-pdf` (clickable links, requires `npm install` in `bin/` once)
- `/draft-letter [seed]` — draft a tailored cover letter from a prior `/draft-cv` run; produces `draft-letter.yaml`
- `/html-letter [seed]` — render `draft-letter.yaml` into a browser-previewable HTML file (modern theme); export PDF via browser print
- `/lint-data` — validate all `personal-data/` files against schema rules; report errors and warnings by file
- `/lint-toolkit` — validate the full toolkit (skills, agents-ref, themes, bin, docs, evals, CLAUDE.md alignment) *(tool-developer command)*

## When editing data files

- Follow enum values and tag taxonomy in `agents-ref/schema.md` exactly
- Stack names must follow the naming convention in `agents-ref/schema.md` (e.g. `ReactJS` not `react`)
- Project file names: `[company_slug]-[project_name].md` (underscores within name groups, hyphen between company and project)
- Company file names: `[company_slug].md` (underscores between words)

## When editing skill files

Skill files live in `.claude/skills/[skill-name]/SKILL.md`. They are prompt instructions for Claude — not code. When improving them:
- Explain the *why* behind rules, not just the *what*
- Include examples of good vs bad output where rules could be misapplied
- Keep `agents-ref/schema.md` as the single source of truth for enums and taxonomy — do not duplicate in skill files
