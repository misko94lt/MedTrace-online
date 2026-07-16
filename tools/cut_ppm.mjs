// cut_ppm.mjs — Fase 2, taglio 3: cluster PPM (v2.96 → v2.97)
import { parse } from "acorn";
import fs from "node:fs";

const die = (m) => { console.error("ABORT: " + m); process.exit(1); };
const src = fs.readFileSync("src/app.js", "utf8");
const sw = fs.readFileSync("public/sw.js", "utf8");
const uiJs = fs.readFileSync("src/components/ui.js", "utf8");
const repJs = fs.readFileSync("src/lib/reports.js", "utf8");
if (!src.includes('const APP_VERSION = "2.96";')) die("APP_VERSION attesa 2.96");
if (!sw.includes("const CACHE_VERSION = 'medtrace-v3-21';")) die("CACHE_VERSION attesa medtrace-v3-21");
if (fs.existsSync("src/components/ppm.js")) die("ppm.js esiste già");

const DEST = { PpmWizardForm: "P", PpmVerifyForm: "P", PpmPage: "P", getPpmChecklist: "P", loadPpmChecklists: "P", ppmCategoryId: "P", PPM_CHECKLISTS_DEFAULT: "P", ppmModelDefaults: "P", ppmModelKey: "P", PPM_CHECKLIST_KEY: "P", PPM_MODEL_DEFAULTS: "P", ppmNorm: "P", generatePPMPDF: "R", EmptyState: "U" };
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
if (spans.length !== 14) die("attesi 14 span, trovati " + spans.length + ": " + spans.map(s => s.names.join()).join(","));
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
const blocks = { P: [], R: [], U: [] };
for (const s of spans) {
  const d = DEST[s.names[0]];
  const needExport = d === "P" ? s.names.some(n => residui.has(n)) : true;
  blocks[d].push((needExport ? "export " : "") + grab(s));
}

const pHeader = [
  "/* MedTrace — PPM: wizard completo (funzionale+VSE), checklist programmata, pagina elenco (estratti da app.js, v2.97) */",
  'import { Inp, Grid, AssetCombobox, SignaturePad, TechSignatureField, EmptyState } from "./ui.js";',
  'import { TecnicoPicker, Btn, techSignature } from "./shared.js";',
  'import { cndToTemplate, guessTemplate, FUNC_TEMPLATES } from "../constants/funcTemplates.js";',
  'import { getNextReportNumber, iecGetMeasures } from "../lib/reports.js";',
  "",
];
const pText = pHeader.join("\n") + blocks.P.join("\n") + "\n";
try { parse(pText, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die("ppm.js non parsa: " + e.message); }

let repOut = repJs.replace('import { FUNC_TEMPLATES } from "../constants/funcTemplates.js";',
                           'import { FUNC_TEMPLATES, cndToTemplate, guessTemplate } from "../constants/funcTemplates.js";');
if (repOut === repJs) die("import funcTemplates in reports.js non trovato");
repOut = repOut + "\n/* — PDF unico PPM (spostato con il taglio PPM, v2.97) — */\n" + blocks.R.join("\n") + "\n";
const uiOut = uiJs + "\n/* — stato vuoto riusabile (spostato con il taglio PPM, v2.97) — */\n" + blocks.U.join("\n") + "\n";
for (const [t, lbl] of [[repOut, "reports.js"], [uiOut, "ui.js"]]) {
  try { parse(t, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die(lbl + " post-append non parsa: " + e.message); }
}

let out = src;
for (const s of [...spans].reverse()) out = out.slice(0, s.start) + out.slice(s.end);
const anchor = 'import { techSignature } from "./components/shared.js";\n';
if (!out.includes(anchor)) die("anchor import non trovata");
const byDest = { P: [], R: [], U: [] };
for (const n of residui.keys()) byDest[DEST[n]].push(n);
let imports = "";
if (byDest.P.length) imports += 'import { ' + byDest.P.sort().join(", ") + ' } from "./components/ppm.js";\n';
if (byDest.R.length) imports += 'import { ' + byDest.R.sort().join(", ") + ' } from "./lib/reports.js";\n';
if (byDest.U.length) imports += 'import { ' + byDest.U.sort().join(", ") + ' } from "./components/ui.js";\n';
out = out.replace(anchor, anchor + imports);

if (out.split('const APP_VERSION = "2.96";').length - 1 !== 1) die("bump APP_VERSION");
out = out.replace('const APP_VERSION = "2.96";', 'const APP_VERSION = "2.97";');
const swOut = sw.replace("const CACHE_VERSION = 'medtrace-v3-21';", "const CACHE_VERSION = 'medtrace-v3-22';");
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

fs.writeFileSync("src/components/ppm.js", pText);
fs.writeFileSync("src/lib/reports.js", repOut);
fs.writeFileSync("src/components/ui.js", uiOut);
fs.writeFileSync("src/app.js", out);
fs.writeFileSync("public/sw.js", swOut);
console.log("OK: ppm.js " + pText.split("\n").length + " righe; app.js " + src.split("\n").length + " → " + out.split("\n").length + "; v2.97 / medtrace-v3-22");
