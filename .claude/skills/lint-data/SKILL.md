---
name: lint-data
description: >
  Validate all personal-data/ files against schema rules and report errors and warnings by file.
  Use this skill whenever the user wants to: audit their data for quality issues before running
  /draft-cv, catch accumulated errors in project or company files, verify schema compliance after
  bulk edits, or run /lint-data.
  Trigger when the user says "/lint-data", "check my data", "validate my projects",
  "audit personal-data", or "are there any issues with my data files".
  Do NOT trigger for generating or rendering CVs — use /draft-cv and renderer commands for those.
license: AGPL-3.0
compatibility: >
  Compatible with any Agent Skills-aware runtime that supports file-based skill activation.
  Does not write or modify files.
metadata:
  author: tiennt0212
  version: 1.0.1
  introduced_in: v1.0.0
allowed-tools: Read Bash(find:*) Bash(grep:*)
---

# Lint Data — personal-data/ Validator

Scan all files in `personal-data/` and report schema violations. The goal is to surface issues
before they silently degrade `/draft-cv` output or produce a broken CV.

## Arguments

$ARGUMENTS — optional. If provided, treat as a path to a specific file or directory to lint
instead of all of `personal-data/`. If omitted, lint everything.

---

## Step 1 — Load the schema

Read `agents-ref/schema.md` in full. This is the single source of truth for:
- Valid `type` enum values for projects and companies
- Valid `size` enum values for companies
- Tag taxonomy (all valid tag names)
- Stack naming convention table
- Date format rules
- Section rules (Description, Achievements, Valued Inputs)

Do not rely on hardcoded enum lists in this skill — always defer to `agents-ref/schema.md`.

---

## Step 2 — Discover files

Read all files to lint:
- `personal-data/projects/*.md` — skip `README.md` and any file starting with `example_`
- `personal-data/companies/*.md` — skip `README.md` and any file starting with `example_`
- `personal-data/profile.md` — light check only (see Step 5)

Build the list of valid company slugs: every filename in `personal-data/companies/` (without `.md`
extension, excluding READMEs and `example_*` files). This list is used to validate the `company`
field in project files.

---

## Step 3 — Lint project files

For each project file, run all checks below. Collect every issue — do not stop at the first one.

### 3.1 — Frontmatter field checks

| Field | Severity | Check |
|-------|----------|-------|
| `title` | ERROR | present and non-empty |
| `company` | ERROR | present; value must be `"personal"` or match a slug in the company slugs list from Step 2 |
| `role` | ERROR | present and non-empty |
| `dates` | ERROR | present; format and valid month abbreviations per `agents-ref/schema.md` § dates — check: en-dash separator not hyphen, 3-char month abbreviation, "Present" capitalised if open-ended |
| `type` | ERROR | present; must be one of the valid project type enum values from `agents-ref/schema.md` |
| `tags` | ERROR | present; must be a non-empty list; every value must exist in the tag taxonomy in `agents-ref/schema.md` |
| `stack` | WARN | present; each value should match the naming convention in `agents-ref/schema.md` — flag common violations (e.g. `react` → `ReactJS`, `tailwind` → `TailwindCSS`, `next.js` → `NextJS`) |
| `superseded_by` | ERROR | if present, must match an existing project filename slug (i.e., a file `personal-data/projects/{value}.md` must exist) |

**Why these severities:** Missing or invalid required fields will cause `/draft-cv` to misclassify,
skip, or misrepresent the project. Stack naming mismatches are WARN because they don't break
pipeline logic, but they do degrade tag scoring and may cause `/draft-cv` to miss skill matches.

### 3.2 — Section structure checks

