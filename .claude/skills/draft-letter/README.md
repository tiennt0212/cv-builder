# draft-letter

Drafts a tailored cover letter by capturing genuine motivation first, then selecting 2–3 proof-point stories.

## Idea

Generic cover letters fail because they describe skills, not people. The most common failure mode: listing the same achievements that already appear in the CV, wrapped in "I am excited about the opportunity" filler. This skill forces a different starting point — four questions that capture what specifically attracted the candidate to *this* role. The answers become the letter's opening; the stories are selected to cover distinct facets of seniority (Technical Depth, Soft Leadership, Business Impact) so the reader sees a complete picture, not a highlight reel of one trait.

## Scope

**Handles:**
- Motivation capture via 4 focused questions; persisted to `motivation.md` so a re-run can reuse or update the answers
- Proof point scoring from the seed's experience entries and `Valued Inputs` sections
- Golden Ratio story selection for Senior roles at large organisations (one story per: Technical Depth / Soft Leadership / Business Impact)
- Tone calibration derived from the JD's role type and soft signals (startup / product-mid / enterprise / outsource)
- Anti-AI prose pattern enforcement throughout (banned phrases, banned openers, banned closers)
- Revision requests: tone adjustment, story swap, gap acknowledgement, Golden Ratio fixes, shorter/longer

**Does not handle:** Rendering — use `/html-letter`

**Requires:** Prior `/draft-cv` run for the same application — reads `analysis.md` for JD profile and project context

## Capabilities

- Smart Silence rule: if the experience-years gap is under 15% of the required threshold, avoids stating the number and anchors seniority to problem complexity instead
- Gap story (optional): if `analysis.md` flags a hard-blocker gap with adjacent evidence, can include a brief acknowledgement that turns the gap into a self-awareness signal
- Sentence variety constraint: enforces subject alternation to prevent AI-pattern cadence
- Saves `motivation.md` after Q&A — resuming a revision session skips the 4-question flow and offers to reuse or update the saved answers

## Input / Output

**Input:** `draft-cv.yaml` + `analysis.md` from the same run folder, plus answers to 4 motivation questions

**Output:**
```
[run-folder]/draft-letter/
  draft-letter.yaml   ← structured seed with all letter fields
  motivation.md       ← captured motivation (persisted for re-runs)
```

## Works with

**Before:** `/draft-cv` (required — provides JD context and project data)

**After:** `/html-letter` (renders `draft-letter.yaml` to browser-previewable HTML)
