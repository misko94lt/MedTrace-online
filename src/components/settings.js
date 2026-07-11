import { t as __t, getLang, setLang } from "../constants/i18n.js";
/* MedTrace — impostazioni: azienda, tecnici, permessi, storage, import RFID, migrazione foto, abbonamento (estratti da app.js, v3.06) */
import { Inp, Modal, Grid, Span2, appConfirm, EmptyState } from "./ui.js";
import { Btn, TecniciManager } from "./shared.js";
import { FORM_INP, FORM_LBL, DEFAULT_ROLE_PERMS, PERM_SECTIONS, ROLES } from "../constants/ui.js";
import { downloadJSON } from "../lib/export.js";
import { fmtDateTimeIt, fmtMB, uploadPhotoToCloud, withUpdateMeta } from "../lib/util.js";
import { DEMO_LOCKED, OFFLINE_MODE, getSupa, getSupabaseClient, storageUsage, supabaseSaveCompany, supabaseSaveTechnicians, supabaseSyncMerge, supabaseSyncUp, supaDB, supaSignOut, fetchSubStatus } from "../lib/sync.js";
import { __awaiter } from "../lib/tslib.js";
import { parseRfidScan } from "../lib/rfid.js";
function photoStats(d) {
let chars = 0, count = 0;
const walk = (v) => {
if (typeof v === "string") {
if (v.lastIndexOf("data:image", 0) === 0) {
chars += v.length;
count++;
}
}
else if (Array.isArray(v)) {
for (let i = 0; i < v.length; i++)
walk(v[i]);
}
else if (v && typeof v === "object") {
for (const k in v)
walk(v[k]);
}
};
try {
walk(d);
}
catch (e) { }
return { chars, count };
}
function PermissionMatrix({ value, onChange }) {
var _a;
const editableRoles = ROLES.filter(r => r.id !== "superuser");
const [activeRole, setActiveRole] = React.useState(((_a = editableRoles[0]) === null || _a === void 0 ? void 0 : _a.id) || "admin");
const toggle = (roleId, secId) => {
const cur = (value[roleId] || DEFAULT_ROLE_PERMS[roleId] || []).slice();
const i = cur.indexOf(secId);
if (i >= 0)
cur.splice(i, 1);
else
cur.push(secId);
onChange(Object.assign(Object.assign({}, value), { [roleId]: cur }));
};
const has = (roleId, secId) => (value[roleId] || DEFAULT_ROLE_PERMS[roleId] || []).includes(secId);
const activeRoleObj = editableRoles.find(r => r.id === activeRole) || editableRoles[0];
const enabledCount = PERM_SECTIONS.filter(s => has(activeRole, s.id)).length;
return (React.createElement("div", null,
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .6, fontWeight: 700, marginBottom: 8 } }, __t("Scegli il ruolo da configurare")),
React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 6, flexWrap: "wrap" } }, editableRoles.map(r => {
const on = r.id === activeRole;
return (React.createElement("button", { key: r.id, onClick: () => setActiveRole(r.id), style: {
flex: "1 1 90px", minWidth: 90, background: on ? "#1F7468" : "var(--card)",
border: "1px solid " + (on ? "#2dd4bf" : "var(--border-3)"), borderRadius: 9, padding: "10px 8px",
cursor: "pointer", color: on ? "#04201C" : "var(--text-strong)", fontSize: 13, fontWeight: on ? 800 : 600,
touchAction: "manipulation", WebkitTapHighlightColor: "transparent"
} }, r.label));
})),
React.createElement("div", { style: { fontSize: 11.5, color: "var(--text-2)", lineHeight: 1.5, marginBottom: 16, padding: "9px 12px", background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 8 } }, activeRoleObj === null || activeRoleObj === void 0 ? void 0 :
activeRoleObj.desc,
React.createElement("span", { style: { display: "block", marginTop: 4, color: "#5eead4", fontWeight: 700 } },
enabledCount,
" sezioni visibili su ",
PERM_SECTIONS.length)),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 0, border: "1px solid var(--border-2)", borderRadius: 10, overflow: "hidden" } }, PERM_SECTIONS.map((sec, i) => {
const on = has(activeRole, sec.id);
return (React.createElement("label", { key: sec.id, style: {
display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
padding: "13px 15px", cursor: "pointer", borderBottom: i < PERM_SECTIONS.length - 1 ? "1px solid var(--card)" : "none",
background: i % 2 ? "var(--surface)" : "var(--bg)", WebkitTapHighlightColor: "transparent"
} },
React.createElement("span", { style: { fontSize: 14, color: on ? "var(--text)" : "var(--text-3)", fontWeight: on ? 600 : 400 } }, sec.label),
React.createElement("span", { onClick: (e) => { e.preventDefault(); toggle(activeRole, sec.id); }, style: {
position: "relative", width: 46, height: 26, borderRadius: 13, flexShrink: 0,
background: on ? "#1F7468" : "var(--border-3)", transition: "background .15s", cursor: "pointer"
} },
React.createElement("span", { style: {
position: "absolute", top: 3, left: on ? 23 : 3, width: 20, height: 20, borderRadius: "50%",
background: "#fff", transition: "left .15s", boxShadow: "0 1px 3px rgba(0,0,0,.4)"
} }))));
}))));
}
function SettingsSection({ icon, title, color, children, accent, defaultOpen }) {
const [open, setOpen] = React.useState(!!defaultOpen);
return (React.createElement("div", { style: { background: "var(--surface)", borderRadius: 14, border: "1px solid " + (accent || "#24242F"), overflow: "hidden" } },
React.createElement("button", { type: "button", onClick: () => setOpen(o => !o), style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 9, width: "100%", background: "transparent", border: "none", cursor: "pointer", padding: "15px 18px", textAlign: "left" } },
React.createElement("span", { style: { fontSize: 13, fontWeight: 800, color: color || "var(--text)", letterSpacing: .3 } }, title),
React.createElement("span", { style: { color: "var(--text-3)", fontSize: 12, transform: open ? "rotate(90deg)" : "none", transition: "transform .15s" } }, "\u203a")),
open ? React.createElement("div", { style: { padding: "0 18px 18px" } }, children) : null));
}
function FotoCloudMigrator({ data, onReplaceJobs }) {
const [busy, setBusy] = React.useState(false);
const [msg, setMsg] = React.useState("");
const offline = (typeof OFFLINE_MODE !== "undefined" && OFFLINE_MODE) || (typeof DEMO_LOCKED !== "undefined" && DEMO_LOCKED);
let locali = 0;
(data.jobs || []).forEach(j => (j.photos || []).forEach(ph => { if (ph && typeof ph.data === "string" && ph.data.lastIndexOf("data:image", 0) === 0)
locali++; }));
if (offline || locali === 0)
return null;
const migra = () => __awaiter(this, void 0, void 0, function* () {
setBusy(true);
setMsg("");
let fatte = 0, fallite = 0, liberati = 0;
const newJobs = [];
for (const j of (data.jobs || [])) {
const haLocali = (j.photos || []).some(ph => ph && typeof ph.data === "string" && ph.data.lastIndexOf("data:image", 0) === 0);
if (!haLocali) {
newJobs.push(j);
continue;
}
const np = [];
for (const ph of (j.photos || [])) {
if (ph && typeof ph.data === "string" && ph.data.lastIndexOf("data:image", 0) === 0) {
setMsg("Carico foto " + (fatte + fallite + 1) + " di " + locali + "…");
const url = yield uploadPhotoToCloud(ph.data);
if (url) {
liberati += ph.data.length;
np.push(Object.assign(Object.assign({}, ph), { data: url }));
fatte++;
}
else {
np.push(ph);
fallite++;
}
}
else {
np.push(ph);
}
}
newJobs.push(withUpdateMeta(Object.assign(Object.assign({}, j), { photos: np })));
}
if (onReplaceJobs)
onReplaceJobs(newJobs);
setBusy(false);
setMsg(fallite === 0
? ("✓ " + fatte + " foto spostate sul cloud — liberati " + fmtMB(liberati))
: ("✓ " + fatte + " spostate (liberati " + fmtMB(liberati) + ") · ✗ " + fallite + " non riuscite: controlla la connessione e riprova"));
});
return (React.createElement("div", { style: { marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border-2)" } },
React.createElement(Btn, { sm: true, disabled: busy, onClick: migra }, busy ? __t("Sposto…") : ("☁ Sposta " + locali + (locali === 1 ? " foto" : " foto") + " sul cloud")),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 7, lineHeight: 1.5 } }, __t("Carica le foto dei job sul cloud e qui tiene solo il link: liberi quasi tutto lo spazio e le foto si vedono da ogni dispositivo.")),
msg && React.createElement("div", { style: { fontSize: 11.5, color: msg.indexOf("✗") !== -1 ? "#f59e0b" : "#2dd4bf", marginTop: 8 } }, msg)));
}
function RfidImportSection({ onImportRfidScan }) {
const [rep, setRep] = React.useState(null);
const inputRef = React.useRef(null);
const handleFile = e => {
const input = e.target;
const file = input.files && input.files[0];
if (!file) { input.value = ""; return; }
const reader = new FileReader();
reader.onload = ev => {
try {
const json = JSON.parse(ev.target.result);
const rows = parseRfidScan(json);
if (!rows.length) { alert(__t("Nessuna lettura RFID valida. Atteso { location, date, epcs:[...] } oppure [{ epc, location, date }].")); input.value = ""; return; }
const r = onImportRfidScan ? onImportRfidScan(rows) : null;
if (r) setRep(r);
}
catch (err) { alert("Errore lettura file: " + ((err && err.message) || "JSON non valido")); }
input.value = "";
};
reader.onerror = () => { alert(__t("Impossibile leggere il file")); input.value = ""; };
reader.readAsText(file);
};
return React.createElement(SettingsSection, { icon: "\uD83D\uDCE1", title: __t("Inventario RFID") },
React.createElement("div", { style: { fontSize: 11.5, color: "var(--text-2)", lineHeight: 1.55, marginBottom: 10 } }, __t("Importa la scansione del lettore RFID (file JSON). Aggiorna l'ultima posizione degli apparecchi tramite EPC e segnala quelli con manutenzione scaduta o in scadenza.")),
React.createElement("input", { ref: inputRef, type: "file", accept: ".json,application/json", style: { display: "none" }, onChange: handleFile }),
React.createElement(Btn, { sm: true, onClick: () => { if (inputRef.current) inputRef.current.click(); } }, "\u2191 Importa scansione RFID"),
rep ? React.createElement("div", { style: { marginTop: 12, background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "12px 14px", fontSize: 12 } },
React.createElement("div", { style: { color: "#2dd4bf", fontWeight: 700, marginBottom: 8 } }, __t("Risultato scansione")),
React.createElement("div", { style: { color: "var(--text)", marginBottom: 4 } }, "Apparecchi aggiornati: " + rep.updated + " su " + rep.total + " letture"),
rep.unknown.length > 0 ? React.createElement("div", { style: { color: "#f59e0b", marginBottom: 4 } }, "EPC sconosciuti (nessun apparecchio): " + rep.unknown.length) : null,
rep.crit.length > 0
? React.createElement("div", { style: { marginTop: 8 } },
React.createElement("div", { style: { color: "#ef4444", fontWeight: 700, marginBottom: 5 } }, "\u26A0 " + rep.crit.length + " con manutenzione critica:"),
rep.crit.slice(0, 15).map((c, i) => React.createElement("div", { key: i, style: { display: "flex", justifyContent: "space-between", gap: 8, padding: "3px 0", borderBottom: "1px solid var(--border)" } },
React.createElement("span", { style: { color: "var(--text)" } }, c.name + (c.location ? (" \u00B7 " + c.location) : "")),
React.createElement("span", { style: { color: c.status === "scaduta" ? "#ef4444" : "#f59e0b", fontWeight: 700, fontSize: 11, whiteSpace: "nowrap" } }, c.status === "scaduta" ? ("scaduta il " + fmtDateTimeIt(c.nextService)) : ("scade il " + fmtDateTimeIt(c.nextService))))))
: React.createElement("div", { style: { color: "#22c55e", marginTop: 6 } }, __t("Nessuna criticit\u00E0 tra gli apparecchi scansionati")),
Object.keys(rep.byLoc).length > 0 ? React.createElement("div", { style: { marginTop: 10, fontSize: 11, color: "var(--text-2)" } },
React.createElement("div", { style: { color: "var(--text-3)", fontWeight: 700, marginBottom: 4 } }, __t("Per reparto:")),
Object.keys(rep.byLoc).map(l => React.createElement("div", { key: l }, l + ": " + rep.byLoc[l].total + " trovati" + (rep.byLoc[l].crit > 0 ? (" \u00B7 " + rep.byLoc[l].crit + " critici") : "")))) : null) : null);
}
function StorageGauge({ data }) {
const [est, setEst] = React.useState(null);
React.useEffect(() => {
let alive = true;
try {
if (navigator.storage && navigator.storage.estimate)
navigator.storage.estimate().then(r => { if (alive) setEst({ usage: r.usage || 0, quota: r.quota || 0 }); }, () => { });
} catch (e) { }
return () => { alive = false; };
}, []);
const ph = photoStats(data);
const fmt = (b) => { const mb = b / 1048576; if (mb >= 1024) return (mb / 1024).toFixed(2).replace(".", ",") + " GB"; return (mb >= 10 ? Math.round(mb) : mb.toFixed(1).replace(".", ",")) + " MB"; };
if (est && est.quota > 0) {
const pct = Math.max(1, Math.min(100, Math.round(est.usage / est.quota * 100)));
const col = pct >= 90 ? "#ef4444" : (pct >= 75 ? "#f59e0b" : "#22c55e");
return React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 } },
React.createElement("span", { style: { fontSize: 12.5, color: "var(--text)", fontWeight: 700 } }, fmt(est.usage), " usati"),
React.createElement("span", { style: { fontSize: 12.5, fontWeight: 800, color: col, fontFamily: "'IBM Plex Mono', monospace" } }, "su ", fmt(est.quota))),
React.createElement("div", { style: { height: 10, background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 6, overflow: "hidden" } },
React.createElement("div", { style: { width: pct + "%", height: "100%", background: col, transition: "width .3s" } })),
React.createElement("div", { style: { fontSize: 11.5, color: "var(--text-2)", marginTop: 9, lineHeight: 1.55 } },
__t("Archivio locale sul dispositivo (IndexedDB). I dati non sono pi\u00F9 limitati a 5 MB. Di cui foto: "),
React.createElement("b", { style: { color: "var(--text)" } }, fmt(ph.chars)),
ph.count > 0 ? " (" + ph.count + " foto)" : "",
"."),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 6, lineHeight: 1.5 } }, __t("Le foto pesano molto pi\u00F9 dei dati. C'\u00E8 ampio spazio, ma tieni comunque un backup recente (qui sotto): in modalit\u00E0 offline i dati vivono solo su questo dispositivo.")));
}
const u = storageUsage(true);
const pc = Math.min(100, u.pct);
const col = u.pct >= 85 ? "#ef4444" : (u.pct >= 70 ? "#f59e0b" : "#22c55e");
return React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 } },
React.createElement("span", { style: { fontSize: 12.5, color: "var(--text)", fontWeight: 700 } }, fmtMB(u.chars), " usati"),
React.createElement("span", { style: { fontSize: 12.5, fontWeight: 800, color: col, fontFamily: "'IBM Plex Mono', monospace" } }, u.pct, "%")),
React.createElement("div", { style: { height: 10, background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 6, overflow: "hidden" } },
React.createElement("div", { style: { width: pc + "%", height: "100%", background: col, transition: "width .3s" } })),
React.createElement("div", { style: { fontSize: 11.5, color: "var(--text-2)", marginTop: 9, lineHeight: 1.55 } },
__t("Stima dello spazio del sito su questo dispositivo. Di cui foto: "),
React.createElement("b", { style: { color: "var(--text)" } }, fmtMB(ph.chars)),
ph.count > 0 ? " (" + ph.count + " foto)" : "",
". I dati grandi vanno nell'archivio esteso del dispositivo (IndexedDB)."));
}
export function SettingsModal({ data, onReplaceJobs, company, onUpdateCompany, onImport, onMerge, onReset, onClose, onCloudPull, isAdmin, isSuperuser, onOpenCestino, onImportRfidScan }) {
const Section = SettingsSection;
const [comp, setComp] = React.useState(company);
const [showPerms, setShowPerms] = React.useState(false);
const s = k => e => setComp(x => (Object.assign(Object.assign({}, x), { [k]: e.target.value })));
const [cloudStatus, setCloudStatus] = React.useState("");
const [cloudBusy, setCloudBusy] = React.useState(false);
const doSyncUp = () => __awaiter(this, void 0, void 0, function* () {
setCloudBusy(true);
setCloudStatus("Sincronizzazione in corso (carico e unisco)…");
try {
const { merged, mergedTrash, results } = yield supabaseSyncMerge(data);
onCloudPull(merged, mergedTrash);
const tot = Object.values(results).reduce((a, b) => a + b, 0);
setCloudStatus("✓ Sincronizzato: " + tot + " record sul cloud (dati uniti, niente sovrascritture).");
}
catch (e) {
setCloudStatus("✗ " + e.message);
}
setCloudBusy(false);
});
const migRef = React.useRef();
const fileRefMigrate = e => {
var _a;
const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
if (!file) {
e.target.value = '';
return;
}
const reader = new FileReader();
reader.onload = (ev) => __awaiter(this, void 0, void 0, function* () {
try {
const imported = JSON.parse(ev.target.result);
const keys = ['assets', 'parts', 'jobs', 'customers', 'invoices', 'iecReports', 'funcReports', 'instruments', 'procedures', 'quotes', 'orders', 'withdrawals'];
const hasData = keys.some(k => Array.isArray(imported[k]));
if (!hasData) {
alert(__t('File backup non valido: nessun dato MedTrace riconosciuto.'));
e.target.value = '';
return;
}
setCloudBusy(true);
setCloudStatus("Migrazione dei dati sul cloud…");
onImport(imported);
const res = yield supabaseSyncUp(imported);
const tot = Object.values(res).reduce((a, b) => a + b, 0);
setCloudStatus("✓ Migrazione completata: " + tot + " record caricati sul cloud. Ora i dati sono salvati online.");
}
catch (err) {
setCloudStatus("✗ Migrazione fallita: " + ((err === null || err === void 0 ? void 0 : err.message) || 'errore'));
}
finally {
setCloudBusy(false);
e.target.value = '';
}
});
reader.onerror = () => { alert(__t('Impossibile leggere il file')); e.target.value = ''; };
reader.readAsText(file);
};
const doSyncDown = () => __awaiter(this, void 0, void 0, function* () {
setCloudBusy(true);
setCloudStatus("Sincronizzazione in corso (scarico e unisco)…");
try {
const { merged, mergedTrash, results } = yield supabaseSyncMerge(data);
onCloudPull(merged, mergedTrash);
const tot = Object.values(merged).reduce((a, arr) => a + ((arr === null || arr === void 0 ? void 0 : arr.length) || 0), 0);
setCloudStatus("✓ Sincronizzato: " + tot + " record in totale (dati uniti, niente perdite).");
}
catch (e) {
setCloudStatus("✗ " + e.message);
}
setCloudBusy(false);
});
const fileRef = e => {
var _a;
const input = e.target;
const file = (_a = input.files) === null || _a === void 0 ? void 0 : _a[0];
if (!file) {
input.value = '';
return;
}
const reader = new FileReader();
reader.onload = ev => {
try {
const imported = JSON.parse(ev.target.result);
const hasData = ['assets', 'parts', 'jobs', 'customers', 'invoices', 'iecReports', 'funcReports', 'instruments', 'procedures', 'quotes'].some(k => Array.isArray(imported[k]));
if (!hasData) {
alert(__t('File backup non valido: nessun dato MedTrace riconosciuto.'));
input.value = '';
return;
}
onImport(imported);
}
catch (err) {
alert('Errore lettura file: ' + ((err === null || err === void 0 ? void 0 : err.message) || 'JSON non valido'));
}
input.value = '';
};
reader.onerror = () => { alert(__t('Impossibile leggere il file')); input.value = ''; };
reader.readAsText(file);
};
const fileRefMerge = e => {
var _a;
const input = e.target;
const file = (_a = input.files) === null || _a === void 0 ? void 0 : _a[0];
if (!file) {
input.value = '';
return;
}
const reader = new FileReader();
reader.onload = ev => {
try {
const imported = JSON.parse(ev.target.result);
const hasData = ['assets', 'parts', 'jobs', 'customers', 'invoices', 'iecReports', 'funcReports', 'instruments', 'procedures', 'quotes'].some(k => Array.isArray(imported[k]));
if (!hasData) {
alert(__t('File backup non valido.'));
input.value = '';
return;
}
onMerge(imported);
}
catch (err) {
alert('Errore lettura file: ' + ((err === null || err === void 0 ? void 0 : err.message) || 'JSON non valido'));
}
input.value = '';
};
reader.onerror = () => { alert(__t('Impossibile leggere il file')); input.value = ''; };
reader.readAsText(file);
};
const isLogged = !(typeof DEMO_LOCKED !== "undefined" && DEMO_LOCKED) && (typeof getSupa === "function") && getSupa();
return (React.createElement(Modal, { title: __t("Impostazioni"), wide: true, onClose: onClose },
React.createElement("div", { style: { background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 } },
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--text)" } }, __t("Lingua dell'app")),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 2 } }, __t("Cambia lingua e ricarica l'app"))),
React.createElement("select", { value: getLang(), onChange: e => setLang(e.target.value), style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "9px 12px", fontSize: 13, fontWeight: 600 } },
React.createElement("option", { value: "it" }, __t("Italiano")),
React.createElement("option", { value: "en" }, __t("English")))),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
isAdmin && (React.createElement(Section, { icon: "\uD83C\uDFE2", title: __t("Dati azienda") },
isSuperuser && !comp.name && (React.createElement("div", { style: { background: "#f59e0b15", border: "1px solid #f59e0b44", borderRadius: 8, padding: "10px 13px", marginBottom: 14, fontSize: 12, color: "#f59e0b", lineHeight: 1.5 } }, __t("\u26A0 Inserisci il nome della tua azienda \u2014 apparir\u00E0 su tutti i PDF (rapporti, verifiche, preventivi)."))),
!isSuperuser && (React.createElement("div", { style: { background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "9px 13px", marginBottom: 14, fontSize: 11.5, color: "var(--text-3)", lineHeight: 1.5 } }, __t("I dati fiscali (ragione sociale, P.IVA, IBAN) sono modificabili solo dal Superuser. Puoi comunque gestire logo e preferenze qui sotto."))),
React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement(Inp, { label: __t("Nome / Ragione sociale"), value: comp.name, onChange: s("name"), disabled: !isSuperuser }),
React.createElement(Inp, { label: __t("Sottotitolo"), value: comp.subtitle, onChange: s("subtitle"), disabled: !isSuperuser }),
React.createElement(Span2, null,
React.createElement(Inp, { label: __t("Indirizzo"), value: comp.address, onChange: s("address"), disabled: !isSuperuser })),
React.createElement(Inp, { label: "P.IVA", value: comp.vat, onChange: s("vat"), disabled: !isSuperuser }),
React.createElement(Inp, { label: "IBAN", value: comp.iban, onChange: s("iban"), disabled: !isSuperuser }),
React.createElement(Span2, null,
React.createElement(Inp, { label: __t("Prefisso numerazione preventivi"), value: comp.invoicePrefix, onChange: s("invoicePrefix"), placeholder: "es. F", disabled: !isSuperuser }))),
React.createElement("div", { style: { marginTop: 14, paddingTop: 14, borderTop: "1px solid #24242F" } },
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 8 } }, __t("Logo aziendale (sui PDF)")),
React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" } },
comp.logo ? (React.createElement("img", { src: comp.logo, alt: "logo", style: { height: 48, maxWidth: 160, objectFit: "contain", background: "#fff", borderRadius: 6, padding: 6, border: "1px solid var(--border)" } })) : (React.createElement("div", { style: { height: 48, width: 120, borderRadius: 6, border: "1px dashed var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "var(--text-4)" } }, __t("Nessun logo"))),
isAdmin && (React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
React.createElement("label", null,
React.createElement("input", { type: "file", accept: "image/*", style: { display: "none" }, onChange: (e) => {
var _a;
const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
if (!file)
return;
const reader = new FileReader();
reader.onload = (ev) => {
const img = new Image();
img.onload = () => {
const maxW = 300;
const scale = Math.min(1, maxW / img.width);
const cv = document.createElement("canvas");
cv.width = img.width * scale;
cv.height = img.height * scale;
cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
const dataUrl = cv.toDataURL("image/png");
setComp(x => (Object.assign(Object.assign({}, x), { logo: dataUrl })));
};
img.src = ev.target.result;
};
reader.readAsDataURL(file);
} }),
React.createElement("span", { style: { background: "#2dd4bf15", color: "#2dd4bf", border: "1px solid #2dd4bf44", borderRadius: 9, padding: "9px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700, display: "inline-block" } }, comp.logo ? __t("Cambia logo") : __t("Carica logo"))),
comp.logo && (React.createElement("button", { onClick: () => setComp(x => (Object.assign(Object.assign({}, x), { logo: "" }))), style: { background: "#ef444415", color: "#ef4444", border: "1px solid #ef444433", borderRadius: 9, padding: "9px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700 } }, __t("Rimuovi")))))),
comp.logo && (React.createElement("div", { onClick: () => { if (isAdmin)
setComp(x => (Object.assign(Object.assign({}, x), { logoHasName: !x.logoHasName }))); }, style: { display: "flex", alignItems: "center", gap: 10, marginTop: 12, cursor: isAdmin ? "pointer" : "default", fontSize: 12.5, color: "var(--text-strong)" } },
React.createElement("div", { style: { width: 42, height: 25, borderRadius: 13, flexShrink: 0, background: comp.logoHasName ? "#2dd4bf" : "#3a4151", opacity: isAdmin ? 1 : 0.5, position: "relative", transition: "background .15s" } },
React.createElement("div", { style: { position: "absolute", top: 3, left: comp.logoHasName ? 20 : 3, width: 19, height: 19, borderRadius: "50%", background: "#fff", transition: "left .15s", boxShadow: "0 1px 3px rgba(0,0,0,.4)" } })),
__t("Il mio logo contiene gi\u00E0 il nome dell'azienda"))),
comp.logo && (React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 5, marginLeft: 26, lineHeight: 1.4 } }, comp.logoHasName ? __t("Sui PDF il nome non verrà ripetuto sotto il logo (mostriamo solo P.IVA e indirizzo).") : __t("Sui PDF mostriamo il nome azienda accanto ai dati.")))),
isAdmin && React.createElement("div", { style: { textAlign: "right", marginTop: 12 } },
React.createElement(Btn, { sm: true, onClick: () => __awaiter(this, void 0, void 0, function* () {
onUpdateCompany(comp);
const isOffline = (typeof OFFLINE_MODE !== "undefined" && OFFLINE_MODE);
const isDemo = (typeof DEMO_LOCKED !== "undefined" && DEMO_LOCKED);
if (!isOffline && !isDemo && typeof supabaseSaveCompany === "function") {
const ok = yield supabaseSaveCompany(comp);
alert(ok ? __t("Dati azienda salvati e condivisi con i colleghi.") : __t("Salvati in locale. (Sincronizzazione cloud non riuscita: riprova quando sei online.)"));
}
else {
alert(__t("Dati azienda salvati."));
}
}) }, __t("Salva dati azienda"))))),
React.createElement(Section, { icon: "\u2699\uFE0F", title: __t("Preferenze") },

React.createElement("div", { onClick: () => { const v = !comp.stickerPrompt; setComp(x => (Object.assign(Object.assign({}, x), { stickerPrompt: v }))); onUpdateCompany(Object.assign(Object.assign({}, company), { stickerPrompt: v })); }, style: { display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" } },
React.createElement("div", { style: {
width: 46, height: 27, borderRadius: 14, flexShrink: 0, marginTop: 1,
background: comp.stickerPrompt ? "#2dd4bf" : "#3a4151",
position: "relative", transition: "background .15s"
} },
React.createElement("div", { style: {
position: "absolute", top: 3, left: comp.stickerPrompt ? 22 : 3,
width: 21, height: 21, borderRadius: "50%", background: "#fff",
transition: "left .15s", boxShadow: "0 1px 3px rgba(0,0,0,.4)"
} })),
React.createElement("span", { style: { fontSize: 13, color: "var(--text)", lineHeight: 1.5 } },
__t("Chiedi di stampare lo sticker QR dopo ogni verifica"),
React.createElement("span", { style: { display: "block", fontSize: 11.5, color: "var(--text-3)", marginTop: 3 } }, __t("Se spento, la verifica viene salvata senza domande. Lo sticker resta sempre disponibile col pulsante \uD83C\uDFF7 nella lista delle verifiche."))))),
isSuperuser && (React.createElement(Section, { icon: "\uD83E\uDDD1\u200D\uD83D\uDD27", title: __t("Tecnici") },
React.createElement(TecniciManager, { technicians: comp.technicians || [], onChange: arr => { setComp(x => (Object.assign(Object.assign({}, x), { technicians: arr }))); onUpdateCompany(Object.assign(Object.assign({}, company), { technicians: arr })); const _off = (typeof OFFLINE_MODE !== "undefined" && OFFLINE_MODE); const _demo = (typeof DEMO_LOCKED !== "undefined" && DEMO_LOCKED); if (!_off && !_demo && typeof supabaseSaveTechnicians === "function") {
supabaseSaveTechnicians(arr);
} } }))),
React.createElement(Section, { icon: "\uD83D\uDDD1", title: __t("Cestino") },
React.createElement("div", { style: { fontSize: 11.5, color: "var(--text-2)", lineHeight: 1.55, marginBottom: 14 } }, __t("Gli elementi eliminati finiscono qui e puoi recuperarli. Si svuotano da soli dopo 90 giorni.")),
React.createElement("button", { onClick: () => { if (onOpenCestino)
onOpenCestino(); }, style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, background: "var(--card)", border: "1px solid var(--border-3)", borderRadius: 10, padding: "13px 16px", cursor: "pointer", color: "var(--text)", fontSize: 13.5, fontWeight: 700, textAlign: "left" } },
React.createElement("span", null, __t("Apri il cestino")),
React.createElement("span", { style: { color: "var(--text-3)" } }, "\u203A"))),
isSuperuser && (React.createElement(Section, { icon: "\uD83D\uDD10", title: __t("Ruoli e permessi") },
React.createElement("div", { style: { fontSize: 11.5, color: "var(--text-2)", lineHeight: 1.55, marginBottom: 14 } },
__t("Decidi quali sezioni pu\u00F2 vedere ogni ruolo. Il "),
React.createElement("strong", { style: { color: "#5eead4" } }, __t("Superuser")),
__t(" vede sempre tutto e pu\u00F2 gestire utenti e dati fiscali.")),
React.createElement("button", { onClick: () => setShowPerms(true), style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, background: "var(--card)", border: "1px solid var(--border-3)", borderRadius: 10, padding: "13px 16px", cursor: "pointer", color: "var(--text)", fontSize: 13.5, fontWeight: 700, textAlign: "left" } },
React.createElement("span", null, __t("Configura ruoli e permessi")),
React.createElement("span", { style: { color: "#5eead4", fontSize: 18 } }, "\u203A")))),
isLogged ? (React.createElement(Section, { icon: "\u2601\uFE0F", title: __t("Sincronizzazione cloud"), color: "#2dd4bf", accent: "#2dd4bf33" },
React.createElement("div", { style: { color: "var(--text-2)", fontSize: 12, lineHeight: 1.55, marginBottom: 14 } },
__t("I dati vengono "),
React.createElement("strong", { style: { color: "#5eead4" } }, "uniti"),
__t(" tra questo dispositivo e il cloud: niente viene sovrascritto o perso. Se tu e un collega lavorate su dispositivi diversi, le modifiche si combinano. In caso di modifica sullo stesso record, resta la versione pi\u00F9 recente.")),
React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } },
React.createElement(Btn, { disabled: cloudBusy, onClick: doSyncUp }, cloudBusy ? __t("Sincronizzo…") : __t("Sincronizza ora"))),
cloudStatus && (React.createElement("div", { style: { marginTop: 12, fontSize: 12, color: cloudStatus.startsWith("✗") ? "#ef4444" : "#2dd4bf", lineHeight: 1.5, background: (cloudStatus.startsWith("✗") ? "#ef444410" : "#2dd4bf10"), borderRadius: 8, padding: "9px 12px" } }, cloudStatus)))) : (React.createElement(Section, { icon: "\uD83D\uDCBE", title: __t("Dove sono i dati") },
React.createElement("div", { style: { color: "var(--text-2)", fontSize: 12, lineHeight: 1.55 } },
__t("Tutti i dati sono salvati "),
React.createElement("strong", { style: { color: "var(--text)" } }, "localmente su questo dispositivo"),
", anche offline. Esporta backup periodici qui sotto per sicurezza."))),
React.createElement(SubscriptionCard, null),

React.createElement(Section, { icon: "\uD83D\uDCBE", title: __t("Spazio dati locale") },
React.createElement(StorageGauge, { data: data }),
React.createElement(FotoCloudMigrator, { data: data, onReplaceJobs: onReplaceJobs })),
React.createElement(RfidImportSection, { onImportRfidScan: onImportRfidScan }),
React.createElement(Section, { icon: "\uD83D\uDCE6", title: __t("Backup & ripristino") },
React.createElement("div", { style: { color: "var(--text-3)", fontSize: 11.5, lineHeight: 1.5, marginBottom: 12 } }, __t("Salva una copia dei tuoi dati in un file, o importane una. Utile prima di operazioni importanti.")),
React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: () => downloadJSON("medtrace-backup-" + (new Date().toISOString().slice(0, 10)) + ".json", data) }, __t("Esporta backup"))),
React.createElement("div", { style: { marginTop: 14, padding: "13px 15px", background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 9 } },
React.createElement("div", { style: { fontSize: 12, color: "var(--text)", fontWeight: 700, marginBottom: 8 } }, __t("Importa un backup (sostituisce i dati attuali)")),
React.createElement("input", { type: "file", accept: "application/json,.json,text/plain,*/*", onChange: fileRef, style: { display: "block", width: "100%", fontSize: 13, color: "var(--text-strong)", background: "var(--card)", border: "1px solid var(--border-3)", borderRadius: 8, padding: "10px", boxSizing: "border-box", marginBottom: 14 } }),
React.createElement("div", { style: { fontSize: 12, color: "var(--text)", fontWeight: 700, marginBottom: 8 } }, __t("Unisci da file (aggiunge senza cancellare)")),
React.createElement("input", { type: "file", accept: "application/json,.json,text/plain,*/*", onChange: fileRefMerge, style: { display: "block", width: "100%", fontSize: 13, color: "var(--text-strong)", background: "var(--card)", border: "1px solid var(--border-3)", borderRadius: 8, padding: "10px", boxSizing: "border-box" } }))),
isLogged && (React.createElement(Section, { icon: "\uD83D\uDC64", title: __t("Account") },
React.createElement("button", { onClick: () => __awaiter(this, void 0, void 0, function* () { if (confirm(__t("Disconnettere l'account? Per rientrare servirà di nuovo il login e una connessione."))) {
try {
localStorage.removeItem("medtrace-auth-cache");
}
catch (e) { }
try {
yield supaSignOut();
}
catch (e) { }
window.location.reload();
} }), style: { background: "#ef444415", border: "1px solid #ef444433", borderRadius: 9, color: "#ef4444", padding: "9px 18px", cursor: "pointer", fontWeight: 700, fontSize: 13 } }, __t("Disconnetti account")))),
isSuperuser && (React.createElement(Section, { icon: "\u26A0\uFE0F", title: __t("Zona pericolo"), color: "#ef4444", accent: "#ef444433" },
React.createElement("div", { style: { color: "var(--text-3)", fontSize: 11.5, lineHeight: 1.5, marginBottom: 12 } }, __t("Cancella tutti i dati locali in modo permanente. Esporta un backup prima, se ti servono.")),
React.createElement(Btn, { variant: "danger", onClick: onReset }, __t("Reset completo dei dati")))),
React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", paddingTop: 4 } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, __t("Chiudi")))),
showPerms && (React.createElement(Modal, { title: "\uD83D\uDD10 Ruoli e permessi", wide: true, onClose: () => setShowPerms(false) },
React.createElement("div", { style: { maxHeight: "75vh", overflow: "auto" } },
React.createElement(PermissionMatrix, { value: comp.rolePermissions || DEFAULT_ROLE_PERMS, onChange: (next) => { setComp(x => (Object.assign(Object.assign({}, x), { rolePermissions: next }))); onUpdateCompany(Object.assign(Object.assign({}, company), { rolePermissions: next })); } }),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", lineHeight: 1.5, marginTop: 14 } }, __t("Le modifiche si salvano subito e valgono al prossimo accesso degli utenti. Il Superuser vede sempre tutte le sezioni.")),
React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", marginTop: 14 } },
React.createElement(Btn, { onClick: () => setShowPerms(false) }, __t("Fatto"))))))));
}
function SubscriptionCard() {
const nascosto = (typeof OFFLINE_MODE !== "undefined" && OFFLINE_MODE) || (typeof DEMO_LOCKED !== "undefined" && DEMO_LOCKED);
const [info, setInfo] = React.useState(null);
React.useEffect(() => { if (nascosto)
return; let vivo = true; fetchSubStatus().then(d => { if (vivo)
setInfo(d); }); return () => { vivo = false; }; }, []);
if (nascosto || !info)
return null;
const g = info.giorni_rimanenti;
const col = info.scaduto ? "#ef4444" : (info.valid_until != null && typeof g === "number" && g <= 30 ? "#f59e0b" : "#22c55e");
const label = info.valid_until == null
? "Licenza senza scadenza"
: (info.scaduto ? ("Scaduto il " + info.valid_until) : ("Attivo fino al " + info.valid_until + (typeof g === "number" ? " · " + g + " gg" : "")));
return (React.createElement("div", { style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 12, padding: "14px 16px", marginBottom: 14 } },
React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" } },
React.createElement("span", { style: { fontSize: 12.5, fontWeight: 800, color: "var(--text)" } },
"\uD83D\uDCC5 Licenza",
info.plan ? (" · " + info.plan.charAt(0).toUpperCase() + info.plan.slice(1)) : ""),
React.createElement("span", { style: { fontSize: 11.5, fontWeight: 700, color: col, background: col + "15", border: "1px solid " + col + "44", borderRadius: 7, padding: "4px 9px" } }, label))));
}
