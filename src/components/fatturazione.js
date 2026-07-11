import { t as __t } from "../constants/i18n.js";
/* MedTrace — fatturazione: preventivi (form+pagina), fatture, numerazione, aliquote IVA (estratti da app.js, v3.02) */
import { Grid, Inp, Modal, Sel, Txt } from "./ui.js";
import { Btn } from "./shared.js";
import { FORM_BTN_GHOST, FORM_BTN_PRIMARY, FORM_INP, FORM_LBL, QUOTE_STATUS_COLOR } from "../constants/ui.js";
import { withCreateMeta, withUpdateMeta, jobShortCode, jobTipoLabel } from "../lib/util.js";
import { showPDFPreview } from "../lib/export.js";
import { generateQuotePDF } from "../lib/reports.js";
export const IVA_DEFAULT = 22;
export function InvoiceForm({ initial, customers, jobs, assets, parts, generateNumber, onSave, onClose }) {
var _a;
const blank = {
number: generateNumber(),
customerId: ((_a = customers[0]) === null || _a === void 0 ? void 0 : _a.id) || "",
date: new Date().toISOString().slice(0, 10),
dueDate: "",
status: "bozza",
items: [],
jobIds: [],
paymentTerms: "Bonifico bancario a 30gg data preventivo",
notes: ""
};
const [f, setF] = React.useState(initial ? Object.assign(Object.assign(Object.assign({}, blank), initial), { items: initial.items || [], jobIds: initial.jobIds || [] }) : blank);
const [showDetails, setShowDetails] = React.useState(false);
const [bulkSvc, setBulkSvc] = React.useState("");
const [bulkN, setBulkN] = React.useState("");
const [bulkPrice, setBulkPrice] = React.useState("");
const SERVIZI_COMUNI = ["Verifica di sicurezza elettrica", "Verifica funzionale", "Manutenzione preventiva", "Taratura", "Controllo periodico", "Collaudo di accettazione"];
const addBulk = () => {
const n = parseInt(bulkN, 10) || 0;
const pr = parseFloat(bulkPrice) || 0;
if (!bulkSvc.trim() || n <= 0)
return;
setF(x => (Object.assign(Object.assign({}, x), { items: [...x.items, { description: bulkSvc.trim() + " (× " + n + " macchine)", qty: n, unitPrice: pr, vat: IVA_DEFAULT }] })));
setBulkSvc("");
setBulkN("");
setBulkPrice("");
};
const s = k => e => setF(x => (Object.assign(Object.assign({}, x), { [k]: e.target.value })));
const addItem = () => setF(x => (Object.assign(Object.assign({}, x), { items: [...x.items, { description: "", qty: 1, unitPrice: 0, vat: IVA_DEFAULT }] })));
const remItem = i => setF(x => (Object.assign(Object.assign({}, x), { items: x.items.filter((_, idx) => idx !== i) })));
const setItem = (i, k, v) => setF(x => { const a = [...x.items]; a[i] = Object.assign(Object.assign({}, a[i]), { [k]: k === "qty" || k === "unitPrice" || k === "vat" ? +v : v }); return Object.assign(Object.assign({}, x), { items: a }); });
const importFromJob = (jobId) => {
const job = jobs.find(j => j.id === jobId);
if (!job)
return;
const asset = assets.find(a => a.id === job.assetId);
const newItems = [];
(job.parts || []).forEach(p => {
const pt = parts.find(x => x.id === p.partId);
if (pt)
newItems.push({
description: (pt.name) + " (" + (pt.code) + ")",
qty: p.qty, unitPrice: pt.sellPrice || pt.unitPrice, vat: IVA_DEFAULT
});
});
if (job.laborHours > 0) {
newItems.push({
description: "Manodopera - " + ((asset === null || asset === void 0 ? void 0 : asset.name) || "intervento") + " (rif. " + (job.id) + ")",
qty: job.laborHours, unitPrice: job.laborRate, vat: IVA_DEFAULT
});
}
setF(x => (Object.assign(Object.assign({}, x), { items: [...x.items, ...newItems], jobIds: x.jobIds.includes(jobId) ? x.jobIds : [...x.jobIds, jobId], customerId: x.customerId || job.customerId || (asset === null || asset === void 0 ? void 0 : asset.customerId) || x.customerId })));
};
const subtotal = f.items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
const totalVAT = f.items.reduce((s, it) => s + (it.qty * it.unitPrice * it.vat / 100), 0);
const grandTotal = subtotal + totalVAT;
const customerJobs = jobs.filter(j => {
if (j.status !== "chiuso")
return false;
if (j.type === "verifica" || j.type === "calibrazione")
return false;
const asset = assets.find(a => a.id === j.assetId);
return (j.customerId || (asset === null || asset === void 0 ? void 0 : asset.customerId)) === f.customerId;
});
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement(Sel, { label: __t("Cliente"), value: f.customerId, onChange: s("customerId") },
React.createElement("option", { value: "" }, "\u2014 Seleziona \u2014"),
customers.map(c => React.createElement("option", { key: c.id, value: c.id }, c.name))),
React.createElement(Inp, { label: __t("Data preventivo"), type: "date", value: f.date, onChange: s("date") })),
f.customerId && customerJobs.length > 0 && (React.createElement("div", { style: { background: "var(--bg)", borderRadius: 10, padding: "10px 14px", border: "1px solid var(--border)" } },
React.createElement("div", { style: { fontSize: 10, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 8 } }, __t("Importa da un job chiuso del cliente")),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } }, customerJobs.map(j => {
const used = f.jobIds.includes(j.id);
return (React.createElement("button", { key: j.id, onClick: () => !used && importFromJob(j.id), disabled: used, style: {
background: used ? "#22c55e22" : "var(--surface-2)",
border: "1px solid " + (used ? "#22c55e44" : "var(--surface-4)"),
color: used ? "#22c55e" : "var(--text-2)", borderRadius: 8, padding: "5px 10px", cursor: used ? "default" : "pointer", fontSize: 11
} },
used ? "✓ " : "+ ",
jobTipoLabel(j),
" \u00B7 ",
j.openDate || "",
" ",
jobShortCode(j)));
})))),
React.createElement("div", { style: { background: "var(--bg)", borderRadius: 10, padding: "12px 14px", border: "1px solid var(--border)" } },
React.createElement("div", { style: { fontSize: 10, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 8 } }, __t("Aggiungi servizio in blocco (es. contratto per tot macchine)")),
React.createElement("datalist", { id: "servizi-comuni" }, SERVIZI_COMUNI.map(sv => React.createElement("option", { key: sv, value: sv }))),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 80px 100px auto", gap: 6, alignItems: "center" } },
React.createElement("input", { list: "servizi-comuni", value: bulkSvc, onChange: e => setBulkSvc(e.target.value), placeholder: __t("Servizio (es. Verifica sicurezza elettrica)"), style: { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text)", outline: "none", minWidth: 0 } }),
React.createElement("input", { type: "number", value: bulkN, onChange: e => setBulkN(e.target.value), placeholder: __t("N\u00B0 macch."), style: { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text)", outline: "none" } }),
React.createElement("input", { type: "number", step: "0.01", value: bulkPrice, onChange: e => setBulkPrice(e.target.value), placeholder: "\u20AC/macch.", style: { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text)", outline: "none" } }),
React.createElement(Btn, { sm: true, onClick: addBulk }, "+ Aggiungi")),
(parseInt(bulkN, 10) > 0 && parseFloat(bulkPrice) > 0) && (React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 7 } },
__t("Totale riga: "),
React.createElement("strong", { style: { color: "#22c55e" } },
"\u20AC",
((parseInt(bulkN, 10) || 0) * (parseFloat(bulkPrice) || 0)).toFixed(2)),
" (",
bulkN,
" \u00D7 \u20AC",
bulkPrice,
")"))),
React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } },
React.createElement("span", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } }, __t("Righe preventivo")),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: addItem }, "+ Riga")),
f.items.length > 0 && (React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 70px 90px 60px auto", gap: 6, padding: "0 10px 4px", fontSize: 9.5, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .5, fontWeight: 700 } },
React.createElement("span", null, __t("Descrizione")),
React.createElement("span", { style: { textAlign: "center" } }, __t("Q.t\u00E0")),
React.createElement("span", { style: { textAlign: "center" } }, __t("Prezzo \u20AC")),
React.createElement("span", { style: { textAlign: "center" } }, "IVA %"),
React.createElement("span", null))),
f.items.map((it, i) => (React.createElement("div", { key: i, style: { background: "var(--surface)", borderRadius: 8, padding: 10, marginBottom: 8, display: "grid", gridTemplateColumns: "1fr 70px 90px 60px auto", gap: 6, alignItems: "center" } },
React.createElement("input", { value: it.description, onChange: e => setItem(i, "description", e.target.value), placeholder: __t("Descrizione"), style: { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "7px 9px", color: "var(--text)", outline: "none", minWidth: 0 } }),
React.createElement("input", { type: "number", value: it.qty, onChange: e => setItem(i, "qty", e.target.value), placeholder: __t("Q.t\u00E0"), step: "0.5", style: { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "7px 9px", color: "var(--text)", outline: "none" } }),
React.createElement("input", { type: "number", value: it.unitPrice, onChange: e => setItem(i, "unitPrice", e.target.value), placeholder: "\u20AC", step: "0.01", style: { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "7px 9px", color: "var(--text)", outline: "none" } }),
React.createElement("input", { type: "number", value: it.vat, onChange: e => setItem(i, "vat", e.target.value), placeholder: "IVA%", style: { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "7px 9px", color: "var(--text)", outline: "none" } }),
React.createElement(Btn, { sm: true, variant: "danger", onClick: () => remItem(i) }, "\u2715")))),
f.items.length === 0 && React.createElement("div", { style: { textAlign: "center", color: "var(--text-4)", padding: "16px 0", fontSize: 12 } }, __t("Nessuna riga. Aggiungi con \"+ Riga\" o importa da un job."))),
React.createElement("div", { style: { background: "var(--bg)", borderRadius: 10, padding: "14px 16px" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 } },
React.createElement("span", { style: { color: "var(--text-2)" } }, __t("Imponibile")),
React.createElement("span", { style: { color: "var(--text)", fontWeight: 700 } },
"\u20AC",
subtotal.toFixed(2))),
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 } },
React.createElement("span", { style: { color: "var(--text-2)" } }, "IVA"),
React.createElement("span", { style: { color: "var(--text)", fontWeight: 700 } },
"\u20AC",
totalVAT.toFixed(2))),
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 16, paddingTop: 8, borderTop: "1px solid var(--border)" } },
React.createElement("span", { style: { color: "var(--text-2)", fontWeight: 700 } }, "TOTALE"),
React.createElement("span", { style: { color: "#22c55e", fontWeight: 800 } },
"\u20AC",
grandTotal.toFixed(2)))),
React.createElement("div", null,
React.createElement("button", { onClick: () => setShowDetails(v => !v), style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", cursor: "pointer", color: "var(--text-2)", fontSize: 12.5, fontWeight: 600 } },
React.createElement("span", null,
__t("Altri dettagli "),
showDetails ? "" : "(numero, stato, scadenza, pagamento, note)"),
React.createElement("span", { style: { transform: showDetails ? "rotate(90deg)" : "none", transition: "transform .15s" } }, "\u203A")),
showDetails && (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14, marginTop: 14, padding: "4px 2px" } },
React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement(Inp, { label: __t("Numero preventivo"), value: f.number, onChange: s("number") }),
React.createElement(Sel, { label: __t("Stato"), value: f.status, onChange: s("status") }, ["bozza", "emessa", "pagata", "scaduta", "annullato"].map(v => React.createElement("option", { key: v }, v))),
React.createElement(Inp, { label: __t("Data scadenza"), type: "date", value: f.dueDate, onChange: s("dueDate") }),
React.createElement("div", null)),
React.createElement(Inp, { label: __t("Modalit\u00E0 di pagamento"), value: f.paymentTerms, onChange: s("paymentTerms") }),
React.createElement(Txt, { label: __t("Note"), value: f.notes, onChange: s("notes") })))),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, __t("Annulla")),
React.createElement(Btn, { onClick: () => onSave(f) }, __t("Salva")))));
}
const IVA_RATES = [0, 4, 5, 10, 22];
const IVA_DEFAULT_Q = 22;
function newQuoteNumber(quotes) {
const y = new Date().getFullYear().toString().slice(-2);
const max = (quotes || []).reduce((m, q) => {
const n = parseInt((q.number || '').replace(/\D/g, '')) || 0;
return Math.max(m, n);
}, 0);
return `QT${y}-${String(max + 1).padStart(3, '0')}`;
}
function QuoteForm({ initial, customers, jobs, assets, parts, quotes, onSave, onClose }) {
const blank = {
number: newQuoteNumber(quotes),
customerId: '',
jobId: '',
date: new Date().toISOString().slice(0, 10),
validUntil: (() => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().slice(0, 10); })(),
status: 'bozza',
laborLines: [],
partLines: [],
notes: '',
paymentTerms: 'Bonifico bancario a 30 giorni',
vatExempt: false,
};
const [f, setF] = React.useState(() => {
if (initial)
return initial;
return blank;
});
const s = k => e => setF(x => (Object.assign(Object.assign({}, x), { [k]: e.target.value })));
const sCheck = k => e => setF(x => (Object.assign(Object.assign({}, x), { [k]: e.target.checked })));
const addLabor = () => setF(x => (Object.assign(Object.assign({}, x), { laborLines: [...x.laborLines, {
id: Date.now() + Math.random(),
label: __t('Manodopera'),
hours: 1,
rate: 55,
}] })));
const updLabor = (id, k, v) => setF(x => (Object.assign(Object.assign({}, x), { laborLines: x.laborLines.map(l => l.id === id ? Object.assign(Object.assign({}, l), { [k]: k === 'hours' || k === 'rate' ? +v : v }) : l) })));
const delLabor = id => setF(x => (Object.assign(Object.assign({}, x), { laborLines: x.laborLines.filter(l => l.id !== id) })));
const addPartFree = () => setF(x => (Object.assign(Object.assign({}, x), { partLines: [...x.partLines, {
id: Date.now() + Math.random(),
type: 'free',
description: '', qty: 1, unitPrice: 0,
vat: f.vatExempt ? 0 : IVA_DEFAULT_Q,
}] })));
const addPartWarehouse = (part) => {
setF(x => (Object.assign(Object.assign({}, x), { partLines: [...x.partLines, {
id: Date.now() + Math.random(),
type: 'warehouse',
partId: part.id,
description: part.name + (part.code ? ` (${part.code})` : ''),
qty: 1,
unitPrice: part.sellPrice || part.unitPrice || 0,
vat: f.vatExempt ? 0 : IVA_DEFAULT_Q,
}] })));
};
const updPart = (id, k, v) => setF(x => (Object.assign(Object.assign({}, x), { partLines: x.partLines.map(l => l.id === id ? Object.assign(Object.assign({}, l), { [k]: k === 'qty' || k === 'unitPrice' || k === 'vat' ? +v : v }) : l) })));
const delPart = id => setF(x => (Object.assign(Object.assign({}, x), { partLines: x.partLines.filter(l => l.id !== id) })));
const importFromJob = (jobId) => {
const job = jobs.find(j => j.id === jobId);
if (!job)
return;
const asset = assets.find(a => a.id === job.assetId);
const newParts = [];
(job.parts || []).forEach(p => {
const pt = parts.find(x => x.id === p.partId);
if (pt)
newParts.push({
id: Date.now() + Math.random(),
type: 'warehouse',
partId: pt.id,
description: pt.name + (pt.code ? ` (${pt.code})` : ''),
qty: p.qty,
unitPrice: pt.sellPrice || pt.unitPrice || 0,
vat: f.vatExempt ? 0 : IVA_DEFAULT_Q,
});
});
const newLabor = [];
if (job.laborHours > 0) {
newLabor.push({
id: Date.now() + Math.random(),
label: `Manodopera — ${(asset === null || asset === void 0 ? void 0 : asset.name) || 'intervento'} (rif. ${job.id})`,
hours: job.laborHours,
rate: job.laborRate || 55,
});
}
setF(x => (Object.assign(Object.assign({}, x), { jobId: jobId, customerId: x.customerId || job.customerId || (asset === null || asset === void 0 ? void 0 : asset.customerId) || '', laborLines: [...x.laborLines, ...newLabor], partLines: [...x.partLines, ...newParts] })));
};
const laborTotal = f.laborLines.reduce((s, l) => s + (l.hours * l.rate), 0);
const partsSubtotal = f.partLines.reduce((s, l) => s + (l.qty * l.unitPrice), 0);
const subtotal = laborTotal + partsSubtotal;
const vatTotal = f.vatExempt ? 0 : f.partLines.reduce((s, l) => s + (l.qty * l.unitPrice * l.vat / 100), 0)
+ (f.vatExempt ? 0 : f.laborLines.reduce((s, l) => s + (l.hours * l.rate * IVA_DEFAULT_Q / 100), 0));
const grandTotal = subtotal + vatTotal;
const customer = customers.find(c => c.id === f.customerId);
const customerJobs = jobs.filter(j => {
const a = assets.find(a => a.id === j.assetId);
return (j.customerId || (a === null || a === void 0 ? void 0 : a.customerId)) === f.customerId;
});
const INP = FORM_INP;
const LBL = FORM_LBL;
return (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: 14, maxHeight: '72vh', overflowY: 'auto', paddingRight: 4 } },
React.createElement("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 } },
React.createElement("div", null,
React.createElement("label", { style: LBL }, __t("N\u00B0 Preventivo")),
React.createElement("input", { style: INP, value: f.number, onChange: s('number') })),
React.createElement("div", null,
React.createElement("label", { style: LBL }, __t("Stato")),
React.createElement("select", { style: INP, value: f.status, onChange: s('status') }, Object.keys(QUOTE_STATUS_COLOR).map(v => React.createElement("option", { key: v, value: v }, v.charAt(0).toUpperCase() + v.slice(1))))),
React.createElement("div", null,
React.createElement("label", { style: LBL }, __t("Cliente")),
React.createElement("select", { style: INP, value: f.customerId, onChange: s('customerId') },
React.createElement("option", { value: "" }, "\u2014 Seleziona cliente \u2014"),
customers.map(c => React.createElement("option", { key: c.id, value: c.id }, c.name)))),
React.createElement("div", null,
React.createElement("label", { style: LBL }, __t("Job collegato")),
React.createElement("select", { style: INP, value: f.jobId, onChange: e => { s('jobId')(e); if (e.target.value)
importFromJob(e.target.value); } },
React.createElement("option", { value: "" }, "\u2014 Nessuno / importa manuale \u2014"),
customerJobs.map(j => {
const a = assets.find(a => a.id === j.assetId);
return React.createElement("option", { key: j.id, value: j.id },
jobTipoLabel(j),
" \u2014 ",
(a === null || a === void 0 ? void 0 : a.name) || '?',
" \u00B7 ",
j.openDate || "",
" (",
j.status,
")");
}))),
React.createElement("div", null,
React.createElement("label", { style: LBL }, __t("Data preventivo")),
React.createElement("input", { type: "date", style: INP, value: f.date, onChange: s('date') })),
React.createElement("div", null,
React.createElement("label", { style: LBL }, __t("Valido fino al")),
React.createElement("input", { type: "date", style: INP, value: f.validUntil, onChange: s('validUntil') }))),
React.createElement("label", { style: { display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: 'var(--text-2)' } },
React.createElement("input", { type: "checkbox", checked: f.vatExempt, onChange: sCheck('vatExempt') }),
__t("Esente IVA (art. 10, regime forfettario, ecc.)")),
React.createElement("div", { style: { borderTop: '1px solid #2A2A38', paddingTop: 12 } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 } },
React.createElement("span", { style: { fontSize: 11, color: '#2dd4bf', fontWeight: 700, textTransform: 'uppercase', letterSpacing: .8 } },
"\uD83D\uDD27 Manodopera (",
f.laborLines.length,
" voci)"),
React.createElement("button", { onClick: addLabor, style: { background: 'var(--surface-2)', border: '1px solid #2dd4bf44', borderRadius: 6, color: '#2dd4bf', padding: '4px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 700 } }, "+ Voce")),
f.laborLines.length === 0 && (React.createElement("div", { style: { textAlign: 'center', color: 'var(--text-4)', padding: '10px 0', fontSize: 12 } }, __t("Nessuna voce manodopera"))),
f.laborLines.map(l => (React.createElement("div", { key: l.id, style: { display: 'grid', gridTemplateColumns: '1fr 70px 70px auto', gap: 6, marginBottom: 6, alignItems: 'center' } },
React.createElement("input", { style: INP, value: l.label, onChange: e => updLabor(l.id, 'label', e.target.value), placeholder: __t("Descrizione (es. Trasferta, Ore lavoro, Installazione\u2026)") }),
React.createElement("input", { type: "number", style: Object.assign(Object.assign({}, INP), { textAlign: 'center' }), value: l.hours, onChange: e => updLabor(l.id, 'hours', e.target.value), placeholder: "ore", step: "0.5" }),
React.createElement("input", { type: "number", style: Object.assign(Object.assign({}, INP), { textAlign: 'center' }), value: l.rate, onChange: e => updLabor(l.id, 'rate', e.target.value), placeholder: "\u20AC/h" }),
React.createElement("button", { onClick: () => delLabor(l.id), style: { background: '#ef444415', border: '1px solid #ef444430', borderRadius: 5, color: '#ef4444', padding: '6px 8px', cursor: 'pointer', fontSize: 11 } }, "\u2715")))),
f.laborLines.length > 0 && (React.createElement("div", { style: { textAlign: 'right', fontSize: 12, color: 'var(--text-2)', marginTop: 4 } },
__t("Subtotale manodopera: "),
React.createElement("strong", { style: { color: 'var(--text-bright)' } },
"\u20AC",
laborTotal.toFixed(2))))),
React.createElement("div", { style: { borderTop: '1px solid #2A2A38', paddingTop: 12 } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 6 } },
React.createElement("span", { style: { fontSize: 11, color: '#a855f7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: .8 } },
"\uD83D\uDCE6 Parti / Materiali (",
f.partLines.length,
" righe)"),
React.createElement("div", { style: { display: 'flex', gap: 6 } },
React.createElement("button", { onClick: addPartFree, style: { background: 'var(--surface-2)', border: '1px solid #a855f744', borderRadius: 6, color: '#a855f7', padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 700 } }, "+ Riga libera"))),
parts.length > 0 && (React.createElement("div", { style: { background: 'var(--bg)', border: '1px solid #2A2A38', borderRadius: 8, padding: '8px 10px', marginBottom: 8 } },
React.createElement("div", { style: { fontSize: 10, color: 'var(--text-3)', marginBottom: 5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: .7 } }, __t("Aggiungi dal magazzino (senza scalare stock)")),
React.createElement("div", { style: { display: 'flex', flexWrap: 'wrap', gap: 5 } }, parts.filter(p => p.qty > 0 || true).map(p => (React.createElement("button", { key: p.id, onClick: () => addPartWarehouse(p), style: { background: 'var(--surface-2)', border: '1px solid #2A2A38', borderRadius: 6, color: 'var(--text-2)', padding: '3px 9px', cursor: 'pointer', fontSize: 10 } },
"+ ",
p.name,
p.code ? ` (${p.code})` : '',
" \u2014 \u20AC",
(p.sellPrice || p.unitPrice || 0).toFixed(2))))))),
f.partLines.length === 0 && (React.createElement("div", { style: { textAlign: 'center', color: 'var(--text-4)', padding: '10px 0', fontSize: 12 } }, __t("Nessun materiale"))),
f.partLines.map(l => (React.createElement("div", { key: l.id, style: { display: 'grid', gridTemplateColumns: '1fr 55px 70px 55px auto', gap: 6, marginBottom: 6, alignItems: 'center' } },
React.createElement("div", null,
l.type === 'warehouse' && (React.createElement("div", { style: { fontSize: 9, color: '#a855f7', fontWeight: 700, marginBottom: 2 } }, "\uD83D\uDCE6 MAGAZZINO")),
React.createElement("input", { style: INP, value: l.description, onChange: e => updPart(l.id, 'description', e.target.value), placeholder: __t("Descrizione ricambio / materiale") })),
React.createElement("input", { type: "number", style: Object.assign(Object.assign({}, INP), { textAlign: 'center' }), value: l.qty, onChange: e => updPart(l.id, 'qty', e.target.value), placeholder: __t("Q.t\u00E0"), step: "1" }),
React.createElement("input", { type: "number", style: Object.assign(Object.assign({}, INP), { textAlign: 'center' }), value: l.unitPrice, onChange: e => updPart(l.id, 'unitPrice', e.target.value), placeholder: "\u20AC cad.", step: "0.01" }),
React.createElement("select", { style: Object.assign(Object.assign({}, INP), { padding: '8px 4px', textAlign: 'center' }), value: l.vat, onChange: e => updPart(l.id, 'vat', e.target.value) }, IVA_RATES.map(r => React.createElement("option", { key: r, value: r },
r,
"%"))),
React.createElement("button", { onClick: () => delPart(l.id), style: { background: '#ef444415', border: '1px solid #ef444430', borderRadius: 5, color: '#ef4444', padding: '6px 8px', cursor: 'pointer', fontSize: 11 } }, "\u2715")))),
f.partLines.length > 0 && (React.createElement("div", { style: { textAlign: 'right', fontSize: 12, color: 'var(--text-2)', marginTop: 4 } },
__t("Subtotale materiali: "),
React.createElement("strong", { style: { color: 'var(--text-bright)' } },
"\u20AC",
partsSubtotal.toFixed(2))))),
React.createElement("div", { style: { background: 'var(--bg)', border: '1px solid #2A2A38', borderRadius: 10, padding: '14px 16px' } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 } },
React.createElement("span", { style: { color: 'var(--text-3)' } }, __t("Manodopera")),
React.createElement("span", { style: { color: 'var(--text-bright)', fontWeight: 700 } },
"\u20AC",
laborTotal.toFixed(2))),
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 } },
React.createElement("span", { style: { color: 'var(--text-3)' } }, __t("Materiali")),
React.createElement("span", { style: { color: 'var(--text-bright)', fontWeight: 700 } },
"\u20AC",
partsSubtotal.toFixed(2))),
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid #2A2A38' } },
React.createElement("span", { style: { color: 'var(--text-3)' } }, __t("Imponibile")),
React.createElement("span", { style: { color: 'var(--text-bright)', fontWeight: 700 } },
"\u20AC",
subtotal.toFixed(2))),
!f.vatExempt && (React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 } },
React.createElement("span", { style: { color: 'var(--text-3)' } }, "IVA"),
React.createElement("span", { style: { color: 'var(--text-bright)', fontWeight: 700 } },
"\u20AC",
vatTotal.toFixed(2)))),
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: 16 } },
React.createElement("span", { style: { color: 'var(--text-2)', fontWeight: 700 } }, "TOTALE"),
React.createElement("span", { style: { color: '#22c55e', fontWeight: 900 } },
"\u20AC",
grandTotal.toFixed(2)))),
React.createElement("div", null,
React.createElement("label", { style: LBL }, __t("Condizioni di pagamento")),
React.createElement("input", { style: INP, value: f.paymentTerms, onChange: s('paymentTerms') })),
React.createElement("div", null,
React.createElement("label", { style: LBL }, __t("Note / condizioni speciali")),
React.createElement("textarea", { style: Object.assign(Object.assign({}, INP), { minHeight: 60, resize: 'vertical' }), value: f.notes, onChange: s('notes'), placeholder: __t("Note aggiuntive, esclusioni, condizioni speciali\u2026") })),
React.createElement("div", { style: { display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 10, borderTop: '1px solid #2A2A38', position: 'sticky', bottom: 0, background: 'var(--surface-2)', margin: '0 -4px', padding: '12px 4px' } },
React.createElement("button", { onClick: onClose, style: FORM_BTN_GHOST }, __t("Annulla")),
React.createElement("button", { onClick: () => onSave(Object.assign(Object.assign({}, f), { _totals: { labor: laborTotal, parts: partsSubtotal, subtotal, vat: vatTotal, grand: grandTotal } })), style: FORM_BTN_PRIMARY }, initial ? __t('Salva modifiche') : __t('Crea preventivo')))));
}
export function QuotesPage({ quotes, setQuotes, customers, jobs, assets, parts, company, showToast, moveToTrash, checkLocked }) {
const [modal, setModal] = React.useState(null);
const [search, setSearch] = React.useState('');
const [filterStatus, setFilterStatus] = React.useState('all');
const saveQuote = (q) => {
const exists = quotes.some(x => x.id === q.id);
if (exists) {
const upd = withUpdateMeta(q);
setQuotes(qs => qs.map(x => x.id === q.id ? upd : x));
showToast(__t('Preventivo aggiornato'));
}
else {
const newQ = withCreateMeta(q);
setQuotes(qs => [...qs, newQ]);
showToast('✓ Preventivo ' + newQ.number + ' creato');
}
setModal(null);
};
const delQuote = (id) => {
if (checkLocked())
return;
if (!confirm(__t('Spostare questo preventivo nel cestino?')))
return;
const rec = quotes.find(q => q.id === id);
if (moveToTrash && rec)
moveToTrash("quotes", rec);
setQuotes(qs => qs.filter(q => q.id !== id));
showToast(__t('Spostato nel cestino'), '#f59e0b');
};
const filtered = quotes.filter(q => {
if (filterStatus !== 'all' && q.status !== filterStatus)
return false;
if (search) {
const c = customers.find(x => x.id === q.customerId);
const hay = [q.number, q.status, c === null || c === void 0 ? void 0 : c.name, q.notes].filter(Boolean).join(' ').toLowerCase();
if (!hay.includes(search.toLowerCase()))
return false;
}
return true;
});
const totalOpen = quotes.filter(q => ['bozza', 'inviato'].includes(q.status)).length;
const totalAccepted = quotes.filter(q => q.status === 'accettato').length;
const valueOpen = quotes.filter(q => q.status === 'inviato').reduce((s, q) => { var _a; return s + (((_a = q._totals) === null || _a === void 0 ? void 0 : _a.grand) || 0); }, 0);
return (React.createElement("div", { style: { padding: '16px 20px', maxWidth: 1100, margin: '0 auto' } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 20, fontWeight: 900 } }, __t("Preventivi")),
React.createElement("p", { style: { color: 'var(--text-3)', margin: '3px 0 0', fontSize: 12 } }, __t("Quotazioni da job \u2192 PDF professionale"))),
React.createElement("button", { onClick: () => setModal({ type: 'form', data: null }), style: FORM_BTN_PRIMARY }, "+ Nuovo preventivo")),
React.createElement("div", { style: { display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' } }, [
{ label: __t('In corso (bozza+inviati)'), value: totalOpen, color: '#3b82f6' },
{ label: __t('Accettati'), value: totalAccepted, color: '#22c55e' },
{ label: __t('Valore inviati'), value: `€${valueOpen.toFixed(0)}`, color: '#2dd4bf' },
{ label: __t('Totale'), value: quotes.length, color: 'var(--text-3)' },
].map(k => (React.createElement("div", { key: k.label, style: { background: 'var(--surface)', border: '1px solid #2A2A38', borderTop: `3px solid ${k.color}`, borderRadius: 10, padding: '10px 16px', flex: 1, minWidth: 110 } },
React.createElement("div", { style: { fontSize: 20, fontWeight: 900, color: k.color, fontFamily: 'monospace' } }, k.value),
React.createElement("div", { style: { fontSize: 10, color: 'var(--text-3)', marginTop: 3, textTransform: 'uppercase', letterSpacing: .7, fontWeight: 600 } }, k.label))))),
React.createElement("div", { style: { display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' } },
React.createElement("input", { value: search, onChange: e => setSearch(e.target.value), placeholder: __t("Cerca numero, cliente\u2026"), style: { flex: 1, minWidth: 180, background: 'var(--surface)', border: '1px solid #2A2A38', borderRadius: 8, padding: '8px 12px', color: 'var(--text-bright)', fontSize: 13, outline: 'none' } }),
React.createElement("select", { value: filterStatus, onChange: e => setFilterStatus(e.target.value), style: { background: 'var(--surface)', border: '1px solid #2A2A38', borderRadius: 8, padding: '8px 12px', color: 'var(--text-2)', fontSize: 12 } },
React.createElement("option", { value: "all" }, __t("Tutti gli stati")),
Object.keys(QUOTE_STATUS_COLOR).map(s => React.createElement("option", { key: s, value: s }, s.charAt(0).toUpperCase() + s.slice(1))))),
filtered.length === 0 ? (React.createElement("div", { style: { textAlign: 'center', padding: 48, color: 'var(--text-3)', background: 'var(--surface)', borderRadius: 12, border: '1px solid #2A2A38' } }, quotes.length === 0 ? (React.createElement(React.Fragment, null,
React.createElement("div", { style: { fontSize: 36, marginBottom: 10, opacity: .4 } }, "\uD83D\uDCCB"),
React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: 'var(--text-2)', marginBottom: 6 } }, __t("Nessun preventivo ancora")),
React.createElement("div", { style: { fontSize: 12, marginBottom: 14 } }, __t("Apri un job, usa il bottone \"Crea preventivo\" oppure creane uno da qui")),
React.createElement("button", { onClick: () => setModal({ type: 'form', data: null }), style: FORM_BTN_PRIMARY }, "+ Nuovo preventivo"))) : __t('Nessun risultato'))) : (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: 8 } }, filtered.slice().sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).map(q => {
var _a, _b, _c;
const customer = customers.find(c => c.id === q.customerId);
const job = jobs.find(j => j.id === q.jobId);
const asset = job ? assets.find(a => a.id === job.assetId) : null;
const sc = QUOTE_STATUS_COLOR[q.status] || 'var(--text-3)';
const grand = ((_a = q._totals) === null || _a === void 0 ? void 0 : _a.grand) || 0;
return (React.createElement("div", { key: q.id, style: { background: 'var(--surface)', border: `1px solid ${sc}33`, borderLeft: `4px solid ${sc}`, borderRadius: 10, padding: '12px 16px' } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 } },
React.createElement("span", { style: { fontFamily: 'monospace', fontWeight: 900, fontSize: 14, color: 'var(--text-bright)' } }, q.number),
React.createElement("span", { style: { fontSize: 10, background: sc + '20', color: sc, border: `1px solid ${sc}44`, borderRadius: 20, padding: '1px 9px', fontWeight: 700, textTransform: 'capitalize' } }, q.status),
q.jobId && React.createElement("span", { style: { fontSize: 10, color: 'var(--text-3)' } },
"rif. ",
q.jobId)),
React.createElement("div", { style: { fontSize: 13, color: 'var(--text-2)' } },
(customer === null || customer === void 0 ? void 0 : customer.name) || '—',
asset ? ` · ${asset.name}` : ''),
React.createElement("div", { style: { fontSize: 11, color: 'var(--text-3)', marginTop: 3 } },
q.date,
q.validUntil ? ` · valido fino al ${q.validUntil}` : '',
((_b = q.laborLines) === null || _b === void 0 ? void 0 : _b.length) > 0 && ` · ${q.laborLines.length} voci manodopera`,
((_c = q.partLines) === null || _c === void 0 ? void 0 : _c.length) > 0 && ` · ${q.partLines.length} righe materiali`)),
React.createElement("div", { style: { textAlign: 'right', flexShrink: 0 } },
React.createElement("div", { style: { fontSize: 18, fontWeight: 900, color: '#22c55e', fontFamily: 'monospace' } },
"\u20AC",
grand.toFixed(2)),
React.createElement("div", { style: { display: 'flex', gap: 6, marginTop: 8, justifyContent: 'flex-end' } },
React.createElement("button", { onClick: () => generateQuotePDF(q, customer, company, assets, jobs), style: { background: 'var(--surface)', border: '1px solid #2dd4bf44', borderRadius: 6, color: '#2dd4bf', padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 700 } }, "PDF"),
React.createElement("button", { onClick: () => setModal({ type: 'form', data: q }), style: { background: 'var(--surface-3)', border: '1px solid #2a3040', borderRadius: 6, color: 'var(--text-2)', padding: '4px 10px', cursor: 'pointer', fontSize: 11 } }, "\u270F"),
React.createElement("button", { onClick: () => delQuote(q.id), style: { background: '#ef444415', border: '1px solid #ef444430', borderRadius: 6, color: '#ef4444', padding: '4px 8px', cursor: 'pointer', fontSize: 11 } }, "\u2715"))))));
}))),
(modal === null || modal === void 0 ? void 0 : modal.type) === 'form' && (React.createElement(Modal, { title: modal.data ? __t('Modifica Preventivo') : __t('Nuovo Preventivo'), wide: true, onClose: () => setModal(null) },
React.createElement(QuoteForm, { initial: modal.data, customers: customers, jobs: jobs, assets: assets, parts: parts, quotes: quotes, onSave: saveQuote, onClose: () => setModal(null) })))));
}
