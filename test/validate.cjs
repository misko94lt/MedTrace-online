/* Smoke test MedTrace (ricreato — il vecchio /home/claude/test_wizards.js è andato col container).
   1) Valida la struttura di FUNC_TEMPLATES (sezioni con misure => nota presente, limiti numerici sani)
   2) Esegue FuncWizard / IecWizard / PpmWizard passo per passo con React finto
      (la 2ª useState di ogni wizard è lo step — pattern collaudato)
   Uso: node test/validate.js   (dalla root del progetto) */
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "src", "app.js");
let src = fs.readFileSync(SRC, "utf8").replace(/^import\s[^\n]*\n/gm, "");
const constsDir = path.join(__dirname, "..", "src", "constants");
const CONSTS = fs.readdirSync(constsDir).filter(f => f.endsWith(".js")).sort().map(f => fs.readFileSync(path.join(constsDir, f), "utf8").replace(/^import\s[^\n]*\n/gm, "").replace(/^export /gm, "")).join("\n");
src = CONSTS + "\n" + src;

/* ---------- ambiente finto ---------- */
const noop = () => {};
const chain = new Proxy(function () {}, {
  get: (t, p) => (p === "then" ? undefined : chain),
  apply: () => chain,
});
const el = () => ({ style: {}, setAttribute: noop, addEventListener: noop, removeEventListener: noop, appendChild: noop, focus: noop, classList: { add: noop, remove: noop, toggle: noop }, getContext: () => null });
const storage = { getItem: () => null, setItem: noop, removeItem: noop, clear: noop };
const fakeWindow = {
  supabase: { createClient: () => chain },
  localStorage: storage, sessionStorage: storage,
  addEventListener: noop, removeEventListener: noop,
  matchMedia: () => ({ matches: false, addEventListener: noop, addListener: noop }),
  location: { href: "http://localhost/", hostname: "localhost", origin: "http://localhost", search: "", hash: "" },
  navigator: { userAgent: "smoke", onLine: true },
  setTimeout, clearTimeout, setInterval: () => 0, clearInterval: noop,
  alert: noop, confirm: () => false, open: noop,
};
const fakeDocument = {
  getElementById: () => el(), createElement: () => el(),
  querySelector: () => null, querySelectorAll: () => [],
  addEventListener: noop, removeEventListener: noop,
  body: el(), documentElement: el(), visibilityState: "visible", title: "",
};

/* ---------- React finto con controllo dello step ---------- */
let CALL = 0;
let CURRENT_STEP = 0;
const mockReact = {
  createElement: (type, props, ...children) => ({ type, props: props || {}, children }),
  Fragment: "Fragment",
  useState: (init) => {
    CALL++;
    if (CALL === 2) return [CURRENT_STEP, noop]; // 2ª useState = step del wizard
    const v = typeof init === "function" ? init() : init;
    return [v, noop];
  },
  useEffect: noop, useLayoutEffect: noop,
  useMemo: (f) => f(), useCallback: (f) => f,
  useRef: (v) => ({ current: v === undefined ? null : v }),
  useContext: () => ({}), createContext: () => ({ Provider: "Provider", Consumer: "Consumer" }),
  useReducer: (r, i) => [i, noop], useId: () => "id",
  memo: (c) => c, forwardRef: (c) => c,
  Component: class Component { constructor(p){ this.props = p; this.state = {}; } setState(){} render(){ return null; } },
  PureComponent: class PureComponent { constructor(p){ this.props = p; this.state = {}; } setState(){} render(){ return null; } },
};

/* ---------- carico app.js in scope con i mock (senza mount finale) ---------- */
const mountIdx = src.lastIndexOf("ReactDOM.createRoot");
if (mountIdx < 0) { console.error("Mount finale non trovato — file cambiato?"); process.exit(1); }
const body =
  src.slice(0, mountIdx) +
  "\n;return { FuncWizard: typeof FuncWizard!=='undefined'&&FuncWizard, IecWizard: typeof IecWizard!=='undefined'&&IecWizard, PpmWizard: typeof PpmWizard!=='undefined'&&PpmWizard, FUNC_TEMPLATES: typeof FUNC_TEMPLATES!=='undefined'&&FUNC_TEMPLATES };";

let mod;
try {
  const factory = new Function("React", "ReactDOM", "window", "document", "localStorage", "sessionStorage", "navigator", "location", body);
  mod = factory(mockReact, { createRoot: () => ({ render: noop }) }, fakeWindow, fakeDocument, storage, storage, fakeWindow.navigator, fakeWindow.location);
} catch (e) {
  console.error("CARICAMENTO FALLITO:", e.message);
  console.error(String(e.stack || "").split("\n").slice(0, 4).join("\n"));
  process.exit(1);
}

let failures = 0;

/* ---------- 1) validazione FUNC_TEMPLATES ---------- */
const T = mod.FUNC_TEMPLATES;
if (!T) { console.error("✗ FUNC_TEMPLATES non estratto"); failures++; }
else {
  const ids = Object.keys(T);
  let noNote = 0, badLimit = 0, measures = 0;
  for (const id of ids) {
    for (const s of T[id].sections || []) {
      const ms = s.measures || [];
      if (ms.length > 0 && !s.note) noNote++;
      for (const m of ms) {
        measures++;
        for (const k of ["min", "max", "limit"]) {
          if (m[k] !== undefined && m[k] !== null && m[k] !== "" && isNaN(Number(m[k]))) badLimit++;
        }
      }
    }
  }
  console.log(`Templates: ${ids.length} | misure totali: ${measures} | sezioni con misure senza nota: ${noNote} | limiti non numerici: ${badLimit}`);
  if (noNote > 0 || badLimit > 0) failures++;
}

/* ---------- 2) smoke dei 3 wizard, passo per passo ---------- */
const props = {
  initial: null, assetId: null,
  assets: [], customers: [], technicians: [], existingReports: [],
  funcReports: [], iecReports: [], ppmReports: [],
  onSave: noop, onClose: noop, onDone: noop, onLink: noop, onPdf: noop,
  showToast: noop, setModal: noop, pushModal: noop, popModal: noop,
};
const MAX_STEP = 7;
for (const name of ["FuncWizard", "IecWizard", "PpmWizard"]) {
  const W = mod[name];
  if (!W) { console.log(`⚠ ${name}: estratto in modulo → render testato in test/wizard_check.js`); continue; }
  const errs = [];
  for (let step = 0; step <= MAX_STEP; step++) {
    CALL = 0; CURRENT_STEP = step;
    try { W({ ...props }); }
    catch (e) { errs.push(`step ${step}: ${e.message}`); }
  }
  if (errs.length) { console.error(`✗ ${name}: ${errs.length} errori → ${errs.slice(0, 2).join(" | ")}`); failures++; }
  else console.log(`✓ ${name}: step 0–${MAX_STEP} OK`);
}

console.log(failures === 0 ? "\nSMOKE TEST: TUTTO OK" : `\nSMOKE TEST: ${failures} PROBLEMI`);
process.exit(failures === 0 ? 0 : 1);
