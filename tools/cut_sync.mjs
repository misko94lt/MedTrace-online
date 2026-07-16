// cut_sync.mjs — taglio layer sync Supabase → src/lib/sync.js (v2.83 → v2.84)
// Metodo: acorn AST span detection, scritture atomiche a fine assert.
import { parse } from "acorn";
import fs from "node:fs";

const die = (m) => { console.error("ABORT: " + m); process.exit(1); };

// ---------- PRE-FLIGHT ----------
const src = fs.readFileSync("src/app.js", "utf8");
const sw = fs.readFileSync("public/sw.js", "utf8");
if (!src.includes('const APP_VERSION = "2.83";')) die("APP_VERSION attesa 2.83");
if (!sw.includes("const CACHE_VERSION = 'medtrace-v3-8';")) die("CACHE_VERSION attesa medtrace-v3-8");
if (fs.existsSync("src/lib/sync.js")) die("src/lib/sync.js esiste già");

const FUNC_RE = /^(supabase[A-Z]\w*|loadData|saveData|upsertInList|getSupa|getSupabaseClient|toSnakeRecord|toCamelRecord|toSnake|toCamel|mirrorToIdb|idbSet|idbGet|idbDel|idbOpen|storageUsage|getSupabaseConfig|_mirrorFlush)$/;
const VAR_LIST = new Set(["SUPA_URL","SUPA_KEY","_supa","_supabaseClient","_supabaseLibPromise","SUPABASE_CHUNK","SUPABASE_TABLES","STORAGE_KEY","OFFLINE_MODE","_storageWarnedPct","_quotaAlerted","_bootData","_bootDone","_mirrorTimer","_mirrorPending","_usageCache"]);
const EXPORTS = new Set(["OFFLINE_MODE","STORAGE_KEY","getSupa","getSupabaseClient","getSupabaseConfig","idbGet","idbSet","loadData","mirrorToIdb","saveData","storageUsage","supabaseDeleteById","supabaseGetCompany","supabaseGetRole","supabasePushOne","supabaseSaveCompany","supabaseSaveTechnicians","supabaseSyncMerge","supabaseSyncUp","upsertInList"]);
const PRIVATE = new Set(["SUPA_URL","SUPA_KEY","_supa","_supabaseClient","_supabaseLibPromise","SUPABASE_CHUNK","SUPABASE_TABLES","_bootData","_bootDone","_mirrorTimer","_mirrorPending","_mirrorFlush","_quotaAlerted","_storageWarnedPct","_usageCache","idbOpen","toSnakeRecord","toCamelRecord","supabaseSyncDown","supabaseIsTecnico","supabaseGetOrgId"]);

const ast = parse(src, { ecmaVersion: "latest", sourceType: "module", locations: true });
const spans = [];
for (const node of ast.body) {
  if (node.type === "FunctionDeclaration" && node.id && FUNC_RE.test(node.id.name)) {
    spans.push({ start: node.start, end: node.end, names: [node.id.name] });
  } else if (node.type === "VariableDeclaration") {
    const names = node.declarations.map(d => d.id && d.id.name).filter(Boolean);
    const hit = names.filter(n => VAR_LIST.has(n) || FUNC_RE.test(n));
    if (hit.length) {
      if (hit.length !== names.length) die("dichiarazione multipla parzialmente in lista: " + names.join(","));
      spans.push({ start: node.start, end: node.end, names });
    }
  } else if (node.type === "TryStatement" && src.slice(node.start, node.end).includes('"pagehide"')) {
    spans.push({ start: node.start, end: node.end, names: [] }); // listener mirror
  }
}
spans.sort((a,b)=>a.start-b.start);
if (spans.length !== 42) die("attesi 42 span, trovati " + spans.length);

// estendi end per inglobare il newline successivo
for (const s of spans) { if (src[s.end] === "\n") s.end++; }

