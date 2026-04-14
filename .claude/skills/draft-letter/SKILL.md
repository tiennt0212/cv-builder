---
name: draft-letter
description: >
  Draft a tailored cover letter for a specific job application and save it as
  structured YAML. Requires a prior /draft-cv run — reads analysis.md and
  draft-cv.yaml from the same application folder.
  Trigger when the user says "/draft-letter", "draft a cover letter",
  "write a cover letter", "generate cover letter", or "cover letter for [company]".
  Do NOT trigger for rendering — use /html-letter for that.
---

# Draft Letter

Draft a tailored, first-person cover letter from the candidate's data and a
short motivation capture. Outputs a structured `draft-letter.yaml` seed file
that can be rendered by `/html-letter`. Requires `/draft-cv` to have been run first.

## Arguments
$ARGUMENTS — path to a `draft-cv.yaml` seed file, OR a company+role slug
(e.g. `stripe-frontend_engineer`). If omitted, list recent application folders
and ask the user to select.

---

## Step 1 — Locate the application

Find the most recent run folder for the given application:

```
jobs/[company-role]/
  YYYY-MM-DD_HH-MM/
    draft-cv.yaml     ← required
    analysis.md       ← required
```

If neither file exists, stop:
> "I need a /draft-cv run for this application before I can write the cover letter.
> Run `/draft-cv [JD]` first, then come back here."

If multiple run folders exist, use the most recent one (latest timestamp).

Read both files fully before proceeding.

---

## Step 2 — Load candidate data

Read:
- `personal-data/profile.md` — identity, work traits, highlights, aspiration
- All project files referenced in the seed's `experience` section

Also read `agents-ref/schema.md` to check if archetypes are defined.

Target company context (type, size, domain, tone signals) comes from `analysis.md`
already loaded in Step 1 — do not read `personal-data/companies/`. That folder contains
the candidate's past employers, not the company being applied to.

---

## Step 3 — Check for existing motivation

Check if `draft-letter/motivation.md` exists inside the current run folder.

**If it exists**, read it and ask:
> "I found motivation notes from a previous run:
> [show motivation summary in 2-3 lines]
> Use these, or update them?"

If user says use: proceed to Step 5.
If user says update: proceed to Step 4.

**If it does not exist**, proceed to Step 4.

---

## Step 4 — Capture motivation

Ask four focused questions. Ask all four at once — do not split into separate
rounds unless an answer is too vague to use.

