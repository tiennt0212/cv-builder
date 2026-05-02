#!/usr/bin/env bash
# Hook: PostToolUse / Write
# After writing a .claude/skills/*/SKILL.md file, checks that the skill name
# declared in frontmatter has a matching row in AGENTS.md.
# Injects a warning into Claude's context if missing — does not block.

file_path=$(jq -r '.tool_input.file_path // empty')

[[ -z "$file_path" ]] && exit 0

# Only check .claude/skills/*/SKILL.md files
[[ "$file_path" != */.claude/skills/*/SKILL.md ]] && exit 0
[[ ! -f "$file_path" ]] && exit 0

# Extract skill name from YAML frontmatter
skill_name=$(grep -m1 '^name:' "$file_path" | sed 's/name:[[:space:]]*//' | tr -d '"')

[[ -z "$skill_name" ]] && exit 0

# Repo root: four dirname levels up from .claude/skills/<name>/SKILL.md
repo_root=$(dirname "$(dirname "$(dirname "$(dirname "$file_path")")")")
agents_md="${repo_root}/AGENTS.md"

[[ ! -f "$agents_md" ]] && exit 0

# Check for backtick-quoted skill name in the AGENTS.md skills table
if ! grep -qE "\`${skill_name}\`" "$agents_md"; then
  echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PostToolUse\",\"additionalContext\":\"WARNING: Skill '${skill_name}' was written to .claude/skills/${skill_name}/SKILL.md but does not appear in the AGENTS.md skills table. Add a row for it before releasing.\"}}"
fi
