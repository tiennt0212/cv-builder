---
name: lint-toolkit
description: >
  Validate the cv-builder toolkit for structural integrity, coupling drift, and internal
  consistency. Covers: skills, agents-ref, themes, bin/html-to-pdf script chain, docs, evals,
  and agent context files alignment. This is a tool-developer command — use it when maintaining or
  extending the toolkit, before releasing changes, or after editing any non-user-data file.
  Trigger when the user says "/lint-toolkit", "audit the toolkit", "check the skills",
  "validate toolkit files", or "are the skills consistent".
  Do NOT trigger for user data issues — use /lint-data for personal-data/ validation.
---

# Lint Toolkit — cv-builder Integrity Validator

Audit every fixed component of the cv-builder toolkit for coupling drift and broken references.
This skill is for the tool developer, not end users.

**What this skill checks and why it matters:**
The cv-builder is a multi-component system where components reference each other. When one
component changes (a skill is updated, a theme is renamed, a schema enum is added), other
components may silently fall out of sync. This skill surfaces that drift before it reaches users.

**What this skill does NOT check:**
- `personal-data/` and `jobs/` — user data; use `/lint-data` for those.
- Governance files (`README.md`, `LICENSE`, `CODE_OF_CONDUCT.md`, etc.) — static text with
  no coupling to other components.

## Arguments

$ARGUMENTS — optional. Pass a section name to run only that section:
`skills`, `agents-ref`, `themes`, `bin`, `docs`, `evals`, `agent-md`.
If omitted, run all sections.

---

## Step 1 — Load reference files

Read these before running any checks:

1. `agents-ref/schema.md` — current enum values, tag taxonomy, stack naming convention
2. `.claude/skills/draft-cv/schema.yaml` — seed YAML schema; defines all fields `/draft-cv`
   produces and renderers consume
3. Agent context files — `AGENTS.md` and `CLAUDE.md`. Read both if they exist.

---

## Step 2 — Section A: Skills integrity

Read every `.claude/skills/*/SKILL.md`.

### A1 — Frontmatter completeness

| Check | Severity | Description |
|-------|----------|-------------|
| `name` field present | ERROR | Skill cannot be discovered without a name |
| `description` field present | ERROR | Used by the AI agent to decide when to invoke the skill |
| Trigger conditions in description | WARN | No "Trigger when" or "Use this skill when" → inconsistent invocation |
| "Do NOT trigger" guard present | INFO | Prevents overlap between similar-purpose skills |

### A2 — File reference integrity

Extract every file path referenced in each skill body (quoted paths, backtick paths, "Read X"
instructions). For each:
- **Concrete path** (no wildcards): verify the file exists → ERROR if missing
- **Glob/directory pattern** (e.g. `personal-data/projects/*.md`): verify the base directory
  exists → ERROR if missing
- **Runtime-generated paths** (e.g. `jobs/[company-role]/draft-cv.yaml`): skip — these are
  user outputs, not toolkit files

**Why this matters:** A missing file reference fails silently at runtime. The AI agent either
hallucinates the content or returns an error the user has to debug on their own.

### A3 — Schema coupling drift

Scan each skill for values that should defer to `agents-ref/schema.md` but are hardcoded:

- **Hardcoded enum lists** (e.g. `product | outsource | freelance | open-source | hackathon`
  stated as a rule, not as an example): compare against current values in `agents-ref/schema.md`.
  If they match → WARN (will drift on next schema update).
  If they differ → ERROR (already wrong).
- **Stack naming tables** reproduced in a skill body → WARN (belongs in `agents-ref/schema.md`)
- **Tag taxonomy lists** embedded in a skill → WARN (belongs in `agents-ref/schema.md`)
- **Bullet quality rules** stated in full rather than citing `agents-ref/cv-bullet-rules.md` → WARN

The correct pattern is always: "see `agents-ref/schema.md`" or "apply rules from
`agents-ref/cv-bullet-rules.md`" — not re-stating the rules inline.

### A4 — Pipeline chain integrity

Verify both chains are intact end-to-end.

**Chain A — CV generation:**
```
/draft-cv          → draft-cv.yaml (schema: .claude/skills/draft-cv/schema.yaml)
./bin/render-cv    reads draft-cv.yaml + themes/<theme>/template.hbs → cv(<theme>).html
```

**Chain B — Cover letter:**
```
/draft-cv             → analysis.md + draft-cv.yaml
/draft-letter         reads analysis.md + draft-cv.yaml → draft-letter.yaml
./bin/render-letter   reads draft-letter.yaml + themes/<theme>/letter.hbs → letter(<theme>).html
```

