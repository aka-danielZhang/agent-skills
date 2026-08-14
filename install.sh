#!/usr/bin/env bash
# Symlink every skill under skills/ into ~/.agents/skills/ (DSH user-level discovery root).
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_BASE="${AGENT_SKILLS_TARGET:-$HOME/.agents/skills}"
mkdir -p "$TARGET_BASE"

for skill_dir in "$REPO_DIR"/skills/*/; do
  [ -f "${skill_dir}SKILL.md" ] || { echo "skip    $(basename "$skill_dir") (no SKILL.md)" >&2; continue; }
  name="$(basename "$skill_dir")"
  target="$TARGET_BASE/$name"
  source="${skill_dir%/}"
  if [ -L "$target" ] && [ "$(readlink "$target")" = "$source" ]; then
    echo "ok      $name (already linked)"
  elif [ -e "$target" ]; then
    echo "skip    $name (exists at $target and is not our symlink)" >&2
  else
    ln -s "$source" "$target"
    echo "linked  $name -> $target"
  fi
done
