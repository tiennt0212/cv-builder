# Quickstart

> Zero to PDF in ~5 minutes.

**Prerequisites:** clone this repo, open it in any AI agent listed on [agentskills.io/clients](https://agentskills.io/clients) (Claude Code, Cursor, Gemini CLI, etc.).

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
3. First-time only: `cd bin && npm install` (installs the renderer's dependencies)
4. Run `./bin/render-cv <run-folder>/draft-cv.yaml --theme harvard` (or `--theme modern`) to generate a browser-previewable HTML file
5. Open the file in your browser → `File > Print` → save as PDF

Need a cover letter? Run `/draft-letter` between steps 2 and 3, then `./bin/render-letter <run-folder>/draft-letter/draft-letter.yaml --theme modern` for an HTML version.

---

## Next steps

- [Guide](guide.md) — full reference: all scenarios, renderer comparison, command frequency
- [FAQ](faq.md) — project not selected, low keyword coverage, archetype detection issues
