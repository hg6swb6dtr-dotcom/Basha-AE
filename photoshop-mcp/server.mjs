#!/usr/bin/env node
// Chinna Photoshop MCP server (dependencies levu).
// Claude Desktop nundi Photoshop lo ExtendScript run chestundi (osascript dwara).
import { execFile } from "node:child_process";
import { readdirSync, writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";

function findPhotoshop() {
  const dirs = readdirSync("/Applications").filter((d) => d.startsWith("Adobe Photoshop")).sort();
  if (!dirs.length) throw new Error("Photoshop /Applications lo dorakaledu.");
  const dir = dirs[dirs.length - 1];
  const app = readdirSync(join("/Applications", dir)).find((f) => f.startsWith("Adobe Photoshop") && f.endsWith(".app"));
  if (!app) throw new Error("Photoshop .app dorakaledu: " + dir);
  return app.replace(/\.app$/, "");
}

function runJsx(code) {
  return new Promise((resolve, reject) => {
    let appName;
    try { appName = findPhotoshop(); } catch (e) { return reject(e); }
    const file = join(tmpdir(), "ps_mcp_" + Date.now() + "_" + Math.random().toString(36).slice(2) + ".jsx");
    writeFileSync(file, code, "utf8");
    const esc = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    const script = 'tell application "' + esc(appName) + '" to do javascript file (POSIX file "' + esc(file) + '")';
    execFile("osascript", ["-e", script], { timeout: 300000, maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
      try { unlinkSync(file); } catch {}
      if (err) return reject(new Error((stderr || err.message).trim()));
      resolve(stdout.trim());
    });
  });
}

const STATUS_JSX = [
  "(function(){",
  "var d=[];",
  "for(var i=0;i<app.documents.length;i++){var x=app.documents[i];",
  "d.push(x.name+' ('+x.width.as('px')+'x'+x.height.as('px')+' px, layers: '+x.artLayers.length+')');}",
  "var a='';try{a=app.activeDocument.name;}catch(e){}",
  "return 'Photoshop '+app.version+'\\nActive: '+(a||'none')+'\\nOpen docs:\\n'+(d.length?d.join('\\n'):'none');",
  "})();",
].join("");

const TOOLS = [
  {
    name: "ps_status",
    description: "Check the Photoshop connection and list open documents (size, layer count).",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "ps_run_script",
    description:
      "Run ExtendScript (ES3 JavaScript) inside the open Photoshop. Use var, no let/const/arrow functions/template strings, no JSON object. " +
      "Never call alert/confirm/prompt. Wrap code in an IIFE and return a status string; the last expression value is returned. " +
      "Use app.activeDocument.suspendHistory('name', 'code') to make changes undoable in one step. Do not save or close the user's files unless asked.",
    inputSchema: {
      type: "object",
      properties: { code: { type: "string", description: "ExtendScript code to run" } },
      required: ["code"],
    },
  },
];

function send(msg) { process.stdout.write(JSON.stringify(msg) + "\n"); }

async function handle(msg) {
  const { id, method, params } = msg;
  if (id === undefined || id === null) return; // notifications
  try {
    if (method === "initialize") {
      return send({ jsonrpc: "2.0", id, result: {
        protocolVersion: (params && params.protocolVersion) || "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "photoshop", version: "0.1.0" },
      } });
    }
    if (method === "ping") return send({ jsonrpc: "2.0", id, result: {} });
    if (method === "tools/list") return send({ jsonrpc: "2.0", id, result: { tools: TOOLS } });
    if (method === "tools/call") {
      const name = params && params.name;
      const args = (params && params.arguments) || {};
      let text;
      try {
        if (name === "ps_status") text = await runJsx(STATUS_JSX);
        else if (name === "ps_run_script") text = await runJsx(String(args.code || ""));
        else throw new Error("Unknown tool: " + name);
        return send({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text: text || "(no result)" }] } });
      } catch (e) {
        return send({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text: "Error: " + e.message }], isError: true } });
      }
    }
    send({ jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found: " + method } });
  } catch (e) {
    send({ jsonrpc: "2.0", id, error: { code: -32603, message: e.message } });
  }
}

createInterface({ input: process.stdin }).on("line", (line) => {
  if (!line.trim()) return;
  let msg;
  try { msg = JSON.parse(line); } catch { return; }
  handle(msg);
});
