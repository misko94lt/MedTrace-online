// i18n_extract.mjs — inventario dei literal UI italiani per modulo (giro 1 i18n)
import { parse } from "acorn";
import fs from "node:fs";
import path from "node:path";
const files = [];
(function scan(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) scan(p); else if (e.name.endsWith(".js")) files.push(p); } })("src");
const IT_WORDS = /\b(Salva|Annulla|Chiudi|Elimina|Nuov[oa]|Modifica|Cerca|Aggiungi|Data|Nome|Note|Firma|Cliente|Clienti|Apparecchi|Verifica|Verifiche|Scadenz|Intervent|Preventiv|Fattur|Ricambi|Strument|Tecnico|Reparto|Stato|Tipo|Numero|Import|Esport|Guida|Impostazioni|obbligatori|Nessun|Tutti|Carica|Invia|Conferma|Attenzione|Errore|Seleziona|Inserisci|del|della|di|per|con|non)\b/;
const looksCode = (s) => /^#[0-9a-fA-F]{3,8}$|^var\(|^https?:|^data:|^[\d.,]+(px|rem|em|%|s|ms)?$|^[a-z0-9_\-./:@]+$|^[A-Z0-9_]+$|^\s*$/.test(s);
function walk(n, fn) { if (!n || typeof n.type !== "string") return; fn(n); for (const k of Object.keys(n)) { if (k === "loc") continue; const v = n[k]; if (Array.isArray(v)) v.forEach(c => c && typeof c.type === "string" && walk(c, fn)); else if (v && typeof v.type === "string") walk(v, fn); } }
const perFile = {}; const all = new Set();
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  let ast; try { ast = parse(src, { ecmaVersion: "latest", sourceType: "module" }); } catch { continue; }
  const found = new Set();
  walk(ast, (n) => {
    let s = null;
    if (n.type === "Literal" && typeof n.value === "string") s = n.value;
    if (n.type === "TemplateElement" && n.value && typeof n.value.cooked === "string") s = n.value.cooked;
    if (s === null) return;
    const t = s.trim();
    if (t.length < 2 || looksCode(t)) return;
    const hasAccent = /[àèéìòùÀÈÉÌÒÙ]/.test(t);
    const capSpace = /[A-ZÀÈÌ].*\s/.test(t) || /\s.*[a-z]/.test(t) && /^[A-ZÀÈÌ]/.test(t);
    const capStart = /^[A-ZÀÈÌÒÙ]/.test(t) && /[a-zàèéìòù]/.test(t) && (t.includes(" ") || t.length <= 25);
    if (hasAccent || capStart || (t.includes(" ") && IT_WORDS.test(t))) { found.add(t); all.add(t); }
  });
  if (found.size) perFile[f] = found.size;
}
const rows = Object.entries(perFile).sort((a, b) => b[1] - a[1]);
for (const [f, n] of rows) console.log(String(n).padStart(5), f.replace("src/", ""));
console.log("TOTALE stringhe UI uniche (app intera):", all.size);
fs.writeFileSync("/tmp/i18n_inventory.json", JSON.stringify([...all].sort(), null, 1));
console.log("Inventario completo scritto in /tmp/i18n_inventory.json");
