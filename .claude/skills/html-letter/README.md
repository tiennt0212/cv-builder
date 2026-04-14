# html-letter

Renders a cover letter seed to browser-previewable HTML using the Modern theme.

## Idea

Same zero-dependency philosophy as `/html-cv`, adapted for cover letters. One theme only — Modern — so the letter visually matches the html-cv modern output when the two are submitted together as a paired set.

## Scope

**Handles:**
- Full letter structure: date (optional), recipient block (optional), salutation, opening paragraph, proof point paragraphs, closing, sign-off, signature
- Optional fields omitted cleanly — no empty elements rendered when source fields are absent
- `title` and `jd_mapping` fields inside `proof_points[]` are internal metadata only — never rendered in HTML

**Does not handle:** Content decisions — all prose comes from `draft-letter.yaml` written by `/draft-letter`

## Capabilities

- Omits the recipient block entirely if no hiring manager details are available
- Omits the date line if `letter.date` is not set in the seed
- Converts `**bold**` in prose to `<strong>` HTML elements
- Produces a standalone HTML file — no external dependencies at render time

## Input / Output

**Input:** `draft-letter.yaml` seed file (path provided as argument)

**Output:**
```
[run-folder]/html-letter/letter(modern).html
```

To generate PDF: open the file in a browser → File > Print → Save as PDF.

## Works with

**Before:** `/draft-letter` (produces the seed); which in turn requires `/draft-cv` to have run first
