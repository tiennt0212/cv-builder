---
name: lint-toolkit
description: >
  Validate the cv-builder toolkit for structural integrity, coupling drift, and internal
  consistency. Covers: skills, agents-ref, themes, bin/html-to-pdf script chain, docs, evals,
  and CLAUDE.md alignment. This is a tool-developer command — use it when maintaining or
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
`skills`, `agents-ref`, `themes`, `bin`, `docs`, `evals`, `claude-md`.
If omitted, run all sections.

---

## Step 1 — Load reference files

Read these before running any checks:

1. `agents-ref/schema.md` — current enum values, tag taxonomy, stack naming convention
2. `.claude/skills/draft-cv/schema.yaml` — seed YAML schema; defines all fields `/draft-cv`
   produces and renderers consume
3. `CLAUDE.md` — user-facing command list and project instructions

---

## Step 2 — Section A: Skills integrity

Read every `.claude/skills/*/SKILL.md`.

### A1 — Frontmatter completeness

| Check | Severity | Description |
|-------|----------|-------------|
| `name` field present | ERROR | Skill cannot be discovered without a name |
| `description` field present | ERROR | Used by Claude to decide when to invoke the skill |
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

**Why this matters:** A missing file reference fails silently at runtime. Claude either
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
/draft-cv → draft-cv.yaml (schema: .claude/skills/draft-cv/schema.yaml)
          → /html-cv     reads draft-cv.yaml
          → /latex-cv    reads draft-cv.yaml
          → /resumx-cv   reads draft-cv.yaml
```

**Chain B — Cover letter:**
```
/draft-cv    → analysis.md + draft-cv.yaml
/draft-letter reads analysis.md + draft-cv.yaml → draft-letter.yaml
/html-letter  reads draft-letter.yaml
```

For CV renderer skills (`html-cv`, `latex-cv`, `resumx-cv`):
- Does it reference `.claude/skills/draft-cv/schema.yaml` as the seed schema? If not → WARN
- Does it read `draft-cv.yaml` as input? If wrong → ERROR

For the letter renderer skill (`html-letter`):
- Does it reference `.claude/skills/draft-letter/SKILL.md` Step 8 for the `draft-letter.yaml`
  field specification? If not → WARN (note: `html-letter` consumes `draft-letter.yaml`, not
  `draft-cv.yaml` — requiring it to cite `draft-cv/schema.yaml` would be wrong)
- Does it read `draft-letter.yaml` as input? If wrong → ERROR

For `draft-letter`:
- Does it produce `draft-letter.yaml`? If different output name → ERROR
- Does it read `analysis.md` from the same run folder? If not → WARN

### A5 — Cross-skill duplication

Flag as WARN when rules appear verbatim across multiple skills instead of in a shared reference:
- Bullet quality rules (should cite `agents-ref/cv-bullet-rules.md`)
- Stack naming corrections (should cite `agents-ref/schema.md`)
- Tag taxonomy (should cite `agents-ref/schema.md`)
- Date format rules (should cite `agents-ref/schema.md`)

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

The theme system has two distinct layers that must stay in sync:
1. **AI instruction files** at `.claude/skills/{skill}/themes/{name}/` — tell Claude how to
   generate the HTML/LaTeX structure for that theme
2. **CSS/template assets** at `themes/{name}/` — the actual stylesheets referenced by
   generated HTML files

Both layers must exist for a theme to work end-to-end. A missing CSS file means the user's
generated CV has no styling.

**For each theme name found in `html-cv` SKILL.md** (currently `harvard` and `modern`):
- `.claude/skills/html-cv/themes/{name}/instructions.md` exists → ERROR if missing
- `themes/{name}/style.css` exists → ERROR if missing

**For each theme name found in `html-letter` SKILL.md** (currently `modern`):
- `.claude/skills/html-letter/themes/{name}/instructions.md` exists → ERROR if missing
- `themes/{name}/letter.css` exists → ERROR if missing

**For each theme name found in `latex-cv` SKILL.md** (currently `harvard`):
- `.claude/skills/latex-cv/themes/{name}/template.tex` exists → ERROR if missing

If theme directories exist in `themes/` but no skill references them → INFO (may be unused).

---

## Step 5 — Section D: bin/ + html-to-pdf script chain

The `./html-to-pdf` script is the recommended PDF export path. Its chain is:
`html-to-pdf` (root) → `bin/build-cv.js` → `bin/package.json` dependencies

| Check | Severity | Description |
|-------|----------|-------------|
| `html-to-pdf` script exists at repo root | ERROR | Users can't export PDF; CLAUDE.md references it |
| `bin/build-cv.js` exists | ERROR | `html-to-pdf` calls this directly; missing → runtime error |
| `bin/package.json` exists | ERROR | Required for `npm install` — without it, dependencies can't be installed |
| `html-to-pdf` references `bin/build-cv.js` by correct relative path | WARN | If the path in the script doesn't match the actual file location, it will fail on any machine |

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

## Step 8 — Section G: CLAUDE.md alignment

| Check | Severity | Description |
|-------|----------|-------------|
| Skill in `.claude/skills/` not listed in `CLAUDE.md` ## Commands | WARN | Undiscoverable by users (acceptable for developer-only skills — note which ones) |
| Command listed in `CLAUDE.md` has no skill file | ERROR | Listed command does not work |

---

## Step 9 — Produce the report

Format the report grouped by section. Sections with no issues get a single ✓ line.

```
## Toolkit Lint Report

### A — Skills (8 files)
  draft-cv/SKILL.md
  - [WARN]  A3: hardcodes type enum values inline — should cite agents-ref/schema.md
  html-cv/SKILL.md ✓
  personal-log/SKILL.md ✓
  ... (one line per clean skill)

### B — agents-ref
  - [ERROR] B: agents-ref/project-template.md referenced by personal-log but does not exist

### C — Themes
  html-cv → harvard ✓
  html-cv → modern ✓
  html-letter → modern ✓
  latex-cv → harvard ✓

### D — bin/ + html-to-pdf
  ✓ No issues found

### E — docs/ alignment
  - [INFO]  E: lint-data, lint-toolkit have no mention in docs/ (expected — developer-only commands)

### F — evals/
  - [WARN]  F1: criteria.md references "_2_analysis.md" — draft-cv produces "analysis.md"
  - [WARN]  F1: criteria.md references "_3_seed.yaml" — draft-cv produces "draft-cv.yaml"
  sample-projects/no-results.md
  - [WARN]  F2: stack: "vuejs" should be "VueJS"

### G — CLAUDE.md alignment
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

Sections: Skills ✓ · agents-ref ✓ · Themes ✓ · bin ✓ · docs ✓ · evals ✓ · CLAUDE.md ✓
```

---

## Step 10 — Suggest next steps

- If pipeline ERRORs: "Fix pipeline errors immediately — renderers are producing incomplete output."
- If file reference ERRORs: "Fix broken references before the next release."
- If only warnings: "Warnings are drift risks — address before the next schema update."
- If all clean: "Toolkit is healthy. Safe to update skills or agents-ref/schema.md."
