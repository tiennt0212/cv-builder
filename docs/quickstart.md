# Quickstart

> Zero to PDF in ~5 minutes.

**Prerequisites:** clone this repo, open it in Claude Code.

---

## Step 1 — Log your experience *(once)*

Run `/personal-log` and say **"I have an old CV I'd like to import"**, then paste your CV text or give the file path. The skill extracts your employers, projects, and profile info and walks you through each item.

No existing CV? Run `/personal-log` and describe your experience — the skill will ask follow-up questions.

---

## Step 2 — Define your target roles *(once)*

Run `/setup-archetypes`. It scans your projects and suggests role profiles. Review the suggestions and confirm or adjust.

Re-run this only when your target role family changes (e.g. frontend → AI/ML).

---

## Step 3 — Apply for a job *(every application)*

1. Run `/draft-cv` and paste the job description
2. Review `analysis.md` — check which projects were selected and why
3. Run `/html-cv` to generate a browser-previewable HTML file
4. Open the file in your browser → `File > Print` → save as PDF

Need a cover letter? Run `/draft-letter` between steps 2 and 3, then `/html-letter` for an HTML version.

---

## Next steps

- [Guide](guide.md) — full reference: all scenarios, renderer comparison, command frequency
- [FAQ](faq.md) — project not selected, low keyword coverage, archetype detection issues
