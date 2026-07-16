// patch_rfid.mjs — scan-mode RFID v2.85: wiring del modulo rfid.js nella pagina ricognizione
import { parse } from "acorn";
import fs from "node:fs";

const die = (m) => { console.error("ABORT: " + m); process.exit(1); };
let src = fs.readFileSync("src/app.js", "utf8");
const sw = fs.readFileSync("public/sw.js", "utf8");
if (!src.includes('const APP_VERSION = "2.84";')) die("APP_VERSION attesa 2.84");
if (!sw.includes("const CACHE_VERSION = 'medtrace-v3-9';")) die("CACHE_VERSION attesa medtrace-v3-9");

const rep1 = (from, to, label) => {
  const n = src.split(from).length - 1;
  if (n !== 1) die(label + ": attese 1 occorrenza, trovate " + n);
  src = src.replace(from, to);
};

// 1) import
rep1(' } from "./lib/sync.js";\n',
     ' } from "./lib/sync.js";\nimport { startWedge, stopWedge } from "./lib/rfid.js";\nimport { RfidAssocPicker } from "./components/rfid.js";\n',
     "import rfid");

// 2) state recon aggiuntivi
rep1('const [reconResult, setReconResult] = React.useState(null);\n',
     'const [reconResult, setReconResult] = React.useState(null);\nconst [reconListening, setReconListening] = React.useState(false);\nconst [reconLive, setReconLive] = React.useState(0);\nconst [reconLastEpc, setReconLastEpc] = React.useState("");\nconst [assocEpc, setAssocEpc] = React.useState(null);\n',
     "state recon");

// 3) handler prima di reconScan
const handlers = `const reconToggleListen = () => {
if (reconListening) {
const scan = stopWedge();
setReconListening(false);
if (scan && scan.epcs.length)
setReconInput(prev => { const cur = String(prev || "").trim(); return (cur ? cur + "\\n" : "") + scan.epcs.join("\\n"); });
return;
}
setReconLive(0); setReconLastEpc("");
const ok = startWedge((epc, n) => { setReconLive(n); setReconLastEpc(epc); });
if (ok) { setReconListening(true); showToast("Ascolto attivo: spara col lettore (o digita EPC + Invio)"); }
};
const reconAssign = (a) => {
const epc = assocEpc;
if (!epc || !a) return;
if (checkLocked()) return;
const dup = (assets || []).find(x => x.id !== a.id && String(x.epc || "").trim().toUpperCase() === epc);
if (dup) { showToast("Tag gi\\u00e0 associato a: " + (dup.name || dup.assetCode || dup.id), "#ef4444"); return; }
if (a.epc && String(a.epc).trim().toUpperCase() !== epc && !window.confirm("Ha gi\\u00e0 il tag " + a.epc + ". Sostituire?")) return;
const ward = (reconResult && reconResult.applied) ? reconResult.applied : "";
const nowIso = new Date().toISOString();
const upd = ward ? { epc: epc, lastLocation: ward, lastLocationDate: nowIso } : { epc: epc };
setAssets(prev => prev.map(x => x.id === a.id ? withUpdateMeta(Object.assign(Object.assign({}, x), upd)) : x));
setReconResult(prev => {
if (!prev) return prev;
const aa = Object.assign(Object.assign({}, a), upd);
let days = null, status = "ok";
if (aa.nextService) { const ns = new Date(aa.nextService); if (!isNaN(ns.getTime())) { days = Math.round((ns.getTime() - Date.now()) / 86400000); status = days < 0 ? "scaduta" : (days <= 30 ? "scadenza" : "ok"); } }
return Object.assign(Object.assign({}, prev), { unknown: prev.unknown.filter(e => e !== epc), found: prev.found.concat([{ asset: aa, days: days, status: status }]) });
});
setAssocEpc(null);
showToast("Tag associato: " + (a.name || a.assetCode || a.id));
};
const reconScan = () => {`;
rep1("const reconScan = () => {", handlers, "handler recon");

// 4) useEffect: wiring evento bridge + stop su cambio tab + cleanup unmount
rep1("React.useEffect(() => { setInstrumentsRegistry(instruments || []); }, [instruments]);\n",
     'React.useEffect(() => { setInstrumentsRegistry(instruments || []); }, [instruments]);\nReact.useEffect(() => { const onScan = (e) => { try { const rows = parseRfidScan(e.detail); if (rows.length) importRfidScan(rows); } catch (err) { } }; window.addEventListener("medtrace-rfid-scan", onScan); return () => window.removeEventListener("medtrace-rfid-scan", onScan); }, [assets]);\nReact.useEffect(() => { if (tab !== "ricognizione" && reconListening) { stopWedge(); setReconListening(false); } }, [tab, reconListening]);\nReact.useEffect(() => () => { stopWedge(); }, []);\n',
     "useEffect wiring");

