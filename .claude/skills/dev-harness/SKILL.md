---
name: dev-harness
description: >
  Autonomous multi-phase skill development harness for toolkit contributors.
  Orchestrates Planner, Implementer, Checker, Eval, and PR sub-agents in an
  OODA loop (Observe → Orient → Decide → Act) with lint-driven remediation.
  Each phase runs in an isolated sub-agent with fresh context; shared state lives
  in .claude/harness/harness-state.json on disk.
  Trigger when the user says "/dev-harness", "run the harness on", "build this skill
  autonomously", "use the dev harness for", or "harness implement".
  With "--auto" flag: fully autonomous loop, no human checkpoints between phases.
  Without flag: pauses after each phase for human review.
  Do NOT trigger for one-off skill edits — use /skill-creator for those.
  Do NOT trigger for user data issues — use /lint-data or /lint-toolkit for those.
---

# dev-harness — Autonomous Skill Development Harness

This skill is a **true harness**: it does not guide the user through steps manually.
It runs an autonomous OODA loop, spawning isolated sub-agents for each phase,
sharing state only through files on disk. The loop continues until either all
lint checks pass or `max_iterations` is reached.

**Why sub-agents instead of phases in one conversation?**
Each phase needs a clean context window. The Implementer must not see the
Planner's reasoning noise; the Checker must not inherit the Implementer's
partial edits as assumptions. Context isolation prevents cross-phase contamination
that leads to hallucinated "fixes" based on prior conversation state.

**Why harness-state.json instead of conversation memory?**
State on disk is inspectable, resumable, and survives context compaction.
A sub-agent reading the state file gets a deterministic, structured input —
not a reconstructed summary of prior turns.

---

## Arguments

`$ARGUMENTS` — required. Syntax: `[--auto] <task description>`

- `--auto` (optional): suppresses all human checkpoints; runs phases back-to-back
  until done or max_iterations reached.
- `<task description>`: free-form description of what to build or improve.
  Examples: "add a new skill for X", "fix frontmatter in the latex-cv skill",
  "improve bullet quality guidance in draft-cv".

If no task is provided, stop and ask once before proceeding.

---

## Step 0 — Parse arguments and initialize state

**Parse `$ARGUMENTS`:**
- If the first token is `--auto`, set `auto = true` and strip it. The remainder is the task.
- Otherwise `auto = false` and the full argument string is the task.
- If task is empty, ask the user: "What should the harness build or fix?"

**Create working directory:**
```
.claude/harness/
```
Write `.claude/harness/harness-state.json` with this exact schema:

```json
{
  "task": "<task from arguments>",
  "phase": "planner",
  "iteration": 0,
  "max_iterations": 5,
  "auto": <true|false>,
  "target_skills": [],
  "artifacts": [],
  "errors": [],
  "eval_scores": {},
  "pr_description": "",
  "started_at": "<ISO8601 from: date -Iseconds>",
  "updated_at": "<ISO8601 from: date -Iseconds>"
}
```

Then proceed immediately to Step 1.

---

## Step 1 — Planner phase

**Spawn the Planner sub-agent** using the Agent tool. The sub-agent prompt must say:

> You are the Planner in a dev-harness run. Your job is to read context and emit
> a structured brief. Do not implement anything. Do not edit skill files.
>
> Read these files in order:
> 1. `.claude/harness/harness-state.json` — your task is in the `task` field
> 2. `AGENTS.md` — skills table and authoring rules
> 3. `evals/criteria.md` — evaluation rubric for all skills
> 4. Read any `.claude/skills/*/SKILL.md` files relevant to the task. If the task
>    is broad (e.g. "fix all frontmatter"), read all of them.
> 5. `agents-ref/schema.md` — enum and tag taxonomy reference
>
> Then write `.claude/harness/harness-brief.md` with:
> - **Task scope**: what is being built or fixed, in 1–3 sentences
> - **Target skills**: list of `.claude/skills/<name>/SKILL.md` paths to create or modify
> - **Acceptance criteria**: numbered list, each keyed to a section in `evals/criteria.md`
>   (e.g. "A1: frontmatter completeness — name and description fields present")
> - **Update obligations**: other files to update (AGENTS.md table rows, evals fixtures,
>   evals/criteria.md sections if adding a new skill)
> - **Risks**: anything that could cause the Implementer to go wrong
>
> Finally, update `.claude/harness/harness-state.json`:
> - Set `target_skills` to the list of skill names the Implementer will touch
>   (just the names, not paths; e.g. `["latex-cv", "draft-cv"]`)
> - Append to `artifacts`: `{ "phase": "planner", "iteration": 0, "file": "harness-brief.md", "status": "written" }`
> - Update `updated_at` to current ISO8601 timestamp

**After the Agent tool returns:**

Read `.claude/harness/harness-state.json` to confirm `target_skills` is populated
and `harness-brief.md` exists.

If `auto = false`:
> "Planner complete. Review `.claude/harness/harness-brief.md` then reply 'continue'
> to proceed to Implementer."
> Wait for user confirmation before continuing.

If `auto = true`: proceed immediately to Step 2.

---

