# Contributing to CV Builder

Thank you for your interest in contributing! This is a prompt-engineering and AI agent skills project — contributions don't have to be traditional code.

## What contributions are welcome

- **New renderer themes** — new visual styles for `/html-cv`
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
2. Create a branch off `canary`: `git checkout -b feat/your-feature-name`
3. Make your changes
4. Open a Pull Request against the `canary` branch (not `master`)
5. Describe what you changed and why in the PR description

For the full branching model and how maintainers cut releases from `canary` → `master`, see [MAINTAINERS.md](MAINTAINERS.md).

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

## License

By submitting a contribution, you agree that your work will be licensed under the same terms as this project: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
