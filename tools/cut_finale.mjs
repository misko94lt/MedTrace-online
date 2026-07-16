// cut_finale.mjs — Fase 2, gran finale: trasloco AppMain+App in components/main.js, app.js entry sottile (v3.06 → v3.07)
import { parse } from "acorn";
import fs from "node:fs";
const die = (m) => { console.error("ABORT: " + m); process.exit(1); };
const src = fs.readFileSync("src/app.js", "utf8");
const sw = fs.readFileSync("public/sw.js", "utf8");
const repJs = fs.readFileSync("src/lib/reports.js", "utf8");
const syJs = fs.readFileSync("src/lib/sync.js", "utf8");
if (!src.includes('const APP_VERSION = "3.06";')) die("attesa 3.06");
if (fs.existsSync("src/components/main.js")) die("main.js esiste");
const M = new Set(["AppMain","App","ClientReportModal","QRScanCam","PpmChecklistEditor","TemplateManagerModal","CestinoModal","OrderForm","HelpTab","PartForm","CustomerForm","SubscriptionBanner","OfflineBanner","Pill","FieldError","Spinner","LoadingOverlay","HELP_SECTIONS","PRIVACY_TEXT","TERMS_TEXT","STATUS_COLOR_PORTAL","CUSTOM_TPL_KEY","loadCustomTemplates","saveCustomTemplates","getAllTemplates","savePpmChecklists","ensureAssetCodes","removeFromList","SUPABASE_ENABLED","supaGetUser","supaOnAuth","useState","APP_VERSION","MTErrorBoundary"]);
const R = new Set(["generateInvoicePDF","generateClientReportPDF"]);
const Y = new Set(["bootLoadData"]);
const X = new Set(["ProcedureDetail","AssetCard","HistoryModal","PROC_CATEGORIES","PROC_TYPES"]);
const ALL = new Set([...M, ...R, ...Y, ...X]);
const ast = parse(src, { ecmaVersion: "latest", sourceType: "module" });
const spans = []; const importLines = [];
for (const node of ast.body) {
  if (node.type === "ImportDeclaration") { importLines.push({ start: node.start, end: node.end }); continue; }
  if ((node.type === "FunctionDeclaration" || node.type === "ClassDeclaration") && node.id && ALL.has(node.id.name)) spans.push({ start: node.start, end: node.end, names: [node.id.name] });
  else if (node.type === "VariableDeclaration") {
    const names = node.declarations.map(d => d.id && (d.id.name || (d.id.properties ? d.id.properties.map(p => p.value && p.value.name).filter(Boolean).join(",") : ""))).filter(Boolean);
    const flat = names.join(",").split(",");
    if (flat.some(n => ALL.has(n))) spans.push({ start: node.start, end: node.end, names: flat });
  }
}
spans.sort((a, b) => a.start - b.start);
console.log("Span trovati:", spans.length, "→", spans.map(s => s.names[0]).join(","));
if (spans.length !== 42) die("attesi 42 span, trovati " + spans.length);
for (const s of spans) { if (src[s.end] === "\n") s.end++; }
for (const il of importLines) { if (src[il.end] === "\n") il.end++; }
const destOf = (n) => M.has(n) || n === "useEffect" ? "M" : R.has(n) ? "R" : Y.has(n) ? "Y" : "X";
const inSpan = p => spans.some(s => p >= s.start && p < s.end);
function walk(n, fn, p) { if (!n || typeof n.type !== "string") return; fn(n, p); for (const k of Object.keys(n)) { if (k === "loc") continue; const v = n[k]; if (Array.isArray(v)) v.forEach(c => c && typeof c.type === "string" && walk(c, fn, n)); else if (v && typeof v.type === "string") walk(v, fn, n); } }
const residui = new Map();
walk(ast, (n, p) => {
  if (n.type === "Identifier" && ALL.has(n.name) && !inSpan(n.start)) {
    if (p && ((p.type === "MemberExpression" && p.property === n && !p.computed) || (p.type === "Property" && p.key === n && !p.computed) || p.type === "ImportSpecifier")) return;
    residui.set(n.name, (residui.get(n.name) || 0) + 1);
  }
});
console.log("Residui fuori-span:", [...residui.entries()].sort().map(([k, v]) => k + " x" + v).join(", "));
for (const n of X) if (residui.has(n)) die("morto " + n + " ancora usato: promuovilo a M");
const grab = (s) => src.slice(s.start, s.end).replace(/\n$/, "");
const blocks = { M: [], R: [], Y: [] };
for (const s of spans) {
  const d = destOf(s.names[0]);
  if (d === "X") continue;
  const needExport = d === "M" ? s.names.some(n => residui.has(n)) : true;
  blocks[d].push((needExport ? "export " : "") + grab(s));
}
// header main.js = import di app.js con path riscritti
const hdr = importLines.map(il => src.slice(il.start, il.end).trimEnd()
  .replace('from "./components/', 'from "./')
  .replace('from "./lib/', 'from "../lib/')
  .replace('from "./constants/', 'from "../constants/'));
