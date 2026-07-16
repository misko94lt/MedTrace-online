import { parse } from "acorn";
import fs from "node:fs";
const BASE = new Set(["SettingsModal","StorageGauge","SettingsSection","RfidImportSection","LoginScreen","RichiestePage","PortaleClienteBox"]);
const CHECK = ["DEFAULT_ROLE_PERMS","FotoCloudMigrator","PermissionMatrix","SubscriptionCard","fmtMB","photoStats","parseRfidScan","supaDB","supaSignIn","supaSignOut","supaSignUp","importRfidScan"];
const src = fs.readFileSync("src/app.js", "utf8");
const ast = parse(src, { ecmaVersion: "latest", sourceType: "module", locations: true });
const spans = [];
const defs = {};
for (const n of ast.body) {
  const reg = (name, node) => { defs[name] = { line: node.loc.start.line, kind: node.type === "FunctionDeclaration" ? "func" : "const", len: node.end - node.start }; };
  if (n.type === "FunctionDeclaration" && n.id) { if (BASE.has(n.id.name)) spans.push({ s: n.start, e: n.end }); if (CHECK.includes(n.id.name)) reg(n.id.name, n); }
  if (n.type === "VariableDeclaration") for (const d of n.declarations) if (d.id && CHECK.includes(d.id.name)) reg(d.id.name, n);
}
const inSpan = p => spans.some(x => p >= x.s && p < x.e);
function walk(n, fn, p) { if (!n || typeof n.type !== "string") return; fn(n, p); for (const k of Object.keys(n)) { if (k === "loc") continue; const v = n[k]; if (Array.isArray(v)) v.forEach(c => c && typeof c.type === "string" && walk(c, fn, n)); else if (v && typeof v.type === "string") walk(v, fn, n); } }
const cnt = {}; CHECK.forEach(c => cnt[c] = { inW: 0, out: 0 });
walk(ast, (n, p) => {
  if (n.type !== "Identifier" || !CHECK.includes(n.name)) return;
  if (p && ((p.type === "MemberExpression" && p.property === n && !p.computed) || (p.type === "Property" && p.key === n && !p.computed))) return;
  if (p && ((p.type === "FunctionDeclaration" && p.id === n) || (p.type === "VariableDeclarator" && p.id === n))) return;
  cnt[n.name][inSpan(n.start) ? "inW" : "out"]++;
});
console.log("NOME                    DEF@   TIPO   CH   nei-wizard  fuori");
for (const c of CHECK) { const d = defs[c] || { line: "?", kind: "?", len: 0 }; console.log(c.padEnd(22) + String(d.line).padStart(6) + "  " + String(d.kind).padEnd(5) + String(d.len).padStart(6) + String(cnt[c].inW).padStart(10) + String(cnt[c].out).padStart(8)); }
