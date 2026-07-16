// cut_set.mjs — Fase 2, taglio 8: impostazioni, login, portale (v3.05 → v3.06)
import { parse } from "acorn";
import fs from "node:fs";
const die = (m) => { console.error("ABORT: " + m); process.exit(1); };
const src = fs.readFileSync("src/app.js", "utf8");
const sw = fs.readFileSync("public/sw.js", "utf8");
const syJs = fs.readFileSync("src/lib/sync.js", "utf8");
const utJs = fs.readFileSync("src/lib/util.js", "utf8");
const rfJs = fs.readFileSync("src/lib/rfid.js", "utf8");
if (!src.includes('const APP_VERSION = "3.05";')) die("attesa 3.05");
if (fs.existsSync("src/components/settings.js")) die("settings.js esiste");
const DEST = { SettingsModal:"E", StorageGauge:"E", SettingsSection:"E", RfidImportSection:"E", FotoCloudMigrator:"E", PermissionMatrix:"E", SubscriptionCard:"E", photoStats:"E", LoginScreen:"L", RichiestePage:"P", PortaleClienteBox:"P", supaDB:"Y", supaSignIn:"Y", supaSignOut:"Y", supaSignUp:"Y", fmtMB:"U", parseRfidScan:"Z" };
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
if (spans.length !== 17) die("attesi 17 span, trovati " + spans.length + ": " + spans.map(s=>s.names.join()).join(","));
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
const blocks = { E: [], L: [], P: [], Y: [], U: [], Z: [] };
for (const s of spans) {
  const d = DEST[s.names[0]];
  const needExport = (d === "Y" || d === "U" || d === "Z") ? true : s.names.some(n => residui.has(n));
  blocks[d].push((needExport ? "export " : "") + grab(s));
}
const mk = (hdr, blk, lbl) => { const t = hdr.join("\n") + blk.join("\n") + "\n"; try { parse(t, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die(lbl + " non parsa: " + e.message); } return t; };
const eText = mk([
  "/* MedTrace — impostazioni: azienda, tecnici, permessi, storage, import RFID, migrazione foto, abbonamento (estratti da app.js, v3.06) */",
  'import { Inp, Modal, Grid, Span2, appConfirm, EmptyState } from "./ui.js";',
  'import { Btn, TecniciManager } from "./shared.js";',
  'import { FORM_INP, FORM_LBL, DEFAULT_ROLE_PERMS } from "../constants/ui.js";',
  'import { downloadJSON } from "../lib/export.js";',
  'import { fmtDateTimeIt, fmtMB } from "../lib/util.js";',
  'import { DEMO_LOCKED, OFFLINE_MODE, getSupa, getSupabaseClient, storageUsage, supabaseSaveCompany, supabaseSaveTechnicians, supabaseSyncMerge, supabaseSyncUp, supaDB, supaSignOut } from "../lib/sync.js";',
  'import { __awaiter } from "../lib/tslib.js";',
  'import { parseRfidScan } from "../lib/rfid.js";',
  "",
], blocks.E, "settings.js");
const lText = mk([
  "/* MedTrace — accesso: login/registrazione (estratto da app.js, v3.06) */",
  'import { Inp } from "./ui.js";',
  'import { Btn } from "./shared.js";',
  'import { supaSignIn, supaSignUp, supaSignOut, getSupa, OFFLINE_MODE } from "../lib/sync.js";',
  'import { __awaiter } from "../lib/tslib.js";',
  "",
], blocks.L, "login.js");
const pText = mk([
  "/* MedTrace — portale clienti: richieste e pubblicazione (estratti da app.js, v3.06) */",
  'import { Modal, EmptyState, Badge } from "./ui.js";',
  'import { Btn } from "./shared.js";',
  'import { fmtDateTimeIt } from "../lib/util.js";',
  'import { DEMO_LOCKED, OFFLINE_MODE, supaDB, getSupabaseClient } from "../lib/sync.js";',
  'import { __awaiter } from "../lib/tslib.js";',
  "",
], blocks.P, "portale.js");
const syOut = syJs + "\n/* — auth e canale db legacy (spostati col taglio impostazioni, v3.06) — */\n" + blocks.Y.join("\n") + "\n";
const utOut = utJs + "\n/* — formattazione MB (spostata col taglio impostazioni, v3.06) — */\n" + blocks.U.join("\n") + "\n";
const rfOut = rfJs + "\n/* — parser scansioni RFID da file/evento (spostato col taglio impostazioni, v3.06) — */\n" + blocks.Z.join("\n") + "\n";
for (const [t, lbl] of [[syOut, "sync"], [utOut, "util"], [rfOut, "rfid"]]) { try { parse(t, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die(lbl + " post-append: " + e.message); } }
let out = src;
for (const s of [...spans].reverse()) out = out.slice(0, s.start) + out.slice(s.end);
const anchor = 'import { techSignature } from "./components/shared.js";\n';
if (!out.includes(anchor)) die("anchor import");
const byDest = { E: [], L: [], P: [], Y: [], U: [], Z: [] };
for (const n of residui.keys()) byDest[DEST[n]].push(n);
let imports = "";
if (byDest.E.length) imports += 'import { ' + byDest.E.sort().join(", ") + ' } from "./components/settings.js";\n';
if (byDest.L.length) imports += 'import { ' + byDest.L.sort().join(", ") + ' } from "./components/login.js";\n';
if (byDest.P.length) imports += 'import { ' + byDest.P.sort().join(", ") + ' } from "./components/portale.js";\n';
if (byDest.Y.length) imports += 'import { ' + byDest.Y.sort().join(", ") + ' } from "./lib/sync.js";\n';
if (byDest.U.length) imports += 'import { ' + byDest.U.sort().join(", ") + ' } from "./lib/util.js";\n';
if (byDest.Z.length) imports += 'import { ' + byDest.Z.sort().join(", ") + ' } from "./lib/rfid.js";\n';
out = out.replace(anchor, anchor + imports);
if (out.split('const APP_VERSION = "3.05";').length - 1 !== 1) die("bump");
out = out.replace('const APP_VERSION = "3.05";', 'const APP_VERSION = "3.06";');
const swOut = sw.replace("const CACHE_VERSION = 'medtrace-v3-30';", "const CACHE_VERSION = 'medtrace-v3-31';");
if (swOut === sw) die("bump sw");
let outAst;
try { outAst = parse(out, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die("post-parse: " + e.message); }
const PRIV = new Set([...NAMES].filter(n => !residui.has(n) && !"YUZ".includes(DEST[n])));
const leaks = [];
walk(outAst, (n, p) => {
  if (n.type === "Identifier" && PRIV.has(n.name)) {
    if (p && ((p.type === "MemberExpression" && p.property === n && !p.computed) || (p.type === "Property" && p.key === n && !p.computed))) return;
    leaks.push(n.name + "@" + n.start);
  }
});
if (leaks.length) die("residui privati: " + leaks.join(", "));
fs.writeFileSync("src/components/settings.js", eText);
fs.writeFileSync("src/components/login.js", lText);
fs.writeFileSync("src/components/portale.js", pText);
fs.writeFileSync("src/lib/sync.js", syOut);
fs.writeFileSync("src/lib/util.js", utOut);
fs.writeFileSync("src/lib/rfid.js", rfOut);
fs.writeFileSync("src/app.js", out);
fs.writeFileSync("public/sw.js", swOut);
console.log("OK: settings " + eText.split("\n").length + "; login " + lText.split("\n").length + "; portale " + pText.split("\n").length + "; app.js " + src.split("\n").length + " -> " + out.split("\n").length);
