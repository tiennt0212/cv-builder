# agents-ref/

Internal reference files used by the CV Builder skills. These files are read automatically by commands like `/draft-cv`, `/personal-log`, and `/setup-archetypes` — you generally do not edit them directly.

| File | Purpose | Edit directly? |
|------|---------|---------------|
| `schema.md` | Single source of truth for enums, tag taxonomy, stack naming conventions, and section rules. Skills read this before touching any data file. | No — open a PR to propose changes |
| `cv-bullet-rules.md` | Shared standard for writing achievement bullets (CAR structure, action verbs, measurable results). Applied by both `/personal-log` and `/draft-cv`. | No — open a PR to propose changes |
| `profile-template.md` | Template used by `/personal-log` to create `personal-data/profile.md` on first-time setup. | No — open a PR to propose changes |
| `archetypes.yaml` | Live archetype definitions used by `/draft-cv` for archetype-aware tailoring. | Via `/setup-archetypes` only — do not hand-edit |
