/* MedTrace — dashboard e pianificazione: KPI, agenda, scadenze (con mail), piano manuale (estratti da app.js, v2.99) */
import { AreaTrend, EmptyState } from "./ui.js";
import { downloadXLSX } from "../lib/export.js";
export function ScadenzePage({ scadenze, company, onEmail, onOpenAsset }) {
const [range, setRange] = React.useState(60);
const visibili = scadenze.filter(s => s.days <= range);
const fmt = d => { try {
return new Date(d).toLocaleDateString("it-IT");
}
catch (e) {
return "—";
} };
const colorFor = days => days < 0 ? "#ef4444" : days <= 7 ? "#f97316" : days <= 30 ? "#f59e0b" : "#2dd4bf";
const gruppi = React.useMemo(() => {
const m = new Map();
visibili.forEach(s => {
var _a;
const key = ((_a = s.customer) === null || _a === void 0 ? void 0 : _a.id) || "__none__";
if (!m.has(key))
m.set(key, { customer: s.customer, items: [] });
m.get(key).items.push(s);
});
return [...m.values()]
.map(g => (Object.assign(Object.assign({}, g), { items: g.items.sort((a, b) => a.days - b.days), minDays: Math.min(...g.items.map(i => i.days)) })))
.sort((a, b) => a.minDays - b.minDays);
}, [visibili]);
const toRow = s => {
var _a;
return ({
cliente: ((_a = s.customer) === null || _a === void 0 ? void 0 : _a.name) || "—",
apparecchio: s.assetName || "",
marca: s.brand || "",
modello: s.model || "",
serial: s.serial || "",
tipo: s.tipo,
ultima: s.lastDate || "",
scadenza: (() => { try {
return new Date(s.dueDate).toISOString().slice(0, 10);
}
catch (e) {
return "";
} })(),
stato: s.days < 0 ? "SCADUTA" : (s.days === 0 ? "oggi" : "tra " + s.days + " gg"),
});
};
const XLS_COLS = [
{ key: "cliente", label: "Cliente" }, { key: "apparecchio", label: "Apparecchio" },
{ key: "marca", label: "Marca" }, { key: "modello", label: "Modello" }, { key: "serial", label: "Matricola" },
{ key: "tipo", label: "Tipo verifica" }, { key: "ultima", label: "Ultima verifica" },
{ key: "scadenza", label: "Prossima scadenza" }, { key: "stato", label: "Stato" },
];
const exportAll = () => {
if (typeof downloadXLSX === "function")
downloadXLSX("scadenze_tutte.xlsx", visibili.map(toRow), XLS_COLS, "Scadenze");
};
const exportCustomer = (g) => {
var _a;
const nome = (((_a = g.customer) === null || _a === void 0 ? void 0 : _a.name) || "cliente").replace(/[^a-zA-Z0-9]/g, "_").slice(0, 40);
if (typeof downloadXLSX === "function")
downloadXLSX("scadenze_" + nome + ".xlsx", g.items.map(toRow), XLS_COLS, "Scadenze");
};
const Row = (s, i) => {
const col = colorFor(s.days);
const label = s.days < 0 ? "scaduta da " + Math.abs(s.days) + " gg" : s.days === 0 ? "scade oggi" : "tra " + s.days + " gg";
return (React.createElement("div", { key: s.assetId + s.tipoKind + i, style: { background: "var(--surface)", borderTop: "1px solid var(--border-2)", borderLeft: "3px solid " + col, padding: "10px 13px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { display: "flex", gap: 7, alignItems: "center", flexWrap: "wrap", marginBottom: 2 } },
React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: "var(--text)" } }, s.assetName),
React.createElement("span", { style: { fontSize: 9, fontWeight: 700, color: s.tipoKind === "iec" ? "#c084fc" : "#5eead4", background: (s.tipoKind === "iec" ? "#a855f7" : "#1F7468") + "22", border: "1px solid " + (s.tipoKind === "iec" ? "#a855f7" : "#1F7468") + "44", borderRadius: 4, padding: "1px 6px" } }, s.tipoKind === "iec" ? "Sic. Elettrica" : "Funzionale")),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)" } },
s.serial ? "S/N " + s.serial + " · " : "",
"Scade ",
React.createElement("strong", { style: { color: col } }, fmt(s.dueDate)),
" \u00B7 ",
label)),
React.createElement("button", { onClick: () => onOpenAsset(s.assetId), style: { background: "transparent", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text-2)", padding: "5px 10px", fontSize: 11, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 } }, "Scheda \u203A")));
};
return (React.createElement("div", { style: { maxWidth: 900, margin: "0 auto" } },
React.createElement("div", { style: { marginBottom: 18 } },
React.createElement("h1", { style: { margin: "0 0 4px", fontSize: 22, fontWeight: 900, color: "var(--text-bright)" } }, "Scadenze & Promemoria"),
React.createElement("p", { style: { color: "var(--text-3)", margin: 0, fontSize: 13 } }, "Verifiche in scadenza calcolate dagli intervalli di ogni apparecchio, raggruppate per cliente.")),
React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 12 } }, [30, 60, 90].map(g => {
const on = range === g;
return (React.createElement("button", { key: g, onClick: () => setRange(g), style: {
flex: 1, background: on ? "#1F7468" : "var(--card)", border: "1px solid " + (on ? "#2dd4bf" : "var(--border-3)"),
borderRadius: 9, padding: "10px 8px", cursor: "pointer", color: on ? "#04201C" : "var(--text-strong)",
fontSize: 13, fontWeight: on ? 800 : 600
} },
"Prossimi ",
g,
" giorni"));
})),
visibili.length > 0 && (React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 10, flexWrap: "wrap" } },
React.createElement("span", { style: { fontSize: 12, color: "var(--text-3)" } },
visibili.length,
" scadenze \u00B7 ",
gruppi.length,
" clienti"),
React.createElement("button", { onClick: exportAll, style: { background: "#2dd4bf15", border: "1px solid #2dd4bf44", borderRadius: 7, color: "#2dd4bf", padding: "8px 13px", fontSize: 12, fontWeight: 700, cursor: "pointer" } }, "\uD83D\uDCCA Esporta tutto in Excel"))),
visibili.length === 0 ? (React.createElement("div", { style: { textAlign: "center", padding: "40px 20px", color: "var(--text-4)", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 10 } },
"Nessuna verifica in scadenza nei prossimi ",
range,
" giorni. \uD83D\uDC4D")) : (gruppi.map((g, gi) => {
var _a, _b, _c;
const hasCust = !!g.customer;
return (React.createElement("div", { key: ((_a = g.customer) === null || _a === void 0 ? void 0 : _a.id) || "none" + gi, style: { marginBottom: 16, border: "1px solid var(--border-2)", borderRadius: 10, overflow: "hidden" } },
React.createElement("div", { style: { background: "var(--card)", padding: "11px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" } },
React.createElement("div", { style: { minWidth: 0 } },
React.createElement("div", { style: { fontSize: 14, fontWeight: 800, color: hasCust ? "var(--text)" : "var(--text-2)" } }, ((_b = g.customer) === null || _b === void 0 ? void 0 : _b.name) || "Cliente non assegnato"),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)" } },
g.items.length,
" ",
g.items.length === 1 ? "apparecchio" : "apparecchi",
" in scadenza",
((_c = g.customer) === null || _c === void 0 ? void 0 : _c.email) ? " · " + g.customer.email : "")),
React.createElement("div", { style: { display: "flex", gap: 6, flexShrink: 0 } },
React.createElement("button", { onClick: () => exportCustomer(g), title: "Scarica Excel di questo cliente", style: { background: "#2dd4bf12", border: "1px solid #2dd4bf44", borderRadius: 6, color: "#2dd4bf", padding: "6px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" } }, "\uD83D\uDCCA Excel"),
React.createElement("button", { onClick: () => onEmail(g), disabled: !hasCust, title: hasCust ? "Email al cliente con elenco in scadenza" : "Nessun cliente assegnato", style: { background: hasCust ? "#2dd4bf15" : "var(--surface-2)", border: "1px solid " + (hasCust ? "#2dd4bf44" : "var(--border)"), borderRadius: 6, color: hasCust ? "#2dd4bf" : "var(--text-4)", padding: "6px 10px", fontSize: 11, fontWeight: 700, cursor: hasCust ? "pointer" : "default", whiteSpace: "nowrap" } }, "\u2709 Promemoria"))),
g.items.map(Row)));
}))));
}
export function ScadenzaEmailModal({ sc, company, onClose }) {
const fmt = d => { try {
return new Date(d).toLocaleDateString("it-IT");
}
catch (e) {
return "";
} };
const azienda = (company && company.name) || "la nostra azienda";
const customer = sc.customer || null;
const items = sc.items || [];
const ref = (customer && customer.name) || "Spett.le Cliente";
const elenco = items.map(it => {
const m = [it.assetName, it.serial ? ("S/N " + it.serial) : ""].filter(Boolean).join(" ");
const t = it.tipoKind === "iec" ? "sicurezza elettrica" : "verifica funzionale";
return "• " + m + " — " + t + " (scadenza " + fmt(it.dueDate) + ")";
}).join("\n");
const subjectDefault = items.length === 1
? "Promemoria scadenza verifica - " + items[0].assetName
: "Promemoria scadenze verifiche - " + items.length + " apparecchiature";
const bodyDefault = "Gentile " + ref + ",\n\n" +
(items.length === 1
? "Le ricordiamo che per la seguente apparecchiatura e' prevista una verifica in scadenza:\n\n"
: "Le ricordiamo che per le seguenti apparecchiature sono previste verifiche in scadenza:\n\n") +
elenco + "\n\n" +
(items.length > 1 ? "In allegato trova l'elenco completo delle apparecchiature in scadenza.\n\n" : "") +
"Per organizzare gli interventi e mantenere le apparecchiature conformi, La invitiamo a contattarci per concordare un appuntamento.\n\n" +
"Restiamo a disposizione per qualsiasi chiarimento.\n\n" +
"Cordiali saluti,\n" + azienda;
const [subject, setSubject] = React.useState(subjectDefault);
const [body, setBody] = React.useState(bodyDefault);
const [copied, setCopied] = React.useState("");
const emailTo = (customer && (customer.email || customer.contactEmail)) || "";
const mailtoUrl = "mailto:" + encodeURIComponent(emailTo) +
"?subject=" + encodeURIComponent(subject) +
"&body=" + encodeURIComponent(body);
const copy = (text, what) => {
try {
navigator.clipboard.writeText(text);
setCopied(what);
setTimeout(() => setCopied(""), 1800);
}
catch (e) { }
};
const exportExcel = () => {
const rows = items.map(s => ({
apparecchio: s.assetName || "", marca: s.brand || "", modello: s.model || "", serial: s.serial || "",
tipo: s.tipoKind === "iec" ? "Sicurezza Elettrica" : "Verifica Funzionale",
ultima: s.lastDate || "",
scadenza: (() => { try {
return new Date(s.dueDate).toISOString().slice(0, 10);
}
catch (e) {
return "";
} })(),
}));
const cols = [{ key: "apparecchio", label: "Apparecchio" }, { key: "marca", label: "Marca" }, { key: "modello", label: "Modello" }, { key: "serial", label: "Matricola" }, { key: "tipo", label: "Tipo verifica" }, { key: "ultima", label: "Ultima verifica" }, { key: "scadenza", label: "Prossima scadenza" }];
const nome = ((customer === null || customer === void 0 ? void 0 : customer.name) || "cliente").replace(/[^a-zA-Z0-9]/g, "_").slice(0, 40);
if (typeof downloadXLSX === "function")
downloadXLSX("scadenze_" + nome + ".xlsx", rows, cols, "Scadenze");
};
const FLD = { background: "var(--card)", border: "1px solid var(--border-3)", borderRadius: 8, color: "var(--text)", fontSize: 13, padding: "9px 11px", outline: "none", width: "100%", boxSizing: "border-box", fontFamily: "inherit" };
return (React.createElement("div", null,
React.createElement("div", { style: { fontSize: 11.5, color: "var(--text-2)", lineHeight: 1.5, marginBottom: 14 } },
"Email pronta per ",
React.createElement("strong", { style: { color: "var(--text)" } }, ref),
" \u2014 ",
items.length,
" ",
items.length === 1 ? "apparecchio" : "apparecchi",
" in scadenza.",
items.length > 1 && React.createElement("span", { style: { display: "block", marginTop: 4 } }, "Scarica l'Excel e allegalo all'email (la posta non permette di allegare file in automatico)."),
!emailTo && React.createElement("span", { style: { display: "block", color: "#f59e0b", marginTop: 4 } }, "Nessuna email salvata per questo cliente: aprendo la posta dovrai inserire il destinatario a mano. Puoi aggiungerla nell'anagrafica del cliente.")),
items.length > 1 && (React.createElement("div", { style: { marginBottom: 14 } },
React.createElement("button", { onClick: exportExcel, style: { background: "#2dd4bf15", border: "1px solid #2dd4bf44", borderRadius: 8, color: "#2dd4bf", padding: "10px 14px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", width: "100%" } },
"\uD83D\uDCCA Scarica Excel da allegare (",
items.length,
" apparecchi)"))),
React.createElement("div", { style: { marginBottom: 12 } },
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .6, fontWeight: 700, marginBottom: 5 } }, "Oggetto"),
React.createElement("input", { value: subject, onChange: e => setSubject(e.target.value), style: FLD })),
React.createElement("div", { style: { marginBottom: 14 } },
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .6, fontWeight: 700, marginBottom: 5 } }, "Testo"),
React.createElement("textarea", { value: body, onChange: e => setBody(e.target.value), rows: 12, style: Object.assign(Object.assign({}, FLD), { resize: "vertical", lineHeight: 1.5 }) })),
React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" } },
React.createElement("button", { onClick: () => copy(body, "testo"), style: { background: "transparent", border: "1px solid var(--border)", borderRadius: 7, color: "var(--text-2)", padding: "9px 13px", fontSize: 12, fontWeight: 700, cursor: "pointer" } }, copied === "testo" ? "✓ Copiato" : "Copia testo"),
React.createElement("a", { href: mailtoUrl, style: { background: "#2dd4bf", border: "none", borderRadius: 7, color: "#04201C", padding: "9px 15px", fontSize: 12.5, fontWeight: 800, cursor: "pointer", textDecoration: "none" } }, "\u2709 Apri nell'app email"))));
}
export function KpiPage({ assets, jobs, customers, iecReports, funcReports, parts, isMobile }) {
const [custFilter, setCustFilter] = React.useState("");
const [period, setPeriod] = React.useState(365);
const [kpiHelp, setKpiHelp] = React.useState(null);
const [trendRange, setTrendRange] = React.useState(6);
const KPI_INFO = {
conformita: { t: "Parco conforme", d: "Percentuale di apparecchi che hanno superato l'ultima verifica (elettrica o funzionale). Si calcola sui soli apparecchi già verificati: conformi sul totale dei verificati. Più è alta, meglio è. Sotto il 70% diventa rossa." },
scaduti: { t: "Verifiche scadute", d: "Quanti apparecchi hanno una verifica (elettrica o funzionale) oltre la data di scadenza. Vanno ripianificati il prima possibile: una verifica scaduta significa che l'apparecchio sta operando senza un controllo di sicurezza valido." },
mttr: { t: "Tempo medio di riparazione (MTTR)", d: "MTTR, dall'inglese Mean Time To Repair. In media quanti giorni passano da quando apri un intervento correttivo a quando lo chiudi. Misura quanto sei veloce a rimettere in servizio un apparecchio guasto: più basso, meglio è." },
ritorni: { t: "Ritorni entro 30 giorni", d: "Percentuale di riparazioni dopo le quali lo stesso apparecchio si è riguastato entro 30 giorni. È un indice della qualità della riparazione: se è alto, spesso il problema non è stato risolto alla radice. Sotto il 10% è ottimo." },
mtbf: { t: "Tempo medio tra guasti (MTBF)", d: "MTBF, dall'inglese Mean Time Between Failures. In media quanti giorni un apparecchio resta in funzione tra un guasto e il successivo, considerando tutto il parco. Più è alto, più gli apparecchi sono affidabili. È una stima basata sui guasti del periodo." },
completamento: { t: "Tasso di completamento", d: "Percentuale di interventi aperti nel periodo che sono stati anche chiusi. Dice se stai smaltendo il lavoro o se si accumulano interventi in sospeso. Sotto il 50% diventa rossa: troppi interventi rimasti aperti." },
preventiva: { t: "Quota preventiva", d: "Percentuale di interventi che sono manutenzione preventiva (programmata) invece che correttiva (su guasto). Una quota alta è segno di buona gestione: previeni invece di rincorrere i guasti. Sotto il 40% diventa rossa." },
costo: { t: "Costo manutenzione", d: "Somma dei costi degli interventi nel periodo: manodopera (ore per tariffa) più trasferta più ricambi. La media per apparecchio aiuta a capire quali macchine costano di più da mantenere rispetto al loro valore." },
};
const infoDot = (id) => React.createElement("span", { onClick: (e) => { e.stopPropagation(); setKpiHelp(id); }, title: "Cosa significa?", style: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 15, height: 15, borderRadius: "50%", border: "1px solid var(--border)", color: "var(--text-3)", fontSize: 10, fontWeight: 700, fontStyle: "italic", marginLeft: 6, cursor: "pointer", verticalAlign: "middle", flexShrink: 0, lineHeight: 1 } }, "i");
const K = React.useMemo(() => {
const addM = (dateStr, months) => { const d = new Date(dateStr); if (isNaN(d))
return null; d.setMonth(d.getMonth() + (parseInt(months, 10) || 12)); return d; };
const now = Date.now();
const cutoff = period > 0 ? now - period * 86400000 : 0;
const inP = ds => { const t = new Date(ds).getTime(); return !isNaN(t) && t >= cutoff && t <= now + 86400000; };
const myAssets = assets.filter(a => (!custFilter || a.customerId === custFilter) && a.status !== "dismesso");
const aIds = {};
myAssets.forEach(a => { aIds[a.id] = true; });
const myJobs = jobs.filter(j => (custFilter ? (j.customerId === custFilter || aIds[j.assetId]) : true));
const lastByAsset = (reps) => { const m = {}; reps.forEach(r => { if (!aIds[r.assetId])
return; const cur = m[r.assetId]; if (!cur || String(r.date || "") > String(cur.date || ""))
m[r.assetId] = r; }); return m; };
const lastIec = lastByAsset(iecReports), lastFunc = lastByAsset(funcReports);
let conformi = 0, nonConformi = 0, maiVerificati = 0;
myAssets.forEach(a => {
const li = lastIec[a.id], lf = lastFunc[a.id];
if (!li && !lf) {
maiVerificati++;
return;
}
const fails = (li && li.overallPass === false) || (lf && lf.overallPass === false);
if (fails)
nonConformi++;
else
conformi++;
});
const verificati = conformi + nonConformi;
const confPct = verificati > 0 ? Math.round(100 * conformi / verificati) : null;
let scaduti = 0, d30 = 0, d60 = 0, d90 = 0;
const dueOf = (rep, interval) => { if (!rep)
return null; if (rep.nextDate) {
const d = new Date(rep.nextDate);
if (!isNaN(d))
return d;
} return rep.date ? addM(rep.date, interval) : null; };
myAssets.forEach(a => {
[dueOf(lastIec[a.id], a.intervalIec || a.serviceInterval || 12), dueOf(lastFunc[a.id], a.intervalFunc || a.serviceInterval || 12)].forEach(d => {
if (!d)
return;
const g = (d.getTime() - now) / 86400000;
if (g < 0)
scaduti++;
else if (g <= 30)
d30++;
else if (g <= 60)
d60++;
else if (g <= 90)
d90++;
});
});
const chiusi = myJobs.filter(j => j.type === "correttiva" && j.closeDate && inP(j.closeDate) && j.openDate);
let mttr = null;
if (chiusi.length) {
const tot = chiusi.reduce((sm, j) => { const d = (new Date(j.closeDate) - new Date(j.openDate)) / 86400000; return sm + (d >= 0 ? d : 0); }, 0);
mttr = Math.round(10 * tot / chiusi.length) / 10;
}
let ritorni = 0;
chiusi.forEach(j => {
const c = new Date(j.closeDate).getTime();
const again = myJobs.some(o => { if (o === j || o.type !== "correttiva" || o.assetId !== j.assetId || !o.openDate)
return false; const t = new Date(o.openDate).getTime(); return t > c && t <= c + 30 * 86400000; });
if (again)
ritorni++;
});
const ritorniPct = chiusi.length ? Math.round(100 * ritorni / chiusi.length) : null;
const MESI = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
const months = [];
const ref = new Date();
for (let i = 5; i >= 0; i--) {
const d = new Date(ref.getFullYear(), ref.getMonth() - i, 1);
months.push({ y: d.getFullYear(), m: d.getMonth(), label: MESI[d.getMonth()], prev: 0, corr: 0, altro: 0, ver: 0 });
}
const slot = ds => { const d = new Date(ds); if (isNaN(d))
return null; for (const x of months) {
if (x.y === d.getFullYear() && x.m === d.getMonth())
return x;
} return null; };
myJobs.forEach(j => { const sl = slot(j.openDate); if (!sl)
return; if (j.type === "preventiva")
sl.prev++;
else if (j.type === "correttiva")
sl.corr++;
else
sl.altro++; });
iecReports.forEach(r => { if (custFilter && !aIds[r.assetId])
return; const sl = slot(r.date); if (sl)
sl.ver++; });
funcReports.forEach(r => { if (custFilter && !aIds[r.assetId])
return; const sl = slot(r.date); if (sl)
sl.ver++; });
const probMap = {};
myJobs.forEach(j => { if (j.type !== "correttiva" || !inP(j.openDate))
return; probMap[j.assetId] = (probMap[j.assetId] || 0) + 1; });
const top = Object.keys(probMap).map(id => { const a = assets.find(x => x.id === id); const cu = a && customers.find(c => c.id === a.customerId); return { id, n: probMap[id], name: a ? (a.name || "?") : "?", code: a ? (a.assetCode || "") : "", cust: cu ? cu.name : "" }; }).sort((x, y) => y.n - x.n).slice(0, 5);
const byCust = {};
myJobs.forEach(j => {
if (!inP(j.openDate))
return;
const a = assets.find(x => x.id === j.assetId);
const cid = j.customerId || (a && a.customerId) || "";
if (!cid)
return;
const e = byCust[cid] || (byCust[cid] = { ore: 0, ric: 0 });
e.ore += parseFloat(j.laborHours) || 0;
(j.parts || []).forEach(it => { const pp = parts.find(z => z.id === (it.partId || it.id)); const prezzo = parseFloat(it.price) || (pp ? (parseFloat(pp.sellPrice) || parseFloat(pp.unitPrice) || 0) : 0); e.ric += (parseFloat(it.qty) || 1) * prezzo; });
});
const topCust = Object.keys(byCust).map(cid => { const cu = customers.find(c => c.id === cid); return { name: cu ? cu.name : "?", ore: byCust[cid].ore, ric: byCust[cid].ric }; }).sort((a, b) => b.ore - a.ore).slice(0, 5);
const corrInP = myJobs.filter(j => j.type === "correttiva" && inP(j.openDate));
const nGuasti = corrInP.length;
let spanDays = period;
if (period === 0) { const ds = myJobs.map(j => new Date(j.openDate).getTime()).filter(t => !isNaN(t)); const minTs = ds.reduce((a, b) => a < b ? a : b, Infinity); spanDays = ds.length ? Math.max(1, (now - minTs) / 86400000) : 0; }
const mtbf = (nGuasti > 0 && myAssets.length > 0 && spanDays > 0) ? Math.round(myAssets.length * spanDays / nGuasti) : null;
const openedInP = myJobs.filter(j => inP(j.openDate));
const closedOfThose = openedInP.filter(j => j.status === "chiuso" || j.closeDate);
const completPct = openedInP.length ? Math.round(100 * closedOfThose.length / openedInP.length) : null;
const prevN = myJobs.filter(j => j.type === "preventiva" && inP(j.openDate)).length;
const corrN = nGuasti;
const pmPct = (prevN + corrN) > 0 ? Math.round(100 * prevN / (prevN + corrN)) : null;
const jobCost = (j) => { const lab = (parseFloat(j.laborHours) || 0) * (parseFloat(j.laborRate) || 0); const trav = parseFloat(j.travelCost) || 0; const pc = (j.parts || []).reduce((s, it) => { const pp = parts.find(z => z.id === (it.partId || it.id)); const prezzo = parseFloat(it.price) || (pp ? (parseFloat(pp.sellPrice) || parseFloat(pp.unitPrice) || 0) : 0); return s + (parseFloat(it.qty) || 1) * prezzo; }, 0); return lab + trav + pc; };
const costByAsset = {}; let totalCost = 0;
myJobs.forEach(j => { if (!inP(j.openDate)) return; const c = jobCost(j); totalCost += c; if (j.assetId) costByAsset[j.assetId] = (costByAsset[j.assetId] || 0) + c; });
const topCost = Object.keys(costByAsset).map(id => { const a = assets.find(x => x.id === id); const cu = a && customers.find(c => c.id === a.customerId); return { id, cost: costByAsset[id], name: a ? (a.name || "?") : "?", code: a ? (a.assetCode || "") : "", cust: cu ? cu.name : "" }; }).sort((x, y) => y.cost - x.cost).slice(0, 5);
const avgCost = myAssets.length ? totalCost / myAssets.length : 0;
return { nAssets: myAssets.length, confPct, conformi, nonConformi, maiVerificati, scaduti, d30, d60, d90, mttr, nChiusi: chiusi.length, ritorniPct, months, top, topCust, mtbf, nGuasti, completPct, nOpenedP: openedInP.length, nClosedP: closedOfThose.length, prevN, corrN, pmPct, totalCost, avgCost, topCost };
}, [assets, jobs, customers, iecReports, funcReports, parts, custFilter, period]);
const trend = React.useMemo(() => {
const myA = assets.filter(a => (!custFilter || a.customerId === custFilter) && a.status !== "dismesso");
const aIds = {}; myA.forEach(a => { aIds[a.id] = true; });
const myJ = jobs.filter(j => (custFilter ? (j.customerId === custFilter || aIds[j.assetId]) : true));
const jcost = (j) => { const lab = (parseFloat(j.laborHours) || 0) * (parseFloat(j.laborRate) || 0); const trav = parseFloat(j.travelCost) || 0; const pc = (j.parts || []).reduce((s, it) => { const pp = parts.find(z => z.id === (it.partId || it.id)); const prezzo = parseFloat(it.price) || (pp ? (parseFloat(pp.sellPrice) || parseFloat(pp.unitPrice) || 0) : 0); return s + (parseFloat(it.qty) || 1) * prezzo; }, 0); return lab + trav + pc; };
const iecByA = {}, funcByA = {};
iecReports.forEach(r => { if (aIds[r.assetId]) (iecByA[r.assetId] = iecByA[r.assetId] || []).push(r); });
funcReports.forEach(r => { if (aIds[r.assetId]) (funcByA[r.assetId] = funcByA[r.assetId] || []).push(r); });
const latestUpTo = (list, endTs) => { let best = null; (list || []).forEach(r => { const t = new Date(r.date).getTime(); if (isNaN(t) || t > endTs) return; if (!best || String(r.date) > String(best.date)) best = r; }); return best; };
const MESI = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
const ref = new Date();
const out = [];
for (let i = trendRange - 1; i >= 0; i--) {
const d = new Date(ref.getFullYear(), ref.getMonth() - i, 1);
const startTs = d.getTime();
const endTs = new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime() - 1;
let conf = 0, nonconf = 0;
myA.forEach(a => { const li = latestUpTo(iecByA[a.id], endTs), lf = latestUpTo(funcByA[a.id], endTs); if (!li && !lf) return; const fails = (li && li.overallPass === false) || (lf && lf.overallPass === false); if (fails) nonconf++; else conf++; });
const ver = conf + nonconf;
let cost = 0;
myJ.forEach(j => { const t = new Date(j.openDate).getTime(); if (!isNaN(t) && t >= startTs && t <= endTs) cost += jcost(j); });
out.push({ label: MESI[d.getMonth()], conf: ver > 0 ? Math.round(100 * conf / ver) : null, ver: ver, cost: cost });
}
return out;
}, [assets, jobs, iecReports, funcReports, parts, custFilter, trendRange]);
const card = { background: "var(--card)", border: "1px solid var(--border-2)", borderRadius: 14, padding: "14px 16px" };
const big = { fontSize: 28, fontWeight: 700, lineHeight: 1.05, fontFamily: "'Space Grotesk', sans-serif" };
const sub = { fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".06em", marginTop: 4 };
const selS = { background: "var(--bg-2)", color: "var(--text)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "8px 10px", fontSize: 13 };
const maxMix = Math.max(1, ...K.months.map(m => m.prev + m.corr + m.altro));
const maxVer = Math.max(1, ...K.months.map(m => m.ver));
const maxTrendCost = Math.max(1, ...trend.map(t => t.cost));
const Bar = ({ h, color, title }) => React.createElement("div", { title: title, style: { height: Math.max(h > 0 ? 2 : 0, h), background: color, borderRadius: 3 } });
return (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: isMobile ? 14 : 18, fontWeight: 900, display: isMobile ? "none" : "block" } }, "KPI & Statistiche"),
React.createElement("p", { style: { color: "var(--text-3)", margin: isMobile ? 0 : "2px 0 0", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" } },
K.nAssets,
" apparecchi nel filtro")),
React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
React.createElement("select", { style: selS, value: custFilter, onChange: e => setCustFilter(e.target.value) },
React.createElement("option", { value: "" }, "Tutti i clienti"),
customers.map(c => React.createElement("option", { key: c.id, value: c.id }, c.name))),
React.createElement("select", { style: selS, value: period, onChange: e => setPeriod(parseInt(e.target.value, 10)) },
React.createElement("option", { value: 30 }, "Ultimi 30 giorni"),
React.createElement("option", { value: 90 }, "Ultimi 90 giorni"),
React.createElement("option", { value: 365 }, "Ultimi 12 mesi"),
React.createElement("option", { value: 0 }, "Da sempre")))),
kpiHelp && KPI_INFO[kpiHelp] ? React.createElement("div", { onClick: () => setKpiHelp(null), style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 18 } }, React.createElement("div", { onClick: (e) => e.stopPropagation(), style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 18, maxWidth: 420, width: "100%", boxShadow: "0 12px 40px rgba(0,0,0,0.5)" } }, React.createElement("div", { style: { fontSize: 16, fontWeight: 800, color: "var(--text-strong)", marginBottom: 8 } }, KPI_INFO[kpiHelp].t), React.createElement("div", { style: { fontSize: 13.5, color: "var(--text)", lineHeight: 1.55 } }, KPI_INFO[kpiHelp].d), React.createElement("button", { onClick: () => setKpiHelp(null), style: { marginTop: 14, width: "100%", background: "#2dd4bf", color: "#fff", border: "none", borderRadius: 8, padding: "9px 0", fontSize: 14, fontWeight: 700, cursor: "pointer" } }, "Ho capito"))) : null,
React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 12, marginBottom: 14 } },
React.createElement("div", { style: card },
React.createElement("div", { style: Object.assign(Object.assign({}, big), { color: K.confPct === null ? "var(--text-3)" : K.confPct >= 90 ? "#22c55e" : K.confPct >= 70 ? "#f59e0b" : "#ef4444" }) }, K.confPct === null ? "—" : K.confPct + "%"),
React.createElement("div", { style: sub }, "Parco conforme", infoDot("conformita")),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 6 } },
K.conformi,
" ok \u00B7 ",
K.nonConformi,
" non conformi \u00B7 ",
K.maiVerificati,
" mai verificati")),
React.createElement("div", { style: card },
React.createElement("div", { style: Object.assign(Object.assign({}, big), { color: K.scaduti > 0 ? "#ef4444" : "#22c55e" }) }, K.scaduti),
React.createElement("div", { style: sub }, "Verifiche scadute", infoDot("scaduti")),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 6 } },
K.d30,
" entro 30g \u00B7 ",
K.d60,
" a 60g \u00B7 ",
K.d90,
" a 90g")),
React.createElement("div", { style: card },
React.createElement("div", { style: big }, K.mttr === null ? "—" : K.mttr + " gg"),
React.createElement("div", { style: sub }, "Tempo medio riparazione", infoDot("mttr")),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 6 } },
K.nChiusi,
" correttivi chiusi nel periodo")),
React.createElement("div", { style: card },
React.createElement("div", { style: Object.assign(Object.assign({}, big), { color: K.ritorniPct === null ? "var(--text)" : K.ritorniPct <= 10 ? "#22c55e" : K.ritorniPct <= 25 ? "#f59e0b" : "#ef4444" }) }, K.ritorniPct === null ? "—" : K.ritorniPct + "%"),
React.createElement("div", { style: sub }, "Ritorni entro 30 giorni", infoDot("ritorni")),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 6 } }, "stesso apparecchio, nuovo guasto"))),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: 12, marginBottom: 14 } },
React.createElement("div", { style: card },
React.createElement("div", { style: big }, K.mtbf === null ? "\u2014" : K.mtbf + " gg"),
React.createElement("div", { style: sub }, "Tempo tra guasti (MTBF)", infoDot("mtbf")),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 6 } }, K.nGuasti + " guasti nel periodo \u00b7 stima")),
React.createElement("div", { style: card },
React.createElement("div", { style: Object.assign(Object.assign({}, big), { color: K.completPct === null ? "var(--text-3)" : K.completPct >= 80 ? "#22c55e" : K.completPct >= 50 ? "#f59e0b" : "#ef4444" }) }, K.completPct === null ? "\u2014" : K.completPct + "%"),
React.createElement("div", { style: sub }, "Tasso completamento", infoDot("completamento")),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 6 } }, K.nClosedP + " chiusi su " + K.nOpenedP + " aperti")),
React.createElement("div", { style: card },
React.createElement("div", { style: Object.assign(Object.assign({}, big), { color: K.pmPct === null ? "var(--text-3)" : K.pmPct >= 60 ? "#22c55e" : K.pmPct >= 40 ? "#f59e0b" : "#ef4444" }) }, K.pmPct === null ? "\u2014" : K.pmPct + "%"),
React.createElement("div", { style: sub }, "Quota preventiva", infoDot("preventiva")),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 6 } }, K.prevN + " prev \u00b7 " + K.corrN + " corr"))),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 14 } },
React.createElement("div", { style: card },
React.createElement("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 10 } },
"Interventi per mese ",
React.createElement("span", { style: { fontSize: 10, color: "var(--text-3)" } },
"(",
React.createElement("span", { style: { color: "#2dd4bf" } }, "\u25A0 prev."),
" ",
React.createElement("span", { style: { color: "#f59e0b" } }, "\u25A0 corr."),
" ",
React.createElement("span", { style: { color: "#a855f7" } }, "\u25A0 altro"),
")")),
React.createElement("div", { style: { display: "flex", alignItems: "flex-end", gap: 8, height: 118 } }, K.months.map((m, i) => {
const tot = m.prev + m.corr + m.altro;
return (React.createElement("div", { key: i, style: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 1 }, title: m.label + ": " + tot },
React.createElement(Bar, { h: 86 * m.altro / maxMix, color: "#a855f7" }),
React.createElement(Bar, { h: 86 * m.corr / maxMix, color: "#f59e0b" }),
React.createElement(Bar, { h: 86 * m.prev / maxMix, color: "#2dd4bf" }),
React.createElement("div", { style: { fontSize: 9, color: "var(--text-3)", textAlign: "center", marginTop: 3 } },
m.label,
React.createElement("br", null),
tot || "")));
}))),
React.createElement("div", { style: card },
React.createElement("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 10 } }, "Verifiche eseguite per mese"),
React.createElement("div", { style: { display: "flex", alignItems: "flex-end", gap: 8, height: 118 } }, K.months.map((m, i) => (React.createElement("div", { key: i, style: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }, title: m.label + ": " + m.ver },
React.createElement(Bar, { h: 86 * m.ver / maxVer, color: "#5eead4" }),
React.createElement("div", { style: { fontSize: 9, color: "var(--text-3)", textAlign: "center", marginTop: 3 } },
m.label,
React.createElement("br", null),
m.ver || ""))))))),
React.createElement("div", { style: Object.assign(Object.assign({}, card), { marginBottom: 12 }) },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 } },
React.createElement("div", { style: { fontSize: 13, fontWeight: 700 } }, "Andamento nel tempo"),
React.createElement("div", { style: { display: "flex", gap: 4 } }, [6, 12, 24].map(r => React.createElement("button", { key: r, onClick: () => setTrendRange(r), style: { background: trendRange === r ? "#2dd4bf" : "var(--surface-2)", color: trendRange === r ? "#fff" : "var(--text-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer" } }, r + "m")))),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginBottom: 6 } }, "Conformità del parco (%)"),
React.createElement(AreaTrend, { data: trend, valueKey: "conf", color: "#2dd4bf", height: 96, suffix: "%" }),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", margin: "12px 0 6px" } }, "Costo manutenzione (€/mese)"),
React.createElement(AreaTrend, { data: trend, valueKey: "cost", color: "#f59e0b", height: 96, money: true })),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 12 } },
React.createElement("div", { style: card },
React.createElement("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 10 } }, "Costo manutenzione (periodo)", infoDot("costo")),
React.createElement("div", { style: big }, "€ " + Math.round(K.totalCost || 0).toLocaleString("it-IT")),
React.createElement("div", { style: sub }, "Totale interventi nel periodo"),
React.createElement("div", { style: { fontSize: 12, color: "var(--text-2)", marginTop: 8 } }, "Media per apparecchio: € " + Math.round(K.avgCost || 0).toLocaleString("it-IT")),
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", marginTop: 4, fontStyle: "italic" } }, "manodopera + trasferta + ricambi")),
React.createElement("div", { style: card },
React.createElement("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 10 } }, "Apparecchi più costosi"),
(!K.topCost || K.topCost.length === 0) ? React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)" } }, "Nessun costo nel periodo.") :
K.topCost.map(t => (React.createElement("div", { key: t.id, style: { display: "flex", justifyContent: "space-between", gap: 10, padding: "6px 0", borderBottom: "1px solid var(--border-2)", fontSize: 13 } },
React.createElement("div", { style: { minWidth: 0 } },
React.createElement("div", { style: { fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, t.name, " ", t.code ? React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#2dd4bf" } }, t.code) : null),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)" } }, t.cust)),
React.createElement("div", { style: { fontWeight: 800, color: "#f59e0b", whiteSpace: "nowrap" } }, "€ " + Math.round(t.cost).toLocaleString("it-IT"))))))),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 } },
React.createElement("div", { style: card },
React.createElement("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 10 } }, "Apparecchi pi\u00F9 problematici"),
K.top.length === 0 ? React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)" } }, "Nessun correttivo nel periodo.") :
K.top.map(t => (React.createElement("div", { key: t.id, style: { display: "flex", justifyContent: "space-between", gap: 10, padding: "6px 0", borderBottom: "1px solid var(--border-2)", fontSize: 13 } },
React.createElement("div", { style: { minWidth: 0 } },
React.createElement("div", { style: { fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } },
t.name,
" ",
t.code ? React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#2dd4bf" } }, t.code) : null),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)" } }, t.cust)),
React.createElement("div", { style: { fontWeight: 800, color: "#f59e0b" } }, t.n))))),
React.createElement("div", { style: card },
React.createElement("div", { style: { fontSize: 13, fontWeight: 700, marginBottom: 10 } }, "Clienti per impegno nel periodo"),
K.topCust.length === 0 ? React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)" } }, "Nessun intervento nel periodo.") :
K.topCust.map((c, i) => (React.createElement("div", { key: i, style: { display: "flex", justifyContent: "space-between", gap: 10, padding: "6px 0", borderBottom: "1px solid var(--border-2)", fontSize: 13 } },
React.createElement("div", { style: { fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, c.name),
React.createElement("div", { style: { fontSize: 12, color: "var(--text-2)", whiteSpace: "nowrap" } },
Math.round(10 * c.ore) / 10,
" h \u00B7 \u20AC",
Math.round(c.ric)))))))));
}
export function AgendaPage({ assets, jobs, instruments, iecReports, funcReports, customers, setTab: goTab, setModal, showToast }) {
const [view, setView] = React.useState('overview');
const [filterType, setFilterType] = React.useState('all');
const [monthOffset, setMonthOffset] = React.useState(0);
const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);
const MONTHS_IT = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
const DAYS_IT = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
const viewDate = new Date(TODAY.getFullYear(), TODAY.getMonth() + monthOffset, 1);
const viewYear = viewDate.getFullYear();
const viewMonth = viewDate.getMonth();
const allEvents = React.useMemo(() => {
const events = [];
assets.forEach(a => {
if (!a.nextService)
return;
const date = new Date(a.nextService);
const days = Math.round((date - TODAY) / 86400000);
const customer = customers.find(c => c.id === a.customerId);
events.push({
id: 'maint-' + a.id, type: 'maintenance',
color: days < 0 ? '#ef4444' : days <= 30 ? '#f59e0b' : '#2dd4bf',
date: a.nextService, dateObj: date,
title: a.name,
customerName: customer ? customer.name : 'Senza cliente',
customerId: a.customerId || '',
location: a.location || '',
subtitle: (a.brand ? a.brand + ' ' : '') + (a.model || ''),
days, assetId: a.id,
status: days < 0 ? ('scaduta da ' + Math.abs(days) + 'gg') : days === 0 ? 'oggi' : ('tra ' + days + 'gg'),
onAction: () => setModal({ type: 'iec', assetId: a.id, data: null }),
});
});
instruments.forEach(i => {
if (!i.calExpiry)
return;
const date = new Date(i.calExpiry);
const days = Math.round((date - TODAY) / 86400000);
events.push({
id: 'cal-' + i.id, type: 'calibration',
color: days < 0 ? '#ef4444' : days <= 60 ? '#f59e0b' : '#a855f7',
date: i.calExpiry, dateObj: date,
title: (i.brand || '') + ' ' + (i.model || ''),
customerName: 'Strumenti interni', customerId: '__instruments__',
location: '', subtitle: i.category || 'Strumento di misura',
days,
status: days < 0 ? ('scaduta da ' + Math.abs(days) + 'gg') : ('tra ' + days + 'gg'),
onAction: () => goTab('instruments'),
});
});
jobs.filter(j => j.status !== 'chiuso').forEach(j => {
const asset = assets.find(a => a.id === j.assetId);
const customer = customers.find(c => c.id === (j.customerId || (asset === null || asset === void 0 ? void 0 : asset.customerId)));
const date = new Date(j.openDate || TODAY);
const days = Math.round((date - TODAY) / 86400000);
events.push({
id: 'job-' + j.id, type: 'job',
color: j.priority === 'urgente' ? '#ef4444' : j.priority === 'alta' ? '#f97316' : 'var(--text-3)',
date: (j.openDate || TODAY.toISOString().slice(0, 10)), dateObj: date,
title: j.description || 'Intervento',
customerName: customer ? customer.name : 'Senza cliente',
customerId: (j.customerId || (asset === null || asset === void 0 ? void 0 : asset.customerId) || ''),
location: (asset === null || asset === void 0 ? void 0 : asset.location) || '',
subtitle: asset ? asset.name : '',
days, status: j.status,
onAction: () => setModal({ type: 'job', data: j }),
});
});
return events.sort((a, b) => a.dateObj - b.dateObj);
}, [assets, instruments, jobs, customers]);
const monthEvents = React.useMemo(() => {
return allEvents.filter(e => {
const d = e.dateObj;
return d.getFullYear() === viewYear && d.getMonth() === viewMonth &&
(filterType === 'all' || e.type === filterType);
});
}, [allEvents, viewYear, viewMonth, filterType]);
const stats = React.useMemo(() => {
const overdue = monthEvents.filter(e => e.days < 0).length;
const thisWeek = monthEvents.filter(e => e.days >= 0 && e.days <= 7).length;
const maint = monthEvents.filter(e => e.type === 'maintenance').length;
const cal = monthEvents.filter(e => e.type === 'calibration').length;
const job = monthEvents.filter(e => e.type === 'job').length;
return { total: monthEvents.length, overdue, thisWeek, maint, cal, job };
}, [monthEvents]);
const byClient = React.useMemo(() => {
const groups = {};
monthEvents.forEach(e => {
const key = e.customerId || '__none__';
if (!groups[key])
groups[key] = { name: e.customerName, events: [], overdue: 0 };
groups[key].events.push(e);
if (e.days < 0)
groups[key].overdue++;
});
return Object.values(groups).sort((a, b) => b.overdue - a.overdue || b.events.length - a.events.length);
}, [monthEvents]);
const byWeek = React.useMemo(() => {
const weeks = {};
monthEvents.forEach(e => {
const d = e.dateObj;
const weekNum = Math.ceil(d.getDate() / 7);
if (!weeks[weekNum])
weeks[weekNum] = [];
weeks[weekNum].push(e);
});
return Object.entries(weeks).map(([w, events]) => ({
week: parseInt(w),
label: 'Settimana ' + w + ' (' + ((parseInt(w) - 1) * 7 + 1) + '–' + Math.min(parseInt(w) * 7, 31) + ')',
events: events.sort((a, b) => a.dateObj - b.dateObj),
})).sort((a, b) => a.week - b.week);
}, [monthEvents]);
const TYPE_LABEL = { maintenance: 'Verifica', calibration: 'Calibrazione', job: 'Intervento' };
const Tab = ({ id, label }) => (React.createElement("button", { onClick: () => setView(id), style: {
background: view === id ? '#2dd4bf' : 'transparent',
color: view === id ? '#06251f' : 'var(--text-2)',
border: view === id ? 'none' : '1px solid #2a3040',
borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
fontSize: 12.5, fontWeight: 700, whiteSpace: 'nowrap',
} }, label));
const EventRow = ({ e, showClient }) => (React.createElement("div", { onClick: e.onAction, style: {
display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
background: 'var(--bg-2)', borderRadius: 8, border: '1px solid #1e2a3a',
borderLeft: '3px solid ' + e.color, cursor: 'pointer', marginBottom: 6,
} },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, e.title),
React.createElement("div", { style: { fontSize: 11, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, showClient && e.customerName !== 'Strumenti interni' ? e.customerName + (e.location ? ' · ' + e.location : '') : e.subtitle)),
React.createElement("div", { style: { textAlign: 'right', flexShrink: 0 } },
React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: e.color, whiteSpace: 'nowrap' } }, e.status),
React.createElement("div", { style: { fontSize: 10, color: 'var(--text-4)' } }, e.date))));
return (React.createElement("div", null,
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900 } }, "Agenda & Pianificazione"),
React.createElement("p", { style: { color: 'var(--text-3)', margin: '2px 0 0', fontSize: 12 } }, "Cosa c'\u00E8 da fare, organizzato per non perdere niente"))),
React.createElement("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 } },
React.createElement("button", { onClick: () => setMonthOffset(monthOffset - 1), style: { background: 'var(--surface)', border: '1px solid #2a3040', borderRadius: 8, color: 'var(--text-2)', padding: '7px 14px', cursor: 'pointer', fontSize: 16 } }, "\u2039"),
React.createElement("div", { style: { textAlign: 'center', minWidth: 170 } },
React.createElement("div", { style: { fontWeight: 800, fontSize: 16, color: 'var(--text)' } },
MONTHS_IT[viewMonth],
" ",
viewYear),
monthOffset !== 0 && React.createElement("button", { onClick: () => setMonthOffset(0), style: { background: 'none', border: 'none', color: '#2dd4bf', fontSize: 10, cursor: 'pointer', padding: 0, marginTop: 2 } }, "\u21A9 Torna a oggi")),
React.createElement("button", { onClick: () => setMonthOffset(monthOffset + 1), style: { background: 'var(--surface)', border: '1px solid #2a3040', borderRadius: 8, color: 'var(--text-2)', padding: '7px 14px', cursor: 'pointer', fontSize: 16 } }, "\u203A")),
React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 10, marginBottom: 16 } },
React.createElement("div", { style: { background: 'var(--surface)', border: '1px solid #1e2a3a', borderRadius: 10, padding: '12px 14px' } },
React.createElement("div", { style: { fontSize: 26, fontWeight: 900, color: '#2dd4bf', fontFamily: 'monospace', lineHeight: 1 } }, stats.total),
React.createElement("div", { style: { fontSize: 10, color: 'var(--text-3)', marginTop: 5, textTransform: 'uppercase', letterSpacing: .6, fontWeight: 700 } }, "Da fare")),
React.createElement("div", { style: { background: 'var(--surface)', border: '1px solid ' + (stats.overdue > 0 ? '#ef444444' : 'var(--border-2)'), borderRadius: 10, padding: '12px 14px' } },
React.createElement("div", { style: { fontSize: 26, fontWeight: 900, color: '#ef4444', fontFamily: 'monospace', lineHeight: 1 } }, stats.overdue),
React.createElement("div", { style: { fontSize: 10, color: 'var(--text-3)', marginTop: 5, textTransform: 'uppercase', letterSpacing: .6, fontWeight: 700 } }, "Scadute")),
React.createElement("div", { style: { background: 'var(--surface)', border: '1px solid #1e2a3a', borderRadius: 10, padding: '12px 14px' } },
React.createElement("div", { style: { fontSize: 26, fontWeight: 900, color: '#f59e0b', fontFamily: 'monospace', lineHeight: 1 } }, stats.thisWeek),
React.createElement("div", { style: { fontSize: 10, color: 'var(--text-3)', marginTop: 5, textTransform: 'uppercase', letterSpacing: .6, fontWeight: 700 } }, "Entro 7gg")),
React.createElement("div", { style: { background: 'var(--surface)', border: '1px solid #1e2a3a', borderRadius: 10, padding: '12px 14px' } },
React.createElement("div", { style: { fontSize: 26, fontWeight: 900, color: 'var(--text-2)', fontFamily: 'monospace', lineHeight: 1 } }, byClient.length),
React.createElement("div", { style: { fontSize: 10, color: 'var(--text-3)', marginTop: 5, textTransform: 'uppercase', letterSpacing: .6, fontWeight: 700 } }, "Clienti"))),
React.createElement("div", { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 } }, [
{ id: 'all', label: 'Tutto (' + stats.total + ')' },
{ id: 'maintenance', label: 'Verifiche (' + stats.maint + ')' },
{ id: 'calibration', label: 'Calibrazioni (' + stats.cal + ')' },
{ id: 'job', label: 'Interventi (' + stats.job + ')' },
].map(f => (React.createElement("button", { key: f.id, onClick: () => setFilterType(f.id), style: {
background: filterType === f.id ? '#2dd4bf22' : 'var(--surface)',
color: filterType === f.id ? '#2dd4bf' : 'var(--text-3)',
border: '1px solid ' + (filterType === f.id ? '#2dd4bf66' : 'var(--border)'),
borderRadius: 20, padding: '4px 13px', cursor: 'pointer', fontSize: 11.5, fontWeight: 700,
} }, f.label)))),
React.createElement("div", { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16, overflowX: 'auto', paddingBottom: 2 } },
React.createElement(Tab, { id: "overview", label: "Priorit\u00E0" }),
React.createElement(Tab, { id: "byClient", label: "Per cliente" }),
React.createElement(Tab, { id: "byWeek", label: "Per settimana" }),
React.createElement(Tab, { id: "calendar", label: "Calendario" })),
stats.total === 0 && (React.createElement(EmptyState, { icon: "\uD83D\uDCC5", title: "Niente in programma per " + MONTHS_IT[viewMonth], subtitle: "Nessuna verifica, calibrazione o intervento in scadenza questo mese. Usa le frecce sopra per controllare gli altri mesi." })),
stats.total > 0 && view === 'overview' && (React.createElement("div", null,
stats.overdue > 0 && (React.createElement("div", { style: { marginBottom: 18 } },
React.createElement("div", { style: { fontSize: 12, fontWeight: 800, color: '#ef4444', marginBottom: 8, textTransform: 'uppercase', letterSpacing: .6, display: 'flex', alignItems: 'center', gap: 6 } },
"\u26A0 Scadute \u2014 da recuperare (",
stats.overdue,
")"),
monthEvents.filter(e => e.days < 0).map(e => React.createElement(EventRow, { key: e.id, e: e, showClient: true })))),
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 12, fontWeight: 800, color: 'var(--text-2)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: .6 } }, "In programma (per scadenza)"),
monthEvents.filter(e => e.days >= 0).map(e => React.createElement(EventRow, { key: e.id, e: e, showClient: true })),
monthEvents.filter(e => e.days >= 0).length === 0 && (React.createElement("div", { style: { color: 'var(--text-3)', fontSize: 12, padding: '12px', textAlign: 'center' } }, "Tutto il resto \u00E8 gi\u00E0 scaduto \u2014 recupera quelle sopra."))))),
stats.total > 0 && view === 'byClient' && (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: 12 } }, byClient.map((g, gi) => (React.createElement("div", { key: gi, style: { background: 'var(--surface)', border: '1px solid ' + (g.overdue > 0 ? '#ef444433' : 'var(--border-2)'), borderRadius: 12, overflow: 'hidden' } },
React.createElement("div", { style: { padding: '10px 14px', background: 'var(--bg-2)', borderBottom: '1px solid #1e2a3a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 } },
React.createElement("div", { style: { fontWeight: 800, fontSize: 14, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, g.name),
React.createElement("div", { style: { display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 } },
g.overdue > 0 && React.createElement("span", { style: { background: '#ef444422', color: '#ef4444', border: '1px solid #ef444444', borderRadius: 20, padding: '1px 8px', fontSize: 10, fontWeight: 800 } },
g.overdue,
" scadute"),
React.createElement("span", { style: { background: '#2dd4bf22', color: '#2dd4bf', borderRadius: 20, padding: '1px 8px', fontSize: 10, fontWeight: 800 } },
g.events.length,
" totali"))),
React.createElement("div", { style: { padding: '10px 12px' } }, g.events.map(e => React.createElement(EventRow, { key: e.id, e: e, showClient: false })))))))),
stats.total > 0 && view === 'byWeek' && (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: 12 } }, byWeek.map(w => (React.createElement("div", { key: w.week, style: { background: 'var(--surface)', border: '1px solid #1e2a3a', borderRadius: 12, overflow: 'hidden' } },
React.createElement("div", { style: { padding: '10px 14px', background: 'var(--bg-2)', borderBottom: '1px solid #1e2a3a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
React.createElement("span", { style: { fontWeight: 800, fontSize: 13, color: 'var(--text)' } }, w.label),
React.createElement("span", { style: { background: '#2dd4bf22', color: '#2dd4bf', borderRadius: 20, padding: '1px 8px', fontSize: 10, fontWeight: 800 } }, w.events.length)),
React.createElement("div", { style: { padding: '10px 12px' } }, w.events.map(e => React.createElement(EventRow, { key: e.id, e: e, showClient: true })))))))),
stats.total > 0 && view === 'calendar' && (React.createElement("div", { style: { background: 'var(--surface)', border: '1px solid #1e2a3a', borderRadius: 12, overflow: 'hidden' } },
React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', borderBottom: '1px solid #1e2a3a' } }, DAYS_IT.map(d => (React.createElement("div", { key: d, style: { padding: '8px 4px', textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase' } }, d)))),
React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' } }, (() => {
const monthStart = new Date(viewYear, viewMonth, 1);
const startPad = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1;
const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
const cells = [];
for (let i = 0; i < startPad; i++)
cells.push(React.createElement("div", { key: 'p' + i, style: { minHeight: 64, borderRight: '1px solid var(--border-2)', borderBottom: '1px solid var(--border-2)' } }));
for (let day = 1; day <= daysInMonth; day++) {
const dayEvents = monthEvents.filter(e => e.dateObj.getDate() === day);
const isToday = monthOffset === 0 && day === TODAY.getDate();
const hasOverdue = dayEvents.some(e => e.days < 0);
cells.push(React.createElement("div", { key: day, style: { minHeight: 64, padding: '5px', borderRight: '1px solid var(--border-2)', borderBottom: '1px solid var(--border-2)', background: isToday ? '#2dd4bf0a' : 'transparent' } },
React.createElement("div", { style: { fontSize: 11, fontWeight: isToday ? 900 : 500, color: isToday ? '#2dd4bf' : 'var(--text-3)', marginBottom: 4 } }, day),
dayEvents.length > 0 && (React.createElement("div", { onClick: () => { setView('byWeek'); }, style: {
background: hasOverdue ? '#ef444422' : '#2dd4bf22',
color: hasOverdue ? '#ef4444' : '#2dd4bf',
border: '1px solid ' + (hasOverdue ? '#ef444444' : '#2dd4bf44'),
borderRadius: 6, padding: '3px', textAlign: 'center', cursor: 'pointer',
fontSize: 13, fontWeight: 900, lineHeight: 1.2,
} },
dayEvents.length,
React.createElement("div", { style: { fontSize: 8, fontWeight: 600, opacity: .8 } }, dayEvents.length === 1 ? 'cosa' : 'cose')))));
}
return cells;
})()),
React.createElement("div", { style: { padding: '10px 14px', borderTop: '1px solid #1e2a3a', fontSize: 11, color: 'var(--text-3)', textAlign: 'center' } }, "Tocca un giorno per vedere i dettagli \u00B7 Il numero indica quante attivit\u00E0 ci sono")))));
}
export function PianoManuale({ assets, setAssets, customers, year, setYear, showToast, goTab }) {
const MONTHS_IT = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
const [filterType, setFilterType] = React.useState('all');
const [filterLocation, setFilterLocation] = React.useState('all');
const [filterCustomer, setFilterCustomer] = React.useState('all');
const [selectedIds, setSelectedIds] = React.useState([]);
const [bulkMonth, setBulkMonth] = React.useState('');
const categories = Array.from(new Set(assets.map(a => detectCategory(a.name || '')).filter(Boolean)));
const locations = Array.from(new Set(assets.map(a => a.location || '').filter(Boolean)));
const filtered = assets.filter(a => {
if (filterType !== 'all' && detectCategory(a.name || '') !== filterType)
return false;
if (filterLocation !== 'all' && a.location !== filterLocation)
return false;
if (filterCustomer !== 'all' && a.customerId !== filterCustomer)
return false;
return true;
});
const getPlanned = (asset) => {
if (!asset.plannedMonths)
return null;
return asset.plannedMonths[year] || null;
};
const setPlanned = (assetId, month) => {
setAssets(prev => prev.map(a => {
if (a.id !== assetId)
return a;
const planned = Object.assign({}, (a.plannedMonths || {}));
if (month === null || month === '') {
delete planned[year];
}
else {
planned[year] = parseInt(month);
}
return Object.assign(Object.assign({}, a), { plannedMonths: planned });
}));
};
const applyBulk = () => {
if (!bulkMonth) {
alert('Seleziona un mese');
return;
}
if (selectedIds.length === 0) {
alert('Seleziona almeno un apparecchio');
return;
}
const month = bulkMonth === 'none' ? null : parseInt(bulkMonth);
setAssets(prev => prev.map(a => {
if (!selectedIds.includes(a.id))
return a;
const planned = Object.assign({}, (a.plannedMonths || {}));
if (month === null)
delete planned[year];
else
planned[year] = month;
return Object.assign(Object.assign({}, a), { plannedMonths: planned });
}));
showToast(`✓ ${selectedIds.length} apparecchi ${month === null ? 'rimossi dal piano' : 'pianificati per ' + MONTHS_IT[month - 1]}`);
setSelectedIds([]);
setBulkMonth('');
};
const byMonth = {};
for (let m = 1; m <= 12; m++)
byMonth[m] = [];
const unplanned = [];
filtered.forEach(a => {
const p = getPlanned(a);
if (p)
byMonth[p].push(a);
else
unplanned.push(a);
});
const toggleSelect = (id) => {
setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
};
const selectAllFiltered = () => {
if (selectedIds.length === filtered.length)
setSelectedIds([]);
else
setSelectedIds(filtered.map(a => a.id));
};
const AssetCard = ({ asset, showSelect, compact }) => {
const customer = customers.find(c => c.id === asset.customerId);
const isSelected = selectedIds.includes(asset.id);
const category = detectCategory(asset.name || '') || 'Generico';
return (React.createElement("div", { style: {
background: isSelected ? '#2dd4bf15' : 'var(--bg)',
border: `1px solid ${isSelected ? '#2dd4bf66' : 'var(--border-4)'}`,
borderRadius: 6, padding: compact ? '5px 8px' : '8px 10px', marginBottom: 4,
cursor: showSelect ? 'pointer' : 'default',
display: 'flex', alignItems: 'center', gap: 8,
}, onClick: showSelect ? () => toggleSelect(asset.id) : undefined },
showSelect && (React.createElement("input", { type: "checkbox", checked: isSelected, readOnly: true, style: { accentColor: '#2dd4bf', cursor: 'pointer', flexShrink: 0 } })),
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { fontSize: compact ? 11 : 12, fontWeight: 700, color: 'var(--text-bright)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, asset.name),
!compact && (React.createElement("div", { style: { fontSize: 10, color: 'var(--text-3)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, [category, asset.location, customer === null || customer === void 0 ? void 0 : customer.name].filter(Boolean).join(' · ')))),
!showSelect && (React.createElement("select", { value: getPlanned(asset) || '', onChange: e => setPlanned(asset.id, e.target.value), onClick: e => e.stopPropagation(), style: { background: 'var(--surface)', border: '1px solid #2A2A38', borderRadius: 4, color: 'var(--text-2)', fontSize: 10, padding: '2px 4px', flexShrink: 0 } },
React.createElement("option", { value: "" }, "\u2014"),
MONTHS_IT.map((m, i) => React.createElement("option", { key: i, value: i + 1 }, m.slice(0, 3)))))));
};
return (React.createElement("div", null,
React.createElement("div", { style: { background: 'var(--surface)', border: '1px solid #2A2A38', borderRadius: 10, padding: '14px 16px', marginBottom: 14 } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 10 } },
React.createElement("div", null,
React.createElement("h3", { style: { margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--text-bright)' } }, "Piano Manutenzione Manuale"),
React.createElement("p", { style: { margin: '2px 0 0', fontSize: 11, color: 'var(--text-3)' } }, "Pianifica manualmente quando fare ogni apparecchio, indipendentemente dalla scadenza tecnica")),
React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 8 } },
React.createElement("span", { style: { color: 'var(--text-3)', fontSize: 12 } }, "Anno:"),
React.createElement("select", { value: year, onChange: e => setYear(+e.target.value), style: { background: 'var(--surface-2)', border: '1px solid #2a3040', borderRadius: 6, padding: '5px 10px', color: 'var(--text)', fontSize: 12 } }, [year - 1, year, year + 1, year + 2].map(y => React.createElement("option", { key: y, value: y }, y))))),
React.createElement("div", { style: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 0 } },
React.createElement("select", { value: filterType, onChange: e => setFilterType(e.target.value), style: { background: 'var(--bg)', border: '1px solid #2A2A38', borderRadius: 6, padding: '5px 10px', color: 'var(--text-2)', fontSize: 11 } },
React.createElement("option", { value: "all" }, "Tutte le categorie"),
categories.map(c => React.createElement("option", { key: c, value: c }, c))),
React.createElement("select", { value: filterLocation, onChange: e => setFilterLocation(e.target.value), style: { background: 'var(--bg)', border: '1px solid #2A2A38', borderRadius: 6, padding: '5px 10px', color: 'var(--text-2)', fontSize: 11 } },
React.createElement("option", { value: "all" }, "Tutte le ubicazioni"),
locations.map(l => React.createElement("option", { key: l, value: l }, l))),
React.createElement("select", { value: filterCustomer, onChange: e => setFilterCustomer(e.target.value), style: { background: 'var(--bg)', border: '1px solid #2A2A38', borderRadius: 6, padding: '5px 10px', color: 'var(--text-2)', fontSize: 11 } },
React.createElement("option", { value: "all" }, "Tutti i clienti"),
customers.map(c => React.createElement("option", { key: c.id, value: c.id }, c.name))),
React.createElement("span", { style: { marginLeft: 'auto', color: 'var(--text-3)', fontSize: 11, alignSelf: 'center' } },
filtered.length,
" apparecchi \u00B7 ",
unplanned.length,
" non pianificati"))),
React.createElement("div", { style: { background: 'var(--surface)', border: `1px solid ${selectedIds.length > 0 ? '#2dd4bf44' : 'var(--border-4)'}`, borderRadius: 10, padding: '10px 14px', marginBottom: 14,
display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' } },
React.createElement("button", { onClick: selectAllFiltered, style: { background: 'var(--surface-2)', border: '1px solid #2a3040', borderRadius: 6, color: 'var(--text-2)', padding: '5px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 700 } }, selectedIds.length === filtered.length && filtered.length > 0 ? 'Deseleziona tutti' : 'Seleziona tutti i filtrati'),
React.createElement("span", { style: { color: 'var(--text-3)', fontSize: 12 } },
selectedIds.length,
" selezionat",
selectedIds.length === 1 ? 'o' : 'i'),
selectedIds.length > 0 && (React.createElement(React.Fragment, null,
React.createElement("span", { style: { color: 'var(--text-3)', fontSize: 12, marginLeft: 'auto' } }, "Assegna a:"),
React.createElement("select", { value: bulkMonth, onChange: e => setBulkMonth(e.target.value), style: { background: 'var(--bg)', border: '1px solid #2A2A38', borderRadius: 6, padding: '5px 10px', color: 'var(--text-bright)', fontSize: 12 } },
React.createElement("option", { value: "" }, "\u2014 Mese \u2014"),
MONTHS_IT.map((m, i) => React.createElement("option", { key: i, value: i + 1 }, m)),
React.createElement("option", { value: "none" }, "Rimuovi pianificazione")),
React.createElement("button", { onClick: applyBulk, style: { background: '#2dd4bf', color: '#000', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 11, fontWeight: 800 } }, "Applica")))),
React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10, marginBottom: 14 } }, Array.from({ length: 12 }, (_, m) => m + 1).map(month => {
const items = byMonth[month];
return (React.createElement("div", { key: month, style: { background: 'var(--surface)', border: `1px solid ${items.length > 0 ? '#2dd4bf33' : 'var(--border-4)'}`, borderRadius: 10, overflow: 'hidden' } },
React.createElement("div", { style: { padding: '8px 12px', background: items.length > 0 ? '#2dd4bf15' : 'var(--surface-2)',
borderBottom: `1px solid ${items.length > 0 ? '#2dd4bf33' : 'var(--border-4)'}`,
display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
React.createElement("span", { style: { fontWeight: 800, fontSize: 12, color: items.length > 0 ? 'var(--text-bright)' : 'var(--text-3)' } }, MONTHS_IT[month - 1]),
items.length > 0 && (React.createElement("span", { style: { background: '#2dd4bf', color: '#000', borderRadius: 20, padding: '1px 7px', fontSize: 10, fontWeight: 900 } }, items.length))),
React.createElement("div", { style: { padding: 6, minHeight: 60 } }, items.length === 0 ? (React.createElement("div", { style: { padding: '10px 6px', color: 'var(--text-4)', fontSize: 11, textAlign: 'center' } }, "Nessuno")) : items.map(asset => React.createElement(AssetCard, { key: asset.id, asset: asset, compact: true })))));
})),
unplanned.length > 0 && (React.createElement("div", { style: { background: 'var(--surface)', border: '1px solid #f59e0b33', borderRadius: 10, overflow: 'hidden' } },
React.createElement("div", { style: { padding: '10px 14px', background: '#f59e0b15', borderBottom: '1px solid #f59e0b33',
display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 } },
React.createElement("span", { style: { fontWeight: 800, fontSize: 13, color: '#f59e0b' } },
"\u26A0 Non pianificati (",
unplanned.length,
")"),
React.createElement("span", { style: { fontSize: 10, color: 'var(--text-3)' } }, "Spunta gli apparecchi e usa \"Assegna a\" sopra, oppure scegli il mese dal menu su ogni riga")),
React.createElement("div", { style: { padding: 8, maxHeight: 300, overflowY: 'auto' } }, unplanned.map(asset => React.createElement(AssetCard, { key: asset.id, asset: asset, showSelect: true }))))),
React.createElement("div", { style: { textAlign: 'center', marginTop: 14, fontSize: 10, color: 'var(--text-4)' } }, "Suggerimento: assegna gli apparecchi ai mesi per bilanciare il carico di lavoro nell'anno. Il piano manuale \u00E8 indipendente dalla scadenza tecnica (Prossimo servizio).")));
}
function detectCategory(name) {
const n = (name || '').toLowerCase();
if (n.includes('defibrillatore') || n.includes('defib') || n.includes('dae'))
return 'Defibrillatore';
if (n.includes('monitor') || n.includes('saturim'))
return 'Monitor multiparametrico';
if (n.includes('ventilatore') || n.includes('respiratore'))
return 'Ventilatore';
if (n.includes('aspirat'))
return 'Aspiratore';
if (n.includes('pompa') || n.includes('infusion'))
return 'Pompa infusionale';
if (n.includes('elettrobistur') || n.includes('esu'))
return 'Elettrobisturi';
if (n.includes('ecograf') || n.includes('ultrasuon'))
return 'Ecografo';
if (n.includes('letto'))
return 'Letto elettrico';
if (n.includes('termometro'))
return 'Termometro';
if (n.includes('elettrocardiograf') || n.includes('ecg'))
return 'ECG';
return 'Altro';
}