// 5) UI: toggle ascolto accanto a Simula scansione
rep1('React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", fontWeight: 700 } }, "EPC SCANSIONATI"),\nReact.createElement("button", { onClick: reconSimulate, style: { background: "transparent", border: "1px solid var(--border)", borderRadius: 6, color: "#2dd4bf", padding: "3px 8px", fontSize: 10.5, cursor: "pointer", fontWeight: 700 } }, "Simula scansione")),',
     'React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", fontWeight: 700 } }, "EPC SCANSIONATI"),\nReact.createElement("div", { style: { display: "flex", gap: 6 } },\nReact.createElement("button", { onClick: reconToggleListen, style: { background: reconListening ? "#2dd4bf" : "transparent", border: "1px solid " + (reconListening ? "#2dd4bf" : "var(--border)"), borderRadius: 6, color: reconListening ? "#04201c" : "#2dd4bf", padding: "3px 8px", fontSize: 10.5, cursor: "pointer", fontWeight: 700 } }, reconListening ? ("\\u25a0 Termina (" + reconLive + ")") : "\\u25b6 Ascolto lettore"),\nReact.createElement("button", { onClick: reconSimulate, style: { background: "transparent", border: "1px solid var(--border)", borderRadius: 6, color: "#2dd4bf", padding: "3px 8px", fontSize: 10.5, cursor: "pointer", fontWeight: 700 } }, "Simula scansione"))),',
     "toggle ascolto");

// 6) UI: riga live prima della textarea
rep1('React.createElement("textarea", { value: reconInput,',
     'reconListening && React.createElement("div", { style: { fontSize: 11, color: "#2dd4bf", fontWeight: 700, marginBottom: 6, fontFamily: "\'IBM Plex Mono\', monospace" } }, "\\u25cf " + reconLive + " tag letti" + (reconLastEpc ? (" \\u00b7 ultimo: " + reconLastEpc) : "") + " \\u2014 tocca Termina per riversarli"),\nReact.createElement("textarea", { value: reconInput,',
     "riga live");

// 7) UI: chip cliccabili per gli sconosciuti + picker
rep1('React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", fontFamily: "\'IBM Plex Mono\', monospace", wordBreak: "break-all" } }, reconResult.unknown.join("  ")),',
     'React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, reconResult.unknown.map(e => React.createElement("span", { key: e, onClick: () => setAssocEpc(assocEpc === e ? null : e), style: { fontSize: 11, fontFamily: "\'IBM Plex Mono\', monospace", color: assocEpc === e ? "#04201c" : "var(--text-2)", background: assocEpc === e ? "#f59e0b" : "var(--surface)", border: "1px solid " + (assocEpc === e ? "#f59e0b" : "var(--border)"), borderRadius: 6, padding: "4px 8px", cursor: "pointer", wordBreak: "break-all", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } }, e))),\nassocEpc && reconResult.unknown.indexOf(assocEpc) !== -1 && React.createElement(RfidAssocPicker, { epc: assocEpc, assets: assets, onAssign: reconAssign, onClose: () => setAssocEpc(null) }),',
     "chip sconosciuti");

// 8) nota sotto gli sconosciuti
rep1('"Tag non associati a nessun apparecchio. Associali dalla scheda (campo EPC)."',
     '"Tag non associati. Tocca un EPC per associarlo a un apparecchio."',
     "nota sconosciuti");

// 9) guida aggiornata
rep1("\"Come si usa: 1) scegli il REPARTO dal menu a tendina (es. Cardiologia); 2) premi 'Scansiona' col lettore RFID collegato, oppure 'Simula scansione' per provare senza hardware; 3) compare la lista degli apparecchi TROVATI, con le verifiche scadute o in scadenza evidenziate in rosso/ambra.\",",
     "\"Come si usa: 1) scegli il REPARTO dal menu a tendina (es. Cardiologia); 2) attiva 'Ascolto lettore' e spara col grilletto (il lettore Bluetooth in modalit\\u00e0 tastiera/HID digita gli EPC da solo), oppure incolla gli EPC o usa 'Simula scansione' senza hardware, poi premi 'Scansiona'; 3) compare la lista degli apparecchi TROVATI, con le verifiche scadute o in scadenza evidenziate in rosso/ambra; 4) i tag SCONOSCIUTI si associano al volo: tocca l'EPC e scegli l'apparecchio.\",",
     "guida");

// 10) bump versioni
rep1('const APP_VERSION = "2.84";', 'const APP_VERSION = "2.85";', "APP_VERSION");
const swOut = sw.replace("const CACHE_VERSION = 'medtrace-v3-9';", "const CACHE_VERSION = 'medtrace-v3-10';");
if (swOut === sw) die("bump CACHE_VERSION fallito");

// post-assert: parse
try { parse(src, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die("app.js post-patch non parsa: " + e.message); }

fs.writeFileSync("src/app.js", src);
fs.writeFileSync("public/sw.js", swOut);
console.log("OK: patch RFID applicata, v2.85 / medtrace-v3-10");
