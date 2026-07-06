/* MedTrace — verifiche: wizard e form Funzionale + IEC 62353, firma, suggerimento strumenti (estratti da app.js, v2.90) */
import { TecnicoPicker, Btn, chkRow } from "./shared.js";
import { Hint, useMedia, AssetCombobox, ErrorSummary } from "./ui.js";
import { FORM_FLD, FORM_INP, FORM_LBL } from "../constants/ui.js";
import { FUNC_TEMPLATES, cndToTemplate, guessTemplate } from "../constants/funcTemplates.js";
import { getNextReportNumber, iecGetMeasures } from "../lib/reports.js";
export function FuncWizardForm({ initial, assetId: propAssetId, assets, customers, existingReports, templates, instruments, technicians, onSave, onClose, isAdmin, showToast, onClassic }) {
const h = React.createElement;
const TEAL = "#2dd4bf", RED = "#ef4444";
const tplFor = (ast) => (cndToTemplate((ast && ast.cnd) || "") || guessTemplate((ast && ast.name) || "") || "generico");
const initAst = (assets || []).find(a => a.id === (propAssetId || ""));
const [f, setF] = React.useState(() => ({
id: "FV" + Date.now().toString().slice(-6),
reportNumber: getNextReportNumber(existingReports || [], "VF"),
assetId: propAssetId || "",
templateId: tplFor(initAst),
date: new Date().toISOString().slice(0, 10),
technician: "",
instrument: "", instrumentSerial: "", instrumentCalExpiry: "",
verifyType: "periodica",
sections: {},
notes: "",
overallPass: false,
verifyStatus: "completata",
notAvailableReason: "", departmentName: "", departmentContact: "",
technicianSignature: "", departmentSignature: ""
}));
const [step, setStep] = React.useState(0);
const [tplOpen, setTplOpen] = React.useState(false);

const pickAsset = (aid) => setF(x => { const ast = (assets || []).find(a => a.id === aid); return Object.assign({}, x, { assetId: aid, templateId: tplFor(ast), sections: {} }); });
const pickTpl = (tid) => setF(x => Object.assign({}, x, { templateId: tid, sections: {} }));
const setFuncItem = (sid, iid, val) => setF(x => { const s = Object.assign({ items: {}, measures: {} }, x.sections[sid]); s.items = Object.assign({}, s.items, { [iid]: val }); return Object.assign({}, x, { sections: Object.assign({}, x.sections, { [sid]: s }) }); });
const setFuncMeas = (sid, mid, val) => setF(x => { const s = Object.assign({ items: {}, measures: {} }, x.sections[sid]); s.measures = Object.assign({}, s.measures, { [mid]: val }); return Object.assign({}, x, { sections: Object.assign({}, x.sections, { [sid]: s }) }); });

const tpl = (templates || {})[f.templateId] || null;
const funcSecs = (tpl && tpl.sections) || [];
const measVerdict = (mm, raw) => { if (raw === "na" || (mm && mm.na)) return null; var v = parseFloat(raw); if (isNaN(v)) return null; var hasMin = mm.limitMin !== undefined && mm.limitMin !== null; var hasMax = mm.limitVal !== undefined && mm.limitVal !== null; if (!hasMin && !hasMax) return null; if (hasMin && v < parseFloat(mm.limitMin)) return false; if (hasMax) { var lv = parseFloat(mm.limitVal); if (mm.invertPass) { if (v < lv) return false; } else { if (v > lv) return false; } } return true; };
const funcPass = (function () { for (var s = 0; s < funcSecs.length; s++) { var sec = funcSecs[s]; var sd = f.sections[sec.id] || { items: {}, measures: {} }; var its = sec.items || []; for (var i = 0; i < its.length; i++) { if (sd.items[its[i].id] === false) return false; } var ms = sec.measures || []; for (var m = 0; m < ms.length; m++) { var raw = sd.measures[ms[m].id]; if (raw === undefined || raw === "" || raw === "na") continue; if (measVerdict(ms[m], raw) === false) return false; } } return true; })();

const steps = [{ key: "setup", name: "Dati e configurazione" }].concat(funcSecs.map(sec => ({ key: "funcsec", sec: sec, name: sec.title }))).concat([{ key: "esito", name: "Esito e salvataggio" }]);
const TOT = steps.length; const cur = Math.min(step, TOT - 1); const sObj = steps[cur];
const ast = (assets || []).find(a => a.id === f.assetId);

const secFilled = (sec) => { var sd = f.sections[sec.id] || { items: {}, measures: {} }; var its = sec.items || []; for (var i = 0; i < its.length; i++) { var v = sd.items[its[i].id]; if (v !== true && v !== false && v !== "na") return false; } var ms = sec.measures || []; for (var m = 0; m < ms.length; m++) { var raw = sd.measures[ms[m].id]; if (raw === "na") continue; if (raw === undefined || raw === "" || isNaN(parseFloat(raw))) return false; } return true; };
const stepFilled = (st) => { if (st.key === "setup") return !!f.assetId && !!f.templateId; if (st.key === "funcsec") return secFilled(st.sec); return true; };
const doneCount = steps.filter(stepFilled).length;
const go = (i) => { setStep(Math.max(0, Math.min(TOT - 1, i))); try { window.scrollTo(0, 0); } catch (e) { } };
const doSave = () => { if (!f.assetId) return; const cid = ast ? ast.customerId : null; onSave(Object.assign({}, f, { customerId: cid, overallPass: funcPass })); };

const selStyle = { width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "9px 11px", fontSize: 13 };
const lblStyle = { fontSize: 11, fontWeight: 600, color: "var(--text-3)", marginBottom: 4, display: "block" };
const okNo = (val, onYes, onNo, onNA) => h("div", { style: { display: "flex", gap: 6 } },
h("button", { type: "button", onClick: onYes, style: { background: val === true ? TEAL : "var(--surface-2)", color: val === true ? "#04201C" : "var(--text-3)", border: "1px solid " + (val === true ? TEAL : "var(--border)"), borderRadius: 8, padding: "6px 11px", fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" } }, "✓ OK"),
h("button", { type: "button", onClick: onNo, style: { background: val === false ? RED : "var(--surface-2)", color: val === false ? "#fff" : "var(--text-3)", border: "1px solid " + (val === false ? RED : "var(--border)"), borderRadius: 8, padding: "6px 11px", fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" } }, "✗ NO"),
h("button", { type: "button", onClick: onNA, style: { background: val === "na" ? "#6b7280" : "var(--surface-2)", color: val === "na" ? "#fff" : "var(--text-4)", border: "1px solid " + (val === "na" ? "#6b7280" : "var(--border)"), borderRadius: 8, padding: "6px 10px", fontWeight: 700, fontSize: 12, cursor: "pointer" } }, "N/A"));

let content;
if (sObj.key === "setup") {
const tplKeys = Object.keys(templates || {}).sort((a, b) => (((templates[a] || {}).label) || a).localeCompare(((templates[b] || {}).label) || b));
content = h("div", { style: { display: "flex", flexDirection: "column", gap: 12 } },
h("div", null, h("span", { style: lblStyle }, "Apparecchio"),
h(AssetCombobox, { value: f.assetId, onChange: pickAsset, assets: assets, customers: customers, placeholder: "Cerca apparecchio…" })),
f.assetId ? h("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
f.templateId === "generico"
? h("div", { style: { background: "#f59e0b1a", border: "1px solid #f59e0b66", borderRadius: 8, padding: "10px 12px" } }, h("div", { style: { fontSize: 12.5, fontWeight: 700, color: "#f59e0b" } }, "⚠ Nessun protocollo specifico rilevato"), h("div", { style: { fontSize: 11.5, color: "var(--text-3)", marginTop: 2 } }, "Scegli qui sotto il protocollo corretto per questo apparecchio."))
: h("div", { style: { fontSize: 12, color: "var(--text-3)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 11px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 } }, h("div", null, "Protocollo: ", h("b", { style: { color: "var(--text)" } }, (tpl && tpl.label) || f.templateId), (tpl && tpl.norm) ? h("div", { style: { fontSize: 11, color: "var(--text-4)", marginTop: 2 } }, tpl.norm) : null), h("button", { type: "button", onClick: () => setTplOpen(v => !v), style: { background: "transparent", border: "none", color: TEAL, fontSize: 11.5, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" } }, tplOpen ? "Chiudi" : "Cambia")),
(f.templateId === "generico" || tplOpen) ? h("select", { value: f.templateId, onChange: e => pickTpl(e.target.value), style: selStyle }, tplKeys.map(k => h("option", { key: k, value: k }, ((templates[k] || {}).label) || k))) : null,
h("div", { style: { fontSize: 10.5, color: "var(--text-4)", lineHeight: 1.4, marginTop: 2 } }, "Le procedure di manutenzione e verifica di riferimento sono quelle del fabbricante. I template proposti sono generici, di supporto al tecnico, e non vincolanti.")) : null,
h("div", null, h("span", { style: lblStyle }, "Data"), h("input", { type: "date", value: f.date, onChange: e => setF(x => Object.assign({}, x, { date: e.target.value })), style: selStyle })),
h(TecnicoPicker, { label: "Tecnico/i", value: f.technician, onChange: v => setF(x => Object.assign({}, x, { technician: v })), technicians: technicians }),
(instruments && instruments.length) ? h("div", null, h("span", { style: lblStyle }, "Strumento (facoltativo)"),
h("select", { value: f.instrument, onChange: e => setF(x => Object.assign({}, x, { instrument: e.target.value })), style: selStyle },
h("option", { value: "" }, "— nessuno —"),
instruments.map(it => { const t = [it.brand, it.model].filter(Boolean).join(" ") + (it.internalCode ? (" (" + it.internalCode + ")") : ""); return h("option", { key: it.id || t, value: t }, t); }))) : null,
onClassic ? h("button", { type: "button", onClick: onClassic, style: { background: "transparent", border: "none", color: "var(--text-4)", fontSize: 11.5, textDecoration: "underline", cursor: "pointer", alignSelf: "flex-start", padding: "4px 0" } }, "Apparecchio non disponibile o modulo classico →") : null);
} else if (sObj.key === "funcsec") {
const sec = sObj.sec; const sd = f.sections[sec.id] || { items: {}, measures: {} };
content = h("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
sec.note ? h("div", { style: { fontSize: 12, color: "var(--text-2)", background: "#38bdf812", border: "1px solid #38bdf833", borderRadius: 8, padding: "10px 12px", whiteSpace: "pre-line", lineHeight: 1.5 } }, sec.note) : null,
(sec.items || []).map(it => h("div", { key: it.id, style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, background: "var(--surface)", border: "1px solid " + (sd.items[it.id] === true ? TEAL + "66" : sd.items[it.id] === false ? RED + "66" : "var(--border)"), borderRadius: 12, padding: "11px 13px" } },
h("span", { style: { fontSize: 13, color: "var(--text)", flex: 1, minWidth: 0, lineHeight: 1.35 } }, it.text),
okNo(sd.items[it.id], () => setFuncItem(sec.id, it.id, true), () => setFuncItem(sec.id, it.id, false), () => setFuncItem(sec.id, it.id, "na")))),
(sec.measures || []).map(mm => { const raw = sd.measures[mm.id]; const isNA = raw === "na"; const verd = measVerdict(mm, raw);
return h("div", { key: mm.id, style: { background: "var(--surface)", border: "1px solid " + (isNA ? "var(--border)" : verd === true ? TEAL + "66" : verd === false ? RED + "66" : "var(--border)"), borderRadius: 12, padding: "11px 13px" } },
h("div", { style: { fontSize: 12.5, color: "var(--text)", marginBottom: 6 } }, mm.name),
h("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
h("input", { type: "number", inputMode: "decimal", disabled: isNA, value: isNA ? "" : (raw || ""), onChange: e => setFuncMeas(sec.id, mm.id, e.target.value), placeholder: "—", style: { width: 110, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 7, color: "var(--text)", padding: "8px 10px", fontSize: 15, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" } }),
h("span", { style: { fontSize: 13, color: "var(--text-3)" } }, mm.unit),
h("span", { style: { fontSize: 11.5, color: "var(--text-4)", marginLeft: "auto" } }, "lim. " + (mm.expected || mm.limit || ("" + mm.limitVal))),
h("button", { type: "button", onClick: () => setFuncMeas(sec.id, mm.id, isNA ? "" : "na"), style: { background: isNA ? "#6b7280" : "var(--surface-2)", color: isNA ? "#fff" : "var(--text-4)", border: "1px solid " + (isNA ? "#6b7280" : "var(--border)"), borderRadius: 7, padding: "6px 9px", fontSize: 11.5, fontWeight: 700, cursor: "pointer" } }, "N/A")),
verd != null ? h("div", { style: { fontSize: 11.5, fontWeight: 700, color: verd ? TEAL : RED, marginTop: 5 } }, verd ? "✓ Entro i limiti" : "✗ Fuori limite") : null); }));
} else {
content = h("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
h("div", { style: { background: funcPass ? TEAL + "1a" : RED + "1a", border: "1px solid " + (funcPass ? TEAL + "66" : RED + "66"), borderRadius: 16, padding: "20px", textAlign: "center" } },
h("div", { style: { fontSize: 34, fontWeight: 800, color: funcPass ? TEAL : RED } }, funcPass ? "✓" : "✗"),
h("div", { style: { fontSize: 19, fontWeight: 800, color: "var(--text)", marginTop: 4 } }, funcPass ? "Conforme" : "Non conforme"),
h("div", { style: { fontSize: 12.5, color: "var(--text-3)", marginTop: 4 } }, "Verifica funzionale secondo " + ((tpl && tpl.label) || ""))),
h("div", { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" } },
[["Apparecchio", ast ? ((ast.name || "") + (ast.assetCode ? " · " + ast.assetCode : "")) : "—"], ["Template", (tpl && tpl.label) || f.templateId], ["Tecnico", f.technician || "—"], ["Esito", funcPass ? "Conforme" : "Non conforme"]].map((r, i) => h("div", { key: i, style: { display: "flex", justifyContent: "space-between", gap: 10, padding: "10px 14px", borderBottom: i < 3 ? "1px solid var(--border-2)" : "none" } }, h("span", { style: { fontSize: 12, color: "var(--text-3)" } }, r[0]), h("span", { style: { fontSize: 12.5, fontWeight: 600, color: i === 3 ? (funcPass ? TEAL : RED) : "var(--text)" } }, r[1])))),
h("div", null, h("span", { style: lblStyle }, "Note conclusive"), h("textarea", { value: f.notes, onChange: e => setF(x => Object.assign({}, x, { notes: e.target.value })), placeholder: "Annotazioni finali…", style: { width: "100%", minHeight: 64, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "10px", fontSize: 13, resize: "vertical", fontFamily: "inherit" } })));
}

return h("div", { style: { display: "flex", flexDirection: "column", gap: 0 } },
h("div", { style: { padding: "2px 2px 14px" } },
h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 } },
h("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
h("span", { style: { fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".6px", color: "#38bdf8", background: "#38bdf822", padding: "3px 8px", borderRadius: 99 } }, "Funzionale"),
h("span", { style: { fontSize: 13, fontWeight: 700, color: "var(--text)" } }, "Passo ", cur + 1, " ", h("span", { style: { fontWeight: 500, color: "var(--text-3)" } }, "di " + TOT))),
h("div", { style: { fontSize: 11.5, color: "var(--text-3)" } }, doneCount + "/" + TOT)),
h("div", { style: { height: 6, background: "var(--surface-2)", borderRadius: 99, overflow: "hidden" } }, h("div", { style: { height: "100%", width: Math.round((cur / (TOT - 1)) * 100) + "%", background: "#38bdf8", borderRadius: 99, transition: "width .2s" } }))),
h("div", { style: { marginBottom: 14 } },
h("h2", { style: { fontSize: 20, fontWeight: 800, letterSpacing: "-.01em", lineHeight: 1.2, margin: "0 0 4px", color: "var(--text)" } }, sObj.name),
h("div", { style: { fontSize: 12.5, color: "var(--text-3)" } }, sObj.key === "setup" ? "Apparecchio, tipo di verifica e dati" : sObj.key === "funcsec" ? "Voci di controllo e misure della sezione" : "Riepilogo e salvataggio")),
content,
h("div", { style: { display: "flex", gap: 10, marginTop: 18 } },
h("button", { type: "button", onClick: () => cur > 0 ? go(cur - 1) : onClose(), style: { display: "flex", alignItems: "center", gap: 5, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-2)", padding: "12px 18px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" } }, h("span", { style: { fontSize: 18, lineHeight: 1, marginTop: -1 } }, "‹"), cur > 0 ? "Indietro" : "Esci"),
cur < TOT - 1
? h("button", { type: "button", disabled: !stepFilled(sObj), onClick: () => { if (stepFilled(sObj)) go(cur + 1); }, style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: stepFilled(sObj) ? TEAL : "var(--surface-2)", border: "none", borderRadius: 10, color: stepFilled(sObj) ? "#04201C" : "var(--text-4)", padding: "12px 16px", fontSize: 14.5, fontWeight: 800, cursor: stepFilled(sObj) ? "pointer" : "not-allowed" } }, "Avanti", h("span", { style: { fontSize: 18, lineHeight: 1, marginTop: -1 } }, "›"))
: h("button", { type: "button", disabled: !f.assetId, onClick: doSave, style: { flex: 1, background: f.assetId ? TEAL : "var(--surface-2)", border: "none", borderRadius: 10, color: f.assetId ? "#04201C" : "var(--text-4)", padding: "12px 16px", fontSize: 14.5, fontWeight: 800, cursor: f.assetId ? "pointer" : "not-allowed" } }, "✓ Salva verifica")),
(cur < TOT - 1 && !stepFilled(sObj)) ? h("div", { style: { fontSize: 11.5, color: "var(--text-4)", textAlign: "center", marginTop: 9 } }, sObj.key === "setup" ? "Seleziona apparecchio e template per continuare" : "Completa voci e misure della sezione") : null);
}
export function FuncVerifyForm({ initial, assetId: propAssetId, assets, customers, existingReports, templates, instruments, technicians, onSave, onClose, isAdmin, showToast }) {
const TPLS = templates || FUNC_TEMPLATES;
const asset = assets.find(a => a.id === propAssetId) || null;
const [selectedAssetId, setSelectedAssetId] = React.useState(propAssetId || (initial === null || initial === void 0 ? void 0 : initial.assetId) || "");
const effectiveAsset = asset || assets.find(a => a.id === selectedAssetId) || null;
const suggestedTpl = cndToTemplate((effectiveAsset === null || effectiveAsset === void 0 ? void 0 : effectiveAsset.cnd) || "") || guessTemplate((effectiveAsset === null || effectiveAsset === void 0 ? void 0 : effectiveAsset.name) || "");
const [templateId, setTemplateId] = React.useState((initial === null || initial === void 0 ? void 0 : initial.templateId) || suggestedTpl || "generico");
const tpl = TPLS[templateId] || TPLS["generico"];
const blank = {
id: "FV" + Date.now().toString().slice(-6),
reportNumber: "",
assetId: propAssetId || "",
date: new Date().toISOString().slice(0, 10),
technician: "",
instrument: "", instrumentSerial: "", instrumentCalExpiry: "",
templateId: templateId,
verifyType: "periodica",
sections: {},
notes: "",
overallPass: false,
verifyStatus: "completata",
notAvailableReason: "", departmentName: "", departmentContact: "",
technicianSignature: "", departmentSignature: ""
};
const [f, setF] = React.useState(() => {
const init = initial || blank;
if (!initial && !init.reportNumber) {
init.reportNumber = getNextReportNumber(existingReports || [], "VF");
}
if (!init.sections)
return Object.assign(Object.assign({}, init), { sections: {} });
return init;
});
const [errors, setErrors] = React.useState({});
const sv = k => e => setF(x => (Object.assign(Object.assign({}, x), { [k]: e.target.value })));
React.useEffect(() => {
setF(x => (Object.assign(Object.assign({}, x), { templateId })));
}, [templateId]);
const getSectionData = (secId) => f.sections[secId] || { items: {}, measures: {} };
const setItem = (secId, itemId, val) => setF(x => (Object.assign(Object.assign({}, x), { sections: Object.assign(Object.assign({}, x.sections), { [secId]: Object.assign(Object.assign({}, getSectionData(secId)), { items: Object.assign(Object.assign({}, getSectionData(secId).items), { [itemId]: val }) }) }) })));
const setMeasure = (secId, mId, val) => setF(x => (Object.assign(Object.assign({}, x), { sections: Object.assign(Object.assign({}, x.sections), { [secId]: Object.assign(Object.assign({}, getSectionData(secId)), { measures: Object.assign(Object.assign({}, getSectionData(secId).measures), { [mId]: val }) }) }) })));
const computePass = () => {
for (const sec of tpl.sections) {
if (sd_isNA(sec.id))
continue;
const sd = getSectionData(sec.id);
for (const item of (sec.items || [])) {
if (sd.items[item.id] === false)
return false;
}
for (const m of (sec.measures || [])) {
const raw = sd.measures[m.id];
if (raw === "na")
continue;
const v = parseFloat(raw || "");
if (isNaN(v))
continue;
if (m.limitMin !== undefined && v < m.limitMin)
return false;
if (m.limitVal !== undefined) {
if (m.invertPass) {
if (v < m.limitVal)
return false;
}
else {
if (v > m.limitVal)
return false;
}
}
}
}
return true;
};
const sd_isNA = (secId) => {
const sd = getSectionData(secId);
return sd._sectionNA === true;
};
const setSectionNA = (secId, isNA) => {
setF(x => {
const old = x.sections[secId] || { items: {}, measures: {} };
return Object.assign(Object.assign({}, x), { sections: Object.assign(Object.assign({}, x.sections), { [secId]: Object.assign(Object.assign({}, old), { _sectionNA: isNA }) }) });
});
};
const pass = computePass();
const FLD = FORM_FLD;
const LBL = FORM_LBL;
const INP = FORM_INP;
const isMobile = useMedia("(max-width:600px)");
const renderItemRow = ({ secId, item }) => {
const val = getSectionData(secId).items[item.id];
const STATES = [
{ v: true, lbl: "✓", col: "#22c55e", title: "Conforme" },
{ v: false, lbl: "✗", col: "#ef4444", title: "Non conforme" },
{ v: "na", lbl: "N/A", col: "var(--text-3)", title: "Non applicabile a questa macchina" },
{ v: null, lbl: "—", col: "var(--text-4)", title: "Non verificato" },
];
const isOpt = item.optional || /opzionale|optional/i.test(item.text || "");
return (React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid var(--border)", gap: 10 } },
React.createElement("span", { style: { fontSize: 12, color: val === "na" ? "var(--text-4)" : "var(--text-2)", flex: 1, textDecoration: val === "na" ? "line-through" : "none" } },
item.text,
isOpt && React.createElement("span", { style: { fontSize: 9, color: "var(--text-3)", marginLeft: 6, padding: "1px 5px", border: "1px solid var(--border)", borderRadius: 3 } }, "opz.")),
React.createElement("div", { style: { display: "flex", gap: 4, flexShrink: 0 } }, STATES.map((s, i) => (React.createElement("button", { key: i, title: s.title, onClick: () => setItem(secId, item.id, s.v), style: {
background: val === s.v ? s.col + "22" : "var(--surface)",
border: "1px solid " + (val === s.v ? s.col + "66" : "var(--surface-3)"),
color: val === s.v ? s.col : "var(--text-4)",
borderRadius: 5, padding: "4px 8px", cursor: "pointer", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
touchAction: "manipulation", WebkitTapHighlightColor: "transparent"
} }, s.lbl))))));
};
const renderMeasureRow = ({ secId, m }) => {
const raw = getSectionData(secId).measures[m.id] || "";
const isNA = raw === "na";
const vNum = isNA ? NaN : parseFloat(raw);
let pass = null;
if (!isNA && !isNaN(vNum)) {
pass = true;
if (m.limitMin !== undefined && vNum < m.limitMin)
pass = false;
if (m.limitVal !== undefined) {
if (m.invertPass) {
if (vNum < m.limitVal)
pass = false;
}
else {
if (vNum > m.limitVal)
pass = false;
}
}
}
const fail = pass === false;
const limitText = (() => {
const u = m.unit || "";
if (m.limitMin !== undefined && m.limitVal !== undefined && !m.invertPass)
return m.limitMin + "–" + m.limitVal + " " + u;
if (m.limitVal !== undefined && !m.invertPass)
return "limite ≤ " + m.limitVal + " " + u;
if (m.limitVal !== undefined && m.invertPass)
return "limite ≥ " + m.limitVal + " " + u;
if (m.limitMin !== undefined)
return "min ≥ " + m.limitMin + " " + u;
return "";
})();
const __nameEl = React.createElement("span", { style: { fontSize: 12.5, color: fail ? "#fecaca" : "var(--text)", fontWeight: fail ? 700 : 500, textDecoration: isNA ? "line-through" : "none", overflowWrap: "anywhere", lineHeight: 1.3, minWidth: 0 } }, m.name);
const __expEl = React.createElement("span", { style: { fontSize: 10, color: "var(--text-2)", fontFamily: "'IBM Plex Mono', monospace" } }, m.expected || m.limit || "");
const __inputEl = isNA ? React.createElement("span", { style: { fontSize: 10, color: "var(--text-2)", fontStyle: "italic", textAlign: "center" } }, "N/A") : React.createElement("input", { type: "number", step: "any", inputMode: "decimal", value: raw, onChange: e => setMeasure(secId, m.id, e.target.value), placeholder: "\u2014", style: { background: fail ? "#5b1414" : "var(--surface-2)", border: "2px solid " + (fail ? "#f87171" : "#33394a"), borderRadius: 5, padding: "6px 8px", color: fail ? "#ffe4e4" : "#ffffff", fontSize: 14, outline: "none", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 800, boxShadow: fail ? "0 0 0 1px #ef4444" : "none", width: isMobile ? 96 : undefined, minWidth: 0 } });
const __unitEl = React.createElement("span", { style: { fontWeight: 800, fontSize: 14, textAlign: "center", color: pass === null ? "var(--text-3)" : pass ? "#34d399" : "#f87171", minWidth: isMobile ? 22 : undefined } }, m.unit);
const __naBtn = React.createElement("button", { title: isNA ? "Ripristina misura" : "Marca come Non Applicabile", onClick: () => setMeasure(secId, m.id, isNA ? "" : "na"), style: { background: isNA ? "#64748b33" : "var(--surface-2)", border: "1px solid " + (isNA ? "#64748b66" : "#33394a"), color: isNA ? "var(--text-strong)" : "var(--text-2)", borderRadius: 5, padding: isMobile ? "5px 10px" : "4px 4px", cursor: "pointer", fontSize: isMobile ? 11 : 9, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0, touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } }, "N/A");
return (React.createElement("div", { style: { marginBottom: fail ? 8 : 6 } },
(isMobile ? React.createElement("div", { style: { background: fail ? "#3a0f0f" : "var(--bg)", borderRadius: 6, padding: "8px 10px", opacity: isNA ? 0.55 : 1, border: fail ? "2px solid #ef4444" : "1px solid var(--border-2)" } }, React.createElement("div", { style: { marginBottom: 7 } }, __nameEl), React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" } }, React.createElement("span", { style: { fontSize: 10, color: "var(--text-2)", fontFamily: "'IBM Plex Mono', monospace", flex: "1 1 60px", minWidth: 0 } }, m.expected || m.limit || ""), __inputEl, __unitEl, __naBtn)) : React.createElement("div", { style: { display: "grid", gridTemplateColumns: "minmax(0,1fr) 90px 60px 38px 30px", gap: 6, alignItems: "center", background: fail ? "#3a0f0f" : "var(--bg)", borderRadius: 6, padding: "6px 8px", opacity: isNA ? 0.55 : 1, border: fail ? "2px solid #ef4444" : "1px solid var(--border-2)" } }, __nameEl, __expEl, __inputEl, __unitEl, __naBtn)),
fail && limitText && (React.createElement("div", { style: { fontSize: 11.5, color: "#fff", background: "#dc2626", borderRadius: "0 0 6px 6px", margin: "0 2px", padding: "5px 10px", display: "flex", alignItems: "center", gap: 6, fontWeight: 600 } },
React.createElement("span", { style: { fontSize: 13 } }, "\u26A0"),
React.createElement("span", null,
"Fuori limite \u2014 ",
limitText,
". Controlla il valore o l'apparecchio.")))));
};
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement(ErrorSummary, { errors: errors }),
(f.locked ? React.createElement("div", { style: { background: "#22c55e14", border: "1px solid #22c55e55", borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 9, fontSize: 12.5 } }, React.createElement("span", { style: { fontSize: 15 } }, "\uD83D\uDD12"), React.createElement("span", { style: { color: "var(--text)" } }, "Verifica conclusa e bloccata", f.concludedAt ? (" il " + new Date(f.concludedAt).toLocaleDateString("it-IT")) : "", isAdmin ? " \u2014 come admin puoi riaprirla per correggere." : " \u2014 sola lettura (solo un admin pu\u00F2 riaprirla).")) : null),
React.createElement("div", { style: { background: pass ? "#22c55e1f" : "#ef44441f", border: `1px solid ${pass ? "#22c55e55" : "#ef444455"}`, borderRadius: 8, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 } },
React.createElement("span", { style: { fontSize: 11, color: "var(--text-2)" } },
"Template: ",
React.createElement("strong", { style: { color: "var(--text)" } },
tpl.icon,
" ",
tpl.label),
" \u2014 ",
tpl.norm),
React.createElement("span", { style: { fontWeight: 900, fontSize: 15, letterSpacing: .3, color: pass ? "#04201C" : "#fff", background: pass ? "#2dd4bf" : "#ef4444", borderRadius: 6, padding: "5px 12px", whiteSpace: "nowrap" } }, pass ? "CONFORME" : "NON CONFORME")),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 13 } },
!propAssetId && (React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Apparecchio"),
React.createElement(AssetCombobox, { value: selectedAssetId, onChange: id => {
setSelectedAssetId(id);
setF(x => (Object.assign(Object.assign({}, x), { assetId: id })));
const a = assets.find(x => x.id === id);
if (a) {
const t = cndToTemplate(a.cnd) || guessTemplate(a.name);
setTemplateId(t);
}
}, assets: assets, customers: customers, placeholder: "Cerca apparecchio\u2026" }))),
effectiveAsset && React.createElement("div", { style: Object.assign(Object.assign({}, FLD), { justifyContent: "flex-end" }) },
React.createElement("label", { style: LBL }, "Apparecchio selezionato"),
React.createElement("div", { style: { background: "var(--surface)", borderRadius: 8, padding: "8px 14px", border: "1px solid var(--border-2)", fontSize: 12, color: "var(--text-2)" } },
React.createElement("strong", { style: { color: "var(--text)" } }, effectiveAsset.name),
" \u00B7 ",
effectiveAsset.brand,
" ",
effectiveAsset.model,
" \u00B7 S/N: ",
effectiveAsset.serial || "—")),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Template verifica funzionale"),
React.createElement("select", { value: templateId, onChange: e => setTemplateId(e.target.value), style: INP }, Object.entries(TPLS).map(([id, t]) => React.createElement("option", { key: id, value: id },
t.icon,
" ",
t.label,
t.isCustom ? " ★" : "")))),
React.createElement(TestInstrumentsHint, { templateId: templateId }),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "N\u00B0 Rapporto"),
React.createElement("input", { value: f.reportNumber, onChange: sv("reportNumber"), placeholder: "VF-2026-001", style: INP })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Data verifica"),
React.createElement("input", { type: "date", value: f.date, onChange: sv("date"), style: INP })),
React.createElement("div", { style: FLD },
React.createElement(TecnicoPicker, { label: "Tecnico/i", value: f.technician, onChange: v => setF(x => (Object.assign(Object.assign({}, x), { technician: v }))), technicians: technicians })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Tipo verifica"),
React.createElement("select", { value: f.verifyType || "periodica", onChange: sv("verifyType"), style: INP },
React.createElement("option", { value: "periodica" }, "Periodica programmata"),
React.createElement("option", { value: "dopo riparazione" }, "Dopo riparazione"),
React.createElement("option", { value: "prima messa in servizio" }, "Prima messa in servizio"),
React.createElement("option", { value: "straordinaria" }, "Straordinaria")),
(f.verifyType === "straordinaria") && React.createElement("span", { style: { fontSize: 10, color: "#f59e0b", marginTop: 3 } }, "\u26A0 Straordinaria: non aggiorna la pianificazione annuale")),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Strumento/tester utilizzato"),
(instruments && instruments.length > 0) && (React.createElement("select", { value: "", onChange: e => { const ins = (instruments || []).find(i => i.id === e.target.value); if (ins) {
const txt = [ins.brand, ins.model].filter(Boolean).join(" ") + (ins.internalCode ? (" (" + ins.internalCode + ")") : "");
setF(x => (Object.assign(Object.assign({}, x), { instrument: txt, instrumentSerial: ins.serial || "", instrumentCalExpiry: ins.calExpiry || "" })));
} }, style: Object.assign(Object.assign({}, INP), { marginBottom: 6 }) },
React.createElement("option", { value: "" }, "\u2014 Scegli tra i tuoi strumenti \u2014"),
(instruments || []).map(i => React.createElement("option", { key: i.id, value: i.id },
[i.brand, i.model].filter(Boolean).join(" "),
i.internalCode ? (" · " + i.internalCode) : "",
i.calExpiry ? (" (scad. " + i.calExpiry + ")") : "")))),
React.createElement("input", { value: f.instrument, onChange: sv("instrument"), placeholder: "o scrivi a mano", style: INP }))),
React.createElement("div", { style: { background: "var(--bg)", borderRadius: 8, padding: "10px 14px", border: "1px solid var(--border-2)" } },
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 8 } }, "Stato verifica"),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 } },
React.createElement("button", { type: "button", onClick: () => setF(x => (Object.assign(Object.assign({}, x), { verifyStatus: "completata" }))), style: {
background: (f.verifyStatus || "completata") === "completata" ? "#22c55e22" : "var(--surface)",
border: "1px solid " + ((f.verifyStatus || "completata") === "completata" ? "#22c55e66" : "var(--border)"),
color: (f.verifyStatus || "completata") === "completata" ? "#22c55e" : "var(--text-2)",
borderRadius: 7, padding: "10px", cursor: "pointer", fontSize: 12, fontWeight: 700,
touchAction: "manipulation", WebkitTapHighlightColor: "transparent"
} }, "\u2713 Verifica completata"),
React.createElement("button", { type: "button", onClick: () => setF(x => (Object.assign(Object.assign({}, x), { verifyStatus: "non_disponibile" }))), style: {
background: f.verifyStatus === "non_disponibile" ? "#f59e0b22" : "var(--surface)",
border: "1px solid " + (f.verifyStatus === "non_disponibile" ? "#f59e0b66" : "var(--border)"),
color: f.verifyStatus === "non_disponibile" ? "#f59e0b" : "var(--text-2)",
borderRadius: 7, padding: "10px", cursor: "pointer", fontSize: 12, fontWeight: 700,
touchAction: "manipulation", WebkitTapHighlightColor: "transparent"
} }, "\u26A0 Apparecchio non disponibile")),
f.verifyStatus === "non_disponibile" && (React.createElement("div", { style: { marginTop: 10, padding: "10px 12px", background: "#f59e0b08", border: "1px solid #f59e0b33", borderRadius: 6, fontSize: 11, color: "#fbbf24" } }, "La verifica non sar\u00E0 eseguita. Sar\u00E0 generato un report di mancata esecuzione da far firmare al reparto."))),
f.verifyStatus === "non_disponibile" ? (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement("div", { style: { background: "#f59e0b08", border: "1px solid #f59e0b44", borderRadius: 10, padding: "14px 16px" } },
React.createElement("div", { style: { fontSize: 11, color: "#f59e0b", textTransform: "uppercase", letterSpacing: .8, fontWeight: 800, marginBottom: 10 } }, "\u26A0 Apparecchio non disponibile per verifica"),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Motivo mancata esecuzione *"),
React.createElement("select", { value: f.notAvailableReason || "", onChange: sv("notAvailableReason"), style: INP },
React.createElement("option", { value: "" }, "\u2014 Seleziona \u2014"),
React.createElement("option", { value: "in_uso" }, "Apparecchio in uso su paziente"),
React.createElement("option", { value: "non_trovato" }, "Apparecchio non reperibile in reparto"),
React.createElement("option", { value: "trasferito" }, "Apparecchio trasferito ad altro reparto"),
React.createElement("option", { value: "riparazione_esterna" }, "In riparazione esterna"),
React.createElement("option", { value: "dismesso" }, "Dismesso / non pi\u00F9 in uso"),
React.createElement("option", { value: "rifiuto_reparto" }, "Reparto non autorizza intervento ora"),
React.createElement("option", { value: "altro" }, "Altro (specificare nelle note)"))),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 } },
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Reparto / Unit\u00E0 operativa *"),
React.createElement("input", { value: f.departmentName || "", onChange: sv("departmentName"), placeholder: "es. UO Cardiologia", style: INP })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Referente reparto"),
React.createElement("input", { value: f.departmentContact || "", onChange: sv("departmentContact"), placeholder: "es. Caposala Mario Rossi", style: INP }))),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Note aggiuntive"),
React.createElement("textarea", { value: f.notes, onChange: sv("notes"), rows: 2, style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 11px", color: "var(--text)", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" } })))),
React.createElement("div", { style: { background: "var(--surface)", borderRadius: 10, padding: "12px 16px", border: "1px solid var(--border-2)" } },
React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 800, marginBottom: 10 } }, "Firme"),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 } },
React.createElement(SignaturePad, { label: "Firma Tecnico verificatore", value: f.technicianSignature || "", onChange: v => setF(x => (Object.assign(Object.assign({}, x), { technicianSignature: v }))), height: 120 }),
React.createElement(SignaturePad, { label: "Firma Referente reparto (presa visione)", value: f.departmentSignature || "", onChange: v => setF(x => (Object.assign(Object.assign({}, x), { departmentSignature: v }))), height: 120 }))))) : (React.createElement(React.Fragment, null,
tpl.sections.map(sec => {
const isNA = sd_isNA(sec.id);
return (React.createElement("div", { key: sec.id, style: { background: "var(--card)", borderRadius: 10, padding: "12px 16px", border: "1px solid " + (isNA ? "var(--text-4)" : "var(--border-3)"), opacity: isNA ? 0.6 : 1 } },
React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: sec.note ? 4 : 10 } },
React.createElement("div", { style: { fontSize: 11, color: isNA ? "var(--text-3)" : "#5eead4", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, textDecoration: isNA ? "line-through" : "none" } },
sec.title,
isNA && " (N/A)"),
!tpl.requireAllItems && React.createElement("button", { title: isNA ? "Riabilita sezione" : "Marca tutta la sezione come Non Applicabile", onClick: () => setSectionNA(sec.id, !isNA), style: {
background: isNA ? "#64748b22" : "var(--surface)",
border: "1px solid " + (isNA ? "#64748b66" : "var(--border)"),
color: isNA ? "var(--text-2)" : "var(--text-3)",
borderRadius: 5, padding: "3px 8px", cursor: "pointer", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap",
touchAction: "manipulation", WebkitTapHighlightColor: "transparent"
} }, isNA ? "↻ Riabilita" : "N/A sez.")),
sec.note && React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", marginBottom: 10, fontStyle: "italic", whiteSpace: "pre-line" } }, sec.note),
!isNA && (sec.items || []).map(item => renderItemRow({ secId: sec.id, item })),
!isNA && (sec.measures || []).length > 0 && (React.createElement("div", { style: { marginTop: (sec.items || []).length > 0 ? 10 : 0 } },
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 90px 60px 38px 30px", gap: 6, marginBottom: 6 } }, ["Misura", "Atteso", "Valore", "U.M.", ""].map((h, i) => React.createElement("div", { key: i, style: { fontSize: 9.5, color: "var(--text-2)", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 } }, h))),
(sec.measures || []).map(m => renderMeasureRow({ secId: sec.id, m }))))));
}),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Note e osservazioni"),
React.createElement("textarea", { value: f.notes, onChange: sv("notes"), rows: 3, style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 11px", color: "var(--text)", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box", resize: "vertical" } })),
React.createElement("div", { style: { background: "var(--surface)", borderRadius: 10, padding: "12px 16px", border: "1px solid var(--border-2)" } },
React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 800, marginBottom: 10 } }, "Firme"),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 } },
React.createElement(SignaturePad, { label: "Firma Tecnico verificatore", value: f.technicianSignature || "", onChange: v => setF(x => (Object.assign(Object.assign({}, x), { technicianSignature: v }))), height: 120 }),
React.createElement(SignaturePad, { label: "Firma Referente reparto (opzionale)", value: f.departmentSignature || "", onChange: v => setF(x => (Object.assign(Object.assign({}, x), { departmentSignature: v }))), height: 120 })),
React.createElement("div", { style: { marginTop: 8, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 } },
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Reparto / Unit\u00E0 (opzionale)"),
React.createElement("input", { value: f.departmentName || "", onChange: sv("departmentName"), placeholder: "es. UO Cardiologia", style: INP })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Referente (opzionale)"),
React.createElement("input", { value: f.departmentContact || "", onChange: sv("departmentContact"), placeholder: "es. Caposala Rossi", style: INP })))))),
(function(){var frozen=!!f.locked;var _now=new Date().toISOString();var _validate=function(){var errs={};if(!f.assetId&&!selectedAssetId)errs.assetId="Seleziona un apparecchio";if(!f.date)errs.date="Inserisci la data";if(!f.technician)errs.technician="Inserisci il nome del tecnico";if(f.verifyStatus==="non_disponibile"){if(!f.notAvailableReason)errs.notAvailableReason="Seleziona il motivo della mancata esecuzione";if(!f.departmentName)errs.departmentName="Inserisci il nome del reparto";}setErrors(errs);return Object.keys(errs).length===0;};var _base=function(){return Object.assign(Object.assign({},f),{assetId:f.assetId||selectedAssetId,overallPass:f.verifyStatus==="non_disponibile"?null:pass,templateId:templateId});};var _saveDraft=function(){if(!_validate())return;onSave(_base());};var _conclude=function(){if(!_validate())return;var _miss=[];if(tpl.requireAllItems){for(var _si=0;_si<tpl.sections.length;_si++){var _sec=tpl.sections[_si];var _sd=(f.sections[_sec.id]||{items:{},measures:{}});var _its=_sec.items||[];for(var _ii=0;_ii<_its.length;_ii++){var _vv=_sd.items[_its[_ii].id];if(_vv!==true&&_vv!==false){if(_miss.indexOf(_sec.title)<0)_miss.push(_sec.title);}}}}if(_miss.length){showToast&&showToast("Completa tutti i controlli prima di concludere: "+_miss.join(", "),"#ef4444");return;}onSave(Object.assign(Object.assign({},_base()),{locked:true,concludedAt:_now,concludedBy:f.technician||"",auditLog:(f.auditLog||[]).concat([{action:"conclusione",at:_now,by:f.technician||""}])}));};var _reopen=function(){onSave(Object.assign(Object.assign({},_base()),{locked:false,auditLog:(f.auditLog||[]).concat([{action:"riapertura",at:_now,by:"admin"}])}));};return React.createElement("div",{style:{display:"flex",gap:10,justifyContent:"flex-end",flexWrap:"wrap"}},React.createElement(Btn,{variant:"ghost",onClick:onClose},"Chiudi"),(frozen&&!isAdmin)?null:(frozen&&isAdmin)?React.createElement(React.Fragment,null,React.createElement(Btn,{variant:"ghost",onClick:_reopen},"Riapri verifica"),React.createElement(Btn,{onClick:_saveDraft},"Salva modifiche")):React.createElement(React.Fragment,null,React.createElement(Btn,{variant:"ghost",onClick:_saveDraft},"Salva bozza"),React.createElement(Btn,{onClick:_conclude},"Concludi e blocca")));})()));
}
export function IecWizardForm({ initial, assetId: propAssetId, assets, customers, existingReports, instruments, technicians, onSave, onClose, isAdmin, onClassic }) {
const h = React.createElement;
const TEAL = "#2dd4bf", RED = "#ef4444";
const blank = { id: "R" + Date.now().toString().slice(-6), reportNumber: "", norm: "62353", date: new Date().toISOString().slice(0, 10), technician: "", instrument: "", instrumentSerial: "", instrumentCalExpiry: "", calNumber: "", verifyType: "periodica", equipClass: "I", equipType: "", assetId: propAssetId || "", patientType: "BF", leakageMethod: "diretto", sfc: true, fixedInstall: false, visual: { housing: null, cable: null, connectors: null, labels: null, docs: null }, measures: [], notes: "", overallPass: false, verifyStatus: "completata", notAvailableReason: "", departmentName: "", departmentContact: "", technicianSignature: "", departmentSignature: "" };
const [f, setF] = React.useState(() => {
const init = Object.assign({}, blank, initial || {});
if (!initial) {
const ast = (assets || []).find(a => a.id === (propAssetId || init.assetId));
if (ast) { if (ast.iecClass) init.equipClass = ast.iecClass; if (ast.patientType) init.patientType = ast.patientType; if (ast.iecNorm) init.norm = ast.iecNorm; if (ast.fixedInstall) init.fixedInstall = true; }
if (!init.reportNumber) init.reportNumber = (typeof getNextReportNumber === "function") ? getNextReportNumber(existingReports || [], "VSE") : init.id;
}
init.measures = (init.measures && init.measures.length) ? init.measures : iecGetMeasures(init.norm, init.equipClass, init.patientType, init.leakageMethod, init.sfc !== false, init.fixedInstall);
init.visual = init.visual || { housing: null, cable: null, connectors: null, labels: null, docs: null };
return init;
});
const [step, setStep] = React.useState(0);
const [tutOpen, setTutOpen] = React.useState(false);

const regen = (patch) => setF(x => {
const nx = Object.assign({}, x, patch);
const fresh = iecGetMeasures(nx.norm, nx.equipClass, nx.patientType, nx.leakageMethod, nx.sfc !== false, nx.fixedInstall);
const merged = fresh.map(mm => { const old = (x.measures || []).find(o => o.id === mm.id); return old ? Object.assign({}, mm, { value: old.value, na: old.na }) : mm; });
return Object.assign(nx, { measures: merged });
});
const setMeas = (id, val) => setF(x => Object.assign({}, x, { measures: x.measures.map(mm => mm.id === id ? Object.assign({}, mm, { value: val, na: false }) : mm) }));
const toggleNA = (id) => setF(x => Object.assign({}, x, { measures: x.measures.map(mm => mm.id === id ? Object.assign({}, mm, { na: !mm.na, value: "" }) : mm) }));
const setVis = (k, v) => setF(x => Object.assign({}, x, { visual: Object.assign({}, x.visual, { [k]: v }) }));

const measVerdict = (mm) => { if (mm.na) return null; if (mm.value === "" || mm.value == null) return null; var v = parseFloat(mm.value); if (isNaN(v)) return null; var hasMin = mm.limitMin !== undefined && mm.limitMin !== null; var hasMax = mm.limitVal !== undefined && mm.limitVal !== null; if (!hasMin && !hasMax) return null; if (hasMin && v < parseFloat(mm.limitMin)) return false; if (hasMax) { var lv = parseFloat(mm.limitVal); if (mm.invertPass) { if (v < lv) return false; } else { if (v > lv) return false; } } return true; };
const measFilled = (mm) => mm.na || (mm.value !== "" && mm.value != null && !isNaN(parseFloat(mm.value)));
const visKeys = [["housing", "Involucro / carcassa integri"], ["cable", "Cavo di rete e spina integri"], ["connectors", "Connettori e cavi paziente a posto"], ["labels", "Etichette e marcatura CE leggibili"], ["docs", "Documentazione / istruzioni disponibili"]];
const visFilled = visKeys.every(([k]) => f.visual[k] === true || f.visual[k] === false);
const overall = (function () { const visBad = visKeys.some(([k]) => f.visual[k] === false); if (visBad) return false; const bad = (f.measures || []).some(mm => measVerdict(mm) === false); return !bad; })();

const steps = [{ key: "setup", name: "Dati e configurazione" }, { key: "visiva", name: "Ispezione visiva" }].concat((f.measures || []).map((mm, i) => ({ key: "meas", idx: i, m: mm, name: mm.name }))).concat([{ key: "esito", name: "Esito e salvataggio" }]);
const TOT = steps.length;
const cur = Math.min(step, TOT - 1);
const sObj = steps[cur];
const ast = (assets || []).find(a => a.id === f.assetId);

const stepFilled = (st) => { if (st.key === "setup") return !!f.assetId; if (st.key === "visiva") return visFilled; if (st.key === "meas") return measFilled(st.m); return true; };
const doneCount = steps.filter(st => stepFilled(st)).length;
const go = (i) => { setStep(Math.max(0, Math.min(TOT - 1, i))); setTutOpen(false); try { window.scrollTo(0, 0); } catch (e) { } };
const doSave = () => { if (!f.assetId) return; onSave(Object.assign({}, f, { overallPass: overall })); };

const selStyle = { width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "9px 11px", fontSize: 13 };
const lblStyle = { fontSize: 11, fontWeight: 600, color: "var(--text-3)", marginBottom: 4, display: "block" };

// --- step content ---
let content;
if (sObj.key === "setup") {
content = h("div", { style: { display: "flex", flexDirection: "column", gap: 12 } },
h("div", null, h("span", { style: lblStyle }, "Apparecchio"),
h(AssetCombobox, { value: f.assetId, onChange: id => setF(x => Object.assign({}, x, { assetId: id })), assets: assets, customers: customers, placeholder: "Cerca apparecchio…" })),
h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } },
h("div", null, h("span", { style: lblStyle }, "Norma"),
h("select", { value: f.norm, onChange: e => regen({ norm: e.target.value }), style: selStyle },
h("option", { value: "62353" }, "IEC 62353 (elettromedicale)"),
h("option", { value: "60601" }, "IEC 60601-1 (approfondita)"),
h("option", { value: "61010" }, "IEC 61010-1 (laboratorio)"))),
h("div", null, h("span", { style: lblStyle }, "Classe"),
h("select", { value: f.equipClass, onChange: e => regen({ equipClass: e.target.value }), style: selStyle },
h("option", { value: "I" }, "Classe I"), h("option", { value: "II" }, "Classe II"), h("option", { value: "III" }, "Classe III"))),
h("div", null, h("span", { style: lblStyle }, "Parte applicata"),
h("select", { value: f.patientType, onChange: e => regen({ patientType: e.target.value }), style: selStyle },
h("option", { value: "B" }, "Tipo B"), h("option", { value: "BF" }, "Tipo BF"), h("option", { value: "CF" }, "Tipo CF"))),
f.norm === "62353" ? h("div", null, h("span", { style: lblStyle }, "Metodo"),
h("select", { value: f.leakageMethod, onChange: e => regen({ leakageMethod: e.target.value }), style: selStyle },
h("option", { value: "diretto" }, "Diretto"), h("option", { value: "differenziale" }, "Differenziale"), h("option", { value: "alternativo" }, "Alternativo"))) : h("div")),
h("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
chkRow(f.sfc !== false, () => regen({ sfc: f.sfc === false }), "Includi prove SFC (guasto singolo)", "Aggiunge le misure in condizione di primo guasto"),
chkRow(!!f.fixedInstall, () => regen({ fixedInstall: !f.fixedInstall }), "Installato in modo permanente", "Apparecchio fisso: la terra non si interrompe come primo guasto")),
h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } },
h("div", null, h("span", { style: lblStyle }, "Data verifica"),
h("input", { type: "date", value: f.date, onChange: e => setF(x => Object.assign({}, x, { date: e.target.value })), style: selStyle })),
h(TecnicoPicker, { label: "Tecnico/i", value: f.technician, onChange: v => setF(x => Object.assign({}, x, { technician: v })), technicians: technicians })),
(instruments && instruments.length) ? h("div", null, h("span", { style: lblStyle }, "Strumento di misura"),
h("select", { value: f.instrument, onChange: e => setF(x => Object.assign({}, x, { instrument: e.target.value })), style: selStyle },
h("option", { value: "" }, "— nessuno —"),
instruments.map(it => { const t = [it.brand, it.model].filter(Boolean).join(" ") + (it.internalCode ? (" (" + it.internalCode + ")") : ""); return h("option", { key: it.id || t, value: t }, t); }))) : null,
onClassic ? h("button", { type: "button", onClick: onClassic, style: { background: "transparent", border: "none", color: "var(--text-4)", fontSize: 11.5, textDecoration: "underline", cursor: "pointer", alignSelf: "flex-start", padding: "4px 0", marginTop: 2 } }, "Apparecchio non disponibile o serve il modulo classico →") : null);
} else if (sObj.key === "visiva") {
content = h("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
visKeys.map(([k, label]) => h("div", { key: k, style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, background: "var(--surface)", border: "1px solid " + (f.visual[k] === true ? TEAL + "66" : f.visual[k] === false ? RED + "66" : "var(--border)"), borderRadius: 12, padding: "12px 14px" } },
h("span", { style: { fontSize: 13.5, color: "var(--text)", flex: 1 } }, label),
h("div", { style: { display: "flex", gap: 6 } },
h("button", { type: "button", onClick: () => setVis(k, true), style: { background: f.visual[k] === true ? TEAL : "var(--surface-2)", color: f.visual[k] === true ? "#04201C" : "var(--text-3)", border: "1px solid " + (f.visual[k] === true ? TEAL : "var(--border)"), borderRadius: 8, padding: "7px 12px", fontWeight: 700, fontSize: 12.5, cursor: "pointer" } }, "✓ OK"),
h("button", { type: "button", onClick: () => setVis(k, false), style: { background: f.visual[k] === false ? RED : "var(--surface-2)", color: f.visual[k] === false ? "#fff" : "var(--text-3)", border: "1px solid " + (f.visual[k] === false ? RED : "var(--border)"), borderRadius: 8, padding: "7px 12px", fontWeight: 700, fontSize: 12.5, cursor: "pointer" } }, "✗ NO")))));
} else if (sObj.key === "meas") {
const mm = f.measures[sObj.idx];
const verd = measVerdict(mm);
const v = parseFloat(mm.value), lv = parseFloat(mm.limitVal);
const margin = (!isNaN(v) && !isNaN(lv)) ? Math.abs(lv - v) : null;
const marginTxt = margin == null ? "—" : (verd === false ? "−" : "") + margin.toFixed(margin < 1 ? 3 : (margin < 10 ? 2 : 0)) + " " + mm.unit;
content = h("div", { style: { display: "flex", flexDirection: "column", gap: 0 } },
h("div", { style: { background: "var(--surface)", border: "1px solid " + (mm.na ? "var(--border)" : verd === true ? TEAL : verd === false ? RED : "var(--border)"), borderRadius: 16, padding: "18px", marginBottom: 12, opacity: mm.na ? 0.6 : 1 } },
h("div", { style: { fontSize: 11, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10 } }, "Valore rilevato"),
h("div", { style: { display: "flex", alignItems: "center", gap: 10, borderBottom: "2px solid var(--border)", paddingBottom: 8 } },
h("input", { type: "number", inputMode: "decimal", disabled: mm.na, value: mm.value, onChange: e => setMeas(mm.id, e.target.value), placeholder: "—", style: { flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: 30, fontWeight: 800, fontFamily: "'IBM Plex Mono', monospace" } }),
h("span", { style: { fontSize: 17, fontWeight: 700, color: "var(--text-3)" } }, mm.unit)),
h("div", { style: { marginTop: 10, fontSize: 13, fontWeight: 700, color: mm.na ? "var(--text-4)" : verd === true ? TEAL : verd === false ? RED : "var(--text-4)" } }, mm.na ? "Non applicabile" : verd === true ? "✓ Entro i limiti" : verd === false ? "✗ Fuori limite" : "Inserisci il valore misurato"),
h("div", { style: { display: "flex", gap: 10, marginTop: 12 } },
h("div", { style: { flex: 1, background: "var(--surface-2)", borderRadius: 8, padding: "8px 10px" } }, h("div", { style: { fontSize: 10, color: "var(--text-4)", marginBottom: 2 } }, "Limite normativo"), h("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--text-2)", fontFamily: "'IBM Plex Mono', monospace" } }, mm.limit + " " + mm.unit)),
h("div", { style: { flex: 1, background: "var(--surface-2)", borderRadius: 8, padding: "8px 10px" } }, h("div", { style: { fontSize: 10, color: "var(--text-4)", marginBottom: 2 } }, "Margine"), h("div", { style: { fontSize: 13, fontWeight: 700, color: verd === false ? RED : "var(--text-2)", fontFamily: "'IBM Plex Mono', monospace" } }, marginTxt)))),
h("label", { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--text-3)", cursor: "pointer", marginBottom: 10 } },
h("input", { type: "checkbox", checked: !!mm.na, onChange: () => toggleNA(mm.id) }), "Non applicabile a questo apparecchio (N/A)"),
h("button", { type: "button", onClick: () => setTutOpen(o => !o), style: { display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "11px 14px", color: "var(--text-2)", fontSize: 12.5, fontWeight: 600, cursor: "pointer" } }, h("span", null, "Come mi collego"), h("span", { style: { color: TEAL, transform: tutOpen ? "rotate(90deg)" : "none", transition: "transform .15s" } }, "›")),
tutOpen ? h("div", { style: { background: "var(--surface)", border: "1px solid var(--border)", borderTop: "none", borderRadius: "0 0 10px 10px", padding: "12px 14px", marginTop: -4 } },
["Spegni e scollega l'apparecchio dalla rete.", "Collega le sonde del tester secondo la misura (PE su masse, parte applicata, ecc.).", "Avvia la misura e attendi il valore stabile, poi trascrivilo."].map((t, i) => h("div", { key: i, style: { fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.6, paddingLeft: 18, position: "relative", marginBottom: 4 } }, h("span", { style: { position: "absolute", left: 0, color: TEAL, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" } }, (i + 1) + "."), t))) : null);
} else {
// esito
const incomplete = steps.some(st => (st.key === "meas" || st.key === "visiva" || st.key === "setup") && !stepFilled(st));
content = h("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
h("div", { style: { background: overall ? TEAL + "1a" : RED + "1a", border: "1px solid " + (overall ? TEAL + "66" : RED + "66"), borderRadius: 16, padding: "20px", textAlign: "center" } },
h("div", { style: { fontSize: 34, fontWeight: 800, color: overall ? TEAL : RED } }, overall ? "✓" : "✗"),
h("div", { style: { fontSize: 19, fontWeight: 800, color: "var(--text)", marginTop: 4 } }, overall ? "Conforme" : "Non conforme"),
h("div", { style: { fontSize: 12.5, color: "var(--text-3)", marginTop: 4 } }, incomplete ? "Attenzione: alcuni passi non sono ancora compilati" : "Tutte le prove eseguite secondo la norma selezionata")),
h("div", { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" } },
[["Apparecchio", ast ? ((ast.name || "") + (ast.assetCode ? " · " + ast.assetCode : "")) : "—"], ["Classe / Tipo", f.equipClass + " · " + f.patientType], ["Norma", f.norm === "61010" ? "IEC 61010-1" : f.norm === "60601" ? "IEC 60601-1" : "IEC 62353"], ["Tecnico", f.technician || "—"], ["Esito", overall ? "Conforme" : "Non conforme"]].map((r, i) => h("div", { key: i, style: { display: "flex", justifyContent: "space-between", gap: 10, padding: "10px 14px", borderBottom: i < 4 ? "1px solid var(--border-2)" : "none" } }, h("span", { style: { fontSize: 12, color: "var(--text-3)" } }, r[0]), h("span", { style: { fontSize: 12.5, fontWeight: 600, color: i === 4 ? (overall ? TEAL : RED) : "var(--text)" } }, r[1])))),
h("div", null, h("span", { style: lblStyle }, "Note conclusive"),
h("textarea", { value: f.notes, onChange: e => setF(x => Object.assign({}, x, { notes: e.target.value })), placeholder: "Annotazioni finali, raccomandazioni…", style: { width: "100%", minHeight: 70, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "10px", fontSize: 13, resize: "vertical", fontFamily: "inherit" } })));
}

// --- shell ---
return h("div", { style: { display: "flex", flexDirection: "column", gap: 0 } },
// progress header (informativo)
h("div", { style: { padding: "2px 2px 14px" } },
h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 } },
h("div", { style: { fontSize: 13.5, fontWeight: 700, color: "var(--text)" } }, "Passo ", cur + 1, " ", h("span", { style: { fontWeight: 500, color: "var(--text-3)" } }, "di " + TOT)),
h("div", { style: { fontSize: 11.5, color: "var(--text-3)" } }, doneCount + "/" + TOT + " compilati")),
h("div", { style: { height: 6, background: "var(--surface-2)", borderRadius: 99, overflow: "hidden" } }, h("div", { style: { height: "100%", width: Math.round((cur / (TOT - 1)) * 100) + "%", background: TEAL, borderRadius: 99, transition: "width .2s" } }))),
// step caption + title
h("div", { style: { marginBottom: 14 } },
sObj.key !== "meas" ? null : h("div", { style: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, fontWeight: 600, letterSpacing: "1px", color: TEAL, textTransform: "uppercase", marginBottom: 6 } }, "Misura " + (sObj.idx + 1) + " di " + (f.measures || []).length),
h("h2", { style: { fontSize: 20, fontWeight: 800, letterSpacing: "-.01em", lineHeight: 1.2, margin: "0 0 4px", color: "var(--text)" } }, sObj.key === "setup" ? "Dati e configurazione" : sObj.key === "visiva" ? "Ispezione visiva e meccanica" : sObj.key === "meas" ? sObj.m.name : "Esito della verifica"),
h("div", { style: { fontSize: 12.5, color: "var(--text-3)" } }, sObj.key === "setup" ? "Apparecchio, norma e parametri di prova" : sObj.key === "visiva" ? "Stato di cavo, spina, involucro, etichette" : sObj.key === "meas" ? ("Limite normativo " + sObj.m.limit + " " + sObj.m.unit) : "Giudizio complessivo e salvataggio")),
// content
content,
// footer: indietro chiaro + avanti/salva chiaro
h("div", { style: { display: "flex", gap: 10, marginTop: 18 } },
h("button", { type: "button", onClick: () => cur > 0 ? go(cur - 1) : onClose(), style: { display: "flex", alignItems: "center", gap: 5, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-2)", padding: "12px 18px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" } }, h("span", { style: { fontSize: 18, lineHeight: 1, marginTop: -1 } }, "‹"), cur > 0 ? "Indietro" : "Esci"),
cur < TOT - 1
? h("button", { type: "button", disabled: !stepFilled(sObj), onClick: () => { if (stepFilled(sObj)) go(cur + 1); }, style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: stepFilled(sObj) ? TEAL : "var(--surface-2)", border: "none", borderRadius: 10, color: stepFilled(sObj) ? "#04201C" : "var(--text-4)", padding: "12px 16px", fontSize: 14.5, fontWeight: 800, cursor: stepFilled(sObj) ? "pointer" : "not-allowed" } }, "Avanti", h("span", { style: { fontSize: 18, lineHeight: 1, marginTop: -1 } }, "›"))
: h("button", { type: "button", disabled: !f.assetId, onClick: doSave, style: { flex: 1, background: f.assetId ? TEAL : "var(--surface-2)", border: "none", borderRadius: 10, color: f.assetId ? "#04201C" : "var(--text-4)", padding: "12px 16px", fontSize: 14.5, fontWeight: 800, cursor: f.assetId ? "pointer" : "not-allowed" } }, "✓ Salva verifica")),
// motivo se Avanti è bloccato
(cur < TOT - 1 && !stepFilled(sObj)) ? h("div", { style: { fontSize: 11.5, color: "var(--text-4)", textAlign: "center", marginTop: 9 } }, sObj.key === "setup" ? "Seleziona l'apparecchio per continuare" : sObj.key === "visiva" ? "Segna tutte le voci (OK/NO) per continuare" : "Inserisci il valore o segna N/A per continuare") : null);
}
export function IECReportForm({ initial, assetId: propAssetId, assets, customers, existingReports, instruments, technicians, onSave, onClose, isAdmin }) {
const MEAS_TUTORIAL = {
encl: {
titolo: "Dispersione dell'involucro (touch current)",
passi: [
"Inserisci la SPINA del dispositivo nell'analizzatore: lo strumento lo alimenta e misura la corrente di ritorno (servono sempre due collegamenti).",
"Apparecchio acceso, nelle normali condizioni d'uso. Imposta l'analizzatore in modalità dispersione involucro / touch.",
"Con la sonda dell'analizzatore tocca le parti metalliche accessibili NON collegate a terra (carcassa, viti, connettori esterni, supporti).",
"Leggi la corrente: su apparecchio sano resta molto bassa. Limite ≤ 100 µA in condizione normale (NC)."
],
nota: "Due collegamenti: spina del MD nell'analizzatore + sonda sull'involucro. Sui fissi questa misura sostituisce l'equipment leakage; l'interruzione del PE non si simula come primo guasto (niente SFC sulla terra).",
svg: "encl"
},
pat: {
titolo: "Dispersione parte applicata (paziente)",
passi: [
"Inserisci la SPINA del dispositivo nell'analizzatore (anche qui servono due collegamenti).",
"Collega i terminali della parte applicata al morsetto P.A. Attenzione: ogni elettrodo è una parte applicata a sé (un ECG ne ha tanti). Raggruppa al morsetto i terminali della STESSA funzione.",
"Imposta il tipo corretto B / BF / CF (sull'etichetta dell'apparecchio). Le CF una funzione alla volta; le tipo B di solito non si misurano a parte.",
"Leggi e confronta col limite del tipo: BF ≤ 5000 µA, CF ≤ 50 µA. Il CF è molto più severo perché applicato al cuore."
],
nota: "Due collegamenti: spina del MD + terminali P.A. al morsetto. Su apparecchi con più parti applicate (es. ECG) si misura una funzione alla volta.",
svg: "pat"
},
ins_main: {
titolo: "Resistenza di isolamento — rete vs parti accessibili",
passi: [
"Apparecchio SPENTO e scollegato dalla rete. Interruttore d'accensione su ON (così la prova copre tutto il circuito di rete).",
"L'analizzatore applica 500 Vdc tra i conduttori di rete (fase+neutro uniti) e le parti accessibili / terra.",
"Leggi la resistenza in MΩ: più alta è, meglio è. Su Classe I limite ≥ 2 MΩ; su Classe II ≥ 7 MΩ (l'isolamento è l'UNICA protezione, quindi più severo).",
"Valori bassi = isolamento degradato: campanello d'allarme anche se le dispersioni sembrano a posto."
],
nota: "È una prova in tensione continua, non una dispersione. Si fa a macchina spenta. Alcuni costruttori la sconsigliano su elettronica sensibile: controlla i documenti d'accompagnamento.",
svg: "ins"
},
ins_pa: {
titolo: "Resistenza di isolamento — parte applicata vs rete",
passi: [
"Apparecchio spento. Collega insieme i terminali della parte applicata.",
"L'analizzatore applica 500 Vdc tra la parte applicata e i conduttori di rete.",
"Leggi in MΩ: limite ≥ 2 MΩ. Verifica la tenuta dell'isolamento tra paziente e rete.",
"Per parti applicate multiple (es. ECG) raggruppa per funzione, come per la dispersione."
],
nota: "Prova in continua a macchina spenta. Su elettronica sensibile, verifica prima i documenti del costruttore.",
svg: "ins"
},
id_eq: {
titolo: "Equipment leakage (dispersione d'apparecchio)",
passi: [
"Inserisci la SPINA del dispositivo nell'analizzatore (servono sempre due collegamenti).",
"Apparecchio acceso. L'analizzatore misura la dispersione TOTALE verso terra (somma di involucro, parti applicate e parte di rete).",
"Su Classe I limite ≤ 500 µA; su Classe II ≤ 100 µA (qui si chiama touch current perché non c'è terra di protezione).",
"Metodo diretto o differenziale; sui fissi vale l'avviso sul percorso di terra secondario."
],
nota: "Su Classe II non c'è PE: la protezione è tutta nell'isolamento, perciò il limite di dispersione è più severo (100 µA).",
svg: "encl"
}
};
function tutorialFor(id, fixed) {
if (id === "pe") {
return fixed ? {
titolo: "Resistenza di terra — apparecchio FISSO (point-to-point)",
passi: [
"L'apparecchio è cablato in rete: non c'è spina da inserire nell'analizzatore.",
"Inserisci un cavo nella presa AUX GROUND dell'analizzatore e portalo al PE dell'impianto (morsetto di terra del quadro/equipotenziale).",
"Con la sonda mobile tocca il nodo equipotenziale della macchina e ogni parte metallica accessibile.",
"L'analizzatore misura la resistenza TRA i due cavi (point-to-point). Misura più punti, tieni il valore più alto."
],
nota: "Limite dipendente dalla lunghezza del conduttore: su un fisso può superare 0,3 Ω (campo modificabile).",
svg: "pe_fixed"
} : {
titolo: "Resistenza conduttore di protezione (PE) — apparecchio MOBILE",
passi: [
"Inserisci la SPINA dell'apparecchio nella presa dell'analizzatore: così lo strumento accede al polo di terra del cavo.",
"Prendi la sonda mobile dell'analizzatore e appoggiala sul nodo equipotenziale dietro la macchina (e su ogni parte metallica accessibile).",
"L'analizzatore misura la resistenza dal cavo (spina) fino al punto toccato dalla sonda.",
"Misura più punti, non uno solo: tieni il valore PIÙ ALTO come risultato."
],
nota: "Corrente di prova ≥ 200 mA. Per apparecchio con cavo: fletti il cavo durante la misura, il valore non deve saltare.",
svg: "pe_mobile"
};
}
if (id === "encl") {
return fixed ? {
titolo: "Dispersione involucro — FISSO (point-to-point)",
passi: [
"L'apparecchio è cablato in rete e resta acceso, alimentato dalla SUA rete (non dall'analizzatore).",
"Puntale NERO (riferimento) sul nodo equipotenziale dell'impianto; puntale ROSSO sulle parti metalliche accessibili della macchina.",
"È il metodo DIRETTO point-to-point. Misura più punti; il limite touch resta ≤ 100 µA.",
"⚠ Attenzione al percorso di terra secondario: se la macchina è collegata a terra anche da struttura/cavo dati, la corrente può fluire da lì e darti una lettura ZERO ingannevole (apparecchio guasto che 'passa')."
],
nota: "Rimedio: scollega la terra secondaria (es. cavo dati) se puoi; se NON puoi rimuoverla, passa al metodo DIFFERENZIALE (non usa il modello da 1 kΩ e misura comunque la dispersione totale).",
svg: "encl_fixed"
} : MEAS_TUTORIAL.encl;
}
if (id === "id_pa" || id === "pat") {
return fixed ? {
titolo: "Dispersione parte applicata — FISSO (point-to-point)",
passi: [
"Apparecchio acceso e alimentato dalla sua rete. Puntale NERO sul nodo equipotenziale.",
"Puntale ROSSO sui terminali della parte applicata (raggruppati per funzione). Ogni elettrodo è una P.A. a sé: misura una funzione alla volta.",
"Limiti per tipo: BF ≤ 5000 µA, CF ≤ 50 µA.",
"⚠ Vale lo stesso avviso sul percorso di terra secondario: lettura troppo bassa può ingannare."
],
nota: "Se c'è terra secondaria non rimovibile, usa il metodo differenziale. Nota: molti apparecchi fissi (radiografici) non hanno parti applicate — in quel caso questa misura non si applica.",
svg: "pat_fixed"
} : MEAS_TUTORIAL.pat;
}
if (MEAS_TUTORIAL[id])
return MEAS_TUTORIAL[id];
for (const k of Object.keys(MEAS_TUTORIAL)) {
if (id && id.indexOf(k) === 0)
return MEAS_TUTORIAL[k];
}
return null;
}
function TutorialSVG({ kind }) {
const C = { fill: "#161c2b", stroke: "#37425e", dut: "#6678a0", ana: "#2dd4bf", red: "#f0584f", neu: "#d3dbf2", pa: "#b06cf2", txt: "var(--text)", sub: "var(--text-2)", faint: "#7e8aa8" };
const Card = ({ x, y, w, h, label, sub, tone }) => (React.createElement("g", null,
React.createElement("rect", { x: x, y: y, width: w, height: h, rx: 12, fill: C.fill, stroke: tone || C.stroke, strokeWidth: 1.8 }),
React.createElement("text", { x: x + w / 2, y: y + (sub ? h / 2 - 5 : h / 2 + 4), textAnchor: "middle", fill: C.txt, fontSize: 12, fontWeight: 700, fontFamily: "system-ui" }, label),
sub ? React.createElement("text", { x: x + w / 2, y: y + h / 2 + 13, textAnchor: "middle", fill: C.faint, fontSize: 9.5, fontFamily: "system-ui" }, sub) : null));
const Dot = ({ x, y, c }) => (React.createElement("g", null,
React.createElement("circle", { cx: x, cy: y, r: 7, fill: "none", stroke: c, strokeWidth: 1.4, opacity: 0.4 }),
React.createElement("circle", { cx: x, cy: y, r: 4, fill: c, stroke: "#0a0a0f", strokeWidth: 1 })));
const Wire = ({ d, c, flow }) => React.createElement("path", { d: d, stroke: c, strokeWidth: flow ? 3 : 2.5, fill: "none", strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: flow ? "6 7" : "none" }, flow ? React.createElement("animate", { attributeName: "stroke-dashoffset", from: "0", to: "-13", dur: "0.9s", repeatCount: "indefinite" }) : null);
const T = ({ x, y, t, a }) => React.createElement("text", { x: x, y: y, textAnchor: a || "middle", fill: C.sub, fontSize: 10, fontFamily: "system-ui" }, t);
const Leg = ({ x, y, c, t }) => (React.createElement("g", null,
React.createElement("rect", { x: x, y: y - 7, width: 16, height: 9, rx: 3, fill: c }),
React.createElement("text", { x: x + 23, y: y + 1.5, fill: C.faint, fontSize: 10.5, fontFamily: "system-ui" }, t)));
const Gnd = ({ x, y }) => (React.createElement("g", { stroke: C.neu, strokeWidth: 1.6, strokeLinecap: "round" },
React.createElement("line", { x1: x, y1: y - 8, x2: x, y2: y }),
React.createElement("line", { x1: x - 7, y1: y, x2: x + 7, y2: y }),
React.createElement("line", { x1: x - 4.5, y1: y + 3, x2: x + 4.5, y2: y + 3 }),
React.createElement("line", { x1: x - 2, y1: y + 6, x2: x + 2, y2: y + 6 })));
const MD = ({ x, y }) => (React.createElement("g", null,
React.createElement("rect", { x: x, y: y, width: 48, height: 18, rx: 5, fill: "#0e1422", stroke: C.red, strokeWidth: 1.2 }),
React.createElement("text", { x: x + 24, y: y + 12.5, textAnchor: "middle", fill: C.red, fontSize: 9.5, fontWeight: 700, fontFamily: "system-ui" }, "MD 1k\u03A9")));
const wrap = (h, kids) => React.createElement("svg", { viewBox: "0 0 340 " + h, style: { width: "100%", maxWidth: 340, height: "auto" } }, kids);
if (kind === "pe_mobile")
return wrap(215, [
React.createElement(Card, { key: "d", x: 20, y: 34, w: 130, h: 78, label: "Apparecchio", tone: C.dut }),
React.createElement(Card, { key: "a", x: 210, y: 34, w: 110, h: 78, label: "Analizzatore", tone: C.ana }),
React.createElement(Wire, { key: "w1", d: "M150 96 H210", c: C.red }),
React.createElement(T, { key: "t1", x: 180, y: 89, t: "spina \u2192 analizzatore" }),
React.createElement(Wire, { key: "w2", d: "M210 54 H150", c: C.neu, flow: true }),
React.createElement(Dot, { key: "dot", x: 150, y: 54, c: C.neu }),
React.createElement(Gnd, { key: "g", x: 131, y: 80 }),
React.createElement(T, { key: "t2", x: 150, y: 24, t: "equipotenziale / parti metalliche" }),
React.createElement(Leg, { key: "l1", x: 20, y: 188, c: C.red, t: "spina dell'apparecchio nell'analizzatore" }),
React.createElement(Leg, { key: "l2", x: 20, y: 206, c: C.neu, t: "sonda sull'equipotenziale (percorso di prova)" })
]);
if (kind === "pe_fixed")
return wrap(230, [
React.createElement(Card, { key: "d", x: 20, y: 34, w: 130, h: 78, label: "Apparecchio", sub: "(fisso)", tone: C.dut }),
React.createElement(Card, { key: "a", x: 210, y: 34, w: 110, h: 78, label: "Analizzatore", tone: C.ana }),
React.createElement(Wire, { key: "w2", d: "M210 54 H150", c: C.neu, flow: true }),
React.createElement(Dot, { key: "dot", x: 150, y: 54, c: C.neu }),
React.createElement(T, { key: "t2", x: 150, y: 24, t: "equipotenziale macchina" }),
React.createElement(Wire, { key: "w1", d: "M252 112 V188 H56 V172", c: C.red }),
React.createElement(Gnd, { key: "g", x: 56, y: 184 }),
React.createElement(T, { key: "t3", x: 72, y: 165, t: "PE impianto (quadro)", a: "start" }),
React.createElement(T, { key: "t4", x: 256, y: 128, t: "aux ground" }),
React.createElement(Leg, { key: "l1", x: 20, y: 210, c: C.red, t: "cavo AUX GROUND \u2192 PE impianto" }),
React.createElement(Leg, { key: "l2", x: 20, y: 226, c: C.neu, t: "sonda \u2192 equipotenziale macchina" })
]);
if (kind === "encl")
return wrap(215, [
React.createElement(Card, { key: "d", x: 20, y: 32, w: 140, h: 84, label: "Apparecchio", sub: "(acceso)", tone: C.dut }),
React.createElement(Card, { key: "a", x: 215, y: 32, w: 105, h: 84, label: "Analizzatore", tone: C.ana }),
React.createElement(MD, { key: "md", x: 243, y: 88 }),
React.createElement(Wire, { key: "w1", d: "M160 98 H215", c: C.red, flow: true }),
React.createElement(T, { key: "t1", x: 188, y: 91, t: "spina (via MD)" }),
React.createElement(Wire, { key: "w2", d: "M215 54 H160", c: C.neu, flow: true }),
React.createElement(Dot, { key: "dot", x: 160, y: 54, c: C.neu }),
React.createElement(T, { key: "t2", x: 156, y: 24, t: "involucro (parti non a terra)" }),
React.createElement(Leg, { key: "l1", x: 20, y: 190, c: C.red, t: "spina nell'analizzatore (corrente via MD)" }),
React.createElement(Leg, { key: "l2", x: 20, y: 207, c: C.neu, t: "sonda sull'involucro" })
]);
if (kind === "encl_fixed")
return wrap(215, [
React.createElement(Card, { key: "d", x: 20, y: 32, w: 140, h: 84, label: "Apparecchio", sub: "(fisso, su sua rete)", tone: C.dut }),
React.createElement(Card, { key: "a", x: 215, y: 32, w: 105, h: 84, label: "Analizzatore", tone: C.ana }),
React.createElement(Wire, { key: "w1", d: "M215 54 H160", c: C.red, flow: true }),
React.createElement(Dot, { key: "d1", x: 160, y: 54, c: C.red }),
React.createElement(T, { key: "t1", x: 150, y: 24, t: "ROSSO \u2192 involucro macchina" }),
React.createElement(Wire, { key: "w2", d: "M262 116 V186 H50 V160", c: C.neu }),
React.createElement(Dot, { key: "d2", x: 50, y: 160, c: C.neu }),
React.createElement(Gnd, { key: "g", x: 50, y: 176 }),
React.createElement(T, { key: "t2", x: 66, y: 154, t: "NERO \u2192 nodo equipotenziale", a: "start" }),
React.createElement(Leg, { key: "l1", x: 20, y: 207, c: C.red, t: "rosso sulla parte da misurare" })
]);
if (kind === "ins")
return wrap(195, [
React.createElement(Card, { key: "d", x: 20, y: 36, w: 140, h: 78, label: "Apparecchio", sub: "(SPENTO, scollegato)", tone: C.dut }),
React.createElement(Card, { key: "a", x: 215, y: 36, w: 105, h: 78, label: "Analizzatore", tone: C.ana }),
React.createElement(Wire, { key: "w1", d: "M160 62 H215", c: C.red }),
React.createElement(T, { key: "t1", x: 188, y: 55, t: "500 Vdc \u2192 rete" }),
React.createElement(Wire, { key: "w2", d: "M160 92 H215", c: C.neu }),
React.createElement(Dot, { key: "dot", x: 160, y: 92, c: C.neu }),
React.createElement(T, { key: "t2", x: 186, y: 106, t: "parti access. / terra" }),
React.createElement(Leg, { key: "l1", x: 20, y: 172, c: C.red, t: "500 Vdc applicati ai conduttori di rete" })
]);
if (kind === "pat_fixed")
return wrap(215, [
React.createElement(Card, { key: "d", x: 20, y: 32, w: 140, h: 84, label: "Apparecchio", sub: "(fisso)", tone: C.dut }),
React.createElement(Card, { key: "a", x: 215, y: 32, w: 105, h: 84, label: "Analizzatore", tone: C.ana }),
React.createElement(Wire, { key: "w1", d: "M215 50 H160", c: C.red, flow: true }),
React.createElement(Wire, { key: "w1b", d: "M215 68 H160", c: C.red, flow: true }),
React.createElement(Dot, { key: "d1", x: 160, y: 50, c: C.red }),
React.createElement(Dot, { key: "d2", x: 160, y: 68, c: C.red }),
React.createElement(T, { key: "t1", x: 150, y: 24, t: "ROSSO \u2192 parte applicata" }),
React.createElement(Wire, { key: "w2", d: "M262 116 V186 H50 V160", c: C.neu }),
React.createElement(Dot, { key: "d3", x: 50, y: 160, c: C.neu }),
React.createElement(Gnd, { key: "g", x: 50, y: 176 }),
React.createElement(T, { key: "t2", x: 66, y: 154, t: "NERO \u2192 nodo equipotenziale", a: "start" }),
React.createElement(Leg, { key: "l1", x: 20, y: 207, c: C.red, t: "rosso sui terminali P.A. (una funzione per volta)" })
]);
return wrap(235, [
React.createElement(Card, { key: "d", x: 20, y: 36, w: 130, h: 94, label: "Apparecchio", tone: C.dut }),
React.createElement(Card, { key: "a", x: 225, y: 36, w: 95, h: 94, label: "Analizzatore", tone: C.ana }),
React.createElement(MD, { key: "md", x: 248, y: 96 }),
React.createElement(Wire, { key: "w1", d: "M150 116 H225", c: C.red, flow: true }),
React.createElement(T, { key: "t1", x: 188, y: 109, t: "spina (via MD)" }),
React.createElement(Dot, { key: "p1", x: 150, y: 54, c: C.pa }),
React.createElement(Dot, { key: "p2", x: 150, y: 74, c: C.pa }),
React.createElement(Dot, { key: "p3", x: 150, y: 94, c: C.pa }),
React.createElement(Wire, { key: "wp1", d: "M150 54 Q196 54 225 64", c: C.pa, flow: true }),
React.createElement(Wire, { key: "wp2", d: "M150 74 H225", c: C.pa, flow: true }),
React.createElement(Wire, { key: "wp3", d: "M150 94 Q196 94 225 82", c: C.pa, flow: true }),
React.createElement(T, { key: "t2", x: 150, y: 26, t: "terminali stessa P.A. (es. elettrodi ECG)" }),
React.createElement(Leg, { key: "l1", x: 20, y: 208, c: C.red, t: "spina nell'analizzatore (corrente via MD)" }),
React.createElement(Leg, { key: "l2", x: 20, y: 225, c: C.pa, t: "terminali stessa funzione \u2192 morsetto P.A." })
]);
}
const getMeasures = React.useCallback((norm, cls, patientType, method, sfc, fixed) => {
if (norm === "61010")
return [
{ id: "pe", name: "Resistenza conduttore di protezione (PE)", unit: "Ω", limit: "≤ 0.1", limitVal: 0.1, value: "" },
{ id: "ins", name: "Resistenza di isolamento (500 Vdc)", unit: "MΩ", limit: "≥ 1", limitVal: 1, value: "", invertPass: true },
{ id: "id1", name: "Corrente di dispersione — carcassa", unit: "mA", limit: "≤ 3.5", limitVal: 3.5, value: "" },
{ id: "id2", name: "Corrente di dispersione — circuito prova", unit: "mA", limit: "≤ 0.5", limitVal: 0.5, value: "" },
];
if (norm === "60601") {
const pt60 = patientType || "BF";
const plNC = pt60 === "CF" ? 10 : 100;
const plSFC = pt60 === "CF" ? 50 : 500;
const mapVal = pt60 === "CF" ? 50 : 5000;
const arr = [];
if (cls === "I") {
arr.push({ id: "pe", name: "Resistenza conduttore di protezione (PE)", unit: "Ω", limit: "≤ 0.1", limitVal: 0.1, value: "" });
arr.push({ id: "earth_nc", name: "Dispersione verso terra (earth) — NC", unit: "µA", limit: "≤ 5000", limitVal: 5000, value: "" });
}
if (cls !== "III")
arr.push({ id: "encl_nc", name: "Dispersione involucro (touch) — NC", unit: "µA", limit: "≤ 100", limitVal: 100, value: "" });
arr.push({ id: "pat_nc", name: "Dispersione paziente " + pt60 + " — NC", unit: "µA", limit: "≤ " + plNC, limitVal: plNC, value: "" });
arr.push({ id: "aux_nc", name: "Corrente ausiliaria paziente " + pt60 + " — NC", unit: "µA", limit: "≤ " + plNC, limitVal: plNC, value: "" });
if (sfc) {
if (cls === "I")
arr.push({ id: "earth_sfc", name: "Dispersione verso terra (earth) — SFC", unit: "µA", limit: "≤ 10000", limitVal: 10000, value: "" });
if (cls !== "III")
arr.push({ id: "encl_sfc", name: "Dispersione involucro (touch) — SFC", unit: "µA", limit: "≤ 500", limitVal: 500, value: "" });
arr.push({ id: "pat_sfc", name: "Dispersione paziente " + pt60 + " — SFC", unit: "µA", limit: "≤ " + plSFC, limitVal: plSFC, value: "" });
arr.push({ id: "aux_sfc", name: "Corrente ausiliaria paziente " + pt60 + " — SFC", unit: "µA", limit: "≤ " + plSFC, limitVal: plSFC, value: "" });
if (pt60 !== "B")
arr.push({ id: "map_sfc", name: "Dispersione paziente — rete su PA (MAP) " + pt60 + " — SFC", unit: "µA", limit: "≤ " + mapVal, limitVal: mapVal, value: "" });
}
return arr;
}
const pt = patientType || "BF";
const m = method || "diretto";
const eqLim = {
"I": { diretto: 500, differenziale: 500, alternativo: 1000 },
"II": { diretto: 100, differenziale: 100, alternativo: 500 },
};
const eqVal = eqLim[cls] ? eqLim[cls][m] : 500;
const methodLabel = m === "diretto" ? "metodo diretto" : m === "differenziale" ? "metodo differenziale" : "metodo alternativo";
const methodShort = m === "diretto" ? "D" : m === "differenziale" ? "DIFF" : "ALT";
const apLim = {
"B": null,
"BF": { lim: "≤ 5000", val: 5000 },
"CF": { lim: "≤ 50", val: 50 },
};
const ap = apLim[pt];
if (cls === "III")
return [
{ id: "ins_pa", name: "Resistenza isolamento parte applicata — rete (500 Vdc)", unit: "MΩ", limit: "≥ 2", limitVal: 2, value: "", invertPass: true },
...(ap ? [{ id: "id_pa", name: "Dispersione parte applicata " + pt + " (" + methodLabel + ")", unit: "µA", limit: ap.lim, limitVal: ap.val, value: "" }] : []),
];
if (cls === "II")
return [
{ id: "ins_main", name: "Resistenza isolamento — rete vs accessibili (500 Vdc)", unit: "MΩ", limit: "≥ 7", limitVal: 7, value: "", invertPass: true },
{ id: "ins_pa", name: "Resistenza isolamento parte applicata — rete (500 Vdc)", unit: "MΩ", limit: "≥ 2", limitVal: 2, value: "", invertPass: true },
{ id: "id_eq", name: "Equipment Leakage Cl.II (" + methodLabel + ")", unit: "µA", limit: "≤ " + eqVal, limitVal: eqVal, value: "" },
...(ap ? [{ id: "id_pa", name: "Dispersione parte applicata " + pt + " (" + methodLabel + ")", unit: "µA", limit: ap.lim, limitVal: ap.val, value: "" }] : []),
];
if (fixed) {
return [
{ id: "pe", name: "Resistenza di terra → nodo equipotenziale", unit: "Ω", limit: "≤ 0.3", limitVal: 0.3, value: "", editableLimit: true },
{ id: "encl", name: "Dispersione involucro (touch) — parti non a terra", unit: "µA", limit: "≤ 100", limitVal: 100, value: "" },
...(ap ? [{ id: "id_pa", name: "Dispersione parte applicata " + pt + " (" + methodLabel + ")", unit: "µA", limit: ap.lim, limitVal: ap.val, value: "" }] : []),
];
}
return [
{ id: "pe", name: "Resistenza conduttore di protezione (PE)", unit: "Ω", limit: "≤ 0.3", limitVal: 0.3, value: "" },
{ id: "ins_main", name: "Resistenza isolamento — rete vs PE (500 Vdc)", unit: "MΩ", limit: "≥ 2", limitVal: 2, value: "", invertPass: true },
{ id: "ins_pa", name: "Resistenza isolamento parte applicata — rete (500 Vdc)", unit: "MΩ", limit: "≥ 2", limitVal: 2, value: "", invertPass: true },
{ id: "id_eq", name: "Equipment Leakage Cl.I (" + methodLabel + ")", unit: "µA", limit: "≤ " + eqVal, limitVal: eqVal, value: "" },
...(ap ? [{ id: "id_pa", name: "Dispersione parte applicata " + pt + " (" + methodLabel + ")", unit: "µA", limit: ap.lim, limitVal: ap.val, value: "" }] : []),
];
}, []);
const blank = { id: "R" + Date.now().toString().slice(-6), reportNumber: "", norm: "62353", date: new Date().toISOString().slice(0, 10),
technician: "", instrument: "", instrumentSerial: "", instrumentCalExpiry: "", calNumber: "", verifyType: "periodica",
equipClass: "I", equipType: "", assetId: propAssetId || "",
leakageMethod: "diretto", sfc: true, fixedInstall: false,
visual: { housing: null, cable: null, connectors: null, labels: null, docs: null },
measures: [], notes: "", overallPass: false,
verifyStatus: "completata",
notAvailableReason: "", departmentName: "", departmentContact: "",
technicianSignature: "", departmentSignature: "" };
const [f, setF] = React.useState(() => {
var _a;
const init = initial || blank;
if (!initial) {
const _ast = (assets || []).find(a => a.id === (propAssetId || init.assetId));
if (_ast) {
if (_ast.iecClass) init.equipClass = _ast.iecClass;
if (_ast.patientType) init.patientType = _ast.patientType;
if (_ast.iecNorm) init.norm = _ast.iecNorm;
if (_ast.fixedInstall) init.fixedInstall = true;
}
}
if (!initial && !init.reportNumber) {
init.reportNumber = getNextReportNumber(existingReports || [], "VSE");
}
if (!((_a = init.measures) === null || _a === void 0 ? void 0 : _a.length))
return Object.assign(Object.assign({}, init), { measures: getMeasures(init.norm || "62353", init.equipClass || "I", init.patientType || "BF", init.leakageMethod || "diretto", init.sfc !== false, init.fixedInstall), visual: init.visual || { housing: null, cable: null, connectors: null, labels: null, docs: null } });
return Object.assign(Object.assign({}, init), { visual: init.visual || { housing: null, cable: null, connectors: null, labels: null, docs: null } });
});
const [errors, setErrors] = React.useState({});
const sv = k => e => setF(x => (Object.assign(Object.assign({}, x), { [k]: e.target.value })));
const setVis = (k, v) => setF(x => (Object.assign(Object.assign({}, x), { visual: Object.assign(Object.assign({}, x.visual), { [k]: v }) })));
const setMeas = (id, val) => setF(x => (Object.assign(Object.assign({}, x), { measures: x.measures.map(m => m.id === id ? Object.assign(Object.assign({}, m), { value: val }) : m) })));
const isOptional = (id) => id === "ins_main" || id === "ins_pa";
const toggleNA = (id) => setF(x => (Object.assign(Object.assign({}, x), { measures: x.measures.map(m => m.id === id ? Object.assign(Object.assign({}, m), { na: !m.na, value: m.na ? m.value : "" }) : m) })));
const [tutorialOpen, setTutorialOpen] = React.useState(null);
const measuresBooted = React.useRef(false);
React.useEffect(() => {
if (!measuresBooted.current) {
measuresBooted.current = true;
return;
}
setF(x => {
const fresh = getMeasures(x.norm, x.equipClass, x.patientType, x.leakageMethod, x.sfc !== false, x.fixedInstall);
const merged = fresh.map(m => {
const old = (x.measures || []).find(o => o.id === m.id);
return old && old.value !== undefined && old.value !== "" ? Object.assign(Object.assign({}, m), { value: old.value }) : m;
});
return Object.assign(Object.assign({}, x), { measures: merged });
});
}, [f.norm, f.equipClass, f.patientType, f.leakageMethod, f.sfc, f.fixedInstall]);
const computePass = React.useCallback((measures, visual) => {
const mf = measures.some(m => { if (m.na)
return false; if (m.value === "" || m.value === undefined)
return false; const v = parseFloat(m.value); const lv = parseFloat(m.limitVal); if (isNaN(v) || isNaN(lv))
return false; return (m.limitMin != null && v < parseFloat(m.limitMin)) || (m.limitVal != null && (m.invertPass ? v < lv : v > lv)); });
const vf = Object.values(visual || {}).some(v => v === false);
return !mf && !vf;
}, []);
React.useEffect(() => { setF(x => (Object.assign(Object.assign({}, x), { overallPass: computePass(x.measures, x.visual) }))); }, [f.measures, f.visual]);
const asset = assets.find(a => a.id === (f.assetId || propAssetId));
const prevReport = React.useMemo(() => {
const aid = f.assetId || propAssetId;
if (!aid || !Array.isArray(existingReports))
return null;
const others = existingReports
.filter(r => r.assetId === aid && r.id !== f.id && r.date)
.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
return others[0] || null;
}, [f.assetId, propAssetId, f.id, existingReports]);
const prevValueOf = (mid) => {
if (!(prevReport === null || prevReport === void 0 ? void 0 : prevReport.measures))
return null;
const pm = prevReport.measures.find(x => x.id === mid);
return (pm && pm.value !== "" && pm.value !== undefined) ? pm.value : null;
};
const FLD = FORM_FLD;
const LBL = FORM_LBL;
const INP = FORM_INP;
const isMobile = useMedia("(max-width:600px)");
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement(ErrorSummary, { errors: errors }),
(f.locked ? React.createElement("div", { style: { background: "#22c55e14", border: "1px solid #22c55e55", borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 9, fontSize: 12.5 } }, React.createElement("span", { style: { fontSize: 15 } }, "\uD83D\uDD12"), React.createElement("span", { style: { color: "var(--text)" } }, "Verifica conclusa e bloccata", f.concludedAt ? (" il " + new Date(f.concludedAt).toLocaleDateString("it-IT")) : "", isAdmin ? " \u2014 come admin puoi riaprirla per correggere." : " \u2014 sola lettura (solo un admin pu\u00F2 riaprirla).")) : null),
React.createElement("div", { style: { background: f.overallPass ? "#22c55e1f" : "#ef44441f", border: `1px solid ${f.overallPass ? "#22c55e55" : "#ef444455"}`, borderRadius: 8, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 } },
React.createElement("span", { style: { fontSize: 11, color: "var(--text-2)" } },
"Norma: ",
React.createElement("strong", { style: { color: "var(--text)" } }, f.norm === "61010" ? "IEC 61010-1 (Lab)" : f.norm === "60601" ? "IEC 60601-1 (Approfondita)" : "IEC 62353 (Elettromedicale)")),
React.createElement("span", { style: { fontWeight: 900, fontSize: 15, letterSpacing: .3, color: f.overallPass ? "#04201C" : "#fff", background: f.overallPass ? "#2dd4bf" : "#ef4444", borderRadius: 6, padding: "5px 12px", whiteSpace: "nowrap" } }, f.overallPass ? "CONFORME" : "NON CONFORME")),
f.norm === "62353" && (React.createElement("div", { style: { background: "var(--bg)", border: "1px solid #2dd4bf44", borderRadius: 8, padding: "10px 14px", fontSize: 11, color: "var(--text-2)", lineHeight: 1.5 } },
React.createElement("div", { style: { color: "var(--acc-teal)", fontWeight: 700, marginBottom: 4, fontSize: 11 } }, "\u2139 IEC 62353:2014 \u2014 Limiti test periodico"),
React.createElement("div", null,
React.createElement("strong", { style: { color: "var(--text-strong)" } }, "Equipment Leakage:"),
" Cl.I \u2264500\u00B5A (D/DIFF) / \u22641000\u00B5A (ALT) \u00B7 Cl.II \u2264100\u00B5A / \u2264500\u00B5A"),
React.createElement("div", null,
React.createElement("strong", { style: { color: "var(--text-strong)" } }, "Applied Part Leakage:"),
" BF \u22645000\u00B5A \u00B7 CF \u226450\u00B5A (limite identico per i 3 metodi)"),
React.createElement("div", { style: { marginTop: 4, paddingTop: 4, borderTop: "1px solid #2dd4bf22", color: "var(--text-2)" } },
React.createElement("strong", { style: { color: "var(--text-strong)" } }, "Metodi:"),
" Diretto (apparecchio alimentato) \u00B7 Differenziale (somma vett. L-N) \u00B7 Alternativo (apparecchio scollegato)"),
React.createElement("div", null,
React.createElement("strong", { style: { color: "var(--text-strong)" } }, "PE Resistance:"),
" \u22640.3 \u03A9 \u00B7 ",
React.createElement("strong", { style: { color: "var(--text-strong)" } }, "Isolamento:"),
" \u22652 M\u03A9"))),
f.norm === "60601" && (React.createElement("div", { style: { background: "var(--bg)", border: "1px solid #2dd4bf44", borderRadius: 8, padding: "10px 14px", fontSize: 11, color: "var(--text-2)", lineHeight: 1.5 } },
React.createElement("div", { style: { color: "var(--acc-teal)", fontWeight: 700, marginBottom: 4, fontSize: 11 } }, "\u2139 IEC 60601-1 \u2014 Prova approfondita (NC + Primo Guasto)"),
React.createElement("div", null,
React.createElement("strong", { style: { color: "var(--text-strong)" } }, "Dispersione paziente:"),
" B/BF \u2264100\u00B5A (NC) / \u2264500\u00B5A (SFC) \u00B7 CF \u226410\u00B5A (NC) / \u226450\u00B5A (SFC)"),
React.createElement("div", null,
React.createElement("strong", { style: { color: "var(--text-strong)" } }, "Involucro:"),
" \u2264100\u00B5A (NC) / \u2264500\u00B5A (SFC) \u00B7 ",
React.createElement("strong", { style: { color: "var(--text-strong)" } }, "Terra:"),
" \u22645000\u00B5A (NC) / \u226410000\u00B5A (SFC, 3\u00AA ed.)"),
React.createElement("div", null,
React.createElement("strong", { style: { color: "var(--text-strong)" } }, "Rete su PA (MAP, solo SFC):"),
" BF \u22645000\u00B5A \u00B7 CF \u226450\u00B5A"),
React.createElement("div", { style: { marginTop: 4, paddingTop: 4, borderTop: "1px solid #2dd4bf22", color: "var(--text-2)" } },
"Le prove di ",
React.createElement("strong", { style: { color: "var(--text-strong)" } }, "Primo Guasto (SFC)"),
" sollecitano l'apparecchio: puoi disattivarle qui sotto."))),
!propAssetId && (React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Apparecchio"),
React.createElement(AssetCombobox, { value: f.assetId, onChange: id => setF(x => (Object.assign(Object.assign({}, x), { assetId: id }))), assets: assets, customers: customers, placeholder: "Cerca apparecchio\u2026" }))),
asset && React.createElement("div", { style: { background: "var(--surface)", borderRadius: 8, padding: "8px 14px", border: "1px solid var(--border-2)", fontSize: 12, color: "var(--text-2)" } },
React.createElement("strong", { style: { color: "var(--text)" } }, asset.name),
" \u00B7 ",
asset.brand,
" ",
asset.model,
" \u00B7 S/N: ",
asset.serial || "—"),
React.createElement("div", { style: { background: "var(--bg)", borderRadius: 8, padding: "10px 14px", border: "1px solid var(--border-2)" } },
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 8 } }, "Stato verifica"),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 } },
React.createElement("button", { type: "button", onClick: () => setF(x => (Object.assign(Object.assign({}, x), { verifyStatus: "completata" }))), style: {
background: f.verifyStatus === "completata" ? "#22c55e22" : "var(--surface)",
border: "1px solid " + (f.verifyStatus === "completata" ? "#22c55e66" : "var(--border)"),
color: f.verifyStatus === "completata" ? "var(--acc-green)" : "var(--text-2)",
borderRadius: 7, padding: "10px", cursor: "pointer", fontSize: 12, fontWeight: 700,
touchAction: "manipulation", WebkitTapHighlightColor: "transparent"
} }, "\u2713 Verifica completata"),
React.createElement("button", { type: "button", onClick: () => setF(x => (Object.assign(Object.assign({}, x), { verifyStatus: "non_disponibile" }))), style: {
background: f.verifyStatus === "non_disponibile" ? "#f59e0b22" : "var(--surface)",
border: "1px solid " + (f.verifyStatus === "non_disponibile" ? "#f59e0b66" : "var(--border)"),
color: f.verifyStatus === "non_disponibile" ? "var(--acc-amber)" : "var(--text-2)",
borderRadius: 7, padding: "10px", cursor: "pointer", fontSize: 12, fontWeight: 700,
touchAction: "manipulation", WebkitTapHighlightColor: "transparent"
} }, "\u26A0 Apparecchio non disponibile")),
f.verifyStatus === "non_disponibile" && (React.createElement("div", { style: { marginTop: 10, padding: "10px 12px", background: "#f59e0b08", border: "1px solid #f59e0b33", borderRadius: 6, fontSize: 11, color: "#fbbf24" } }, "La verifica non sar\u00E0 eseguita. Sar\u00E0 generato un report di mancata esecuzione da far firmare al reparto."))),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 13 } },
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "N\u00B0 Rapporto"),
React.createElement("input", { value: f.reportNumber, onChange: sv("reportNumber"), placeholder: "VSE-2026-001", style: INP })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Data"),
React.createElement("input", { type: "date", value: f.date, onChange: sv("date"), style: INP })),
React.createElement("div", { style: { gridColumn: "1 / -1" } }, React.createElement(TestInstrumentsHint, { templateId: cndToTemplate((asset || {}).cnd) || guessTemplate((asset || {}).name) || "generico" })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: Object.assign(Object.assign({}, LBL), { display: "flex", alignItems: "center" }) },
"Norma",
React.createElement(Hint, { text: "IEC 62353: verifiche periodiche e dopo riparazione su apparecchiature elettromedicali. IEC 61010-1: strumenti elettrici da misura, controllo e laboratorio. La scelta determina i parametri da misurare e i limiti di accettabilit\u00E0." })),
React.createElement("select", { value: f.norm, onChange: sv("norm"), style: INP },
React.createElement("option", { value: "62353" }, "IEC 62353 \u2014 Elettromedicale"),
React.createElement("option", { value: "61010" }, "IEC 61010-1 \u2014 Laboratorio"),
React.createElement("option", { value: "60601" }, "IEC 60601-1 \u2014 Prova approfondita (NC+SFC)"))),
React.createElement("div", { style: FLD },
React.createElement("label", { style: Object.assign(Object.assign({}, LBL), { display: "flex", alignItems: "center" }) },
"Classe apparecchio",
React.createElement(Hint, { text: "Classe di sicurezza elettrica (IEC 60601-1). Classe I: ha conduttore di protezione (PE/terra) \u2014 la carcassa \u00E8 collegata a terra (es. monitor, ventilatori). Classe II: doppio isolamento, niente PE, simbolo del quadrato dentro quadrato (es. piccoli apparecchi portatili). Classe III: alimentazione SELV a bassissima tensione di sicurezza, niente PE (es. apparecchi a batteria interna). La classe determina quali misure di sicurezza eseguire." })),
React.createElement("select", { value: f.equipClass, onChange: sv("equipClass"), style: INP },
React.createElement("option", { value: "I" }, "Classe I \u2014 Con PE (messa a terra)"),
React.createElement("option", { value: "II" }, "Classe II \u2014 Doppio isolamento (no PE)"),
React.createElement("option", { value: "III" }, "Classe III \u2014 SELV (alimentazione interna/sicura)")),
React.createElement("span", { style: { fontSize: 10, color: "var(--text-3)", marginTop: 3 } },
f.equipClass === "I" && "Misure: PE + isolamento + dispersione terra + dispersione paziente",
f.equipClass === "II" && "Misure: isolamento + dispersione carcassa + dispersione paziente (NO PE)",
f.equipClass === "III" && "Misure: isolamento + dispersione paziente soltanto (circuito SELV, NO terra)")),
f.norm !== "61010" && (React.createElement("div", { style: FLD },
React.createElement("label", { style: Object.assign(Object.assign({}, LBL), { display: "flex", alignItems: "center" }) },
"Tipo parte applicata (paziente)",
React.createElement(Hint, { text: "Definito dalla norma IEC 60601-1. B = contatto corpo non cardiaco, senza isolamento speciale (es. monitor temperatura cute). BF = parte applicata isolata floating, tipica di ECG, SpO2, ventilatori \u2014 soglia dispersione paziente 5000\u00B5A in condizioni di guasto. CF = applicazione cardiaca diretta (cateteri intracardiaci, cardiostimolatori) \u2014 limiti molto severi, dispersione paziente max 50\u00B5A. Il tipo \u00E8 indicato dal simbolo sulla targhetta dell'apparecchio." })),
React.createElement("select", { value: f.patientType || "BF", onChange: sv("patientType"), style: INP },
React.createElement("option", { value: "B" }, "Tipo B \u2014 Contatto corpo (no PA isolata)"),
React.createElement("option", { value: "BF" }, "Tipo BF \u2014 Parte isolata floating (PA \u2264 5000\u00B5A alt.)"),
React.createElement("option", { value: "CF" }, "Tipo CF \u2014 Applicazione cardiaca (PA \u2264 50\u00B5A)")),
React.createElement("span", { style: { fontSize: 10, color: "var(--text-3)", marginTop: 3 } },
(f.patientType || "BF") === "B" && "Tipo B: contatto diretto con paziente, non cardiaco",
(f.patientType || "BF") === "BF" && "Tipo BF: parte applicata isolata (es. ECG, SpO2)",
(f.patientType || "BF") === "CF" && "Tipo CF: applicazione cardiaca diretta — limiti più severi"))),
f.norm === "62353" && f.equipClass !== "III" && (React.createElement("div", { style: Object.assign(Object.assign({}, FLD), { gridColumn: "1 / -1", background: f.fixedInstall ? "#2dd4bf12" : "transparent", borderRadius: 8, padding: f.fixedInstall ? "8px 10px" : 0 }) },
React.createElement("label", { onClick: () => setF(x => (Object.assign(Object.assign({}, x), { fixedInstall: !x.fixedInstall }))), style: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" } },
React.createElement("span", { style: { width: 42, height: 24, borderRadius: 999, background: f.fixedInstall ? "#2dd4bf" : "var(--border)", position: "relative", transition: "background .15s", flexShrink: 0, display: "inline-block" } },
React.createElement("span", { style: { position: "absolute", top: 3, left: f.fixedInstall ? 21 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .15s", boxShadow: "0 1px 3px rgba(0,0,0,.4)" } })),
React.createElement("span", { style: { fontSize: 13, fontWeight: 600, color: f.fixedInstall ? "#5eead4" : "var(--text)" } },
"Apparecchio installato permanentemente",
f.fixedInstall ? " ✓" : ""),
React.createElement(Hint, { text: "Radiografico a muro, riunito cablato, ecc. \u2014 non scollegabile dalla rete. La verifica IEC 62353 si adatta: terra SOLO sul nodo equipotenziale (limite modificabile per la lunghezza), Equipment Leakage sostituito da dispersione d'involucro, interruzione PE non simulata come primo guasto." })),
f.fixedInstall && React.createElement("div", { style: { fontSize: 11, color: "#5eead4", marginTop: 6, marginLeft: 25 } }, "Misure adattate: terra su nodo equipotenziale, dispersione d'involucro al posto dell'equipment leakage."))),
f.norm === "62353" && f.equipClass !== "III" && (React.createElement("div", { style: FLD },
React.createElement("label", { style: Object.assign(Object.assign({}, LBL), { display: "flex", alignItems: "center" }) },
"Metodo di misura dispersione",
React.createElement(Hint, { text: "Metodi previsti da IEC 62353. DIRETTO: misurato tra le parti accessibili e la terra (pi\u00F9 rapido, classico). DIFFERENZIALE: misurato come differenza tra corrente in fase e neutro (limiti uguali al diretto). ALTERNATIVO: misurato con sorgente isolata 100-120V, separato dalla rete (sicuro per il tecnico, limiti pi\u00F9 alti \u2014 fino a 1000\u00B5A per Cl.I). Scegli in base allo strumento e alla situazione clinica." })),
React.createElement("select", { value: f.leakageMethod || "diretto", onChange: sv("leakageMethod"), style: INP },
React.createElement("option", { value: "diretto" }, "Diretto \u2014 misura corrente da PE verso terra"),
React.createElement("option", { value: "differenziale" }, "Differenziale \u2014 somma vettoriale L-N"),
React.createElement("option", { value: "alternativo" }, "Alternativo (sostituzione) \u2014 apparecchio scollegato")),
React.createElement("span", { style: { fontSize: 10, color: "var(--text-3)", marginTop: 3 } },
(f.leakageMethod || "diretto") === "diretto" && "Diretto: apparecchio alimentato, sonda tra carcassa e terra. Adatto a stanze con presa standard.",
(f.leakageMethod || "diretto") === "differenziale" && "Differenziale: misura la differenza tra L e N. Adatto a circuiti con isolamento o trasformatore.",
(f.leakageMethod || "diretto") === "alternativo" && "Alternativo: apparecchio scollegato, simula la corrente di guasto. Adatto a sale operatorie con RCD/IT."))),
f.norm === "60601" && (React.createElement("div", { style: FLD },
React.createElement("label", { style: Object.assign(Object.assign({}, LBL), { display: "flex", alignItems: "center" }) },
"Prove di Primo Guasto (SFC)",
React.createElement(Hint, { text: "Le prove in condizione di primo guasto (interruzione di un conduttore, terra aperta, rete sulla parte applicata) sono pi\u00F9 approfondite ma sollecitano l'apparecchio. Disattivale per eseguire solo la Condizione Normale (NC)." })),
React.createElement("button", { type: "button", onClick: () => setF(x => (Object.assign(Object.assign({}, x), { sfc: !(x.sfc !== false) }))), style: { display: "flex", alignItems: "center", gap: 10, background: "var(--surface)", border: "1px solid " + ((f.sfc !== false) ? "#2dd4bf66" : "var(--border)"), borderRadius: 7, padding: "10px 12px", cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } },
React.createElement("div", { style: { width: 38, height: 22, borderRadius: 11, background: (f.sfc !== false) ? "#2dd4bf" : "var(--border)", position: "relative", flexShrink: 0 } },
React.createElement("div", { style: { position: "absolute", top: 2, left: (f.sfc !== false) ? 18 : 2, width: 18, height: 18, borderRadius: 9, background: "#fff" } })),
React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: (f.sfc !== false) ? "#2dd4bf" : "var(--text-2)" } }, (f.sfc !== false) ? "Incluse (NC + SFC)" : "Escluse (solo NC)")),
React.createElement("span", { style: { fontSize: 10, color: "var(--text-3)", marginTop: 3 } }, (f.sfc !== false) ? "Verifica completa: condizione normale e primo guasto." : "Solo condizione normale — non sollecita l'apparecchio."))),
React.createElement("div", { style: FLD },
React.createElement(TecnicoPicker, { label: "Tecnico/i verificatore", value: f.technician, onChange: v => setF(x => (Object.assign(Object.assign({}, x), { technician: v }))), technicians: technicians })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Strumento di misura"),
(instruments && instruments.length > 0) && (React.createElement("select", { value: "", onChange: e => { const ins = (instruments || []).find(i => i.id === e.target.value); if (ins) {
const txt = [ins.brand, ins.model].filter(Boolean).join(" ") + (ins.internalCode ? (" (" + ins.internalCode + ")") : "");
setF(x => (Object.assign(Object.assign({}, x), { instrument: txt, instrumentSerial: ins.serial || "", instrumentCalExpiry: ins.calExpiry || "", calNumber: ins.certNumber || x.calNumber })));
} }, style: Object.assign(Object.assign({}, INP), { marginBottom: 6 }) },
React.createElement("option", { value: "" }, "\u2014 Scegli tra i tuoi strumenti \u2014"),
(instruments || []).map(i => React.createElement("option", { key: i.id, value: i.id },
[i.brand, i.model].filter(Boolean).join(" "),
i.internalCode ? (" · " + i.internalCode) : "",
i.calExpiry ? (" (scad. " + i.calExpiry + ")") : "")))),
React.createElement("input", { value: f.instrument, onChange: sv("instrument"), placeholder: "o scrivi a mano", style: INP })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "N\u00B0 calibrazione"),
React.createElement("input", { value: f.calNumber, onChange: sv("calNumber"), style: INP })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Tipo verifica"),
React.createElement("select", { value: f.verifyType, onChange: sv("verifyType"), style: INP }, ["periodica", "dopo riparazione", "prima messa in servizio", "straordinaria"].map(v => React.createElement("option", { key: v }, v))),
f.verifyType === "straordinaria" && React.createElement("span", { style: { fontSize: 10, color: "#f59e0b", marginTop: 3 } }, "\u26A0 Straordinaria: non aggiorna la pianificazione annuale"))),
f.verifyStatus === "non_disponibile" ? (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement("div", { style: { background: "#f59e0b08", border: "1px solid #f59e0b44", borderRadius: 10, padding: "14px 16px" } },
React.createElement("div", { style: { fontSize: 11, color: "#f59e0b", textTransform: "uppercase", letterSpacing: .8, fontWeight: 800, marginBottom: 10 } }, "\u26A0 Apparecchio non disponibile per verifica"),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Motivo mancata esecuzione *"),
React.createElement("select", { value: f.notAvailableReason, onChange: sv("notAvailableReason"), style: INP },
React.createElement("option", { value: "" }, "\u2014 Seleziona \u2014"),
React.createElement("option", { value: "in_uso" }, "Apparecchio in uso su paziente"),
React.createElement("option", { value: "non_trovato" }, "Apparecchio non reperibile in reparto"),
React.createElement("option", { value: "trasferito" }, "Apparecchio trasferito ad altro reparto"),
React.createElement("option", { value: "riparazione_esterna" }, "In riparazione esterna"),
React.createElement("option", { value: "dismesso" }, "Dismesso / non pi\u00F9 in uso"),
React.createElement("option", { value: "rifiuto_reparto" }, "Reparto non autorizza intervento ora"),
React.createElement("option", { value: "altro" }, "Altro (specificare nelle note)"))),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 } },
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Reparto / Unit\u00E0 operativa *"),
React.createElement("input", { value: f.departmentName, onChange: sv("departmentName"), placeholder: "es. UO Cardiologia, Sala Operatoria 2", style: INP })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Referente reparto (nome e qualifica)"),
React.createElement("input", { value: f.departmentContact, onChange: sv("departmentContact"), placeholder: "es. Caposala Mario Rossi", style: INP }))),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Note aggiuntive"),
React.createElement("textarea", { value: f.notes, onChange: sv("notes"), rows: 2, placeholder: "Dettagli, riprogrammare per data, ecc.", style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 11px", color: "var(--text)", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" } })))),
React.createElement("div", { style: { background: "var(--surface)", borderRadius: 10, padding: "12px 16px", border: "1px solid var(--border-2)" } },
React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 800, marginBottom: 10 } }, "Firme"),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 } },
React.createElement(SignaturePad, { label: "Firma Tecnico verificatore", value: f.technicianSignature, onChange: v => setF(x => (Object.assign(Object.assign({}, x), { technicianSignature: v }))), height: 120 }),
React.createElement(SignaturePad, { label: "Firma Referente reparto (per presa visione)", value: f.departmentSignature, onChange: v => setF(x => (Object.assign(Object.assign({}, x), { departmentSignature: v }))), height: 120 }))))) : (React.createElement(React.Fragment, null,
React.createElement("div", { style: { background: "var(--surface)", borderRadius: 10, padding: "12px 16px", border: "1px solid var(--border-2)" } },
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 10 } }, "Ispezione visiva"),
[["housing", "Involucro integro e privo di danni"], ["cable", "Cavo di rete e spina integri"], ["connectors", "Connettori e prese in buono stato"], ["labels", "Etichette e marcatura CE leggibili"], ["docs", "Documentazione tecnica presente"]].map(([k, label]) => (React.createElement("div", { key: k, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid var(--border)" } },
React.createElement("span", { style: { fontSize: 12, color: "var(--text-2)" } }, label),
React.createElement("div", { style: { display: "flex", gap: 6 } }, [true, false, null].map((v, i) => (React.createElement("button", { key: i, onClick: () => setVis(k, v), style: {
background: f.visual[k] === v ? (v === true ? "#22c55e22" : v === false ? "#ef444422" : "var(--surface-3)") : "var(--surface)",
border: `1px solid ${f.visual[k] === v ? (v === true ? "#22c55e44" : v === false ? "#ef444433" : "var(--surface-4)") : "var(--surface-3)"}`,
color: f.visual[k] === v ? (v === true ? "#22c55e" : v === false ? "#ef4444" : "var(--text-3)") : "var(--text-4)",
borderRadius: 5, padding: "3px 9px", cursor: "pointer", fontSize: 11, fontWeight: 700
} }, v === true ? "✓ OK" : v === false ? "✗ NO" : "N/D")))))))),
React.createElement("div", { style: { background: "var(--surface)", borderRadius: 10, padding: "12px 16px", border: "1px solid var(--border-2)" } },
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 10 } }, "Misure elettriche"),
!isMobile && (React.createElement("div", { style: { display: "grid", gridTemplateColumns: prevReport ? "minmax(0,1fr) 70px 80px 50px 56px 44px" : "minmax(0,1fr) 90px 90px 56px 56px", gap: 8, marginBottom: 6, padding: "0 10px" } }, (prevReport ? ["Parametro", "Limite", "Valore", "Unità", "Prec.", "Trend"] : ["Parametro", "Limite", "Valore", "Unità", "Esito"]).map(h => React.createElement("div", { key: h, style: { fontSize: 9, color: "var(--text-4)", fontWeight: 700, textTransform: "uppercase" } }, h)))),
prevReport && (React.createElement("div", { style: { fontSize: 10.5, color: "#5eead4", background: "#2dd4bf12", border: "1px solid #2dd4bf33", borderRadius: 6, padding: "6px 10px", marginBottom: 4 } },
"Confronto con la verifica precedente del ",
prevReport.date,
prevReport.overallPass === false ? " (esito: NON conforme)" : "",
". La colonna \"Prec.\" mostra i valori di allora.")),
f.measures.map(m => {
const v = parseFloat(m.value);
const lv = parseFloat(m.limitVal);
const ok = m.value !== "" && m.value !== undefined ? ((m.limitMin == null || v >= parseFloat(m.limitMin)) && (m.limitVal == null || (m.invertPass ? v >= lv : v <= lv))) : null;
const prevVal = prevValueOf(m.id);
const pv = prevVal !== null ? parseFloat(prevVal) : null;
let trend = null;
if (pv !== null && !isNaN(v) && !isNaN(pv) && pv !== 0) {
const diff = v - pv;
const worse = m.invertPass ? diff < 0 : diff > 0;
if (Math.abs(diff) / Math.abs(pv) >= 0.10)
trend = worse ? "worse" : "better";
}
return (React.createElement(React.Fragment, { key: m.id },
isMobile ? (React.createElement("div", { style: { marginBottom: 10, background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 10, padding: "12px 14px" } },
React.createElement("div", { style: { display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 8 } },
React.createElement("span", { style: { fontSize: 12.5, color: "var(--text-strong)", fontWeight: 600, flex: 1, minWidth: 0, overflowWrap: "anywhere", lineHeight: 1.3 } }, m.name),
tutorialFor(m.id, f.fixedInstall) && React.createElement("span", { onClick: () => setTutorialOpen(tutorialOpen === m.id ? null : m.id), title: "Come mi collego", style: { cursor: "pointer", color: "var(--acc-teal)", border: "1px solid #2dd4bf66", borderRadius: "50%", width: 20, height: 20, minWidth: 20, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 } }, "i")),
React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", opacity: m.na ? .5 : 1 } },
React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 5 } },
React.createElement("span", { style: { fontSize: 10, color: "var(--text-4)", textTransform: "uppercase" } }, "Limite"),
m.editableLimit ? (React.createElement("input", { type: "text", disabled: m.na, value: m.limit, onChange: e => setF(x => (Object.assign(Object.assign({}, x), { measures: x.measures.map(mm => mm.id === m.id ? Object.assign(Object.assign({}, mm), { limit: e.target.value, limitVal: parseFloat(String(e.target.value).replace(/[^0-9.]/g, "")) || mm.limitVal }) : mm) }))), title: "Limite modificabile", style: { background: "var(--surface-2)", border: "1px solid #2dd4bf44", borderRadius: 5, padding: "5px 7px", color: "var(--acc-teal)", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", width: 70, outline: "none" } })) : (React.createElement("span", { style: { fontSize: 12, color: "var(--text-2)", fontFamily: "'IBM Plex Mono', monospace" } }, m.limit))),
React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 5, flex: 1, minWidth: 120 } },
React.createElement("input", { type: "number", step: "0.001", disabled: m.na, value: m.na ? "" : m.value, onChange: e => setMeas(m.id, e.target.value), placeholder: m.na ? "non applicabile" : "valore", style: { background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, padding: "7px 9px", color: "var(--text)", fontSize: 14, outline: "none", fontFamily: "'IBM Plex Mono', monospace", flex: 1, minWidth: 0 } }),
React.createElement("span", { style: { fontSize: 12, color: "var(--text-3)", minWidth: 24 } }, m.unit)),
m.na ? (React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: "var(--text-3)" } }, "N/A")) : prevReport ? (React.createElement("span", { style: { fontSize: 18, fontWeight: 700, color: trend === "worse" ? "#ef4444" : trend === "better" ? "#22c55e" : "var(--text-4)" } }, trend === "worse" ? "▲" : trend === "better" ? "▼" : (ok === null ? "—" : ok ? "✓" : "✗"))) : (React.createElement("span", { style: { fontWeight: 700, fontSize: 18, color: ok === null ? "var(--text-4)" : ok ? "#22c55e" : "#ef4444" } }, ok === null ? "—" : ok ? "✓" : "✗"))),
isOptional(m.id) && React.createElement("button", { onClick: () => toggleNA(m.id), style: { marginTop: 8, background: m.na ? "#2dd4bf22" : "transparent", border: "1px solid " + (m.na ? "#2dd4bf66" : "var(--border)"), borderRadius: 6, color: m.na ? "#5eead4" : "var(--text-3)", fontSize: 11, fontWeight: 700, padding: "5px 12px", cursor: "pointer" } }, m.na ? "✓ Non applicabile (tocca per misurare)" : "Segna come non applicabile (N/A)"))) : (React.createElement("div", { style: { display: "grid", gridTemplateColumns: prevReport ? "minmax(0,1fr) 70px 80px 50px 56px 44px" : "minmax(0,1fr) 90px 90px 56px 56px", gap: 8, alignItems: "center", marginBottom: 6, background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "8px 11px", opacity: m.na ? .5 : 1 } },
React.createElement("span", { style: { fontSize: 12, color: "var(--text-2)", display: "flex", alignItems: "center", gap: 6, minWidth: 0 } },
React.createElement("span", { style: { minWidth: 0, overflowWrap: "anywhere" } }, m.name),
tutorialFor(m.id, f.fixedInstall) && React.createElement("span", { onClick: () => setTutorialOpen(tutorialOpen === m.id ? null : m.id), title: "Come mi collego", style: { cursor: "pointer", color: "var(--acc-teal)", border: "1px solid #2dd4bf66", borderRadius: "50%", width: 16, height: 16, minWidth: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 } }, "i"),
isOptional(m.id) && React.createElement("span", { onClick: () => toggleNA(m.id), title: m.na ? "Misura segnata non applicabile — tocca per riattivare" : "Segna come non applicabile (prova opzionale)", style: { cursor: "pointer", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, border: "1px solid " + (m.na ? "#2dd4bf" : "var(--border)"), color: m.na ? "#5eead4" : "var(--text-4)", background: m.na ? "#2dd4bf18" : "transparent", flexShrink: 0 } }, "N/A")),
m.editableLimit ? (React.createElement("input", { type: "text", disabled: m.na, value: m.limit, onChange: e => setF(x => (Object.assign(Object.assign({}, x), { measures: x.measures.map(mm => mm.id === m.id ? Object.assign(Object.assign({}, mm), { limit: e.target.value, limitVal: parseFloat(String(e.target.value).replace(/[^0-9.]/g, "")) || mm.limitVal }) : mm) }))), title: "Limite modificabile", style: { background: "var(--surface-2)", border: "1px solid #2dd4bf44", borderRadius: 5, padding: "4px 6px", color: "var(--acc-teal)", fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", width: "100%", outline: "none" } })) : (React.createElement("span", { style: { fontSize: 11, color: "var(--text-3)", fontFamily: "'IBM Plex Mono', monospace" } }, m.limit)),
React.createElement("input", { type: "number", step: "0.001", disabled: m.na, value: m.na ? "" : m.value, onChange: e => setMeas(m.id, e.target.value), placeholder: m.na ? "N/A" : "—", style: { background: "var(--card)", border: "1px solid var(--border)", borderRadius: 5, padding: "4px 7px", color: "var(--text)", fontSize: 12, outline: "none", fontFamily: "'IBM Plex Mono', monospace", minWidth: 0 } }),
React.createElement("span", { style: { fontSize: 11, color: "var(--text-3)" } }, m.unit),
m.na ? (React.createElement("span", { style: { fontWeight: 700, fontSize: 12, color: "var(--text-3)", textAlign: "center" } }, "N/A")) : prevReport ? (React.createElement(React.Fragment, null,
React.createElement("span", { style: { fontSize: 11, color: "var(--text-3)", fontFamily: "'IBM Plex Mono', monospace", textAlign: "center" } }, prevVal !== null ? prevVal : "—"),
React.createElement("span", { style: { fontSize: 14, textAlign: "center", fontWeight: 700, color: trend === "worse" ? "#ef4444" : trend === "better" ? "#22c55e" : "var(--text-4)" }, title: trend === "worse" ? "In peggioramento" : trend === "better" ? "In miglioramento" : (ok === null ? "" : (ok ? "Conforme" : "Non conforme")) }, trend === "worse" ? "▲" : trend === "better" ? "▼" : (ok === null ? "—" : ok ? "✓" : "✗")))) : (React.createElement("span", { style: { fontWeight: 700, fontSize: 13, color: ok === null ? "var(--text-4)" : ok ? "#22c55e" : "#ef4444" } }, ok === null ? "—" : ok ? "✓" : "✗")))),
tutorialOpen === m.id && tutorialFor(m.id, f.fixedInstall) && (() => {
const tut = tutorialFor(m.id, f.fixedInstall);
return (React.createElement("div", { key: m.id + "-tut", style: { background: "var(--surface)", border: "1px solid #2dd4bf", borderRadius: 10, padding: "14px 16px", marginBottom: 10, marginTop: 4, boxShadow: "0 4px 14px rgba(0,0,0,.4)" } },
React.createElement("div", { style: { fontSize: 13, fontWeight: 800, color: "#5eead4", marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid #2dd4bf33" } }, "\uD83D\uDD0C Come mi collego"),
React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 10 } }, tut.titolo),
React.createElement("div", { style: { display: "flex", justifyContent: "center", marginBottom: 10 } },
React.createElement(TutorialSVG, { kind: tut.svg })),
React.createElement("ol", { style: { margin: 0, paddingLeft: 18, fontSize: 12, color: "var(--text-strong)", lineHeight: 1.6 } }, tut.passi.map((p, i) => React.createElement("li", { key: i, style: { marginBottom: 3 } }, p))),
tut.nota && React.createElement("div", { style: { fontSize: 11, color: "#f59e0b", marginTop: 8, fontStyle: "italic" } },
"\u26A0 ",
tut.nota),
React.createElement("div", { style: { fontSize: 10, color: "var(--text-4)", marginTop: 6 } }, "Testo da rifinire con la pratica reale.")));
})()));
})),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 5 } },
React.createElement("label", { style: LBL }, "Note e osservazioni"),
React.createElement("textarea", { value: f.notes, onChange: sv("notes"), rows: 3, style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 11px", color: "var(--text)", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box", resize: "vertical" } })),
React.createElement("div", { style: { background: "var(--surface)", borderRadius: 10, padding: "12px 16px", border: "1px solid var(--border-2)" } },
React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 800, marginBottom: 10 } }, "Firme"),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 } },
React.createElement(SignaturePad, { label: "Firma Tecnico verificatore", value: f.technicianSignature, onChange: v => setF(x => (Object.assign(Object.assign({}, x), { technicianSignature: v }))), height: 120 }),
React.createElement(SignaturePad, { label: "Firma Referente reparto (opzionale)", value: f.departmentSignature, onChange: v => setF(x => (Object.assign(Object.assign({}, x), { departmentSignature: v }))), height: 120 })),
React.createElement("div", { style: { marginTop: 8, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 } },
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Reparto / Unit\u00E0 (opzionale)"),
React.createElement("input", { value: f.departmentName || "", onChange: sv("departmentName"), placeholder: "es. UO Cardiologia", style: INP })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Referente (opzionale)"),
React.createElement("input", { value: f.departmentContact || "", onChange: sv("departmentContact"), placeholder: "es. Caposala Rossi", style: INP })))))),
(function(){var frozen=!!f.locked;var _now=new Date().toISOString();var _validate=function(){var errs={};if(!f.assetId&&!propAssetId)errs.assetId="Seleziona un apparecchio";if(!f.date)errs.date="Inserisci la data";if(!f.technician)errs.technician="Inserisci il nome del tecnico";if(f.verifyStatus==="non_disponibile"){if(!f.notAvailableReason)errs.notAvailableReason="Seleziona il motivo della mancata esecuzione";if(!f.departmentName)errs.departmentName="Inserisci il nome del reparto";}setErrors(errs);return Object.keys(errs).length===0;};var _base=function(){return Object.assign(Object.assign({},f),{assetId:f.assetId||propAssetId||"",overallPass:f.verifyStatus==="non_disponibile"?null:f.overallPass});};var _saveDraft=function(){if(!_validate())return;onSave(_base());};var _conclude=function(){if(!_validate())return;onSave(Object.assign(Object.assign({},_base()),{locked:true,concludedAt:_now,concludedBy:f.technician||"",auditLog:(f.auditLog||[]).concat([{action:"conclusione",at:_now,by:f.technician||""}])}));};var _reopen=function(){onSave(Object.assign(Object.assign({},_base()),{locked:false,auditLog:(f.auditLog||[]).concat([{action:"riapertura",at:_now,by:"admin"}])}));};return React.createElement("div",{style:{display:"flex",gap:10,justifyContent:"flex-end",flexWrap:"wrap"}},React.createElement(Btn,{variant:"ghost",onClick:onClose},"Chiudi"),(frozen&&!isAdmin)?null:(frozen&&isAdmin)?React.createElement(React.Fragment,null,React.createElement(Btn,{variant:"ghost",onClick:_reopen},"Riapri verifica"),React.createElement(Btn,{onClick:_saveDraft},"Salva modifiche")):React.createElement(React.Fragment,null,React.createElement(Btn,{variant:"ghost",onClick:_saveDraft},"Salva bozza"),React.createElement(Btn,{onClick:_conclude},"Concludi e blocca")));})()));
}
const INSTRUMENTS_BY_TPL = {
defibrillatore: { req: ["Analizzatore di defibrillazione/energia (es. Fluke Impulse 7000DP)", "Analizzatore sicurezza elettrica IEC 62353"], opt: ["Box carichi 25–200 Ω", "Simulatore ECG"] },
dae: { req: ["Analizzatore di defibrillazione/energia compatibile DAE"], opt: ["Analizzatore sicurezza elettrica 62353 (se ricaricabile da rete)", "Simulatore ECG/aritmie"] },
ventilatore: { req: ["Analizzatore di flusso gas (es. IMT CITREX H5 / Fluke VT900A)", "Polmone di prova (test lung)", "Analizzatore sicurezza elettrica 62353"], opt: ["Analizzatore multigas", "Manometro"] },
pompa_infusionale: { req: ["Analizzatore di flusso/infusione (es. Fluke IDA-6)", "Analizzatore sicurezza elettrica 62353"], opt: ["Set test occlusione/bolo", "Bilancia gravimetrica di precisione"] },
bbraun_infusomat_space_tsc: { req: ["Bilancia di precisione (lettura ≤ 10 mg, accuratezza ≤ 12,5 mg, range ~100 g) — metodo peso", "Cronometro — metodo tempo", "Cilindro graduato / contenitore tarato per la raccolta", "Manometro pressione (accuratezza ≤ 80 mbar / 1,16 psi; es. Fluke 717, Kobold MAN-SC10M6A3000, Greisinger GMH 3151) — T5", "Adattatore Luer Lock maschio 6 mm (es. VBM CHLLM06)", "Spessimetri DIN 2275 tolleranza T2 (0,3 e 0,6 mm) — gap safety clamp", "Service plug SP (per prova pressione meccanica)"], opt: ["Matraccio graduato B. Braun Classe A 25 mL, graduazione 1–7 (metodo opzionale)", "Multimetro (es. Fluke 177) — tensione", "Analizzatore sicurezza elettrica IEC 62353 — sull'alimentatore SP/SpaceStation (TSC separato PRID00003912)"] },
monitor_multipar: { req: ["Simulatore paziente multiparametrico (es. Fluke ProSim 8)", "Analizzatore sicurezza elettrica 62353"], opt: ["Simulatore SpO2 dedicato", "Simulatore IBP/gittata"] },
pulsossimetro: { req: ["Simulatore/tester SpO2 (es. Fluke ProSim SPOT)"], opt: ["Analizzatore sicurezza elettrica (se alimentato)", "Simulatore di perfusione"] },
ecografo: { req: ["Analizzatore sicurezza elettrica 62353", "Phantom ecografico (tessuto-mimetico/Doppler)"], opt: ["Strumenti CQ immagine", "Tester sonde"] },
elettrobisturi: { req: ["Analizzatore di elettrochirurgia/ESU (es. Fluke QA-ES III)", "Analizzatore sicurezza elettrica 62353"], opt: ["Carichi di prova aggiuntivi", "Tester CQM/REM"] },
elettrocardiografo: { req: ["Simulatore ECG/paziente (es. Fluke ProSim 4)", "Analizzatore sicurezza elettrica 62353"], opt: ["Simulatore di aritmie", "Tester derivazioni"] },
aspiratore_chirurgico: { req: ["Vacuometro/misuratore di vuoto (mmHg/kPa)", "Analizzatore sicurezza elettrica 62353"], opt: ["Analizzatore di flusso", "Cronometro"] },
lampada_scialitica: { req: ["Luxmetro (lux a distanza nominale)", "Analizzatore sicurezza elettrica 62353"], opt: ["Termometro irraggiamento", "Colorimetro (temp. colore/CRI)"] },
incubatrice_neonatale: { req: ["Analizzatore per incubatrici (es. Fluke INCU II)", "Analizzatore sicurezza elettrica 62353"], opt: ["Sonda temperatura cutanea", "Analizzatore O2"] },
autoclave: { req: ["Datalogger temperatura/pressione (mappatura)", "Test tenuta vuoto + Bowie-Dick/Helix", "Indicatori biologici (spore)"], opt: ["Analizzatore sicurezza elettrica 62353", "Termometro/manometro di riferimento"] },
dialisi: { req: ["Conduttivimetro di riferimento certificato", "pHmetro", "Termometro di riferimento", "Analizzatore sicurezza elettrica 62353"], opt: ["Misuratore flusso/pressione", "Tester perdite ematiche"] },
capnografo: { req: ["Miscela/sorgente gas CO₂ di riferimento o simulatore gas", "Analizzatore di flusso gas con CO₂"], opt: ["Analizzatore sicurezza elettrica (se alimentato)", "Simulatore respiratorio"] },
tavolo_operatorio: { req: ["Analizzatore sicurezza elettrica 62353", "Carichi/masse di prova"], opt: ["Dinamometro", "Cronometro"] },
culla_termica: { req: ["Analizzatore per incubatrici/riscaldatori (es. Fluke INCU II)", "Analizzatore sicurezza elettrica 62353"], opt: ["Sonda temperatura cutanea", "Misuratore irraggiamento"] },
holter_ecg: { req: ["Simulatore ECG (es. Fluke ProSim)"], opt: ["Analizzatore sicurezza elettrica (se base a rete)", "Software verifica registrazione"] },
riunito_odontoiatrico: { req: ["Analizzatore sicurezza elettrica 62353", "Vacuometro per aspirazione", "Manometri aria/acqua"], opt: ["Tester radiologico (endorale)", "Analizzatore di flusso"] },
sfigmomanometro: { req: ["Manometro di riferimento calibrato + simulatore NIBP (es. Fluke BP Pump 2)"], opt: ["Analizzatore sicurezza elettrica (NIBP da rete)", "Volume calibrato per test dinamico"] },
termometro_clinico: { req: ["Bagno termostatico/black-body o termometro di riferimento certificato"], opt: ["Simulatore di temperatura", "Analizzatore sicurezza elettrica (se da rete)"] },
fototerapia_neonatale: { req: ["Radiometro per fototerapia (µW/cm²/nm banda blu)", "Analizzatore sicurezza elettrica 62353"], opt: ["Luxmetro", "Timer ore lampada"] },
elettrostimolatore: { req: ["Analizzatore sicurezza elettrica 62353", "Oscilloscopio/analizzatore forma d'onda con carico"], opt: ["Misuratore parametri di uscita", "Carichi resistivi"] },
pompa_sangue: { req: ["Misuratore di flusso/portata", "Analizzatore sicurezza elettrica 62353"], opt: ["Misuratore di pressione", "Tester allarmi/bolle d'aria"] },
letto_elettrico: { req: ["Analizzatore sicurezza elettrica 62353", "Masse/carichi di prova (carico di lavoro sicuro)"], opt: ["Dinamometro", "Cronometro"] },
audiometro: { req: ["Orecchio artificiale/accoppiatore acustico (IEC 60318) + fonometro/calibratore", "Mastoide artificiale (via ossea)"], opt: ["Analizzatore sicurezza elettrica 62353", "Fonometro per rumore cabina"] },
spirometro: { req: ["Siringa di calibrazione 3 L certificata"], opt: ["Misuratore T/pressione/umidità ambiente", "Analizzatore sicurezza elettrica (se alimentato)"] },
frigoemoteca: { req: ["Datalogger/termometro di riferimento certificato", "Sonde multiple per mappatura"], opt: ["Analizzatore sicurezza elettrica 62353", "Simulatore di temperatura per allarmi"] },
bilancia: { req: ["Masse campione certificate (classe M1 o superiore)"], opt: ["Livella", "Analizzatore sicurezza elettrica (se elettronica da rete)"] },
concentratore_ossigeno: { req: ["Analizzatore di ossigeno (es. Maxtec MaxO₂)", "Misuratore di flusso calibrato", "Manometro"], opt: ["Analizzatore sicurezza elettrica 62353"] },
eeg: { req: ["Analizzatore sicurezza elettrica 62353", "Generatore/segnale di calibrazione µV"], opt: ["EEG calibrator/simulatore", "Tester impedenza elettrodi"] },
generico: { req: ["Analizzatore sicurezza elettrica IEC 62353"], opt: ["Simulatore paziente multiparametrico", "Strumenti specifici secondo manuale del costruttore"] },
};
function TestInstrumentsHint({ templateId, compact }) {
const info = INSTRUMENTS_BY_TPL[templateId] || INSTRUMENTS_BY_TPL["generico"];
const [open, setOpen] = React.useState(false);
if (!info) return null;
return React.createElement("div", { style: { background: "var(--ok-bg)", border: "1px solid #2dd4bf55", borderRadius: 8, padding: "8px 10px", margin: "6px 0" } },
React.createElement("div", { onClick: () => setOpen(function (o) { return !o; }), style: { display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" } },
React.createElement("span", { style: { fontSize: 12.5, fontWeight: 700, color: "#5eead4" } }, "\uD83E\uDDF0 Strumenti di test consigliati"),
React.createElement("span", { style: { fontSize: 13, color: "#5eead4", fontWeight: 700 } }, open ? "−" : "+")),
open && React.createElement("div", { style: { marginTop: 8 } },
React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: "#ef4444", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.04em" } }, "Indispensabili"),
React.createElement("ul", { style: { margin: "0 0 8px", paddingLeft: 18, fontSize: 11.5, color: "var(--text)", lineHeight: 1.5 } }, (info.req || []).map(function (s, i) { return React.createElement("li", { key: i }, s); })),
(info.opt && info.opt.length) ? React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: "var(--text-3)", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.04em" } }, "Consigliati") : null,
(info.opt && info.opt.length) ? React.createElement("ul", { style: { margin: 0, paddingLeft: 18, fontSize: 11.5, color: "var(--text-2)", lineHeight: 1.5 } }, info.opt.map(function (s, i) { return React.createElement("li", { key: i }, s); })) : null,
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", marginTop: 8, fontStyle: "italic" } }, "Modelli citati come esempi neutri. Verifica la taratura degli strumenti e i limiti esatti su norme/manuali ufficiali.")));
}
const SignaturePad = ({ value, onChange, label, height = 140 }) => {
const canvasRef = React.useRef(null);
const isDrawing = React.useRef(false);
const lastPoint = React.useRef(null);
const [hasContent, setHasContent] = React.useState(!!value);
React.useEffect(() => {
const canvas = canvasRef.current;
if (!canvas)
return;
const rect = canvas.getBoundingClientRect();
const dpr = window.devicePixelRatio || 1;
canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;
const ctx = canvas.getContext("2d");
ctx.scale(dpr, dpr);
ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.strokeStyle = "#000";
ctx.lineWidth = 2;
ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, rect.width, rect.height);
if (value) {
const img = new Image();
img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
img.src = value;
}
}, [height]);
const getXY = (e) => {
const canvas = canvasRef.current;
const rect = canvas.getBoundingClientRect();
if (e.touches && e.touches.length > 0) {
return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
}
return { x: e.clientX - rect.left, y: e.clientY - rect.top };
};
const start = (e) => {
e.preventDefault();
isDrawing.current = true;
lastPoint.current = getXY(e);
};
const draw = (e) => {
if (!isDrawing.current)
return;
e.preventDefault();
const canvas = canvasRef.current;
const ctx = canvas.getContext("2d");
const p = getXY(e);
let pressure = 0.5;
if (e.pointerType === "pen" && e.pressure)
pressure = e.pressure;
else if (e.touches && e.touches[0] && e.touches[0].force)
pressure = e.touches[0].force;
ctx.lineWidth = 1 + pressure * 2.5;
ctx.beginPath();
ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
ctx.lineTo(p.x, p.y);
ctx.stroke();
lastPoint.current = p;
setHasContent(true);
};
const end = (e) => {
if (!isDrawing.current)
return;
isDrawing.current = false;
const canvas = canvasRef.current;
const b64 = canvas.toDataURL("image/png");
onChange && onChange(b64);
};
const clear = () => {
const canvas = canvasRef.current;
const ctx = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect();
ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, rect.width, rect.height);
setHasContent(false);
onChange && onChange("");
};
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } },
label && React.createElement("label", { style: { fontSize: 11, color: "var(--text-2)", fontWeight: 600 } }, label),
React.createElement("div", { style: { position: "relative", border: "1px solid var(--border)", borderRadius: 8, background: "#fff", overflow: "hidden" } },
React.createElement("canvas", { ref: canvasRef, style: { display: "block", width: "100%", height: height + "px", touchAction: "none", cursor: "crosshair" }, onMouseDown: start, onMouseMove: draw, onMouseUp: end, onMouseLeave: end, onTouchStart: start, onTouchMove: draw, onTouchEnd: end, onPointerDown: start, onPointerMove: draw, onPointerUp: end }),
!hasContent && (React.createElement("div", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", color: "var(--text-2)", fontSize: 13, fontStyle: "italic" } }, "Firma qui (usa S-Pen o dito)"))),
React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 6 } },
React.createElement("button", { type: "button", onClick: clear, style: { background: "transparent", border: "1px solid var(--border)", color: "var(--text-2)", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", touchAction: "manipulation" } }, "Cancella firma"))));
};
