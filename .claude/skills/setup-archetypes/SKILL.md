---
name: setup-archetypes
description: >
  Bootstrap or update archetypes in agents-ref/archetypes.yaml.
  Run this once before using /draft-cv to get archetype-aware tailoring.
  Re-run any time your target roles change.
  Trigger when the user says "/setup-archetypes", "set up archetypes",
  "define my archetypes", or "update my target roles".
  Do NOT trigger for per-application CV tailoring — use /draft-cv for that.
license: AGPL-3.0
compatibility: >
  Compatible with any Agent Skills-aware runtime that supports file-based skill activation
  and write access to the working directory.
metadata:
  author: tiennt0212
  version: 1.0.1
  introduced_in: v1.0.0
allowed-tools: Read Write Edit
---

# Setup Archetypes

Bootstrap or update `agents-ref/archetypes.yaml` through a three-step hybrid flow:
template anchor → dataset validation → optional JD refinement.

Archetype data lives in `agents-ref/archetypes.yaml` — a dedicated YAML file separate
from `agents-ref/schema.md` (which is documentation-only). This command reads and writes
`agents-ref/archetypes.yaml` only; it does not touch `agents-ref/schema.md`.

## Arguments
$ARGUMENTS — optional. If provided, treat as additional context about the
user's target roles (e.g. "I want to focus on platform work").

---

## Step 1 — Check current state

Read `agents-ref/archetypes.yaml`. If the file exists and contains archetypes, show the current
archetypes and ask:

> "You already have [N] archetypes defined: [list labels]. Do you want to:
> 1. Keep these and refine signals
> 2. Start fresh
> 3. Add a new archetype"

If the file does not exist or is empty, proceed to Step 2.

---

## Step 2 — Template anchor

Present a menu and ask the user to select the profile(s) closest to their
target roles. They can select multiple.

```
Which of these best describes the roles you're targeting?
(Select one or more — you can mix)

Frontend
  1. Product Frontend Engineer — features, design collab, user metrics
  2. Frontend Platform / DX Engineer — tooling, build infra, developer adoption

Full-Stack / Backend
  3. Full-Stack Generalist — end-to-end, breadth, startup pace
  4. Backend / API Engineer — services, data models, system reliability

Data & AI
  5. Data Engineer — pipelines, warehouses, data quality
  6. AI / ML Engineer — models, evals, LLM integration, MLOps

Infrastructure
  7. DevOps / Platform Engineer — CI/CD, infra, reliability
  8. Engineering Manager / Tech Lead — people, architecture, delivery

9. None of these fit — describe your target role instead
```

Based on their selection, load the corresponding pre-filled archetype template(s)
from the definitions below. These are starting points, not final output.

### Template definitions

Use these as draft archetypes. Each contains a pre-filled signal set.
Adjust labels and signals to match the user's context after Step 3.

**1 — Product Frontend Engineer**
```yaml
id: frontend-product
label: "Product Frontend Engineer"
signals: ["user-facing", "conversion", "a/b testing", "design collaboration",
          "ship fast", "feature ownership", "ux", "end-to-end"]
proof_points_priority:
  - "measurable user/product impact (conversion, retention, performance)"
  - "design collaboration and polish"
  - "end-to-end feature ownership"
summary_lead: "ownership of user-facing features and measurable product impact"
skills_priority: ["Frameworks", "UI/UX", "Testing"]
```

**2 — Frontend Platform / DX Engineer**
```yaml
id: frontend-platform
label: "Frontend Platform / DX Engineer"
signals: ["developer experience", "dx", "build tooling", "monorepo",
          "platform team", "unblock engineers", "internal adoption",
          "bundler", "ci pipeline", "design system"]
proof_points_priority:
  - "adoption by other engineers/teams"
  - "build time, CI, or DX metrics"
  - "systemic reduction of duplication or onboarding time"
summary_lead: "platform thinking and tooling that multiplies other engineers' output"
skills_priority: ["Build & Tooling", "Frameworks", "Engineering Practices"]
```

**3 — Full-Stack Generalist**
```yaml
id: fullstack-generalist
label: "Full-Stack Generalist"
signals: ["end-to-end", "full-stack", "solo", "wore many hats", "0 to 1",
          "ship fast", "breadth", "startup", "frontend and backend"]
proof_points_priority:
  - "shipped end-to-end with minimal team"
  - "breadth of ownership (frontend + backend + deployment)"
  - "speed and initiative"
summary_lead: "end-to-end ownership and breadth across the stack"
skills_priority: ["Frameworks", "Backend", "Infrastructure"]
```