> "Before I write the cover letter, I need to understand your genuine reasons for
> applying. Four quick questions:
>
> 1. What specifically caught your attention about this company or role?
>    (Their product, a specific feature, how they work, their reputation, something
>    you read — anything concrete, not just 'I'm excited about the opportunity')
>
> 2. What's the connection between their work and where you want to go next?
>    (What does working here let you do or become that you can't elsewhere?)
>
> 3. If you could talk to the Lead Engineer of this team for 30 seconds, what's
>    the one thing you'd want them to know about your philosophy?
>    (Not your skills — your belief about how good engineering should work. Even
>    one sentence or a rough idea is enough to work with.)
>
> 4. Anything you know about their team, way of working, or recent news?
>    (Optional — skip if nothing comes to mind)"

After receiving answers:

- If any answer to Q1 or Q2 is generic ("I'm passionate about the mission",
  "great company culture") with no specific detail, ask one follow-up: "What
  specifically about [X] resonates? Even one concrete detail makes the letter
  much stronger."
- Q3 (philosophy) rarely gets a polished answer — that's fine. A rough idea
  like "I believe owning a feature means owning the outcome, not just the code"
  is enough. Do not push for refinement; extract the signal and craft the hook.
- If question 4 is skipped, proceed without it.

Save the captured motivation to `draft-letter/motivation.md` inside the current
run folder:

```markdown
# Motivation — [Company] / [Role]
Generated: [timestamp]

## Why this company
[answer to Q1]

## Connection to career direction
[answer to Q2]

## Engineering philosophy hook
[answer to Q3 — the raw answer; will be refined in Step 7]

## Team / working style notes
[answer to Q4, or "None provided"]
```

---

## Step 5 — Select proof points

A cover letter needs 2–3 stories, not 5–6 project summaries. The selection
criteria are different from the CV.

**Score every project in the seed for cover letter narrative potential:**

| Signal | Weight |
|--------|--------|
| Has a clear arc: problem → decision → outcome → reflection | High |
| Shows character beyond the task (initiative, ownership, mentoring) | High |
| Directly maps to the JD's most important requirement | High |
| Has a memorable or surprising detail | Medium |
| Strong metric but no arc | Low |
| Pure technical description, no human element | Low |

Primary source: `Valued Inputs` sections from project files — these describe
*how* the candidate worked, not just *what* they shipped. These make better
cover letter stories than achievements alone.

**Selection rules:**
- Pick 2 stories minimum, 3 maximum
- At least 1 story must map directly to the JD's top requirement
- At least 1 story must show character signal (initiative, ownership, learning)
- Stories must be distinct — do not pick two stories that demonstrate the same
  quality. If the top 2 both show "ownership", swap the second for one that
  shows a different dimension.
- Prefer stories that connect to the motivation captured in Step 4

**The Golden Ratio (for Senior roles at large organisations):**
When 3 stories are selected, aim for one story from each category:

| Category | What it demonstrates | Example signal |
|----------|---------------------|----------------|
| Technical Depth | Hard problem, large system, architectural decision | Payment system migration, cross-module mapping, performance fix |
| Soft Leadership / Ownership | Mentoring, process change, proactive knowledge sharing | git bisect session, internal tooling to remove team friction, PRD scope expansion |
| Business Impact | User numbers, delivery metric, measurable outcome | 1,300 users / 90% DAR, zero-disruption migration, on-time delivery with scope additions |

Why: a Senior hire at a large organisation must signal three things simultaneously —
can they go deep technically, can they uplift the people around them, and do they
connect their work to outcomes. Two stories of the same category produces a flat
portrait. The Golden Ratio prevents this.

If only 2 stories are selected, ensure the pair covers at least 2 of the 3
categories above. Do not force a third story just to hit the ratio.

**Gap story (optional, adds up to 1 more story slot):**
Check `analysis.md` `## Gaps Flagged`. If there is a hard blocker gap AND the
`Adjacent evidence` column has genuine evidence, a brief acknowledgement in the
letter can turn the gap into a signal of self-awareness. Only include this if
the gap is hard blocker severity and the adjacent evidence is genuinely close.

**Smart Silence rule (experience-years gap):**
If the gap flagged is "Years of Experience" type and the deviation is less than
15% of the required threshold (e.g. 4y 7mo vs "5+ years required" = ~9% short),
do not mention the number in the letter. Instead:
- Use qualitative language: "nearly five years", "extensive production exposure",
  "across the full SDLC"
- Anchor seniority to complexity of problems solved, not years counted
- Let the stories carry the seniority signal — a recruiter who reads the git
  bisect story and the end-to-end deployment story will not be counting months

Stating the number would invite comparison. Silence with strong evidence wins.

---

## Step 6 — Determine tone

Derive company profile from `## JD Profile` in `analysis.md` (already loaded).
Look at "Role type" and "Soft signals" to infer the register:

| What you see in JD Profile | Tone |
|----------------------------|------|
| "startup" or "scale-up", fast-paced signals | Direct, first-person, energetic. Short sentences. Enthusiasm without filler. |
| Product company, mid-size, collaborative signals | Professional but personal. Some warmth. Medium sentence length. |
| Enterprise, bank, large org, structured SDLC | Polished, precise. Formal but not stiff. Longer sentences acceptable. |
| Outsource, agency, client-delivery focus | Professional, delivery-focused. Demonstrate reliability and throughput. |

Also check JD language quoted or paraphrased in `analysis.md`: if the JD uses
informal language ("you'll be building...", "we move fast"), match that register
regardless of company size.

---

## Step 7 — Write the cover letter

Structure: 3–4 paragraphs, 250–400 words. Do not include a header, date, or
salutation in the prose — these live in the YAML structure fields.

### Opening paragraph — why them + who you are

Lead with the motivation from Step 4 (Q1 and Q2). Mention the company or product
specifically. Connect it to one sentence about the candidate's current work or
direction.

If Q3 (philosophy hook) produced a usable signal, weave it into the opening as a
bridge between why them and who the candidate is. Do not quote it verbatim — distil
it into one sentence that sounds like the candidate's voice, not a mission statement.

**Do not open with:**
- "I am writing to apply for..."
- "I am excited about the opportunity..."
- "With [N] years of experience..."

These are generic and will be skipped. Open with the company, not yourself.

**Example pattern (not a template to copy):**
> "I've been following [product/area] since [specific thing] — and the [specific
> detail about their approach] is exactly the kind of problem I want to work on.
> Right now I'm [1-line current role context], and this role is where I want to
> take that work next."

### Proof point paragraphs — 2–3 stories as narrative prose

For each selected proof point, transform the CAR bullet into first-person narrative:

**Transformation rules:**
- Write in first person ("I", not "the candidate")
- Vary your paragraph structures to avoid sounding robotic. You don't need a "philosophical sandwich" (starting with a mindset statement and ending with a reflection) for every single point.
  - Some paragraphs can open with a mindset statement: "Ownership starts with visibility. At TNT Lab, that meant..."
  - Others can open directly with the context or problem: "When building the Admin Dashboard, our first priority was..."
- Include the decision or approach — what you chose to do and why.
- End with a strong impact statement OR a **Senior Reflection**. Do not force a reflection if the measurable outcome speaks for itself. If you do use a reflection, make sure it is a simple distillation of the operating principle, not a grand philosophical decree.
- Avoid stacking multiple philosophical statements in a row. Keep the tone grounded, practical, and conversational.
- Keep each story to 4–6 sentences — specific enough to be real, short enough to
  respect the reader's time.
- Do not use action verbs as sentence openers (that's CV format).
- Use active voice. Strip adverbs that modify competence: "I successfully migrated" →
  "I migrated". The success is implied by the outcome.

**Narrative flow — Natural Transitions:**

The opening paragraph establishes the philosophy. Proof point paragraphs should progress logically without feeling forced:
- Transitions between stories should feel natural and conversational. You can use simple connectors or just start a new thought.
- Do NOT force the closing thought of one paragraph to explicitly prime the next if it makes the writing sound stiff or over-engineered.
- The reader should feel a logical progression showing different facets of your seniority (e.g., technical depth, then soft leadership, then business impact), rather than feeling like they are reading a list of maxims.

**Engineer's Voice — confidence through procedure:**

Replace abstract superlatives with procedural evidence:
- ❌ "I have extensive experience in..." → describe the methodology instead
- ❌ "I am an expert in..." → show the decision, not the label

Use **Ownership Verbs** over passive constructions:
- Instead of "I was responsible for" → "I steered", "I architected", "I consolidated"
- Instead of "I helped with" → "I led", "I drove", "I owned"

**Sentence variety constraint:**

No more than two consecutive sentences should start with the same subject ("I", "The",
"This"). Mix short declarative sentences ("Found it in under an hour.") with longer
explanatory ones. Use introductory phrases to break subject repetition:
- "By doing X, I achieved Y"
- "Rather than [default approach], I [chosen approach]"
- "That could have ended there. Instead, I..."

**Anti-AI pattern constraints:**
The following words and phrases produce detectable AI-generated prose. Do not use them:
- Banned phrases: "thrilled to apply", "perfect fit", "passionate about", "in today's
  fast-paced world", "I am excited about the opportunity", "leverage", "synergy",
  "innovative", "dynamic", "transformative", "results-driven", "detail-oriented"
- Banned openers for proof point paragraphs: any sentence beginning with a strong
  action verb ("Delivered", "Led", "Spearheaded", "Drove") — this is CV format, not
  letter format. Open with context instead.
- Banned closers: "I look forward to hearing from you", "Please do not hesitate to
  contact me", any variant of restating your own qualifications

The test: read each paragraph aloud. If it sounds like it was written by someone
who has never met the candidate, rewrite it. If it sounds like the candidate talking
about something they actually care about, keep it.

**Original CAR bullet:**
> "Diagnosed critical bug across ~1,000 commits using git bisect; shared the
> technique with the team via internal knowledge-sharing session"

**Cover letter narrative version:**
> "One moment that's stayed with me: tracking down a regression buried somewhere
> in ~1,000 commits. Instead of guessing, I used git bisect to systematically
> narrow it down — found it in under an hour. But what mattered more to me was
> turning the whole process into a knowledge-sharing session. If I learn
> something useful, the team should too."

Map each story to a JD requirement from `analysis.md` `## JD Profile`. The
connection does not need to be stated explicitly — let the story speak.

### Closing paragraph

2–3 sentences. Do not summarise what you just said. Instead:
- Reiterate the connection between your direction and their work (1 sentence)
- Express genuine interest in next steps — specific, not generic (1 sentence)
- Optional: acknowledge a gap proactively if warranted (from Step 5 gap story)

**Do not close with:**
- "I look forward to hearing from you" (expected, forgettable)
- A summary of your skills or experience

---

## Step 8 — Save output

Assemble the structured YAML and save to:
```
jobs/[company-role]/[run-timestamp]/draft-letter/draft-letter.yaml
```

### YAML schema

```yaml
meta:
  generated: "YYYY-MM-DD_HH-MM"
  application: "[company-role slug]"
  target_role: "[role title from draft-cv.yaml meta.target_role]"
  company: "[company display name]"

contact:
  name: "[candidate name]"
  location: "[city, country]"
  email: "[email]"
  phone: "[phone]"
  linkedin: "[handle only]"
  github: "[handle only]"   # omit if not in profile

letter:
  date: "[Month DD, YYYY]"
  recipient:                # omit entire block if hiring manager unknown
    name: "[name]"
    title: "[title]"
    company: "[company]"
  salutation: "Dear Hiring Manager,"

  philosophy_hook: "[One sentence distilling Q3 — the candidate's engineering belief.
    Not rendered directly in HTML, but used as the thematic spine of the opening.
    Example: 'The distinction between a coder and a developer is responsibility for
    the outcome, not just the code.' Adjust wording per company culture — an
    enterprise values 'responsibility', a startup may value 'speed + ownership'.]"

  opening: |
    [Opening paragraph prose — why them + who you are. Weave philosophy_hook
    into the final sentence if it fits naturally.]

  proof_points:
    - title: "[Internal reference — not rendered in HTML]"
      paragraph: |
        [Story prose]
      jd_mapping: "[JD requirement this story maps to]"
    - title: "[...]"
      paragraph: |
        [...]
      jd_mapping: "[...]"

  closing: |
    [Closing paragraph]

  sign_off: "Sincerely,"
  signature: "[candidate full name]"

metadata:
  word_count: [integer]
  tone: "[startup|product-mid|enterprise|outsource]"
  gaps_addressed: []   # list gap names if any acknowledged in letter
```

After saving, output:
- The full letter rendered as readable prose (not raw YAML)
- Word count
- Which proof points were used and which JD requirements they map to (1 line each)
- Any gaps addressed in the letter
- `Run /html-letter [path/to/draft-letter.yaml] to render as HTML`

---

## Revision handling

If the user asks for revisions, apply them to the same file (overwrite).
Common revision requests and how to handle them:

| Request | Response |
|---------|----------|
| "More formal / less formal" | Adjust sentence structure and word choice throughout |
| "Shorter" | Trim proof point paragraphs first; never cut the opening or closing |
| "Swap the story about X" | Replace with next-highest-scored unused proof point |
| "Address the [gap] more directly" | Add 1–2 sentences to closing paragraph using the mitigation phrase from analysis.md |
| "Add more about [topic]" | Only if there is evidence in the dataset — do not invent |
| "Adjust the philosophy for a startup / more casual culture" | Rewrite `philosophy_hook` field with adjusted register, then rework the opening sentence where it appears |
| "Swap a story to hit the Golden Ratio" | Check which category (Technical Depth / Soft Leadership / Business Impact) is missing, then replace the weakest current story with the highest-scored uncovered candidate from Step 5 |
