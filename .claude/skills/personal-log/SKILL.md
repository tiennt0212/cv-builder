---
name: personal-log
description: >
  Add or update any career data in personal-data/ — projects, companies, profile sections
  (skills, certifications, awards, publications, languages, education).
  Also imports career data in bulk from an existing CV document (PDF, Word, or pasted text).
  Use this skill whenever the developer wants to record something new about their career,
  update existing data before running /draft-cv, or onboard an existing CV into the system.
  Trigger when the user describes a new project, job, promotion, certification, award,
  publication, skill, or any career update. Also trigger when they say "/personal-log",
  "add to my data", "import my CV", "I have an old CV", "extract from my resume",
  or provide a file path / paste a large block of CV-formatted text.
  Do NOT trigger for CV generation (use /draft-cv) or rendering (use /html-cv).
---

# Personal Log — Career Data Manager

Record or update any career data in `personal-data/`. Covers companies, projects, and all profile sections.

Read `agents-ref/schema.md` first — it defines all valid enum values, tag taxonomy, naming conventions, and section rules used throughout this skill.

## Arguments
$ARGUMENTS — optional. If provided, treat as the initial description and skip the opening question in Step 1.

---

## Step 1 — Determine intent

Read the current state of `personal-data/` to orient yourself:
- `personal-data/profile.md` — candidate profile, skills, certifications, awards, publications, languages
- `personal-data/companies/` — list of employers
- `personal-data/projects/` — list of projects

Based on $ARGUMENTS (or by asking "What would you like to log?"), classify the intent into one of:

| Intent | Destination | Go to |
|---|---|---|
| New project | `personal-data/projects/[slug].md` (new file) | Project Flow |
| Update existing project | `personal-data/projects/[slug].md` (edit) | Project Update Flow |
| New company | `personal-data/companies/[slug].md` (new file) | Company Flow |
| New role / promotion at existing company | existing project file + possibly new project | Promotion Flow |
| New certification | `personal-data/profile.md` — Certifications section | Profile Flow |
| New award | `personal-data/profile.md` — Awards section | Profile Flow |
| New publication | `personal-data/profile.md` — Publications section | Profile Flow |
| New skill or technology | `personal-data/profile.md` — Skills section | Profile Flow |
| New language | `personal-data/profile.md` — Languages section | Profile Flow |
| Education update | `personal-data/profile.md` — Education section | Profile Flow |
| Set up profile from scratch / first-time profile setup | `personal-data/profile.md` (create) | Profile Flow |
| Import from existing CV / resume | `personal-data/companies/`, `personal-data/projects/`, `personal-data/profile.md` | CV Import Flow |

If the intent covers multiple destinations (e.g. new job = new company + new project), handle them in sequence.

---

## Project Flow — new project

### Step P1 — Gather information

Based on what the developer has shared, identify what's missing and ask targeted follow-up questions. Ask no more than 4 questions per round.

**Required fields (must have all before drafting):**
- Project/product name and what it does (1–2 sentences)
- Company or context (employer slug matching `personal-data/companies/`, or "personal" for hackathons/side projects)
- Role title and dates (start month/year — end month/year, or Present)
- Project type (see `agents-ref/schema.md`)
- Tech stack
- At least 1 specific achievement — not generic, something concrete

**Achievement probing questions (ask if not already shared):**
- What specifically did you build or own?
- What was the outcome — for users, the team, or the business? Any numbers, even rough estimates?
- Was there anything you did proactively, beyond what was asked?
- Did you collaborate cross-functionally, unblock anyone, or produce any documentation?
- (Optional) Do you have any background facts worth noting? (scale the system operated at, team/resource constraints, links to blog posts or open-source repos) — these help /draft-cv write stronger bullets but won't appear verbatim in the CV. Skip if nothing comes to mind.

If answers are vague (e.g. "I improved performance"), ask one focused follow-up: "What specifically did you change, and what did it affect?"

Do not proceed until you have at least: dates, tech stack, and 1 concrete achievement.

### Step P2 — Select tags

Tags are the primary signal `/draft-cv` uses to score project relevance against a JD. Poorly chosen tags mean the project gets excluded even when clearly relevant. **Over-tagging is better than under-tagging.**

See `agents-ref/schema.md` for the full tag taxonomy. Select every tag that genuinely applies.

### Step P3 — Draft and review

Write the full project file using the schema from `agents-ref/schema.md` and present it for review before saving. Include a `proof_points` field in the frontmatter if the user provided any background facts in P1; omit the field entirely if they did not.

Apply the bullet quality standard from `agents-ref/cv-bullet-rules.md` (CAR structure, action verbs, measurable results, length). Also follow stack naming conventions in `agents-ref/schema.md`.

### Step P4 — Check company file

Before saving, verify the company exists in `personal-data/companies/`:
- If it matches an existing file, proceed
- If not, run the Company Flow first, then return here

### Step P5 — Save

After approval, save to `personal-data/projects/[company_slug]-[project_name].md`:
- `company_slug`: matches the filename in `personal-data/companies/` (underscores between words)
- `project_name`: 2–4 words, lowercase, underscores between words
- Examples: `startup_co-payment_gateway.md`, `agency_co-admin_dashboard.md`

Confirm the saved path, then suggest: "Run `/draft-cv` with a JD to see how this project gets incorporated."

