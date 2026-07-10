/* MedTrace — scan-mode RFID: cattura HID (keyboard-wedge), feedback, normalizzazione EPC (v2.85)
   Il lettore Bluetooth in modalità HID "digita" l'EPC + Invio. Qui: listener keydown
   globale (capture) attivo solo in ascolto; ignora i campi editabili (l'utente che
   scrive nel campo REPARTO non è il lettore); buffer con timeout anti-stantio;
   su Invio, se il buffer è un EPC plausibile (≥8 alfanumerici), cattura con dedup. */

let _active = false;
let _buf = "";
let _lastKeyTs = 0;
let _epcs = new Set();
let _onTag = null;
let _audioCtx = null;

export function normalizeEpc(s) { return String(s == null ? "" : s).trim().toUpperCase(); }
export function looksLikeEpc(s) { const e = normalizeEpc(s); return e.length >= 8 && /^[0-9A-Z]+$/.test(e); }

function beep() {
try {
if (!_audioCtx) return;
const o = _audioCtx.createOscillator();
const g = _audioCtx.createGain();
o.connect(g); g.connect(_audioCtx.destination);
o.frequency.value = 880; g.gain.value = 0.08;
o.start(); o.stop(_audioCtx.currentTime + 0.07);
}
catch (e) { }
}
function vibrate() { try { if (navigator.vibrate) navigator.vibrate(40); } catch (e) { } }

function isEditable(t) {
if (!t) return false;
const tag = (t.tagName || "").toUpperCase();
return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || t.isContentEditable === true;
}

function onKeyDown(e) {
if (isEditable(e.target)) return;
const now = Date.now();
if (now - _lastKeyTs > 1500) _buf = "";
_lastKeyTs = now;
if (e.key === "Enter") {
const epc = normalizeEpc(_buf);
_buf = "";
if (epc.length >= 8 && /^[0-9A-Z]+$/.test(epc)) {
e.preventDefault(); e.stopPropagation();
if (!_epcs.has(epc)) {
_epcs.add(epc);
beep(); vibrate();
if (_onTag) _onTag(epc, _epcs.size);
}
}
return;
}
if (e.key && e.key.length === 1 && /[0-9A-Za-z]/.test(e.key)) {
_buf += e.key;
if (_buf.length > 64) _buf = _buf.slice(-64);
}
}

export function startWedge(onTag) {
if (_active) return false;
_active = true; _buf = ""; _lastKeyTs = 0; _epcs = new Set(); _onTag = onTag || null;
try {
const AC = window.AudioContext || window.webkitAudioContext;
if (AC) {
if (!_audioCtx) _audioCtx = new AC();
if (_audioCtx.state === "suspended") _audioCtx.resume();
}
}
catch (e) { _audioCtx = null; }
try { if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); } catch (e) { }
window.addEventListener("keydown", onKeyDown, true);
return true;
}

export function stopWedge() {
if (!_active) return null;
_active = false; _onTag = null;
window.removeEventListener("keydown", onKeyDown, true);
const epcs = Array.from(_epcs);
_epcs = new Set(); _buf = "";
return { date: new Date().toISOString(), epcs: epcs };
}

export function isWedgeActive() { return _active; }

/* Tag-reparto: asset convenzionale con brand TAG-REPARTO e name = nome del reparto.
   Vive tra gli apparecchi (è un cespite fisico etichettato) e sincronizza gratis. */
export const WARD_TAG_BRAND = "TAG-REPARTO";
export function isWardTag(a) { return !!a && String(a.brand || "").trim().toUpperCase() === WARD_TAG_BRAND; }

/* — parser scansioni RFID da file/evento (spostato col taglio impostazioni, v3.06) — */
export function parseRfidScan(json) {
const out = [];
const norm = (e) => String(e == null ? "" : e).trim();
if (Array.isArray(json)) {
json.forEach(it => {
if (typeof it === "string") out.push({ epc: norm(it), location: "", date: "" });
else if (it && typeof it === "object") out.push({ epc: norm(it.epc || it.EPC || it.tag || it.tagId || ""), location: norm(it.location || it.reparto || it.dept || it.department || ""), date: norm(it.date || it.timestamp || it.time || it.seenAt || "") });
});
} else if (json && typeof json === "object" && Array.isArray(json.epcs)) {
const loc = norm(json.location || json.reparto || json.dept || "");
const dt = norm(json.date || json.timestamp || json.time || "");
json.epcs.forEach(e => {
if (typeof e === "string") out.push({ epc: norm(e), location: loc, date: dt });
else if (e && e.epc) out.push({ epc: norm(e.epc), location: norm(e.location || loc), date: norm(e.date || dt) });
});
}
return out.filter(r => r.epc);
}