| Check | Severity | Description |
|-------|----------|-------------|
| `## Description` exists | ERROR | Section must be present |
| `## Achievements` exists | ERROR | Section must be present |
| `## Valued Inputs` exists | WARN | Section should be present; absence reduces `/draft-cv` ability to detect ownership signals |
| Description contains achievement language | WARN | Flag if Description contains result markers: percentages (%), words like "improved", "reduced", "increased", "achieved", "delivered", "launched", specific numbers followed by a unit. Description is context only — achievements belong in the Achievements section. |
| Achievements has at least one bullet | ERROR | The section must not be empty |
| Achievements — weak verb bullets | WARN | Per `agents-ref/cv-bullet-rules.md`: flag any bullet that opens with a weak verb (e.g. "Responsible for", "Helped", "Assisted", "Participated", "Worked on"). These describe assignment, not ownership. |
| Achievements — no measurable result | WARN | Per `agents-ref/cv-bullet-rules.md`: if *no* bullet in the section contains a measurable or specific result (a number, percentage, scale, or concrete outcome), flag the entire section. At least one bullet should answer "so what?" with something verifiable. |

**Why bullet quality matters here:** These files are the source of truth that `/draft-cv` draws
from. Weak bullets in `personal-data/` propagate to the CV — `/draft-cv` can rewrite for tone
but cannot invent results that don't exist in the data.

---

## Step 4 — Lint company files

For each company file, run all checks below.

### 4.1 — Frontmatter field checks

| Field | Severity | Check |
|-------|----------|-------|
| `name` | ERROR | present and non-empty |
| `industry` | ERROR | present and non-empty |
| `type` | ERROR | present; must be one of the valid company type enum values from `agents-ref/schema.md` |
| `size` | ERROR | present; must be one of the valid size enum values from `agents-ref/schema.md` |
| `location` | ERROR | present and non-empty |
| `working_time_range` | ERROR | present; same date format rules as project `dates` — en-dash, 3-char months, valid range or "Present" |

### 4.2 — Body check

| Check | Severity | Description |
|-------|----------|-------------|
| Body is non-empty | WARN | The company description (below frontmatter) should have at least 1 sentence |

---

## Step 5 — Lint profile.md (light check)

If `personal-data/profile.md` exists, run a light structural check only:

| Check | Severity | Description |
|-------|----------|-------------|
| `career_start` present | WARN | If missing, `/draft-cv` cannot compute years of experience for seniority fit assessment |
| `## Skills` section exists | WARN | Skills section is used by `/draft-cv` for skill coverage scoring |
| `## Education` section exists | INFO | Not required but common in most CVs |

Do not validate profile content in depth — it is free-form prose and the schema does not define
a strict format for all sections.

---

## Step 6 — Produce the report

Format the report as follows. Group issues by file. Files with no issues get a single ✓ line.

```
## Lint Report — personal-data/

### projects/company-project.md
- [ERROR] company: slug "xyz_corp" not found in personal-data/companies/
- [WARN]  dates: uses hyphen (-) instead of en-dash (–) — "Aug 2023 - Feb 2024"
- [WARN]  stack: "react" should be "ReactJS" (see agents-ref/schema.md)
- [WARN]  achievements: no bullet contains a measurable result

### projects/another-project.md
✓ No issues found

### companies/my_company.md
- [ERROR] type: "contract" is not a valid enum value — expected one of: product | outsource | agency | freelance

### profile.md
- [WARN]  career_start: missing — /draft-cv cannot compute years of experience

---
Summary: 2 errors, 3 warnings, 0 info across 5 files
Fix errors first — they break /draft-cv logic. Warnings affect CV quality but won't block generation.
```

**Severity key:**
- `[ERROR]` — will cause `/draft-cv` to fail, misclassify, or silently produce wrong output
- `[WARN]` — won't block generation but degrades quality or scoring accuracy
- `[INFO]` — informational only; no action required

If all files pass, output:
```
## Lint Report — personal-data/

All X files passed — no issues found.
```

---

## Step 7 — Suggest next steps

After the report, add one short line:

- If there are errors: "Fix errors before running `/draft-cv` — they will cause incorrect output."
- If only warnings: "Run `/draft-cv` when ready — warnings won't block generation but address them for better CV quality."
- If all clean: "Dataset is clean. Run `/draft-cv [JD]` to start tailoring."
