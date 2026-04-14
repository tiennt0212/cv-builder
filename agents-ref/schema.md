# Dataset Schema & Rules

Single source of truth for the entire `data/` directory. Read this file before creating or editing any data files.

---

## Project File Schema (`personal-data/projects/*.md`)

```markdown
---
title: [string]           # Project or feature name
company: [slug]           # Must match a filename in personal-data/companies/ (without .md), or "personal"
role: [string]            # Job title: "Frontend Developer", "Full-stack Developer", etc.
dates: [string]           # Format: "Mon YYYY – Mon YYYY" or "Mon YYYY – Present"
type: [enum]              # See Enum Values below
tags: [list]              # See Tag Taxonomy below — include every tag that applies
stack: [list]             # Technologies used — use proper case (see Stack Naming)
team_size: [string]       # Optional — e.g. "1 PM, 2 BE, 3 FE" or "Solo"
live_url: [url]           # Optional — live URL of the app
github_url: [url]         # Optional — GitHub repo if open-source
award: [string]           # Optional — award name if hackathon
superseded_by: [slug]     # Optional — slug of a later project that covers the same signal; /draft-cv will skip this project by default
proof_points: [list]      # Optional — raw context facts for /draft-cv (scale, constraints, links). Not rendered in CV.
---

## Description
[1–2 sentences: what the product/project is, who it serves, team size if relevant. Context only — no achievements here.]

## Achievements
- [Strong action verb] [what you did] — [specific result]

## Valued Inputs
[2–4 lines: what the developer contributed beyond the assigned task — initiative, proposals, cross-team work, documentation, ownership decisions.]
```

---

## Company File Schema (`personal-data/companies/*.md`)

```markdown
---
name: [string]                 # Full company name
industry: [string]             # e.g. "SaaS / CRM", "HR Tech", "Blockchain", "Freelance"
type: [enum]                   # product | outsource | agency | freelance
size: [enum]                   # startup | mid-size | enterprise | individual
location: [string]             # e.g. "Ho Chi Minh City, Viet Nam" or "Remote"
working_time_range: [string]   # Authoritative employment dates — "Mon YYYY – Mon YYYY" or "Mon YYYY – Present"
                               # This is the source of truth for CV tenure dates.
                               # Do NOT derive from project dates — project dates record when specific work happened,
                               # not when the employment relationship started and ended.
---

[1–2 sentences describing the company and its main product or service.]
```

---

## Enum Values

### `type` (project)
| Value | When to use |
|-------|-------------|
| `product` | Working on an internal product long-term |
| `outsource` | Delivering work for an external client |
| `freelance` | Self-contracted, independent work |
| `open-source` | Contributing to an open-source project |
| `hackathon` | Short-term competition project |

### `type` (company)
| Value | When to use |
|-------|-------------|
| `product` | Company builds its own product |
| `outsource` | Company takes contracts from foreign clients |
| `agency` | Design/development agency serving multiple clients |
| `freelance` | Not associated with any company |

### `company`
- Must exactly match a filename in `personal-data/companies/` (without the `.md` extension)
- Example: if `personal-data/companies/tnt_lab.md` exists, use `company: tnt_lab`
- Use `"personal"` for hackathons or side projects not tied to any company

### `dates`
- Format: `Mon YYYY – Mon YYYY` (e.g. `Dec 2025 – Present`, `Aug 2023 – Feb 2024`)
- Abbreviated month, 3 characters: Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
- Use en-dash (–) not hyphen (-)

---

## Stack Naming Convention

Use proper case matching how the brand names itself. Do not use lowercase or non-standard abbreviations.

| Correct | Incorrect |
|---------|-----------|
| ReactJS | react, React.js, react.js |
| NextJS | next.js, Next, nextjs |
| VueJS | vue, Vue.js, vuejs |
| TypeScript | TS, typescript |
| JavaScript | JS, javascript |
| TailwindCSS | tailwind, Tailwind |
| Ant Design | antd, ant-design |
| GraphQL | graphql, GRAPHQL |
| RESTful API | REST, rest api |
| Supabase | supabase |

---

## Tag Taxonomy

Tags are the primary signal `/draft-cv` uses to score project relevance when matching against a JD. **Over-tagging is better than under-tagging** — if unsure, include it.

### Role type tags
`product` `outsource` `freelance` `open-source` `hackathon`

### Work nature tags
`system-design` `architecture` `performance` `refactor` `migration` `data-visualization` `pdf-generation` `api-integration` `state-management` `internal-tooling` `knowledge-sharing` `cross-timezone` `multi-role` `admin-dashboard` `end-to-end` `documentation` `testing` `large-codebase`

### Domain tags
`crm` `ecommerce` `blockchain` `crypto-wallet` `ai` `chatbot` `seo` `ssr` `accessibility` `monitoring` `service-management` `identity` `nft` `gaming` `healthcare` `fintech` `hr-tech`

