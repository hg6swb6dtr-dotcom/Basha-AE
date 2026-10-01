# Basha-AE: Claude ↔ After Effects (Mac)

The user is a beginner who speaks Telugu. Reply in simple romanized Telugu with short steps and no jargon.

## How to control After Effects
This only works in a **local** session on the user's Mac with After Effects open.

- Write ExtendScript files in `scripts/` with the name pattern `NN_short_name.jsx`.
- Run a script inside the open AE with `bridge/ae_run.sh scripts/<file>.jsx`. The script's last expression value is printed.
- Read the current project state with `bridge/ae_run.sh bridge/ae_info.jsx`. It prints JSON with comps, layers and footage, and also writes it to `bridge/out/info.json`. Run it before editing an existing project and again afterwards to verify the change.

## ExtendScript rules
- Use ES3 only: `var`, no arrow functions, no `let`/`const`, no template strings, and no built-in `JSON` (copy the serializer from `bridge/ae_info.jsx` when you need one).
- Wrap every script in an IIFE that calls `app.beginUndoGroup(...)` and `app.endUndoGroup()`, so the user can undo with Cmd+Z.
- Never call `alert()`, `confirm()` or `prompt()`. Modal dialogs block `ae_run.sh`. Return a status string instead.
- Never save, close or overwrite the user's project file unless they ask.
- Change existing layers by name or index only after confirming they exist with `ae_info.jsx`.

## Troubleshooting
- `Not authorized to send Apple events`: the user must allow it in System Settings → Privacy & Security → Automation → Claude → Adobe After Effects.
- Script errors about file access: AE → Settings → Scripting & Expressions → enable "Allow Scripts to Write Files and Access Network".
- AE must be open and not showing a dialog when a script runs.
