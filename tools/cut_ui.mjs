// cut_ui.mjs — Fase 2, taglio 1: mattoncini UI → src/components/ui.js (v2.88 → v2.89)
import { parse } from "acorn";
import fs from "node:fs";

const die = (m) => { console.error("ABORT: " + m); process.exit(1); };
const src = fs.readFileSync("src/app.js", "utf8");
const sw = fs.readFileSync("public/sw.js", "utf8");
if (!src.includes('const APP_VERSION = "2.88";')) die("APP_VERSION attesa 2.88");
if (!sw.includes("const CACHE_VERSION = 'medtrace-v3-13';")) die("CACHE_VERSION attesa medtrace-v3-13");
if (fs.existsSync("src/components/ui.js")) die("src/components/ui.js esiste già");

const NAMES = new Set(["Inp","Sel","Txt","Grid","Span2","Modal","AlertChip","KpiCard","BarChart","Donut","AreaTrend","ExcelTable","Hint","ConfirmDialog","PromptDialog","useMedia","TH_S","TD_S","_confirmCallback","_setConfirmState","_setPromptState","appConfirm","appPromptCb"]);

const ast = parse(src, { ecmaVersion: "latest", sourceType: "module" });
const spans = [];
for (const node of ast.body) {
  if (node.type === "FunctionDeclaration" && node.id && NAMES.has(node.id.name)) {
    spans.push({ start: node.start, end: node.end, names: [node.id.name] });
  } else if (node.type === "VariableDeclaration") {
    const names = node.declarations.map(d => d.id && d.id.name).filter(Boolean);
    const hit = names.filter(n => NAMES.has(n));
    if (hit.length) {
      if (hit.length !== names.length) die("dichiarazione multipla mista: " + names.join(","));
      spans.push({ start: node.start, end: node.end, names });
    }
  }
}
spans.sort((a, b) => a.start - b.start);
if (spans.length !== 23) die("attesi 23 span, trovati " + spans.length + ": " + spans.map(s => s.names.join()).join(","));
for (const s of spans) { if (src[s.end] === "\n") s.end++; }

const inSpan = p => spans.some(s => p >= s.start && p < s.end);
function walk(n, fn, p) { if (!n || typeof n.type !== "string") return; fn(n, p); for (const k of Object.keys(n)) { if (k === "loc") continue; const v = n[k]; if (Array.isArray(v)) v.forEach(c => c && typeof c.type === "string" && walk(c, fn, n)); else if (v && typeof v.type === "string") walk(v, fn, n); } }

// residui in app.js → export/import
const residui = new Map();
walk(ast, (n, p) => {
  if (n.type === "Identifier" && NAMES.has(n.name) && !inSpan(n.start)) {
    if (p && ((p.type === "MemberExpression" && p.property === n && !p.computed) || (p.type === "Property" && p.key === n && !p.computed))) return;
    residui.set(n.name, (residui.get(n.name) || 0) + 1);
  }
});
const EXPORTS = new Set([...residui.keys()]);
if (EXPORTS.has("_confirmCallback") || EXPORTS.has("_setConfirmState") || EXPORTS.has("_setPromptState")) die("le var dialog risultano usate fuori dal cluster: " + [...EXPORTS].join(","));
console.log("Export (dai residui):", [...EXPORTS].sort().join(", "));

// costruzione modulo
const pieces = [];
pieces.push("/* MedTrace — mattoncini UI condivisi: input, modal, chip, grafici, tabella, dialog imperativi (estratti da app.js, v2.89) */");
pieces.push('import { __rest } from "../lib/tslib.js";');
pieces.push('import { downloadXLSX } from "../lib/export.js";');
pieces.push("");
for (const s of spans) {
  let txt = src.slice(s.start, s.end).replace(/\n$/, "");
  if (s.names.some(n => EXPORTS.has(n))) txt = "export " + txt;
  pieces.push(txt);
}
const moduleText = pieces.join("\n") + "\n";
try { parse(moduleText, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die("ui.js generato non parsa: " + e.message); }

// app.js: rimozione + import
let out = src;
for (const s of [...spans].reverse()) out = out.slice(0, s.start) + out.slice(s.end);
const anchor = 'import { RfidAssocPicker } from "./components/rfid.js";\n';
if (!out.includes(anchor)) die("anchor import rfid non trovata");
out = out.replace(anchor, anchor + 'import { ' + [...EXPORTS].sort().join(", ") + ' } from "./components/ui.js";\n');

// bump
if (out.split('const APP_VERSION = "2.88";').length - 1 !== 1) die("bump APP_VERSION");
out = out.replace('const APP_VERSION = "2.88";', 'const APP_VERSION = "2.89";');
const swOut = sw.replace("const CACHE_VERSION = 'medtrace-v3-13';", "const CACHE_VERSION = 'medtrace-v3-14';");
if (swOut === sw) die("bump CACHE_VERSION");

// post-assert: parse + nessun residuo dei nomi non esportati
let outAst;
try { outAst = parse(out, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die("app.js post-taglio non parsa: " + e.message); }
const PRIV = new Set([...NAMES].filter(n => !EXPORTS.has(n)));
const leaks = [];
walk(outAst, (n, p) => {
  if (n.type === "Identifier" && PRIV.has(n.name)) {
    if (p && ((p.type === "MemberExpression" && p.property === n && !p.computed) || (p.type === "Property" && p.key === n && !p.computed))) return;
    leaks.push(n.name + "@" + n.start);
  }
});
if (leaks.length) die("residui privati in app.js: " + leaks.join(", "));

fs.writeFileSync("src/components/ui.js", moduleText);
fs.writeFileSync("src/app.js", out);
fs.writeFileSync("public/sw.js", swOut);
console.log("OK: ui.js " + moduleText.split("\n").length + " righe; app.js " + src.split("\n").length + " → " + out.split("\n").length + "; v2.89 / medtrace-v3-14");