## Step 2 — Implementer phase (loop entry point)

Read `harness-state.json`. Note the current `iteration` value.

**Spawn the Implementer sub-agent** using the Agent tool. The sub-agent prompt must say:

> You are the Implementer in a dev-harness run (iteration <N>). Your job is to
> edit skill files to satisfy the brief. Follow the brief exactly — do not add
> features beyond what it specifies.
>
> Read these files in order:
> 1. `.claude/harness/harness-state.json` — read `target_skills`, `task`, and `errors`
> 2. `.claude/harness/harness-brief.md` — acceptance criteria and update obligations
> 3. `AGENTS.md` — authoring rules, skills table
> 4. `agents-ref/schema.md` — enum values and tag taxonomy (do NOT duplicate these in
>    skill files; reference schema.md instead)
> 5. For each skill in `target_skills`: read its current `.claude/skills/<name>/SKILL.md`
>
> **If iteration > 0**: also read the `errors` array from harness-state.json.
> Filter to errors where `iteration == <N-1>`. These are the lint failures from the
> last Checker run. Fix each one explicitly before finishing.
>
> **Implement**:
> - For a new skill: scaffold `.claude/skills/<name>/SKILL.md` with correct frontmatter
>   (name, description with trigger conditions and "Do NOT trigger" guard).
>   Follow the structure in `.claude/skills/lint-toolkit/SKILL.md` as a reference
>   for section layout. Never copy real personal data as examples — invent fictional ones.
> - For an existing skill: apply only the changes from the brief. Do not refactor
>   unrelated sections.
> - For AGENTS.md table row additions: add them now if listed in update obligations.
> - Do NOT run lint-toolkit. Do NOT score evals. Do NOT draft the PR. Those are other phases.
>
> After editing:
> - Update `.claude/harness/harness-state.json`:
>   - Set `phase: "checker"`
>   - For each file written, append to `artifacts`:
>     `{ "phase": "implementer", "iteration": <N>, "file": "<path>", "status": "written" }`
>   - Update `updated_at`

**After the Agent tool returns:**

If `auto = false`:
> "Implementer complete (iteration <N>). Reply 'continue' to run the Checker."
> Wait for user confirmation.

Proceed to Step 3.

---

## Step 3 — Checker phase

**Spawn the Checker sub-agent** using the Agent tool. The sub-agent prompt must say:

