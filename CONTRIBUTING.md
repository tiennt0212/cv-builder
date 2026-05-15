# Contributing to CV Builder

Thank you for your interest in contributing! This is a prompt-engineering and AI agent skills project — contributions don't have to be traditional code.

## What contributions are welcome

- **New renderer themes** — new visual styles for `./bin/render-cv` and `./bin/render-letter` (see *Adding a new theme* below)
- **Skill improvements** — better prompt logic in `.claude/skills/`
- **Schema evolution** — new tags, enums, or section rules in `agents-ref/schema.md`
- **Documentation** — clearer `docs/`, `evals/`, or inline instructions
- **Eval cases** — new sample JDs, projects, or motivations under `evals/`
- **Bug fixes** — incorrect behavior in any skill or command

## What NOT to submit

- Anything under `personal-data/` or `jobs/` — these are personal, user-specific directories. The repo ships only placeholder README files; example data lives on the `examples` branch.
- Real CVs, real JDs, or any personally identifiable information.

## Workflow

1. Fork the repo
2. Create a branch off `canary`: `git checkout -b feat/issue-N-short-description`
3. Make your changes
4. Open a Pull Request against the `canary` branch (not `master`)
5. Describe what you changed and why in the PR description

For the full branching model and how maintainers cut releases from `canary` → `master`, see [MAINTAINERS.md](MAINTAINERS.md).

## Commit messages

Format:

```
<type>[!]: <short description> [(#N)]

[optional body]

[optional footer(s)]
```

**Types:**

| Type | When to use |
|------|-------------|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `chore` | Maintenance (deps, config, tooling) |
| `refactor` | Restructuring without behaviour change |
| `test` | Test additions or fixes only |
| `ci` | CI/CD workflow changes |
| `style` | Formatting, whitespace — no logic change |
| `perf` | Performance improvement |

**Rules:**
- Subject line: lowercase, no trailing period, ≤ 72 characters
- Issue reference: `(#N)` at the end of the subject line — no `issue` word
- Breaking change: append `!` to the type (`feat!:`) or add `BREAKING CHANGE:` in the footer

**Examples:**

```
feat: add pdf export option (#42)
fix!: remove deprecated render-cv flags (#38)
docs: clarify personal branch workflow (#15)
chore: upgrade handlebars to v4.7.8 (#29)
refactor: extract date formatting into helper (#33)
```

## PR titles

PR titles follow the same `<type>[!]: <short description> [(#N)]` format — they become the merge commit subject on `canary`.

## Naming conventions

Before editing any data files or schema, read `agents-ref/schema.md` — it is the single source of truth for:
- Enum values (status, impact, tag taxonomy)
- Stack naming conventions (e.g. `ReactJS` not `react`)
- Project and company file naming rules

Do not duplicate or diverge from `schema.md` in your contribution.

## Prompt/skill quality bar

When improving a skill or command file:
- Explain the *why* behind rules, not just the *what*
- Include examples of correct vs incorrect output where a rule could be misapplied
- Keep `agents-ref/schema.md` as the authority — reference it, don't copy it

**Skill file location:** skills live in `.claude/skills/[skill-name]/SKILL.md`. `.agents/skills/` is a symlink to `.claude/skills/` — add new skills under `.claude/skills/` and they are automatically available to all agents (Cursor, Gemini CLI, Codex, etc.).

## Adding a new theme

Themes are deterministic — they are pure files, not skills, and the renderer scripts (`./bin/render-cv`, `./bin/render-letter`) discover them by directory name.

**A new CV theme requires only two files:**

```
themes/<your-theme-name>/
  template.hbs   ← Handlebars template producing the full HTML document
  style.css      ← stylesheet linked from the template via {{_stylePath}}
```

Then add the theme name to the `VALID_THEMES` array in `bin/render-cv` (one-line edit) so the CLI accepts it.

**A new letter theme requires:**

```
themes/<your-theme-name>/
  letter.hbs     ← Handlebars template
  letter.css     ← stylesheet
```

…and an entry in `bin/render-letter`'s `VALID_THEMES`.

### Template authoring conventions

- Use `{{md field}}` for prose fields that may contain `**bold**` markers (bullets, summary, descriptions). The `md` helper escapes HTML entities then converts `**...**` to `<strong>...</strong>`.
- Use `{{field}}` for plain text — Handlebars auto-escapes.
- Wrap every optional field in `{{#if field}}...{{/if}}` so missing data produces no empty `<div>` / `<li>`.
- Use the en-dash `–` (U+2013) directly between `{{start}}` and `{{end}}` in date ranges.
- Link the theme stylesheet via `<link rel="stylesheet" href="{{_stylePath}}">` in `<head>` — the renderer computes the correct relative path from the output file to `themes/<theme>/style.css` (or `letter.css`).
- No inline `<style>` blocks — keep all styling in the CSS file so users can swap themes without editing HTML.

### Testing a new theme

```sh
./bin/render-cv jobs/<example-app>/<run>/draft-cv.yaml --theme <your-theme-name>
open jobs/<example-app>/<run>/html-cv/cv\(<your-theme-name>\).html
```

Confirm in the browser that all sections present in the seed are rendered, no empty elements appear for missing optional fields, and `**bold**` text becomes `<strong>`.

## License

By submitting a contribution, you agree that your work will be licensed under the same terms as this project: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