### Skill tags
`reactjs` `nextjs` `vuejs` `typescript` `javascript` `graphql` `restful-api` `oauth2` `supabase` `tailwindcss` `figma` `docker` `smart-contract` `pinia` `redux` `jotai` `swr` `recharts` `chartjs` `liquidjs`

### Impact tags
`user-metrics` `delivery-speed` `client-support` `winner` `open-source-contribution` `ux-proposal` `zero-downtime` `cost-reduction` `team-enablement`

### AI tags
`agentic-workflows` `context-engineering` `prompt-patterns` `ai-assisted` `llm` `chatbot` `cursor` `claude-code`

### Adding new tags
- Format: lowercase, underscore-separated within a concept, hyphen-separated between concepts (e.g. `react-native`, `real-time`)
- Only add tags that will be reused across multiple projects — avoid one-off tags
- Update `schema.md` after adding a new tag

---

## Naming Conventions

Use **underscores** within a name group (to join words in a single concept) and a **hyphen** to separate the two groups (company vs project).

### Project files
Pattern: `[company_slug]-[project_name].md`

- `company_slug`: lowercase, underscores between words (matches the company filename without `.md`)
- `project_name`: 2–4 words, lowercase, underscores between words
- Examples:
  - `tnt_lab-dashboard_redesign.md`
  - `startup_co-payment_gateway.md`
  - `agency_co-identity_platform.md`
  - `freelance-admin_chatbot.md`

### Company files
Pattern: `[company_slug].md`

- Lowercase, underscores between words
- Examples: `startup_co.md`, `tnt_lab.md`, `dev_bridge.md`

---

## Section Rules

### `Description`
- Context only: what the product is, who it serves, team size if relevant
- Must not contain achievements, results, or specific work done
- Keep short: 1–2 sentences

### `Achievements`
- Use **CAR format**: Context/challenge → Action → Result
- Every bullet must open with a **strong action verb**: Built, Designed, Delivered, Optimised, Migrated, Diagnosed, Architected, Led, Implemented, Refactored
- **Never use**: "Responsible for", "Helped with", "Assisted in", "Participated in", "Worked on"
- At least 1 bullet must include a measurable result (number, percentage, scale, ranking)
- Spell out acronyms on first use within the file: "Server-Side Rendering (SSR)"

### `Valued Inputs`
- What the developer contributed **beyond the assigned task**
- Examples: self-initiated work, proposals, cross-team collaboration, documentation, ownership decisions, knowledge sharing
- Must not repeat achievements — this is the "extra mile" section

### `Proof Points` (optional)

Raw context facts that `/draft-cv` uses to strengthen bullets. Not rendered into the CV — used as background for content decisions.

Examples:
- Scale: "system handled 50k requests/day at peak"
- Constraints: "2-engineer team, no dedicated DevOps"
- Magnitude: "migration happened with zero downtime across 3 production services"
- External: "blog post: [url]", "open-source: [url]"

```yaml
proof_points:
  - "..."
  - "..."
```

---

## Archetypes (`agents-ref/archetypes`)

Archetypes describe the kind of engineer a JD is hiring — not the tech stack, but the
*function and daily output*. `/draft-cv` reads this block to detect the closest archetype
and use it to weight project scoring, bullet ordering, and summary framing.

Each archetype has:
- `id`: slug used in code references
- `label`: human-readable name
- `signals`: JD phrases that indicate this archetype. Must be distinguishable *between*
  archetypes in this set — generic terms like "React" or "TypeScript" are not signals.
- `proof_points_priority`: which kinds of achievements to surface first when ordering
  bullets within a project. Phrased as values/signals, not specific bullets.
- `summary_lead`: the narrative angle the summary should open with.
- `skills_priority`: skill categories to front-load in the Skills section.

### Rules
- Keep 2–4 archetypes. More than 4 makes detection noisy.
- Signals must distinguish archetypes from each other, not just describe the role.
- If two archetypes share >70% of signals, merge them.

> **Live archetype data lives in `agents-ref/archetypes.yaml`.**
> Run `/setup-archetypes` to create or update it. Do not edit this file to change archetypes.

### Structure reference (one archetype entry)

```yaml
# agents-ref/archetypes.yaml
archetypes:
  - id: frontend-product            # slug — used internally
    label: "Product Frontend Engineer"
    signals:
      - "user-facing"               # JD phrases that indicate this archetype
      - "feature ownership"         # must distinguish between archetypes, not just describe the role
    proof_points_priority:
      - "measurable user/product impact"   # guides bullet ordering within a project
      - "end-to-end feature ownership"
    summary_lead: "ownership of user-facing features with measurable product impact"
    skills_priority:
      - "Frameworks"                # categories to front-load in the Skills section
      - "UI/UX"
```

