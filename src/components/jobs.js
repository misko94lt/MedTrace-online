/* MedTrace — interventi: form e dettaglio job (estratti da app.js, v3.02) */
import { AssetCombobox, ErrorSummary, Grid, Inp, Modal, Sel, Span2, Txt, SignaturePad, TechSignatureField } from "./ui.js";
import { Btn, TecnicoPicker, techSignature } from "./shared.js";
import { TIMELINE_ICON, TIMELINE_LABEL } from "../constants/ui.js";
import { jobShortCode, jobTipoLabel, withCreateMeta, withUpdateMeta } from "../lib/util.js";
import { generateJobPDF } from "../lib/reports.js";
export function JobForm({ initial, assets, parts, customers, technicians, onSave, onClose }) {
var _a;
const blank = { assetId: ((_a = assets[0]) === null || _a === void 0 ? void 0 : _a.id) || "", customerId: "", type: "correttiva", priority: "normale", status: "aperto", assignee: "", openDate: new Date().toISOString().slice(0, 10), closeDate: "", description: "", parts: [], laborHours: 0, laborRate: 55, travelCost: 0, notes: "", timeline: [], photos: [], technicianSignature: "", departmentSignature: "" };
const [f, setF] = React.useState(initial ? Object.assign(Object.assign(Object.assign({}, blank), initial), { timeline: initial.timeline || [], photos: initial.photos || [], parts: initial.parts || [] }) : blank);
const [errors, setErrors] = React.useState({});
const s = k => e => setF(x => (Object.assign(Object.assign({}, x), { [k]: e.target.value })));
React.useEffect(() => {
if (f.assetId && !f.customerId) {
const a = assets.find(x => x.id === f.assetId);
if (a === null || a === void 0 ? void 0 : a.customerId)
setF(x => (Object.assign(Object.assign({}, x), { customerId: a.customerId })));
}
}, [f.assetId]);
React.useEffect(() => { if (f.technicianSignature) return; const sig = techSignature(technicians, f.assignee); if (sig) setF(x => (Object.assign(Object.assign({}, x), { technicianSignature: sig }))); }, [f.assignee]);
const addPart = () => setF(x => { var _a; return (Object.assign(Object.assign({}, x), { parts: [...x.parts, { partId: ((_a = parts[0]) === null || _a === void 0 ? void 0 : _a.id) || "", qty: 1 }] })); });
const remPart = i => setF(x => (Object.assign(Object.assign({}, x), { parts: x.parts.filter((_, idx) => idx !== i) })));
const setPart = (i, k, v) => setF(x => { const a = [...x.parts]; a[i] = Object.assign(Object.assign({}, a[i]), { [k]: k === "qty" ? +v : v }); return Object.assign(Object.assign({}, x), { parts: a }); });
const addStep = () => setF(x => (Object.assign(Object.assign({}, x), { timeline: [...(x.timeline || []), {
id: "T" + Date.now(),
date: new Date().toISOString().slice(0, 10),
time: new Date().toTimeString().slice(0, 5),
type: "sopralluogo",
description: "",
durationMin: 30,
technician: x.assignee || ""
}] })));
const remStep = i => setF(x => (Object.assign(Object.assign({}, x), { timeline: (x.timeline || []).filter((_, idx) => idx !== i) })));
const setStep = (i, k, v) => setF(x => { const a = [...(x.timeline || [])]; a[i] = Object.assign(Object.assign({}, a[i]), { [k]: k === "durationMin" ? +v : v }); return Object.assign(Object.assign({}, x), { timeline: a }); });
const partsTot = f.parts.reduce((s, p) => { const pt = parts.find(x => x.id === p.partId); return s + (pt ? (pt.sellPrice || pt.unitPrice) * p.qty : 0); }, 0);
const laborTot = +f.laborHours * +f.laborRate;
if (assets.length === 0) {
return (React.createElement("div", { style: { textAlign: "center", padding: "20px 0", color: "var(--text-2)" } },
"Devi prima registrare almeno un apparecchio.",
React.createElement("div", { style: { marginTop: 14 } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Chiudi"))));
}
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement(ErrorSummary, { errors: errors }),
React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 5 } },
React.createElement("label", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } }, "Apparecchio"),
React.createElement(AssetCombobox, { value: f.assetId, onChange: id => setF(x => (Object.assign(Object.assign({}, x), { assetId: id }))), assets: assets, customers: customers, placeholder: "Seleziona apparecchio" })),
React.createElement(Sel, { label: "Cliente (opzionale)", value: f.customerId, onChange: s("customerId") },
React.createElement("option", { value: "" }, "\u2014 Auto da apparecchio \u2014"),
customers.map(c => React.createElement("option", { key: c.id, value: c.id }, c.name))),
React.createElement(Sel, { label: "Tipo", value: f.type, onChange: s("type") }, ["correttiva", "preventiva"].map(v => React.createElement("option", { key: v }, v))),
React.createElement(Sel, { label: "Priorit\u00E0", value: f.priority, onChange: s("priority") }, ["urgente", "alta", "normale", "bassa"].map(v => React.createElement("option", { key: v }, v))),
React.createElement(Sel, { label: "Stato", value: f.status, onChange: s("status") }, ["da accettare", "aperto", "in corso", "in attesa ricambi", "in attesa cliente", "in attesa accesso", "chiuso"].map(v => React.createElement("option", { key: v }, v))),
React.createElement(TecnicoPicker, { label: "Tecnico/i", value: f.assignee, onChange: v => setF(x => (Object.assign(Object.assign({}, x), { assignee: v }))), technicians: technicians }),
React.createElement(Inp, { label: "Data apertura", type: "date", value: f.openDate, onChange: s("openDate") }),
React.createElement(Inp, { label: "Data chiusura", type: "date", value: f.closeDate, onChange: s("closeDate") }),
React.createElement(Span2, null,
React.createElement(Txt, { label: "Descrizione", value: f.description, onChange: s("description") }))),
parts.length > 0 && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } },
React.createElement("span", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } }, "Parti"),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: addPart }, "+ Aggiungi")),
f.parts.map((p, i) => (React.createElement("div", { key: i, style: { display: "grid", gridTemplateColumns: "1fr 80px auto", gap: 8, marginBottom: 8 } },
React.createElement("select", { value: p.partId, onChange: e => setPart(i, "partId", e.target.value), style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 10px", color: "var(--text)" } }, parts.map(pt => React.createElement("option", { key: pt.id, value: pt.id },
pt.code,
" \u2014 ",
pt.name,
" (\u20AC",
pt.sellPrice || pt.unitPrice,
")"))),
React.createElement("input", { type: "number", min: 1, value: p.qty, onChange: e => setPart(i, "qty", e.target.value), style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 10px", color: "var(--text)" } }),
React.createElement(Btn, { variant: "danger", sm: true, onClick: () => remPart(i) }, "\u2715")))))),
React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement(Inp, { label: "Ore manodopera", type: "number", step: "0.5", value: f.laborHours, onChange: s("laborHours") }),
React.createElement(Inp, { label: "Tariffa oraria (\u20AC)", type: "number", value: f.laborRate, onChange: s("laborRate") }),
React.createElement(Inp, { label: "Viaggio / trasferta (\u20AC)", type: "number", step: "0.01", value: f.travelCost, onChange: s("travelCost") }),
React.createElement("div", null)),
React.createElement("div", { style: { background: "var(--bg)", borderRadius: 10, padding: "12px 16px", display: "flex", flexWrap: "wrap", gap: 20 } },
React.createElement("span", { style: { color: "var(--text-3)", fontSize: 12 } },
"Parti: ",
React.createElement("strong", { style: { color: "var(--text)" } },
"\u20AC",
partsTot.toFixed(2))),
React.createElement("span", { style: { color: "var(--text-3)", fontSize: 12 } },
"Manodopera: ",
React.createElement("strong", { style: { color: "var(--text)" } },
"\u20AC",
laborTot.toFixed(2))),
React.createElement("span", { style: { color: "var(--text-3)", fontSize: 12 } },
"Totale: ",
React.createElement("strong", { style: { color: "#22c55e", fontSize: 15 } },
"\u20AC",
(partsTot + laborTot).toFixed(2)))),
React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } },
React.createElement("span", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } }, " Timeline interventi"),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: addStep }, "+ Nuovo passaggio")),
(f.timeline || []).length === 0 ? (React.createElement("div", { style: { padding: "14px 16px", background: "var(--bg)", border: "1px dashed var(--border)", borderRadius: 8, fontSize: 12, color: "var(--text-3)", textAlign: "center" } }, "Nessun passaggio registrato. Aggiungi sopralluogo, attesa parti, riparazione, test finale...")) : (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
f.timeline.map((step, i) => (React.createElement("div", { key: step.id || i, style: { background: "var(--bg)", border: "1px solid var(--border-2)", borderLeft: "3px solid #2dd4bf", borderRadius: 8, padding: "10px 12px" } },
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 } },
React.createElement("input", { type: "date", value: step.date, onChange: e => setStep(i, "date", e.target.value), style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 9px", color: "var(--text)", fontSize: 12 } }),
React.createElement("input", { type: "time", value: step.time, onChange: e => setStep(i, "time", e.target.value), style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 9px", color: "var(--text)", fontSize: 12 } })),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 90px", gap: 8, marginBottom: 8 } },
React.createElement("select", { value: step.type, onChange: e => setStep(i, "type", e.target.value), style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 9px", color: "var(--text)", fontSize: 12 } },
React.createElement("option", { value: "sopralluogo" }, "Sopralluogo / Diagnosi"),
React.createElement("option", { value: "attesa_preventivo" }, "Attesa preventivo"),
React.createElement("option", { value: "attesa_parti" }, "Attesa parti / ricambi"),
React.createElement("option", { value: "attesa_autorizzazione" }, "Attesa autorizzazione cliente"),
React.createElement("option", { value: "riparazione" }, "Riparazione / Intervento"),
React.createElement("option", { value: "test" }, "Test funzionale"),
React.createElement("option", { value: "verifica_sicurezza" }, "Verifica sicurezza elettrica"),
React.createElement("option", { value: "consegna" }, "Consegna / Riconsegna"),
React.createElement("option", { value: "chiamata" }, "Chiamata cliente"),
React.createElement("option", { value: "email" }, "Email / Comunicazione"),
React.createElement("option", { value: "altro" }, "Altro")),
React.createElement("input", { type: "number", min: 0, step: 5, value: step.durationMin, onChange: e => setStep(i, "durationMin", e.target.value), placeholder: "min", style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 9px", color: "var(--text)", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" } })),
React.createElement("input", { type: "text", value: step.description, onChange: e => setStep(i, "description", e.target.value), placeholder: "Descrizione (cosa \u00E8 stato fatto / cosa si attende)", style: { width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 9px", color: "var(--text)", fontSize: 12, marginBottom: 8 } }),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "center" } },
React.createElement("input", { type: "text", value: step.technician || "", onChange: e => setStep(i, "technician", e.target.value), placeholder: "Tecnico", style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 9px", color: "var(--text)", fontSize: 12 } }),
React.createElement(Btn, { variant: "danger", sm: true, onClick: () => remStep(i) }, "\u2715"))))),
f.timeline.length > 0 && (React.createElement("div", { style: { padding: "8px 12px", background: "var(--surface)", borderRadius: 6, fontSize: 11, color: "var(--text-3)", textAlign: "right" } },
"Tempo totale lavorato: ",
React.createElement("strong", { style: { color: "#22c55e", fontFamily: "'IBM Plex Mono', monospace" } },
(f.timeline.reduce((s, t) => s + (+t.durationMin || 0), 0) / 60).toFixed(1),
"h"),
" (",
f.timeline.reduce((s, t) => s + (+t.durationMin || 0), 0),
" min)"))))),
React.createElement(Txt, { label: "Note", value: f.notes, onChange: s("notes") }),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 } },
React.createElement(TechSignatureField, { label: "Firma Tecnico (obbligatoria alla chiusura)", profileSig: techSignature(technicians, f.assignee), techName: f.assignee, value: f.technicianSignature || "", onChange: v => setF(x => (Object.assign(Object.assign({}, x), { technicianSignature: v }))), height: 120 }),
React.createElement(SignaturePad, { label: "Firma Referente reparto (opzionale)", value: f.departmentSignature || "", onChange: v => setF(x => (Object.assign(Object.assign({}, x), { departmentSignature: v }))), height: 120 })),
errors.technicianSignature ? React.createElement("div", { style: { fontSize: 11, color: "#ef4444" } }, errors.technicianSignature) : null,