For the CV renderer CLI (`bin/render-cv`):
- The script must exist at `bin/render-cv` and be executable → ERROR if missing or not +x
- It must require `themes/<theme>/template.hbs` and `themes/<theme>/style.css` for each advertised theme → ERROR if either file missing

For the letter renderer CLI (`bin/render-letter`):
- The script must exist at `bin/render-letter` and be executable → ERROR if missing or not +x
- It must require `themes/<theme>/letter.hbs` and `themes/<theme>/letter.css` for each advertised theme → ERROR if either file missing

For `draft-letter`:
- Does it produce `draft-letter.yaml`? If different output name → ERROR
- Does it read `analysis.md` from the same run folder? If not → WARN

### A5 — Cross-skill duplication

Flag as WARN when rules appear verbatim across multiple skills instead of in a shared reference:
- Bullet quality rules (should cite `agents-ref/cv-bullet-rules.md`)
- Stack naming corrections (should cite `agents-ref/schema.md`)
- Tag taxonomy (should cite `agents-ref/schema.md`)
- Date format rules (should cite `agents-ref/schema.md`)

### A6 — Personal data in skill files

Skill files are committed to the public template repo. Personal data from `personal-data/` and `jobs/` must never appear in them — not as examples, not as illustration, not accidentally.

**Step A6a — Collect identifiers from `personal-data/profile.md`:**
- `contact.email`
- `contact.phone`
- `contact.linkedin` (handle value, not a URL pattern)
- `contact.github` (handle value)
- Candidate's full name as a single string (first + last together, from the `name` field)

**Step A6b — Collect proper nouns from the rest of `personal-data/`:**
- If `personal-data/companies/` is empty or does not exist, skip this sub-step.
- If `personal-data/projects/` is empty or does not exist, skip this sub-step.
- For each file in `personal-data/companies/*.md`: extract the frontmatter `name` field
- For each file in `personal-data/projects/*.md`: extract the frontmatter `title` or `name` field

**Step A6c — Collect identifiers from `jobs/`:**
- If `jobs/` is empty or does not exist, skip this sub-step.
- List all direct subdirectories under `jobs/`. Each folder name is itself the slug — use it as-is.

**Scan:** For each extracted value from A6a–A6c, search every `.claude/skills/*/SKILL.md` for a whole-word, case-insensitive match (the value must be surrounded by non-alphanumeric characters — not a substring of a longer word). Skip values shorter than 4 characters.

| Check | Severity | Description |
|-------|----------|-------------|
| Contact identifier (A6a) found in a skill file | ERROR | Direct personal data in a public file — remove immediately |
| Company/project name (A6b) found in a skill file | WARN | User's personal data may be used as example — verify and replace with fictional data if so |
| Job folder slug (A6c) found in a skill file | WARN | Application target leaked into public skill — verify intent |

**Note:** Template placeholders like `[contact.linkedin]` or the word `handle` are not personal identifiers — only flag literal matches against actual extracted values.

---

## Step 3 — Section B: agents-ref integrity

`agents-ref/` contains the reference files that skills depend on. Missing files here break
multiple skills simultaneously.

Read the list of files in `agents-ref/`.

| File | Severity if missing | Used by |
|------|---------------------|---------|
| `agents-ref/schema.md` | ERROR | All skills that handle data |
| `agents-ref/cv-bullet-rules.md` | ERROR | `draft-cv`, `personal-log` |
| `agents-ref/profile-template.md` | ERROR | `personal-log` (first-time profile setup) |

For each of the above:
- Verify the file exists
- Verify at least one skill explicitly references it by path

If a file exists but no skill references it → INFO (may be orphaned documentation).

**`agents-ref/archetypes.yaml`** is runtime-generated by `/setup-archetypes` — skip existence
check. But if it exists, verify its structure matches the archetype schema defined in
`agents-ref/schema.md` (required fields: `name`, `signals`, `proof_points_priority`).

---

## Step 4 — Section C: Themes integrity

Themes live entirely under `themes/<name>/`. Each theme must ship the two files its renderer needs:

- **CV themes** must have both `themes/<name>/template.hbs` and `themes/<name>/style.css`
- **Letter themes** must have both `themes/<name>/letter.hbs` and `themes/<name>/letter.css`

Both files are required for a theme to work end-to-end. A missing CSS file means the user's generated CV has no styling; a missing `.hbs` file means the renderer will exit 1 with "template not found".

**For each CV theme advertised in `bin/render-cv`'s `VALID_THEMES` (currently `harvard` and `modern`):**
- `themes/{name}/template.hbs` exists → ERROR if missing
- `themes/{name}/style.css` exists → ERROR if missing

**For each letter theme advertised in `bin/render-letter`'s `VALID_THEMES` (currently `modern`):**
- `themes/{name}/letter.hbs` exists → ERROR if missing
- `themes/{name}/letter.css` exists → ERROR if missing

