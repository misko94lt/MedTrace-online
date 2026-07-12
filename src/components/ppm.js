/* MedTrace — PPM: wizard completo (funzionale+VSE), checklist programmata, pagina elenco (estratti da app.js, v2.97) */
import { Inp, Grid, AssetCombobox, SignaturePad, TechSignatureField, EmptyState } from "./ui.js";
import { TecnicoPicker, Btn, techSignature } from "./shared.js";
import { cndToTemplate, guessTemplate, FUNC_TEMPLATES } from "../constants/funcTemplates.js";
import { getNextReportNumber, iecGetMeasures } from "../lib/reports.js";
export const PPM_CHECKLISTS_DEFAULT = {
pompa_infusionale: { label: "Pompa d'infusione / siringa", items: [
"Pulizia esterna e disinfezione delle superfici",
"Pulizia sensori (aria, pressione, occlusione)",
"Controllo/pulizia meccanismo peristaltico / sede e fissaggio siringa",
"Controllo sportello, ganci e guarnizioni di tenuta",
"Controllo integrità cavo di alimentazione, spina e connettori",
"Sostituzione batteria a fine vita (verifica età/autonomia)",
] },
ventilatore: { label: "Ventilatore polmonare", items: [
"Pulizia esterna e disinfezione delle superfici",
"Sostituzione / pulizia filtri (paziente, raffreddamento, antibatterici)",
"Pulizia sensori di flusso e di ossigeno; sostituzione cella O2 a fine vita",
"Controllo/pulizia valvole espiratorie e circuito paziente",
"Controllo cavo alimentazione e collegamenti gas",
"Sostituzione batteria a fine vita",
] },
defibrillatore: { label: "Defibrillatore", items: [
"Pulizia esterna e disinfezione delle superfici",
"Controllo piastre / connettori elettrodi e cavi",
"Sostituzione/controllo batteria (stato e scadenza)",
"Controllo integrità cavo alimentazione e caricabatteria",
"Sostituzione consumabili scaduti o esauriti (elettrodi, carta, gel)",
] },
dae: { label: "DAE — defibrillatore semiautomatico", items: [
"Pulizia esterna e disinfezione delle superfici",
"Sostituzione/controllo batteria (stato e scadenza)",
"Sostituzione/controllo piastre/elettrodi (scadenza e integrità)",
] },
elettrobisturi: { label: "Elettrobisturi / Unità HF", items: [
"Pulizia esterna e disinfezione delle superfici",
"Controllo cavi, manipoli e pedaliera; sostituzione se danneggiati",
"Pulizia griglie e controllo ventole di raffreddamento",
"Controllo integrità cavo alimentazione e connettori",
] },
monitor_multipar: { label: "Monitor multiparametrico", items: [
"Pulizia esterna e disinfezione delle superfici",
"Controllo cavi paziente, sensori e connettori; sostituzione se usurati",
"Sostituzione batteria a fine vita",
"Pulizia ventole / griglie di aerazione",
"Controllo integrità cavo alimentazione",
] },
aspiratore_chirurgico: { label: "Aspiratore chirurgico", items: [
"Pulizia esterna e disinfezione delle superfici",
"Sostituzione filtro antibatterico/antivirale (e ad ogni contatto con liquidi)",
"Controllo/sostituzione vaso di raccolta, tubi e guarnizioni",
"Controllo integrità cavo alimentazione",
] },
generico: { label: "Generico", items: [
"Pulizia esterna e disinfezione delle superfici",
"Controllo integrità cavo alimentazione, spina e connettori",
"Sostituzione batteria a fine vita (se presente)",
"Controllo accessori ed etichette; sostituzione parti di usura",
] },
bbraun_infusomat_space_tsc: { label: "Pompa infusione B.Braun Infusomat Space", items: [
"Pulizia esterna e disinfezione (Meliseptol); controllo sportello, guida linea e morsetti",
"Pulizia sensori (aria, pressione, occlusione)",
"Controllo/pulizia dita peristaltiche / membrana di pompaggio",
"Sostituzione batteria (Battery-Pack SP) a fine vita; verifica età/autonomia",
] },
audiometro: { label: "Audiometro", items: [
"Pulizia esterna, cuscinetti cuffie e archetto",
"Controllo cavi cuffie/auricolari e pulsante risposta paziente",
"Sostituzione cuscinetti auricolari usurati",
"Controllo integrità cavo alimentazione",
] },
spirometro: { label: "Spirometro", items: [
"Pulizia esterna e disinfezione",
"Pulizia/sostituzione boccagli e filtri antibatterici",
"Controllo trasduttore di flusso (turbina/PNT) e tubo",
] },
frigoemoteca: { label: "Frigoemoteca / frigo farmaci", items: [
"Pulizia esterna/interna; controllo e sostituzione guarnizioni porta usurate",
"Pulizia condensatore/filtro e griglie di ventilazione",
"Controllo registratore/datalogger; sostituzione batteria di backup allarme a fine vita",
] },
bilancia: { label: "Bilancia pesapersone / pesaneonati", items: [
"Pulizia piatto e struttura",
"Controllo stabilità, livella e piedini",
"Sostituzione batteria a fine vita",
] },
concentratore_ossigeno: { label: "Concentratore di ossigeno", items: [
"Pulizia esterna; pulizia/sostituzione filtro aria di ingresso",
"Sostituzione filtri prodotto/HEPA secondo costruttore",
"Controllo/sostituzione umidificatore e tenute",
] },
eeg: { label: "Elettroencefalografo (EEG)", items: [
"Pulizia esterna; pulizia elettrodi, cuffia e cavi",
"Sostituzione elettrodi/cuffia usurati",
"Controllo connettori e integrità cavi",
] },
dialisi: { label: "Apparecchio per emodialisi", items: [
"Pulizia esterna e disinfezione del percorso idraulico (cicli di disinfezione)",
"Sostituzione filtri (ingresso acqua, dializzato), guarnizioni e O-ring",
"Controllo/sostituzione parti di usura delle pompe (sangue, UF)",
] },
capnografo: { label: "Capnografo / monitor gas respiratori", items: [
"Pulizia esterna; sostituzione water trap e linea di campionamento",
"Pulizia cella di misura e cuvetta",
"Controllo/sostituzione parti di usura della pompa di aspirazione",
] },
tavolo_operatorio: { label: "Tavolo operatorio", items: [
"Pulizia/disinfezione superfici e materassini; sostituzione cuscini usurati",
"Lubrificazione snodi e controllo attuatori idraulici/elettrici",
"Controllo blocchi/freni e stabilità",
"Sostituzione batteria telecomando a fine vita",
] },
culla_termica: { label: "Culla termica / radiant warmer", items: [
"Pulizia/disinfezione superfici e sonde",
"Controllo sonda cute e cavo; sostituzione se danneggiati",
"Pulizia e controllo riscaldatore radiante",
] },
holter_ecg: { label: "Holter ECG", items: [
"Pulizia esterna; controllo/sostituzione cavi paziente",
"Controllo vano batteria e contatti; sostituzione batteria",
"Pulizia contatti caricabatteria (se presente)",
] },
riunito_odontoiatrico: { label: "Riunito odontoiatrico", items: [
"Pulizia/disinfezione riunito e sputacchiera; cicli di disinfezione condotte idriche",
"Sostituzione filtri (aspirazione, aria/acqua), guarnizioni e O-ring dei manipoli",
"Lubrificazione/manutenzione manipoli secondo costruttore",
"Controllo poltrona (snodi, freni); lubrificazione",
] },
elettrocardiografo: { label: "Elettrocardiografo (ECG)", items: [
"Pulizia esterna; controllo/sostituzione cavo paziente ed elettrodi",
"Sostituzione carta stampante; pulizia testina e rullo",
"Sostituzione batteria a fine vita",
] },
sfigmomanometro: { label: "Sfigmomanometro automatico (NIBP)", items: [
"Pulizia esterna; controllo bracciali, tubi e raccordi",
"Sostituzione bracciali e tubi usurati",
"Sostituzione batteria a fine vita",
] },
termometro_clinico: { label: "Termometro clinico elettronico", items: [
"Pulizia/disinfezione sonda e involucro",
"Sostituzione copri-sonda; controllo/sostituzione puntale",
"Sostituzione batteria a fine vita",
] },
incubatrice_neonatale: { label: "Incubatrice neonatale", items: [
"Pulizia/disinfezione cupola, materassino e umidificatore",
"Sostituzione/pulizia filtro aria; sostituzione guarnizioni cupola usurate",
"Controllo e pulizia ventola di circolazione",
] },
lampada_scialitica: { label: "Lampada scialitica", items: [
"Pulizia maniglie sterilizzabili e cupola",
"Controllo snodi/bracci, stabilità e bilanciamento; lubrificazione",
"Sostituzione LED/lampade a fine vita; sostituzione batteria di emergenza",
] },
fototerapia_neonatale: { label: "Lampada fototerapia neonatale", items: [
"Pulizia esterna e superfici",
"Sostituzione sorgenti (LED/tubi) a fine vita; verifica ore di funzionamento",
"Pulizia e controllo ventilazione",
] },
elettrostimolatore: { label: "Elettrostimolatore / TENS", items: [
"Pulizia esterna; controllo cavi ed elettrodi",
"Sostituzione elettrodi/gel usurati",
"Sostituzione batteria a fine vita",
] },
autoclave: { label: "Autoclave / sterilizzatrice a vapore", items: [
"Pulizia camera, guarnizione portello e filtro; controllo tenuta portello",
"Sostituzione guarnizione portello e filtri secondo costruttore",
"Controllo qualità acqua di alimentazione e pulizia serbatoi",
"Nota: convalida prestazionale/biologica del processo = attività specialistica separata",
] },
pulsossimetro: { label: "Pulsossimetro / SpO2", items: [
"Pulizia esterna; controllo/sostituzione sensore e cavo",
"Sostituzione sensori/parti monouso usurati",
"Sostituzione batteria a fine vita",
] },
ecografo: { label: "Ecografo", items: [
"Pulizia/disinfezione sonde e involucro; pulizia/sostituzione filtri di ventilazione",
"Ispezione sonde (lente, cavo, connettore) per crepe/distacchi",
"Pulizia trackball/tastiera; sostituzione batteria/UPS a fine vita",
] },
letto_elettrico: { label: "Letto elettrico / barella motorizzata", items: [
"Pulizia/disinfezione superfici e sponde",
"Controllo attuatori e pulsantiera; lubrificazione snodi",
"Controllo freni, ruote e stabilità",
"Sostituzione batteria di backup a fine vita",
] },
};
export const PPM_CHECKLIST_KEY = "medtrace-ppm-checklists";
export function loadPpmChecklists() {
try { const r = localStorage.getItem(PPM_CHECKLIST_KEY); return r ? JSON.parse(r) : { byCat: {}, byModel: {} }; }
catch (e) { return { byCat: {}, byModel: {} }; }
}
function ppmModelKey(asset) {
const b = ((asset && asset.brand) || "").trim().toLowerCase();
const m = ((asset && asset.model) || "").trim().toLowerCase();
return (b || m) ? (b + "|" + m) : "";
}
function ppmCategoryId(asset) {
return cndToTemplate((asset && asset.cnd) || "") || guessTemplate((asset && asset.name) || "") || "generico";
}
function ppmNorm(s) { return (s == null ? "" : String(s)).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim(); }
const PPM_MODEL_DEFAULTS = [
{ brand: "drager", model: "oxylog 3000", label: "Dräger Oxylog 3000 plus", items: [
"Sostituzione kit manutenzione annuale: cartuccia/filtro presa aria fresca, guarnizioni e O-ring, membrane/valvole di usura (1 anno)",
"Controllo/sostituzione sensore di flusso (1 anno)",
"Controllo cella sensore O2 e sostituzione a fine vita (1 anno / su condizione)",
"Service tecnico completo + ispezione di sicurezza \u2014 kit 2 anni, include il kit annuale (2 anni)",
"Sostituzione batteria interna \u2014 kit 4 anni = kit 2 anni + kit 1 anno + batteria (4 anni)",
"Revisione estesa \u2014 kit manutenzione 6 anni (6 anni)",
"Ciclo kit: dopo il 6\u00b0 anno si riparte da capo (anno 7 = anno 1) (nota)"
] }
];
function ppmModelDefaults(asset) {
var bm = ppmNorm((asset && asset.brand) || "");
var mm = ppmNorm((asset && asset.model) || "") + " " + ppmNorm((asset && asset.name) || "");
for (var i = 0; i < PPM_MODEL_DEFAULTS.length; i++) {
var e = PPM_MODEL_DEFAULTS[i];
var brandOk = !e.brand || bm.indexOf(e.brand) >= 0 || mm.indexOf(e.brand) >= 0;
var modelOk = mm.indexOf(e.model) >= 0;
if (brandOk && modelOk) return e.items;
}
return null;
}
function getPpmChecklist(asset, custom) {
const data = custom || loadPpmChecklists();
const catId = ppmCategoryId(asset);
const out = []; const seen = {};
const push = (txt) => { const t = (txt || "").trim(); if (!t) return; const k = t.toLowerCase(); if (seen[k]) return; seen[k] = 1; out.push(t); };
const catOv = (data.byCat || {})[catId];
const catItems = (catOv && catOv.items) ? catOv.items : (((PPM_CHECKLISTS_DEFAULT[catId] || {}).items) || []);
catItems.forEach(push);
var _mdItems = ppmModelDefaults(asset); if (_mdItems) _mdItems.forEach(push);
const mk = ppmModelKey(asset); const mc = mk ? (data.byModel || {})[mk] : null; if (mc && mc.items) mc.items.forEach(push);
return { categoryId: catId, modelKey: mk, items: out };
}
export function PpmWizardForm({ assetId: propAssetId, assets, customers, templates, existingFunc, existingIec, technicians, instruments, onSaveFull, onClose }) {
const h = React.createElement;
const TEAL = "#2dd4bf", RED = "#ef4444";
const tplFor = (ast) => (cndToTemplate((ast && ast.cnd) || "") || guessTemplate((ast && ast.name) || "") || "generico");
const buildState = (aid) => {
const ast = (assets || []).find(a => a.id === aid);
const tplId = tplFor(ast);
const cl = getPpmChecklist(ast || {});
const norm = (ast && ast.iecNorm) || "62353";
const equipClass = (ast && ast.iecClass) || "I";
const patientType = (ast && ast.patientType) || "BF";
const fixedInstall = !!(ast && ast.fixedInstall);
return {
assetId: aid, templateId: tplId, categoryId: cl.categoryId,
technicianSignature: "", departmentSignature: "",
maint: (cl.items || []).map(t => ({ text: t, status: null, note: "" })),
norm: norm, equipClass: equipClass, patientType: patientType, leakageMethod: "diretto", sfc: true, fixedInstall: fixedInstall,
iecMeasures: iecGetMeasures(norm, equipClass, patientType, "diretto", true, fixedInstall),
funcSections: {},
};
};
const [f, setF] = React.useState(() => Object.assign({ date: new Date().toISOString().slice(0, 10), technician: "", notes: "" }, buildState(propAssetId || "")));
const [step, setStep] = React.useState(0);
const [tutOpen, setTutOpen] = React.useState(false);
const [tplOpen, setTplOpen] = React.useState(false);

const pickAsset = (aid) => { setTplOpen(false); setF(x => Object.assign({}, x, buildState(aid))); };
const pickTpl = (tid) => setF(x => Object.assign({}, x, { templateId: tid, funcSections: {} }));
const regenIec = (patch) => setF(x => {
const nx = Object.assign({}, x, patch);
const fresh = iecGetMeasures(nx.norm, nx.equipClass, nx.patientType, nx.leakageMethod, nx.sfc !== false, nx.fixedInstall);
const merged = fresh.map(mm => { const old = (x.iecMeasures || []).find(o => o.id === mm.id); return old ? Object.assign({}, mm, { value: old.value, na: old.na }) : mm; });
return Object.assign(nx, { iecMeasures: merged });
});
const setMaint = (i, status) => setF(x => Object.assign({}, x, { maint: x.maint.map((it, j) => j === i ? Object.assign({}, it, { status: status }) : it) }));
const setMaintNote = (i, note) => setF(x => Object.assign({}, x, { maint: x.maint.map((it, j) => j === i ? Object.assign({}, it, { note: note }) : it) }));
const setFuncItem = (sid, iid, val) => setF(x => { const s = Object.assign({ items: {}, measures: {} }, x.funcSections[sid]); s.items = Object.assign({}, s.items, { [iid]: val }); return Object.assign({}, x, { funcSections: Object.assign({}, x.funcSections, { [sid]: s }) }); });
const setFuncMeas = (sid, mid, val) => setF(x => { const s = Object.assign({ items: {}, measures: {} }, x.funcSections[sid]); s.measures = Object.assign({}, s.measures, { [mid]: val }); return Object.assign({}, x, { funcSections: Object.assign({}, x.funcSections, { [sid]: s }) }); });
const setIecMeas = (id, val) => setF(x => Object.assign({}, x, { iecMeasures: x.iecMeasures.map(mm => mm.id === id ? Object.assign({}, mm, { value: val, na: false }) : mm) }));
const toggleIecNA = (id) => setF(x => Object.assign({}, x, { iecMeasures: x.iecMeasures.map(mm => mm.id === id ? Object.assign({}, mm, { na: !mm.na, value: "" }) : mm) }));

const tpl = (templates || {})[f.templateId] || null;
const funcSecs = (tpl && tpl.sections) || [];
const measVerdict = (mm, raw) => { if (raw === "na" || (mm && mm.na)) return null; var v = parseFloat(raw); if (isNaN(v)) return null; var hasMin = mm.limitMin !== undefined && mm.limitMin !== null; var hasMax = mm.limitVal !== undefined && mm.limitVal !== null; if (!hasMin && !hasMax) return null; if (hasMin && v < parseFloat(mm.limitMin)) return false; if (hasMax) { var lv = parseFloat(mm.limitVal); if (mm.invertPass) { if (v < lv) return false; } else { if (v > lv) return false; } } return true; };

// pass
const funcPass = (function () {
for (var s = 0; s < funcSecs.length; s++) { var sec = funcSecs[s]; var sd = f.funcSections[sec.id] || { items: {}, measures: {} };
var its = sec.items || []; for (var i = 0; i < its.length; i++) { if (sd.items[its[i].id] === false) return false; }
var ms = sec.measures || []; for (var m = 0; m < ms.length; m++) { var raw = sd.measures[ms[m].id]; if (raw === undefined || raw === "" || raw === "na") continue; if (measVerdict(ms[m], raw) === false) return false; } }
return true;
})();
const vsePass = !(f.iecMeasures || []).some(mm => measVerdict(mm, mm.value) === false);
const overall = funcPass && vsePass;

// steps
const steps = [{ ph: "Preparazione", key: "setup", name: "Dati e configurazione" }, { ph: "Manutenzione", key: "maint", name: "Checklist manutenzione" }]
.concat(funcSecs.map(sec => ({ ph: "Funzionale", key: "funcsec", sec: sec, name: sec.title })))
.concat((f.iecMeasures || []).map((mm, i) => ({ ph: "Sicurezza elettrica", key: "meas", idx: i, m: mm, name: mm.name })))
.concat([{ ph: "Esito", key: "esito", name: "Esito e salvataggio" }]);
const TOT = steps.length;
const cur = Math.min(step, TOT - 1);
const sObj = steps[cur];
const ast = (assets || []).find(a => a.id === f.assetId);

const secFilled = (sec) => { var sd = f.funcSections[sec.id] || { items: {}, measures: {} };
var its = sec.items || []; for (var i = 0; i < its.length; i++) { var v = sd.items[its[i].id]; if (v !== true && v !== false && v !== "na") return false; }
var ms = sec.measures || []; for (var m = 0; m < ms.length; m++) { var raw = sd.measures[ms[m].id]; if (raw === "na") continue; if (raw === undefined || raw === "" || isNaN(parseFloat(raw))) return false; } return true; };
const stepFilled = (st) => {
if (st.key === "setup") return !!f.assetId;
if (st.key === "maint") return (f.maint || []).every(it => it.status === "fatto" || it.status === "na");
if (st.key === "funcsec") return secFilled(st.sec);
if (st.key === "meas") { var mm = f.iecMeasures[st.idx]; return mm.na || (mm.value !== "" && mm.value != null && !isNaN(parseFloat(mm.value))); }
return true;
};
const doneCount = steps.filter(stepFilled).length;
const go = (i) => { setStep(Math.max(0, Math.min(TOT - 1, i))); setTutOpen(false); try { window.scrollTo(0, 0); } catch (e) { } };
React.useEffect(() => { if (sObj.key !== "esito" || f.technicianSignature) return; const sig = techSignature(technicians, f.technician); if (sig) setF(x => Object.assign({}, x, { technicianSignature: sig })); }, [sObj.key]);
const doSave = () => { if (!f.assetId) return; if (!f.technicianSignature) { try { window.dispatchEvent(new CustomEvent("toast", { detail: { msg: "Firma del tecnico obbligatoria", color: "#ef4444" } })); } catch (e) { } return; } onSaveFull({ technicianSignature: f.technicianSignature || "", departmentSignature: f.departmentSignature || "", assetId: f.assetId, date: f.date, technician: f.technician, templateId: f.templateId, categoryId: f.categoryId, maint: f.maint, funcSections: f.funcSections, funcPass: funcPass, iecMeasures: f.iecMeasures, iecConfig: { norm: f.norm, equipClass: f.equipClass, patientType: f.patientType, leakageMethod: f.leakageMethod }, vsePass: vsePass, overall: overall, notes: f.notes }); };

const selStyle = { width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "9px 11px", fontSize: 13 };
const lblStyle = { fontSize: 11, fontWeight: 600, color: "var(--text-3)", marginBottom: 4, display: "block" };
const okNo = (val, onYes, onNo, onNA, yesLabel, noLabel) => h("div", { style: { display: "flex", gap: 6 } },
h("button", { type: "button", onClick: onYes, style: { background: val === true ? TEAL : "var(--surface-2)", color: val === true ? "#04201C" : "var(--text-3)", border: "1px solid " + (val === true ? TEAL : "var(--border)"), borderRadius: 8, padding: "6px 11px", fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" } }, yesLabel || "✓ OK"),
h("button", { type: "button", onClick: onNo, style: { background: val === false ? RED : "var(--surface-2)", color: val === false ? "#fff" : "var(--text-3)", border: "1px solid " + (val === false ? RED : "var(--border)"), borderRadius: 8, padding: "6px 11px", fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" } }, noLabel || "✗ NO"),
onNA ? h("button", { type: "button", onClick: onNA, style: { background: val === "na" ? "#6b7280" : "var(--surface-2)", color: val === "na" ? "#fff" : "var(--text-4)", border: "1px solid " + (val === "na" ? "#6b7280" : "var(--border)"), borderRadius: 8, padding: "6px 10px", fontWeight: 700, fontSize: 12, cursor: "pointer" } }, "N/A") : null);

// step content
let content;
if (sObj.key === "setup") {
content = h("div", { style: { display: "flex", flexDirection: "column", gap: 12 } },
h("div", null, h("span", { style: lblStyle }, "Apparecchio"),
h(AssetCombobox, { value: f.assetId, onChange: pickAsset, assets: assets, customers: customers, placeholder: "Cerca apparecchio…" })),
f.assetId ? h("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
f.templateId === "generico"
? h("div", { style: { background: "#f59e0b1a", border: "1px solid #f59e0b66", borderRadius: 8, padding: "10px 12px" } }, h("div", { style: { fontSize: 13, fontWeight: 700, color: "#f59e0b" } }, "⚠ Nessun protocollo specifico rilevato"), h("div", { style: { fontSize: 12, color: "var(--text-3)", marginTop: 2 } }, "Scegli qui sotto il protocollo corretto per questo apparecchio."))
: h("div", { style: { fontSize: 12, color: "var(--text-3)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 11px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 } }, h("div", null, "Protocollo funzionale: ", h("b", { style: { color: "var(--text)" } }, (tpl && tpl.label) || f.templateId), (tpl && tpl.norm) ? h("div", { style: { fontSize: 11, color: "var(--text-4)", marginTop: 2 } }, tpl.norm) : null), h("button", { type: "button", onClick: () => setTplOpen(v => !v), style: { background: "transparent", border: "none", color: TEAL, fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" } }, tplOpen ? "Chiudi" : "Cambia")),
(f.templateId === "generico" || tplOpen) ? h("select", { value: f.templateId, onChange: e => pickTpl(e.target.value), style: selStyle }, Object.keys(templates || {}).sort((a, b) => (((templates[a] || {}).label) || a).localeCompare(((templates[b] || {}).label) || b)).map(k => h("option", { key: k, value: k }, ((templates[k] || {}).label) || k))) : null,
h("div", { style: { fontSize: 11, color: "var(--text-4)", lineHeight: 1.4, marginTop: 2 } }, "Le procedure di manutenzione e verifica di riferimento sono quelle del fabbricante. I template proposti sono generici, di supporto al tecnico, e non vincolanti.")) : null,
h("div", null, h("span", { style: lblStyle }, "Data"), h("input", { type: "date", value: f.date, onChange: e => setF(x => Object.assign({}, x, { date: e.target.value })), style: selStyle })),
h(TecnicoPicker, { label: "Tecnico/i", value: f.technician, onChange: v => setF(x => Object.assign({}, x, { technician: v })), technicians: technicians }),
h("div", { style: { fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .5, marginTop: 4 } }, "Parametri sicurezza elettrica"),
h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } },
h("div", null, h("span", { style: lblStyle }, "Norma"), h("select", { value: f.norm, onChange: e => regenIec({ norm: e.target.value }), style: selStyle }, h("option", { value: "62353" }, "IEC 62353"), h("option", { value: "60601" }, "IEC 60601-1"), h("option", { value: "61010" }, "IEC 61010-1"))),
h("div", null, h("span", { style: lblStyle }, "Classe"), h("select", { value: f.equipClass, onChange: e => regenIec({ equipClass: e.target.value }), style: selStyle }, h("option", { value: "I" }, "Classe I"), h("option", { value: "II" }, "Classe II"), h("option", { value: "III" }, "Classe III"))),
h("div", null, h("span", { style: lblStyle }, "Parte applicata"), h("select", { value: f.patientType, onChange: e => regenIec({ patientType: e.target.value }), style: selStyle }, h("option", { value: "B" }, "Tipo B"), h("option", { value: "BF" }, "Tipo BF"), h("option", { value: "CF" }, "Tipo CF"))),
f.norm === "62353" ? h("div", null, h("span", { style: lblStyle }, "Metodo"), h("select", { value: f.leakageMethod, onChange: e => regenIec({ leakageMethod: e.target.value }), style: selStyle }, h("option", { value: "diretto" }, "Diretto"), h("option", { value: "differenziale" }, "Differenziale"), h("option", { value: "alternativo" }, "Alternativo"))) : h("div")));
} else if (sObj.key === "maint") {
content = h("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
(f.maint || []).length === 0 ? h("div", { style: { fontSize: 13, color: "var(--text-4)" } }, "Nessuna voce di manutenzione per questa categoria.") : null,
(f.maint || []).map((it, i) => h("div", { key: i, style: { background: "var(--surface)", border: "1px solid " + (it.status === "fatto" ? TEAL + "66" : it.status === "na" ? "var(--border)" : "var(--border)"), borderRadius: 12, padding: "11px 13px" } },
h("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 } },
h("span", { style: { fontSize: 13, color: "var(--text)", flex: 1, minWidth: 0, lineHeight: 1.35 } }, it.text),
okNo(it.status === "fatto" ? true : it.status === "na" ? "na" : null, () => setMaint(i, "fatto"), null, () => setMaint(i, "na"), "✓ Fatto")),
it.status === "fatto" ? h("input", { type: "text", value: it.note, onChange: e => setMaintNote(i, e.target.value), placeholder: "Nota (facoltativa)…", style: { width: "100%", marginTop: 8, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "7px 9px", fontSize: 12 } }) : null)));
} else if (sObj.key === "funcsec") {
const sec = sObj.sec; const sd = f.funcSections[sec.id] || { items: {}, measures: {} };
content = h("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
sec.note ? h("div", { style: { fontSize: 12, color: "var(--text-2)", background: "#38bdf812", border: "1px solid #38bdf833", borderRadius: 8, padding: "10px 12px", whiteSpace: "pre-line", lineHeight: 1.5 } }, sec.note) : null,
(sec.items || []).map(it => h("div", { key: it.id, style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, background: "var(--surface)", border: "1px solid " + (sd.items[it.id] === true ? TEAL + "66" : sd.items[it.id] === false ? RED + "66" : "var(--border)"), borderRadius: 12, padding: "11px 13px" } },
h("span", { style: { fontSize: 13, color: "var(--text)", flex: 1, minWidth: 0, lineHeight: 1.35 } }, it.text),
okNo(sd.items[it.id], () => setFuncItem(sec.id, it.id, true), () => setFuncItem(sec.id, it.id, false), () => setFuncItem(sec.id, it.id, "na")))),
(sec.measures || []).map(mm => { const raw = sd.measures[mm.id]; const isNA = raw === "na"; const verd = measVerdict(mm, raw);
return h("div", { key: mm.id, style: { background: "var(--surface)", border: "1px solid " + (isNA ? "var(--border)" : verd === true ? TEAL + "66" : verd === false ? RED + "66" : "var(--border)"), borderRadius: 12, padding: "11px 13px" } },
h("div", { style: { fontSize: 13, color: "var(--text)", marginBottom: 6 } }, mm.name),
h("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
h("input", { type: "number", inputMode: "decimal", disabled: isNA, value: isNA ? "" : (raw || ""), onChange: e => setFuncMeas(sec.id, mm.id, e.target.value), placeholder: "—", style: { width: 110, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "8px 10px", fontSize: 14, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" } }),
h("span", { style: { fontSize: 13, color: "var(--text-3)" } }, mm.unit),
h("span", { style: { fontSize: 12, color: "var(--text-4)", marginLeft: "auto" } }, "lim. " + (mm.expected || mm.limit || ("" + mm.limitVal))),
h("button", { type: "button", onClick: () => setFuncMeas(sec.id, mm.id, isNA ? "" : "na"), style: { background: isNA ? "#6b7280" : "var(--surface-2)", color: isNA ? "#fff" : "var(--text-4)", border: "1px solid " + (isNA ? "#6b7280" : "var(--border)"), borderRadius: 8, padding: "6px 9px", fontSize: 12, fontWeight: 700, cursor: "pointer" } }, "N/A")),
verd != null ? h("div", { style: { fontSize: 12, fontWeight: 700, color: verd ? TEAL : RED, marginTop: 5 } }, verd ? "✓ Entro i limiti" : "✗ Fuori limite") : null); }));
} else if (sObj.key === "meas") {
const mm = f.iecMeasures[sObj.idx];
const verd = measVerdict(mm, mm.value);
const v = parseFloat(mm.value), lv = parseFloat(mm.limitVal);
const margin = (!isNaN(v) && !isNaN(lv)) ? Math.abs(lv - v) : null;
const marginTxt = margin == null ? "—" : (verd === false ? "−" : "") + margin.toFixed(margin < 1 ? 3 : (margin < 10 ? 2 : 0)) + " " + mm.unit;
content = h("div", null,
h("div", { style: { background: "var(--surface)", border: "1px solid " + (mm.na ? "var(--border)" : verd === true ? TEAL : verd === false ? RED : "var(--border)"), borderRadius: 16, padding: "18px", marginBottom: 12, opacity: mm.na ? 0.6 : 1 } },
h("div", { style: { fontSize: 11, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10 } }, "Valore rilevato"),
h("div", { style: { display: "flex", alignItems: "center", gap: 10, borderBottom: "2px solid var(--border)", paddingBottom: 8 } },
h("input", { type: "number", inputMode: "decimal", disabled: mm.na, value: mm.value, onChange: e => setIecMeas(mm.id, e.target.value), placeholder: "—", style: { flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: 30, fontWeight: 800, fontFamily: "'IBM Plex Mono', monospace" } }),
h("span", { style: { fontSize: 17, fontWeight: 700, color: "var(--text-3)" } }, mm.unit)),
h("div", { style: { marginTop: 10, fontSize: 13, fontWeight: 700, color: mm.na ? "var(--text-4)" : verd === true ? TEAL : verd === false ? RED : "var(--text-4)" } }, mm.na ? "Non applicabile" : verd === true ? "✓ Entro i limiti" : verd === false ? "✗ Fuori limite" : "Inserisci il valore misurato"),
h("div", { style: { display: "flex", gap: 10, marginTop: 12 } },
h("div", { style: { flex: 1, background: "var(--surface-2)", borderRadius: 8, padding: "8px 10px" } }, h("div", { style: { fontSize: 10, color: "var(--text-4)", marginBottom: 2 } }, "Limite normativo"), h("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--text-2)", fontFamily: "'IBM Plex Mono', monospace" } }, mm.limit + " " + mm.unit)),
h("div", { style: { flex: 1, background: "var(--surface-2)", borderRadius: 8, padding: "8px 10px" } }, h("div", { style: { fontSize: 10, color: "var(--text-4)", marginBottom: 2 } }, "Margine"), h("div", { style: { fontSize: 13, fontWeight: 700, color: verd === false ? RED : "var(--text-2)", fontFamily: "'IBM Plex Mono', monospace" } }, marginTxt)))),
h("label", { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-3)", cursor: "pointer" } }, h("input", { type: "checkbox", checked: !!mm.na, onChange: () => toggleIecNA(mm.id) }), "Non applicabile (N/A)"));
} else {
const maintDone = (f.maint || []).filter(it => it.status).length;
content = h("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
h("div", { style: { background: overall ? TEAL + "1a" : RED + "1a", border: "1px solid " + (overall ? TEAL + "66" : RED + "66"), borderRadius: 16, padding: "20px", textAlign: "center" } },
h("div", { style: { fontSize: 34, fontWeight: 800, color: overall ? TEAL : RED } }, overall ? "✓" : "✗"),
h("div", { style: { fontSize: 19, fontWeight: 800, color: "var(--text)", marginTop: 4 } }, overall ? "Conforme" : "Non conforme"),
h("div", { style: { fontSize: 13, color: "var(--text-3)", marginTop: 4 } }, "Manutenzione + funzionale + sicurezza elettrica in un unico verbale")),
h("div", { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" } },
[["Apparecchio", ast ? ((ast.name || "") + (ast.assetCode ? " · " + ast.assetCode : "")) : "—"], ["Manutenzione", maintDone + "/" + (f.maint || []).length + " voci"], ["Funzionale", funcPass ? "Conforme" : "Non conforme"], ["Sicurezza elettrica", vsePass ? "Conforme" : "Non conforme"], ["Esito complessivo", overall ? "Conforme" : "Non conforme"]].map((r, i) => h("div", { key: i, style: { display: "flex", justifyContent: "space-between", gap: 10, padding: "10px 14px", borderBottom: i < 4 ? "1px solid var(--border-2)" : "none" } }, h("span", { style: { fontSize: 12, color: "var(--text-3)" } }, r[0]), h("span", { style: { fontSize: 13, fontWeight: 600, color: (i >= 2) ? ((i === 2 ? funcPass : i === 3 ? vsePass : overall) ? TEAL : RED) : "var(--text)" } }, r[1])))),
h("div", null, h("span", { style: lblStyle }, "Note conclusive"), h("textarea", { value: f.notes, onChange: e => setF(x => Object.assign({}, x, { notes: e.target.value })), placeholder: "Annotazioni finali…", style: { width: "100%", minHeight: 64, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "10px", fontSize: 13, resize: "vertical", fontFamily: "inherit" } })),
h("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 } },
h(TechSignatureField, { profileSig: techSignature(technicians, f.technician), techName: f.technician, value: f.technicianSignature || "", onChange: v => setF(x => Object.assign({}, x, { technicianSignature: v })), height: 120 }),
h(SignaturePad, { label: "Firma Referente reparto (opzionale)", value: f.departmentSignature || "", onChange: v => setF(x => Object.assign({}, x, { departmentSignature: v })), height: 120 })),
h("div", { style: { fontSize: 12, color: "var(--text-4)", textAlign: "center" } }, "Al salvataggio: crea il verbale di manutenzione, la verifica funzionale e la VSE collegate, aggiorna le scadenze e apre il PDF unico."));
}

// shell
const phColor = { "Preparazione": "#94a3b8", "Manutenzione": "#f59e0b", "Funzionale": "#38bdf8", "Sicurezza elettrica": TEAL, "Esito": "#a78bfa" }[sObj.ph] || TEAL;
return h("div", { style: { display: "flex", flexDirection: "column", gap: 0 } },
h("div", { style: { padding: "2px 2px 14px" } },
h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 } },
h("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
h("span", { style: { fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".6px", color: phColor, background: phColor + "22", padding: "3px 8px", borderRadius: 99 } }, sObj.ph),
h("span", { style: { fontSize: 13, fontWeight: 700, color: "var(--text)" } }, "Passo ", cur + 1, " ", h("span", { style: { fontWeight: 500, color: "var(--text-3)" } }, "di " + TOT))),
h("div", { style: { fontSize: 12, color: "var(--text-3)" } }, doneCount + "/" + TOT)),
h("div", { style: { height: 6, background: "var(--surface-2)", borderRadius: 99, overflow: "hidden" } }, h("div", { style: { height: "100%", width: Math.round((cur / (TOT - 1)) * 100) + "%", background: phColor, borderRadius: 99, transition: "width .2s" } }))),
h("div", { style: { marginBottom: 14 } },
h("h2", { style: { fontSize: 20, fontWeight: 800, letterSpacing: "-.01em", lineHeight: 1.2, margin: "0 0 4px", color: "var(--text)" } }, sObj.name),
h("div", { style: { fontSize: 13, color: "var(--text-3)" } }, sObj.key === "setup" ? "Apparecchio, data e parametri" : sObj.key === "maint" ? "Pulizia e sostituzione parti di usura" : sObj.key === "funcsec" ? "Prove di funzionamento" : sObj.key === "meas" ? ("Limite normativo " + sObj.m.limit + " " + sObj.m.unit) : "Riepilogo e salvataggio")),
content,
h("div", { style: { display: "flex", gap: 10, marginTop: 18 } },
h("button", { type: "button", onClick: () => cur > 0 ? go(cur - 1) : onClose(), style: { display: "flex", alignItems: "center", gap: 5, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-2)", padding: "12px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" } }, h("span", { style: { fontSize: 18, lineHeight: 1, marginTop: -1 } }, "‹"), cur > 0 ? "Indietro" : "Esci"),
cur < TOT - 1
? h("button", { type: "button", disabled: !stepFilled(sObj), onClick: () => { if (stepFilled(sObj)) go(cur + 1); }, style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: stepFilled(sObj) ? TEAL : "var(--surface-2)", border: "none", borderRadius: 10, color: stepFilled(sObj) ? "#04201C" : "var(--text-4)", padding: "12px 16px", fontSize: 14.5, fontWeight: 800, cursor: stepFilled(sObj) ? "pointer" : "not-allowed" } }, "Avanti", h("span", { style: { fontSize: 18, lineHeight: 1, marginTop: -1 } }, "›"))
: h("button", { type: "button", disabled: !f.assetId, onClick: doSave, style: { flex: 1, background: f.assetId ? TEAL : "var(--surface-2)", border: "none", borderRadius: 10, color: f.assetId ? "#04201C" : "var(--text-4)", padding: "12px 16px", fontSize: 14.5, fontWeight: 800, cursor: f.assetId ? "pointer" : "not-allowed" } }, "✓ Salva e genera PDF")),
(cur < TOT - 1 && !stepFilled(sObj)) ? h("div", { style: { fontSize: 12, color: "var(--text-4)", textAlign: "center", marginTop: 9 } }, sObj.key === "setup" ? "Seleziona l'apparecchio per continuare" : sObj.key === "maint" ? "Segna ogni voce (Fatto o N/A) per continuare" : sObj.key === "funcsec" ? "Completa voci e misure della sezione" : "Inserisci il valore o segna N/A per continuare") : null);
}
export function PpmVerifyForm({ initial, assetId: propAssetId, assets, customers, existingReports, technicians, onSave, onClose, showToast, ppmReports, funcReports, iecReports, onLink, onPdf, setModal, pushModal }) {
var _a = React.useState(propAssetId || (initial && initial.assetId) || ""); var assetId = _a[0], setAssetId = _a[1];
var effectiveAsset = (assets || []).find(function (a) { return a.id === assetId; }) || null;
var blank = {
id: "PPM" + Date.now().toString().slice(-6),
reportNumber: "",
assetId: propAssetId || "",
date: new Date().toISOString().slice(0, 10),
technician: "",
items: [],
notes: "",
overallPass: true,
verifyType: "programmata",
technicianSignature: "",
departmentSignature: ""
};
var _f = React.useState(function () {
var init = initial || blank;
if (!initial && !init.reportNumber) init.reportNumber = getNextReportNumber(existingReports || [], "PPM");
if (!initial && init.assetId) { var ci0 = getPpmChecklist((assets || []).find(function (a) { return a.id === init.assetId; }) || {}); init.items = ci0.items.map(function (t) { return { text: t, status: "fatto", note: "" }; }); init.categoryId = ci0.categoryId; init.modelKey = ci0.modelKey; }
return init;
});
var f = _f[0], setF = _f[1];
React.useEffect(function () { if (f.technicianSignature) return; var sig = techSignature(technicians, f.technician); if (sig) setF(function (x) { return Object.assign({}, x, { technicianSignature: sig }); }); }, [f.technician]);
React.useEffect(function () {
if (initial) return;
if (!assetId) { setF(function (x) { return Object.assign(Object.assign({}, x), { assetId: "", items: [] }); }); return; }
var ci = getPpmChecklist((assets || []).find(function (a) { return a.id === assetId; }) || {});
setF(function (x) { return Object.assign(Object.assign({}, x), { assetId: assetId, items: ci.items.map(function (t) { return { text: t, status: "fatto", note: "" }; }), categoryId: ci.categoryId, modelKey: ci.modelKey }); });
}, [assetId]);
function sv(k) { return function (e) { var val = (e && e.target) ? e.target.value : e; setF(function (x) { var o = {}; o[k] = val; return Object.assign(Object.assign({}, x), o); }); }; }
function setItemStatus(i, st) { setF(function (x) { var it = (x.items || []).slice(); it[i] = Object.assign(Object.assign({}, it[i]), { status: st }); return Object.assign(Object.assign({}, x), { items: it }); }); }
function setItemNote(i, v) { setF(function (x) { var it = (x.items || []).slice(); it[i] = Object.assign(Object.assign({}, it[i]), { note: v }); return Object.assign(Object.assign({}, x), { items: it }); }); }
function doSave() {
if (!f.technicianSignature) { showToast && showToast("Firma del tecnico obbligatoria", "#ef4444"); return; }
if (!assetId) { showToast && showToast("Seleziona un apparecchio", "#ef4444"); return; }
var asset = (assets || []).find(function (a) { return a.id === assetId; }) || {};
onSave(Object.assign(Object.assign({}, f), { assetId: assetId, customerId: f.customerId || asset.customerId || "" }));
}
var items = f.items || [];
return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement("div", null,
React.createElement("label", { style: { fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 5 } }, "Apparecchio"),
React.createElement(AssetCombobox, { value: assetId, onChange: function (id) { setAssetId(id); }, assets: assets, customers: customers, placeholder: "Cerca apparecchio\u2026" })),
React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement(Inp, { label: "Data", type: "date", value: f.date, onChange: sv("date") }),
React.createElement(Inp, { label: "Tecnico", value: f.technician, onChange: sv("technician"), placeholder: "Nome tecnico" })),
effectiveAsset ? React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)" } }, "Periodicit\u00e0 costruttore: " + (parseInt(effectiveAsset.intervalPpm, 10) || 12) + " mesi") : null,
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 } }, "Checklist manutenzione" + (items.length ? (" (" + items.length + ")") : "")),
!assetId ? React.createElement("div", { style: { fontSize: 13, color: "var(--text-4)", padding: "6px 0" } }, "Seleziona un apparecchio per caricare la checklist.")
: items.length === 0 ? React.createElement("div", { style: { fontSize: 13, color: "var(--text-4)", padding: "6px 0" } }, "Nessuna voce per questa categoria. Aggiungile in \u2699 Checklist.")
: React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
items.map(function (it, i) {
var st = it.status || "fatto";
return React.createElement("div", { key: i, style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 10, padding: "10px 12px" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 } },
React.createElement("span", { style: { fontSize: 13, color: "var(--text)", flex: 1, minWidth: 0 } }, it.text),
React.createElement("div", { style: { display: "flex", gap: 4, flexShrink: 0 } },
React.createElement("button", { onClick: function () { setItemStatus(i, "fatto"); }, style: { background: st === "fatto" ? "#10b981" : "transparent", color: st === "fatto" ? "#04211d" : "var(--text-3)", border: "1px solid " + (st === "fatto" ? "#10b981" : "var(--border)"), borderRadius: 8, padding: "5px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" } }, "Fatto"),
React.createElement("button", { onClick: function () { setItemStatus(i, "na"); }, style: { background: st === "na" ? "#64748b" : "transparent", color: st === "na" ? "#fff" : "var(--text-3)", border: "1px solid " + (st === "na" ? "#64748b" : "var(--border)"), borderRadius: 8, padding: "5px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" } }, "N.A."))),
React.createElement("input", { value: it.note || "", onChange: function (e) { setItemNote(i, e.target.value); }, placeholder: "Nota (opzionale)\u2026", style: { marginTop: 8, width: "100%", boxSizing: "border-box", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "7px 10px", fontSize: 13 } }));
}))),
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 } }, "Esito complessivo"),
React.createElement("div", { style: { display: "flex", gap: 8 } },
React.createElement("button", { onClick: function () { setF(function (x) { return Object.assign(Object.assign({}, x), { overallPass: true }); }); }, style: { flex: 1, background: f.overallPass !== false ? "#10b981" : "transparent", color: f.overallPass !== false ? "#04211d" : "var(--text-3)", border: "1px solid " + (f.overallPass !== false ? "#10b981" : "var(--border)"), borderRadius: 8, padding: "9px", fontSize: 13, fontWeight: 700, cursor: "pointer" } }, "Conforme"),
React.createElement("button", { onClick: function () { setF(function (x) { return Object.assign(Object.assign({}, x), { overallPass: false }); }); }, style: { flex: 1, background: f.overallPass === false ? "#ef4444" : "transparent", color: f.overallPass === false ? "#fff" : "var(--text-3)", border: "1px solid " + (f.overallPass === false ? "#ef4444" : "var(--border)"), borderRadius: 8, padding: "9px", fontSize: 13, fontWeight: 700, cursor: "pointer" } }, "Non conforme"))),
React.createElement(Inp, { label: "Note generali", value: f.notes, onChange: sv("notes"), placeholder: "Annotazioni sull'intervento\u2026" }),
initial ? (function () {
var livePpm = (ppmReports || []).find(function (r) { return r.id === initial.id; }) || initial;
var aFunc = (funcReports || []).filter(function (r) { return r.assetId === livePpm.assetId; }).sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });
var aIec = (iecReports || []).filter(function (r) { return r.assetId === livePpm.assetId; }).sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });
var selStyle = { flex: 1, minWidth: 0, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "8px 10px", fontSize: 13 };
return React.createElement("div", { style: { borderTop: "1px solid var(--border-2)", paddingTop: 14 } },
React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 } }, "Verifiche collegate"),
React.createElement("div", { style: { fontSize: 12, color: "var(--text-4)", marginBottom: 10, lineHeight: 1.4 } }, "Esegui la verifica funzionale e la VSE (col pulsante \u201cEsegui\u201d o dalle loro sezioni), poi collegale qui. Confluiscono nel PDF unico."),
React.createElement("div", { style: { marginBottom: 10 } },
React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 } }, "Verifica funzionale"),
React.createElement("div", { style: { display: "flex", gap: 6 } },
React.createElement("select", { value: livePpm.funcReportId || "", onChange: function (e) { onLink(livePpm.id, { funcReportId: e.target.value }); }, style: selStyle },
React.createElement("option", { value: "" }, "\u2014 non collegata \u2014"),
aFunc.map(function (r) { return React.createElement("option", { key: r.id, value: r.id }, (r.reportNumber || r.id) + " \u00b7 " + (r.date || "") + " \u00b7 " + (r.overallPass ? "conforme" : "non conf.")); })),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: function () { pushModal({ type: "func", assetId: livePpm.assetId, data: null, ppmLink: livePpm.id }); } }, "Esegui"))),
React.createElement("div", { style: { marginBottom: 12 } },
React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 } }, "Sicurezza elettrica (VSE)"),
React.createElement("div", { style: { display: "flex", gap: 6 } },
React.createElement("select", { value: livePpm.iecReportId || "", onChange: function (e) { onLink(livePpm.id, { iecReportId: e.target.value }); }, style: selStyle },
React.createElement("option", { value: "" }, "\u2014 non collegata \u2014"),
aIec.map(function (r) { return React.createElement("option", { key: r.id, value: r.id }, (r.reportNumber || r.id) + " \u00b7 " + (r.date || "") + " \u00b7 " + (r.overallPass ? "conforme" : "non conf.")); })),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: function () { pushModal({ type: "iec", assetId: livePpm.assetId, data: null, ppmLink: livePpm.id }); } }, "Esegui"))),
React.createElement(Btn, { onClick: function () { onPdf(livePpm); } }, "\u2193 Scarica PDF unico"));
})() : React.createElement("div", { style: { fontSize: 12, color: "var(--text-4)", borderTop: "1px solid var(--border-2)", paddingTop: 12 } }, "Salva la checklist, poi riapri la PPM per collegare verifica funzionale e VSE e scaricare il PDF unico."),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 } },
React.createElement(TechSignatureField, { profileSig: techSignature(technicians, f.technician), techName: f.technician, value: f.technicianSignature || "", onChange: function (v) { setF(function (x) { return Object.assign({}, x, { technicianSignature: v }); }); }, height: 120 }),
React.createElement(SignaturePad, { label: "Firma Referente reparto (opzionale)", value: f.departmentSignature || "", onChange: function (v) { setF(function (x) { return Object.assign({}, x, { departmentSignature: v }); }); }, height: 120 })),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Annulla"),
React.createElement(Btn, { onClick: doSave }, "Salva PPM")));
}
export function PpmPage({ setModal, ppmReports, assets, customers, onNew, onOpen, onDelete, onPdf }) {
var reports = (ppmReports || []).slice().sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });
function assetName(id) { var a = (assets || []).find(function (x) { return x.id === id; }); return a ? (a.name || a.model || id) : (id || "\u2014"); }
return React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 18, fontWeight: 800 } }, "Manutenzione Programmata"),
React.createElement("div", { style: { fontSize: 13, color: "var(--text-3)", marginTop: 2 } }, reports.length + " interventi \u00b7 checklist + funzionale + sicurezza elettrica")),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: function () { setModal({ type: "ppmChecklist" }); } }, "\u2699 Checklist"),
React.createElement(Btn, { sm: true, onClick: onNew }, "+ Nuova PPM"))),
reports.length === 0
? React.createElement(EmptyState, { icon: "\u2713", title: "Nessuna manutenzione programmata", subtitle: "Esegui la PPM periodica: checklist meccanica, verifica funzionale e sicurezza elettrica in un'unica uscita.", actions: [{ label: "+ Nuova PPM", onClick: onNew, primary: true }] })
: React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
reports.map(function (r) {
var ok = r.overallPass !== false;
var na = r.items ? r.items.filter(function (i) { return i.status === "na"; }).length : 0;
var done = r.items ? r.items.filter(function (i) { return i.status === "fatto"; }).length : 0;
return React.createElement("div", { key: r.id, style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 10, overflow: "hidden" } },
React.createElement("div", { onClick: function () { onOpen(r); }, style: { padding: "12px 14px", cursor: "pointer" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 } },
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--text)" } }, assetName(r.assetId)),
React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)", marginTop: 2 } }, (r.reportNumber || r.id) + " \u00b7 " + (r.date || "") + (r.technician ? (" \u00b7 " + r.technician) : ""))),
React.createElement("span", { style: { flexShrink: 0, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: ok ? "#10b98122" : "#ef444422", color: ok ? "#10b981" : "#ef4444" } }, ok ? "Conforme" : "Non conforme")),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-4)", marginTop: 6 } }, done + " voci eseguite" + (na ? (" \u00b7 " + na + " N.A.") : ""))),
React.createElement("div", { style: { display: "flex", borderTop: "1px solid var(--border-2)" } },
React.createElement("button", { onClick: function () { onPdf(r); }, style: { flex: 1, background: "transparent", color: "#5eead4", border: "none", borderRight: "1px solid var(--border-2)", padding: "9px 4px", fontSize: 12, fontWeight: 700, cursor: "pointer" } }, "PDF"),
React.createElement("button", { onClick: function () { onOpen(r); }, style: { flex: 1, background: "transparent", color: "var(--text-2)", border: "none", borderRight: "1px solid var(--border-2)", padding: "9px 4px", fontSize: 12, fontWeight: 700, cursor: "pointer" } }, "\u270F Apri"),
React.createElement("button", { onClick: function () { onDelete(r.id); }, style: { flex: 1, background: "transparent", color: "#ef4444", border: "none", padding: "9px 4px", fontSize: 12, fontWeight: 700, cursor: "pointer" } }, "\u2715 Elimina")));
})));
}
