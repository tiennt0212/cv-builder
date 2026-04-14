# Eval Criteria

Reference document for evaluating output quality of cv-builder skills. Use this when testing changes to skill files (`.claude/skills/`).

---

## `/draft-cv` — Evaluation Criteria

### ATS Compliance (pass/fail)
- [ ] No tables, columns, or multi-column layouts
- [ ] No images or icons
- [ ] Section headings are standard: "Experience", "Skills", "Education", "Projects"
- [ ] No "References available on request"
- [ ] No objective statement
- [ ] All acronyms spelled out on first use
- [ ] Links use anchor text, not raw URLs

### Content Quality (1–5 scale)
- **Summary angle** (1–5): Does the summary match the JD's role type and detected archetype?
- **Archetype detection** (1–5): Was the correct archetype identified? Was hybrid flagged when signals were ambiguous?
- **Project selection** (1–5): Are the most relevant projects included? Is anything irrelevant taking up space?
- **Bullet quality** (1–5): Do bullets follow CAR format? Do they start with strong verbs? Do ≥60% have measurable results?
- **Keyword mirroring** (1–5): Are JD keywords present naturally in the CV? No keyword stuffing?

### Completeness (pass/fail)
- [ ] Analysis phase summary is present in `analysis.md` (included/excluded projects with reasons, gaps flagged)
- [ ] Outputs saved to `jobs/[company-role]/YYYY-MM-DD_HH-MM/` as `analysis.md` + `draft-cv.yaml`

### Gating behavior (pass/fail)
- [ ] For LOW-tier JD match (<2 high-scoring projects + <40% skill coverage OR >1 seniority band gap): command stops and asks user to confirm before proceeding
- [ ] For HIGH/MEDIUM-tier: proceeds without unnecessary interruption

### Red flags (automatic fail)
- Bullets starting with "Responsible for", "Helped with", "Assisted in"
- Skills invented that aren't in `personal-data/profile.md`
- Roles listed in non-chronological order without explanation
- JD required skill missing from CV with no flag in analysis

---

## `/personal-log` — Evaluation Criteria

### Information gathering (pass/fail)
- [ ] Did not draft before having: dates, tech stack, and ≥1 concrete achievement
- [ ] Asked follow-up when answers were vague (e.g. "I improved performance")
- [ ] Pushed for specific result if achievement had no number or measurable outcome
- [ ] Checked whether company exists in `personal-data/companies/` before saving project

### File quality (1–5 scale)
- **Tags** (1–5): Are all relevant tags from `agents-ref/schema.md` included? Is any obvious tag missing?
- **Bullet quality** (1–5): Strong verbs, CAR structure, ≥1 measurable/specific result?
- **Description vs Achievements separation** (1–5): Is Description context-only? Are no achievements buried in Description?
- **Valued Inputs** (1–5): Goes beyond task list — captures initiative, cross-team work, decisions?

### Red flags (automatic fail)
- Bullets starting with weak openers ("Responsible for", "Worked on")
- Achievements written as tasks ("Built UI components") with no result
- Non-standard tags that won't match JD keywords
- Stack names not following `agents-ref/schema.md` convention (e.g. "react" instead of "ReactJS")
- Project saved without creating corresponding company file when company is new

---

## `/draft-letter` — Evaluation Criteria

### Prerequisites (pass/fail)
- [ ] Reads `analysis.md` and `draft-cv.yaml` from the same application folder before drafting
- [ ] Captures or re-uses motivation via 4 questions: why this company, career direction, philosophy hook, team notes
- [ ] Saves motivation to `motivation.md` for reuse across renders

### Content Quality (1–5 scale)
- **Tone match** (1–5): Tone fits the company type (startup/product-mid/enterprise/outsource)? Not generic?
- **Story quality** (1–5): 2–3 proof points present? Each follows CAR→story arc (context → decision → outcome → reflection)?
- **Anti-AI pattern compliance** (1–5): No "thrilled", "passionate", "leverage", "synergy", etc.?
- **Proof point selection** (1–5): Best-fit stories chosen (not just most impressive)? For senior roles, Golden Ratio applied (1 technical + 1 soft leadership + 1 business impact)?

### Structure (pass/fail)
- [ ] First-person narrative — NOT CV format (no bullets, no headers)
- [ ] 3–4 paragraphs: opening + 2–3 proof paragraphs + closing
- [ ] Output saved as `draft-letter.yaml` in the application run folder

