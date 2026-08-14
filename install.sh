#!/usr/bin/env bash
# Copy-install every skill under skills/ into ~/.agents/skills/ (DSH user-level discovery root).
# Copies (not symlinks) so the installed snapshot survives repo cleanup; the repo stays the source.
# Use --force to overwrite existing installs.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_BASE="${AGENT_SKILLS_TARGET:-$HOME/.agents/skills}"
FORCE="${1:-}"
mkdir -p "$TARGET_BASE"

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
