// cut_jf.mjs — Fase 2, taglio 6: interventi + fatturazione (v3.01 → v3.02)
import { parse } from "acorn";
import fs from "node:fs";
const die = (m) => { console.error("ABORT: " + m); process.exit(1); };
const src = fs.readFileSync("src/app.js", "utf8");
const sw = fs.readFileSync("public/sw.js", "utf8");
const repJs = fs.readFileSync("src/lib/reports.js", "utf8");
if (!src.includes('const APP_VERSION = "3.01";')) die("APP_VERSION attesa 3.01");
if (!sw.includes("const CACHE_VERSION = 'medtrace-v3-26';")) die("CACHE_VERSION attesa medtrace-v3-26");
if (fs.existsSync("src/components/jobs.js") || fs.existsSync("src/components/fatturazione.js")) die("destinazioni esistono");
const DEST = { JobForm:"J", JobDetailModal:"J", QuoteForm:"F", QuotesPage:"F", InvoiceForm:"F", newQuoteNumber:"F", IVA_DEFAULT:"F", IVA_DEFAULT_Q:"F", IVA_RATES:"F", QUOTE_STATUS_COLOR:"F", generateJobPDF:"R", generateQuotePDF:"R" };
const NAMES = new Set(Object.keys(DEST));
const ast = parse(src, { ecmaVersion: "latest", sourceType: "module" });
const spans = [];
for (const node of ast.body) {
  if (node.type === "FunctionDeclaration" && node.id && NAMES.has(node.id.name)) spans.push({ start: node.start, end: node.end, names: [node.id.name] });
  else if (node.type === "VariableDeclaration") {
    const names = node.declarations.map(d => d.id && d.id.name).filter(Boolean);
    const hit = names.filter(n => NAMES.has(n));
    if (hit.length) { if (hit.length !== names.length) die("mista: " + names.join(",")); spans.push({ start: node.start, end: node.end, names }); }
  }
}
spans.sort((a, b) => a.start - b.start);
if (spans.length !== 12) die("attesi 12 span, trovati " + spans.length);
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
console.log("Residui:", [...residui.entries()].sort().map(([k, v]) => k + " x" + v).join(", "));
const grab = (s) => src.slice(s.start, s.end).replace(/\n$/, "");
const blocks = { J: [], F: [], R: [] };
for (const s of spans) {
  const d = DEST[s.names[0]];
  const needExport = d === "R" ? true : s.names.some(n => residui.has(n));
  blocks[d].push((needExport ? "export " : "") + grab(s));
}
const jH = [
  "/* MedTrace — interventi: form e dettaglio job (estratti da app.js, v3.02) */",
  'import { AssetCombobox, ErrorSummary, Grid, Inp, Modal, Sel, Span2, Txt, SignaturePad, TechSignatureField } from "./ui.js";',
  'import { Btn, TecnicoPicker, techSignature } from "./shared.js";',
  'import { TIMELINE_ICON, TIMELINE_LABEL } from "../constants/ui.js";',
  'import { jobShortCode, jobTipoLabel, withCreateMeta, withUpdateMeta } from "../lib/util.js";',
  'import { generateJobPDF } from "../lib/reports.js";',
  "",
];
const fH = [
  "/* MedTrace — fatturazione: preventivi (form+pagina), fatture, numerazione, aliquote IVA (estratti da app.js, v3.02) */",
  'import { Grid, Inp, Modal, Sel, Txt } from "./ui.js";',
  'import { Btn } from "./shared.js";',
  'import { FORM_BTN_GHOST, FORM_BTN_PRIMARY, FORM_INP, FORM_LBL } from "../constants/ui.js";',
  'import { withCreateMeta, withUpdateMeta, jobShortCode } from "../lib/util.js";',
  'import { showPDFPreview } from "../lib/export.js";',
  'import { generateQuotePDF } from "../lib/reports.js";',
  "",
];
const jText = jH.join("\n") + blocks.J.join("\n") + "\n";
const fText = fH.join("\n") + blocks.F.join("\n") + "\n";
for (const [t, lbl] of [[jText, "jobs.js"], [fText, "fatturazione.js"]]) {
  try { parse(t, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die(lbl + " non parsa: " + e.message); }
}
let repOut = repJs;
const impU = 'import { jobShortCode, jobTipoLabel } from "./util.js";\n';
repOut = impU + repOut + "\n/* — PDF intervento e preventivo (spostati col taglio job/fatturazione, v3.02) — */\n" + blocks.R.join("\n") + "\n";
try { parse(repOut, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die("reports.js post-append non parsa: " + e.message); }
let out = src;
for (const s of [...spans].reverse()) out = out.slice(0, s.start) + out.slice(s.end);
const anchor = 'import { techSignature } from "./components/shared.js";\n';
if (!out.includes(anchor)) die("anchor import non trovata");
const byDest = { J: [], F: [], R: [] };
for (const n of residui.keys()) byDest[DEST[n]].push(n);
let imports = "";
if (byDest.J.length) imports += 'import { ' + byDest.J.sort().join(", ") + ' } from "./components/jobs.js";\n';
if (byDest.F.length) imports += 'import { ' + byDest.F.sort().join(", ") + ' } from "./components/fatturazione.js";\n';
if (byDest.R.length) imports += 'import { ' + byDest.R.sort().join(", ") + ' } from "./lib/reports.js";\n';
out = out.replace(anchor, anchor + imports);
if (out.split('const APP_VERSION = "3.01";').length - 1 !== 1) die("bump");
out = out.replace('const APP_VERSION = "3.01";', 'const APP_VERSION = "3.02";');
const swOut = sw.replace("const CACHE_VERSION = 'medtrace-v3-26';", "const CACHE_VERSION = 'medtrace-v3-27';");
if (swOut === sw) die("bump sw");
let outAst;
try { outAst = parse(out, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die("app.js post-taglio non parsa: " + e.message); }
const PRIV = new Set([...NAMES].filter(n => !residui.has(n) && DEST[n] !== "R"));
const leaks = [];
walk(outAst, (n, p) => {
  if (n.type === "Identifier" && PRIV.has(n.name)) {
    if (p && ((p.type === "MemberExpression" && p.property === n && !p.computed) || (p.type === "Property" && p.key === n && !p.computed))) return;
    leaks.push(n.name + "@" + n.start);
  }
});
if (leaks.length) die("residui privati: " + leaks.join(", "));
fs.writeFileSync("src/components/jobs.js", jText);
fs.writeFileSync("src/components/fatturazione.js", fText);
fs.writeFileSync("src/lib/reports.js", repOut);
fs.writeFileSync("src/app.js", out);
fs.writeFileSync("public/sw.js", swOut);
console.log("OK: jobs.js " + jText.split("\n").length + "; fatturazione.js " + fText.split("\n").length + "; app.js " + src.split("\n").length + " -> " + out.split("\n").length);