---

## Project Update Flow — existing project

1. Read the current file
2. Ask what changed: new achievement, updated result, date extension, new tech added?
3. Draft the updated section(s) and show the diff before writing
4. Apply the same bullet quality rules from the Project Flow
5. Save to the same file path

---

## Company Flow — new company

Gather:
- Full company name
- Industry (e.g. "SaaS / CRM", "HR Tech", "Blockchain")
- Type: see `agents-ref/schema.md` for valid values
- Size: see `agents-ref/schema.md` for valid values
- Location: city, country (or "Remote")
- 1–2 sentences describing what the company does

Save to `personal-data/companies/[company_slug].md`. Company slug: lowercase, underscores between words.

---

## Promotion Flow — new role at existing company

A promotion or role change may mean:
- The existing project's dates should be closed (end date added)
- A new project file should be started for the new role period

Ask:
1. What is the new role title and start date?
2. Is the work continuing on the same product/codebase, or a new assignment?
3. Are there achievements from the previous role period that haven't been logged yet?

Then:
- If same product: update the existing project file (close dates, optionally add a note about role change)
- If new assignment: close existing project, create a new project file via Project Flow

---

## Profile Setup Flow — first-time profile creation

Use this flow when `personal-data/profile.md` does not exist yet (new user who hasn't imported a CV).

1. Create the file from `agents-ref/profile-template.md`
2. Ask the user for the minimum required fields:
   - Full name, email, location
   - `career_start` (month + year they began working professionally)
   - A 1–2 sentence identity summary ("I'm a frontend engineer who...")
3. Write those fields into the new file and confirm the saved path
4. Suggest next step: "Run `/personal-log` to add your employers and projects, or say 'I have an old CV' to import in bulk."

---

## Profile Flow — profile.md updates

If `personal-data/profile.md` does not exist, go to **Profile Setup Flow** instead.

Read `personal-data/profile.md` first to understand current state before making changes.

### Certification
Gather: title, issuer, date (Mon YYYY). Append to `## Certifications` section.

### Award
Gather: title, context/event, date, URL (optional). Append to `## Awards` section.

### Publication
Gather: title, venue/conference/journal, date, URL (optional). Append to `## Publications` section.

### Skill / Technology
Identify which category the skill belongs to (Frontend Core, State & Data, UI/UX, AI-assisted Development, Engineering Practices, Relevant Tech). Add to the appropriate line. If it fits no existing category, propose a new one.

### Language
Gather: language name, proficiency level (native / professional working proficiency / conversational). Append to `## Languages` section.

### Education
Gather: degree, institution, GPA (optional), dates. Append to `## Education` section.

After updating profile.md, confirm the change and show the updated section.

---

## CV Import Flow — import from existing CV document

Use this flow when the user provides an existing CV (pasted text, file path to `.pdf` / `.docx` / `.txt`, or any readable format) and wants to bulk-import their career history into `personal-data/`.

### Step I1 — Receive CV content

If CV content is not already provided, ask:
> "Please paste your CV text directly, or give me the file path to your CV (PDF, Word, or plain text)."

Read the content and confirm receipt before proceeding:
> "I've read your CV. I'll extract companies, projects, and profile sections — then review each with you before saving."

### Step I2 — Extract and map to schema

Parse the full CV content and extract:
- **Companies**: name, industry, type, size, location, employment dates
- **Projects / roles**: title, company, dates, tech stack, achievements, description
- **Profile sections**: skills, education, certifications, awards, languages

Map everything to `agents-ref/schema.md` format:
- Normalize stack names per the Stack Naming Convention table in `agents-ref/schema.md` — do not guess from memory.
- Format all dates as `Mon YYYY – Mon YYYY` with en-dash
- Infer tags from stack and domain context — over-tagging is better than under-tagging
- Flag fields that cannot be inferred (e.g. `type`, `size`, `team_size`) — do not guess silently

Apply bullet quality rules from `agents-ref/cv-bullet-rules.md` (CAR structure, action verbs, measurable results). If CV bullets are vague (no result, weak verb), ask one focused follow-up before accepting:
> "This achievement doesn't have a measurable result — can you share any numbers or specific outcomes? Even rough estimates help."

### Step I3 — Review loop

Process in order: companies first, then each project, then profile sections.

For each item, show the full drafted content and ask for confirmation before writing:
> "Here's how I'd record [Company X] — does this look right? Any corrections?"

Fill in flagged/missing required fields interactively. Required fields that cannot be inferred must be asked — never skipped.

Before overwriting any file that already exists:
> "This file already exists (`personal-data/projects/tnt_lab-dashboard.md`) — do you want to overwrite it, merge the new content in, or skip?"

### Step I4 — Write to personal-data/

After user confirms each item, save to the canonical paths:
- `personal-data/companies/[slug].md`
- `personal-data/projects/[company_slug]-[project_name].md`
- `personal-data/profile.md` — append to existing sections if file exists; create from `agents-ref/profile-template.md` if absent

### Step I5 — Import summary

Report what was written:
- X companies created/updated
- Y projects created/updated
- Profile sections updated: (list)
- Items skipped or deferred: (list)

Suggest next step:
> "Run `/personal-log` to add more detail to any project, or `/draft-cv` with a job description to start applying."