If theme directories exist in `themes/` but neither renderer advertises them → INFO (may be unused).

---

## Step 5 — Section D: bin/ scripts + agent symlink

`bin/` ships three scripts. Their chains:

- `./bin/render-cv` (Node CLI) → `bin/lib/render-common.js` + `bin/lib/md-helper.js` + `themes/<theme>/template.hbs` + `themes/<theme>/style.css`
- `./bin/render-letter` (Node CLI) → same `bin/lib/*` + `themes/<theme>/letter.hbs` + `themes/<theme>/letter.css`
- `./html-to-pdf` (root shell) → `bin/build-cv.js` (Puppeteer)

All require `bin/package.json` dependencies installed via `cd bin && npm install`.

| Check | Severity | Description |
|-------|----------|-------------|
| `bin/render-cv` exists and is executable | ERROR | Primary CV renderer; without it `/draft-cv`'s Next Step fails |
| `bin/render-letter` exists and is executable | ERROR | Primary letter renderer; without it `/draft-letter`'s Next Step fails |
| `bin/lib/render-common.js` exists | ERROR | Shared by both renderers |
| `bin/lib/md-helper.js` exists | ERROR | Required by render-common.js |
| `bin/package.json` declares `handlebars` and `js-yaml` | ERROR | Without them the renderers exit 2 with the friendly "run npm install" message |
| `html-to-pdf` script exists at repo root | ERROR | Optional PDF export path; AGENTS.md references it |
| `bin/build-cv.js` exists | ERROR | `html-to-pdf` calls this directly |
| `bin/package.json` declares `puppeteer` | ERROR | Required for the PDF export path |

**Agent symlink integrity:**

`.agents/skills/` is a symlink to `.claude/skills/`. All non-Claude-Code agents (Cursor, Gemini CLI, Codex, etc.) read skills from this path. A broken or missing symlink silently breaks those agents without affecting Claude Code.

| Check | Severity | Description |
|-------|----------|-------------|
| `.agents/skills` exists as a symlink | ERROR | Non-Claude-Code agents cannot discover any skills |
| Symlink target resolves to `.claude/skills/` | ERROR | Symlink exists but points to a wrong or deleted path — agents get an empty skill set |

---

## Step 6 — Section E: Documentation (docs/ + README files)

Documentation has two failure modes:
1. **Structural** — references a command or file that no longer exists (already caught by A2)
2. **Semantic** — describes behavior that is no longer accurate: wrong output paths, outdated
   theme names, features that were added or removed, directory structure that changed

This section catches both. The goal is not exhaustive correctness — omissions are acceptable.
The target is *active misinformation*: a reader following the docs would take the wrong action.

### E1 — docs/ structural checks

Extract every `/command-name` reference from all files in `docs/`.

| Check | Severity | Description |
|-------|----------|-------------|
| Command in docs has a corresponding skill file | ERROR | User will invoke a non-existent command |
| Skill file has no mention in any docs file | INFO | Acceptable for developer-only commands (`/lint-data`, `/lint-toolkit`) |

Also extract every file path referenced in docs — verify each exists → WARN if missing.

### E2 — Skill READMEs semantic accuracy

Every skill in `.claude/skills/*/README.md` describes what the skill does. Read both the
README and its corresponding SKILL.md, then check whether the README makes any claims that
contradict current behavior. Focus on concrete, verifiable claims — not tone or phrasing.

**Compare against the SKILL.md and supporting files:**

| Claim type | What to verify |
|------------|----------------|
| Output file names or paths | Does the README's output block match what SKILL.md actually produces? |
| Theme names supported | Does the README list the same theme names as those referenced in SKILL.md? |
| Input file name | Does the README's "Input" entry match the file the skill reads? |
| "Works with" / pipeline chain | Does the README describe the correct before/after commands? |
| Feature list ("Handles" / "Does not handle") | Does any listed feature contradict SKILL.md behavior? |

Severity guide:
- **WARN** — README would give a user incorrect expectations (e.g., lists wrong output path,
  mentions a theme that no longer exists, or omits a theme that was added)
- **INFO** — README omits a feature that was added (omission, not contradiction)

**Do not flag:**
- Wording or tone differences between README and SKILL.md
- README being less detailed than SKILL.md
- README describing the "idea" or "philosophy" in general terms

**Example of a real WARN:** README says output is `draft-cv.yaml` but SKILL.md now saves to
`_3_seed.yaml` — a user following the README would look for the wrong file.

### E3 — Directory READMEs structural accuracy

For READMEs that describe directory contents (`agents-ref/README.md`, `evals/README.md`,
`jobs/README.md`, `personal-data/companies/README.md`, `personal-data/projects/README.md`):