const mText = "/* MedTrace — cuore dell'app: AppMain, App, modali di servizio, guida, testi legali (trasloco finale da app.js, v3.07) */\n" + hdr.join("\n") + "\nimport { generateInvoicePDF, generateClientReportPDF } from \"../lib/reports.js\";\nimport { bootLoadData } from \"../lib/sync.js\";\n\n" + blocks.M.join("\n") + "\n";
try { parse(mText, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die("main.js non parsa: " + e.message); }
const repOut = repJs + "\n/* — PDF fattura e report cliente (trasloco finale, v3.07) — */\n" + blocks.R.join("\n") + "\n";
const syOut = syJs + "\n/* — boot dati con scelta locale/IDB (trasloco finale, v3.07) — */\n" + blocks.Y.join("\n") + "\n";
for (const [t, l] of [[repOut, "reports"], [syOut, "sync"]]) { try { parse(t, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die(l + ": " + e.message); } }
// app.js finale: rimuovi span (M/R/Y/X) e import, poi aggiungi i due import nuovi in testa
let out = src;
const cuts = [...spans, ...importLines].sort((a, b) => a.start - b.start);
for (const s of [...cuts].reverse()) out = out.slice(0, s.start) + out.slice(s.end);
out = '/* MedTrace — entry: bootstrap tema/SW, versione, mount (v3.07) */\nimport { App, AppMain } from "./components/main.js";\nimport { bootLoadData } from "./lib/sync.js";\n' + out;
let mFinal = mText;
if (mFinal.split('const APP_VERSION = "3.06";').length - 1 !== 1) die("bump in main");
mFinal = mFinal.replace('const APP_VERSION = "3.06";', 'const APP_VERSION = "3.07";');
const swOut = sw.replace("const CACHE_VERSION = 'medtrace-v3-31';", "const CACHE_VERSION = 'medtrace-v3-32';");
if (swOut === sw) die("bump sw");
let outAst;
try { outAst = parse(out, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die("app.js finale non parsa: " + e.message); }
const PRIV = new Set([...ALL].filter(n => !residui.has(n) && n !== "App" && n !== "AppMain" && n !== "bootLoadData"));
const leaks = [];
walk(outAst, (n, p) => {
  if (n.type === "Identifier" && PRIV.has(n.name)) {
    if (p && ((p.type === "MemberExpression" && p.property === n && !p.computed) || (p.type === "Property" && p.key === n && !p.computed) || p.type === "ImportSpecifier")) return;
    leaks.push(n.name + "@" + n.start);
  }
});
if (leaks.length) die("residui in entry: " + leaks.join(", "));
fs.writeFileSync("src/components/main.js", mFinal);
fs.writeFileSync("src/lib/reports.js", repOut);
fs.writeFileSync("src/lib/sync.js", syOut);
fs.writeFileSync("src/app.js", out);
fs.writeFileSync("public/sw.js", swOut);
console.log("OK: main.js " + mText.split("\n").length + " righe; app.js entry " + out.split("\n").length + " righe");
