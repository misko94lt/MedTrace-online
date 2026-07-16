// rm_procedures.mjs — rimozione UI procedure con span AST (v3.03 → v3.04)
import { parse } from "acorn";
import fs from "node:fs";
const die = (m) => { console.error("ABORT: " + m); process.exit(1); };
let src = fs.readFileSync("src/app.js", "utf8");
const sw = fs.readFileSync("public/sw.js", "utf8");
if (!src.includes('const APP_VERSION = "3.03";')) die("attesa 3.03");
const NAMES = new Set(["AIDraftModal", "ProceduresPage", "ProcedureForm"]);
const ast = parse(src, { ecmaVersion: "latest", sourceType: "module" });
const spans = [];
for (const n of ast.body) if (n.type === "FunctionDeclaration" && n.id && NAMES.has(n.id.name)) spans.push({ start: n.start, end: n.end });
if (spans.length !== 3) die("attesi 3 span, trovati " + spans.length);
spans.sort((a, b) => a.start - b.start);
for (const s of spans) { if (src[s.end] === "\n") s.end++; }
for (const s of [...spans].reverse()) src = src.slice(0, s.start) + src.slice(s.end);

const rep1 = (old, nu, label) => { const c = src.split(old).length - 1; if (c !== 1) die(label + ": " + c); src = src.replace(old, nu); };
// render ProceduresPage
const mRender = src.match(/tab === "procedures" && \(React\.createElement\(ProceduresPage,[^\n]*\n/);
if (!mRender) die("render procedures non trovato");
src = src.replace(mRender[0], "");
// switcher pill
const mSw = src.match(/\(tab === "procedures" \|\| tab === "help"\) && \(React\.createElement\("div",[^\n]*\n/);
if (!mSw) die("switcher non trovato");
src = src.replace(mSw[0], "");
rep1('tab === "help" && React.createElement(HelpTab, { helpOpen: helpOpen, setHelpOpen: setHelpOpen }),',
     '(tab === "help" || tab === "procedures") && React.createElement(HelpTab, { helpOpen: helpOpen, setHelpOpen: setHelpOpen }),', "render help");
rep1('{ id: "procedures", label: "Aiuto & Procedure", icon: "\u203a" },', '{ id: "help", label: "Guida", icon: "\u203a" },', "menu");
rep1('const SECTION_ALIAS = { scadenze: "agenda", help: "procedures", ricognizione: "assets", scheda: "assets" };',
     'const SECTION_ALIAS = { scadenze: "agenda", procedures: "help", ricognizione: "assets", scheda: "assets" };', "alias");
for (const nm of NAMES) if (new RegExp("\\b" + nm + "\\b").test(src)) die(nm + " ancora referenziato");
rep1('const APP_VERSION = "3.03";', 'const APP_VERSION = "3.04";', "bump");
const swOut = sw.replace("const CACHE_VERSION = 'medtrace-v3-28';", "const CACHE_VERSION = 'medtrace-v3-29';");
if (swOut === sw) die("bump sw");
try { parse(src, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die("post-parse: " + e.message); }
fs.writeFileSync("src/app.js", src);
fs.writeFileSync("public/sw.js", swOut);
console.log("OK: procedure rimosse, v3.04 / v3-29; app.js " + src.split("\n").length + " righe");
