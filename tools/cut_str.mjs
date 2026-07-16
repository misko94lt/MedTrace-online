// cut_str.mjs — Fase 2, taglio 7: strumenti, recall, template editor (v3.04 → v3.05)
import { parse } from "acorn";
import fs from "node:fs";
const die = (m) => { console.error("ABORT: " + m); process.exit(1); };
const src = fs.readFileSync("src/app.js", "utf8");
const sw = fs.readFileSync("public/sw.js", "utf8");
const uiJs = fs.readFileSync("src/components/ui.js", "utf8");
if (!src.includes('const APP_VERSION = "3.04";')) die("attesa 3.04");
if (fs.existsSync("src/components/strumenti.js")) die("strumenti.js esiste");
const DEST = { InstrumentsPage:"T", InstrumentForm:"T", RecallsPage:"T", TemplateEditor:"T", RecallForm:"T", RenewCalibrationForm:"T", blankTemplate:"T", errorBorderStyle:"T", RECALL_SEV_COLOR:"T", RECALL_STATUSES:"T", RECALL_STATUS_COLOR:"T", RECALL_ACTIONS:"T", RECALL_ASSET_STATUS:"T", RECALL_ASTATUS_COLOR:"T", RECALL_SEVERITY:"T", FilterDropdown:"B", MobileSearch:"B", SwipeableCard:"B" };
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
if (spans.length !== 18) die("attesi 18 span, trovati " + spans.length);
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
const blocks = { T: [], B: [] };
for (const s of spans) {
  const d = DEST[s.names[0]];
  const needExport = d === "B" ? true : s.names.some(n => residui.has(n));
  blocks[d].push((needExport ? "export " : "") + grab(s));
}
const tH = [
  "/* MedTrace — catalogo tecnico: strumenti di misura, avvisi di sicurezza (recall), editor template (estratti da app.js, v3.05) */",
  'import { Badge, EmptyState, ErrorSummary, Modal, useMedia, appConfirm, FilterDropdown, MobileSearch, SwipeableCard } from "./ui.js";',
  'import { Btn, AttachmentsList } from "./shared.js";',
  'import { FORM_BTN_GHOST, FORM_BTN_PRIMARY, FORM_COL, FORM_FOOTER, FORM_INP, FORM_LBL, FORM_ROW, FORM_SECTION, CATEGORIES } from "../constants/ui.js";',
  'import { upsertInList } from "../lib/sync.js";',
  'import { withCreateMeta, withUpdateMeta } from "../lib/util.js";',
  "",
];
const tText = tH.join("\n") + blocks.T.join("\n") + "\n";
try { parse(tText, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die("strumenti.js non parsa: " + e.message); }
const uiOut = uiJs + "\n/* — filtro a tendina, ricerca mobile, card swipe (spostati col taglio strumenti, v3.05) — */\n" + blocks.B.join("\n") + "\n";
try { parse(uiOut, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die("ui.js post-append non parsa: " + e.message); }
let out = src;
for (const s of [...spans].reverse()) out = out.slice(0, s.start) + out.slice(s.end);
const anchor = 'import { techSignature } from "./components/shared.js";\n';
if (!out.includes(anchor)) die("anchor import");
const byDest = { T: [], B: [] };
for (const n of residui.keys()) byDest[DEST[n]].push(n);
let imports = "";
if (byDest.T.length) imports += 'import { ' + byDest.T.sort().join(", ") + ' } from "./components/strumenti.js";\n';
if (byDest.B.length) imports += 'import { ' + byDest.B.sort().join(", ") + ' } from "./components/ui.js";\n';
out = out.replace(anchor, anchor + imports);
if (out.split('const APP_VERSION = "3.04";').length - 1 !== 1) die("bump");
out = out.replace('const APP_VERSION = "3.04";', 'const APP_VERSION = "3.05";');
const swOut = sw.replace("const CACHE_VERSION = 'medtrace-v3-29';", "const CACHE_VERSION = 'medtrace-v3-30';");
if (swOut === sw) die("bump sw");
let outAst;
try { outAst = parse(out, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die("post-parse: " + e.message); }
const PRIV = new Set([...NAMES].filter(n => !residui.has(n) && DEST[n] !== "B"));
const leaks = [];
walk(outAst, (n, p) => {
  if (n.type === "Identifier" && PRIV.has(n.name)) {
    if (p && ((p.type === "MemberExpression" && p.property === n && !p.computed) || (p.type === "Property" && p.key === n && !p.computed))) return;
    leaks.push(n.name + "@" + n.start);
  }
});
if (leaks.length) die("residui privati: " + leaks.join(", "));
fs.writeFileSync("src/components/strumenti.js", tText);
fs.writeFileSync("src/components/ui.js", uiOut);
fs.writeFileSync("src/app.js", out);
fs.writeFileSync("public/sw.js", swOut);
console.log("OK: strumenti.js " + tText.split("\n").length + "; app.js " + src.split("\n").length + " -> " + out.split("\n").length);
