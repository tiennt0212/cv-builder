# resumx-cv

Renders a CV seed to ResumeX-compatible Markdown — paste into the browser playground for instant PDF preview.

## Idea

The fastest path to a shareable PDF when no local tooling is available. ResumeX is a browser-based CV renderer; this skill produces the Markdown format it expects. The workflow is: run the skill → copy `cv.md` → paste into the ResumeX playground → preview → download PDF. No installation, no compilation, no build script.

## Scope

**Handles:**
- ResumeX Markdown format: `#` for name, `##` for sections, `**role** | dates` pattern for experience
- All seed sections: summary, core competencies (if present), experience with optional sub-project headers, skills, education, awards and publications
- ATS-safe single-column layout — no tables, no multi-column structures, no images

**Does not handle:** Content decisions; PDF generation (done in browser); visual theming (ResumeX controls the look)

## Capabilities

- Renders core competencies as phrases joined by ` · ` — section omitted if field absent from seed
- Sub-project titles rendered as bold headers with dates; if no title, bullets appear directly under company header
- ATS formatting rules enforced: readable link anchor text, standard section headings, no decorative bold
- Section ordering follows the seed (summary → competencies → experience → skills → education → awards)

## Input / Output

**Input:** `draft-cv.yaml` seed file (path provided as argument)

**Output:**
```
[run-folder]/resumx-cv/cv.md
```

**To preview and download PDF:** paste contents of `cv.md` into the ResumeX browser playground.

## Works with

**Before:** `/draft-cv` (produces the seed)

**Alternative renderers:** `/html-cv` (self-contained HTML, two themes), `/latex-cv` (professional typeset quality)
