# evals/

Test suite for the cv-builder skill set. Use this directory to verify that changes to skill files (`.claude/skills/`) don't regress output quality.

## How it works

Each eval is a manual test: you run a skill with a sample input, then score the output against the rubric in `criteria.md`. There is no automated runner — the "assertions" are human judgment guided by pass/fail checklists and 1–5 scales.

## Directory structure

```
evals/
├── criteria.md              # Scoring rubric for all skills
├── sample-jds/              # Job descriptions for testing /draft-cv
│   ├── product-startup.md
│   ├── outsource-agency.md
│   └── ai-focused.md
├── sample-projects/         # Project descriptions for testing /personal-log
│   ├── vague-description.md
│   ├── no-results.md
│   ├── new-company.md
│   └── existing-project.md
└── sample-motivations/      # Motivation inputs for testing /draft-letter
    └── motivation-startup.md
```

## When to run evals

- Before merging changes to any skill or command file
- When the output of a skill looks off and you want a structured way to diagnose why
- When adding a new archetype to `agents-ref/archetypes.yaml`

## Running a full regression

1. **`/draft-cv`** — run against each file in `sample-jds/`, score with the `/draft-cv` rubric in `criteria.md`
2. **`/personal-log`** — run with each file in `sample-projects/` as the user input, score with the `/personal-log` rubric
3. **`/draft-letter`** — run after a `/draft-cv` pass on `sample-jds/product-startup.md`, use `sample-motivations/motivation-startup.md` as motivation input
4. **Renderer** — run `/html-cv` against the seed YAML produced in step 1

## Adding new evals

- New sample JD → add to `sample-jds/`, add a row to the Test Scenarios table in `criteria.md`
- New sample project scenario → add to `sample-projects/`, add a row to the table
- New skill → add a criteria section to `criteria.md` and at least one sample input file
