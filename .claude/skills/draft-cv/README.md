# draft-cv

Analyses a Job Description and produces a fully tailored CV seed — all content decisions live here.

## Idea

The system's "brain". Separates *what to show* (content) from *how to show it* (format). By producing a seed YAML, every renderer consumes the same decisions without re-doing the analysis. Every tailoring choice — which projects to include, how to frame the summary, which keywords to mirror — is made exactly once, here.

## Scope

**Handles:**
- JD analysis: role type, seniority, required skills, soft signals, region
- Archetype detection: maps JD signals to candidate's configured target profiles
- Project scoring and selection: tag/stack overlap, recency, impact strength, signal deduplication
- JD match assessment: skill coverage, project hit rate, seniority fit, domain coverage → tier (HIGH / MEDIUM / LOW)
- CV structure determination based on candidate seniority
- Full prose generation: summary, experience bullets, skills, core competencies
- Seniority strategy and keyword coverage reporting in `analysis.md`

**Does not handle:** Rendering — delegated to `/html-cv`, `/latex-cv`, `/resumx-cv`

## Capabilities

- Detects hiring archetype (or hybrid) from JD signal words; adjusts bullet ordering, summary angle, and skills priority accordingly
- Flags LOW-match job applications before generating content, with a four-dimension breakdown
- Deduplicates proof points across projects — avoids including two entries that demonstrate the same signal
- Writes a Seniority Strategy note in `analysis.md` when candidate appears over- or underqualified
- Tracks keyword coverage after writing the seed and flags missing high-severity keywords
- Produces a Gaps table with severity classification (hard blocker / soft gap / false gap) and concrete mitigations

## Input / Output

**Input:** JD text or file path + `personal-data/` dataset + `agents-ref/archetypes.yaml`

**Output:**
```
jobs/[company-role]/[YYYY-MM-DD_HH-MM]/
  analysis.md       ← decision log: scoring, match tier, seniority strategy, keyword coverage, gaps
  draft-cv.yaml     ← seed file with all CV prose
```

## Works with

**Before:** `/personal-log` (populate dataset), `/setup-archetypes` (configure archetypes — required for archetype-aware tailoring)

**After:** any renderer — `/html-cv`, `/latex-cv`, `/resumx-cv` — or `/draft-letter` for a cover letter
