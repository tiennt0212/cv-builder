---
name: html-cv
description: >
  Render a CV seed YAML into a browser-previewable HTML file. The output
  opens directly in any browser — no build step required. Use this skill whenever the user
  wants to: generate an HTML or PDF CV from a seed file, render their drafted CV without a
  LaTeX engine, or produce a portable CV using only a browser.
  Trigger when: "generate HTML CV", "build PDF from seed", "render CV to HTML", "html-cv".
  Do NOT trigger for drafting content — use /draft-cv for that.
---

# HTML CV Skill

## Overview

This skill reads a `draft-cv.yaml` seed file and produces a `cv({theme}).html` that:
- Opens in any browser for immediate preview — no build step needed
- PDF export via two paths:
  - **Browser print** (`File > Print → Save as PDF`) — zero setup, links not clickable
  - **`./html-to-pdf <file>`** — requires one-time `npm install` in `bin/`, produces PDF with clickable links
- Supports multiple visual themes: **harvard** (serif, classic) and **modern** (sans-serif, teal accents)

---

## Seed Schema

The seed schema is at `.claude/skills/draft-cv/schema.yaml`. Key points:
- `experience[].projects[]` — `title` and `dates` are OPTIONAL
- `experience[].location` — render if present in seed; omit entirely if absent
- `contact.location` — always render in harvard theme; omitted from contact bar in modern theme
- `contact.linkedin` / `contact.github` — handles only (not full URLs)
- `meta.target_role` — used as the role subtitle in the modern theme header
- `summary` — plain prose; render as-is
- Bullets may contain `**bold**` — convert to `<strong>bold</strong>`

---

## Instructions

### Step 1 — Determine theme

Check the user's message for explicit theme signals:
- `--theme harvard`, or keywords: "harvard", "classic", "serif" → use **harvard**
- `--theme modern`, or keywords: "modern", "teal", "sans-serif", "contemporary" → use **modern**

If no theme signal is present, ask the user before reading any files:

> Which theme would you like?
> - **harvard** — serif (EB Garamond), classic layout, horizontal rule section dividers. Good for conservative industries and traditional roles.
> - **modern** — sans-serif (Inter), teal accents, no rules. Good for product companies and startups.

Wait for the user's answer, then continue to Step 2 with the chosen theme.

### Step 2 — Read inputs

1. Read `.claude/skills/draft-cv/schema.yaml` for the full seed structure.
2. Read the seed YAML at the provided path.
3. Read the theme-specific HTML structure instructions:
   - Harvard: `.claude/skills/html-cv/themes/harvard/instructions.md`
   - Modern: `.claude/skills/html-cv/themes/modern/instructions.md`

### Step 3 — Generate `cv({theme}).html`

Follow the theme instructions exactly for HTML structure and stylesheet links.
Apply the shared rules below.

### Step 4 — Save and inform

Save to `[parent folder of seed]/html-cv/cv({theme}).html`.

Example: seed at `jobs/tnt_lab-frontend_react/2026-04-02_13-16/draft-cv.yaml` rendered with `--theme modern`
→ save to `jobs/tnt_lab-frontend_react/2026-04-02_13-16/html-cv/cv(modern).html`

Example: same seed rendered with `--theme harvard`
→ save to `jobs/tnt_lab-frontend_react/2026-04-02_13-16/html-cv/cv(harvard).html`

Inform the user:
- **Preview:** open `cv({theme}).html` in any browser.
- **Export to PDF (browser):** `File > Print → Save as PDF` — zero setup, but links will not be clickable.
- **Export to PDF (recommended):** `./html-to-pdf cv({theme}).html` — produces a PDF with clickable links. Requires running `npm install` once in the `bin/` folder if not already done.

---

## Shared Rules (apply to all themes)

### Bold conversion
Convert `**bold**` in bullet text to `<strong>bold</strong>`.

### HTML escaping
Escape special characters in all text content:
- `&` → `&amp;`
- `<` → `&lt;`
- `>` → `&gt;`

### Optional fields — omit entirely
- Omit `<span>`, `<div>`, or `<section>` elements when the source field is absent from the seed — no empty elements.
- Omit the Core Competencies section entirely if `competencies` is absent from the seed.
- Omit GitHub contact item if `contact.github` is absent.
- Omit `project-dates` span if project has no dates.
- Omit GPA span if education entry has no gpa.
- For `kind: award`, `kind: certification`, and `kind: publication` entries in `sections[]`: if the entry has a `description` field, render it as a secondary line below the title — use a `<span class="entry-description">` element. Omit the span entirely if `description` is absent.

### Date format
Use `–` (en dash) for date ranges: `Dec 2025 – Present`.

### No inline styles
Never add `<style>` blocks or inline `style=` attributes — all styling comes from the linked theme stylesheet.

### Sections ordering
Render sections in the order they appear in the seed:
1. Summary
2. Core Competencies (if present)
3. Experience
4. Skills
5. All `sections[]` entries in order (Education, Certifications, Awards, etc.)