**What to check — directory structure claims only:**
- Does the README list files or subdirectories that no longer exist? → WARN
- Does the README omit entries for files or subdirectories that were added? → INFO

**What not to check:**
- Narrative descriptions of *why* a directory exists
- General guidance text (e.g., "do not edit directly")

For `agents-ref/README.md` specifically: compare its file table against the actual files
in `agents-ref/`. A row in the table pointing to a missing file → WARN.

### E4 — Root README.md command list

The root `README.md` is the entry point for all new users. Read it and extract every
`/command-name` reference.

| Check | Severity | Description |
|-------|----------|-------------|
| Command in root README has a corresponding skill file | ERROR | First thing a new user tries won't work |
| Root README describes an output path that has changed | WARN | User looks for a file that doesn't exist at that path |

---

## Step 7 — Section F: evals/ schema coupling

`evals/` is the toolkit's test infrastructure. Stale evals produce misleading results when
testing skill changes.

### F1 — criteria.md output file names

Read `evals/criteria.md`. Extract any output file names it asserts (e.g. `analysis.md`,
`draft-cv.yaml`, or any `_N_` prefixed variants).

Compare against what `draft-cv` SKILL.md actually produces. If the names differ → WARN
(criteria is testing for a file that the skill no longer produces under that name).

### F2 — sample-projects/ format check

Files in `evals/sample-projects/` are test harness scripts — each describes a scenario
to run against `/personal-log`, not a project data file. They are NOT expected to have
YAML frontmatter.

Check only:
- Each file has a `## Sample input to provide the command` section → WARN if missing
- Each file has an `## Expected behavior` section → WARN if missing
- Each file has a `## Failure condition` section → INFO if missing

### F3 — sample-jds/ presence

Verify `evals/sample-jds/` has at least one file → WARN if empty (no JDs = no end-to-end tests).

---

## Step 8 — Section G: agent-md alignment

Read the agent context files (`AGENTS.md`, `CLAUDE.md`) and locate the skills table.

| Check | Severity | Description |
|-------|----------|-------------|
| Skill in `.claude/skills/` not listed in the effective skills table | WARN | Undiscoverable by users (acceptable for developer-only skills — note which ones) |
| Skill listed in table has no corresponding skill file | ERROR | Listed skill does not work |

---

## Step 9 — Produce the report

Format the report grouped by section. Sections with no issues get a single ✓ line.

```
## Toolkit Lint Report

### A — Skills (8 files)
  draft-cv/SKILL.md
  - [WARN]  A3: hardcodes type enum values inline — should cite agents-ref/schema.md
  - [ERROR] A6: contains personal email address — remove before committing
  personal-log/SKILL.md ✓
  ... (one line per clean skill)

### B — agents-ref
  - [ERROR] B: agents-ref/project-template.md referenced by personal-log but does not exist

### C — Themes
  themes/harvard/template.hbs ✓
  themes/harvard/style.css ✓
  themes/modern/template.hbs ✓
  themes/modern/style.css ✓
  themes/modern/letter.hbs ✓
  themes/modern/letter.css ✓

### D — bin/ (render-cv, render-letter, html-to-pdf)
  bin/render-cv ✓
  bin/render-letter ✓
  ✓ No issues found

### E — docs/ alignment
  - [INFO]  E: lint-data, lint-toolkit have no mention in docs/ (expected — developer-only commands)

### F — evals/
  - [WARN]  F1: criteria.md references "_2_analysis.md" — draft-cv produces "analysis.md"
  - [WARN]  F1: criteria.md references "_3_seed.yaml" — draft-cv produces "draft-cv.yaml"
  sample-projects/no-results.md
  - [WARN]  F2: stack: "vuejs" should be "VueJS"

### G — agent-md
  ✓ No issues found

---
Summary: 1 error, 4 warnings, 1 info
Fix errors first — they represent broken references or non-functional commands.
Warnings indicate drift that won't break the toolkit today but will after the next update.
```

**Severity key:**
- `[ERROR]` — broken reference, missing file, or non-functional command; fix before next release
- `[WARN]` — coupling drift; won't break today but will silently fail after a future change
- `[INFO]` — informational; no action required

If all sections pass:
```
## Toolkit Lint Report — all checks passed

Sections: Skills ✓ · agents-ref ✓ · Themes ✓ · bin ✓ · docs ✓ · evals ✓ · agent-md ✓
```

---

## Step 10 — Suggest next steps

- If pipeline ERRORs: "Fix pipeline errors immediately — renderers are producing incomplete output."
- If file reference ERRORs: "Fix broken references before the next release."
- If only warnings: "Warnings are drift risks — address before the next schema update."
- If all clean: "Toolkit is healthy. Safe to update skills or agents-ref/schema.md."
