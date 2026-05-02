# Roadmap

This document outlines the planned direction for cv-builder. It is intentionally high-level — implementation details live in GitHub Issues.

> **Want to contribute?** Pick an item below, open an issue to claim it, and check [CONTRIBUTING.md](CONTRIBUTING.md) for workflow.

---

## Current state

| Skill | Status |
|---|---|
| `/personal-log` | Stable |
| `/setup-archetypes` | Stable |
| `/draft-cv` | Stable |
| `/draft-letter` | Stable |
| `/html-cv` | Active development — 2 themes (`harvard`, `modern`) |
| `/html-letter` | Active development — 1 theme (`modern`) |

---

## Planned

### HTML CV themes — main focus

The `/html-cv` skill renders directly in any browser with no build step, making it the most accessible output format. Themes are self-contained CSS files — easy to contribute, easy to preview.

- [ ] Additional themes (minimal, creative, two-column, ...)
- [ ] Dark mode variants for existing themes
- [ ] Print-optimized CSS for all themes
- [ ] Theme preview gallery in docs

### HTML cover letter themes

The `/html-letter` skill currently ships one theme (`modern`). Cover letters have different layout constraints than CVs — themes here are independent from CV themes.

- [ ] `harvard` theme for cover letters (matches existing `harvard` CV theme)
- [ ] Additional letter themes

---

## Exploring

These are not committed — they depend on tooling maturity and community interest.

### AI agentic theme builder

Building a new CV or letter theme requires writing CSS by hand and iterating manually. An agentic workflow could accelerate this:

- Feed a reference design (screenshot, Figma link, or description)
- Agent scaffolds the CSS, renders a preview, iterates on feedback
- Output: a ready-to-use theme file dropped into `themes/`

This would lower the barrier for contributors who have design taste but limited CSS experience.

---

## Not planned

- GUI or web app (out of scope for this CLI-first tool)
- Word/DOCX output
