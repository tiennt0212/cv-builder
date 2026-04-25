# html-cv

Renders a CV seed to browser-previewable HTML. Preview in any browser instantly; export to PDF via browser print or the `html-to-pdf` command for clickable links.

## Idea

The simplest possible path from seed to a shareable CV. No LaTeX installation, no compilation step. A single self-contained HTML file that any browser can open. Supports two visual themes so the same seed can produce a classic look for traditional roles and a modern look for contemporary ones.

## Scope

**Handles:**
- **Harvard theme** — serif font (EB Garamond), centred name header, horizontal rule section dividers; safe for conservative industries and ATS systems
- **Modern theme** — sans-serif, teal accent colour, role subtitle in header; contemporary look for product and startup roles
- All seed sections: summary, core competencies (if present), experience with sub-projects, skills, education, certifications, awards, publications, languages

**Does not handle:** Content decisions — all prose comes verbatim from the seed; no rewrites or additions made here

## Capabilities

- Supports two themes from the same `draft-cv.yaml` seed — run once per theme (skill will ask if not specified; pass `--theme harvard` or `--theme modern` to skip the question)
- Converts `**bold**` in bullet text to `<strong>` HTML elements
- Omits empty sections and optional elements cleanly (no blank `<div>` remnants)
- Formats date ranges with en-dash (`–`) consistently
- Produces a standalone HTML file — no external dependencies at render time

## Input / Output

**Input:** `draft-cv.yaml` seed file (path provided as argument)

**Output:**
```
[run-folder]/html-cv/cv(harvard).html
[run-folder]/html-cv/cv(modern).html
```

**To preview:** open the file in any browser — no server or build step needed.

**To export PDF:**
- **Browser print** (`File > Print → Save as PDF`) — zero setup. Links are not clickable in the output.
- **`./html-to-pdf <file>`** — requires one-time `npm install` in `bin/`. Produces a PDF with clickable links. Recommended for final submissions.

## Works with

**Before:** `/draft-cv` (produces the seed)

**Also renders:** `/latex-cv` and `/resumx-cv` are alternative renderers for the same seed — use them when PDF typeset quality or a browser playground workflow is preferred instead
