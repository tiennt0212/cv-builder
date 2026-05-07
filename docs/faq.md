# FAQ

Common questions and troubleshooting for the CV Builder system.

---

## Dataset and data entry

**My project isn't being selected even though it's clearly relevant.**

The most common cause is under-tagging. Tags are the primary signal `/draft-cv` uses to score relevance — if a project's `tags` field doesn't include the terms that match the JD, it will score low even if the work is relevant.

Open the project file and compare its `tags` against the JD's language. Add any missing tags from the taxonomy in `agents-ref/schema.md`. Re-run `/draft-cv` after updating.

**What's the difference between `proof_points` and `Valued Inputs`?**

- `Valued Inputs` — *narrative* context about what you did beyond the assigned task. Appears in the project file's `## Valued Inputs` section. `/draft-cv` reads this to understand your ownership breadth.
- `proof_points` — *raw facts* that give `/draft-cv` specifics to write stronger bullets (scale numbers, team constraints, external links). These never appear verbatim in the CV.

Think of it this way: "Proposed and built the internal migration tool end-to-end" is a Valued Input. "Tool reduced migration time from 3 days to 4 hours, used by 6 engineers" is a proof point.

---

## Archetypes

**`/draft-cv` skipped archetype detection — why?**

`agents-ref/archetypes.yaml` doesn't exist or is empty. Run `/setup-archetypes` first. After setup, re-run `/draft-cv`.

**When should I re-run `/setup-archetypes`?**

When your target role family changes — e.g. you've been applying for product-focused frontend roles and now want to target platform/DX or backend roles. The signals need to reflect the JD language of the new role type.

You don't need to re-run it for every application — archetypes are role-family level, not job-specific.

**Can I have more than 4 archetypes?**

Not recommended. Detection works by counting signal matches — with 5+ archetypes, signals start overlapping and the top archetype becomes less meaningful. If you find yourself wanting a 5th archetype, check whether two existing ones can be merged (>70% signal overlap is the rule).

---

## `/draft-cv` output

**Keyword coverage is below 60% — what should I do?**

Check the `## Keyword Coverage` block in `analysis.md`. It lists the missing keywords with severity labels:

- `[hard]` — the JD explicitly requires this skill. If you have it but it's not named correctly in your dataset, update the skill name in `personal-data/profile.md` to match the JD's terminology.
- `[soft]` — preferred, not required. Note it but don't over-optimize.
- `[false gap]` — you have this skill under a different name. The analysis will suggest the rename to use.

For genuine hard gaps you don't have: either address them in your cover letter or reconsider the application.

**The summary doesn't reflect the archetype I expected.**

Check `analysis.md` — the header shows which archetype was detected and its match ratio. If the ratio is below 25%, archetype detection fell back to keyword-only mode.

If the wrong archetype was detected, review the signal lists in `agents-ref/archetypes.yaml`. The JD may use different terminology than your signals — run `/setup-archetypes` with the JD pasted in Step 4 to refine the signals.

**Company dates look wrong — `/draft-cv` is using project dates instead of employment dates.**

Check the company file in `personal-data/companies/[slug].md`. The `working_time_range` field must be set — this is the authoritative employment date for the CV. If it's missing, `/draft-cv` will flag it and ask you for the correct dates rather than guessing from project dates.

---

## Renderers

**I ran `./bin/render-cv` but there's no Core Competencies section.**

The `competencies` field was not populated in the seed — either because the JD had too few extractable keywords to support 4+ genuine phrases, or the seed was generated before the competencies feature was added. Re-run `/draft-cv` to get a fresh seed with competencies.

**Which renderer should I use?**

- `./bin/render-cv <path/to/draft-cv.yaml> --theme <harvard|modern>` — deterministic Node.js + Handlebars CLI. Produces a self-contained HTML file. Preview immediately in any browser. Two PDF export options:
  - **Browser print** (`File > Print → Save as PDF`) — zero setup. Links in the PDF will not be clickable.
  - **`./html-to-pdf <file>`** — runs Puppeteer locally, produces a PDF where links are clickable. One-time setup: `cd bin && npm install`. Recommended for final submissions sent to recruiters.
- `./bin/render-letter <path/to/draft-letter.yaml> --theme modern` — same shape, used after `/draft-letter` to render the cover letter.

**Why isn't there a `/html-cv` slash command anymore?**

Rendering used to be an AI-driven skill (`/html-cv`, `/html-letter`). Issue #8 retired both in favour of deterministic CLIs because every render-time decision (HTML structure, optional-field omission, bold conversion) is mechanical — running it through an LLM cost tokens and added unpredictability for no benefit. The seed YAML schema is unchanged, so old seeds still render.