### Red flags (automatic fail)
- Letter is a prose summary of the CV (no narrative, no "why this company")
- Uses AI-tell phrases: "I am thrilled", "I am passionate about", "I would leverage my experience"
- Proof points taken from CV bullets verbatim — no story transformation

---

## `/setup-archetypes` — Evaluation Criteria

### Process (pass/fail)
- [ ] Presents menu of predefined archetype templates before asking user to configure from scratch
- [ ] Scans `personal-data/projects/` for tag coverage — flags archetypes with <2 supporting projects
- [ ] Requires user to review and approve before writing to `agents-ref/archetypes.yaml`

### Output Quality (1–5 scale)
- **Signal specificity** (1–5): Are signals specific JD keywords/phrases (not generic)? Would they realistically appear in a JD?
- **Dataset alignment** (1–5): Do chosen archetypes match the signals actually present in `personal-data/projects/`?
- **Summary leads** (1–5): Are summary_lead lines distinct across archetypes? Do they speak to different reader expectations?

### Red flags (automatic fail)
- Archetype written without checking whether candidate data supports it
- Signals are too generic to be useful (e.g. "ReactJS" under AI/ML archetype without AI-specific signals)
- File written without showing user a preview first

---

## Renderers (`/html-cv`, `/latex-cv`, `/resumx-cv`) — Evaluation Criteria

Renderers make **zero content decisions** — they only apply format-specific styling to a seed YAML. Criteria here are format-only.

### Schema Fidelity (pass/fail)
- [ ] All sections present in seed YAML are rendered in output
- [ ] Optional fields (awards, publications, certifications) are omitted entirely when absent — not rendered as empty sections
- [ ] Date format uses en-dash (2022–2024), not hyphen

### ATS / Format Compliance (pass/fail — `/resumx-cv` and `/latex-cv` only)
- [ ] No tables, columns, or multi-column layouts
- [ ] No inline images or icon characters
- [ ] Links are anchor-text based, not raw URLs

### Renderer-specific checks

**`/html-cv`:**
- [ ] Opens correctly in browser with no build step
- [ ] Print → Save as PDF produces clean single-column output
- [ ] `**bold**` in seed rendered as `<strong>`, not literal asterisks
- [ ] HTML entities escaped (`&`, `<`, `>`)

**`/latex-cv`:**
- [ ] Compiles on Overleaf with XeLaTeX without errors
- [ ] Uses `\setmainfont{EB Garamond}` — no `Path=` or local font file references

**`/resumx-cv`:**
- [ ] Output is valid Markdown paste-able into ResumeX playground
- [ ] No LaTeX-specific commands or HTML tags in output

---

## Test Scenarios

### For `/draft-cv`
Run against each sample JD in `evals/sample-jds/` and evaluate using criteria above.

| Sample JD | Expected archetype | Key projects to include |
|-----------|-------------------|------------------------|
| `product-startup.md` | product-frontend | product + ownership-signal projects |
| `outsource-agency.md` | outsource-frontend | outsource + client-breadth projects |
| `ai-focused.md` | ai-frontend | agentic-workflows / ai / llm tagged projects |

### For `/personal-log`
Use each sample description in `evals/sample-projects/` and evaluate using criteria above.

| Sample | Key behavior to test |
|--------|----------------------|
| `vague-description.md` | Asks follow-up before drafting (no dates, no specifics) |
| `no-results.md` | Pushes for measurable results before accepting achievements |
| `new-company.md` | Detects missing company file, offers to create it first |
| `existing-project.md` | Detects potential duplicate, offers update flow instead of new file |

### For `/draft-letter`
Run after a `/draft-cv` pass against `evals/sample-jds/product-startup.md`.

| Sample | Expected outcome |
|--------|-----------------|
| `evals/sample-motivations/motivation-startup.md` | Startup tone, 2–3 proof points, no AI-tell phrases |

### For `/setup-archetypes`
Run with candidate's actual `personal-data/projects/` dataset.

| Check | Expected |
|-------|----------|
| Presented template menu | ≥3 relevant archetypes suggested based on tag scan |
| Dataset coverage warning | Any archetype with <2 supporting projects flagged |
| User review step | YAML preview shown before file is written |

### For renderers
Run each renderer against the seed YAML produced by the `/draft-cv` test above.

| Command | Input | Check |
|---------|-------|-------|
| `/html-cv` | `draft-cv.yaml` | Opens in browser, prints cleanly |
| `/latex-cv` | `draft-cv.yaml` | Compiles with `xelatex` without errors |
| `/resumx-cv` | `draft-cv.yaml` | Valid Markdown for ResumeX playground |
