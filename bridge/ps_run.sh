#!/bin/bash
# Mac lo open unna Photoshop lo oka .jsx script ni run chestundi.
# Usage: bridge/ps_run.sh path/to/script.jsx
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 path/to/script.jsx" >&2
  exit 1
fi

if [ ! -f "$1" ]; then
  echo "Script dorakaledu: $1" >&2
  exit 1
fi

SCRIPT="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"

# Install ayina latest Photoshop ni vethukutundi (2024, 2025, 2026, ...)
APP_PATH="$(ls -d /Applications/Adobe\ Photoshop*/Adobe\ Photoshop*.app 2>/dev/null | sort | tail -n 1 || true)"
if [ -z "$APP_PATH" ]; then
  echo "Photoshop /Applications lo dorakaledu." >&2
  exit 1
fi
APP_NAME="$(basename "$APP_PATH" .app)"

ESCAPED="${SCRIPT//\\/\\\\}"
ESCAPED="${ESCAPED//\"/\\\"}"

# Script last value ni print chestundi
osascript <<APPLESCRIPT
tell application "$APP_NAME"
  do javascript file (POSIX file "$ESCAPED")
end tell
APPLESCRIPT
