// cut_assets.mjs — Fase 2, taglio 5: cluster apparecchi + lib/util condivisa (v2.99 → v3.00)
import { parse } from "acorn";
import fs from "node:fs";
const die = (m) => { console.error("ABORT: " + m); process.exit(1); };
const src = fs.readFileSync("src/app.js", "utf8");
const sw = fs.readFileSync("public/sw.js", "utf8");
const uiJs = fs.readFileSync("src/components/ui.js", "utf8");
const cuJs = fs.readFileSync("src/constants/ui.js", "utf8");
const syJs = fs.readFileSync("src/lib/sync.js", "utf8");
if (!src.includes('const APP_VERSION = "2.99";')) die("APP_VERSION attesa 2.99");
if (!sw.includes("const CACHE_VERSION = 'medtrace-v3-24';")) die("CACHE_VERSION attesa medtrace-v3-24");
if (fs.existsSync("src/components/assets.js") || fs.existsSync("src/lib/util.js")) die("destinazioni esistono già");

const DEST = {
  AssetForm:"A", AssetDetailModal:"A", ImportAssetsModal:"A", TimelineModal:"A", WithdrawalModal:"A", StickerModal:"A",
  QRGen:"A", IMP_FIELDS:"A", impEnsureXLSX:"A", impEnum:"A", impParseCSV:"A", impToISO:"A", impToNum:"A",
  ICON_ACTIVITY:"A", ICON_EDIT:"A", ICON_PIN:"A", ICON_PLUS:"A", ICON_TAG:"A", ICON_ZAP:"A",
  withCreateMeta:"U", withUpdateMeta:"U", fmtDateTimeIt:"U", customerPrefix:"U", nextAssetCode:"U",
  jobShortCode:"U", jobTipoLabel:"U", compressImage:"U", isCloudPhoto:"U", uploadPhotoToCloud:"U",
  deleteCloudPhoto:"U", assetHasOpenRecall:"U", assetOpenRecall:"U", impNorm:"U", genUUID:"U",
  Badge:"B", _ic:"B",
  FORM_FOOTER:"C",
  DEMO_LOCKED:"S",
};
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
if (spans.length !== 38) die("attesi 38 span, trovati " + spans.length + ": " + spans.map(s => s.names.join()).join(","));
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
const blocks = { A: [], U: [], B: [], C: [], S: [] };
for (const s of spans) {
  const d = DEST[s.names[0]];
  const needExport = (d === "A" || d === "U") ? s.names.some(n => residui.has(n)) || d === "U" : true;
  blocks[d].push((needExport ? "export " : "") + grab(s));
}
const aHeader = [
  "/* MedTrace — apparecchi: form, dettaglio, import CSV/XLSX, timeline, ritiro, etichette QR (estratti da app.js, v3.00) */",
  'import { AlertChip, ErrorSummary, Grid, Inp, Modal, Sel, Span2, Txt, Badge, _ic } from "./ui.js";',
  'import { Btn, AttachmentsList } from "./shared.js";',
  'import { FORM_BTN_GHOST, FORM_BTN_PRIMARY, STATUS_COLOR, PRI_COLOR, TIMELINE_ICON, TIMELINE_LABEL, FORM_FOOTER, FORM_INP, FORM_LBL, FORM_FLD } from "../constants/ui.js";',
  'import { CND_CAT } from "../constants/cnd.js";',
  'import { FUNC_TEMPLATES } from "../constants/funcTemplates.js";',
  'import { OFFLINE_MODE, getSupabaseClient, getSupabaseConfig, DEMO_LOCKED } from "../lib/sync.js";',
  'import { __awaiter } from "../lib/tslib.js";',
  'import { withCreateMeta, withUpdateMeta, fmtDateTimeIt, customerPrefix, nextAssetCode, jobShortCode, jobTipoLabel, compressImage, isCloudPhoto, uploadPhotoToCloud, deleteCloudPhoto, assetHasOpenRecall, assetOpenRecall, impNorm } from "../lib/util.js";',
  "",
];
const aText = aHeader.join("\n") + blocks.A.join("\n") + "\n";
const uHeader = [
  "/* MedTrace — util condivisa: meta record, date, codici, foto cloud, recalls, normalizzazione import (estratti da app.js, v3.00) */",
  'import { __awaiter } from "./tslib.js";',
  'import { getSupabaseClient, getSupabaseConfig, OFFLINE_MODE } from "./sync.js";',
  "",
];
const uText = uHeader.join("\n") + blocks.U.join("\n") + "\n";
for (const [t, lbl] of [[aText, "assets.js"], [uText, "util.js"]]) {
  try { parse(t, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die(lbl + " non parsa: " + e.message); }
}
const uiOut = uiJs + "\n/* — badge stato e factory icone SVG (spostati col taglio apparecchi, v3.00) — */\n" + blocks.B.join("\n") + "\n";
const cuOut = cuJs + "\n/* — footer standard dei form (spostato col taglio apparecchi, v3.00) — */\n" + blocks.C.join("\n") + "\n";
const syOut = syJs + "\n/* — flag build demo (spostata col taglio apparecchi, v3.00) — */\n" + blocks.S.join("\n") + "\n";
for (const [t, lbl] of [[uiOut, "ui.js"], [cuOut, "constants/ui.js"], [syOut, "sync.js"]]) {
  try { parse(t, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die(lbl + " post-append non parsa: " + e.message); }
}
let out = src;
for (const s of [...spans].reverse()) out = out.slice(0, s.start) + out.slice(s.end);
const anchor = 'import { techSignature } from "./components/shared.js";\n';
if (!out.includes(anchor)) die("anchor import non trovata");
const byDest = { A: [], U: [], B: [], C: [], S: [] };
for (const n of residui.keys()) byDest[DEST[n]].push(n);
let imports = "";
if (byDest.A.length) imports += 'import { ' + byDest.A.sort().join(", ") + ' } from "./components/assets.js";\n';
if (byDest.U.length) imports += 'import { ' + byDest.U.sort().join(", ") + ' } from "./lib/util.js";\n';
if (byDest.B.length) imports += 'import { ' + byDest.B.sort().join(", ") + ' } from "./components/ui.js";\n';
if (byDest.C.length) imports += 'import { ' + byDest.C.sort().join(", ") + ' } from "./constants/ui.js";\n';
if (byDest.S.length) imports += 'import { ' + byDest.S.sort().join(", ") + ' } from "./lib/sync.js";\n';
out = out.replace(anchor, anchor + imports);
if (out.split('const APP_VERSION = "2.99";').length - 1 !== 1) die("bump APP_VERSION");
out = out.replace('const APP_VERSION = "2.99";', 'const APP_VERSION = "3.00";');
const swOut = sw.replace("const CACHE_VERSION = 'medtrace-v3-24';", "const CACHE_VERSION = 'medtrace-v3-25';");
if (swOut === sw) die("bump CACHE_VERSION");
let outAst;
try { outAst = parse(out, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die("app.js post-taglio non parsa: " + e.message); }
const PRIV = new Set([...NAMES].filter(n => !residui.has(n) && DEST[n] !== "U" && DEST[n] !== "B" && DEST[n] !== "C" && DEST[n] !== "S"));
const leaks = [];
walk(outAst, (n, p) => {
  if (n.type === "Identifier" && PRIV.has(n.name)) {
    if (p && ((p.type === "MemberExpression" && p.property === n && !p.computed) || (p.type === "Property" && p.key === n && !p.computed))) return;
    leaks.push(n.name + "@" + n.start);
  }
});
if (leaks.length) die("residui privati: " + leaks.join(", "));
fs.writeFileSync("src/components/assets.js", aText);
fs.writeFileSync("src/lib/util.js", uText);
fs.writeFileSync("src/components/ui.js", uiOut);
fs.writeFileSync("src/constants/ui.js", cuOut);
fs.writeFileSync("src/lib/sync.js", syOut);
fs.writeFileSync("src/app.js", out);
fs.writeFileSync("public/sw.js", swOut);
console.log("OK: assets.js " + aText.split("\n").length + " righe; util.js " + uText.split("\n").length + "; app.js " + src.split("\n").length + " -> " + out.split("\n").length);
