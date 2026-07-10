import { FORM_INP, FORM_LBL } from "../constants/ui.js";
/* MedTrace — accesso: login/registrazione (estratto da app.js, v3.06) */
import { Inp, appConfirm } from "./ui.js";
import { Btn } from "./shared.js";
import { supaSignIn, supaSignUp, supaSignOut, getSupa, OFFLINE_MODE } from "../lib/sync.js";
import { __awaiter } from "../lib/tslib.js";
export function LoginScreen({ onLogin }) {
const [mode, setMode] = React.useState('login');
const [email, setEmail] = React.useState('');
const [password, setPassword] = React.useState('');
const [inviteCode, setInviteCode] = React.useState('');
const [orgName, setOrgName] = React.useState('');
const [activationCode, setActivationCode] = React.useState('');
const [createdCode, setCreatedCode] = React.useState('');
const [createdUser, setCreatedUser] = React.useState(null);
const [copied, setCopied] = React.useState(false);
const [loading, setLoading] = React.useState(false);
const [error, setError] = React.useState('');
const handle = () => __awaiter(this, void 0, void 0, function* () {
var _a;
if (!email || !password) {
setError('Inserisci email e password');
return;
}
setLoading(true);
setError('');
try {
if (mode === 'register') {
if (!inviteCode.trim()) {
setError('Inserisci il codice invito fornito dalla tua azienda');
setLoading(false);
return;
}
const result = yield supaSignUp(email, password);
if (!result)
throw new Error('Cloud non disponibile');
if (result.error)
throw result.error;
try {
const supa = getSupa();
const { data: sess } = yield supa.auth.getSession();
if (!(sess === null || sess === void 0 ? void 0 : sess.session)) {
yield supaSignIn(email, password);
}
const { data: joinRes, error: joinErr } = yield supa.rpc('unisciti_con_codice', { codice: inviteCode.trim() });
if (joinErr)
throw joinErr;
if (joinRes && joinRes.startsWith('ERRORE')) {
throw new Error(joinRes.replace('ERRORE: ', ''));
}
}
catch (je) {
setError('Account creato ma codice non valido: ' + (je.message || je) + '. Contatta la tua azienda.');
setLoading(false);
return;
}
setError('Registrazione completata! Ora puoi accedere.');
setMode('login');
}
else if (mode === 'create') {
const nome = orgName.trim();
if (nome.length < 2) {
setError('Inserisci il nome della tua organizzazione');
setLoading(false);
return;
}
if (!activationCode.trim()) {
setError('Inserisci il codice di attivazione che ti è stato fornito');
setLoading(false);
return;
}
const result = yield supaSignUp(email, password);
if (!result)
throw new Error('Cloud non disponibile');
if (result.error && !/already|registered|esiste|registrat/i.test(result.error.message || ''))
throw result.error;
const supa = getSupa();
const { data: sess } = yield supa.auth.getSession();
if (!(sess === null || sess === void 0 ? void 0 : sess.session)) {
const si = yield supaSignIn(email, password);
if (si === null || si === void 0 ? void 0 : si.error)
throw si.error;
}
const { data: res, error: rpcErr } = yield supa.rpc('crea_organizzazione', { p_nome: nome, p_codice_attivazione: activationCode.trim() });
if (rpcErr)
throw rpcErr;
if (typeof res === 'string' && res.indexOf('OK:') === 0) {
const { data: s2 } = yield supa.auth.getSession();
setCreatedUser(((_a = s2 === null || s2 === void 0 ? void 0 : s2.session) === null || _a === void 0 ? void 0 : _a.user) || null);
setCreatedCode(res.slice(3));
}
else {
throw new Error(String(res || 'Attivazione non riuscita').replace('ERRORE: ', ''));
}
}
else {
const result = yield supaSignIn(email, password);
if (!result)
throw new Error('Cloud non disponibile');
if (result.error)
throw result.error;
onLogin(result.data.user);
}
}
catch (e) {
setError(e.message || 'Errore di autenticazione');
}
finally {
setLoading(false);
}
});
const INP = FORM_INP;
const LBL = FORM_LBL;
if (createdCode) {
return (React.createElement("div", { style: { minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 } },
React.createElement("div", { style: { width: '100%', maxWidth: 430, background: 'var(--surface)', border: '1px solid #2A2A38', borderRadius: 14, padding: 32, textAlign: 'center' } },
React.createElement("div", { style: { fontSize: 40, marginBottom: 10 } }, "\uD83C\uDF89"),
React.createElement("h2", { style: { fontSize: 19, fontWeight: 800, color: 'var(--text-bright)', marginBottom: 8 } }, "Organizzazione creata!"),
React.createElement("p", { style: { fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55, marginBottom: 18 } },
"Sei l'amministratore (superuser) di ",
React.createElement("strong", { style: { color: 'var(--text)' } }, orgName.trim()),
". Questo \u00E8 il ",
React.createElement("strong", { style: { color: '#2dd4bf' } }, "codice invito"),
" con cui i tuoi colleghi si registrano:"),
React.createElement("div", { onClick: () => { try {
if (navigator.clipboard)
navigator.clipboard.writeText(createdCode);
setCopied(true);
}
catch (e) { } }, style: { background: 'var(--bg)', border: '1px dashed #2dd4bf66', borderRadius: 10, padding: '14px 10px', fontFamily: 'monospace', fontSize: 20, fontWeight: 800, letterSpacing: 2, color: '#2dd4bf', cursor: 'pointer', marginBottom: 8, wordBreak: 'break-all' } }, createdCode),
React.createElement("div", { style: { fontSize: 11, color: copied ? '#2dd4bf' : 'var(--text-3)', marginBottom: 22 } }, copied ? '✓ Copiato negli appunti' : 'Tocca per copiare · Conservalo: serve ai colleghi per registrarsi'),
React.createElement("button", { onClick: () => { if (createdUser)
onLogin(createdUser);
else
window.location.reload(); }, style: { width: '100%', background: '#2dd4bf', color: '#000', border: 'none', borderRadius: 8, padding: 13, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' } }, "Entra in MedTrace \u2192"))));
}
return (React.createElement("div", { style: { minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 } },
React.createElement("div", { style: { width: '100%', maxWidth: 400 } },
React.createElement("div", { style: { textAlign: 'center', marginBottom: 40 } },
React.createElement("svg", { viewBox: "0 0 220 48", xmlns: "http://www.w3.org/2000/svg", style: { width: 200, height: 44 } },
React.createElement("g", { fill: "none", stroke: "#2dd4bf", strokeLinecap: "round", strokeLinejoin: "round" },
React.createElement("path", { d: "M6 24 Q11 14 16 24 Q21 34 26 24", strokeWidth: "2.5" }),
React.createElement("path", { d: "M1 24 Q9 10 16 24 Q23 38 31 24", strokeWidth: "2.5" }),
React.createElement("path", { d: "M-4 24 Q7 6 16 24 Q25 42 36 24", strokeWidth: "2.5" }),
React.createElement("circle", { cx: "42", cy: "24", r: "3.5", fill: "#2dd4bf", stroke: "none" })),
React.createElement("text", { x: "54", y: "28", fontFamily: "'Segoe UI',Arial,sans-serif", fontSize: "20", fontWeight: "800", style: { fill: "var(--text-bright)" }, letterSpacing: "-0.5" }, "MedTrace"),
React.createElement("text", { x: "54", y: "40", fontFamily: "'Segoe UI',Arial,sans-serif", fontSize: "8.5", fontWeight: "600", fill: "#5A5A70", letterSpacing: "1.5" }, "MEDICAL")),
React.createElement("p", { style: { color: 'var(--text-3)', fontSize: 11, marginTop: 10, letterSpacing: 1.5, textTransform: 'uppercase' } }, "Gestione Apparecchiature Elettromedicali")),
React.createElement("div", { style: { background: 'var(--surface)', border: '1px solid #2A2A38', borderRadius: 14, padding: 32 } },
React.createElement("h2", { style: { fontSize: 18, fontWeight: 800, marginBottom: 24, color: 'var(--text-bright)' } }, mode === 'login' ? 'Accedi' : mode === 'create' ? 'Crea la tua organizzazione' : 'Crea account'),
React.createElement("div", { style: { marginBottom: 16 } },
React.createElement("label", { style: LBL }, "Email"),
React.createElement("input", { type: "email", value: email, onChange: e => setEmail(e.target.value), onKeyDown: e => e.key === 'Enter' && handle(), placeholder: "tuaemail@esempio.com", style: INP })),
React.createElement("div", { style: { marginBottom: 24 } },
React.createElement("label", { style: LBL }, "Password"),
React.createElement("input", { type: "password", value: password, onChange: e => setPassword(e.target.value), onKeyDown: e => e.key === 'Enter' && handle(), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", style: INP })),
mode === 'register' && (React.createElement("div", { style: { marginBottom: 24 } },
React.createElement("label", { style: LBL }, "Codice invito azienda"),
React.createElement("input", { type: "text", value: inviteCode, onChange: e => setInviteCode(e.target.value.toUpperCase()), onKeyDown: e => e.key === 'Enter' && handle(), placeholder: "es. MEDTRACE-2026", style: Object.assign(Object.assign({}, INP), { textTransform: 'uppercase' }) }),
React.createElement("div", { style: { fontSize: 11, color: 'var(--text-3)', marginTop: 6, lineHeight: 1.4 } }, "Il codice fornito dalla tua azienda per accedere ai dati condivisi."),
React.createElement("div", { style: { textAlign: 'center', marginTop: 14 } },
React.createElement("button", { onClick: () => { setMode('create'); setError(''); }, style: { background: 'none', border: 'none', color: '#2dd4bf', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' } }, "Nuova ditta? Crea la tua organizzazione")))),
mode === 'create' && (React.createElement(React.Fragment, null,
React.createElement("div", { style: { marginBottom: 16 } },
React.createElement("label", { style: LBL }, "Nome organizzazione"),
React.createElement("input", { type: "text", value: orgName, onChange: e => setOrgName(e.target.value), onKeyDown: e => e.key === 'Enter' && handle(), placeholder: "es. Biomedical Service SRL", style: INP })),
React.createElement("div", { style: { marginBottom: 24 } },
React.createElement("label", { style: LBL }, "Codice di attivazione"),
React.createElement("input", { type: "text", value: activationCode, onChange: e => setActivationCode(e.target.value.toUpperCase()), onKeyDown: e => e.key === 'Enter' && handle(), placeholder: "fornito all'acquisto", style: Object.assign(Object.assign({}, INP), { textTransform: 'uppercase' }) }),
React.createElement("div", { style: { fontSize: 11, color: 'var(--text-3)', marginTop: 6, lineHeight: 1.4 } }, "Ti \u00E8 stato consegnato all'acquisto di MedTrace. Creando l'organizzazione ne diventi l'amministratore (superuser); il codice invito per i colleghi te lo mostro subito dopo.")))),
error && React.createElement("div", { style: { background: error.includes('email') ? '#2dd4bf18' : '#ef444418', border: `1px solid ${error.includes('email') ? '#2dd4bf44' : '#ef444444'}`, borderRadius: 8, padding: '10px 14px', fontSize: 13, color: error.includes('email') ? '#2dd4bf' : '#ef4444', marginBottom: 16 } }, error),
React.createElement("button", { onClick: handle, disabled: loading, style: { width: '100%', background: '#2dd4bf', color: '#000', border: 'none', borderRadius: 8, padding: 13, fontSize: 14, fontWeight: 800, cursor: loading ? 'wait' : 'pointer', opacity: loading ? .7 : 1, fontFamily: 'inherit' } }, loading ? 'Caricamento…' : mode === 'login' ? 'Accedi' : mode === 'create' ? 'Crea organizzazione' : 'Crea account'),
React.createElement("div", { style: { textAlign: 'center', marginTop: 18 } },
React.createElement("button", { onClick: () => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }, style: { background: 'none', border: 'none', color: 'var(--text-3)', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' } }, mode === 'login' ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi'))),
React.createElement("p", { style: { textAlign: 'center', color: 'var(--text-4)', fontSize: 11, marginTop: 20 } }, "MedTrace \u00B7 Software gestione elettromedicali"))));
}
