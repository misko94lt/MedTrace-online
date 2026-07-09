/* Costanti UI e ruoli: colori stato/priorita, timeline, ruoli/permessi, stili form, categorie strumenti.
   Estratto verbatim da app.js, fase 1. */
export const STATUS_COLOR = { "operativo": "#22c55e", "in manutenzione": "#f59e0b", "fuori servizio": "#ef4444", "da accettare": "#818cf8", "aperto": "#2dd4bf", "in corso": "#f59e0b", "in attesa ricambi": "#f59e0b", "in attesa cliente": "#a855f7", "in attesa accesso": "#38bdf8", "chiuso": "#22c55e", "in attesa": "var(--text-2)", "confermato": "#2dd4bf", "spedito": "#a855f7", "ricevuto": "#22c55e", "annullato": "#ef4444", "emessa": "#2dd4bf", "pagata": "#22c55e", "scaduta": "#ef4444", "bozza": "var(--text-2)" };
export const PRI_COLOR = { "urgente": "#ef4444", "alta": "#f97316", "normale": "#6366f1", "bassa": "var(--text-2)" };
export const TIMELINE_ICON = { "diagnosi": "", "intervento": "", "ordine_parti": "", "attesa_parti": "·", "test": "✓", "sopralluogo": "·", "contatto": "", "nota": "·" };
export const TIMELINE_LABEL = { "diagnosi": "Diagnosi", "intervento": "Intervento", "ordine_parti": "Ordine parti", "attesa_parti": "Attesa parti", "test": "Test/Verifica", "sopralluogo": "Sopralluogo", "contatto": "Contatto cliente", "nota": "Nota generica" };
export const ROLES = [
{ id: "superuser", label: "Superuser", desc: "Proprietario: vede e fa tutto, gestisce utenti e dati fiscali" },
{ id: "admin", label: "Admin", desc: "Gestione operativa completa (no utenti, no dati fiscali)" },
{ id: "finance", label: "Finance", desc: "Parte economica: preventivi, fatture, job in lettura" },
{ id: "tecnico", label: "Tecnico", desc: "Campo: verifiche, job, apparecchi, magazzino" },
];
export const PERM_SECTIONS = [
{ id: "dashboard", label: "Dashboard" },
{ id: "kpi", label: "KPI & Statistiche" },
{ id: "jobs", label: "Job / Interventi" },
{ id: "richieste", label: "Richieste clienti" },
{ id: "iec", label: "Sicurezza Elettrica" },
{ id: "func", label: "Verif. Funzionale" },
{ id: "ppm", label: "Manut. Programmata" },
{ id: "agenda", label: "Pianificazione (agenda + scadenze)" },
{ id: "assets", label: "Apparecchi" },
{ id: "instruments", label: "Strumenti" },
{ id: "customers", label: "Clienti" },
{ id: "parts", label: "Magazzino" },
{ id: "invoices", label: "Preventivi" },
{ id: "procedures", label: "Aiuto & Procedure (guida inclusa)" },
{ id: "recalls", label: "Avvisi di sicurezza" },
];
export const DEFAULT_ROLE_PERMS = {
superuser: PERM_SECTIONS.map(s => s.id),
admin: ["dashboard", "kpi", "jobs", "richieste", "iec", "func", "ppm", "agenda", "scadenze", "assets", "instruments", "customers", "parts", "invoices", "procedures", "help", "recalls"],
finance: ["dashboard", "kpi", "jobs", "assets", "customers", "invoices", "procedures", "help", "recalls"],
tecnico: ["dashboard", "kpi", "jobs", "richieste", "iec", "func", "ppm", "agenda", "scadenze", "assets", "instruments", "customers", "parts", "procedures", "help", "recalls"],
};
export const FORM_INP = { width: "100%", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 9, padding: "11px 13px", color: "var(--text)", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color .15s" };
export const FORM_LBL = { fontSize: 10, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: .7, fontWeight: 700, display: "block", marginBottom: 6 };
export const FORM_FLD = { display: "flex", flexDirection: "column", marginBottom: 0 };
export const FORM_ROW = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 14 };
export const FORM_COL = { display: "flex", flexDirection: "column", minWidth: 0 };
export const FORM_SECTION = { fontSize: 11, color: "#2dd4bf", fontWeight: 800, marginBottom: 12, marginTop: 4, textTransform: "uppercase", letterSpacing: .8, display: "flex", alignItems: "center", gap: 6 };
export const FORM_BTN_PRIMARY = { background: "#2dd4bf", color: "#06251f", border: "none", borderRadius: 9, padding: "11px 22px", cursor: "pointer", fontWeight: 800, fontSize: 14, boxShadow: "none" };
export const FORM_BTN_GHOST = { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 9, color: "var(--text-2)", padding: "11px 20px", cursor: "pointer", fontWeight: 700, fontSize: 14 };
export const CATEGORIES = ['Tester IEC/Sicurezza elettrica', 'Multimetro', 'Oscilloscopio',
'Analizzatore defibrillatori', 'Analizzatore infusionali', 'Simulatore paziente',
'Misuratore pressione', 'Termometro di riferimento', 'Calibratore', 'Altro'];

/* — footer standard dei form (spostato col taglio apparecchi, v3.00) — */
export const FORM_FOOTER = { display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 16, marginTop: 16, borderTop: "1px solid var(--border-2)" };

/* — colori stato preventivi (spostati col taglio fatturazione, v3.02) — */
export const QUOTE_STATUS_COLOR = {
'bozza': 'var(--text-3)',
'inviato': '#3b82f6',
'accettato': '#22c55e',
'rifiutato': '#ef4444',
'scaduto': '#f59e0b',
};
