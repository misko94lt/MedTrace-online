// cut_dashboard.mjs — Fase 2, taglio 4: dashboard/pianificazione (v2.98 → v2.99)
import { parse } from "acorn";
import fs from "node:fs";

const die = (m) => { console.error("ABORT: " + m); process.exit(1); };
const src = fs.readFileSync("src/app.js", "utf8");
const sw = fs.readFileSync("public/sw.js", "utf8");
const uiJs = fs.readFileSync("src/components/ui.js", "utf8");
const repJs = fs.readFileSync("src/lib/reports.js", "utf8");
if (!src.includes('const APP_VERSION = "2.98";')) die("APP_VERSION attesa 2.96");
if (!sw.includes("const CACHE_VERSION = 'medtrace-v3-23';")) die("CACHE_VERSION attesa medtrace-v3-21");
if (fs.existsSync("src/components/dashboard.js")) die("dashboard.js esiste già");

const DEST = { KpiPage: "D", AgendaPage: "D", ScadenzePage: "D", ScadenzaEmailModal: "D", PianoManuale: "D", detectCategory: "D" };
const NAMES = new Set(Object.keys(DEST));

const ast = parse(src, { ecmaVersion: "latest", sourceType: "module" });
const spans = [];
for (const node of ast.body) {
  if (node.type === "FunctionDeclaration" && node.id && NAMES.has(node.id.name)) {
    spans.push({ start: node.start, end: node.end, names: [node.id.name] });
  } else if (node.type === "VariableDeclaration") {
    const names = node.declarations.map(d => d.id && d.id.name).filter(Boolean);
    const hit = names.filter(n => NAMES.has(n));
    if (hit.length) {
      if (hit.length !== names.length) die("dichiarazione mista: " + names.join(","));
      spans.push({ start: node.start, end: node.end, names });
    }
  }
}
spans.sort((a, b) => a.start - b.start);
if (spans.length !== 6) die("attesi 6 span, trovati " + spans.length + ": " + spans.map(s => s.names.join()).join(","));
for (const s of spans) { if (src[s.end] === "\n") s.end++; }

const inSpan = p => spans.some(s => p >= s.start && p < s.end);
function walk(n, fn, p) { if (!n || typeof n.type !== "string") return; fn(n, p); for (const k of Object.keys(n)) { if (k === "loc") continue; const v = n[k]; if (Array.isArray(v)) v.forEach(c => c && typeof c.type === "string" && walk(c, fn, n)); else if (v && typeof v.type === "string") walk(v, fn, n); } }
const residui = new Map();
walk(ast, (n, p) => {
  if (n.type === "Identifier" && NAMES.has(n.name) && !inSpan(n.start)) {
    if (p && ((p.type === "MemberExpression" && p.property === n && !p.computed) || (p.type === "Property" && p.key === n && !p.computed))) return;
    residui.set(n.name, (residui.get(n.name) || 0) + 1);
  }
});
console.log("Residui in app.js:", [...residui.entries()].sort().map(([k, v]) => k + " x" + v).join(", "));

const grab = (s) => src.slice(s.start, s.end).replace(/\n$/, "");
const blocks = { D: [] };
for (const s of spans) {
  const d = DEST[s.names[0]];
  const needExport = s.names.some(n => residui.has(n));
  blocks[d].push((needExport ? "export " : "") + grab(s));
}

const pHeader = [
  "/* MedTrace — dashboard e pianificazione: KPI, agenda, scadenze (con mail), piano manuale (estratti da app.js, v2.99) */",
  'import { AreaTrend, EmptyState } from "./ui.js";',
  'import { downloadXLSX } from "../lib/export.js";',
  "",
];
const pText = pHeader.join("\n") + blocks.D.join("\n") + "\n";
try { parse(pText, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die("dashboard.js non parsa: " + e.message); }

let out = src;
for (const s of [...spans].reverse()) out = out.slice(0, s.start) + out.slice(s.end);
const anchor = 'import { techSignature } from "./components/shared.js";\n';
if (!out.includes(anchor)) die("anchor import non trovata");
const byDest = { D: [] };
for (const n of residui.keys()) byDest[DEST[n]].push(n);
let imports = "";
if (byDest.D.length) imports += 'import { ' + byDest.D.sort().join(", ") + ' } from "./components/dashboard.js";\n';
out = out.replace(anchor, anchor + imports);

if (out.split('const APP_VERSION = "2.98";').length - 1 !== 1) die("bump APP_VERSION");
out = out.replace('const APP_VERSION = "2.98";', 'const APP_VERSION = "2.99";');
const swOut = sw.replace("const CACHE_VERSION = 'medtrace-v3-23';", "const CACHE_VERSION = 'medtrace-v3-24';");
if (swOut === sw) die("bump CACHE_VERSION");

let outAst;
try { outAst = parse(out, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die("app.js post-taglio non parsa: " + e.message); }
const PRIV = new Set([...NAMES].filter(n => !residui.has(n)));
const leaks = [];
walk(outAst, (n, p) => {
  if (n.type === "Identifier" && PRIV.has(n.name)) {
    if (p && ((p.type === "MemberExpression" && p.property === n && !p.computed) || (p.type === "Property" && p.key === n && !p.computed))) return;
    leaks.push(n.name + "@" + n.start);
  }
});
if (leaks.length) die("residui privati: " + leaks.join(", "));

fs.writeFileSync("src/components/dashboard.js", pText);
fs.writeFileSync("src/app.js", out);
fs.writeFileSync("public/sw.js", swOut);
console.log("OK: dashboard.js " + pText.split("\n").length + " righe; app.js " + src.split("\n").length + " → " + out.split("\n").length + "; v2.97 / medtrace-v3-22");
