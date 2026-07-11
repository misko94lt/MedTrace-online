// i18n_wrap.mjs <file...> — avvolge con t() i literal UI in posizioni sicure (parent-aware)
import { parse } from "acorn";
import fs from "node:fs";
const UI_PROPS = new Set(["label", "placeholder", "title", "subtitle", "msg", "message", "text", "hint", "emptyText", "tooltip", "confirmText", "cancelText", "okText", "header", "description", "name"]);
const MSG_FNS = new Set(["showToast", "alert", "appConfirm", "appPromptCb", "confirm", "prompt", "die"]);
const looksUI = (t) => t.trim().length >= 3 && !/^#|^var\(|^https?:|^data:|^[\d.,]+|^[a-z0-9_\-./:@]+$|^[A-Z0-9_]+$/.test(t.trim()) && (/[àèéìòù]/.test(t) || (/^[A-ZÀÈÌÒÙ]/.test(t) && /[a-z]/.test(t)));
function isCreate(n) { return n && n.type === "CallExpression" && ((n.callee.type === "MemberExpression" && n.callee.property && n.callee.property.name === "createElement") || (n.callee.type === "Identifier" && n.callee.name === "h")); }
for (const file of process.argv.slice(2)) {
  let src = fs.readFileSync(file, "utf8");
  const already = src.includes('from "../constants/i18n.js"');
  const ast = parse(src, { ecmaVersion: "latest", sourceType: "module" });
  const chain = [];
  const targets = []; const strings = new Set();
  (function walk(n) {
    if (!n || typeof n.type !== "string") return;
    chain.push(n);
    if (n.type === "Literal" && typeof n.value === "string" && looksUI(n.value)) {
      let ok = false;
      for (let i = chain.length - 2; i >= 0 && !ok; i--) {
        const p = chain[i]; const child = chain[i + 1];
        if (p.type === "BinaryExpression" || p.type === "SwitchCase" || p.type === "ImportDeclaration") break;
        if (p.type === "Property") { if (p.key === child && !p.computed) break; if (UI_PROPS.has(p.key && p.key.name)) { ok = true; break; } break; }
        if (isCreate(p)) { const idx = p.arguments.indexOf(child); if (idx >= 2) ok = true; break; }
        if (p.type === "CallExpression") { const cn = p.callee.name || (p.callee.property && p.callee.property.name); if (cn === "__t") break; if (MSG_FNS.has(cn)) ok = true; break; }
        if (p.type === "ConditionalExpression" || p.type === "LogicalExpression" || p.type === "SequenceExpression") continue;
        break;
      }
      if (ok) { targets.push({ start: n.start, end: n.end }); strings.add(n.value); }
    }
    for (const k of Object.keys(n)) { if (k === "loc") continue; const v = n[k]; if (Array.isArray(v)) v.forEach(c => c && typeof c.type === "string" && walk(c)); else if (v && typeof v.type === "string") walk(v); }
    chain.pop();
  })(ast);
  targets.sort((a, b) => b.start - a.start);
  for (const tg of targets) src = src.slice(0, tg.start) + "__t(" + src.slice(tg.start, tg.end) + ")" + src.slice(tg.end);
  const rel = file.startsWith("src/lib/") || file.startsWith("src/constants/") ? "./i18n.js" : "../constants/i18n.js";
  const imp = file.startsWith("src/lib/") ? 'import { t as __t } from "../constants/i18n.js";\n' : 'import { t as __t } from "' + rel + '";\n';
  if (!already) src = imp + src;
  try { parse(src, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { console.error(file + " NON PARSA: " + e.message); process.exit(1); }
  fs.writeFileSync(file, src);
  console.log(file + ": " + targets.length + " avvolti, " + strings.size + " stringhe uniche");
  fs.appendFileSync("/tmp/i18n_todo.txt", [...strings].map(s => JSON.stringify(s)).join("\n") + "\n");
}
