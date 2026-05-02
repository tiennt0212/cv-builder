# Glossary

Key terms used throughout the CV Builder system.

---

## Archetype

A profile describing the *kind of engineer* a JD is hiring — not the tech stack, but the function and daily output. Examples: "Product Frontend Engineer" (ships user-facing features), "Senior Frontend / Small-Team Generalist" (breadth, tooling, system thinking).

`/draft-cv` detects the closest archetype by matching signal phrases in the JD, then uses it to weight project selection, bullet ordering, and summary framing. Archetypes are defined in `agents-ref/archetypes.yaml` and managed with `/setup-archetypes`.

---

## Seed / Seed YAML

The intermediate file (`draft-cv.yaml`) that `/draft-cv` produces. It contains all CV content as structured data — contact info, summary, experience entries with bullets, skills, education — but no formatting decisions.

The renderer command (`/html-cv`) reads the seed and applies format-specific layout. The seed is the single source of truth for content; the renderer makes zero content decisions.

---

## Proof Points

Optional raw context facts attached to a project file (`proof_points:` in frontmatter). Not rendered into the CV — used by `/draft-cv` to write stronger, more specific bullets.

Examples: "system handled 50k requests/day at peak", "2-engineer team, no dedicated DevOps", "blog post: [url]".

Contrast with `Valued Inputs` (what you did beyond assigned scope) — proof points are *background facts*, not narrative contributions.

---

## Run Folder

Each `/draft-cv` run creates a timestamped subfolder inside the application folder:

```
jobs/company-role/
  2026-04-07_14-30/        ← run folder
    analysis.md
    draft-cv.yaml
    html-cv/
      cv(harvard).html
```

Re-running `/draft-cv` creates a new run folder; old runs are preserved untouched. This lets you compare outputs across runs or after updating your dataset.

---

## Match Tier

The overall fit classification that `/draft-cv` computes in Step 3.5 before building any CV content:

| Tier | Meaning |
|------|---------|
| **HIGH** | 3+ high-scoring projects AND ≥60% skill coverage AND no critical seniority mismatch |
| **MEDIUM** | 1–2 high-scoring projects OR skill coverage 40–59% |
| **LOW** | <2 high-scoring projects AND skill coverage <40%, OR critical seniority mismatch |

At LOW, `/draft-cv` pauses and asks before proceeding — the output will need significant framing work.

---

## Analysis File

`analysis.md` — produced alongside the seed by every `/draft-cv` run. Documents all decisions made during the run:

- **JD Profile** — extracted role type, seniority, required skills, keywords
- **Archetype detected** — which archetype matched (or "none detected")
- **Match Assessment** — four-dimension table (skill coverage, project hit rate, seniority fit, domain coverage)
- **Project Scoring** — every project scored and ranked
- **Selection Decisions** — included/excluded tables with rationale
- **Seniority Strategy** — how the CV is framed given experience level vs JD target
- **Keywords Mirrored** — JD terms and where they appear in the seed
- **Keyword Coverage** — % of JD keywords covered, with missing ones flagged
- **Gaps Flagged** — table of missing skills with severity and mitigation

---

## Keyword Coverage

A metric in `analysis.md` reporting what percentage of JD keywords made it into the seed (summary + experience bullets + skills section). Coverage below 60% is flagged as a potential ATS risk.

---

## Signal (archetype)

A JD phrase that indicates a specific archetype. Signals must distinguish *between* archetypes — generic tech terms like "React" or "TypeScript" are not signals. Examples of valid signals: "developer experience", "admin dashboard", "internal tooling", "feature ownership".
