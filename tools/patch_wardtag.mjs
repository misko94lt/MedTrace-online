// patch_wardtag.mjs — v2.88: tag-reparto + mancanti del reparto
import { parse } from "acorn";
import fs from "node:fs";

const die = (m) => { console.error("ABORT: " + m); process.exit(1); };
let src = fs.readFileSync("src/app.js", "utf8");
const sw = fs.readFileSync("public/sw.js", "utf8");
if (!src.includes('const APP_VERSION = "2.87";')) die("APP_VERSION attesa 2.87");
if (!sw.includes("const CACHE_VERSION = 'medtrace-v3-12';")) die("CACHE_VERSION attesa medtrace-v3-12");

const rep1 = (from, to, label) => {
  const n = src.split(from).length - 1;
  if (n !== 1) die(label + ": attese 1 occorrenza, trovate " + n);
  src = src.replace(from, to);
};

// 1) import helper
rep1('import { startWedge, stopWedge } from "./lib/rfid.js";',
     'import { startWedge, stopWedge, isWardTag, WARD_TAG_BRAND } from "./lib/rfid.js";',
     "import helper");

// 2) wedge live: tag-reparto imposta subito il reparto
rep1('const ok = startWedge((epc, n) => { setReconLive(n); setReconLastEpc(epc); });',
     'const ok = startWedge((epc, n) => { setReconLive(n); setReconLastEpc(epc); const hit = (assets || []).find(x => isWardTag(x) && String(x.epc || "").trim().toUpperCase() === epc); if (hit) { setReconWard(hit.name || ""); showToast("Reparto: " + (hit.name || "")); } });',
     "wedge ward");

// 3) handler creazione tag-reparto (prima di reconScan)
const handler = `const reconAssignWard = (name) => {
const epc = assocEpc;
const nm = String(name || "").trim();
if (!epc || !nm) return;
if (checkLocked()) return;
const clash = (assets || []).find(x => String(x.epc || "").trim().toUpperCase() === epc);
if (clash) { showToast("EPC gi\\u00e0 associato a: " + (clash.name || clash.assetCode || clash.id), "#ef4444"); return; }
const nuovo = withCreateMeta({ name: nm, brand: WARD_TAG_BRAND, epc: epc });
if (!nuovo.assetCode) nuovo.assetCode = nextAssetCode(customerPrefix(null), assets);
setAssets(prev => prev.concat([nuovo]));
setReconWard(nm);
setReconResult(prev => prev ? Object.assign(Object.assign({}, prev), { unknown: prev.unknown.filter(e => e !== epc) }) : prev);
setAssocEpc(null);
showToast("Tag-reparto creato: " + nm);
};
const reconScan = () => {`;
rep1("const reconScan = () => {", handler, "handler ward");

// 4) reconScan: separa i ward-tag dal match
rep1("const found = []; const unknown = []; uniq.forEach(e => { if (byEpc[e]) found.push(byEpc[e]); else unknown.push(e); });",
     'const found = []; const unknown = []; let wardFromTag = ""; uniq.forEach(e => { const a = byEpc[e]; if (a && isWardTag(a)) { if (!wardFromTag) wardFromTag = a.name || ""; } else if (a) found.push(a); else unknown.push(e); });',
     "match ward-tag");

// 5) reconScan: il tag vince sul campo manuale
rep1('const ward = String(reconWard || "").trim();',
     'const ward = String(wardFromTag || reconWard || "").trim(); if (wardFromTag && wardFromTag !== reconWard) { setReconWard(wardFromTag); showToast("Reparto da tag: " + wardFromTag); }',
     "ward precedence");

// 6) reconScan: mancanti del reparto + campo nel risultato
rep1('setReconResult({ when: nowIso, scanned: uniq.length, found: enr, unknown: unknown, applied: (ward && found.length) ? ward : "" });',
     'let missing = []; if (ward) { const fid = {}; found.forEach(a => { fid[a.id] = true; }); missing = (assets || []).filter(a => !fid[a.id] && !isWardTag(a) && (String(a.lastLocation || "") === ward || (!a.lastLocation && String(a.location || "") === ward))); } setReconResult({ when: nowIso, scanned: uniq.length, found: enr, unknown: unknown, missing: missing, applied: (ward && found.length) ? ward : "" });',
     "missing");

// 7) render: sezione NON TROVATI prima del blocco sconosciuti
rep1('reconResult.unknown.length > 0 && React.createElement("div", { style: { marginTop: 10, padding: "10px 12px", background: "var(--bg)", border: "1px dashed #f59e0b44", borderRadius: 8 } },',
     'reconResult.missing && reconResult.missing.length > 0 && React.createElement("div", { style: { marginTop: 10, padding: "10px 12px", background: "var(--bg)", border: "1px dashed #ef444455", borderRadius: 8 } },\nReact.createElement("div", { style: { fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 2 } }, "NON TROVATI QUI (" + reconResult.missing.length + ")"),\nReact.createElement("div", { style: { fontSize: 10, color: "var(--text-4)", marginBottom: 6 } }, "Risultavano in questo reparto e non sono stati letti nel giro."),\nReact.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 4 } }, reconResult.missing.map(a => React.createElement("div", { key: a.id, onClick: () => openAsset(a.id), style: { display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 6, cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } },\nReact.createElement("div", { style: { flex: 1, minWidth: 0 } },\nReact.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, a.name || a.assetCode || a.id),\nReact.createElement("div", { style: { fontSize: 10.5, color: "var(--text-3)" } }, a.lastLocationDate ? ("ultima lettura: " + fmtDateTimeIt(a.lastLocationDate)) : "mai letto")),\nReact.createElement("span", { style: { color: "var(--text-4)", fontSize: 16 } }, "\\u203a"))))),\nreconResult.unknown.length > 0 && React.createElement("div", { style: { marginTop: 10, padding: "10px 12px", background: "var(--bg)", border: "1px dashed #f59e0b44", borderRadius: 8 } },',
     "render missing");

// 8) picker: props tag-reparto
rep1('React.createElement(RfidAssocPicker, { epc: assocEpc, assets: assets, onAssign: reconAssign, onClose: () => setAssocEpc(null) }),',
     'React.createElement(RfidAssocPicker, { epc: assocEpc, assets: assets, onAssign: reconAssign, onClose: () => setAssocEpc(null), wards: reconWards, onAssignWard: reconAssignWard }),',
     "picker props");

// 9) guida
rep1("4) i tag SCONOSCIUTI si associano al volo: tocca l'EPC e scegli l'apparecchio.\",",
     "4) i tag SCONOSCIUTI si associano al volo: tocca l'EPC e scegli l'apparecchio, oppure segnalo come TAG-REPARTO: attaccalo alla porta e da quel momento scansionarlo imposter\u00e0 il reparto da solo; 5) sotto i trovati compaiono i NON TROVATI: risultavano nel reparto e non sono stati letti.\",",
     "guida");

// 10) bump
rep1('const APP_VERSION = "2.87";', 'const APP_VERSION = "2.88";', "APP_VERSION");
const swOut = sw.replace("const CACHE_VERSION = 'medtrace-v3-12';", "const CACHE_VERSION = 'medtrace-v3-13';");
if (swOut === sw) die("bump CACHE_VERSION fallito");

try { parse(src, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die("app.js post-patch non parsa: " + e.message); }
fs.writeFileSync("src/app.js", src);
fs.writeFileSync("public/sw.js", swOut);
console.log("OK: tag-reparto + mancanti, v2.88 / medtrace-v3-13");
