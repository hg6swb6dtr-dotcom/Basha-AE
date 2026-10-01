# Basha-AE: Claude ↔ After Effects (Mac)

The user is a beginner who speaks Telugu. Reply in simple romanized Telugu with short steps and no jargon.

## Save tokens (the user asked for this)
- Keep replies short: a few lines, no long explanations unless asked.
- Don't re-read files or re-run `ae_info.jsx` without need. Run it once before and once after an edit.
- Write a script once and test it once. Fix only what failed.
- Don't use subagents.

## How to control After Effects
This only works in a **local** session on the user's Mac with After Effects open.

**Preferred: the `after-effects` MCP** (https://github.com/LiamcKerr/after-effects-mcp, installed at `~/after-effects-mcp`). When its tools are loaded:
- Start with `ae_status`, then use `ae_list_items` / `ae_comp_info` to inspect.
- Make changes with `ae_run_script`. Check the visual result with one `ae_preview_frame`, and render with `ae_render`.
- When the bridge is unreachable, run `node ~/after-effects-mcp/scripts/doctor.mjs` and follow the fix table in its AGENTS.md.

**Fallback (no MCP tools loaded):**

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
