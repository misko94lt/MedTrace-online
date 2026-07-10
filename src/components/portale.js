import { FORM_INP, FORM_LBL } from "../constants/ui.js";
/* MedTrace — portale clienti: richieste e pubblicazione (estratti da app.js, v3.06) */
import { Modal, EmptyState, Badge, appConfirm } from "./ui.js";
import { Btn } from "./shared.js";
import { fmtDateTimeIt } from "../lib/util.js";
import { DEMO_LOCKED, OFFLINE_MODE, supaDB, getSupabaseClient } from "../lib/sync.js";
import { __awaiter } from "../lib/tslib.js";
export function PortaleClienteBox({ customer, isSuperuser }) {
const nascosto = (typeof OFFLINE_MODE !== "undefined" && OFFLINE_MODE) || (typeof DEMO_LOCKED !== "undefined" && DEMO_LOCKED);
const [stato, setStato] = React.useState(null);
const [busy, setBusy] = React.useState(false);
const [msg, setMsg] = React.useState("");
React.useEffect(() => {
if (nascosto || !customer || !customer.id)
return;
let vivo = true;
(() => __awaiter(this, void 0, void 0, function* () {
try {
const c = yield getSupabaseClient();
if (!c) {
if (vivo)
setStato("no_cloud");
return;
}
const { data, error } = yield c.rpc("stato_portale_cliente", { p_customer_id: customer.id });
if (!vivo)
return;
if (error || typeof data !== "string" || data.indexOf("ERRORE") === 0) {
setStato("errore");
return;
}
setStato(data);
}
catch (e) {
if (vivo)
setStato("errore");
}
}))();
return () => { vivo = false; };
}, [customer && customer.id]);
if (nascosto || !customer || !customer.id || stato === "no_cloud")
return null;
const email = (customer.email || "").trim();
const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const abilita = () => __awaiter(this, void 0, void 0, function* () {
setMsg("");
if (!emailOk) {
setMsg("⚠ Inserisci prima l'email del cliente nel campo qui sopra (è obbligatoria per il portale), poi salva la scheda.");
return;
}
setBusy(true);
try {
const c = yield getSupabaseClient();
const { data, error } = yield c.rpc("abilita_portale", { p_customer_id: customer.id, p_email: email });
if (error || typeof data !== "string" || data !== "OK") {
setMsg("✗ " + ((data && String(data)) || (error && error.message) || "Operazione non riuscita"));
}
else {
setStato("invitato");
setMsg("✓ Invito creato: il cliente entra nel portale con " + email + " (link di accesso via email). Ricorda di salvare la scheda se hai appena scritto l'email.");
}
}
catch (e) {
setMsg("✗ Errore di rete: riprova online.");
}
setBusy(false);
});
const revoca = () => {
appConfirm("Revocare l'accesso al portale per questo cliente? Non vedrà più i suoi apparecchi finché non lo riabiliti.", () => __awaiter(this, void 0, void 0, function* () {
setBusy(true);
setMsg("");
try {
const c = yield getSupabaseClient();
const { data, error } = yield c.rpc("revoca_portale", { p_customer_id: customer.id });
if (error || data !== "OK") {
setMsg("✗ " + ((data && String(data)) || (error && error.message) || "Revoca non riuscita"));
}
else {
setStato("non_abilitato");
setMsg("Accesso revocato.");
}
}
catch (e) {
setMsg("✗ Errore di rete: riprova online.");
}
setBusy(false);
}), "danger");
};
const BADGE = {
non_abilitato: { t: "Non abilitato", c: "var(--text-2)", bg: "#94a3b815" },
invitato: { t: "\uD83D\uDD11 Invitato — in attesa del primo accesso", c: "#f59e0b", bg: "#f59e0b15" },
attivo: { t: "✓ Attivo — il cliente accede al portale", c: "#22c55e", bg: "#22c55e15" },
errore: { t: "Stato non disponibile", c: "var(--text-2)", bg: "#94a3b815" },
};
const b = BADGE[stato] || { t: "Verifico…", c: "var(--text-3)", bg: "#64748b15" };
return (React.createElement("div", { style: { border: "1px solid var(--border-2)", borderRadius: 10, padding: "13px 15px", background: "var(--bg)" } },
React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" } },
React.createElement("div", { style: { fontSize: 12.5, fontWeight: 800, color: "var(--text)" } }, "\uD83D\uDD11 Portale cliente"),
React.createElement("span", { style: { fontSize: 11.5, fontWeight: 700, color: b.c, background: b.bg, border: "1px solid " + b.c + "44", borderRadius: 7, padding: "4px 9px" } }, b.t)),
isSuperuser ? (React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 11, flexWrap: "wrap" } },
stato === "non_abilitato" && React.createElement(Btn, { sm: true, disabled: busy, onClick: abilita }, busy ? "Abilito…" : "\uD83D\uDD11 Abilita portale"),
stato === "invitato" && (React.createElement(React.Fragment, null,
React.createElement(Btn, { sm: true, disabled: busy, onClick: abilita }, busy ? "…" : "↻ Rigenera invito"),
React.createElement(Btn, { sm: true, variant: "ghost", disabled: busy, onClick: revoca }, "Revoca"))),
stato === "attivo" && React.createElement(Btn, { sm: true, variant: "ghost", disabled: busy, onClick: revoca }, busy ? "…" : "Revoca accesso"))) : (React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 9 } }, "Solo il superuser pu\u00F2 abilitare o revocare l'accesso al portale.")),
msg && React.createElement("div", { style: { fontSize: 11.5, color: msg.indexOf("✗") === 0 || msg.indexOf("⚠") === 0 ? "#f59e0b" : "#2dd4bf", marginTop: 9, lineHeight: 1.5 } }, msg),
isSuperuser && stato === "non_abilitato" && (React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 8, lineHeight: 1.5 } }, "User\u00E0 l'email dell'anagrafica qui sopra. Il cliente entrer\u00E0 nel portale con quella email (link di accesso): al primo ingresso viene collegato automaticamente."))));
}
export function RichiestePage({ richieste, assets, customers, onConvert, onRefresh, online }) {
const [busyId, setBusyId] = React.useState(null);
const [filter, setFilter] = React.useState("attive");
const [netOff, setNetOff] = React.useState(typeof navigator !== "undefined" && navigator.onLine === false);
React.useEffect(() => { const on = () => setNetOff(false), off = () => setNetOff(true); window.addEventListener("online", on); window.addEventListener("offline", off); return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); }; }, []);
const assetLabel = (aid) => { const a = (assets || []).find(x => x.id === aid); return a ? (a.name + (a.serial ? (" · S/N " + a.serial) : "")) : "Apparecchio non trovato"; };
const custLabel = (cid) => { const c = (customers || []).find(x => x.id === cid); return c ? c.name : ""; };
const URGC = { normale: "var(--text-2)", urgente: "#f59e0b", fermo_macchina: "#ef4444" };
const URGL = { normale: "Normale", urgente: "Urgente", fermo_macchina: "Fermo macchina" };
const STL = { nuova: "Nuova", presa_in_carico: "Presa in carico", convertita: "Convertita", chiusa: "Chiusa" };
const STC = { nuova: "#2dd4bf", presa_in_carico: "#f59e0b", convertita: "#22c55e", chiusa: "var(--text-3)" };
const fmt = (iso) => { if (!iso)
return "—"; try {
return new Date(iso).toLocaleString("it-IT", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
catch (e) {
return iso;
} };
let rows = (richieste || []).filter(r => filter === "tutte" ? true : (r.status === "nuova" || r.status === "presa_in_carico"));
rows = rows.slice().sort((a, b) => ((a.status === "nuova" ? 0 : 1) - (b.status === "nuova" ? 0 : 1)) || (new Date(b.created_at) - new Date(a.created_at)));
const doConvert = (r) => __awaiter(this, void 0, void 0, function* () { setBusyId(r.id); try {
yield onConvert(r);
}
finally {
setBusyId(null);
} });
const setStatus = (r, status) => __awaiter(this, void 0, void 0, function* () { setBusyId(r.id); try {
yield supaDB.update("richieste", r.id, { status });
}
catch (e) { } yield onRefresh(); setBusyId(null); });
const doDelete = (r) => { appConfirm("Eliminare definitivamente questa richiesta? L'azione non è reversibile.", () => __awaiter(this, void 0, void 0, function* () { setBusyId(r.id); try {
yield supaDB.delete("richieste", r.id);
}
catch (e) { } yield onRefresh(); setBusyId(null); }), "danger"); };
return (React.createElement("div", { style: { maxWidth: 780, margin: "0 auto" } },
netOff && (React.createElement("div", { style: { marginBottom: 12, padding: "10px 13px", background: "var(--warn-bg)", border: "1px solid #f59e0b44", borderRadius: 9, color: "#fbbf24", fontSize: 12, lineHeight: 1.5 } }, "\uD83D\uDCF4 Sei offline: le richieste vivono sul cloud, quindi l'elenco potrebbe non essere aggiornato e le azioni richiedono connessione.")),
React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, gap: 10, flexWrap: "wrap" } },
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 20, fontWeight: 900, color: "var(--text)" } }, "Richieste clienti"),
React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)", marginTop: 2 } }, "Richieste di intervento arrivate dal portale")),
React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center" } },
React.createElement("div", { style: { display: "flex", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 9, overflow: "hidden" } }, [{ v: "attive", l: "Da gestire" }, { v: "tutte", l: "Tutte" }].map(o => (React.createElement("button", { key: o.v, onClick: () => setFilter(o.v), style: { background: filter === o.v ? "#2dd4bf22" : "transparent", color: filter === o.v ? "#2dd4bf" : "var(--text-2)", border: "none", padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, o.l)))),
React.createElement("button", { onClick: onRefresh, title: "Aggiorna", style: { background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-2)", borderRadius: 9, padding: "8px 13px", fontSize: 14, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u21BB"))),
!online && React.createElement("div", { style: { padding: "12px 14px", background: "#f59e0b18", border: "1px solid #f59e0b55", borderRadius: 10, color: "#f59e0b", fontSize: 12, marginBottom: 14 } }, "Le richieste arrivano dal cloud: serve la connessione e l'accesso."),
rows.length === 0 ? (React.createElement("div", { style: { padding: "30px 20px", textAlign: "center", color: "var(--text-3)", fontSize: 13, background: "var(--bg-2)", border: "1px dashed var(--border-2)", borderRadius: 12 } }, filter === "attive" ? "Nessuna richiesta da gestire." : "Nessuna richiesta.")) : (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } }, rows.map(r => {
const busy = busyId === r.id;
const done = r.status === "convertita" || r.status === "chiusa";
return (React.createElement("div", { key: r.id, style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderLeft: "3px solid " + (STC[r.status] || "var(--text-3)"), borderRadius: 12, padding: "14px 16px" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6, flexWrap: "wrap" } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { fontSize: 15, fontWeight: 800, color: "var(--text)" } }, assetLabel(r.asset_id)),
custLabel(r.customer_id) && React.createElement("div", { style: { fontSize: 12, color: "var(--text-2)", marginTop: 2 } },
"\uD83C\uDFE2 ",
custLabel(r.customer_id))),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement("span", { style: { background: (URGC[r.urgency] || "var(--text-2)") + "22", color: URGC[r.urgency] || "var(--text-2)", border: "1px solid " + (URGC[r.urgency] || "var(--text-2)") + "55", borderRadius: 6, padding: "3px 8px", fontSize: 10, fontWeight: 700 } }, URGL[r.urgency] || r.urgency),
React.createElement("span", { style: { background: (STC[r.status] || "var(--text-3)") + "22", color: STC[r.status] || "var(--text-3)", border: "1px solid " + (STC[r.status] || "var(--text-3)") + "55", borderRadius: 6, padding: "3px 8px", fontSize: 10, fontWeight: 700 } }, STL[r.status] || r.status))),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginBottom: 8 } }, fmt(r.created_at)),
r.description && React.createElement("div", { style: { fontSize: 13, color: "var(--text)", lineHeight: 1.5, marginBottom: 10, whiteSpace: "pre-wrap" } }, r.description),
r.photo && React.createElement("img", { src: r.photo, alt: "", style: { maxWidth: "100%", maxHeight: 240, borderRadius: 8, border: "1px solid var(--border-2)", marginBottom: 10, display: "block" } }),
r.contact && React.createElement("div", { style: { fontSize: 12, color: "var(--text-2)", marginBottom: 10 } },
"\uD83D\uDCDE ",
r.contact),
React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
!done && React.createElement("button", { disabled: busy, onClick: () => doConvert(r), style: { background: busy ? "var(--border)" : "#2dd4bf", color: busy ? "var(--text-3)" : "var(--bg-deep)", border: "none", borderRadius: 8, padding: "9px 14px", fontSize: 13, fontWeight: 800, cursor: busy ? "default" : "pointer", touchAction: "manipulation" } }, busy ? "…" : "✓ Accetta e crea job"),
r.status === "nuova" && React.createElement("button", { disabled: busy, onClick: () => setStatus(r, "presa_in_carico"), style: { background: "transparent", color: "#f59e0b", border: "1px solid #f59e0b55", borderRadius: 8, padding: "9px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "Presa in carico"),
!done && React.createElement("button", { disabled: busy, onClick: () => setStatus(r, "chiusa"), style: { background: "transparent", color: "var(--text-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "Ignora"),
React.createElement("button", { disabled: busy, onClick: () => doDelete(r), style: { background: "transparent", color: "#ef4444", border: "1px solid #ef444455", borderRadius: 8, padding: "9px 14px", fontSize: 13, fontWeight: 700, cursor: busy ? "default" : "pointer", touchAction: "manipulation" } }, "\uD83D\uDDD1 Elimina"))));
})))));
}
