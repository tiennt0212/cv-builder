#!/usr/bin/env bash
# Hook: PreToolUse / Write
# Creates the parent directory for any file being written under jobs/
# so draft-cv and renderer commands never fail due to missing folders.

file_path=$(jq -r '.tool_input.file_path // empty')

[[ -z "$file_path" ]] && exit 0

if [[ "$file_path" == */jobs/* ]]; then
  mkdir -p "$(dirname "$file_path")"
fi
