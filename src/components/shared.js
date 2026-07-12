import { t as __t } from "../constants/i18n.js";
/* Componenti condivisi: selettore/gestore tecnici, lista allegati e helper. Estratto verbatim da app.js, fase 1. */
import { __awaiter, __rest } from "../lib/tslib.js";
import { FORM_INP, FORM_LBL, FORM_FLD, FORM_ROW, FORM_COL, FORM_SECTION, FORM_BTN_PRIMARY, FORM_BTN_GHOST, STATUS_COLOR } from "../constants/ui.js";
import { SignaturePad } from "./ui.js";

export function TecnicoPicker({ value, onChange, technicians, label }) {
const list = (value || "").split(",").map(x => x.trim()).filter(Boolean);
const techs = (technicians || []).map(t => typeof t === "string" ? t : ((t && t.name) || "")).filter(Boolean);
const has = nm => list.some(x => x.toLowerCase() === nm.toLowerCase());
const setList = arr => onChange(arr.join(", "));
const toggle = nm => has(nm) ? setList(list.filter(x => x.toLowerCase() !== nm.toLowerCase())) : setList([...list, nm]);
const [manual, setManual] = React.useState("");
const addManual = () => { const nm = manual.trim(); if (nm && !has(nm))
setList([...list, nm]); setManual(""); };
const PILL = on => ({ background: on ? "#2dd4bf22" : "var(--surface-3)", border: "1px solid " + (on ? "#2dd4bf" : "var(--border)"), color: on ? "#2dd4bf" : "var(--text-2)", borderRadius: 8, padding: "6px 11px", fontSize: 13, cursor: "pointer", fontWeight: 600 });
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } },
React.createElement("label", { style: { fontSize: 12, color: "var(--text-2)", fontWeight: 600 } }, label || __t("Tecnico/i")),
techs.length > 0 && (React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, techs.map(t => React.createElement("button", { key: t, type: "button", onClick: () => toggle(t), style: PILL(has(t)) },
has(t) ? "\u2713 " : "",
t)))),
React.createElement("div", { style: { display: "flex", gap: 6 } },
React.createElement("input", { value: manual, onChange: e => setManual(e.target.value), onKeyDown: e => { if (e.key === "Enter") {
e.preventDefault();
addManual();
} }, placeholder: techs.length ? "altro nome a mano\u2026" : "scrivi il nome del tecnico", style: { flex: 1, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "9px 11px", fontSize: 14 } }),
React.createElement("button", { type: "button", onClick: addManual, style: { background: "var(--surface-3)", border: "1px solid var(--border)", borderRadius: 8, color: "#2dd4bf", padding: "0 14px", fontSize: 18, cursor: "pointer", fontWeight: 700 } }, "+")),
list.length > 0 && (React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" } },
React.createElement("span", { style: { fontSize: 12, color: "var(--text-3)" } }, __t("Selezionati:")),
list.map(nm => (React.createElement("span", { key: nm, style: { display: "inline-flex", alignItems: "center", gap: 6, background: "#2dd4bf18", border: "1px solid #2dd4bf55", color: "#2dd4bf", borderRadius: 8, padding: "4px 4px 4px 9px", fontSize: 12, fontWeight: 600 } },
nm,
React.createElement("button", { type: "button", onClick: () => setList(list.filter(x => x.toLowerCase() !== nm.toLowerCase())), title: __t("Rimuovi"), style: { background: "transparent", border: "none", color: "#2dd4bf", fontSize: 13, lineHeight: 1, cursor: "pointer", padding: "0 4px" } }, "\u2715"))))))));
}