React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Annulla"),
React.createElement(Btn, { onClick: () => {
var _a;
const errs = {};
if (!f.assetId)
errs.assetId = "Seleziona un apparecchio";
if (!((_a = f.description) === null || _a === void 0 ? void 0 : _a.trim()))
errs.description = "Descrizione del lavoro obbligatoria";
if (!f.openDate)
errs.openDate = "Inserisci la data di apertura";
if (f.status === "chiuso" && !f.closeDate)
errs.closeDate = "Data chiusura obbligatoria se lo stato è chiuso";
if (f.status === "chiuso" && !f.technicianSignature)
errs.technicianSignature = "Firma del tecnico obbligatoria per chiudere l'intervento";
setErrors(errs);
if (Object.keys(errs).length > 0)
return;
onSave(Object.assign(Object.assign({}, f), { laborHours: +f.laborHours, laborRate: +f.laborRate, travelCost: +f.travelCost || 0 }));
} }, "Salva"))));
}
export function JobDetailModal({ job, assets, parts, customers, company, onEdit, onTimeline, onClose, onCreateQuote }) {
const asset = assets.find(a => a.id === job.assetId) || {};
const customer = customers.find(c => c.id === (job.customerId || asset.customerId)) || {};
const TYPE_COLOR = { correttiva: "#ef4444", preventiva: "#3b82f6", verifica: "#a855f7", calibrazione: "#f59e0b" };
const STAT_COLOR = { aperto: "#f59e0b", "in corso": "#3b82f6", chiuso: "#22c55e" };
const PRIO_COLOR = { urgente: "#ef4444", alta: "#f97316", normale: "var(--text-3)", bassa: "var(--text-4)" };
const sortedSteps = [...(job.timeline || [])].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
const totMin = sortedSteps.reduce((s, t) => s + (+t.durationMin || +t.hours * 60 || 0), 0);
const partsTot = (job.parts || []).reduce((s, p) => { const pt = parts.find(x => x.id === p.partId); return s + (pt ? (pt.sellPrice || pt.unitPrice || 0) * p.qty : 0); }, 0);
const laborTot = (+job.laborHours || 0) * (+job.laborRate || 0);
const Badge = ({ txt, color }) => (React.createElement("span", { style: { fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 20, background: color + "1e", color: color, border: "1px solid " + color + "44", textTransform: "capitalize" } }, txt));
const Field = ({ label, value }) => (React.createElement("div", null,
React.createElement("div", { style: { fontSize: 9.5, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .6, fontWeight: 700, marginBottom: 2 } }, label),
React.createElement("div", { style: { fontSize: 13.5, color: "var(--text)", fontWeight: 600 } }, value || "—")));
return (React.createElement(Modal, { title: "Intervento", wide: true, onClose: onClose },
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 18 } },
React.createElement("div", { style: { background: "var(--surface)", borderRadius: 12, padding: "16px 18px", border: "1px solid #24242F" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" } },
React.createElement("div", { style: { minWidth: 0 } },
React.createElement("div", { style: { fontSize: 18, fontWeight: 900, color: "var(--text-bright)", lineHeight: 1.2 } }, asset.name || "Apparecchio"),
React.createElement("div", { style: { fontSize: 12, color: "var(--text-2)", marginTop: 3 } },
[asset.brand, asset.model].filter(Boolean).join(" "),
asset.serial ? " · SN " + asset.serial : ""),
customer.name && React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)", marginTop: 2 } },
"Cliente: ",
customer.name)),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" } },
React.createElement(Badge, { txt: job.type || "—", color: TYPE_COLOR[job.type] || "var(--text-3)" }),
React.createElement(Badge, { txt: job.status || "—", color: STAT_COLOR[job.status] || "var(--text-3)" }),
job.priority && React.createElement(Badge, { txt: job.priority, color: PRIO_COLOR[job.priority] || "var(--text-3)" })))),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14 } },
React.createElement(Field, { label: "Data apertura", value: job.openDate }),
React.createElement(Field, { label: "Data chiusura", value: job.closeDate }),
React.createElement(Field, { label: "Tecnico", value: job.assignee }),
React.createElement(Field, { label: "Verifica collegata", value: job.iecReportId || job.funcReportId ? "Sì" : "—" })),
job.description && (React.createElement("div", null,
React.createElement("div", { style: { fontSize: 9.5, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .6, fontWeight: 700, marginBottom: 5 } }, "Descrizione lavoro"),
React.createElement("div", { style: { fontSize: 13.5, color: "var(--text)", lineHeight: 1.5, background: "var(--surface)", borderRadius: 8, padding: "12px 14px", border: "1px solid #24242F" } }, job.description))),
job.notes && (React.createElement("div", null,
React.createElement("div", { style: { fontSize: 9.5, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .6, fontWeight: 700, marginBottom: 5 } }, "Note"),
React.createElement("div", { style: { fontSize: 13, color: "var(--text-strong)", lineHeight: 1.5, fontStyle: "italic" } }, job.notes))),
(partsTot > 0 || laborTot > 0) && (React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } },
laborTot > 0 && React.createElement("div", { style: { flex: 1, minWidth: 120, background: "var(--surface)", borderRadius: 10, padding: "10px 14px", border: "1px solid #24242F" } },
React.createElement("div", { style: { fontSize: 9.5, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .6, fontWeight: 700 } }, "Manodopera"),
React.createElement("div", { style: { fontSize: 16, fontWeight: 900, color: "#a855f7", marginTop: 3 } },
"\u20AC ",
laborTot.toFixed(2)),
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)" } },
job.laborHours,
"h \u00D7 \u20AC",
job.laborRate)),
partsTot > 0 && React.createElement("div", { style: { flex: 1, minWidth: 120, background: "var(--surface)", borderRadius: 10, padding: "10px 14px", border: "1px solid #24242F" } },
React.createElement("div", { style: { fontSize: 9.5, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .6, fontWeight: 700 } }, "Ricambi"),
React.createElement("div", { style: { fontSize: 16, fontWeight: 900, color: "#3b82f6", marginTop: 3 } },
"\u20AC ",
partsTot.toFixed(2)),
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)" } },
(job.parts || []).length,
" pezzi")),
React.createElement("div", { style: { flex: 1, minWidth: 120, background: "#2dd4bf12", borderRadius: 10, padding: "10px 14px", border: "1px solid #2dd4bf33" } },
React.createElement("div", { style: { fontSize: 9.5, color: "#5eead4", textTransform: "uppercase", letterSpacing: .6, fontWeight: 700 } }, "Totale"),
React.createElement("div", { style: { fontSize: 16, fontWeight: 900, color: "#2dd4bf", marginTop: 3 } },
"\u20AC ",
(partsTot + laborTot).toFixed(2))))),
React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 } },
React.createElement("span", { style: { fontSize: 11, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } },
"Storico interventi ",
sortedSteps.length > 0 && "· " + sortedSteps.length + " voci"),
totMin > 0 && React.createElement("span", { style: { fontSize: 12, color: "#a855f7", fontWeight: 700 } },
(totMin / 60).toFixed(1),
"h totali")),
sortedSteps.length === 0 ? (React.createElement("div", { style: { textAlign: "center", color: "var(--text-4)", padding: "20px 0", fontSize: 12.5, background: "var(--bg-2)", borderRadius: 10, border: "1px dashed #24242F" } }, "Nessuna voce nello storico. Usa \"Modifica cronologia\" per aggiungere cosa \u00E8 stato fatto, quando e da chi.")) : (React.createElement("div", null, sortedSteps.map((step, i) => (React.createElement("div", { key: step.id || i, style: { display: "flex", gap: 14, marginBottom: 14 } },
React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center" } },
React.createElement("div", { style: { width: 34, height: 34, borderRadius: "50%", background: "#2dd4bf22", border: "1px solid #2dd4bf44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 } }, TIMELINE_ICON[step.type] || "·"),
i < sortedSteps.length - 1 && React.createElement("div", { style: { width: 2, flex: 1, background: "var(--border)", marginTop: 4, minHeight: 14 } })),
React.createElement("div", { style: { flex: 1, background: "var(--surface)", borderRadius: 8, padding: "10px 14px", border: "1px solid #24242F", marginBottom: 2 } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, gap: 8, flexWrap: "wrap" } },
React.createElement("span", { style: { color: "#5eead4", fontWeight: 700, fontSize: 13 } }, TIMELINE_LABEL[step.type] || step.type),
React.createElement("span", { style: { color: "var(--text-3)", fontSize: 11 } },
step.date,
(step.hours > 0 || step.durationMin > 0) ? " · " + (step.hours || (step.durationMin / 60).toFixed(1)) + "h" : "")),
step.note && React.createElement("div", { style: { color: "var(--text)", fontSize: 13, lineHeight: 1.45 } }, step.note)))))))),
(job.photos || []).length > 0 && (React.createElement("div", null,
React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 10 } },
"Foto (",
job.photos.length,
")"),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 8 } }, job.photos.map(photo => (React.createElement("div", { key: photo.id, style: { aspectRatio: "1", borderRadius: 8, overflow: "hidden", border: "1px solid #24242F", cursor: "pointer" }, onClick: () => window.open(photo.data, "_blank") },
React.createElement("img", { src: photo.data, alt: photo.name || "", style: { width: "100%", height: "100%", objectFit: "cover" } }))))))),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap", borderTop: "1px solid #24242F", paddingTop: 16 } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Chiudi"),
onCreateQuote && React.createElement(Btn, { variant: "ghost", onClick: onCreateQuote }, "\uD83D\uDCC4 Crea preventivo"),
React.createElement(Btn, { variant: "ghost", onClick: onTimeline }, "\uD83D\uDD50 Modifica cronologia"),
React.createElement(Btn, { onClick: onEdit }, "\u270F Modifica dati"),
React.createElement(Btn, { variant: "ghost", onClick: () => generateJobPDF(job, assets, parts, customers, company) }, "\uD83D\uDCC4 PDF")))));
}
