// fix_rfid_tdz.mjs — sposta i useEffect RFID sotto le dichiarazioni di assets/reconListening (v2.86)
import { parse } from "acorn";
import fs from "node:fs";

const die = (m) => { console.error("ABORT: " + m); process.exit(1); };
let src = fs.readFileSync("src/app.js", "utf8");
const sw = fs.readFileSync("public/sw.js", "utf8");
if (!src.includes('const APP_VERSION = "2.85";')) die("APP_VERSION attesa 2.85");
if (!sw.includes("const CACHE_VERSION = 'medtrace-v3-10';")) die("CACHE_VERSION attesa medtrace-v3-10");

const rep1 = (from, to, label) => {
  const n = src.split(from).length - 1;
  if (n !== 1) die(label + ": attese 1 occorrenza, trovate " + n);
  src = src.replace(from, to);
};

const effects = 'React.useEffect(() => { const onScan = (e) => { try { const rows = parseRfidScan(e.detail); if (rows.length) importRfidScan(rows); } catch (err) { } }; window.addEventListener("medtrace-rfid-scan", onScan); return () => window.removeEventListener("medtrace-rfid-scan", onScan); }, [assets]);\nReact.useEffect(() => { if (tab !== "ricognizione" && reconListening) { stopWedge(); setReconListening(false); } }, [tab, reconListening]);\nReact.useEffect(() => () => { stopWedge(); }, []);\n';

// 1) rimuovi gli effect dalla posizione errata (dopo setInstrumentsRegistry)
rep1('React.useEffect(() => { setInstrumentsRegistry(instruments || []); }, [instruments]);\n' + effects,
     'React.useEffect(() => { setInstrumentsRegistry(instruments || []); }, [instruments]);\n',
     "rimozione effects");

// 2) reinserisci prima dei handler recon (assets, tab, reconListening già dichiarati)
rep1('const reconToggleListen = () => {',
     effects + 'const reconToggleListen = () => {',
     "inserzione effects");

// 3) bump
rep1('const APP_VERSION = "2.85";', 'const APP_VERSION = "2.86";', "APP_VERSION");
const swOut = sw.replace("const CACHE_VERSION = 'medtrace-v3-10';", "const CACHE_VERSION = 'medtrace-v3-11';");
if (swOut === sw) die("bump CACHE_VERSION fallito");

try { parse(src, { ecmaVersion: "latest", sourceType: "module" }); } catch (e) { die("app.js post-fix non parsa: " + e.message); }
fs.writeFileSync("src/app.js", src);
fs.writeFileSync("public/sw.js", swOut);
console.log("OK: useEffect spostati, v2.86 / medtrace-v3-11");
