#!/usr/bin/env bash
# Install (or remove, with --uninstall) a periodic job that runs scripts/update-check.mjs.
# macOS uses a LaunchAgent; other platforms fall back to a crontab entry.
# The harness checkout location is resolved the same way the skill does at runtime.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$REPO_DIR/.tmp"
LABEL="com.agent-skills.update"

resolve_checkout() {
  local candidate="${DSH_CHECKOUT:-$HOME/workspace/coding-study/deepseek-harness}"
  [ -f "$candidate/docs/architecture.md" ] && echo "$candidate" && return 0
  echo "error: harness checkout not found at $candidate — export DSH_CHECKOUT first" >&2
  return 1
}

if [ "${1:-}" = "--uninstall" ]; then
  if [ "$(uname)" = "Darwin" ]; then
    launchctl bootout "gui/$(id -u)" "$HOME/Library/LaunchAgents/$LABEL.plist" 2>/dev/null || true
    rm -f "$HOME/Library/LaunchAgents/$LABEL.plist"
  else
    (crontab -l 2>/dev/null || true) | grep -vF "$REPO_DIR/scripts/update-check.mjs" | crontab -
  fi
  echo "uninstalled periodic update job"
  exit 0
fi

CHECKOUT="$(resolve_checkout)"
NODE_BIN="$(command -v node)"
mkdir -p "$LOG_DIR"

if [ "$(uname)" = "Darwin" ]; then
  PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
  cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>$LABEL</string>
  <key>ProgramArguments</key>
  <array>
    <string>$NODE_BIN</string>
    <string>$REPO_DIR/scripts/update-check.mjs</string>
  </array>
  <key>WorkingDirectory</key><string>$REPO_DIR</string>
  <key>EnvironmentVariables</key>
  <dict><key>DSH_CHECKOUT</key><string>$CHECKOUT</string></dict>
  <key>StartCalendarInterval</key>
  <dict><key>Hour</key><integer>9</integer><key>Minute</key><integer>30</integer></dict>
  <key>StandardOutPath</key><string>$LOG_DIR/update.log</string>
  <key>StandardErrorPath</key><string>$LOG_DIR/update.log</string>
</dict>
</plist>
EOF
  launchctl bootout "gui/$(id -u)" "$PLIST" 2>/dev/null || true
  launchctl bootstrap "gui/$(id -u)" "$PLIST"
  echo "installed LaunchAgent $LABEL (daily 09:30, log: $LOG_DIR/update.log)"
else
  LINE="30 9 * * * cd $REPO_DIR && DSH_CHECKOUT=$CHECKOUT $NODE_BIN $REPO_DIR/scripts/update-check.mjs >> $LOG_DIR/update.log 2>&1"
  (crontab -l 2>/dev/null || true) | grep -vF "$REPO_DIR/scripts/update-check.mjs" | { cat; echo "$LINE"; } | crontab -
  echo "installed crontab entry (daily 09:30, log: $LOG_DIR/update.log)"
fi
