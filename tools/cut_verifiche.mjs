// cut_verifiche.mjs — Fase 2, taglio 2: wizard verifiche + smistamento satelliti (v2.89 → v2.90)
import { parse } from "acorn";
import fs from "node:fs";

const die = (m) => { console.error("ABORT: " + m); process.exit(1); };
const src = fs.readFileSync("src/app.js", "utf8");
const sw = fs.readFileSync("public/sw.js", "utf8");
const uiJs = fs.readFileSync("src/components/ui.js", "utf8");
const repJs = fs.readFileSync("src/lib/reports.js", "utf8");
const ftJs = fs.readFileSync("src/constants/funcTemplates.js", "utf8");
if (!src.includes('const APP_VERSION = "2.89";')) die("APP_VERSION attesa 2.89");
if (!sw.includes("const CACHE_VERSION = 'medtrace-v3-14';")) die("CACHE_VERSION attesa medtrace-v3-14");
if (fs.existsSync("src/components/verifiche.js")) die("verifiche.js esiste già");

// destinazioni
const DEST = {
  FuncWizardForm: "V", FuncVerifyForm: "V", IecWizardForm: "V", IECReportForm: "V",
  TestInstrumentsHint: "V", SignaturePad: "V", INSTRUMENTS_BY_TPL: "V",
  AssetCombobox: "U", ErrorSummary: "U",
  getNextReportNumber: "R", iecGetMeasures: "R",
  FUNC_TEMPLATE_MAP: "F", cndToTemplate: "F", guessTemplate: "F",
};
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

// residui in app.js per nome → cosa importare in app.js
const residui = new Map();
walk(ast, (n, p) => {
  if (n.type === "Identifier" && NAMES.has(n.name) && !inSpan(n.start)) {
    if (p && ((p.type === "MemberExpression" && p.property === n && !p.computed) || (p.type === "Property" && p.key === n && !p.computed))) return;
    residui.set(n.name, (residui.get(n.name) || 0) + 1);
  }
});
console.log("Residui in app.js:", [...residui.entries()].sort().map(([k, v]) => k + " x" + v).join(", "));

// costruzione blocchi per destinazione (ordine originale preservato per gruppo)
const grab = (s) => src.slice(s.start, s.end).replace(/\n$/, "");
const blocks = { V: [], U: [], R: [], F: [] };
for (const s of spans) {
  const d = DEST[s.names[0]];
  // export: nel modulo V esporta ciò che app.js usa ancora; nei moduli append (U/R/F) esporta sempre (usati da verifiche.js e/o app.js)
  const needExport = d === "V" ? s.names.some(n => residui.has(n)) : true;
  blocks[d].push((needExport ? "export " : "") + grab(s));
}

// V — nuovo modulo verifiche.js
const vHeader = [
  "/* MedTrace — verifiche: wizard e form Funzionale + IEC 62353, firma, suggerimento strumenti (estratti da app.js, v2.90) */",
  'import { TecnicoPicker, Btn, chkRow } from "./shared.js";',
  'import { Hint, useMedia, AssetCombobox, ErrorSummary } from "./ui.js";',
  'import { FORM_FLD, FORM_INP, FORM_LBL } from "../constants/ui.js";',
  'import { FUNC_TEMPLATES, cndToTemplate, guessTemplate } from "../constants/funcTemplates.js";',
  'import { getNextReportNumber, iecGetMeasures } from "../lib/reports.js";',
  "",
];
const vText = vHeader.join("\n") + blocks.V.join("\n") + "\n";
try { parse(vText, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die("verifiche.js non parsa: " + e.message); }

// U/R/F — append ai moduli esistenti
const uiOut = uiJs + "\n/* — combobox apparecchi e riepilogo errori (spostati con il taglio verifiche, v2.90) — */\n" + blocks.U.join("\n") + "\n";
const repOut = repJs + "\n/* — numerazione report e misure IEC (spostati con il taglio verifiche, v2.90) — */\n" + blocks.R.join("\n") + "\n";
const ftOut = ftJs + '\n/* — mappe e lookup template (spostati con il taglio verifiche, v2.90) — */\nimport { CND_TO_TPL } from "./cnd.js";\n' + blocks.F.join("\n") + "\n";
for (const [t, lbl] of [[uiOut, "ui.js"], [repOut, "reports.js"], [ftOut, "funcTemplates.js"]]) {
  try { parse(t, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die(lbl + " post-append non parsa: " + e.message); }
}

// app.js: rimozione + import
let out = src;
for (const s of [...spans].reverse()) out = out.slice(0, s.start) + out.slice(s.end);
const anchor = 'import { RfidAssocPicker } from "./components/rfid.js";\n';
if (!out.includes(anchor)) die("anchor import non trovata");
const byDest = { V: [], U: [], R: [], F: [] };
for (const n of residui.keys()) byDest[DEST[n]].push(n);
let imports = "";
if (byDest.V.length) imports += 'import { ' + byDest.V.sort().join(", ") + ' } from "./components/verifiche.js";\n';
if (byDest.U.length) imports += 'import { ' + byDest.U.sort().join(", ") + ' } from "./components/ui.js";\n';
if (byDest.R.length) imports += 'import { ' + byDest.R.sort().join(", ") + ' } from "./lib/reports.js";\n';
if (byDest.F.length) imports += 'import { ' + byDest.F.sort().join(", ") + ' } from "./constants/funcTemplates.js";\n';
out = out.replace(anchor, anchor + imports);

// bump
if (out.split('const APP_VERSION = "2.89";').length - 1 !== 1) die("bump APP_VERSION");
out = out.replace('const APP_VERSION = "2.89";', 'const APP_VERSION = "2.90";');
const swOut = sw.replace("const CACHE_VERSION = 'medtrace-v3-14';", "const CACHE_VERSION = 'medtrace-v3-15';");
if (swOut === sw) die("bump CACHE_VERSION");

// post-assert su app.js: parse + nessun residuo dei nomi NON importati
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

fs.writeFileSync("src/components/verifiche.js", vText);
fs.writeFileSync("src/components/ui.js", uiOut);
fs.writeFileSync("src/lib/reports.js", repOut);
fs.writeFileSync("src/constants/funcTemplates.js", ftOut);
fs.writeFileSync("src/app.js", out);
fs.writeFileSync("public/sw.js", swOut);
console.log("OK: verifiche.js " + vText.split("\n").length + " righe; app.js " + src.split("\n").length + " → " + out.split("\n").length + "; v2.90 / medtrace-v3-15");
