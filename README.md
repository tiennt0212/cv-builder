# CV Builder — Examples Branch

This branch contains a pre-populated fictional dataset so you can try the full CV Builder workflow without setting up your own data first.

> For the full toolkit documentation, see [README.original.md](README.original.md).

---

## What's in this branch

A fictional candidate — **Mina Solves**, a 4-year Frontend Developer — with a complete, realistic dataset:

| Layer | Files |
|-------|-------|
| Profile | `personal-data/profile.md` |
| Companies | `tnt_lab` (B2B SaaS product) · `nexfield_digital` (outsource studio) |
| Projects | `tnt_lab-dashboard_redesign` · `tnt_lab-notification_system` · `nexfield_digital-ecommerce_platform` · `nexfield_digital-admin_portal` |

---

## Requirements

[Claude Code](https://claude.ai/code) installed and authenticated. No other setup needed — the data is already here.

---

## Try it: step-by-step

### 1. Explore the dataset

Browse `personal-data/` to see how companies and projects are structured, or run the linter to validate it:

```
/lint-data
```

### 2. Define target archetypes (one-time setup)

```
/setup-archetypes
```

This analyses the existing dataset and defines the role profiles Claude uses during CV tailoring. Run it once before your first `/draft-cv`.

### 3. Draft a tailored CV

Copy the sample JD below, then run:

```
/draft-cv [paste the JD here]
```

Claude will analyse the JD, score each project, detect the hiring archetype, and produce:
- `analysis.md` — decision log (which projects were selected and why)
- `draft-cv.yaml` — the seed file with tailored CV prose

### 4. Render to your preferred format

After `/draft-cv` completes, render the output:

```
/html-cv          ← browser-previewable HTML; export PDF via browser print
/latex-cv         ← LaTeX .tex file; compile via Overleaf
/resumx-cv        ← Markdown; paste into resumx.io playground
```

### 5. Draft a cover letter

```
/draft-letter
/html-letter
```

Requires a completed `/draft-cv` run. Reads `analysis.md` and `draft-cv.yaml` automatically.

---

## Sample JD — copy and paste this into `/draft-cv`

```
Senior Frontend Engineer — Velostack

Velostack builds developer productivity tools used by 2,000+ engineering teams worldwide.
We are looking for a Senior Frontend Engineer to lead the frontend of our core web platform.

About the role:
- Own and evolve the frontend architecture of our main SaaS product
- Drive performance improvements and set the standard for component design across the team
- Collaborate closely with backend engineers, product managers, and designers
- Mentor junior engineers through code review and knowledge-sharing sessions

What we're looking for:
- 3+ years of experience with ReactJS and TypeScript
- Strong understanding of state management (Redux, Zustand, or similar)
- Experience building scalable, reusable component libraries
- Track record of shipping performance improvements (Core Web Vitals, Lighthouse)
- Comfortable working in a cross-functional product team
- Experience with GraphQL is a plus
- Experience with VueJS or other frameworks is a plus

What you'll work on first:
- Re-architect the real-time notification system to handle growing concurrent user load
- Build a new analytics dashboard module for the enterprise tier
- Establish a frontend performance baseline with automated monitoring in CI

We value engineers who think in systems, take end-to-end ownership, and make their teammates better.
```

---

## What to look for in the output

| Output | What to check |
|--------|---------------|
| `analysis.md` | Which projects were selected and scored, why others were skipped, detected archetype |
| `draft-cv.yaml` | Summary rewritten to match the JD, bullet points using JD keywords, skills section reordered |
| HTML/PDF | Visual layout, link rendering, one-page fit |

---

## When you're ready to use your own data

Switch to the `main` / `canary` branch and follow the setup in [README.original.md](README.original.md):

```bash
git checkout canary
```

Start with `/personal-log` to add your own profile, companies, and projects.
