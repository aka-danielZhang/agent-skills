#!/usr/bin/env bash
# Copy-install every skill under skills/ into ~/.agents/skills/ (DSH user-level discovery root).
# Copies (not symlinks) so the installed snapshot survives repo cleanup; the repo stays the source.
# Use --force to overwrite existing installs.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_BASE="${AGENT_SKILLS_TARGET:-$HOME/.agents/skills}"
FORCE="${1:-}"
RENAMED_SKILLS=(
  "spec-driven-repo-init:agent-repo-spec"
)
mkdir -p "$TARGET_BASE"

if [ "$FORCE" = "--force" ]; then
  for rename in "${RENAMED_SKILLS[@]}"; do
    old_name="${rename%%:*}"
    new_name="${rename#*:}"
    old_target="$TARGET_BASE/$old_name"
    if [ -d "$REPO_DIR/skills/$new_name" ] && [ -e "$old_target" ]; then
      rm -rf "$old_target"
      echo "removed $old_name (renamed to $new_name)"
    fi
  done
fi

for skill_dir in "$REPO_DIR"/skills/*/; do
  [ -f "${skill_dir}SKILL.md" ] || { echo "skip    $(basename "$skill_dir") (no SKILL.md)" >&2; continue; }
  name="$(basename "$skill_dir")"
  target="$TARGET_BASE/$name"
  if [ -e "$target" ] && [ "$FORCE" != "--force" ]; then
    echo "skip    $name (exists at $target; use --force to overwrite)" >&2
  else
    rm -rf "$target"
    cp -R "${skill_dir%/}" "$target"
    echo "copied  $name -> $target"
  fi
done
