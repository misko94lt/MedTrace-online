/* MedTrace — cuore dell'app: AppMain, App, modali di servizio, guida, testi legali (trasloco finale da app.js, v3.07) */
import { FUNC_TEMPLATES } from "../constants/funcTemplates.js";
import { CND_TO_TPL, CND_CAT } from "../constants/cnd.js";
import { STATUS_COLOR, PRI_COLOR, TIMELINE_ICON, TIMELINE_LABEL, ROLES, PERM_SECTIONS, DEFAULT_ROLE_PERMS, FORM_INP, FORM_LBL, FORM_FLD, FORM_ROW, FORM_COL, FORM_SECTION, FORM_BTN_PRIMARY, FORM_BTN_GHOST, CATEGORIES } from "../constants/ui.js";
import { __awaiter, __rest } from "../lib/tslib.js";
import { downloadXLSX, downloadJSON, openPrintWindow, mtEnsurePdfLibs, mtRenderReportPdfBlob, showPDFPreview } from "../lib/export.js";
import { mtStartBulk, PDF_STYLE, generateIECPDF, generateFuncPDF, setInstrumentsRegistry } from "../lib/reports.js";
import { TecnicoPicker, TecniciManager, chkRow, Btn, fileToAttachment, AttachmentsList } from "./shared.js";
import { OFFLINE_MODE, STORAGE_KEY, getSupa, getSupabaseClient, getSupabaseConfig, idbGet, idbSet, loadData, mirrorToIdb, saveData, storageUsage, supabaseDeleteById, supabaseGetCompany, supabaseGetRole, supabasePushOne, supabaseSaveCompany, supabaseSaveTechnicians, supabaseSyncMerge, supabaseSyncUp, upsertInList, setBootData, setBootDone, getBootDone } from "../lib/sync.js";
import { startWedge, stopWedge, isWardTag, WARD_TAG_BRAND } from "../lib/rfid.js";
import { RfidAssocPicker } from "./rfid.js";
import { FuncVerifyForm, FuncWizardForm, IECReportForm, IecWizardForm } from "./verifiche.js";
import { SignaturePad, TechSignatureField } from "./ui.js";
import { techSignature } from "./shared.js";
import { fetchSubStatus, subScaduto } from "../lib/sync.js";
import { SettingsModal } from "./settings.js";
import { LoginScreen } from "./login.js";
import { PortaleClienteBox, RichiestePage } from "./portale.js";
import { supaDB } from "../lib/sync.js";
import { parseRfidScan } from "../lib/rfid.js";
import { InstrumentsPage, RecallsPage, TemplateEditor } from "./strumenti.js";
import { FilterDropdown, MobileSearch, SwipeableCard } from "./ui.js";
import { JobDetailModal, JobForm } from "./jobs.js";
import { IVA_DEFAULT, InvoiceForm, QuotesPage } from "./fatturazione.js";
import { generateJobPDF } from "../lib/reports.js";
import { AssetDetailModal, AssetForm, ICON_ACTIVITY, ICON_ZAP, ImportAssetsModal, StickerModal, TimelineModal, WithdrawalModal } from "./assets.js";
import { assetHasOpenRecall, assetOpenRecall, customerPrefix, fmtDateTimeIt, genUUID, jobShortCode, jobTipoLabel, nextAssetCode, uploadPhotoToCloud, withCreateMeta, withUpdateMeta } from "../lib/util.js";
import { Badge, _ic } from "./ui.js";
import { FORM_FOOTER } from "../constants/ui.js";
import { DEMO_LOCKED } from "../lib/sync.js";
import { AgendaPage, KpiPage, PianoManuale, ScadenzaEmailModal, ScadenzePage } from "./dashboard.js";
import { PPM_CHECKLISTS_DEFAULT, PPM_CHECKLIST_KEY, PpmPage, PpmVerifyForm, PpmWizardForm, loadPpmChecklists } from "./ppm.js";
import { generatePPMPDF } from "../lib/reports.js";
import { EmptyState } from "./ui.js";
import { AssetCombobox, ErrorSummary } from "./ui.js";
import { getNextReportNumber, iecGetMeasures } from "../lib/reports.js";
import { cndToTemplate, guessTemplate } from "../constants/funcTemplates.js";
import { AlertChip, AreaTrend, BarChart, ConfirmDialog, Donut, ExcelTable, Grid, Hint, Inp, KpiCard, Modal, PromptDialog, Sel, Span2, Txt, appConfirm, appPromptCb, useMedia, ICON_MONITOR, ICON_TOOL, ICON_BUILDING } from "./ui.js";
import { generateInvoicePDF, generateClientReportPDF } from "../lib/reports.js";
import { bootLoadData } from "../lib/sync.js";

const useState=React.useState,useEffect=React.useEffect,useMemo=React.useMemo,useCallback=React.useCallback,useRef=React.useRef,useContext=React.useContext;
const supaGetUser = () => { var _a; return (_a = getSupa()) === null || _a === void 0 ? void 0 : _a.auth.getUser(); };
const supaOnAuth = (cb) => { var _a; return (_a = getSupa()) === null || _a === void 0 ? void 0 : _a.auth.onAuthStateChange(cb); };
const APP_VERSION = "3.20";
class MTErrorBoundary extends React.Component {
constructor(props) { super(props); this.state = { err: null }; }
static getDerivedStateFromError(err) { return { err: err }; }
componentDidCatch(err, info) { try { console.error("MedTrace error:", err, info); } catch (e) {} }
render() {
if (this.state.err) {
var msg = (this.state.err && (this.state.err.message || this.state.err.toString())) || "Errore sconosciuto";
var stack = (this.state.err && this.state.err.stack) ? String(this.state.err.stack).split("\n").slice(0, 5).join("\n") : "";
return React.createElement("div", { style: { minHeight: "100vh", background: "var(--bg)", color: "var(--text)", padding: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center", fontFamily: "system-ui, sans-serif" } },
React.createElement("div", { style: { fontSize: 17, fontWeight: 800, color: "#f87171" } }, "Si \u00e8 verificato un errore"),
React.createElement("div", { style: { fontSize: 12, color: "var(--text-2)" } }, "Copia questo messaggio e mandalo allo sviluppatore:"),
React.createElement("div", { style: { fontSize: 13, color: "#fca5a5", maxWidth: 540, wordBreak: "break-word", fontFamily: "'IBM Plex Mono', monospace", background: "var(--err-bg)", border: "1px solid #f8717155", borderRadius: 8, padding: "10px 12px" } }, msg),
stack ? React.createElement("pre", { style: { fontSize: 10, color: "var(--text-3)", maxWidth: 540, overflow: "auto", textAlign: "left", whiteSpace: "pre-wrap", background: "var(--bg-deep)", border: "1px solid var(--border-2)", borderRadius: 6, padding: 10 } }, stack) : null,
React.createElement("button", { onClick: () => this.setState({ err: null }), style: { background: "#2dd4bf", color: "#06251f", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 800, cursor: "pointer" } }, "Chiudi e riprova"),
React.createElement("button", { onClick: () => window.location.reload(), style: { background: "transparent", color: "var(--text-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 18px", cursor: "pointer" } }, "Ricarica app"));
}
return this.props.children;
}
}
function ensureAssetCodes(assets, customers) {
const custName = id => {
const c = (customers || []).find(x => x.id === id);
return c ? c.name : null;
};
const ordered = [...(assets || [])].sort((a, b) => String(a.createdAt || "").localeCompare(String(b.createdAt || "")));
let result = [...(assets || [])];
for (const a of ordered) {
if (a.assetCode)
continue;
const prefix = customerPrefix(custName(a.customerId));
const code = nextAssetCode(prefix, result);
result = result.map(x => x.id === a.id ? Object.assign(Object.assign({}, x), { assetCode: code }) : x);
}
return result;
}
function removeFromList(list, id) {
return list.filter(x => x.id !== id);
}
const SUPABASE_ENABLED = () => {
const c = getSupabaseConfig();
return !!(c.url && c.anonKey);
};
const CUSTOM_TPL_KEY = "medtrace-custom-templates";
function loadCustomTemplates() {
try {
const r = localStorage.getItem(CUSTOM_TPL_KEY);
return r ? JSON.parse(r) : {};
}
catch (e) {
return {};
}
}
function saveCustomTemplates(tpls) {
try {
localStorage.setItem(CUSTOM_TPL_KEY, JSON.stringify(tpls));
return true;
}
catch (e) {
return false;
}
}
function getAllTemplates(custom) {
const merged = Object.assign({}, FUNC_TEMPLATES);
const c = custom || {};
for (const k in c) {
merged[k] = Object.assign(Object.assign({}, c[k]), { isCustom: true });
}
if (typeof DEMO_LOCKED !== "undefined" && DEMO_LOCKED) { delete merged.bbraun_infusomat_space_tsc; }
return merged;
}
function savePpmChecklists(data) {
try { localStorage.setItem(PPM_CHECKLIST_KEY, JSON.stringify(data)); return true; } catch (e) { return false; }
}
const HELP_SECTIONS = [
{
icon: "◈", title: "Dashboard", color: "#2dd4bf",
steps: [
"Quando apri l'app vedi 5 pillole con i numeri principali: apparecchi totali, job aperti, verifiche di sicurezza elettrica, verifiche funzionali, clienti. Clicca una pillola per andare alla sezione.",
"Sotto le pillole c'è la sezione 'DA FARE' con tutte le cose da prendere in carico: job urgenti, manutenzioni scadute, scadenze entro 7 giorni, parti sotto scorta. Ogni voce è cliccabile e ti porta dritto al filtro giusto.",
"Più in basso 'CRITICO' mostra le emergenze (job urgenti aperti + manutenzioni scadute), e 'PROSSIMI 30 GIORNI' è il calendario delle manutenzioni imminenti ordinate per data.",
"La riga finale è il riepilogo discreto: operativi, in manutenzione, fuori servizio, garanzie in scadenza, preventivi aperti — tutto cliccabile."
]
},
{
icon: "›", title: "Apparecchi (Parco Macchine)", color: "#2dd4bf",
steps: [
"Premi '+ Nuovo' in alto a destra per aggiungere un apparecchio. Compila: nome, marca, modello, S/N, cliente, ubicazione, classe di rischio, norma IEC, classe elettrica (I/II/III), tipo parte applicata (B/BF/CF), date acquisto/garanzia/prossimo servizio.",
"Mobile: tocca una card per aprire la scheda dettaglio. I 4 pulsanti in basso sono: Sicur. (verifica sicurezza elettrica), Funz. (verifica funzionale), Mod. (modifica), (sposta nel cestino, da cui puoi ripristinare).",
"CODICE IN EVIDENZA: ogni apparecchio mostra in grande il suo codice leggibile (es. COO-001) e il numero di serie — così riconosci subito QUALE macchina è, non solo il tipo. Il tipo (es. 'Sollevamalati') è l'informazione secondaria.",
"VISTA SCHEDE / TABELLA (mobile e tablet): in alto trovi l'interruttore '▤ Tabella / ▦ Schede'. La Tabella è una vista tipo Excel con filtri sotto ogni colonna, ordinamento toccando l'intestazione, ricerca e export — comoda per filtrare al volo senza il pannello filtri. La scelta resta memorizzata.",
"Sopra le card hai anche la ricerca testuale e il pulsante 'Filtri' per filtrare per marca, modello, ubicazione, stato, cliente o classe di rischio.",
"GESTO MOBILE: swipe a sinistra su una card per spostarla nel cestino (con conferma).",
"Desktop: doppio clic su una riga per aprire la scheda dettaglio. La tabella ha filtri colonna e ricerca globale.",
"INTERVALLI VERIFICA: ogni apparecchio ha due intervalli indipendenti (in mesi): uno per la Sicurezza Elettrica e uno per la Funzionale. Servono perché spesso hanno periodicità diverse (es. elettrica ogni 12 mesi, funzionale ogni 24 da manuale). Da questi l'app calcola le prossime scadenze e la data sullo sticker. Default 12 mesi entrambi.",
"STORICO: nella scheda apparecchio la tab 'Storico' mostra tutto ciò che è successo alla macchina (verifiche di sicurezza, funzionali e job) in un'unica linea temporale, dal più recente. Utile quando sei davanti all'apparecchio per capirne la storia a colpo d'occhio.",
"VISTA COMPATTA: nelle liste mobile (apparecchi e verifiche) il pulsante '≣ Vista compatta / ▤ Vista estesa' alterna righe dense (più elementi a schermo) e schede ampie."
]
},
{
icon: "›", title: "Scansione RFID", color: "#2dd4bf",
steps: [
"A cosa serve: fai il giro di un reparto, scansioni in blocco i tag RFID degli apparecchi presenti e aggiorni in automatico la loro ultima posizione. La voce 'RFID' è nel gruppo APPARECCHIATURE.",
"Come si usa: 1) scegli il REPARTO dal menu a tendina (es. Cardiologia); 2) attiva 'Ascolto lettore' e spara col grilletto (il lettore Bluetooth in modalit\u00e0 tastiera/HID digita gli EPC da solo), oppure incolla gli EPC o usa 'Simula scansione' senza hardware, poi premi 'Scansiona'; 3) compare la lista degli apparecchi TROVATI, con le verifiche scadute o in scadenza evidenziate in rosso/ambra; 4) i tag SCONOSCIUTI si associano al volo: tocca l'EPC e scegli l'apparecchio, oppure segnalo come TAG-REPARTO: attaccalo alla porta e da quel momento scansionarlo imposterà il reparto da solo; 5) sotto i trovati compaiono i NON TROVATI: risultavano nel reparto e non sono stati letti.",
"Posizione automatica: appena scansioni con un reparto selezionato, agli apparecchi trovati viene aggiornata l'ULTIMA POSIZIONE (last location) al reparto corrente. L'ubicazione assegnata dell'apparecchio NON cambia: cambia solo dove è stato visto l'ultima volta. Se sbagli reparto, ri-scansiona in quello giusto e si corregge da solo.",
"Dalla lista alla verifica: tocca un apparecchio trovato per aprire la sua scheda con storico e verifiche, ed esegui subito la verifica di sicurezza elettrica o funzionale se è in ritardo.",
"EPC sconosciuti: i tag letti che non corrispondono a nessun apparecchio compaiono in un elenco a parte: puoi associarli dalla scheda apparecchio (campo EPC).",
"Reparti scansionati: in fondo vedi il riepilogo dei reparti con quanti apparecchi sono stati rilevati e quando. È un dato calcolato, non occupa spazio aggiuntivo. La colonna 'Ultima posizione' è inclusa anche nell'export Excel degli apparecchi.",
"Uso del lettore vicino ad apparecchi accesi: il lettore RFID emette onde radio. Per prudenza non scansionare a distanza molto ravvicinata (entro circa 30 cm) da apparecchi salvavita in funzione sul paziente (ventilatori, pompe di infusione, monitor in terapia intensiva), perché in letteratura sono documentate possibili interferenze. Scansionare apparecchi spenti, in magazzino o non collegati al paziente è a basso rischio."
]
},
{
icon: "›", title: "Job / Interventi", color: "#f59e0b",
steps: [
"Un Job è qualsiasi intervento su un apparecchio: correttivo, preventivo, taratura, ecc. Crealo con '+ Nuovo' oppure dalla scheda apparecchio.",
"Sopra la lista hai 3 tab: APERTI (default, mostra solo job non chiusi), TUTTI, CHIUSI. Ogni tab ha un contatore live.",
"TIMELINE INTERVENTI: dentro il job, sezione 'Timeline interventi' con pulsante '+ Nuovo passaggio'. Per ogni passaggio scegli tipo (sopralluogo, attesa preventivo, attesa parti, riparazione, test, consegna, chiamata, email, altro), data, ora, durata in minuti, tecnico e descrizione. Il tempo totale lavorato si calcola automaticamente.",
"Aggiungi le parti usate dal magazzino — costo manodopera (ore × tariffa) + parti calcolato in tempo reale. C'è anche il campo VIAGGIO/TRASFERTA (€) da includere nel preventivo.",
"SCARICO MAGAZZINO AUTOMATICO: quando porti un job a 'chiuso', le parti usate vengono scaricate automaticamente dalla giacenza. Se riapri il job, le parti rientrano. (Se modifichi le quantità mentre il job è già chiuso, riapri e richiudi per ricalcolare.)",
"CREA PREVENTIVO DAL JOB: nella scheda dettaglio del job c'è il pulsante 'Crea preventivo' che apre un preventivo nuovo già compilato con manodopera, viaggio e parti di quel job. Utile per le correttive.",
"Esempio uso timeline: 'Lunedì 30min sopralluogo' → 'Martedì 0min attesa preventivo' → 'Giovedì 90min riparazione' → 'Giovedì 15min test funzionale' → 'Giovedì 10min consegna'. Tutto questo appare nel PDF del job."
]
},
{
icon: "›", title: "Verifiche di Sicurezza Elettrica", color: "#a855f7",
steps: [
"Apri da menu 'Sicurezza Elettrica' oppure dalla scheda apparecchio (pulsante Sicur.).",
"Normative supportate: IEC 62353:2014 (test periodico elettromedicali) e IEC 61010-1 (strumenti laboratorio).",
"STATO VERIFICA — nuovo: in cima al form ci sono due pulsanti: 'Verifica completata' oppure 'Apparecchio non disponibile'. Se l'apparecchio è in uso, non si trova o il reparto non autorizza, scegli 'Non disponibile' e compili motivo + reparto + referente + 2 firme. Il sistema genera un report di mancata esecuzione invece della verifica.",
"Classe apparecchio: I (con PE), II (doppio isolamento, no PE), III (SELV, alimentazione interna).",
"Tipo parte applicata: B (contatto corpo, no PA isolata), BF (parte isolata, PA ≤5000µA alt.), CF (cardiaco, PA ≤50µA).",
"Limiti IEC 62353:2014: Equipment Leakage Cl.I ≤500µA (diretto/differenziale) / ≤1000µA (alternativo); Cl.II ≤100µA / ≤500µA. Applied Part Leakage BF ≤5000µA, CF ≤50µA. PE Resistance ≤0.3Ω. Resistenza isolamento ≥2 MΩ.",
"Tre metodi di misura selezionabili: DIRETTO (apparecchio alimentato, misura corrente da PE verso terra — adatto a stanze standard), DIFFERENZIALE (somma vettoriale L-N — adatto a circuiti con isolamento o trasformatore), ALTERNATIVO (apparecchio scollegato, simula corrente di guasto — adatto a sale operatorie con RCD/sistema IT). Il metodo si sceglie in base alla configurazione della stanza, NON del costruttore.",
"N° rapporto auto-generato (es. VSE-2026-001) — puoi modificarlo manualmente se serve. Poi data, tecnico, e lo STRUMENTO di misura: una TENDINA elenca gli strumenti che hai registrato (selezionandone uno si compila in automatico anche il N° calibrazione); in alternativa puoi scriverlo a mano.",
"CORRETTIVA AUTOMATICA: se la verifica viene eseguita e risulta NON CONFORME, l'app crea da sola un job di manutenzione correttiva aperto (priorità alta) collegato all'apparecchio, così resta in lista da sistemare. La verifica di chiusura la rifarai a mano dopo l'intervento.",
"Ispezione visiva: per ogni voce OK / NO / N/D. Poi inserisci i valori misurati nelle caselle — PASS/FAIL si calcola automaticamente. Se un valore è fuori limite la casella diventa rossa e compare un avviso con il limite specifico (es. 'limite ≤ 500 µA'), così te ne accorgi subito.",
"FIRMA DIGITALE: in fondo al form ci sono due aree firma. Usa la S-Pen del Galaxy o il dito per firmare. È sensibile alla pressione — premi più forte per linea più spessa.",
"Tipo: 'periodica' (aggiorna la prossima scadenza secondo l'intervallo dell'apparecchio) oppure 'straordinaria' (non aggiorna la pianificazione).",
"Il PDF include intestazione con nome azienda, dati apparecchio, dati cliente, ispezione visiva, tabella misure con limiti/valori/esito, e DOPPIA FIRMA (tecnico + referente reparto) come immagini scansionate."
]
},
{
icon: "›", title: "Verifiche Funzionali", color: "#1F7468",
steps: [
"Apri dalla scheda apparecchio (pulsante Funz.) oppure dal menu 'Verifiche Funzionali'.",
"N° rapporto auto-generato (es. VF-2026-001) — modificabile se serve.",
"Il template viene auto-rilevato dal nome dell'apparecchio. Template disponibili: Pulsossimetro, Defibrillatore manuale, DAE, Aspiratore chirurgico, Elettrobisturi, Monitor multiparametrico, Ventilatore polmonare, Pompa infusionale, Ecografo, Letto elettrico, Generico.",
"Sicurezza Elettrica e Funzionale sono INDIPENDENTI. Ogni apparecchio può richiedere solo Sicurezza Elettrica, solo Funzionale, entrambe o nessuna — scegli tu di volta in volta quale eseguire dai pulsanti dedicati.",
"Per ogni sezione: OK / NO / N/A (non applicabile) / — (non testato). Inserisci i valori numerici delle misure dove richiesti.",
"Anche qui hai lo stato 'Apparecchio non disponibile', la TENDINA per scegliere lo strumento tra quelli registrati, e le DUE FIRME DIGITALI (tecnico + referente reparto).",
"L'esito CONFORME/NON CONFORME/NON ESEGUITA si aggiorna man mano che compili. Se eseguita e NON CONFORME, viene creato automaticamente un job correttivo aperto collegato all'apparecchio.",
"Il PDF segue lo stesso formato della sicurezza elettrica, con le sezioni specifiche del template scelto.",
"TEMPLATE PERSONALIZZATI: col pulsante 'Template' puoi creare i tuoi modelli di verifica (es. EN 60601-2-14, EN 62745) con sezioni, controlli sì/no e misure numeriche con limiti. Appaiono nel menu con una .",
"STICKER QR (opzionale): puoi stampare uno sticker adesivo con QR e data della prossima scadenza da applicare sull'apparecchio. Di default NON viene chiesto al salvataggio (molti tecnici usano etichette scritte a mano); per fartelo proporre dopo ogni verifica attiva l'interruttore in Impostazioni → Preferenze. Lo trovi sempre col pulsante nelle liste. Da scansionare con qualsiasi telefono; con il cloud attivo il QR apre il report online."
]
},
{
icon: "›", title: "Magazzino, Ordini, Scarichi", color: "#a855f7",
steps: [
"Stock Parti: ogni parte ha codice, nome, marca, ubicazione, quantità attuale, quantità minima, prezzo acquisto, prezzo vendita.",
"Il bordo della card mobile è colorato: verde (stock OK), giallo (sotto soglia minima), rosso (esaurita).",
"Filtri mobile: pulsante 'Filtri' per filtrare per marca o ubicazione.",
"Pulsante 'Scarica' sulla card mobile apre il modulo scarico veloce: collega la parte a un apparecchio e registra l'uscita.",
"Ordini Fornitori: crea ordine → al ricevimento clicca 'Ricevuto' per aggiornare automaticamente lo stock (entrata).",
"SCARICO AUTOMATICO: quando un job collegato viene CHIUSO, le parti che ha usato escono automaticamente dalla giacenza (uscita). Riaprendo il job rientrano.",
"Scarichi: storico di tutte le uscite con apparecchio, data, quantità.",
"LOTTI A PREZZI DIVERSI: se ricevi lo stesso ricambio in lotti a costo diverso (es. 2 pezzi a 5€ lo scorso anno, 2 a 6€ quest'anno) e vuoi distinguerli, per ora crea due voci separate (es. 'Filtro X — lotto 2024' e 'Filtro X — lotto 2025')."
]
},
{
icon: "›", title: "Preventivi", color: "#2dd4bf",
steps: [
"Crea un preventivo con '+ Nuovo'. Il form è SNELLO: in cima solo l'essenziale (cliente + data + righe + totale). Numero, stato, scadenza, modalità di pagamento e note sono raccolti in 'Altri dettagli', una sezione richiudibile che apri solo se ti serve.",
"Ogni voce: descrizione, quantità, prezzo unitario, aliquota IVA. Totali calcolati in tempo reale.",
"SERVIZIO IN BLOCCO (contratti): nel riquadro 'Aggiungi servizio in blocco' scrivi un servizio (ci sono suggerimenti: verifica elettrica, funzionale, manutenzione…), il numero di macchine e il prezzo a macchina, e con '+ Aggiungi' crei una riga sola tipo 'Verifica di sicurezza elettrica (× 30 macchine)'. Comodo per i contratti su tante macchine, senza doverle scegliere una per una.",
"DA UN JOB: puoi importare le righe da un job chiuso del cliente, oppure partire direttamente dal job (pulsante 'Crea preventivo' nella scheda del job), che porta manodopera, viaggio e parti.",
"Stati: bozza → emessa → pagata → scaduta → annullato. Filtri per stato o cliente.",
"Pulsante PDF genera il preventivo A4 con intestazione azienda, dati cliente, tabella voci, imponibile/IVA/totale, IBAN per pagamento.",
"NOTA: l'app gestisce i PREVENTIVI (le fatture vere si emettono col tuo gestionale fiscale)."
]
},
{
icon: "›", title: "Cestino", color: "#5eead4",
steps: [
"Quando elimini qualcosa (apparecchio, job, verifica, cliente, ricambio, preventivo, procedura) non sparisce per sempre: viene SPOSTATO nel cestino.",
"Apri il cestino da Impostazioni → Cestino. Vedi gli elementi raggruppati per tipo con la data di cancellazione.",
"Per ogni elemento puoi RIPRISTINARLO (torna nelle liste) oppure ELIMINARLO definitivamente (con doppia conferma, non più recuperabile).",
"Gli elementi nel cestino si svuotano automaticamente dopo 90 giorni.",
"Nella versione online il cestino è condiviso e sincronizzato: se un collega cestina qualcosa lo vedi anche tu, e gli elementi cestinati non riappaiono dopo una sincronizzazione."
]
},
{
icon: "›", title: "Strumenti di Misura", color: "#2dd4bf",
steps: [
"Registra i tuoi analizzatori/simulatori/multimetri: marca, modello, n° serie, codice interno, certificato calibrazione, data e scadenza calibrazione.",
"Stato calibrazione: verde (valida), giallo (in scadenza <30gg), rosso (scaduta).",
"Quando esegui una verifica (sicurezza elettrica o funzionale) scegli lo strumento usato da una TENDINA con questi strumenti registrati — garantisce la rintracciabilità. Sulla sicurezza elettrica, selezionarlo compila in automatico anche il N° calibrazione."
]
},
{
icon: "›", title: "Procedure / Knowledge Base", color: "#2dd4bf",
steps: [
"Repository delle tue procedure di test, riparazione e manutenzione stile iFixit.",
"Ogni procedura ha categoria, descrizione, lista passi numerati con descrizione + valore atteso + foto.",
"Crea le procedure standard una volta sola, poi le usi come check-list quando lavori."
]
},
{
icon: "›", title: "Agenda & Pianificazione Annuale", color: "#f59e0b",
steps: [
"Agenda: vista unificata di tutte le attività future (manutenzioni programmate, job aperti, verifiche).",
"Pianificazione Annuale: tutti gli apparecchi con prossimo servizio nell'anno selezionato, raggruppati per mese.",
"Si popola automaticamente quando salvi una verifica completata, usando gli intervalli dell'apparecchio (vedi sotto).",
"Esporta in Excel (.xlsx) per avere il piano annuale pronto da gestire."
]
},
{
icon: "›", title: "Gesti Mobile e PWA", color: "#2dd4bf",
steps: [
"L'app è installabile come PWA: su Chrome Android tocca menu ⋮ → 'Installa app'. Su iPhone Safari → Condividi → 'Aggiungi a schermata Home'.",
"Una volta installata funziona offline e si comporta come un'app nativa.",
"Gesto: swipe a sinistra su una card per eliminarla (con conferma).",
"Tasto BACK Android: chiude prima il modal aperto, poi il menu, poi torna alla Dashboard, poi esce dall'app."
]
},
{
icon: "›", title: "Impostazioni Azienda", color: "var(--text-3)",
steps: [
"Apri Impostazioni dal pulsante in alto a destra (mobile) o in fondo alla sidebar (desktop).",
"Le impostazioni sono divise in card chiare: Dati azienda, Sincronizzazione cloud, Backup, Account, Zona pericolo.",
"Compila Nome azienda, Sottotitolo, Indirizzo, P.IVA, IBAN, prefisso preventivi — questi dati appaiono in TUTTI i PDF generati.",
"IMPORTANTE: se il campo 'Nome azienda' è vuoto, i PDF mostreranno 'Documento' come placeholder."
]
},
{
icon: "›", title: "Backup, Importazione, Reset", color: "var(--text-3)",
steps: [
"Impostazioni → 'Esporta backup' scarica direttamente un file .json con tutti i tuoi dati (apparecchi, job, parti, clienti, preventivi, verifiche, strumenti, procedure).",
"Importa backup: seleziona il file .json salvato — sostituisce TUTTI i dati attuali.",
"Unisci backup: aggiunge i dati del file ai tuoi senza sostituirli (utile per importare un altro archivio).",
"Reset totale: cancella tutti i dati. Triplice conferma con parola 'CANCELLA' da digitare per sicurezza.",
"I dati sono salvati sul dispositivo. Fai backup regolari — se svuoti la cache i dati spariscono (a meno che tu non usi il cloud)."
]
},
{
icon: "›", title: "Account e Sincronizzazione Cloud", color: "#2dd4bf",
steps: [
"Se usi la versione online, all'avvio devi fare il LOGIN con email e password. Una volta entrato, la sessione resta valida anche offline sul tuo dispositivo — puoi lavorare sul campo senza connessione.",
"SINCRONIZZAZIONE: in Impostazioni → Sincronizzazione cloud. 'Carica su cloud' invia i dati locali al server; 'Scarica da cloud' li recupera sul dispositivo. Non serve inserire URL o chiavi: è già tutto configurato.",
"Lavori offline-first: i dati restano sempre sul dispositivo e sono immediati. Sincronizzi col cloud quando hai rete, quando vuoi.",
"La sincronizzazione UNISCE i dati (non sovrascrive): sui conflitti vince la versione modificata più di recente, e niente va perso. Anche le eliminazioni si propagano correttamente (chi cestini finisce nel cestino anche per i colleghi, senza riapparire).",
"DISCONNETTI: in Impostazioni → Account. Dopo il logout serve di nuovo il login (con connessione) per rientrare."
]
},
{
icon: "›", title: "Report parco macchine (per cliente)", color: "#2dd4bf",
steps: [
"Nella pagina Clienti, il pulsante genera un report completo del parco macchine di quel cliente.",
"Si apre prima un'anteprima a schermo con statistiche (apparecchi, operativi, fuori servizio, verifiche scadute) e l'elenco di tutti gli apparecchi ordinati per scadenza.",
"Dal pulsante 'Scarica PDF' ottieni il documento professionale da stampare o inviare al cliente."
]
},
{
icon: "›", title: "Filtri e Ricerca", color: "#2dd4bf",
steps: [
"Ogni lista mobile ha sopra una BARRA DI RICERCA testuale con contatore X/Y a destra.",
"Sotto la ricerca trovi il pulsante ' Filtri': cliccalo per espandere il pannello con tutti i filtri disponibili per quella sezione (marca, modello, stato, cliente, ecc.).",
"NEGLI APPARECCHI puoi anche passare alla vista TABELLA (interruttore '▤ Tabella' in alto): lì filtri direttamente sotto ogni colonna, tipo Excel, senza aprire il pannello — comodo quando vuoi restare nel flusso.",
"Il badge color teal accanto al pulsante Filtri mostra quanti filtri sono attivi.",
"Ricerca e filtri si combinano: vedi solo gli elementi che soddisfano TUTTI i criteri.",
"Pulsante 'Pulisci tutti i filtri' in fondo al pannello per resettare."
]
},
{
icon: "›", title: "Ruoli e permessi", color: "#5eead4",
steps: [
"L'app prevede quattro ruoli: Superuser, Admin, Finance, Tecnico. Ogni ruolo vede solo le sezioni che gli competono.",
"SUPERUSER: vede e fa tutto. È l'unico che può gestire i ruoli/permessi degli altri e modificare i dati fiscali dell'azienda (ragione sociale, P.IVA, IBAN).",
"ADMIN: gestione operativa completa (apparecchi, verifiche, job, clienti, magazzino, preventivi). Non può cambiare i permessi degli altri né i dati fiscali.",
"FINANCE: parte economica — preventivi e fatture, più i job in lettura per fatturare ore e ricambi. Se lavori a contratto (canone che include tutte le macchine) puoi togliergli i job dalla matrice.",
"TECNICO: il campo — verifiche di sicurezza elettrica e funzionali, job, apparecchi, agenda, magazzino, procedure. Vede i clienti in lettura.",
"MATRICE PERMESSI: il Superuser, da Impostazioni → 'Ruoli e permessi', può spuntare esattamente quali sezioni vede ogni ruolo. La configurazione è flessibile e si adatta a come è organizzata la tua azienda.",
"Nelle versioni offline e demo sei sempre Superuser (uso personale). I ruoli distinti hanno effetto pieno nella versione online con login, dove ogni persona ha il proprio account."
]
},
{
icon: "›", title: "Privacy, dati e note legali", color: "#2dd4bf",
steps: [
"DOVE STANNO I DATI: nella versione offline i dati restano solo su questo dispositivo (memoria del browser), non vengono inviati da nessuna parte. Nella versione online i dati sono salvati anche sul cloud (Supabase) per la sincronizzazione tra dispositivi e tra colleghi della stessa organizzazione.",
"DATI DI TERZI: l'app può contenere dati di clienti e referenti (nomi, strutture, contatti). Sei tu il titolare del trattamento di questi dati: trattali secondo il GDPR (base giuridica, conservazione limitata, diritto di accesso/cancellazione su richiesta).",
"BACKUP: da Impostazioni puoi esportare un backup completo dei dati e reimportarlo. Fai backup regolari, soprattutto in modalità offline dove i dati vivono solo sul dispositivo.",
"CESTINO: gli elementi eliminati finiscono nel cestino (Impostazioni → Cestino), da cui puoi ripristinarli o eliminarli definitivamente; si svuotano da soli dopo 90 giorni.",
"CANCELLAZIONE TOTALE: puoi azzerare tutti i dati locali da Impostazioni → Zona pericolo. In modalità online la rimozione dal cloud dipende dalla configurazione della tua organizzazione.",
"COPYRIGHT: il software, il codice, la grafica e i template sono protetti dal diritto d'autore e concessi in licenza d'uso, non in proprietà. I testi completi di Privacy e Termini d'uso/licenza (con la sezione copyright e segnalazioni) sono richiamabili dai due pulsanti qui sotto.",
"NOTA: MedTrace è uno strumento di supporto gestionale. Non sostituisce le valutazioni del tecnico qualificato né le responsabilità di legge. I valori e i limiti normativi vanno sempre verificati sulle norme vigenti e sui manuali dei costruttori."
]
}
];
const PRIVACY_TEXT = `Ultimo aggiornamento: giugno 2026
Questa informativa spiega in modo semplice come MedTrace tratta i dati. Non costituisce consulenza legale: per un uso professionale (soprattutto se offri il software a clienti) è necessario farla rivedere da un consulente privacy e predisporre un accordo sul trattamento dei dati (DPA) con ciascun cliente.
1. CHI TRATTA I DATI
MedTrace è uno strumento gestionale che usi tu (o la tua azienda). Sei tu il titolare del trattamento dei dati che inserisci, inclusi i dati di clienti, referenti e apparecchiature.
2. QUALI DATI
• Dati delle apparecchiature (marca, modello, matricola, ubicazione, scadenze).
• Dati dei clienti e dei referenti (denominazione, indirizzo, contatti, nominativi).
• Dati delle verifiche di sicurezza elettrica e funzionali e degli interventi (misure, esiti, firme, note).
• Dati aziendali tuoi (ragione sociale, P.IVA, IBAN, logo) usati per i documenti.
3. DOVE SONO CONSERVATI
• Versione offline: i dati restano esclusivamente su questo dispositivo, nella memoria locale del browser. Non vengono trasmessi a server esterni.
• Versione online: oltre al dispositivo, i dati sono salvati su un servizio cloud (Supabase, con infrastruttura nell'Unione Europea) per consentire login, sincronizzazione tra dispositivi e condivisione tra i membri della stessa organizzazione.
4. FINALITÀ
I dati sono trattati solo per il funzionamento del gestionale: registrare apparecchiature e verifiche, produrre documenti (rapporti, preventivi), pianificare le scadenze e, nella versione online, sincronizzare il lavoro del team.
5. CONSERVAZIONE E CESTINO
I dati restano finché li mantieni nell'app. Quando elimini un elemento finisce nel Cestino, da cui puoi ripristinarlo o eliminarlo definitivamente; gli elementi nel cestino si svuotano automaticamente dopo 90 giorni. Puoi inoltre esportare, modificare o cancellare i dati in qualsiasi momento dalle Impostazioni. Conserva i dati personali solo per il tempo necessario alle tue finalità e agli obblighi di legge.
6. DIRITTI DEGLI INTERESSATI (GDPR)
Le persone i cui dati sono registrati (es. referenti dei clienti) hanno diritto di accesso, rettifica, cancellazione e limitazione. In quanto titolare, sei tu a dare seguito a queste richieste. MedTrace ti fornisce gli strumenti per esportare e cancellare i dati.
7. SICUREZZA
Nella versione online l'accesso è protetto da autenticazione e i dati di ogni organizzazione sono separati. Mantieni riservate le credenziali. Nella versione offline la sicurezza dipende dalla protezione del tuo dispositivo: fai backup regolari.
8. CONDIVISIONE E RESPONSABILI
MedTrace non vende né cede i tuoi dati a terzi. Nella versione online il fornitore dell'infrastruttura cloud (Supabase) agisce come responsabile del trattamento per la sola conservazione tecnica. Se distribuisci l'app a clienti, dovrai indicare i sub-responsabili e firmare un DPA con ciascun cliente.
Per domande su questa informativa, contatta chi gestisce la tua installazione di MedTrace.`;
const TERMS_TEXT = `Ultimo aggiornamento: giugno 2026
Questi termini regolano l'uso di MedTrace. Non costituiscono consulenza legale: per un uso professionale è consigliabile farli rivedere da un legale.
1. OGGETTO
MedTrace è un'applicazione gestionale per la manutenzione e le verifiche (di sicurezza elettrica e funzionali) di apparecchiature elettromedicali e di laboratorio. È uno strumento di supporto al lavoro del tecnico e NON è un dispositivo medico ai sensi del Regolamento (UE) 2017/745.
2. USO CORRETTO
Ti impegni a usare l'app in modo lecito, inserendo dati di cui hai titolo a disporre e nel rispetto delle norme applicabili (incluse quelle su privacy e dispositivi medici).
3. RESPONSABILITÀ TECNICA
MedTrace non sostituisce il giudizio del tecnico qualificato. I valori di misura, i limiti normativi e gli esiti delle verifiche (sia di sicurezza elettrica sia funzionali) devono sempre essere verificati sulle norme vigenti (es. IEC 62353, IEC 60601, IEC 61010) e sui manuali dei costruttori. L'esito calcolato dall'app è un ausilio, non una certificazione.
4. NESSUNA GARANZIA
L'app è fornita "così com'è", senza garanzie di assenza di errori o di idoneità a uno scopo specifico. Pur con la massima cura, non si garantisce che i calcoli automatici siano privi di imprecisioni: la verifica finale spetta all'utente.
5. LIMITAZIONE DI RESPONSABILITÀ
Nei limiti di legge, chi fornisce MedTrace non è responsabile per danni derivanti dall'uso o dal mancato funzionamento dell'app, inclusa la perdita di dati. Fai backup regolari dei tuoi dati.
6. DATI E BACKUP
Sei responsabile della conservazione e del backup dei tuoi dati. Nella versione offline i dati risiedono solo sul tuo dispositivo: la loro perdita (guasto, cancellazione, cambio dispositivo) è a tuo carico se non hai un backup.
7. PROPRIETÀ INTELLETTUALE E COPYRIGHT
I dati che inserisci restano tuoi. Il software MedTrace, il suo codice sorgente, la grafica, i testi e i template di verifica sono opera dell'ingegno protetta dal diritto d'autore (L. 633/1941 e Direttiva UE 2001/29/CE) e restano di proprietà esclusiva di chi lo ha sviluppato. L'uso ti è concesso in licenza, non in proprietà, per le sole finalità gestionali previste. Non sono consentiti, senza autorizzazione scritta: copia, redistribuzione, rivendita, decompilazione, reverse engineering o creazione di opere derivate, salvo i diritti inderogabili di legge.
8. SEGNALAZIONI COPYRIGHT (DMCA / EU)
Se ritieni che un contenuto presente nel software violi un tuo diritto d'autore, puoi inviare una segnalazione a chi gestisce MedTrace indicando: (a) l'opera protetta che ritieni violata; (b) il contenuto contestato e dove si trova; (c) i tuoi recapiti; (d) una dichiarazione di buona fede; (e) la tua firma. Verificheremo e, se la segnalazione è fondata, rimuoveremo o disabiliteremo il contenuto. Questa procedura richiama il meccanismo "notice and takedown" del DMCA statunitense e si applica, per quanto compatibile, anche nel quadro europeo; la procedura non sostituisce eventuali rimedi di legge.
9. CONTENUTI DI TERZI
Sei responsabile dei contenuti che carichi (loghi, nomi, dati dei clienti): devi avere titolo a usarli. Non caricare materiale protetto da copyright altrui senza diritto.
10. MODIFICHE
Le funzionalità dell'app possono evolvere nel tempo. Questi termini possono essere aggiornati: la versione corrente è quella mostrata qui.
11. LEGGE APPLICABILE
Salvo diverso accordo, si applica la legge italiana.
Usando MedTrace accetti questi termini.`;
function HelpTab({ helpOpen, setHelpOpen }) {
const [legal, setLegal] = React.useState(null);
return (React.createElement("div", { style: { maxWidth: 860, margin: "0 auto" } },
React.createElement("div", { style: { marginBottom: 24 } },
React.createElement("h1", { style: { margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "var(--text-bright)" } }, "Guida all'uso"),
React.createElement("p", { style: { color: "var(--text-3)", margin: 0, fontSize: 13 } }, "Tutorial completo per usare MedTrace \u2014 clicca una sezione per espanderla")),
HELP_SECTIONS.map((section, si) => {
const isOpen = helpOpen[si] !== false && (helpOpen[si] === true || si === 0);
return (React.createElement("div", { key: si, style: { marginBottom: 10, background: "var(--surface)", border: "1px solid var(--border-4)", borderRadius: 12, overflow: "hidden" } },
React.createElement("button", { onClick: () => setHelpOpen(o => (Object.assign(Object.assign({}, o), { [si]: !isOpen }))), style: { width: "100%", background: "none", border: "none", padding: "14px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, textAlign: "left" } },
React.createElement("span", { style: { fontSize: 20 } }, section.icon),
React.createElement("span", { style: { flex: 1, fontSize: 14, fontWeight: 700, color: "var(--text-bright)" } }, section.title),
React.createElement("span", { style: { color: "var(--text-3)", fontSize: 16, transition: "transform .2s", transform: isOpen ? "rotate(180deg)" : "none" } }, "\u25BE")),
isOpen && (React.createElement("div", { style: { padding: "0 18px 16px 18px", borderTop: "1px solid var(--border-4)" } },
React.createElement("ol", { style: { margin: "12px 0 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 } }, section.steps.map((step, i) => (React.createElement("li", { key: i, style: { fontSize: 13, color: "var(--text-2)", lineHeight: 1.6, paddingLeft: 4 } },
React.createElement("span", { style: { color: "var(--text-bright)" } }, step)))))))));
}),
React.createElement("div", { style: { marginTop: 20, background: "#1F746818", border: "1px solid #1F746844", borderRadius: 10, padding: "14px 18px" } },
React.createElement("div", { style: { fontWeight: 700, color: "#2dd4bf", marginBottom: 6, fontSize: 13 } }, "Nota"),
React.createElement("p", { style: { color: "var(--text-2)", fontSize: 12, margin: 0, lineHeight: 1.7 } },
"Per ogni apparecchio il flusso ideale \u00E8: ",
React.createElement("strong", { style: { color: "var(--text-bright)" } }, "1. Crea apparecchio"),
" \u2192 ",
React.createElement("strong", { style: { color: "var(--text-bright)" } }, "2. Esegui Verifica di Sicurezza Elettrica"),
" \u2192 ",
React.createElement("strong", { style: { color: "var(--text-bright)" } }, "3. Esegui Verifica Funzionale"),
" \u2192 il sistema crea automaticamente i job e pianifica le prossime scadenze in base agli intervalli dell'apparecchio.")),
React.createElement("div", { style: { marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" } },
React.createElement("button", { onClick: () => setLegal("privacy"), style: { flex: 1, minWidth: 150, background: "var(--surface)", border: "1px solid var(--border-4)", borderRadius: 10, padding: "12px 16px", cursor: "pointer", color: "var(--text)", fontSize: 13, fontWeight: 700, textAlign: "left" } },
"Informativa Privacy",
React.createElement("span", { style: { display: "block", fontSize: 11, color: "var(--text-3)", marginTop: 3, fontWeight: 400 } }, "Come vengono trattati i dati")),
React.createElement("button", { onClick: () => setLegal("terms"), style: { flex: 1, minWidth: 150, background: "var(--surface)", border: "1px solid var(--border-4)", borderRadius: 10, padding: "12px 16px", cursor: "pointer", color: "var(--text)", fontSize: 13, fontWeight: 700, textAlign: "left" } },
"Termini d'uso e licenza",
React.createElement("span", { style: { display: "block", fontSize: 11, color: "var(--text-3)", marginTop: 3, fontWeight: 400 } }, "Condizioni e responsabilit\u00E0"))),
legal && (React.createElement(Modal, { title: legal === "privacy" ? "Informativa sulla Privacy" : "Termini d'uso e licenza", onClose: () => setLegal(null) },
React.createElement("div", { style: { fontSize: 13, color: "var(--text-2)", lineHeight: 1.7, whiteSpace: "pre-line", maxHeight: "70vh", overflow: "auto" } }, legal === "privacy" ? PRIVACY_TEXT : TERMS_TEXT)))));
}
const FieldError = ({ error }) => {
if (!error)
return null;
return (React.createElement("div", { style: {
fontSize: 11,
color: "#ef4444",
marginTop: 4,
display: "flex",
alignItems: "center",
gap: 4,
lineHeight: 1.3
} },
React.createElement("span", { style: { fontSize: 10 } }, "\u26A0"),
React.createElement("span", null, error)));
};
const Spinner = ({ size = 18, color = "#2dd4bf" }) => (React.createElement("span", { style: {
display: "inline-block",
width: size,
height: size,
border: `2px solid ${color}33`,
borderTopColor: color,
borderRadius: "50%",
animation: "mtSpin .7s linear infinite",
verticalAlign: "middle"
} }));
const LoadingOverlay = ({ message = "Caricamento…" }) => (React.createElement("div", { style: {
position: "fixed",
inset: 0,
background: "rgba(10,10,14,0.75)",
backdropFilter: "blur(2px)",
zIndex: 5000,
display: "flex",
flexDirection: "column",
alignItems: "center",
justifyContent: "center",
gap: 16
} },
React.createElement(Spinner, { size: 40 }),
React.createElement("div", { style: { color: "var(--text)", fontSize: 14, fontWeight: 600 } }, message)));
const Pill = ({ label, value, color, sub, onClick }) => {
const c = color || "#2dd4bf";
const clickable = !!onClick;
return (React.createElement("div", { onClick: onClick, style: {
background: "linear-gradient(135deg, var(--card) 0%, var(--bg-2) 100%)",
border: "1px solid var(--border-4)",
borderLeft: "3px solid " + c,
borderRadius: 10,
padding: "13px 16px",
flex: 1,
minWidth: 120,
boxShadow: "0 2px 10px #0007, inset 0 1px 0 #ffffff05",
position: "relative",
overflow: "hidden",
cursor: clickable ? "pointer" : "default",
transition: "transform .15s ease, border-color .15s ease, box-shadow .15s ease",
WebkitTapHighlightColor: "transparent",
touchAction: "manipulation",
}, onMouseEnter: clickable ? (e) => { e.currentTarget.style.borderColor = c + "66"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 14px #0009, 0 0 0 1px " + c + "22, inset 0 1px 0 #ffffff08"; } : undefined, onMouseLeave: clickable ? (e) => { e.currentTarget.style.borderColor = "var(--border-4)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 10px #0007, inset 0 1px 0 #ffffff05"; } : undefined },
React.createElement("div", { style: {
position: "absolute", top: 0, right: 0, width: 60, height: 60,
background: "radial-gradient(circle at top right, " + c + "15, transparent 70%)",
pointerEvents: "none"
} }),
React.createElement("div", { style: { fontSize: 22, fontWeight: 800, color: c, lineHeight: 1, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: -0.5 } }, value),
React.createElement("div", { style: { fontSize: 10, color: "#7A7A8E", marginTop: 6, textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } }, label),
sub && React.createElement("div", { style: { fontSize: 10, color: "#4A4A60", marginTop: 2 } }, sub),
clickable && React.createElement("div", { style: { position: "absolute", bottom: 6, right: 9, fontSize: 11, color: c + "99", fontWeight: 600 } }, "\u203A")));
};
function CustomerForm({ initial, onSave, onClose, isSuperuser }) {
const blank = { name: "", vat: "", fiscalCode: "", address: "", contact: "", email: "", phone: "", notes: "" };
const [f, setF] = React.useState(initial ? Object.assign(Object.assign({}, blank), initial) : blank);
const [errors, setErrors] = React.useState({});
const s = k => e => setF(x => (Object.assign(Object.assign({}, x), { [k]: e.target.value })));
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement(ErrorSummary, { errors: errors }),
React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement(Span2, null,
React.createElement(Inp, { label: "Ragione sociale", value: f.name, onChange: s("name") })),
React.createElement(Inp, { label: "Partita IVA", value: f.vat, onChange: s("vat") }),
React.createElement(Inp, { label: "Codice fiscale", value: f.fiscalCode, onChange: s("fiscalCode") }),
React.createElement(Span2, null,
React.createElement(Inp, { label: "Indirizzo", value: f.address, onChange: s("address") })),
React.createElement(Inp, { label: "Referente", value: f.contact, onChange: s("contact") }),
React.createElement(Inp, { label: "Email", value: f.email, onChange: s("email") }),
React.createElement(Inp, { label: "Telefono", value: f.phone, onChange: s("phone") }),
React.createElement("div", null),
React.createElement(Span2, null,
React.createElement(Txt, { label: "Note", value: f.notes, onChange: s("notes") }))),
(initial === null || initial === void 0 ? void 0 : initial.id) && React.createElement(PortaleClienteBox, { customer: Object.assign(Object.assign({}, initial), { email: f.email }), isSuperuser: isSuperuser }),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Annulla"),
React.createElement(Btn, { onClick: () => {
var _a;
const errs = {};
if (!((_a = f.name) === null || _a === void 0 ? void 0 : _a.trim()))
errs.name = "La ragione sociale è obbligatoria";
if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
errs.email = "Email non valida";
setErrors(errs);
if (Object.keys(errs).length > 0)
return;
onSave(f);
} }, "Salva"))));
}
function PartForm({ initial, assets, onSave, onClose }) {
const blank = { code: "", name: "", brand: "", compatible: [], qty: 0, minQty: 0, unitPrice: 0, sellPrice: 0, markupPct: 30, location: "", notes: "" };
const [f, setF] = React.useState(initial ? Object.assign(Object.assign(Object.assign({}, blank), initial), { sellPrice: initial.sellPrice || initial.unitPrice, markupPct: initial.markupPct || 0, compatible: initial.compatible || [] }) : blank);
const s = k => e => setF(x => (Object.assign(Object.assign({}, x), { [k]: e.target.value })));
const toggle = id => setF(x => (Object.assign(Object.assign({}, x), { compatible: x.compatible.includes(id) ? x.compatible.filter(c => c !== id) : [...x.compatible, id] })));
const applyMarkup = () => {
const cost = +f.unitPrice;
const pct = +f.markupPct;
setF(x => (Object.assign(Object.assign({}, x), { sellPrice: +(cost * (1 + pct / 100)).toFixed(2) })));
};
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement(Inp, { label: "Codice parte", value: f.code, onChange: s("code") }),
React.createElement(Inp, { label: "Nome", value: f.name, onChange: s("name") }),
React.createElement(Inp, { label: "Marca", value: f.brand, onChange: s("brand") }),
React.createElement(Inp, { label: "Ubicazione magazzino", value: f.location, onChange: s("location") }),
React.createElement(Inp, { label: "Quantit\u00E0", type: "number", value: f.qty, onChange: s("qty") }),
React.createElement(Inp, { label: "Quantit\u00E0 minima", type: "number", value: f.minQty, onChange: s("minQty") }),
React.createElement(Inp, { label: "Prezzo di acquisto (\u20AC)", type: "number", step: "0.01", value: f.unitPrice, onChange: s("unitPrice") }),
React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "end" } },
React.createElement("div", { style: { flex: 1 } },
React.createElement(Inp, { label: "Markup %", type: "number", value: f.markupPct, onChange: s("markupPct") })),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: applyMarkup, style: { padding: "10px 12px" } }, "Applica")),
React.createElement(Span2, null,
React.createElement(Inp, { label: "Prezzo di vendita (\u20AC)", type: "number", step: "0.01", value: f.sellPrice, onChange: s("sellPrice") })),
assets.length > 0 && (React.createElement(Span2, null,
React.createElement("span", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, display: "block", marginBottom: 8 } }, "Apparecchi compatibili"),
React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } }, assets.map(a => (React.createElement("button", { key: a.id, onClick: () => toggle(a.id), style: { background: f.compatible.includes(a.id) ? "#2dd4bf22" : "var(--surface-2)", border: "1px solid " + (f.compatible.includes(a.id) ? "#2dd4bf" : "var(--surface-4)"), color: f.compatible.includes(a.id) ? "#5eead4" : "var(--text-3)", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12 } },
(a.assetCode || a.id),
" \u2014 ",
a.name)))))),
React.createElement(Span2, null,
React.createElement(Txt, { label: "Note", value: f.notes, onChange: s("notes") }))),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Annulla"),
React.createElement(Btn, { onClick: () => onSave(Object.assign(Object.assign({}, f), { qty: +f.qty, minQty: +f.minQty, unitPrice: +f.unitPrice, sellPrice: +f.sellPrice, markupPct: +f.markupPct })) }, "Salva"))));
}
function OrderForm({ initial, parts, onSave, onClose }) {
var _a;
const blank = { supplier: "", partId: ((_a = parts[0]) === null || _a === void 0 ? void 0 : _a.id) || "", qty: 1, unitPrice: 0, status: "in attesa", orderDate: new Date().toISOString().slice(0, 10), expectedDate: "", notes: "" };
const [f, setF] = React.useState(initial ? Object.assign(Object.assign({}, blank), initial) : blank);
const s = k => e => setF(x => (Object.assign(Object.assign({}, x), { [k]: e.target.value })));
React.useEffect(() => { if (!initial) {
const pt = parts.find(x => x.id === f.partId);
if (pt)
setF(x => (Object.assign(Object.assign({}, x), { unitPrice: pt.unitPrice })));
} }, [f.partId]);
if (parts.length === 0) {
return (React.createElement("div", { style: { textAlign: "center", padding: "20px 0", color: "var(--text-2)" } },
"Devi prima registrare almeno una parte.",
React.createElement("div", { style: { marginTop: 14 } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Chiudi"))));
}
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement(Inp, { label: "Fornitore", value: f.supplier, onChange: s("supplier") }),
React.createElement(Sel, { label: "Parte", value: f.partId, onChange: s("partId") }, parts.map(p => React.createElement("option", { key: p.id, value: p.id },
p.code,
" \u2014 ",
p.name))),
React.createElement(Inp, { label: "Quantit\u00E0", type: "number", value: f.qty, onChange: s("qty") }),
React.createElement(Inp, { label: "Prezzo unitario (\u20AC)", type: "number", step: "0.01", value: f.unitPrice, onChange: s("unitPrice") }),
React.createElement(Sel, { label: "Stato ordine", value: f.status, onChange: s("status") }, ["in attesa", "confermato", "spedito", "ricevuto", "annullato"].map(v => React.createElement("option", { key: v }, v))),
React.createElement("div", null),
React.createElement(Inp, { label: "Data ordine", type: "date", value: f.orderDate, onChange: s("orderDate") }),
React.createElement(Inp, { label: "Data prevista consegna", type: "date", value: f.expectedDate, onChange: s("expectedDate") }),
React.createElement(Span2, null,
React.createElement(Txt, { label: "Note", value: f.notes, onChange: s("notes") }))),
React.createElement("div", { style: { background: "var(--bg)", borderRadius: 10, padding: "12px 16px" } },
React.createElement("span", { style: { color: "var(--text-3)", fontSize: 12 } },
"Valore ordine: ",
React.createElement("strong", { style: { color: "#a855f7", fontSize: 14 } },
"\u20AC",
(+f.qty * (+f.unitPrice)).toFixed(2)))),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Annulla"),
React.createElement(Btn, { onClick: () => onSave(Object.assign(Object.assign({}, f), { qty: +f.qty, unitPrice: +f.unitPrice })) }, "Salva"))));
}
function CestinoModal({ cestino, onRestore, onPurge, onClose }) {
const TIPI = [
{ key: "assets", label: "Apparecchi", nome: r => r.name || r.assetCode || r.id },
{ key: "jobs", label: "Job / Interventi", nome: r => r.description || r.id },
{ key: "customers", label: "Clienti", nome: r => r.name || r.id },
{ key: "parts", label: "Ricambi", nome: r => r.name || r.code || r.id },
{ key: "iecReports", label: "Verifiche Sicurezza Elettrica", nome: r => (r.reportNumber || r.id) },
{ key: "funcReports", label: "Verifiche Funzionali", nome: r => (r.reportNumber || r.id) },
{ key: "invoices", label: "Preventivi", nome: r => r.number || r.id },
{ key: "quotes", label: "Preventivi", nome: r => r.number || r.id },
{ key: "orders", label: "Ordini", nome: r => (r.supplier || "Ordine") + " " + (r.id || "") },
{ key: "instruments", label: "Strumenti", nome: r => (r.brand || "") + " " + (r.model || r.id) },
{ key: "procedures", label: "Procedure", nome: r => r.title || r.id },
{ key: "recalls", label: "Avvisi di sicurezza", nome: r => (r.manufacturer || "") + " " + (r.subject || r.ref || r.id) },
{ key: "withdrawals", label: "Prelievi", nome: r => r.id },
];
const fmtData = (iso) => { try {
return new Date(iso).toLocaleDateString("it-IT");
}
catch (e) {
return "";
} };
const totale = TIPI.reduce((n, t) => n + ((cestino[t.key] || []).length), 0);
return (React.createElement(Modal, { title: "\uD83D\uDDD1 Cestino" + (totale > 0 ? " (" + totale + ")" : ""), onClose: onClose, wide: true },
React.createElement("div", { style: { fontSize: 13, color: "var(--text-2)", lineHeight: 1.55, marginBottom: 18 } },
"Gli elementi spostati nel cestino non compaiono pi\u00F9 nelle liste, ma puoi ",
React.createElement("strong", { style: { color: "#5eead4" } }, "ripristinarli"),
" o eliminarli ",
React.createElement("strong", { style: { color: "#f87171" } }, "definitivamente"),
". Gli elementi vengono svuotati automaticamente dopo 90 giorni."),
totale === 0 ? (React.createElement("div", { style: { textAlign: "center", color: "var(--text-3)", padding: "40px 0", fontSize: 14 } }, "Il cestino \u00E8 vuoto.")) : (TIPI.filter(t => (cestino[t.key] || []).length > 0).map(t => (React.createElement("div", { key: t.key, style: { marginBottom: 20 } },
React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: "var(--text-4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 } },
t.label,
" (",
(cestino[t.key] || []).length,
")"),
(cestino[t.key] || []).map(rec => (React.createElement("div", { key: rec.id, style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 10, marginBottom: 6 } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { fontSize: 13, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, t.nome(rec)),
rec.deletedAt && React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 2 } },
"Cestinato il ",
fmtData(rec.deletedAt))),
React.createElement("button", { onClick: () => onRestore(t.key, rec.id), style: { background: "#2dd4bf18", border: "1px solid #2dd4bf55", color: "#5eead4", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", fontWeight: 600 } }, "\u21A9 Ripristina"),
React.createElement("button", { onClick: () => { if (confirm("Eliminare DEFINITIVAMENTE questo elemento? Non sarà più recuperabile."))
onPurge(t.key, rec.id); }, style: { background: "#ef444415", border: "1px solid #ef444455", color: "#f87171", borderRadius: 8, padding: "6px 10px", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" } }, "Elimina"))))))))));
}
const STATUS_COLOR_PORTAL = {
'aperto': '#ef4444',
'in corso': '#f59e0b',
'in attesa parti': '#f59e0b',
'attesa parti': '#f59e0b',
'chiuso': '#22c55e',
'sospeso': 'var(--text-2)',
'operativo': '#22c55e',
'fuori servizio': '#ef4444',
'in manutenzione': '#f59e0b',
};
function PpmChecklistEditor({ onClose, showToast }) {
var _s = React.useState(function () { return loadPpmChecklists(); }); var data = _s[0], setData = _s[1];
var cats = Object.keys(PPM_CHECKLISTS_DEFAULT);
var _sc = React.useState("cat"); var scope = _sc[0], setScope = _sc[1];
var _c = React.useState(cats[0]); var catId = _c[0], setCatId = _c[1];
var _b = React.useState(""); var brand = _b[0], setBrand = _b[1];
var _m = React.useState(""); var model = _m[0], setModel = _m[1];
var modelKey = (brand.trim().toLowerCase() + "|" + model.trim().toLowerCase());
function loadItemsFor(sc, cid, mk) {
if (sc === "cat") { var ov = (data.byCat || {})[cid]; return (ov && ov.items) ? ov.items.slice() : (((PPM_CHECKLISTS_DEFAULT[cid] || {}).items) || []).slice(); }
var mc = (data.byModel || {})[mk]; return (mc && mc.items) ? mc.items.slice() : [];
}
var _i = React.useState(function () { return loadItemsFor("cat", cats[0], ""); }); var items = _i[0], setItems = _i[1];
React.useEffect(function () { setItems(loadItemsFor(scope, catId, modelKey)); }, [scope, catId, modelKey]);
function addItem() { setItems(function (x) { return x.concat([""]); }); }
function setItem(i, v) { setItems(function (x) { return x.map(function (t, j) { return j === i ? v : t; }); }); }
function delItem(i) { setItems(function (x) { return x.filter(function (_, j) { return j !== i; }); }); }
function resetCatDefault() { if (scope !== "cat") return; setItems((((PPM_CHECKLISTS_DEFAULT[catId] || {}).items) || []).slice()); }
function save() {
var clean = items.map(function (s) { return (s || "").trim(); }).filter(Boolean);
if (scope === "model" && !brand.trim() && !model.trim()) { showToast && showToast("Inserisci marca e/o modello", "#ef4444"); return; }
var d = JSON.parse(JSON.stringify(data));
if (scope === "cat") { d.byCat = d.byCat || {}; if (clean.length) d.byCat[catId] = { items: clean }; else delete d.byCat[catId]; }
else { d.byModel = d.byModel || {}; if (clean.length) d.byModel[modelKey] = { brand: brand.trim(), model: model.trim(), items: clean }; else delete d.byModel[modelKey]; }
savePpmChecklists(d); setData(d);
showToast && showToast("Checklist PPM salvata", "#2dd4bf");
}
return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } },
React.createElement("div", { style: { fontSize: 13, color: "var(--text-3)", lineHeight: 1.45 } }, "Definisci le voci della checklist di manutenzione. La CATEGORIA \u00e8 il template generico (modificabile); il MODELLO aggiunge voci specifiche che si sommano a quelle della categoria."),
React.createElement(Sel, { label: "Ambito", value: scope, onChange: function (e) { setScope(e.target.value); } },
React.createElement("option", { value: "cat" }, "Categoria (template generico)"),
React.createElement("option", { value: "model" }, "Modello (voci aggiuntive)")),
scope === "cat"
? React.createElement(Sel, { label: "Categoria", value: catId, onChange: function (e) { setCatId(e.target.value); } }, cats.map(function (c) { return React.createElement("option", { key: c, value: c }, (PPM_CHECKLISTS_DEFAULT[c].label || c)); }))
: React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement(Inp, { label: "Marca", value: brand, onChange: function (e) { setBrand(e.target.value); }, placeholder: "es. B.Braun" }),
React.createElement(Inp, { label: "Modello", value: model, onChange: function (e) { setModel(e.target.value); }, placeholder: "es. Infusomat Space" })),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } },
items.length === 0 ? React.createElement("div", { style: { color: "var(--text-4)", fontSize: 12, padding: "6px 0" } }, scope === "cat" ? "Nessuna voce \u2014 aggiungine o ripristina il default." : "Nessuna voce aggiuntiva per questo modello.") : null,
items.map(function (t, i) {
return React.createElement("div", { key: i, style: { display: "flex", gap: 6, alignItems: "center" } },
React.createElement("input", { value: t, onChange: function (e) { setItem(i, e.target.value); }, placeholder: "Descrizione voce\u2026", style: { flex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "8px 10px", fontSize: 13 } }),
React.createElement("button", { onClick: function () { delItem(i); }, title: "Rimuovi", style: { background: "transparent", border: "1px solid var(--border)", borderRadius: 8, color: "#ef4444", padding: "7px 10px", cursor: "pointer", fontSize: 13 } }, "\u2715"));
})),
React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: addItem }, "+ Aggiungi voce"),
scope === "cat" ? React.createElement(Btn, { sm: true, variant: "ghost", onClick: resetCatDefault }, "\u21BA Ripristina default") : null),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Chiudi"),
React.createElement(Btn, { onClick: save }, "Salva checklist")));
}
function TemplateManagerModal({ allTemplates, customTemplates, onNew, onEdit, onDelete, onClose }) {
const predefiniti = Object.entries(allTemplates).filter(([id, t]) => !t.isCustom);
const custom = Object.entries(customTemplates || {});
const ROW = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "11px 14px", background: "var(--bg-2)", border: "1px solid var(--border-2)", borderRadius: 10, marginBottom: 7 };
return (React.createElement("div", null,
React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)", marginBottom: 16, lineHeight: 1.5, background: "#1e2a3a44", borderRadius: 8, padding: "10px 12px" } }, "Crea template di verifica personalizzati per i tuoi standard specifici (es. EN 60601-2-14, EN 62745). Appariranno nel menu quando crei una nuova verifica funzionale."),
React.createElement("button", { onClick: onNew, style: Object.assign(Object.assign({}, FORM_BTN_PRIMARY), { width: "100%", marginBottom: 18 }) }, "+ Crea nuovo template"),
custom.length > 0 && (React.createElement("div", { style: { marginBottom: 18 } },
React.createElement("div", { style: { fontSize: 11, fontWeight: 800, color: "#2dd4bf", marginBottom: 8, textTransform: "uppercase", letterSpacing: .6 } },
"I tuoi template (",
custom.length,
")"),
custom.map(([id, t]) => {
var _a;
return (React.createElement("div", { key: id, style: ROW },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, t.label),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)" } },
t.norm || "Nessuna norma",
" \u00B7 ",
((_a = t.sections) === null || _a === void 0 ? void 0 : _a.length) || 0,
" sezioni")),
React.createElement("div", { style: { display: "flex", gap: 6, flexShrink: 0 } },
React.createElement("button", { onClick: () => onEdit(t), style: { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, color: "#5eead4", padding: "6px 11px", cursor: "pointer", fontSize: 12, fontWeight: 700 } }, "Modifica"),
React.createElement("button", { onClick: () => onDelete(id), style: { background: "#ef444415", border: "1px solid #ef444433", borderRadius: 6, color: "#ef4444", padding: "6px 11px", cursor: "pointer", fontSize: 12, fontWeight: 700 } }, "Elimina"))));
}))),
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 11, fontWeight: 800, color: "var(--text-3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: .6 } },
"Template predefiniti (",
predefiniti.length,
")"),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-4)", marginBottom: 8 } }, "Di sola lettura. Per personalizzarli, crea un nuovo template."),
predefiniti.map(([id, t]) => {
var _a;
return (React.createElement("div", { key: id, style: Object.assign(Object.assign({}, ROW), { opacity: .7 }) },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, t.label),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-4)" } },
t.norm || "",
" \u00B7 ",
((_a = t.sections) === null || _a === void 0 ? void 0 : _a.length) || 0,
" sezioni")),
React.createElement("span", { style: { fontSize: 10, color: "var(--text-4)", flexShrink: 0 } }, "\uD83D\uDD12 predefinito")));
})),
React.createElement("div", { style: FORM_FOOTER },
React.createElement("button", { onClick: onClose, style: FORM_BTN_GHOST }, "Chiudi"))));
}
function ClientReportModal({ customer, assets, iecReports, funcReports, jobs, company, onClose }) {
const myAssets = React.useMemo(() => assets.filter(a => a.customerId === customer.id), [assets, customer.id]);
const today = new Date();
today.setHours(0, 0, 0, 0);
const STATUS_LABEL = { operativo: "Operativo", "in manutenzione": "In manutenzione", "fuori servizio": "Fuori servizio", dismesso: "Dismesso" };
const STATUS_COLOR = { operativo: "#22c55e", "in manutenzione": "#f59e0b", "fuori servizio": "#ef4444", dismesso: "var(--text-3)" };
const totOperativi = myAssets.filter(a => a.status === "operativo" || !a.status).length;
const totFuoriServizio = myAssets.filter(a => a.status === "fuori servizio").length;
const scadute = myAssets.filter(a => { if (!a.nextService)
return false; const d = new Date(a.nextService); d.setHours(0, 0, 0, 0); return d < today; }).length;
const verificheCliente = iecReports.filter(r => r.customerId === customer.id).length + funcReports.filter(r => r.customerId === customer.id).length;
const sorted = React.useMemo(() => [...myAssets].sort((a, b) => {
if (!a.nextService)
return 1;
if (!b.nextService)
return -1;
return new Date(a.nextService) - new Date(b.nextService);
}), [myAssets]);
const Stat = ({ n, label, color }) => (React.createElement("div", { style: { flex: 1, minWidth: 80, background: "var(--bg-2)", border: "1px solid var(--border-2)", borderRadius: 10, padding: "12px 8px", textAlign: "center" } },
React.createElement("div", { style: { fontSize: 22, fontWeight: 800, color: color || "#2dd4bf", fontFamily: "'IBM Plex Mono', monospace" } }, n),
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .5, marginTop: 4, fontWeight: 700 } }, label)));
return (React.createElement("div", null,
React.createElement("div", { style: { marginBottom: 16 } },
React.createElement("div", { style: { fontSize: 18, fontWeight: 800, color: "var(--text)" } }, customer.name),
React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)", marginTop: 2 } }, [customer.vat && ("P.IVA " + customer.vat), customer.address].filter(Boolean).join(" · ") || "—")),
React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 } },
React.createElement(Stat, { n: myAssets.length, label: "Apparecchi" }),
React.createElement(Stat, { n: totOperativi, label: "Operativi", color: "#22c55e" }),
React.createElement(Stat, { n: totFuoriServizio, label: "Fuori serv.", color: totFuoriServizio > 0 ? "#ef4444" : "#22c55e" }),
React.createElement(Stat, { n: scadute, label: "Scadute", color: scadute > 0 ? "#ef4444" : "#22c55e" }),
React.createElement(Stat, { n: verificheCliente, label: "Verifiche", color: "#a855f7" })),
React.createElement("div", { style: { fontSize: 11, fontWeight: 800, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: .6, marginBottom: 8 } },
"Apparecchi (",
myAssets.length,
")"),
myAssets.length === 0 ? (React.createElement("div", { style: { padding: "20px", textAlign: "center", color: "var(--text-3)", fontSize: 13, background: "var(--bg-2)", borderRadius: 10 } }, "Nessun apparecchio registrato per questo cliente.")) : (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6, maxHeight: "40vh", overflowY: "auto" } }, sorted.map(a => {
const st = a.status || "operativo";
let scadColor = "var(--text-3)", scadNote = "";
if (a.nextService) {
const d = new Date(a.nextService);
d.setHours(0, 0, 0, 0);
const days = Math.round((d - today) / 86400000);
if (days < 0) {
scadColor = "#ef4444";
scadNote = " (scaduta)";
}
else if (days <= 30) {
scadColor = "#f59e0b";
scadNote = " (" + days + "gg)";
}
}
return (React.createElement("div", { key: a.id, style: { padding: "10px 12px", background: "var(--bg-2)", border: "1px solid var(--border-2)", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 } },
React.createElement("div", { style: { minWidth: 0, flex: 1 } },
React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, a.name || "—"),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } },
[a.brand, a.model].filter(Boolean).join(" "),
a.serial ? " · SN: " + a.serial : "",
a.location ? " · " + a.location : "")),
React.createElement("div", { style: { textAlign: "right", flexShrink: 0 } },
React.createElement("span", { style: { fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 6, background: STATUS_COLOR[st] + "22", color: STATUS_COLOR[st], textTransform: "uppercase", letterSpacing: .3 } }, STATUS_LABEL[st] || st),
a.nextService && React.createElement("div", { style: { fontSize: 10, color: scadColor, fontWeight: scadNote ? 700 : 400, marginTop: 4, fontFamily: "'IBM Plex Mono', monospace" } },
a.nextService,
scadNote))));
}))),
React.createElement("div", { style: FORM_FOOTER },
React.createElement("button", { onClick: onClose, style: FORM_BTN_GHOST }, "Chiudi"),
React.createElement("button", { onClick: () => generateClientReportPDF(customer, assets, iecReports, funcReports, jobs, company), style: FORM_BTN_PRIMARY }, "\uD83D\uDDA8 Scarica PDF"))));
}
function QRScanCam({ onResult, onClose }) {
const videoRef = React.useRef(null);
const [err, setErr] = React.useState("");
React.useEffect(() => {
let stream = null, raf = null, detector = null, stopped = false, jsqr = false, canvas = null, ctx = null;
const stop = () => { stopped = true; if (raf) cancelAnimationFrame(raf); if (stream) { try { stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {} } };
const done = (text) => { if (stopped || !text) return; stop(); onResult(text); };
const loadJsQR = () => new Promise(function (res) {
if (window.jsQR) return res(true);
const sc = document.createElement("script");
sc.src = "https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.min.js";
sc.onload = function () { res(true); }; sc.onerror = function () { res(false); };
document.head.appendChild(sc);
});
(async () => {
try {
stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
const v = videoRef.current; if (!v) { stop(); return; }
v.srcObject = stream; v.setAttribute("playsinline", "true"); v.muted = true;
try { await v.play(); } catch (e) {}
if ("BarcodeDetector" in window) { try { detector = new window.BarcodeDetector({ formats: ["qr_code"] }); } catch (e) { detector = null; } }
if (!detector) {
const ok = await loadJsQR(); jsqr = ok && !!window.jsQR;
canvas = document.createElement("canvas"); ctx = canvas.getContext("2d", { willReadFrequently: true });
if (!jsqr) setErr("Scanner non supportato qui. Apri il QR con la fotocamera del telefono.");
}
const tick = async () => {
if (stopped) return;
try {
if (detector) {
const codes = await detector.detect(v);
if (codes && codes.length) return done(codes[0].rawValue);
} else if (jsqr && v.videoWidth) {
canvas.width = v.videoWidth; canvas.height = v.videoHeight;
ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
const code = window.jsQR(img.data, img.width, img.height);
if (code && code.data) return done(code.data);
}
} catch (e) {}
raf = requestAnimationFrame(tick);
};
raf = requestAnimationFrame(tick);
} catch (e) {
setErr("Impossibile accedere alla fotocamera. Concedi il permesso e riprova.");
}
})();
return stop;
}, []);
return React.createElement("div", { style: { position: "fixed", inset: 0, background: "#000", zIndex: 9999, display: "flex", flexDirection: "column" } },
React.createElement("div", { style: { padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#e8e8ef" } },
React.createElement("div", { style: { fontSize: 13, fontWeight: 700 } }, "Inquadra il QR dell'apparecchio"),
React.createElement("button", { onClick: onClose, style: { background: "#1a1a22", border: "1px solid #2e2e3a", color: "#9a9aab", borderRadius: 8, padding: "6px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer" } }, "Chiudi")),
React.createElement("div", { style: { flex: 1, position: "relative", overflow: "hidden" } },
React.createElement("video", { ref: videoRef, muted: true, playsInline: true, style: { width: "100%", height: "100%", objectFit: "cover" } }),
React.createElement("div", { style: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "68vw", maxWidth: 300, height: "68vw", maxHeight: 300, border: "3px solid #2dd4bf", borderRadius: 20, boxShadow: "0 0 0 9999px rgba(0,0,0,0.45)" } })),
err && React.createElement("div", { style: { padding: "14px 18px", background: "#ef444422", color: "#ef4444", fontSize: 12, textAlign: "center" } }, err));
}
export function AppMain() {
var _a, _b, _c, _d, _e;
const isMobile = useMedia("(max-width:768px)");
React.useEffect(() => {
if (document.getElementById("mt-global-keyframes"))
return;
const style = document.createElement("style");
style.id = "mt-global-keyframes";
style.textContent = `
@keyframes mtShake {
10%, 90% { transform: translateX(-2px); }
20%, 80% { transform: translateX(4px); }
30%, 50%, 70% { transform: translateX(-6px); }
40%, 60% { transform: translateX(6px); }
}
@keyframes mtFadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
@keyframes mtSpin { to { transform: rotate(360deg); } }
/* Focus eleganti sui campi form */
input:focus, select:focus, textarea:focus {
border-color: #2dd4bf !important;
box-shadow: 0 0 0 3px #2dd4bf22 !important;
}
/* Placeholder più leggibili */
input::placeholder, textarea::placeholder { color: #475569; }
/* Niente flash blu al tocco su mobile */
* { -webkit-tap-highlight-color: transparent; }
/* Feedback al tocco sui pulsanti: si "premono" davvero */
button { transition: filter .12s ease, transform .08s ease; }
button:active:not(:disabled) { transform: scale(0.97); filter: brightness(1.08); }
button:disabled { cursor: not-allowed; opacity: .55; }
/* Classe per dare lo stesso feedback a card/elementi cliccabili (non-button) */
.mt-tap { transition: transform .08s ease, filter .12s ease; }
.mt-tap:active { transform: scale(0.985); filter: brightness(1.05); }
/* Hover righe tabella */
@media (hover: hover) { .mt-table-row:hover { background: rgba(45,212,191,.13) !important; } }
/* Scrollbar discrete e arrotondate (rifinitura) */
::-webkit-scrollbar { width: 9px; height: 9px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #2a2a38; border-radius: 8px; border: 2px solid transparent; background-clip: padding-box; }
::-webkit-scrollbar-thumb:hover { background: #3a3a4c; }
* { scrollbar-width: thin; scrollbar-color: #2a2a38 transparent; }
`;
document.head.appendChild(style);
}, []);
const _emptyData = {
assets: [], parts: [], jobs: [], orders: [], withdrawals: [],
customers: [], invoices: [], quotes: [], instruments: [], procedures: [], recalls: [],
company: { name: "MedTrace", subtitle: "Gestione Apparecchiature Elettromedicali", address: "", vat: "", iban: "", invoicePrefix: "F" }
};
const initialData = (typeof DEMO_LOCKED !== "undefined" && DEMO_LOCKED && typeof DEMO_SEED !== "undefined" && DEMO_SEED) ? DEMO_SEED : (loadData() || _emptyData);
const [quotes, setQuotes] = React.useState(initialData.quotes || []);
const [instruments, setInstruments] = React.useState(initialData.instruments || []);
React.useEffect(() => { setInstrumentsRegistry(instruments || []); }, [instruments]);
const [procedures, setProcedures] = React.useState(initialData.procedures || []);
const [portalMode, setPortalMode] = React.useState(false);
const [tab, setTabState] = React.useState(function () {
try { var h = (window.location.hash || "").replace(/^#\/?/, "").split("/")[0]; return h || "dashboard"; }
catch (e) { return "dashboard"; }
});
const setTab = React.useCallback(function (t) {
setTabState(t);
try { var target = "#" + t; if (window.location.hash !== target) { window.history.pushState({ medtrace: true, tab: t }, "", target); } }
catch (e) { }
}, []);
const [schedaId, setSchedaId] = React.useState(function () {
try { var p = (window.location.hash || "").replace(/^#\/?/, "").split("/"); return p[0] === "scheda" ? (p[1] || null) : null; } catch (e) { return null; }
});
const openAsset = React.useCallback(function (id) {
setTabState("scheda"); setSchedaId(id);
try { var target = "#scheda/" + id; if (window.location.hash !== target) { window.history.pushState({ medtrace: true, tab: "scheda", asset: id }, "", target); } }
catch (e) { }
}, []);
const [recallFocus, setRecallFocus] = React.useState(null);
const openRecall = React.useCallback(function (id) {
setRecallFocus(id); setTabState("recalls");
try { var target = "#recalls"; if (window.location.hash !== target) { window.history.pushState({ medtrace: true, tab: "recalls" }, "", target); } }
catch (e) { }
}, []);
const [assets, setAssets] = React.useState(initialData.assets);
const [parts, setParts] = React.useState(initialData.parts);
const [jobs, setJobs] = React.useState(initialData.jobs);
const [orders, setOrders] = React.useState(initialData.orders);
const [withdrawals, setWDs] = React.useState(initialData.withdrawals);
const [customers, setCustomers] = React.useState(initialData.customers || []);
const [reconWard, setReconWard] = React.useState("");
const [reconInput, setReconInput] = React.useState("");
const [reconResult, setReconResult] = React.useState(null);
const [reconListening, setReconListening] = React.useState(false);
const [reconLive, setReconLive] = React.useState(0);
const [reconLastEpc, setReconLastEpc] = React.useState("");
const [assocEpc, setAssocEpc] = React.useState(null);
const reconWards = React.useMemo(() => { const s = new Set(); (assets || []).forEach(a => { if (a.lastLocation) s.add(a.lastLocation); if (a.location) s.add(a.location); }); return Array.from(s).sort(); }, [assets]);
const reconByWard = React.useMemo(() => { const m = {}; (assets || []).forEach(a => { if (a.lastLocation) { if (!m[a.lastLocation]) m[a.lastLocation] = { count: 0, last: "" }; m[a.lastLocation].count++; if (a.lastLocationDate && a.lastLocationDate > m[a.lastLocation].last) m[a.lastLocation].last = a.lastLocationDate; } }); return Object.keys(m).sort().map(k => ({ ward: k, count: m[k].count, last: m[k].last })); }, [assets]);
React.useEffect(() => {
if (!assets || assets.length === 0)
return;
const mancano = assets.some(a => !a.assetCode);
if (!mancano)
return;
setAssets(prev => ensureAssetCodes(prev, customers));
}, [assets, customers]);
const [invoices, setInvoices] = React.useState(initialData.invoices || []);
const [iecReports, setIecReports] = React.useState(initialData.iecReports || []);
const [funcReports, setFuncReports] = React.useState(initialData.funcReports || []);
const [ppmReports, setPpmReports] = React.useState(initialData.ppmReports || []);
const [recalls, setRecalls] = React.useState(initialData.recalls || []);
const CESTINO_VUOTO = { assets: [], parts: [], jobs: [], orders: [], withdrawals: [], customers: [], invoices: [], quotes: [], instruments: [], procedures: [], iecReports: [], funcReports: [], ppmReports: [], recalls: [] };
const [cestino, setCestino] = React.useState(initialData.cestino || CESTINO_VUOTO);
React.useEffect(() => {
const norm = rs => rs.map(r => (r && r.published === undefined) ? Object.assign(Object.assign({}, r), { published: true }) : r);
setIecReports(rs => rs.some(r => r && r.published === undefined) ? norm(rs) : rs);
setFuncReports(rs => rs.some(r => r && r.published === undefined) ? norm(rs) : rs);
}, []);
React.useEffect(() => {
(() => __awaiter(this, void 0, void 0, function* () {
try {
if (typeof DEMO_LOCKED !== "undefined" && DEMO_LOCKED)
return;
const local = localStorage.getItem(STORAGE_KEY);
const mirror = yield idbGet(STORAGE_KEY);
if ((!local || local.length < 20) && typeof mirror === "string" && mirror.length > 50) {
localStorage.setItem(STORAGE_KEY, mirror);
window.location.reload();
return;
}
if (local && local.length > 50 && !mirror) {
mirrorToIdb(local);
}
if (navigator.storage && navigator.storage.persist) {
navigator.storage.persist();
}
}
catch (e) { }
}))();
}, []);
React.useEffect(() => {
const LIMITE_MS = 90 * 24 * 60 * 60 * 1000;
const ora = Date.now();
setCestino(prev => {
let cambiato = false;
const nuovo = {};
for (const tipo of Object.keys(prev || {})) {
const tenuti = (prev[tipo] || []).filter(r => {
if (!r.deletedAt)
return true;
const eta = ora - (Date.parse(r.deletedAt) || ora);
if (eta > LIMITE_MS) {
cambiato = true;
supabaseDeleteById(tipo, r.id);
return false;
}
return true;
});
nuovo[tipo] = tenuti;
}
return cambiato ? nuovo : prev;
});
}, []);
const [customTemplates, setCustomTemplates] = React.useState(() => loadCustomTemplates());
React.useEffect(() => { saveCustomTemplates(customTemplates); }, [customTemplates]);
const allTemplates = React.useMemo(() => getAllTemplates(customTemplates), [customTemplates]);
const [company, setCompany] = React.useState(() => {
const stored = initialData.company || { name: "", subtitle: "", invoicePrefix: "F" };
if (stored.name && /4[sS]ervice/.test(stored.name)) {
return Object.assign(Object.assign({}, stored), { name: "", subtitle: "" });
}
if (stored.name === "MedTrace" && /Gestione Apparecchiature/i.test(stored.subtitle || "")) {
return Object.assign(Object.assign({}, stored), { name: "", subtitle: "" });
}
return stored;
});
const [userRole, setUserRole] = React.useState(() => {
const isOffline = (typeof OFFLINE_MODE !== "undefined" && OFFLINE_MODE);
const isDemo = (typeof DEMO_LOCKED !== "undefined" && DEMO_LOCKED);
if (isOffline || isDemo)
return "superuser";
try {
const saved = localStorage.getItem("medtrace-user-role");
if (saved)
return saved;
}
catch (e) { }
return null;
});
const isSuperuser = userRole === "superuser";
const isAdmin = userRole === "superuser" || userRole === "admin";
React.useEffect(() => {
const isOffline = (typeof OFFLINE_MODE !== "undefined" && OFFLINE_MODE);
const isDemo = (typeof DEMO_LOCKED !== "undefined" && DEMO_LOCKED);
if (isOffline || isDemo)
return;
let annullato = false;
(() => __awaiter(this, void 0, void 0, function* () {
try {
if (typeof supabaseGetRole !== "function")
return;
const role = yield supabaseGetRole();
if (annullato)
return;
if (role) {
setUserRole(role);
try {
localStorage.setItem("medtrace-user-role", role);
}
catch (e) { }
}
else {
let saved = null;
try {
saved = localStorage.getItem("medtrace-user-role");
}
catch (e) { }
setUserRole(prev => prev || saved || "tecnico");
}
}
catch (e) {
if (annullato)
return;
let saved = null;
try {
saved = localStorage.getItem("medtrace-user-role");
}
catch (e2) { }
setUserRole(prev => prev || saved || "tecnico");
}
}))();
return () => { annullato = true; };
}, []);
const canSee = (sectionId) => {
const SECTION_ALIAS = { scadenze: "agenda", procedures: "help", ricognizione: "assets", scheda: "assets" };
const sid = SECTION_ALIAS[sectionId] || sectionId;
if (userRole === "superuser")
return true;
const custom = (company && company.rolePermissions) || null;
const perms = (custom && custom[userRole]) || DEFAULT_ROLE_PERMS[userRole] || [];
return perms.includes(sid);
};
React.useEffect(() => {
if (userRole && tab && tab !== "dashboard" && !canSee(tab))
setTab("dashboard");
}, [userRole, tab, company]);
React.useEffect(() => {
const isOffline = (typeof OFFLINE_MODE !== "undefined" && OFFLINE_MODE);
const isDemo = (typeof DEMO_LOCKED !== "undefined" && DEMO_LOCKED);
if (isOffline || isDemo)
return;
let annullato = false;
(() => __awaiter(this, void 0, void 0, function* () {
try {
if (typeof supabaseGetCompany !== "function")
return;
const orgCompany = yield supabaseGetCompany();
if (!annullato && orgCompany) {
const cloudTechs = Array.isArray(orgCompany.technicians) ? orgCompany.technicians : [];
const localTechs = (company && company.technicians) || [];
if (orgCompany.name) {
setCompany(c => { const m = Object.assign(Object.assign({}, c), orgCompany); m.technicians = cloudTechs.length > 0 ? cloudTechs : (c.technicians || []); return m; });
}
else if (cloudTechs.length > 0) {
setCompany(c => (Object.assign(Object.assign({}, c), { technicians: cloudTechs })));
}
if (cloudTechs.length === 0 && localTechs.length > 0 && typeof supabaseSaveTechnicians === "function") {
supabaseSaveTechnicians(localTechs);
}
}
}
catch (e) { }
}))();
return () => { annullato = true; };
}, []);
const loadFilterState = (key, fallback) => {
try {
const raw = localStorage.getItem("medtrace-filters-" + key);
return raw ? JSON.parse(raw) : fallback;
}
catch (e) {
return fallback;
}
};
const [mobileSearch, setMobileSearch] = React.useState(() => loadFilterState("search", { assets: "", jobs: "", customers: "", parts: "", invoices: "", iec: "", func: "" }));
const [jobFilter, setJobFilter] = React.useState(() => loadFilterState("jobFilter", "open"));
const DEFAULT_FILTERS = {
assets: { brand: "", model: "", serial: "", name: "", location: "", status: "", customer: "", riskClass: "", iecNorm: "", iecClass: "", patientType: "" },
jobs: { assetName: "", priority: "", type: "", assignee: "", customer: "", status: "" },
customers: { city: "", vat: "" },
parts: { brand: "", code: "", name: "", location: "", supplier: "", stockStatus: "" },
invoices: { status: "", customer: "", number: "" },
iec: { norm: "", equipClass: "", patientType: "", verifyType: "", customer: "", outcome: "", technician: "", assetBrand: "", assetModel: "", leakageMethod: "" },
func: { templateId: "", verifyType: "", customer: "", outcome: "", technician: "", assetBrand: "", assetModel: "" },
};
const [activeFilters, setActiveFilters] = React.useState(() => {
const stored = loadFilterState("activeFilters", null);
if (!stored)
return DEFAULT_FILTERS;
const merged = {};
Object.keys(DEFAULT_FILTERS).forEach(page => {
merged[page] = Object.assign(Object.assign({}, DEFAULT_FILTERS[page]), (stored[page] || {}));
});
return merged;
});
React.useEffect(() => { try {
localStorage.setItem("medtrace-filters-search", JSON.stringify(mobileSearch));
}
catch (e) { } }, [mobileSearch]);
React.useEffect(() => { try {
localStorage.setItem("medtrace-filters-jobFilter", JSON.stringify(jobFilter));
}
catch (e) { } }, [jobFilter]);
React.useEffect(() => { try {
localStorage.setItem("medtrace-filters-activeFilters", JSON.stringify(activeFilters));
}
catch (e) { } }, [activeFilters]);
const setFilter = (page, key, value) => setActiveFilters(f => (Object.assign(Object.assign({}, f), { [page]: Object.assign(Object.assign({}, f[page]), { [key]: value }) })));
const clearFilters = (page) => setActiveFilters(f => (Object.assign(Object.assign({}, f), { [page]: Object.keys(f[page]).reduce((o, k) => (Object.assign(Object.assign({}, o), { [k]: "" })), {}) })));
const matchFilters = (item, page, mappers) => {
const f = activeFilters[page];
if (!f)
return true;
for (const key in f) {
if (!f[key])
continue;
const fn = mappers[key];
if (!fn)
continue;
if (String(fn(item)) !== String(f[key]))
return false;
}
return true;
};
const updMS = (key, val) => setMobileSearch(s => (Object.assign(Object.assign({}, s), { [key]: val })));
const [mobileSort, setMobileSort] = React.useState({ func: "num_asc", iec: "num_asc" });
const updSort = (key, val) => setMobileSort(s => (Object.assign(Object.assign({}, s), { [key]: val })));
const sortReportsList = (arr, key) => { const an = r => { const a = assets.find(x => x.id === r.assetId); return (a && a.name) || ""; }; const cmp = (x, y) => String(x).localeCompare(String(y), undefined, { numeric: true, sensitivity: "base" }); const s = [...arr]; if (key === "num_desc") s.sort((a, b) => cmp(b.reportNumber || "", a.reportNumber || "")); else if (key === "date_desc") s.sort((a, b) => cmp(b.date || "", a.date || "")); else if (key === "date_asc") s.sort((a, b) => cmp(a.date || "", b.date || "")); else if (key === "asset_asc") s.sort((a, b) => cmp(an(a), an(b))); else s.sort((a, b) => cmp(a.reportNumber || "", b.reportNumber || "")); return s; };
const [compactView, setCompactView] = React.useState(() => {
try {
return localStorage.getItem("medtrace-compact-view") === "1";
}
catch (e) {
return false;
}
});
const toggleCompact = () => setCompactView(v => { const nv = !v; try {
localStorage.setItem("medtrace-compact-view", nv ? "1" : "0");
}
catch (e) { } return nv; });
const [assetMobileView, setAssetMobileView] = React.useState(() => {
try {
return localStorage.getItem("medtrace-asset-view") === "table" ? "table" : "cards";
}
catch (e) {
return "cards";
}
});
const toggleAssetView = () => setAssetMobileView(v => { const nv = v === "table" ? "cards" : "table"; try {
localStorage.setItem("medtrace-asset-view", nv);
}
catch (e) { } return nv; });
const [modal, setModal] = React.useState(null);
const [modalHistory, setModalHistory] = React.useState([]);
const [loadingMsg, setLoadingMsg] = React.useState(null);
const pushModal = (m) => {
setModalHistory(h => modal ? [...h, modal] : h);
setModal(m);
};
const popModal = () => {
setModalHistory(h => {
if (h.length > 0) {
const prev = h[h.length - 1];
setModal(prev);
return h.slice(0, -1);
}
setModal(null);
return h;
});
};
const [search, setSearch] = React.useState("");
const [toast, setToast] = React.useState(null);
const [navOpen, setNavOpen] = React.useState(false);
const [scanOpen, setScanOpen] = React.useState(false);
React.useEffect(() => {
try {
const params = new URLSearchParams(window.location.search);
const assetId = params.get("asset");
if (!assetId)
return;
const found = assets.find(a => a.id === assetId);
if (found) {
setTab("assets");
openAsset(found.id);
}
else {
setToast("Apparecchio " + assetId + " non trovato su questo dispositivo.");
}
window.history.replaceState({}, "", window.location.pathname);
}
catch (e) { }
}, [assets.length]);
React.useEffect(() => {
const onKey = (e) => {
const tag = (e.target.tagName || "").toLowerCase();
const isTyping = tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable;
if (e.key === "Escape") {
if (modal) {
popModal();
}
else if (navOpen) {
setNavOpen(false);
}
return;
}
if (isTyping)
return;
if (e.key === "/") {
const searchInput = document.querySelector('input[data-mt-search="1"]');
if (searchInput) {
e.preventDefault();
searchInput.focus();
}
return;
}
if (e.key === "n" || e.key === "N") {
if (modal)
return;
const map = {
assets: () => setModal({ type: "asset", data: null }),
jobs: () => setModal({ type: "job", data: null }),
customers: () => setModal({ type: "customer", data: null }),
parts: () => setModal({ type: "part", data: null }),
orders: () => setModal({ type: "order", data: null }),
invoices: () => setModal({ type: "invoice", data: null }),
iec: () => setModal({ type: "iec", data: null }),
func: () => setModal({ type: "func", data: null }),
};
if (map[tab]) {
e.preventDefault();
map[tab]();
}
return;
}
};
window.addEventListener("keydown", onKey);
return () => window.removeEventListener("keydown", onKey);
}, [modal, navOpen, tab]);
const [pdfHtml, setPdfHtml] = React.useState(null);
const [csvModal, setCsvModal] = React.useState(null);
const [helpOpen, setHelpOpen] = React.useState({});
const [filterStatus, setFilterStatus] = React.useState("");
const [filterPriority, setFilterPriority] = React.useState("");
const [filterCustomer, setFilterCustomer] = React.useState("");
const [filterYear, setFilterYear] = React.useState(new Date().getFullYear());
const [filterMonth, setFilterMonth] = React.useState("");
const [scheduleYear, setScheduleYear] = React.useState(new Date().getFullYear());
React.useEffect(() => {
if (!isMobile)
return;
let startX = null, startY = null, startT = 0, locked = false;
const onStart = (e) => {
const t = e.touches[0];
if (t.clientX > 24) {
startX = null;
return;
}
startX = t.clientX;
startY = t.clientY;
startT = Date.now();
locked = false;
};
const onMove = (e) => {
if (startX === null)
return;
const t = e.touches[0];
const dx = t.clientX - startX;
const dy = Math.abs(t.clientY - startY);
if (!locked) {
if (dx > 10 && dx > dy * 1.5)
locked = true;
else if (dy > 10) {
startX = null;
return;
}
}
if (locked && dx > 50 && !navOpen && !modal) {
setNavOpen(true);
startX = null;
}
};
const onEnd = () => { startX = null; locked = false; };
document.addEventListener('touchstart', onStart, { passive: true });
document.addEventListener('touchmove', onMove, { passive: true });
document.addEventListener('touchend', onEnd, { passive: true });
return () => {
document.removeEventListener('touchstart', onStart);
document.removeEventListener('touchmove', onMove);
document.removeEventListener('touchend', onEnd);
};
}, [isMobile, navOpen, modal]);
const [ptrPull, setPtrPull] = React.useState(0);
const [ptrRefreshing, setPtrRefreshing] = React.useState(false);
React.useEffect(() => {
if (!isMobile)
return;
let startY = null;
let pulling = false;
const onStart = (e) => {
if (window.scrollY > 0) {
startY = null;
return;
}
startY = e.touches[0].clientY;
pulling = false;
};
const onMove = (e) => {
if (startY === null)
return;
const dy = e.touches[0].clientY - startY;
if (dy > 0 && window.scrollY <= 0) {
pulling = true;
setPtrPull(Math.min(dy * 0.5, 100));
}
};
const onEnd = () => {
if (pulling && ptrPull > 60) {
setPtrRefreshing(true);
setTimeout(() => {
try {
const raw = localStorage.getItem(STORAGE_KEY);
if (raw) {
const data = JSON.parse(raw);
if (data.assets)
setAssets(data.assets);
if (data.jobs)
setJobs(data.jobs);
if (data.parts)
setParts(data.parts);
if (data.customers)
setCustomers(data.customers);
if (data.invoices)
setInvoices(data.invoices);
if (data.iecReports)
setIecReports(data.iecReports);
if (data.funcReports)
setFuncReports(data.funcReports);
}
}
catch (e) { }
setPtrRefreshing(false);
setPtrPull(0);
showToast("Aggiornato", "#22c55e");
}, 600);
}
else {
setPtrPull(0);
}
startY = null;
pulling = false;
};
document.addEventListener('touchstart', onStart, { passive: true });
document.addEventListener('touchmove', onMove, { passive: true });
document.addEventListener('touchend', onEnd, { passive: true });
return () => {
document.removeEventListener('touchstart', onStart);
document.removeEventListener('touchmove', onMove);
document.removeEventListener('touchend', onEnd);
};
}, [isMobile, ptrPull]);
React.useEffect(() => {
try { if (!window.location.hash || window.location.hash === "#") { window.history.replaceState({ medtrace: true, tab: "dashboard" }, "", "#dashboard"); } } catch (e) { }
}, []);
const _overlayOpen = !!(modal || navOpen || pdfHtml || csvModal);
const _prevOverlay = React.useRef(false);
React.useEffect(() => {
try { if (_overlayOpen && !_prevOverlay.current) { window.history.pushState({ medtrace: true, tab: tab, overlay: true }, "", window.location.hash); } } catch (e) { }
_prevOverlay.current = _overlayOpen;
}, [_overlayOpen]);
React.useEffect(() => {
const syncFromHash = () => {
try {
var p = (window.location.hash || "").replace(/^#\/?/, "").split("/");
setTabState(p[0] || "dashboard");
setSchedaId(p[0] === "scheda" ? (p[1] || null) : null);
} catch (e) { setTabState("dashboard"); }
};
const onPopState = () => {
if (csvModal) { setCsvModal(null); return; }
if (pdfHtml) { setPdfHtml(null); return; }
if (modal) { popModal(); return; }
if (navOpen) { setNavOpen(false); return; }
syncFromHash();
};
const onHashChange = () => {
if (modal || navOpen || pdfHtml || csvModal) return;
syncFromHash();
};
window.addEventListener("popstate", onPopState);
window.addEventListener("hashchange", onHashChange);
return () => { window.removeEventListener("popstate", onPopState); window.removeEventListener("hashchange", onHashChange); };
}, [modal, navOpen, tab, pdfHtml, csvModal]);
React.useEffect(() => {
const pdfHandler = (e) => setPdfHtml(e.detail);
const csvHandler = (e) => setCsvModal(e.detail);
const toastHandler = (e) => { setToast({ msg: e.detail.msg, color: e.detail.color || "#22c55e" }); setTimeout(() => setToast(null), 3000); };
window.addEventListener('show-pdf', pdfHandler);
window.addEventListener('show-csv', csvHandler);
window.addEventListener('toast', toastHandler);
return () => {
window.removeEventListener('show-pdf', pdfHandler);
window.removeEventListener('show-csv', csvHandler);
window.removeEventListener('toast', toastHandler);
};
}, []);
React.useEffect(() => {
const t = setTimeout(() => {
saveData({ assets, parts, jobs, orders, withdrawals, customers, invoices, quotes, instruments, procedures, iecReports, funcReports, ppmReports, recalls, company, cestino });
}, 600);
return () => clearTimeout(t);
}, [assets, parts, jobs, orders, withdrawals, customers, invoices, quotes, instruments, procedures, iecReports, funcReports, ppmReports, recalls, company, cestino]);
const showToast = React.useCallback((msg, color = "#22c55e") => {
setToast({ msg, color });
setTimeout(() => setToast(null), 3000);
}, []);
const checkLocked = React.useCallback(() => {
if (typeof DEMO_LOCKED !== "undefined" && DEMO_LOCKED) {
setToast({ msg: "Modalità DEMO: modifiche disabilitate. Scarica la versione completa per personalizzare.", color: "#f59e0b" });
setTimeout(() => setToast(null), 3500);
return true;
}
if (subScaduto()) {
setToast({ msg: "⛔ Abbonamento scaduto: MedTrace è in sola lettura. I dati restano consultabili; rinnova per riattivare le modifiche.", color: "#ef4444" });
setTimeout(() => setToast(null), 4000);
return true;
}
return false;
}, []);
const stats = React.useMemo(() => {
const stockValue = parts.reduce((s, p) => s + p.qty * p.unitPrice, 0);
const stockSellValue = parts.reduce((s, p) => s + p.qty * (p.sellPrice || p.unitPrice), 0);
return {
totalAssets: assets.length,
operative: assets.filter(a => a.status === "operativo").length,
maintenance: assets.filter(a => a.status === "in manutenzione").length,
outOfService: assets.filter(a => a.status === "fuori servizio").length,
openJobs: jobs.filter(j => j.status !== "chiuso").length,
urgentJobs: jobs.filter(j => j.priority === "urgente" && j.status !== "chiuso").length,
lowStock: parts.filter(p => p.qty <= p.minQty).length,
stockValue, stockSellValue,
pendingOrders: orders.filter(o => o.status !== "ricevuto" && o.status !== "annullato").length,
customers: customers.length,
pendingInvoices: invoices.filter(i => i.status === "emessa" || i.status === "bozza").length,
};
}, [assets, parts, jobs, orders, customers, invoices]);
const financials = React.useMemo(() => {
const yr = +filterYear;
const matchPeriod = dateStr => {
if (!dateStr)
return false;
const d = new Date(dateStr);
if (d.getFullYear() !== yr)
return false;
if (filterMonth !== "" && d.getMonth() !== +filterMonth)
return false;
return true;
};
const periodInvoices = invoices.filter(i => matchPeriod(i.date));
const periodOrders = orders.filter(o => matchPeriod(o.orderDate) && o.status === "ricevuto");
const periodJobs = jobs.filter(j => matchPeriod(j.closeDate || j.openDate));
let revenue = 0, vatCollected = 0;
periodInvoices.forEach(inv => {
if (inv.status === "annullato")
return;
const subtotal = inv.items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
const vat = inv.items.reduce((s, it) => s + (it.qty * it.unitPrice * it.vat / 100), 0);
revenue += subtotal;
vatCollected += vat;
});
let costsPartsBought = 0;
periodOrders.forEach(o => { costsPartsBought += o.qty * o.unitPrice; });
let costsPartsUsed = 0;
periodJobs.forEach(j => {
j.parts.forEach(p => { const pt = parts.find(x => x.id === p.partId); if (pt)
costsPartsUsed += pt.unitPrice * p.qty; });
});
const margin = revenue - costsPartsUsed;
const monthlyData = [];
for (let m = 0; m < 12; m++) {
let rev = 0;
invoices.forEach(inv => {
if (inv.status === "annullato")
return;
const d = new Date(inv.date);
if (d.getFullYear() === yr && d.getMonth() === m) {
rev += inv.items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
}
});
monthlyData.push({ label: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"][m], value: rev });
}
return { revenue, vatCollected, costsPartsBought, costsPartsUsed, margin, periodInvoices, monthlyData };
}, [invoices, orders, jobs, parts, filterYear, filterMonth]);
const scheduleRows = React.useMemo(() => {
const today = new Date();
today.setHours(0, 0, 0, 0);
return assets
.filter(a => a.nextService)
.map(a => {
const d = new Date(a.nextService);
const c = customers.find(x => x.id === a.customerId) || {};
const days = Math.round((d - today) / 86400000);
const lastIec = iecReports
.filter(r => r.assetId === a.id)
.sort((a, b) => { var _a; return (_a = b.date) === null || _a === void 0 ? void 0 : _a.localeCompare(a.date || ""); })[0];
const normMap = { "62353": "IEC 62353", "61010": "IEC 61010-1" };
return {
assetId: a.id,
assetName: a.name,
brand: a.brand,
serial: a.serial,
location: a.location,
customer: c.name || "",
norm: lastIec ? (normMap[lastIec.norm] || "IEC 62353") : (a.iecNorm ? (normMap[a.iecNorm] || a.iecNorm) : "—"),
lastService: (lastIec === null || lastIec === void 0 ? void 0 : lastIec.date) || a.lastService || "",
nextService: a.nextService,
status: a.status,
month: d.getMonth(),
year: d.getFullYear(),
_days: days,
};
})
.filter(r => r.year === scheduleYear);
}, [assets, iecReports, customers, scheduleYear]);
const MONTHS_IT = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
const scheduleMonths = React.useMemo(() => MONTHS_IT.map((monthLabel, month) => ({
month, monthLabel,
items: scheduleRows.filter(r => r.month === month)
})), [scheduleRows]);
const assetById = React.useMemo(() => { const m = {}; for (const a of assets)
m[a.id] = a; return m; }, [assets]);
const customerById = React.useMemo(() => { const m = {}; for (const c of customers)
m[c.id] = c; return m; }, [customers]);
const partById = React.useMemo(() => { const m = {}; for (const pt of parts)
m[pt.id] = pt; return m; }, [parts]);
const upcomingMaintenance = React.useMemo(() => {
const today = new Date();
today.setHours(0, 0, 0, 0);
const in30days = new Date(today);
in30days.setDate(in30days.getDate() + 30);
return assets
.filter(a => a.nextService)
.map(a => (Object.assign(Object.assign({}, a), { daysToService: Math.round((new Date(a.nextService) - today) / (1000 * 60 * 60 * 24)) })))
.filter(a => a.daysToService <= 30)
.sort((a, b) => a.daysToService - b.daysToService);
}, [assets]);
const scadenzeVerifiche = React.useMemo(() => {
const today = new Date();
today.setHours(0, 0, 0, 0);
const out = [];
const lastOf = (reps, assetId) => reps
.filter(r => r.assetId === assetId && r.date)
.sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0] || null;
const addMonths = (dateStr, months) => {
const d = new Date(dateStr);
if (isNaN(d.getTime()))
return null;
d.setMonth(d.getMonth() + months);
d.setHours(0, 0, 0, 0);
return d;
};
assets.forEach(a => {
const cust = customers.find(c => c.id === a.customerId) || null;
const lastIec = lastOf(iecReports, a.id);
if (lastIec) {
const mesi = parseInt(a.intervalIec, 10) || 12;
const due = (lastIec.nextDate ? new Date(lastIec.nextDate) : addMonths(lastIec.date, mesi));
if (due) {
due.setHours(0, 0, 0, 0);
out.push({ assetId: a.id, assetName: a.name, brand: a.brand, model: a.model, serial: a.serial,
customer: cust, tipo: "Sicurezza Elettrica", tipoKind: "iec",
lastDate: lastIec.date, dueDate: due, days: Math.round((due - today) / 86400000) });
}
}
const lastFunc = lastOf(funcReports, a.id);
if (lastFunc) {
const mesi = parseInt(a.intervalFunc, 10) || 12;
const due = (lastFunc.nextDate ? new Date(lastFunc.nextDate) : addMonths(lastFunc.date, mesi));
if (due) {
due.setHours(0, 0, 0, 0);
out.push({ assetId: a.id, assetName: a.name, brand: a.brand, model: a.model, serial: a.serial,
customer: cust, tipo: "Verifica Funzionale", tipoKind: "func",
lastDate: lastFunc.date, dueDate: due, days: Math.round((due - today) / 86400000) });
}
}
});
return out.sort((a, b) => a.days - b.days);
}, [assets, iecReports, funcReports, customers]);
const newId = (prefix, list) => {
const nums = list.map(x => parseInt((x.id || "").replace(/\D/g, ""), 10)).filter(n => !isNaN(n));
const next = (nums.length ? Math.max(...nums) : 0) + 1;
return prefix + String(next).padStart(3, "0");
};
const generateInvoiceNumber = () => {
const year = new Date().getFullYear();
const existing = invoices.filter(i => { var _a; return (_a = i.number) === null || _a === void 0 ? void 0 : _a.includes("/" + (year)); }).length;
return (company.invoicePrefix || "F") + "-" + (String(existing + 1).padStart(4, "0")) + "/" + (year);
};
const saveAsset = f => {
if (checkLocked())
return;
if (modal.data) {
const rec = withUpdateMeta(Object.assign(Object.assign({}, f), { id: modal.data.id, createdAt: modal.data.createdAt }));
setAssets(a => upsertInList(a, rec));
}
else {
const nuovo = withCreateMeta(f);
if (!nuovo.assetCode) {
const cust = customers.find(c => c.id === nuovo.customerId);
const prefix = customerPrefix(cust ? cust.name : null);
nuovo.assetCode = nextAssetCode(prefix, assets);
}
setAssets(a => upsertInList(a, nuovo));
}
setModal(null);
showToast((f.name || "Apparecchio") + " salvato — lo trovi in cima alla lista");
};
const importRfidScan = rows => {
if (checkLocked())
return null;
const now = new Date().toISOString();
const byEpc = {};
(rows || []).forEach(r => { const e = String((r && r.epc) || "").trim().toUpperCase(); if (e) byEpc[e] = r; });
const matched = [];
const seen = {};
assets.forEach(a => { const e = String(a.epc || "").trim().toUpperCase(); if (e && byEpc[e]) { seen[e] = true; matched.push({ asset: a, read: byEpc[e] }); } });
const unknown = Object.keys(byEpc).filter(e => !seen[e]);
const updMap = {};
matched.forEach(m => { updMap[m.asset.id] = { lastLocation: (m.read.location || m.asset.lastLocation || ""), lastLocationDate: (m.read.date || now) }; });
if (matched.length)
setAssets(prev => prev.map(a => updMap[a.id] ? withUpdateMeta(Object.assign(Object.assign({}, a), updMap[a.id])) : a));
const crit = [];
matched.forEach(m => {
if (!m.asset.nextService) return;
const ns = new Date(m.asset.nextService);
if (isNaN(ns.getTime())) return;
const days = Math.round((ns.getTime() - Date.now()) / 86400000);
if (days < 0 || days <= 30) crit.push({ name: (m.asset.name || m.asset.assetCode || m.asset.id), location: (m.read.location || ""), days: days, nextService: m.asset.nextService, status: days < 0 ? "scaduta" : "in scadenza" });
});
crit.sort((a, b) => a.days - b.days);
const byLoc = {};
matched.forEach(m => { const l = m.read.location || "(senza reparto)"; if (!byLoc[l]) byLoc[l] = { total: 0, crit: 0 }; byLoc[l].total++; });
crit.forEach(c => { const l = c.location || "(senza reparto)"; if (byLoc[l]) byLoc[l].crit++; });
if (matched.length)
showToast(matched.length + " apparecchi aggiornati dalla scansione RFID");
return { when: now, total: (rows || []).length, updated: matched.length, unknown: unknown, crit: crit, byLoc: byLoc };
};
const reconSimulate = () => { const we = (assets || []).filter(a => a.epc); if (!we.length) { setReconInput("E20099AA00DEADBEEF000001 E20099AA00CAFEBABE000002"); showToast("Parco senza tag: generati 2 EPC di prova, premi Scansiona e associali", "#2dd4bf"); return; } let s = we.filter(() => Math.random() < 0.7); if (!s.length) s = we.slice(0, Math.min(5, we.length)); const lines = s.map(a => a.epc); lines.push("E20099AA00DEADBEEF000001"); setReconInput(lines.join("\n")); };
React.useEffect(() => { const onScan = (e) => { try { const rows = parseRfidScan(e.detail); if (rows.length) importRfidScan(rows); } catch (err) { } }; window.addEventListener("medtrace-rfid-scan", onScan); return () => window.removeEventListener("medtrace-rfid-scan", onScan); }, [assets]);
React.useEffect(() => { if (tab !== "ricognizione" && reconListening) { stopWedge(); setReconListening(false); } }, [tab, reconListening]);
React.useEffect(() => () => { stopWedge(); }, []);
const reconToggleListen = () => {
if (reconListening) {
const scan = stopWedge();
setReconListening(false);
if (scan && scan.epcs.length)
setReconInput(prev => { const cur = String(prev || "").trim(); return (cur ? cur + "\n" : "") + scan.epcs.join("\n"); });
return;
}
setReconLive(0); setReconLastEpc("");
const ok = startWedge((epc, n) => { setReconLive(n); setReconLastEpc(epc); const hit = (assets || []).find(x => isWardTag(x) && String(x.epc || "").trim().toUpperCase() === epc); if (hit) { setReconWard(hit.name || ""); showToast("Reparto: " + (hit.name || "")); } });
if (ok) { setReconListening(true); showToast("Ascolto attivo: spara col lettore (o digita EPC + Invio)"); }
};
const reconAssign = (a) => {
const epc = assocEpc;
if (!epc || !a) return;
if (checkLocked()) return;
const dup = (assets || []).find(x => x.id !== a.id && String(x.epc || "").trim().toUpperCase() === epc);
if (dup) { showToast("Tag gi\u00e0 associato a: " + (dup.name || dup.assetCode || dup.id), "#ef4444"); return; }
if (a.epc && String(a.epc).trim().toUpperCase() !== epc && !window.confirm("Ha gi\u00e0 il tag " + a.epc + ". Sostituire?")) return;
const ward = (reconResult && reconResult.applied) ? reconResult.applied : "";
const nowIso = new Date().toISOString();
const upd = ward ? { epc: epc, lastLocation: ward, lastLocationDate: nowIso } : { epc: epc };
setAssets(prev => prev.map(x => x.id === a.id ? withUpdateMeta(Object.assign(Object.assign({}, x), upd)) : x));
setReconResult(prev => {
if (!prev) return prev;
const aa = Object.assign(Object.assign({}, a), upd);
let days = null, status = "ok";
if (aa.nextService) { const ns = new Date(aa.nextService); if (!isNaN(ns.getTime())) { days = Math.round((ns.getTime() - Date.now()) / 86400000); status = days < 0 ? "scaduta" : (days <= 30 ? "scadenza" : "ok"); } }
return Object.assign(Object.assign({}, prev), { unknown: prev.unknown.filter(e => e !== epc), found: prev.found.concat([{ asset: aa, days: days, status: status }]) });
});
setAssocEpc(null);
showToast("Tag associato: " + (a.name || a.assetCode || a.id));
};
const reconAssignWard = (name) => {
const epc = assocEpc;
const nm = String(name || "").trim();
if (!epc || !nm) return;
if (checkLocked()) return;
const clash = (assets || []).find(x => String(x.epc || "").trim().toUpperCase() === epc);
if (clash) { showToast("EPC gi\u00e0 associato a: " + (clash.name || clash.assetCode || clash.id), "#ef4444"); return; }
const nuovo = withCreateMeta({ name: nm, brand: WARD_TAG_BRAND, epc: epc });
if (!nuovo.assetCode) nuovo.assetCode = nextAssetCode(customerPrefix(null), assets);
setAssets(prev => prev.concat([nuovo]));
setReconWard(nm);
setReconResult(prev => prev ? Object.assign(Object.assign({}, prev), { unknown: prev.unknown.filter(e => e !== epc) }) : prev);
setAssocEpc(null);
showToast("Tag-reparto creato: " + nm);
};
const reconScan = () => { const epcs = String(reconInput || "").split(/[^0-9A-Za-z]+/).map(e => e.trim().toUpperCase()).filter(Boolean); const uniq = Array.from(new Set(epcs)); const byEpc = {}; (assets || []).forEach(a => { const e = String(a.epc || "").trim().toUpperCase(); if (e) byEpc[e] = a; }); const found = []; const unknown = []; let wardFromTag = ""; uniq.forEach(e => { const a = byEpc[e]; if (a && isWardTag(a)) { if (!wardFromTag) wardFromTag = a.name || ""; } else if (a) found.push(a); else unknown.push(e); }); const ward = String(wardFromTag || reconWard || "").trim(); if (wardFromTag && wardFromTag !== reconWard) { setReconWard(wardFromTag); showToast("Reparto da tag: " + wardFromTag); } const nowIso = new Date().toISOString(); const now = Date.now(); const enr = found.map(a => { const aa = ward ? Object.assign(Object.assign({}, a), { lastLocation: ward, lastLocationDate: nowIso }) : a; let days = null, status = "ok"; if (aa.nextService) { const ns = new Date(aa.nextService); if (!isNaN(ns.getTime())) { days = Math.round((ns.getTime() - now) / 86400000); status = days < 0 ? "scaduta" : (days <= 30 ? "scadenza" : "ok"); } } return { asset: aa, days: days, status: status }; }); const rk = x => x.status === "scaduta" ? 0 : x.status === "scadenza" ? 1 : 2; enr.sort((x, y) => rk(x) - rk(y) || ((x.days == null ? 9e9 : x.days) - (y.days == null ? 9e9 : y.days))); if (ward && found.length && !DEMO_LOCKED) { const ids = {}; found.forEach(a => { ids[a.id] = true; }); setAssets(prev => prev.map(a => ids[a.id] ? withUpdateMeta(Object.assign(Object.assign({}, a), { lastLocation: ward, lastLocationDate: nowIso })) : a)); showToast(found.length + " apparecchi \u00b7 " + ward); } let missing = []; if (ward) { const fid = {}; found.forEach(a => { fid[a.id] = true; }); missing = (assets || []).filter(a => !fid[a.id] && !isWardTag(a) && (String(a.lastLocation || "") === ward || (!a.lastLocation && String(a.location || "") === ward))); } setReconResult({ when: nowIso, scanned: uniq.length, found: enr, unknown: unknown, missing: missing, applied: (ward && found.length) ? ward : "" }); };
const importAssets = (records) => {
if (checkLocked())
return false;
setAssets(a => { let out = a; for (const r of records)
out = upsertInList(out, r); return out; });
showToast(records.length + (records.length === 1 ? " apparecchio importato" : " apparecchi importati"));
return true;
};
const SETTER_PER_TIPO = {
assets: setAssets, parts: setParts, jobs: setJobs, orders: setOrders, withdrawals: setWDs,
customers: setCustomers, invoices: setInvoices, quotes: setQuotes, instruments: setInstruments,
procedures: setProcedures, iecReports: setIecReports, funcReports: setFuncReports, recalls: setRecalls
};
const moveToTrash = (tipo, record) => {
if (!record)
return;
const trashed = Object.assign(Object.assign({}, record), { deleted: true, deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
setCestino(c => (Object.assign(Object.assign({}, c), { [tipo]: [...(c[tipo] || []), trashed] })));
};
const restoreFromTrash = (tipo, id) => {
const rec = ((cestino[tipo]) || []).find(r => r.id === id);
if (!rec)
return;
const restored = Object.assign(Object.assign({}, rec), { deleted: false, deletedAt: null, updatedAt: new Date().toISOString() });
const setter = SETTER_PER_TIPO[tipo];
if (setter)
setter(arr => upsertInList(arr || [], restored));
setCestino(c => (Object.assign(Object.assign({}, c), { [tipo]: (c[tipo] || []).filter(r => r.id !== id) })));
showToast("Ripristinato");
};
const purgeFromTrash = (tipo, id) => {
const adesso = new Date().toISOString();
setCestino(c => (Object.assign(Object.assign({}, c), { [tipo]: (c[tipo] || []).map(r => r.id === id ? { id: r.id, deleted: true, purged: true, deletedAt: (r.deletedAt || adesso), updatedAt: adesso } : r) })));
supabaseDeleteById(tipo, id);
showToast("Eliminato definitivamente", "#ef4444");
};
const delAsset = id => { if (checkLocked())
return; appConfirm("Spostare questo apparecchio nel cestino?", () => { const r = assets.find(x => x.id === id); moveToTrash("assets", r); setAssets(a => a.filter(x => x.id !== id)); showToast("Spostato nel cestino", "#f59e0b"); }); };
const savePart = f => {
if (checkLocked())
return;
if (modal.data) {
const rec = withUpdateMeta(Object.assign(Object.assign({}, f), { id: modal.data.id, createdAt: modal.data.createdAt }));
setParts(p => upsertInList(p, rec));
}
else {
setParts(p => upsertInList(p, withCreateMeta(f)));
}
setModal(null);
showToast("Parte salvata");
};
const delPart = id => { if (checkLocked())
return; appConfirm("Spostare questo ricambio nel cestino?", () => { const r = parts.find(x => x.id === id); moveToTrash("parts", r); setParts(p => p.filter(x => x.id !== id)); showToast("Spostato nel cestino", "#f59e0b"); }); };
const [richieste, setRichieste] = React.useState([]);
const loadRichieste = () => __awaiter(this, void 0, void 0, function* () {
if (OFFLINE_MODE)
return;
try {
const rows = yield supaDB.getAll("richieste");
setRichieste(rows || []);
}
catch (e) { }
});
React.useEffect(() => { loadRichieste(); }, []);
React.useEffect(() => { if (tab === "richieste")
loadRichieste(); }, [tab]);
const convertRichiesta = (req) => __awaiter(this, void 0, void 0, function* () {
if (checkLocked && checkLocked())
return;
const prio = req.urgency === "fermo_macchina" ? "urgente" : (req.urgency === "urgente" ? "alta" : "normale");
const job = withCreateMeta({ assetId: req.asset_id || "", customerId: req.customer_id || "", type: "correttiva", priority: prio, status: "da accettare", assignee: "", openDate: new Date().toISOString().slice(0, 10), closeDate: "", description: req.description || "", parts: [], laborHours: 0, laborRate: 55, travelCost: 0, notes: req.contact ? ("Richiesta dal portale cliente. Contatto: " + req.contact) : "Richiesta dal portale cliente.", timeline: [], photos: req.photo ? [req.photo] : [] });
setJobs(j => upsertInList(j, job));
try {
yield supaDB.update("richieste", req.id, { status: "convertita" });
}
catch (e) { }
yield loadRichieste();
showToast("Job creato (stato: da accettare) ✓", "#22c55e");
});
const saveJob = f => {
if (checkLocked())
return;
const oldStatus = modal.data ? modal.data.status : null;
const diventaChiuso = oldStatus !== "chiuso" && f.status === "chiuso";
const tornaAperto = oldStatus === "chiuso" && f.status !== "chiuso";
if (diventaChiuso && (f.parts || []).length > 0) {
setParts(ps => ps.map(pt => {
const used = (f.parts || []).filter(p => p.partId === pt.id).reduce((s, p) => s + (+p.qty || 0), 0);
return used > 0 ? Object.assign(Object.assign({}, pt), { qty: (+pt.qty || 0) - used, updatedAt: new Date().toISOString() }) : pt;
}));
}
else if (tornaAperto && (modal.data.parts || []).length > 0) {
setParts(ps => ps.map(pt => {
const used = (modal.data.parts || []).filter(p => p.partId === pt.id).reduce((s, p) => s + (+p.qty || 0), 0);
return used > 0 ? Object.assign(Object.assign({}, pt), { qty: (+pt.qty || 0) + used, updatedAt: new Date().toISOString() }) : pt;
}));
}
if (modal.data) {
const rec = withUpdateMeta(Object.assign(Object.assign({}, f), { id: modal.data.id, createdAt: modal.data.createdAt }));
setJobs(j => upsertInList(j, rec));
}
else {
setJobs(j => upsertInList(j, withCreateMeta(Object.assign(Object.assign({}, f), { timeline: f.timeline || [], photos: f.photos || [] }))));
}
setModal(null);
if (diventaChiuso && (f.parts || []).length > 0)
showToast("Job chiuso — parti scaricate dal magazzino", "#22c55e");
else if (tornaAperto && (modal.data.parts || []).length > 0)
showToast("Job riaperto — parti rimesse in magazzino", "#f59e0b");
else
showToast("Job salvato");
};
const delJob = id => { if (checkLocked())
return; appConfirm("Spostare questo job nel cestino?", () => { const r = jobs.find(x => x.id === id); moveToTrash("jobs", r); setJobs(j => j.filter(x => x.id !== id)); showToast("Spostato nel cestino", "#f59e0b"); }); };
const saveTimeline = (jobId, data) => {
setJobs(js => js.map(j => j.id === jobId ? withUpdateMeta(Object.assign(Object.assign({}, j), { timeline: data.timeline, photos: data.photos })) : j));
setModal(null);
showToast("Timeline salvata");
};
const saveCustomer = f => {
if (checkLocked())
return;
if (modal.data) {
const rec = withUpdateMeta(Object.assign(Object.assign({}, f), { id: modal.data.id, createdAt: modal.data.createdAt }));
setCustomers(c => upsertInList(c, rec));
}
else {
setCustomers(c => upsertInList(c, withCreateMeta(f)));
}
setModal(null);
showToast("Cliente salvato");
};
const delCustomer = id => {
if (checkLocked())
return;
if (assets.some(a => a.customerId === id)) {
alert("Non puoi spostare nel cestino: ci sono apparecchi associati a questo cliente.");
return;
}
appConfirm("Spostare questo cliente nel cestino?", () => {
const r = customers.find(x => x.id === id);
moveToTrash("customers", r);
setCustomers(c => c.filter(x => x.id !== id));
showToast("Spostato nel cestino", "#f59e0b");
});
};
const saveInvoice = f => {
if (checkLocked())
return;
if (modal.data) {
const rec = withUpdateMeta(Object.assign(Object.assign({}, f), { id: modal.data.id, createdAt: modal.data.createdAt }));
setInvoices(i => upsertInList(i, rec));
}
else {
setInvoices(i => upsertInList(i, withCreateMeta(f)));
}
setModal(null);
showToast("Preventivo salvato");
};
const quoteFromJob = (job) => {
if (!job)
return;
const asset = assets.find(a => a.id === job.assetId);
const items = [];
(job.parts || []).forEach(p => {
const pt = parts.find(x => x.id === p.partId);
if (pt)
items.push({ description: (pt.name || "Ricambio") + (pt.code ? (" (" + pt.code + ")") : ""), qty: p.qty || 1, unitPrice: pt.sellPrice || pt.unitPrice || 0, vat: IVA_DEFAULT });
});
if (+job.laborHours > 0) {
items.push({ description: "Manodopera - " + ((asset === null || asset === void 0 ? void 0 : asset.name) || "intervento") + " (rif. " + job.id + ")", qty: +job.laborHours, unitPrice: +job.laborRate || 0, vat: IVA_DEFAULT });
}
if (+job.travelCost > 0) {
items.push({ description: "Viaggio / trasferta (rif. " + job.id + ")", qty: 1, unitPrice: +job.travelCost, vat: IVA_DEFAULT });
}
const prefill = {
customerId: job.customerId || (asset === null || asset === void 0 ? void 0 : asset.customerId) || "",
items,
jobIds: [job.id],
};
pushModal({ type: "invoice", data: null, prefillFromJob: prefill });
if (items.length === 0)
showToast("Job senza parti/manodopera/viaggio — preventivo vuoto da compilare", "#f59e0b");
};
const delInvoice = id => { if (checkLocked())
return; appConfirm("Spostare questo preventivo nel cestino?", () => { const r = invoices.find(x => x.id === id); moveToTrash("invoices", r); setInvoices(i => i.filter(x => x.id !== id)); showToast("Spostato nel cestino", "#f59e0b"); }); };
const markInvoicePaid = inv => {
setInvoices(is => is.map(i => i.id === inv.id ? Object.assign(Object.assign({}, i), { status: "pagata" }) : i));
showToast("Preventivo pagato");
};
const saveOrder = f => {
var _a;
if (checkLocked())
return;
const isReceivedNow = f.status === "ricevuto" && ((_a = modal === null || modal === void 0 ? void 0 : modal.data) === null || _a === void 0 ? void 0 : _a.status) !== "ricevuto";
if (modal === null || modal === void 0 ? void 0 : modal.data) {
const rec = withUpdateMeta(Object.assign(Object.assign({}, f), { id: modal.data.id, createdAt: modal.data.createdAt }));
setOrders(o => upsertInList(o, rec));
}
else {
setOrders(o => upsertInList(o, withCreateMeta(f)));
}
if (isReceivedNow) {
setParts(ps => ps.map(p => p.id === f.partId ? Object.assign(Object.assign({}, p), { qty: p.qty + f.qty }) : p));
showToast("Ordine ricevuto — stock +" + (f.qty) + " pz.");
}
else
showToast("Ordine salvato");
setModal(null);
};
const delOrder = id => { if (checkLocked())
return; appConfirm("Spostare questo ordine nel cestino?", () => { const r = orders.find(x => x.id === id); moveToTrash("orders", r); setOrders(o => o.filter(x => x.id !== id)); showToast("Spostato nel cestino", "#f59e0b"); }); };
const quickReceive = o => {
setOrders(os => os.map(x => x.id === o.id ? Object.assign(Object.assign({}, x), { status: "ricevuto" }) : x));
setParts(ps => ps.map(p => p.id === o.partId ? Object.assign(Object.assign({}, p), { qty: p.qty + o.qty }) : p));
showToast("Ordine ricevuto — stock +" + (o.qty) + " pz.");
};
const setReportPublished = (kind, id, value) => {
if (checkLocked())
return;
const lista = kind === "iec" ? iecReports : funcReports;
const rec = lista.find(r => r.id === id);
if (!rec)
return;
const updated = withUpdateMeta(Object.assign(Object.assign({}, rec), { published: value }));
if (kind === "iec")
setIecReports(rs => rs.map(r => r.id === id ? updated : r));
else
setFuncReports(rs => rs.map(r => r.id === id ? updated : r));
supabasePushOne(kind === "iec" ? "iecReports" : "funcReports", updated).then(ok => {
if (value)
showToast(ok ? "\uD83D\uDCE4 Pubblicato: il cliente lo vede nel portale" : "Pubblicato in locale — arriva al cliente alla prossima Sincronizza", ok ? "#22c55e" : "#f59e0b");
else
showToast(ok ? "Ritirato dal portale" : "Ritirato in locale — effettivo alla prossima Sincronizza", "#f59e0b");
});
};
const saveIecReport = f => {
if (checkLocked())
return;
var _ppmLink = modal && modal.ppmLink;
const isNew = !(f.id && iecReports.some(r => r.id === f.id));
const wasPublished = !isNew && (iecReports.find(r => r.id === f.id) || {}).published === true;
const savedReport = isNew ? withCreateMeta(Object.assign(Object.assign({}, f), { published: false })) : withUpdateMeta(Object.assign(Object.assign({}, f), { published: false }));
if (wasPublished)
showToast("Il verbale è tornato in bozza: ripubblicalo quando confermi", "#f59e0b");
const reportId = savedReport.id;
if (isNew) {
const asset = assets.find(a => a.id === f.assetId) || {};
const normLabel = f.norm === "61010" ? "IEC 61010-1" : "IEC 62353";
if (f.verifyStatus !== "non_disponibile" && f.overallPass === false) {
const corrJob = withCreateMeta({
id: genUUID(),
assetId: f.assetId,
customerId: f.customerId || asset.customerId || "",
type: "correttiva",
priority: "alta",
status: "aperto",
assignee: "",
openDate: f.date || new Date().toISOString().slice(0, 10),
closeDate: "",
description: "Verifica di Sicurezza Elettrica " + normLabel + " non conforme — da correggere",
notes: (f.reportNumber ? "Rif. rapporto: " + f.reportNumber + ". " : "") + "Generata automaticamente dalla verifica non conforme.",
parts: [],
laborHours: 0,
laborRate: 55,
timeline: [],
photos: [],
iecReportId: reportId,
});
setJobs(js => [...js, corrJob]);
showToast("⚠ Verifica NON CONFORME — creata manutenzione correttiva (nei Job, stato Aperto)");
}
const isExtraordinary = f.verifyType === "straordinaria";
const isNotAvail = f.verifyStatus === "non_disponibile";
if (isNotAvail) {
showToast("Verifica non eseguibile registrata — la scadenza resta invariata (apparecchio non verificato)");
}
else if (!isExtraordinary) {
const asset2 = assets.find(a => a.id === f.assetId) || {};
const mesi = parseInt(asset2.intervalIec || asset2.serviceInterval || 12, 10) || 12;
const verDate = new Date(f.date || new Date());
verDate.setMonth(verDate.getMonth() + mesi);
const nextServiceDate = verDate.toISOString().slice(0, 10);
setAssets(as => as.map(a => a.id === f.assetId ? Object.assign(Object.assign({}, a), { lastService: f.date || new Date().toISOString().slice(0, 10), nextService: nextServiceDate }) : a));
showToast("Verifica di Sicurezza Elettrica salvata · Prossima: " + nextServiceDate);
}
else {
setAssets(as => as.map(a => a.id === f.assetId ? Object.assign(Object.assign({}, a), { lastService: f.date || new Date().toISOString().slice(0, 10) }) : a));
showToast("Verifica straordinaria salvata (pianificazione invariata)");
}
if (f.verifyStatus !== "non_disponibile" && f.overallPass === false) {
showToast("⚠ Verifica NON CONFORME — creata richiesta di manutenzione correttiva (la trovi nei Job, stato Aperto)");
}
}
else {
showToast("Rapporto di sicurezza elettrica aggiornato");
}
if (isNew) {
setIecReports(rs => [...rs, savedReport]);
}
else {
setIecReports(rs => rs.map(r => r.id === reportId ? savedReport : r));
}
if (_ppmLink) {
setPpmReports(rs => rs.map(r => r.id === _ppmLink ? withUpdateMeta(Object.assign(Object.assign({}, r), { iecReportId: reportId })) : r));
showToast("VSE collegata alla PPM", "#2dd4bf");
popModal();
}
else if (isNew) {
if (company.stickerPrompt) {
appConfirm("Verifica salvata! Vuoi stampare lo sticker QR da applicare sull'apparecchio?", () => {
setModal({ type: "sticker", data: savedReport, kind: "iec" });
}, 'positive');
}
else if (f.verifyStatus !== "non_disponibile") {
const _aid = f.assetId;
setModal(null);
appConfirm("Verifica elettrica salvata. Vuoi fare anche la verifica funzionale su questo apparecchio?", () => setModal({ type: "func", assetId: _aid, data: null }), 'positive');
}
else {
setModal(null);
}
}
else {
setModal(null);
}
};
const delIecReport = id => { if (checkLocked())
return; appConfirm("Spostare questa verifica di sicurezza elettrica nel cestino?", () => { const r = iecReports.find(x => x.id === id); moveToTrash("iecReports", r); setIecReports(rs => rs.filter(r => r.id !== id)); showToast("Spostato nel cestino", "#f59e0b"); }); };
const saveFuncReport = f => {
if (checkLocked())
return;
var _ppmLink = modal && modal.ppmLink;
/* auto-set prossima verifica da intervallo del template (es. B.Braun TSC = 24 mesi) */
if (f && f.date && !f.nextDate) { var _ti = (allTemplates[f.templateId] && parseInt(allTemplates[f.templateId].intervalMonths, 10)) || 0; if (_ti > 0) { var _nd = new Date(f.date); if (!isNaN(_nd.getTime())) { _nd.setMonth(_nd.getMonth() + _ti); f = Object.assign(Object.assign({}, f), { nextDate: _nd.toISOString().slice(0, 10) }); } } }
const isNew = !(f.id && funcReports.some(r => r.id === f.id));
if (!isNew) {
const wasPublished = (funcReports.find(r => r.id === f.id) || {}).published === true;
const upd = withUpdateMeta(Object.assign(Object.assign({}, f), { published: false }));
setFuncReports(rs => rs.map(r => r.id === f.id ? upd : r));
if (wasPublished)
showToast("Il verbale è tornato in bozza: ripubblicalo quando confermi", "#f59e0b");
}
else {
const saved = withCreateMeta(Object.assign(Object.assign({}, f), { published: false }));
const rid = saved.id;
const asset = assets.find(a => a.id === f.assetId) || {};
const tpl = allTemplates[f.templateId] || allTemplates["generico"];
setFuncReports(rs => [...rs, saved]);
if (f.verifyStatus !== "non_disponibile" && f.overallPass === false) {
setJobs(js => [...js, withCreateMeta({
id: genUUID(), assetId: f.assetId,
customerId: f.customerId || asset.customerId || "",
type: "correttiva", priority: "alta", status: "aperto",
assignee: "",
openDate: f.date || new Date().toISOString().slice(0, 10),
closeDate: "",
description: "Verifica Funzionale (" + tpl.label + ") non conforme — da correggere",
notes: (f.reportNumber ? "Rif.: " + f.reportNumber + ". " : "") + "Generata automaticamente dalla verifica non conforme.",
parts: [], laborHours: 0, laborRate: 55, timeline: [], photos: [],
funcReportId: rid,
})]);
showToast("⚠ Verifica NON CONFORME — creata richiesta di manutenzione correttiva (nei Job, stato Aperto)");
}
else {
showToast("Verifica funzionale salvata");
}
if (_ppmLink) {
setPpmReports(rs => rs.map(r => r.id === _ppmLink ? withUpdateMeta(Object.assign(Object.assign({}, r), { funcReportId: saved.id })) : r));
showToast("Funzionale collegata alla PPM", "#2dd4bf");
popModal();
}
else if (company.stickerPrompt) {
appConfirm("Verifica salvata! Vuoi stampare lo sticker QR da applicare sull'apparecchio?", () => {
setModal({ type: "sticker", data: saved, kind: "func" });
}, 'positive');
}
else if (f.verifyStatus !== "non_disponibile") {
const _aid = f.assetId;
setModal(null);
appConfirm("Verifica funzionale salvata. Vuoi fare anche la verifica di sicurezza elettrica su questo apparecchio?", () => setModal({ type: "iec", assetId: _aid, data: null }), 'positive');
}
else {
setModal(null);
}
return;
}
if (_ppmLink) { setPpmReports(rs => rs.map(r => r.id === _ppmLink ? withUpdateMeta(Object.assign(Object.assign({}, r), { funcReportId: f.id })) : r)); showToast("Funzionale collegata alla PPM", "#2dd4bf"); popModal(); }
else { setModal(null); showToast("Rapporto funzionale aggiornato"); }
};
const saveCustomTemplate = (tpl) => {
if (checkLocked())
return;
setCustomTemplates(prev => (Object.assign(Object.assign({}, prev), { [tpl.id]: tpl })));
setModal({ type: "templateManager" });
showToast("✓ Template salvato");
};
const deleteCustomTemplate = (id) => {
if (checkLocked())
return;
if (!confirm("Eliminare questo template? Le verifiche già fatte con questo template restano invariate."))
return;
setCustomTemplates(prev => { const c = Object.assign({}, prev); delete c[id]; return c; });
showToast("Template eliminato", "#ef4444");
};
const duplicateAsset = a => {
const clone = Object.assign({}, a);
delete clone.id;
clone.name = (a.name || "") + " (copia)";
pushModal({ type: "asset", data: clone });
};
const duplicatePart = p => {
const clone = Object.assign({}, p);
delete clone.id;
clone.code = (p.code || "") + "-COPIA";
clone.qty = 0;
pushModal({ type: "part", data: clone });
};
const duplicateJob = j => {
const clone = Object.assign({}, j);
delete clone.id;
clone.openDate = new Date().toISOString().slice(0, 10);
clone.closeDate = "";
clone.status = "aperto";
clone.timeline = [];
clone.photos = [];
pushModal({ type: "job", data: clone });
};
const duplicateIec = r => {
const clone = Object.assign({}, r);
delete clone.id;
delete clone.reportNumber;
clone.date = new Date().toISOString().slice(0, 10);
if (clone.measures)
clone.measures = clone.measures.map(m => (Object.assign(Object.assign({}, m), { value: "" })));
clone.overallPass = null;
clone.techSignature = "";
clone.deptSignature = "";
pushModal({ type: "iec", data: clone, assetId: clone.assetId });
};
const duplicateFunc = r => {
const clone = Object.assign({}, r);
delete clone.id;
delete clone.reportNumber;
clone.date = new Date().toISOString().slice(0, 10);
if (clone.sections) {
const newSections = {};
Object.entries(clone.sections).forEach(([secId, sec]) => {
newSections[secId] = {
items: {},
measures: {},
};
});
clone.sections = newSections;
}
clone.techSignature = "";
clone.deptSignature = "";
pushModal({ type: "func", data: clone, assetId: clone.assetId });
};
const duplicateCustomer = c => {
const clone = Object.assign({}, c);
delete clone.id;
clone.name = (c.name || "") + " (copia)";
pushModal({ type: "customer", data: clone });
};
const delFuncReport = id => { if (checkLocked())
return; appConfirm("Spostare questa verifica funzionale nel cestino?", () => { const r = funcReports.find(x => x.id === id); moveToTrash("funcReports", r); setFuncReports(rs => rs.filter(r => r.id !== id)); showToast("Spostato nel cestino", "#f59e0b"); }); };
const savePpmFull = (p) => {
if (checkLocked()) return;
const today = p.date || new Date().toISOString().slice(0, 10);
const asset = assets.find(a => a.id === p.assetId) || null;
const customer = asset ? (customers.find(c => c.id === asset.customerId) || null) : null;
const cid = asset ? asset.customerId : null;
const ts = Date.now().toString();
const tpl = allTemplates[p.templateId] || null;
let funcNext = null;
if (tpl && tpl.intervalMonths) { const d = new Date(today); if (!isNaN(d.getTime())) { d.setMonth(d.getMonth() + (parseInt(tpl.intervalMonths, 10) || 0)); funcNext = d.toISOString().slice(0, 10); } }
const funcRep = withCreateMeta({ id: "FV" + ts.slice(-9), reportNumber: getNextReportNumber(funcReports, "VF"), assetId: p.assetId, customerId: cid, templateId: p.templateId, date: today, technician: p.technician || "", sections: p.funcSections || {}, overallPass: !!p.funcPass, verifyStatus: "completata", verifyType: "periodica", nextDate: funcNext, notes: "", technicianSignature: p.technicianSignature || "", departmentSignature: p.departmentSignature || "", published: true });
const iecRep = withCreateMeta({ id: "R" + ts.slice(-7), reportNumber: getNextReportNumber(iecReports, "VSE"), assetId: p.assetId, customerId: cid, date: today, technician: p.technician || "", norm: p.iecConfig.norm, equipClass: p.iecConfig.equipClass, patientType: p.iecConfig.patientType, leakageMethod: p.iecConfig.leakageMethod, verifyType: "periodica", verifyStatus: "completata", measures: p.iecMeasures || [], visual: { housing: null, cable: null, connectors: null, labels: null, docs: null }, overallPass: !!p.vsePass, notes: "", technicianSignature: p.technicianSignature || "", departmentSignature: p.departmentSignature || "", published: true });
const ppm = withCreateMeta({ id: "PPM" + ts.slice(-6), reportNumber: getNextReportNumber(ppmReports, "PPM"), assetId: p.assetId, customerId: cid, date: today, technician: p.technician || "", items: p.maint || [], categoryId: p.categoryId, overallPass: !!p.overall, notes: p.notes || "", funcReportId: funcRep.id, iecReportId: iecRep.id, technicianSignature: p.technicianSignature || "", departmentSignature: p.departmentSignature || "", published: true });
setFuncReports(rs => [...rs, funcRep]);
setIecReports(rs => [...rs, iecRep]);
setPpmReports(rs => [...rs, ppm]);
if (asset) {
setAssets(as => as.map(a => {
if (a.id !== p.assetId) return a;
const u = Object.assign({}, a);
const im = parseInt(a.intervalIec || a.serviceInterval || 12, 10) || 12; const di = new Date(today); di.setMonth(di.getMonth() + im); u.lastService = today; u.nextService = di.toISOString().slice(0, 10);
const pm = parseInt(a.intervalPpm, 10) || 12; const dp = new Date(today); dp.setMonth(dp.getMonth() + pm); u.lastPpm = today; u.nextPpm = dp.toISOString().slice(0, 10);
return withUpdateMeta(u);
}));
}
showToast("Manutenzione programmata completata · esito " + (p.overall ? "conforme" : "NON conforme"), p.overall ? "#2dd4bf" : "#f59e0b");
popModal();
try { generatePPMPDF(ppm, asset || {}, customer || {}, company, allTemplates, funcRep, iecRep); } catch (e) { }
};
const savePpmReport = f => {
if (checkLocked())
return;
const isNew = !(f.id && ppmReports.some(r => r.id === f.id));
if (!isNew) {
setPpmReports(rs => rs.map(r => r.id === f.id ? withUpdateMeta(Object.assign({}, f)) : r));
showToast("Manutenzione programmata salvata", "#2dd4bf");
popModal();
}
else {
const saved = withCreateMeta(Object.assign({}, f));
setPpmReports(rs => [...rs, saved]);
const asset = assets.find(a => a.id === f.assetId);
if (asset && f.date) { var _mm = parseInt(asset.intervalPpm, 10) || 12; var _nd = new Date(f.date); if (!isNaN(_nd.getTime())) { _nd.setMonth(_nd.getMonth() + _mm); var _rec = withUpdateMeta(Object.assign(Object.assign({}, asset), { lastPpm: f.date, nextPpm: _nd.toISOString().slice(0, 10) })); setAssets(a => upsertInList(a, _rec)); } }
showToast("Checklist salvata \u2014 esegui/collega funzionale e VSE qui sotto", "#2dd4bf");
setModal({ type: "ppm", data: saved });
}
};
const delPpmReport = id => { if (checkLocked())
return; appConfirm("Spostare questa manutenzione programmata nel cestino?", () => { const r = ppmReports.find(x => x.id === id); moveToTrash("ppmReports", r); setPpmReports(rs => rs.filter(r => r.id !== id)); showToast("Spostato nel cestino", "#f59e0b"); }); };
const linkPpmReport = (id, patch) => { if (checkLocked()) return; setPpmReports(rs => rs.map(r => r.id === id ? withUpdateMeta(Object.assign(Object.assign({}, r), patch)) : r)); showToast("Verifica collegata alla PPM", "#2dd4bf"); };
const openPpmPdf = (ppm) => { const a = assets.find(x => x.id === ppm.assetId) || {}; const c = customers.find(x => x.id === a.customerId) || {}; const fr = ppm.funcReportId ? funcReports.find(r => r.id === ppm.funcReportId) : null; const ir = ppm.iecReportId ? iecReports.find(r => r.id === ppm.iecReportId) : null; generatePPMPDF(ppm, a, c, company, allTemplates, fr, ir); };
const handleWithdraw = data => {
if (checkLocked())
return;
setParts(ps => ps.map(p => { const r = data.items.find(x => x.partId === p.id); return r ? Object.assign(Object.assign({}, p), { qty: p.qty - r.qty }) : p; }));
setWDs(w => { const rec = withCreateMeta(data); return [rec, ...w]; });
setModal(null);
showToast("Scarico — €" + (data.total.toFixed(2)));
};
const mergeById = (locali, remoti) => {
const map = new Map();
(locali || []).forEach(r => { if (r && r.id != null)
map.set(r.id, r); });
(remoti || []).forEach(r => {
if (!r || r.id == null)
return;
const esistente = map.get(r.id);
if (!esistente) {
map.set(r.id, r);
return;
}
const tLoc = Date.parse(esistente.updatedAt || esistente.createdAt || 0) || 0;
const tRem = Date.parse(r.updatedAt || r.createdAt || 0) || 0;
map.set(r.id, tRem >= tLoc ? r : esistente);
});
return [...map.values()];
};
const handleCloudPull = (remote, remoteTrash) => {
if (checkLocked())
return;
const applica = (remoteArr, trashArr, setter) => {
if (!remoteArr && !trashArr)
return;
const trashIds = new Set((trashArr || []).map(r => r.id));
const attivi = (remoteArr || []).filter(r => !trashIds.has(r.id));
setter(attivi);
};
const rt = remoteTrash || {};
applica(remote.assets, rt.assets, setAssets);
applica(remote.parts, rt.parts, setParts);
applica(remote.jobs, rt.jobs, setJobs);
applica(remote.orders, rt.orders, setOrders);
applica(remote.withdrawals, rt.withdrawals, setWDs);
applica(remote.customers, rt.customers, setCustomers);
applica(remote.invoices, rt.invoices, setInvoices);
applica(remote.quotes, rt.quotes, setQuotes);
applica(remote.instruments, rt.instruments, setInstruments);
applica(remote.procedures, rt.procedures, setProcedures);
applica(remote.iecReports, rt.iecReports, setIecReports);
applica(remote.funcReports, rt.funcReports, setFuncReports);
if (remoteTrash)
setCestino(prev => (Object.assign(Object.assign(Object.assign({}, CESTINO_VUOTO), prev), remoteTrash)));
showToast("☁ Dati uniti dal cloud (nessun dato perso)");
};
const handleImport = data => {
if (checkLocked())
return;
try {
const n = (data.assets || []).length;
setAssets(Array.isArray(data.assets) ? data.assets : []);
setParts(Array.isArray(data.parts) ? data.parts : []);
setJobs(Array.isArray(data.jobs) ? data.jobs : []);
setOrders(Array.isArray(data.orders) ? data.orders : []);
setWDs(Array.isArray(data.withdrawals) ? data.withdrawals : []);
setCustomers(Array.isArray(data.customers) ? data.customers : []);
setInvoices(Array.isArray(data.invoices) ? data.invoices : []);
setQuotes(Array.isArray(data.quotes) ? data.quotes : []);
setInstruments(Array.isArray(data.instruments) ? data.instruments : []);
setProcedures(Array.isArray(data.procedures) ? data.procedures : []);
setIecReports(Array.isArray(data.iecReports) ? data.iecReports : []);
setFuncReports(Array.isArray(data.funcReports) ? data.funcReports : []);
if (data.company)
setCompany(c => (Object.assign(Object.assign({}, c), data.company)));
if (data.customTemplates)
setCustomTemplates(data.customTemplates);
setModal(null);
showToast("✓ Backup importato: " + n + " apparecchi caricati");
}
catch (err) {
showToast("✗ Errore import: " + ((err === null || err === void 0 ? void 0 : err.message) || "imprevisto"));
}
};
const handleMerge = data => {
if (checkLocked())
return;
const mergeArr = (existing, incoming, idField = 'id') => {
if (!incoming || !incoming.length)
return existing;
const existingIds = new Set(existing.map(x => x[idField]));
const newItems = incoming.filter(x => !existingIds.has(x[idField]));
return [...existing, ...newItems];
};
setAssets(prev => mergeArr(prev, data.assets));
setParts(prev => mergeArr(prev, data.parts));
setJobs(prev => mergeArr(prev, data.jobs));
setOrders(prev => mergeArr(prev, data.orders));
setWDs(prev => mergeArr(prev, data.withdrawals));
setCustomers(prev => mergeArr(prev, data.customers));
setInvoices(prev => mergeArr(prev, data.invoices));
setQuotes(prev => mergeArr(prev, data.quotes));
setInstruments(prev => mergeArr(prev, data.instruments));
setProcedures(prev => mergeArr(prev, data.procedures));
setIecReports(prev => mergeArr(prev, data.iecReports));
setFuncReports(prev => mergeArr(prev, data.funcReports));
if (data.customTemplates)
setCustomTemplates(prev => (Object.assign(Object.assign({}, data.customTemplates), (prev || {}))));
setModal(null);
showToast("✓ Backup unito — nuovi record aggiunti senza sovrascrivere");
};
const handleReset = () => {
if (checkLocked())
return;
appConfirm("⚠ ATTENZIONE — Stai per cancellare TUTTI i dati:\n\n• Apparecchi, Clienti, Job\n• Verifiche di sicurezza elettrica e funzionali\n• Strumenti, Procedure\n• Magazzino, Ordini, Scarichi\n• Preventivi\n\nL'operazione è IRREVERSIBILE.\n\nProcedere?", () => {
appConfirm("Confermi davvero? Tutti i dati saranno persi.", () => {
appPromptCb('Per confermare, scrivi la parola: CANCELLA', (val) => {
if (val !== 'CANCELLA') {
showToast("Reset annullato", "var(--text-2)");
return;
}
setAssets([]);
setParts([]);
setJobs([]);
setOrders([]);
setWDs([]);
setCustomers([]);
setInvoices([]);
setQuotes([]);
setInstruments([]);
setProcedures([]);
setIecReports([]);
setFuncReports([]);
setModal(null);
showToast("Sistema completamente azzerato", "#ef4444");
});
});
});
};
const exportAssets = () => downloadXLSX("medtrace_apparecchi.xlsx", assets.map(a => { var _a; return (Object.assign(Object.assign({}, a), { cliente: ((_a = customers.find(c => c.id === a.customerId)) === null || _a === void 0 ? void 0 : _a.name) || "" })); }), [{ key: "id", label: "ID" }, { key: "name", label: "Nome" }, { key: "brand", label: "Marca" }, { key: "model", label: "Modello" }, { key: "serial", label: "N.Serie" }, { key: "civab", label: "CIVAB" }, { key: "cnd", label: "CND" }, { key: "emdn", label: "EMDN" }, { key: "location", label: "Ubicazione" }, { key: "lastLocation", label: "Ultima posizione (scan)" }, { key: "lastLocationDate", label: "Data ultima posizione" }, { key: "cliente", label: "Cliente" }, { key: "status", label: "Stato" }, { key: "lastService", label: "Ultimo Serv." }, { key: "nextService", label: "Prossimo Serv." }, { key: "notes", label: "Note" }]);
const exportParts = () => downloadXLSX("medtrace_parti.xlsx", parts.map(p => (Object.assign(Object.assign({}, p), { compatibile: (p.compatible || []).map(id => { var _a; return ((_a = assets.find(a => a.id === id)) === null || _a === void 0 ? void 0 : _a.name) || id; }).join(", ") }))), [{ key: "id", label: "ID" }, { key: "code", label: "Codice" }, { key: "name", label: "Nome" }, { key: "brand", label: "Marca" }, { key: "qty", label: "Q.tà" }, { key: "minQty", label: "Q.Min" }, { key: "unitPrice", label: "Costo" }, { key: "sellPrice", label: "Vendita" }, { key: "location", label: "Ubicazione" }, { key: "compatibile", label: "Compatibile con" }, { key: "notes", label: "Note" }]);
const exportJobs = () => downloadXLSX("medtrace_job.xlsx", jobs.map(j => {
const a = assets.find(x => x.id === j.assetId) || {};
const c = customers.find(x => x.id === (j.customerId || a.customerId)) || {};
const cp = j.parts.reduce((s, p) => { const pt = parts.find(x => x.id === p.partId); return s + (pt ? (pt.sellPrice || pt.unitPrice) * p.qty : 0); }, 0);
return Object.assign(Object.assign({}, j), { apparecchio: a.name || j.assetId, cliente: c.name || "", partiUsate: j.parts.map(p => { const pt = parts.find(x => x.id === p.partId); return ((pt === null || pt === void 0 ? void 0 : pt.name) || p.partId) + " x" + p.qty; }).join(", "), costoParti: cp.toFixed(2), costoManodopera: (j.laborHours * j.laborRate).toFixed(2), totale: (cp + j.laborHours * j.laborRate).toFixed(2), parts: undefined, timeline: undefined, photos: undefined });
}), [{ key: "id", label: "ID" }, { key: "apparecchio", label: "Apparecchio" }, { key: "cliente", label: "Cliente" }, { key: "type", label: "Tipo" }, { key: "priority", label: "Priorità" }, { key: "status", label: "Stato" }, { key: "assignee", label: "Tecnico" }, { key: "openDate", label: "Apertura" }, { key: "closeDate", label: "Chiusura" }, { key: "description", label: "Descrizione" }, { key: "partiUsate", label: "Parti" }, { key: "laborHours", label: "Ore" }, { key: "laborRate", label: "Tariffa €/h" }, { key: "costoParti", label: "Costo Parti" }, { key: "costoManodopera", label: "Manodopera" }, { key: "totale", label: "Totale" }]);
const exportOrders = () => downloadXLSX("medtrace_ordini.xlsx", orders.map(o => { var _a; return (Object.assign(Object.assign({}, o), { nomeParte: ((_a = parts.find(p => p.id === o.partId)) === null || _a === void 0 ? void 0 : _a.name) || o.partId, totale: (o.qty * o.unitPrice).toFixed(2) })); }), [{ key: "id", label: "ID" }, { key: "supplier", label: "Fornitore" }, { key: "nomeParte", label: "Parte" }, { key: "qty", label: "Q.tà" }, { key: "unitPrice", label: "Prezzo Unit." }, { key: "totale", label: "Totale" }, { key: "status", label: "Stato" }, { key: "orderDate", label: "Data Ordine" }, { key: "expectedDate", label: "Consegna Prev." }, { key: "notes", label: "Note" }]);
const exportInvoices = () => downloadXLSX("medtrace_preventivi.xlsx", invoices.map(i => { var _a; const sub = i.items.reduce((s, it) => s + it.qty * it.unitPrice, 0); const vat = i.items.reduce((s, it) => s + it.qty * it.unitPrice * it.vat / 100, 0); return Object.assign(Object.assign({}, i), { cliente: ((_a = customers.find(c => c.id === i.customerId)) === null || _a === void 0 ? void 0 : _a.name) || "", imponibile: sub.toFixed(2), iva: vat.toFixed(2), totale: (sub + vat).toFixed(2), items: undefined, jobIds: undefined }); }), [{ key: "number", label: "N.Preventivo" }, { key: "cliente", label: "Cliente" }, { key: "date", label: "Data" }, { key: "dueDate", label: "Scadenza" }, { key: "status", label: "Stato" }, { key: "imponibile", label: "Imponibile" }, { key: "iva", label: "IVA" }, { key: "totale", label: "Totale" }, { key: "paymentTerms", label: "Pagamento" }, { key: "notes", label: "Note" }]);
const exportIecReports = () => downloadXLSX("medtrace_verifiche_sicurezza.xlsx", iecReports.map(r => { var _a; const a = assets.find(x => x.id === r.assetId) || {}; const c = customers.find(x => x.id === a.customerId) || {}; return Object.assign(Object.assign({}, r), { apparecchio: a.name || r.assetId || "", nSerie: a.serial || "", cliente: c.name || "", misure: ((_a = r.measures) === null || _a === void 0 ? void 0 : _a.map(m => m.name + ": " + m.value + m.unit + " (lim." + m.limit + ")").join("; ")) || "", measures: undefined, visual: undefined }); }), [{ key: "reportNumber", label: "N.Rapporto" }, { key: "date", label: "Data" }, { key: "norm", label: "Norma" }, { key: "apparecchio", label: "Apparecchio" }, { key: "nSerie", label: "N.Serie" }, { key: "cliente", label: "Cliente" }, { key: "technician", label: "Tecnico" }, { key: "instrument", label: "Strumento" }, { key: "equipClass", label: "Classe" }, { key: "patientType", label: "Tipo Paziente" }, { key: "verifyType", label: "Tipo Verifica" }, { key: "overallPass", label: "Esito" }, { key: "misure", label: "Misure" }, { key: "notes", label: "Note" }]);
const NAV_GROUPS = [
{
id: "g_dash", label: null,
items: [
{ id: "dashboard", label: "Dashboard", icon: "◈" },
{ id: "kpi", label: "KPI & Statistiche", icon: "›" },
]
},
{
id: "g_assets", label: "APPARECCHIATURE",
items: [
{ id: "assets", label: "Apparecchi", icon: "›", badge: stats.outOfService > 0 ? stats.outOfService : null, bColor: "#ef4444" },
{ id: "ricognizione", label: "RFID", icon: "›" },
{ id: "instruments", label: "Strumenti", icon: "›" },
{ id: "customers", label: "Clienti", icon: "›" },
]
},
{
id: "g_maint", label: "MANUTENZIONE",
items: [
{ id: "jobs", label: "Job / Interventi", icon: "›", badge: stats.urgentJobs > 0 ? stats.urgentJobs : null, bColor: "#ef4444" },
{ id: "richieste", label: "Richieste clienti", icon: "›", badge: (richieste.filter(r => r.status === "nuova").length) || null, bColor: "#2dd4bf" },
{ id: "iec", label: "Sicurezza Elettrica", icon: "›" },
{ id: "func", label: "Verif. Funzionale", icon: "›" },
{ id: "ppm", label: "Manut. Programmata", icon: "›" },
{ id: "recalls", label: "Avvisi di sicurezza", icon: "›", badge: (recalls.filter(r => r.status !== "chiuso").length) || null, bColor: "#ef4444" },
{ id: "agenda", label: "Pianificazione", icon: "›", badge: upcomingMaintenance.length > 0 ? upcomingMaintenance.length : null, bColor: "#f59e0b" },
]
},
{
id: "g_stock", label: "GESTIONE",
items: [
{ id: "parts", label: "Magazzino", icon: "›", badge: stats.lowStock > 0 ? stats.lowStock : null, bColor: "#f59e0b" },
{ id: "invoices", label: "Preventivi", icon: "›", badge: stats.pendingInvoices > 0 ? stats.pendingInvoices : null, bColor: "#2dd4bf" },
]
},
{
id: "g_sys", label: "DOCUMENTAZIONE & AIUTO",
items: [
{ id: "help", label: "Guida", icon: "›" },
]
},
];
const NAV_GROUPS_VISIBLE = NAV_GROUPS
.map(g => (Object.assign(Object.assign({}, g), { items: g.items.filter(it => canSee(it.id)) })))
.filter(g => g.items.length > 0);
const NAV = NAV_GROUPS_VISIBLE.flatMap(g => g.items);
const __bnIcon = (paths) => React.createElement("svg", { width: 23, height: 23, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round" }, paths.map((d, i) => React.createElement("path", { key: i, d: d })));
const BOTTOM_NAV = [
{ id: "assets", label: "Apparecchi", paths: ["M3 5.5h18v11H3z", "M8.5 20.5h7", "M12 16.5v4"] },
{ id: "iec", label: "VSE", paths: ["M13 2 4 14h7l-1 8 9-12h-7z"] },
{ id: "func", label: "Funzionale", paths: ["M3 12h4l2.4-8 5 16 2.6-8h4"] },
{ id: "jobs", label: "Job", paths: ["M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2", "M9 3.5h6v3H9z", "M9 12h6", "M9 16h4"] },
].filter(it => NAV.some(n => n.id === it.id));
const filteredJobs = React.useMemo(() => {
return jobs.filter(j => {
if (filterStatus && j.status !== filterStatus)
return false;
if (filterPriority && j.priority !== filterPriority)
return false;
if (filterCustomer) {
const asset = assets.find(a => a.id === j.assetId);
if ((j.customerId || (asset === null || asset === void 0 ? void 0 : asset.customerId)) !== filterCustomer)
return false;
}
if (search) {
const q = search.toLowerCase();
return [j.id, j.assignee, j.description].join(" ").toLowerCase().includes(q);
}
return true;
});
}, [jobs, assets, search, filterStatus, filterPriority, filterCustomer]);
const filteredAssets = React.useMemo(() => assets.filter(a => !search || [a.name, a.brand, a.model, a.serial, a.location].join(" ").toLowerCase().includes(search.toLowerCase())), [assets, search]);
const filteredParts = React.useMemo(() => parts.filter(p => !search || [p.code, p.name, p.brand, p.location].join(" ").toLowerCase().includes(search.toLowerCase())), [parts, search]);
const filteredOrders = React.useMemo(() => orders.filter(o => !search || [o.id, o.supplier, o.notes].join(" ").toLowerCase().includes(search.toLowerCase())), [orders, search]);
const filteredCustomers = React.useMemo(() => customers.filter(c => !search || [c.name, c.vat, c.email, c.contact].join(" ").toLowerCase().includes(search.toLowerCase())), [customers, search]);
const filteredInvoices = React.useMemo(() => invoices.filter(i => {
if (!search)
return true;
const customer = customers.find(c => c.id === i.customerId);
return [i.number, customer === null || customer === void 0 ? void 0 : customer.name, i.status].join(" ").toLowerCase().includes(search.toLowerCase());
}), [invoices, customers, search]);
const sideW = 230;
const isEmpty = assets.length === 0 && parts.length === 0 && jobs.length === 0 && customers.length === 0;
return (React.createElement("div", { style: { minHeight: "100vh", background: "var(--bg)" } },
loadingMsg && React.createElement(LoadingOverlay, { message: loadingMsg }),
toast && React.createElement("div", { style: { position: "fixed", top: 16, right: 16, background: toast.color + "22", border: "1px solid " + (toast.color) + "55", color: toast.color, borderRadius: 10, padding: "11px 18px", zIndex: 2000, fontSize: 13, fontWeight: 700, maxWidth: "90vw" } }, toast.msg),
!isMobile && !modal && React.createElement("button", { onClick: () => setScanOpen(true), title: "Scansiona QR apparecchio", style: { position: "fixed", right: 16, bottom: isMobile ? "calc(90px + env(safe-area-inset-bottom))" : 24, zIndex: 1500, width: 54, height: 54, borderRadius: 16, background: "var(--acc-teal)", color: "#04211d", border: "none", boxShadow: "0 6px 16px rgba(0,0,0,.4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" } }, React.createElement("svg", { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" }), React.createElement("circle", { cx: 12, cy: 13, r: 3 }))),
scanOpen && React.createElement(QRScanCam, { onClose: () => setScanOpen(false), onResult: (text) => { setScanOpen(false); var id = text; try { var m = String(text).match(/[?&]asset=([^&]+)/); if (m) id = decodeURIComponent(m[1]); } catch (e) {} var found = (assets || []).find(function (a) { return a.id === id || a.assetCode === id; }); if (found) { setTab("assets"); openAsset(found.id); } else { setToast({ msg: "QR non riconosciuto: nessun apparecchio con questo codice", color: "#ef4444" }); } } }),
isMobile && (React.createElement("div", { style: {
position: "fixed", inset: 0, background: "#000b", zIndex: 800, backdropFilter: "blur(4px)",
opacity: navOpen ? 1 : 0,
pointerEvents: navOpen ? "auto" : "none",
transition: "opacity .25s ease"
}, onClick: () => setNavOpen(false) },
React.createElement("aside", { style: {
position: "absolute", left: 0, right: 0, bottom: 0, maxHeight: "82vh",
background: "linear-gradient(180deg, var(--bg-deep) 0%, var(--bg) 100%)",
borderTop: "1px solid #2dd4bf44", borderRadius: "18px 18px 0 0",
display: "flex", flexDirection: "column", overflowY: "auto",
boxShadow: "0 -10px 36px rgba(0,0,0,0.65)",
transform: navOpen ? "translateY(0)" : "translateY(100%)",
transition: "transform .28s cubic-bezier(0.22, 1, 0.36, 1)"
}, onClick: e => e.stopPropagation() },
React.createElement("div", { style: { padding: "22px 20px 16px", borderBottom: "1px solid var(--border-2)", position: "relative" } },
React.createElement("div", { style: { position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "var(--border-2)" } }),
React.createElement("svg", { viewBox: "0 0 220 48", xmlns: "http://www.w3.org/2000/svg", style: { width: "100%", maxWidth: 200, height: 38, display: "block", marginBottom: 6 } },
React.createElement("defs", null,
React.createElement("linearGradient", { id: "logoGradM", x1: "0", y1: "0", x2: "1", y2: "0" },
React.createElement("stop", { offset: "0%", stopColor: "#2dd4bf" }),
React.createElement("stop", { offset: "100%", stopColor: "#0d9488" }))),
React.createElement("g", { fill: "none", stroke: "url(#logoGradM)", strokeLinecap: "round", strokeLinejoin: "round" },
React.createElement("path", { d: "M6 24 Q11 14 16 24 Q21 34 26 24", strokeWidth: "2.5" }),
React.createElement("path", { d: "M1 24 Q9 10 16 24 Q23 38 31 24", strokeWidth: "2.5" }),
React.createElement("path", { d: "M-4 24 Q7 6 16 24 Q25 42 36 24", strokeWidth: "2.5" }),
React.createElement("circle", { cx: "42", cy: "24", r: "3.5", fill: "#2dd4bf", stroke: "none" })),
React.createElement("text", { x: "54", y: "28", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif", fontSize: "20", fontWeight: "800", style: { fill: "var(--text-bright)" }, letterSpacing: "-0.3" }, "MedTrace"),
React.createElement("text", { x: "54", y: "40", fontFamily: "-apple-system, BlinkMacSystemFont, system-ui, sans-serif", fontSize: "8.5", fontWeight: "600", fill: "#475569", letterSpacing: "2" }, "MEDICAL \u00B7 CMMS")),
company.name && React.createElement("div", { style: { fontSize: 10, fontWeight: 600, color: "var(--text-3)", marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, company.name)),
React.createElement("nav", { style: { flex: 1, padding: "14px 8px" } }, NAV_GROUPS_VISIBLE.map((group, gi) => (React.createElement("div", { key: group.id, style: { marginBottom: gi < NAV_GROUPS_VISIBLE.length - 1 ? 10 : 0 } },
group.label && (React.createElement("div", { style: { padding: "8px 12px 4px", fontSize: 10, color: "var(--text-4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 } }, group.label)),
group.items.map(n => {
const active = tab === n.id;
return (React.createElement("button", { key: n.id, onClick: () => { setTab(n.id); setSearch(""); setNavOpen(false); }, style: {
width: "100%", textAlign: "left",
background: active ? "#2dd4bf14" : "transparent",
border: "none", borderRadius: 8, margin: "1px 0",
color: active ? "#F8FAFC" : "var(--text-2)",
padding: "11px 14px", fontSize: 13, cursor: "pointer",
display: "flex", alignItems: "center", gap: 10,
fontWeight: active ? 600 : 500,
position: "relative",
touchAction: "manipulation",
WebkitTapHighlightColor: "transparent"
} },
active && React.createElement("span", { style: { position: "absolute", left: -8, top: 9, bottom: 9, width: 3, background: "#2dd4bf", borderRadius: "0 3px 3px 0" } }),
React.createElement("span", { style: { fontSize: 14, minWidth: 20, textAlign: "center", color: active ? "#2dd4bf" : "var(--text-3)" } }, n.icon),
React.createElement("span", { style: { flex: 1 } }, n.label),
n.badge && React.createElement("span", { style: { background: n.bColor, color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 10, fontWeight: 700, letterSpacing: .3 } }, n.badge)));
}))))),
React.createElement("div", { style: { padding: "12px 14px", borderTop: "1px solid var(--border-2)", display: "flex", flexDirection: "column", gap: 10 } },
React.createElement("span", { style: { fontSize: 10, color: "var(--text-3)", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: .5, textAlign: "center" } }, "MedTrace v" + APP_VERSION),
React.createElement("button", { onClick: () => { if (window.__mtToggle) window.__mtToggle(); }, style: { background: "transparent", border: "1px solid var(--border-2)", borderRadius: 6, color: "var(--text-2)", fontSize: 12, fontWeight: 600, padding: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, touchAction: "manipulation" } }, "◐ Tema chiaro / scuro"), React.createElement("button", { onClick: () => { setModal({ type: "settings" }); setNavOpen(false); }, style: {
background: "transparent", border: "1px solid var(--border-2)", borderRadius: 6,
color: "var(--text-2)", fontSize: 12, fontWeight: 600, padding: "8px",
cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
touchAction: "manipulation"
} }, "\u2699 Impostazioni"))))),
!isMobile && (React.createElement("aside", { style: {
position: "fixed", left: 0, top: 0, bottom: 0, width: sideW, zIndex: 100,
background: "linear-gradient(180deg, var(--bg-deep) 0%, var(--bg) 100%)",
borderRight: "1px solid var(--border-2)",
display: "flex", flexDirection: "column",
boxShadow: "4px 0 24px rgba(0,0,0,0.4)"
} },
React.createElement("div", { style: { padding: "22px 20px 18px", borderBottom: "1px solid var(--border-2)", position: "relative" } },
React.createElement("div", { style: { position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "var(--border-2)" } }),
React.createElement("svg", { viewBox: "0 0 220 48", xmlns: "http://www.w3.org/2000/svg", style: { width: "100%", maxWidth: 200, height: 38, display: "block", marginBottom: 6 } },
React.createElement("defs", null,
React.createElement("linearGradient", { id: "logoGrad", x1: "0", y1: "0", x2: "1", y2: "0" },
React.createElement("stop", { offset: "0%", stopColor: "#2dd4bf" }),
React.createElement("stop", { offset: "100%", stopColor: "#0d9488" }))),
React.createElement("g", { fill: "none", stroke: "url(#logoGrad)", strokeLinecap: "round", strokeLinejoin: "round" },
React.createElement("path", { d: "M6 24 Q11 14 16 24 Q21 34 26 24", strokeWidth: "2.5" }),
React.createElement("path", { d: "M1 24 Q9 10 16 24 Q23 38 31 24", strokeWidth: "2.5" }),
React.createElement("path", { d: "M-4 24 Q7 6 16 24 Q25 42 36 24", strokeWidth: "2.5" }),
React.createElement("circle", { cx: "42", cy: "24", r: "3.5", fill: "#2dd4bf", stroke: "none" })),
React.createElement("text", { x: "54", y: "28", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif", fontSize: "20", fontWeight: "800", style: { fill: "var(--text-bright)" }, letterSpacing: "-0.3" }, "MedTrace"),
React.createElement("text", { x: "54", y: "40", fontFamily: "-apple-system, BlinkMacSystemFont, system-ui, sans-serif", fontSize: "8.5", fontWeight: "600", fill: "#475569", letterSpacing: "2" }, "MEDICAL \u00B7 CMMS")),
company.name && React.createElement("div", { style: { fontSize: 10, fontWeight: 600, color: "var(--text-3)", marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, company.name)),
React.createElement("nav", { style: { flex: 1, padding: "14px 8px", overflowY: "auto" } }, NAV_GROUPS_VISIBLE.map((group, gi) => (React.createElement("div", { key: group.id, style: { marginBottom: gi < NAV_GROUPS_VISIBLE.length - 1 ? 8 : 0 } },
group.label && (React.createElement("div", { style: { padding: "8px 12px 4px", fontSize: 10, color: "var(--text-4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 } }, group.label)),
group.items.map(n => {
const active = tab === n.id;
return (React.createElement("button", { key: n.id, onClick: () => { setTab(n.id); setSearch(""); }, onMouseEnter: e => { if (!active)
e.currentTarget.style.background = "var(--border-2)"; }, onMouseLeave: e => { if (!active)
e.currentTarget.style.background = "transparent"; }, style: {
width: "100%", textAlign: "left",
background: active ? "#2dd4bf14" : "transparent",
border: "none",
borderRadius: 8,
margin: "1px 0",
color: active ? "#F8FAFC" : "var(--text-2)",
padding: "9px 14px",
fontSize: 13,
cursor: "pointer",
display: "flex", alignItems: "center", gap: 10,
fontWeight: active ? 600 : 500,
position: "relative",
transition: "all .15s ease"
} },
active && React.createElement("span", { style: { position: "absolute", left: -8, top: 7, bottom: 7, width: 3, background: "#2dd4bf", borderRadius: "0 3px 3px 0" } }),
React.createElement("span", { style: { fontSize: 14, minWidth: 18, textAlign: "center", color: active ? "#2dd4bf" : "var(--text-3)" } }, n.icon),
React.createElement("span", { style: { flex: 1 } }, n.label),
n.badge && React.createElement("span", { style: { background: n.bColor, color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 10, fontWeight: 700, letterSpacing: .3 } }, n.badge)));
}))))),
React.createElement("div", { style: { padding: "12px 14px", borderTop: "1px solid var(--border-2)", display: "flex", flexDirection: "column", gap: 8 } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
React.createElement("span", { style: { fontSize: 10, color: "#334155", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: .5 } },
"v",
APP_VERSION),
React.createElement("button", { onClick: () => { if (window.__mtToggle) window.__mtToggle(); }, title: "Tema chiaro / scuro", style: { background: "none", border: "none", color: "var(--text-3)", fontSize: 14, cursor: "pointer", padding: 0, lineHeight: 1 } }, "◐"), React.createElement("button", { onClick: () => setModal({ type: "settings" }), onMouseEnter: e => e.currentTarget.style.color = "#2dd4bf", onMouseLeave: e => e.currentTarget.style.color = "var(--text-3)", style: { background: "none", border: "none", color: "var(--text-3)", fontSize: 14, cursor: "pointer", transition: "color .15s" } }, "\u2699 Impostazioni"))))),
isMobile ? React.createElement("div", { style: { position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 90, display: "flex", background: "var(--card)", borderTop: "1px solid var(--border)", boxShadow: "0 -4px 24px rgba(0,0,0,.45)", paddingBottom: "env(safe-area-inset-bottom)" } }, BOTTOM_NAV.concat([{ id: "__altro", label: "Altro", paths: ["M4 7h16", "M4 12h16", "M4 17h16"] }]).map(it => {
const active = it.id === "__altro" ? navOpen : tab === it.id;
return React.createElement("button", { key: it.id, onClick: () => { if (it.id === "__altro") { setNavOpen(true); } else { setTab(it.id); setSearch(""); setNavOpen(false); } }, style: { flex: 1, background: "transparent", border: "none", cursor: "pointer", padding: "9px 2px 7px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: active ? "#2dd4bf" : "var(--text-3)", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", position: "relative" } }, (active && it.id !== "__altro") ? React.createElement("span", { style: { position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 26, height: 3, borderRadius: "0 0 3px 3px", background: "#2dd4bf" } }) : null, __bnIcon(it.paths), React.createElement("div", { style: { fontSize: 10, fontWeight: active ? 700 : 500, letterSpacing: 0.1, whiteSpace: "nowrap" } }, it.label));
})) : null,
isMobile ? React.createElement("div", { style: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 80, background: "var(--card)", borderBottom: "1px solid var(--border)", boxShadow: "0 2px 12px rgba(0,0,0,.25)", paddingTop: "env(safe-area-inset-top)" } },
React.createElement("div", { style: { height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px" } },
React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
React.createElement("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "#2dd4bf", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M2 12h4l2-6 4 12 2-6h6" })),
React.createElement("span", { style: { fontWeight: 800, fontSize: 14.5, color: "var(--text)", letterSpacing: -.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "52vw" } }, tab === "scheda" ? (((assets.find(a => a.id === schedaId) || {}).assetCode) || "Apparecchio") : (((_a = NAV.find(n => n.id === tab)) === null || _a === void 0 ? void 0 : _a.label) || "MedTrace"))),
React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } },
React.createElement("button", { onClick: () => setModal({ type: "settings" }), title: "Impostazioni", style: { background: "transparent", border: "none", color: "var(--text-3)", fontSize: 19, cursor: "pointer", padding: "6px 8px", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } }, "\u2699"),
React.createElement("button", { onClick: () => setScanOpen(true), title: "Scansiona QR apparecchio", style: { background: "transparent", color: "var(--acc-teal)", border: "1px solid var(--border)", borderRadius: 10, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 } },
React.createElement("svg", { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" }), React.createElement("circle", { cx: 12, cy: 13, r: 3 })))))) : null,
React.createElement("div", { style: { marginLeft: isMobile ? 0 : sideW, padding: isMobile ? "calc(64px + env(safe-area-inset-top)) 14px calc(80px + env(safe-area-inset-bottom))" : "26px 28px", minHeight: "100vh" } },
typeof DEMO_LOCKED !== "undefined" && DEMO_LOCKED && (React.createElement("div", { style: {
background: "#f59e0b14",
border: "1px solid #f59e0b66",
borderRadius: 8,
padding: "8px 14px",
marginBottom: 12,
fontSize: 12,
color: "#fbbf24",
display: "flex",
alignItems: "center",
gap: 8,
fontWeight: 600
} },
React.createElement("span", { style: { fontSize: 14 } }, "\uD83D\uDC41"),
React.createElement("span", null, "Modalit\u00E0 DEMO \u2014 sola lettura. Esplora liberamente: le modifiche non sono salvate."))),
isMobile && (ptrPull > 0 || ptrRefreshing) && (React.createElement("div", { style: { position: "fixed", top: 8, left: "50%", transform: `translateX(-50%) translateY(${Math.min(ptrPull, 50) - 50}px)`, zIndex: 500, background: "var(--bg)", border: "1px solid #2dd4bf66", borderRadius: 20, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 14px #000a", opacity: ptrRefreshing ? 1 : Math.min(ptrPull / 60, 1), transition: ptrRefreshing ? "none" : "transform .15s" } },
React.createElement("span", { style: { display: "inline-block", width: 14, height: 14, border: "2px solid var(--border-4)", borderTopColor: "#2dd4bf", borderRadius: "50%", animation: ptrRefreshing ? "ptr-spin .6s linear infinite" : "none", transform: ptrRefreshing ? "none" : `rotate(${ptrPull * 4}deg)` } }),
React.createElement("span", { style: { fontSize: 12, color: "#2dd4bf", fontWeight: 700 } }, ptrRefreshing ? "Aggiornamento…" : ptrPull > 60 ? "Rilascia per aggiornare" : "Tira per aggiornare"))),
React.createElement("style", null, `@keyframes ptr-spin { to { transform: rotate(360deg); } }`),
tab === "scheda" && (function () {
var schedaAsset = assets.find(function (x) { return x.id === schedaId; });
if (!schedaAsset) return React.createElement("div", { style: { maxWidth: 700, margin: "40px auto", textAlign: "center", color: "var(--text-3)" } },
React.createElement("div", { style: { fontSize: 14, fontWeight: 700, marginBottom: 8 } }, "Apparecchio non trovato"),
React.createElement("button", { onClick: function () { setTab("assets"); }, style: { background: "#2dd4bf", color: "#04201c", border: "none", borderRadius: 8, padding: "9px 18px", fontWeight: 700, cursor: "pointer" } }, "Vai agli apparecchi"));
return React.createElement("div", { style: { maxWidth: 1100, margin: "0 auto" } },
React.createElement("button", { onClick: function () { try { window.history.back(); } catch (e) { setTab("assets"); } }, style: { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-2)", padding: "7px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600, marginBottom: 14, display: "inline-flex", alignItems: "center", gap: 6, touchAction: "manipulation" } }, "\u2190 Indietro"),
React.createElement(AssetDetailModal, { asset: schedaAsset, page: true, recalls: recalls, jobs: jobs, parts: parts, iecReports: iecReports, funcReports: funcReports, customers: customers, company: company, templates: allTemplates, generateIECPDF: generateIECPDF, generateFuncPDF: generateFuncPDF, onClose: function () { try { window.history.back(); } catch (e) { setTab("assets"); } }, onEditAsset: function () { pushModal({ type: "asset", data: schedaAsset }); }, onNewJob: function () { pushModal({ type: "job", data: { assetId: schedaAsset.id, type: "correttiva", priority: "normale", status: "aperto", description: "", openDate: new Date().toISOString().slice(0, 10), parts: [], laborHours: 0, laborRate: 55, notes: "", timeline: [], photos: [] } }); }, onNewIec: function () { pushModal({ type: "iec", assetId: schedaAsset.id, data: null }); }, onNewFunc: function () { pushModal({ type: "func", assetId: schedaAsset.id, data: null }); }, onAssetSticker: function () { pushModal({ type: "sticker", data: {}, kind: "asset", assetId: schedaAsset.id }); }, onOpenJob: function (j) { pushModal({ type: "job", data: j }); }, onOpenIec: function (r) { pushModal({ type: "iec", data: r }); }, onOpenFunc: function (r) { pushModal({ type: "func", data: r }); }, onOpenRecall: openRecall, onQuickLocation: function (loc) { var _now = new Date().toISOString(); var rec = withUpdateMeta(Object.assign(Object.assign({}, schedaAsset), { lastLocation: loc, lastLocationDate: _now, lastSeenAt: _now })); setAssets(function (a) { return upsertInList(a, rec); }); showToast("\uD83D\uDCCD Posizione rilevata", "#2dd4bf"); }, onAddDoc: function (att) { var rec = withUpdateMeta(Object.assign(Object.assign({}, schedaAsset), { documents: (schedaAsset.documents || []).concat([att]) })); setAssets(function (a) { return upsertInList(a, rec); }); }, onDeleteDoc: function (id) { var rec = withUpdateMeta(Object.assign(Object.assign({}, schedaAsset), { documents: (schedaAsset.documents || []).filter(function (d) { return d.id !== id; }) })); setAssets(function (a) { return upsertInList(a, rec); }); }, showToast: showToast }));
})(),
tab === "dashboard" && (React.createElement("div", null,
!isMobile && React.createElement("h1", { style: { margin: "0 0 20px", fontSize: 20, fontWeight: 800 } }, "Dashboard"),
isEmpty ? (React.createElement("div", { style: { maxWidth: 520, margin: "20px auto" } },
React.createElement("div", { style: { textAlign: "center", marginBottom: 24 } },
React.createElement("div", { style: { fontSize: 22, fontWeight: 800, color: "var(--text-bright)", marginBottom: 6 } }, "Benvenuto" + (company.name ? " in " + company.name : " in MedTrace")),
React.createElement("div", { style: { fontSize: 13, color: "var(--text-2)", lineHeight: 1.5 } }, "Tre passi per iniziare. Bastano un paio di minuti.")),
[
{ n: 1, t: "Aggiungi un cliente", d: "La struttura o lo studio dove si trovano gli apparecchi.", show: isAdmin, btn: "+ Nuovo cliente", go: () => { setTab("customers"); setModal({ type: "customer", data: null }); } },
{ n: 2, t: "Registra un apparecchio", d: "Il dispositivo da gestire: nome, marca, numero di serie.", show: true, btn: "+ Nuovo apparecchio", go: () => { setTab("assets"); setModal({ type: "asset", data: null }); } },
{ n: 3, t: "Esegui la prima verifica", d: "Sicurezza elettrica o funzionale, dalla scheda dell'apparecchio.", show: true, btn: "Vai agli apparecchi", go: () => setTab("assets") },
].filter(s => s.show).map(s => (React.createElement("div", { key: s.n, style: { display: "flex", gap: 14, alignItems: "center", background: "var(--surface)", border: "1px solid #24242F", borderRadius: 12, padding: "14px 16px", marginBottom: 10 } },
React.createElement("div", { style: { width: 32, height: 32, borderRadius: "50%", background: "#2dd4bf22", border: "1px solid #2dd4bf55", color: "#5eead4", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, s.n),
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { fontSize: 14, fontWeight: 800, color: "var(--text)" } }, s.t),
React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)", lineHeight: 1.4 } }, s.d)),
React.createElement("button", { onClick: s.go, style: { background: "#2dd4bf", color: "#0a0a0e", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 } }, s.btn)))),
React.createElement("div", { style: { textAlign: "center", fontSize: 11, color: "var(--text-4)", marginTop: 16, lineHeight: 1.5 } }, "I dati restano sul tuo dispositivo. Puoi sincronizzarli sul cloud dalle Impostazioni."))) : (() => {
const today = new Date();
today.setHours(0, 0, 0, 0);
const in7days = new Date(today);
in7days.setDate(in7days.getDate() + 7);
const in30days = new Date(today);
in30days.setDate(in30days.getDate() + 30);
const openJobs = jobs.filter(j => j.status !== "chiuso");
const urgentJobs = openJobs.filter(j => j.priority === "urgente");
const dueThisWeek = assets.filter(a => {
if (!a.nextService)
return false;
const d = new Date(a.nextService);
d.setHours(0, 0, 0, 0);
return d <= in7days;
}).map(a => (Object.assign(Object.assign({}, a), { daysToService: Math.round((new Date(a.nextService) - today) / 86400000) }))).sort((a, b) => a.daysToService - b.daysToService);
const expiredService = assets.filter(a => {
if (!a.nextService)
return false;
const d = new Date(a.nextService);
d.setHours(0, 0, 0, 0);
return d < today;
});
const warrantyExpiring = assets.filter(a => {
if (!a.warrantyExpiry)
return false;
const d = new Date(a.warrantyExpiry);
d.setHours(0, 0, 0, 0);
return d >= today && d <= in30days;
});
const lowStock = parts.filter(p => p.qty <= p.minQty);
const upcoming30 = assets.filter(a => {
if (!a.nextService)
return false;
const d = new Date(a.nextService);
d.setHours(0, 0, 0, 0);
return d >= today && d <= in30days;
}).map(a => (Object.assign(Object.assign({}, a), { daysToService: Math.round((new Date(a.nextService) - today) / 86400000) }))).sort((a, b) => a.daysToService - b.daysToService).slice(0, 5);
const totalTodo = urgentJobs.length + expiredService.length + dueThisWeek.length + lowStock.length;
return (React.createElement(React.Fragment, null,
React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 14 } },
React.createElement(KpiCard, { label: "Apparecchi", value: stats.totalAssets, color: "#2dd4bf", icon: ICON_MONITOR, sub: stats.operative + " operativi", onClick: () => setTab("assets") }),
React.createElement(KpiCard, { label: "Job aperti", value: stats.openJobs, color: "#f59e0b", icon: ICON_TOOL, sub: stats.urgentJobs > 0 ? stats.urgentJobs + " urgenti" : "nessun urgente", onClick: () => setTab("jobs") }),
React.createElement(KpiCard, { label: "Sicurezza", value: iecReports.length, color: "#a855f7", icon: ICON_ZAP, sub: "verifiche VSE", onClick: () => setTab("iec") }),
React.createElement(KpiCard, { label: "Funzionale", value: funcReports.length, color: "#0891b2", icon: ICON_ACTIVITY, sub: "verifiche", onClick: () => setTab("func") }),
React.createElement(KpiCard, { label: "Clienti", value: stats.customers, color: "#22c55e", icon: ICON_BUILDING, onClick: () => setTab("customers") })),
React.createElement("div", { style: { background: "var(--card)", border: "1px solid var(--border-2)", borderRadius: 14, padding: "16px 18px", marginBottom: 28 } },
React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 14 } }, "Stato del parco"),
React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" } },
React.createElement(Donut, { segments: [{ value: stats.operative, color: "#2dd4bf", label: "Operativi" }, { value: stats.maintenance, color: "#f59e0b", label: "In manutenzione" }, { value: stats.outOfService, color: "#ef4444", label: "Fuori servizio" }], centerTop: stats.totalAssets, centerSub: "TOTALI" }),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 11, flex: 1, minWidth: 170 } },
[{ c: "#2dd4bf", l: "Operativi", v: stats.operative }, { c: "#f59e0b", l: "In manutenzione", v: stats.maintenance }, { c: "#ef4444", l: "Fuori servizio", v: stats.outOfService }].map((row, i) => React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 10 } },
React.createElement("span", { style: { width: 10, height: 10, borderRadius: "50%", background: row.c, flexShrink: 0 } }),
React.createElement("span", { style: { fontSize: 13, color: "var(--text-2)", flex: 1 } }, row.l),
React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "'Space Grotesk', sans-serif" } }, row.v)))))),
(() => {
const _su = storageUsage();
return _su.pct >= 85 ? (React.createElement("div", { style: { marginBottom: 28, padding: "12px 14px", background: "var(--err-bg)", border: "1px solid #7f1d1d", borderLeft: "3px solid #ef4444", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" } },
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "#fecaca" } },
"\uD83D\uDCBE Spazio dati al ",
_su.pct,
"%"),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", marginTop: 2 } }, _su.pct >= 100 ? "I salvataggi stanno fallendo: esporta un backup ed elimina foto pesanti dai job." : "Quasi pieno: esporta un backup. Dettagli in Impostazioni → Spazio dati locale.")),
React.createElement("span", { style: { color: "#ef4444", fontSize: 16 } }, "\uD83D\uDCBE"))) : null;
})(),
React.createElement("div", { style: { marginBottom: 28 } },
React.createElement("div", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid var(--border-2)" } },
React.createElement("h2", { style: { margin: 0, fontSize: 13, fontWeight: 800, color: "var(--text)", letterSpacing: .5, textTransform: "uppercase" } }, "Da fare"),
React.createElement("span", { style: { fontSize: 11, color: "var(--text-3)", fontFamily: "'IBM Plex Mono', monospace" } }, totalTodo === 0 ? "tutto in ordine" : totalTodo + " attività")),
totalTodo === 0 ? (React.createElement("div", { style: { padding: "20px 16px", textAlign: "center", color: "var(--text-3)", fontSize: 12, background: "var(--bg)", borderRadius: 8, border: "1px dashed var(--border-2)" } }, "Nessuna scadenza imminente. Tutto sotto controllo.")) : (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } },
urgentJobs.length > 0 && (React.createElement("div", { className: "mt-tap", onClick: () => setTab("jobs"), style: { padding: "10px 14px", background: "var(--bg)", border: "1px solid var(--border-2)", borderLeft: "3px solid #ef4444", borderRadius: 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } },
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--text)" } },
urgentJobs.length,
" ",
urgentJobs.length === 1 ? "job urgente" : "job urgenti"),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 2 } }, "Da prendere in carico subito")),
React.createElement("span", { style: { color: "#ef4444", fontSize: 14 } }, "\u203A"))),
expiredService.length > 0 && (React.createElement("div", { className: "mt-tap", onClick: () => setTab("agenda"), style: { padding: "10px 14px", background: "var(--bg)", border: "1px solid var(--border-2)", borderLeft: "3px solid #ef4444", borderRadius: 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } },
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--text)" } },
expiredService.length,
" ",
expiredService.length === 1 ? "manutenzione scaduta" : "manutenzioni scadute"),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 2 } }, "Da pianificare con priorit\u00E0")),
React.createElement("span", { style: { color: "#ef4444", fontSize: 14 } }, "\u203A"))),
dueThisWeek.filter(a => a.daysToService >= 0).length > 0 && (React.createElement("div", { className: "mt-tap", onClick: () => setTab("agenda"), style: { padding: "10px 14px", background: "var(--bg)", border: "1px solid var(--border-2)", borderLeft: "3px solid #f59e0b", borderRadius: 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } },
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--text)" } },
dueThisWeek.filter(a => a.daysToService >= 0).length,
" manutenzioni questa settimana"),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 2 } }, "Scadenza entro 7 giorni")),
React.createElement("span", { style: { color: "#f59e0b", fontSize: 14 } }, "\u203A"))),
lowStock.length > 0 && (React.createElement("div", { className: "mt-tap", onClick: () => setTab("parts"), style: { padding: "10px 14px", background: "var(--bg)", border: "1px solid var(--border-2)", borderLeft: "3px solid #f59e0b", borderRadius: 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } },
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--text)" } },
lowStock.length,
" ",
lowStock.length === 1 ? "parte sotto scorta" : "parti sotto scorta"),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 2 } }, "Da riordinare")),
React.createElement("span", { style: { color: "#f59e0b", fontSize: 14 } }, "\u203A")))))),
(urgentJobs.length > 0 || expiredService.length > 0) && (React.createElement("div", { style: { marginBottom: 28 } },
React.createElement("div", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid var(--border-2)" } },
React.createElement("h2", { style: { margin: 0, fontSize: 13, fontWeight: 800, color: "#ef4444", letterSpacing: .5, textTransform: "uppercase" } }, "Critico"),
React.createElement("span", { style: { fontSize: 11, color: "var(--text-3)", fontFamily: "'IBM Plex Mono', monospace" } },
urgentJobs.length + expiredService.length,
" elementi")),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } },
urgentJobs.slice(0, 3).map(j => {
const a = assets.find(x => x.id === j.assetId) || {};
return (React.createElement("div", { key: j.id, onClick: () => setModal({ type: "jobDetail", data: j }), style: { padding: "10px 14px", background: "var(--surface)", border: "1px solid #ef444433", borderRadius: 8, cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 } },
React.createElement("span", { style: { fontSize: 10, color: "#ef4444", fontWeight: 800, letterSpacing: .5, textTransform: "uppercase" } },
"Job urgente \u00B7 ",
j.id),
React.createElement("span", { style: { fontSize: 10, color: "var(--text-3)", fontFamily: "'IBM Plex Mono', monospace" } }, j.openDate)),
React.createElement("div", { style: { fontSize: 13, color: "var(--text)", fontWeight: 600 } }, a.name || "(apparecchio sconosciuto)"),
j.description && React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, j.description)));
}),
expiredService.slice(0, 3).map(a => {
const c = customers.find(x => x.id === a.customerId) || {};
const days = Math.round((today - new Date(a.nextService)) / 86400000);
return (React.createElement("div", { key: a.id, onClick: () => openAsset(a.id), style: { padding: "10px 14px", background: "var(--surface)", border: "1px solid #ef444433", borderRadius: 8, cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 } },
React.createElement("span", { style: { fontSize: 10, color: "#ef4444", fontWeight: 800, letterSpacing: .5, textTransform: "uppercase" } },
"Manut. scaduta da ",
days,
"gg"),
React.createElement("span", { style: { fontSize: 10, color: "var(--text-3)", fontFamily: "'IBM Plex Mono', monospace" } }, a.nextService)),
React.createElement("div", { style: { fontSize: 13, color: "var(--text)", fontWeight: 600 } }, a.name),
c.name && React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", marginTop: 2 } }, c.name)));
}),
(urgentJobs.length + expiredService.length > 6) && (React.createElement("div", { onClick: () => setTab("jobs"), style: { padding: "8px 14px", textAlign: "center", fontSize: 11, color: "var(--text-3)", cursor: "pointer", touchAction: "manipulation" } },
"+ altri ",
urgentJobs.length + expiredService.length - 6,
" elementi critici \u203A"))))),
upcoming30.length > 0 && (React.createElement("div", { style: { marginBottom: 28 } },
React.createElement("div", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid var(--border-2)" } },
React.createElement("h2", { style: { margin: 0, fontSize: 13, fontWeight: 800, color: "var(--text)", letterSpacing: .5, textTransform: "uppercase" } }, "Prossimi 30 giorni"),
React.createElement("span", { onClick: () => setTab("agenda"), style: { fontSize: 11, color: "#2dd4bf", cursor: "pointer", fontWeight: 600 } }, "vedi agenda \u203A")),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 4 } }, upcoming30.map(a => {
const c = customers.find(x => x.id === a.customerId) || {};
const col = a.daysToService <= 7 ? "#f59e0b" : "var(--text-3)";
return (React.createElement("div", { key: a.id, onClick: () => openAsset(a.id), style: { padding: "8px 14px", background: "var(--bg)", borderRadius: 6, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } },
React.createElement("div", { style: { minWidth: 0, flex: 1 } },
React.createElement("div", { style: { fontSize: 12, color: "var(--text)", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, a.name),
c.name && React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, c.name)),
React.createElement("div", { style: { textAlign: "right", flexShrink: 0 } },
React.createElement("div", { style: { fontSize: 11, color: col, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" } }, a.daysToService === 0 ? "oggi" : a.daysToService === 1 ? "domani" : "tra " + a.daysToService + "gg"),
React.createElement("div", { style: { fontSize: 10, color: "var(--text-4)", fontFamily: "'IBM Plex Mono', monospace" } }, a.nextService))));
})))),
React.createElement("div", { style: { padding: "12px 14px", background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 8, marginBottom: 18, display: "flex", flexWrap: "wrap", gap: isMobile ? 12 : 20, fontSize: 11, color: "var(--text-3)", alignItems: "center", justifyContent: "space-around" } },
React.createElement("span", { onClick: () => setTab("assets"), style: { cursor: "pointer" } },
React.createElement("strong", { style: { color: "var(--text)", fontFamily: "'IBM Plex Mono', monospace" } }, stats.operative),
" operativi"),
React.createElement("span", { onClick: () => setTab("assets"), style: { cursor: "pointer" } },
React.createElement("strong", { style: { color: "var(--text-2)", fontFamily: "'IBM Plex Mono', monospace" } }, stats.maintenance),
" in manut."),
React.createElement("span", { onClick: () => setTab("assets"), style: { cursor: "pointer" } },
React.createElement("strong", { style: { color: stats.outOfService > 0 ? "#ef4444" : "var(--text-2)", fontFamily: "'IBM Plex Mono', monospace" } }, stats.outOfService),
" fuori serv."),
warrantyExpiring.length > 0 && React.createElement("span", { onClick: () => setTab("assets"), style: { cursor: "pointer" } },
React.createElement("strong", { style: { color: "#f59e0b", fontFamily: "'IBM Plex Mono', monospace" } }, warrantyExpiring.length),
" garanzie in scad."),
stats.pendingInvoices > 0 && React.createElement("span", { onClick: () => setTab("invoices"), style: { cursor: "pointer" } },
React.createElement("strong", { style: { color: "var(--text-2)", fontFamily: "'IBM Plex Mono', monospace" } }, stats.pendingInvoices),
" preventivi aperti"))));
})())),
tab === "kpi" && React.createElement(KpiPage, { assets: assets, jobs: jobs, customers: customers, iecReports: iecReports, funcReports: funcReports, parts: parts, isMobile: isMobile }),
tab === "ricognizione" && (React.createElement("div", null,
React.createElement("div", { style: { marginBottom: 12 } },
React.createElement("div", { style: { fontSize: 17, fontWeight: 800, color: "var(--text)" } }, "Scansione RFID"),
React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)", marginTop: 2 } }, "Scansiona gli apparecchi di un reparto: aggiorna la posizione e gestisci le scadenze sul posto.")),
React.createElement("div", { style: { background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 10, padding: 12, marginBottom: 10 } },
React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", fontWeight: 700, marginBottom: 6 } }, "REPARTO"),
React.createElement("input", { value: reconWard, onChange: e => setReconWard(e.target.value), list: "recon-wards", placeholder: "es. Cardiologia", style: { width: "100%", boxSizing: "border-box", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "10px 12px", fontSize: 14 } }),
React.createElement("datalist", { id: "recon-wards" }, (reconWards || []).map(w => React.createElement("option", { key: w, value: w }))),
React.createElement("div", { style: { fontSize: 10, color: "var(--text-4)", marginTop: 6 } }, "Pi\u00f9 avanti: un tag-reparto imposter\u00e0 il reparto in automatico alla scansione.")),
React.createElement("div", { style: { background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 10, padding: 12, marginBottom: 10 } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 } },
React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", fontWeight: 700 } }, "EPC SCANSIONATI"),
React.createElement("div", { style: { display: "flex", gap: 6 } },
React.createElement("button", { onClick: reconToggleListen, style: { background: reconListening ? "#2dd4bf" : "transparent", border: "1px solid " + (reconListening ? "#2dd4bf" : "var(--border)"), borderRadius: 6, color: reconListening ? "#04201c" : "#2dd4bf", padding: "3px 8px", fontSize: 11, cursor: "pointer", fontWeight: 700 } }, reconListening ? ("\u25a0 Termina (" + reconLive + ")") : "\u25b6 Ascolto lettore"),
React.createElement("button", { onClick: reconSimulate, style: { background: "transparent", border: "1px solid var(--border)", borderRadius: 6, color: "#2dd4bf", padding: "3px 8px", fontSize: 11, cursor: "pointer", fontWeight: 700 } }, "Simula scansione"))),
reconListening && React.createElement("div", { style: { fontSize: 11, color: "#2dd4bf", fontWeight: 700, marginBottom: 6, fontFamily: "'IBM Plex Mono', monospace" } }, "\u25cf " + reconLive + " tag letti" + (reconLastEpc ? (" \u00b7 ultimo: " + reconLastEpc) : "") + " \u2014 tocca Termina per riversarli"),
React.createElement("textarea", { value: reconInput, onChange: e => setReconInput(e.target.value), placeholder: "Incolla gli EPC (uno per riga o separati). Senza lettore usa Simula scansione.", rows: 4, style: { width: "100%", boxSizing: "border-box", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "10px 12px", fontSize: 13, fontFamily: "'IBM Plex Mono', monospace", resize: "vertical" } }),
React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 8 } },
React.createElement("button", { onClick: reconScan, style: { flex: 1, background: "#2dd4bf", border: "none", borderRadius: 8, color: "#04201c", padding: "10px", fontSize: 14, fontWeight: 800, cursor: "pointer" } }, "Scansiona"),
reconResult && React.createElement("button", { onClick: () => { setReconResult(null); setReconInput(""); }, style: { background: "transparent", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-2)", padding: "10px 14px", fontSize: 13, cursor: "pointer" } }, "Pulisci"))),
reconResult && (React.createElement("div", { style: { marginBottom: 10 } },
React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8, alignItems: "center" } },
React.createElement("span", { style: { fontSize: 12, color: "#2dd4bf", fontWeight: 700 } }, reconResult.found.length + " trovati"),
React.createElement("span", { style: { fontSize: 12, color: "var(--text-3)" } }, "su " + reconResult.scanned + " scansionati"),
reconResult.unknown.length > 0 && React.createElement("span", { style: { fontSize: 12, color: "#f59e0b", fontWeight: 700 } }, reconResult.unknown.length + " sconosciuti")),
(reconResult.applied ? React.createElement("div", { style: { background: "var(--ok-bg)", border: "1px solid #22c55e55", borderRadius: 8, color: "#4ade80", padding: "9px 12px", fontSize: 13, fontWeight: 700, marginBottom: 10 } }, "\u2713 Posizione aggiornata: " + reconResult.applied + (DEMO_LOCKED ? " (demo: non salvato)" : "")) : (reconResult.found.length > 0 ? React.createElement("div", { style: { background: "#3a2a10", border: "1px solid #f59e0b44", borderRadius: 8, color: "#fbbf24", padding: "9px 12px", fontSize: 12, marginBottom: 10 } }, "Imposta un reparto e ri-scansiona per aggiornare la posizione") : null)),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, reconResult.found.map(f => React.createElement("div", { key: f.asset.id, onClick: () => openAsset(f.asset.id), style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--surface)", border: "1px solid " + (f.status === "scaduta" ? "#ef444455" : f.status === "scadenza" ? "#f59e0b44" : "var(--border-2)"), borderRadius: 8, cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, f.asset.name || f.asset.assetCode || f.asset.id),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, (f.asset.brand || "") + (f.asset.model ? (" " + f.asset.model) : "") + (f.asset.lastLocation ? (" \u00b7 " + f.asset.lastLocation) : ""))),
f.status !== "ok" && React.createElement("span", { style: { fontSize: 10, fontWeight: 800, color: f.status === "scaduta" ? "#ef4444" : "#f59e0b", background: (f.status === "scaduta" ? "#ef4444" : "#f59e0b") + "18", padding: "3px 7px", borderRadius: 6, whiteSpace: "nowrap" } }, f.status === "scaduta" ? ("scaduta " + Math.abs(f.days) + "g") : ("scade " + f.days + "g")),
React.createElement("span", { style: { color: "var(--text-4)", fontSize: 16 } }, "\u203a")))),
reconResult.missing && reconResult.missing.length > 0 && React.createElement("div", { style: { marginTop: 10, padding: "10px 12px", background: "var(--bg)", border: "1px dashed #ef444455", borderRadius: 8 } },
React.createElement("div", { style: { fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 2 } }, "NON TROVATI QUI (" + reconResult.missing.length + ")"),
React.createElement("div", { style: { fontSize: 10, color: "var(--text-4)", marginBottom: 6 } }, "Risultavano in questo reparto e non sono stati letti nel giro."),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 4 } }, reconResult.missing.map(a => React.createElement("div", { key: a.id, onClick: () => openAsset(a.id), style: { display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 6, cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, a.name || a.assetCode || a.id),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)" } }, a.lastLocationDate ? ("ultima lettura: " + fmtDateTimeIt(a.lastLocationDate)) : "mai letto")),
React.createElement("span", { style: { color: "var(--text-4)", fontSize: 16 } }, "\u203a"))))),
reconResult.unknown.length > 0 && React.createElement("div", { style: { marginTop: 10, padding: "10px 12px", background: "var(--bg)", border: "1px dashed #f59e0b44", borderRadius: 8 } },
React.createElement("div", { style: { fontSize: 11, color: "#f59e0b", fontWeight: 700, marginBottom: 4 } }, "EPC sconosciuti (" + reconResult.unknown.length + ")"),
React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, reconResult.unknown.map(e => React.createElement("span", { key: e, onClick: () => setAssocEpc(assocEpc === e ? null : e), style: { fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: assocEpc === e ? "#04201c" : "var(--text-2)", background: assocEpc === e ? "#f59e0b" : "var(--surface)", border: "1px solid " + (assocEpc === e ? "#f59e0b" : "var(--border)"), borderRadius: 6, padding: "4px 8px", cursor: "pointer", wordBreak: "break-all", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } }, e))),
assocEpc && reconResult.unknown.indexOf(assocEpc) !== -1 && React.createElement(RfidAssocPicker, { epc: assocEpc, assets: assets, onAssign: reconAssign, onClose: () => setAssocEpc(null), wards: reconWards, onAssignWard: reconAssignWard }),
React.createElement("div", { style: { fontSize: 10, color: "var(--text-4)", marginTop: 4 } }, "Tag non associati. Tocca un EPC per associarlo a un apparecchio.")))),
reconByWard.length > 0 && (React.createElement("div", { style: { background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 10, padding: 12 } },
React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", fontWeight: 700, marginBottom: 8 } }, "REPARTI SCANSIONATI"),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, reconByWard.map(r => React.createElement("div", { key: r.ward, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "var(--surface)", borderRadius: 6 } },
React.createElement("div", null, React.createElement("span", { style: { fontSize: 13, color: "var(--text)", fontWeight: 600 } }, r.ward), r.last ? React.createElement("span", { style: { fontSize: 11, color: "var(--text-3)", marginLeft: 8 } }, fmtDateTimeIt(r.last)) : null),
React.createElement("span", { style: { fontSize: 12, color: "#2dd4bf", fontWeight: 700 } }, r.count)))),
React.createElement("div", { style: { fontSize: 10, color: "var(--text-4)", marginTop: 8 } }, "Calcolato dall'ultima posizione di ogni apparecchio. Nessun dato aggiuntivo salvato."))))),
tab === "assets" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: isMobile ? 14 : 18, fontWeight: 800, display: isMobile ? "none" : "block" } }, "Apparecchi Medicali"),
React.createElement("p", { style: { color: "var(--text-3)", margin: isMobile ? 0 : "2px 0 0", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" } },
assets.length,
" totali \u00B7 ",
assets.filter(a => a.status === "fuori servizio").length,
" fuori servizio")),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
isMobile && assets.length > 0 && (React.createElement("button", { onClick: toggleAssetView, style: { background: "var(--card)", border: "1px solid #2dd4bf44", borderRadius: 8, padding: "6px 12px", color: "#5eead4", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 } }, assetMobileView === "table" ? "▦ Schede" : "▤ Tabella")),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: exportAssets }, "\u2B07 Excel"),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: () => setModal({ type: "assetImport" }) }, "\u2B06 Importa"),
" ",
React.createElement(Btn, { sm: true, onClick: () => setModal({ type: "asset", data: null }) }, "+ Nuovo"))),
!isMobile && assets.length > 0 && (() => {
const _oper = assets.filter(a => a.status === "operativo").length;
const _manut = assets.filter(a => a.status === "in manutenzione").length;
const _fuori = assets.filter(a => a.status === "fuori servizio").length;
const _gar = assets.filter(a => { if (!a.warrantyExpiry) return false; const _d = Math.round((new Date(a.warrantyExpiry) - new Date()) / 86400000); return _d >= 0 && _d <= 90; }).length;
const _cards = [{ l: "Totali", v: assets.length, c: "var(--text-strong)" }, { l: "Operativi", v: _oper, c: "#22c55e" }, { l: "In manutenzione", v: _manut, c: "#f59e0b" }, { l: "Fuori servizio", v: _fuori, c: "#ef4444" }, { l: "Garanzie < 90gg", v: _gar, c: "#f59e0b" }];
return React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 16 } }, _cards.map(_k => React.createElement("div", { key: _k.l, style: { background: "var(--card)", border: "1px solid var(--border-2)", borderRadius: 14, padding: "14px 16px" } }, React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", fontWeight: 600, marginBottom: 6, letterSpacing: .3 } }, _k.l), React.createElement("div", { style: { fontSize: 26, fontWeight: 700, color: _k.c, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 } }, _k.v))));
})(),
!isMobile && React.createElement("div", { style: { fontSize: 11, color: "var(--text-4)", marginBottom: 8, fontStyle: "italic" } }, "\u2192 Doppio click su una riga per aprire la scheda dettaglio dell'apparecchio"),
isMobile && assetMobileView === "table" && assets.length > 0 && React.createElement("div", { style: { fontSize: 11, color: "var(--text-4)", marginBottom: 8, fontStyle: "italic" } }, "\u2192 Tocca le intestazioni per ordinare \u00B7 scorri lateralmente \u00B7 filtri sotto ogni colonna"),
assets.length === 0 ? (React.createElement(EmptyState, { icon: "\uD83C\uDFE5", title: "Nessun apparecchio ancora", subtitle: "Inizia aggiungendo il primo apparecchio del tuo parco macchine. Potrai poi gestirne verifiche di sicurezza, interventi e manutenzioni programmate.", actions: [
{ label: "+ Nuovo apparecchio", onClick: () => setModal({ type: "asset", data: null }), primary: true },
{ label: "⬆ Importa Excel/CSV", onClick: () => setModal({ type: "assetImport" }) },
{ label: "Importa backup", onClick: () => setModal({ type: "settings" }) }
] })) : (isMobile && assetMobileView === "cards") ? (React.createElement(React.Fragment, null, (() => {
const filteredAssets = assets.filter(a => {
const q = mobileSearch.assets.toLowerCase();
if (q && ![a.name, a.brand, a.model, a.serial, a.location, a.id].some(f => String(f || "").toLowerCase().includes(q)))
return false;
return matchFilters(a, "assets", {
name: x => x.name || "",
brand: x => x.brand || "", model: x => x.model || "", serial: x => x.serial || "",
location: x => x.location || "", status: x => x.status || "",
customer: x => { var _a; return ((_a = customers.find(c => c.id === x.customerId)) === null || _a === void 0 ? void 0 : _a.name) || ""; },
riskClass: x => x.riskClass || "",
iecNorm: x => x.iecNorm || "", iecClass: x => x.iecClass || "",
patientType: x => x.patientType || "",
cnd: x => x.cnd || ""
});
}).sort((a, b) => {
const ta = a.updatedAt || a.createdAt || "";
const tb = b.updatedAt || b.createdAt || "";
return tb.localeCompare(ta);
});
return (React.createElement(React.Fragment, null,
React.createElement(MobileSearch, { value: mobileSearch.assets, onChange: v => updMS("assets", v), placeholder: "Cerca apparecchio, marca, S/N\u2026", count: filteredAssets.length, total: assets.length }),
React.createElement(FilterDropdown, { filters: {
name: { label: "Nome apparecchio", options: [...new Set(assets.map(a => a.name).filter(Boolean))].sort(), value: activeFilters.assets.name },
brand: { label: "Marca", options: [...new Set(assets.map(a => a.brand).filter(Boolean))].sort(), value: activeFilters.assets.brand },
model: { label: "Modello", options: [...new Set(assets.map(a => a.model).filter(Boolean))].sort(), value: activeFilters.assets.model },
serial: { label: "Numero di serie", options: [...new Set(assets.map(a => a.serial).filter(Boolean))].sort(), value: activeFilters.assets.serial },
location: { label: "Ubicazione", options: [...new Set(assets.map(a => a.location).filter(Boolean))].sort(), value: activeFilters.assets.location },
status: { label: "Stato", options: ["operativo", "in manutenzione", "fuori servizio"], value: activeFilters.assets.status },
customer: { label: "Cliente", options: [...new Set(assets.map(a => { var _a; return (_a = customers.find(c => c.id === a.customerId)) === null || _a === void 0 ? void 0 : _a.name; }).filter(Boolean))].sort(), value: activeFilters.assets.customer },
riskClass: { label: "Classe rischio (MDR)", options: ["I", "IIa", "IIb", "III"], value: activeFilters.assets.riskClass },
iecClass: { label: "Classe elettrica", options: ["I", "II", "III"], value: activeFilters.assets.iecClass },
patientType: { label: "Tipo parte applicata", options: ["B", "BF", "CF"], value: activeFilters.assets.patientType },
cnd: { label: "CND", options: [...new Set(assets.map(a => a.cnd).filter(Boolean))].sort(), value: activeFilters.assets.cnd },
}, onChange: (k, v) => setFilter("assets", k, v), onClearAll: () => clearFilters("assets") }),
React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", marginBottom: 8 } },
React.createElement("button", { onClick: toggleCompact, style: { background: "var(--card)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "6px 12px", color: "var(--text-2)", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 } }, compactView ? "▤ Vista estesa" : "≣ Vista compatta")),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: compactView ? 0 : 10 } },
filteredAssets.length === 0 && (React.createElement("div", { style: { textAlign: "center", padding: "30px 20px", background: "var(--surface)", borderRadius: 10, border: "1px dashed var(--border)", fontSize: 13, color: "var(--text-3)" } }, "Nessun apparecchio corrisponde ai filtri")),
filteredAssets.map(a => {
const cust = customers.find(c => c.id === a.customerId);
const days = a.nextService ? Math.round((new Date(a.nextService) - new Date()) / 86400000) : null;
const statusColor = STATUS_COLOR[a.status] || "var(--text-3)";
const displayName = a.name || a.brand || a.model || ("Apparecchio " + a.id);
const brandModel = [a.brand, a.model].filter(Boolean).join(" ");
if (compactView) {
return (React.createElement("div", { key: a.id, onClick: () => openAsset(a.id), style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderBottom: "1px solid var(--border-2)", cursor: "pointer", background: "var(--surface)" } },
React.createElement("span", { style: { width: 8, height: 8, borderRadius: "50%", background: statusColor, flexShrink: 0 } }),
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 7, whiteSpace: "nowrap", overflow: "hidden" } },
React.createElement("span", { style: { color: "#5eead4", fontSize: 13, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0 } }, a.assetCode || a.id),
React.createElement("span", { style: { color: "var(--text-strong)", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis" } }, displayName)),
React.createElement("div", { style: { color: "var(--text-3)", fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, [a.serial && ("S/N " + a.serial), brandModel, a.location].filter(Boolean).join(" · ") || "—")),
days !== null && React.createElement(AlertChip, { days: days })));
}
return (React.createElement(SwipeableCard, { key: a.id, onDelete: () => delAsset(a.id) },
React.createElement("div", { style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 12, overflow: "hidden" } },
React.createElement("div", { onClick: () => openAsset(a.id), style: { padding: "12px 14px 10px", cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", borderBottom: "1px solid var(--border-2)" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 5 } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" } },
React.createElement("strong", { style: { color: "#5eead4", fontSize: 16, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: .5, lineHeight: 1.2 } }, a.assetCode || a.id),
a.serial && React.createElement("span", { style: { fontSize: 12, color: "var(--text-2)", fontFamily: "'IBM Plex Mono', monospace" } },
"S/N ",
a.serial),
assetHasOpenRecall(a.id, recalls) && React.createElement("span", { onClick: function (e) { e.stopPropagation(); var rc = assetOpenRecall(a.id, recalls); if (rc) openRecall(rc.id); }, title: "Apri avviso di sicurezza", style: { fontSize: 11, color: "#fca5a5", background: "#3a1212", border: "1px solid #ef444466", borderRadius: 6, padding: "1px 6px", fontWeight: 700, cursor: "pointer" } }, "⚠ avviso")),
React.createElement("div", { style: { color: "var(--text)", fontSize: 13, marginTop: 3, wordBreak: "break-word", lineHeight: 1.3 } }, displayName)),
React.createElement(Badge, { text: a.status, color: statusColor })),
brandModel && React.createElement("div", { style: { fontSize: 12, color: "var(--text-2)", marginBottom: 3 } }, brandModel),
cust && React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", marginTop: 5 } },
"\uD83C\uDFE2 ",
cust.name),
(a.riskClass || a.location || days !== null) && (React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginTop: 8 } },
React.createElement("div", { style: { display: "flex", gap: 5, fontSize: 10, color: "var(--text-3)", alignItems: "center", flexWrap: "wrap" } },
a.riskClass && React.createElement("span", { style: { padding: "1px 6px", border: "1px solid var(--border)", borderRadius: 4 } },
"Cl.",
a.riskClass),
a.location && React.createElement("span", null,
"\uD83D\uDCCD ",
a.location)),
days !== null && React.createElement(AlertChip, { days: days })))),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 36px", gap: 0, background: "var(--bg)" } },
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: "iec", assetId: a.id, data: null }); }, style: { background: "transparent", color: "#a855f7", border: "none", borderRight: "1px solid var(--border-2)", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u26A1 Sicur."),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: "func", assetId: a.id, data: null }); }, style: { background: "transparent", color: "#06b6d4", border: "none", borderRight: "1px solid var(--border-2)", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u2713 Funz."),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: "asset", data: a }); }, style: { background: "transparent", color: "var(--text-2)", border: "none", borderRight: "1px solid var(--border-2)", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u270F Mod."),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); delAsset(a.id); }, title: "Elimina apparecchio", style: { background: "transparent", color: "#ef4444", border: "none", padding: "10px 4px", fontSize: 14, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u2715")))));
}))));
})())) : (React.createElement(ExcelTable, { exportName: "MedTrace_apparecchi", defaultSort: "assetCode", onRowClick: row => openAsset(row.id), rowBg: row => row.status === "fuori servizio" ? "#ef333308" : row.status === "in manutenzione" ? "#f59e0b08" : "", cols: [
{ key: "assetCode", label: "Codice", render: v => React.createElement("strong", { style: { color: "#5eead4", fontFamily: "'IBM Plex Mono', monospace" } }, v || "—") },
{ key: "name", label: "Apparecchio", render: v => React.createElement("span", { style: { color: "var(--text-strong)" } }, v) },
{ key: "brand", label: "Marca" },
{ key: "model", label: "Modello" },
{ key: "cnd", label: "CND", opts: [...new Set(assets.map(a => a.cnd).filter(Boolean))], render: v => React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 } }, v || "—") },
{ key: "serial", label: "N. Serie", render: v => React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 } }, v || "—") },
{ key: "location", label: "Ubicazione", opts: [...new Set(assets.map(a => a.location).filter(Boolean))] },
{ key: "cliente", label: "Cliente", opts: [...new Set(assets.map(a => { var _a; return ((_a = customers.find(c => c.id === a.customerId)) === null || _a === void 0 ? void 0 : _a.name) || ""; }).filter(Boolean))] },
{ key: "status", label: "Stato", opts: ["operativo", "in manutenzione", "fuori servizio"],
render: v => React.createElement(Badge, { text: v, color: STATUS_COLOR[v] || "var(--text-3)" }) },
{ key: "nextService", label: "Prossimo Serv.", render: (v) => {
const d = v ? Math.round((new Date(v) - new Date()) / 86400000) : null;
return React.createElement(AlertChip, { days: d });
} },
{ key: "riskClass", label: "Classe R.", render: v => v ? React.createElement("span", { style: { fontWeight: 700, color: v === "C" ? "#ef4444" : v === "B" ? "#f59e0b" : "#22c55e" } }, "Cl." + v) : React.createElement("span", { style: { color: "var(--text-4)" } }, "\u2014") },
{ key: "warrantyExpiry", label: "Scad. Garanzia", render: (v) => {
if (!v)
return React.createElement("span", { style: { color: "var(--text-4)" } }, "\u2014");
const d = Math.round((new Date(v) - new Date()) / 86400000);
return React.createElement("span", { style: { color: d < 0 ? "#ef4444" : d < 90 ? "#f59e0b" : "#22c55e", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 } }, v);
} },
], rows: assets.map(a => { var _a; return (Object.assign(Object.assign({}, a), { cliente: ((_a = customers.find(c => c.id === a.customerId)) === null || _a === void 0 ? void 0 : _a.name) || "" })); }), onEdit: row => setModal({ type: "asset", data: assets.find(a => a.id === row.id) }), onDelete: id => delAsset(id), actions: row => (React.createElement(React.Fragment, null,
React.createElement("button", { onClick: () => openAsset(row.id), title: "Scheda apparecchio", style: { background: "var(--surface-3)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text-2)", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, "\uD83D\uDCCB"),
React.createElement("button", { onClick: () => setModal({ type: "iec", assetId: row.id, data: null }), title: "Verifica di Sicurezza Elettrica", style: { background: "var(--surface-3)", border: "1px solid var(--border)", borderRadius: 6, color: "#5eead4", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, "\u26A1"),
React.createElement("button", { onClick: () => setModal({ type: "func", assetId: row.id, data: null }), title: "Verifica funzionale", style: { background: "var(--surface-3)", border: "1px solid var(--border)", borderRadius: 6, color: "#a855f7", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, "\u2713"))) })))),
tab === "jobs" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 800, display: isMobile ? "none" : "block" } }, "Job / Interventi"),
React.createElement("p", { style: { color: "var(--text-3)", margin: "2px 0 0", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" } },
jobs.filter(j => j.status !== "chiuso").length,
" aperti \u00B7 ",
jobs.length,
" totali")),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: exportJobs }, "\u2B07 Excel"),
React.createElement(Btn, { sm: true, onClick: () => setModal({ type: "job", data: null }) }, "+ Nuovo"))),
jobs.length > 0 && (React.createElement("div", { style: { display: "flex", gap: 0, marginBottom: 14, background: "var(--bg)", borderRadius: 8, padding: 3, border: "1px solid var(--border-2)", width: "fit-content", maxWidth: "100%", overflow: "auto" } }, [
...(jobs.some(j => j.status === "da accettare") ? [{ id: "toaccept", label: "Da accettare", count: jobs.filter(j => j.status === "da accettare").length, color: "#818cf8" }] : []),
{ id: "open", label: "Aperti", count: jobs.filter(j => j.status !== "chiuso").length, color: "#2dd4bf" },
{ id: "all", label: "Tutti", count: jobs.length, color: "var(--text-2)" },
{ id: "closed", label: "Chiusi", count: jobs.filter(j => j.status === "chiuso").length, color: "var(--text-3)" },
].map(f => (React.createElement("button", { key: f.id, onClick: () => setJobFilter(f.id), style: {
background: jobFilter === f.id ? f.color + "22" : "transparent",
color: jobFilter === f.id ? f.color : "var(--text-2)",
border: "none",
borderRadius: 6,
padding: "6px 14px",
cursor: "pointer",
fontSize: 12,
fontWeight: 700,
touchAction: "manipulation",
WebkitTapHighlightColor: "transparent",
whiteSpace: "nowrap",
display: "flex",
alignItems: "center",
gap: 6,
} },
f.label,
React.createElement("span", { style: { fontSize: 10, opacity: .7, fontFamily: "'IBM Plex Mono', monospace" } }, f.count)))))),
jobs.length === 0 ? (React.createElement(EmptyState, { icon: "\uD83D\uDD27", title: "Nessun intervento registrato", subtitle: assets.length === 0 ? "Prima registra un apparecchio dal menu Apparecchi, poi potrai aprire job di intervento (correttivi, preventivi, tarature)." : "Apri il primo job per tracciare un intervento sui tuoi apparecchi. Puoi gestire timeline, parti utilizzate, ore di manodopera e generare PDF.", actions: assets.length === 0 ? [
{ label: "+ Nuovo apparecchio", onClick: () => setModal({ type: "asset", data: null }), primary: true }
] : [
{ label: "+ Nuovo intervento", onClick: () => setModal({ type: "job", data: null }), primary: true }
] })) : isMobile ? (React.createElement(React.Fragment, null, (() => {
const filteredJobs = jobs.filter(j => {
if (jobFilter === "open" && j.status === "chiuso")
return false;
if (jobFilter === "toaccept" && j.status !== "da accettare")
return false;
if (jobFilter === "closed" && j.status !== "chiuso")
return false;
const q = mobileSearch.jobs.toLowerCase();
if (q) {
const a = assets.find(x => x.id === j.assetId) || {};
if (![j.id, a.name, a.brand, j.assignee, j.type, j.status, j.priority].some(f => String(f || "").toLowerCase().includes(q)))
return false;
}
return matchFilters(j, "jobs", {
assetName: x => { var _a; return ((_a = assets.find(a => a.id === x.assetId)) === null || _a === void 0 ? void 0 : _a.name) || ""; },
priority: x => x.priority || "", type: x => x.type || "",
status: x => x.status || "",
assignee: x => x.assignee || "",
customer: x => { var _a; return ((_a = customers.find(c => { var _a; return c.id === (x.customerId || ((_a = assets.find(a => a.id === x.assetId)) === null || _a === void 0 ? void 0 : _a.customerId)); })) === null || _a === void 0 ? void 0 : _a.name) || ""; }
});
});
return (React.createElement(React.Fragment, null,
React.createElement(MobileSearch, { value: mobileSearch.jobs, onChange: v => updMS("jobs", v), placeholder: "Cerca job, apparecchio, tecnico\u2026", count: filteredJobs.length, total: jobs.length }),
React.createElement(FilterDropdown, { filters: {
assetName: { label: "Apparecchio", options: [...new Set(jobs.map(j => { var _a; return (_a = assets.find(a => a.id === j.assetId)) === null || _a === void 0 ? void 0 : _a.name; }).filter(Boolean))].sort(), value: activeFilters.jobs.assetName },
priority: { label: "Priorità", options: ["urgente", "alta", "normale", "bassa"], value: activeFilters.jobs.priority },
type: { label: "Tipo", options: [...new Set(jobs.map(j => j.type).filter(Boolean))].sort(), value: activeFilters.jobs.type },
status: { label: "Stato", options: [...new Set(jobs.map(j => j.status).filter(Boolean))].sort(), value: activeFilters.jobs.status },
assignee: { label: "Tecnico", options: [...new Set(jobs.map(j => j.assignee).filter(Boolean))].sort(), value: activeFilters.jobs.assignee },
customer: { label: "Cliente", options: [...new Set(jobs.map(j => { var _a; return (_a = customers.find(c => { var _a; return c.id === (j.customerId || ((_a = assets.find(a => a.id === j.assetId)) === null || _a === void 0 ? void 0 : _a.customerId)); })) === null || _a === void 0 ? void 0 : _a.name; }).filter(Boolean))].sort(), value: activeFilters.jobs.customer },
}, onChange: (k, v) => setFilter("jobs", k, v), onClearAll: () => clearFilters("jobs") }),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
filteredJobs.length === 0 && (React.createElement("div", { style: { textAlign: "center", padding: "30px 20px", background: "var(--surface)", borderRadius: 10, border: "1px dashed var(--border)", fontSize: 13, color: "var(--text-3)" } }, "Nessun job corrisponde ai filtri")),
filteredJobs.map(j => {
const a = assets.find(x => x.id === j.assetId) || {};
const c = customers.find(x => x.id === (j.customerId || a.customerId)) || {};
const total = j.parts.reduce((s, p) => { const pt = parts.find(x => x.id === p.partId); return s + (pt ? (pt.sellPrice || pt.unitPrice) * p.qty : 0); }, 0) + j.laborHours * j.laborRate;
const priColor = PRI_COLOR[j.priority] || "var(--text-3)";
const statColor = STATUS_COLOR[j.status] || "var(--text-3)";
return (React.createElement(SwipeableCard, { key: j.id, onDelete: () => delJob(j.id) },
React.createElement("div", { style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 12, overflow: "hidden", borderLeft: "3px solid " + priColor } },
React.createElement("div", { onClick: () => setModal({ type: "jobDetail", data: j }), style: { padding: "12px 14px 10px", cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", borderBottom: "1px solid var(--border-2)" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 } },
React.createElement("strong", { style: { color: "var(--text)", fontSize: 14, flex: 1, minWidth: 0, wordBreak: "break-word" } }, a.name || jobTipoLabel(j)),
React.createElement(Badge, { text: j.status, color: statColor })),
React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 6, fontSize: 11, color: "var(--text-2)" } },
React.createElement("span", { style: { padding: "1px 6px", background: priColor + "22", color: priColor, borderRadius: 4, fontSize: 10, fontWeight: 700, textTransform: "uppercase" } }, j.priority),
React.createElement("span", { style: { padding: "1px 6px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 4, fontSize: 10 } }, j.type)),
c.name && React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", marginBottom: 3 } },
"\uD83C\uDFE2 ",
c.name),
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", fontFamily: "'IBM Plex Mono', monospace" } },
"Aperto: ",
j.openDate,
j.closeDate ? " · Chiuso: " + j.closeDate : ""),
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 } },
React.createElement("span", { style: { fontSize: 11, color: "var(--text-2)" } }, j.assignee || "Tecnico non assegnato"),
React.createElement("span", { style: { fontSize: 13, color: "#a855f7", fontWeight: 800, fontFamily: "'IBM Plex Mono', monospace" } },
"\u20AC",
total.toFixed(0)))),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 36px", gap: 0, background: "var(--bg)" } },
React.createElement("button", { onClick: (e) => { e.stopPropagation(); generateJobPDF(j, assets, parts, customers, company); }, style: { background: "transparent", color: "var(--text-2)", border: "none", borderRight: "1px solid var(--border-2)", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\uD83D\uDCC4 PDF"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: "job", data: j }); }, style: { background: "transparent", color: "var(--text-2)", border: "none", borderRight: "1px solid var(--border-2)", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u270F Modifica"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); delJob(j.id); }, title: "Elimina job", style: { background: "transparent", color: "#ef4444", border: "none", padding: "10px 4px", fontSize: 14, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u2715")))));
}))));
})())) : (React.createElement(ExcelTable, { exportName: "MedTrace_job", defaultSort: "openDate", rowBg: row => row.priority === "urgente" && row.status !== "chiuso" ? "#ef333308" : row.priority === "alta" && row.status !== "chiuso" ? "#f9730008" : "", cols: [
{ key: "apparecchio", label: "Apparecchio", render: v => React.createElement("strong", { style: { color: "var(--text)" } }, v) },
{ key: "cliente", label: "Cliente", opts: [...new Set(jobs.map(j => { const a = assetById[j.assetId]; return (customerById[j.customerId || (a && a.customerId)] || {}).name || ""; }).filter(Boolean))] },
{ key: "type", label: "Tipo", opts: ["correttiva", "preventiva"] },
{ key: "priority", label: "Priorità", opts: ["urgente", "alta", "normale", "bassa"],
render: v => React.createElement(Badge, { text: v, color: PRI_COLOR[v] || "var(--text-3)" }) },
{ key: "status", label: "Stato", opts: ["da accettare", "aperto", "in corso", "in attesa ricambi", "in attesa cliente", "in attesa accesso", "chiuso"],
render: v => React.createElement(Badge, { text: v, color: STATUS_COLOR[v] || "var(--text-3)" }) },
{ key: "assignee", label: "Tecnico" },
{ key: "openDate", label: "Apertura" },
{ key: "closeDate", label: "Chiusura", render: v => v || "—" },
{ key: "totale", label: "Costo", render: v => React.createElement("span", { style: { color: "#a855f7", fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" } },
"\u20AC",
parseFloat(v || 0).toFixed(0)) },
{ key: "steps", label: "Timeline", render: (v, row) => React.createElement("span", { style: { color: "var(--text-3)", fontSize: 11, display: "flex", gap: 6, alignItems: "center" } },
row.hasIec && React.createElement("span", { title: "Verifica di Sicurezza Elettrica collegata" }, "\u26A1"),
row.hasFunc && React.createElement("span", { title: "Verifica Funzionale collegata" }, "\uD83E\uDE7A"),
v > 0 ? React.createElement("span", { title: "Passaggi registrati" },
"\uD83D\uDD52 ",
v) : (!row.hasIec && !row.hasFunc && React.createElement("span", { style: { color: "#3a3a48" } }, "\u2014"))) },
], rows: jobs.filter(j => { if (jobFilter === "open" && j.status === "chiuso")
return false; if (jobFilter === "toaccept" && j.status !== "da accettare")
return false; if (jobFilter === "closed" && j.status !== "chiuso")
return false; return true; }).map(j => {
var _a;
const a = assetById[j.assetId] || {};
const c = customerById[j.customerId || a.customerId] || {};
const tot = j.parts.reduce((s, p) => { const pt = partById[p.partId]; return s + (pt ? (pt.sellPrice || pt.unitPrice) * p.qty : 0); }, 0) + j.laborHours * j.laborRate;
return Object.assign(Object.assign({}, j), { apparecchio: a.name || j.assetId, cliente: c.name || "", totale: tot.toFixed(2), steps: ((_a = j.timeline) === null || _a === void 0 ? void 0 : _a.length) || 0, hasIec: !!j.iecReportId, hasFunc: !!j.funcReportId });
}), onEdit: row => setModal({ type: "jobDetail", data: jobs.find(j => j.id === row.id) }), onDelete: id => delJob(id), actions: row => (React.createElement(React.Fragment, null,
React.createElement("button", { onClick: () => setModal({ type: "timeline", data: jobs.find(j => j.id === row.id) }), title: "Timeline interventi", style: { background: "var(--surface-3)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text-2)", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, "\uD83D\uDD52"),
React.createElement("button", { onClick: () => generateJobPDF(jobs.find(j => j.id === row.id), assets, parts, customers, company), title: "PDF rapporto", style: { background: "var(--surface-3)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text-2)", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, "\uD83D\uDCC4"))) })))),
(tab === "parts" || tab === "withdrawals" || tab === "orders") && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 14, borderBottom: "1px solid var(--border)", paddingBottom: 0, flexWrap: "wrap" } },
React.createElement("button", { onClick: () => setTab("parts"), style: { background: tab === "parts" ? "#2dd4bf18" : "transparent", color: tab === "parts" ? "#2dd4bf" : "var(--text-2)", border: "none", borderBottom: tab === "parts" ? "2px solid #2dd4bf" : "2px solid transparent", padding: "8px 14px", cursor: "pointer", fontSize: 13, fontWeight: 700, marginBottom: -1, touchAction: "manipulation" } },
" Stock parti",
stats.lowStock > 0 ? ` (${stats.lowStock}⚠)` : ""),
React.createElement("button", { onClick: () => setTab("withdrawals"), style: { background: tab === "withdrawals" ? "#2dd4bf18" : "transparent", color: tab === "withdrawals" ? "#2dd4bf" : "var(--text-2)", border: "none", borderBottom: tab === "withdrawals" ? "2px solid #2dd4bf" : "2px solid transparent", padding: "8px 14px", cursor: "pointer", fontSize: 13, fontWeight: 700, marginBottom: -1, touchAction: "manipulation" } },
" Scarichi (",
withdrawals.length,
")"),
React.createElement("button", { onClick: () => setTab("orders"), style: { background: tab === "orders" ? "#2dd4bf18" : "transparent", color: tab === "orders" ? "#2dd4bf" : "var(--text-2)", border: "none", borderBottom: tab === "orders" ? "2px solid #2dd4bf" : "2px solid transparent", padding: "8px 14px", cursor: "pointer", fontSize: 13, fontWeight: 700, marginBottom: -1, touchAction: "manipulation" } },
" Ordini (",
orders.length,
")")))),
tab === "parts" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 800, display: isMobile ? "none" : "block" } }, "Stock Parti"),
React.createElement("p", { style: { color: "var(--text-3)", margin: "2px 0 0", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" } },
"Costo: \u20AC",
stats.stockValue.toFixed(2),
" \u00B7 Vendita: \u20AC",
stats.stockSellValue.toFixed(2),
" \u00B7 ",
stats.lowStock,
" sotto min.")),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: exportParts }, "\u2B07 Excel"),
React.createElement(Btn, { sm: true, variant: "success", onClick: () => setModal({ type: "withdrawal" }) }, " Scarica"),
React.createElement(Btn, { sm: true, onClick: () => setModal({ type: "part", data: null }) }, "+ Nuova"))),
parts.length === 0 ? (React.createElement(EmptyState, { icon: "\uD83D\uDCE6", title: "Magazzino vuoto", subtitle: "Aggiungi le parti di ricambio del tuo magazzino: avrai sotto controllo stock minimo, alert sotto-scorta, costo e prezzo vendita per ogni codice.", actions: [
{ label: "+ Nuova parte", onClick: () => setModal({ type: "part", data: null }), primary: true }
] })) : isMobile ? (React.createElement(React.Fragment, null, (() => {
const filteredParts = parts.filter(p => {
const q = mobileSearch.parts.toLowerCase();
if (q && ![p.code, p.name, p.brand, p.location, p.id].some(f => String(f || "").toLowerCase().includes(q)))
return false;
return matchFilters(p, "parts", {
code: x => x.code || "", name: x => x.name || "",
brand: x => x.brand || "", location: x => x.location || "",
supplier: x => x.supplier || "",
stockStatus: x => x.qty === 0 ? "esaurita" : (x.qty <= x.minQty ? "sotto scorta" : "disponibile")
});
});
return (React.createElement(React.Fragment, null,
React.createElement(MobileSearch, { value: mobileSearch.parts, onChange: v => updMS("parts", v), placeholder: "Cerca codice, nome, marca\u2026", count: filteredParts.length, total: parts.length }),
React.createElement(FilterDropdown, { filters: {
code: { label: "Codice", options: [...new Set(parts.map(p => p.code).filter(Boolean))].sort(), value: activeFilters.parts.code },
name: { label: "Nome parte", options: [...new Set(parts.map(p => p.name).filter(Boolean))].sort(), value: activeFilters.parts.name },
brand: { label: "Marca", options: [...new Set(parts.map(p => p.brand).filter(Boolean))].sort(), value: activeFilters.parts.brand },
location: { label: "Ubicazione", options: [...new Set(parts.map(p => p.location).filter(Boolean))].sort(), value: activeFilters.parts.location },
supplier: { label: "Fornitore", options: [...new Set(parts.map(p => p.supplier).filter(Boolean))].sort(), value: activeFilters.parts.supplier },
stockStatus: { label: "Stato stock", options: ["disponibile", "sotto scorta", "esaurita"], value: activeFilters.parts.stockStatus },
}, onChange: (k, v) => setFilter("parts", k, v), onClearAll: () => clearFilters("parts") }),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
filteredParts.length === 0 && (React.createElement("div", { style: { textAlign: "center", padding: "30px 20px", background: "var(--surface)", borderRadius: 10, border: "1px dashed var(--border)", fontSize: 13, color: "var(--text-3)" } }, "Nessuna parte corrisponde ai filtri")),
filteredParts.map(p => {
const low = p.qty <= p.minQty;
const zero = p.qty === 0;
const borderC = zero ? "#ef4444" : low ? "#f59e0b" : "#22c55e";
return (React.createElement(SwipeableCard, { key: p.id, onDelete: () => delPart(p.id) },
React.createElement("div", { style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 12, overflow: "hidden", borderLeft: "3px solid " + borderC } },
React.createElement("div", { onClick: () => setModal({ type: "part", data: p }), style: { padding: "12px 14px 10px", cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", borderBottom: "1px solid var(--border-2)" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 } },
React.createElement("strong", { style: { color: "var(--text)", fontSize: 14, flex: 1, minWidth: 0, wordBreak: "break-word" } }, p.name || p.code || ("Parte " + p.id)),
React.createElement("span", { style: { padding: "2px 8px", background: borderC + "22", color: borderC, borderRadius: 6, fontSize: 13, fontWeight: 800, whiteSpace: "nowrap", fontFamily: "'IBM Plex Mono', monospace" } }, p.qty)),
p.code && React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 3 } }, p.code),
p.brand && React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginBottom: 3 } }, p.brand),
p.location && React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", marginTop: 3 } },
"\uD83D\uDCCD ",
p.location),
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--border-2)", fontSize: 11 } },
React.createElement("span", { style: { color: "var(--text-3)" } },
"Min: ",
React.createElement("span", { style: { color: "var(--text-2)", fontFamily: "'IBM Plex Mono', monospace" } }, p.minQty)),
React.createElement("span", { style: { color: "var(--text-3)" } },
"Acquisto: ",
React.createElement("span", { style: { color: "var(--text-2)", fontFamily: "'IBM Plex Mono', monospace" } },
"\u20AC",
parseFloat(p.unitPrice || 0).toFixed(2))),
React.createElement("span", { style: { color: "#22c55e", fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" } },
"\u20AC",
parseFloat(p.sellPrice || p.unitPrice || 0).toFixed(2)))),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 36px", gap: 0, background: "var(--bg)" } },
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: "withdrawal", partId: p.id }); }, style: { background: "transparent", color: "#22c55e", border: "none", borderRight: "1px solid var(--border-2)", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u2193 Scarica"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: "part", data: p }); }, style: { background: "transparent", color: "var(--text-2)", border: "none", borderRight: "1px solid var(--border-2)", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u270F Modifica"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); delPart(p.id); }, title: "Elimina", style: { background: "transparent", color: "#ef4444", border: "none", padding: "10px 4px", fontSize: 14, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u2715")))));
}))));
})())) : (React.createElement(ExcelTable, { exportName: "MedTrace_ricambi", defaultSort: "name", rowBg: row => row.qty === 0 ? "#ef333308" : row.qty <= row.minQty ? "#f59e0b08" : "", cols: [
{ key: "code", label: "Codice", render: v => React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 } }, v) },
{ key: "name", label: "Nome", render: v => React.createElement("strong", { style: { color: "var(--text)" } }, v) },
{ key: "brand", label: "Marca", opts: [...new Set(parts.map(p => p.brand).filter(Boolean))] },
{ key: "location", label: "Ubicazione", opts: [...new Set(parts.map(p => p.location).filter(Boolean))] },
{ key: "qty", label: "Q.tà", render: (v, row) => React.createElement("span", { style: { fontWeight: 800, color: v === 0 ? "#ef4444" : v <= row.minQty ? "#f59e0b" : "#22c55e" } }, v) },
{ key: "minQty", label: "Min.", render: v => React.createElement("span", { style: { color: "var(--text-3)" } }, v) },
{ key: "unitPrice", label: "Acquisto", render: v => React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace" } },
"\u20AC",
parseFloat(v).toFixed(2)) },
{ key: "sellPrice", label: "Vendita", render: v => React.createElement("span", { style: { color: "#a855f7", fontFamily: "'IBM Plex Mono', monospace" } },
"\u20AC",
parseFloat(v || 0).toFixed(2)) },
{ key: "margine", label: "Margine", render: v => React.createElement("span", { style: { color: "#22c55e", fontFamily: "'IBM Plex Mono', monospace" } },
"\u20AC",
parseFloat(v || 0).toFixed(2)) },
{ key: "valoreStock", label: "Val. Stock", render: v => React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace" } },
"\u20AC",
parseFloat(v || 0).toFixed(2)) },
], rows: parts.map(p => (Object.assign(Object.assign({}, p), { sellPrice: p.sellPrice || p.unitPrice, margine: ((p.sellPrice || p.unitPrice) - p.unitPrice).toFixed(2), valoreStock: (p.qty * p.unitPrice).toFixed(2) }))), onEdit: row => setModal({ type: "part", data: parts.find(p => p.id === row.id) }), onDelete: id => delPart(id), actions: row => (React.createElement("button", { onClick: () => duplicatePart(parts.find(p => p.id === row.id)), title: "Duplica parte", style: { background: "var(--surface-3)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text-2)", padding: "3px 7px", cursor: "pointer", fontSize: 11, fontWeight: 700 } }, "\u2398")) })))),
tab === "customers" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 800, display: isMobile ? "none" : "block" } }, "Clienti"),
React.createElement("p", { style: { color: "var(--text-3)", margin: "2px 0 0", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" } },
customers.length,
" totali")),
isAdmin && React.createElement(Btn, { sm: true, onClick: () => setModal({ type: "customer", data: null }) }, "+ Nuovo")),
customers.length === 0 ? (React.createElement(EmptyState, { icon: "\uD83C\uDFE2", title: "Nessun cliente registrato", subtitle: "Aggiungi i tuoi clienti (cliniche, ospedali, studi medici, RSA) per associare apparecchi, preventivi e interventi.", actions: isAdmin ? [
{ label: "+ Nuovo cliente", onClick: () => setModal({ type: "customer", data: null }), primary: true }
] : [] })) : isMobile ? (React.createElement(React.Fragment, null, (() => {
const filteredCust = customers.filter(c => {
const q = mobileSearch.customers.toLowerCase();
if (q && ![c.name, c.contact, c.email, c.phone, c.vat, c.address].some(f => String(f || "").toLowerCase().includes(q)))
return false;
return matchFilters(c, "customers", {
city: x => { const addr = x.address || ""; const parts = addr.split(","); return (parts[parts.length - 1] || "").trim(); },
vat: x => x.vat || ""
});
});
return (React.createElement(React.Fragment, null,
React.createElement(MobileSearch, { value: mobileSearch.customers, onChange: v => updMS("customers", v), placeholder: "Cerca cliente, contatto, email\u2026", count: filteredCust.length, total: customers.length }),
React.createElement(FilterDropdown, { filters: {
city: { label: "Città / Località", options: [...new Set(customers.map(c => { const addr = c.address || ""; const parts = addr.split(","); return (parts[parts.length - 1] || "").trim(); }).filter(Boolean))].sort(), value: activeFilters.customers.city },
vat: { label: "P.IVA", options: [...new Set(customers.map(c => c.vat).filter(Boolean))].sort(), value: activeFilters.customers.vat },
}, onChange: (k, v) => setFilter("customers", k, v), onClearAll: () => clearFilters("customers") }),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
filteredCust.length === 0 && (React.createElement("div", { style: { textAlign: "center", padding: "30px 20px", background: "var(--surface)", borderRadius: 10, border: "1px dashed var(--border)", fontSize: 13, color: "var(--text-3)" } }, "Nessun cliente corrisponde ai filtri")),
filteredCust.map(c => {
const nApp = assets.filter(a => a.customerId === c.id).length;
return (React.createElement(SwipeableCard, { key: c.id, onDelete: isAdmin ? (() => delCustomer(c.id)) : undefined },
React.createElement("div", { style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 12, overflow: "hidden" } },
React.createElement("div", { onClick: () => setModal({ type: "customer", data: c }), style: { padding: "12px 14px 10px", cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", borderBottom: "1px solid var(--border-2)" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 } },
React.createElement("strong", { style: { color: "var(--text)", fontSize: 14, flex: 1, minWidth: 0, wordBreak: "break-word" } }, c.name || ("Cliente " + c.id)),
nApp > 0 && React.createElement("span", { style: { padding: "2px 8px", background: "#2dd4bf22", color: "#2dd4bf", borderRadius: 6, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" } },
nApp,
" app.")),
c.contact && React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", marginBottom: 3 } },
" ",
c.contact),
c.email && React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", marginBottom: 3, wordBreak: "break-all" } },
" ",
c.email),
c.phone && React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", marginBottom: 3, fontFamily: "'IBM Plex Mono', monospace" } },
" ",
c.phone),
c.vat && React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", fontFamily: "'IBM Plex Mono', monospace", marginTop: 4 } },
"P.IVA: ",
c.vat),
c.address && React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", marginTop: 4 } },
"\uD83D\uDCCD ",
c.address)),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "44px 1fr 36px", gap: 0, background: "var(--bg)" } },
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: "clientReport", data: c }); }, title: "Report parco macchine", style: { background: "transparent", color: "#5eead4", border: "none", borderRight: "1px solid var(--border-2)", padding: "10px 0", cursor: "pointer", fontSize: 14 } }, "\uD83D\uDCCB"),
isAdmin && React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: "customer", data: c }); }, style: { background: "transparent", color: "var(--text-2)", border: "none", borderRight: "1px solid var(--border-2)", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u270F Modifica"),
isAdmin && React.createElement("button", { onClick: (e) => { e.stopPropagation(); delCustomer(c.id); }, title: "Elimina cliente", style: { background: "transparent", color: "#ef4444", border: "none", padding: "10px 4px", fontSize: 14, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u2715")))));
}))));
})())) : (React.createElement(ExcelTable, { exportName: "MedTrace_clienti", defaultSort: "name", cols: [
{ key: "name", label: "Ragione Sociale", render: v => React.createElement("strong", { style: { color: "var(--text)" } }, v) },
{ key: "vat", label: "P.IVA", render: v => React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 } }, v || "—") },
{ key: "contact", label: "Referente" },
{ key: "email", label: "Email" },
{ key: "phone", label: "Telefono", render: v => React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace" } }, v || "—") },
{ key: "address", label: "Indirizzo" },
{ key: "nApparecchi", label: "Apparecchi", render: v => React.createElement("span", { style: { color: "#2dd4bf", fontWeight: 700 } }, v) },
], rows: customers.map(c => (Object.assign(Object.assign({}, c), { nApparecchi: assets.filter(a => a.customerId === c.id).length }))), onEdit: isAdmin ? (row => setModal({ type: "customer", data: customers.find(c => c.id === row.id) })) : undefined, onDelete: isAdmin ? (id => delCustomer(id)) : undefined, actions: row => (React.createElement(React.Fragment, null,
React.createElement("button", { onClick: () => setModal({ type: "clientReport", data: customers.find(c => c.id === row.id) }), title: "Report parco macchine", style: { background: "#2dd4bf15", border: "1px solid #2dd4bf33", borderRadius: 6, color: "#5eead4", padding: "3px 7px", cursor: "pointer", fontSize: 11, fontWeight: 700, marginRight: 2 } }, "\uD83D\uDCCB"),
React.createElement("button", { onClick: () => duplicateCustomer(customers.find(c => c.id === row.id)), title: "Duplica cliente", style: { background: "var(--surface-3)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text-2)", padding: "3px 7px", cursor: "pointer", fontSize: 11, fontWeight: 700 } }, "\u2398"))) })))),
tab === "invoices" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 800, display: isMobile ? "none" : "block" } }, "Preventivi"),
React.createElement("p", { style: { color: "var(--text-3)", margin: "2px 0 0", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" } },
stats.pendingInvoices,
" in sospeso \u00B7 ",
invoices.length,
" totali")),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: exportInvoices }, "\u2B07 Excel"),
React.createElement(Btn, { sm: true, onClick: () => setModal({ type: "invoice", data: null }) }, "+ Nuova"))),
invoices.length === 0 ? (React.createElement(EmptyState, { icon: "\uD83D\uDCC4", title: "Nessun preventivo emesso", subtitle: "Crea preventivi professionali per i tuoi clienti. Puoi importare manodopera e parti direttamente da un job esistente.", actions: [
{ label: "+ Nuovo preventivo", onClick: () => setModal({ type: "invoice", data: null }), primary: true }
] })) : isMobile ? (React.createElement(React.Fragment, null, (() => {
const filteredInvoices = invoices.filter(i => {
const q = mobileSearch.invoices.toLowerCase();
if (q) {
const c = customers.find(x => x.id === i.customerId) || {};
if (![i.number, i.date, i.status, c.name].some(f => String(f || "").toLowerCase().includes(q)))
return false;
}
return matchFilters(i, "invoices", {
number: x => x.number || "",
status: x => x.status || "",
customer: x => { var _a; return ((_a = customers.find(c => c.id === x.customerId)) === null || _a === void 0 ? void 0 : _a.name) || ""; }
});
});
return (React.createElement(React.Fragment, null,
React.createElement(MobileSearch, { value: mobileSearch.invoices, onChange: v => updMS("invoices", v), placeholder: "Cerca preventivo, cliente\u2026", count: filteredInvoices.length, total: invoices.length }),
React.createElement(FilterDropdown, { filters: {
number: { label: "Numero preventivo", options: [...new Set(invoices.map(i => i.number).filter(Boolean))].sort(), value: activeFilters.invoices.number },
status: { label: "Stato", options: ["bozza", "emessa", "pagata", "scaduta", "annullato"], value: activeFilters.invoices.status },
customer: { label: "Cliente", options: [...new Set(invoices.map(i => { var _a; return (_a = customers.find(c => c.id === i.customerId)) === null || _a === void 0 ? void 0 : _a.name; }).filter(Boolean))].sort(), value: activeFilters.invoices.customer },
}, onChange: (k, v) => setFilter("invoices", k, v), onClearAll: () => clearFilters("invoices") }),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
filteredInvoices.length === 0 && (React.createElement("div", { style: { textAlign: "center", padding: "30px 20px", background: "var(--surface)", borderRadius: 10, border: "1px dashed var(--border)", fontSize: 13, color: "var(--text-3)" } }, "Nessun preventivo corrisponde ai filtri")),
filteredInvoices.map(i => {
const c = customers.find(x => x.id === i.customerId) || {};
const sub = i.items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
const vat = i.items.reduce((s, it) => s + it.qty * it.unitPrice * it.vat / 100, 0);
const tot = sub + vat;
const statColor = STATUS_COLOR[i.status] || "var(--text-2)";
return (React.createElement(SwipeableCard, { key: i.id, onDelete: () => delInvoice(i.id) },
React.createElement("div", { style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 12, overflow: "hidden" } },
React.createElement("div", { onClick: () => setModal({ type: "invoice", data: i }), style: { padding: "12px 14px 10px", cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", borderBottom: "1px solid var(--border-2)" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 } },
React.createElement("strong", { style: { color: "var(--text)", fontSize: 14, fontFamily: "'IBM Plex Mono', monospace", flex: 1, minWidth: 0, wordBreak: "break-word" } }, i.number),
React.createElement(Badge, { text: i.status, color: statColor })),
c.name && React.createElement("div", { style: { fontSize: 12, color: "var(--text-2)", marginBottom: 3 } },
"\uD83C\uDFE2 ",
c.name),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", fontFamily: "'IBM Plex Mono', monospace" } },
"Data: ",
i.date,
i.dueDate ? " · Scad: " + i.dueDate : ""),
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--border-2)" } },
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)" } },
i.items.length,
" ",
i.items.length === 1 ? "voce" : "voci",
" \u00B7 IVA \u20AC",
vat.toFixed(0)),
React.createElement("span", { style: { fontSize: 16, color: "#22c55e", fontWeight: 800, fontFamily: "'IBM Plex Mono', monospace" } },
"\u20AC",
tot.toFixed(2)))),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 36px", gap: 0, background: "var(--bg)" } },
React.createElement("button", { onClick: (e) => { e.stopPropagation(); generateInvoicePDF(i, c, jobs, assets, parts, company); }, style: { background: "transparent", color: "var(--text-2)", border: "none", borderRight: "1px solid var(--border-2)", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\uD83D\uDCC4 PDF"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: "invoice", data: i }); }, style: { background: "transparent", color: "var(--text-2)", border: "none", borderRight: "1px solid var(--border-2)", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u270F Modifica"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); delInvoice(i.id); }, title: "Elimina", style: { background: "transparent", color: "#ef4444", border: "none", padding: "10px 4px", fontSize: 14, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u2715")))));
}))));
})())) : (React.createElement(ExcelTable, { exportName: "MedTrace_fatture", defaultSort: "date", cols: [
{ key: "number", label: "N. Preventivo", render: v => React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: "var(--text)" } }, v) },
{ key: "cliente", label: "Cliente", opts: [...new Set(invoices.map(i => { var _a; return ((_a = customers.find(c => c.id === i.customerId)) === null || _a === void 0 ? void 0 : _a.name) || ""; }).filter(Boolean))] },
{ key: "date", label: "Data" },
{ key: "dueDate", label: "Scadenza", render: v => v || "—" },
{ key: "status", label: "Stato", opts: ["bozza", "emessa", "pagata", "scaduta", "annullato"], render: v => React.createElement(Badge, { text: v, color: STATUS_COLOR[v] || "var(--text-2)" }) },
{ key: "imponibile", label: "Imponibile", render: v => React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace" } },
"\u20AC",
v) },
{ key: "iva", label: "IVA", render: v => React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", color: "var(--text-3)" } },
"\u20AC",
v) },
{ key: "totale", label: "Totale", render: v => React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 800, color: "#22c55e" } },
"\u20AC",
v) },
], rows: invoices.map(i => { var _a; const sub = i.items.reduce((s, it) => s + it.qty * it.unitPrice, 0); const vat = i.items.reduce((s, it) => s + it.qty * it.unitPrice * it.vat / 100, 0); return Object.assign(Object.assign({}, i), { cliente: ((_a = customers.find(c => c.id === i.customerId)) === null || _a === void 0 ? void 0 : _a.name) || "—", imponibile: sub.toFixed(2), iva: vat.toFixed(2), totale: (sub + vat).toFixed(2) }); }), onEdit: row => setModal({ type: "invoice", data: invoices.find(i => i.id === row.id) }), onDelete: id => delInvoice(id), actions: row => {
const inv = invoices.find(i => i.id === row.id);
const cust = customers.find(c => c.id === (inv === null || inv === void 0 ? void 0 : inv.customerId));
return (React.createElement(React.Fragment, null,
React.createElement("button", { onClick: () => generateInvoicePDF(inv, cust, jobs, assets, parts, company), title: "PDF", style: { background: "var(--surface-3)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text-2)", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }),
(inv === null || inv === void 0 ? void 0 : inv.status) !== "pagata" && (inv === null || inv === void 0 ? void 0 : inv.status) !== "annullato" && React.createElement("button", { onClick: () => markInvoicePaid(inv), title: "Segna pagata", style: { background: "#22c55e15", border: "1px solid #22c55e33", borderRadius: 6, color: "#22c55e", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, "\u2713")));
} })))),
tab === "calendar" && (React.createElement("div", null,
React.createElement("h1", { style: { margin: "0 0 16px", fontSize: 18, fontWeight: 800 } }, "Calendario Manutenzioni"),
upcomingMaintenance.filter(a => a.daysToService < 0).length > 0 && (React.createElement("div", { style: { background: "#ef444415", border: "1px solid #ef444433", borderLeft: "4px solid #ef4444", borderRadius: 8, padding: "10px 16px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" } },
React.createElement("span", { style: { color: "#ef4444", fontWeight: 700, fontSize: 13 } },
"! ",
upcomingMaintenance.filter(a => a.daysToService < 0).length,
" manutenzioni SCADUTE \u2014 intervenire subito"))),
upcomingMaintenance.filter(a => a.daysToService >= 0 && a.daysToService <= 7).length > 0 && (React.createElement("div", { style: { background: "#f9730015", border: "1px solid #f9730033", borderLeft: "4px solid #f97316", borderRadius: 8, padding: "10px 16px", marginBottom: 10 } },
React.createElement("span", { style: { color: "#f97316", fontWeight: 700, fontSize: 13 } },
"\u26A0 ",
upcomingMaintenance.filter(a => a.daysToService >= 0 && a.daysToService <= 7).length,
" manutenzioni entro 7 giorni"))),
React.createElement(ExcelTable, { exportName: "MedTrace_scadenzario_verifiche", defaultSort: "daysToService", rowBg: row => row.daysToService < 0 ? "#ef333308" : row.daysToService <= 7 ? "#f9730008" : row.daysToService <= 30 ? "#f59e0b08" : "", cols: [
{ key: "name", label: "Apparecchio", render: v => React.createElement("strong", { style: { color: "var(--text)" } }, v) },
{ key: "brand", label: "Marca" },
{ key: "location", label: "Ubicazione", opts: [...new Set(assets.map(a => a.location).filter(Boolean))] },
{ key: "cliente", label: "Cliente", opts: [...new Set(assets.map(a => { var _a; return ((_a = customers.find(c => c.id === a.customerId)) === null || _a === void 0 ? void 0 : _a.name) || ""; }).filter(Boolean))] },
{ key: "status", label: "Stato", opts: ["operativo", "in manutenzione", "fuori servizio"], render: v => React.createElement(Badge, { text: v, color: STATUS_COLOR[v] || "var(--text-3)" }) },
{ key: "nextService", label: "Data manut." },
{ key: "daysToService", label: "Scadenza", render: v => React.createElement(AlertChip, { days: v }) },
{ key: "serviceInterval", label: "Intervallo (mesi)" },
], rows: assets.filter(a => a.nextService).map(a => { var _a; return (Object.assign(Object.assign({}, a), { cliente: ((_a = customers.find(c => c.id === a.customerId)) === null || _a === void 0 ? void 0 : _a.name) || "", daysToService: Math.round((new Date(a.nextService) - new Date()) / 86400000) })); }), actions: row => (React.createElement("button", { onClick: () => setModal({ type: "job", data: { assetId: row.id, type: "preventiva", priority: "normale", status: "aperto", description: "Manutenzione programmata", openDate: new Date().toISOString().slice(0, 10), parts: [], laborHours: 0, laborRate: 55, notes: "", timeline: [], photos: [] } }), style: { background: "#2dd4bf15", border: "1px solid #2563eb33", borderRadius: 6, color: "#5eead4", padding: "3px 8px", cursor: "pointer", fontSize: 11, whiteSpace: "nowrap" } }, "+ Job")) }))),
tab === "finance" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", { style: { fontSize: 18, fontWeight: 800 } }, "Analytics & Report"),
React.createElement("div", { style: { display: "flex", gap: 6 } },
React.createElement("select", { value: filterYear, onChange: e => setFilterYear(e.target.value), style: { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 11px", color: "var(--text)", fontSize: 12 } }, [new Date().getFullYear() - 2, new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1].map(y => React.createElement("option", { key: y, value: y }, y))),
React.createElement("select", { value: filterMonth, onChange: e => setFilterMonth(e.target.value), style: { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 11px", color: "var(--text)", fontSize: 12 } },
React.createElement("option", { value: "" }, "Anno intero"),
["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"].map((m, i) => React.createElement("option", { key: i, value: i }, m))))),
React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 } },
React.createElement(Pill, { label: "Ricavi (imponibile)", value: "€" + financials.revenue.toFixed(2), color: "#22c55e" }),
React.createElement(Pill, { label: "IVA da versare", value: "€" + financials.vatCollected.toFixed(2), color: "#f59e0b" }),
React.createElement(Pill, { label: "Costo parti acquistate", value: "€" + financials.costsPartsBought.toFixed(2), color: "#ef4444" }),
React.createElement(Pill, { label: "Costo parti usate", value: "€" + financials.costsPartsUsed.toFixed(2), color: "#f97316" })),
React.createElement("div", { style: { background: "var(--surface)", borderRadius: 12, padding: "16px", border: "1px solid var(--border-2)", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" } },
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 4 } }, " Margine Lordo Stimato"),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-4)" } }, "Ricavi \u2212 costo parti usate nei job")),
React.createElement("span", { style: { color: "#22c55e", fontWeight: 800, fontSize: 22, fontFamily: "'IBM Plex Mono', monospace" } },
"\u20AC",
financials.margin.toFixed(2))),
React.createElement("div", { style: { background: "var(--surface)", borderRadius: 12, padding: "16px", border: "1px solid var(--border-2)", marginBottom: 14 } },
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 8 } },
"Ricavi mensili \u2014 ",
filterYear),
React.createElement(BarChart, { data: financials.monthlyData, color: "#22c55e" })),
financials.periodInvoices.length > 0 && (React.createElement("div", { style: { background: "var(--surface)", borderRadius: 12, padding: "16px", border: "1px solid var(--border-2)" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } },
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } },
"Preventivi del periodo (",
financials.periodInvoices.length,
")"),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: exportInvoices }, "\u2B07 Excel")),
financials.periodInvoices.map(inv => {
const cust = customers.find(c => c.id === inv.customerId);
const tot = inv.items.reduce((s, it) => s + it.qty * it.unitPrice * (1 + it.vat / 100), 0);
return (React.createElement("div", { key: inv.id, style: { display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid var(--border)", gap: 10, flexWrap: "wrap", alignItems: "center" } },
React.createElement("span", { style: { fontSize: 12, color: "var(--text-3)", fontFamily: "'IBM Plex Mono', monospace" } }, inv.number),
React.createElement(Badge, { text: inv.status, color: STATUS_COLOR[inv.status] || "var(--text-2)" }),
React.createElement("span", { style: { fontSize: 12, color: "var(--text-2)", flex: 1, minWidth: 100 } }, (cust === null || cust === void 0 ? void 0 : cust.name) || "—"),
React.createElement("span", { style: { fontSize: 11, color: "var(--text-3)" } }, inv.date),
React.createElement("span", { style: { fontSize: 13, fontWeight: 800, color: "#22c55e", fontFamily: "'IBM Plex Mono', monospace" } },
"\u20AC",
tot.toFixed(2))));
}))))),
tab === "ppm" && (React.createElement(PpmPage, { setModal: setModal, ppmReports: ppmReports, assets: assets, customers: customers, onNew: function () { setModal({ type: "ppmwiz", assetId: null }); }, onOpen: function (r) { setModal({ type: "ppm", data: r }); }, onDelete: delPpmReport, onPdf: openPpmPdf })),
tab === "func" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 800, display: isMobile ? "none" : "block" } }, " Verifiche Funzionali"),
React.createElement("p", { style: { color: "var(--text-3)", margin: "2px 0 0", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" } },
"IEC 60601-1/2 \u2014 ",
funcReports.length,
" rapporti \u00B7 ",
Object.keys(allTemplates).length - 1,
" template disponibili")),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: () => setModal({ type: "templateManager" }) }, "\u2699 Template"),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: () => setModal({ type: "ppmChecklist" }) }, "\u2699 Checklist PPM"),
React.createElement(Btn, { sm: true, onClick: () => setModal({ type: "func", data: null, assetId: null }) }, "+ Nuova verifica"))),
funcReports.length === 0 ? (React.createElement(EmptyState, { icon: "\u2713", title: "Nessuna verifica funzionale", subtitle: "Esegui test di funzionalità periodici sui tuoi apparecchi. Template disponibili: " + Object.values(allTemplates).map(t => t.label).join(", ") + ".", actions: [
{ label: "+ Nuova verifica funzionale", onClick: () => setModal({ type: "func", data: null, assetId: null }), primary: true }
] })) : isMobile ? (React.createElement(React.Fragment, null, (() => {
const filteredFunc = funcReports.filter(r => {
const q = mobileSearch.func.toLowerCase();
if (q) {
const a = assets.find(x => x.id === r.assetId) || {};
const tpl = allTemplates[r.templateId] || {};
if (![r.reportNumber, r.date, a.name, a.serial, r.technician, tpl.label].some(f => String(f || "").toLowerCase().includes(q)))
return false;
}
return matchFilters(r, "func", {
templateId: x => { var _a; return ((_a = allTemplates[x.templateId]) === null || _a === void 0 ? void 0 : _a.label) || ""; },
verifyType: x => x.verifyType || "",
assetBrand: x => { var _a; return ((_a = assets.find(a => a.id === x.assetId)) === null || _a === void 0 ? void 0 : _a.brand) || ""; },
assetModel: x => { var _a; return ((_a = assets.find(a => a.id === x.assetId)) === null || _a === void 0 ? void 0 : _a.model) || ""; },
technician: x => x.technician || "",
customer: x => { var _a; return ((_a = customers.find(c => { var _a; return c.id === ((_a = assets.find(a => a.id === x.assetId)) === null || _a === void 0 ? void 0 : _a.customerId); })) === null || _a === void 0 ? void 0 : _a.name) || ""; },
outcome: x => x.verifyStatus === "non_disponibile" ? "non eseguita" : ((x.overallPass === true || x.overallPass === "true") ? "conforme" : "non conforme")
});
});
return (React.createElement(React.Fragment, null,
React.createElement(MobileSearch, { value: mobileSearch.func, onChange: v => updMS("func", v), placeholder: "Cerca verifica funzionale\u2026", count: filteredFunc.length, total: funcReports.length }),
filteredFunc.length > 0 && React.createElement("div", { style: { margin: "0 0 10px" } }, React.createElement(Btn, { sm: true, variant: "ghost", onClick: function () { mtStartBulk(filteredFunc, "func", { assets: assets, customers: customers, company: company, templates: allTemplates }); } }, "\u2B07 Scarica tutti i PDF in ZIP (" + filteredFunc.length + ")")),
React.createElement(FilterDropdown, { filters: {
templateId: { label: "Tipo apparecchio", options: Object.values(allTemplates).map(t => t.label).sort(), value: activeFilters.func.templateId },
verifyType: { label: "Tipo verifica", options: ["periodica", "dopo riparazione", "prima messa in servizio", "straordinaria"], value: activeFilters.func.verifyType },
assetBrand: { label: "Marca apparecchio", options: [...new Set(funcReports.map(r => { var _a; return (_a = assets.find(a => a.id === r.assetId)) === null || _a === void 0 ? void 0 : _a.brand; }).filter(Boolean))].sort(), value: activeFilters.func.assetBrand },
assetModel: { label: "Modello apparecchio", options: [...new Set(funcReports.map(r => { var _a; return (_a = assets.find(a => a.id === r.assetId)) === null || _a === void 0 ? void 0 : _a.model; }).filter(Boolean))].sort(), value: activeFilters.func.assetModel },
technician: { label: "Tecnico", options: [...new Set(funcReports.map(r => r.technician).filter(Boolean))].sort(), value: activeFilters.func.technician },
customer: { label: "Cliente", options: [...new Set(funcReports.map(r => { var _a; return (_a = customers.find(c => { var _a; return c.id === ((_a = assets.find(a => a.id === r.assetId)) === null || _a === void 0 ? void 0 : _a.customerId); })) === null || _a === void 0 ? void 0 : _a.name; }).filter(Boolean))].sort(), value: activeFilters.func.customer },
outcome: { label: "Esito", options: ["conforme", "non conforme", "non eseguita"], value: activeFilters.func.outcome },
}, onChange: (k, v) => setFilter("func", k, v), onClearAll: () => clearFilters("func") }),
React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, margin: "0 0 10px" } },
React.createElement("span", { style: { fontSize: 12, color: "var(--text-3)", whiteSpace: "nowrap" } }, "Ordina:"),
React.createElement("select", { value: mobileSort.func, onChange: e => updSort("func", e.target.value), style: { flex: 1, background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px", fontSize: 13 } },
React.createElement("option", { value: "num_asc" }, "Numero (1 \u2192 100)"),
React.createElement("option", { value: "num_desc" }, "Numero (100 \u2192 1)"),
React.createElement("option", { value: "date_desc" }, "Data (pi\u00F9 recenti)"),
React.createElement("option", { value: "date_asc" }, "Data (pi\u00F9 vecchie)"),
React.createElement("option", { value: "asset_asc" }, "Apparecchio (A \u2192 Z)"))),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
filteredFunc.length === 0 && (React.createElement("div", { style: { textAlign: "center", padding: "30px 20px", background: "var(--surface)", borderRadius: 10, border: "1px dashed var(--border)", fontSize: 13, color: "var(--text-3)" } }, "Nessuna verifica corrisponde ai filtri")),
sortReportsList(filteredFunc, mobileSort.func).map(r => {
const a = assets.find(x => x.id === r.assetId) || {};
const c = customers.find(x => x.id === a.customerId) || {};
const tpl = allTemplates[r.templateId] || { label: "Generico" };
const isNA = r.verifyStatus === "non_disponibile";
const pass = r.overallPass === true || r.overallPass === "true";
const borderC = isNA ? "#f59e0b" : (pass ? "#22c55e" : "#ef4444");
const badgeC = isNA ? "#f59e0b" : (pass ? "#22c55e" : "#ef4444");
const badgeLabel = isNA ? "⚠ N/E" : (pass ? "✓ OK" : "✗ FAIL");
return (React.createElement(SwipeableCard, { key: r.id, onDelete: () => delFuncReport(r.id) },
React.createElement("div", { style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 12, overflow: "hidden", borderLeft: "3px solid " + borderC } },
React.createElement("div", { onClick: () => setModal({ type: "func", data: r }), style: { padding: "12px 14px 10px", cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", borderBottom: "1px solid var(--border-2)" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 } },
React.createElement("strong", { style: { color: "var(--text)", fontSize: 14, fontFamily: "'IBM Plex Mono', monospace", flex: 1, minWidth: 0, wordBreak: "break-word" } }, r.reportNumber || r.id),
React.createElement("span", { style: { padding: "2px 8px", background: badgeC + "22", color: badgeC, borderRadius: 6, fontSize: 11, fontWeight: 800, whiteSpace: "nowrap" } }, badgeLabel)),
React.createElement("div", { style: { fontSize: 12, color: "#06b6d4", fontWeight: 700, marginBottom: 3 } }, tpl.label),
React.createElement("div", { style: { fontSize: 12, color: "var(--text-2)", marginBottom: 3 } }, a.name || "(apparecchio eliminato)"),
a.brand && React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)" } },
a.brand,
" ",
a.model),
c.name && React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", marginTop: 3 } },
"\uD83C\uDFE2 ",
c.name),
React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap", fontSize: 10 } },
React.createElement("span", { style: { padding: "2px 6px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 4, color: r.verifyType === "straordinaria" ? "#f59e0b" : "var(--text-3)" } }, r.verifyType || "periodica"),
React.createElement("span", { style: { padding: "2px 6px", color: "var(--text-3)", fontFamily: "'IBM Plex Mono', monospace" } }, r.date)),
r.technician && React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", marginTop: 6 } },
" ",
r.technician)),
React.createElement("div", { onClick: (e) => { e.stopPropagation(); r.published ? appConfirm("Ritirare il verbale dal portale? Il cliente non lo vedrà più finché non lo ripubblichi.", () => setReportPublished("func", r.id, false), "danger") : setReportPublished("func", r.id, true); }, style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "8px 14px", borderBottom: "1px solid var(--border-2)", cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", background: r.published ? "#22c55e0a" : "#f59e0b0d" } },
React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: r.published ? "#22c55e" : "#f59e0b" } }, r.published ? "\uD83D\uDC41 Pubblicato al cliente" : "\uD83D\uDD12 Bozza — non visibile al cliente"),
React.createElement("span", { style: { fontSize: 11, fontWeight: 800, color: r.published ? "var(--text-3)" : "#2dd4bf" } }, r.published ? "Ritira" : "\uD83D\uDCE4 Pubblica")),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "40px 1fr 1fr 36px", gap: 0, background: "var(--bg)" } },
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: "sticker", data: r, kind: "func" }); }, title: "Sticker QR", style: { background: "transparent", color: "#c084fc", border: "none", borderRight: "1px solid var(--border-2)", padding: "10px 0", cursor: "pointer", fontSize: 14 } }, "\uD83C\uDFF7"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); generateFuncPDF(r, a, c, company, allTemplates); }, style: { background: "transparent", color: "var(--text-2)", border: "none", borderRight: "1px solid var(--border-2)", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\uD83D\uDCC4 PDF"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: "func", data: r }); }, style: { background: "transparent", color: "var(--text-2)", border: "none", borderRight: "1px solid var(--border-2)", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u270F Modifica"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); delFuncReport(r.id); }, title: "Elimina", style: { background: "transparent", color: "#ef4444", border: "none", padding: "10px 4px", fontSize: 14, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u2715")))));
}))));
})())) : (React.createElement(ExcelTable, { exportName: "MedTrace_verifiche_funzionali", defaultSort: "date", rowBg: row => row.overallPass === false || row.overallPass === "false" ? "#ef333308" : "", cols: [
{ key: "reportNumber", label: "N. Rapporto", render: v => React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 } }, v || "—") },
{ key: "date", label: "Data" },
{ key: "tplLabel", label: "Tipo apparecchio", render: v => React.createElement("span", { style: { fontWeight: 700, color: "var(--text)" } }, v) },
{ key: "assetName", label: "Apparecchio", render: v => React.createElement("span", { style: { color: "var(--text-2)" } }, v) },
{ key: "serial", label: "N. Serie", render: v => React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 } }, v || "—") },
{ key: "cliente", label: "Cliente", opts: [...new Set(funcReports.map(r => { var _a; const a = assets.find(x => x.id === r.assetId); return ((_a = customers.find(c => c.id === (a === null || a === void 0 ? void 0 : a.customerId))) === null || _a === void 0 ? void 0 : _a.name) || ""; }).filter(Boolean))] },
{ key: "verifyType", label: "Tipo", render: v => React.createElement("span", { style: { fontSize: 11, color: v === "straordinaria" ? "#f59e0b" : "var(--text-3)" } }, v || "periodica") },
{ key: "technician", label: "Tecnico" },
{ key: "overallPass", label: "Esito", render: v => React.createElement("span", { style: { fontWeight: 800, color: v === true || v === "true" ? "#22c55e" : "#ef4444" } }, v === true || v === "true" ? "✓ OK" : "✗ NO") },
{ key: "jobId", label: "Intervento", render: v => v ? React.createElement("span", { title: "Questa verifica \u00E8 registrata anche come intervento nello storico/agenda", style: { fontSize: 11, color: "#5eead4", background: "#2dd4bf15", border: "1px solid #2dd4bf33", borderRadius: 6, padding: "2px 8px", fontWeight: 700, whiteSpace: "nowrap" } }, "\u2713 in agenda") : React.createElement("span", { style: { color: "var(--text-4)" } }, "\u2014") },
], rows: funcReports.map(r => {
const a = assets.find(x => x.id === r.assetId) || {};
const c = customers.find(x => x.id === a.customerId) || {};
const tpl = allTemplates[r.templateId] || allTemplates["generico"];
return Object.assign(Object.assign({}, r), { tplLabel: tpl.icon + " " + tpl.label, assetName: a.name || r.assetId || "—", serial: a.serial || "", cliente: c.name || "" });
}), onEdit: row => setModal({ type: "func", data: funcReports.find(r => r.id === row.id), assetId: row.assetId }), onDelete: id => delFuncReport(id), actions: row => {
const rep = funcReports.find(r => r.id === row.id);
const a = assets.find(x => x.id === (rep === null || rep === void 0 ? void 0 : rep.assetId)) || {};
const c = customers.find(x => x.id === a.customerId) || {};
return (React.createElement(React.Fragment, null,
React.createElement("button", { onClick: () => setModal({ type: "sticker", data: rep, kind: "func" }), title: "Sticker QR", style: { background: "#a855f715", border: "1px solid #a855f733", borderRadius: 6, color: "#c084fc", padding: "3px 7px", cursor: "pointer", fontSize: 11, marginRight: 2 } }, "\uD83C\uDFF7"),
React.createElement("button", { onClick: () => generateFuncPDF(rep, a, c, company, allTemplates), title: "PDF", style: { background: "#2dd4bf15", border: "1px solid #2563eb33", borderRadius: 6, color: "#5eead4", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, " PDF")));
} })))),
tab === "iec" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 800, display: isMobile ? "none" : "block" } }, "\u26A1 Verifiche di Sicurezza Elettrica"),
React.createElement("p", { style: { color: "var(--text-3)", margin: "2px 0 0", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" } },
"IEC 62353 \u00B7 IEC 61010-1 \u00B7 ",
iecReports.length,
" rapporti")),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: exportIecReports }, "\u2B07 Excel"),
React.createElement(Btn, { sm: true, onClick: () => setModal({ type: "iec", data: null, assetId: null }) }, "+ Nuova verifica"))),
iecReports.length === 0 ? (React.createElement(EmptyState, { icon: "\u26A1", title: "Nessuna verifica di sicurezza elettrica", subtitle: "Esegui verifiche periodiche IEC 62353 (elettromedicali) o IEC 61010-1 (laboratorio): misure di PE, isolamento, dispersioni Equipment Leakage e Applied Part. Metodi supportati: diretto, differenziale, alternativo.", actions: [
{ label: "+ Nuova verifica sicurezza elettrica", onClick: () => setModal({ type: "iec", data: null, assetId: null }), primary: true }
] })) : isMobile ? (React.createElement(React.Fragment, null, (() => {
const filteredIec = iecReports.filter(r => {
const q = mobileSearch.iec.toLowerCase();
if (q) {
const a = assets.find(x => x.id === r.assetId) || {};
if (![r.reportNumber, r.date, a.name, a.serial, a.assetCode, r.technician, r.norm].some(f => String(f || "").toLowerCase().includes(q)))
return false;
}
return matchFilters(r, "iec", {
norm: x => x.norm || "", equipClass: x => x.equipClass || "",
patientType: x => x.patientType || "",
leakageMethod: x => x.leakageMethod || "diretto",
verifyType: x => x.verifyType || "",
assetBrand: x => { var _a; return ((_a = assets.find(a => a.id === x.assetId)) === null || _a === void 0 ? void 0 : _a.brand) || ""; },
assetModel: x => { var _a; return ((_a = assets.find(a => a.id === x.assetId)) === null || _a === void 0 ? void 0 : _a.model) || ""; },
technician: x => x.technician || "",
customer: x => { var _a; return ((_a = customers.find(c => { var _a; return c.id === ((_a = assets.find(a => a.id === x.assetId)) === null || _a === void 0 ? void 0 : _a.customerId); })) === null || _a === void 0 ? void 0 : _a.name) || ""; },
outcome: x => x.verifyStatus === "non_disponibile" ? "non eseguita" : ((x.overallPass === true || x.overallPass === "true") ? "conforme" : "non conforme")
});
});
return (React.createElement(React.Fragment, null,
React.createElement(MobileSearch, { value: mobileSearch.iec, onChange: v => updMS("iec", v), placeholder: "Cerca seriale, n\u00B0 inventario, rapporto\u2026", count: filteredIec.length, total: iecReports.length }),
filteredIec.length > 0 && React.createElement("div", { style: { margin: "0 0 10px" } }, React.createElement(Btn, { sm: true, variant: "ghost", onClick: function () { mtStartBulk(filteredIec, "iec", { assets: assets, customers: customers, company: company, templates: allTemplates }); } }, "\u2B07 Scarica tutti i PDF in ZIP (" + filteredIec.length + ")")),
React.createElement(FilterDropdown, { filters: {
norm: { label: "Norma", options: ["62353", "61010"], value: activeFilters.iec.norm },
equipClass: { label: "Classe elettrica", options: ["I", "II", "III"], value: activeFilters.iec.equipClass },
patientType: { label: "Tipo parte applicata", options: ["B", "BF", "CF"], value: activeFilters.iec.patientType },
leakageMethod: { label: "Metodo misura", options: ["diretto", "differenziale", "alternativo"], value: activeFilters.iec.leakageMethod },
verifyType: { label: "Tipo verifica", options: ["periodica", "dopo riparazione", "prima messa in servizio", "straordinaria"], value: activeFilters.iec.verifyType },
assetBrand: { label: "Marca apparecchio", options: [...new Set(iecReports.map(r => { var _a; return (_a = assets.find(a => a.id === r.assetId)) === null || _a === void 0 ? void 0 : _a.brand; }).filter(Boolean))].sort(), value: activeFilters.iec.assetBrand },
assetModel: { label: "Modello apparecchio", options: [...new Set(iecReports.map(r => { var _a; return (_a = assets.find(a => a.id === r.assetId)) === null || _a === void 0 ? void 0 : _a.model; }).filter(Boolean))].sort(), value: activeFilters.iec.assetModel },
technician: { label: "Tecnico", options: [...new Set(iecReports.map(r => r.technician).filter(Boolean))].sort(), value: activeFilters.iec.technician },
customer: { label: "Cliente", options: [...new Set(iecReports.map(r => { var _a; return (_a = customers.find(c => { var _a; return c.id === ((_a = assets.find(a => a.id === r.assetId)) === null || _a === void 0 ? void 0 : _a.customerId); })) === null || _a === void 0 ? void 0 : _a.name; }).filter(Boolean))].sort(), value: activeFilters.iec.customer },
outcome: { label: "Esito", options: ["conforme", "non conforme", "non eseguita"], value: activeFilters.iec.outcome },
}, onChange: (k, v) => setFilter("iec", k, v), onClearAll: () => clearFilters("iec") }),
React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, margin: "0 0 8px" } },
React.createElement("span", { style: { fontSize: 12, color: "var(--text-3)", whiteSpace: "nowrap" } }, "Ordina:"),
React.createElement("select", { value: mobileSort.iec, onChange: e => updSort("iec", e.target.value), style: { flex: 1, background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px", fontSize: 13 } },
React.createElement("option", { value: "num_asc" }, "Numero (1 \u2192 100)"),
React.createElement("option", { value: "num_desc" }, "Numero (100 \u2192 1)"),
React.createElement("option", { value: "date_desc" }, "Data (pi\u00F9 recenti)"),
React.createElement("option", { value: "date_asc" }, "Data (pi\u00F9 vecchie)"),
React.createElement("option", { value: "asset_asc" }, "Apparecchio (A \u2192 Z)"))),
React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", marginBottom: 8 } },
React.createElement("button", { onClick: toggleCompact, style: { background: "var(--card)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "6px 12px", color: "var(--text-2)", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 } }, compactView ? "▤ Vista estesa" : "≣ Vista compatta")),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: compactView ? 0 : 10 } },
filteredIec.length === 0 && (React.createElement("div", { style: { textAlign: "center", padding: "30px 20px", background: "var(--surface)", borderRadius: 10, border: "1px dashed var(--border)", fontSize: 13, color: "var(--text-3)" } }, "Nessuna verifica corrisponde ai filtri")),
sortReportsList(filteredIec, mobileSort.iec).map(r => {
const a = assets.find(x => x.id === r.assetId) || {};
const c = customers.find(x => x.id === a.customerId) || {};
const isNA = r.verifyStatus === "non_disponibile";
const pass = r.overallPass === true || r.overallPass === "true";
const borderC = isNA ? "#f59e0b" : (pass ? "#22c55e" : "#ef4444");
const badgeC = isNA ? "#f59e0b" : (pass ? "#22c55e" : "#ef4444");
const badgeLabel = isNA ? "⚠ N/E" : (pass ? "✓ OK" : "✗ FAIL");
if (compactView) {
return (React.createElement("div", { key: r.id, onClick: () => setModal({ type: "iec", data: r }), style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderBottom: "1px solid var(--border-2)", cursor: "pointer", background: "var(--surface)" } },
React.createElement("span", { style: { width: 8, height: 8, borderRadius: "50%", background: borderC, flexShrink: 0 } }),
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { color: "var(--text)", fontSize: 13, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, r.reportNumber || r.id),
React.createElement("div", { style: { color: "var(--text-3)", fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, [a.name, r.date].filter(Boolean).join(" · ") || "—")),
React.createElement("span", { style: { padding: "2px 7px", background: badgeC + "22", color: badgeC, borderRadius: 6, fontSize: 10, fontWeight: 700, flexShrink: 0 } }, badgeLabel)));
}
return (React.createElement(SwipeableCard, { key: r.id, onDelete: () => delIecReport(r.id) },
React.createElement("div", { style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 12, overflow: "hidden", borderLeft: "3px solid " + borderC } },
React.createElement("div", { onClick: () => setModal({ type: "iec", data: r }), style: { padding: "12px 14px 10px", cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", borderBottom: "1px solid var(--border-2)" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 } },
React.createElement("strong", { style: { color: "var(--text)", fontSize: 14, fontFamily: "'IBM Plex Mono', monospace", flex: 1, minWidth: 0, wordBreak: "break-word" } }, r.reportNumber || r.id),
React.createElement("span", { style: { padding: "2px 8px", background: badgeC + "22", color: badgeC, borderRadius: 6, fontSize: 11, fontWeight: 800, whiteSpace: "nowrap" } }, badgeLabel)),
React.createElement("div", { style: { fontSize: 12, color: "var(--text-2)", marginBottom: 3 } }, a.name || "(apparecchio eliminato)"),
a.brand && React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)" } },
a.brand,
" ",
a.model),
c.name && React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", marginTop: 3 } },
"\uD83C\uDFE2 ",
c.name),
React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap", fontSize: 10 } },
React.createElement("span", { style: { padding: "2px 6px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text-2)" } },
"IEC ",
r.norm),
r.equipClass && React.createElement("span", { style: { padding: "2px 6px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text-2)" } },
"Cl. ",
r.equipClass),
React.createElement("span", { style: { padding: "2px 6px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 4, color: r.verifyType === "straordinaria" ? "#f59e0b" : "var(--text-3)" } }, r.verifyType || "periodica"),
React.createElement("span", { style: { padding: "2px 6px", color: "var(--text-3)", fontFamily: "'IBM Plex Mono', monospace" } }, r.date)),
r.technician && React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", marginTop: 6 } },
" ",
r.technician)),
React.createElement("div", { onClick: (e) => { e.stopPropagation(); r.published ? appConfirm("Ritirare il verbale dal portale? Il cliente non lo vedrà più finché non lo ripubblichi.", () => setReportPublished("iec", r.id, false), "danger") : setReportPublished("iec", r.id, true); }, style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "8px 14px", borderBottom: "1px solid var(--border-2)", cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", background: r.published ? "#22c55e0a" : "#f59e0b0d" } },
React.createElement("span", { style: { fontSize: 11, fontWeight: 700, color: r.published ? "#22c55e" : "#f59e0b" } }, r.published ? "\uD83D\uDC41 Pubblicato al cliente" : "\uD83D\uDD12 Bozza — non visibile al cliente"),
React.createElement("span", { style: { fontSize: 11, fontWeight: 800, color: r.published ? "var(--text-3)" : "#2dd4bf" } }, r.published ? "Ritira" : "\uD83D\uDCE4 Pubblica")),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "40px 1fr 1fr 36px", gap: 0, background: "var(--bg)" } },
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: "sticker", data: r, kind: "iec" }); }, title: "Sticker QR", style: { background: "transparent", color: "#c084fc", border: "none", borderRight: "1px solid var(--border-2)", padding: "10px 0", cursor: "pointer", fontSize: 14 } }, "\uD83C\uDFF7"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); generateIECPDF(r, a, c, company); }, style: { background: "transparent", color: "var(--text-2)", border: "none", borderRight: "1px solid var(--border-2)", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\uD83D\uDCC4 PDF"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: "iec", data: r }); }, style: { background: "transparent", color: "var(--text-2)", border: "none", borderRight: "1px solid var(--border-2)", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u270F Modifica"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); delIecReport(r.id); }, title: "Elimina", style: { background: "transparent", color: "#ef4444", border: "none", padding: "10px 4px", fontSize: 14, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u2715")))));
}))));
})())) : (React.createElement(ExcelTable, { exportName: "MedTrace_verifiche_sicurezza", defaultSort: "date", rowBg: row => row.overallPass === false || row.overallPass === "false" ? "#ef333308" : "", cols: [
{ key: "reportNumber", label: "N. Rapporto", render: v => React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 } }, v || "—") },
{ key: "date", label: "Data" },
{ key: "apparecchio", label: "Apparecchio", render: v => React.createElement("strong", { style: { color: "var(--text)" } }, v) },
{ key: "serial", label: "N. Serie", render: v => React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 } }, v || "—") },
{ key: "cliente", label: "Cliente", opts: [...new Set(iecReports.map(r => { var _a; const a = assets.find(x => x.id === r.assetId); return ((_a = customers.find(c => c.id === (a === null || a === void 0 ? void 0 : a.customerId))) === null || _a === void 0 ? void 0 : _a.name) || ""; }).filter(Boolean))] },
{ key: "norm", label: "Norma", opts: ["62353", "61010"], render: v => React.createElement("span", { style: { fontSize: 11, color: "var(--text-3)" } },
"IEC ",
v) },
{ key: "equipClass", label: "Classe" },
{ key: "verifyType", label: "Tipo", render: v => React.createElement("span", { style: { fontSize: 11, color: v === "straordinaria" ? "#f59e0b" : "var(--text-3)" } }, v || "periodica") },
{ key: "technician", label: "Tecnico" },
{ key: "overallPass", label: "Esito", render: v => React.createElement("span", { style: { fontWeight: 800, color: v === true || v === "true" ? "#22c55e" : "#ef4444" } }, v === true || v === "true" ? "✓ OK" : "✗ NO") },
{ key: "jobId", label: "Intervento", render: v => v ? React.createElement("span", { title: "Questa verifica \u00E8 registrata anche come intervento nello storico/agenda", style: { fontSize: 11, color: "#5eead4", background: "#2dd4bf15", border: "1px solid #2dd4bf33", borderRadius: 6, padding: "2px 8px", fontWeight: 700, whiteSpace: "nowrap" } }, "\u2713 in agenda") : React.createElement("span", { style: { color: "var(--text-4)" } }, "\u2014") },
], rows: iecReports.map(r => { const a = assets.find(x => x.id === r.assetId) || {}; const c = customers.find(x => x.id === a.customerId) || {}; return Object.assign(Object.assign({}, r), { apparecchio: a.name || r.assetId || "—", serial: a.serial || "", cliente: c.name || "" }); }), onEdit: row => setModal({ type: "iec", data: iecReports.find(r => r.id === row.id), assetId: row.assetId }), onDelete: id => delIecReport(id), actions: row => {
const rep = iecReports.find(r => r.id === row.id);
const a = assets.find(x => x.id === (rep === null || rep === void 0 ? void 0 : rep.assetId)) || {};
const c = customers.find(x => x.id === a.customerId) || {};
return (React.createElement(React.Fragment, null,
React.createElement("button", { onClick: () => setModal({ type: "sticker", data: rep, kind: "iec" }), title: "Sticker QR", style: { background: "#a855f715", border: "1px solid #a855f733", borderRadius: 6, color: "#c084fc", padding: "3px 7px", cursor: "pointer", fontSize: 11, marginRight: 2 } }, "\uD83C\uDFF7"),
React.createElement("button", { onClick: () => generateIECPDF(rep, a, c, company), title: "PDF", style: { background: "#2dd4bf15", border: "1px solid #2563eb33", borderRadius: 6, color: "#5eead4", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, " PDF")));
} })))),
tab === "schedule" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 800, display: isMobile ? "none" : "block" } }, "Pianificazione Annuale"),
React.createElement("p", { style: { color: "var(--text-3)", margin: "2px 0 0", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" } }, "Attivit\u00E0 programmate per anno \u2014 basato su nextService degli apparecchi")),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement("select", { value: scheduleYear, onChange: e => setScheduleYear(+e.target.value), style: { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 11px", color: "var(--text)", fontSize: 13 } }, [new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1, new Date().getFullYear() + 2].map(y => React.createElement("option", { key: y, value: y }, y))),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: () => {
const rows = scheduleRows;
downloadXLSX("pianificazione-" + scheduleYear + ".xlsx", rows, [{ key: "month", label: "Mese" }, { key: "assetName", label: "Apparecchio" }, { key: "brand", label: "Marca" }, { key: "serial", label: "N.Serie" }, { key: "location", label: "Ubicazione" }, { key: "customer", label: "Cliente" }, { key: "norm", label: "Norma IEC" }, { key: "lastService", label: "Ultima verifica" }, { key: "nextService", label: "Data pianificata" }, { key: "status", label: "Stato apparecchio" }]);
} }, "\u2B07 Excel Pianificazione"))),
scheduleMonths.every(m => m.items.length === 0) ? (React.createElement("div", { style: { textAlign: "center", padding: "40px 18px", background: "var(--surface)", borderRadius: 12, border: "1px dashed var(--border)" } },
React.createElement("div", { style: { fontSize: 40, marginBottom: 10, opacity: .5 } }, "\uD83D\uDCC5"),
React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--text-2)", marginBottom: 6 } },
"Nessuna attivit\u00E0 pianificata per ",
scheduleYear),
React.createElement("div", { style: { fontSize: 12, color: "var(--text-4)" } }, "Le attivit\u00E0 compaiono automaticamente quando salvi una Verifica di Sicurezza Elettrica o imposti una data \"Prossimo Servizio\" negli apparecchi."))) : scheduleMonths.map(({ month, monthLabel, items }) => items.length === 0 ? null : (React.createElement("div", { key: month, style: { marginBottom: 20 } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, padding: "8px 14px", background: "var(--surface)", borderRadius: "8px 8px 0 0", border: "1px solid var(--border)", borderBottom: "none" } },
React.createElement("span", { style: { fontWeight: 800, fontSize: 14, color: "var(--text)" } },
monthLabel,
" ",
scheduleYear),
React.createElement("span", { style: { fontSize: 11, color: "var(--text-3)", fontFamily: "'IBM Plex Mono', monospace" } },
items.length,
" apparecch",
items.length === 1 ? "io" : "i")),
React.createElement(ExcelTable, { exportName: "MedTrace_pianificazione", defaultSort: "nextService", rowBg: row => {
const d = row._days;
return d < 0 ? "#ef333308" : d <= 30 ? "#f59e0b08" : "";
}, cols: [
{ key: "assetName", label: "Apparecchio", render: v => React.createElement("strong", { style: { color: "var(--text)" } }, v) },
{ key: "brand", label: "Marca" },
{ key: "serial", label: "N. Serie", render: v => React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 } }, v || "—") },
{ key: "location", label: "Ubicazione", opts: [...new Set(items.map(i => i.location).filter(Boolean))] },
{ key: "customer", label: "Cliente", opts: [...new Set(items.map(i => i.customer).filter(Boolean))] },
{ key: "norm", label: "Norma IEC", opts: ["IEC 62353", "IEC 61010-1", "—"], render: v => React.createElement("span", { style: { fontSize: 11, color: "var(--text-3)" } }, v) },
{ key: "lastService", label: "Ultima verifica", render: v => v || React.createElement("span", { style: { color: "var(--text-4)" } }, "mai") },
{ key: "nextService", label: "Data pianificata", render: (v, row) => React.createElement(AlertChip, { days: row._days }) },
{ key: "status", label: "Stato", opts: ["operativo", "in manutenzione", "fuori servizio"], render: v => React.createElement(Badge, { text: v, color: STATUS_COLOR[v] || "var(--text-3)" }) },
], rows: items, actions: row => (React.createElement("button", { onClick: () => setModal({ type: "iec", data: null, assetId: row.assetId }), style: { background: "#2dd4bf15", border: "1px solid #2563eb33", borderRadius: 6, color: "#5eead4", padding: "3px 8px", cursor: "pointer", fontSize: 11, whiteSpace: "nowrap" } }, "Verifica")) })))))),
tab === "richieste" && (React.createElement(RichiestePage, { richieste: richieste, assets: assets, customers: customers, onConvert: convertRichiesta, onRefresh: loadRichieste, online: !OFFLINE_MODE })),
(tab === "help" || tab === "procedures") && React.createElement(HelpTab, { helpOpen: helpOpen, setHelpOpen: setHelpOpen }),
tab === "instruments" && (React.createElement(InstrumentsPage, { instruments: instruments, setInstruments: setInstruments, showToast: showToast, checkLocked: checkLocked })),
tab === "recalls" && (React.createElement(RecallsPage, { recalls: recalls, setRecalls: setRecalls, assets: assets, customers: customers, showToast: showToast, moveToTrash: moveToTrash, checkLocked: checkLocked, openRecallId: recallFocus, onRecallFocused: function () { setRecallFocus(null); } })),
tab === "quotes" && (React.createElement(QuotesPage, { checkLocked: checkLocked, quotes: quotes, setQuotes: setQuotes, customers: customers, jobs: jobs, parts: parts, company: company, showToast: showToast, moveToTrash: moveToTrash })),
(tab === "agenda" || tab === "scadenze") && (React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" } }, [["agenda", "\uD83D\uDCC5 Agenda manutenzioni"], ["scadenze", "⏰ Scadenze verifiche"]].map(pair => (React.createElement("button", { key: pair[0], onClick: () => setTab(pair[0]), style: { background: tab === pair[0] ? "#2dd4bf22" : "var(--card)", border: "1px solid " + (tab === pair[0] ? "#2dd4bf" : "var(--border-2)"), borderRadius: 999, padding: "7px 16px", color: tab === pair[0] ? "#5eead4" : "var(--text-2)", fontSize: 13, fontWeight: 700, cursor: "pointer" } }, pair[1]))))),
tab === "scadenze" && (React.createElement(ScadenzePage, { scadenze: scadenzeVerifiche, company: company, onEmail: (sc) => setModal({ type: "scadenzaEmail", data: sc }), onOpenAsset: (id) => { const a = assets.find(x => x.id === id); if (a)
openAsset(a.id); } })),
tab === "agenda" && (React.createElement(AgendaPage, { assets: assets, jobs: jobs, instruments: instruments, iecReports: iecReports, funcReports: funcReports, customers: customers, setTab: setTab, setModal: setModal, showToast: showToast })),
tab === "piano" && (React.createElement(PianoManuale, { assets: assets, setAssets: setAssets, customers: customers, year: scheduleYear || new Date().getFullYear(), setYear: (y) => { }, showToast: showToast, goTab: setTab })),
tab === "orders" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 800, display: isMobile ? "none" : "block" } }, "Ordini Fornitori"),
React.createElement("p", { style: { color: "var(--text-3)", margin: "2px 0 0", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" } },
stats.pendingOrders,
" in corso \u00B7 ",
orders.length,
" totali")),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: exportOrders }, "\u2B07 Excel"),
React.createElement(Btn, { sm: true, onClick: () => setModal({ type: "order", data: null }) }, "+ Nuovo"))),
orders.length === 0 ? (React.createElement("div", { style: { textAlign: "center", padding: "40px 18px", background: "var(--surface)", borderRadius: 12, border: "1px dashed var(--border)" } },
React.createElement("div", { style: { fontSize: 40, marginBottom: 10, opacity: .5 } }, "\uD83D\uDCCB"),
React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--text-2)", marginBottom: 6 } }, "Nessun ordine"),
React.createElement(Btn, { onClick: () => setModal({ type: "order", data: null }) }, "Nuovo ordine"))) : (React.createElement(ExcelTable, { exportName: "MedTrace_ordini", defaultSort: "orderDate", rowBg: row => row.status === "in attesa" ? "#f59e0b08" : "", cols: [
{ key: "supplier", label: "Fornitore", render: v => React.createElement("strong", { style: { color: "var(--text)" } }, v) },
{ key: "nomeParte", label: "Parte" },
{ key: "qty", label: "Q.tà", render: v => React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace" } }, v) },
{ key: "unitPrice", label: "Prezzo Unit.", render: v => React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace" } },
"\u20AC",
parseFloat(v).toFixed(2)) },
{ key: "totale", label: "Totale", render: v => React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: "#a855f7" } },
"\u20AC",
v) },
{ key: "status", label: "Stato", opts: ["in attesa", "confermato", "spedito", "ricevuto", "annullato"], render: v => React.createElement(Badge, { text: v, color: STATUS_COLOR[v] || "var(--text-2)" }) },
{ key: "orderDate", label: "Data ordine" },
{ key: "expectedDate", label: "Consegna", render: v => v || "—" },
], rows: orders.map(o => { var _a; return (Object.assign(Object.assign({}, o), { nomeParte: ((_a = parts.find(p => p.id === o.partId)) === null || _a === void 0 ? void 0 : _a.name) || o.partId, totale: (o.qty * o.unitPrice).toFixed(2) })); }), onEdit: row => setModal({ type: "order", data: orders.find(o => o.id === row.id) }), onDelete: id => delOrder(id), actions: row => {
const o = orders.find(x => x.id === row.id);
return (o === null || o === void 0 ? void 0 : o.status) !== "ricevuto" && (o === null || o === void 0 ? void 0 : o.status) !== "annullato"
? React.createElement("button", { onClick: () => quickReceive(o), style: { background: "#22c55e15", border: "1px solid #22c55e33", borderRadius: 6, color: "#22c55e", padding: "3px 8px", cursor: "pointer", fontSize: 11, whiteSpace: "nowrap" } }, "\u2713 Ricevuto")
: null;
} })))),
tab === "withdrawals" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 800, display: isMobile ? "none" : "block" } }, "Scarichi Magazzino"),
React.createElement("p", { style: { color: "var(--text-3)", margin: "2px 0 0", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" } },
"\u20AC",
withdrawals.reduce((s, w) => s + w.total, 0).toFixed(2),
" totali")),
parts.length > 0 && assets.length > 0 && React.createElement(Btn, { sm: true, variant: "success", onClick: () => setModal({ type: "withdrawal" }) }, " Nuovo")),
withdrawals.length === 0 ? (React.createElement("div", { style: { textAlign: "center", padding: "40px 18px", background: "var(--surface)", borderRadius: 12, border: "1px dashed var(--border)" } },
React.createElement("div", { style: { fontSize: 40, marginBottom: 10, opacity: .5 } }, "\u2193"),
React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--text-2)", marginBottom: 6 } }, "Nessuno scarico"),
React.createElement("div", { style: { fontSize: 12, color: "var(--text-4)" } }, "Le uscite di magazzino verranno registrate qui."))) : (React.createElement(ExcelTable, { defaultSort: "date", cols: [
{ key: "date", label: "Data" },
{ key: "apparecchio", label: "Apparecchio", render: v => React.createElement("strong", { style: { color: "var(--text)" } }, v) },
{ key: "tech", label: "Tecnico", render: v => v || "—" },
{ key: "reason", label: "Motivo", render: v => React.createElement("span", { style: { color: "var(--text-2)", fontSize: 11 } }, v || "—") },
{ key: "partiDesc", label: "Parti", render: v => React.createElement("span", { style: { color: "var(--text-3)", fontSize: 11 } }, v) },
{ key: "total", label: "Totale", render: v => React.createElement("span", { style: { color: "#22c55e", fontWeight: 800, fontFamily: "'IBM Plex Mono', monospace" } },
"\u20AC",
parseFloat(v).toFixed(2)) },
], rows: withdrawals.map(w => { var _a; return (Object.assign(Object.assign({}, w), { apparecchio: ((_a = assets.find(a => a.id === w.assetId)) === null || _a === void 0 ? void 0 : _a.name) || w.assetId || "—", partiDesc: w.items.map(r => { const p = parts.find(x => x.id === r.partId); return ((p === null || p === void 0 ? void 0 : p.name) || r.partId) + " x" + r.qty; }).join(", ") })); }) })))),
(modal === null || modal === void 0 ? void 0 : modal.type) === "asset" && React.createElement(Modal, { title: modal.data ? "Modifica Apparecchio" : "Nuovo Apparecchio", onClose: popModal },
React.createElement(AssetForm, { initial: modal.data, customers: customers, assets: assets, onSave: saveAsset, onClose: popModal })),
(modal === null || modal === void 0 ? void 0 : modal.type) === "assetImport" && React.createElement(Modal, { title: "Importa apparecchi da Excel / CSV", wide: true, onClose: popModal },
React.createElement(ImportAssetsModal, { customers: customers, assets: assets, onImport: importAssets, onClose: popModal })),
(modal === null || modal === void 0 ? void 0 : modal.type) === "part" && React.createElement(Modal, { title: modal.data ? "Modifica Parte" : "Nuova Parte", wide: true, onClose: popModal },
React.createElement(PartForm, { initial: modal.data, assets: assets, onSave: savePart, onClose: popModal })),
(modal === null || modal === void 0 ? void 0 : modal.type) === "job" && React.createElement(Modal, { title: ((_b = modal.data) === null || _b === void 0 ? void 0 : _b.id) ? "Modifica Job" : "Nuovo Job", wide: true, onClose: popModal },
React.createElement(JobForm, { initial: ((_c = modal.data) === null || _c === void 0 ? void 0 : _c.id) ? modal.data : null, assets: assets, parts: parts, customers: customers, technicians: company.technicians || [], onSave: saveJob, onClose: popModal })),
(modal === null || modal === void 0 ? void 0 : modal.type) === "jobDetail" && React.createElement(JobDetailModal, { job: modal.data, assets: assets, parts: parts, customers: customers, company: company, onEdit: () => setModal({ type: "job", data: modal.data }), onTimeline: () => setModal({ type: "timeline", data: modal.data }), onCreateQuote: () => quoteFromJob(modal.data), onClose: popModal }),
(modal === null || modal === void 0 ? void 0 : modal.type) === "order" && React.createElement(Modal, { title: modal.data ? "Modifica Ordine" : "Nuovo Ordine", onClose: popModal },
React.createElement(OrderForm, { initial: modal.data, parts: parts, onSave: saveOrder, onClose: popModal })),
(modal === null || modal === void 0 ? void 0 : modal.type) === "customer" && React.createElement(Modal, { title: modal.data ? "Modifica Cliente" : "Nuovo Cliente", onClose: popModal },
React.createElement(CustomerForm, { initial: modal.data, onSave: saveCustomer, onClose: popModal, isSuperuser: isSuperuser })),
(modal === null || modal === void 0 ? void 0 : modal.type) === "invoice" && React.createElement(Modal, { title: modal.data ? "Modifica Preventivo" : "Nuovo Preventivo", wide: true, onClose: popModal },
React.createElement(InvoiceForm, { initial: modal.prefillFromJob || modal.data, customers: customers, jobs: jobs, assets: assets, parts: parts, generateNumber: generateInvoiceNumber, onSave: saveInvoice, onClose: popModal })),
(modal === null || modal === void 0 ? void 0 : modal.type) === "withdrawal" && React.createElement(WithdrawalModal, { parts: parts, assets: assets, preselectPartId: modal.partId, onWithdraw: handleWithdraw, onClose: popModal }),
(modal === null || modal === void 0 ? void 0 : modal.type) === "assetDetail" && false,
(modal === null || modal === void 0 ? void 0 : modal.type) === "timeline" && React.createElement(TimelineModal, { job: modal.data, parts: parts, onSave: (data) => saveTimeline(modal.data.id, data), onClose: popModal }),
(modal === null || modal === void 0 ? void 0 : modal.type) === "settings" && React.createElement(SettingsModal, { isAdmin: isAdmin, isSuperuser: isSuperuser, onImportRfidScan: importRfidScan, data: { assets, parts, jobs, orders, withdrawals, customers, invoices, quotes, instruments, procedures, iecReports, funcReports, recalls, company, customTemplates, cestino, _meta: { version: "3.6", exportedAt: new Date().toISOString(), app: "MedTrace" } }, company: company, onUpdateCompany: setCompany, onImport: handleImport, onMerge: handleMerge, onReset: handleReset, onCloudPull: handleCloudPull, onReplaceJobs: (nj) => setJobs(nj), onClose: popModal, onOpenCestino: () => pushModal({ type: "cestino" }) }),
(modal === null || modal === void 0 ? void 0 : modal.type) === "cestino" && React.createElement(CestinoModal, { cestino: (() => { const o = {}; Object.keys(cestino || {}).forEach(k => { o[k] = (cestino[k] || []).filter(r => !r.purged); }); return o; })(), onRestore: restoreFromTrash, onPurge: purgeFromTrash, onClose: popModal }),
(modal === null || modal === void 0 ? void 0 : modal.type) === "templateManager" && (React.createElement(Modal, { title: "Gestione template verifiche", wide: true, onClose: popModal },
React.createElement(TemplateManagerModal, { allTemplates: allTemplates, customTemplates: customTemplates, onNew: () => setModal({ type: "templateEditor", data: null }), onEdit: (t) => setModal({ type: "templateEditor", data: t }), onDelete: deleteCustomTemplate, onClose: popModal }))),
(modal === null || modal === void 0 ? void 0 : modal.type) === "templateEditor" && (React.createElement(Modal, { title: modal.data ? "Modifica template" : "Nuovo template", wide: true, onClose: () => setModal({ type: "templateManager" }) },
React.createElement(TemplateEditor, { initial: modal.data, existingTemplates: allTemplates, onSave: saveCustomTemplate, onClose: () => setModal({ type: "templateManager" }) }))),
(modal === null || modal === void 0 ? void 0 : modal.type) === "ppmChecklist" && (React.createElement(Modal, { title: "Checklist Manutenzione Programmata (PPM)", wide: true, onClose: popModal },
React.createElement(PpmChecklistEditor, { onClose: popModal, showToast: showToast }))),
(modal === null || modal === void 0 ? void 0 : modal.type) === "sticker" && (() => {
const stickerAsset = assets.find(a => { var _a; return a.id === (((_a = modal.data) === null || _a === void 0 ? void 0 : _a.assetId) || modal.assetId); });
const stickerCustomer = customers.find(c => { var _a; return c.id === (((_a = modal.data) === null || _a === void 0 ? void 0 : _a.customerId) || (stickerAsset === null || stickerAsset === void 0 ? void 0 : stickerAsset.customerId)); });
return (React.createElement(Modal, { title: modal.kind === "asset" ? "\uD83C\uDFF7 Sticker apparecchio" : "Sticker QR verifica", onClose: popModal },
React.createElement(StickerModal, { report: modal.data || {}, asset: stickerAsset, customer: stickerCustomer, company: company, kind: modal.kind, assets: assets, onClose: popModal })));
})(),
(modal === null || modal === void 0 ? void 0 : modal.type) === "scadenzaEmail" && (React.createElement(Modal, { title: "\u2709 Promemoria scadenza", onClose: popModal },
React.createElement(ScadenzaEmailModal, { sc: modal.data, company: company, onClose: popModal }))),
(modal === null || modal === void 0 ? void 0 : modal.type) === "clientReport" && (React.createElement(Modal, { title: "Report parco macchine", wide: true, onClose: popModal },
React.createElement(ClientReportModal, { customer: modal.data, assets: assets, iecReports: iecReports, funcReports: funcReports, jobs: jobs, company: company, onClose: popModal }))),
csvModal && (React.createElement("div", { style: { position: "fixed", inset: 0, background: "#000d", zIndex: 1001, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 } },
React.createElement("div", { style: { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 14, width: "min(640px,97vw)", maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" } },
React.createElement("div", { style: { padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 } },
React.createElement("div", null,
React.createElement("div", { style: { fontWeight: 800, fontSize: 14, color: "var(--text)" } }, csvModal.isJson ? " Backup JSON" : " Esporta dati"),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 2, fontFamily: "'IBM Plex Mono', monospace" } }, csvModal.filename)),
React.createElement("button", { onClick: () => setCsvModal(null), style: { background: "none", border: "none", color: "var(--text-3)", fontSize: 22, cursor: "pointer", lineHeight: 1 } }, "\u00D7")),
React.createElement("div", { style: { padding: "14px 20px", flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 12 } },
React.createElement("div", { style: { background: "var(--bg)", borderRadius: 8, padding: "10px 14px", border: "1px solid var(--border-2)", fontSize: 11, color: "var(--text-3)", lineHeight: 1.5 } }, csvModal.isJson
? React.createElement(React.Fragment, null,
React.createElement("strong", { style: { color: "var(--text)" } },
"Backup completo (",
csvModal.filename,
"):"),
" Clicca \"Copia tutto\", poi apri Blocco Note, incolla e salva come ",
React.createElement("strong", { style: { color: "#22c55e" } }, ".json"),
". Per ripristinare: Impostazioni \u2192 Importa backup.")
: React.createElement(React.Fragment, null,
React.createElement("strong", { style: { color: "var(--text)" } }, "Esporta dati:"),
" il download diretto di Excel non \u00E8 disponibile su questo dispositivo, quindi clicca \"Copia tutto\" e incolla i dati direttamente in Excel o Google Sheets (oppure salvali come file di testo .csv, che Excel apre).")),
React.createElement("textarea", { readOnly: true, value: csvModal.isJson ? csvModal.data : ("\uFEFF" + csvModal.data), id: "csv-textarea", style: { flex: 1, minHeight: 280, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", color: "var(--text)", fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", resize: "none", outline: "none" }, onClick: e => { e.target.select(); e.target.setSelectionRange(0, 999999); } })),
React.createElement("div", { style: { padding: "12px 20px", borderTop: "1px solid var(--border)", display: "flex", gap: 8, justifyContent: "space-between", alignItems: "center", flexShrink: 0 } },
React.createElement("button", { onClick: () => {
const text = csvModal.isJson ? csvModal.data : ("\uFEFF" + csvModal.data);
if (navigator.clipboard) {
navigator.clipboard.writeText(text).then(() => showToast("Copiato!")).catch(() => { });
}
}, style: { background: "#2dd4bf", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700 } }, "Copia negli appunti"),
React.createElement("button", { onClick: () => {
const text = csvModal.isJson ? csvModal.data : ("\uFEFF" + csvModal.data);
const ta = document.querySelector("#csv-textarea");
if (ta) {
ta.select();
ta.setSelectionRange(0, 999999);
}
if (navigator.clipboard) {
navigator.clipboard.writeText(text).then(() => showToast("✓ Copiato! Incolla in Notepad e salva come ." + (csvModal.isJson ? "json" : "csv"))).catch(() => showToast("Seleziona il testo e copia con Ctrl+C", "#f59e0b"));
}
else {
showToast("Seleziona il testo e copia con Ctrl+C", "#f59e0b");
}
}, style: { background: "#22c55e", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontSize: 13, fontWeight: 700 } }, "Copia tutto"),
React.createElement("button", { onClick: () => setCsvModal(null), style: { background: "var(--surface-2)", color: "var(--text-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700 } }, "Chiudi"))))),
pdfHtml && (React.createElement("div", { style: { position: "fixed", inset: 0, background: "#000e", zIndex: 1000, display: "flex", flexDirection: "column" } },
React.createElement("div", { style: { background: "var(--bg)", borderBottom: "1px solid var(--border)", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexShrink: 0, flexWrap: "wrap" } },
React.createElement("span", { style: { color: "var(--text)", fontWeight: 700, fontSize: 14 } }, " Anteprima documento"),
React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
React.createElement("button", { onClick: () => {
const iframe = document.getElementById('pdf-print-iframe');
if (!iframe || !iframe.contentWindow) {
alert('Anteprima non pronta. Riprova fra un secondo.');
return;
}
try {
try { const _t = String(pdfHtml).match(/<title>([^<]+)<\/title>/); if (_t && _t[1]) iframe.contentWindow.document.title = _t[1].trim(); } catch (e) {}
iframe.contentWindow.focus();
iframe.contentWindow.print();
}
catch (err) {
alert('Stampa non disponibile su questo dispositivo: ' + ((err === null || err === void 0 ? void 0 : err.message) || 'errore sconosciuto'));
}
}, style: { background: "#2dd4bf", color: "#000", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 6, touchAction: "manipulation" } }, "\uD83D\uDDA8 Salva PDF"),
React.createElement("button", { onClick: () => setPdfHtml(null), style: { background: "var(--surface-2)", color: "var(--text-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 12, fontWeight: 700, touchAction: "manipulation" } }, "\u2715 Chiudi"))),
React.createElement("div", { style: { flex: 1, overflow: "auto", background: "#f0f0f0", display: "flex", justifyContent: "center" } },
React.createElement("iframe", { id: "pdf-print-iframe", srcDoc: pdfHtml, style: { background: "#fff", width: "100%", maxWidth: "210mm", height: "100%", border: "none", boxShadow: "0 4px 24px #0004" }, title: "Anteprima documento" })),
React.createElement("div", { style: { background: "var(--bg)", borderTop: "1px solid var(--border)", padding: "8px 16px", fontSize: 11, color: "var(--text-3)", flexShrink: 0, textAlign: "center" } },
"Clicca \"Salva PDF\" \u2192 nel dialogo di stampa scegli ",
React.createElement("strong", { style: { color: "var(--text-2)" } }, "\"Salva come PDF\""),
" come destinazione (su Android: \"Salva come PDF\" / su iOS: \"Salva su File\")"))),
(modal === null || modal === void 0 ? void 0 : modal.type) === "iec" && (React.createElement(Modal, { title: modal.data ? "Modifica Verifica di Sicurezza Elettrica" : "Nuova Verifica di Sicurezza Elettrica", wide: true, onClose: popModal },
((modal.data || modal.classic)
? React.createElement(IECReportForm, { initial: modal.data || null, assetId: ((_d = modal.data) === null || _d === void 0 ? void 0 : _d.assetId) || modal.assetId || null, assets: assets, customers: customers, existingReports: iecReports, instruments: instruments, technicians: company.technicians || [], onSave: saveIecReport, onClose: popModal, isAdmin: isAdmin })
: React.createElement(IecWizardForm, { initial: null, assetId: modal.assetId || null, assets: assets, customers: customers, existingReports: iecReports, instruments: instruments, technicians: company.technicians || [], onSave: saveIecReport, onClose: popModal, isAdmin: isAdmin, onClassic: () => setModal(Object.assign(Object.assign({}, modal), { classic: true })) })))),
(modal === null || modal === void 0 ? void 0 : modal.type) === "assetDetail" && modal.data && (React.createElement(Modal, { title: modal.data.name || "Apparecchio", wide: true, onClose: popModal },
React.createElement(AssetDetailModal, { asset: modal.data, recalls: recalls, jobs: jobs, parts: parts, iecReports: iecReports, funcReports: funcReports, customers: customers, company: company, templates: allTemplates, generateIECPDF: generateIECPDF, generateFuncPDF: generateFuncPDF, onClose: popModal, onEditAsset: () => pushModal({ type: "asset", data: modal.data }), onNewJob: () => pushModal({ type: "job", data: { assetId: modal.data.id, type: "correttiva", priority: "normale", status: "aperto", description: "", openDate: new Date().toISOString().slice(0, 10), parts: [], laborHours: 0, laborRate: 55, notes: "", timeline: [], photos: [] } }), onNewIec: () => pushModal({ type: "iec", assetId: modal.data.id, data: null }), onNewFunc: () => pushModal({ type: "func", assetId: modal.data.id, data: null }), onAssetSticker: () => pushModal({ type: "sticker", data: {}, kind: "asset", assetId: modal.data.id }), onOpenJob: j => pushModal({ type: "job", data: j }), onQuickLocation: (loc) => { const _now = new Date().toISOString(); const rec = withUpdateMeta(Object.assign(Object.assign({}, modal.data), { lastLocation: loc, lastLocationDate: _now, lastSeenAt: _now })); setAssets(a => upsertInList(a, rec)); setModal(m => m ? Object.assign(Object.assign({}, m), { data: rec }) : m); showToast("\uD83D\uDCCD Posizione rilevata", "#2dd4bf"); } }))),
(modal === null || modal === void 0 ? void 0 : modal.type) === "func" && (React.createElement(Modal, { title: modal.data ? "Modifica Verifica Funzionale" : "Nuova Verifica Funzionale", wide: true, onClose: popModal },
((modal.data || modal.classic)
? React.createElement(FuncVerifyForm, { initial: modal.data || null, assetId: ((_e = modal.data) === null || _e === void 0 ? void 0 : _e.assetId) || modal.assetId || null, assets: assets, customers: customers, existingReports: funcReports, templates: allTemplates, instruments: instruments, technicians: company.technicians || [], onSave: saveFuncReport, onClose: popModal, isAdmin: isAdmin, showToast: showToast })
: React.createElement(FuncWizardForm, { initial: null, assetId: modal.assetId || null, assets: assets, customers: customers, existingReports: funcReports, templates: allTemplates, instruments: instruments, technicians: company.technicians || [], onSave: saveFuncReport, onClose: popModal, isAdmin: isAdmin, showToast: showToast, onClassic: () => setModal(Object.assign(Object.assign({}, modal), { classic: true })) })))),
(modal === null || modal === void 0 ? void 0 : modal.type) === "ppm" && (React.createElement(Modal, { title: modal.data ? "Modifica Manutenzione Programmata" : "Nuova Manutenzione Programmata", wide: true, onClose: popModal },
React.createElement(PpmVerifyForm, { initial: modal.data || null, assetId: (modal.data && modal.data.assetId) || modal.assetId || null, assets: assets, customers: customers, existingReports: ppmReports, technicians: company.technicians || [], onSave: savePpmReport, onClose: popModal, showToast: showToast, ppmReports: ppmReports, funcReports: funcReports, iecReports: iecReports, onLink: linkPpmReport, onPdf: openPpmPdf, setModal: setModal, pushModal: pushModal }))),
(modal === null || modal === void 0 ? void 0 : modal.type) === "ppmwiz" && (React.createElement(Modal, { title: "Nuova Manutenzione Programmata", wide: true, onClose: popModal },
React.createElement(PpmWizardForm, { assetId: modal.assetId || null, assets: assets, customers: customers, templates: allTemplates, existingFunc: funcReports, existingIec: iecReports, technicians: company.technicians || [], instruments: instruments, onSaveFull: savePpmFull, onClose: popModal }))),
React.createElement(ConfirmDialog, null),
React.createElement(PromptDialog, null))));
}
function SubscriptionBanner() {
const [info, setInfo] = React.useState(null);
React.useEffect(() => { let vivo = true; fetchSubStatus().then(d => { if (vivo)
setInfo(d); }); return () => { vivo = false; }; }, []);
if (!info || info.valid_until == null)
return null;
const g = info.giorni_rimanenti;
if (info.scaduto) {
return (React.createElement("div", { style: { position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 9998, background: "var(--err-bg)", borderTop: "1px solid #ef444466", color: "#fca5a5", fontSize: 12, fontWeight: 700, textAlign: "center", padding: "7px 12px" } }, "\u26D4 Abbonamento scaduto \u2014 l'app \u00E8 in sola lettura. I tuoi dati restano al sicuro e consultabili: rinnova per riattivare le modifiche."));
}
if (typeof g === "number" && g <= 30) {
return (React.createElement("div", { style: { position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 9998, background: "var(--warn-bg)", borderTop: "1px solid #f59e0b55", color: "#fbbf24", fontSize: 12, fontWeight: 700, textAlign: "center", padding: "7px 12px" } },
"\uD83D\uDCC5 Abbonamento in scadenza tra ",
g,
" ",
g === 1 ? "giorno" : "giorni",
"."));
}
return null;
}
function OfflineBanner() {
const isOff = (typeof OFFLINE_MODE !== "undefined" && OFFLINE_MODE) || (typeof DEMO_LOCKED !== "undefined" && DEMO_LOCKED);
const [giu, setGiu] = React.useState(typeof navigator !== "undefined" && navigator.onLine === false);
React.useEffect(() => {
const on = () => setGiu(false), off = () => setGiu(true);
window.addEventListener("online", on);
window.addEventListener("offline", off);
return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
}, []);
if (isOff || !giu)
return null;
return (React.createElement("div", { style: { position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 9999, background: "var(--warn-bg)", borderTop: "1px solid #f59e0b55", color: "#fbbf24", fontSize: 12, fontWeight: 700, textAlign: "center", padding: "7px 12px" } }, "\uD83D\uDCF4 Sei offline \u2014 stai lavorando sui dati locali. Quando torna la rete, ricordati di Sincronizzare."));
}
export function App() {
const [currentUser, setCurrentUser] = React.useState(undefined);
const [authReady, setAuthReady] = React.useState(false);
const [dataReady, setDataReady] = React.useState(false);
const [libError, setLibError] = React.useState(false);
const isDemo = (typeof DEMO_LOCKED !== "undefined" && DEMO_LOCKED);
const isOffline = (typeof OFFLINE_MODE !== "undefined" && OFFLINE_MODE);
React.useEffect(() => {
if (isDemo || isOffline) {
setCurrentUser({ id: 'local-user', email: 'locale' });
setAuthReady(true);
return;
}
let tries = 0;
const cached = (() => { try {
const r = localStorage.getItem("medtrace-auth-cache");
return r ? JSON.parse(r) : null;
}
catch (e) {
return null;
} })();
const saveCache = (u) => { try {
localStorage.setItem("medtrace-auth-cache", JSON.stringify({ id: u.id, email: u.email || "", ts: Date.now() }));
}
catch (e) { } };
const enterOffline = () => {
if (cached && cached.id) {
setCurrentUser({ id: cached.id, email: cached.email || "", _offline: true });
setAuthReady(true);
return true;
}
return false;
};
const init = () => {
const supa = (typeof getSupa === "function") ? getSupa() : null;
if (!supa) {
tries++;
if (tries < 20) {
setTimeout(init, 150);
return;
}
if (enterOffline())
return;
setLibError(true);
setAuthReady(true);
return;
}
let settled = false;
const finish = (fn) => { if (settled)
return; settled = true; fn(); };
const guardia = setTimeout(() => {
finish(() => {
if (enterOffline())
return;
setCurrentUser(null);
setAuthReady(true);
});
}, 3500);
supa.auth.getSession().then(({ data }) => {
clearTimeout(guardia);
finish(() => {
const u = data && data.session && data.session.user;
if (u) {
saveCache(u);
setCurrentUser(u);
setAuthReady(true);
}
else if (navigator.onLine === false && enterOffline()) { }
else {
setCurrentUser(null);
setAuthReady(true);
}
});
}).catch(() => { clearTimeout(guardia); finish(() => { if (!enterOffline()) {
setCurrentUser(null);
setAuthReady(true);
} }); });
supa.auth.onAuthStateChange((_, session) => {
const u = (session === null || session === void 0 ? void 0 : session.user) || null;
if (u) {
saveCache(u);
setCurrentUser(u);
}
else if (navigator.onLine === false) { }
else {
setCurrentUser(null);
}
});
};
init();
}, []);
React.useEffect(() => {
if (isDemo) { setDataReady(true); return; }
let alive = true;
const finish = () => { if (alive) setDataReady(true); };
const guard = setTimeout(finish, 3000);
bootLoadData().then(() => { clearTimeout(guard); finish(); }, () => { clearTimeout(guard); finish(); });
return () => { alive = false; clearTimeout(guard); };
}, []);
if (!authReady || !dataReady)
return (React.createElement("div", { style: { minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
React.createElement("div", { style: { width: 32, height: 32, border: '3px solid #2A2A38', borderTopColor: '#2dd4bf', borderRadius: '50%', animation: 'spin 1s linear infinite' } }),
React.createElement("style", null, "@keyframes spin{to{transform:rotate(360deg)}}")));
if (libError)
return (React.createElement("div", { style: { minHeight: '100vh', background: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 } },
React.createElement("div", { style: { maxWidth: 360, textAlign: 'center' } },
React.createElement("div", { style: { fontSize: 30, fontWeight: 800, color: '#2dd4bf', marginBottom: 8 } }, "MedTrace"),
React.createElement("div", { style: { fontSize: 14, color: 'var(--text)', fontWeight: 700, marginBottom: 10 } }, "Connessione richiesta per il primo accesso"),
React.createElement("div", { style: { fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 18 } }, "Non e stato possibile contattare il servizio di autenticazione. Per accedere la prima volta serve una connessione a internet. Una volta effettuato l'accesso, potrai lavorare anche offline."),
React.createElement("button", { onClick: () => window.location.reload(), style: { background: '#2dd4bf', color: '#06251f', border: 'none', borderRadius: 10, padding: '11px 22px', fontWeight: 800, fontSize: 14, cursor: 'pointer' } }, "Riprova"))));
if (!currentUser)
return React.createElement(LoginScreen, { onLogin: setCurrentUser });
return (React.createElement(React.Fragment, null,
React.createElement(MTErrorBoundary, null, React.createElement(AppMain, null)),
React.createElement(OfflineBanner, null),
React.createElement(SubscriptionBanner, null)));
}