> You are the Checker in a dev-harness run. Your job is to audit the target skill
> files for structural integrity and report structured errors. You are executing the
> lint-toolkit checks for the skills section only.
>
> Read these files in order:
> 1. `.claude/harness/harness-state.json` — read `target_skills` and current `iteration`
> 2. `.claude/skills/lint-toolkit/SKILL.md` — your audit checklist (use Section A only:
>    Skills integrity, checks A1, A2, A3)
> 3. `agents-ref/schema.md` — enum values and stack naming convention (for A3 check)
> 4. `AGENTS.md` — skills table (for A2 file reference check)
> 5. For each skill in `target_skills`: read `.claude/skills/<name>/SKILL.md`
>
> **Run the checks** from lint-toolkit Section A for each target skill. For each
> finding, produce a structured error object. Output format (write this to state):
>
> ```json
> {
>   "iteration": <current iteration from state>,
>   "source": "lint-toolkit",
>   "severity": "ERROR" | "WARN" | "INFO",
>   "skill": "<skill name>",
>   "check": "A1" | "A2" | "A3",
>   "message": "<human-readable description of the specific finding>"
> }
> ```
>
> After checking all target skills:
> - Update `.claude/harness/harness-state.json`:
>   - Append all findings to the `errors` array (do NOT replace existing entries —
>     prior iterations' errors must be preserved for Implementer history)
>   - Set `phase: "decision"`
>   - Update `updated_at`
> - Print a summary: "Checker iteration <N>: <X> ERRORs, <Y> WARNs, <Z> INFOs"

**After the Agent tool returns**, the orchestrator (you, not a sub-agent) reads
`harness-state.json` and runs the decision gate in Step 4.

---

## Step 4 — Decision gate (orchestrator logic, not a sub-agent)

Read `harness-state.json`. You are the orchestrator. Apply this logic:

```
current_errors = [e for e in state.errors if e.iteration == state.iteration and e.severity == "ERROR"]

if len(current_errors) == 0:
    # All errors resolved — proceed to eval
    state.phase = "eval"
    write state
    proceed to Step 5

elif state.iteration >= state.max_iterations - 1:
    # Exhausted retries
    state.phase = "done"
    write state
    print "Harness stopped: max iterations (<max_iterations>) reached."
    print "Remaining ERRORs:"
    for e in current_errors: print "  [<e.skill>/<e.check>] <e.message>"
    print "Review .claude/harness/harness-state.json for full history."
    STOP — do not proceed to eval or PR

else:
    # Errors remain, retries available — loop back
    state.iteration += 1
    state.phase = "implementer"
    write state
    if auto == false:
        print "Checker found <N> ERRORs on iteration <M>. Incrementing to iteration <M+1>."
        print "Reply 'continue' to re-run the Implementer with error context."
        wait for user confirmation
    jump back to Step 2
```

WARNs and INFOs do not trigger re-implementation. They are recorded in state
and surfaced in the PR description.

---

## Step 5 — Eval phase

**Spawn the Eval sub-agent** using the Agent tool. The sub-agent prompt must say:

> You are the Evaluator in a dev-harness run. Your job is to score the target
> skill files against the eval rubric. Do not edit any files.
>
> Read these files in order:
> 1. `.claude/harness/harness-state.json` — read `target_skills`
> 2. `evals/criteria.md` — full rubric
> 3. `.claude/harness/harness-brief.md` — acceptance criteria from the Planner
> 4. For each skill in `target_skills`: read `.claude/skills/<name>/SKILL.md`
>
> For each skill, check:
> - **Frontmatter completeness** (from lint-toolkit A1): name present, description present,
>   trigger conditions present, "Do NOT trigger" guard present
> - **File reference integrity** (from lint-toolkit A2): any file paths referenced in the
>   skill exist on disk
> - **Schema coupling** (from lint-toolkit A3): no enum values hardcoded that belong in
>   `agents-ref/schema.md`
> - **Skill-specific criteria**: if `evals/criteria.md` has a section for this skill name,
>   evaluate against it. Score each 1–5 scale item. Mark each pass/fail item.
>
> If no criteria.md section exists for a skill, score only the three universal checks above.
>
> Populate `eval_scores` in `.claude/harness/harness-state.json`:
> ```json
> {
>   "<skill-name>": {
>     "frontmatter": "pass" | "fail",
>     "file_refs": "pass" | "fail",
>     "schema_coupling": "pass" | "warn",
>     "criteria_scores": { "<item>": <1-5 or "pass"/"fail"> },
>     "notes": "<any observations>"
>   }
> }
> ```
>
> Set `phase: "pr"`, update `updated_at`.

**After the Agent tool returns:**

If `auto = false`:
> "Eval complete. Review scores in `.claude/harness/harness-state.json` under `eval_scores`.
> Reply 'continue' to proceed to PR drafting."
> Wait for user confirmation.

---

## Step 6 — PR phase

**Spawn the PR sub-agent** using the Agent tool. The sub-agent prompt must say:

> You are the PR drafter in a dev-harness run. Your job is to validate completeness
> and draft a PR description. Do not edit skill files.
>
> Read these files in order:
> 1. `.claude/harness/harness-state.json` — full state including artifacts, errors, eval_scores
> 2. `.claude/harness/harness-brief.md` — original acceptance criteria and update obligations
> 3. `AGENTS.md` — skills table
>
> **Validate completeness before drafting:**
> - Every skill in `target_skills` must appear in the AGENTS.md skills table. If any
>   are missing, list them explicitly as blockers — do not draft the PR description
>   yet, emit this warning instead and stop:
>   "PR BLOCKED: skill(s) [names] not registered in AGENTS.md. Add them first."
> - Every artifact with `status: "written"` must exist as an actual file on disk.
>   Check with Read. If any are missing, list them as blockers.
> - Check every update obligation from `harness-brief.md`. If any is unfulfilled
>   (e.g. evals/criteria.md section missing for a new skill), list it as a gap —
>   note it in the PR description rather than blocking.
>
> **Draft the PR description** into `.claude/harness/harness-state.json` under `pr_description`:
>
> ```
> ## What changed
> - <1–3 bullets: what was built/fixed and why>
>
> ## Skills modified
> <for each skill: name, one-line before/after summary>
>
> ## Eval summary
> <table: skill | frontmatter | file_refs | schema_coupling | criteria notes>
>
> ## Open warnings
> <list any WARNs from the errors array, with skill and check>
>
> ## Checklist gaps
> <any unfulfilled update obligations from the brief>
>
> ## Test plan
> - [ ] Run /lint-toolkit to confirm no ERRORs
> - [ ] Invoke each modified skill with a representative task and verify output
> - [ ] <any skill-specific manual test steps from the acceptance criteria>
> ```
>
> Set `phase: "done"`, update `updated_at`.

---

## Step 7 — Completion

Read `.claude/harness/harness-state.json`. Print the `pr_description` field as the
final output, prefixed with:

```
Harness complete after <iteration+1> iteration(s).
Modified files (stage these for commit):
<list of all artifact files>

--- PR DESCRIPTION ---
```

Then print the full list of modified files for easy `git add`.

The harness working directory `.claude/harness/` is ephemeral — it can be deleted
after the PR is merged. Its files are not committed.

---

## Error reference

| Situation | What the orchestrator does |
|---|---|
| Planner sub-agent returns without writing `harness-brief.md` | Print error, stop. Do not proceed to Implementer with missing brief. |
| Checker sub-agent returns without updating `errors` in state | Treat as 0 errors found, proceed to Eval. Log a warning. |
| PR sub-agent returns with "PR BLOCKED" output | Print the blocker list. Do not print a PR description. Stop. |
| Max iterations reached | Print remaining errors, stop. Do not draft a partial PR. |
| `harness-state.json` missing at any phase entry | Stop and ask the user to re-run from the beginning: `/dev-harness [--auto] <task>` |