// ---------- COSTRUZIONE MODULO ----------
const pieces = [];
pieces.push("/* MedTrace — layer sync/persistenza: Supabase, localStorage/IndexedDB mirror, boot data (estratto da app.js, v2.84) */");
pieces.push('import { __awaiter } from "./tslib.js";');
pieces.push("");
for (const s of spans) {
  let txt = src.slice(s.start, s.end).replace(/\n$/, "");
  if (s.names.some(n => EXPORTS.has(n))) txt = "export " + txt;
  pieces.push(txt);
}
pieces.push("");
pieces.push("/* setter/getter per lo stato boot riassegnato da app.js (pattern _instrumentsRegistry, cfr. reports.js) */");
pieces.push("export function setBootData(v) { _bootData = v; }");
pieces.push("export function setBootDone(v) { _bootDone = v; }");
pieces.push("export function getBootDone() { return _bootDone; }");
const moduleText = pieces.join("\n") + "\n";
try { parse(moduleText, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die("sync.js generato non parsa: " + e.message); }

// ---------- APP.JS: rimozione span (dal fondo) ----------
let out = src;
for (const s of [...spans].reverse()) out = out.slice(0, s.start) + out.slice(s.end);

// ---------- APP.JS: pattern setter/getter (assert 1 occorrenza ciascuno) ----------
const rep1 = (from, to) => {
  const n = out.split(from).length - 1;
  if (n !== 1) die(`attese 1 occorrenza di "${from}", trovate ${n}`);
  out = out.replace(from, to);
};
rep1("_bootData = chosen;", "setBootData(chosen);");
rep1("_bootDone = true;", "setBootDone(true);");
rep1("if (_bootDone) return;", "if (getBootDone()) return;");

// ---------- APP.JS: import del modulo ----------
const anchor = 'import { TecnicoPicker, TecniciManager, chkRow, Btn, fileToAttachment, AttachmentsList } from "./components/shared.js";\n';
if (!out.includes(anchor)) die("anchor import shared.js non trovata");
const importLine = 'import { ' + [...EXPORTS].join(", ") + ', setBootData, setBootDone, getBootDone } from "./lib/sync.js";\n';
out = out.replace(anchor, anchor + importLine);

// ---------- BUMP VERSIONI ----------
const nA = out.split('const APP_VERSION = "2.83";').length - 1;
if (nA !== 1) die("APP_VERSION replace: occorrenze " + nA);
out = out.replace('const APP_VERSION = "2.83";', 'const APP_VERSION = "2.84";');
const swOut = sw.replace("const CACHE_VERSION = 'medtrace-v3-8';", "const CACHE_VERSION = 'medtrace-v3-9';");
if (swOut === sw) die("bump CACHE_VERSION fallito");

// ---------- POST-ASSERT: parse + nessun identificatore privato residuo ----------
let outAst;
try { outAst = parse(out, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die("app.js post-taglio non parsa: " + e.message); }
const leaks = [];
(function walk(node, parent) {
  if (!node || typeof node.type !== "string") return;
  if (node.type === "Identifier" && PRIVATE.has(node.name)) {
    const skip = parent && ((parent.type === "MemberExpression" && parent.property === node && !parent.computed) || (parent.type === "Property" && parent.key === node && !parent.computed));
    if (!skip) leaks.push(node.name + "@" + node.start);
  }
  for (const k of Object.keys(node)) {
    if (k === "loc") continue;
    const v = node[k];
    if (Array.isArray(v)) v.forEach(c => c && typeof c.type === "string" && walk(c, node));
    else if (v && typeof v.type === "string") walk(v, node);
  }
})(outAst, null);
if (leaks.length) die("identificatori privati residui in app.js: " + leaks.join(", "));

// ---------- SCRITTURE ATOMICHE ----------
fs.writeFileSync("src/lib/sync.js", moduleText);
fs.writeFileSync("src/app.js", out);
fs.writeFileSync("public/sw.js", swOut);
console.log("OK: sync.js " + moduleText.split("\n").length + " righe; app.js " + src.split("\n").length + " → " + out.split("\n").length + " righe; v2.84 / medtrace-v3-9");
