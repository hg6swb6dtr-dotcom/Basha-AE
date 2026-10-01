#!/bin/bash
# Mac lo open unna After Effects lo oka .jsx script ni run chestundi.
# Usage: bridge/ae_run.sh path/to/script.jsx
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

# Install ayina latest After Effects ni vethukutundi (2023, 2024, 2025, ...)
APP_PATH="$(ls -d /Applications/Adobe\ After\ Effects*/Adobe\ After\ Effects*.app 2>/dev/null | sort | tail -n 1 || true)"
if [ -z "$APP_PATH" ]; then
  echo "After Effects /Applications lo dorakaledu." >&2
  exit 1
fi
APP_NAME="$(basename "$APP_PATH" .app)"

# Path lo quotes/backslashes unte escape cheyyi
ESCAPED="${SCRIPT//\\/\\\\}"
ESCAPED="${ESCAPED//\"/\\\"}"

osascript <<APPLESCRIPT
tell application "$APP_NAME"
  DoScript "\$.evalFile(new File(\"$ESCAPED\"));"
end tell
APPLESCRIPT
