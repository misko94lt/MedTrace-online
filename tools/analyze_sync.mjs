// analyze_sync.mjs — DRY RUN: nessuna modifica. Censimento per il taglio src/lib/sync.js
import { parse } from "acorn";
import fs from "node:fs";

const src = fs.readFileSync("src/app.js", "utf8");

// PRE-FLIGHT versione
const vm = src.match(/const APP_VERSION = "([\d.]+)";/);
if (!vm || vm[1] !== "2.83") { console.error("PRE-FLIGHT FAIL: APP_VERSION attesa 2.83, trovata " + (vm && vm[1])); process.exit(1); }

const FUNC_RE = /^(supabase[A-Z]\w*|loadData|saveData|upsertInList|getSupa|getSupabaseClient|toSnakeRecord|toCamelRecord|toSnake|toCamel|mirrorToIdb|idbSet|idbGet|idbDel|idbOpen|storageUsage|getSupabaseConfig|_mirrorFlush)$/;
const VAR_LIST = new Set(["SUPA_URL","SUPA_KEY","_supa","_supabaseClient","_supabaseLibPromise","SUPABASE_CHUNK","SUPABASE_TABLES","STORAGE_KEY","OFFLINE_MODE","_storageWarnedPct","_quotaAlerted","_bootData","_bootDone","_mirrorTimer","_mirrorPending","_usageCache"]);

const ast = parse(src, { ecmaVersion: "latest", sourceType: "module", locations: true });

const spans = []; // {start,end,names:[],kind,line}
for (const node of ast.body) {
  if (node.type === "FunctionDeclaration" && node.id && FUNC_RE.test(node.id.name)) {
    spans.push({ start: node.start, end: node.end, names: [node.id.name], kind: "func", line: node.loc.start.line });
  } else if (node.type === "VariableDeclaration") {
    const names = node.declarations.map(d => d.id && d.id.name).filter(Boolean);
    const hit = names.filter(n => VAR_LIST.has(n) || FUNC_RE.test(n));
    if (hit.length) {
      if (hit.length !== names.length) { console.error("MISTO: dichiarazione multipla parzialmente in lista @", node.loc.start.line, names); process.exit(1); }
      spans.push({ start: node.start, end: node.end, names, kind: node.kind, line: node.loc.start.line });
    }
  } else if (node.type === "TryStatement" && src.slice(node.start, node.end).includes('"pagehide"')) {
    spans.push({ start: node.start, end: node.end, names: ["<listeners pagehide/visibilitychange>"], kind: "stmt", line: node.loc.start.line });
  }
}
spans.sort((a,b)=>a.start-b.start);

console.log("=== SPAN DA ESTRARRE (" + spans.length + ") ===");
for (const s of spans) console.log(`L${s.line} [${s.kind}] ${s.names.join(",")} (${s.end - s.start} ch)`);

const inSpan = (pos) => spans.some(s => pos >= s.start && pos < s.end);
const extractedNames = new Set(spans.flatMap(s => s.names).filter(n => !n.startsWith("<")));

// walker generico
function walk(node, fn, parent) {
  if (!node || typeof node.type !== "string") return;
  fn(node, parent);
  for (const k of Object.keys(node)) {
    if (k === "loc" || k === "parent") continue;
    const v = node[k];
    if (Array.isArray(v)) v.forEach(c => c && typeof c.type === "string" && walk(c, fn, node));
    else if (v && typeof v.type === "string") walk(v, fn, node);
  }
}

// 1) riferimenti residui in app.js a nomi estratti → export/import necessari
// 2) assegnazioni residue a nomi estratti → serve setter
const residualRefs = new Map(); const residualAssign = [];
walk(ast, (n, p) => {
  if (n.type === "Identifier" && extractedNames.has(n.name) && !inSpan(n.start)) {
    // scarta property non-computed (obj.loadData) e chiavi oggetto
    if (p && ((p.type === "MemberExpression" && p.property === n && !p.computed) || (p.type === "Property" && p.key === n && !p.computed))) return;
    residualRefs.set(n.name, (residualRefs.get(n.name) || 0) + 1);
    if (p && p.type === "AssignmentExpression" && p.left === n) {
      const line = src.slice(0, n.start).split("\n").length;
      residualAssign.push(n.name + " @L" + line);
    }
  }
});
console.log("\n=== RIFERIMENTI RESIDUI in app.js (→ import necessari) ===");
[...residualRefs.entries()].sort().forEach(([k,v]) => console.log(k + " x" + v));
console.log("\n=== ASSEGNAZIONI RESIDUE (→ pattern setter) ===");
residualAssign.forEach(a => console.log(a));

// 3) identificatori liberi usati DENTRO gli span ma definiti fuori → import del modulo
const GLOBALS = new Set(["window","document","localStorage","indexedDB","JSON","Promise","Date","Math","Object","Array","String","Number","Boolean","console","setTimeout","clearTimeout","setInterval","clearInterval","navigator","fetch","URL","Blob","crypto","Error","TypeError","RangeError","isNaN","parseInt","parseFloat","undefined","Infinity","NaN","Set","Map","WeakMap","RegExp","encodeURIComponent","decodeURIComponent","alert","confirm","atob","btoa","structuredClone","Symbol","Proxy","Reflect","queueMicrotask","AbortController","FileReader","CustomEvent","this","arguments"]);
const declaredInSpans = new Set(extractedNames);
const externalDeps = new Map();
// raccogli tutte le dichiarazioni interne agli span (scope grossolano)
walk(ast, (n) => {
  if (!inSpan(n.start)) return;
  if (n.type === "FunctionDeclaration" && n.id) declaredInSpans.add(n.id.name);
  if (n.type === "VariableDeclarator" && n.id) walk(n.id, (x, xp) => { if (x.type === "Identifier" && !(xp && xp.type === "Property" && xp.key === x && !xp.computed && xp.value !== x)) declaredInSpans.add(x.name); });
  if ((n.type === "FunctionDeclaration" || n.type === "FunctionExpression" || n.type === "ArrowFunctionExpression") && n.params) {
    n.params.forEach(pm => { walk(pm, (x)=>{ if (x.type==="Identifier") declaredInSpans.add(x.name); }); });
  }
  if (n.type === "CatchClause" && n.param) walk(n.param, (x)=>{ if(x.type==="Identifier") declaredInSpans.add(x.name); });
});
walk(ast, (n, p) => {
  if (n.type !== "Identifier" || !inSpan(n.start)) return;
  if (p && ((p.type === "MemberExpression" && p.property === n && !p.computed) || (p.type === "Property" && p.key === n && !p.computed))) return;
  if (p && (p.type === "VariableDeclarator" && p.id === n)) return;
  if (p && (p.type === "FunctionDeclaration" && p.id === n)) return;
  if (GLOBALS.has(n.name) || declaredInSpans.has(n.name)) return;
  externalDeps.set(n.name, (externalDeps.get(n.name) || 0) + 1);
});
console.log("\n=== DIPENDENZE ESTERNE degli span (→ import del modulo) ===");
[...externalDeps.entries()].sort().forEach(([k,v]) => console.log(k + " x" + v));

console.log("\nTotale caratteri estratti:", spans.reduce((a,s)=>a+s.end-s.start,0), "su", src.length);