export function TecniciManager({ technicians, onChange }) {
const raw = (technicians || []).map(t => typeof t === "string" ? { name: t } : (t || {})).filter(t => t && t.name);
const [name, setName] = React.useState("");
const [sigFor, setSigFor] = React.useState(null);
const add = () => { const nm = name.trim(); if (nm && !raw.some(x => String(x.name).toLowerCase() === nm.toLowerCase()))
onChange(raw.concat([{ name: nm }])); setName(""); };
const remove = nm => onChange(raw.filter(x => x.name !== nm));
const setSig = (nm, sig) => onChange(raw.map(x => x.name === nm ? Object.assign({}, x, { signature: sig || "" }) : x));
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
React.createElement("div", { style: { fontSize: 12, color: "var(--text-2)", lineHeight: 1.55 } }, __t("I tecnici registrati qui compaiono in una tendina quando crei un Job o una verifica. La firma salvata qui viene proposta in automatico nei report, cos\u00ec non serve rifirmare ogni volta.")),
raw.length > 0 ? (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, raw.map(t => (React.createElement("div", { key: t.name, style: { background: "var(--card)", border: "1px solid var(--border-3)", borderRadius: 10, padding: "10px 14px" } },
React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 } },
React.createElement("span", { style: { fontSize: 14, color: "var(--text)", fontWeight: 600 } }, t.name),
React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
React.createElement("button", { type: "button", onClick: () => setSigFor(sigFor === t.name ? null : t.name), style: { background: "transparent", border: "1px solid " + (t.signature ? "#2dd4bf" : "var(--border)"), borderRadius: 8, color: t.signature ? "#2dd4bf" : "var(--text-2)", fontSize: 11, fontWeight: 700, cursor: "pointer", padding: "4px 9px" } }, t.signature ? __t("Firma \u2713") : __t("Firma")),
React.createElement("button", { type: "button", onClick: () => remove(t.name), title: __t("Rimuovi"), style: { background: "transparent", border: "none", color: "#ef4444", fontSize: 16, cursor: "pointer" } }, "\u2715"))),
sigFor === t.name ? React.createElement("div", { style: { marginTop: 10 } },
React.createElement(SignaturePad, { label: "Firma di " + t.name + " (proposta in automatico nei report)", value: t.signature || "", onChange: v => setSig(t.name, v), height: 120 })) : null))))) : React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)" } }, __t("Nessun tecnico ancora. Aggiungine uno qui sotto.")),
React.createElement("div", { style: { display: "flex", gap: 6 } },
React.createElement("input", { value: name, onChange: e => setName(e.target.value), onKeyDown: e => { if (e.key === "Enter") {
e.preventDefault();
add();
} }, placeholder: __t("Nome tecnico (es. Mario Rossi)"), style: { flex: 1, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "10px 12px", fontSize: 14 } }),
React.createElement("button", { type: "button", onClick: add, style: { background: "#2dd4bf", border: "none", borderRadius: 8, color: "#04201C", padding: "0 16px", fontSize: 14, fontWeight: 800, cursor: "pointer" } }, __t("Aggiungi")))));
}

export function techSignature(technicians, nameStr) {
const names = String(nameStr || "").split(",").map(x => x.trim()).filter(Boolean);
for (const nm of names) {
const t = (technicians || []).find(x => x && typeof x === "object" && String(x.name || "").toLowerCase() === nm.toLowerCase());
if (t && t.signature) return t.signature;
}
return "";
}

export function chkRow(on, onToggle, title, subtitle) {
return React.createElement("div", { onClick: onToggle, style: { display: "flex", alignItems: "flex-start", gap: 10, background: on ? "#2dd4bf12" : "var(--surface)", border: "1px solid " + (on ? "#2dd4bf" : "var(--border)"), borderRadius: 10, padding: "10px 12px", cursor: "pointer" } },
React.createElement("div", { style: { width: 20, height: 20, flexShrink: 0, borderRadius: 6, background: on ? "#2dd4bf" : "transparent", border: "2px solid " + (on ? "#2dd4bf" : "var(--text-4)"), display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 } }, on ? React.createElement("span", { style: { color: "#04201C", fontSize: 13, fontWeight: 800, lineHeight: 1 } }, "\u2713") : null),
React.createElement("div", { style: { minWidth: 0 } },
React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: "var(--text)" } }, title),
subtitle ? React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 2, lineHeight: 1.35 } }, subtitle) : null));
}

export function Btn(_a) {
var { children, variant = "primary", sm } = _a, props = __rest(_a, ["children", "variant", "sm"]);
const base = { borderRadius: 10, cursor: "pointer", fontWeight: 700, transition: "all .15s", border: "none", display: "inline-flex", alignItems: "center", gap: 6, letterSpacing: .2 };
const vars = {
primary: { background: "#2dd4bf", color: "#fff", boxShadow: "none" },
success: { background: "#15803d22", color: "#22c55e", border: "1px solid #22c55e44" },
danger: { background: "#ef444422", color: "#ef4444", border: "1px solid #ef444433" },
ghost: { background: "transparent", color: "var(--text-2)", border: "1px solid #3a3a4a" },
warning: { background: "#f59e0b22", color: "#f59e0b", border: "1px solid #f59e0b44" },
};
return (React.createElement("button", Object.assign({}, props, { style: Object.assign(Object.assign(Object.assign(Object.assign({}, base), vars[variant]), { padding: sm ? "6px 12px" : "9px 18px", fontSize: sm ? 12 : 13 }), props.style) }), children));
}

function formatBytes(n) {
n = Number(n) || 0;
if (n < 1024) return n + " B";
if (n < 1048576) return (n / 1024).toFixed(1) + " KB";
return (n / 1048576).toFixed(2) + " MB";
}

function getStorageUsage() {
var bytes = 0;
try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); bytes += k.length + (localStorage.getItem(k) || "").length; } } catch (e) {}
return { bytes: bytes, mb: (bytes / 1048576).toFixed(1) };
}

