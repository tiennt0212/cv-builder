# setup-archetypes

Configures target role archetypes so `/draft-cv` knows what to emphasise for each type of role.

## Idea

The same project dataset should produce different emphasis depending on the role. A product frontend role rewards measurable user impact and design collaboration; a platform engineering role rewards adoption by other engineers and CI/build metrics. Without archetypes, `/draft-cv` can only use keyword frequency — which misses these qualitative differences. Archetypes are named signal sets that teach the system which proof points to surface, which bullets to lead with, and how to angle the summary — calibrated once for the candidate's target role types.

## Scope

**Handles:**
- Selecting from 8 built-in template archetypes (see Capabilities)
- Dataset validation: checks whether selected archetypes reflect the candidate's most frequent project tags; flags uncovered signals
- Optional JD-based signal refinement: tunes signal words to match real market language from 2–3 sample JDs
- Custom archetype: user can describe a role not in the template list (option 9)

**Does not handle:** Per-application tailoring — archetypes set *global* role profiles; `/draft-cv` applies them to specific JDs

## Capabilities

8 template archetypes available:

| # | Archetype | Primary proof points |
|---|-----------|---------------------|
| 1 | Product Frontend Engineer | User/product impact, design collaboration, feature ownership |
| 2 | Frontend Platform / DX Engineer | Engineer adoption, build/CI metrics, systemic reduction of duplication |
| 3 | Full-Stack Generalist | End-to-end ownership, breadth, speed |
| 4 | Backend / API Engineer | Reliability, API design decisions, performance |
| 5 | Data Engineer | Pipeline reliability, data quality, downstream business impact |
| 6 | AI / ML Engineer | Production quality (evals, cost), pipeline impact, agentic design |
| 7 | DevOps / Platform Engineer | Uptime/incident reduction, deployment automation, infra cost |
| 8 | Engineering Manager / Tech Lead | Team delivery, architectural decisions, people growth |

Multiple archetypes can be selected — `/draft-cv` detects which archetype a given JD matches most closely, or identifies a hybrid ratio (e.g. 70% frontend-product / 30% frontend-platform).

## Input / Output

**Input:** User selection (numbers 1–8, or free-form description) + optional 2–3 JD samples for signal refinement

**Output:**
```
agents-ref/archetypes.yaml   ← full replace on each run
```

## Works with

**Run once before first `/draft-cv` use.** Re-run when target role types change significantly (e.g. pivoting from product frontend to platform engineering).

**Used by:** `/draft-cv` reads `agents-ref/archetypes.yaml` at Step 2.5 of every run.
