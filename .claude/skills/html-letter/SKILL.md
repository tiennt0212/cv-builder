---
name: html-letter
description: >
  Render a cover letter seed YAML (draft-letter.yaml) into a browser-previewable
  HTML file with the modern theme. The output opens directly in any browser — no
  build step required. Use this skill whenever the user wants to: render a drafted
  cover letter to HTML, generate a printable PDF cover letter from a seed file,
  or preview their cover letter without a word processor.
  Trigger on: "html-letter", "render cover letter", "generate HTML letter",
  "/html-letter".
  Do NOT trigger for drafting the cover letter — use /draft-letter for that.
---

# HTML Letter Skill

## Overview

This skill reads a `draft-letter.yaml` seed file and produces a `letter(modern).html` that:
- Opens in any browser for immediate preview
- Can be printed to PDF via browser File > Print (no build step needed)
- Uses the **modern** theme — same color palette and typography as the html-cv modern theme

Only the **modern** theme is supported.

---

## Seed Schema

Read `.claude/skills/draft-letter/SKILL.md` Step 8 for the full `draft-letter.yaml`
field specification. Key fields used by this renderer:

```
meta.target_role        — rendered as role subtitle in header
meta.company            — used in footer ref label
contact.*               — name, phone, email, linkedin, github (optional)
letter.date             — right-aligned date (optional)
letter.recipient        — optional block (name, title, company)
letter.salutation       — greeting line
letter.opening          — opening paragraph prose
letter.proof_points[]   — array of {title (internal), paragraph, jd_mapping}
                          title and jd_mapping are NOT rendered in HTML
letter.closing          — closing paragraph prose
letter.sign_off         — e.g. "Sincerely,"
letter.signature        — candidate full name
```

---

## Instructions

### Step 1 — Read inputs

1. Read the seed YAML at the provided path.
2. Read `.claude/skills/html-letter/themes/modern/instructions.md` for the full
   HTML structure template.

### Step 2 — Generate `letter(modern).html`

Follow the theme instructions exactly. Apply the shared rules below.

### Step 3 — Save and inform

Save to `[parent folder of seed]/html-letter/letter(modern).html`.

Example: seed at `jobs/tnt_lab-senior_frontend_engineer/2026-04-10_22-28/draft-letter/draft-letter.yaml`
→ save to `jobs/tnt_lab-senior_frontend_engineer/2026-04-10_22-28/html-letter/letter(modern).html`

Inform the user: open `letter(modern).html` in a browser and use File > Print → Save as PDF.

---

## Shared Rules

### Bold conversion
Convert `**bold**` in prose text to `<strong>bold</strong>`.

### HTML escaping
Escape special characters in all text content:
- `&` → `&amp;`
- `<` → `&lt;`
- `>` → `&gt;`

### Optional fields — omit entirely
- Omit the `letter-date` div if `letter.date` is absent.
- Omit the `letter-recipient` block entirely if `letter.recipient` is absent.
- Omit `contact-item` for github if `contact.github` is absent.
- Omit `letter-recipient-name` span if `recipient.name` is empty.
- Omit `letter-recipient-detail` lines if their source field is empty.

### No inline styles
Never add `<style>` blocks or inline `style=` attributes — all styling via the
linked theme stylesheet at `../../../../themes/modern/letter.css`.

### Proof points rendering
Render only `proof_points[].paragraph` as `<p class="letter-paragraph">` elements.
Do NOT render `title` or `jd_mapping` — these are internal metadata only.

### Date format
Use `–` (en dash) for date ranges.
