---
name: draft-cv
description: >
  Analyse a Job Description and draft tailored CV content from the candidate's personal-data/ dataset.
  Produces a structured seed YAML file (draft-cv.yaml) and a decision analysis (analysis.md).
  Use this skill whenever the user wants to: apply for a job, tailor their CV to a JD,
  generate application materials, or run /draft-cv.
  Trigger when the user provides a JD and asks to create or draft a CV,
  or says "draft my CV", "tailor my CV for this role", "apply for this job".
  Do NOT trigger for rendering — rendering is handled by the deterministic CLI `./bin/render-cv`.
license: AGPL-3.0
compatibility: >
  Compatible with any Agent Skills-aware runtime that supports file-based skill activation
  and write access to the working directory.
metadata:
  author: tiennt0212
  version: 1.3.1
  introduced_in: v1.0.0
allowed-tools: Read Write Bash(find:*) Bash(ls:*) Bash(grep:*)
---

# Draft Tailored CV

Analyse a Job Description and draft tailored CV content from the personal-data/ directory. Produces `analysis.md` + `draft-cv.yaml`. Rendering is handled by `./bin/render-cv` (deterministic Node.js + Handlebars CLI; no AI involvement).

## Arguments
$ARGUMENTS — JD text pasted directly, or a file path to a JD file. If a file path is provided, read the file first.

---

## Step 1 — Load all candidate data

Read every file in:
- `agents-ref/schema.md` — enums, tag taxonomy, naming conventions (read this first)
- `agents-ref/archetypes.yaml` — live archetype definitions (read in Step 2.5; if absent, see Step 2.5)
- `personal-data/profile.md` — personal info, skills, education, awards, summary template
- `personal-data/companies/*.md` — company context for each employer
- `personal-data/projects/*.md` — all project and role entries

If `personal-data/profile.md` is missing, or `personal-data/projects/` or `personal-data/companies/` have no real entries (empty or only `example_*` files), stop and ask the user to run `/personal-log` first to populate their dataset.

Build a complete picture of the candidate before touching the JD.

---

## Step 2 — Analyze the JD

Extract the following from the JD:

- **Role type**: product / outsource / agency / AI-focused / startup / enterprise / other *(JD-analysis heuristic for classifying the role being applied to — not a schema.md enum; the schema.md `type` enums describe company and project types, which are different lists)*
- **Seniority level**: junior / mid / senior — infer from responsibilities and requirements language
- **Required skills**: every technical skill, tool, or methodology mentioned
- **Soft signals**: ownership expectations, team structure, delivery pace, culture indicators
- **Keywords to mirror**: exact terms from the JD that should appear naturally in the CV — do not invent synonyms
- **Region**: infer from company location, spelling conventions, or salary currency if visible (affects length and format expectations)

If the JD is fewer than 50 words, it's likely too sparse to make good decisions — ask the user: "Can you share more about the role or company? The JD seems brief and more context will help tailor the CV better."

---

## Step 2.5 — Detect archetype

1. Read `agents-ref/archetypes.yaml`. If the file does not exist or is empty,
   inform the user and proceed with keyword-only scoring:
   > "Archetypes are not configured — the CV will be tailored using keyword-only scoring, which is less precise. Run `/setup-archetypes` to improve results for future runs."

2. For each archetype, count how many of its `signals` appear in the JD text
   (case-insensitive, partial match allowed — "dx" matches "developer experience").

3. Compute a match ratio: (signals matched ÷ total signals in archetype) for each.

