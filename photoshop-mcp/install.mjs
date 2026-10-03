#!/usr/bin/env node
// Claude Desktop config lo "photoshop" MCP server ni add chestundi.
// Usage: node photoshop-mcp/install.mjs
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const cfgPath = join(homedir(), "Library", "Application Support", "Claude", "claude_desktop_config.json");
const server = join(dirname(fileURLToPath(import.meta.url)), "server.mjs");

let cfg = {};
if (existsSync(cfgPath)) {
  cfg = JSON.parse(readFileSync(cfgPath, "utf8"));
  copyFileSync(cfgPath, cfgPath + ".backup");
} else {
  mkdirSync(dirname(cfgPath), { recursive: true });
}
cfg.mcpServers = cfg.mcpServers || {};
cfg.mcpServers.photoshop = { command: process.execPath, args: [server] };
writeFileSync(cfgPath, JSON.stringify(cfg, null, 2) + "\n");
console.log("Photoshop MCP add ayindi. Ippudu Claude Desktop ni Quit (Cmd+Q) chesi malli open cheyyandi.");