**4 — Backend / API Engineer**
```yaml
id: backend-api
label: "Backend / API Engineer"
signals: ["api design", "services", "reliability", "scalability", "data model",
          "distributed systems", "backend", "database", "performance"]
proof_points_priority:
  - "system reliability and scale"
  - "API design decisions"
  - "performance and data model improvements"
summary_lead: "reliable, scalable backend systems and API design"
skills_priority: ["Backend", "Databases", "Infrastructure"]
```

**5 — Data Engineer**
```yaml
id: data-engineer
label: "Data Engineer"
signals: ["data pipeline", "etl", "data warehouse", "data quality",
          "orchestration", "dbt", "airflow", "analytics engineering"]
proof_points_priority:
  - "pipeline reliability and data quality"
  - "downstream business impact of the data"
  - "scale (rows/day, latency)"
summary_lead: "reliable data pipelines and infrastructure that powers decisions"
skills_priority: ["Data & Pipelines", "Languages", "Infrastructure"]
```

**6 — AI / ML Engineer**
```yaml
id: ai-ml
label: "AI / ML Engineer"
signals: ["llm", "rag", "evals", "fine-tuning", "mlops", "inference",
          "agentic", "prompt engineering", "model deployment", "observability"]
proof_points_priority:
  - "production quality (evals, reliability, cost)"
  - "model or pipeline impact metrics"
  - "agentic or orchestration design"
summary_lead: "production-grade AI systems with a focus on reliability and evals"
skills_priority: ["AI & ML", "Infrastructure", "Languages"]
```

**7 — DevOps / Platform Engineer**
```yaml
id: devops-platform
label: "DevOps / Platform Engineer"
signals: ["ci/cd", "kubernetes", "terraform", "infrastructure as code",
          "reliability", "sre", "deployment", "monitoring", "observability"]
proof_points_priority:
  - "reliability metrics (uptime, incident reduction)"
  - "deployment automation and speed"
  - "infra cost or scale improvements"
summary_lead: "reliable infrastructure and deployment pipelines that unblock teams"
skills_priority: ["Infrastructure", "Cloud", "Languages"]
```

**8 — Engineering Manager / Tech Lead**
```yaml
id: tech-lead
label: "Engineering Manager / Tech Lead"
signals: ["tech lead", "engineering manager", "people manager", "team lead",
          "architecture", "mentoring", "hiring", "roadmap", "cross-functional"]
proof_points_priority:
  - "team delivery and output"
  - "architectural decisions and outcomes"
  - "people growth (promotions, mentoring)"
summary_lead: "technical leadership and team delivery"
skills_priority: ["Leadership", "Architecture", "Frameworks"]
```

---

## Step 3 — Dataset validation

Read all files in `personal-data/projects/`. Extract the tags from each project.

Find the top 5 most-frequent tags across all projects and check whether the
draft archetypes from Step 2 reflect them.

If there is a clear signal in the dataset not covered by any draft archetype, flag it:

> "I notice your projects have a lot of [tag] signals (N projects), but none of
> your current archetypes prioritise this. Should I add it to an existing archetype
> or create a new one?"

Do not add archetypes automatically — only propose and ask.

---

## Step 4 — Optional JD refinement

Ask:

> "Do you have any JD samples (roles you'd seriously consider applying to)?
> Pasting 2–3 will help me tune the signal words to match real market language.
> Skip if you don't have any handy."

If the user provides JDs:
- Extract the most distinctive phrases from each JD
- Compare against draft archetype signals
- Propose additions or replacements where the draft signals miss real JD language
- Show the diff before applying

If the user skips, proceed to Step 5.

---

## Step 5 — Review and write

Present the final archetype set for review:

```
Here are your [N] archetypes:

1. [label]
   Signals: [comma-separated]
   Summary angle: [summary_lead]

2. ...

Ready to save to agents-ref/archetypes.yaml? (yes / edit first)
```

On approval, write the full `archetypes` list to `agents-ref/archetypes.yaml`.
Replace the entire file — do not merge or append. Old archetypes may no longer be valid.

After saving, confirm:
> "Archetypes saved to agents-ref/archetypes.yaml. Run `/draft-cv` with a JD to see them in action."
