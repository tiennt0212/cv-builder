---
name: resumx-cv
description: >
  Render a CV seed YAML file into ResumeX-compatible Markdown, ready to paste into
  the ResumeX browser playground for preview and PDF download.
  Use this skill whenever the user wants to: render their drafted CV to ResumeX format,
  generate a Markdown CV from a seed file, or run /resumx-cv.
  Trigger when the user says "render my CV", "generate ResumeX CV", or provides a seed path.
  Requires a draft-cv.yaml seed file produced by /draft-cv. Do NOT draft new content — read seed as-is.
  Do NOT trigger for writing or drafting CV content — use /draft-cv for that.
---

# ResumeX CV — Render from Seed

Convert a `draft-cv.yaml` file into a ResumeX-compatible Markdown CV, ready to paste into the ResumeX browser playground for preview and download.

## Arguments
$ARGUMENTS — path to a `draft-cv.yaml` file.

---

## Step 1 — Read the seed

Read the YAML file at the provided path. For the full field specification, see `.claude/skills/draft-cv/schema.yaml`. All content decisions (which projects to include, what bullets to write, skills ordering) are already made — do not change any content. This command only transforms structure and applies rendering format.

---

## Step 2 — Render to Markdown

Map each YAML field to the Markdown structure below. All rendering decisions live here — not in the seed.

### Contact block

```
# [contact.name]

[contact.location] | [contact.email] | [contact.phone] | [contact.linkedin](https://linkedin.com/in/[contact.linkedin]) | [contact.github](https://github.com/[contact.github])
```

### Summary

```
## Professional Summary

[summary]
```

### Core Competencies (render only if `competencies` field is present in seed)

Insert between Summary and Experience:

```
## Core Competencies

[phrases joined by " · "]
```

Example output:
```
## Core Competencies

API Architecture · LLM Integration · React Application Architecture · CI/CD Pipelines · Design System · Performance Optimisation
```

Omit the section entirely if the field is absent from the seed.

### Experience

For each entry in `experience`:

```
## Experience

### [company] — [location]   ← omit "— [location]" if location field is absent from seed entry
**[role]** | [dates]
```

If the entry has `projects` with a `title` field, render sub-project headers:

```
**[project.title]** | [project.dates]
- [bullet]
- [bullet]
```

If a project has no `title` (single undivided role), render bullets directly under the company header with no sub-heading.

Dates: always right-align using `hfill` equivalent — for Markdown, place dates after a `|` separator on the same line as the heading.

### Skills

```
## Skills

**[category]:** [items joined by ", "]
```

One line per category.

### Education

```
## Education

**[degree]** — [institution]
[gpa] | [dates]
```

Omit the GPA line if not present in seed.

### Sections (Education, Awards, Publications, Certifications)

Render each `sections[]` entry under its `heading`. For `kind: award`, `kind: certification`, and `kind: publication`:

```
- **[title]** — [issuer or venue] | [date]   ← if no url and no description
- **[title]** — [issuer or venue] ([url domain]([url])) | [date]   ← if url, no description
- **[title]** — [issuer or venue]: [description] ([url domain]([url])) | [date]   ← if both url and description
- **[title]** — [issuer or venue]: [description] | [date]   ← if description, no url
```

Rules:
- `issuer` (awards/certifications) or `venue` (publications) always appears after the em-dash.
- `description` is optional — append after `[issuer]:` if present; omit entirely if absent.
- Omit the URL portion if no `url` key in the seed entry.
- Omit the entire section if the heading's `entries` array is empty.

---

## ATS formatting rules

These apply to the rendered Markdown output:

- Single-column layout only — no tables, no multi-column structures
- No images or icons
- Bold (`**text**`) only for sub-project titles, role names, or key terms carried over from the seed — not decorative additions
- Links: use readable anchor text — never raw long URLs
- Standard ATS-parseable section headings: "Experience", "Skills", "Education", "Awards & Publications" — no creative variants
- Acronyms: if the seed content already spells them out, preserve that. Do not re-expand or re-abbreviate.

---

## Step 3 — Save output

Save the rendered file into a `resumx-cv/` subfolder inside the seed's parent folder:

```
[parent folder of seed]/resumx-cv/cv.md
```

Example: if the seed is `jobs/tnt_lab-frontend_react/2026-04-02_13-16/draft-cv.yaml`, save to `jobs/tnt_lab-frontend_react/2026-04-02_13-16/resumx-cv/cv.md`.

After saving, confirm the path and instruct: "Paste the contents of this file into the ResumeX playground to preview and download your PDF."