4. Select the top archetype. If the second-highest is within 20% of the top
   → hybrid: note both archetypes and their ratio (e.g. "70% frontend-product /
   30% frontend-platform").

5. If no archetype reaches 25% match ratio → flag "archetype unclear" in
   analysis.md and proceed with keyword-only scoring (no archetype influence).

6. Record the detected archetype (and ratio if hybrid) in the analysis.md header.

---

## Step 3 — Select and rank projects

Recruiters spend 6–10 seconds scanning a CV before deciding to read further. Every included project must earn its place — irrelevant experience dilutes the signal of relevant experience.

Score every project file for relevance to this JD:

**Scoring factors:**
- Tag overlap with JD requirements (primary signal — tags follow the taxonomy in `agents-ref/schema.md`; non-standard tags may miss matches)
- Stack overlap with required skills
- Type alignment: product JD → favour `product`/`freelance`; outsource JD → favour `outsource`; AI JD → favour `agentic-workflows`/`ai`/`llm` tagged projects
- Recency: more recent work scores higher by default
- Impact strength: projects with measurable results score higher than those without
- Archetype signal match (only if an archetype was detected in Step 2.5):
  - Review each project's `tags`, `Valued Inputs`, and `proof_points` for the
    detected archetype's `proof_points_priority` signals.
  - Projects with clear evidence of ≥2 priority signals: score +1 tier
  - Projects whose primary value signal is characteristic of a *different*
    archetype in the user's set (and that archetype was not detected): score -1 tier
  - Projects with no archetype signal either way: no adjustment

**Selection target:** 4–6 roles/projects for the Experience section.
- High-scoring projects: include with full bullets (2–5 per role)
- Low-scoring projects that fill timeline gaps: include with 1–2 bullets, keep brief
- Low-scoring projects that add nothing to the JD match: exclude entirely

**Signal deduplication — check before including low-scoring projects:**

A project can earn its place either by matching the JD (tag/stack relevance) or by demonstrating a distinctive value signal — proactive ownership, cross-module thinking, system-level initiative, knowledge sharing, etc. But if a stronger, more recent project already demonstrates the same signal more clearly, the older project no longer earns its place on that basis either.

Before including a low-scoring project, identify its primary value signal from `Valued Inputs`. Then check: does a higher-scoring project already demonstrate the same signal with more impact or specificity?

- If yes: exclude the low-scoring project. Including both dilutes rather than reinforces the narrative — recruiters see repetition, not depth.
- If no: the signal is unique and the project earns its place even at low relevance score.

Example: a project whose main value is "proactively cross-tested to understand the full system" is superseded if a higher-scoring project already shows "independently mapped cross-module flows and produced structured documentation." The second is more recent, more specific, and has stronger impact — the first adds nothing new to the reader's picture of the candidate.

---

## Step 3.5 — Assess JD match and confirm before proceeding

Before building any CV content, evaluate how well the candidate's current dataset fits this specific JD. The goal is to surface mismatches early rather than produce a misleading CV that sets false expectations.

### Score each dimension

**Dimension 1 — Skill coverage**
Count the required skills extracted in Step 2 (explicit must-have skills only — not soft signals). For each, check whether it appears in:
- `personal-data/profile.md` (Skills section), OR
- the `stack` field of any project file in `personal-data/projects/`

Skill coverage % = (matched skills ÷ total required skills) × 100

If the JD has fewer than 5 required skills, note that sparse JDs may overstate coverage.

**Dimension 2 — Project hit rate**
From Step 3's scored project list, count HIGH-scoring and MEDIUM-scoring projects vs total projects scored. Record both the fraction (HIGH ÷ total) and the absolute count of HIGH-scoring projects.

**Dimension 3 — Seniority fit**
Compute the candidate's years of experience from `career_start` in `personal-data/profile.md` to today's date. Do not hardcode.

Compare against the JD's seniority signal:
- Candidate significantly overqualified for a junior-capped role → **Overqualified** (LOW)
- Candidate within the stated band → **Match**
- Candidate more than one band below the requirement → **Underqualified** (LOW)
- No JD seniority signal → **Unclear — assume match**

A one-band difference is a soft flag, not a hard stop. Only a >1-band gap is a critical mismatch.

**Dimension 4 — Domain coverage**
Identify the JD's primary domain (e.g. fintech, ecommerce, AI tooling, healthcare). Check whether any HIGH or MEDIUM scored project shares that domain via `tags` domain tags and the company's `industry` field.

Rate as: **Match** / **Adjacent** (related domain) / **No match**

Domain alone is a weak signal for generalist frontend/fullstack roles — it does not drive the tier classification on its own.

### Classify the overall match tier

| Tier | Threshold |
|------|-----------|
| **HIGH** | 3+ HIGH-scoring projects AND ≥60% skill coverage AND no critical seniority mismatch |
| **MEDIUM** | 1–2 HIGH-scoring projects OR skill coverage 40–59% (no critical seniority mismatch) |
| **LOW** | <2 HIGH-scoring projects AND skill coverage <40%, OR critical seniority mismatch (>1 band) |

**Mixed-dimension tiebreaker:** Project hit rate is the stronger signal than skill coverage — skill naming variations can inflate coverage gaps artificially (e.g. JD says "Zustand", candidate has "Jotai"). Apply the higher tier when signals conflict, but flag the weak dimension clearly. A critical seniority mismatch forces LOW regardless of other scores.

### Act on the match tier

**If HIGH:** Continue to Step 4 immediately. Record the assessment in `analysis.md`.

**If MEDIUM:** Continue to Step 4. Record the assessment in `analysis.md` with a brief note on which dimensions scored below HIGH and the specific gaps. Do not use alarming language — the user has already decided to apply; this note is informational.

**If LOW:** Stop. Do not proceed to Step 4. Display the following to the user:

---

**JD Match Assessment — Low Fit Detected**

| Dimension | Score | Notes |
|-----------|-------|-------|
| Skill coverage | [X]% ([n]/[total] required skills matched) | Unmatched: [comma-separated list] |
| Project hit rate | [n] HIGH / [total scored] ([n] MEDIUM) | [one-line note on missing domains/stacks] |
| Seniority fit | [Match / Overqualified / Underqualified / Unclear] | [one-line note if not a match] |
| Domain coverage | [Match / Adjacent / No match] | [one-line note if not a match] |

**Overall tier: LOW**

This JD has low fit with your current dataset. Proceeding will produce a CV, but the output will need significant framing work to be competitive — the gaps above would likely be visible to a recruiter.

Proceed anyway? Reply **yes** to continue generating the CV, or **no** to stop. If you have relevant experience not yet in your dataset, consider running `/personal-log` first to add it, then re-run `/draft-cv`.

---

If the user replies **yes**: continue to Step 4, and record the LOW tier + user's confirmation in `analysis.md`.

If the user replies **no**: stop. Do not write any output files.

---

## Step 4 — Determine CV structure

Do not default to a fixed structure. Derive it from the candidate's profile and the JD.

**Section order — base on seniority inferred from profile.md:**

*0–3 years experience:*
Contact → Summary → Education → Experience → Skills → Certifications/Projects

*3–10 years experience (mid-career):*
Contact → Summary → Experience → Skills → Education → Certifications → Projects (if relevant)

*10+ years experience (senior/executive):*
Contact → Executive Summary → Key Achievements → Experience → Education → Professional Memberships

**Section naming — use only ATS-parseable standard headings.**
ATS systems categorize content by matching heading text against known keywords. Creative or non-standard headings ("Where I've Made an Impact", "My Toolkit") get mis-categorized or ignored entirely, meaning the content inside may never reach a human reviewer.

Use:
- "Experience" (not "Work History", "Career", or any variant)
- "Skills" (not "Tech Stack", "Tools", "What I Know")
- "Education" or "Education & Certifications" if merged
- "Projects" or "Awards & Publications" as applicable

**Sections to always omit:**
- "References" or "References available on request" — assumed; wastes space
- "Objective" statements — replaced by summaries
- Hobbies/interests — unless the JD explicitly signals culture fit matters

---

## Step 5 — Build CV content

This step produces all prose and structured content that flows into the seed file. Rendering decisions (link format, date positioning, column layout, PDF output) belong to the renderer commands — not here.

### Contact block
Verify the following fields from `personal-data/profile.md`: name, location, email, phone, LinkedIn handle, GitHub handle. Store as plain values — no URL formatting, no rendering.

### Professional summary

3–4 lines. A positioning statement, not a personality description.

`personal-data/profile.md` contains a `## Summary` section with modular components — assemble these rather than writing from scratch:

- **Identity**: role label + seniority framing. Compute years of experience from `career_start` and today's date — do not hardcode a number from a previous run.
- **Work Traits**: pick 1–2 most relevant to the JD. Do not list all — select the traits that speak directly to what this role values.
- **Highlights**: pick 1–2 most relevant achievements. Prefer metrics and specificity.
- **Aspiration**: use as-is or rephrase the closing line to match the JD's environment signals.

Assemble into a single flowing paragraph (3–4 lines). The components are building blocks, not a template to copy wholesale.

**Angle the summary per detected archetype** (if detected in Step 2.5):

Use the archetype's `summary_lead` as the narrative opening angle. Assemble
the summary components from `personal-data/profile.md` as usual, but:
- Lead the Identity line with the archetype's characteristic framing
- Select Work Traits that align with the archetype's `proof_points_priority`
- Select Highlights that best demonstrate the archetype's primary value

If no archetype was detected, fall back to the JD type angles below:
- Product JD: lead with Work Traits around system depth and ownership; highlight CRM/app scale
- Outsource/agency JD: lead with delivery speed and versatility; highlight throughput and breadth
- AI-focused JD: lead with agentic workflow trait; highlight AI workflow evolution and context engineering
- Startup JD: lead with self-direction and end-to-end ownership traits; highlight solo build metrics
- Enterprise JD: lead with cross-timezone collaboration and large-codebase traits; highlight scale and process

**Anti-pattern:** Do not copy literal phrases from the JD into the summary. Recruiters recognise mirroring immediately — it signals a template, not genuine fit.

### Experience section

**Order company entries chronologically (most recent employer first).** ATS systems parse employment timelines to detect gaps and verify dates — non-chronological ordering at the company level raises red flags. Do not reorder companies by relevance.

**Company-level dates must come from `working_time_range` in the company file — not derived from project dates.** Project `dates` fields record when specific work happened; `working_time_range` records when the employment relationship existed. These are different things: a project may end in March while the person stayed at the company until May. Always read `personal-data/companies/[slug].md` and use its `working_time_range` as the authoritative date for the company entry in the seed. If `working_time_range` is missing from a company file, flag it to the user and ask for the correct dates rather than falling back to project date aggregation.

**Location — include only when it adds signal.** The `location` field on an experience entry is optional in the seed schema. Apply this rule:

- **Include** when the company is foreign or offshore and the candidate worked remotely — location signals cross-timezone or international collaboration, which is a meaningful credential.
- **Include** when the JD explicitly values distributed teams, international experience, or mentions a specific office location that the candidate's role aligns with.
- **Include** when the company has multiple offices in different countries and clarity is needed.
- **Omit** when all companies are in the same city as the candidate's contact location — it's redundant information that clutters the layout.
- **Omit** when location adds no differentiation (local companies in a purely local-hire JD).

Default to omit. When in doubt, ask: *"Does knowing where this office is help a recruiter evaluate this candidate for this role?"* If no, leave it out.

**Within a single company's sub-projects, order by JD relevance score (highest first), not by date.** Since all sub-projects share the same employer header, ATS date-parsing still works correctly on the company-level dates. Relevance-first ordering within a company reflects how well the candidate has adapted their experience to the specific role — the recruiter sees your strongest match for this JD first, not just your most recent project.

Example: a company with projects scored HIGH / MEDIUM / LOW for this JD should list them HIGH → MEDIUM → LOW, regardless of which was most recent.

Group multiple roles at the same company under one company heading with sub-role entries to signal progression.

**Bullet quality rules:**

Apply the shared standard from `agents-ref/cv-bullet-rules.md` (CAR structure, action verbs, measurable results, length).

Two additional rules specific to CV writing:

Mirror keywords from the JD naturally in context. Do not keyword-stuff or repeat mechanically.

**Archetype-driven bullet ordering** (only if an archetype was detected):

When ordering bullets within a project, use the detected archetype's
`proof_points_priority` as the ranking guide. Bullets with evidence matching the
first priority signal lead; bullets matching the second priority follow; others
trail or are dropped if they add no signal.

For hybrid archetypes, weight bullets by the archetype ratio (e.g. 70/30 →
primary archetype priority signals come first, secondary archetype signals next).

This overrides simple keyword-frequency ordering within a project, but does NOT
override the domain misalignment filter (bullets that actively signal the wrong
specialisation are still dropped).

Example: detected archetype is `frontend-platform`, priority signals are
"adoption by other engineers", "build/CI metrics", "systemic reduction".
A project has these bullets:
- "Reduced build time by 70% after migrating to Vite" → matches "build/CI metrics" → leads
- "Component library adopted by 4 teams in 2 months" → matches "adoption" → second
- "Aligned component API with Figma design tokens" → no platform signal → trails

**Per-bullet JD relevance filter:** When a project is included, not all of its bullets automatically belong. Before writing bullets from any project, ask: *"Would this bullet cause a recruiter to question whether the candidate fits this role?"* If yes, drop it from the Experience section and surface it in Skills instead if it still belongs on the CV at all.

The test is **domain misalignment**, not topic distance. A bullet fails the test only if it actively signals the wrong specialisation — e.g. a blockchain-specific bullet in a traditional web JD, or an AI research bullet in a UI-focused role.

**Do not drop a bullet simply because it does not mention the JD's tech stack.** Engineering initiative bullets — building internal tools, proactive migration work, end-to-end ownership, knowledge sharing — are domain-neutral. They demonstrate the ownership mindset and problem-solving ability that most JDs value explicitly. Filtering them out weakens the CV without reducing misalignment risk.

Examples of bullets to **drop**: "Implemented custom cryptographic key management for a blockchain wallet" (in a marketing site JD), "Trained a custom LLM on healthcare records" (in a traditional frontend JD).

Examples of bullets to **keep** even if off-stack: "Built an internal migration tool end-to-end — collected requirements, designed UI in Figma, and implemented the feature" (shows ownership); "Diagnosed a critical bug across ~1,000 commits using git bisect; shared the technique with the team" (shows debugging depth and mentoring).

### Project and role title rules

`projects[].title` and `roles[].title` are labels, not descriptions. Keep them short and scannable.

- **Max ~40 chars, 2–5 words.** A recruiter reads the title in under a second — it must be a label, not a sentence.
- **Drop explanatory suffixes** that restate what the company context already implies. The company header, dates, and bullets do the explaining.
- **No narrative em-dash clauses.** A title ending in "— [adjective phrase]" is almost always a sign that the suffix belongs in a bullet instead.
- **Role titles** follow the same rule — a job title, not a sentence.

| Good | Avoid |
|------|-------|
| `Auth Platform` | `Auth Platform — Enterprise Identity Management System` |
| `Admin Portal (v2)` | `**Admin Portal Management System (v2)**` |
| `Customer Dashboard` | `Customer Dashboard — Analytics & Reporting App` |
| `Senior Frontend Developer` | `Frontend Developer / Open Source Contributor` (if open source is just one project among many) |

### Core Competencies

Populate the `competencies` field in the seed with 6–8 keyword phrases:

**Sources (in priority order):**
1. Top JD keywords (from Step 2) that the candidate has genuine evidence for
   in the dataset — do not include a keyword if there is no supporting project
   or profile entry
2. Characteristic terms from the detected archetype's `proof_points_priority`
   that aren't already covered by JD keywords
3. **Candidate signature signals** — scan `profile.md` Work Traits for entries
   that have ≥2 evidence projects listed. For each qualifying trait, translate
   the bold label into a 2–4 word competency phrase. Include regardless of JD
   keyword match — these are differentiators, not checkboxes.
   Example: "Pre-implementation system mapping" (3 evidence projects) →
   `Pre-Implementation System Mapping`
   Do NOT include if the trait has only 1 evidence project — that's a data point,
   not a pattern.
4. The candidate's strongest skills (from profile.md) that are relevant to this JD

**Format rules:**
- 2–4 words per phrase, title case: "API Architecture", "LLM Integration"
- No duplicates with exact phrases already in the summary
- No stack names alone ("ReactJS" is a skill, not a competency phrase)
  — frame as capability: "React Application Architecture"
- Prefer signature signals (source 3) over generic skill phrases (source 4) —
  a competency that only this candidate could claim is worth more than one any
  developer could copy
- If fewer than 4 phrases can be genuinely supported by the data, omit the
  field entirely rather than padding with unsupported terms

**Target:** 6 phrases minimum, 8 maximum.

### Skills section
- List as labelled categories, one per line: `**Category:** skill, skill, skill`
- Reorder categories using this priority:
  1. If an archetype was detected: use the archetype's `skills_priority` list as
     the ordering guide — those categories go first.
  2. For remaining categories: sort by keyword overlap with JD requirements.
  3. Include all skills from profile.md; do not invent skills not in the data.

### Remaining sections

**Education, Certifications:** Pull from profile.md. Include if relevant to the JD or if the credential is prestigious enough to add credibility regardless of domain match.

**Awards and Publications:** Do not filter by JD keyword match. These are mindset signals, not domain signals — they tell the employer something about the candidate's intellectual depth, initiative, and ceiling that no project bullet can replicate. A hackathon win or a published paper belongs on the CV for almost any role, even if the domain (blockchain, AI, healthcare) differs from the JD. Exclude only if the section would be completely empty or the item is too old to be credible (10+ years).

**Title length rules for sections entries:** The `title` field is a label that a recruiter can identify and look up if interested. It should answer: *"What is this thing called?"* — not *"How good was it?"* or *"What rank did I get?"*

- **Max ~50 chars.** If you find yourself writing a sentence, stop.
- **`issuer` is the organisation name** — don't repeat it in `title`.
- **Brief outcome context goes in `description`** — one line max.

Two structural edge cases that commonly go wrong:

**Case A — Rank/placement awards** (`Top 8`, `2nd Place`, `Finalist`): A rank alone is contextless — the reader can't interpret it without knowing what it was for. The *track or category* belongs in `title` because it completes the meaning of the rank. The *organising body* belongs in `issuer`.

> `title: 2nd Place — Mobile App Track` / `issuer: City Dev Hackathon 2024`
>
> NOT `title: 2nd Place` (what does this mean alone?) or `title: City Dev Hackathon — 2nd Place` (duplicates the issuer)

**Case B — Grant/program outcomes** (a grant received, a review rating, a "selected from N applicants" result): There is no formal prize name — only a program and an outcome. The title should be **the program name** (something the reader can look up), not the outcome phrase. The outcome goes in `description`.

> `title: Open Source Fellowship` / `description: "selected from 200+ applicants; project rated highly by review committee"` / `issuer: Tech Community Foundation`
>
> NOT `title: Outstanding Contribution` (an adjective, not a name) or `title: Exceeded Expectations` (a grade, not a title)

| Situation | title | description | issuer |
|-----------|-------|-------------|--------|
| Named prize | `Winner — Mobile App Track` | *(omit)* | `City Dev Hackathon` |
| Rank / placement | `2nd Place — NLP Category` | *(omit — title is self-contained)* | `National AI Challenge 2024` |
| Grant / program outcome | `Open Source Fellowship` | `selected from 200+ applicants; rated highly by review committee` | `Tech Community Foundation` |
| Personal open-source project | `my-tool (Open Source, MIT)` | `Solo-built CLI tool, ~3 weeks` | `GitHub (personal)` |
| Academic paper | `Deep Learning for Fraud Detection` | *(omit if title is self-explanatory)* | `IEEE Xplore` |

**Hackathon projects in Experience:** Apply the same logic. A hackathon project with a prize award earns its place as a character signal regardless of JD domain match — include briefly (1–2 bullets focused on the win and the ownership breadth) rather than scoring it out entirely.

**Languages:** Always pull from `personal-data/profile.md`. Never omit entirely — but decide whether to give it a dedicated section or fold it into Skills:

**Create a standalone "Languages" section when the candidate has something worth highlighting:**
- A language certification with a score (IELTS, TOEIC, DELF, etc.)
- A third language beyond native + English
- JD explicitly requires a specific language level — treat it as a gating credential and place the section *before* Education

**Otherwise, merge into the Skills section** as a "Languages" sub-group (e.g. `**Languages:** Vietnamese (native), English (professional working proficiency)`). This is the default for candidates whose profile only shows a native language + everyday English with no certifications.

For proficiency wording, prefer in this order:
1. Certification score if the candidate holds one (e.g. "IELTS 7.5", "TOEIC 900")
2. CEFR level if explicitly stated in profile.md (A1–C2)
3. Standard label otherwise: *Native*, *Professional working proficiency*, *Limited working proficiency*

If profile.md uses a functional description (e.g. "technical communication, research & documentation"), map it to the nearest standard label — do not copy free-text into the seed. Do not use percentage bars or invented scales.

### Content rules (apply throughout)
- Spell out every acronym on first use: "Server-Side Rendering (SSR)", then SSR thereafter
- Bold (`**text**`) only for sub-project names or key terms — not decorative. Renderers handle all other text styling.

---

## Step 6 — Write output

**Folder structure:**
```
jobs/[company_slug]-[role_slug]/
├── YYYY-MM-DD_HH-MM_jd.md  ← JD at root with timestamp (records when JD was saved)
└── YYYY-MM-DD_HH-MM/        ← one subfolder per draft-cv run, named by timestamp
    ├── analysis.md
    └── draft-cv.yaml        ← seed file
```

Run `date +"%Y-%m-%d_%H-%M"` via Bash to get the current timestamp for the subfolder name. Never guess or infer the time.

`draft-cv` creates the timestamped subfolder and writes `analysis.md` + `draft-cv.yaml` into it. The renderer CLI (`./bin/render-cv <path/to/draft-cv.yaml> --theme <harvard|modern>`) reads the seed and saves its output into a `html-cv/` subfolder inside that same run folder.

**JD**: `YYYY-MM-DD_HH-MM_jd.md` lives at the application root. The timestamp records when the JD was first saved, providing a timeline of when each activity happened. If no JD file exists yet, remind the user to save it there for tracking history.

**Re-runs**: Each draft-cv run creates a new timestamped subfolder. Old run folders are preserved untouched.

**Seed format**: Read `.claude/skills/draft-cv/schema.yaml` for the full field specification before writing the seed.

**`analysis.md` structure**: Write sections in this order:
1. Header:
   - title, generated timestamp, JD source path
   - Archetype detected: [label] ([match ratio]%) — or "none detected" if Step 2.5
     found no clear archetype
   - If hybrid: both archetypes with ratio
2. `## JD Profile` — role type, seniority, region, required skills, soft signals, keywords to mirror
3. `## Match Assessment` — the four-dimension table from Step 3.5, overall tier, and an explanatory paragraph for MEDIUM or LOW tiers (omit paragraph for HIGH). If the user confirmed a LOW tier, note that here.
4. `## Project Scoring` — score table for all projects
5. `## Selection Decisions` — included/excluded tables
6. `## Structure Decision` — section ordering rationale, with this mandatory sub-section appended:

   **`## Seniority Strategy`**:

    Always include, even when seniority is a match.

    Format:
    ```
    ## Seniority Strategy
    Candidate level: [X years from career_start — compute from today's date, do not hardcode]
    JD target: [junior / mid / senior / staff — inferred from JD language]
    Fit: [Match / Candidate overqualified / Candidate underqualified]

    Approach: [one paragraph]
    ```

    **If match:** Note which seniority signals are strongest in the dataset and
    confirm they are surfaced early in the seed.

    **If candidate appears overqualified** (applying below their level):
    Approach: Frame toward individual contribution and technical depth. Choose
    projects that show hands-on execution rather than team leadership. Avoid
    bullets that emphasise managing others. The goal is to signal "I want to
    build, not just direct."

    **If candidate appears underqualified** (applying above their level):
    Approach: Scan all project bullets and `Valued Inputs` sections for ownership
    signals — architectural decisions, self-initiated work, end-to-end delivery,
    mentoring moments. Surface these bullets first within each project. Note any
    ownership signals completely absent from the dataset that the user might have
    but not yet logged (prompt them to check with `/personal-log`).

    Seniority signals to look for (in order of strength):
    1. Made an architectural or technical decision and owned the outcome
    2. Shipped something end-to-end with minimal supervision
    3. Mentored, reviewed, or unblocked another engineer
    4. Self-initiated work beyond assigned scope
    5. Dealt with a production incident or reliability issue

7. `## Keywords Mirrored` — JD terms and where they appear, followed by this sub-section:

   **`## Keyword Coverage`** — after writing the seed, count:
    - Total JD keywords extracted in Step 2
    - How many appear in the seed (summary + experience bullets + skills section)
    - Distribution across sections

    Format:
    ```
    ## Keyword Coverage
    Total JD keywords: [N]
    Covered in seed: [N] ([%])
      Summary: [N]  |  Experience: [N]  |  Skills: [N]
    Missing ([N]): [keyword] [[severity]] — [one-line note], ...
    ```

    Severity labels for missing keywords: [hard] [soft] [false gap]

    Note: coverage below 60% is a flag worth mentioning to the user.

8. `## Gaps Flagged` — for every JD-required skill with no matching evidence,
   produce a table with four columns:

   | Gap | Severity | Adjacent evidence | Mitigation |
   |-----|----------|-------------------|------------|

   **Severity classification:**
   - *Hard blocker*: JD uses "required" / "must have" AND the role cannot be
     performed without this skill
   - *Soft gap*: JD uses "preferred" / "nice to have", or the skill appears only once
   - *False gap*: candidate has the skill under a different name — propose the
     rename to use in the seed (e.g. "Jotai → Zustand-equivalent state management")

   **Adjacent evidence:** scan all project files and profile.md for anything in
   the same layer or problem space. If found, note which project and bullet.

   **Mitigation:** one concrete action per gap:
   - For hard blockers: honest note ("no adjacent evidence — consider skipping
     unless you can address this in cover letter")
   - For soft gaps: a specific reformulation to use in the seed
   - For false gaps: the exact rename to apply

9. `## Next Step` — reminder to run `./bin/render-cv <path/to/draft-cv.yaml> --theme <harvard|modern>`

**Example — first run, then rendered:**
```
jobs/tnt_lab-frontend_react/
  2026-03-28_10-00_jd.md
  2026-03-31_14-30/
    analysis.md
    draft-cv.yaml
    html-cv/
      cv(harvard).html       ← added by ./bin/render-cv ... --theme harvard
      cv(modern).html        ← added by ./bin/render-cv ... --theme modern
```

**Example — re-run after updating dataset:**
```
jobs/tnt_lab-frontend_react/
  2026-03-28_10-00_jd.md    ← unchanged
  2026-03-31_14-30/          ← previous run preserved
    analysis.md
    draft-cv.yaml
  2026-04-05_09-15/          ← new run
    analysis.md
    draft-cv.yaml
```

---

## Step 7 — Summarise decisions

After writing the files, output a brief summary:
- **Included projects**: list each with one-line reason
- **Excluded projects**: list each with one-line reason
- **JD keywords mirrored**: key terms used and where they appear
- **Gaps flagged**: any JD-required skill with no matching evidence in the dataset — these are honest gaps the user should consider addressing
- **Match tier**: state the overall match tier (HIGH / MEDIUM / LOW) and one sentence summarising which dimension(s) drove the classification. If the user confirmed a LOW-tier match, note that here.
- **Next step**: remind the user to render the seed with `./bin/render-cv <path/to/draft-cv.yaml> --theme <harvard|modern>` (available themes: `harvard`, `modern`)
