import { t as __t } from "../constants/i18n.js";
/* MedTrace — catalogo tecnico: strumenti di misura, avvisi di sicurezza (recall), editor template (estratti da app.js, v3.05) */
import { Badge, EmptyState, ErrorSummary, Modal, useMedia, appConfirm, FilterDropdown, MobileSearch, SwipeableCard } from "./ui.js";
import { Btn, AttachmentsList } from "./shared.js";
import { FORM_BTN_GHOST, FORM_BTN_PRIMARY, FORM_COL, FORM_FOOTER, FORM_INP, FORM_LBL, FORM_ROW, FORM_SECTION, CATEGORIES } from "../constants/ui.js";
import { upsertInList } from "../lib/sync.js";
import { withCreateMeta, withUpdateMeta } from "../lib/util.js";
function blankTemplate() {
return {
id: "custom_" + Date.now(),
label: "", icon: "›", norm: "",
isCustom: true,
sections: [
{ id: "sez1", title: __t("Ispezione visiva"), items: [{ id: "item1", text: "" }], measures: [] },
],
};
}
const errorBorderStyle = (baseStyle, hasError) => {
if (!hasError)
return baseStyle;
return Object.assign(Object.assign({}, baseStyle), { borderColor: "#ef4444", background: "#ef444408" });
};
const RECALL_ACTIONS = ["Aggiornamento SW", "Sostituzione", "Ritiro / Fuori uso", "Controllo / Ispezione", "Informativa"];
const RECALL_SEVERITY = ["Alta", "Media", "Bassa"];
const RECALL_STATUSES = ["aperto", "in lavorazione", "chiuso"];
const RECALL_ASSET_STATUS = ["Da verificare", "Eseguita", "Non applicabile", "Messo fuori uso"];
const RECALL_SEV_COLOR = { "Alta": "#ef4444", "Media": "#f59e0b", "Bassa": "#22c55e" };
const RECALL_STATUS_COLOR = { "aperto": "#ef4444", "in lavorazione": "#f59e0b", "chiuso": "#22c55e" };
const RECALL_ASTATUS_COLOR = { "Da verificare": "#f59e0b", "Eseguita": "#22c55e", "Non applicabile": "#6b7280", "Messo fuori uso": "#ef4444" };
function RecallForm({ recall, assets, customers, onSave, onClose, showToast }) {
const [f, setF] = React.useState(() => recall ? Object.assign({ attachments: [], affected: [] }, recall) : { ref: "", manufacturer: "", date: new Date().toISOString().slice(0, 10), subject: "", actionType: "Controllo / Ispezione", severity: "Media", link: "", status: "aperto", notes: "", attachments: [], affected: [] });
const set = k => e => setF(x => Object.assign({}, x, { [k]: e.target.value }));
const [pick, setPick] = React.useState("");
const addAsset = (id) => { if (!id) return; setF(x => (x.affected || []).some(a => a.assetId === id) ? x : Object.assign({}, x, { affected: [...(x.affected || []), { assetId: id, status: "Da verificare", date: "", note: "" }] })); setPick(""); };
const suggest = () => {
const m = (f.manufacturer || "").trim().toLowerCase();
if (!m) { showToast && showToast(__t("Inserisci prima il produttore"), "#f59e0b"); return; }
const have = new Set((f.affected || []).map(a => a.assetId));
const matches = assets.filter(a => !have.has(a.id) && (a.brand || "") && ((a.brand || "").toLowerCase().includes(m) || m.includes((a.brand || "").toLowerCase())));
if (!matches.length) { showToast && showToast(__t("Nessun apparecchio con marca simile"), "#f59e0b"); return; }
setF(x => Object.assign({}, x, { affected: [...(x.affected || []), ...matches.map(a => ({ assetId: a.id, status: "Da verificare", date: "", note: "" }))] }));
showToast && showToast(matches.length + " apparecchi aggiunti");
};
const updAff = (id, k, v) => setF(x => Object.assign({}, x, { affected: (x.affected || []).map(a => a.assetId === id ? Object.assign({}, a, { [k]: v }) : a) }));
const rmAff = (id) => setF(x => Object.assign({}, x, { affected: (x.affected || []).filter(a => a.assetId !== id) }));
const assetLabel = (id) => { const a = assets.find(x => x.id === id); if (!a) return id; return [a.assetCode || a.id, a.name, a.serial && ("S/N " + a.serial)].filter(Boolean).join(" · "); };
const available = assets.filter(a => !(f.affected || []).some(x => x.assetId === a.id)).sort((a, b) => String(a.assetCode || a.id).localeCompare(String(b.assetCode || b.id)));
const submit = () => { if (!f.manufacturer && !f.subject && !f.ref) { showToast && showToast(__t("Compila almeno produttore o oggetto"), "#f59e0b"); return; } onSave(f); };
return React.createElement(React.Fragment, null,
React.createElement("div", { style: FORM_ROW },
React.createElement("div", { style: FORM_COL }, React.createElement("label", { style: FORM_LBL }, __t("N. riferimento / FSCA")), React.createElement("input", { value: f.ref || "", onChange: set("ref"), placeholder: "es. FSCA-2026-001", style: FORM_INP })),
React.createElement("div", { style: FORM_COL }, React.createElement("label", { style: FORM_LBL }, __t("Produttore")), React.createElement("input", { value: f.manufacturer || "", onChange: set("manufacturer"), placeholder: "es. Philips", style: FORM_INP })),
React.createElement("div", { style: FORM_COL }, React.createElement("label", { style: FORM_LBL }, __t("Data emissione")), React.createElement("input", { type: "date", value: f.date || "", onChange: set("date"), style: FORM_INP }))),
React.createElement("div", { style: { marginBottom: 14 } }, React.createElement("label", { style: FORM_LBL }, __t("Oggetto")), React.createElement("input", { value: f.subject || "", onChange: set("subject"), placeholder: __t("Descrizione sintetica dell'avviso"), style: FORM_INP })),
React.createElement("div", { style: FORM_ROW },
React.createElement("div", { style: FORM_COL }, React.createElement("label", { style: FORM_LBL }, __t("Tipo azione richiesta")), React.createElement("select", { value: f.actionType || "", onChange: set("actionType"), style: FORM_INP }, RECALL_ACTIONS.map(o => React.createElement("option", { key: o, value: o }, o)))),
React.createElement("div", { style: FORM_COL }, React.createElement("label", { style: FORM_LBL }, __t("Gravità")), React.createElement("select", { value: f.severity || "", onChange: set("severity"), style: FORM_INP }, RECALL_SEVERITY.map(o => React.createElement("option", { key: o, value: o }, o)))),
React.createElement("div", { style: FORM_COL }, React.createElement("label", { style: FORM_LBL }, __t("Stato")), React.createElement("select", { value: f.status || "", onChange: set("status"), style: FORM_INP }, RECALL_STATUSES.map(o => React.createElement("option", { key: o, value: o }, o))))),
React.createElement("div", { style: { marginBottom: 14 } }, React.createElement("label", { style: FORM_LBL }, __t("Link all'avviso (opzionale)")), React.createElement("input", { value: f.link || "", onChange: set("link"), placeholder: "https://…", style: FORM_INP })),
React.createElement("div", { style: { marginBottom: 14 } }, React.createElement("label", { style: FORM_LBL }, __t("Note")), React.createElement("textarea", { value: f.notes || "", onChange: set("notes"), rows: 3, style: Object.assign({}, FORM_INP, { resize: "vertical", fontFamily: "inherit" }) })),
React.createElement("div", { style: { marginBottom: 18 } },
React.createElement("label", { style: FORM_LBL }, __t("Allegati (PDF dell'avviso)")),
React.createElement(AttachmentsList, { attachments: f.attachments || [], onAdd: att => setF(x => Object.assign({}, x, { attachments: [...(x.attachments || []), att] })), onDelete: id => setF(x => Object.assign({}, x, { attachments: (x.attachments || []).filter(a => a.id !== id) })), showToast: showToast, compact: true })),
React.createElement("div", { style: { borderTop: "1px solid var(--border-2)", paddingTop: 16, marginBottom: 8 } },
React.createElement("div", { style: FORM_SECTION }, "Apparecchi coinvolti (" + ((f.affected || []).length) + ")"),
React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" } },
React.createElement("select", { value: pick, onChange: e => addAsset(e.target.value), style: Object.assign({}, FORM_INP, { flex: 1, minWidth: 180 }) },
React.createElement("option", { value: "" }, available.length ? "+ Aggiungi apparecchio…" : __t("Tutti gli apparecchi sono già collegati")),
available.map(a => React.createElement("option", { key: a.id, value: a.id }, assetLabel(a.id)))),
React.createElement("button", { type: "button", onClick: suggest, style: FORM_BTN_GHOST }, __t("Suggerisci per marca"))),
(f.affected || []).length === 0
? React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)", fontStyle: "italic", padding: "6px 0" } }, __t("Nessun apparecchio collegato. Aggiungili dal menu o con \u201CSuggerisci per marca\u201D."))
: React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
(f.affected || []).map(af => React.createElement("div", { key: af.assetId, style: { background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "10px 12px" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 } },
React.createElement("span", { style: { fontSize: 13, color: "var(--text)", fontWeight: 600, lineHeight: 1.3 } }, assetLabel(af.assetId)),
React.createElement("button", { type: "button", onClick: () => rmAff(af.assetId), title: __t("Rimuovi"), style: { background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 14, fontWeight: 700, flexShrink: 0, padding: 0 } }, "\u2715")),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 } },
React.createElement("div", null, React.createElement("label", { style: Object.assign({}, FORM_LBL, { marginBottom: 3 }) }, __t("Stato azione")), React.createElement("select", { value: af.status || "Da verificare", onChange: e => updAff(af.assetId, "status", e.target.value), style: Object.assign({}, FORM_INP, { padding: "8px 10px", fontSize: 13, borderColor: (RECALL_ASTATUS_COLOR[af.status || "Da verificare"] || "#888") + "66" }) }, RECALL_ASSET_STATUS.map(o => React.createElement("option", { key: o, value: o }, o)))),
React.createElement("div", null, React.createElement("label", { style: Object.assign({}, FORM_LBL, { marginBottom: 3 }) }, __t("Data azione")), React.createElement("input", { type: "date", value: af.date || "", onChange: e => updAff(af.assetId, "date", e.target.value), style: Object.assign({}, FORM_INP, { padding: "8px 10px", fontSize: 13 }) }))),
React.createElement("input", { value: af.note || "", onChange: e => updAff(af.assetId, "note", e.target.value), placeholder: __t("Nota (es. n. lotto, intervento eseguito…)"), style: Object.assign({}, FORM_INP, { padding: "8px 10px", fontSize: 13, marginTop: 8 }) }))))),
React.createElement("div", { style: FORM_FOOTER },
React.createElement("button", { type: "button", onClick: onClose, style: FORM_BTN_GHOST }, __t("Annulla")),
React.createElement("button", { type: "button", onClick: submit, style: FORM_BTN_PRIMARY }, __t("Salva avviso"))));
}
export function RecallsPage({ recalls, setRecalls, assets, customers, showToast, moveToTrash, checkLocked, openRecallId, onRecallFocused }) {
const [modal, setModal] = React.useState(null);
const [search, setSearch] = React.useState("");
const [fStatus, setFStatus] = React.useState("");
React.useEffect(function () {
if (!openRecallId) return;
var rc = (recalls || []).find(function (x) { return x.id === openRecallId; });
if (rc) setModal({ data: rc });
if (onRecallFocused) onRecallFocused();
}, [openRecallId]);
const save = (form) => {
if (checkLocked && checkLocked()) return;
if (modal && modal.data) setRecalls(rs => upsertInList(rs, withUpdateMeta(Object.assign({}, form, { id: modal.data.id, createdAt: modal.data.createdAt }))));
else setRecalls(rs => upsertInList(rs, withCreateMeta(form)));
setModal(null);
showToast(__t("Avviso salvato"));
};
const del = (id) => {
if (checkLocked && checkLocked()) return;
appConfirm(__t("Spostare questo avviso nel cestino?"), () => {
const r = (recalls || []).find(x => x.id === id);
moveToTrash("recalls", r);
setRecalls(rs => rs.filter(x => x.id !== id));
showToast(__t("Spostato nel cestino"), "#f59e0b");
});
};
const list = (recalls || []).filter(r => {
if (fStatus && r.status !== fStatus) return false;
if (search) { const q = search.toLowerCase(); if (![r.ref, r.manufacturer, r.subject, r.actionType].some(x => String(x || "").toLowerCase().includes(q))) return false; }
return true;
}).sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
const pendingCount = (r) => (r.affected || []).filter(a => a.status === "Da verificare" || !a.status).length;
return React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h2", { style: { margin: 0, fontSize: 18, color: "var(--text)" } }, __t("Avvisi di sicurezza")),
React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)", marginTop: 2 } }, __t("Richiami e avvisi di sicurezza (FSN) e azioni correttive di campo"))),
React.createElement("button", { onClick: () => setModal({ data: null }), style: FORM_BTN_PRIMARY }, "+ Nuovo avviso")),
React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" } },
React.createElement("input", { value: search, onChange: e => setSearch(e.target.value), placeholder: __t("Cerca produttore, oggetto, rif…"), style: Object.assign({}, FORM_INP, { flex: 1, minWidth: 160 }) }),
React.createElement("select", { value: fStatus, onChange: e => setFStatus(e.target.value), style: Object.assign({}, FORM_INP, { maxWidth: 180 }) },
React.createElement("option", { value: "" }, __t("Tutti gli stati")),
RECALL_STATUSES.map(s => React.createElement("option", { key: s, value: s }, s)))),
list.length === 0
? React.createElement("div", { style: { textAlign: "center", padding: "40px 20px", background: "var(--surface)", borderRadius: 12, border: "1px dashed var(--border)", color: "var(--text-3)", fontSize: 13 } }, (recalls || []).length === 0 ? __t("Nessun avviso di sicurezza registrato. Crea il primo con “+ Nuovo avviso”.") : __t("Nessun avviso corrisponde ai filtri."))
: React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
list.map(r => {
const pend = pendingCount(r);
const tot = (r.affected || []).length;
return React.createElement("div", { key: r.id, style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 12, padding: "14px 16px" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6 } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap", marginBottom: 3 } },
r.ref && React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "#5eead4", fontWeight: 700 } }, r.ref),
React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: "var(--text)" } }, r.manufacturer || "—")),
r.subject && React.createElement("div", { style: { fontSize: 13, color: "var(--text)", lineHeight: 1.35 } }, r.subject)),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end", flexShrink: 0 } },
r.severity && React.createElement(Badge, { text: r.severity, color: RECALL_SEV_COLOR[r.severity] || "var(--text-3)" }),
r.status && React.createElement(Badge, { text: r.status, color: RECALL_STATUS_COLOR[r.status] || "var(--text-3)" }))),
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginTop: 10, flexWrap: "wrap" } },
React.createElement("div", { style: { fontSize: 12, color: "var(--text-2)", display: "flex", gap: 10, flexWrap: "wrap" } },
r.actionType && React.createElement("span", null, r.actionType),
r.date && React.createElement("span", null, r.date),
tot > 0 && React.createElement("span", { style: { color: pend > 0 ? "#f59e0b" : "#22c55e", fontWeight: 700 } }, tot + " app." + (pend > 0 ? (" · " + pend + " da gestire") : " · tutti gestiti"))),
React.createElement("div", { style: { display: "flex", gap: 6 } },
React.createElement("button", { onClick: () => setModal({ data: r }), style: { background: "var(--surface-3)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text-2)", padding: "5px 12px", cursor: "pointer", fontSize: 12, fontWeight: 700 } }, __t("Apri")),
React.createElement("button", { onClick: () => del(r.id), title: __t("Elimina"), style: { background: "var(--surface-3)", border: "1px solid #ef444433", borderRadius: 6, color: "#ef4444", padding: "5px 10px", cursor: "pointer", fontSize: 13, fontWeight: 700 } }, "\u2715"))));
})),
modal && React.createElement(Modal, { title: modal.data ? __t("Modifica avviso di sicurezza") : __t("Nuovo avviso di sicurezza"), wide: true, onClose: () => setModal(null) },
React.createElement(RecallForm, { recall: modal.data, assets: assets, customers: customers, onSave: save, onClose: () => setModal(null), showToast: showToast })));
}
export function InstrumentsPage({ instruments, setInstruments, showToast, checkLocked }) {
const [modal, setModal] = React.useState(null);
const [search, setSearch] = React.useState('');
const [filterStatus, setFilterStatus] = React.useState("");
const [filterCategory, setFilterCategory] = React.useState("");
const [filterOpen, setFilterOpen] = React.useState(false);
const isMobile = useMedia("(max-width:600px)");
const TODAY = new Date();
const getStatus = (inst) => {
if (!inst.calExpiry)
return { label: __t('Non impostata'), color: 'var(--text-3)', days: null, key: 'none' };
const expiry = new Date(inst.calExpiry);
const days = Math.round((expiry - TODAY) / 86400000);
if (days < 0)
return { label: 'SCADUTA', color: '#ef4444', days, key: 'expired' };
if (days <= 30)
return { label: `Scade in ${days}gg`, color: '#ef4444', days, key: 'expiring' };
if (days <= 60)
return { label: `Scade in ${days}gg`, color: '#f59e0b', days, key: 'soon' };
return { label: `Valida (${days}gg)`, color: '#22c55e', days, key: 'valid' };
};
const saveInstrument = (data) => {
if (checkLocked && checkLocked())
return;
if (data.id) {
const upd = withUpdateMeta(data);
setInstruments(prev => prev.map(x => x.id === data.id ? upd : x));
}
else {
const newInst = withCreateMeta(data);
setInstruments(prev => [...prev, newInst]);
}
setModal(null);
showToast('✓ Strumento salvato');
};
const deleteInstrument = (id) => {
if (checkLocked && checkLocked())
return;
if (!confirm(__t('Eliminare questo strumento?')))
return;
setInstruments(prev => prev.filter(x => x.id !== id));
showToast(__t('Strumento eliminato'));
};
const filtered = instruments.filter(i => {
if (search) {
const q = search.toLowerCase();
if (![i.brand, i.model, i.serial, i.internalCode, i.category, i.calLab, i.certNumber]
.some(v => v && v.toLowerCase().includes(q)))
return false;
}
if (filterCategory && i.category !== filterCategory)
return false;
if (filterStatus) {
const s = getStatus(i);
if (filterStatus === "valid" && s.key !== "valid")
return false;
if (filterStatus === "expiring" && s.key !== "soon" && s.key !== "expiring")
return false;
if (filterStatus === "expired" && s.key !== "expired")
return false;
if (filterStatus === "none" && s.key !== "none")
return false;
}
return true;
});
const expired = instruments.filter(i => getStatus(i).key === 'expired').length;
const expiring = instruments.filter(i => { const k = getStatus(i).key; return k === 'soon' || k === 'expiring'; }).length;
const valid = instruments.filter(i => getStatus(i).key === 'valid').length;
const categories = [...new Set(instruments.map(i => i.category).filter(Boolean))].sort();
const activeFilterCount = (filterStatus ? 1 : 0) + (filterCategory ? 1 : 0);
return (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 800, display: isMobile ? "none" : "block" } }, __t("Strumenti di Misura")),
React.createElement("p", { style: { color: "var(--text-3)", margin: "2px 0 0", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" } },
instruments.length,
" strumenti \u00B7 ",
valid,
" validi \u00B7 ",
expiring,
" in scadenza \u00B7 ",
expired,
" scaduti")),
React.createElement(Btn, { sm: true, onClick: () => setModal({ type: 'form', data: null }) }, "+ Nuovo strumento")),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 10, marginBottom: 16 } }, [
{ label: __t('Totale'), value: instruments.length, color: '#2dd4bf' },
{ label: __t('Validi'), value: valid, color: '#22c55e' },
{ label: __t('In scadenza'), value: expiring, color: '#f59e0b' },
{ label: __t('Scaduti'), value: expired, color: '#ef4444' },
].map(k => (React.createElement("div", { key: k.label, style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 10, padding: "12px 14px" } },
React.createElement("div", { style: { fontSize: 24, fontWeight: 800, color: k.color, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1 } }, k.value),
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", marginTop: 5, textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } }, k.label))))),
instruments.length === 0 ? (React.createElement(EmptyState, { icon: "", title: __t("Nessuno strumento di misura"), subtitle: __t("Registra i tuoi analizzatori, simulatori e multimetri: marca, modello, n\u00B0 serie, certificato di calibrazione e scadenza. Garantisce la rintracciabilit\u00E0 delle tue verifiche."), actions: [
{ label: "+ Nuovo strumento", onClick: () => setModal({ type: 'form', data: null }), primary: true }
] })) : (React.createElement(React.Fragment, null,
React.createElement(MobileSearch, { value: search, onChange: setSearch, placeholder: __t("Cerca per marca, modello, seriale, categoria\u2026"), count: filtered.length, total: instruments.length }),
React.createElement(FilterDropdown, { filters: {
status: { label: __t("Stato calibrazione"), options: ["valid", "expiring", "expired", "none"].map(v => ({ valid: "Valida", expiring: "In scadenza", expired: "Scaduta", none: "Non impostata" }[v])), value: filterStatus ? ({ valid: "Valida", expiring: "In scadenza", expired: "Scaduta", none: "Non impostata" }[filterStatus]) : "" },
category: { label: __t("Categoria"), options: categories, value: filterCategory },
}, onChange: (k, v) => {
if (k === "status") {
const map = { "Valida": "valid", "In scadenza": "expiring", "Scaduta": "expired", "Non impostata": "none" };
setFilterStatus(map[v] || "");
}
else if (k === "category") {
setFilterCategory(v);
}
}, onClearAll: () => { setFilterStatus(""); setFilterCategory(""); } }),
filtered.length === 0 ? (React.createElement("div", { style: { textAlign: "center", padding: "30px 20px", background: "var(--surface)", borderRadius: 10, border: "1px dashed var(--border)", fontSize: 13, color: "var(--text-3)" } }, __t("Nessuno strumento corrisponde alla ricerca o ai filtri"))) : isMobile ? (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, filtered.map(inst => {
const status = getStatus(inst);
return (React.createElement(SwipeableCard, { key: inst.id, onDelete: () => deleteInstrument(inst.id) },
React.createElement("div", { style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 12, overflow: "hidden", borderLeft: "3px solid " + status.color } },
React.createElement("div", { onClick: () => setModal({ type: 'form', data: inst }), style: { padding: "12px 14px 10px", cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", borderBottom: "1px solid var(--border-2)" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 } },
React.createElement("strong", { style: { color: "var(--text)", fontSize: 14, flex: 1, minWidth: 0, wordBreak: "break-word" } },
inst.brand,
" ",
inst.model),
React.createElement("span", { style: { padding: "2px 8px", background: status.color + "22", color: status.color, borderRadius: 6, fontSize: 10, fontWeight: 800, whiteSpace: "nowrap" } }, status.label)),
inst.internalCode && React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 3 } },
__t("Codice: "),
inst.internalCode),
inst.serial && React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginBottom: 3 } },
"S/N: ",
inst.serial),
inst.category && React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", marginBottom: 3 } }, inst.category),
inst.calExpiry && React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", marginTop: 4 } },
__t("Scadenza: "),
React.createElement("span", { style: { color: status.color, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" } }, inst.calExpiry)),
inst.calLab && React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 3 } },
__t("Lab: "),
inst.calLab)),
React.createElement("div", { style: { display: "flex", justifyContent: "space-around", background: "var(--bg-2)" } },
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: 'renew', data: inst }); }, style: { flex: 1, background: "transparent", color: "#2dd4bf", border: "none", borderRight: "1px solid var(--border-2)", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u21BB Rinnova"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: 'form', data: inst }); }, style: { flex: 1, background: "transparent", color: "var(--text-2)", border: "none", borderRight: "1px solid var(--border-2)", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u270F Modifica"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); deleteInstrument(inst.id); }, style: { background: "transparent", color: "#ef4444", border: "none", padding: "10px 14px", fontSize: 14, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u2715")))));
}))) : (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, filtered.map(inst => {
const status = getStatus(inst);
return (React.createElement("div", { key: inst.id, style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderLeft: "3px solid " + status.color, borderRadius: 10, padding: "12px 16px" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 5 } },
React.createElement("span", { style: { fontSize: 14, fontWeight: 800, color: "var(--text)" } },
inst.brand,
" ",
inst.model),
inst.internalCode && React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "var(--text-3)", background: "var(--bg)", borderRadius: 4, padding: "1px 6px", border: "1px solid var(--border-2)" } }, inst.internalCode),
inst.category && React.createElement("span", { style: { fontSize: 10, color: "var(--text-2)", background: "var(--border-2)", borderRadius: 4, padding: "1px 8px" } }, inst.category),
React.createElement("span", { style: { padding: "2px 10px", background: status.color + "22", color: status.color, border: `1px solid ${status.color}44`, borderRadius: 20, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" } }, status.label)),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", display: "flex", gap: 14, flexWrap: "wrap" } },
inst.serial && React.createElement("span", null,
"S/N: ",
React.createElement("span", { style: { color: "var(--text-2)", fontFamily: "'IBM Plex Mono', monospace" } }, inst.serial)),
inst.calDate && React.createElement("span", null,
__t("Ultima cal.: "),
React.createElement("span", { style: { color: "var(--text-2)", fontFamily: "'IBM Plex Mono', monospace" } }, inst.calDate)),
inst.calExpiry && React.createElement("span", null,
__t("Scadenza: "),
React.createElement("span", { style: { color: status.color, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" } }, inst.calExpiry)),
inst.calLab && React.createElement("span", null,
__t("Lab: "),
React.createElement("span", { style: { color: "var(--text-2)" } }, inst.calLab)),
inst.certNumber && React.createElement("span", null,
__t("Cert.: "),
React.createElement("span", { style: { color: "var(--text-2)", fontFamily: "'IBM Plex Mono', monospace" } }, inst.certNumber))),
inst.notes && React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", marginTop: 6, background: "var(--bg)", borderRadius: 6, padding: "6px 10px", border: "1px solid var(--border-2)" } }, inst.notes)),
React.createElement("div", { style: { display: "flex", gap: 6, flexShrink: 0 } },
React.createElement("button", { onClick: () => setModal({ type: 'renew', data: inst }), style: { background: "transparent", color: "#2dd4bf", border: "1px solid #2dd4bf44", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 11, fontWeight: 700 } }, "\u21BB Rinnova"),
React.createElement("button", { onClick: () => setModal({ type: 'form', data: inst }), style: { background: "transparent", color: "var(--text-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 11, fontWeight: 700 } }, "\u270F Modifica"),
React.createElement("button", { onClick: () => deleteInstrument(inst.id), style: { background: "transparent", color: "#ef4444", border: "1px solid #ef444433", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 11, fontWeight: 700 } }, "\u2715")))));
}))))),
(modal === null || modal === void 0 ? void 0 : modal.type) === 'form' && (React.createElement(Modal, { title: modal.data ? __t('Modifica Strumento') : __t('Nuovo Strumento'), onClose: () => setModal(null) },
React.createElement(InstrumentForm, { initial: modal.data, onSave: saveInstrument, onClose: () => setModal(null) }))),
(modal === null || modal === void 0 ? void 0 : modal.type) === 'renew' && (React.createElement(Modal, { title: __t("Rinnova Calibrazione"), onClose: () => setModal(null) },
React.createElement(RenewCalibrationForm, { instrument: modal.data, onSave: (data) => { saveInstrument(data); showToast('✓ Calibrazione rinnovata'); }, onClose: () => setModal(null) })))));
}
function InstrumentForm({ initial, onSave, onClose }) {
const [form, setForm] = React.useState(initial || {
brand: '', model: '', serial: '', internalCode: '', category: '',
calDate: '', calExpiry: '', calLab: '', certNumber: '', calInterval: 12, notes: ''
});
const [errors, setErrors] = React.useState({});
const set = (k, v) => setForm(f => (Object.assign(Object.assign({}, f), { [k]: v })));
const calcExpiry = (date, months) => {
if (!date || !months)
return '';
const d = new Date(date);
d.setMonth(d.getMonth() + parseInt(months));
return d.toISOString().slice(0, 10);
};
const INP = FORM_INP;
const LBL = FORM_LBL;
const ROW = FORM_ROW;
const COL = FORM_COL;
return (React.createElement("div", null,
React.createElement(ErrorSummary, { errors: errors }),
React.createElement("div", { style: ROW },
React.createElement("div", { style: COL },
React.createElement("label", { style: LBL }, __t("Marca *")),
React.createElement("input", { style: INP, value: form.brand, onChange: e => set('brand', e.target.value), placeholder: "es. Fluke, Rigel, Metrolab" })),
React.createElement("div", { style: COL },
React.createElement("label", { style: LBL }, __t("Modello *")),
React.createElement("input", { style: INP, value: form.model, onChange: e => set('model', e.target.value), placeholder: "es. 435-II, 288+" }))),
React.createElement("div", { style: ROW },
React.createElement("div", { style: COL },
React.createElement("label", { style: LBL }, __t("N\u00B0 Serie")),
React.createElement("input", { style: INP, value: form.serial, onChange: e => set('serial', e.target.value), placeholder: __t("Seriale costruttore") })),
React.createElement("div", { style: COL },
React.createElement("label", { style: LBL }, __t("Codice interno")),
React.createElement("input", { style: INP, value: form.internalCode, onChange: e => set('internalCode', e.target.value), placeholder: "es. STR-001" }))),
React.createElement("div", { style: { marginBottom: 12 } },
React.createElement("label", { style: LBL }, __t("Categoria")),
React.createElement("select", { style: INP, value: form.category, onChange: e => set('category', e.target.value) },
React.createElement("option", { value: "" }, "\u2014 Seleziona \u2014"),
CATEGORIES.map(c => React.createElement("option", { key: c, value: c }, c)))),
React.createElement("div", { style: { borderTop: '1px solid #2A2A38', margin: '14px 0 12px', paddingTop: 14 } },
React.createElement("div", { style: { fontSize: 11, color: '#2dd4bf', fontWeight: 700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 } }, __t("Dati Calibrazione")),
React.createElement("div", { style: ROW },
React.createElement("div", { style: COL },
React.createElement("label", { style: LBL }, __t("Data ultima calibrazione")),
React.createElement("input", { type: "date", style: INP, value: form.calDate, onChange: e => { set('calDate', e.target.value); set('calExpiry', calcExpiry(e.target.value, form.calInterval)); } })),
React.createElement("div", { style: { width: 120 } },
React.createElement("label", { style: LBL }, __t("Intervallo (mesi)")),
React.createElement("select", { style: INP, value: form.calInterval, onChange: e => { set('calInterval', e.target.value); set('calExpiry', calcExpiry(form.calDate, e.target.value)); } }, [6, 12, 24, 36].map(m => React.createElement("option", { key: m, value: m },
m,
" mesi"))))),
React.createElement("div", { style: ROW },
React.createElement("div", { style: COL },
React.createElement("label", { style: LBL }, __t("Scadenza calibrazione")),
React.createElement("input", { type: "date", style: Object.assign(Object.assign({}, INP), { color: form.calExpiry && new Date(form.calExpiry) < new Date() ? '#ef4444' : 'var(--text-bright)' }), value: form.calExpiry, onChange: e => set('calExpiry', e.target.value) })),
React.createElement("div", { style: COL },
React.createElement("label", { style: LBL }, __t("Laboratorio calibrazione")),
React.createElement("input", { style: INP, value: form.calLab, onChange: e => set('calLab', e.target.value), placeholder: "es. ACCREDIA, SIT, interno" }))),
React.createElement("div", { style: ROW },
React.createElement("div", { style: COL },
React.createElement("label", { style: LBL }, __t("N\u00B0 Certificato calibrazione")),
React.createElement("input", { style: INP, value: form.certNumber, onChange: e => set('certNumber', e.target.value), placeholder: "es. CAL-2025-0123" })))),
React.createElement("div", { style: { marginBottom: 14 } },
React.createElement("label", { style: LBL }, __t("Note")),
React.createElement("textarea", { style: Object.assign(Object.assign({}, INP), { minHeight: 60, resize: 'vertical' }), value: form.notes, onChange: e => set('notes', e.target.value), placeholder: __t("Note aggiuntive\u2026") })),
React.createElement("div", { style: FORM_FOOTER },
React.createElement("button", { onClick: onClose, style: FORM_BTN_GHOST }, __t("Annulla")),
React.createElement("button", { onClick: () => {
var _a, _b;
const errs = {};
if (!((_a = form.brand) === null || _a === void 0 ? void 0 : _a.trim()))
errs.brand = "La marca è obbligatoria";
if (!((_b = form.model) === null || _b === void 0 ? void 0 : _b.trim()))
errs.model = "Il modello è obbligatorio";
setErrors(errs);
if (Object.keys(errs).length > 0)
return;
onSave(form);
}, style: FORM_BTN_PRIMARY }, initial ? __t('Salva modifiche') : __t('Aggiungi strumento')))));
}
function RenewCalibrationForm({ instrument, onSave, onClose }) {
const today = new Date().toISOString().slice(0, 10);
const [form, setForm] = React.useState(Object.assign(Object.assign({}, instrument), { calDate: today, calExpiry: (() => { const d = new Date(today); d.setMonth(d.getMonth() + (instrument.calInterval || 12)); return d.toISOString().slice(0, 10); })(), certNumber: '', calLab: instrument.calLab || '' }));
const set = (k, v) => setForm(f => (Object.assign(Object.assign({}, f), { [k]: v })));
const INP = FORM_INP;
const LBL = FORM_LBL;
return (React.createElement("div", null,
React.createElement("div", { style: { background: 'var(--surface)', borderRadius: 8, padding: '10px 14px', marginBottom: 14,
border: '1px solid #2A2A38', fontSize: 13, color: 'var(--text-2)' } },
React.createElement("strong", { style: { color: 'var(--text-bright)' } },
instrument.brand,
" ",
instrument.model),
instrument.serial && React.createElement("span", { style: { marginLeft: 8, fontFamily: 'monospace', fontSize: 11 } },
"S/N: ",
instrument.serial)),
React.createElement("div", { style: { display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' } },
React.createElement("div", { style: { flex: 1, minWidth: 140 } },
React.createElement("label", { style: LBL }, __t("Data calibrazione *")),
React.createElement("input", { type: "date", style: INP, value: form.calDate, onChange: e => { set('calDate', e.target.value); const d = new Date(e.target.value); d.setMonth(d.getMonth() + (form.calInterval || 12)); set('calExpiry', d.toISOString().slice(0, 10)); } })),
React.createElement("div", { style: { flex: 1, minWidth: 140 } },
React.createElement("label", { style: LBL }, __t("Nuova scadenza")),
React.createElement("input", { type: "date", style: Object.assign(Object.assign({}, INP), { color: '#22c55e' }), value: form.calExpiry, onChange: e => set('calExpiry', e.target.value) }))),
React.createElement("div", { style: { marginBottom: 12 } },
React.createElement("label", { style: LBL }, __t("Laboratorio calibrazione")),
React.createElement("input", { style: INP, value: form.calLab, onChange: e => set('calLab', e.target.value), placeholder: "es. ACCREDIA lab 0123" })),
React.createElement("div", { style: { marginBottom: 14 } },
React.createElement("label", { style: LBL }, __t("N\u00B0 Nuovo certificato")),
React.createElement("input", { style: INP, value: form.certNumber, onChange: e => set('certNumber', e.target.value), placeholder: "es. CAL-2026-0456" })),
React.createElement("div", { style: { display: 'flex', gap: 8, justifyContent: 'flex-end' } },
React.createElement("button", { onClick: onClose, style: FORM_BTN_GHOST }, __t("Annulla")),
React.createElement("button", { onClick: () => onSave(form), style: FORM_BTN_PRIMARY }, "\u21BB Salva rinnovo"))));
}
export function TemplateEditor({ initial, existingTemplates, onSave, onClose }) {
const [tpl, setTpl] = React.useState(() => initial ? JSON.parse(JSON.stringify(initial)) : blankTemplate());
const [errors, setErrors] = React.useState({});
const setField = (k, v) => setTpl(t => (Object.assign(Object.assign({}, t), { [k]: v })));
const addSection = () => setTpl(t => (Object.assign(Object.assign({}, t), { sections: [...t.sections, { id: "sez" + Date.now(), title: "", items: [], measures: [] }] })));
const removeSection = (si) => setTpl(t => (Object.assign(Object.assign({}, t), { sections: t.sections.filter((_, i) => i !== si) })));
const setSectionField = (si, k, v) => setTpl(t => {
const sections = [...t.sections];
sections[si] = Object.assign(Object.assign({}, sections[si]), { [k]: v });
return Object.assign(Object.assign({}, t), { sections });
});
const addItem = (si) => setTpl(t => {
const sections = [...t.sections];
sections[si] = Object.assign(Object.assign({}, sections[si]), { items: [...(sections[si].items || []), { id: "item" + Date.now(), text: "" }] });
return Object.assign(Object.assign({}, t), { sections });
});
const removeItem = (si, ii) => setTpl(t => {
const sections = [...t.sections];
sections[si] = Object.assign(Object.assign({}, sections[si]), { items: sections[si].items.filter((_, i) => i !== ii) });
return Object.assign(Object.assign({}, t), { sections });
});
const setItemText = (si, ii, v) => setTpl(t => {
const sections = [...t.sections];
const items = [...sections[si].items];
items[ii] = Object.assign(Object.assign({}, items[ii]), { text: v });
sections[si] = Object.assign(Object.assign({}, sections[si]), { items });
return Object.assign(Object.assign({}, t), { sections });
});
const addMeasure = (si) => setTpl(t => {
const sections = [...t.sections];
sections[si] = Object.assign(Object.assign({}, sections[si]), { measures: [...(sections[si].measures || []), { id: "meas" + Date.now(), name: "", unit: "", expected: "", limitMin: "", limitVal: "", value: "" }] });
return Object.assign(Object.assign({}, t), { sections });
});
const removeMeasure = (si, mi) => setTpl(t => {
const sections = [...t.sections];
sections[si] = Object.assign(Object.assign({}, sections[si]), { measures: sections[si].measures.filter((_, i) => i !== mi) });
return Object.assign(Object.assign({}, t), { sections });
});
const setMeasureField = (si, mi, k, v) => setTpl(t => {
const sections = [...t.sections];
const measures = [...sections[si].measures];
measures[mi] = Object.assign(Object.assign({}, measures[mi]), { [k]: v });
sections[si] = Object.assign(Object.assign({}, sections[si]), { measures });
return Object.assign(Object.assign({}, t), { sections });
});
const handleSave = () => {
var _a;
const errs = {};
if (!((_a = tpl.label) === null || _a === void 0 ? void 0 : _a.trim()))
errs.label = "Il nome del template è obbligatorio";
if (!tpl.sections.length)
errs.sections = "Aggiungi almeno una sezione";
tpl.sections.forEach((s, i) => {
var _a;
if (!((_a = s.title) === null || _a === void 0 ? void 0 : _a.trim()))
errs["sec" + i] = "La sezione " + (i + 1) + " non ha titolo";
const hasContent = (s.items || []).some(it => { var _a; return (_a = it.text) === null || _a === void 0 ? void 0 : _a.trim(); }) || (s.measures || []).some(m => { var _a; return (_a = m.name) === null || _a === void 0 ? void 0 : _a.trim(); });
if (!hasContent)
errs["secempty" + i] = "La sezione " + (s.title || (i + 1)) + " è vuota (aggiungi controlli o misure)";
});
const dupe = Object.values(existingTemplates || {}).find(x => { var _a, _b; return ((_a = x.label) === null || _a === void 0 ? void 0 : _a.toLowerCase().trim()) === ((_b = tpl.label) === null || _b === void 0 ? void 0 : _b.toLowerCase().trim()) && x.id !== tpl.id; });
if (dupe)
errs.label = "Esiste già un template con questo nome";
setErrors(errs);
if (Object.keys(errs).length)
return;
const clean = Object.assign(Object.assign({}, tpl), { sections: tpl.sections.map(s => (Object.assign(Object.assign({}, s), { items: (s.items || []).filter(it => { var _a; return (_a = it.text) === null || _a === void 0 ? void 0 : _a.trim(); }), measures: (s.measures || []).map(m => (Object.assign(Object.assign({}, m), { limitMin: m.limitMin === "" ? undefined : parseFloat(m.limitMin), limitVal: m.limitVal === "" ? undefined : parseFloat(m.limitVal) }))).filter(m => { var _a; return (_a = m.name) === null || _a === void 0 ? void 0 : _a.trim(); }) }))) });
onSave(clean);
};
const SEC_BOX = { background: "var(--bg-2)", border: "1px solid var(--border-2)", borderRadius: 10, padding: 14, marginBottom: 14 };
const MINI_BTN = { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text-2)", padding: "5px 10px", cursor: "pointer", fontSize: 12, fontWeight: 700 };
const DEL_BTN = { background: "#ef444415", border: "1px solid #ef444433", borderRadius: 6, color: "#ef4444", padding: "4px 9px", cursor: "pointer", fontSize: 12, fontWeight: 700, flexShrink: 0 };
return (React.createElement("div", null,
React.createElement(ErrorSummary, { errors: errors }),
React.createElement("div", { style: FORM_ROW },
React.createElement("div", { style: FORM_COL },
React.createElement("label", { style: FORM_LBL }, __t("Nome template *")),
React.createElement("input", { style: Object.assign(Object.assign({}, FORM_INP), errorBorderStyle(errors.label)), value: tpl.label, onChange: e => setField("label", e.target.value), placeholder: "es. Defibrillatore EN 62745" })),
React.createElement("div", { style: FORM_COL },
React.createElement("label", { style: FORM_LBL }, __t("Norma di riferimento")),
React.createElement("input", { style: FORM_INP, value: tpl.norm, onChange: e => setField("norm", e.target.value), placeholder: "es. EN 62745" }))),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginBottom: 14, lineHeight: 1.5, background: "#1e2a3a44", borderRadius: 8, padding: "10px 12px" } },
__t("Costruisci il template aggiungendo "),
React.createElement("strong", { style: { color: "var(--text-2)" } }, "sezioni"),
". Ogni sezione pu\u00F2 contenere",
React.createElement("strong", { style: { color: "#5eead4" } }, __t(" controlli s\u00EC/no")),
" (ispezioni visive, funzionali) e",
React.createElement("strong", { style: { color: "#a855f7" } }, " misure numeriche"),
" (valori con limiti di accettazione)."),
tpl.sections.map((sec, si) => (React.createElement("div", { key: sec.id, style: SEC_BOX },
React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 12 } },
React.createElement("span", { style: { fontSize: 11, fontWeight: 800, color: "#2dd4bf", flexShrink: 0 } },
"SEZIONE ",
si + 1),
React.createElement("input", { style: Object.assign(Object.assign({}, FORM_INP), { padding: "8px 11px" }), value: sec.title, onChange: e => setSectionField(si, "title", e.target.value), placeholder: __t("Titolo sezione (es. Ispezione visiva)") }),
React.createElement("button", { onClick: () => removeSection(si), style: DEL_BTN, title: __t("Elimina sezione") }, "\u2715")),
React.createElement("input", { style: Object.assign(Object.assign({}, FORM_INP), { padding: "7px 11px", fontSize: 12, marginBottom: 12, fontStyle: "italic" }), value: sec.note || "", onChange: e => setSectionField(si, "note", e.target.value), placeholder: __t("Nota/istruzioni per questa sezione (opzionale)") }),
(sec.items || []).length > 0 && (React.createElement("div", { style: { marginBottom: 10 } },
React.createElement("div", { style: { fontSize: 10, color: "#5eead4", fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: .5 } }, __t("\u2713 Controlli s\u00EC / no")),
sec.items.map((it, ii) => (React.createElement("div", { key: it.id, style: { display: "flex", gap: 6, marginBottom: 6, alignItems: "center" } },
React.createElement("span", { style: { color: "var(--text-4)", fontSize: 12, flexShrink: 0 } },
ii + 1,
"."),
React.createElement("input", { style: Object.assign(Object.assign({}, FORM_INP), { padding: "7px 10px", fontSize: 13 }), value: it.text, onChange: e => setItemText(si, ii, e.target.value), placeholder: __t("Descrizione del controllo") }),
React.createElement("button", { onClick: () => removeItem(si, ii), style: DEL_BTN, title: __t("Rimuovi") }, "\u2715")))))),
(sec.measures || []).length > 0 && (React.createElement("div", { style: { marginBottom: 10 } },
React.createElement("div", { style: { fontSize: 10, color: "#a855f7", fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: .5 } }, "\u00B1 Misure numeriche"),
sec.measures.map((m, mi) => (React.createElement("div", { key: m.id, style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 10, marginBottom: 8 } },
React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 7, alignItems: "center" } },
React.createElement("input", { style: Object.assign(Object.assign({}, FORM_INP), { padding: "7px 10px", fontSize: 13 }), value: m.name, onChange: e => setMeasureField(si, mi, "name", e.target.value), placeholder: __t("Nome misura (es. Energia erogata)") }),
React.createElement("button", { onClick: () => removeMeasure(si, mi), style: DEL_BTN, title: __t("Rimuovi") }, "\u2715")),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(90px,1fr))", gap: 6 } },
React.createElement("input", { style: Object.assign(Object.assign({}, FORM_INP), { padding: "6px 9px", fontSize: 12 }), value: m.unit, onChange: e => setMeasureField(si, mi, "unit", e.target.value), placeholder: __t("Unit\u00E0 (J, V, \u00B5A)") }),
React.createElement("input", { style: Object.assign(Object.assign({}, FORM_INP), { padding: "6px 9px", fontSize: 12 }), value: m.expected, onChange: e => setMeasureField(si, mi, "expected", e.target.value), placeholder: __t("Atteso (testo)") }),
React.createElement("input", { style: Object.assign(Object.assign({}, FORM_INP), { padding: "6px 9px", fontSize: 12 }), type: "number", value: m.limitMin, onChange: e => setMeasureField(si, mi, "limitMin", e.target.value), placeholder: __t("Min") }),
React.createElement("input", { style: Object.assign(Object.assign({}, FORM_INP), { padding: "6px 9px", fontSize: 12 }), type: "number", value: m.limitVal, onChange: e => setMeasureField(si, mi, "limitVal", e.target.value), placeholder: __t("Max") }))))))),
React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 10 } },
React.createElement("button", { onClick: () => addItem(si), style: Object.assign(Object.assign({}, MINI_BTN), { color: "#5eead4", borderColor: "#2dd4bf33" }) }, __t("+ Controllo s\u00EC/no")),
React.createElement("button", { onClick: () => addMeasure(si), style: Object.assign(Object.assign({}, MINI_BTN), { color: "#a855f7", borderColor: "#a855f733" }) }, "+ Misura numerica"))))),
React.createElement("button", { onClick: addSection, style: Object.assign(Object.assign({}, FORM_BTN_GHOST), { width: "100%", marginBottom: 8, borderStyle: "dashed" }) }, "+ Aggiungi sezione"),
React.createElement("div", { style: FORM_FOOTER },
React.createElement("button", { onClick: onClose, style: FORM_BTN_GHOST }, __t("Annulla")),
React.createElement("button", { onClick: handleSave, style: FORM_BTN_PRIMARY }, initial ? __t("Salva modifiche") : __t("Crea template")))));
}
