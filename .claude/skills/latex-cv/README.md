# latex-cv

Renders a CV seed to a compilable LaTeX `.tex` file in the Harvard resume format.

## Idea

Some roles — academia, finance, traditional enterprises — expect PDF typography that browser-print cannot match. LaTeX with EB Garamond produces professional typeset quality with precise spacing, rule lines, and serif elegance. The generated `.tex` file is pasted into an Overleaf template for compilation — no local TeX engine required.

## Scope

**Handles:**
- Harvard LaTeX format: centred large-bold name, horizontal rule section dividers, bold centred section headings
- Single-project company entries (`\jobentrynoloc`) and multi-project entries with sub-project headers (`\subproject`, `\subprojectnodates`)
- Core competencies section — omitted automatically if not present in seed
- Education and certifications merged into one section
- Awards and publications with hyperlinked titles (`\href{url}{title}`)
- EB Garamond font via `fontspec` — compiled with XeLaTeX on Overleaf (pdflatex does not support `fontspec`; no local TeX engine needed)

**Does not handle:** Content decisions; PDF compilation — done in Overleaf

## Capabilities

- Two job entry macros handle whether `location` is present in the seed
- Sub-project macros end with `\par` to prevent inline continuation bugs
- Wraps award/publication titles in `\href{}{}` when a URL is present — never shows raw URLs

## Input / Output

**Input:** `draft-cv.yaml` seed file (path provided as argument)

**Output:**
```
[run-folder]/latex-cv/cv.tex
```

**To compile to PDF:**
1. Go to overleaf.com and create a new blank project (or open any existing one)
2. Replace the contents of `main.tex` with the generated `cv.tex`
3. Set compiler to **XeLaTeX** (Menu → Compiler)
4. Click Recompile — download the PDF

## Works with

**Before:** `/draft-cv` (produces the seed)

**Alternative renderers:** `/html-cv` (no tooling required), `/resumx-cv` (browser playground)
