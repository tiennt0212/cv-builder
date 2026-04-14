#!/usr/bin/env bash
# Hook: PostToolUse / Write
# After writing a personal-data/projects/*.md file, checks that the company slug
# has a matching file in personal-data/companies/. Injects a warning into Claude's
# context if not found — does not block.

file_path=$(jq -r '.tool_input.file_path // empty')

[[ -z "$file_path" ]] && exit 0

# Only check personal-data/projects/*.md files
[[ "$file_path" != */personal-data/projects/*.md ]] && exit 0
[[ ! -f "$file_path" ]] && exit 0

# Extract company slug from YAML frontmatter
company=$(grep -m1 '^company:' "$file_path" | sed 's/company:[[:space:]]*//' | tr -d '"')

# Skip personal projects or missing field
[[ -z "$company" || "$company" == "personal" ]] && exit 0

# Derive personal-data/ directory from file path: personal-data/projects/x.md -> personal-data/
data_dir=$(dirname "$(dirname "$file_path")")
company_file="${data_dir}/companies/${company}.md"

if [[ ! -f "$company_file" ]]; then
  echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PostToolUse\",\"additionalContext\":\"WARNING: personal-data/companies/${company}.md not found. The company slug in this project file has no matching company file. Fix the company field or create the company file.\"}}"
fi
