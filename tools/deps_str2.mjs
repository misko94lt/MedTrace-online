import { parse } from "acorn";
import fs from "node:fs";
const GROUP = new Set(["InstrumentsPage", "InstrumentForm", "RecallsPage", "TemplateEditor", "FilterDropdown", "MobileSearch", "SwipeableCard", "RECALL_SEV_COLOR", "RECALL_STATUSES", "RECALL_STATUS_COLOR", "RecallForm", "RenewCalibrationForm", "blankTemplate", "errorBorderStyle"]);
const src = fs.readFileSync("src/app.js", "utf8");
const ast = parse(src, { ecmaVersion: "latest", sourceType: "module" });
const spans = [];
for (const n of ast.body) { if (n.type === "FunctionDeclaration" && n.id && GROUP.has(n.id.name)) spans.push({ s: n.start, e: n.end, name: n.id.name }); if (n.type === "VariableDeclaration") { const nm = n.declarations.map(d=>d.id&&d.id.name).filter(Boolean); if (nm.some(x=>GROUP.has(x))) spans.push({ s: n.start, e: n.end, name: nm.join()+"(const)" }); } }
const inSpan = p => spans.some(x => p >= x.s && p < x.e);
const GLOB = new Set(["window","document","localStorage","JSON","Promise","Date","Math","Object","Array","String","Number","Boolean","console","setTimeout","clearTimeout","navigator","fetch","URL","Blob","Error","isNaN","parseInt","parseFloat","undefined","Set","Map","RegExp","encodeURIComponent","React","CustomEvent","Intl","requestAnimationFrame","cancelAnimationFrame","crypto"]);
const declared = new Set(GROUP);
function walk(n, fn, p) { if (!n || typeof n.type !== "string") return; fn(n, p); for (const k of Object.keys(n)) { if (k === "loc") continue; const v = n[k]; if (Array.isArray(v)) v.forEach(c => c && typeof c.type === "string" && walk(c, fn, n)); else if (v && typeof v.type === "string") walk(v, fn, n); } }
walk(ast, n => { if (!inSpan(n.start)) return;
  if (n.type === "FunctionDeclaration" && n.id) declared.add(n.id.name);
  if (n.type === "VariableDeclarator" && n.id) walk(n.id, x => { if (x.type === "Identifier") declared.add(x.name); });
  if ((n.type === "FunctionDeclaration" || n.type === "FunctionExpression" || n.type === "ArrowFunctionExpression") && n.params) n.params.forEach(pm => walk(pm, x => { if (x.type === "Identifier") declared.add(x.name); }));
  if (n.type === "CatchClause" && n.param) walk(n.param, x => { if (x.type === "Identifier") declared.add(x.name); });
});
const ext = new Map();
walk(ast, (n, p) => { if (n.type !== "Identifier" || !inSpan(n.start)) return;
  if (p && ((p.type === "MemberExpression" && p.property === n && !p.computed) || (p.type === "Property" && p.key === n && !p.computed))) return;
  if (GLOB.has(n.name) || declared.has(n.name)) return;
  ext.set(n.name, (ext.get(n.name) || 0) + 1); });
console.log("Span trovati:", spans.map(x => x.name).join(", "));
console.log("Dipendenze esterne del gruppo:");
[...ext.entries()].sort().forEach(([k, v]) => console.log("  " + k + " x" + v));
