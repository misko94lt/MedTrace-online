/* MedTrace — apparecchi: form, dettaglio, import CSV/XLSX, timeline, ritiro, etichette QR (estratti da app.js, v3.00) */
import { AlertChip, ErrorSummary, Grid, Inp, Modal, Sel, Span2, Txt, Badge, _ic } from "./ui.js";
import { Btn, AttachmentsList } from "./shared.js";
import { FORM_BTN_GHOST, FORM_BTN_PRIMARY, STATUS_COLOR, PRI_COLOR, TIMELINE_ICON, TIMELINE_LABEL, FORM_FOOTER, FORM_INP, FORM_LBL, FORM_FLD } from "../constants/ui.js";
import { CND_CAT } from "../constants/cnd.js";
import { FUNC_TEMPLATES } from "../constants/funcTemplates.js";
import { OFFLINE_MODE, getSupabaseClient, getSupabaseConfig, DEMO_LOCKED } from "../lib/sync.js";
import { __awaiter } from "../lib/tslib.js";
import { withCreateMeta, withUpdateMeta, fmtDateTimeIt, customerPrefix, nextAssetCode, jobShortCode, jobTipoLabel, compressImage, isCloudPhoto, uploadPhotoToCloud, deleteCloudPhoto, assetHasOpenRecall, assetOpenRecall, impNorm } from "../lib/util.js";
const QRGen = (function () {
const EXP = new Array(256), LOG = new Array(256);
(function () { let x = 1; for (let i = 0; i < 255; i++) {
EXP[i] = x;
LOG[x] = i;
x <<= 1;
if (x & 0x100)
x ^= 0x11d;
} EXP[255] = EXP[0]; })();
function gmul(a, b) { if (a === 0 || b === 0)
return 0; return EXP[(LOG[a] + LOG[b]) % 255]; }
function genPoly(n) {
let poly = [1];
for (let i = 0; i < n; i++) {
const np = new Array(poly.length + 1).fill(0);
for (let j = 0; j < poly.length; j++) {
np[j] ^= poly[j];
np[j + 1] ^= gmul(poly[j], EXP[i]);
}
poly = np;
}
return poly;
}
function rsEncode(data, ecLen) {
const res = new Array(ecLen).fill(0);
const poly = genPoly(ecLen);
for (let i = 0; i < data.length; i++) {
const factor = data[i] ^ res[0];
res.shift();
res.push(0);
for (let j = 0; j < ecLen; j++)
res[j] ^= gmul(poly[j + 1] || 0, factor);
}
return res;
}
const VER = [
null,
{ size: 21, ec: 7, data: 19, blocks: [[1, 19]] },
{ size: 25, ec: 10, data: 34, blocks: [[1, 34]] },
{ size: 29, ec: 15, data: 55, blocks: [[1, 55]] },
{ size: 33, ec: 20, data: 80, blocks: [[1, 80]] },
{ size: 37, ec: 26, data: 108, blocks: [[1, 108]] },
{ size: 41, ec: 18, data: 136, blocks: [[2, 68]] },
{ size: 45, ec: 20, data: 156, blocks: [[2, 78]] },
{ size: 49, ec: 24, data: 194, blocks: [[2, 97]] },
{ size: 53, ec: 30, data: 232, blocks: [[2, 116]] },
{ size: 57, ec: 18, data: 274, blocks: [[2, 68], [2, 69]] },
];
function chooseVersion(len) {
for (let v = 1; v <= 6; v++) {
const cci = 8;
const cap = VER[v].data;
const needed = Math.ceil((4 + cci + len * 8) / 8);
if (needed <= cap)
return v;
}
return -1;
}
function encode(text) {
const bytes = [];
for (let i = 0; i < text.length; i++) {
const c = text.charCodeAt(i);
if (c < 128)
bytes.push(c);
else {
const enc = unescape(encodeURIComponent(text.charAt(i)));
for (let j = 0; j < enc.length; j++)
bytes.push(enc.charCodeAt(j));
}
}
const v = chooseVersion(bytes.length);
if (v < 0)
return null;
const info = VER[v];
const cci = v < 10 ? 8 : 16;
let bits = [];
const push = (val, n) => { for (let i = n - 1; i >= 0; i--)
bits.push((val >> i) & 1); };
push(0b0100, 4);
push(bytes.length, cci);
bytes.forEach(b => push(b, 8));
push(0, 4);
while (bits.length % 8 !== 0)
bits.push(0);
const dataBytes = [];
for (let i = 0; i < bits.length; i += 8) {
let b = 0;
for (let j = 0; j < 8; j++)
b = (b << 1) | bits[i + j];
dataBytes.push(b);
}
const pad = [0xEC, 0x11];
let pi = 0;
while (dataBytes.length < info.data) {
dataBytes.push(pad[pi % 2]);
pi++;
}
const blocks = [];
let idx = 0;
info.blocks.forEach(([count, dlen]) => {
for (let b = 0; b < count; b++) {
const d = dataBytes.slice(idx, idx + dlen);
idx += dlen;
blocks.push({ d, ec: rsEncode(d, info.ec) });
}
});
const finalBytes = [];
const maxD = Math.max(...blocks.map(b => b.d.length));
for (let i = 0; i < maxD; i++)
blocks.forEach(b => { if (i < b.d.length)
finalBytes.push(b.d[i]); });
for (let i = 0; i < info.ec; i++)
blocks.forEach(b => finalBytes.push(b.ec[i]));
const size = info.size;
const mat = Array.from({ length: size }, () => new Array(size).fill(null));
const set = (r, c, v) => { if (r >= 0 && r < size && c >= 0 && c < size)
mat[r][c] = v; };
function finder(r, c) {
for (let i = -1; i <= 7; i++)
for (let j = -1; j <= 7; j++) {
const rr = r + i, cc = c + j;
if (rr < 0 || rr >= size || cc < 0 || cc >= size)
continue;
const inSq = (i >= 0 && i <= 6 && (j === 0 || j === 6)) || (j >= 0 && j <= 6 && (i === 0 || i === 6)) || (i >= 2 && i <= 4 && j >= 2 && j <= 4);
mat[rr][cc] = inSq;
}
}
finder(0, 0);
finder(0, size - 7);
finder(size - 7, 0);
for (let i = 8; i < size - 8; i++) {
if (mat[6][i] === null)
mat[6][i] = (i % 2 === 0);
if (mat[i][6] === null)
mat[i][6] = (i % 2 === 0);
}
set(size - 8, 8, true);
const ALIGN = [[], [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]];
const aps = ALIGN[v] || [];
aps.forEach(r => aps.forEach(c => {
if ((r <= 8 && c <= 8) || (r <= 8 && c >= size - 9) || (r >= size - 9 && c <= 8))
return;
for (let i = -2; i <= 2; i++)
for (let j = -2; j <= 2; j++) {
const isDark = Math.max(Math.abs(i), Math.abs(j)) !== 1;
set(r + i, c + j, isDark);
}
}));
function reserveFormat() {
for (let i = 0; i < 9; i++) {
if (mat[8][i] === null)
mat[8][i] = 'R';
if (mat[i][8] === null)
mat[i][8] = 'R';
}
for (let i = 0; i < 8; i++) {
if (mat[8][size - 1 - i] === null)
mat[8][size - 1 - i] = 'R';
if (mat[size - 1 - i][8] === null)
mat[size - 1 - i][8] = 'R';
}
}
reserveFormat();
let dirUp = true, bitIdx = 0;
const allBits = [];
finalBytes.forEach(b => { for (let i = 7; i >= 0; i--)
allBits.push((b >> i) & 1); });
for (let col = size - 1; col > 0; col -= 2) {
if (col === 6)
col--;
for (let row = 0; row < size; row++) {
const r = dirUp ? size - 1 - row : row;
for (let cc = 0; cc < 2; cc++) {
const c = col - cc;
if (mat[r][c] === null) {
let bit = bitIdx < allBits.length ? allBits[bitIdx] : 0;
bitIdx++;
if ((r + c) % 2 === 0)
bit ^= 1;
mat[r][c] = !!bit;
}
}
}
dirUp = !dirUp;
}
const fmt = 0b01000;
let bch = fmt << 10;
const g = 0b10100110111;
for (let i = 14; i >= 10; i--) {
if ((bch >> i) & 1)
bch ^= g << (i - 10);
}
let format = ((fmt << 10) | bch) ^ 0b101010000010010;
const fbits = [];
for (let i = 14; i >= 0; i--)
fbits.push((format >> i) & 1);
const fmtPos1 = [[8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8], [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8]];
fmtPos1.forEach(([r, c], i) => mat[r][c] = !!fbits[i]);
const fmtPos2 = [[size - 1, 8], [size - 2, 8], [size - 3, 8], [size - 4, 8], [size - 5, 8], [size - 6, 8], [size - 7, 8], [8, size - 8], [8, size - 7], [8, size - 6], [8, size - 5], [8, size - 4], [8, size - 3], [8, size - 2], [8, size - 1]];
fmtPos2.forEach(([r, c], i) => mat[r][c] = !!fbits[i]);
for (let r = 0; r < size; r++)
for (let c = 0; c < size; c++) {
if (mat[r][c] === 'R' || mat[r][c] === null)
mat[r][c] = false;
}
return mat;
}
function toSVG(text, opts) {
opts = opts || {};
const mat = encode(text);
if (!mat)
return null;
const size = mat.length;
const margin = opts.margin != null ? opts.margin : 2;
const total = size + margin * 2;
const px = opts.scale || 4;
const fg = opts.color || "#000000";
const bg = opts.bg || "#ffffff";
let rects = "";
for (let r = 0; r < size; r++)
for (let c = 0; c < size; c++) {
if (mat[r][c])
rects += `<rect x="${(c + margin) * px}" y="${(r + margin) * px}" width="${px}" height="${px}"/>`;
}
return `<svg xmlns="http://www.w3.org/2000/svg" width="${total * px}" height="${total * px}" viewBox="0 0 ${total * px} ${total * px}"><rect width="100%" height="100%" fill="${bg}"/><g fill="${fg}">${rects}</g></svg>`;
}
return { toSVG, encode };
})();
export const ICON_ZAP = _ic(React.createElement("path", { d: "M13 2 3 14h9l-1 8 10-12h-9l1-8z" }));
export const ICON_ACTIVITY = _ic(React.createElement("path", { d: "M22 12h-4l-3 9-6-18-3 9H2" }));
const ICON_EDIT = _ic([React.createElement("path", { key: "a", d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }), React.createElement("path", { key: "b", d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })]);
const ICON_PLUS = _ic(React.createElement("path", { d: "M12 5v14M5 12h14" }));
const ICON_TAG = _ic([React.createElement("path", { key: "a", d: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" }), React.createElement("path", { key: "b", d: "M7 7h.01" })]);
const ICON_PIN = _ic([React.createElement("path", { key: "a", d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }), React.createElement("circle", { key: "b", cx: 12, cy: 10, r: 3 })]);
function impParseCSV(text) {
const firstLine = text.slice(0, text.indexOf("\n") >= 0 ? text.indexOf("\n") : text.length);
const counts = [[";", (firstLine.match(/;/g) || []).length], [",", (firstLine.match(/,/g) || []).length], ["\t", (firstLine.match(/\t/g) || []).length]];
counts.sort((a, b) => b[1] - a[1]);
const sep = counts[0][1] > 0 ? counts[0][0] : ";";
const rows = [];
let row = [], cell = "", inQ = false;
for (let i = 0; i < text.length; i++) {
const ch = text[i];
if (inQ) {
if (ch === '"') {
if (text[i + 1] === '"') {
cell += '"';
i++;
}
else
inQ = false;
}
else
cell += ch;
}
else if (ch === '"')
inQ = true;
else if (ch === sep) {
row.push(cell);
cell = "";
}
else if (ch === "\n" || ch === "\r") {
if (ch === "\r" && text[i + 1] === "\n")
i++;
row.push(cell);
cell = "";
if (row.some(c => String(c).trim() !== ""))
rows.push(row);
row = [];
}
else
cell += ch;
}
if (cell !== "" || row.length) {
row.push(cell);
if (row.some(c => String(c).trim() !== ""))
rows.push(row);
}
return rows;
}
function impToISO(v) {
if (v === null || v === undefined || v === "")
return "";
if (v instanceof Date && !isNaN(v))
return v.toISOString().slice(0, 10);
if (typeof v === "number" && v > 20000 && v < 80000) {
const d = new Date(Date.UTC(1899, 11, 30) + v * 86400000);
return d.toISOString().slice(0, 10);
}
const t = String(v).trim();
let m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
if (m)
return m[1] + "-" + m[2].padStart(2, "0") + "-" + m[3].padStart(2, "0");
m = t.match(/^(\d{1,2})[\/\.\-](\d{1,2})[\/\.\-](\d{2,4})$/);
if (m) {
let y = m[3];
if (y.length === 2)
y = (parseInt(y, 10) > 50 ? "19" : "20") + y;
return y + "-" + m[2].padStart(2, "0") + "-" + m[1].padStart(2, "0");
}
return "";
}
function impToNum(v, dec) {
if (v === null || v === undefined || v === "")
return "";
if (typeof v === "number")
return dec ? v : Math.round(v);
const t = String(v).replace(/[^0-9,.\-]/g, "").replace(",", ".");
const x = parseFloat(t);
if (isNaN(x))
return "";
return dec ? x : Math.round(x);
}
const IMP_FIELDS = [
{ k: "name", label: "Nome / Tipologia *", syn: ["nome", "tipologia", "nometipologia", "tipo", "tipoapparecchio", "descrizione", "descriz", "apparecchio", "denominazione", "device", "equipment"] },
{ k: "brand", label: "Marca", syn: ["marca", "produttore", "costruttore", "brand", "manufacturer", "casa", "ditta"] },
{ k: "model", label: "Modello", syn: ["modello", "model", "mod"] },
{ k: "serial", label: "Matricola (S/N)", syn: ["matricola", "sn", "serialnumber", "serial", "numerodiserie", "nserie", "numeroserie", "seriale"] },
{ k: "assetCode", label: "Codice inventario", syn: ["codiceinventario", "inventario", "codinventario", "codice", "ninventario", "assetcode", "inv", "cespite"] },
{ k: "location", label: "Ubicazione / Reparto", syn: ["ubicazione", "reparto", "ubicazionereparto", "locale", "stanza", "sede", "collocazione", "piano", "location"] },
{ k: "status", label: "Stato", syn: ["stato", "status", "condizione"] },
{ k: "lastService", label: "Ultimo intervento", type: "date", syn: ["ultimointervento", "ultimamanutenzione", "ultimoservizio", "lastservice"] },
{ k: "nextService", label: "Prossimo intervento", type: "date", syn: ["prossimointervento", "prossimamanutenzione", "nextservice", "scadenzamanutenzione"] },
{ k: "serviceInterval", label: "Periodicità manutenzione (mesi)", type: "int", syn: ["periodicitamanutenzione", "intervallomanutenzione", "frequenzamanutenzione", "mesimanutenzione"] },
{ k: "intervalIec", label: "Periodicità verifica elettrica (mesi)", type: "int", syn: ["periodicitaverificaelettrica", "periodicitaelettrica", "intervalloelettrica", "frequenzaelettrica", "mesielettrica", "verificaelettricamesi"] },
{ k: "intervalFunc", label: "Periodicità verifica funzionale (mesi)", type: "int", syn: ["periodicitaverificafunzionale", "periodicitafunzionale", "intervallofunzionale", "frequenzafunzionale", "mesifunzionale"] },
{ k: "iecNorm", label: "Norma sicurezza", syn: ["normasicurezza", "norma", "normativa", "standard"] },
{ k: "iecClass", label: "Classe elettrica", syn: ["classeelettrica", "classeisolamento", "classe"] },
{ k: "patientType", label: "Tipo parte applicata", syn: ["tipoparteapplicata", "parteapplicata", "tipopaziente", "bf", "tipoparte"] },
{ k: "riskClass", label: "Classe di rischio", syn: ["classedirischio", "classerischio", "rischio", "mdr"] },
{ k: "leakageMethod", label: "Metodo dispersione", syn: ["metododispersione", "dispersione", "metodomisura"] },
{ k: "purchaseDate", label: "Data acquisto", type: "date", syn: ["dataacquisto", "acquisto", "acquistato", "dtacquisto"] },
{ k: "manufactureDate", label: "Data di fabbricazione", type: "date", syn: ["datadifabbricazione", "datafabbricazione", "fabbricazione", "annofabbricazione", "anno"] },
{ k: "commissionDate", label: "Data messa in servizio", type: "date", syn: ["datamessainservizio", "messainservizio", "collaudo", "installazione", "datainstallazione"] },
{ k: "warrantyExpiry", label: "Scadenza garanzia", type: "date", syn: ["scadenzagaranzia", "garanzia", "finegaranzia"] },
{ k: "purchaseCost", label: "Costo d'acquisto (€)", type: "num", syn: ["costodacquisto", "costoacquisto", "costo", "prezzo", "valore", "importo"] },
{ k: "supplier", label: "Fornitore", syn: ["fornitore", "venditore", "rivenditore", "supplier", "distributore"] },
{ k: "serviceContract", label: "Contratto assistenza", syn: ["contrattoassistenza", "contratto", "manutentore", "assistenza"] },
{ k: "replacementDate", label: "Sostituzione prevista / fine vita", type: "date", syn: ["sostituzioneprevista", "finevita", "datasostituzione", "obsolescenza"] },
{ k: "batteryDate", label: "Ultimo cambio batteria", type: "date", syn: ["ultimocambiobatteria", "cambiobatteria", "batteria", "databatteria"] },
{ k: "notes", label: "Note", syn: ["note", "osservazioni", "commenti", "annotazioni", "notes"] }
];
function impEnum(field, raw) {
const v = impNorm(raw);
if (!v)
return "";
if (field === "status") {
if (["operativo", "attivo", "ok", "funzionante", "inuso", "inservizio", "attiva"].indexOf(v) >= 0)
return "operativo";
if (["inmanutenzione", "manutenzione", "inriparazione", "riparazione"].indexOf(v) >= 0)
return "in manutenzione";
if (["fuoriservizio", "guasto", "nonfunzionante", "ko", "rotto", "fermo"].indexOf(v) >= 0)
return "fuori servizio";
if (["dismesso", "dismissione", "rottamato", "alienato", "fuoriuso"].indexOf(v) >= 0)
return "dismesso";
return "operativo";
}
if (field === "iecNorm") {
if (v.indexOf("62353") >= 0 || v.indexOf("elettromedic") >= 0)
return "62353";
if (v.indexOf("61010") >= 0 || v.indexOf("laborator") >= 0)
return "61010";
return "";
}
if (field === "iecClass") {
if (v === "1" || v === "i" || v === "cli" || v === "classei" || v === "classe1")
return "I";
if (v === "2" || v === "ii" || v === "clii" || v === "classeii" || v === "classe2")
return "II";
return String(raw).trim();
}
if (field === "patientType") {
if (v === "cf")
return "CF";
if (v === "bf")
return "BF";
if (v === "b")
return "B";
return String(raw).trim().toUpperCase();
}
if (field === "riskClass") {
if (["a", "classea", "i", "classei", "1"].indexOf(v) >= 0)
return "A";
if (["b", "classeb", "iia", "classeiia", "2a"].indexOf(v) >= 0)
return "B";
if (["c", "classec", "iib", "classeiib", "2b"].indexOf(v) >= 0)
return "C";
if (["d", "classed", "iii", "classeiii", "3"].indexOf(v) >= 0)
return "D";
return "";
}
if (field === "leakageMethod") {
if (v.indexOf("dirett") >= 0)
return "diretto";
if (v.indexOf("alternativ") >= 0)
return "alternativo";
if (v.indexOf("different") >= 0 || v.indexOf("differenz") >= 0)
return "differenziale";
return "";
}
return String(raw).trim();
}
function impEnsureXLSX(cb) {
if (typeof window.XLSX !== "undefined") {
cb(true);
return;
}
const already = document.getElementById("medtrace-sheetjs");
const done = ok => { try {
cb(ok && typeof window.XLSX !== "undefined");
}
catch (e) { } };
if (already) {
let tries = 0;
const t = setInterval(() => { tries++; if (typeof window.XLSX !== "undefined" || tries > 40) {
clearInterval(t);
done(true);
} }, 250);
return;
}
const sc = document.createElement("script");
sc.id = "medtrace-sheetjs";
sc.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
sc.onload = () => done(true);
sc.onerror = () => done(false);
document.head.appendChild(sc);
setTimeout(() => { if (typeof window.XLSX === "undefined")
done(false); }, 12000);
}
export function ImportAssetsModal({ customers, assets, onImport, onClose }) {
const [step, setStep] = React.useState(1);
const [customerId, setCustomerId] = React.useState("");
const [headers, setHeaders] = React.useState([]);
const [rows, setRows] = React.useState([]);
const [mapping, setMapping] = React.useState({});
const [dupMode, setDupMode] = React.useState("skip");
const [fileErr, setFileErr] = React.useState("");
const [fileName, setFileName] = React.useState("");
const [result, setResult] = React.useState(null);
const gotData = (allRows) => {
const hIdx = allRows.findIndex(r => r.some(c => String(c).trim() !== ""));
if (hIdx < 0) {
setFileErr("Il file sembra vuoto.");
return;
}
const hs = allRows[hIdx].map(c => String(c).trim());
const dataRows = allRows.slice(hIdx + 1).filter(r => r.some(c => String(c).trim() !== ""));
const map = {};
IMP_FIELDS.forEach(f => {
const idx = hs.findIndex(h => { const nh = impNorm(h); return nh && f.syn.some(sy => nh === sy || nh.indexOf(sy) === 0); });
map[f.k] = idx;
});
setHeaders(hs);
setRows(dataRows);
setMapping(map);
setFileErr("");
setStep(2);
};
const handleFile = (e) => {
const file = e.target.files && e.target.files[0];
if (!file)
return;
setFileName(file.name);
const isCsv = /\.(csv|txt)$/i.test(file.name);
if (isCsv) {
const fr = new FileReader();
fr.onload = () => gotData(impParseCSV(String(fr.result || "")));
fr.onerror = () => setFileErr("Non riesco a leggere il file.");
fr.readAsText(file, "utf-8");
}
else {
setFileErr("Un attimo, preparo il lettore Excel…");
impEnsureXLSX(ok => {
if (!ok) {
setFileErr("Non riesco a caricare il lettore Excel (serve internet la prima volta). In alternativa: in Excel fai \"Salva con nome → CSV\" e carica quello.");
return;
}
const fr = new FileReader();
fr.onload = () => {
try {
const wb = window.XLSX.read(fr.result, { type: "array", cellDates: true });
const ws = wb.Sheets[wb.SheetNames[0]];
setFileErr("");
gotData(window.XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: "" }));
}
catch (err) {
setFileErr("File Excel non leggibile: " + (err && err.message ? err.message : "formato sconosciuto"));
}
};
fr.onerror = () => setFileErr("Non riesco a leggere il file.");
fr.readAsArrayBuffer(file);
});
}
e.target.value = "";
};
const tplRows = () => [IMP_FIELDS.map(f => f.label)];
const scaricaTemplate = () => {
setFileErr("");
impEnsureXLSX(ok => {
if (!ok) {
setFileErr("Per scaricare il modello Excel serve internet la prima volta. In alternativa usa il link CSV qui sotto (da aprire sul computer).");
return;
}
const hs = tplRows()[0];
const ws = window.XLSX.utils.aoa_to_sheet([hs]);
ws["!cols"] = hs.map(h => ({ wch: Math.max(14, h.length + 2) }));
const wb = window.XLSX.utils.book_new();
window.XLSX.utils.book_append_sheet(wb, ws, "Apparecchi");
window.XLSX.writeFile(wb, "MedTrace-modello-apparecchi.xlsx");
});
};
const scaricaTemplateCSV = () => {
const csv = "\ufeff" + tplRows().map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(";")).join("\r\n");
const a = document.createElement("a");
a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
a.download = "MedTrace-modello-apparecchi.csv";
a.click();
setTimeout(() => URL.revokeObjectURL(a.href), 5000);
};
const doImport = () => {
const cust = customers.find(c => c.id === customerId);
if (!cust) {
setFileErr("Scegli prima il cliente a cui assegnare gli apparecchi.");
return;
}
const errors = [];
const finals = [];
let created = 0, updated = 0, skipped = 0;
const mine = assets.filter(a => a.customerId === customerId);
const bySerial = {};
const byCode = {};
mine.forEach(a => { if (a.serial)
bySerial[impNorm(a.serial)] = a; if (a.assetCode)
byCode[impNorm(a.assetCode)] = a; });
const prefix = customerPrefix(cust.name);
let pool = assets.slice();
rows.forEach((r, i) => {
const rec = {};
IMP_FIELDS.forEach(f => {
const idx = mapping[f.k];
if (idx === undefined || idx < 0)
return;
const raw = r[idx];
if (f.type === "date")
rec[f.k] = impToISO(raw);
else if (f.type === "int") {
const x = impToNum(raw, false);
if (x !== "")
rec[f.k] = x;
}
else if (f.type === "num") {
const x = impToNum(raw, true);
if (x !== "")
rec[f.k] = x;
}
else if (["status", "iecNorm", "iecClass", "patientType", "riskClass", "leakageMethod"].indexOf(f.k) >= 0)
rec[f.k] = impEnum(f.k, raw);
else
rec[f.k] = String(raw === null || raw === undefined ? "" : raw).trim();
});
if (!rec.name) {
if (Object.keys(rec).some(k => rec[k] !== ""))
errors.push("Riga " + (i + 2) + ": manca il Nome/Tipologia — saltata");
return;
}
const exist = (rec.serial && bySerial[impNorm(rec.serial)]) || (rec.assetCode && byCode[impNorm(rec.assetCode)]) || null;
if (exist) {
if (dupMode === "skip") {
skipped++;
return;
}
const merged = Object.assign({}, exist);
Object.keys(rec).forEach(k => { if (rec[k] !== "" && rec[k] !== undefined)
merged[k] = rec[k]; });
finals.push(withUpdateMeta(merged));
updated++;
}
else {
const nuovo = withCreateMeta(Object.assign(Object.assign({ status: "operativo", serviceInterval: 6, intervalIec: 12, intervalFunc: 12, intervalPpm: 12 }, rec), { customerId }));
if (!nuovo.assetCode) {
nuovo.assetCode = nextAssetCode(prefix, pool);
}
pool = pool.concat([nuovo]);
if (nuovo.serial)
bySerial[impNorm(nuovo.serial)] = nuovo;
if (nuovo.assetCode)
byCode[impNorm(nuovo.assetCode)] = nuovo;
finals.push(nuovo);
created++;
}
});
if (finals.length === 0 && errors.length === 0 && skipped === 0) {
setFileErr("Nessuna riga importabile trovata.");
return;
}
if (finals.length > 0) {
const ok = onImport(finals);
if (!ok)
return;
}
setResult({ created, updated, skipped, errors });
setStep(3);
};
const mapped = IMP_FIELDS.filter(f => mapping[f.k] >= 0).length;
const selStyle = { width: "100%", background: "var(--bg-2)", color: "var(--text)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "8px 10px", fontSize: 13 };
const lab = { fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 };
if (step === 3 && result)
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color: "#22c55e" } }, "\u2713 Importazione completata"),
React.createElement("div", { style: { fontSize: 14, color: "var(--text-strong)", lineHeight: 1.7 } },
"Creati: ",
React.createElement("b", null, result.created),
" \u00B7 Aggiornati: ",
React.createElement("b", null, result.updated),
" \u00B7 Doppioni saltati: ",
React.createElement("b", null, result.skipped)),
result.errors.length > 0 && React.createElement("div", { style: { fontSize: 12, color: "#f59e0b", lineHeight: 1.6 } },
result.errors.slice(0, 10).map((e, i) => React.createElement("div", { key: i },
"\u26A0 ",
e)),
result.errors.length > 10 && React.createElement("div", null,
"\u2026e altre ",
result.errors.length - 10)),
React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)" } }, "Ricorda di Sincronizzare per portare tutto sul cloud."),
React.createElement(Btn, { onClick: onClose }, "Chiudi")));
if (step === 2)
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement("div", { style: { fontSize: 13, color: "var(--text-2)" } },
fileName,
" \u2014 ",
React.createElement("b", null, rows.length),
" righe \u00B7 ",
React.createElement("b", null, mapped),
" colonne riconosciute in automatico. Controlla gli abbinamenti:"),
React.createElement("div", null,
React.createElement("div", { style: lab }, "Cliente di destinazione *"),
React.createElement("select", { style: selStyle, value: customerId, onChange: e => setCustomerId(e.target.value) },
React.createElement("option", { value: "" }, "\u2014 Scegli il cliente \u2014"),
customers.map(c => React.createElement("option", { key: c.id, value: c.id }, c.name)))),
React.createElement("div", { style: { maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingRight: 4 } }, IMP_FIELDS.map(f => (React.createElement("div", { key: f.k, style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, alignItems: "center" } },
React.createElement("div", { style: { fontSize: 13, color: mapping[f.k] >= 0 ? "var(--text)" : "var(--text-4)" } }, f.label),
React.createElement("select", { style: selStyle, value: mapping[f.k] >= 0 ? mapping[f.k] : -1, onChange: e => setMapping(m => (Object.assign(Object.assign({}, m), { [f.k]: parseInt(e.target.value, 10) }))) },
React.createElement("option", { value: -1 }, "\u2014 non presente \u2014"),
headers.map((h, i) => React.createElement("option", { key: i, value: i }, h || ("colonna " + (i + 1))))))))),
React.createElement("div", null,
React.createElement("div", { style: lab }, "Se trovo una matricola o un codice gi\u00E0 in archivio"),
React.createElement("select", { style: selStyle, value: dupMode, onChange: e => setDupMode(e.target.value) },
React.createElement("option", { value: "skip" }, "Salta la riga (non tocco l'esistente)"),
React.createElement("option", { value: "update" }, "Aggiorna l'apparecchio esistente coi dati del file"))),
fileErr && React.createElement("div", { style: { fontSize: 13, color: "#ef4444" } }, fileErr),
React.createElement("div", { style: { display: "flex", gap: 10 } },
React.createElement(Btn, { variant: "ghost", onClick: () => { setStep(1); setFileErr(""); } }, "\u2190 Indietro"),
React.createElement(Btn, { onClick: doImport },
"Importa ",
rows.length,
" righe"))));
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } },
React.createElement("div", { style: { fontSize: 14, color: "var(--text-strong)", lineHeight: 1.6 } },
"Carica l'anagrafica degli apparecchi da un file ",
React.createElement("b", null, "Excel (.xlsx)"),
" o ",
React.createElement("b", null, "CSV"),
" \u2014 ad esempio l'export del gestionale precedente o l'inventario del cliente. Le colonne le abbino io, tu controlli e confermi."),
React.createElement("label", { style: { display: "block", border: "2px dashed #1e293b", borderRadius: 12, padding: "28px 16px", textAlign: "center", cursor: "pointer", color: "var(--text-2)", fontSize: 14 } },
"Tocca per scegliere il file",
React.createElement("input", { type: "file", accept: ".xlsx,.xls,.csv,.txt", style: { display: "none" }, onChange: handleFile })),
fileErr && React.createElement("div", { style: { fontSize: 13, color: "#ef4444", lineHeight: 1.5 } }, fileErr),
React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)", lineHeight: 1.6 } },
"Parti da zero? ",
React.createElement("a", { href: "#", onClick: e => { e.preventDefault(); scaricaTemplate(); }, style: { color: "#2dd4bf" } }, "Scarica il modello Excel"),
" con tutte le 27 colonne gi\u00E0 intestate \u2014 compili solo quelle che ti servono (obbligatorio solo il Nome). ",
React.createElement("span", { style: { opacity: .7 } },
"(",
React.createElement("a", { href: "#", onClick: e => { e.preventDefault(); scaricaTemplateCSV(); }, style: { color: "var(--text-2)" } }, "versione CSV per computer"),
")"))));
}
export function AssetForm({ initial, customers, assets = [], onSave, onClose }) {
const blank = { name: "", brand: "", model: "", serial: "", location: "", customerId: "", status: "operativo", lastService: "", nextService: "", serviceInterval: 6, intervalIec: 12, intervalFunc: 12, intervalPpm: 12, civab: "", cnd: "", emdn: "", notes: "" };
const [f, setF] = React.useState(() => {
if (!initial)
return blank;
const merged = Object.assign(Object.assign({}, blank), initial);
if (initial.intervalIec === undefined)
merged.intervalIec = initial.serviceInterval || 12;
if (initial.intervalFunc === undefined)
merged.intervalFunc = initial.serviceInterval || 12;
if (initial.intervalPpm === undefined)
merged.intervalPpm = 12;
return merged;
});
const [errors, setErrors] = React.useState({});
const [showAdv, setShowAdv] = React.useState(!!initial);
const [cndQuery, setCndQuery] = React.useState("");
const cndMatches = cndQuery.trim().length >= 2 ? CND_CAT.filter(r => (r[1] + " " + r[0] + " " + r[2]).toLowerCase().includes(cndQuery.trim().toLowerCase())).slice(0, 40) : [];
const s = k => e => setF(x => (Object.assign(Object.assign({}, x), { [k]: e.target.value })));
const uniq = (key) => Array.from(new Set((assets || []).map(a => a[key]).filter(v => v && v.trim()))).sort();
const nameOptions = uniq("name");
const brandOptions = uniq("brand");
const modelOptions = uniq("model");
const autofillFrom = (field, val) => {
const v = (val || "").trim().toLowerCase();
if (!v)
return;
const match = (assets || []).find(a => field === "model"
? (a.model || "").trim().toLowerCase() === v
: (a.name || "").trim().toLowerCase() === v);
if (!match)
return;
setF(x => {
const copy = Object.assign({}, x);
const inherit = ["name", "brand", "model", "serviceInterval", "intervalIec", "intervalFunc", "intervalPpm", "iecNorm", "iecClass", "patientType", "riskClass", "leakageMethod", "civab", "cnd", "emdn"];
let filledAdvanced = false;
const advFields = ["iecNorm", "iecClass", "patientType", "riskClass", "leakageMethod"];
inherit.forEach(k => {
const cur = copy[k];
const isEmpty = cur === "" || cur === undefined || cur === null || (k === "serviceInterval" && (cur === 6));
if (isEmpty && match[k] !== undefined && match[k] !== "" && match[k] !== null) {
copy[k] = match[k];
if (advFields.includes(k))
filledAdvanced = true;
}
});
if (filledAdvanced)
setShowAdv(true);
return copy;
});
};
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement(ErrorSummary, { errors: errors }),
React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement(Inp, { label: "Tipo apparecchio", value: f.name, onChange: s("name"), onBlur: e => autofillFrom("name", e.target.value), placeholder: "es. Defibrillatore" }),
React.createElement(Inp, { label: "Marca", value: f.brand, onChange: s("brand") }),
React.createElement(Inp, { label: "Modello", value: f.model, onChange: s("model"), onBlur: e => autofillFrom("model", e.target.value), hint: "Scrivi un modello gi\u00E0 inserito: marca, tipo e norma si compilano da soli." }),
React.createElement(Inp, { label: "Numero di serie", value: f.serial, onChange: s("serial") }),
React.createElement(Sel, { label: "Cliente / Struttura", value: f.customerId, onChange: s("customerId") },
React.createElement("option", { value: "" }, "\u2014 Nessuno \u2014"),
customers.map(c => React.createElement("option", { key: c.id, value: c.id }, c.name))),
React.createElement(Inp, { label: "Ubicazione", value: f.location, onChange: s("location") }),
React.createElement(Sel, { label: "Stato", value: f.status, onChange: s("status") }, ["operativo", "in manutenzione", "fuori servizio"].map(v => React.createElement("option", { key: v }, v))),
React.createElement(Inp, { label: "Interv. Sicurezza Elettrica (mesi)", type: "number", value: f.intervalIec, onChange: s("intervalIec") }),
React.createElement(Inp, { label: "Interv. Funzionale (mesi)", type: "number", value: f.intervalFunc, onChange: s("intervalFunc") }),
React.createElement(Inp, { label: "Interv. Manut. Programmata / PPM (mesi)", type: "number", value: f.intervalPpm, onChange: s("intervalPpm"), hint: "Periodicità indicata dal costruttore" })),
React.createElement("button", { onClick: () => setShowAdv(v => !v), style: { background: "transparent", border: "1px dashed var(--border)", borderRadius: 8, color: "var(--text-2)", padding: "9px", cursor: "pointer", fontSize: 13, fontWeight: 700 } }, showAdv ? "− Nascondi dettagli avanzati" : "+ Mostra dettagli avanzati (date, norma, garanzia…)"),
showAdv && React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement(Inp, { label: "Ultimo servizio", type: "date", value: f.lastService, onChange: s("lastService") }),
React.createElement(Inp, { label: "Prossimo servizio", type: "date", value: f.nextService, onChange: s("nextService") }),
React.createElement(Inp, { label: "EPC / Tag RFID", value: f.epc || "", onChange: s("epc"), hint: "Codice del tag RFID per il tracking inventario" }),
React.createElement(Sel, { label: "Norma sicurezza", hint: "IEC 62353: apparecchiature elettromedicali (defibrillatori, monitor, ventilatori). IEC 61010-1: strumenti da laboratorio e misura (oscilloscopi, alimentatori, sonde). Definisce i limiti delle dispersioni e i test da effettuare.", value: f.iecNorm || "62353", onChange: e => setF(x => (Object.assign(Object.assign({}, x), { iecNorm: e.target.value }))) },
React.createElement("option", { value: "62353" }, "IEC 62353 \u2014 Elettromedicale"),
React.createElement("option", { value: "61010" }, "IEC 61010-1 \u2014 Laboratorio"),
React.createElement("option", { value: "" }, "Non applicabile")),
React.createElement(Sel, { label: "Classe elettrica (IEC)", hint: "Classificazione elettrica del singolo apparecchio (da targa/manuale): Classe I = con conduttore di terra; Classe II = doppio isolamento; Classe III / alimentazione interna = SELV o a batteria. Viene ereditata nella verifica di sicurezza elettrica.", value: f.iecClass || "", onChange: s("iecClass") },
React.createElement("option", { value: "" }, "- da definire"),
React.createElement("option", { value: "I" }, "Classe I - con terra"),
React.createElement("option", { value: "II" }, "Classe II - doppio isolamento"),
React.createElement("option", { value: "III" }, "Classe III / alim. interna")),
React.createElement(Sel, { label: "Tipo parti applicate", hint: "Parte applicata al paziente: B = nessuna o non conduttiva; BF = isolata flottante; CF = isolata per contatto cardiaco diretto. Determina i limiti di dispersione nella verifica IEC.", value: f.patientType || "", onChange: s("patientType") },
React.createElement("option", { value: "" }, "- / nessuna"),
React.createElement("option", { value: "B" }, "B"),
React.createElement("option", { value: "BF" }, "BF"),
React.createElement("option", { value: "CF" }, "CF")),
React.createElement(Sel, { label: "Installazione", hint: "Apparecchio fisso / installato permanentemente (es. radiologico a muro, riunito cablato): la verifica IEC 62353 adatta le misure (terra sul nodo equipotenziale, dispersione d'involucro al posto dell'equipment leakage).", value: f.fixedInstall ? "si" : "", onChange: e => setF(x => (Object.assign(Object.assign({}, x), { fixedInstall: e.target.value === "si" }))) },
React.createElement("option", { value: "" }, "Mobile / collegabile"),
React.createElement("option", { value: "si" }, "Fisso / installato permanentemente")),
React.createElement(Sel, { label: "Classe di rischio", hint: "Classificazione MDR (Reg. UE 2017/745): A = basso rischio (es. termometri non invasivi), B = medio (monitor, pompe), C = alto (defibrillatori, ventilatori vita-critici), D = altissimo (impiantabili). Determina la frequenza delle verifiche e la severit\u00E0.", value: f.riskClass || "", onChange: s("riskClass") },
React.createElement("option", { value: "" }, "\u2014"),
React.createElement("option", { value: "A" }, "Classe A \u2014 Basso rischio"),
React.createElement("option", { value: "B" }, "Classe B \u2014 Medio rischio"),
React.createElement("option", { value: "C" }, "Classe C \u2014 Alto rischio")), React.createElement(Span2, null, React.createElement("div", { style: { position: "relative" } }, React.createElement(Inp, { label: "Catalogo CND \u2014 cerca tipo apparecchiatura", value: cndQuery, onChange: e => setCndQuery(e.target.value), placeholder: "es. defibrillatore, ventilatore polmonare, elettrobisturi\u2026", hint: "Classificazione ufficiale Ministero Salute \u2014 compila CND + CIVAB + EMDN in automatico" }), cndMatches.length > 0 && React.createElement("div", { style: { position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, marginTop: 4, maxHeight: 300, overflowY: "auto", boxShadow: "0 8px 24px rgba(0,0,0,.35)" } }, cndMatches.map(m => React.createElement("div", { key: m[0], onClick: () => { setF(x => (Object.assign(Object.assign({}, x), { cnd: m[0], emdn: m[0], civab: m[2] || x.civab }))); setCndQuery(""); }, onMouseEnter: e => e.currentTarget.style.background = "var(--surface-3)", onMouseLeave: e => e.currentTarget.style.background = "transparent", style: { padding: "8px 11px", cursor: "pointer", borderBottom: "1px solid var(--border-2)", transition: "background .1s" } }, React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 2 } }, React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#2dd4bf", fontWeight: 700 } }, m[0]), m[2] ? React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "var(--text-3)" } }, "CIVAB " + m[2]) : null), React.createElement("div", { style: { fontSize: 12, color: "var(--text)", lineHeight: 1.3 } }, m[1])))))),  React.createElement(Inp, { label: "Codice CIVAB", hint: "Classificazione CIVAB \u2014 tipologia apparecchiatura biomedica", value: f.civab || "", onChange: s("civab") }), React.createElement(Inp, { label: "Codice CND", hint: "Classificazione Nazionale Dispositivi (Min. Salute) \u2014 es. Z120307", value: f.cnd || "", onChange: s("cnd") }), React.createElement(Inp, { label: "Codice EMDN", hint: "European Medical Device Nomenclature (EUDAMED / MDR)", value: f.emdn || "", onChange: s("emdn") }),
React.createElement(Inp, { label: "Data acquisto", type: "date", value: f.purchaseDate || "", onChange: s("purchaseDate") }),
React.createElement(Inp, { label: "Scadenza garanzia", type: "date", value: f.warrantyExpiry || "", onChange: s("warrantyExpiry") }),
React.createElement(Span2, null,
React.createElement(Inp, { label: "Contratto assistenza / Fornitore servizio", value: f.serviceContract || "", onChange: s("serviceContract") })),
React.createElement(Inp, { label: "Data di fabbricazione", type: "date", value: f.manufactureDate || "", onChange: s("manufactureDate") }),
React.createElement(Inp, { label: "Data di messa in servizio", type: "date", value: f.commissionDate || "", onChange: s("commissionDate") }),
React.createElement(Inp, { label: "Costo d'acquisto (\u20AC)", type: "number", step: "0.01", value: f.purchaseCost || "", onChange: s("purchaseCost") }),
React.createElement(Inp, { label: "Fornitore (chi l'ha venduto)", value: f.supplier || "", onChange: s("supplier") }),
React.createElement(Inp, { label: "Data sostituzione prevista / fine vita", type: "date", value: f.replacementDate || "", onChange: s("replacementDate") }),
React.createElement(Inp, { label: "Data ultimo cambio batteria", type: "date", value: f.batteryDate || "", onChange: s("batteryDate") }),
React.createElement(Span2, null,
React.createElement("div", { onClick: () => setF(x => (Object.assign(Object.assign({}, x), { batteryChanged: !x.batteryChanged }))), style: { display: "flex", alignItems: "center", gap: 12, cursor: "pointer", padding: "4px 0" } },
React.createElement("div", { style: { width: 46, height: 27, borderRadius: 14, flexShrink: 0, background: f.batteryChanged ? "#2dd4bf" : "#3a4151", position: "relative", transition: "background .15s" } },
React.createElement("div", { style: { position: "absolute", top: 3, left: f.batteryChanged ? 22 : 3, width: 21, height: 21, borderRadius: "50%", background: "#fff", transition: "left .15s", boxShadow: "0 1px 3px rgba(0,0,0,.4)" } })),
React.createElement("span", { style: { fontSize: 13, color: "var(--text)" } }, "Batteria sostituita"))),
React.createElement(Span2, null,
React.createElement(Txt, { label: "Note", value: f.notes, onChange: s("notes") }))),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Annulla"),
React.createElement(Btn, { onClick: () => {
var _a;
const errs = {};
if (!((_a = f.name) === null || _a === void 0 ? void 0 : _a.trim()))
errs.name = "Il nome dell'apparecchio è obbligatorio";
setErrors(errs);
if (Object.keys(errs).length > 0)
return;
onSave(Object.assign(Object.assign({}, f), { serviceInterval: +f.serviceInterval, intervalIec: +f.intervalIec || 12, intervalFunc: +f.intervalFunc || 12, intervalPpm: +f.intervalPpm || 12 }));
} }, "Salva"))));
}
export function TimelineModal({ job, parts, onSave, onClose }) {
const [steps, setSteps] = React.useState(job.timeline || []);
const [photos, setPhotos] = React.useState(job.photos || []);
const [newStep, setNewStep] = React.useState({ date: new Date().toISOString().slice(0, 10), type: "intervento", note: "", hours: 0 });
const [uploading, setUploading] = React.useState(false);
const fileInputRef = React.useRef();
const addStep = () => {
if (!newStep.note.trim()) {
return;
}
setSteps(s => [...s, Object.assign(Object.assign({}, newStep), { id: Date.now() + "-" + Math.random().toString(36).slice(2, 7), hours: +newStep.hours })]);
setNewStep({ date: new Date().toISOString().slice(0, 10), type: newStep.type, note: "", hours: 0 });
};
const removeStep = id => setSteps(s => s.filter(x => x.id !== id));
const uploadPhotos = (e) => __awaiter(this, void 0, void 0, function* () {
const files = Array.from(e.target.files || []);
if (!files.length)
return;
setUploading(true);
try {
const newPhotos = [];
let soloLocale = 0;
for (const file of files) {
if (!file.type.startsWith("image/")) {
continue;
}
try {
const dataUrl = yield compressImage(file);
const cloudUrl = yield uploadPhotoToCloud(dataUrl);
if (!cloudUrl)
soloLocale++;
newPhotos.push({ id: Date.now() + Math.random(), name: file.name, data: (cloudUrl || dataUrl), date: new Date().toISOString().slice(0, 10) });
}
catch (err) {
console.error("Errore compressione", err);
}
}
setPhotos(p => [...p, ...newPhotos]);
const _off = (typeof OFFLINE_MODE !== "undefined" && OFFLINE_MODE);
if (soloLocale > 0 && !_off) {
window.dispatchEvent(new CustomEvent("toast", { detail: { msg: "Foto salvate in locale (cloud non raggiungibile): puoi spostarle dopo da Impostazioni → Spazio dati locale", color: "#f59e0b" } }));
}
}
finally {
setUploading(false);
if (fileInputRef.current)
fileInputRef.current.value = "";
}
});
const removePhoto = id => setPhotos(p => p.filter(x => x.id !== id));
const sortedSteps = [...steps].sort((a, b) => a.date.localeCompare(b.date));
return (React.createElement(Modal, { title: "Timeline & Foto — " + (job.id), wide: true, onClose: onClose },
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 18 } },
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 10 } }, "\u00B7 Cronologia Intervento"),
sortedSteps.length === 0 && React.createElement("div", { style: { textAlign: "center", color: "var(--text-4)", padding: "16px 0", fontSize: 12 } }, "Nessuno step ancora."),
sortedSteps.map((step, i) => (React.createElement("div", { key: step.id, style: { display: "flex", gap: 14, marginBottom: 14, position: "relative" } },
React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center" } },
React.createElement("div", { style: { width: 36, height: 36, borderRadius: "50%", background: "#2dd4bf22", border: "1px solid #2563eb44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 } }, TIMELINE_ICON[step.type] || "·"),
i < sortedSteps.length - 1 && React.createElement("div", { style: { width: 2, flex: 1, background: "var(--surface-4)", marginTop: 4 } })),
React.createElement("div", { style: { flex: 1, background: "var(--surface)", borderRadius: 8, padding: "10px 14px", border: "1px solid var(--border)" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, gap: 8, flexWrap: "wrap" } },
React.createElement("div", null,
React.createElement("span", { style: { color: "#5eead4", fontWeight: 700, fontSize: 13 } }, TIMELINE_LABEL[step.type] || step.type),
React.createElement("span", { style: { color: "var(--text-3)", fontSize: 11, marginLeft: 8 } }, step.date)),
React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center" } },
step.hours > 0 && React.createElement("span", { style: { color: "#a855f7", fontSize: 11, fontWeight: 700 } },
step.hours,
"h"),
React.createElement(Btn, { sm: true, variant: "danger", onClick: () => removeStep(step.id), style: { padding: "2px 8px", fontSize: 11 } }, "\u2715"))),
React.createElement("div", { style: { color: "var(--text)", fontSize: 13, lineHeight: 1.4 } }, step.note))))),
React.createElement("div", { style: { background: "var(--bg)", borderRadius: 10, padding: 14, border: "1px dashed var(--border)", marginTop: 12 } },
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginBottom: 10, fontWeight: 700 } }, "+ Nuovo step"),
React.createElement(Grid, { cols: "1fr 1fr 80px" },
React.createElement(Sel, { label: "Tipo evento", value: newStep.type, onChange: e => setNewStep(x => (Object.assign(Object.assign({}, x), { type: e.target.value }))) }, Object.entries(TIMELINE_LABEL).map(([k, v]) => React.createElement("option", { key: k, value: k },
TIMELINE_ICON[k],
" ",
v))),
React.createElement(Inp, { label: "Data", type: "date", value: newStep.date, onChange: e => setNewStep(x => (Object.assign(Object.assign({}, x), { date: e.target.value }))) }),
React.createElement(Inp, { label: "Ore", type: "number", step: "0.5", value: newStep.hours, onChange: e => setNewStep(x => (Object.assign(Object.assign({}, x), { hours: e.target.value }))) })),
React.createElement("div", { style: { marginTop: 10 } },
React.createElement(Txt, { label: "Descrizione", value: newStep.note, onChange: e => setNewStep(x => (Object.assign(Object.assign({}, x), { note: e.target.value }))) })),
React.createElement("div", { style: { marginTop: 10, textAlign: "right" } },
React.createElement(Btn, { sm: true, onClick: addStep }, "+ Aggiungi step")))),
React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } },
React.createElement("span", { style: { fontSize: 11, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } },
" Foto Allegate (",
photos.length,
")"),
React.createElement("label", null,
React.createElement("input", { ref: fileInputRef, type: "file", accept: "image/*", multiple: true, onChange: uploadPhotos, style: { display: "none" } }),
React.createElement("span", { style: { background: "var(--surface-2)", color: "var(--text-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "inline-block" } }, uploading ? "Caricamento..." : "+ Aggiungi foto"))),
photos.length === 0 ? (React.createElement("div", { style: { textAlign: "center", color: "var(--text-4)", padding: "16px 0", fontSize: 12 } }, "Nessuna foto. Le foto vengono compresse e, quando sei online, caricate sul cloud: non occupano spazio sul dispositivo.")) : (React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8 } }, photos.map(photo => (React.createElement("div", { key: photo.id, style: { position: "relative", aspectRatio: "1", borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)" } },
React.createElement("img", { src: photo.data, alt: photo.name, style: { width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }, onClick: () => window.open(photo.data, "_blank") }),
React.createElement("button", { onClick: () => removePhoto(photo.id), style: { position: "absolute", top: 4, right: 4, background: "#ef4444", border: "none", color: "#fff", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", fontSize: 14, fontWeight: 700 } }, "\u00D7"))))))),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Annulla"),
React.createElement(Btn, { variant: "success", onClick: () => { try {
const keep = {};
photos.forEach(p => { keep[p.id] = 1; });
(job.photos || []).forEach(p => { if (p && !keep[p.id] && isCloudPhoto(p.data))
deleteCloudPhoto(p.data); });
}
catch (e) { } onSave({ timeline: steps, photos }); } }, "\u2713 Salva tutto")))));
}
export function WithdrawalModal({ parts, assets, preselectPartId, onWithdraw, onClose }) {
var _a, _b;
const [items, setItems] = React.useState([{ partId: preselectPartId || ((_a = parts[0]) === null || _a === void 0 ? void 0 : _a.id) || "", qty: 1 }]);
const [errors, setErrors] = React.useState({});
const [reason, setReason] = React.useState("");
const [assetId, setAssetId] = React.useState(((_b = assets[0]) === null || _b === void 0 ? void 0 : _b.id) || "");
const [tech, setTech] = React.useState("");
const addRow = () => setItems(i => { var _a; return [...i, { partId: ((_a = parts[0]) === null || _a === void 0 ? void 0 : _a.id) || "", qty: 1 }]; });
const remRow = i => setItems(a => a.filter((_, idx) => idx !== i));
const setRow = (i, k, v) => setItems(a => { const r = [...a]; r[i] = Object.assign(Object.assign({}, r[i]), { [k]: k === "qty" ? +v : v }); return r; });
const total = items.reduce((s, r) => { const p = parts.find(x => x.id === r.partId); return s + (p ? p.unitPrice * r.qty : 0); }, 0);
const submit = () => {
const errs = {};
if (!assetId)
errs.assetId = "Seleziona l'apparecchio";
items.forEach((r, idx) => {
const p = parts.find(x => x.id === r.partId);
if (!p) {
errs["item_" + idx] = "Parte non trovata alla riga " + (idx + 1);
return;
}
if (r.qty < 1)
errs["item_" + idx] = "Quantità deve essere ≥1 alla riga " + (idx + 1) + " (" + p.name + ")";
else if (r.qty > p.qty)
errs["item_" + idx] = "Quantità " + r.qty + " > disponibili " + p.qty + " (" + p.name + ")";
});
setErrors(errs);
if (Object.keys(errs).length > 0)
return;
onWithdraw({ items, reason, assetId, tech, date: new Date().toISOString().slice(0, 10), total });
};
if (parts.length === 0 || assets.length === 0) {
return (React.createElement(Modal, { title: " Scarico Stock", onClose: onClose },
React.createElement("div", { style: { textAlign: "center", padding: "20px 0", color: "var(--text-2)" } },
"Servono almeno un apparecchio e una parte.",
React.createElement("div", { style: { marginTop: 14 } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Chiudi")))));
}
return (React.createElement(Modal, { title: " Scarico Stock", wide: true, onClose: onClose },
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement(ErrorSummary, { errors: errors }),
React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement(Sel, { label: "Apparecchio", value: assetId, onChange: e => setAssetId(e.target.value) }, assets.map(a => React.createElement("option", { key: a.id, value: a.id },
(a.assetCode || a.id),
" \u2014 ",
a.name))),
React.createElement(Inp, { label: "Tecnico", value: tech, onChange: e => setTech(e.target.value) }),
React.createElement(Span2, null,
React.createElement(Inp, { label: "Motivo / Riferimento", value: reason, onChange: e => setReason(e.target.value) }))),
React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 8 } },
React.createElement("span", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } }, "Parti"),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: addRow }, "+ Aggiungi")),
items.map((row, i) => {
const p = parts.find(x => x.id === row.partId);
return (React.createElement("div", { key: i, style: { display: "grid", gridTemplateColumns: "1fr 70px 80px auto", gap: 6, marginBottom: 8, alignItems: "center" } },
React.createElement("select", { value: row.partId, onChange: e => setRow(i, "partId", e.target.value), style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 10px", color: "var(--text)", minWidth: 0 } }, parts.map(pt => React.createElement("option", { key: pt.id, value: pt.id },
pt.code,
" \u2014 ",
pt.name))),
React.createElement("input", { type: "number", value: row.qty, min: 1, max: p === null || p === void 0 ? void 0 : p.qty, onChange: e => setRow(i, "qty", e.target.value), style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 10px", color: "var(--text)" } }),
React.createElement("span", { style: { color: "#a855f7", fontWeight: 700, fontSize: 12 } },
"\u20AC",
p ? (p.unitPrice * row.qty).toFixed(2) : "0"),
React.createElement(Btn, { sm: true, variant: "danger", onClick: () => remRow(i) }, "\u2715")));
}),
React.createElement("div", { style: { textAlign: "right", marginTop: 8 } },
React.createElement("span", { style: { color: "var(--text-3)", fontSize: 12 } }, "Totale: "),
React.createElement("span", { style: { color: "#22c55e", fontWeight: 800, fontSize: 16 } },
"\u20AC",
total.toFixed(2)))),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Annulla"),
React.createElement(Btn, { variant: "success", onClick: submit }, "\u2713 Conferma")))));
}
export function AssetDetailModal({ asset, recalls, jobs, parts, iecReports, funcReports, customers, onClose, onEditAsset, onNewJob, onNewIec, onNewFunc, onAssetSticker, onOpenJob, onQuickLocation, company, generateJobPDF, generateIECPDF, generateFuncPDF, templates, page, onAddDoc, onDeleteDoc, showToast, onOpenIec, onOpenFunc, onOpenRecall }) {
const [tab, setTab] = React.useState("overview");
const customer = customers.find(c => c.id === asset.customerId) || null;
const assetJobs = jobs
.filter(j => j.assetId === asset.id)
.sort((a, b) => b.openDate.localeCompare(a.openDate));
const assetIec = iecReports
.filter(r => r.assetId === asset.id)
.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
const assetFunc = funcReports
.filter(r => r.assetId === asset.id)
.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
const timelineEvents = (() => {
const ev = [];
assetIec.forEach(r => ev.push({
kind: "iec", ref: r, date: r.date || "", color: r.overallPass ? "#22c55e" : "#ef4444",
icon: "", title: "Sicurezza elettrica", sub: (r.reportNumber || r.id) + (r.technician ? " · " + r.technician : ""),
ok: r.overallPass, badge: r.overallPass ? "CONFORME" : "NON CONF."
}));
assetFunc.forEach(r => ev.push({
kind: "func", ref: r, date: r.date || "", color: r.overallPass ? "#22c55e" : "#ef4444",
icon: "", title: "Verifica funzionale", sub: (r.reportNumber || r.id) + (r.technician ? " · " + r.technician : ""),
ok: r.overallPass, badge: r.overallPass ? "CONFORME" : "NON CONF."
}));
assetJobs.forEach(j => ev.push({
kind: "job", ref: j, date: j.openDate || "", color: STATUS_COLOR[j.status] || "var(--text-3)",
icon: "›", title: (j.type ? j.type.charAt(0).toUpperCase() + j.type.slice(1) : "Intervento"),
sub: (j.description || jobTipoLabel(j)).slice(0, 60), badge: j.status
}));
return ev.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
})();
const totalCost = assetJobs.reduce((s, j) => {
const p = j.parts.reduce((s2, p) => { const pt = parts.find(x => x.id === p.partId); return s2 + (pt ? (pt.sellPrice || pt.unitPrice) * p.qty : 0); }, 0);
return s + p + j.laborHours * j.laborRate;
}, 0);
const openJobs = assetJobs.filter(j => j.status !== "chiuso");
const lastIec = assetIec[0] || null;
const lastFunc = assetFunc[0] || null;
const warrantyDays = asset.warrantyExpiry ? Math.round((new Date(asset.warrantyExpiry) - new Date()) / 86400000) : null;
const serviceDays = asset.nextService ? Math.round((new Date(asset.nextService) - new Date()) / 86400000) : null;
const S = { background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 10, padding: "14px 16px" };
const LBL = { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 3 };
const VAL = { fontSize: 13, color: "var(--text)", fontWeight: 600 };
const TABS = [{ id: "overview", label: " Scheda" }, { id: "timeline", label: "Storico" }, { id: "jobs", label: " Job (" + assetJobs.length + ")" }, { id: "iec", label: "Sicurezza (" + assetIec.length + ")" }, { id: "func", label: "Funzionale (" + assetFunc.length + ")" }, { id: "documenti", label: "Documenti (" + ((asset.documents || []).length) + ")" }];
const riskColor = { A: "#22c55e", B: "#f59e0b", C: "#ef4444" };
const CMAX = page ? "none" : "55vh";
const _mix = (c, p) => "color-mix(in srgb, " + c + " " + p + "%, transparent)";
const _actBtn = (onClick, c, icon, label) => React.createElement("button", { onClick: onClick, onMouseEnter: (e) => { e.currentTarget.style.background = _mix(c, 24); e.currentTarget.style.borderColor = _mix(c, 60); }, onMouseLeave: (e) => { e.currentTarget.style.background = _mix(c, 13); e.currentTarget.style.borderColor = _mix(c, 34); }, style: { background: _mix(c, 13), color: c, border: "1px solid " + _mix(c, 34), borderRadius: 8, padding: "9px 8px", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, touchAction: "manipulation", WebkitTapHighlightColor: "transparent", transition: "background .12s ease, border-color .12s ease" } }, icon, React.createElement("span", null, label));
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 0, minHeight: 0 } },
React.createElement("div", { style: { background: "var(--bg)", borderRadius: 10, padding: "14px 16px", marginBottom: 14, border: "1px solid var(--border-2)" } },
React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 } },
React.createElement("span", { style: { fontSize: 17, fontWeight: 700, color: "#5eead4", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: .5 } }, asset.assetCode || asset.id),
asset.riskClass && React.createElement("span", { style: { background: riskColor[asset.riskClass] + "22", color: riskColor[asset.riskClass], border: "1px solid " + riskColor[asset.riskClass] + "55", borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700 } },
"Cl. ",
asset.riskClass),
React.createElement(Badge, { text: asset.status, color: STATUS_COLOR[asset.status] || "var(--text-3)" })),
(asset.name ? React.createElement("div", { style: { fontSize: 16, color: "var(--text)", fontWeight: 700, marginBottom: 3, lineHeight: 1.25 } }, asset.name) : null),
React.createElement("div", { style: { fontSize: 14, color: "var(--text-2)", marginBottom: 3, fontWeight: 600 } },
asset.brand,
" ",
asset.model),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", fontFamily: "'IBM Plex Mono', monospace", marginBottom: customer ? 4 : 10 } },
"S/N: ",
asset.serial || "—"),
customer && React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", marginBottom: 10 } },
"",
customer.name),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", marginBottom: 10, display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" } },
React.createElement("span", null,
"",
asset.location || React.createElement("span", { style: { color: "var(--text-3)" } }, "posizione non impostata")),
asset.lastSeenAt && React.createElement("span", { style: { color: "var(--text-4)", fontSize: 10 } },
"\u00B7 visto ",
new Date(asset.lastSeenAt).toLocaleString("it-IT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }))),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 6 } },
_actBtn(onEditAsset, "var(--acc-slate)", ICON_EDIT, "Modifica"),
_actBtn(onNewJob, "var(--acc-teal)", ICON_PLUS, "Job"),
_actBtn(onNewIec, "var(--acc-purple)", ICON_ZAP, "Sicurezza"),
_actBtn(onNewFunc, "var(--acc-cyan)", ICON_ACTIVITY, "Funzionale"),
_actBtn(onAssetSticker, "var(--acc-amber)", ICON_TAG, "Sticker"),
_actBtn(() => { const loc = prompt("Ultima posizione rilevata (check-in manuale):", asset.lastLocation || asset.location || ""); if (loc !== null && onQuickLocation) onQuickLocation(loc.trim()); }, "var(--acc-green)", ICON_PIN, "Ultima posizione"))),
React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" } }, [
{ label: "Job aperti", value: openJobs.length, color: openJobs.length > 0 ? "#f59e0b" : "#22c55e" },
{ label: "Job totali", value: assetJobs.length, color: "#2dd4bf" },
{ label: "Costo totale", value: "€" + totalCost.toFixed(0), color: "#a855f7" },
{ label: "Ultima Sicurezza", value: lastIec ? lastIec.date : "mai", color: (lastIec === null || lastIec === void 0 ? void 0 : lastIec.overallPass) ? "#22c55e" : "#ef4444" },
{ label: "Ultima verif.", value: lastFunc ? lastFunc.date : "mai", color: "var(--text-3)" },
].map(k => (React.createElement("div", { key: k.label, style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "8px 14px", flex: 1, minWidth: 100 } },
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .7, fontWeight: 700 } }, k.label),
React.createElement("div", { style: { fontSize: 17, fontWeight: 700, color: k.color, marginTop: 3, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 } }, k.value))))),
React.createElement("div", { style: { display: "flex", gap: 4, marginBottom: 12, borderBottom: "2px solid var(--border-2)", paddingBottom: 0, overflowX: "auto", flexWrap: "nowrap", scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch", maxWidth: "100%" } }, TABS.map(t => (React.createElement("button", { key: t.id, onClick: () => setTab(t.id), style: {
background: "none", border: "none", borderBottom: tab === t.id ? "2px solid #2dd4bf" : "2px solid transparent",
color: tab === t.id ? "#5eead4" : "var(--text-3)", padding: "8px 14px", cursor: "pointer",
fontSize: 13, fontWeight: tab === t.id ? 700 : 500, marginBottom: -2, whiteSpace: "nowrap", flexShrink: 0
} }, t.label)))),
tab === "overview" && (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12, overflow: "auto", maxHeight: CMAX } },
assetHasOpenRecall(asset.id, recalls) && React.createElement("div", { onClick: function () { var rc = assetOpenRecall(asset.id, recalls); if (rc && onOpenRecall) onOpenRecall(rc.id); }, onMouseEnter: function (e) { e.currentTarget.style.background = "#4a1616"; }, onMouseLeave: function (e) { e.currentTarget.style.background = "#3a1212"; }, style: { background: "#3a1212", border: "1px solid #ef444466", borderRadius: 8, color: "#fca5a5", padding: "10px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, transition: "background .12s ease" } }, React.createElement("span", null, "⚠ Avviso di sicurezza aperto su questo apparecchio — azione da eseguire"), React.createElement("span", { style: { fontSize: 11, opacity: .85, whiteSpace: "nowrap" } }, "Apri ›")),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 10 } },
React.createElement("div", { style: S },
React.createElement("div", { style: LBL }, "Identificazione"),
[["Marca", asset.brand], ["Modello", asset.model], ["N° Serie", asset.serial], ["Ubicazione", asset.location], ["CIVAB", asset.civab], ["CND", asset.cnd], ["EMDN", asset.emdn]].map(([l, v]) => v ? (React.createElement("div", { key: l, style: { display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--border)" } },
React.createElement("span", { style: { fontSize: 11, color: "var(--text-3)" } }, l),
React.createElement("span", { style: { fontSize: 11, color: "var(--text)", fontFamily: ["N° Serie", "CIVAB", "CND", "EMDN"].includes(l) ? "monospace" : "inherit" } }, v))) : null)),
React.createElement("div", { style: S },
React.createElement("div", { style: LBL }, "Date e contratti"),
[
["Acquisto", asset.purchaseDate],
["Scad. garanzia", asset.warrantyExpiry],
["Ultimo servizio", asset.lastService],
["Prossimo servizio", asset.nextService],
["Interv. Sicur. Elettr. (mesi)", asset.intervalIec || asset.serviceInterval],
["Interv. Funzionale (mesi)", asset.intervalFunc || asset.serviceInterval],
].map(([l, v]) => v ? (React.createElement("div", { key: l, style: { display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--border)" } },
React.createElement("span", { style: { fontSize: 11, color: "var(--text-3)" } }, l),
React.createElement("span", { style: { fontSize: 11, color: l === "Scad. garanzia" && warrantyDays !== null && warrantyDays < 90 ? "#f59e0b" : "var(--text)" } }, v))) : null),
asset.serviceContract && (React.createElement("div", { style: { marginTop: 6, padding: "6px 8px", background: "var(--bg)", borderRadius: 6, fontSize: 10, color: "var(--text-2)" } },
React.createElement("span", { style: { color: "var(--text-3)", fontWeight: 700 } }, "Contratto: "),
asset.serviceContract)))),
serviceDays !== null && (React.createElement("div", { style: { background: serviceDays < 0 ? "#ef444415" : serviceDays <= 30 ? "#f59e0b15" : "#22c55e15", border: "1px solid " + (serviceDays < 0 ? "#ef444433" : serviceDays <= 30 ? "#f59e0b33" : "#22c55e33"), borderRadius: 8, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" } },
React.createElement("span", { style: { fontSize: 12, color: "var(--text-2)" } },
"Prossima manutenzione programmata: ",
React.createElement("strong", { style: { color: "var(--text)" } }, asset.nextService)),
React.createElement(AlertChip, { days: serviceDays }))),
React.createElement("div", { style: { background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "10px 14px" } },
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 7 } }, "Tracking RFID"),
(asset.epc || asset.lastLocation)
? React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } },
asset.epc ? React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline" } },
React.createElement("span", { style: { fontSize: 11, color: "var(--text-3)" } }, "EPC"),
React.createElement("span", { style: { fontSize: 11, color: "var(--text)", fontFamily: "'IBM Plex Mono', monospace" } }, asset.epc)) : null,
asset.lastLocation
? React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline" } },
React.createElement("span", { style: { fontSize: 11, color: "var(--text-3)" } }, "Ultima posizione"),
React.createElement("span", { style: { fontSize: 13, color: "var(--acc-teal)", fontWeight: 700 } }, asset.lastLocation + (asset.lastLocationDate ? (" \u00B7 " + fmtDateTimeIt(asset.lastLocationDate)) : "")))
: React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", fontStyle: "italic" } }, asset.epc ? "Tag associato, mai scansionato" : "Mai rilevato"))
: React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", fontStyle: "italic" } }, "Nessun tag RFID associato \u2014 aggiungilo in modifica apparecchio")),
asset.notes && React.createElement("div", { style: Object.assign(Object.assign({}, S), { fontSize: 12, color: "var(--text-2)", lineHeight: 1.6 }) },
React.createElement("div", { style: LBL }, "Note"),
asset.notes))),
tab === "timeline" && (React.createElement("div", { style: { overflow: "auto", maxHeight: CMAX } }, timelineEvents.length === 0 ? (React.createElement("div", { style: { textAlign: "center", padding: 32, color: "var(--text-4)" } }, "Nessun evento registrato per questo apparecchio")) : (React.createElement("div", { style: { position: "relative", paddingLeft: 18 } },
React.createElement("div", { style: { position: "absolute", left: 5, top: 6, bottom: 6, width: 2, background: "var(--border-2)" } }),
timelineEvents.map((e, i) => (React.createElement("div", { key: i, style: { position: "relative", marginBottom: 12 } },
React.createElement("div", { style: { position: "absolute", left: -17, top: 3, width: 11, height: 11, borderRadius: "50%", background: e.color, border: "2px solid var(--bg)" } }),
React.createElement("div", { onClick: () => { if (e.kind === "job" && onOpenJob) onOpenJob(e.ref); else if (e.kind === "iec" && onOpenIec) onOpenIec(e.ref); else if (e.kind === "func" && onOpenFunc) onOpenFunc(e.ref); }, style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "9px 13px", cursor: "pointer", transition: "border-color .12s ease" }, onMouseEnter: (ev) => { ev.currentTarget.style.borderColor = e.color + "88"; }, onMouseLeave: (ev) => { ev.currentTarget.style.borderColor = "var(--border-2)"; } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginBottom: 2 } },
React.createElement("span", { style: { fontSize: 13 } }, e.icon),
React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: "var(--text)" } }, e.title),
e.badge && React.createElement("span", { style: { fontSize: 10, fontWeight: 700, color: e.color, background: e.color + "22", border: "1px solid " + e.color + "44", borderRadius: 4, padding: "1px 6px", textTransform: "uppercase", letterSpacing: .3 } }, e.badge)),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", lineHeight: 1.4 } }, e.sub)),
React.createElement("span", { style: { fontSize: 11, color: "var(--text-3)", fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0, whiteSpace: "nowrap" } }, e.date || "—")))))))))),
tab === "jobs" && (React.createElement("div", { style: { overflow: "auto", maxHeight: CMAX, display: "flex", flexDirection: "column", gap: 8 } }, assetJobs.length === 0 ? (React.createElement("div", { style: { textAlign: "center", padding: 32, color: "var(--text-4)" } }, "Nessun job per questo apparecchio")) : assetJobs.map(j => {
var _a;
const pCost = j.parts.reduce((s, p) => { const pt = parts.find(x => x.id === p.partId); return s + (pt ? (pt.sellPrice || pt.unitPrice) * p.qty : 0); }, 0);
const tot = pCost + j.laborHours * j.laborRate;
return (React.createElement("div", { key: j.id, style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "10px 14px", cursor: "pointer" }, onClick: () => onOpenJob(j) },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginBottom: 4 } },
React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "var(--text-3)" } }, jobShortCode(j)),
React.createElement(Badge, { text: j.status, color: STATUS_COLOR[j.status] || "var(--text-3)" }),
React.createElement(Badge, { text: j.priority, color: PRI_COLOR[j.priority] || "var(--text-3)" }),
React.createElement("span", { style: { fontSize: 11, color: "var(--text-3)", textTransform: "capitalize" } }, j.type)),
React.createElement("div", { style: { fontSize: 12, color: "var(--text-2)", marginBottom: 2 } }, j.description || "—"),
React.createElement("div", { style: { fontSize: 10, color: "var(--text-4)" } },
j.openDate,
j.closeDate ? " → " + j.closeDate : "",
" \u00B7 ",
j.assignee || "—")),
React.createElement("div", { style: { textAlign: "right", flexShrink: 0 } },
React.createElement("div", { style: { fontSize: 14, fontWeight: 800, color: "#a855f7", fontFamily: "'IBM Plex Mono', monospace" } },
"\u20AC",
tot.toFixed(0)),
((_a = j.timeline) === null || _a === void 0 ? void 0 : _a.length) > 0 && React.createElement("div", { style: { fontSize: 10, color: "var(--text-4)" } },
"\u00B7 ",
j.timeline.length,
" step"),
(j.iecReportId || j.funcReportId) && React.createElement("div", { style: { fontSize: 10, color: "#5eead4" } },
j.iecReportId ? "" : "",
j.funcReportId ? "" : "")))));
}))),
tab === "iec" && (React.createElement("div", { style: { overflow: "auto", maxHeight: CMAX, display: "flex", flexDirection: "column", gap: 8 } }, assetIec.length === 0 ? (React.createElement("div", { style: { textAlign: "center", padding: 32, color: "var(--text-4)" } }, "Nessuna verifica di sicurezza elettrica per questo apparecchio")) : assetIec.map(r => (React.createElement("div", { key: r.id, onClick: () => onOpenIec && onOpenIec(r), onMouseEnter: (ev) => { ev.currentTarget.style.borderColor = (r.overallPass ? "#22c55e" : "#ef4444") + "99"; }, onMouseLeave: (ev) => { ev.currentTarget.style.borderColor = (r.overallPass ? "#22c55e33" : "#ef444433"); }, style: { background: "var(--surface)", border: "1px solid " + (r.overallPass ? "#22c55e33" : "#ef444433"), borderRadius: 8, padding: "10px 14px", cursor: "pointer", transition: "border-color .12s ease" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 } },
React.createElement("div", null,
React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center", marginBottom: 3 } },
React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: "var(--text)" } }, r.reportNumber || r.id),
React.createElement("span", { style: { fontSize: 10, color: "var(--text-3)" } },
r.norm,
" \u00B7 Cl.",
r.equipClass,
" \u00B7 ",
r.patientType || "BF")),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)" } },
r.date,
" \u00B7 ",
r.technician || "—",
" \u00B7 ",
r.verifyType),
r.notes && React.createElement("div", { style: { fontSize: 10, color: "var(--text-4)", marginTop: 3 } }, r.notes)),
React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center" } },
React.createElement("span", { style: { fontWeight: 800, fontSize: 13, color: r.overallPass ? "#22c55e" : "#ef4444" } }, r.overallPass ? "✓ OK" : "✗ NO"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); generateIECPDF(r, asset, customer, company); }, style: { background: "var(--surface-3)", border: "1px solid var(--border)", borderRadius: 6, color: "#5eead4", padding: "3px 8px", cursor: "pointer", fontSize: 11 } })))))))),
tab === "documenti" && (React.createElement("div", { style: { overflow: "auto", maxHeight: CMAX } },
React.createElement("div", { style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 10, padding: "16px 18px" } },
React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 4 } }, "Documenti dell'apparecchio"),
React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)", marginBottom: 12, lineHeight: 1.5 } }, "Conformit\u00E0 CE, manuali, certificati, rapporti esterni. PDF, immagini, Word, Excel \u2014 max 5MB a file."),
React.createElement(AttachmentsList, { attachments: asset.documents || [], onAdd: (att) => onAddDoc && onAddDoc(att), onDelete: (id) => onDeleteDoc && onDeleteDoc(id), showToast: showToast })))),
tab === "func" && (React.createElement("div", { style: { overflow: "auto", maxHeight: CMAX, display: "flex", flexDirection: "column", gap: 8 } }, assetFunc.length === 0 ? (React.createElement("div", { style: { textAlign: "center", padding: 32, color: "var(--text-4)" } }, "Nessuna verifica funzionale per questo apparecchio")) : assetFunc.map(r => {
const tpl = (templates || FUNC_TEMPLATES || {})[r.templateId] || { label: "Generico", icon: "›" };
return (React.createElement("div", { key: r.id, onClick: () => onOpenFunc && onOpenFunc(r), onMouseEnter: (ev) => { ev.currentTarget.style.borderColor = (r.overallPass ? "#22c55e" : "#ef4444") + "99"; }, onMouseLeave: (ev) => { ev.currentTarget.style.borderColor = (r.overallPass ? "#22c55e33" : "#ef444433"); }, style: { background: "var(--surface)", border: "1px solid " + (r.overallPass ? "#22c55e33" : "#ef444433"), borderRadius: 8, padding: "10px 14px", cursor: "pointer", transition: "border-color .12s ease" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 } },
React.createElement("div", null,
React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center", marginBottom: 3 } },
React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: "var(--text)" } }, r.reportNumber || r.id),
React.createElement("span", { style: { fontSize: 11, color: "var(--text-3)" } },
tpl.icon,
" ",
tpl.label)),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)" } },
r.date,
" \u00B7 ",
r.technician || "—"),
r.notes && React.createElement("div", { style: { fontSize: 10, color: "var(--text-4)", marginTop: 3 } }, r.notes)),
React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center" } },
React.createElement("span", { style: { fontWeight: 800, fontSize: 13, color: r.overallPass ? "#22c55e" : "#ef4444" } }, r.overallPass ? "✓ OK" : "✗ NO"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); generateFuncPDF(r, asset, customer, company); }, style: { background: "var(--surface-3)", border: "1px solid var(--border)", borderRadius: 6, color: "#5eead4", padding: "3px 8px", cursor: "pointer", fontSize: 11 } })))));
})))));
}
export function StickerModal({ report, asset, customer, company, kind, onClose, assets }) {
const isAssetSticker = kind === "asset";
const [tapeW, setTapeW] = React.useState(25);
const cfg = (typeof getSupabaseConfig === "function") ? getSupabaseConfig() : { url: "" };
const supaActive = !!(cfg && cfg.url);
const dateStr = report.date || new Date().toISOString().slice(0, 10);
const reportNum = report.reportNumber || report.report_number || (kind === "iec" ? "VSE" : "VF");
const esito = (report.overallPass !== undefined ? report.overallPass : report.overall_pass) ? "CONFORME" : "NON CONFORME";
const esitoOk = (report.overallPass !== undefined ? report.overallPass : report.overall_pass);
const verLabel = kind === "iec" ? "Verifica Sicurezza Elettrica" : "Verifica Funzionale";
const norm = report.norm || (kind === "iec" ? "IEC 62353" : "IEC 60601");
const nextDueStr = (() => {
const explicit = report.nextDate || report.next_date;
if (explicit)
return explicit;
if (!dateStr)
return "";
const d = new Date(dateStr);
if (isNaN(d.getTime()))
return "";
let months;
if (kind === "iec") {
const iv = parseInt(asset === null || asset === void 0 ? void 0 : asset.intervalIec, 10);
months = (iv && iv > 0) ? iv : 12;
}
else {
const iv = parseInt(asset === null || asset === void 0 ? void 0 : asset.intervalFunc, 10);
months = (iv && iv > 0) ? iv : 12;
}
d.setMonth(d.getMonth() + months);
return d.toISOString().slice(0, 10);
})();
const nextLabel = kind === "iec" ? "Prossima sicurezza elettrica" : "Prossima funzionale";
const appOrigin = (() => { try {
return window.location.origin + window.location.pathname.replace(/\/+$/, "");
}
catch (e) {
return "";
} })();
const assetUrl = (appOrigin ? appOrigin : "") + "/?asset=" + ((asset === null || asset === void 0 ? void 0 : asset.id) || "");
const reportUrl = supaActive
? (cfg.url.replace(/\/+$/, "") + "/report/" + (report.id || ""))
: null;
const qrText = isAssetSticker
? assetUrl
: (reportUrl || [
((asset === null || asset === void 0 ? void 0 : asset.name) || "Apparecchio").slice(0, 30),
"SN:" + ((asset === null || asset === void 0 ? void 0 : asset.serial) || "-").slice(0, 20),
reportNum + " " + dateStr,
esito,
].filter(Boolean).join(String.fromCharCode(10)));
const qrSvg = React.useMemo(() => {
try {
return QRGen.toSVG(qrText, { scale: 4, margin: 1, color: "#000000", bg: "#ffffff" });
}
catch (e) {
return null;
}
}, [qrText]);
const TCFG = {
"12": { len: 40, qr: 7.5, padV: 1, padH: 1.5, gap: 1.5, fName: 0, fSub: 5, showName: false },
"18": { len: 48, qr: 11, padV: 1, padH: 2, gap: 2, fName: 6.5, fSub: 5.5, showName: true },
"24": { len: 56, qr: 16, padV: 1.5, padH: 2, gap: 2.5, fName: 8, fSub: 6.5, showName: true },
"25": { len: 50, qr: 20, padV: 2, padH: 2.5, gap: 3, fName: 9, fSub: 7, showName: true },
};
const doPrint = () => {
const tc = TCFG[String(tapeW)] || TCFG["24"];
const fCode = tapeW >= 25 ? 19 : (tapeW >= 24 ? 13 : (tapeW >= 18 ? 10 : 7));
const w = window.open("", "_blank", "width=420,height=320");
if (!w) {
alert("Abilita i popup per stampare lo sticker.");
return;
}
const code = (asset && (asset.assetCode || asset.id)) || "—";
const nm = (asset && asset.name) || "Apparecchio";
const sn = (asset && asset.serial) || "—";
let info = "";
if (isAssetSticker) {
info = '<div class="codeBig">' + code + '</div><div class="brand">MedTrace</div>';
}
else {
info = tc.showName
? ('<div class="name">' + nm + '</div><div class="row">' + reportNum + ' · ' + dateStr + '</div>' + (nextDueStr ? ('<div class="row">Pross.: <b>' + nextDueStr + '</b></div>') : '') + '<div class="esito">' + esito + '</div>')
: ('<div class="code12">' + esito + '</div>');
}
w.document.write('<!DOCTYPE html><html><head><title>Sticker ' + reportNum + '</title><style>'
+ '@page { size: ' + tc.len + 'mm ' + tapeW + 'mm; margin: 0; }'
+ '* { margin:0; padding:0; box-sizing:border-box; }'
+ 'html,body { width:' + tc.len + 'mm; height:' + tapeW + 'mm; }'
+ 'body { font-family:-apple-system, Arial, sans-serif; }'
+ '.sticker { width:' + tc.len + 'mm; height:' + tapeW + 'mm; padding:' + tc.padV + 'mm ' + tc.padH + 'mm; display:flex; gap:' + tc.gap + 'mm; align-items:center; overflow:hidden; }'
+ '.qr { width:' + tc.qr + 'mm; height:' + tc.qr + 'mm; flex-shrink:0; }'
+ '.qr svg { width:100%; height:100%; display:block; }'
+ '.info { flex:1; min-width:0; overflow:hidden; }'
+ '.name { font-size:' + tc.fName + 'pt; font-weight:900; line-height:1.08; word-break:break-word; overflow:hidden; }'
+ '.code12 { font-size:' + (tapeW < 14 ? '7pt' : '9pt') + '; font-weight:900; }'
+ '.codeBig { font-size:' + fCode + 'pt; font-weight:900; line-height:1.1; word-break:break-all; }'
+ '.brand { font-size:4.3pt; font-weight:700; color:#9aa0a6; letter-spacing:.2pt; margin-top:0.5mm; text-transform:uppercase; }'
+ '.row { font-size:' + tc.fSub + 'pt; color:#111; line-height:1.3; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }'
+ '.esito { display:inline-block; font-size:' + tc.fSub + 'pt; font-weight:900; padding:0.3mm 1.5mm; border-radius:1mm; margin-top:0.5mm; background:' + (esitoOk ? "#16a34a" : "#dc2626") + '; color:#fff; }'
+ '</style></head><body><div class="sticker"><div class="qr">' + (qrSvg || "") + '</div><div class="info">' + info + '</div></div>'
+ '<script>window.onload=function(){setTimeout(function(){window.print();},300);};</script>'
+ '</body></html>');
w.document.close();
};
const custAssets = (assets || []).filter(a => a && asset && a.customerId === asset.customerId);
const doPrintBatch = () => {
const list = custAssets;
if (!list.length) { alert("Nessun apparecchio da stampare per questo cliente."); return; }
const w = window.open("", "_blank", "width=460,height=640");
if (!w) { alert("Abilita i popup per stampare le etichette."); return; }
const L = 50, H = 25, QR = 20, padV = 2, padH = 2.5, gap = 3, fC = 19;
const cells = list.map(a => {
const code = (a.assetCode || a.id) || "\u2014";
const url = (appOrigin ? appOrigin : "") + "/?asset=" + (a.id || "");
let svg = "";
try { svg = QRGen.toSVG(url, { scale: 4, margin: 1, color: "#000000", bg: "#ffffff" }); } catch (e) { svg = ""; }
return '<div class="sticker"><div class="qr">' + svg + '</div><div class="info"><div class="codeBig">' + code + '</div><div class="brand">MedTrace</div></div></div>';
}).join("");
w.document.write('<!DOCTYPE html><html><head><title>Etichette ' + ((customer && customer.name) || "") + '</title><style>'
+ '@page { size: ' + L + 'mm ' + H + 'mm; margin: 0; }'
+ '* { margin:0; padding:0; box-sizing:border-box; }'
+ 'body { font-family:-apple-system, Arial, sans-serif; }'
+ '.sticker { width:' + L + 'mm; height:' + H + 'mm; padding:' + padV + 'mm ' + padH + 'mm; display:flex; gap:' + gap + 'mm; align-items:center; overflow:hidden; page-break-after:always; }'
+ '.qr { width:' + QR + 'mm; height:' + QR + 'mm; flex-shrink:0; }'
+ '.qr svg { width:100%; height:100%; display:block; }'
+ '.info { flex:1; min-width:0; overflow:hidden; }'
+ '.codeBig { font-size:' + fC + 'pt; font-weight:900; line-height:1.1; word-break:break-all; }'
+ '.brand { font-size:5pt; font-weight:700; color:#9aa0a6; letter-spacing:.2pt; margin-top:0.8mm; text-transform:uppercase; }'
+ '</style></head><body>' + cells
+ '<script>window.onload=function(){setTimeout(function(){window.print();},400);};</script>'
+ '</body></html>');
w.document.close();
};
return (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "center", marginBottom: 18 } },
React.createElement("div", { style: { width: 360, maxWidth: "100%", border: "2px solid var(--border)", borderRadius: 12, padding: 16, display: "flex", gap: 16, alignItems: "center", background: "#fff" } },
React.createElement("div", { style: { width: 104, height: 104, flexShrink: 0 }, dangerouslySetInnerHTML: { __html: qrSvg || "" } }),
React.createElement("div", { style: { flex: 1, minWidth: 0, color: "#000", display: "flex", flexDirection: "column", gap: 3 } }, isAssetSticker ? (React.createElement(React.Fragment, null,
React.createElement("div", { style: { fontSize: 8.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: .4, color: "#666" } }, "Codice apparecchio"),
React.createElement("div", { style: { fontSize: 24, fontWeight: 800, lineHeight: 1.1, color: "#000", wordBreak: "break-all" } }, (asset === null || asset === void 0 ? void 0 : asset.assetCode) || (asset === null || asset === void 0 ? void 0 : asset.id) || "—"),
React.createElement("div", { style: { fontSize: 10, color: "#777", marginTop: 8, lineHeight: 1.4 } }, "Il QR apre la scheda con tutte le info (S/N, marca, modello, storico, scadenze) \u2014 sempre aggiornate."))) : (React.createElement(React.Fragment, null,
React.createElement("div", { style: { fontSize: 8.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: .4, color: "#666" } }, verLabel),
React.createElement("div", { style: { fontSize: 16, fontWeight: 800, lineHeight: 1.15, color: "#000", wordBreak: "break-word" } }, (asset === null || asset === void 0 ? void 0 : asset.name) || "Apparecchio"),
React.createElement("div", { style: { height: 1, background: "#e5e7eb", margin: "3px 0" } }),
React.createElement("div", { style: { fontSize: 11, color: "#333", lineHeight: 1.4 } },
"S/N: ",
React.createElement("strong", null, (asset === null || asset === void 0 ? void 0 : asset.serial) || "—")),
React.createElement("div", { style: { fontSize: 11, color: "#333", lineHeight: 1.4 } },
reportNum,
" \u00B7 ",
dateStr),
React.createElement("div", { style: { fontSize: 11, color: "#666" } }, norm),
nextDueStr && React.createElement("div", { style: { fontSize: 11, color: "#0F172A", lineHeight: 1.4, marginTop: 2 } },
React.createElement("strong", null,
nextLabel,
":"),
" ",
nextDueStr),
React.createElement("div", { style: { display: "inline-block", alignSelf: "flex-start", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 6, marginTop: 5,
background: esitoOk ? "#16a34a" : "#dc2626", color: "#fff", letterSpacing: .5 } }, esito)))))),
React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)", lineHeight: 1.5, background: "#1e2a3a44", borderRadius: 8, padding: "10px 12px", marginBottom: 16 } }, isAssetSticker
? React.createElement("span", null,
React.createElement("strong", { style: { color: "#2dd4bf" } }, "Sticker apparecchio:"),
" inquadrando il QR con la fotocamera del telefono si apre l'app sulla scheda di questo apparecchio. Funziona se l'app \u00E8 installata/aperta su quel dispositivo.")
: (supaActive
? React.createElement("span", null,
React.createElement("strong", { style: { color: "#2dd4bf" } }, "QR online:"),
" scansionando si aprir\u00E0 il report sul cloud.")
: React.createElement("span", null,
React.createElement("strong", { style: { color: "#f59e0b" } }, "QR offline:"),
" contiene le info della verifica (macchina, data, esito). Per far aprire il report online dal QR, attiva la sincronizzazione cloud nelle Impostazioni."))),
React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 12 } },
React.createElement("span", { style: { fontSize: 13, color: "var(--text-2)", fontWeight: 600 } }, "Formato:"),
[25, 24, 18, 12].map(wmm => (React.createElement("button", { key: wmm, type: "button", onClick: () => setTapeW(wmm), style: { background: tapeW === wmm ? "#2dd4bf22" : "var(--surface)", border: "1px solid " + (tapeW === wmm ? "#2dd4bf" : "var(--border)"), color: tapeW === wmm ? "#2dd4bf" : "var(--text-2)", borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } },
(wmm === 25 ? "50\u00D725" : (wmm + " mm")))))),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", lineHeight: 1.5, marginBottom: 14 } },
"Stampa \u2192 scegli la stampante. Per le etichette PP 50\u00D725 (Zebra) seleziona il formato ",
React.createElement("b", null, "50\u00D725"),
" e imposta nella stampante il supporto 50\u00D725 mm. Fai una prova: se non \u00E8 centrata, si calibra."),
(isAssetSticker && custAssets.length > 1) ? React.createElement("button", { type: "button", onClick: doPrintBatch, style: { width: "100%", background: "#2dd4bf18", border: "1px solid #2dd4bf", color: "#2dd4bf", borderRadius: 10, padding: "11px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 12, touchAction: "manipulation" } }, "Stampa etichette di TUTTI gli apparecchi di " + ((customer && customer.name) || "questo cliente") + " (" + custAssets.length + ")") : null,
React.createElement("div", { style: FORM_FOOTER },
React.createElement("button", { onClick: onClose, style: FORM_BTN_GHOST }, "Chiudi"),
React.createElement("button", { onClick: doPrint, style: FORM_BTN_PRIMARY }, "Stampa sticker"))));
}