export function fileToAttachment(file) {
return new Promise(function (resolve, reject) {
var r = new FileReader();
r.onerror = function () { reject(new Error("Lettura file fallita")); };
r.onload = function () {
var dataUrl = String(r.result || "");
resolve({ id: "att_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7), name: file.name || "file", type: file.type || "", size: file.size || 0, finalSize: dataUrl.length, dataUrl: dataUrl, uploadedAt: new Date().toISOString() });
};
r.readAsDataURL(file);
});
}

function downloadAttachment(att) {
if (!att || !att.dataUrl) return;
var a = document.createElement("a");
a.href = att.dataUrl; a.download = att.name || "allegato";
document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

export function AttachmentsList({ attachments, onAdd, onDelete, showToast, compact }) {
const inputRef = React.useRef(null);
const [uploading, setUploading] = React.useState(false);
const handleFiles = (e) => __awaiter(this, void 0, void 0, function* () {
const files = Array.from(e.target.files || []);
if (!files.length)
return;
setUploading(true);
try {
for (const file of files) {
if (file.size > 5 * 1024 * 1024) {
alert(`File "${file.name}" è troppo grande (>5MB). Usa file più piccoli o comprimi prima.`);
continue;
}
const att = yield fileToAttachment(file);
const usage = getStorageUsage();
if (usage.bytes + att.dataUrl.length > 9 * 1024 * 1024) {
alert(`⚠ Spazio quasi esaurito (${usage.mb} MB di ~10 MB).\nEsporta backup e libera spazio prima di continuare.`);
break;
}
onAdd(att);
}
showToast && showToast(`✓ ${files.length} file caricat${files.length === 1 ? 'o' : 'i'}`);
}
catch (err) {
alert('Errore caricamento: ' + err.message);
}
finally {
setUploading(false);
if (inputRef.current)
inputRef.current.value = '';
}
});
const getIcon = (type) => {
if (type === null || type === void 0 ? void 0 : type.startsWith('image/'))
return 'IMG';
if (type === 'application/pdf')
return 'PDF';
if (type === null || type === void 0 ? void 0 : type.includes('word'))
return 'DOC';
if ((type === null || type === void 0 ? void 0 : type.includes('excel')) || (type === null || type === void 0 ? void 0 : type.includes('sheet')))
return 'XLS';
return 'FILE';
};
return (React.createElement("div", { style: { marginTop: compact ? 6 : 10 } },
!compact && (React.createElement("div", { style: { fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: .8, fontWeight: 700, marginBottom: 6 } },
__t("Allegati ("),
(attachments || []).length,
")")),
React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 } }, (attachments || []).length === 0 ? (React.createElement("div", { style: { fontSize: 11, color: 'var(--text-3)', padding: '6px 0', fontStyle: 'italic' } }, __t("Nessun allegato"))) : (attachments || []).map(att => {
var _a;
return (React.createElement("div", { key: att.id, style: {
background: 'var(--bg)', border: '1px solid #2A2A38', borderRadius: 6,
padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 8,
} },
React.createElement("span", { style: { fontSize: 10, fontWeight: 800, color: 'var(--text-3)', fontFamily: 'monospace', border: '1px solid var(--border-2)', borderRadius: 4, padding: '1px 4px', flexShrink: 0 } }, getIcon(att.type)),
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: 'var(--text-bright)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, att.name),
React.createElement("div", { style: { fontSize: 10, color: 'var(--text-3)' } },
formatBytes(att.finalSize || att.size),
" \u00B7 ",
(att.uploadedAt || '').slice(0, 10))),
React.createElement("button", { onClick: () => downloadAttachment(att), title: __t("Scarica"), style: { background: 'var(--surface-3)', border: '1px solid #2dd4bf44', borderRadius: 4, color: '#2dd4bf', padding: '3px 8px', cursor: 'pointer', fontSize: 10, fontWeight: 700 } }, __t("Scarica")),
((_a = att.type) === null || _a === void 0 ? void 0 : _a.startsWith('image/')) && (React.createElement("button", { onClick: () => window.open(att.dataUrl, '_blank'), title: __t("Visualizza"), style: { background: 'var(--surface-3)', border: '1px solid #2a3040', borderRadius: 4, color: 'var(--text-2)', padding: '3px 8px', cursor: 'pointer', fontSize: 10, fontWeight: 700 } }, __t("Apri"))),
React.createElement("button", { onClick: () => { if (confirm('Eliminare "' + att.name + '"?'))
onDelete(att.id); }, title: __t("Elimina"), style: { background: 'var(--surface-3)', border: '1px solid #ef444433', borderRadius: 4, color: '#ef4444', padding: '3px 8px', cursor: 'pointer', fontSize: 10, fontWeight: 700 } }, "\u2715")));
})),
React.createElement("label", { style: {
display: 'inline-flex', alignItems: 'center', gap: 6, cursor: uploading ? 'wait' : 'pointer',
background: 'var(--surface-2)', border: '1px dashed #2dd4bf44', borderRadius: 6, padding: '6px 14px',
color: '#2dd4bf', fontSize: 11, fontWeight: 700, opacity: uploading ? .5 : 1,
} },
React.createElement("input", { ref: inputRef, type: "file", multiple: true, accept: "image/*,.pdf,.doc,.docx,.xls,.xlsx", onChange: handleFiles, disabled: uploading, style: { display: 'none' } }),
uploading ? '⏳ Caricamento...' : '+ Carica allegato (PDF, immagine, doc)')));
}
