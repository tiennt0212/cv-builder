# AI Agent Instructions

## Project overview

This is a **public template repository**. Anyone can clone or fork it and use it as a personal CV management tool. The repo itself contains no personal data — users populate `personal-data/` and `jobs/` after cloning. An `examples` branch exists with sample data for reference and testing.

Each user uses skills to maintain a structured dataset of their own work experience and generate tailored CVs from it. When an AI agent is running in a cloned copy of this repo, it is acting as a personal assistant to that specific user — `personal-data/` contains their data, not the repo maintainer's.

## Key files to know

- `agents-ref/schema.md` — read this first before touching any data files. Defines all enums, tag taxonomy, naming conventions, and section rules.
- `personal-data/profile.md` — candidate's personal info, skills, education, awards (created by the `personal-log` skill from `agents-ref/profile-template.md`)
- `personal-data/companies/*.md` — one file per employer
- `personal-data/projects/*.md` — one file per project/role
- `jobs/[company-role]/` — output files land here. Each application folder contains a `YYYY-MM-DD_HH-MM_jd.md` (saved manually) and one timestamped subfolder per `draft-cv` run containing `analysis.md` + `draft-cv.yaml`. Renderer outputs go into further subfolders (`html-cv/`) inside the run folder.
- `agents-ref/archetypes.yaml` — live archetype data, populated by the `setup-archetypes` skill. Run once before first `draft-cv` use. Archetype field schema is documented in `agents-ref/schema.md`.
- `.claude/skills/` — skill instruction files (canonical source). Claude Code reads from here.
- `.agents/skills/` — symlink to `.claude/skills/`; read by all other Agent Skills-compatible agents (Cursor, Gemini CLI, Codex, etc.).

## Data architecture

The system has three layers. Each layer has a strict responsibility boundary:

1. **`personal-data/`** — raw facts, format-agnostic. `profile.md` stores all candidate sections as-is: languages, certifications, awards, education, skills. Companies and projects are each in their own files. Nothing here is tailored to any specific job.

2. **`draft-cv`** — selects, filters, aggregates, and transforms data into a seed YAML. It decides *what* goes into the CV and *how it is structured*: which projects to include, which bullets to write, how to group experience, whether to show role progression. The seed contains actual prose.

3. **Renderer skills** (`html-cv`, etc.) — take a seed YAML and apply format-specific styling. They make *zero content decisions*. Layout, heading style, date format, link rendering — all theirs. Content — not theirs.

**Rule:** if a decision affects what the reader learns, it belongs in `draft-cv`. If it only affects how it looks, it belongs in the renderer.

## Skills

Skills are the primary way to interact with this toolkit. Claude Code invokes these as `/skill-name`; other agents invoke by skill name.

| Skill | What it does |
|-------|-------------|
| `personal-log` | Add or update career data — projects, companies, certifications, skills, etc. |
| `setup-archetypes` | Define target role archetypes in `agents-ref/archetypes.yaml`. Run once; re-run when target roles change. |
| `draft-cv` | Analyse a JD, score projects, detect archetype, produce `analysis.md` + `draft-cv.yaml` |
| `html-cv` | Render seed to browser-previewable HTML — export PDF via browser print or `./html-to-pdf` |
| `draft-letter` | Draft a tailored cover letter from a prior `draft-cv` run — produces `draft-letter.yaml` |
| `html-letter` | Render `draft-letter.yaml` into a browser-previewable HTML cover letter |
| `lint-data` | Validate all `personal-data/` files against schema rules; report errors and warnings by file |
| `lint-toolkit` | Validate the full toolkit for structural integrity *(tool-developer skill)* |
| `skill-creator` | Create, modify, and performance-test skills; scaffold new skill files with correct frontmatter and structure *(tool-developer skill)* |
| `dev-harness` | Autonomous OODA-loop harness for skill development — orchestrates Planner, Implementer, Checker, Eval, and PR sub-agents with lint-driven remediation *(tool-developer skill)* |

## When editing data files

- Follow enum values and tag taxonomy in `agents-ref/schema.md` exactly
- Stack names must follow the naming convention in `agents-ref/schema.md` (e.g. `ReactJS` not `react`)
- Project file names: `[company_slug]-[project_name].md` (underscores within name groups, hyphen between company and project)
- Company file names: `[company_slug].md` (underscores between words)

## When editing skill files

Skill files live in `.claude/skills/[skill-name]/SKILL.md` (also accessible via `.agents/skills/`). They are prompt instructions for AI agents — not code. When improving them:
- Explain the *why* behind rules, not just the *what*
- Include examples of good vs bad output where rules could be misapplied
- Keep `agents-ref/schema.md` as the single source of truth for enums and taxonomy — do not duplicate in skill files
- Examples in skill files must be fictional. Never use values from `personal-data/`, `jobs/`, or any files from those directories loaded in context as examples — even as illustration. Invent fictional examples instead.

## Branch hygiene for personal data

This is a public repo — pushing `personal-data/`, `jobs/`, or `agents-ref/archetypes.yaml` to `origin` would expose the user's personal information to the internet. Users keep all such commits on a local `personal` branch that is never pushed upstream.

Surface this guidance proactively when the user is about to make their first data commit, or when they ask about git workflow:
- Create `personal` branch once after cloning: `git checkout -b personal`
- Commit all `personal-data/`, `jobs/`, and `agents-ref/archetypes.yaml` changes here
- After a toolkit release: `git fetch origin && git rebase origin/master` to stay current without losing data
- Never run `git push origin personal`

Full details in the **Personal branch** section of [MAINTAINERS.md](MAINTAINERS.md).

## When releasing

Before cutting a release, read [MAINTAINERS.md](MAINTAINERS.md). It defines the branching model (`canary` → `master` → tag), branch naming conventions, versioning rules, and the full release checklist including how to keep long-lived branches in sync after each release.
