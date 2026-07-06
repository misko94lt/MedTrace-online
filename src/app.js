import { FUNC_TEMPLATES } from "./constants/funcTemplates.js";
import { CND_TO_TPL, CND_CAT } from "./constants/cnd.js";
import { STATUS_COLOR, PRI_COLOR, TIMELINE_ICON, TIMELINE_LABEL, ROLES, PERM_SECTIONS, DEFAULT_ROLE_PERMS, FORM_INP, FORM_LBL, FORM_FLD, FORM_ROW, FORM_COL, FORM_SECTION, FORM_BTN_PRIMARY, FORM_BTN_GHOST, CATEGORIES } from "./constants/ui.js";
import { __awaiter, __rest } from "./lib/tslib.js";
import { downloadXLSX, downloadJSON, openPrintWindow, mtEnsurePdfLibs, mtRenderReportPdfBlob, showPDFPreview } from "./lib/export.js";
import { mtStartBulk, PDF_STYLE, generateIECPDF, generateFuncPDF, setInstrumentsRegistry } from "./lib/reports.js";
import { TecnicoPicker, TecniciManager, chkRow, Btn, fileToAttachment, AttachmentsList } from "./components/shared.js";
import { OFFLINE_MODE, STORAGE_KEY, getSupa, getSupabaseClient, getSupabaseConfig, idbGet, idbSet, loadData, mirrorToIdb, saveData, storageUsage, supabaseDeleteById, supabaseGetCompany, supabaseGetRole, supabasePushOne, supabaseSaveCompany, supabaseSaveTechnicians, supabaseSyncMerge, supabaseSyncUp, upsertInList, setBootData, setBootDone, getBootDone } from "./lib/sync.js";
import { startWedge, stopWedge, isWardTag, WARD_TAG_BRAND } from "./lib/rfid.js";
import { RfidAssocPicker } from "./components/rfid.js";
import { FuncVerifyForm, FuncWizardForm, IECReportForm, IecWizardForm } from "./components/verifiche.js";
import { SignaturePad } from "./components/ui.js";
import { techSignature } from "./components/shared.js";
import { AssetCombobox, ErrorSummary } from "./components/ui.js";
import { getNextReportNumber, iecGetMeasures } from "./lib/reports.js";
import { cndToTemplate, guessTemplate } from "./constants/funcTemplates.js";
import { AlertChip, AreaTrend, BarChart, ConfirmDialog, Donut, ExcelTable, Grid, Hint, Inp, KpiCard, Modal, PromptDialog, Sel, Span2, Txt, appConfirm, appPromptCb, useMedia } from "./components/ui.js";
/* MedTrace v2.05 ONLINE */
const useState=React.useState,useEffect=React.useEffect,useMemo=React.useMemo,useCallback=React.useCallback,useRef=React.useRef,useContext=React.useContext;
const supaSignUp = (email, pw) => { var _a; return (_a = getSupa()) === null || _a === void 0 ? void 0 : _a.auth.signUp({ email, password: pw }); };
const supaSignIn = (email, pw) => { var _a; return (_a = getSupa()) === null || _a === void 0 ? void 0 : _a.auth.signInWithPassword({ email, password: pw }); };
const supaSignOut = () => { var _a; return (_a = getSupa()) === null || _a === void 0 ? void 0 : _a.auth.signOut(); };
const supaGetUser = () => { var _a; return (_a = getSupa()) === null || _a === void 0 ? void 0 : _a.auth.getUser(); };
const supaOnAuth = (cb) => { var _a; return (_a = getSupa()) === null || _a === void 0 ? void 0 : _a.auth.onAuthStateChange(cb); };
const supaDB = {
getAll(table) {
return __awaiter(this, void 0, void 0, function* () {
const { data, error } = yield getSupa().from(table).select('*').order('created_at', { ascending: false });
if (error)
throw error;
return data || [];
});
},
insert(table, record) {
return __awaiter(this, void 0, void 0, function* () {
const { data, error } = yield getSupa().from(table).insert(record).select().single();
if (error)
throw error;
return data;
});
},
update(table, id, updates) {
return __awaiter(this, void 0, void 0, function* () {
const { data, error } = yield getSupa().from(table).update(updates).eq('id', id).select().single();
if (error)
throw error;
return data;
});
},
delete(table, id) {
return __awaiter(this, void 0, void 0, function* () {
const { error } = yield getSupa().from(table).delete().eq('id', id);
if (error)
throw error;
});
},
};
const APP_VERSION = "2.93";
(function () { try {
var l = document.createElement("link"); l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"; document.head.appendChild(l);
var st = document.createElement("style"); st.textContent = "body,input,button,select,textarea,h1,h2,h3{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;}"; document.head.appendChild(st);
var tk = document.createElement("style"); tk.textContent = "@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');:root{--bg:#0D0D12;--bg-deep:#0a0a0e;--bg-2:#101016;--surface:#15151b;--card:#1a1a22;--surface-2:#1e1e27;--surface-3:#23232e;--surface-4:#2e2e3a;--border:#2a2a38;--border-2:#23232e;--border-3:#2e2e3a;--border-4:#2a2a38;--text:#e8e8ef;--text-strong:#f0f0f5;--text-2:#9a9aab;--text-3:#6a6a78;--text-4:#56564e;--ok-bg:#06231f;--warn-bg:#1f1808;--err-bg:#1f0e0e;--info-bg:#101820;--acc-slate:#94a3b8;--acc-teal:#2dd4bf;--acc-purple:#a855f7;--acc-cyan:#22d3ee;--acc-amber:#f59e0b;--acc-green:#22c55e;--text-bright:#f0f0f5;}[data-theme='light']{--bg:#e4e9f1;--bg-deep:#d8dfe9;--bg-2:#e0e6ef;--surface:#ffffff;--card:#ffffff;--surface-2:#eef2f7;--surface-3:#e3e9f1;--surface-4:#d6dde7;--border:#b4c1d3;--border-2:#c6d1e0;--border-3:#bfcbda;--border-4:#b4c1d3;--text:#14202e;--text-strong:#0b1320;--text-2:#445268;--text-3:#586579;--text-4:#737f92;--ok-bg:#e7f6ee;--warn-bg:#fbf2dd;--err-bg:#fdeaea;--info-bg:#eaf1fb;--acc-slate:#475569;--acc-teal:#0d9488;--acc-purple:#7c3aed;--acc-cyan:#0e7490;--acc-amber:#b45309;--acc-green:#15803d;--text-bright:#0b1320;}html,body{background:var(--bg);color:var(--text);font-family:'IBM Plex Sans',system-ui,sans-serif;}input:focus,textarea:focus,select:focus{border-color:#2dd4bf;box-shadow:0 0 0 3px rgba(45,212,191,.18);} body{transition:background-color .2s ease;}"; document.head.appendChild(tk);
if (localStorage.getItem('mt-theme') === 'light') document.documentElement.setAttribute('data-theme', 'light');
var tgl = function(){ var d = document.documentElement; if (d.getAttribute('data-theme') === 'light'){ d.removeAttribute('data-theme'); localStorage.setItem('mt-theme','dark'); } else { d.setAttribute('data-theme','light'); localStorage.setItem('mt-theme','light'); } };
var addToggle = function(){ if (document.getElementById('mt-theme-btn')) return; var b = document.createElement('button'); b.id='mt-theme-btn'; b.type='button'; b.title='Tema chiaro / scuro'; b.innerHTML='\u25D0'; b.style.cssText='position:fixed;left:12px;bottom:12px;z-index:99998;width:38px;height:38px;border-radius:50%;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:17px;line-height:1;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.35);opacity:.5;transition:opacity .15s;display:flex;align-items:center;justify-content:center;'; b.onmouseenter=function(){b.style.opacity='1';}; b.onmouseleave=function(){b.style.opacity='.5';}; b.onclick=tgl; document.body.appendChild(b); };
window.__mtToggle = tgl;
} catch (e) {} })();
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
const DEMO_LOCKED = false;
const IVA_DEFAULT = 22;
const FORM_FOOTER = { display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 16, marginTop: 16, borderTop: "1px solid var(--border-2)" };
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
async function bootLoadData() {
if (getBootDone()) return;
let idbRaw, lsRaw;
try { lsRaw = localStorage.getItem(STORAGE_KEY); } catch (e) { }
try { idbRaw = await idbGet(STORAGE_KEY); } catch (e) { }
let idbObj = null, lsObj = null;
try { if (idbRaw && typeof idbRaw === "string") idbObj = JSON.parse(idbRaw); } catch (e) { }
try { if (lsRaw) lsObj = JSON.parse(lsRaw); } catch (e) { }
let chosen = null, chosenRaw = null;
const idbLen = (typeof idbRaw === "string") ? idbRaw.length : 0;
const lsLen = lsRaw ? lsRaw.length : 0;
if (idbObj && lsObj) { if (idbLen >= lsLen) { chosen = idbObj; chosenRaw = idbRaw; } else { chosen = lsObj; chosenRaw = lsRaw; } }
else if (idbObj) { chosen = idbObj; chosenRaw = idbRaw; }
else if (lsObj) { chosen = lsObj; chosenRaw = lsRaw; }
setBootData(chosen);
setBootDone(true);
try { if (chosenRaw && chosenRaw !== (typeof idbRaw === "string" ? idbRaw : null)) idbSet(STORAGE_KEY, chosenRaw); } catch (e) { }
}
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
function fmtMB(chars) { const mb = chars / 1048576; return (mb >= 10 ? mb.toFixed(1) : mb.toFixed(2)).replace(".", ",") + " MB"; }
function genUUID() {
try {
if (typeof crypto !== "undefined" && crypto.randomUUID)
return crypto.randomUUID();
}
catch (e) { }
return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
const r = Math.random() * 16 | 0;
const v = c === "x" ? r : (r & 0x3 | 0x8);
return v.toString(16);
});
}
function jobTipoLabel(j) {
return ({ preventiva: "Manutenzione preventiva", correttiva: "Intervento correttivo", straordinaria: "Intervento straordinario", verifica: "Verifica", calibrazione: "Calibrazione" })[j && j.type] || "Intervento";
}
function jobShortCode(j) {
return j && j.id ? "#" + String(j.id).replace(/-/g, "").slice(-6).toUpperCase() : "";
}
function withCreateMeta(record) {
const now = new Date().toISOString();
return Object.assign(Object.assign({}, record), { id: record.id || genUUID(), createdAt: record.createdAt || now, updatedAt: now });
}
function withUpdateMeta(record) {
return Object.assign(Object.assign({}, record), { updatedAt: new Date().toISOString() });
}
function customerPrefix(name) {
if (!name)
return "GEN";
const clean = String(name).replace(/[^A-Za-z0-9]/g, "");
if (clean.length === 0)
return "GEN";
return clean.slice(0, 3).toUpperCase();
}
function nextAssetCode(prefix, allAssets) {
let max = 0;
for (const a of (allAssets || [])) {
if (!a.assetCode)
continue;
const m = String(a.assetCode).match(/^(.+)-(\d+)$/);
if (m && m[1] === prefix) {
const n = parseInt(m[2], 10);
if (n > max)
max = n;
}
}
const num = String(max + 1).padStart(3, "0");
return prefix + "-" + num;
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
function isCloudPhoto(u) { return typeof u === "string" && u.lastIndexOf("http", 0) === 0 && u.indexOf("/job-photos/") !== -1; }
function uploadPhotoToCloud(dataUrl) {
return __awaiter(this, void 0, void 0, function* () {
try {
if (typeof OFFLINE_MODE !== "undefined" && OFFLINE_MODE)
return null;
if (typeof DEMO_LOCKED !== "undefined" && DEMO_LOCKED)
return null;
const client = yield getSupabaseClient();
if (!client)
return null;
const blob = yield (yield fetch(dataUrl)).blob();
const path = "job/" + Date.now() + "-" + Math.random().toString(36).slice(2, 10) + ".jpg";
const { error } = yield client.storage.from("job-photos").upload(path, blob, { contentType: "image/jpeg", upsert: false });
if (error)
return null;
const { data: pub } = client.storage.from("job-photos").getPublicUrl(path);
return (pub && pub.publicUrl) || null;
}
catch (e) {
return null;
}
});
}
function deleteCloudPhoto(url) {
return __awaiter(this, void 0, void 0, function* () {
try {
if (!isCloudPhoto(url))
return;
const client = yield getSupabaseClient();
if (!client)
return;
const tail = url.split("/job-photos/")[1];
if (!tail)
return;
yield client.storage.from("job-photos").remove([decodeURIComponent(tail.split("?")[0])]);
}
catch (e) { }
});
}
function compressImage(file, maxWidth = 1024, quality = 0.7) {
return new Promise((resolve, reject) => {
const reader = new FileReader();
reader.onload = e => {
const img = new Image();
img.onload = () => {
const canvas = document.createElement("canvas");
let w = img.width, h = img.height;
if (w > maxWidth) {
h = h * (maxWidth / w);
w = maxWidth;
}
canvas.width = w;
canvas.height = h;
const ctx = canvas.getContext("2d");
ctx.drawImage(img, 0, 0, w, h);
resolve(canvas.toDataURL("image/jpeg", quality));
};
img.onerror = reject;
img.src = e.target.result;
};
reader.onerror = reject;
reader.readAsDataURL(file);
});
}




function generateJobPDF(job, assets, parts, customers, company) {
const asset = assets.find(a => a.id === job.assetId) || {};
const customer = customers.find(c => c.id === (job.customerId || asset.customerId)) || {};
const partsTotal = (job.parts || []).reduce((s, p) => {
const pt = parts.find(x => x.id === p.partId);
return s + (pt ? (pt.sellPrice || pt.unitPrice) * p.qty : 0);
}, 0);
const laborTotal = job.laborHours * job.laborRate;
const total = partsTotal + laborTotal;
const PRI = { urgente: '#dc2626', alta: '#ea580c', normale: '#7c3aed', bassa: '#6b7280' };
const STA = { aperto: '#2563eb', 'in corso': '#d97706', chiuso: '#059669', 'fuori servizio': '#dc2626' };
const partsRows = (job.parts || []).map(p => {
const pt = parts.find(x => x.id === p.partId) || {};
const price = pt.sellPrice || pt.unitPrice || 0;
return `<tr>
<td style="font-family:monospace;font-size:10px">${pt.code || p.partId}</td>
<td>${pt.name || '—'}</td>
<td style="text-align:right">${p.qty}</td>
<td style="text-align:right">€${price.toFixed(2)}</td>
<td style="text-align:right;font-weight:700">€${(price * p.qty).toFixed(2)}</td>
</tr>`;
}).join('');
const tlRows = (job.timeline || []).map(t => `
<tr>
<td>${t.date}</td>
<td>${t.type}</td>
<td>${t.note || '—'}</td>
<td style="text-align:right">${t.hours ? t.hours + 'h' : '—'}</td>
</tr>`).join('');
const html = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8">
<title>Rapporto ${jobShortCode(job)}</title>
<style>${PDF_STYLE}</style></head><body><div class="wrap"><div class="side"></div><div class="main">
<div class="header">
<div>${company.logo ? `<img src="${company.logo}" class="brand-logo"/>` : `<h1>${(company.name || 'Documento')}</h1>`}${(company.logo && company.logoHasName) ? '' : `<div class="sub" style="font-weight:700;color:#0F172A;font-size:13px">${company.name || ''}</div>`}<div class="sub">${company.subtitle || ''}</div></div>
<div class="right">
<div class="doctype">Rapporto di intervento</div>
<div class="docnum">${jobShortCode(job)} · ${job.openDate || ""}</div>
<div style="font-size:10px;margin-top:4px">
<span class="badge" style="background:${PRI[job.priority] || '#6b7280'}22;color:${PRI[job.priority] || '#6b7280'};border:1px solid ${PRI[job.priority] || '#6b7280'}44">${job.priority.toUpperCase()}</span>
&nbsp;<span class="badge" style="background:${STA[job.status] || '#6b7280'}22;color:${STA[job.status] || '#6b7280'};border:1px solid ${STA[job.status] || '#6b7280'}44">${job.status.toUpperCase()}</span>
</div>
</div>
</div>
${customer.name ? `<div class="section">
<div class="section-title">Cliente</div>
<div class="kv-grid">
<div class="kv"><span class="kv-label">Ragione sociale</span><span class="kv-value">${customer.name}</span></div>
${customer.vat ? `<div class="kv"><span class="kv-label">P.IVA</span><span class="kv-value">${customer.vat}</span></div>` : ''}
${customer.address ? `<div class="kv"><span class="kv-label">Indirizzo</span><span class="kv-value">${customer.address}</span></div>` : ''}
</div>
</div>` : ''}
<div class="section">
<div class="section-title">Apparecchio</div>
<div class="kv-grid">
<div class="kv"><span class="kv-label">Nome</span><span class="kv-value">${asset.name || job.assetId}</span></div>
<div class="kv"><span class="kv-label">Marca / Modello</span><span class="kv-value">${asset.brand || ''} ${asset.model || ''}</span></div>
<div class="kv"><span class="kv-label">N° Serie</span><span class="kv-value" style="font-family:monospace">${asset.serial || '—'}</span></div>
<div class="kv"><span class="kv-label">Ubicazione</span><span class="kv-value">${asset.location || '—'}</span></div>
</div>
</div>
<div class="section">
<div class="section-title">Dettagli Intervento</div>
<div class="kv-grid">
<div class="kv"><span class="kv-label">Tipo</span><span class="kv-value" style="text-transform:capitalize">${job.type}</span></div>
<div class="kv"><span class="kv-label">Tecnico</span><span class="kv-value">${job.assignee || '—'}</span></div>
<div class="kv"><span class="kv-label">Data apertura</span><span class="kv-value">${job.openDate}</span></div>
<div class="kv"><span class="kv-label">Data chiusura</span><span class="kv-value">${job.closeDate || '—'}</span></div>
</div>
${job.description ? `<div class="desc-box" style="margin-top:8px">${job.description}</div>` : ''}
${(job.timeline && job.timeline.length > 0) ? `
<div style="margin-top:14px;padding-top:10px;border-top:1px solid #e5e7eb">
<div style="font-size:11px;font-weight:700;color:#1e293b;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">Timeline interventi</div>
<table style="width:100%;font-size:10px;border-collapse:collapse">
<thead><tr style="background:#f1f5f9;color:#64748b">
<th style="padding:5px 6px;text-align:left;border:1px solid #cbd5e1;width:90px">Data / Ora</th>
<th style="padding:5px 6px;text-align:left;border:1px solid #cbd5e1;width:140px">Tipo</th>
<th style="padding:5px 6px;text-align:left;border:1px solid #cbd5e1">Descrizione</th>
<th style="padding:5px 6px;text-align:right;border:1px solid #cbd5e1;width:50px">Min.</th>
<th style="padding:5px 6px;text-align:left;border:1px solid #cbd5e1;width:100px">Tecnico</th>
</tr></thead>
<tbody>
${job.timeline.map(t => `
<tr>
<td style="padding:5px 6px;border:1px solid #e5e7eb;font-family:monospace">${t.date || ''} ${t.time || ''}</td>
<td style="padding:5px 6px;border:1px solid #e5e7eb">${(t.type || '').replace(/_/g, ' ')}</td>
<td style="padding:5px 6px;border:1px solid #e5e7eb">${t.description || ''}</td>
<td style="padding:5px 6px;border:1px solid #e5e7eb;text-align:right;font-family:monospace">${t.durationMin || 0}</td>
<td style="padding:5px 6px;border:1px solid #e5e7eb">${t.technician || ''}</td>
</tr>
`).join('')}
</tbody>
<tfoot><tr style="background:#f8fafc;font-weight:700">
<td colspan="3" style="padding:5px 6px;border:1px solid #e5e7eb;text-align:right">Tempo totale lavorato:</td>
<td style="padding:5px 6px;border:1px solid #e5e7eb;text-align:right;font-family:monospace">${job.timeline.reduce((s, t) => s + (+t.durationMin || 0), 0)}</td>
<td style="padding:5px 6px;border:1px solid #e5e7eb;font-family:monospace">${(job.timeline.reduce((s, t) => s + (+t.durationMin || 0), 0) / 60).toFixed(1)}h</td>
</tr></tfoot>
</table>
</div>` : ''}
${job.notes ? `<div style="margin-top:6px;font-size:10px;color:#64748b"><strong>Note:</strong> ${job.notes}</div>` : ''}
</div>
<div class="section">
<div class="section-title">Parti Utilizzate</div>
<table>
<thead><tr><th>Codice</th><th>Parte</th><th style="text-align:right">Qtà</th><th style="text-align:right">P. Unit.</th><th style="text-align:right">Totale</th></tr></thead>
<tbody>${partsRows || '<tr><td colspan="5" style="text-align:center;color:#94a3b8">Nessuna parte utilizzata</td></tr>'}</tbody>
</table>
</div>
${tlRows ? `<div class="section">
<div class="section-title">Cronologia Intervento</div>
<table>
<thead><tr><th>Data</th><th>Tipo</th><th>Descrizione</th><th style="text-align:right">Ore</th></tr></thead>
<tbody>${tlRows}</tbody>
</table>
</div>` : ''}
<div style="display:flex;justify-content:flex-end;flex-direction:column;align-items:flex-end;gap:4px;margin-top:4px">
<div style="display:flex;justify-content:space-between;width:260px;padding:4px 0;border-bottom:1px solid #e2e8f0"><span style="color:#64748b">Parti</span><span style="font-weight:700">€${partsTotal.toFixed(2)}</span></div>
<div style="display:flex;justify-content:space-between;width:260px;padding:4px 0;border-bottom:1px solid #e2e8f0"><span style="color:#64748b">Manodopera (${job.laborHours}h × €${job.laborRate}/h)</span><span style="font-weight:700">€${laborTotal.toFixed(2)}</span></div>
<div class="total-box" style="width:260px"><span class="label">TOTALE INTERVENTO</span><span class="amount">€${total.toFixed(2)}</span></div>
</div>
<div style="margin-top:32px;display:flex">
<div style="width:200px;border-top:1px solid #94a3b8;padding-top:6px;text-align:center;font-size:10px;color:#64748b">Firma Tecnico Verificatore<br><br>${job.assignee || ''}</div>
</div>
<div class="footer">
<span>${(company.name || 'Documento')} — Generato il ${new Date().toLocaleDateString('it-IT')}</span>
<span>${job.id} · ${asset.serial || ''}</span>
</div>
</div></div></body></html>`;
openPrintWindow(html);
}
function generateInvoicePDF(invoice, customer, jobs, assets, parts, company) {
const subtotal = (invoice.items || []).reduce((s, it) => s + it.qty * it.unitPrice, 0);
const totalVAT = (invoice.items || []).reduce((s, it) => s + it.qty * it.unitPrice * it.vat / 100, 0);
const grandTotal = subtotal + totalVAT;
const STA = { bozza: '#6b7280', emessa: '#2563eb', pagata: '#059669', scaduta: '#dc2626', annullato: '#dc2626' };
const itemRows = (invoice.items || []).map(it => `<tr>
<td>${it.description}</td>
<td style="text-align:right">${it.qty}</td>
<td style="text-align:right">€${it.unitPrice.toFixed(2)}</td>
<td style="text-align:right">${it.vat}%</td>
<td style="text-align:right;font-weight:700">€${(it.qty * it.unitPrice).toFixed(2)}</td>
</tr>`).join('');
const html = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8">
<title>Preventivo ${invoice.number}</title>
<style>${PDF_STYLE}</style></head><body><div class="wrap"><div class="side"></div><div class="main">
<div class="header">
<div>
${company.logo ? `<img src="${company.logo}" class="brand-logo"/>` : `<h1>${(company.name || 'Documento')}</h1>`}
${(company.logo && company.logoHasName) ? '' : `<div class="sub" style="font-weight:700;color:#0F172A;font-size:13px">${company.name || ''}</div>`}
<div class="sub">${company.address || ''}</div>
${company.vat ? `<div class="sub">P.IVA: ${company.vat}</div>` : ''}
</div>
<div class="right">
<div class="doctype">Preventivo</div>
<div class="docnum">${invoice.number}</div>
<div style="font-size:10px;margin-top:4px">
<span class="badge" style="background:${STA[invoice.status] || '#6b7280'}22;color:${STA[invoice.status] || '#6b7280'};border:1px solid ${STA[invoice.status] || '#6b7280'}44">${invoice.status.toUpperCase()}</span>
</div>
<div style="font-size:10px;margin-top:4px;opacity:.8">Data: ${invoice.date}${invoice.dueDate ? ' · Scad: ' + invoice.dueDate : ''}</div>
</div>
</div>
<div class="section">
<div class="section-title">Cliente</div>
<div style="font-size:14px;font-weight:700;margin-bottom:4px">${(customer === null || customer === void 0 ? void 0 : customer.name) || '—'}</div>
${(customer === null || customer === void 0 ? void 0 : customer.address) ? `<div style="font-size:11px;color:#64748b">${customer.address}</div>` : ''}
${(customer === null || customer === void 0 ? void 0 : customer.vat) ? `<div style="font-size:11px;color:#64748b">P.IVA: ${customer.vat}</div>` : ''}
${(customer === null || customer === void 0 ? void 0 : customer.fiscalCode) ? `<div style="font-size:11px;color:#64748b">C.F.: ${customer.fiscalCode}</div>` : ''}
</div>
<div class="section">
<div class="section-title">Voci Preventivo</div>
<table>
<thead><tr><th>Descrizione</th><th style="text-align:right">Q.tà</th><th style="text-align:right">Prezzo Unit.</th><th style="text-align:right">IVA</th><th style="text-align:right">Importo</th></tr></thead>
<tbody>${itemRows}</tbody>
</table>
</div>
<div style="display:flex;justify-content:flex-end;flex-direction:column;align-items:flex-end;gap:4px">
<div style="display:flex;justify-content:space-between;width:280px;padding:4px 0;border-bottom:1px solid #e2e8f0"><span style="color:#64748b">Imponibile</span><span style="font-weight:700">€${subtotal.toFixed(2)}</span></div>
<div style="display:flex;justify-content:space-between;width:280px;padding:4px 0;border-bottom:1px solid #e2e8f0"><span style="color:#64748b">IVA</span><span style="font-weight:700">€${totalVAT.toFixed(2)}</span></div>
<div class="total-box" style="width:280px"><span class="label">TOTALE FATTURA</span><span class="amount">€${grandTotal.toFixed(2)}</span></div>
</div>
${invoice.paymentTerms ? `<div style="margin-top:16px;padding:10px;background:#f8fafc;border-radius:4px;font-size:10px"><strong>Modalità di pagamento:</strong> ${invoice.paymentTerms}${company.iban ? '<br><strong>IBAN:</strong> ' + company.iban : ''}</div>` : ''}
${invoice.notes ? `<div style="margin-top:8px;font-size:10px;color:#64748b"><strong>Note:</strong> ${invoice.notes}</div>` : ''}
<div class="footer">
<span>${(company.name || 'Documento')} — Generato il ${new Date().toLocaleDateString('it-IT')}</span>
<span>${invoice.number}</span>
</div>
</div></div></body></html>`;
openPrintWindow(html);
}
function generateClientReportPDF(customer, assets, iecReports, funcReports, jobs, company) {
const myAssets = assets.filter(a => a.customerId === customer.id);
const today = new Date();
today.setHours(0, 0, 0, 0);
const STATUS_LABEL = {
operativo: "Operativo", "in manutenzione": "In manutenzione",
"fuori servizio": "Fuori servizio", dismesso: "Dismesso",
};
const STATUS_COLOR = {
operativo: "#059669", "in manutenzione": "#d97706",
"fuori servizio": "#dc2626", dismesso: "#6b7280",
};
const totOperativi = myAssets.filter(a => a.status === "operativo" || !a.status).length;
const totFuoriServizio = myAssets.filter(a => a.status === "fuori servizio").length;
const scadute = myAssets.filter(a => {
if (!a.nextService)
return false;
const d = new Date(a.nextService);
d.setHours(0, 0, 0, 0);
return d < today;
}).length;
const verificheCliente = iecReports.filter(r => r.customerId === customer.id).length
+ funcReports.filter(r => r.customerId === customer.id).length;
const sorted = [...myAssets].sort((a, b) => {
if (!a.nextService)
return 1;
if (!b.nextService)
return -1;
return new Date(a.nextService) - new Date(b.nextService);
});
const rows = sorted.map(a => {
const st = a.status || "operativo";
let scadColor = "#1a202c", scadNote = "";
if (a.nextService) {
const d = new Date(a.nextService);
d.setHours(0, 0, 0, 0);
const days = Math.round((d - today) / 86400000);
if (days < 0) {
scadColor = "#dc2626";
scadNote = " (scaduta)";
}
else if (days <= 30) {
scadColor = "#d97706";
scadNote = " (" + days + "gg)";
}
}
return `<tr>
<td style="font-weight:700">${a.name || "—"}</td>
<td>${[a.brand, a.model].filter(Boolean).join(" ") || "—"}</td>
<td style="font-family:monospace;font-size:10px">${a.serial || "—"}</td>
<td>${a.location || "—"}</td>
<td><span class="badge" style="background:${STATUS_COLOR[st]}22;color:${STATUS_COLOR[st]}">${STATUS_LABEL[st] || st}</span></td>
<td>${a.lastService || "—"}</td>
<td style="color:${scadColor};font-weight:${scadNote ? "700" : "400"}">${a.nextService ? a.nextService + scadNote : "—"}</td>
</tr>`;
}).join("");
const assetById = {};
myAssets.forEach(a => assetById[a.id] = a);
const allVerifiche = [
...iecReports.filter(r => r.customerId === customer.id || assetById[r.assetId])
.map(r => {
var _a, _b;
return ({ date: r.date || "", kind: "Sicurezza elettrica", norm: r.norm === '61010' ? 'IEC 61010' : r.norm === '60601' ? 'IEC 60601-1' : 'EN 62353',
asset: ((_a = assetById[r.assetId]) === null || _a === void 0 ? void 0 : _a.name) || "—", serial: ((_b = assetById[r.assetId]) === null || _b === void 0 ? void 0 : _b.serial) || "",
num: r.reportNumber || r.id || "", pass: r.overallPass });
}),
...funcReports.filter(r => r.customerId === customer.id || assetById[r.assetId])
.map(r => {
var _a, _b;
return ({ date: r.date || "", kind: "Funzionale", norm: r.templateName || r.template || "—",
asset: ((_a = assetById[r.assetId]) === null || _a === void 0 ? void 0 : _a.name) || "—", serial: ((_b = assetById[r.assetId]) === null || _b === void 0 ? void 0 : _b.serial) || "",
num: r.reportNumber || r.id || "", pass: r.overallPass });
}),
].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
const verRows = allVerifiche.map(v => {
const esito = v.pass === true ? '<span class="badge" style="background:#05966922;color:#059669">CONFORME</span>'
: v.pass === false ? '<span class="badge" style="background:#dc262622;color:#dc2626">NON CONF.</span>'
: '<span class="badge" style="background:#94a3b822;color:#64748b">—</span>';
return `<tr>
<td>${v.date || "—"}</td>
<td style="font-weight:700">${v.asset}</td>
<td style="font-family:monospace;font-size:10px">${v.serial || "—"}</td>
<td>${v.kind}</td>
<td>${v.norm}</td>
<td>${esito}</td>
</tr>`;
}).join("");
const dateStr = new Date().toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" });
const html = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8">
<title>Report parco macchine - ${customer.name}</title>
<style>${PDF_STYLE}
.stat-row { display:flex; gap:10px; margin:12px 0; }
.stat { flex:1; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px 12px; text-align:center; }
.stat .n { font-size:22px; font-weight:900; color:#1F7468; }
.stat .l { font-size:9px; color:#64748b; text-transform:uppercase; letter-spacing:.5px; margin-top:3px; }
</style></head><body><div class="wrap"><div class="side"></div><div class="main">
<div class="header">
<div>
${company.logo ? `<img src="${company.logo}" class="brand-logo"/>` : `<h1>${company.name || "Report"}</h1>`}
${(company.logo && company.logoHasName) ? '' : `<div class="sub" style="font-weight:700;color:#0F172A;font-size:13px">${company.name || ''}</div>`}
<div class="sub">${company.subtitle || ""}</div>
</div>
<div class="right">
<div class="doctype">Fascicolo Parco Macchine</div>
<div class="docdate">${dateStr}</div>
</div>
</div>
<div class="section">
<div class="section-title">Cliente</div>
<div class="kv-grid">
<div class="kv"><span class="kv-label">Ragione sociale</span><span class="kv-value">${customer.name}</span></div>
${customer.vat ? `<div class="kv"><span class="kv-label">P.IVA</span><span class="kv-value">${customer.vat}</span></div>` : ""}
${customer.address ? `<div class="kv"><span class="kv-label">Indirizzo</span><span class="kv-value">${customer.address}</span></div>` : ""}
${customer.contact ? `<div class="kv"><span class="kv-label">Riferimento</span><span class="kv-value">${customer.contact}</span></div>` : ""}
</div>
</div>
<div class="stat-row">
<div class="stat"><div class="n">${myAssets.length}</div><div class="l">Apparecchi</div></div>
<div class="stat"><div class="n" style="color:#059669">${totOperativi}</div><div class="l">Operativi</div></div>
<div class="stat"><div class="n" style="color:${totFuoriServizio > 0 ? '#dc2626' : '#1F7468'}">${totFuoriServizio}</div><div class="l">Fuori servizio</div></div>
<div class="stat"><div class="n" style="color:${scadute > 0 ? '#dc2626' : '#1F7468'}">${scadute}</div><div class="l">Verifiche scadute</div></div>
<div class="stat"><div class="n">${verificheCliente}</div><div class="l">Verifiche svolte</div></div>
</div>
<div class="section">
<div class="section-title">Elenco apparecchi (${myAssets.length})</div>
${myAssets.length === 0 ? '<div style="color:#94a3b8;padding:16px;text-align:center">Nessun apparecchio registrato per questo cliente.</div>' : `
<table>
<thead><tr>
<th>Apparecchio</th><th>Marca/Modello</th><th>N. Serie</th><th>Ubicazione</th>
<th>Stato</th><th>Ultima manut.</th><th>Prossima manut.</th>
</tr></thead>
<tbody>${rows}</tbody>
</table>`}
</div>
<div class="section">
<div class="section-title">Elenco verifiche (${allVerifiche.length})</div>
${allVerifiche.length === 0 ? '<div style="color:#94a3b8;padding:16px;text-align:center">Nessuna verifica registrata per questo cliente.</div>' : `
<table>
<thead><tr>
<th>Data</th><th>Apparecchio</th><th>N. Serie</th><th>Tipo</th><th>Norma/Modello</th><th>Esito</th>
</tr></thead>
<tbody>${verRows}</tbody>
</table>`}
</div>
<div class="footer">
<div>${company.name || ""} ${company.vat ? "· P.IVA " + company.vat : ""}</div>
<div>Generato il ${dateStr}</div>
</div>
</div></div></body></html>`;
openPrintWindow(html);
}






function assetHasOpenRecall(assetId, recalls) {
if (!assetId || !recalls) return false;
for (var i = 0; i < recalls.length; i++) {
var r = recalls[i];
if (!r || r.deleted || r.status === "chiuso") continue;
var aff = r.affected || [];
for (var j = 0; j < aff.length; j++) {
if (aff[j] && aff[j].assetId === assetId) { var st = aff[j].status; if (!st || st === "Da verificare") return true; }
}
}
return false;
}
function assetOpenRecall(assetId, recalls) {
if (!assetId || !recalls) return null;
for (var i = 0; i < recalls.length; i++) {
var r = recalls[i];
if (!r || r.deleted || r.status === "chiuso") continue;
var aff = r.affected || [];
for (var j = 0; j < aff.length; j++) {
if (aff[j] && aff[j].assetId === assetId) { var st = aff[j].status; if (!st || st === "Da verificare") return r; }
}
}
return null;
}
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
function blankTemplate() {
return {
id: "custom_" + Date.now(),
label: "", icon: "›", norm: "",
isCustom: true,
sections: [
{ id: "sez1", title: "Ispezione visiva", items: [{ id: "item1", text: "" }], measures: [] },
],
};
}
// ===== PPM (Manutenzione Programmata) — checklist meccaniche/manutentive =====
// Checklist di DEFAULT per CATEGORIA (stesso id dei template funzionali).
// Le voci specifiche per MODELLO si aggiungono via custom e vengono UNITE a queste.
const PPM_CHECKLISTS_DEFAULT = {
pompa_infusionale: { label: "Pompa d'infusione / siringa", items: [
"Pulizia esterna e disinfezione delle superfici",
"Pulizia sensori (aria, pressione, occlusione)",
"Controllo/pulizia meccanismo peristaltico / sede e fissaggio siringa",
"Controllo sportello, ganci e guarnizioni di tenuta",
"Controllo integrità cavo di alimentazione, spina e connettori",
"Sostituzione batteria a fine vita (verifica età/autonomia)",
] },
ventilatore: { label: "Ventilatore polmonare", items: [
"Pulizia esterna e disinfezione delle superfici",
"Sostituzione / pulizia filtri (paziente, raffreddamento, antibatterici)",
"Pulizia sensori di flusso e di ossigeno; sostituzione cella O2 a fine vita",
"Controllo/pulizia valvole espiratorie e circuito paziente",
"Controllo cavo alimentazione e collegamenti gas",
"Sostituzione batteria a fine vita",
] },
defibrillatore: { label: "Defibrillatore", items: [
"Pulizia esterna e disinfezione delle superfici",
"Controllo piastre / connettori elettrodi e cavi",
"Sostituzione/controllo batteria (stato e scadenza)",
"Controllo integrità cavo alimentazione e caricabatteria",
"Sostituzione consumabili scaduti o esauriti (elettrodi, carta, gel)",
] },
dae: { label: "DAE — defibrillatore semiautomatico", items: [
"Pulizia esterna e disinfezione delle superfici",
"Sostituzione/controllo batteria (stato e scadenza)",
"Sostituzione/controllo piastre/elettrodi (scadenza e integrità)",
] },
elettrobisturi: { label: "Elettrobisturi / Unità HF", items: [
"Pulizia esterna e disinfezione delle superfici",
"Controllo cavi, manipoli e pedaliera; sostituzione se danneggiati",
"Pulizia griglie e controllo ventole di raffreddamento",
"Controllo integrità cavo alimentazione e connettori",
] },
monitor_multipar: { label: "Monitor multiparametrico", items: [
"Pulizia esterna e disinfezione delle superfici",
"Controllo cavi paziente, sensori e connettori; sostituzione se usurati",
"Sostituzione batteria a fine vita",
"Pulizia ventole / griglie di aerazione",
"Controllo integrità cavo alimentazione",
] },
aspiratore_chirurgico: { label: "Aspiratore chirurgico", items: [
"Pulizia esterna e disinfezione delle superfici",
"Sostituzione filtro antibatterico/antivirale (e ad ogni contatto con liquidi)",
"Controllo/sostituzione vaso di raccolta, tubi e guarnizioni",
"Controllo integrità cavo alimentazione",
] },
generico: { label: "Generico", items: [
"Pulizia esterna e disinfezione delle superfici",
"Controllo integrità cavo alimentazione, spina e connettori",
"Sostituzione batteria a fine vita (se presente)",
"Controllo accessori ed etichette; sostituzione parti di usura",
] },
bbraun_infusomat_space_tsc: { label: "Pompa infusione B.Braun Infusomat Space", items: [
"Pulizia esterna e disinfezione (Meliseptol); controllo sportello, guida linea e morsetti",
"Pulizia sensori (aria, pressione, occlusione)",
"Controllo/pulizia dita peristaltiche / membrana di pompaggio",
"Sostituzione batteria (Battery-Pack SP) a fine vita; verifica età/autonomia",
] },
audiometro: { label: "Audiometro", items: [
"Pulizia esterna, cuscinetti cuffie e archetto",
"Controllo cavi cuffie/auricolari e pulsante risposta paziente",
"Sostituzione cuscinetti auricolari usurati",
"Controllo integrità cavo alimentazione",
] },
spirometro: { label: "Spirometro", items: [
"Pulizia esterna e disinfezione",
"Pulizia/sostituzione boccagli e filtri antibatterici",
"Controllo trasduttore di flusso (turbina/PNT) e tubo",
] },
frigoemoteca: { label: "Frigoemoteca / frigo farmaci", items: [
"Pulizia esterna/interna; controllo e sostituzione guarnizioni porta usurate",
"Pulizia condensatore/filtro e griglie di ventilazione",
"Controllo registratore/datalogger; sostituzione batteria di backup allarme a fine vita",
] },
bilancia: { label: "Bilancia pesapersone / pesaneonati", items: [
"Pulizia piatto e struttura",
"Controllo stabilità, livella e piedini",
"Sostituzione batteria a fine vita",
] },
concentratore_ossigeno: { label: "Concentratore di ossigeno", items: [
"Pulizia esterna; pulizia/sostituzione filtro aria di ingresso",
"Sostituzione filtri prodotto/HEPA secondo costruttore",
"Controllo/sostituzione umidificatore e tenute",
] },
eeg: { label: "Elettroencefalografo (EEG)", items: [
"Pulizia esterna; pulizia elettrodi, cuffia e cavi",
"Sostituzione elettrodi/cuffia usurati",
"Controllo connettori e integrità cavi",
] },
dialisi: { label: "Apparecchio per emodialisi", items: [
"Pulizia esterna e disinfezione del percorso idraulico (cicli di disinfezione)",
"Sostituzione filtri (ingresso acqua, dializzato), guarnizioni e O-ring",
"Controllo/sostituzione parti di usura delle pompe (sangue, UF)",
] },
capnografo: { label: "Capnografo / monitor gas respiratori", items: [
"Pulizia esterna; sostituzione water trap e linea di campionamento",
"Pulizia cella di misura e cuvetta",
"Controllo/sostituzione parti di usura della pompa di aspirazione",
] },
tavolo_operatorio: { label: "Tavolo operatorio", items: [
"Pulizia/disinfezione superfici e materassini; sostituzione cuscini usurati",
"Lubrificazione snodi e controllo attuatori idraulici/elettrici",
"Controllo blocchi/freni e stabilità",
"Sostituzione batteria telecomando a fine vita",
] },
culla_termica: { label: "Culla termica / radiant warmer", items: [
"Pulizia/disinfezione superfici e sonde",
"Controllo sonda cute e cavo; sostituzione se danneggiati",
"Pulizia e controllo riscaldatore radiante",
] },
holter_ecg: { label: "Holter ECG", items: [
"Pulizia esterna; controllo/sostituzione cavi paziente",
"Controllo vano batteria e contatti; sostituzione batteria",
"Pulizia contatti caricabatteria (se presente)",
] },
riunito_odontoiatrico: { label: "Riunito odontoiatrico", items: [
"Pulizia/disinfezione riunito e sputacchiera; cicli di disinfezione condotte idriche",
"Sostituzione filtri (aspirazione, aria/acqua), guarnizioni e O-ring dei manipoli",
"Lubrificazione/manutenzione manipoli secondo costruttore",
"Controllo poltrona (snodi, freni); lubrificazione",
] },
elettrocardiografo: { label: "Elettrocardiografo (ECG)", items: [
"Pulizia esterna; controllo/sostituzione cavo paziente ed elettrodi",
"Sostituzione carta stampante; pulizia testina e rullo",
"Sostituzione batteria a fine vita",
] },
sfigmomanometro: { label: "Sfigmomanometro automatico (NIBP)", items: [
"Pulizia esterna; controllo bracciali, tubi e raccordi",
"Sostituzione bracciali e tubi usurati",
"Sostituzione batteria a fine vita",
] },
termometro_clinico: { label: "Termometro clinico elettronico", items: [
"Pulizia/disinfezione sonda e involucro",
"Sostituzione copri-sonda; controllo/sostituzione puntale",
"Sostituzione batteria a fine vita",
] },
incubatrice_neonatale: { label: "Incubatrice neonatale", items: [
"Pulizia/disinfezione cupola, materassino e umidificatore",
"Sostituzione/pulizia filtro aria; sostituzione guarnizioni cupola usurate",
"Controllo e pulizia ventola di circolazione",
] },
lampada_scialitica: { label: "Lampada scialitica", items: [
"Pulizia maniglie sterilizzabili e cupola",
"Controllo snodi/bracci, stabilità e bilanciamento; lubrificazione",
"Sostituzione LED/lampade a fine vita; sostituzione batteria di emergenza",
] },
fototerapia_neonatale: { label: "Lampada fototerapia neonatale", items: [
"Pulizia esterna e superfici",
"Sostituzione sorgenti (LED/tubi) a fine vita; verifica ore di funzionamento",
"Pulizia e controllo ventilazione",
] },
elettrostimolatore: { label: "Elettrostimolatore / TENS", items: [
"Pulizia esterna; controllo cavi ed elettrodi",
"Sostituzione elettrodi/gel usurati",
"Sostituzione batteria a fine vita",
] },
autoclave: { label: "Autoclave / sterilizzatrice a vapore", items: [
"Pulizia camera, guarnizione portello e filtro; controllo tenuta portello",
"Sostituzione guarnizione portello e filtri secondo costruttore",
"Controllo qualità acqua di alimentazione e pulizia serbatoi",
"Nota: convalida prestazionale/biologica del processo = attività specialistica separata",
] },
pulsossimetro: { label: "Pulsossimetro / SpO2", items: [
"Pulizia esterna; controllo/sostituzione sensore e cavo",
"Sostituzione sensori/parti monouso usurati",
"Sostituzione batteria a fine vita",
] },
ecografo: { label: "Ecografo", items: [
"Pulizia/disinfezione sonde e involucro; pulizia/sostituzione filtri di ventilazione",
"Ispezione sonde (lente, cavo, connettore) per crepe/distacchi",
"Pulizia trackball/tastiera; sostituzione batteria/UPS a fine vita",
] },
letto_elettrico: { label: "Letto elettrico / barella motorizzata", items: [
"Pulizia/disinfezione superfici e sponde",
"Controllo attuatori e pulsantiera; lubrificazione snodi",
"Controllo freni, ruote e stabilità",
"Sostituzione batteria di backup a fine vita",
] },
};
// Custom: aggiunte per CATEGORIA (byCat) e per MODELLO (byModel, key = "marca|modello"), in localStorage.
const PPM_CHECKLIST_KEY = "medtrace-ppm-checklists";
function loadPpmChecklists() {
try { const r = localStorage.getItem(PPM_CHECKLIST_KEY); return r ? JSON.parse(r) : { byCat: {}, byModel: {} }; }
catch (e) { return { byCat: {}, byModel: {} }; }
}
function savePpmChecklists(data) {
try { localStorage.setItem(PPM_CHECKLIST_KEY, JSON.stringify(data)); return true; } catch (e) { return false; }
}
function ppmModelKey(asset) {
const b = ((asset && asset.brand) || "").trim().toLowerCase();
const m = ((asset && asset.model) || "").trim().toLowerCase();
return (b || m) ? (b + "|" + m) : "";
}
// Categoria PPM = stessa logica di auto-rilevamento dei template funzionali.
function ppmCategoryId(asset) {
return cndToTemplate((asset && asset.cnd) || "") || guessTemplate((asset && asset.name) || "") || "generico";
}
// Helper di normalizzazione (minuscolo, senza accenti, spazi compattati) per il match di modello.
function ppmNorm(s) { return (s == null ? "" : String(s)).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim(); }
// Checklist di DEFAULT per MODELLO, pre-caricate dal codice. Si AGGIUNGONO a quelle di categoria.
// "model"/"brand" sono sottostringhe normalizzate cercate in marca/modello/nome dell'apparecchio.
const PPM_MODEL_DEFAULTS = [
{ brand: "drager", model: "oxylog 3000", label: "Dräger Oxylog 3000 plus", items: [
"Sostituzione kit manutenzione annuale: cartuccia/filtro presa aria fresca, guarnizioni e O-ring, membrane/valvole di usura (1 anno)",
"Controllo/sostituzione sensore di flusso (1 anno)",
"Controllo cella sensore O2 e sostituzione a fine vita (1 anno / su condizione)",
"Service tecnico completo + ispezione di sicurezza \u2014 kit 2 anni, include il kit annuale (2 anni)",
"Sostituzione batteria interna \u2014 kit 4 anni = kit 2 anni + kit 1 anno + batteria (4 anni)",
"Revisione estesa \u2014 kit manutenzione 6 anni (6 anni)",
"Ciclo kit: dopo il 6\u00b0 anno si riparte da capo (anno 7 = anno 1) (nota)"
] }
];
// Restituisce le voci di default del MODELLO se l'apparecchio corrisponde, altrimenti null.
function ppmModelDefaults(asset) {
var bm = ppmNorm((asset && asset.brand) || "");
var mm = ppmNorm((asset && asset.model) || "") + " " + ppmNorm((asset && asset.name) || "");
for (var i = 0; i < PPM_MODEL_DEFAULTS.length; i++) {
var e = PPM_MODEL_DEFAULTS[i];
var brandOk = !e.brand || bm.indexOf(e.brand) >= 0 || mm.indexOf(e.brand) >= 0;
var modelOk = mm.indexOf(e.model) >= 0;
if (brandOk && modelOk) return e.items;
}
return null;
}
// Voci checklist UNITE: categoria default + categoria custom + modello custom (deduplicate).
function getPpmChecklist(asset, custom) {
const data = custom || loadPpmChecklists();
const catId = ppmCategoryId(asset);
const out = []; const seen = {};
const push = (txt) => { const t = (txt || "").trim(); if (!t) return; const k = t.toLowerCase(); if (seen[k]) return; seen[k] = 1; out.push(t); };
const catOv = (data.byCat || {})[catId];
const catItems = (catOv && catOv.items) ? catOv.items : (((PPM_CHECKLISTS_DEFAULT[catId] || {}).items) || []);
catItems.forEach(push);
var _mdItems = ppmModelDefaults(asset); if (_mdItems) _mdItems.forEach(push);
const mk = ppmModelKey(asset); const mc = mk ? (data.byModel || {})[mk] : null; if (mc && mc.items) mc.items.forEach(push);
return { categoryId: catId, modelKey: mk, items: out };
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
function ScadenzePage({ scadenze, company, onEmail, onOpenAsset }) {
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
function ScadenzaEmailModal({ sc, company, onClose }) {
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
function HelpTab({ helpOpen, setHelpOpen }) {
const [legal, setLegal] = React.useState(null);
return (React.createElement("div", { style: { maxWidth: 860, margin: "0 auto" } },
React.createElement("div", { style: { marginBottom: 24 } },
React.createElement("h1", { style: { margin: "0 0 4px", fontSize: 22, fontWeight: 900, color: "var(--text-bright)" } }, "Guida all'uso"),
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
React.createElement("div", { style: { fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.7, whiteSpace: "pre-line", maxHeight: "70vh", overflow: "auto" } }, legal === "privacy" ? PRIVACY_TEXT : TERMS_TEXT)))));
}
const Badge = ({ text, color }) => (React.createElement("span", { style: { background: color + "18", color, border: "1px solid " + (color) + "40", borderRadius: 20, padding: "2px 10px", fontSize: 10, fontWeight: 700, letterSpacing: .5, textTransform: "uppercase", whiteSpace: "nowrap" } }, text));
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
const errorBorderStyle = (baseStyle, hasError) => {
if (!hasError)
return baseStyle;
return Object.assign(Object.assign({}, baseStyle), { borderColor: "#ef4444", background: "#ef444408" });
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
const EmptyState = ({ icon, title, subtitle, actions = [], compact = false }) => {
return (React.createElement("div", { style: {
textAlign: "center",
padding: compact ? "30px 18px" : "48px 24px",
background: "var(--bg-2)",
borderRadius: 14,
border: "1px dashed var(--border)",
maxWidth: 460,
margin: "12px auto"
} },
icon && (React.createElement("div", { style: {
fontSize: compact ? 36 : 48,
marginBottom: 14,
opacity: 0.4,
filter: "grayscale(0.3)"
} }, icon)),
title && (React.createElement("div", { style: {
fontSize: compact ? 14 : 16,
fontWeight: 700,
color: "var(--text)",
marginBottom: subtitle ? 6 : 16
} }, title)),
subtitle && (React.createElement("div", { style: {
fontSize: 12,
color: "var(--text-3)",
lineHeight: 1.6,
marginBottom: actions.length > 0 ? 20 : 0,
maxWidth: 360,
marginLeft: "auto",
marginRight: "auto"
} }, subtitle)),
actions.length > 0 && (React.createElement("div", { style: {
display: "flex",
gap: 10,
justifyContent: "center",
flexWrap: "wrap"
} }, actions.map((a, i) => (React.createElement("button", { key: i, onClick: a.onClick, style: {
background: a.primary ? "#2dd4bf" : "transparent",
color: a.primary ? "#0a0a0e" : "var(--text-2)",
border: a.primary ? "none" : "1px solid var(--border)",
borderRadius: 8,
padding: "9px 18px",
fontSize: 13,
fontWeight: 700,
cursor: "pointer",
touchAction: "manipulation",
WebkitTapHighlightColor: "transparent",
transition: "all .15s"
} }, a.label)))))));
};
const MobileSearch = ({ value, onChange, count, total, placeholder }) => (React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, background: "var(--bg-2)", border: "1px solid var(--border-2)", borderRadius: 10, padding: "8px 12px", marginBottom: 10 } },
React.createElement("span", { style: { fontSize: 14, color: "var(--text-3)" } }, "\uD83D\uDD0D"),
React.createElement("input", { "data-mt-search": "1", value: value, onChange: e => onChange(e.target.value), placeholder: placeholder || "Cerca…", style: { flex: 1, background: "transparent", border: "none", color: "var(--text)", fontSize: 14, outline: "none", minWidth: 0 } }),
value && (React.createElement("button", { onClick: () => onChange(""), style: { background: "none", border: "none", color: "var(--text-3)", fontSize: 16, cursor: "pointer", padding: "0 4px", touchAction: "manipulation" } }, "\u2715")),
React.createElement("span", { style: { fontSize: 10, color: "var(--text-4)", fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" } },
count,
"/",
total)));
const SwipeableCard = ({ children, onDelete, threshold = 80 }) => {
const [dx, setDx] = React.useState(0);
const [startX, setStartX] = React.useState(null);
const [startY, setStartY] = React.useState(null);
const [locked, setLocked] = React.useState(false);
const onTouchStart = (e) => {
const t = e.touches[0];
setStartX(t.clientX);
setStartY(t.clientY);
setLocked(false);
};
const onTouchMove = (e) => {
if (startX === null)
return;
const t = e.touches[0];
const deltaX = t.clientX - startX;
const deltaY = t.clientY - startY;
if (!locked) {
if (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
setLocked(true);
}
else if (Math.abs(deltaY) > 8) {
setStartX(null);
setStartY(null);
setDx(0);
return;
}
}
if (locked) {
if (deltaX < 0)
setDx(Math.max(deltaX, -140));
else
setDx(0);
}
};
const onTouchEnd = () => {
if (dx < -threshold) {
setDx(-100);
setTimeout(() => { onDelete && onDelete(); setDx(0); }, 80);
}
else {
setDx(0);
}
setStartX(null);
setStartY(null);
setLocked(false);
};
return (React.createElement("div", { style: { position: "relative", overflow: "hidden", borderRadius: 12 } },
React.createElement("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 0%, #ef4444 60%)", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 20px", pointerEvents: "none" } },
React.createElement("span", { style: { color: "#fff", fontSize: 14, fontWeight: 800, opacity: dx < -30 ? 1 : 0, transition: "opacity .15s" } }, "\u2715 Elimina")),
React.createElement("div", { onTouchStart: onTouchStart, onTouchMove: onTouchMove, onTouchEnd: onTouchEnd, style: {
transform: `translateX(${dx}px)`,
transition: startX === null ? "transform .2s ease" : "none",
position: "relative",
background: "transparent",
} }, children)));
};
const FilterDropdown = ({ filters, onChange, onClearAll }) => {
const [open, setOpen] = React.useState(false);
const activeCount = Object.values(filters).filter(f => f.value).length;
return (React.createElement("div", { style: { marginBottom: 10 } },
React.createElement("button", { onClick: () => setOpen(o => !o), style: {
width: "100%",
display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
background: activeCount > 0 ? "#2dd4bf15" : "var(--bg-2)",
border: "1px solid " + (activeCount > 0 ? "#2dd4bf55" : "var(--border-2)"),
borderRadius: 10, padding: "9px 14px",
color: activeCount > 0 ? "#2dd4bf" : "var(--text-2)", fontSize: 13, fontWeight: 700,
cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent"
} },
React.createElement("span", { style: { display: "flex", alignItems: "center", gap: 8 } },
"Filtri ",
activeCount > 0 && React.createElement("span", { style: { background: "#2dd4bf", color: "#000", borderRadius: 10, padding: "1px 8px", fontSize: 11, fontWeight: 800 } }, activeCount)),
React.createElement("span", { style: { fontSize: 11, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" } }, "\u25BC")),
open && (React.createElement("div", { style: { marginTop: 8, background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 } },
Object.entries(filters).map(([key, fdef]) => (React.createElement("div", { key: key },
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 5 } }, fdef.label),
React.createElement("select", { value: fdef.value, onChange: e => onChange(key, e.target.value), style: {
width: "100%", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6,
padding: "7px 10px", color: "var(--text)", fontSize: 13, outline: "none",
fontFamily: "inherit", appearance: "none", paddingRight: 30,
} },
React.createElement("option", { value: "" }, "\u2014 Tutti \u2014"),
fdef.options.map(opt => (React.createElement("option", { key: opt, value: opt }, opt))))))),
activeCount > 0 && (React.createElement("button", { onClick: onClearAll, style: { background: "transparent", color: "#ef4444", border: "1px solid #ef444433", borderRadius: 6, padding: "7px 10px", cursor: "pointer", fontSize: 12, fontWeight: 700, marginTop: 4, touchAction: "manipulation" } }, "\u2715 Pulisci tutti i filtri"))))));
};
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
React.createElement("div", { style: { fontSize: 22, fontWeight: 900, color: c, lineHeight: 1, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: -0.5 } }, value),
React.createElement("div", { style: { fontSize: 10, color: "#7A7A8E", marginTop: 6, textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } }, label),
sub && React.createElement("div", { style: { fontSize: 9, color: "#4A4A60", marginTop: 2 } }, sub),
clickable && React.createElement("div", { style: { position: "absolute", bottom: 6, right: 9, fontSize: 11, color: c + "99", fontWeight: 600 } }, "\u203A")));
};

function AssetCard({ a, customer, onEdit, onDelete, onHistory }) {
return (React.createElement("div", { style: { background: "var(--surface-2)", borderRadius: 12, padding: "14px 16px", border: "1px solid var(--border)", marginBottom: 8 } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 10 } },
React.createElement("div", { style: { minWidth: 0 } },
React.createElement("div", { style: { fontWeight: 700, fontSize: 15 } }, a.name),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 2 } },
a.assetCode || a.id,
" \u00B7 ",
a.brand,
" ",
a.model)),
React.createElement(Badge, { text: a.status, color: STATUS_COLOR[a.status] || "var(--text-3)" })),
React.createElement("div", { style: { display: "flex", gap: 14, fontSize: 12, color: "var(--text-2)", flexWrap: "wrap", marginBottom: 12 } },
(customer === null || customer === void 0 ? void 0 : customer.name) && React.createElement("span", null,
" ",
customer.name),
a.location && React.createElement("span", null,
"\u00B7 ",
a.location),
a.nextService && React.createElement("span", null,
" ",
a.nextService)),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: () => onHistory(a) }, " Storico"),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: () => onEdit(a) }, "\u270F Modifica"),
React.createElement(Btn, { sm: true, variant: "danger", onClick: () => onDelete(a.id) }, "\u2715"))));
}
function PortaleClienteBox({ customer, isSuperuser }) {
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
function _ic(kids) {
return React.createElement("svg", { width: 17, height: 17, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" }, kids);
}
const ICON_MONITOR = _ic([React.createElement("rect", { key: "a", x: 2, y: 3, width: 20, height: 14, rx: 2 }), React.createElement("path", { key: "b", d: "M8 21h8M12 17v4" })]);
const ICON_TOOL = _ic(React.createElement("path", { d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" }));
const ICON_ZAP = _ic(React.createElement("path", { d: "M13 2 3 14h9l-1 8 10-12h-9l1-8z" }));
const ICON_ACTIVITY = _ic(React.createElement("path", { d: "M22 12h-4l-3 9-6-18-3 9H2" }));
const ICON_BUILDING = _ic([React.createElement("rect", { key: "a", x: 4, y: 3, width: 16, height: 18, rx: 1 }), React.createElement("path", { key: "b", d: "M9 8h.01M15 8h.01M9 12h.01M15 12h.01M10 21v-4h4v4" })]);
const ICON_EDIT = _ic([React.createElement("path", { key: "a", d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }), React.createElement("path", { key: "b", d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })]);
const ICON_PLUS = _ic(React.createElement("path", { d: "M12 5v14M5 12h14" }));
const ICON_TAG = _ic([React.createElement("path", { key: "a", d: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" }), React.createElement("path", { key: "b", d: "M7 7h.01" })]);
const ICON_PIN = _ic([React.createElement("path", { key: "a", d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }), React.createElement("circle", { key: "b", cx: 12, cy: 10, r: 3 })]);
function KpiPage({ assets, jobs, customers, iecReports, funcReports, parts, isMobile }) {
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
function impNorm(t) { return String(t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, ""); }
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
function ImportAssetsModal({ customers, assets, onImport, onClose }) {
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
React.createElement("div", { style: { fontSize: 15, fontWeight: 600, color: "#22c55e" } }, "\u2713 Importazione completata"),
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
"\uD83D\uDCC4 Tocca per scegliere il file",
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
function parseRfidScan(json) {
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
function fmtDateTimeIt(dateStr) {
if (!dateStr) return "";
const str = String(dateStr);
const d = new Date(str);
if (isNaN(d.getTime())) return str;
const p = n => String(n).padStart(2, "0");
const dmy = p(d.getDate()) + "/" + p(d.getMonth() + 1) + "/" + d.getFullYear();
return /T\d{2}:\d{2}/.test(str) ? (dmy + " " + p(d.getHours()) + ":" + p(d.getMinutes())) : dmy;
}
function AssetForm({ initial, customers, assets = [], onSave, onClose }) {
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
React.createElement("button", { onClick: () => setShowAdv(v => !v), style: { background: "transparent", border: "1px dashed var(--border)", borderRadius: 8, color: "var(--text-2)", padding: "9px", cursor: "pointer", fontSize: 12.5, fontWeight: 700 } }, showAdv ? "− Nascondi dettagli avanzati" : "+ Mostra dettagli avanzati (date, norma, garanzia…)"),
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
React.createElement("option", { value: "C" }, "Classe C \u2014 Alto rischio")), React.createElement(Span2, null, React.createElement("div", { style: { position: "relative" } }, React.createElement(Inp, { label: "\uD83D\uDD0D Catalogo CND \u2014 cerca tipo apparecchiatura", value: cndQuery, onChange: e => setCndQuery(e.target.value), placeholder: "es. defibrillatore, ventilatore polmonare, elettrobisturi\u2026", hint: "Classificazione ufficiale Ministero Salute \u2014 compila CND + CIVAB + EMDN in automatico" }), cndMatches.length > 0 && React.createElement("div", { style: { position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, marginTop: 4, maxHeight: 300, overflowY: "auto", boxShadow: "0 8px 24px rgba(0,0,0,.35)" } }, cndMatches.map(m => React.createElement("div", { key: m[0], onClick: () => { setF(x => (Object.assign(Object.assign({}, x), { cnd: m[0], emdn: m[0], civab: m[2] || x.civab }))); setCndQuery(""); }, onMouseEnter: e => e.currentTarget.style.background = "var(--surface-3)", onMouseLeave: e => e.currentTarget.style.background = "transparent", style: { padding: "8px 11px", cursor: "pointer", borderBottom: "1px solid var(--border-2)", transition: "background .1s" } }, React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 2 } }, React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#2dd4bf", fontWeight: 700 } }, m[0]), m[2] ? React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "var(--text-3)" } }, "CIVAB " + m[2]) : null), React.createElement("div", { style: { fontSize: 12, color: "var(--text)", lineHeight: 1.3 } }, m[1])))))),  React.createElement(Inp, { label: "Codice CIVAB", hint: "Classificazione CIVAB \u2014 tipologia apparecchiatura biomedica", value: f.civab || "", onChange: s("civab") }), React.createElement(Inp, { label: "Codice CND", hint: "Classificazione Nazionale Dispositivi (Min. Salute) \u2014 es. Z120307", value: f.cnd || "", onChange: s("cnd") }), React.createElement(Inp, { label: "Codice EMDN", hint: "European Medical Device Nomenclature (EUDAMED / MDR)", value: f.emdn || "", onChange: s("emdn") }),
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
function JobForm({ initial, assets, parts, customers, technicians, onSave, onClose }) {
var _a;
const blank = { assetId: ((_a = assets[0]) === null || _a === void 0 ? void 0 : _a.id) || "", customerId: "", type: "correttiva", priority: "normale", status: "aperto", assignee: "", openDate: new Date().toISOString().slice(0, 10), closeDate: "", description: "", parts: [], laborHours: 0, laborRate: 55, travelCost: 0, notes: "", timeline: [], photos: [], technicianSignature: "", departmentSignature: "" };
const [f, setF] = React.useState(initial ? Object.assign(Object.assign(Object.assign({}, blank), initial), { timeline: initial.timeline || [], photos: initial.photos || [], parts: initial.parts || [] }) : blank);
const [errors, setErrors] = React.useState({});
const s = k => e => setF(x => (Object.assign(Object.assign({}, x), { [k]: e.target.value })));
React.useEffect(() => {
if (f.assetId && !f.customerId) {
const a = assets.find(x => x.id === f.assetId);
if (a === null || a === void 0 ? void 0 : a.customerId)
setF(x => (Object.assign(Object.assign({}, x), { customerId: a.customerId })));
}
}, [f.assetId]);
React.useEffect(() => { if (f.technicianSignature) return; const sig = techSignature(technicians, f.assignee); if (sig) setF(x => (Object.assign(Object.assign({}, x), { technicianSignature: sig }))); }, [f.assignee]);
const addPart = () => setF(x => { var _a; return (Object.assign(Object.assign({}, x), { parts: [...x.parts, { partId: ((_a = parts[0]) === null || _a === void 0 ? void 0 : _a.id) || "", qty: 1 }] })); });
const remPart = i => setF(x => (Object.assign(Object.assign({}, x), { parts: x.parts.filter((_, idx) => idx !== i) })));
const setPart = (i, k, v) => setF(x => { const a = [...x.parts]; a[i] = Object.assign(Object.assign({}, a[i]), { [k]: k === "qty" ? +v : v }); return Object.assign(Object.assign({}, x), { parts: a }); });
const addStep = () => setF(x => (Object.assign(Object.assign({}, x), { timeline: [...(x.timeline || []), {
id: "T" + Date.now(),
date: new Date().toISOString().slice(0, 10),
time: new Date().toTimeString().slice(0, 5),
type: "sopralluogo",
description: "",
durationMin: 30,
technician: x.assignee || ""
}] })));
const remStep = i => setF(x => (Object.assign(Object.assign({}, x), { timeline: (x.timeline || []).filter((_, idx) => idx !== i) })));
const setStep = (i, k, v) => setF(x => { const a = [...(x.timeline || [])]; a[i] = Object.assign(Object.assign({}, a[i]), { [k]: k === "durationMin" ? +v : v }); return Object.assign(Object.assign({}, x), { timeline: a }); });
const partsTot = f.parts.reduce((s, p) => { const pt = parts.find(x => x.id === p.partId); return s + (pt ? (pt.sellPrice || pt.unitPrice) * p.qty : 0); }, 0);
const laborTot = +f.laborHours * +f.laborRate;
if (assets.length === 0) {
return (React.createElement("div", { style: { textAlign: "center", padding: "20px 0", color: "var(--text-2)" } },
"Devi prima registrare almeno un apparecchio.",
React.createElement("div", { style: { marginTop: 14 } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Chiudi"))));
}
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement(ErrorSummary, { errors: errors }),
React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 5 } },
React.createElement("label", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } }, "Apparecchio"),
React.createElement(AssetCombobox, { value: f.assetId, onChange: id => setF(x => (Object.assign(Object.assign({}, x), { assetId: id }))), assets: assets, customers: customers, placeholder: "Seleziona apparecchio" })),
React.createElement(Sel, { label: "Cliente (opzionale)", value: f.customerId, onChange: s("customerId") },
React.createElement("option", { value: "" }, "\u2014 Auto da apparecchio \u2014"),
customers.map(c => React.createElement("option", { key: c.id, value: c.id }, c.name))),
React.createElement(Sel, { label: "Tipo", value: f.type, onChange: s("type") }, ["correttiva", "preventiva"].map(v => React.createElement("option", { key: v }, v))),
React.createElement(Sel, { label: "Priorit\u00E0", value: f.priority, onChange: s("priority") }, ["urgente", "alta", "normale", "bassa"].map(v => React.createElement("option", { key: v }, v))),
React.createElement(Sel, { label: "Stato", value: f.status, onChange: s("status") }, ["da accettare", "aperto", "in corso", "in attesa ricambi", "in attesa cliente", "in attesa accesso", "chiuso"].map(v => React.createElement("option", { key: v }, v))),
React.createElement(TecnicoPicker, { label: "Tecnico/i", value: f.assignee, onChange: v => setF(x => (Object.assign(Object.assign({}, x), { assignee: v }))), technicians: technicians }),
React.createElement(Inp, { label: "Data apertura", type: "date", value: f.openDate, onChange: s("openDate") }),
React.createElement(Inp, { label: "Data chiusura", type: "date", value: f.closeDate, onChange: s("closeDate") }),
React.createElement(Span2, null,
React.createElement(Txt, { label: "Descrizione", value: f.description, onChange: s("description") }))),
parts.length > 0 && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } },
React.createElement("span", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } }, "Parti"),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: addPart }, "+ Aggiungi")),
f.parts.map((p, i) => (React.createElement("div", { key: i, style: { display: "grid", gridTemplateColumns: "1fr 80px auto", gap: 8, marginBottom: 8 } },
React.createElement("select", { value: p.partId, onChange: e => setPart(i, "partId", e.target.value), style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 10px", color: "var(--text)" } }, parts.map(pt => React.createElement("option", { key: pt.id, value: pt.id },
pt.code,
" \u2014 ",
pt.name,
" (\u20AC",
pt.sellPrice || pt.unitPrice,
")"))),
React.createElement("input", { type: "number", min: 1, value: p.qty, onChange: e => setPart(i, "qty", e.target.value), style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 10px", color: "var(--text)" } }),
React.createElement(Btn, { variant: "danger", sm: true, onClick: () => remPart(i) }, "\u2715")))))),
React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement(Inp, { label: "Ore manodopera", type: "number", step: "0.5", value: f.laborHours, onChange: s("laborHours") }),
React.createElement(Inp, { label: "Tariffa oraria (\u20AC)", type: "number", value: f.laborRate, onChange: s("laborRate") }),
React.createElement(Inp, { label: "Viaggio / trasferta (\u20AC)", type: "number", step: "0.01", value: f.travelCost, onChange: s("travelCost") }),
React.createElement("div", null)),
React.createElement("div", { style: { background: "var(--bg)", borderRadius: 10, padding: "12px 16px", display: "flex", flexWrap: "wrap", gap: 20 } },
React.createElement("span", { style: { color: "var(--text-3)", fontSize: 12 } },
"Parti: ",
React.createElement("strong", { style: { color: "var(--text)" } },
"\u20AC",
partsTot.toFixed(2))),
React.createElement("span", { style: { color: "var(--text-3)", fontSize: 12 } },
"Manodopera: ",
React.createElement("strong", { style: { color: "var(--text)" } },
"\u20AC",
laborTot.toFixed(2))),
React.createElement("span", { style: { color: "var(--text-3)", fontSize: 12 } },
"Totale: ",
React.createElement("strong", { style: { color: "#22c55e", fontSize: 15 } },
"\u20AC",
(partsTot + laborTot).toFixed(2)))),
React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } },
React.createElement("span", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } }, " Timeline interventi"),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: addStep }, "+ Nuovo passaggio")),
(f.timeline || []).length === 0 ? (React.createElement("div", { style: { padding: "14px 16px", background: "var(--bg)", border: "1px dashed var(--border)", borderRadius: 8, fontSize: 12, color: "var(--text-3)", textAlign: "center" } }, "Nessun passaggio registrato. Aggiungi sopralluogo, attesa parti, riparazione, test finale...")) : (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
f.timeline.map((step, i) => (React.createElement("div", { key: step.id || i, style: { background: "var(--bg)", border: "1px solid var(--border-2)", borderLeft: "3px solid #2dd4bf", borderRadius: 8, padding: "10px 12px" } },
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 } },
React.createElement("input", { type: "date", value: step.date, onChange: e => setStep(i, "date", e.target.value), style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 9px", color: "var(--text)", fontSize: 12 } }),
React.createElement("input", { type: "time", value: step.time, onChange: e => setStep(i, "time", e.target.value), style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 9px", color: "var(--text)", fontSize: 12 } })),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 90px", gap: 8, marginBottom: 8 } },
React.createElement("select", { value: step.type, onChange: e => setStep(i, "type", e.target.value), style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 9px", color: "var(--text)", fontSize: 12 } },
React.createElement("option", { value: "sopralluogo" }, "Sopralluogo / Diagnosi"),
React.createElement("option", { value: "attesa_preventivo" }, "Attesa preventivo"),
React.createElement("option", { value: "attesa_parti" }, "Attesa parti / ricambi"),
React.createElement("option", { value: "attesa_autorizzazione" }, "Attesa autorizzazione cliente"),
React.createElement("option", { value: "riparazione" }, "Riparazione / Intervento"),
React.createElement("option", { value: "test" }, "Test funzionale"),
React.createElement("option", { value: "verifica_sicurezza" }, "Verifica sicurezza elettrica"),
React.createElement("option", { value: "consegna" }, "Consegna / Riconsegna"),
React.createElement("option", { value: "chiamata" }, "Chiamata cliente"),
React.createElement("option", { value: "email" }, "Email / Comunicazione"),
React.createElement("option", { value: "altro" }, "Altro")),
React.createElement("input", { type: "number", min: 0, step: 5, value: step.durationMin, onChange: e => setStep(i, "durationMin", e.target.value), placeholder: "min", style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 9px", color: "var(--text)", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" } })),
React.createElement("input", { type: "text", value: step.description, onChange: e => setStep(i, "description", e.target.value), placeholder: "Descrizione (cosa \u00E8 stato fatto / cosa si attende)", style: { width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 9px", color: "var(--text)", fontSize: 12, marginBottom: 8 } }),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "center" } },
React.createElement("input", { type: "text", value: step.technician || "", onChange: e => setStep(i, "technician", e.target.value), placeholder: "Tecnico", style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 9px", color: "var(--text)", fontSize: 12 } }),
React.createElement(Btn, { variant: "danger", sm: true, onClick: () => remStep(i) }, "\u2715"))))),
f.timeline.length > 0 && (React.createElement("div", { style: { padding: "8px 12px", background: "var(--surface)", borderRadius: 6, fontSize: 11, color: "var(--text-3)", textAlign: "right" } },
"Tempo totale lavorato: ",
React.createElement("strong", { style: { color: "#22c55e", fontFamily: "'IBM Plex Mono', monospace" } },
(f.timeline.reduce((s, t) => s + (+t.durationMin || 0), 0) / 60).toFixed(1),
"h"),
" (",
f.timeline.reduce((s, t) => s + (+t.durationMin || 0), 0),
" min)"))))),
React.createElement(Txt, { label: "Note", value: f.notes, onChange: s("notes") }),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 } },
React.createElement(SignaturePad, { label: "Firma Tecnico (obbligatoria alla chiusura)", value: f.technicianSignature || "", onChange: v => setF(x => (Object.assign(Object.assign({}, x), { technicianSignature: v }))), height: 120 }),
React.createElement(SignaturePad, { label: "Firma Referente reparto (opzionale)", value: f.departmentSignature || "", onChange: v => setF(x => (Object.assign(Object.assign({}, x), { departmentSignature: v }))), height: 120 })),
errors.technicianSignature ? React.createElement("div", { style: { fontSize: 11, color: "#ef4444" } }, errors.technicianSignature) : null,

React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Annulla"),
React.createElement(Btn, { onClick: () => {
var _a;
const errs = {};
if (!f.assetId)
errs.assetId = "Seleziona un apparecchio";
if (!((_a = f.description) === null || _a === void 0 ? void 0 : _a.trim()))
errs.description = "Descrizione del lavoro obbligatoria";
if (!f.openDate)
errs.openDate = "Inserisci la data di apertura";
if (f.status === "chiuso" && !f.closeDate)
errs.closeDate = "Data chiusura obbligatoria se lo stato è chiuso";
if (f.status === "chiuso" && !f.technicianSignature)
errs.technicianSignature = "Firma del tecnico obbligatoria per chiudere l'intervento";
setErrors(errs);
if (Object.keys(errs).length > 0)
return;
onSave(Object.assign(Object.assign({}, f), { laborHours: +f.laborHours, laborRate: +f.laborRate, travelCost: +f.travelCost || 0 }));
} }, "Salva"))));
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
React.createElement("strong", { style: { color: "#a855f7", fontSize: 15 } },
"\u20AC",
(+f.qty * (+f.unitPrice)).toFixed(2)))),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Annulla"),
React.createElement(Btn, { onClick: () => onSave(Object.assign(Object.assign({}, f), { qty: +f.qty, unitPrice: +f.unitPrice })) }, "Salva"))));
}
function InvoiceForm({ initial, customers, jobs, assets, parts, generateNumber, onSave, onClose }) {
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
React.createElement(Sel, { label: "Cliente", value: f.customerId, onChange: s("customerId") },
React.createElement("option", { value: "" }, "\u2014 Seleziona \u2014"),
customers.map(c => React.createElement("option", { key: c.id, value: c.id }, c.name))),
React.createElement(Inp, { label: "Data preventivo", type: "date", value: f.date, onChange: s("date") })),
f.customerId && customerJobs.length > 0 && (React.createElement("div", { style: { background: "var(--bg)", borderRadius: 10, padding: "10px 14px", border: "1px solid var(--border)" } },
React.createElement("div", { style: { fontSize: 10, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 8 } }, "Importa da un job chiuso del cliente"),
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
React.createElement("div", { style: { fontSize: 10, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 8 } }, "Aggiungi servizio in blocco (es. contratto per tot macchine)"),
React.createElement("datalist", { id: "servizi-comuni" }, SERVIZI_COMUNI.map(sv => React.createElement("option", { key: sv, value: sv }))),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 80px 100px auto", gap: 6, alignItems: "center" } },
React.createElement("input", { list: "servizi-comuni", value: bulkSvc, onChange: e => setBulkSvc(e.target.value), placeholder: "Servizio (es. Verifica sicurezza elettrica)", style: { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text)", outline: "none", minWidth: 0 } }),
React.createElement("input", { type: "number", value: bulkN, onChange: e => setBulkN(e.target.value), placeholder: "N\u00B0 macch.", style: { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text)", outline: "none" } }),
React.createElement("input", { type: "number", step: "0.01", value: bulkPrice, onChange: e => setBulkPrice(e.target.value), placeholder: "\u20AC/macch.", style: { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text)", outline: "none" } }),
React.createElement(Btn, { sm: true, onClick: addBulk }, "+ Aggiungi")),
(parseInt(bulkN, 10) > 0 && parseFloat(bulkPrice) > 0) && (React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 7 } },
"Totale riga: ",
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
React.createElement("span", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } }, "Righe preventivo"),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: addItem }, "+ Riga")),
f.items.length > 0 && (React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 70px 90px 60px auto", gap: 6, padding: "0 10px 4px", fontSize: 9.5, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .5, fontWeight: 700 } },
React.createElement("span", null, "Descrizione"),
React.createElement("span", { style: { textAlign: "center" } }, "Q.t\u00E0"),
React.createElement("span", { style: { textAlign: "center" } }, "Prezzo \u20AC"),
React.createElement("span", { style: { textAlign: "center" } }, "IVA %"),
React.createElement("span", null))),
f.items.map((it, i) => (React.createElement("div", { key: i, style: { background: "var(--surface)", borderRadius: 8, padding: 10, marginBottom: 8, display: "grid", gridTemplateColumns: "1fr 70px 90px 60px auto", gap: 6, alignItems: "center" } },
React.createElement("input", { value: it.description, onChange: e => setItem(i, "description", e.target.value), placeholder: "Descrizione", style: { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "7px 9px", color: "var(--text)", outline: "none", minWidth: 0 } }),
React.createElement("input", { type: "number", value: it.qty, onChange: e => setItem(i, "qty", e.target.value), placeholder: "Q.t\u00E0", step: "0.5", style: { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "7px 9px", color: "var(--text)", outline: "none" } }),
React.createElement("input", { type: "number", value: it.unitPrice, onChange: e => setItem(i, "unitPrice", e.target.value), placeholder: "\u20AC", step: "0.01", style: { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "7px 9px", color: "var(--text)", outline: "none" } }),
React.createElement("input", { type: "number", value: it.vat, onChange: e => setItem(i, "vat", e.target.value), placeholder: "IVA%", style: { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "7px 9px", color: "var(--text)", outline: "none" } }),
React.createElement(Btn, { sm: true, variant: "danger", onClick: () => remItem(i) }, "\u2715")))),
f.items.length === 0 && React.createElement("div", { style: { textAlign: "center", color: "var(--text-4)", padding: "16px 0", fontSize: 12 } }, "Nessuna riga. Aggiungi con \"+ Riga\" o importa da un job.")),
React.createElement("div", { style: { background: "var(--bg)", borderRadius: 10, padding: "14px 16px" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 } },
React.createElement("span", { style: { color: "var(--text-2)" } }, "Imponibile"),
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
"Altri dettagli ",
showDetails ? "" : "(numero, stato, scadenza, pagamento, note)"),
React.createElement("span", { style: { transform: showDetails ? "rotate(90deg)" : "none", transition: "transform .15s" } }, "\u203A")),
showDetails && (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14, marginTop: 14, padding: "4px 2px" } },
React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement(Inp, { label: "Numero preventivo", value: f.number, onChange: s("number") }),
React.createElement(Sel, { label: "Stato", value: f.status, onChange: s("status") }, ["bozza", "emessa", "pagata", "scaduta", "annullato"].map(v => React.createElement("option", { key: v }, v))),
React.createElement(Inp, { label: "Data scadenza", type: "date", value: f.dueDate, onChange: s("dueDate") }),
React.createElement("div", null)),
React.createElement(Inp, { label: "Modalit\u00E0 di pagamento", value: f.paymentTerms, onChange: s("paymentTerms") }),
React.createElement(Txt, { label: "Note", value: f.notes, onChange: s("notes") })))),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Annulla"),
React.createElement(Btn, { onClick: () => onSave(f) }, "Salva"))));
}
function JobDetailModal({ job, assets, parts, customers, company, onEdit, onTimeline, onClose, onCreateQuote }) {
const asset = assets.find(a => a.id === job.assetId) || {};
const customer = customers.find(c => c.id === (job.customerId || asset.customerId)) || {};
const TYPE_COLOR = { correttiva: "#ef4444", preventiva: "#3b82f6", verifica: "#a855f7", calibrazione: "#f59e0b" };
const STAT_COLOR = { aperto: "#f59e0b", "in corso": "#3b82f6", chiuso: "#22c55e" };
const PRIO_COLOR = { urgente: "#ef4444", alta: "#f97316", normale: "var(--text-3)", bassa: "var(--text-4)" };
const sortedSteps = [...(job.timeline || [])].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
const totMin = sortedSteps.reduce((s, t) => s + (+t.durationMin || +t.hours * 60 || 0), 0);
const partsTot = (job.parts || []).reduce((s, p) => { const pt = parts.find(x => x.id === p.partId); return s + (pt ? (pt.sellPrice || pt.unitPrice || 0) * p.qty : 0); }, 0);
const laborTot = (+job.laborHours || 0) * (+job.laborRate || 0);
const Badge = ({ txt, color }) => (React.createElement("span", { style: { fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 20, background: color + "1e", color: color, border: "1px solid " + color + "44", textTransform: "capitalize" } }, txt));
const Field = ({ label, value }) => (React.createElement("div", null,
React.createElement("div", { style: { fontSize: 9.5, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .6, fontWeight: 700, marginBottom: 2 } }, label),
React.createElement("div", { style: { fontSize: 13.5, color: "var(--text)", fontWeight: 600 } }, value || "—")));
return (React.createElement(Modal, { title: "Intervento", wide: true, onClose: onClose },
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 18 } },
React.createElement("div", { style: { background: "var(--surface)", borderRadius: 12, padding: "16px 18px", border: "1px solid #24242F" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" } },
React.createElement("div", { style: { minWidth: 0 } },
React.createElement("div", { style: { fontSize: 18, fontWeight: 900, color: "var(--text-bright)", lineHeight: 1.2 } }, asset.name || "Apparecchio"),
React.createElement("div", { style: { fontSize: 12, color: "var(--text-2)", marginTop: 3 } },
[asset.brand, asset.model].filter(Boolean).join(" "),
asset.serial ? " · SN " + asset.serial : ""),
customer.name && React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)", marginTop: 2 } },
"Cliente: ",
customer.name)),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" } },
React.createElement(Badge, { txt: job.type || "—", color: TYPE_COLOR[job.type] || "var(--text-3)" }),
React.createElement(Badge, { txt: job.status || "—", color: STAT_COLOR[job.status] || "var(--text-3)" }),
job.priority && React.createElement(Badge, { txt: job.priority, color: PRIO_COLOR[job.priority] || "var(--text-3)" })))),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14 } },
React.createElement(Field, { label: "Data apertura", value: job.openDate }),
React.createElement(Field, { label: "Data chiusura", value: job.closeDate }),
React.createElement(Field, { label: "Tecnico", value: job.assignee }),
React.createElement(Field, { label: "Verifica collegata", value: job.iecReportId || job.funcReportId ? "Sì" : "—" })),
job.description && (React.createElement("div", null,
React.createElement("div", { style: { fontSize: 9.5, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .6, fontWeight: 700, marginBottom: 5 } }, "Descrizione lavoro"),
React.createElement("div", { style: { fontSize: 13.5, color: "var(--text)", lineHeight: 1.5, background: "var(--surface)", borderRadius: 8, padding: "12px 14px", border: "1px solid #24242F" } }, job.description))),
job.notes && (React.createElement("div", null,
React.createElement("div", { style: { fontSize: 9.5, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .6, fontWeight: 700, marginBottom: 5 } }, "Note"),
React.createElement("div", { style: { fontSize: 13, color: "var(--text-strong)", lineHeight: 1.5, fontStyle: "italic" } }, job.notes))),
(partsTot > 0 || laborTot > 0) && (React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } },
laborTot > 0 && React.createElement("div", { style: { flex: 1, minWidth: 120, background: "var(--surface)", borderRadius: 10, padding: "10px 14px", border: "1px solid #24242F" } },
React.createElement("div", { style: { fontSize: 9.5, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .6, fontWeight: 700 } }, "Manodopera"),
React.createElement("div", { style: { fontSize: 16, fontWeight: 900, color: "#a855f7", marginTop: 3 } },
"\u20AC ",
laborTot.toFixed(2)),
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)" } },
job.laborHours,
"h \u00D7 \u20AC",
job.laborRate)),
partsTot > 0 && React.createElement("div", { style: { flex: 1, minWidth: 120, background: "var(--surface)", borderRadius: 10, padding: "10px 14px", border: "1px solid #24242F" } },
React.createElement("div", { style: { fontSize: 9.5, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .6, fontWeight: 700 } }, "Ricambi"),
React.createElement("div", { style: { fontSize: 16, fontWeight: 900, color: "#3b82f6", marginTop: 3 } },
"\u20AC ",
partsTot.toFixed(2)),
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)" } },
(job.parts || []).length,
" pezzi")),
React.createElement("div", { style: { flex: 1, minWidth: 120, background: "#2dd4bf12", borderRadius: 10, padding: "10px 14px", border: "1px solid #2dd4bf33" } },
React.createElement("div", { style: { fontSize: 9.5, color: "#5eead4", textTransform: "uppercase", letterSpacing: .6, fontWeight: 700 } }, "Totale"),
React.createElement("div", { style: { fontSize: 16, fontWeight: 900, color: "#2dd4bf", marginTop: 3 } },
"\u20AC ",
(partsTot + laborTot).toFixed(2))))),
React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 } },
React.createElement("span", { style: { fontSize: 11, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } },
"Storico interventi ",
sortedSteps.length > 0 && "· " + sortedSteps.length + " voci"),
totMin > 0 && React.createElement("span", { style: { fontSize: 12, color: "#a855f7", fontWeight: 700 } },
(totMin / 60).toFixed(1),
"h totali")),
sortedSteps.length === 0 ? (React.createElement("div", { style: { textAlign: "center", color: "var(--text-4)", padding: "20px 0", fontSize: 12.5, background: "var(--bg-2)", borderRadius: 10, border: "1px dashed #24242F" } }, "Nessuna voce nello storico. Usa \"Modifica cronologia\" per aggiungere cosa \u00E8 stato fatto, quando e da chi.")) : (React.createElement("div", null, sortedSteps.map((step, i) => (React.createElement("div", { key: step.id || i, style: { display: "flex", gap: 14, marginBottom: 14 } },
React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center" } },
React.createElement("div", { style: { width: 34, height: 34, borderRadius: "50%", background: "#2dd4bf22", border: "1px solid #2dd4bf44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 } }, TIMELINE_ICON[step.type] || "·"),
i < sortedSteps.length - 1 && React.createElement("div", { style: { width: 2, flex: 1, background: "var(--border)", marginTop: 4, minHeight: 14 } })),
React.createElement("div", { style: { flex: 1, background: "var(--surface)", borderRadius: 8, padding: "10px 14px", border: "1px solid #24242F", marginBottom: 2 } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, gap: 8, flexWrap: "wrap" } },
React.createElement("span", { style: { color: "#5eead4", fontWeight: 700, fontSize: 13 } }, TIMELINE_LABEL[step.type] || step.type),
React.createElement("span", { style: { color: "var(--text-3)", fontSize: 11 } },
step.date,
(step.hours > 0 || step.durationMin > 0) ? " · " + (step.hours || (step.durationMin / 60).toFixed(1)) + "h" : "")),
step.note && React.createElement("div", { style: { color: "var(--text)", fontSize: 13, lineHeight: 1.45 } }, step.note)))))))),
(job.photos || []).length > 0 && (React.createElement("div", null,
React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 10 } },
"Foto (",
job.photos.length,
")"),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 8 } }, job.photos.map(photo => (React.createElement("div", { key: photo.id, style: { aspectRatio: "1", borderRadius: 8, overflow: "hidden", border: "1px solid #24242F", cursor: "pointer" }, onClick: () => window.open(photo.data, "_blank") },
React.createElement("img", { src: photo.data, alt: photo.name || "", style: { width: "100%", height: "100%", objectFit: "cover" } }))))))),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap", borderTop: "1px solid #24242F", paddingTop: 16 } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Chiudi"),
onCreateQuote && React.createElement(Btn, { variant: "ghost", onClick: onCreateQuote }, "\uD83D\uDCC4 Crea preventivo"),
React.createElement(Btn, { variant: "ghost", onClick: onTimeline }, "\uD83D\uDD50 Modifica cronologia"),
React.createElement(Btn, { onClick: onEdit }, "\u270F Modifica dati"),
React.createElement(Btn, { variant: "ghost", onClick: () => generateJobPDF(job, assets, parts, customers, company) }, "\uD83D\uDCC4 PDF")))));
}
function TimelineModal({ job, parts, onSave, onClose }) {
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
function WithdrawalModal({ parts, assets, preselectPartId, onWithdraw, onClose }) {
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
function AssetDetailModal({ asset, recalls, jobs, parts, iecReports, funcReports, customers, onClose, onEditAsset, onNewJob, onNewIec, onNewFunc, onAssetSticker, onOpenJob, onQuickLocation, company, generateJobPDF, generateIECPDF, generateFuncPDF, templates, page, onAddDoc, onDeleteDoc, showToast, onOpenIec, onOpenFunc, onOpenRecall }) {
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
icon: "⚡", title: "Sicurezza elettrica", sub: (r.reportNumber || r.id) + (r.technician ? " · " + r.technician : ""),
ok: r.overallPass, badge: r.overallPass ? "CONFORME" : "NON CONF."
}));
assetFunc.forEach(r => ev.push({
kind: "func", ref: r, date: r.date || "", color: r.overallPass ? "#22c55e" : "#ef4444",
icon: "\uD83E\uDE7A", title: "Verifica funzionale", sub: (r.reportNumber || r.id) + (r.technician ? " · " + r.technician : ""),
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
const LBL = { fontSize: 9, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 3 };
const VAL = { fontSize: 13, color: "var(--text)", fontWeight: 600 };
const TABS = [{ id: "overview", label: " Scheda" }, { id: "timeline", label: "\uD83D\uDD51 Storico" }, { id: "jobs", label: " Job (" + assetJobs.length + ")" }, { id: "iec", label: "⚡ Sicurezza (" + assetIec.length + ")" }, { id: "func", label: "Funzionale (" + assetFunc.length + ")" }, { id: "documenti", label: "Documenti (" + ((asset.documents || []).length) + ")" }];
const riskColor = { A: "#22c55e", B: "#f59e0b", C: "#ef4444" };
const CMAX = page ? "none" : "55vh";
const _mix = (c, p) => "color-mix(in srgb, " + c + " " + p + "%, transparent)";
const _actBtn = (onClick, c, icon, label) => React.createElement("button", { onClick: onClick, onMouseEnter: (e) => { e.currentTarget.style.background = _mix(c, 24); e.currentTarget.style.borderColor = _mix(c, 60); }, onMouseLeave: (e) => { e.currentTarget.style.background = _mix(c, 13); e.currentTarget.style.borderColor = _mix(c, 34); }, style: { background: _mix(c, 13), color: c, border: "1px solid " + _mix(c, 34), borderRadius: 8, padding: "9px 8px", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, touchAction: "manipulation", WebkitTapHighlightColor: "transparent", transition: "background .12s ease, border-color .12s ease" } }, icon, React.createElement("span", null, label));
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 0, minHeight: 0 } },
React.createElement("div", { style: { background: "var(--bg)", borderRadius: 10, padding: "14px 16px", marginBottom: 14, border: "1px solid var(--border-2)" } },
React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 } },
React.createElement("span", { style: { fontSize: 17, fontWeight: 700, color: "#5eead4", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: .5 } }, asset.assetCode || asset.id),
asset.riskClass && React.createElement("span", { style: { background: riskColor[asset.riskClass] + "22", color: riskColor[asset.riskClass], border: "1px solid " + riskColor[asset.riskClass] + "55", borderRadius: 5, padding: "2px 8px", fontSize: 10, fontWeight: 700 } },
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
"\uD83C\uDFE2 ",
customer.name),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", marginBottom: 10, display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" } },
React.createElement("span", null,
"\uD83D\uDCCD ",
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
React.createElement("div", { style: { fontSize: 9, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .7, fontWeight: 700 } }, k.label),
React.createElement("div", { style: { fontSize: 17, fontWeight: 700, color: k.color, marginTop: 3, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 } }, k.value))))),
React.createElement("div", { style: { display: "flex", gap: 4, marginBottom: 12, borderBottom: "2px solid var(--border-2)", paddingBottom: 0, overflowX: "auto", flexWrap: "nowrap", scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch", maxWidth: "100%" } }, TABS.map(t => (React.createElement("button", { key: t.id, onClick: () => setTab(t.id), style: {
background: "none", border: "none", borderBottom: tab === t.id ? "2px solid #2dd4bf" : "2px solid transparent",
color: tab === t.id ? "#5eead4" : "var(--text-3)", padding: "8px 14px", cursor: "pointer",
fontSize: 12.5, fontWeight: tab === t.id ? 700 : 500, marginBottom: -2, whiteSpace: "nowrap", flexShrink: 0
} }, t.label)))),
tab === "overview" && (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12, overflow: "auto", maxHeight: CMAX } },
assetHasOpenRecall(asset.id, recalls) && React.createElement("div", { onClick: function () { var rc = assetOpenRecall(asset.id, recalls); if (rc && onOpenRecall) onOpenRecall(rc.id); }, onMouseEnter: function (e) { e.currentTarget.style.background = "#4a1616"; }, onMouseLeave: function (e) { e.currentTarget.style.background = "#3a1212"; }, style: { background: "#3a1212", border: "1px solid #ef444466", borderRadius: 8, color: "#fca5a5", padding: "10px 12px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, transition: "background .12s ease" } }, React.createElement("span", null, "⚠ Avviso di sicurezza aperto su questo apparecchio — azione da eseguire"), React.createElement("span", { style: { fontSize: 11, opacity: .85, whiteSpace: "nowrap" } }, "Apri ›")),
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
React.createElement("span", { style: { fontSize: 12.5, color: "var(--acc-teal)", fontWeight: 700 } }, asset.lastLocation + (asset.lastLocationDate ? (" \u00B7 " + fmtDateTimeIt(asset.lastLocationDate)) : "")))
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
React.createElement("span", { style: { fontSize: 12.5, fontWeight: 700, color: "var(--text)" } }, e.title),
e.badge && React.createElement("span", { style: { fontSize: 9, fontWeight: 700, color: e.color, background: e.color + "22", border: "1px solid " + e.color + "44", borderRadius: 4, padding: "1px 6px", textTransform: "uppercase", letterSpacing: .3 } }, e.badge)),
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
j.iecReportId ? "⚡" : "",
j.funcReportId ? "\uD83E\uDE7A" : "")))));
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
React.createElement("button", { onClick: (e) => { e.stopPropagation(); generateIECPDF(r, asset, customer, company); }, style: { background: "var(--surface-3)", border: "1px solid var(--border)", borderRadius: 5, color: "#5eead4", padding: "3px 8px", cursor: "pointer", fontSize: 11 } })))))))),
tab === "documenti" && (React.createElement("div", { style: { overflow: "auto", maxHeight: CMAX } },
React.createElement("div", { style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 10, padding: "16px 18px" } },
React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 4 } }, "Documenti dell'apparecchio"),
React.createElement("div", { style: { fontSize: 11.5, color: "var(--text-3)", marginBottom: 12, lineHeight: 1.5 } }, "Conformit\u00E0 CE, manuali, certificati, rapporti esterni. PDF, immagini, Word, Excel \u2014 max 5MB a file."),
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
React.createElement("button", { onClick: (e) => { e.stopPropagation(); generateFuncPDF(r, asset, customer, company); }, style: { background: "var(--surface-3)", border: "1px solid var(--border)", borderRadius: 5, color: "#5eead4", padding: "3px 8px", cursor: "pointer", fontSize: 11 } })))));
})))));
}
function HistoryModal({ asset, jobs, parts, onClose }) {
return null;
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
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .6, fontWeight: 700, marginBottom: 8 } }, "Scegli il ruolo da configurare"),
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
function SettingsSection({ icon, title, color, children, accent }) {
return (React.createElement("div", { style: { background: "var(--surface)", borderRadius: 14, padding: "18px", border: "1px solid " + (accent || "#24242F") } },
React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 9, marginBottom: 14 } },
React.createElement("span", { style: { fontSize: 13, fontWeight: 800, color: color || "var(--text)", letterSpacing: .3 } }, title)),
children));
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
React.createElement("div", { style: { fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.55, marginBottom: 18 } },
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
(cestino[t.key] || []).map(rec => (React.createElement("div", { key: rec.id, style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 9, marginBottom: 6 } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { fontSize: 13, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, t.nome(rec)),
rec.deletedAt && React.createElement("div", { style: { fontSize: 10.5, color: "var(--text-3)", marginTop: 2 } },
"Cestinato il ",
fmtData(rec.deletedAt))),
React.createElement("button", { onClick: () => onRestore(t.key, rec.id), style: { background: "#2dd4bf18", border: "1px solid #2dd4bf55", color: "#5eead4", borderRadius: 7, padding: "6px 12px", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", fontWeight: 600 } }, "\u21A9 Ripristina"),
React.createElement("button", { onClick: () => { if (confirm("Eliminare DEFINITIVAMENTE questo elemento? Non sarà più recuperabile."))
onPurge(t.key, rec.id); }, style: { background: "#ef444415", border: "1px solid #ef444455", color: "#f87171", borderRadius: 7, padding: "6px 10px", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" } }, "Elimina"))))))))));
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
React.createElement(Btn, { sm: true, disabled: busy, onClick: migra }, busy ? "Sposto…" : ("☁ Sposta " + locali + (locali === 1 ? " foto" : " foto") + " sul cloud")),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 7, lineHeight: 1.5 } }, "Carica le foto dei job sul cloud e qui tiene solo il link: liberi quasi tutto lo spazio e le foto si vedono da ogni dispositivo."),
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
if (!rows.length) { alert("Nessuna lettura RFID valida. Atteso { location, date, epcs:[...] } oppure [{ epc, location, date }]."); input.value = ""; return; }
const r = onImportRfidScan ? onImportRfidScan(rows) : null;
if (r) setRep(r);
}
catch (err) { alert("Errore lettura file: " + ((err && err.message) || "JSON non valido")); }
input.value = "";
};
reader.onerror = () => { alert("Impossibile leggere il file"); input.value = ""; };
reader.readAsText(file);
};
return React.createElement(SettingsSection, { icon: "\uD83D\uDCE1", title: "Inventario RFID" },
React.createElement("div", { style: { fontSize: 11.5, color: "var(--text-2)", lineHeight: 1.55, marginBottom: 10 } }, "Importa la scansione del lettore RFID (file JSON). Aggiorna l'ultima posizione degli apparecchi tramite EPC e segnala quelli con manutenzione scaduta o in scadenza."),
React.createElement("input", { ref: inputRef, type: "file", accept: ".json,application/json", style: { display: "none" }, onChange: handleFile }),
React.createElement(Btn, { sm: true, onClick: () => { if (inputRef.current) inputRef.current.click(); } }, "\u2191 Importa scansione RFID"),
rep ? React.createElement("div", { style: { marginTop: 12, background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "12px 14px", fontSize: 12 } },
React.createElement("div", { style: { color: "#2dd4bf", fontWeight: 700, marginBottom: 8 } }, "Risultato scansione"),
React.createElement("div", { style: { color: "var(--text)", marginBottom: 4 } }, "Apparecchi aggiornati: " + rep.updated + " su " + rep.total + " letture"),
rep.unknown.length > 0 ? React.createElement("div", { style: { color: "#f59e0b", marginBottom: 4 } }, "EPC sconosciuti (nessun apparecchio): " + rep.unknown.length) : null,
rep.crit.length > 0
? React.createElement("div", { style: { marginTop: 8 } },
React.createElement("div", { style: { color: "#ef4444", fontWeight: 700, marginBottom: 5 } }, "\u26A0 " + rep.crit.length + " con manutenzione critica:"),
rep.crit.slice(0, 15).map((c, i) => React.createElement("div", { key: i, style: { display: "flex", justifyContent: "space-between", gap: 8, padding: "3px 0", borderBottom: "1px solid var(--border)" } },
React.createElement("span", { style: { color: "var(--text)" } }, c.name + (c.location ? (" \u00B7 " + c.location) : "")),
React.createElement("span", { style: { color: c.status === "scaduta" ? "#ef4444" : "#f59e0b", fontWeight: 700, fontSize: 11, whiteSpace: "nowrap" } }, c.status === "scaduta" ? ("scaduta il " + fmtDateTimeIt(c.nextService)) : ("scade il " + fmtDateTimeIt(c.nextService))))))
: React.createElement("div", { style: { color: "#22c55e", marginTop: 6 } }, "Nessuna criticit\u00E0 tra gli apparecchi scansionati"),
Object.keys(rep.byLoc).length > 0 ? React.createElement("div", { style: { marginTop: 10, fontSize: 11, color: "var(--text-2)" } },
React.createElement("div", { style: { color: "var(--text-3)", fontWeight: 700, marginBottom: 4 } }, "Per reparto:"),
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
"Archivio locale sul dispositivo (IndexedDB). I dati non sono pi\u00F9 limitati a 5 MB. Di cui foto: ",
React.createElement("b", { style: { color: "var(--text)" } }, fmt(ph.chars)),
ph.count > 0 ? " (" + ph.count + " foto)" : "",
"."),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 6, lineHeight: 1.5 } }, "Le foto pesano molto pi\u00F9 dei dati. C'\u00E8 ampio spazio, ma tieni comunque un backup recente (qui sotto): in modalit\u00E0 offline i dati vivono solo su questo dispositivo."));
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
"Stima dello spazio del sito su questo dispositivo. Di cui foto: ",
React.createElement("b", { style: { color: "var(--text)" } }, fmtMB(ph.chars)),
ph.count > 0 ? " (" + ph.count + " foto)" : "",
". I dati grandi vanno nell'archivio esteso del dispositivo (IndexedDB)."));
}
function SettingsModal({ data, onReplaceJobs, company, onUpdateCompany, onImport, onMerge, onReset, onClose, onCloudPull, isAdmin, isSuperuser, onOpenCestino, onImportRfidScan }) {
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
alert('File backup non valido: nessun dato MedTrace riconosciuto.');
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
reader.onerror = () => { alert('Impossibile leggere il file'); e.target.value = ''; };
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
alert('File backup non valido: nessun dato MedTrace riconosciuto.');
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
reader.onerror = () => { alert('Impossibile leggere il file'); input.value = ''; };
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
alert('File backup non valido.');
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
reader.onerror = () => { alert('Impossibile leggere il file'); input.value = ''; };
reader.readAsText(file);
};
const isLogged = !(typeof DEMO_LOCKED !== "undefined" && DEMO_LOCKED) && (typeof getSupa === "function") && getSupa();
return (React.createElement(Modal, { title: "Impostazioni", wide: true, onClose: onClose },
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
isAdmin && (React.createElement(Section, { icon: "\uD83C\uDFE2", title: "Dati azienda" },
isSuperuser && !comp.name && (React.createElement("div", { style: { background: "#f59e0b15", border: "1px solid #f59e0b44", borderRadius: 8, padding: "10px 13px", marginBottom: 14, fontSize: 12, color: "#f59e0b", lineHeight: 1.5 } }, "\u26A0 Inserisci il nome della tua azienda \u2014 apparir\u00E0 su tutti i PDF (rapporti, verifiche, preventivi).")),
!isSuperuser && (React.createElement("div", { style: { background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "9px 13px", marginBottom: 14, fontSize: 11.5, color: "var(--text-3)", lineHeight: 1.5 } }, "I dati fiscali (ragione sociale, P.IVA, IBAN) sono modificabili solo dal Superuser. Puoi comunque gestire logo e preferenze qui sotto.")),
React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement(Inp, { label: "Nome / Ragione sociale", value: comp.name, onChange: s("name"), disabled: !isSuperuser }),
React.createElement(Inp, { label: "Sottotitolo", value: comp.subtitle, onChange: s("subtitle"), disabled: !isSuperuser }),
React.createElement(Span2, null,
React.createElement(Inp, { label: "Indirizzo", value: comp.address, onChange: s("address"), disabled: !isSuperuser })),
React.createElement(Inp, { label: "P.IVA", value: comp.vat, onChange: s("vat"), disabled: !isSuperuser }),
React.createElement(Inp, { label: "IBAN", value: comp.iban, onChange: s("iban"), disabled: !isSuperuser }),
React.createElement(Span2, null,
React.createElement(Inp, { label: "Prefisso numerazione preventivi", value: comp.invoicePrefix, onChange: s("invoicePrefix"), placeholder: "es. F", disabled: !isSuperuser }))),
React.createElement("div", { style: { marginTop: 14, paddingTop: 14, borderTop: "1px solid #24242F" } },
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 8 } }, "Logo aziendale (sui PDF)"),
React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" } },
comp.logo ? (React.createElement("img", { src: comp.logo, alt: "logo", style: { height: 48, maxWidth: 160, objectFit: "contain", background: "#fff", borderRadius: 6, padding: 6, border: "1px solid var(--border)" } })) : (React.createElement("div", { style: { height: 48, width: 120, borderRadius: 6, border: "1px dashed var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "var(--text-4)" } }, "Nessun logo")),
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
React.createElement("span", { style: { background: "#2dd4bf15", color: "#2dd4bf", border: "1px solid #2dd4bf44", borderRadius: 9, padding: "9px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700, display: "inline-block" } }, comp.logo ? "Cambia logo" : "Carica logo")),
comp.logo && (React.createElement("button", { onClick: () => setComp(x => (Object.assign(Object.assign({}, x), { logo: "" }))), style: { background: "#ef444415", color: "#ef4444", border: "1px solid #ef444433", borderRadius: 9, padding: "9px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700 } }, "Rimuovi"))))),
comp.logo && (React.createElement("div", { onClick: () => { if (isAdmin)
setComp(x => (Object.assign(Object.assign({}, x), { logoHasName: !x.logoHasName }))); }, style: { display: "flex", alignItems: "center", gap: 10, marginTop: 12, cursor: isAdmin ? "pointer" : "default", fontSize: 12.5, color: "var(--text-strong)" } },
React.createElement("div", { style: { width: 42, height: 25, borderRadius: 13, flexShrink: 0, background: comp.logoHasName ? "#2dd4bf" : "#3a4151", opacity: isAdmin ? 1 : 0.5, position: "relative", transition: "background .15s" } },
React.createElement("div", { style: { position: "absolute", top: 3, left: comp.logoHasName ? 20 : 3, width: 19, height: 19, borderRadius: "50%", background: "#fff", transition: "left .15s", boxShadow: "0 1px 3px rgba(0,0,0,.4)" } })),
"Il mio logo contiene gi\u00E0 il nome dell'azienda")),
comp.logo && (React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 5, marginLeft: 26, lineHeight: 1.4 } }, comp.logoHasName ? "Sui PDF il nome non verrà ripetuto sotto il logo (mostriamo solo P.IVA e indirizzo)." : "Sui PDF mostriamo il nome azienda accanto ai dati."))),
isAdmin && React.createElement("div", { style: { textAlign: "right", marginTop: 12 } },
React.createElement(Btn, { sm: true, onClick: () => __awaiter(this, void 0, void 0, function* () {
onUpdateCompany(comp);
const isOffline = (typeof OFFLINE_MODE !== "undefined" && OFFLINE_MODE);
const isDemo = (typeof DEMO_LOCKED !== "undefined" && DEMO_LOCKED);
if (!isOffline && !isDemo && typeof supabaseSaveCompany === "function") {
const ok = yield supabaseSaveCompany(comp);
alert(ok ? "Dati azienda salvati e condivisi con i colleghi." : "Salvati in locale. (Sincronizzazione cloud non riuscita: riprova quando sei online.)");
}
else {
alert("Dati azienda salvati.");
}
}) }, "Salva dati azienda")))),
React.createElement(Section, { icon: "\u2699\uFE0F", title: "Preferenze" },
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
"Chiedi di stampare lo sticker QR dopo ogni verifica",
React.createElement("span", { style: { display: "block", fontSize: 11.5, color: "var(--text-3)", marginTop: 3 } }, "Se spento, la verifica viene salvata senza domande. Lo sticker resta sempre disponibile col pulsante \uD83C\uDFF7 nella lista delle verifiche.")))),
isSuperuser && (React.createElement(Section, { icon: "\uD83E\uDDD1\u200D\uD83D\uDD27", title: "Tecnici" },
React.createElement(TecniciManager, { technicians: comp.technicians || [], onChange: arr => { setComp(x => (Object.assign(Object.assign({}, x), { technicians: arr }))); onUpdateCompany(Object.assign(Object.assign({}, company), { technicians: arr })); const _off = (typeof OFFLINE_MODE !== "undefined" && OFFLINE_MODE); const _demo = (typeof DEMO_LOCKED !== "undefined" && DEMO_LOCKED); if (!_off && !_demo && typeof supabaseSaveTechnicians === "function") {
supabaseSaveTechnicians(arr);
} } }))),
React.createElement(Section, { icon: "\uD83D\uDDD1", title: "Cestino" },
React.createElement("div", { style: { fontSize: 11.5, color: "var(--text-2)", lineHeight: 1.55, marginBottom: 14 } }, "Gli elementi eliminati finiscono qui e puoi recuperarli. Si svuotano da soli dopo 90 giorni."),
React.createElement("button", { onClick: () => { if (onOpenCestino)
onOpenCestino(); }, style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, background: "var(--card)", border: "1px solid var(--border-3)", borderRadius: 10, padding: "13px 16px", cursor: "pointer", color: "var(--text)", fontSize: 13.5, fontWeight: 700, textAlign: "left" } },
React.createElement("span", null, "Apri il cestino"),
React.createElement("span", { style: { color: "var(--text-3)" } }, "\u203A"))),
isSuperuser && (React.createElement(Section, { icon: "\uD83D\uDD10", title: "Ruoli e permessi" },
React.createElement("div", { style: { fontSize: 11.5, color: "var(--text-2)", lineHeight: 1.55, marginBottom: 14 } },
"Decidi quali sezioni pu\u00F2 vedere ogni ruolo. Il ",
React.createElement("strong", { style: { color: "#5eead4" } }, "Superuser"),
" vede sempre tutto e pu\u00F2 gestire utenti e dati fiscali."),
React.createElement("button", { onClick: () => setShowPerms(true), style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, background: "var(--card)", border: "1px solid var(--border-3)", borderRadius: 10, padding: "13px 16px", cursor: "pointer", color: "var(--text)", fontSize: 13.5, fontWeight: 700, textAlign: "left" } },
React.createElement("span", null, "Configura ruoli e permessi"),
React.createElement("span", { style: { color: "#5eead4", fontSize: 18 } }, "\u203A")))),
isLogged ? (React.createElement(Section, { icon: "\u2601\uFE0F", title: "Sincronizzazione cloud", color: "#2dd4bf", accent: "#2dd4bf33" },
React.createElement("div", { style: { color: "var(--text-2)", fontSize: 12, lineHeight: 1.55, marginBottom: 14 } },
"I dati vengono ",
React.createElement("strong", { style: { color: "#5eead4" } }, "uniti"),
" tra questo dispositivo e il cloud: niente viene sovrascritto o perso. Se tu e un collega lavorate su dispositivi diversi, le modifiche si combinano. In caso di modifica sullo stesso record, resta la versione pi\u00F9 recente."),
React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } },
React.createElement(Btn, { disabled: cloudBusy, onClick: doSyncUp }, cloudBusy ? "Sincronizzo…" : "Sincronizza ora")),
cloudStatus && (React.createElement("div", { style: { marginTop: 12, fontSize: 12, color: cloudStatus.startsWith("✗") ? "#ef4444" : "#2dd4bf", lineHeight: 1.5, background: (cloudStatus.startsWith("✗") ? "#ef444410" : "#2dd4bf10"), borderRadius: 8, padding: "9px 12px" } }, cloudStatus)))) : (React.createElement(Section, { icon: "\uD83D\uDCBE", title: "Dove sono i dati" },
React.createElement("div", { style: { color: "var(--text-2)", fontSize: 12, lineHeight: 1.55 } },
"Tutti i dati sono salvati ",
React.createElement("strong", { style: { color: "var(--text)" } }, "localmente su questo dispositivo"),
", anche offline. Esporta backup periodici qui sotto per sicurezza."))),
React.createElement(SubscriptionCard, null),

React.createElement(Section, { icon: "\uD83D\uDCBE", title: "Spazio dati locale" },
React.createElement(StorageGauge, { data: data }),
React.createElement(FotoCloudMigrator, { data: data, onReplaceJobs: onReplaceJobs })),
React.createElement(RfidImportSection, { onImportRfidScan: onImportRfidScan }),
React.createElement(Section, { icon: "\uD83D\uDCE6", title: "Backup & ripristino" },
React.createElement("div", { style: { color: "var(--text-3)", fontSize: 11.5, lineHeight: 1.5, marginBottom: 12 } }, "Salva una copia dei tuoi dati in un file, o importane una. Utile prima di operazioni importanti."),
React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: () => downloadJSON("medtrace-backup-" + (new Date().toISOString().slice(0, 10)) + ".json", data) }, "Esporta backup")),
React.createElement("div", { style: { marginTop: 14, padding: "13px 15px", background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 9 } },
React.createElement("div", { style: { fontSize: 12, color: "var(--text)", fontWeight: 700, marginBottom: 8 } }, "Importa un backup (sostituisce i dati attuali)"),
React.createElement("input", { type: "file", accept: "application/json,.json,text/plain,*/*", onChange: fileRef, style: { display: "block", width: "100%", fontSize: 13, color: "var(--text-strong)", background: "var(--card)", border: "1px solid var(--border-3)", borderRadius: 8, padding: "10px", boxSizing: "border-box", marginBottom: 14 } }),
React.createElement("div", { style: { fontSize: 12, color: "var(--text)", fontWeight: 700, marginBottom: 8 } }, "Unisci da file (aggiunge senza cancellare)"),
React.createElement("input", { type: "file", accept: "application/json,.json,text/plain,*/*", onChange: fileRefMerge, style: { display: "block", width: "100%", fontSize: 13, color: "var(--text-strong)", background: "var(--card)", border: "1px solid var(--border-3)", borderRadius: 8, padding: "10px", boxSizing: "border-box" } }))),
isLogged && (React.createElement(Section, { icon: "\uD83D\uDC64", title: "Account" },
React.createElement("button", { onClick: () => __awaiter(this, void 0, void 0, function* () { if (confirm("Disconnettere l'account? Per rientrare servirà di nuovo il login e una connessione.")) {
try {
localStorage.removeItem("medtrace-auth-cache");
}
catch (e) { }
try {
yield supaSignOut();
}
catch (e) { }
window.location.reload();
} }), style: { background: "#ef444415", border: "1px solid #ef444433", borderRadius: 9, color: "#ef4444", padding: "9px 18px", cursor: "pointer", fontWeight: 700, fontSize: 13 } }, "Disconnetti account"))),
isSuperuser && (React.createElement(Section, { icon: "\u26A0\uFE0F", title: "Zona pericolo", color: "#ef4444", accent: "#ef444433" },
React.createElement("div", { style: { color: "var(--text-3)", fontSize: 11.5, lineHeight: 1.5, marginBottom: 12 } }, "Cancella tutti i dati locali in modo permanente. Esporta un backup prima, se ti servono."),
React.createElement(Btn, { variant: "danger", onClick: onReset }, "Reset completo dei dati"))),
React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", paddingTop: 4 } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Chiudi"))),
showPerms && (React.createElement(Modal, { title: "\uD83D\uDD10 Ruoli e permessi", wide: true, onClose: () => setShowPerms(false) },
React.createElement("div", { style: { maxHeight: "75vh", overflow: "auto" } },
React.createElement(PermissionMatrix, { value: comp.rolePermissions || DEFAULT_ROLE_PERMS, onChange: (next) => { setComp(x => (Object.assign(Object.assign({}, x), { rolePermissions: next }))); onUpdateCompany(Object.assign(Object.assign({}, company), { rolePermissions: next })); } }),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", lineHeight: 1.5, marginTop: 14 } }, "Le modifiche si salvano subito e valgono al prossimo accesso degli utenti. Il Superuser vede sempre tutte le sezioni."),
React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", marginTop: 14 } },
React.createElement(Btn, { onClick: () => setShowPerms(false) }, "Fatto")))))));
}
function LoginScreen({ onLogin }) {
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





const RECALL_ACTIONS = ["Aggiornamento SW", "Sostituzione", "Ritiro / Fuori uso", "Controllo / Ispezione", "Informativa"];
const RECALL_SEVERITY = ["Alta", "Media", "Bassa"];
const RECALL_STATUSES = ["aperto", "in lavorazione", "chiuso"];
const RECALL_ASSET_STATUS = ["Da verificare", "Eseguita", "Non applicabile", "Messo fuori uso"];
const RECALL_SEV_COLOR = { "Alta": "#ef4444", "Media": "#f59e0b", "Bassa": "#22c55e" };
const RECALL_STATUS_COLOR = { "aperto": "#ef4444", "in lavorazione": "#f59e0b", "chiuso": "#22c55e" };
const RECALL_ASTATUS_COLOR = { "Da verificare": "#f59e0b", "Eseguita": "#22c55e", "Non applicabile": "#6b7280", "Messo fuori uso": "#ef4444" };
function RecallForm({ recall, assets, customers, onSave, onClose, showToast }) {
const [f, setF] = React.useState(() => recall ? Object.assign({ attachments: [], affected: [] }, recall) : { ref: "", manufacturer: "", date: new Date().toISOString().slice(0, 10), subject: "", actionType: "Controllo / Ispezione", severity: "Media", link: "", status: "aperto", notes: "", attachments: [], affected: [] });
const set = k => e => setF(x => Object.assign({}, x, { [k]: e.target.value }));
const [pick, setPick] = React.useState("");
const addAsset = (id) => { if (!id) return; setF(x => (x.affected || []).some(a => a.assetId === id) ? x : Object.assign({}, x, { affected: [...(x.affected || []), { assetId: id, status: "Da verificare", date: "", note: "" }] })); setPick(""); };
const suggest = () => {
const m = (f.manufacturer || "").trim().toLowerCase();
if (!m) { showToast && showToast("Inserisci prima il produttore", "#f59e0b"); return; }
const have = new Set((f.affected || []).map(a => a.assetId));
const matches = assets.filter(a => !have.has(a.id) && (a.brand || "") && ((a.brand || "").toLowerCase().includes(m) || m.includes((a.brand || "").toLowerCase())));
if (!matches.length) { showToast && showToast("Nessun apparecchio con marca simile", "#f59e0b"); return; }
setF(x => Object.assign({}, x, { affected: [...(x.affected || []), ...matches.map(a => ({ assetId: a.id, status: "Da verificare", date: "", note: "" }))] }));
showToast && showToast(matches.length + " apparecchi aggiunti");
};
const updAff = (id, k, v) => setF(x => Object.assign({}, x, { affected: (x.affected || []).map(a => a.assetId === id ? Object.assign({}, a, { [k]: v }) : a) }));
const rmAff = (id) => setF(x => Object.assign({}, x, { affected: (x.affected || []).filter(a => a.assetId !== id) }));
const assetLabel = (id) => { const a = assets.find(x => x.id === id); if (!a) return id; return [a.assetCode || a.id, a.name, a.serial && ("S/N " + a.serial)].filter(Boolean).join(" · "); };
const available = assets.filter(a => !(f.affected || []).some(x => x.assetId === a.id)).sort((a, b) => String(a.assetCode || a.id).localeCompare(String(b.assetCode || b.id)));
const submit = () => { if (!f.manufacturer && !f.subject && !f.ref) { showToast && showToast("Compila almeno produttore o oggetto", "#f59e0b"); return; } onSave(f); };
return React.createElement(React.Fragment, null,
React.createElement("div", { style: FORM_ROW },
React.createElement("div", { style: FORM_COL }, React.createElement("label", { style: FORM_LBL }, "N. riferimento / FSCA"), React.createElement("input", { value: f.ref || "", onChange: set("ref"), placeholder: "es. FSCA-2026-001", style: FORM_INP })),
React.createElement("div", { style: FORM_COL }, React.createElement("label", { style: FORM_LBL }, "Produttore"), React.createElement("input", { value: f.manufacturer || "", onChange: set("manufacturer"), placeholder: "es. Philips", style: FORM_INP })),
React.createElement("div", { style: FORM_COL }, React.createElement("label", { style: FORM_LBL }, "Data emissione"), React.createElement("input", { type: "date", value: f.date || "", onChange: set("date"), style: FORM_INP }))),
React.createElement("div", { style: { marginBottom: 14 } }, React.createElement("label", { style: FORM_LBL }, "Oggetto"), React.createElement("input", { value: f.subject || "", onChange: set("subject"), placeholder: "Descrizione sintetica dell'avviso", style: FORM_INP })),
React.createElement("div", { style: FORM_ROW },
React.createElement("div", { style: FORM_COL }, React.createElement("label", { style: FORM_LBL }, "Tipo azione richiesta"), React.createElement("select", { value: f.actionType || "", onChange: set("actionType"), style: FORM_INP }, RECALL_ACTIONS.map(o => React.createElement("option", { key: o, value: o }, o)))),
React.createElement("div", { style: FORM_COL }, React.createElement("label", { style: FORM_LBL }, "Gravità"), React.createElement("select", { value: f.severity || "", onChange: set("severity"), style: FORM_INP }, RECALL_SEVERITY.map(o => React.createElement("option", { key: o, value: o }, o)))),
React.createElement("div", { style: FORM_COL }, React.createElement("label", { style: FORM_LBL }, "Stato"), React.createElement("select", { value: f.status || "", onChange: set("status"), style: FORM_INP }, RECALL_STATUSES.map(o => React.createElement("option", { key: o, value: o }, o))))),
React.createElement("div", { style: { marginBottom: 14 } }, React.createElement("label", { style: FORM_LBL }, "Link all'avviso (opzionale)"), React.createElement("input", { value: f.link || "", onChange: set("link"), placeholder: "https://…", style: FORM_INP })),
React.createElement("div", { style: { marginBottom: 14 } }, React.createElement("label", { style: FORM_LBL }, "Note"), React.createElement("textarea", { value: f.notes || "", onChange: set("notes"), rows: 3, style: Object.assign({}, FORM_INP, { resize: "vertical", fontFamily: "inherit" }) })),
React.createElement("div", { style: { marginBottom: 18 } },
React.createElement("label", { style: FORM_LBL }, "Allegati (PDF dell'avviso)"),
React.createElement(AttachmentsList, { attachments: f.attachments || [], onAdd: att => setF(x => Object.assign({}, x, { attachments: [...(x.attachments || []), att] })), onDelete: id => setF(x => Object.assign({}, x, { attachments: (x.attachments || []).filter(a => a.id !== id) })), showToast: showToast, compact: true })),
React.createElement("div", { style: { borderTop: "1px solid var(--border-2)", paddingTop: 16, marginBottom: 8 } },
React.createElement("div", { style: FORM_SECTION }, "Apparecchi coinvolti (" + ((f.affected || []).length) + ")"),
React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" } },
React.createElement("select", { value: pick, onChange: e => addAsset(e.target.value), style: Object.assign({}, FORM_INP, { flex: 1, minWidth: 180 }) },
React.createElement("option", { value: "" }, available.length ? "+ Aggiungi apparecchio…" : "Tutti gli apparecchi sono già collegati"),
available.map(a => React.createElement("option", { key: a.id, value: a.id }, assetLabel(a.id)))),
React.createElement("button", { type: "button", onClick: suggest, style: FORM_BTN_GHOST }, "Suggerisci per marca")),
(f.affected || []).length === 0
? React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)", fontStyle: "italic", padding: "6px 0" } }, "Nessun apparecchio collegato. Aggiungili dal menu o con \u201CSuggerisci per marca\u201D.")
: React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
(f.affected || []).map(af => React.createElement("div", { key: af.assetId, style: { background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "10px 12px" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 } },
React.createElement("span", { style: { fontSize: 12.5, color: "var(--text)", fontWeight: 600, lineHeight: 1.3 } }, assetLabel(af.assetId)),
React.createElement("button", { type: "button", onClick: () => rmAff(af.assetId), title: "Rimuovi", style: { background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 14, fontWeight: 700, flexShrink: 0, padding: 0 } }, "\u2715")),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 } },
React.createElement("div", null, React.createElement("label", { style: Object.assign({}, FORM_LBL, { marginBottom: 3 }) }, "Stato azione"), React.createElement("select", { value: af.status || "Da verificare", onChange: e => updAff(af.assetId, "status", e.target.value), style: Object.assign({}, FORM_INP, { padding: "8px 10px", fontSize: 13, borderColor: (RECALL_ASTATUS_COLOR[af.status || "Da verificare"] || "#888") + "66" }) }, RECALL_ASSET_STATUS.map(o => React.createElement("option", { key: o, value: o }, o)))),
React.createElement("div", null, React.createElement("label", { style: Object.assign({}, FORM_LBL, { marginBottom: 3 }) }, "Data azione"), React.createElement("input", { type: "date", value: af.date || "", onChange: e => updAff(af.assetId, "date", e.target.value), style: Object.assign({}, FORM_INP, { padding: "8px 10px", fontSize: 13 }) }))),
React.createElement("input", { value: af.note || "", onChange: e => updAff(af.assetId, "note", e.target.value), placeholder: "Nota (es. n. lotto, intervento eseguito…)", style: Object.assign({}, FORM_INP, { padding: "8px 10px", fontSize: 12.5, marginTop: 8 }) }))))),
React.createElement("div", { style: FORM_FOOTER },
React.createElement("button", { type: "button", onClick: onClose, style: FORM_BTN_GHOST }, "Annulla"),
React.createElement("button", { type: "button", onClick: submit, style: FORM_BTN_PRIMARY }, "Salva avviso")));
}
function RecallsPage({ recalls, setRecalls, assets, customers, showToast, moveToTrash, checkLocked, openRecallId, onRecallFocused }) {
const [modal, setModal] = React.useState(null);
const [search, setSearch] = React.useState("");
const [fStatus, setFStatus] = React.useState("");
React.useEffect(function () {
if (!openRecallId) return;
var rc = (recalls || []).find(function (x) { return x.id === openRecallId; });
if (rc) setModal({ data: rc });
if (onRecallFocused) onRecallFocused();
}, [openRecallId]);
const save = (form) => {
if (checkLocked && checkLocked()) return;
if (modal && modal.data) setRecalls(rs => upsertInList(rs, withUpdateMeta(Object.assign({}, form, { id: modal.data.id, createdAt: modal.data.createdAt }))));
else setRecalls(rs => upsertInList(rs, withCreateMeta(form)));
setModal(null);
showToast("Avviso salvato");
};
const del = (id) => {
if (checkLocked && checkLocked()) return;
appConfirm("Spostare questo avviso nel cestino?", () => {
const r = (recalls || []).find(x => x.id === id);
moveToTrash("recalls", r);
setRecalls(rs => rs.filter(x => x.id !== id));
showToast("Spostato nel cestino", "#f59e0b");
});
};
const list = (recalls || []).filter(r => {
if (fStatus && r.status !== fStatus) return false;
if (search) { const q = search.toLowerCase(); if (![r.ref, r.manufacturer, r.subject, r.actionType].some(x => String(x || "").toLowerCase().includes(q))) return false; }
return true;
}).sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
const pendingCount = (r) => (r.affected || []).filter(a => a.status === "Da verificare" || !a.status).length;
return React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h2", { style: { margin: 0, fontSize: 18, color: "var(--text)" } }, "Avvisi di sicurezza"),
React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)", marginTop: 2 } }, "Richiami e avvisi di sicurezza (FSN) e azioni correttive di campo")),
React.createElement("button", { onClick: () => setModal({ data: null }), style: FORM_BTN_PRIMARY }, "+ Nuovo avviso")),
React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" } },
React.createElement("input", { value: search, onChange: e => setSearch(e.target.value), placeholder: "Cerca produttore, oggetto, rif…", style: Object.assign({}, FORM_INP, { flex: 1, minWidth: 160 }) }),
React.createElement("select", { value: fStatus, onChange: e => setFStatus(e.target.value), style: Object.assign({}, FORM_INP, { maxWidth: 180 }) },
React.createElement("option", { value: "" }, "Tutti gli stati"),
RECALL_STATUSES.map(s => React.createElement("option", { key: s, value: s }, s)))),
list.length === 0
? React.createElement("div", { style: { textAlign: "center", padding: "40px 20px", background: "var(--surface)", borderRadius: 12, border: "1px dashed var(--border)", color: "var(--text-3)", fontSize: 13 } }, (recalls || []).length === 0 ? "Nessun avviso di sicurezza registrato. Crea il primo con “+ Nuovo avviso”." : "Nessun avviso corrisponde ai filtri.")
: React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
list.map(r => {
const pend = pendingCount(r);
const tot = (r.affected || []).length;
return React.createElement("div", { key: r.id, style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 12, padding: "14px 16px" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6 } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap", marginBottom: 3 } },
r.ref && React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "#5eead4", fontWeight: 700 } }, r.ref),
React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: "var(--text)" } }, r.manufacturer || "—")),
r.subject && React.createElement("div", { style: { fontSize: 13, color: "var(--text)", lineHeight: 1.35 } }, r.subject)),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end", flexShrink: 0 } },
r.severity && React.createElement(Badge, { text: r.severity, color: RECALL_SEV_COLOR[r.severity] || "var(--text-3)" }),
r.status && React.createElement(Badge, { text: r.status, color: RECALL_STATUS_COLOR[r.status] || "var(--text-3)" }))),
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginTop: 10, flexWrap: "wrap" } },
React.createElement("div", { style: { fontSize: 11.5, color: "var(--text-2)", display: "flex", gap: 10, flexWrap: "wrap" } },
r.actionType && React.createElement("span", null, r.actionType),
r.date && React.createElement("span", null, r.date),
tot > 0 && React.createElement("span", { style: { color: pend > 0 ? "#f59e0b" : "#22c55e", fontWeight: 700 } }, tot + " app." + (pend > 0 ? (" · " + pend + " da gestire") : " · tutti gestiti"))),
React.createElement("div", { style: { display: "flex", gap: 6 } },
React.createElement("button", { onClick: () => setModal({ data: r }), style: { background: "var(--surface-3)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text-2)", padding: "5px 12px", cursor: "pointer", fontSize: 12, fontWeight: 700 } }, "Apri"),
React.createElement("button", { onClick: () => del(r.id), title: "Elimina", style: { background: "var(--surface-3)", border: "1px solid #ef444433", borderRadius: 6, color: "#ef4444", padding: "5px 10px", cursor: "pointer", fontSize: 13, fontWeight: 700 } }, "\u2715"))));
})),
modal && React.createElement(Modal, { title: modal.data ? "Modifica avviso di sicurezza" : "Nuovo avviso di sicurezza", wide: true, onClose: () => setModal(null) },
React.createElement(RecallForm, { recall: modal.data, assets: assets, customers: customers, onSave: save, onClose: () => setModal(null), showToast: showToast })));
}

function InstrumentsPage({ instruments, setInstruments, showToast, checkLocked }) {
const [modal, setModal] = React.useState(null);
const [search, setSearch] = React.useState('');
const [filterStatus, setFilterStatus] = React.useState("");
const [filterCategory, setFilterCategory] = React.useState("");
const [filterOpen, setFilterOpen] = React.useState(false);
const isMobile = useMedia("(max-width:600px)");
const TODAY = new Date();
const getStatus = (inst) => {
if (!inst.calExpiry)
return { label: 'Non impostata', color: 'var(--text-3)', days: null, key: 'none' };
const expiry = new Date(inst.calExpiry);
const days = Math.round((expiry - TODAY) / 86400000);
if (days < 0)
return { label: 'SCADUTA', color: '#ef4444', days, key: 'expired' };
if (days <= 30)
return { label: `Scade in ${days}gg`, color: '#ef4444', days, key: 'expiring' };
if (days <= 60)
return { label: `Scade in ${days}gg`, color: '#f59e0b', days, key: 'soon' };
return { label: `Valida (${days}gg)`, color: '#22c55e', days, key: 'valid' };
};
const saveInstrument = (data) => {
if (checkLocked && checkLocked())
return;
if (data.id) {
const upd = withUpdateMeta(data);
setInstruments(prev => prev.map(x => x.id === data.id ? upd : x));
}
else {
const newInst = withCreateMeta(data);
setInstruments(prev => [...prev, newInst]);
}
setModal(null);
showToast('✓ Strumento salvato');
};
const deleteInstrument = (id) => {
if (checkLocked && checkLocked())
return;
if (!confirm('Eliminare questo strumento?'))
return;
setInstruments(prev => prev.filter(x => x.id !== id));
showToast('Strumento eliminato');
};
const filtered = instruments.filter(i => {
if (search) {
const q = search.toLowerCase();
if (![i.brand, i.model, i.serial, i.internalCode, i.category, i.calLab, i.certNumber]
.some(v => v && v.toLowerCase().includes(q)))
return false;
}
if (filterCategory && i.category !== filterCategory)
return false;
if (filterStatus) {
const s = getStatus(i);
if (filterStatus === "valid" && s.key !== "valid")
return false;
if (filterStatus === "expiring" && s.key !== "soon" && s.key !== "expiring")
return false;
if (filterStatus === "expired" && s.key !== "expired")
return false;
if (filterStatus === "none" && s.key !== "none")
return false;
}
return true;
});
const expired = instruments.filter(i => getStatus(i).key === 'expired').length;
const expiring = instruments.filter(i => { const k = getStatus(i).key; return k === 'soon' || k === 'expiring'; }).length;
const valid = instruments.filter(i => getStatus(i).key === 'valid').length;
const categories = [...new Set(instruments.map(i => i.category).filter(Boolean))].sort();
const activeFilterCount = (filterStatus ? 1 : 0) + (filterCategory ? 1 : 0);
return (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900, display: isMobile ? "none" : "block" } }, "Strumenti di Misura"),
React.createElement("p", { style: { color: "var(--text-3)", margin: "2px 0 0", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" } },
instruments.length,
" strumenti \u00B7 ",
valid,
" validi \u00B7 ",
expiring,
" in scadenza \u00B7 ",
expired,
" scaduti")),
React.createElement(Btn, { sm: true, onClick: () => setModal({ type: 'form', data: null }) }, "+ Nuovo strumento")),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 10, marginBottom: 16 } }, [
{ label: 'Totale', value: instruments.length, color: '#2dd4bf' },
{ label: 'Validi', value: valid, color: '#22c55e' },
{ label: 'In scadenza', value: expiring, color: '#f59e0b' },
{ label: 'Scaduti', value: expired, color: '#ef4444' },
].map(k => (React.createElement("div", { key: k.label, style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 10, padding: "12px 14px" } },
React.createElement("div", { style: { fontSize: 24, fontWeight: 900, color: k.color, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1 } }, k.value),
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", marginTop: 5, textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } }, k.label))))),
instruments.length === 0 ? (React.createElement(EmptyState, { icon: "\uD83D\uDD2C", title: "Nessuno strumento di misura", subtitle: "Registra i tuoi analizzatori, simulatori e multimetri: marca, modello, n\u00B0 serie, certificato di calibrazione e scadenza. Garantisce la rintracciabilit\u00E0 delle tue verifiche.", actions: [
{ label: "+ Nuovo strumento", onClick: () => setModal({ type: 'form', data: null }), primary: true }
] })) : (React.createElement(React.Fragment, null,
React.createElement(MobileSearch, { value: search, onChange: setSearch, placeholder: "Cerca per marca, modello, seriale, categoria\u2026", count: filtered.length, total: instruments.length }),
React.createElement(FilterDropdown, { filters: {
status: { label: "Stato calibrazione", options: ["valid", "expiring", "expired", "none"].map(v => ({ valid: "Valida", expiring: "In scadenza", expired: "Scaduta", none: "Non impostata" }[v])), value: filterStatus ? ({ valid: "Valida", expiring: "In scadenza", expired: "Scaduta", none: "Non impostata" }[filterStatus]) : "" },
category: { label: "Categoria", options: categories, value: filterCategory },
}, onChange: (k, v) => {
if (k === "status") {
const map = { "Valida": "valid", "In scadenza": "expiring", "Scaduta": "expired", "Non impostata": "none" };
setFilterStatus(map[v] || "");
}
else if (k === "category") {
setFilterCategory(v);
}
}, onClearAll: () => { setFilterStatus(""); setFilterCategory(""); } }),
filtered.length === 0 ? (React.createElement("div", { style: { textAlign: "center", padding: "30px 20px", background: "var(--surface)", borderRadius: 10, border: "1px dashed var(--border)", fontSize: 13, color: "var(--text-3)" } }, "Nessuno strumento corrisponde alla ricerca o ai filtri")) : isMobile ? (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, filtered.map(inst => {
const status = getStatus(inst);
return (React.createElement(SwipeableCard, { key: inst.id, onDelete: () => deleteInstrument(inst.id) },
React.createElement("div", { style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 12, overflow: "hidden", borderLeft: "3px solid " + status.color } },
React.createElement("div", { onClick: () => setModal({ type: 'form', data: inst }), style: { padding: "12px 14px 10px", cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", borderBottom: "1px solid var(--border-2)" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 } },
React.createElement("strong", { style: { color: "var(--text)", fontSize: 14, flex: 1, minWidth: 0, wordBreak: "break-word" } },
inst.brand,
" ",
inst.model),
React.createElement("span", { style: { padding: "2px 8px", background: status.color + "22", color: status.color, borderRadius: 5, fontSize: 10, fontWeight: 800, whiteSpace: "nowrap" } }, status.label)),
inst.internalCode && React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 3 } },
"Codice: ",
inst.internalCode),
inst.serial && React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginBottom: 3 } },
"S/N: ",
inst.serial),
inst.category && React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", marginBottom: 3 } }, inst.category),
inst.calExpiry && React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", marginTop: 4 } },
"Scadenza: ",
React.createElement("span", { style: { color: status.color, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" } }, inst.calExpiry)),
inst.calLab && React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 3 } },
"Lab: ",
inst.calLab)),
React.createElement("div", { style: { display: "flex", justifyContent: "space-around", background: "var(--bg-2)" } },
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: 'renew', data: inst }); }, style: { flex: 1, background: "transparent", color: "#2dd4bf", border: "none", borderRight: "1px solid var(--border-2)", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u21BB Rinnova"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: 'form', data: inst }); }, style: { flex: 1, background: "transparent", color: "var(--text-2)", border: "none", borderRight: "1px solid var(--border-2)", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u270F Modifica"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); deleteInstrument(inst.id); }, style: { background: "transparent", color: "#ef4444", border: "none", padding: "10px 14px", fontSize: 14, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u2715")))));
}))) : (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, filtered.map(inst => {
const status = getStatus(inst);
return (React.createElement("div", { key: inst.id, style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderLeft: "3px solid " + status.color, borderRadius: 10, padding: "12px 16px" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 5 } },
React.createElement("span", { style: { fontSize: 14, fontWeight: 800, color: "var(--text)" } },
inst.brand,
" ",
inst.model),
inst.internalCode && React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "var(--text-3)", background: "var(--bg)", borderRadius: 4, padding: "1px 6px", border: "1px solid var(--border-2)" } }, inst.internalCode),
inst.category && React.createElement("span", { style: { fontSize: 10, color: "var(--text-2)", background: "var(--border-2)", borderRadius: 4, padding: "1px 8px" } }, inst.category),
React.createElement("span", { style: { padding: "2px 10px", background: status.color + "22", color: status.color, border: `1px solid ${status.color}44`, borderRadius: 20, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" } }, status.label)),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", display: "flex", gap: 14, flexWrap: "wrap" } },
inst.serial && React.createElement("span", null,
"S/N: ",
React.createElement("span", { style: { color: "var(--text-2)", fontFamily: "'IBM Plex Mono', monospace" } }, inst.serial)),
inst.calDate && React.createElement("span", null,
"Ultima cal.: ",
React.createElement("span", { style: { color: "var(--text-2)", fontFamily: "'IBM Plex Mono', monospace" } }, inst.calDate)),
inst.calExpiry && React.createElement("span", null,
"Scadenza: ",
React.createElement("span", { style: { color: status.color, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" } }, inst.calExpiry)),
inst.calLab && React.createElement("span", null,
"Lab: ",
React.createElement("span", { style: { color: "var(--text-2)" } }, inst.calLab)),
inst.certNumber && React.createElement("span", null,
"Cert.: ",
React.createElement("span", { style: { color: "var(--text-2)", fontFamily: "'IBM Plex Mono', monospace" } }, inst.certNumber))),
inst.notes && React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", marginTop: 6, background: "var(--bg)", borderRadius: 6, padding: "6px 10px", border: "1px solid var(--border-2)" } }, inst.notes)),
React.createElement("div", { style: { display: "flex", gap: 6, flexShrink: 0 } },
React.createElement("button", { onClick: () => setModal({ type: 'renew', data: inst }), style: { background: "transparent", color: "#2dd4bf", border: "1px solid #2dd4bf44", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 11, fontWeight: 700 } }, "\u21BB Rinnova"),
React.createElement("button", { onClick: () => setModal({ type: 'form', data: inst }), style: { background: "transparent", color: "var(--text-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 11, fontWeight: 700 } }, "\u270F Modifica"),
React.createElement("button", { onClick: () => deleteInstrument(inst.id), style: { background: "transparent", color: "#ef4444", border: "1px solid #ef444433", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 11, fontWeight: 700 } }, "\u2715")))));
}))))),
(modal === null || modal === void 0 ? void 0 : modal.type) === 'form' && (React.createElement(Modal, { title: modal.data ? 'Modifica Strumento' : 'Nuovo Strumento', onClose: () => setModal(null) },
React.createElement(InstrumentForm, { initial: modal.data, onSave: saveInstrument, onClose: () => setModal(null) }))),
(modal === null || modal === void 0 ? void 0 : modal.type) === 'renew' && (React.createElement(Modal, { title: "Rinnova Calibrazione", onClose: () => setModal(null) },
React.createElement(RenewCalibrationForm, { instrument: modal.data, onSave: (data) => { saveInstrument(data); showToast('✓ Calibrazione rinnovata'); }, onClose: () => setModal(null) })))));
}
function InstrumentForm({ initial, onSave, onClose }) {
const [form, setForm] = React.useState(initial || {
brand: '', model: '', serial: '', internalCode: '', category: '',
calDate: '', calExpiry: '', calLab: '', certNumber: '', calInterval: 12, notes: ''
});
const [errors, setErrors] = React.useState({});
const set = (k, v) => setForm(f => (Object.assign(Object.assign({}, f), { [k]: v })));
const calcExpiry = (date, months) => {
if (!date || !months)
return '';
const d = new Date(date);
d.setMonth(d.getMonth() + parseInt(months));
return d.toISOString().slice(0, 10);
};
const INP = FORM_INP;
const LBL = FORM_LBL;
const ROW = FORM_ROW;
const COL = FORM_COL;
return (React.createElement("div", null,
React.createElement(ErrorSummary, { errors: errors }),
React.createElement("div", { style: ROW },
React.createElement("div", { style: COL },
React.createElement("label", { style: LBL }, "Marca *"),
React.createElement("input", { style: INP, value: form.brand, onChange: e => set('brand', e.target.value), placeholder: "es. Fluke, Rigel, Metrolab" })),
React.createElement("div", { style: COL },
React.createElement("label", { style: LBL }, "Modello *"),
React.createElement("input", { style: INP, value: form.model, onChange: e => set('model', e.target.value), placeholder: "es. 435-II, 288+" }))),
React.createElement("div", { style: ROW },
React.createElement("div", { style: COL },
React.createElement("label", { style: LBL }, "N\u00B0 Serie"),
React.createElement("input", { style: INP, value: form.serial, onChange: e => set('serial', e.target.value), placeholder: "Seriale costruttore" })),
React.createElement("div", { style: COL },
React.createElement("label", { style: LBL }, "Codice interno"),
React.createElement("input", { style: INP, value: form.internalCode, onChange: e => set('internalCode', e.target.value), placeholder: "es. STR-001" }))),
React.createElement("div", { style: { marginBottom: 12 } },
React.createElement("label", { style: LBL }, "Categoria"),
React.createElement("select", { style: INP, value: form.category, onChange: e => set('category', e.target.value) },
React.createElement("option", { value: "" }, "\u2014 Seleziona \u2014"),
CATEGORIES.map(c => React.createElement("option", { key: c, value: c }, c)))),
React.createElement("div", { style: { borderTop: '1px solid #2A2A38', margin: '14px 0 12px', paddingTop: 14 } },
React.createElement("div", { style: { fontSize: 11, color: '#2dd4bf', fontWeight: 700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 } }, "Dati Calibrazione"),
React.createElement("div", { style: ROW },
React.createElement("div", { style: COL },
React.createElement("label", { style: LBL }, "Data ultima calibrazione"),
React.createElement("input", { type: "date", style: INP, value: form.calDate, onChange: e => { set('calDate', e.target.value); set('calExpiry', calcExpiry(e.target.value, form.calInterval)); } })),
React.createElement("div", { style: { width: 120 } },
React.createElement("label", { style: LBL }, "Intervallo (mesi)"),
React.createElement("select", { style: INP, value: form.calInterval, onChange: e => { set('calInterval', e.target.value); set('calExpiry', calcExpiry(form.calDate, e.target.value)); } }, [6, 12, 24, 36].map(m => React.createElement("option", { key: m, value: m },
m,
" mesi"))))),
React.createElement("div", { style: ROW },
React.createElement("div", { style: COL },
React.createElement("label", { style: LBL }, "Scadenza calibrazione"),
React.createElement("input", { type: "date", style: Object.assign(Object.assign({}, INP), { color: form.calExpiry && new Date(form.calExpiry) < new Date() ? '#ef4444' : 'var(--text-bright)' }), value: form.calExpiry, onChange: e => set('calExpiry', e.target.value) })),
React.createElement("div", { style: COL },
React.createElement("label", { style: LBL }, "Laboratorio calibrazione"),
React.createElement("input", { style: INP, value: form.calLab, onChange: e => set('calLab', e.target.value), placeholder: "es. ACCREDIA, SIT, interno" }))),
React.createElement("div", { style: ROW },
React.createElement("div", { style: COL },
React.createElement("label", { style: LBL }, "N\u00B0 Certificato calibrazione"),
React.createElement("input", { style: INP, value: form.certNumber, onChange: e => set('certNumber', e.target.value), placeholder: "es. CAL-2025-0123" })))),
React.createElement("div", { style: { marginBottom: 14 } },
React.createElement("label", { style: LBL }, "Note"),
React.createElement("textarea", { style: Object.assign(Object.assign({}, INP), { minHeight: 60, resize: 'vertical' }), value: form.notes, onChange: e => set('notes', e.target.value), placeholder: "Note aggiuntive\u2026" })),
React.createElement("div", { style: FORM_FOOTER },
React.createElement("button", { onClick: onClose, style: FORM_BTN_GHOST }, "Annulla"),
React.createElement("button", { onClick: () => {
var _a, _b;
const errs = {};
if (!((_a = form.brand) === null || _a === void 0 ? void 0 : _a.trim()))
errs.brand = "La marca è obbligatoria";
if (!((_b = form.model) === null || _b === void 0 ? void 0 : _b.trim()))
errs.model = "Il modello è obbligatorio";
setErrors(errs);
if (Object.keys(errs).length > 0)
return;
onSave(form);
}, style: FORM_BTN_PRIMARY }, initial ? 'Salva modifiche' : 'Aggiungi strumento'))));
}
function RenewCalibrationForm({ instrument, onSave, onClose }) {
const today = new Date().toISOString().slice(0, 10);
const [form, setForm] = React.useState(Object.assign(Object.assign({}, instrument), { calDate: today, calExpiry: (() => { const d = new Date(today); d.setMonth(d.getMonth() + (instrument.calInterval || 12)); return d.toISOString().slice(0, 10); })(), certNumber: '', calLab: instrument.calLab || '' }));
const set = (k, v) => setForm(f => (Object.assign(Object.assign({}, f), { [k]: v })));
const INP = FORM_INP;
const LBL = FORM_LBL;
return (React.createElement("div", null,
React.createElement("div", { style: { background: 'var(--surface)', borderRadius: 8, padding: '10px 14px', marginBottom: 14,
border: '1px solid #2A2A38', fontSize: 13, color: 'var(--text-2)' } },
React.createElement("strong", { style: { color: 'var(--text-bright)' } },
instrument.brand,
" ",
instrument.model),
instrument.serial && React.createElement("span", { style: { marginLeft: 8, fontFamily: 'monospace', fontSize: 11 } },
"S/N: ",
instrument.serial)),
React.createElement("div", { style: { display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' } },
React.createElement("div", { style: { flex: 1, minWidth: 140 } },
React.createElement("label", { style: LBL }, "Data calibrazione *"),
React.createElement("input", { type: "date", style: INP, value: form.calDate, onChange: e => { set('calDate', e.target.value); const d = new Date(e.target.value); d.setMonth(d.getMonth() + (form.calInterval || 12)); set('calExpiry', d.toISOString().slice(0, 10)); } })),
React.createElement("div", { style: { flex: 1, minWidth: 140 } },
React.createElement("label", { style: LBL }, "Nuova scadenza"),
React.createElement("input", { type: "date", style: Object.assign(Object.assign({}, INP), { color: '#22c55e' }), value: form.calExpiry, onChange: e => set('calExpiry', e.target.value) }))),
React.createElement("div", { style: { marginBottom: 12 } },
React.createElement("label", { style: LBL }, "Laboratorio calibrazione"),
React.createElement("input", { style: INP, value: form.calLab, onChange: e => set('calLab', e.target.value), placeholder: "es. ACCREDIA lab 0123" })),
React.createElement("div", { style: { marginBottom: 14 } },
React.createElement("label", { style: LBL }, "N\u00B0 Nuovo certificato"),
React.createElement("input", { style: INP, value: form.certNumber, onChange: e => set('certNumber', e.target.value), placeholder: "es. CAL-2026-0456" })),
React.createElement("div", { style: { display: 'flex', gap: 8, justifyContent: 'flex-end' } },
React.createElement("button", { onClick: onClose, style: FORM_BTN_GHOST }, "Annulla"),
React.createElement("button", { onClick: () => onSave(form), style: FORM_BTN_PRIMARY }, "\u21BB Salva rinnovo"))));
}
const PROC_CATEGORIES = [
'Defibrillatore', 'Monitor multiparametrico', 'Ventilatore', 'Aspiratore',
'Pompa infusionale', 'Elettrobisturi', 'Ecografo', 'Letto elettrico', 'ECG',
'Termometro', 'DAE', 'Generico/Altro',
];
const PROC_TYPES = [
'PPM annuale', 'PPM semestrale', 'PPM trimestrale',
'Calibrazione', 'Verifica sicurezza elettrica', 'Troubleshooting',
'Sostituzione componente', 'Aggiornamento firmware', 'Cleaning/Disinfezione', 'Altro',
];
function AIDraftModal({ onUseDraft, onClose }) {
const [manualText, setManualText] = React.useState("");
const [tipo, setTipo] = React.useState("manutenzione");
const [modello, setModello] = React.useState("");
const [loading, setLoading] = React.useState(false);
const [result, setResult] = React.useState("");
const [error, setError] = React.useState("");
const FLD = { background: "var(--card)", border: "1px solid var(--border-3)", borderRadius: 8, color: "var(--text)", fontSize: 13, padding: "9px 11px", outline: "none", width: "100%", boxSizing: "border-box", fontFamily: "inherit" };
const genera = () => __awaiter(this, void 0, void 0, function* () {
if (!manualText.trim()) {
setError("Incolla prima il testo del manuale.");
return;
}
setError("");
setLoading(true);
setResult("");
const cosa = tipo === "manutenzione"
? "una PROCEDURA DI MANUTENZIONE/SMONTAGGIO passo-passo, numerata, con eventuali avvertenze di sicurezza e attrezzi necessari"
: "una CHECKLIST DI VERIFICA FUNZIONALE, come elenco di controlli con esito atteso (OK/NO), pronta da spuntare";
const sys = "Sei un assistente tecnico per la manutenzione di apparecchiature elettromedicali. " +
"Lavori ESCLUSIVAMENTE sul testo del manuale che ti viene fornito. " +
"NON inventare valori, passaggi o controlli che non sono nel testo: se un'informazione manca, scrivi esattamente [DA VERIFICARE SUL MANUALE]. " +
"Scrivi in italiano, in modo chiaro e operativo. Non aggiungere disclaimer, li gestisce gia' l'app.";
const prompt = "Dal seguente testo di manuale" + (modello ? (" dell'apparecchio " + modello) : "") + ", genera " + cosa + ".\n\n" +
"Restituisci SOLO il contenuto della bozza, senza introduzioni.\n\n=== TESTO MANUALE ===\n" + manualText.slice(0, 12000);
try {
const resp = yield fetch("https://api.anthropic.com/v1/messages", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
model: "claude-sonnet-4-20250514",
max_tokens: 1500,
system: sys,
messages: [{ role: "user", content: prompt }],
}),
});
if (!resp.ok) {
throw new Error("HTTP " + resp.status);
}
const data = yield resp.json();
const text = (data.content || []).map(b => b.type === "text" ? b.text : "").filter(Boolean).join("\n").trim();
if (!text) {
throw new Error("Risposta vuota");
}
setResult(text);
}
catch (e) {
setError("Non è stato possibile generare la bozza. La funzione AI richiede la connessione e la configurazione dell'API nel deploy. Dettaglio: " + (e.message || e));
}
finally {
setLoading(false);
}
});
const usaComeProc = () => {
onUseDraft({
modelName: modello || "",
category: tipo === "manutenzione" ? "Manutenzione" : "Verifica",
type: tipo === "manutenzione" ? "Preventiva" : "Funzionale",
notes: "⚠ BOZZA GENERATA DA AI — DA VERIFICARE SUL MANUALE PRIMA DELL'USO\n\n" + result,
_aiDraft: true,
});
};
return (React.createElement("div", null,
React.createElement("div", { style: { background: "#f59e0b15", border: "1px solid #f59e0b55", borderRadius: 8, padding: "11px 13px", marginBottom: 16, fontSize: 11.5, color: "#fbbf24", lineHeight: 1.5 } },
React.createElement("strong", null, "\u26A0 Bozza, non documento ufficiale."),
" L'AI genera una proposta basata solo sul testo che incolli. Va ",
React.createElement("strong", null, "verificata sul manuale del costruttore da un tecnico qualificato"),
" prima dell'uso. Non sostituisce la documentazione ufficiale n\u00E9 solleva da responsabilit\u00E0. Dove manca un dato comparir\u00E0 ",
React.createElement("code", null, "[DA VERIFICARE SUL MANUALE]"),
"."),
!result && (React.createElement(React.Fragment, null,
React.createElement("div", { style: { marginBottom: 12 } },
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .6, fontWeight: 700, marginBottom: 5 } }, "Cosa generare"),
React.createElement("div", { style: { display: "flex", gap: 8 } }, [["manutenzione", "\uD83D\uDD27 Procedura manutenzione"], ["checklist", "✓ Checklist verifica funzionale"]].map(([v, l]) => {
const on = tipo === v;
return React.createElement("button", { key: v, onClick: () => setTipo(v), style: { flex: 1, background: on ? "#1F7468" : "var(--card)", border: "1px solid " + (on ? "#2dd4bf" : "var(--border-3)"), borderRadius: 8, padding: "9px 8px", cursor: "pointer", color: on ? "#04201C" : "var(--text-strong)", fontSize: 12, fontWeight: on ? 800 : 600 } }, l);
}))),
React.createElement("div", { style: { marginBottom: 12 } },
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .6, fontWeight: 700, marginBottom: 5 } }, "Modello apparecchio (facoltativo)"),
React.createElement("input", { value: modello, onChange: e => setModello(e.target.value), placeholder: "es. Defibrillatore XYZ 2000", style: FLD })),
React.createElement("div", { style: { marginBottom: 14 } },
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .6, fontWeight: 700, marginBottom: 5 } }, "Testo del manuale (incolla la sezione che ti interessa)"),
React.createElement("textarea", { value: manualText, onChange: e => setManualText(e.target.value), rows: 9, placeholder: "Incolla qui il testo del manuale relativo alla manutenzione o alla verifica\u2026", style: Object.assign(Object.assign({}, FLD), { resize: "vertical", lineHeight: 1.5 }) }),
React.createElement("div", { style: { fontSize: 10.5, color: "var(--text-4)", marginTop: 4 } }, "Suggerimento: incolla solo le pagine pertinenti (non l'intero manuale). Max ~12.000 caratteri.")),
error && React.createElement("div", { style: { background: "#ef444415", border: "1px solid #ef444455", borderRadius: 8, padding: "10px 12px", marginBottom: 12, fontSize: 12, color: "#fca5a5", lineHeight: 1.5 } }, error),
React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8 } },
React.createElement("button", { onClick: onClose, style: { background: "transparent", border: "1px solid var(--border)", borderRadius: 7, color: "var(--text-2)", padding: "9px 14px", fontSize: 12.5, fontWeight: 700, cursor: "pointer" } }, "Annulla"),
React.createElement("button", { onClick: genera, disabled: loading, style: { background: loading ? "#0d948855" : "#1F7468", border: "none", borderRadius: 7, color: "#04201C", padding: "9px 16px", fontSize: 12.5, fontWeight: 800, cursor: loading ? "default" : "pointer" } }, loading ? "Genero…" : "Genera bozza")))),
result && (React.createElement(React.Fragment, null,
React.createElement("div", { style: { background: "var(--bg)", border: "1px solid var(--border-3)", borderRadius: 8, padding: "13px 15px", marginBottom: 14, maxHeight: "45vh", overflow: "auto", fontSize: 12.5, color: "var(--text)", lineHeight: 1.6, whiteSpace: "pre-line" } }, result),
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" } },
React.createElement("button", { onClick: () => { setResult(""); }, style: { background: "transparent", border: "1px solid var(--border)", borderRadius: 7, color: "var(--text-2)", padding: "9px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" } }, "\u2190 Rigenera"),
React.createElement("div", { style: { display: "flex", gap: 8 } },
React.createElement("button", { onClick: () => { try {
navigator.clipboard.writeText(result);
}
catch (e) { } }, style: { background: "transparent", border: "1px solid var(--border)", borderRadius: 7, color: "var(--text-2)", padding: "9px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" } }, "Copia"),
React.createElement("button", { onClick: usaComeProc, style: { background: "#2dd4bf", border: "none", borderRadius: 7, color: "#04201C", padding: "9px 16px", fontSize: 12.5, fontWeight: 800, cursor: "pointer" } }, "Usa come bozza procedura \u2192")))))));
}
function ProceduresPage({ procedures, setProcedures, instruments, parts, assets, showToast, setTab, moveToTrash }) {
const [modal, setModal] = React.useState(null);
const [search, setSearch] = React.useState('');
const [filterCat, setFilterCat] = React.useState('all');
const [filterType, setFilterType] = React.useState('all');
const [viewProcId, setViewProcId] = React.useState(null);
const filtered = procedures.filter(p => {
if (search) {
const q = search.toLowerCase();
const hit = [p.modelName, p.brand, p.category, p.type, p.notes]
.filter(Boolean).some(s => s.toLowerCase().includes(q));
if (!hit)
return false;
}
if (filterCat !== 'all' && p.category !== filterCat)
return false;
if (filterType !== 'all' && p.type !== filterType)
return false;
return true;
});
const saveProc = (proc) => {
if (proc.id) {
const upd = withUpdateMeta(proc);
setProcedures(prev => prev.map(p => p.id === proc.id ? upd : p));
}
else {
const newP = withCreateMeta(proc);
setProcedures(prev => [...prev, newP]);
}
setModal(null);
showToast('✓ Procedura salvata');
};
const delProc = (id) => {
if (!confirm('Spostare questa procedura nel cestino?'))
return;
const rec = procedures.find(p => p.id === id);
if (moveToTrash && rec)
moveToTrash("procedures", rec);
setProcedures(prev => prev.filter(p => p.id !== id));
setViewProcId(null);
showToast('Spostato nel cestino', '#f59e0b');
};
const duplicateProc = (proc) => {
const copy = Object.assign(Object.assign({}, proc), { id: 'P' + Date.now(), modelName: proc.modelName + ' (copia)', createdAt: new Date().toISOString() });
setProcedures(prev => [...prev, copy]);
showToast('✓ Duplicata');
};
if (viewProcId) {
const proc = procedures.find(p => p.id === viewProcId);
if (!proc) {
setViewProcId(null);
return null;
}
return React.createElement(ProcedureDetail, { proc: proc, onEdit: () => setModal({ type: 'form', data: proc }), onDuplicate: () => duplicateProc(proc), onDelete: () => delProc(proc.id), onBack: () => setViewProcId(null), showToast: showToast });
}
return (React.createElement("div", { style: { padding: '16px 20px', maxWidth: 1100, margin: '0 auto' } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 20, fontWeight: 900 } }, "Procedure Tecniche"),
React.createElement("p", { style: { color: 'var(--text-3)', margin: '3px 0 0', fontSize: 12 } }, "Guide passo-passo per modello specifico (knowledge base interna)")),
React.createElement("div", { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } },
false && (React.createElement("button", { onClick: () => setModal({ type: 'aiDraft' }), style: { background: 'var(--surface-2)', color: '#c084fc', border: '1px solid #a855f744', borderRadius: 9, padding: '10px 15px', cursor: 'pointer', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' } }, "\u2728 Genera bozza con AI")),
React.createElement("button", { onClick: () => setModal({ type: 'form', data: null }), style: FORM_BTN_PRIMARY }, "+ Nuova procedura"))),
React.createElement("div", { style: { display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' } },
React.createElement("input", { value: search, onChange: e => setSearch(e.target.value), placeholder: "Cerca per modello, marca, categoria\u2026", style: { flex: 1, minWidth: 200, background: 'var(--surface)', border: '1px solid #2A2A38', borderRadius: 8, padding: '8px 12px', color: 'var(--text-bright)', fontSize: 13, outline: 'none' } }),
React.createElement("select", { value: filterCat, onChange: e => setFilterCat(e.target.value), style: { background: 'var(--surface)', border: '1px solid #2A2A38', borderRadius: 8, padding: '8px 12px', color: 'var(--text-2)', fontSize: 12 } },
React.createElement("option", { value: "all" }, "Tutte le categorie"),
PROC_CATEGORIES.map(c => React.createElement("option", { key: c, value: c }, c))),
React.createElement("select", { value: filterType, onChange: e => setFilterType(e.target.value), style: { background: 'var(--surface)', border: '1px solid #2A2A38', borderRadius: 8, padding: '8px 12px', color: 'var(--text-2)', fontSize: 12 } },
React.createElement("option", { value: "all" }, "Tutti i tipi"),
PROC_TYPES.map(t => React.createElement("option", { key: t, value: t }, t)))),
React.createElement("div", { style: { fontSize: 11, color: 'var(--text-3)', marginBottom: 12 } },
filtered.length,
" di ",
procedures.length,
" procedure"),
filtered.length === 0 ? (React.createElement("div", null, procedures.length === 0 ? (React.createElement(EmptyState, { icon: "\uD83D\uDCDA", title: "Nessuna procedura ancora", subtitle: "Crea procedure tecniche passo-passo come una knowledge base in stile iFixit. Aggiungi passi numerati, valori attesi, foto e checklist.", actions: [
{ label: "+ Crea procedura", onClick: () => setModal({ type: 'form', data: null }), primary: true }
] })) : (React.createElement("div", { style: { textAlign: 'center', padding: 48, color: 'var(--text-3)', background: 'var(--surface)', borderRadius: 12, border: '1px solid #2A2A38', fontSize: 13 } }, "Nessuna procedura corrisponde ai filtri")))) : (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: 8 } }, filtered.map(p => (React.createElement("div", { key: p.id, onClick: () => setViewProcId(p.id), style: { background: 'var(--surface)', border: '1px solid #2A2A38', borderRadius: 10, padding: '14px 16px', cursor: 'pointer', transition: 'all .15s' }, onMouseEnter: e => e.currentTarget.style.borderColor = '#2dd4bf66', onMouseLeave: e => e.currentTarget.style.borderColor = 'var(--border-4)' },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginBottom: 5 } },
p.category && React.createElement("span", { style: { fontSize: 10, background: '#2dd4bf18', color: '#2dd4bf', border: '1px solid #2dd4bf33', borderRadius: 20, padding: '1px 8px', fontWeight: 700 } }, p.category),
p.type && React.createElement("span", { style: { fontSize: 10, background: '#a855f718', color: '#a855f7', border: '1px solid #a855f733', borderRadius: 20, padding: '1px 8px', fontWeight: 700 } }, p.type)),
React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 3 } },
p.brand && React.createElement("span", { style: { color: 'var(--text-2)' } }, p.brand),
" ",
p.modelName),
React.createElement("div", { style: { fontSize: 11, color: 'var(--text-3)', display: 'flex', gap: 14, flexWrap: 'wrap' } },
p.steps && React.createElement("span", null,
"\uD83D\uDCCB ",
p.steps.length,
" step"),
p.estimatedMinutes && React.createElement("span", null,
"\u23F1 ~",
p.estimatedMinutes,
" min"),
p.toolsRequired && p.toolsRequired.length > 0 && React.createElement("span", null,
"\uD83D\uDD27 ",
p.toolsRequired.length,
" strumenti"))),
React.createElement("div", { style: { flexShrink: 0, fontSize: 18, color: 'var(--text-3)' } }, "\u203A"))))))),
(modal === null || modal === void 0 ? void 0 : modal.type) === 'form' && (React.createElement(Modal, { title: modal.data ? 'Modifica Procedura' : 'Nuova Procedura', wide: true, onClose: () => setModal(null) },
React.createElement(ProcedureForm, { initial: modal.data, instruments: instruments, parts: parts, onSave: saveProc, onClose: () => setModal(null) }))),
(modal === null || modal === void 0 ? void 0 : modal.type) === 'aiDraft' && (React.createElement(Modal, { title: "\u2728 Genera bozza con AI", wide: true, onClose: () => setModal(null) },
React.createElement(AIDraftModal, { onUseDraft: (proc) => { setModal({ type: 'form', data: proc }); }, onClose: () => setModal(null) })))));
}
function ProcedureDetail({ proc, onEdit, onDuplicate, onDelete, onBack, showToast }) {
var _a;
return (React.createElement("div", { style: { padding: '16px 20px', maxWidth: 900, margin: '0 auto' } },
React.createElement("button", { onClick: onBack, style: { background: 'var(--surface-2)', border: '1px solid #2a3040', borderRadius: 6, color: 'var(--text-2)', padding: '5px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 700, marginBottom: 12 } }, "\u2190 Procedure"),
React.createElement("div", { style: { background: 'var(--surface)', border: '1px solid #2A2A38', borderRadius: 12, padding: '18px 20px', marginBottom: 14 } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap', marginBottom: 10 } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 } },
proc.category && React.createElement("span", { style: { fontSize: 10, background: '#2dd4bf18', color: '#2dd4bf', border: '1px solid #2dd4bf33', borderRadius: 20, padding: '2px 10px', fontWeight: 700 } }, proc.category),
proc.type && React.createElement("span", { style: { fontSize: 10, background: '#a855f718', color: '#a855f7', border: '1px solid #a855f733', borderRadius: 20, padding: '2px 10px', fontWeight: 700 } }, proc.type)),
React.createElement("h1", { style: { margin: 0, fontSize: 20, fontWeight: 900, color: 'var(--text-bright)' } },
proc.brand,
" ",
proc.modelName),
proc.description && React.createElement("p", { style: { margin: '6px 0 0', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 } }, proc.description)),
React.createElement("div", { style: { display: 'flex', gap: 6, flexShrink: 0 } },
React.createElement("button", { onClick: onEdit, style: { background: 'var(--surface-2)', border: '1px solid #2dd4bf44', borderRadius: 6, color: '#2dd4bf', padding: '6px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 700 } }, "\u270F Modifica"),
React.createElement("button", { onClick: onDuplicate, style: { background: 'var(--surface-2)', border: '1px solid #2a3040', borderRadius: 6, color: 'var(--text-2)', padding: '6px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 700 } }, "\u2398 Duplica"),
React.createElement("button", { onClick: onDelete, style: { background: 'var(--surface-2)', border: '1px solid #ef444433', borderRadius: 6, color: '#ef4444', padding: '6px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 700 } }, "\u2715"))),
React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8, marginTop: 10, padding: '10px 0', borderTop: '1px solid #2A2A38' } },
proc.estimatedMinutes && (React.createElement("div", null,
React.createElement("div", { style: { fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: .7, fontWeight: 700 } }, "Tempo stimato"),
React.createElement("div", { style: { fontSize: 13, color: 'var(--text-bright)', fontWeight: 700, marginTop: 2 } },
"\u23F1 ",
proc.estimatedMinutes,
" min"))),
proc.toolsRequired && proc.toolsRequired.length > 0 && (React.createElement("div", null,
React.createElement("div", { style: { fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: .7, fontWeight: 700 } }, "Strumenti"),
React.createElement("div", { style: { fontSize: 12, color: 'var(--text-bright)', marginTop: 2 } }, proc.toolsRequired.join(', ')))),
proc.partsTypical && proc.partsTypical.length > 0 && (React.createElement("div", null,
React.createElement("div", { style: { fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: .7, fontWeight: 700 } }, "Ricambi tipici"),
React.createElement("div", { style: { fontSize: 12, color: 'var(--text-bright)', marginTop: 2 } }, proc.partsTypical.join(', ')))))),
React.createElement("div", { style: { marginBottom: 14 } },
React.createElement("div", { style: { fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: .8, fontWeight: 700, marginBottom: 8 } },
"Procedura \u2014 ",
((_a = proc.steps) === null || _a === void 0 ? void 0 : _a.length) || 0,
" passi"),
!proc.steps || proc.steps.length === 0 ? (React.createElement("div", { style: { padding: 20, color: 'var(--text-3)', fontStyle: 'italic', textAlign: 'center' } }, "Nessun passo definito")) : proc.steps.map((step, i) => (React.createElement("div", { key: i, style: { background: 'var(--surface)', border: '1px solid #2A2A38', borderRadius: 10, padding: '14px 16px', marginBottom: 8 } },
React.createElement("div", { style: { display: 'flex', gap: 12, alignItems: 'flex-start' } },
React.createElement("div", { style: { background: '#2dd4bf', color: '#000', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, flexShrink: 0 } }, i + 1),
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
step.title && React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: 'var(--text-bright)', marginBottom: 5 } }, step.title),
step.description && React.createElement("div", { style: { fontSize: 13, color: '#c0c0d0', lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 8 } }, step.description),
step.expectedValue && (React.createElement("div", { style: { background: 'var(--bg)', border: '1px solid #2dd4bf33', borderRadius: 6, padding: '6px 12px', marginTop: 6, fontSize: 12 } },
React.createElement("span", { style: { color: 'var(--text-3)', fontWeight: 700, marginRight: 6, fontSize: 10, textTransform: 'uppercase' } }, "Atteso:"),
React.createElement("span", { style: { color: '#2dd4bf', fontWeight: 700 } }, step.expectedValue))),
step.warning && (React.createElement("div", { style: { background: '#f59e0b15', border: '1px solid #f59e0b44', borderRadius: 6, padding: '6px 12px', marginTop: 6, fontSize: 12, color: '#f59e0b' } },
"\u26A0 ",
step.warning)),
step.image && (React.createElement("div", { style: { marginTop: 10, borderRadius: 8, overflow: 'hidden', border: '1px solid #2A2A38', maxWidth: 400 } },
React.createElement("img", { src: step.image, alt: `Step ${i + 1}`, style: { width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }, onClick: () => window.open(step.image, '_blank') }))))))))),
proc.notes && (React.createElement("div", { style: { background: 'var(--surface)', border: '1px solid #2A2A38', borderRadius: 10, padding: '14px 18px', marginBottom: 14, borderLeft: '4px solid #2dd4bf' } },
React.createElement("div", { style: { fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: .8, fontWeight: 700, marginBottom: 6 } }, "Note e tips"),
React.createElement("div", { style: { fontSize: 13, color: '#c0c0d0', whiteSpace: 'pre-wrap', lineHeight: 1.6 } }, proc.notes))),
React.createElement("div", { style: { textAlign: 'center', fontSize: 10, color: 'var(--text-4)', marginTop: 20 } },
"Creata il ",
(proc.createdAt || '').slice(0, 10))));
}
function ProcedureForm({ initial, instruments, parts, onSave, onClose }) {
const [form, setForm] = React.useState(Object.assign({ brand: '', modelName: '', category: '', type: '', description: '', estimatedMinutes: '', toolsRequired: [], partsTypical: [], steps: [], notes: '' }, (initial || {})));
const [errors, setErrors] = React.useState({});
const set = (k, v) => setForm(f => (Object.assign(Object.assign({}, f), { [k]: v })));
const addStep = () => {
setForm(f => (Object.assign(Object.assign({}, f), { steps: [...(f.steps || []), { title: '', description: '', expectedValue: '', warning: '', image: '' }] })));
};
const updStep = (i, key, val) => {
setForm(f => (Object.assign(Object.assign({}, f), { steps: f.steps.map((s, idx) => idx === i ? Object.assign(Object.assign({}, s), { [key]: val }) : s) })));
};
const moveStep = (i, dir) => {
setForm(f => {
const ns = [...f.steps];
const target = i + dir;
if (target < 0 || target >= ns.length)
return f;
[ns[i], ns[target]] = [ns[target], ns[i]];
return Object.assign(Object.assign({}, f), { steps: ns });
});
};
const delStep = (i) => {
if (!confirm('Eliminare questo passo?'))
return;
setForm(f => (Object.assign(Object.assign({}, f), { steps: f.steps.filter((_, idx) => idx !== i) })));
};
const uploadStepImage = (i, file) => __awaiter(this, void 0, void 0, function* () {
if (!file)
return;
if (file.size > 3 * 1024 * 1024) {
alert('Immagine troppo grande (>3MB). Comprimi prima.');
return;
}
try {
const att = yield fileToAttachment(file);
updStep(i, 'image', att.dataUrl);
}
catch (e) {
alert('Errore: ' + e.message);
}
});
const INP = FORM_INP;
const LBL = FORM_LBL;
const ROW = FORM_ROW;
return (React.createElement("div", { style: { maxHeight: '70vh', overflowY: 'auto', paddingRight: 6 } },
React.createElement(ErrorSummary, { errors: errors }),
React.createElement("div", { style: ROW },
React.createElement("div", { style: { flex: 1, minWidth: 140 } },
React.createElement("label", { style: LBL }, "Marca"),
React.createElement("input", { style: INP, value: form.brand, onChange: e => set('brand', e.target.value), placeholder: "es. Philips" })),
React.createElement("div", { style: { flex: 2, minWidth: 140 } },
React.createElement("label", { style: LBL }, "Modello *"),
React.createElement("input", { style: INP, value: form.modelName, onChange: e => set('modelName', e.target.value), placeholder: "es. HeartStart MRx" }))),
React.createElement("div", { style: ROW },
React.createElement("div", { style: { flex: 1, minWidth: 140 } },
React.createElement("label", { style: LBL }, "Categoria"),
React.createElement("select", { style: INP, value: form.category, onChange: e => set('category', e.target.value) },
React.createElement("option", { value: "" }, "\u2014 Seleziona \u2014"),
PROC_CATEGORIES.map(c => React.createElement("option", { key: c, value: c }, c)))),
React.createElement("div", { style: { flex: 1, minWidth: 140 } },
React.createElement("label", { style: LBL }, "Tipo procedura"),
React.createElement("select", { style: INP, value: form.type, onChange: e => set('type', e.target.value) },
React.createElement("option", { value: "" }, "\u2014 Seleziona \u2014"),
PROC_TYPES.map(t => React.createElement("option", { key: t, value: t }, t)))),
React.createElement("div", { style: { width: 140 } },
React.createElement("label", { style: LBL }, "Tempo (min)"),
React.createElement("input", { type: "number", style: INP, value: form.estimatedMinutes, onChange: e => set('estimatedMinutes', e.target.value), placeholder: "60" }))),
React.createElement("div", { style: { marginBottom: 12 } },
React.createElement("label", { style: LBL }, "Descrizione breve"),
React.createElement("textarea", { style: Object.assign(Object.assign({}, INP), { minHeight: 50, resize: 'vertical' }), value: form.description, onChange: e => set('description', e.target.value), placeholder: "A cosa serve, contesto, frequenza consigliata\u2026" })),
React.createElement("div", { style: ROW },
React.createElement("div", { style: { flex: 1, minWidth: 140 } },
React.createElement("label", { style: LBL }, "Strumenti necessari (separati da virgola)"),
React.createElement("input", { style: INP, value: (form.toolsRequired || []).join(', '), onChange: e => set('toolsRequired', e.target.value.split(',').map(s => s.trim()).filter(Boolean)), placeholder: "es. Fluke Impulse 7000, Multimetro" })),
React.createElement("div", { style: { flex: 1, minWidth: 140 } },
React.createElement("label", { style: LBL }, "Ricambi tipici"),
React.createElement("input", { style: INP, value: (form.partsTypical || []).join(', '), onChange: e => set('partsTypical', e.target.value.split(',').map(s => s.trim()).filter(Boolean)), placeholder: "es. Batteria, elettrodi" }))),
React.createElement("div", { style: { borderTop: '1px solid #2A2A38', margin: '18px 0 12px', paddingTop: 14 } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } },
React.createElement("div", { style: { fontSize: 12, color: '#2dd4bf', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 } },
"Passi della procedura (",
(form.steps || []).length,
")"),
React.createElement("button", { type: "button", onClick: addStep, style: { background: '#2dd4bf', color: '#000', border: 'none', borderRadius: 6, padding: '5px 14px', cursor: 'pointer', fontSize: 11, fontWeight: 800 } }, "+ Aggiungi passo")),
(form.steps || []).length === 0 ? (React.createElement("div", { style: { padding: 20, background: 'var(--bg)', border: '1px dashed #2A2A38', borderRadius: 8, color: 'var(--text-3)', textAlign: 'center', fontSize: 12 } }, "Nessun passo. Clicca \"+ Aggiungi passo\" per iniziare.")) : form.steps.map((step, i) => (React.createElement("div", { key: i, style: { background: 'var(--bg)', border: '1px solid #2A2A38', borderRadius: 8, padding: 12, marginBottom: 8 } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 } },
React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 8 } },
React.createElement("div", { style: { background: '#2dd4bf', color: '#000', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11 } }, i + 1),
React.createElement("span", { style: { color: 'var(--text-3)', fontSize: 11 } },
"Passo ",
i + 1)),
React.createElement("div", { style: { display: 'flex', gap: 4 } },
React.createElement("button", { type: "button", onClick: () => moveStep(i, -1), disabled: i === 0, style: { background: 'var(--surface-2)', border: '1px solid #2a3040', borderRadius: 4, color: 'var(--text-2)', padding: '2px 7px', cursor: i === 0 ? 'not-allowed' : 'pointer', fontSize: 11, opacity: i === 0 ? .3 : 1 } }, "\u2191"),
React.createElement("button", { type: "button", onClick: () => moveStep(i, 1), disabled: i === form.steps.length - 1, style: { background: 'var(--surface-2)', border: '1px solid #2a3040', borderRadius: 4, color: 'var(--text-2)', padding: '2px 7px', cursor: i === form.steps.length - 1 ? 'not-allowed' : 'pointer', fontSize: 11, opacity: i === form.steps.length - 1 ? .3 : 1 } }, "\u2193"),
React.createElement("button", { type: "button", onClick: () => delStep(i), style: { background: 'var(--surface-2)', border: '1px solid #ef444433', borderRadius: 4, color: '#ef4444', padding: '2px 7px', cursor: 'pointer', fontSize: 11 } }, "\u2715"))),
React.createElement("input", { style: Object.assign(Object.assign({}, INP), { marginBottom: 6 }), value: step.title || '', onChange: e => updStep(i, 'title', e.target.value), placeholder: "Titolo del passo (es. Test scarica 200J)" }),
React.createElement("textarea", { style: Object.assign(Object.assign({}, INP), { minHeight: 60, resize: 'vertical', marginBottom: 6 }), value: step.description || '', onChange: e => updStep(i, 'description', e.target.value), placeholder: "Descrizione dettagliata. Cosa fare, come collegarlo, dove guardare\u2026" }),
React.createElement("div", { style: { display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' } },
React.createElement("input", { style: Object.assign(Object.assign({}, INP), { flex: 1, minWidth: 120 }), value: step.expectedValue || '', onChange: e => updStep(i, 'expectedValue', e.target.value), placeholder: "Valore atteso (es. 195-205 J)" }),
React.createElement("input", { style: Object.assign(Object.assign({}, INP), { flex: 1, minWidth: 120 }), value: step.warning || '', onChange: e => updStep(i, 'warning', e.target.value), placeholder: "\u26A0 Avvertenza (opzionale)" })),
step.image ? (React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 8, padding: 6, background: 'var(--surface)', borderRadius: 6, border: '1px solid #2A2A38' } },
React.createElement("img", { src: step.image, style: { width: 60, height: 60, objectFit: 'cover', borderRadius: 4 } }),
React.createElement("span", { style: { fontSize: 11, color: 'var(--text-3)', flex: 1 } }, "Immagine caricata"),
React.createElement("button", { type: "button", onClick: () => updStep(i, 'image', ''), style: { background: 'var(--surface-2)', border: '1px solid #ef444433', borderRadius: 4, color: '#ef4444', padding: '3px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 700 } }, "Rimuovi"))) : (React.createElement("label", { style: { display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: 'var(--surface)', border: '1px dashed #2dd4bf44', borderRadius: 6, padding: '5px 12px', color: '#2dd4bf', fontSize: 11, fontWeight: 700 } },
React.createElement("input", { type: "file", accept: "image/*", onChange: e => { var _a; return uploadStepImage(i, (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0]); }, style: { display: 'none' } }),
"\uD83D\uDDBC + Aggiungi 1 foto (max 3MB)")))))),
React.createElement("div", { style: { marginBottom: 14 } },
React.createElement("label", { style: LBL }, "Note e tips appresi sul campo"),
React.createElement("textarea", { style: Object.assign(Object.assign({}, INP), { minHeight: 70, resize: 'vertical' }), value: form.notes, onChange: e => set('notes', e.target.value), placeholder: "Errori comuni, accorgimenti, esperienze utili\u2026" })),
React.createElement("div", { style: { display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 10, borderTop: '1px solid #2A2A38', position: 'sticky', bottom: 0, background: 'var(--surface-2)', margin: '0 -6px', padding: '12px 6px' } },
React.createElement("button", { onClick: onClose, style: FORM_BTN_GHOST }, "Annulla"),
React.createElement("button", { onClick: () => {
var _a;
const errs = {};
if (!((_a = form.modelName) === null || _a === void 0 ? void 0 : _a.trim()))
errs.modelName = "Il modello/titolo è obbligatorio";
setErrors(errs);
if (Object.keys(errs).length > 0)
return;
onSave(form);
}, style: FORM_BTN_PRIMARY }, initial ? 'Salva modifiche' : 'Crea procedura'))));
}
const QUOTE_STATUS_COLOR = {
'bozza': 'var(--text-3)',
'inviato': '#3b82f6',
'accettato': '#22c55e',
'rifiutato': '#ef4444',
'scaduto': '#f59e0b',
};
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
label: 'Manodopera',
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
React.createElement("label", { style: LBL }, "N\u00B0 Preventivo"),
React.createElement("input", { style: INP, value: f.number, onChange: s('number') })),
React.createElement("div", null,
React.createElement("label", { style: LBL }, "Stato"),
React.createElement("select", { style: INP, value: f.status, onChange: s('status') }, Object.keys(QUOTE_STATUS_COLOR).map(v => React.createElement("option", { key: v, value: v }, v.charAt(0).toUpperCase() + v.slice(1))))),
React.createElement("div", null,
React.createElement("label", { style: LBL }, "Cliente"),
React.createElement("select", { style: INP, value: f.customerId, onChange: s('customerId') },
React.createElement("option", { value: "" }, "\u2014 Seleziona cliente \u2014"),
customers.map(c => React.createElement("option", { key: c.id, value: c.id }, c.name)))),
React.createElement("div", null,
React.createElement("label", { style: LBL }, "Job collegato"),
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
React.createElement("label", { style: LBL }, "Data preventivo"),
React.createElement("input", { type: "date", style: INP, value: f.date, onChange: s('date') })),
React.createElement("div", null,
React.createElement("label", { style: LBL }, "Valido fino al"),
React.createElement("input", { type: "date", style: INP, value: f.validUntil, onChange: s('validUntil') }))),
React.createElement("label", { style: { display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: 'var(--text-2)' } },
React.createElement("input", { type: "checkbox", checked: f.vatExempt, onChange: sCheck('vatExempt') }),
"Esente IVA (art. 10, regime forfettario, ecc.)"),
React.createElement("div", { style: { borderTop: '1px solid #2A2A38', paddingTop: 12 } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 } },
React.createElement("span", { style: { fontSize: 11, color: '#2dd4bf', fontWeight: 700, textTransform: 'uppercase', letterSpacing: .8 } },
"\uD83D\uDD27 Manodopera (",
f.laborLines.length,
" voci)"),
React.createElement("button", { onClick: addLabor, style: { background: 'var(--surface-2)', border: '1px solid #2dd4bf44', borderRadius: 6, color: '#2dd4bf', padding: '4px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 700 } }, "+ Voce")),
f.laborLines.length === 0 && (React.createElement("div", { style: { textAlign: 'center', color: 'var(--text-4)', padding: '10px 0', fontSize: 12 } }, "Nessuna voce manodopera")),
f.laborLines.map(l => (React.createElement("div", { key: l.id, style: { display: 'grid', gridTemplateColumns: '1fr 70px 70px auto', gap: 6, marginBottom: 6, alignItems: 'center' } },
React.createElement("input", { style: INP, value: l.label, onChange: e => updLabor(l.id, 'label', e.target.value), placeholder: "Descrizione (es. Trasferta, Ore lavoro, Installazione\u2026)" }),
React.createElement("input", { type: "number", style: Object.assign(Object.assign({}, INP), { textAlign: 'center' }), value: l.hours, onChange: e => updLabor(l.id, 'hours', e.target.value), placeholder: "ore", step: "0.5" }),
React.createElement("input", { type: "number", style: Object.assign(Object.assign({}, INP), { textAlign: 'center' }), value: l.rate, onChange: e => updLabor(l.id, 'rate', e.target.value), placeholder: "\u20AC/h" }),
React.createElement("button", { onClick: () => delLabor(l.id), style: { background: '#ef444415', border: '1px solid #ef444430', borderRadius: 5, color: '#ef4444', padding: '6px 8px', cursor: 'pointer', fontSize: 11 } }, "\u2715")))),
f.laborLines.length > 0 && (React.createElement("div", { style: { textAlign: 'right', fontSize: 12, color: 'var(--text-2)', marginTop: 4 } },
"Subtotale manodopera: ",
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
React.createElement("div", { style: { fontSize: 10, color: 'var(--text-3)', marginBottom: 5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: .7 } }, "Aggiungi dal magazzino (senza scalare stock)"),
React.createElement("div", { style: { display: 'flex', flexWrap: 'wrap', gap: 5 } }, parts.filter(p => p.qty > 0 || true).map(p => (React.createElement("button", { key: p.id, onClick: () => addPartWarehouse(p), style: { background: 'var(--surface-2)', border: '1px solid #2A2A38', borderRadius: 6, color: 'var(--text-2)', padding: '3px 9px', cursor: 'pointer', fontSize: 10 } },
"+ ",
p.name,
p.code ? ` (${p.code})` : '',
" \u2014 \u20AC",
(p.sellPrice || p.unitPrice || 0).toFixed(2))))))),
f.partLines.length === 0 && (React.createElement("div", { style: { textAlign: 'center', color: 'var(--text-4)', padding: '10px 0', fontSize: 12 } }, "Nessun materiale")),
f.partLines.map(l => (React.createElement("div", { key: l.id, style: { display: 'grid', gridTemplateColumns: '1fr 55px 70px 55px auto', gap: 6, marginBottom: 6, alignItems: 'center' } },
React.createElement("div", null,
l.type === 'warehouse' && (React.createElement("div", { style: { fontSize: 9, color: '#a855f7', fontWeight: 700, marginBottom: 2 } }, "\uD83D\uDCE6 MAGAZZINO")),
React.createElement("input", { style: INP, value: l.description, onChange: e => updPart(l.id, 'description', e.target.value), placeholder: "Descrizione ricambio / materiale" })),
React.createElement("input", { type: "number", style: Object.assign(Object.assign({}, INP), { textAlign: 'center' }), value: l.qty, onChange: e => updPart(l.id, 'qty', e.target.value), placeholder: "Q.t\u00E0", step: "1" }),
React.createElement("input", { type: "number", style: Object.assign(Object.assign({}, INP), { textAlign: 'center' }), value: l.unitPrice, onChange: e => updPart(l.id, 'unitPrice', e.target.value), placeholder: "\u20AC cad.", step: "0.01" }),
React.createElement("select", { style: Object.assign(Object.assign({}, INP), { padding: '8px 4px', textAlign: 'center' }), value: l.vat, onChange: e => updPart(l.id, 'vat', e.target.value) }, IVA_RATES.map(r => React.createElement("option", { key: r, value: r },
r,
"%"))),
React.createElement("button", { onClick: () => delPart(l.id), style: { background: '#ef444415', border: '1px solid #ef444430', borderRadius: 5, color: '#ef4444', padding: '6px 8px', cursor: 'pointer', fontSize: 11 } }, "\u2715")))),
f.partLines.length > 0 && (React.createElement("div", { style: { textAlign: 'right', fontSize: 12, color: 'var(--text-2)', marginTop: 4 } },
"Subtotale materiali: ",
React.createElement("strong", { style: { color: 'var(--text-bright)' } },
"\u20AC",
partsSubtotal.toFixed(2))))),
React.createElement("div", { style: { background: 'var(--bg)', border: '1px solid #2A2A38', borderRadius: 10, padding: '14px 16px' } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 } },
React.createElement("span", { style: { color: 'var(--text-3)' } }, "Manodopera"),
React.createElement("span", { style: { color: 'var(--text-bright)', fontWeight: 700 } },
"\u20AC",
laborTotal.toFixed(2))),
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 } },
React.createElement("span", { style: { color: 'var(--text-3)' } }, "Materiali"),
React.createElement("span", { style: { color: 'var(--text-bright)', fontWeight: 700 } },
"\u20AC",
partsSubtotal.toFixed(2))),
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid #2A2A38' } },
React.createElement("span", { style: { color: 'var(--text-3)' } }, "Imponibile"),
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
React.createElement("label", { style: LBL }, "Condizioni di pagamento"),
React.createElement("input", { style: INP, value: f.paymentTerms, onChange: s('paymentTerms') })),
React.createElement("div", null,
React.createElement("label", { style: LBL }, "Note / condizioni speciali"),
React.createElement("textarea", { style: Object.assign(Object.assign({}, INP), { minHeight: 60, resize: 'vertical' }), value: f.notes, onChange: s('notes'), placeholder: "Note aggiuntive, esclusioni, condizioni speciali\u2026" })),
React.createElement("div", { style: { display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 10, borderTop: '1px solid #2A2A38', position: 'sticky', bottom: 0, background: 'var(--surface-2)', margin: '0 -4px', padding: '12px 4px' } },
React.createElement("button", { onClick: onClose, style: FORM_BTN_GHOST }, "Annulla"),
React.createElement("button", { onClick: () => onSave(Object.assign(Object.assign({}, f), { _totals: { labor: laborTotal, parts: partsSubtotal, subtotal, vat: vatTotal, grand: grandTotal } })), style: FORM_BTN_PRIMARY }, initial ? 'Salva modifiche' : 'Crea preventivo'))));
}
function QuotesPage({ quotes, setQuotes, customers, jobs, assets, parts, company, showToast, moveToTrash, checkLocked }) {
const [modal, setModal] = React.useState(null);
const [search, setSearch] = React.useState('');
const [filterStatus, setFilterStatus] = React.useState('all');
const saveQuote = (q) => {
const exists = quotes.some(x => x.id === q.id);
if (exists) {
const upd = withUpdateMeta(q);
setQuotes(qs => qs.map(x => x.id === q.id ? upd : x));
showToast('Preventivo aggiornato');
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
if (!confirm('Spostare questo preventivo nel cestino?'))
return;
const rec = quotes.find(q => q.id === id);
if (moveToTrash && rec)
moveToTrash("quotes", rec);
setQuotes(qs => qs.filter(q => q.id !== id));
showToast('Spostato nel cestino', '#f59e0b');
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
React.createElement("h1", { style: { margin: 0, fontSize: 20, fontWeight: 900 } }, "Preventivi"),
React.createElement("p", { style: { color: 'var(--text-3)', margin: '3px 0 0', fontSize: 12 } }, "Quotazioni da job \u2192 PDF professionale")),
React.createElement("button", { onClick: () => setModal({ type: 'form', data: null }), style: FORM_BTN_PRIMARY }, "+ Nuovo preventivo")),
React.createElement("div", { style: { display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' } }, [
{ label: 'In corso (bozza+inviati)', value: totalOpen, color: '#3b82f6' },
{ label: 'Accettati', value: totalAccepted, color: '#22c55e' },
{ label: 'Valore inviati', value: `€${valueOpen.toFixed(0)}`, color: '#2dd4bf' },
{ label: 'Totale', value: quotes.length, color: 'var(--text-3)' },
].map(k => (React.createElement("div", { key: k.label, style: { background: 'var(--surface)', border: '1px solid #2A2A38', borderTop: `3px solid ${k.color}`, borderRadius: 10, padding: '10px 16px', flex: 1, minWidth: 110 } },
React.createElement("div", { style: { fontSize: 20, fontWeight: 900, color: k.color, fontFamily: 'monospace' } }, k.value),
React.createElement("div", { style: { fontSize: 10, color: 'var(--text-3)', marginTop: 3, textTransform: 'uppercase', letterSpacing: .7, fontWeight: 600 } }, k.label))))),
React.createElement("div", { style: { display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' } },
React.createElement("input", { value: search, onChange: e => setSearch(e.target.value), placeholder: "Cerca numero, cliente\u2026", style: { flex: 1, minWidth: 180, background: 'var(--surface)', border: '1px solid #2A2A38', borderRadius: 8, padding: '8px 12px', color: 'var(--text-bright)', fontSize: 13, outline: 'none' } }),
React.createElement("select", { value: filterStatus, onChange: e => setFilterStatus(e.target.value), style: { background: 'var(--surface)', border: '1px solid #2A2A38', borderRadius: 8, padding: '8px 12px', color: 'var(--text-2)', fontSize: 12 } },
React.createElement("option", { value: "all" }, "Tutti gli stati"),
Object.keys(QUOTE_STATUS_COLOR).map(s => React.createElement("option", { key: s, value: s }, s.charAt(0).toUpperCase() + s.slice(1))))),
filtered.length === 0 ? (React.createElement("div", { style: { textAlign: 'center', padding: 48, color: 'var(--text-3)', background: 'var(--surface)', borderRadius: 12, border: '1px solid #2A2A38' } }, quotes.length === 0 ? (React.createElement(React.Fragment, null,
React.createElement("div", { style: { fontSize: 36, marginBottom: 10, opacity: .4 } }, "\uD83D\uDCCB"),
React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: 'var(--text-2)', marginBottom: 6 } }, "Nessun preventivo ancora"),
React.createElement("div", { style: { fontSize: 12, marginBottom: 14 } }, "Apri un job, usa il bottone \"Crea preventivo\" oppure creane uno da qui"),
React.createElement("button", { onClick: () => setModal({ type: 'form', data: null }), style: FORM_BTN_PRIMARY }, "+ Nuovo preventivo"))) : 'Nessun risultato')) : (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: 8 } }, filtered.slice().sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).map(q => {
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
(modal === null || modal === void 0 ? void 0 : modal.type) === 'form' && (React.createElement(Modal, { title: modal.data ? 'Modifica Preventivo' : 'Nuovo Preventivo', wide: true, onClose: () => setModal(null) },
React.createElement(QuoteForm, { initial: modal.data, customers: customers, jobs: jobs, assets: assets, parts: parts, quotes: quotes, onSave: saveQuote, onClose: () => setModal(null) })))));
}
function generateQuotePDF(quote, customer, company, assets, jobs) {
var _a, _b, _c, _d, _e;
const job = jobs === null || jobs === void 0 ? void 0 : jobs.find(j => j.id === quote.jobId);
const asset = job ? assets === null || assets === void 0 ? void 0 : assets.find(a => a.id === job.assetId) : null;
const sc = QUOTE_STATUS_COLOR[quote.status] || '#64748b';
const grand = ((_a = quote._totals) === null || _a === void 0 ? void 0 : _a.grand) || 0;
const subtotal = ((_b = quote._totals) === null || _b === void 0 ? void 0 : _b.subtotal) || 0;
const vatAmt = ((_c = quote._totals) === null || _c === void 0 ? void 0 : _c.vat) || 0;
const laborRows = (quote.laborLines || []).map(l => `<tr><td>${l.label}</td><td style="text-align:center">${l.hours}h × €${l.rate}/h</td><td style="text-align:right;font-weight:700">€${(l.hours * l.rate).toFixed(2)}</td></tr>`).join('');
const partRows = (quote.partLines || []).map(l => `<tr><td>${l.type === 'warehouse' ? '\uD83D\uDCE6 ' : ''}${l.description}</td><td style="text-align:center">${l.qty} × €${Number(l.unitPrice).toFixed(2)}${!quote.vatExempt ? ` (+${l.vat}% IVA)` : ''}</td><td style="text-align:right;font-weight:700">€${(l.qty * l.unitPrice).toFixed(2)}</td></tr>`).join('');
const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family: Arial, sans-serif; font-size: 12px; color: #1a1a2e; background: #fff; }
.header { background: linear-gradient(135deg, #2dd4bf, #1F7468); color: white; padding: 28px 32px; display: flex; justify-content: space-between; align-items: flex-start; }
.header h1 { font-size: 22px; font-weight: 900; margin-bottom: 4px; }
.header .sub { font-size: 10px; opacity: .85; line-height: 1.5; }
.header-logo { height: 28px !important; width: 36px !important; max-height:28px !important; max-width:36px !important; object-fit:contain; display:block; margin-bottom:8px; }
.badge { display:inline-block; background:rgba(255,255,255,0.25); border:1px solid rgba(255,255,255,0.4); border-radius:6px; padding:4px 12px; font-size:13px; font-weight:800; margin-top:6px; }
.body { padding: 24px 32px; }
.meta-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px; }
.meta-box { background:#f8fafc; border-radius:8px; padding:12px 14px; }
.meta-label { font-size:9px; color:#64748b; text-transform:uppercase; letter-spacing:.7px; font-weight:700; margin-bottom:4px; }
.meta-value { font-size:13px; font-weight:700; color:#1a1a2e; }
.section-title { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.8px; color:#64748b; margin-bottom:8px; border-bottom:1px solid #e2e8f0; padding-bottom:4px; margin-top:18px; }
table { width:100%; border-collapse:collapse; font-size:11px; }
th { background:#f1f5f9; text-align:left; padding:7px 10px; font-size:9px; text-transform:uppercase; letter-spacing:.5px; color:#64748b; font-weight:700; }
td { padding:7px 10px; border-bottom:1px solid #f1f5f9; vertical-align:top; }
tr:last-child td { border-bottom:none; }
.totals { margin-top:16px; background:#f8fafc; border-radius:8px; padding:14px 16px; }
.total-row { display:flex; justify-content:space-between; font-size:12px; margin-bottom:5px; color:#475569; }
.total-grand { display:flex; justify-content:space-between; font-size:16px; font-weight:900; color:#1F7468; padding-top:8px; border-top:2px solid #2dd4bf; margin-top:8px; }
.notes { margin-top:16px; background:#fffbeb; border:1px solid #fde68a; border-radius:8px; padding:12px 14px; font-size:11px; color:#92400e; }
.footer { margin-top:24px; padding-top:10px; border-top:1px solid #e2e8f0; text-align:center; font-size:9px; color:#94a3b8; }
.validity { font-size:10px; opacity:.8; margin-top:4px; }
</style></head><body><div class="wrap"><div class="side"></div><div class="main">
<div class="header">
<div>
${company.logo ? `<img src="${company.logo}" class="brand-logo"/>` : ''}
${(company.logo && company.logoHasName) ? '' : `<h1>${(company.name || 'Documento')}</h1>`}
<div class="sub">${company.subtitle || 'Gestione Apparecchiature Elettromedicali'}</div>
${company.address ? `<div class="sub">${company.address}</div>` : ''}
${company.vat ? `<div class="sub">P.IVA: ${company.vat}</div>` : ''}
</div>
<div style="text-align:right">
<div style="font-size:11px;opacity:.8;margin-bottom:4px">PREVENTIVO</div>
<div style="font-size:26px;font-weight:900;letter-spacing:-1px">${quote.number}</div>
<div class="validity">Data: ${quote.date}</div>
${quote.validUntil ? `<div class="validity">Valido fino al: ${quote.validUntil}</div>` : ''}
<div class="badge">${(quote.status || '').toUpperCase()}</div>
</div>
</div>
<div class="body">
<div class="meta-grid">
<div class="meta-box">
<div class="meta-label">Cliente</div>
<div class="meta-value">${(customer === null || customer === void 0 ? void 0 : customer.name) || '—'}</div>
${(customer === null || customer === void 0 ? void 0 : customer.address) ? `<div style="font-size:11px;color:#475569;margin-top:3px">${customer.address}</div>` : ''}
${(customer === null || customer === void 0 ? void 0 : customer.vat) ? `<div style="font-size:11px;color:#475569">P.IVA: ${customer.vat}</div>` : ''}
</div>
<div class="meta-box">
<div class="meta-label">Oggetto</div>
<div class="meta-value">${asset ? asset.name : (job ? `Rif. job ${job.id}` : 'Intervento tecnico')}</div>
${(asset === null || asset === void 0 ? void 0 : asset.brand) || (asset === null || asset === void 0 ? void 0 : asset.model) ? `<div style="font-size:11px;color:#475569;margin-top:2px">${[asset.brand, asset.model].filter(Boolean).join(' ')}</div>` : ''}
${(asset === null || asset === void 0 ? void 0 : asset.serial) ? `<div style="font-size:11px;color:#475569">S/N: ${asset.serial}</div>` : ''}
${job ? `<div style="font-size:10px;color:#94a3b8;margin-top:2px">Rif. job: ${job.id}</div>` : ''}
</div>
</div>
${(quote.laborLines || []).length > 0 ? `
<div class="section-title">Manodopera</div>
<table>
<thead><tr><th style="width:60%">Descrizione</th><th style="width:25%">Dettaglio</th><th style="width:15%">Importo</th></tr></thead>
<tbody>${laborRows}</tbody>
</table>` : ''}
${(quote.partLines || []).length > 0 ? `
<div class="section-title">Materiali e Ricambi</div>
<table>
<thead><tr><th style="width:55%">Descrizione</th><th style="width:30%">Q.tà × Prezzo</th><th style="width:15%">Importo</th></tr></thead>
<tbody>${partRows}</tbody>
</table>` : ''}
<div class="totals">
<div class="total-row"><span>Manodopera</span><span>€${(((_d = quote._totals) === null || _d === void 0 ? void 0 : _d.labor) || 0).toFixed(2)}</span></div>
<div class="total-row"><span>Materiali</span><span>€${(((_e = quote._totals) === null || _e === void 0 ? void 0 : _e.parts) || 0).toFixed(2)}</span></div>
<div class="total-row"><span>Imponibile</span><span>€${subtotal.toFixed(2)}</span></div>
${!quote.vatExempt ? `<div class="total-row"><span>IVA</span><span>€${vatAmt.toFixed(2)}</span></div>` : '<div class="total-row"><span>Esente IVA</span><span>—</span></div>'}
<div class="total-grand"><span>TOTALE</span><span>€${grand.toFixed(2)}</span></div>
</div>
${quote.paymentTerms ? `<div style="margin-top:14px;font-size:11px;color:#475569"><strong>Condizioni di pagamento:</strong> ${quote.paymentTerms}</div>` : ''}
${quote.notes ? `<div class="notes"><strong>Note:</strong> ${quote.notes}</div>` : ''}
<div class="footer">
${(company.name || 'Documento')} — Preventivo generato il ${new Date().toLocaleDateString('it-IT')}<br>
Questo documento non ha valore fiscale — per la fatturazione utilizzare il software di fatturazione elettronica
</div>
</div>
</div></div></body></html>`;
showPDFPreview(html, `preventivo-${quote.number}.pdf`);
}
function AgendaPage({ assets, jobs, instruments, iecReports, funcReports, customers, setTab: goTab, setModal, showToast }) {
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
function PianoManuale({ assets, setAssets, customers, year, setYear, showToast, goTab }) {
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

function generatePPMPDF(ppm, asset, customer, company, templates, funcRep, iecRep) {
asset = asset || {}; customer = customer || {}; company = company || {}; ppm = ppm || {};
function esc(s) { return (s == null ? "" : String(s)).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
var secHead = function (n, t) { return '<div style="font-size:12px;font-weight:800;color:#0E7490;text-transform:uppercase;letter-spacing:.5px;border-bottom:2px solid #0E7490;padding-bottom:3px;margin:16px 0 8px">' + esc(n) + ' &middot; ' + esc(t) + '</div>'; };
var items = ppm.items || [];
var clRows = items.map(function (it) {
var st = it.status === "na" ? '<span class="badge" style="background:#e5e7eb;color:#6b7280">N/A</span>' : '<span class="badge pass">&#10003; Fatto</span>';
return '<tr><td>' + esc(it.text) + '</td><td style="text-align:center">' + st + '</td><td>' + esc(it.note || "") + '</td></tr>';
}).join("");
// Sezione funzionale
var funcHtml;
if (funcRep) {
var tpl = (templates && templates[funcRep.templateId]) || null;
var fEsito = funcRep.verifyStatus === "non_disponibile" ? "NON ESEGUITA" : (funcRep.overallPass ? "CONFORME" : "NON CONFORME");
var fColor = funcRep.verifyStatus === "non_disponibile" ? "#d97706" : (funcRep.overallPass ? "#059669" : "#dc2626");
var secRows = "";
if (tpl && tpl.sections) {
secRows = tpl.sections.map(function (sec) {
var sd = (funcRep.sections || {})[sec.id] || { items: {}, measures: {} };
if (sd._sectionNA) return '<tr style="opacity:.7"><td>' + esc(sec.title) + '</td><td style="text-align:center"><span class="badge" style="background:#e5e7eb;color:#6b7280">N/A</span></td></tr>';
var fail = false;
(sec.items || []).forEach(function (it) { if (sd.items[it.id] === false) fail = true; });
(sec.measures || []).forEach(function (m) { var raw = sd.measures[m.id]; if (raw === "na") return; var v = parseFloat(raw); if (isNaN(v)) return; if (m.limitMin !== undefined && v < m.limitMin) fail = true; if (m.limitVal !== undefined) { if (m.invertPass) { if (v < m.limitVal) fail = true; } else { if (v > m.limitVal) fail = true; } } });
return '<tr><td>' + esc(sec.title) + '</td><td style="text-align:center"><span class="badge ' + (fail ? "fail" : "pass") + '">' + (fail ? "&#10007; NC" : "&#10003; OK") + '</span></td></tr>';
}).join("");
}
funcHtml = secHead("2", "Verifica funzionale")
+ '<div style="font-size:11px;color:#334155;margin-bottom:8px">' + esc((tpl && tpl.label) || funcRep.templateId || "") + ' &middot; ' + esc(funcRep.reportNumber || funcRep.id || "") + ' &middot; ' + esc(funcRep.date || "") + ' &middot; <b style="color:' + fColor + '">' + fEsito + '</b></div>'
+ (secRows ? '<table><thead><tr><th>Sezione</th><th style="text-align:center">Esito</th></tr></thead><tbody>' + secRows + '</tbody></table>' : "");
} else {
funcHtml = secHead("2", "Verifica funzionale") + '<div style="font-size:11px;color:#d97706">Non eseguita / non collegata a questa PPM</div>';
}
// Sezione VSE
var iecHtml;
if (iecRep) {
var measFilled = (iecRep.measures || []).filter(function (m) { return m.na || (m.value !== "" && m.value != null && !isNaN(parseFloat(m.value))); });
var measRows = measFilled.map(function (m) {
if (m.na) return '<tr style="opacity:.7"><td>' + esc(m.name) + '</td><td style="text-align:center;font-family:monospace">' + esc(m.limit) + '</td><td style="text-align:center">&mdash;</td><td style="text-align:center">' + esc(m.unit) + '</td><td style="text-align:center"><span class="badge" style="background:#e5e7eb;color:#6b7280">N/A</span></td></tr>';
var v = parseFloat(m.value), lv = parseFloat(m.limitVal); var pass = (m.limitMin == null || v >= parseFloat(m.limitMin)) && (m.limitVal == null || (m.invertPass ? v >= lv : v <= lv));
return '<tr><td>' + esc(m.name) + '</td><td style="text-align:center;font-family:monospace">' + esc(m.limit) + '</td><td style="text-align:center;font-family:monospace;font-weight:700">' + esc(m.value) + '</td><td style="text-align:center">' + esc(m.unit) + '</td><td style="text-align:center"><span class="badge ' + (pass ? "pass" : "fail") + '">' + (pass ? "&#10003; PASS" : "&#10007; FAIL") + '</span></td></tr>';
}).join("");
var iEsito = iecRep.verifyStatus === "non_disponibile" ? "NON ESEGUITA" : (iecRep.overallPass ? "CONFORME" : "NON CONFORME");
var iColor = iecRep.verifyStatus === "non_disponibile" ? "#d97706" : (iecRep.overallPass ? "#059669" : "#dc2626");
iecHtml = secHead("3", "Sicurezza elettrica (CEI EN 62353)")
+ '<div style="font-size:11px;color:#334155;margin-bottom:8px">' + esc(iecRep.reportNumber || iecRep.id || "") + ' &middot; ' + esc(iecRep.date || "") + ' &middot; <b style="color:' + iColor + '">' + iEsito + '</b></div>'
+ (measRows ? '<table><thead><tr><th>Misura</th><th style="text-align:center">Limite</th><th style="text-align:center">Valore</th><th style="text-align:center">U.M.</th><th style="text-align:center">Esito</th></tr></thead><tbody>' + measRows + '</tbody></table>' : "");
} else {
iecHtml = secHead("3", "Sicurezza elettrica (CEI EN 62353)") + '<div style="font-size:11px;color:#d97706">Non eseguita / non collegata a questa PPM</div>';
}
var checklistOk = ppm.overallPass !== false;
var funcOk = !funcRep || funcRep.verifyStatus === "non_disponibile" || funcRep.overallPass;
var iecOk = !iecRep || iecRep.verifyStatus === "non_disponibile" || iecRep.overallPass;
var allOk = checklistOk && funcOk && iecOk;
var ovColor = allOk ? "#059669" : "#dc2626";
var ovLabel = allOk ? "CONFORME" : "NON CONFORME";
var html = '<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"><title>PPM ' + esc(asset.name || "") + '</title><style>' + PDF_STYLE + '</style></head><body><div class="wrap"><div class="side"></div><div class="main">'
+ '<div class="header"><div><h1>Manutenzione Programmata</h1><div class="sub">' + esc(company.name || "MedTrace") + '</div></div><div class="right"><div class="doctype">PPM</div><div class="docnum">' + esc(ppm.reportNumber || ppm.id || "") + '</div><div class="docdate">' + esc(ppm.date || "") + '</div></div></div>'
+ '<div style="display:flex;flex-wrap:wrap;gap:6px 22px;font-size:11px;margin:10px 0;color:#334155"><div><b>Apparecchio:</b> ' + esc((asset.name || "") + " " + (asset.model || "")) + '</div><div><b>S/N:</b> ' + esc(asset.serial || "") + '</div><div><b>Cliente:</b> ' + esc(customer.name || "") + '</div><div><b>Tecnico:</b> ' + esc(ppm.technician || "") + '</div></div>'
+ '<div style="background:' + ovColor + ';color:#fff;font-weight:800;text-align:center;padding:10px;border-radius:4px;margin:8px 0 4px;letter-spacing:1px">ESITO COMPLESSIVO: ' + ovLabel + '</div>'
+ secHead("1", "Manutenzione (checklist)") + '<table><thead><tr><th>Voce</th><th style="text-align:center">Stato</th><th>Nota</th></tr></thead><tbody>' + (clRows || '<tr><td colspan="3" style="text-align:center;color:#94a3b8">Nessuna voce</td></tr>') + '</tbody></table>'
+ funcHtml + iecHtml
+ (ppm.notes ? (secHead("", "Note") + '<div style="font-size:11px;color:#334155">' + esc(ppm.notes) + '</div>') : "")
+ '<div class="sign-row" style="display:flex;justify-content:space-between;margin-top:26px;font-size:11px;color:#334155"><div>Tecnico: ____________________</div><div>Firma: ____________________</div></div>'
+ '<div style="margin-top:14px;padding:9px 11px;border:1px solid #e2e8f0;border-radius:6px;background:#f8fafc;font-size:7.8px;color:#64748b;line-height:1.5"><div style="font-weight:700;color:#475569;margin-bottom:3px">Avvertenze e limitazioni</div><b>a)</b> Verbale di verifica, non atto di certificazione; i risultati si riferiscono al solo esemplare provato e alle prove eseguite. &nbsp; <b>b)</b> Sicurezza elettrica secondo IEC 62353 (CEI EN 62353); le prove funzionali sono buona tecnica di categoria, per il singolo modello prevale il manuale del fabbricante. &nbsp; <b>c)</b> L\'esito positivo attesta che i parametri rientrano nei valori previsti, non l\'idoneità a impieghi specifici (riferirsi a normative e linee guida). &nbsp; <b>d)</b> ' + esc(company.name || '[Ragione sociale]') + ' non risponde di danni derivanti dall\'inosservanza dei manuali del fabbricante; il Cliente è tenuto a usare l\'apparecchio secondo le istruzioni del Costruttore.</div>'
+ '</div></div></body></html>';
openPrintWindow(html);
}
function PpmWizardForm({ assetId: propAssetId, assets, customers, templates, existingFunc, existingIec, technicians, instruments, onSaveFull, onClose }) {
const h = React.createElement;
const TEAL = "#2dd4bf", RED = "#ef4444";
const tplFor = (ast) => (cndToTemplate((ast && ast.cnd) || "") || guessTemplate((ast && ast.name) || "") || "generico");
const buildState = (aid) => {
const ast = (assets || []).find(a => a.id === aid);
const tplId = tplFor(ast);
const cl = getPpmChecklist(ast || {});
const norm = (ast && ast.iecNorm) || "62353";
const equipClass = (ast && ast.iecClass) || "I";
const patientType = (ast && ast.patientType) || "BF";
const fixedInstall = !!(ast && ast.fixedInstall);
return {
assetId: aid, templateId: tplId, categoryId: cl.categoryId,
technicianSignature: "", departmentSignature: "",
maint: (cl.items || []).map(t => ({ text: t, status: null, note: "" })),
norm: norm, equipClass: equipClass, patientType: patientType, leakageMethod: "diretto", sfc: true, fixedInstall: fixedInstall,
iecMeasures: iecGetMeasures(norm, equipClass, patientType, "diretto", true, fixedInstall),
funcSections: {},
};
};
const [f, setF] = React.useState(() => Object.assign({ date: new Date().toISOString().slice(0, 10), technician: "", notes: "" }, buildState(propAssetId || "")));
const [step, setStep] = React.useState(0);
const [tutOpen, setTutOpen] = React.useState(false);
const [tplOpen, setTplOpen] = React.useState(false);

const pickAsset = (aid) => { setTplOpen(false); setF(x => Object.assign({}, x, buildState(aid))); };
const pickTpl = (tid) => setF(x => Object.assign({}, x, { templateId: tid, funcSections: {} }));
const regenIec = (patch) => setF(x => {
const nx = Object.assign({}, x, patch);
const fresh = iecGetMeasures(nx.norm, nx.equipClass, nx.patientType, nx.leakageMethod, nx.sfc !== false, nx.fixedInstall);
const merged = fresh.map(mm => { const old = (x.iecMeasures || []).find(o => o.id === mm.id); return old ? Object.assign({}, mm, { value: old.value, na: old.na }) : mm; });
return Object.assign(nx, { iecMeasures: merged });
});
const setMaint = (i, status) => setF(x => Object.assign({}, x, { maint: x.maint.map((it, j) => j === i ? Object.assign({}, it, { status: status }) : it) }));
const setMaintNote = (i, note) => setF(x => Object.assign({}, x, { maint: x.maint.map((it, j) => j === i ? Object.assign({}, it, { note: note }) : it) }));
const setFuncItem = (sid, iid, val) => setF(x => { const s = Object.assign({ items: {}, measures: {} }, x.funcSections[sid]); s.items = Object.assign({}, s.items, { [iid]: val }); return Object.assign({}, x, { funcSections: Object.assign({}, x.funcSections, { [sid]: s }) }); });
const setFuncMeas = (sid, mid, val) => setF(x => { const s = Object.assign({ items: {}, measures: {} }, x.funcSections[sid]); s.measures = Object.assign({}, s.measures, { [mid]: val }); return Object.assign({}, x, { funcSections: Object.assign({}, x.funcSections, { [sid]: s }) }); });
const setIecMeas = (id, val) => setF(x => Object.assign({}, x, { iecMeasures: x.iecMeasures.map(mm => mm.id === id ? Object.assign({}, mm, { value: val, na: false }) : mm) }));
const toggleIecNA = (id) => setF(x => Object.assign({}, x, { iecMeasures: x.iecMeasures.map(mm => mm.id === id ? Object.assign({}, mm, { na: !mm.na, value: "" }) : mm) }));

const tpl = (templates || {})[f.templateId] || null;
const funcSecs = (tpl && tpl.sections) || [];
const measVerdict = (mm, raw) => { if (raw === "na" || (mm && mm.na)) return null; var v = parseFloat(raw); if (isNaN(v)) return null; var hasMin = mm.limitMin !== undefined && mm.limitMin !== null; var hasMax = mm.limitVal !== undefined && mm.limitVal !== null; if (!hasMin && !hasMax) return null; if (hasMin && v < parseFloat(mm.limitMin)) return false; if (hasMax) { var lv = parseFloat(mm.limitVal); if (mm.invertPass) { if (v < lv) return false; } else { if (v > lv) return false; } } return true; };

// pass
const funcPass = (function () {
for (var s = 0; s < funcSecs.length; s++) { var sec = funcSecs[s]; var sd = f.funcSections[sec.id] || { items: {}, measures: {} };
var its = sec.items || []; for (var i = 0; i < its.length; i++) { if (sd.items[its[i].id] === false) return false; }
var ms = sec.measures || []; for (var m = 0; m < ms.length; m++) { var raw = sd.measures[ms[m].id]; if (raw === undefined || raw === "" || raw === "na") continue; if (measVerdict(ms[m], raw) === false) return false; } }
return true;
})();
const vsePass = !(f.iecMeasures || []).some(mm => measVerdict(mm, mm.value) === false);
const overall = funcPass && vsePass;

// steps
const steps = [{ ph: "Preparazione", key: "setup", name: "Dati e configurazione" }, { ph: "Manutenzione", key: "maint", name: "Checklist manutenzione" }]
.concat(funcSecs.map(sec => ({ ph: "Funzionale", key: "funcsec", sec: sec, name: sec.title })))
.concat((f.iecMeasures || []).map((mm, i) => ({ ph: "Sicurezza elettrica", key: "meas", idx: i, m: mm, name: mm.name })))
.concat([{ ph: "Esito", key: "esito", name: "Esito e salvataggio" }]);
const TOT = steps.length;
const cur = Math.min(step, TOT - 1);
const sObj = steps[cur];
const ast = (assets || []).find(a => a.id === f.assetId);

const secFilled = (sec) => { var sd = f.funcSections[sec.id] || { items: {}, measures: {} };
var its = sec.items || []; for (var i = 0; i < its.length; i++) { var v = sd.items[its[i].id]; if (v !== true && v !== false && v !== "na") return false; }
var ms = sec.measures || []; for (var m = 0; m < ms.length; m++) { var raw = sd.measures[ms[m].id]; if (raw === "na") continue; if (raw === undefined || raw === "" || isNaN(parseFloat(raw))) return false; } return true; };
const stepFilled = (st) => {
if (st.key === "setup") return !!f.assetId;
if (st.key === "maint") return (f.maint || []).every(it => it.status === "fatto" || it.status === "na");
if (st.key === "funcsec") return secFilled(st.sec);
if (st.key === "meas") { var mm = f.iecMeasures[st.idx]; return mm.na || (mm.value !== "" && mm.value != null && !isNaN(parseFloat(mm.value))); }
return true;
};
const doneCount = steps.filter(stepFilled).length;
const go = (i) => { setStep(Math.max(0, Math.min(TOT - 1, i))); setTutOpen(false); try { window.scrollTo(0, 0); } catch (e) { } };
React.useEffect(() => { if (sObj.key !== "esito" || f.technicianSignature) return; const sig = techSignature(technicians, f.technician); if (sig) setF(x => Object.assign({}, x, { technicianSignature: sig })); }, [sObj.key]);
const doSave = () => { if (!f.assetId) return; if (!f.technicianSignature) { try { window.dispatchEvent(new CustomEvent("toast", { detail: { msg: "Firma del tecnico obbligatoria", color: "#ef4444" } })); } catch (e) { } return; } onSaveFull({ technicianSignature: f.technicianSignature || "", departmentSignature: f.departmentSignature || "", assetId: f.assetId, date: f.date, technician: f.technician, templateId: f.templateId, categoryId: f.categoryId, maint: f.maint, funcSections: f.funcSections, funcPass: funcPass, iecMeasures: f.iecMeasures, iecConfig: { norm: f.norm, equipClass: f.equipClass, patientType: f.patientType, leakageMethod: f.leakageMethod }, vsePass: vsePass, overall: overall, notes: f.notes }); };

const selStyle = { width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "9px 11px", fontSize: 13 };
const lblStyle = { fontSize: 11, fontWeight: 600, color: "var(--text-3)", marginBottom: 4, display: "block" };
const okNo = (val, onYes, onNo, onNA, yesLabel, noLabel) => h("div", { style: { display: "flex", gap: 6 } },
h("button", { type: "button", onClick: onYes, style: { background: val === true ? TEAL : "var(--surface-2)", color: val === true ? "#04201C" : "var(--text-3)", border: "1px solid " + (val === true ? TEAL : "var(--border)"), borderRadius: 8, padding: "6px 11px", fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" } }, yesLabel || "✓ OK"),
h("button", { type: "button", onClick: onNo, style: { background: val === false ? RED : "var(--surface-2)", color: val === false ? "#fff" : "var(--text-3)", border: "1px solid " + (val === false ? RED : "var(--border)"), borderRadius: 8, padding: "6px 11px", fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" } }, noLabel || "✗ NO"),
onNA ? h("button", { type: "button", onClick: onNA, style: { background: val === "na" ? "#6b7280" : "var(--surface-2)", color: val === "na" ? "#fff" : "var(--text-4)", border: "1px solid " + (val === "na" ? "#6b7280" : "var(--border)"), borderRadius: 8, padding: "6px 10px", fontWeight: 700, fontSize: 12, cursor: "pointer" } }, "N/A") : null);

// step content
let content;
if (sObj.key === "setup") {
content = h("div", { style: { display: "flex", flexDirection: "column", gap: 12 } },
h("div", null, h("span", { style: lblStyle }, "Apparecchio"),
h(AssetCombobox, { value: f.assetId, onChange: pickAsset, assets: assets, customers: customers, placeholder: "Cerca apparecchio…" })),
f.assetId ? h("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
f.templateId === "generico"
? h("div", { style: { background: "#f59e0b1a", border: "1px solid #f59e0b66", borderRadius: 8, padding: "10px 12px" } }, h("div", { style: { fontSize: 12.5, fontWeight: 700, color: "#f59e0b" } }, "⚠ Nessun protocollo specifico rilevato"), h("div", { style: { fontSize: 11.5, color: "var(--text-3)", marginTop: 2 } }, "Scegli qui sotto il protocollo corretto per questo apparecchio."))
: h("div", { style: { fontSize: 12, color: "var(--text-3)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 11px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 } }, h("div", null, "Protocollo funzionale: ", h("b", { style: { color: "var(--text)" } }, (tpl && tpl.label) || f.templateId), (tpl && tpl.norm) ? h("div", { style: { fontSize: 11, color: "var(--text-4)", marginTop: 2 } }, tpl.norm) : null), h("button", { type: "button", onClick: () => setTplOpen(v => !v), style: { background: "transparent", border: "none", color: TEAL, fontSize: 11.5, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" } }, tplOpen ? "Chiudi" : "Cambia")),
(f.templateId === "generico" || tplOpen) ? h("select", { value: f.templateId, onChange: e => pickTpl(e.target.value), style: selStyle }, Object.keys(templates || {}).sort((a, b) => (((templates[a] || {}).label) || a).localeCompare(((templates[b] || {}).label) || b)).map(k => h("option", { key: k, value: k }, ((templates[k] || {}).label) || k))) : null,
h("div", { style: { fontSize: 10.5, color: "var(--text-4)", lineHeight: 1.4, marginTop: 2 } }, "Le procedure di manutenzione e verifica di riferimento sono quelle del fabbricante. I template proposti sono generici, di supporto al tecnico, e non vincolanti.")) : null,
h("div", null, h("span", { style: lblStyle }, "Data"), h("input", { type: "date", value: f.date, onChange: e => setF(x => Object.assign({}, x, { date: e.target.value })), style: selStyle })),
h(TecnicoPicker, { label: "Tecnico/i", value: f.technician, onChange: v => setF(x => Object.assign({}, x, { technician: v })), technicians: technicians }),
h("div", { style: { fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .5, marginTop: 4 } }, "Parametri sicurezza elettrica"),
h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } },
h("div", null, h("span", { style: lblStyle }, "Norma"), h("select", { value: f.norm, onChange: e => regenIec({ norm: e.target.value }), style: selStyle }, h("option", { value: "62353" }, "IEC 62353"), h("option", { value: "60601" }, "IEC 60601-1"), h("option", { value: "61010" }, "IEC 61010-1"))),
h("div", null, h("span", { style: lblStyle }, "Classe"), h("select", { value: f.equipClass, onChange: e => regenIec({ equipClass: e.target.value }), style: selStyle }, h("option", { value: "I" }, "Classe I"), h("option", { value: "II" }, "Classe II"), h("option", { value: "III" }, "Classe III"))),
h("div", null, h("span", { style: lblStyle }, "Parte applicata"), h("select", { value: f.patientType, onChange: e => regenIec({ patientType: e.target.value }), style: selStyle }, h("option", { value: "B" }, "Tipo B"), h("option", { value: "BF" }, "Tipo BF"), h("option", { value: "CF" }, "Tipo CF"))),
f.norm === "62353" ? h("div", null, h("span", { style: lblStyle }, "Metodo"), h("select", { value: f.leakageMethod, onChange: e => regenIec({ leakageMethod: e.target.value }), style: selStyle }, h("option", { value: "diretto" }, "Diretto"), h("option", { value: "differenziale" }, "Differenziale"), h("option", { value: "alternativo" }, "Alternativo"))) : h("div")));
} else if (sObj.key === "maint") {
content = h("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
(f.maint || []).length === 0 ? h("div", { style: { fontSize: 13, color: "var(--text-4)" } }, "Nessuna voce di manutenzione per questa categoria.") : null,
(f.maint || []).map((it, i) => h("div", { key: i, style: { background: "var(--surface)", border: "1px solid " + (it.status === "fatto" ? TEAL + "66" : it.status === "na" ? "var(--border)" : "var(--border)"), borderRadius: 12, padding: "11px 13px" } },
h("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 } },
h("span", { style: { fontSize: 13, color: "var(--text)", flex: 1, minWidth: 0, lineHeight: 1.35 } }, it.text),
okNo(it.status === "fatto" ? true : it.status === "na" ? "na" : null, () => setMaint(i, "fatto"), null, () => setMaint(i, "na"), "✓ Fatto")),
it.status === "fatto" ? h("input", { type: "text", value: it.note, onChange: e => setMaintNote(i, e.target.value), placeholder: "Nota (facoltativa)…", style: { width: "100%", marginTop: 8, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 7, color: "var(--text)", padding: "7px 9px", fontSize: 12 } }) : null)));
} else if (sObj.key === "funcsec") {
const sec = sObj.sec; const sd = f.funcSections[sec.id] || { items: {}, measures: {} };
content = h("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
sec.note ? h("div", { style: { fontSize: 12, color: "var(--text-2)", background: "#38bdf812", border: "1px solid #38bdf833", borderRadius: 8, padding: "10px 12px", whiteSpace: "pre-line", lineHeight: 1.5 } }, sec.note) : null,
(sec.items || []).map(it => h("div", { key: it.id, style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, background: "var(--surface)", border: "1px solid " + (sd.items[it.id] === true ? TEAL + "66" : sd.items[it.id] === false ? RED + "66" : "var(--border)"), borderRadius: 12, padding: "11px 13px" } },
h("span", { style: { fontSize: 13, color: "var(--text)", flex: 1, minWidth: 0, lineHeight: 1.35 } }, it.text),
okNo(sd.items[it.id], () => setFuncItem(sec.id, it.id, true), () => setFuncItem(sec.id, it.id, false), () => setFuncItem(sec.id, it.id, "na")))),
(sec.measures || []).map(mm => { const raw = sd.measures[mm.id]; const isNA = raw === "na"; const verd = measVerdict(mm, raw);
return h("div", { key: mm.id, style: { background: "var(--surface)", border: "1px solid " + (isNA ? "var(--border)" : verd === true ? TEAL + "66" : verd === false ? RED + "66" : "var(--border)"), borderRadius: 12, padding: "11px 13px" } },
h("div", { style: { fontSize: 12.5, color: "var(--text)", marginBottom: 6 } }, mm.name),
h("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
h("input", { type: "number", inputMode: "decimal", disabled: isNA, value: isNA ? "" : (raw || ""), onChange: e => setFuncMeas(sec.id, mm.id, e.target.value), placeholder: "—", style: { width: 110, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 7, color: "var(--text)", padding: "8px 10px", fontSize: 15, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" } }),
h("span", { style: { fontSize: 13, color: "var(--text-3)" } }, mm.unit),
h("span", { style: { fontSize: 11.5, color: "var(--text-4)", marginLeft: "auto" } }, "lim. " + (mm.expected || mm.limit || ("" + mm.limitVal))),
h("button", { type: "button", onClick: () => setFuncMeas(sec.id, mm.id, isNA ? "" : "na"), style: { background: isNA ? "#6b7280" : "var(--surface-2)", color: isNA ? "#fff" : "var(--text-4)", border: "1px solid " + (isNA ? "#6b7280" : "var(--border)"), borderRadius: 7, padding: "6px 9px", fontSize: 11.5, fontWeight: 700, cursor: "pointer" } }, "N/A")),
verd != null ? h("div", { style: { fontSize: 11.5, fontWeight: 700, color: verd ? TEAL : RED, marginTop: 5 } }, verd ? "✓ Entro i limiti" : "✗ Fuori limite") : null); }));
} else if (sObj.key === "meas") {
const mm = f.iecMeasures[sObj.idx];
const verd = measVerdict(mm, mm.value);
const v = parseFloat(mm.value), lv = parseFloat(mm.limitVal);
const margin = (!isNaN(v) && !isNaN(lv)) ? Math.abs(lv - v) : null;
const marginTxt = margin == null ? "—" : (verd === false ? "−" : "") + margin.toFixed(margin < 1 ? 3 : (margin < 10 ? 2 : 0)) + " " + mm.unit;
content = h("div", null,
h("div", { style: { background: "var(--surface)", border: "1px solid " + (mm.na ? "var(--border)" : verd === true ? TEAL : verd === false ? RED : "var(--border)"), borderRadius: 16, padding: "18px", marginBottom: 12, opacity: mm.na ? 0.6 : 1 } },
h("div", { style: { fontSize: 11, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10 } }, "Valore rilevato"),
h("div", { style: { display: "flex", alignItems: "center", gap: 10, borderBottom: "2px solid var(--border)", paddingBottom: 8 } },
h("input", { type: "number", inputMode: "decimal", disabled: mm.na, value: mm.value, onChange: e => setIecMeas(mm.id, e.target.value), placeholder: "—", style: { flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: 30, fontWeight: 800, fontFamily: "'IBM Plex Mono', monospace" } }),
h("span", { style: { fontSize: 17, fontWeight: 700, color: "var(--text-3)" } }, mm.unit)),
h("div", { style: { marginTop: 10, fontSize: 13, fontWeight: 700, color: mm.na ? "var(--text-4)" : verd === true ? TEAL : verd === false ? RED : "var(--text-4)" } }, mm.na ? "Non applicabile" : verd === true ? "✓ Entro i limiti" : verd === false ? "✗ Fuori limite" : "Inserisci il valore misurato"),
h("div", { style: { display: "flex", gap: 10, marginTop: 12 } },
h("div", { style: { flex: 1, background: "var(--surface-2)", borderRadius: 8, padding: "8px 10px" } }, h("div", { style: { fontSize: 10, color: "var(--text-4)", marginBottom: 2 } }, "Limite normativo"), h("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--text-2)", fontFamily: "'IBM Plex Mono', monospace" } }, mm.limit + " " + mm.unit)),
h("div", { style: { flex: 1, background: "var(--surface-2)", borderRadius: 8, padding: "8px 10px" } }, h("div", { style: { fontSize: 10, color: "var(--text-4)", marginBottom: 2 } }, "Margine"), h("div", { style: { fontSize: 13, fontWeight: 700, color: verd === false ? RED : "var(--text-2)", fontFamily: "'IBM Plex Mono', monospace" } }, marginTxt)))),
h("label", { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--text-3)", cursor: "pointer" } }, h("input", { type: "checkbox", checked: !!mm.na, onChange: () => toggleIecNA(mm.id) }), "Non applicabile (N/A)"));
} else {
const maintDone = (f.maint || []).filter(it => it.status).length;
content = h("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
h("div", { style: { background: overall ? TEAL + "1a" : RED + "1a", border: "1px solid " + (overall ? TEAL + "66" : RED + "66"), borderRadius: 16, padding: "20px", textAlign: "center" } },
h("div", { style: { fontSize: 34, fontWeight: 800, color: overall ? TEAL : RED } }, overall ? "✓" : "✗"),
h("div", { style: { fontSize: 19, fontWeight: 800, color: "var(--text)", marginTop: 4 } }, overall ? "Conforme" : "Non conforme"),
h("div", { style: { fontSize: 12.5, color: "var(--text-3)", marginTop: 4 } }, "Manutenzione + funzionale + sicurezza elettrica in un unico verbale")),
h("div", { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" } },
[["Apparecchio", ast ? ((ast.name || "") + (ast.assetCode ? " · " + ast.assetCode : "")) : "—"], ["Manutenzione", maintDone + "/" + (f.maint || []).length + " voci"], ["Funzionale", funcPass ? "Conforme" : "Non conforme"], ["Sicurezza elettrica", vsePass ? "Conforme" : "Non conforme"], ["Esito complessivo", overall ? "Conforme" : "Non conforme"]].map((r, i) => h("div", { key: i, style: { display: "flex", justifyContent: "space-between", gap: 10, padding: "10px 14px", borderBottom: i < 4 ? "1px solid var(--border-2)" : "none" } }, h("span", { style: { fontSize: 12, color: "var(--text-3)" } }, r[0]), h("span", { style: { fontSize: 12.5, fontWeight: 600, color: (i >= 2) ? ((i === 2 ? funcPass : i === 3 ? vsePass : overall) ? TEAL : RED) : "var(--text)" } }, r[1])))),
h("div", null, h("span", { style: lblStyle }, "Note conclusive"), h("textarea", { value: f.notes, onChange: e => setF(x => Object.assign({}, x, { notes: e.target.value })), placeholder: "Annotazioni finali…", style: { width: "100%", minHeight: 64, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "10px", fontSize: 13, resize: "vertical", fontFamily: "inherit" } })),
h("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 } },
h(SignaturePad, { label: "Firma Tecnico verificatore (obbligatoria)", value: f.technicianSignature || "", onChange: v => setF(x => Object.assign({}, x, { technicianSignature: v })), height: 120 }),
h(SignaturePad, { label: "Firma Referente reparto (opzionale)", value: f.departmentSignature || "", onChange: v => setF(x => Object.assign({}, x, { departmentSignature: v })), height: 120 })),
h("div", { style: { fontSize: 11.5, color: "var(--text-4)", textAlign: "center" } }, "Al salvataggio: crea il verbale di manutenzione, la verifica funzionale e la VSE collegate, aggiorna le scadenze e apre il PDF unico."));
}

// shell
const phColor = { "Preparazione": "#94a3b8", "Manutenzione": "#f59e0b", "Funzionale": "#38bdf8", "Sicurezza elettrica": TEAL, "Esito": "#a78bfa" }[sObj.ph] || TEAL;
return h("div", { style: { display: "flex", flexDirection: "column", gap: 0 } },
h("div", { style: { padding: "2px 2px 14px" } },
h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 } },
h("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
h("span", { style: { fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".6px", color: phColor, background: phColor + "22", padding: "3px 8px", borderRadius: 99 } }, sObj.ph),
h("span", { style: { fontSize: 13, fontWeight: 700, color: "var(--text)" } }, "Passo ", cur + 1, " ", h("span", { style: { fontWeight: 500, color: "var(--text-3)" } }, "di " + TOT))),
h("div", { style: { fontSize: 11.5, color: "var(--text-3)" } }, doneCount + "/" + TOT)),
h("div", { style: { height: 6, background: "var(--surface-2)", borderRadius: 99, overflow: "hidden" } }, h("div", { style: { height: "100%", width: Math.round((cur / (TOT - 1)) * 100) + "%", background: phColor, borderRadius: 99, transition: "width .2s" } }))),
h("div", { style: { marginBottom: 14 } },
h("h2", { style: { fontSize: 20, fontWeight: 800, letterSpacing: "-.01em", lineHeight: 1.2, margin: "0 0 4px", color: "var(--text)" } }, sObj.name),
h("div", { style: { fontSize: 12.5, color: "var(--text-3)" } }, sObj.key === "setup" ? "Apparecchio, data e parametri" : sObj.key === "maint" ? "Pulizia e sostituzione parti di usura" : sObj.key === "funcsec" ? "Prove di funzionamento" : sObj.key === "meas" ? ("Limite normativo " + sObj.m.limit + " " + sObj.m.unit) : "Riepilogo e salvataggio")),
content,
h("div", { style: { display: "flex", gap: 10, marginTop: 18 } },
h("button", { type: "button", onClick: () => cur > 0 ? go(cur - 1) : onClose(), style: { display: "flex", alignItems: "center", gap: 5, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text-2)", padding: "12px 18px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" } }, h("span", { style: { fontSize: 18, lineHeight: 1, marginTop: -1 } }, "‹"), cur > 0 ? "Indietro" : "Esci"),
cur < TOT - 1
? h("button", { type: "button", disabled: !stepFilled(sObj), onClick: () => { if (stepFilled(sObj)) go(cur + 1); }, style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: stepFilled(sObj) ? TEAL : "var(--surface-2)", border: "none", borderRadius: 10, color: stepFilled(sObj) ? "#04201C" : "var(--text-4)", padding: "12px 16px", fontSize: 14.5, fontWeight: 800, cursor: stepFilled(sObj) ? "pointer" : "not-allowed" } }, "Avanti", h("span", { style: { fontSize: 18, lineHeight: 1, marginTop: -1 } }, "›"))
: h("button", { type: "button", disabled: !f.assetId, onClick: doSave, style: { flex: 1, background: f.assetId ? TEAL : "var(--surface-2)", border: "none", borderRadius: 10, color: f.assetId ? "#04201C" : "var(--text-4)", padding: "12px 16px", fontSize: 14.5, fontWeight: 800, cursor: f.assetId ? "pointer" : "not-allowed" } }, "✓ Salva e genera PDF")),
(cur < TOT - 1 && !stepFilled(sObj)) ? h("div", { style: { fontSize: 11.5, color: "var(--text-4)", textAlign: "center", marginTop: 9 } }, sObj.key === "setup" ? "Seleziona l'apparecchio per continuare" : sObj.key === "maint" ? "Segna ogni voce (Fatto o N/A) per continuare" : sObj.key === "funcsec" ? "Completa voci e misure della sezione" : "Inserisci il valore o segna N/A per continuare") : null);
}

function PpmVerifyForm({ initial, assetId: propAssetId, assets, customers, existingReports, technicians, onSave, onClose, showToast, ppmReports, funcReports, iecReports, onLink, onPdf, setModal, pushModal }) {
var _a = React.useState(propAssetId || (initial && initial.assetId) || ""); var assetId = _a[0], setAssetId = _a[1];
var effectiveAsset = (assets || []).find(function (a) { return a.id === assetId; }) || null;
var blank = {
id: "PPM" + Date.now().toString().slice(-6),
reportNumber: "",
assetId: propAssetId || "",
date: new Date().toISOString().slice(0, 10),
technician: "",
items: [],
notes: "",
overallPass: true,
verifyType: "programmata",
technicianSignature: "",
departmentSignature: ""
};
var _f = React.useState(function () {
var init = initial || blank;
if (!initial && !init.reportNumber) init.reportNumber = getNextReportNumber(existingReports || [], "PPM");
if (!initial && init.assetId) { var ci0 = getPpmChecklist((assets || []).find(function (a) { return a.id === init.assetId; }) || {}); init.items = ci0.items.map(function (t) { return { text: t, status: "fatto", note: "" }; }); init.categoryId = ci0.categoryId; init.modelKey = ci0.modelKey; }
return init;
});
var f = _f[0], setF = _f[1];
React.useEffect(function () { if (f.technicianSignature) return; var sig = techSignature(technicians, f.technician); if (sig) setF(function (x) { return Object.assign({}, x, { technicianSignature: sig }); }); }, [f.technician]);
React.useEffect(function () {
if (initial) return;
if (!assetId) { setF(function (x) { return Object.assign(Object.assign({}, x), { assetId: "", items: [] }); }); return; }
var ci = getPpmChecklist((assets || []).find(function (a) { return a.id === assetId; }) || {});
setF(function (x) { return Object.assign(Object.assign({}, x), { assetId: assetId, items: ci.items.map(function (t) { return { text: t, status: "fatto", note: "" }; }), categoryId: ci.categoryId, modelKey: ci.modelKey }); });
}, [assetId]);
function sv(k) { return function (e) { var val = (e && e.target) ? e.target.value : e; setF(function (x) { var o = {}; o[k] = val; return Object.assign(Object.assign({}, x), o); }); }; }
function setItemStatus(i, st) { setF(function (x) { var it = (x.items || []).slice(); it[i] = Object.assign(Object.assign({}, it[i]), { status: st }); return Object.assign(Object.assign({}, x), { items: it }); }); }
function setItemNote(i, v) { setF(function (x) { var it = (x.items || []).slice(); it[i] = Object.assign(Object.assign({}, it[i]), { note: v }); return Object.assign(Object.assign({}, x), { items: it }); }); }
function doSave() {
if (!f.technicianSignature) { showToast && showToast("Firma del tecnico obbligatoria", "#ef4444"); return; }
if (!assetId) { showToast && showToast("Seleziona un apparecchio", "#ef4444"); return; }
var asset = (assets || []).find(function (a) { return a.id === assetId; }) || {};
onSave(Object.assign(Object.assign({}, f), { assetId: assetId, customerId: f.customerId || asset.customerId || "" }));
}
var items = f.items || [];
return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement("div", null,
React.createElement("label", { style: { fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .5, display: "block", marginBottom: 5 } }, "Apparecchio"),
React.createElement(AssetCombobox, { value: assetId, onChange: function (id) { setAssetId(id); }, assets: assets, customers: customers, placeholder: "Cerca apparecchio\u2026" })),
React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement(Inp, { label: "Data", type: "date", value: f.date, onChange: sv("date") }),
React.createElement(Inp, { label: "Tecnico", value: f.technician, onChange: sv("technician"), placeholder: "Nome tecnico" })),
effectiveAsset ? React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)" } }, "Periodicit\u00e0 costruttore: " + (parseInt(effectiveAsset.intervalPpm, 10) || 12) + " mesi") : null,
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 } }, "Checklist manutenzione" + (items.length ? (" (" + items.length + ")") : "")),
!assetId ? React.createElement("div", { style: { fontSize: 12.5, color: "var(--text-4)", padding: "6px 0" } }, "Seleziona un apparecchio per caricare la checklist.")
: items.length === 0 ? React.createElement("div", { style: { fontSize: 12.5, color: "var(--text-4)", padding: "6px 0" } }, "Nessuna voce per questa categoria. Aggiungile in \u2699 Checklist.")
: React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
items.map(function (it, i) {
var st = it.status || "fatto";
return React.createElement("div", { key: i, style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 9, padding: "10px 12px" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 } },
React.createElement("span", { style: { fontSize: 13, color: "var(--text)", flex: 1, minWidth: 0 } }, it.text),
React.createElement("div", { style: { display: "flex", gap: 4, flexShrink: 0 } },
React.createElement("button", { onClick: function () { setItemStatus(i, "fatto"); }, style: { background: st === "fatto" ? "#10b981" : "transparent", color: st === "fatto" ? "#04211d" : "var(--text-3)", border: "1px solid " + (st === "fatto" ? "#10b981" : "var(--border)"), borderRadius: 7, padding: "5px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" } }, "Fatto"),
React.createElement("button", { onClick: function () { setItemStatus(i, "na"); }, style: { background: st === "na" ? "#64748b" : "transparent", color: st === "na" ? "#fff" : "var(--text-3)", border: "1px solid " + (st === "na" ? "#64748b" : "var(--border)"), borderRadius: 7, padding: "5px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" } }, "N.A."))),
React.createElement("input", { value: it.note || "", onChange: function (e) { setItemNote(i, e.target.value); }, placeholder: "Nota (opzionale)\u2026", style: { marginTop: 8, width: "100%", boxSizing: "border-box", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 7, color: "var(--text)", padding: "7px 10px", fontSize: 12.5 } }));
}))),
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 } }, "Esito complessivo"),
React.createElement("div", { style: { display: "flex", gap: 8 } },
React.createElement("button", { onClick: function () { setF(function (x) { return Object.assign(Object.assign({}, x), { overallPass: true }); }); }, style: { flex: 1, background: f.overallPass !== false ? "#10b981" : "transparent", color: f.overallPass !== false ? "#04211d" : "var(--text-3)", border: "1px solid " + (f.overallPass !== false ? "#10b981" : "var(--border)"), borderRadius: 8, padding: "9px", fontSize: 13, fontWeight: 700, cursor: "pointer" } }, "Conforme"),
React.createElement("button", { onClick: function () { setF(function (x) { return Object.assign(Object.assign({}, x), { overallPass: false }); }); }, style: { flex: 1, background: f.overallPass === false ? "#ef4444" : "transparent", color: f.overallPass === false ? "#fff" : "var(--text-3)", border: "1px solid " + (f.overallPass === false ? "#ef4444" : "var(--border)"), borderRadius: 8, padding: "9px", fontSize: 13, fontWeight: 700, cursor: "pointer" } }, "Non conforme"))),
React.createElement(Inp, { label: "Note generali", value: f.notes, onChange: sv("notes"), placeholder: "Annotazioni sull'intervento\u2026" }),
initial ? (function () {
var livePpm = (ppmReports || []).find(function (r) { return r.id === initial.id; }) || initial;
var aFunc = (funcReports || []).filter(function (r) { return r.assetId === livePpm.assetId; }).sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });
var aIec = (iecReports || []).filter(function (r) { return r.assetId === livePpm.assetId; }).sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });
var selStyle = { flex: 1, minWidth: 0, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 7, color: "var(--text)", padding: "8px 10px", fontSize: 12.5 };
return React.createElement("div", { style: { borderTop: "1px solid var(--border-2)", paddingTop: 14 } },
React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 } }, "Verifiche collegate"),
React.createElement("div", { style: { fontSize: 12, color: "var(--text-4)", marginBottom: 10, lineHeight: 1.4 } }, "Esegui la verifica funzionale e la VSE (col pulsante \u201cEsegui\u201d o dalle loro sezioni), poi collegale qui. Confluiscono nel PDF unico."),
React.createElement("div", { style: { marginBottom: 10 } },
React.createElement("div", { style: { fontSize: 12.5, fontWeight: 600, color: "var(--text)", marginBottom: 4 } }, "Verifica funzionale"),
React.createElement("div", { style: { display: "flex", gap: 6 } },
React.createElement("select", { value: livePpm.funcReportId || "", onChange: function (e) { onLink(livePpm.id, { funcReportId: e.target.value }); }, style: selStyle },
React.createElement("option", { value: "" }, "\u2014 non collegata \u2014"),
aFunc.map(function (r) { return React.createElement("option", { key: r.id, value: r.id }, (r.reportNumber || r.id) + " \u00b7 " + (r.date || "") + " \u00b7 " + (r.overallPass ? "conforme" : "non conf.")); })),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: function () { pushModal({ type: "func", assetId: livePpm.assetId, data: null, ppmLink: livePpm.id }); } }, "Esegui"))),
React.createElement("div", { style: { marginBottom: 12 } },
React.createElement("div", { style: { fontSize: 12.5, fontWeight: 600, color: "var(--text)", marginBottom: 4 } }, "Sicurezza elettrica (VSE)"),
React.createElement("div", { style: { display: "flex", gap: 6 } },
React.createElement("select", { value: livePpm.iecReportId || "", onChange: function (e) { onLink(livePpm.id, { iecReportId: e.target.value }); }, style: selStyle },
React.createElement("option", { value: "" }, "\u2014 non collegata \u2014"),
aIec.map(function (r) { return React.createElement("option", { key: r.id, value: r.id }, (r.reportNumber || r.id) + " \u00b7 " + (r.date || "") + " \u00b7 " + (r.overallPass ? "conforme" : "non conf.")); })),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: function () { pushModal({ type: "iec", assetId: livePpm.assetId, data: null, ppmLink: livePpm.id }); } }, "Esegui"))),
React.createElement(Btn, { onClick: function () { onPdf(livePpm); } }, "\u2193 Scarica PDF unico"));
})() : React.createElement("div", { style: { fontSize: 12, color: "var(--text-4)", borderTop: "1px solid var(--border-2)", paddingTop: 12 } }, "Salva la checklist, poi riapri la PPM per collegare verifica funzionale e VSE e scaricare il PDF unico."),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 } },
React.createElement(SignaturePad, { label: "Firma Tecnico verificatore (obbligatoria)", value: f.technicianSignature || "", onChange: function (v) { setF(function (x) { return Object.assign({}, x, { technicianSignature: v }); }); }, height: 120 }),
React.createElement(SignaturePad, { label: "Firma Referente reparto (opzionale)", value: f.departmentSignature || "", onChange: function (v) { setF(function (x) { return Object.assign({}, x, { departmentSignature: v }); }); }, height: 120 })),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Annulla"),
React.createElement(Btn, { onClick: doSave }, "Salva PPM")));
}
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
React.createElement("div", { style: { fontSize: 12.5, color: "var(--text-3)", lineHeight: 1.45 } }, "Definisci le voci della checklist di manutenzione. La CATEGORIA \u00e8 il template generico (modificabile); il MODELLO aggiunge voci specifiche che si sommano a quelle della categoria."),
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
React.createElement("input", { value: t, onChange: function (e) { setItem(i, e.target.value); }, placeholder: "Descrizione voce\u2026", style: { flex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 7, color: "var(--text)", padding: "8px 10px", fontSize: 13 } }),
React.createElement("button", { onClick: function () { delItem(i); }, title: "Rimuovi", style: { background: "transparent", border: "1px solid var(--border)", borderRadius: 7, color: "#ef4444", padding: "7px 10px", cursor: "pointer", fontSize: 13 } }, "\u2715"));
})),
React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: addItem }, "+ Aggiungi voce"),
scope === "cat" ? React.createElement(Btn, { sm: true, variant: "ghost", onClick: resetCatDefault }, "\u21BA Ripristina default") : null),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Chiudi"),
React.createElement(Btn, { onClick: save }, "Salva checklist")));
}
function PpmPage({ setModal, ppmReports, assets, customers, onNew, onOpen, onDelete, onPdf }) {
var reports = (ppmReports || []).slice().sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });
function assetName(id) { var a = (assets || []).find(function (x) { return x.id === id; }); return a ? (a.name || a.model || id) : (id || "\u2014"); }
return React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 18, fontWeight: 900 } }, "Manutenzione Programmata"),
React.createElement("div", { style: { fontSize: 12.5, color: "var(--text-3)", marginTop: 2 } }, reports.length + " interventi \u00b7 checklist + funzionale + sicurezza elettrica")),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: function () { setModal({ type: "ppmChecklist" }); } }, "\u2699 Checklist"),
React.createElement(Btn, { sm: true, onClick: onNew }, "+ Nuova PPM"))),
reports.length === 0
? React.createElement(EmptyState, { icon: "\u2713", title: "Nessuna manutenzione programmata", subtitle: "Esegui la PPM periodica: checklist meccanica, verifica funzionale e sicurezza elettrica in un'unica uscita.", actions: [{ label: "+ Nuova PPM", onClick: onNew, primary: true }] })
: React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
reports.map(function (r) {
var ok = r.overallPass !== false;
var na = r.items ? r.items.filter(function (i) { return i.status === "na"; }).length : 0;
var done = r.items ? r.items.filter(function (i) { return i.status === "fatto"; }).length : 0;
return React.createElement("div", { key: r.id, style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 10, overflow: "hidden" } },
React.createElement("div", { onClick: function () { onOpen(r); }, style: { padding: "12px 14px", cursor: "pointer" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 } },
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--text)" } }, assetName(r.assetId)),
React.createElement("div", { style: { fontSize: 11.5, color: "var(--text-3)", marginTop: 2 } }, (r.reportNumber || r.id) + " \u00b7 " + (r.date || "") + (r.technician ? (" \u00b7 " + r.technician) : ""))),
React.createElement("span", { style: { flexShrink: 0, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: ok ? "#10b98122" : "#ef444422", color: ok ? "#10b981" : "#ef4444" } }, ok ? "Conforme" : "Non conforme")),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-4)", marginTop: 6 } }, done + " voci eseguite" + (na ? (" \u00b7 " + na + " N.A.") : ""))),
React.createElement("div", { style: { display: "flex", borderTop: "1px solid var(--border-2)" } },
React.createElement("button", { onClick: function () { onPdf(r); }, style: { flex: 1, background: "transparent", color: "#5eead4", border: "none", borderRight: "1px solid var(--border-2)", padding: "9px 4px", fontSize: 11.5, fontWeight: 700, cursor: "pointer" } }, "\uD83D\uDCC4 PDF"),
React.createElement("button", { onClick: function () { onOpen(r); }, style: { flex: 1, background: "transparent", color: "var(--text-2)", border: "none", borderRight: "1px solid var(--border-2)", padding: "9px 4px", fontSize: 11.5, fontWeight: 700, cursor: "pointer" } }, "\u270F Apri"),
React.createElement("button", { onClick: function () { onDelete(r.id); }, style: { flex: 1, background: "transparent", color: "#ef4444", border: "none", padding: "9px 4px", fontSize: 11.5, fontWeight: 700, cursor: "pointer" } }, "\u2715 Elimina")));
})));
}
function TemplateManagerModal({ allTemplates, customTemplates, onNew, onEdit, onDelete, onClose }) {
const predefiniti = Object.entries(allTemplates).filter(([id, t]) => !t.isCustom);
const custom = Object.entries(customTemplates || {});
const ROW = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "11px 14px", background: "var(--bg-2)", border: "1px solid var(--border-2)", borderRadius: 9, marginBottom: 7 };
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
React.createElement("div", { style: { fontSize: 12.5, fontWeight: 600, color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, t.label),
React.createElement("div", { style: { fontSize: 10.5, color: "var(--text-4)" } },
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
React.createElement("div", { style: { fontSize: 22, fontWeight: 900, color: color || "#2dd4bf", fontFamily: "'IBM Plex Mono', monospace" } }, n),
React.createElement("div", { style: { fontSize: 9, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .5, marginTop: 4, fontWeight: 700 } }, label)));
return (React.createElement("div", null,
React.createElement("div", { style: { marginBottom: 16 } },
React.createElement("div", { style: { fontSize: 18, fontWeight: 900, color: "var(--text)" } }, customer.name),
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
React.createElement("span", { style: { fontSize: 9.5, fontWeight: 800, padding: "2px 8px", borderRadius: 5, background: STATUS_COLOR[st] + "22", color: STATUS_COLOR[st], textTransform: "uppercase", letterSpacing: .3 } }, STATUS_LABEL[st] || st),
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
React.createElement("div", { style: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "68vw", maxWidth: 300, height: "68vw", maxHeight: 300, border: "3px solid #2dd4bf", borderRadius: 18, boxShadow: "0 0 0 9999px rgba(0,0,0,0.45)" } })),
err && React.createElement("div", { style: { padding: "14px 18px", background: "#ef444422", color: "#ef4444", fontSize: 12, textAlign: "center" } }, err));
}

function StickerModal({ report, asset, customer, company, kind, onClose, assets }) {
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
React.createElement("div", { style: { fontSize: 24, fontWeight: 900, lineHeight: 1.1, color: "#000", wordBreak: "break-all" } }, (asset === null || asset === void 0 ? void 0 : asset.assetCode) || (asset === null || asset === void 0 ? void 0 : asset.id) || "—"),
React.createElement("div", { style: { fontSize: 9.5, color: "#777", marginTop: 8, lineHeight: 1.4 } }, "Il QR apre la scheda con tutte le info (S/N, marca, modello, storico, scadenze) \u2014 sempre aggiornate."))) : (React.createElement(React.Fragment, null,
React.createElement("div", { style: { fontSize: 8.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: .4, color: "#666" } }, verLabel),
React.createElement("div", { style: { fontSize: 16, fontWeight: 900, lineHeight: 1.15, color: "#000", wordBreak: "break-word" } }, (asset === null || asset === void 0 ? void 0 : asset.name) || "Apparecchio"),
React.createElement("div", { style: { height: 1, background: "#e5e7eb", margin: "3px 0" } }),
React.createElement("div", { style: { fontSize: 11, color: "#333", lineHeight: 1.4 } },
"S/N: ",
React.createElement("strong", null, (asset === null || asset === void 0 ? void 0 : asset.serial) || "—")),
React.createElement("div", { style: { fontSize: 11, color: "#333", lineHeight: 1.4 } },
reportNum,
" \u00B7 ",
dateStr),
React.createElement("div", { style: { fontSize: 10.5, color: "#666" } }, norm),
nextDueStr && React.createElement("div", { style: { fontSize: 11, color: "#0F172A", lineHeight: 1.4, marginTop: 2 } },
React.createElement("strong", null,
nextLabel,
":"),
" ",
nextDueStr),
React.createElement("div", { style: { display: "inline-block", alignSelf: "flex-start", fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 5, marginTop: 5,
background: esitoOk ? "#16a34a" : "#dc2626", color: "#fff", letterSpacing: .5 } }, esito)))))),
React.createElement("div", { style: { fontSize: 11.5, color: "var(--text-3)", lineHeight: 1.5, background: "#1e2a3a44", borderRadius: 8, padding: "10px 12px", marginBottom: 16 } }, isAssetSticker
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
React.createElement("span", { style: { fontSize: 12.5, color: "var(--text-2)", fontWeight: 600 } }, "Formato:"),
[25, 24, 18, 12].map(wmm => (React.createElement("button", { key: wmm, type: "button", onClick: () => setTapeW(wmm), style: { background: tapeW === wmm ? "#2dd4bf22" : "var(--surface)", border: "1px solid " + (tapeW === wmm ? "#2dd4bf" : "var(--border)"), color: tapeW === wmm ? "#2dd4bf" : "var(--text-2)", borderRadius: 7, padding: "7px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } },
(wmm === 25 ? "50\u00D725" : (wmm + " mm")))))),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", lineHeight: 1.5, marginBottom: 14 } },
"Stampa \u2192 scegli la stampante. Per le etichette PP 50\u00D725 (Zebra) seleziona il formato ",
React.createElement("b", null, "50\u00D725"),
" e imposta nella stampante il supporto 50\u00D725 mm. Fai una prova: se non \u00E8 centrata, si calibra."),
(isAssetSticker && custAssets.length > 1) ? React.createElement("button", { type: "button", onClick: doPrintBatch, style: { width: "100%", background: "#2dd4bf18", border: "1px solid #2dd4bf", color: "#2dd4bf", borderRadius: 9, padding: "11px 14px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", marginBottom: 12, touchAction: "manipulation" } }, "\uD83C\uDFF7 Stampa etichette di TUTTI gli apparecchi di " + ((customer && customer.name) || "questo cliente") + " (" + custAssets.length + ")") : null,
React.createElement("div", { style: FORM_FOOTER },
React.createElement("button", { onClick: onClose, style: FORM_BTN_GHOST }, "Chiudi"),
React.createElement("button", { onClick: doPrint, style: FORM_BTN_PRIMARY }, "\uD83D\uDDA8 Stampa sticker"))));
}
function TemplateEditor({ initial, existingTemplates, onSave, onClose }) {
const [tpl, setTpl] = React.useState(() => initial ? JSON.parse(JSON.stringify(initial)) : blankTemplate());
const [errors, setErrors] = React.useState({});
const setField = (k, v) => setTpl(t => (Object.assign(Object.assign({}, t), { [k]: v })));
const addSection = () => setTpl(t => (Object.assign(Object.assign({}, t), { sections: [...t.sections, { id: "sez" + Date.now(), title: "", items: [], measures: [] }] })));
const removeSection = (si) => setTpl(t => (Object.assign(Object.assign({}, t), { sections: t.sections.filter((_, i) => i !== si) })));
const setSectionField = (si, k, v) => setTpl(t => {
const sections = [...t.sections];
sections[si] = Object.assign(Object.assign({}, sections[si]), { [k]: v });
return Object.assign(Object.assign({}, t), { sections });
});
const addItem = (si) => setTpl(t => {
const sections = [...t.sections];
sections[si] = Object.assign(Object.assign({}, sections[si]), { items: [...(sections[si].items || []), { id: "item" + Date.now(), text: "" }] });
return Object.assign(Object.assign({}, t), { sections });
});
const removeItem = (si, ii) => setTpl(t => {
const sections = [...t.sections];
sections[si] = Object.assign(Object.assign({}, sections[si]), { items: sections[si].items.filter((_, i) => i !== ii) });
return Object.assign(Object.assign({}, t), { sections });
});
const setItemText = (si, ii, v) => setTpl(t => {
const sections = [...t.sections];
const items = [...sections[si].items];
items[ii] = Object.assign(Object.assign({}, items[ii]), { text: v });
sections[si] = Object.assign(Object.assign({}, sections[si]), { items });
return Object.assign(Object.assign({}, t), { sections });
});
const addMeasure = (si) => setTpl(t => {
const sections = [...t.sections];
sections[si] = Object.assign(Object.assign({}, sections[si]), { measures: [...(sections[si].measures || []), { id: "meas" + Date.now(), name: "", unit: "", expected: "", limitMin: "", limitVal: "", value: "" }] });
return Object.assign(Object.assign({}, t), { sections });
});
const removeMeasure = (si, mi) => setTpl(t => {
const sections = [...t.sections];
sections[si] = Object.assign(Object.assign({}, sections[si]), { measures: sections[si].measures.filter((_, i) => i !== mi) });
return Object.assign(Object.assign({}, t), { sections });
});
const setMeasureField = (si, mi, k, v) => setTpl(t => {
const sections = [...t.sections];
const measures = [...sections[si].measures];
measures[mi] = Object.assign(Object.assign({}, measures[mi]), { [k]: v });
sections[si] = Object.assign(Object.assign({}, sections[si]), { measures });
return Object.assign(Object.assign({}, t), { sections });
});
const handleSave = () => {
var _a;
const errs = {};
if (!((_a = tpl.label) === null || _a === void 0 ? void 0 : _a.trim()))
errs.label = "Il nome del template è obbligatorio";
if (!tpl.sections.length)
errs.sections = "Aggiungi almeno una sezione";
tpl.sections.forEach((s, i) => {
var _a;
if (!((_a = s.title) === null || _a === void 0 ? void 0 : _a.trim()))
errs["sec" + i] = "La sezione " + (i + 1) + " non ha titolo";
const hasContent = (s.items || []).some(it => { var _a; return (_a = it.text) === null || _a === void 0 ? void 0 : _a.trim(); }) || (s.measures || []).some(m => { var _a; return (_a = m.name) === null || _a === void 0 ? void 0 : _a.trim(); });
if (!hasContent)
errs["secempty" + i] = "La sezione " + (s.title || (i + 1)) + " è vuota (aggiungi controlli o misure)";
});
const dupe = Object.values(existingTemplates || {}).find(x => { var _a, _b; return ((_a = x.label) === null || _a === void 0 ? void 0 : _a.toLowerCase().trim()) === ((_b = tpl.label) === null || _b === void 0 ? void 0 : _b.toLowerCase().trim()) && x.id !== tpl.id; });
if (dupe)
errs.label = "Esiste già un template con questo nome";
setErrors(errs);
if (Object.keys(errs).length)
return;
const clean = Object.assign(Object.assign({}, tpl), { sections: tpl.sections.map(s => (Object.assign(Object.assign({}, s), { items: (s.items || []).filter(it => { var _a; return (_a = it.text) === null || _a === void 0 ? void 0 : _a.trim(); }), measures: (s.measures || []).map(m => (Object.assign(Object.assign({}, m), { limitMin: m.limitMin === "" ? undefined : parseFloat(m.limitMin), limitVal: m.limitVal === "" ? undefined : parseFloat(m.limitVal) }))).filter(m => { var _a; return (_a = m.name) === null || _a === void 0 ? void 0 : _a.trim(); }) }))) });
onSave(clean);
};
const SEC_BOX = { background: "var(--bg-2)", border: "1px solid var(--border-2)", borderRadius: 10, padding: 14, marginBottom: 14 };
const MINI_BTN = { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text-2)", padding: "5px 10px", cursor: "pointer", fontSize: 11.5, fontWeight: 700 };
const DEL_BTN = { background: "#ef444415", border: "1px solid #ef444433", borderRadius: 6, color: "#ef4444", padding: "4px 9px", cursor: "pointer", fontSize: 12, fontWeight: 700, flexShrink: 0 };
return (React.createElement("div", null,
React.createElement(ErrorSummary, { errors: errors }),
React.createElement("div", { style: FORM_ROW },
React.createElement("div", { style: FORM_COL },
React.createElement("label", { style: FORM_LBL }, "Nome template *"),
React.createElement("input", { style: Object.assign(Object.assign({}, FORM_INP), errorBorderStyle(errors.label)), value: tpl.label, onChange: e => setField("label", e.target.value), placeholder: "es. Defibrillatore EN 62745" })),
React.createElement("div", { style: FORM_COL },
React.createElement("label", { style: FORM_LBL }, "Norma di riferimento"),
React.createElement("input", { style: FORM_INP, value: tpl.norm, onChange: e => setField("norm", e.target.value), placeholder: "es. EN 62745" }))),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginBottom: 14, lineHeight: 1.5, background: "#1e2a3a44", borderRadius: 8, padding: "10px 12px" } },
"Costruisci il template aggiungendo ",
React.createElement("strong", { style: { color: "var(--text-2)" } }, "sezioni"),
". Ogni sezione pu\u00F2 contenere",
React.createElement("strong", { style: { color: "#5eead4" } }, " controlli s\u00EC/no"),
" (ispezioni visive, funzionali) e",
React.createElement("strong", { style: { color: "#a855f7" } }, " misure numeriche"),
" (valori con limiti di accettazione)."),
tpl.sections.map((sec, si) => (React.createElement("div", { key: sec.id, style: SEC_BOX },
React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 12 } },
React.createElement("span", { style: { fontSize: 11, fontWeight: 800, color: "#2dd4bf", flexShrink: 0 } },
"SEZIONE ",
si + 1),
React.createElement("input", { style: Object.assign(Object.assign({}, FORM_INP), { padding: "8px 11px" }), value: sec.title, onChange: e => setSectionField(si, "title", e.target.value), placeholder: "Titolo sezione (es. Ispezione visiva)" }),
React.createElement("button", { onClick: () => removeSection(si), style: DEL_BTN, title: "Elimina sezione" }, "\u2715")),
React.createElement("input", { style: Object.assign(Object.assign({}, FORM_INP), { padding: "7px 11px", fontSize: 12, marginBottom: 12, fontStyle: "italic" }), value: sec.note || "", onChange: e => setSectionField(si, "note", e.target.value), placeholder: "Nota/istruzioni per questa sezione (opzionale)" }),
(sec.items || []).length > 0 && (React.createElement("div", { style: { marginBottom: 10 } },
React.createElement("div", { style: { fontSize: 10, color: "#5eead4", fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: .5 } }, "\u2713 Controlli s\u00EC / no"),
sec.items.map((it, ii) => (React.createElement("div", { key: it.id, style: { display: "flex", gap: 6, marginBottom: 6, alignItems: "center" } },
React.createElement("span", { style: { color: "var(--text-4)", fontSize: 12, flexShrink: 0 } },
ii + 1,
"."),
React.createElement("input", { style: Object.assign(Object.assign({}, FORM_INP), { padding: "7px 10px", fontSize: 13 }), value: it.text, onChange: e => setItemText(si, ii, e.target.value), placeholder: "Descrizione del controllo" }),
React.createElement("button", { onClick: () => removeItem(si, ii), style: DEL_BTN, title: "Rimuovi" }, "\u2715")))))),
(sec.measures || []).length > 0 && (React.createElement("div", { style: { marginBottom: 10 } },
React.createElement("div", { style: { fontSize: 10, color: "#a855f7", fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: .5 } }, "\u00B1 Misure numeriche"),
sec.measures.map((m, mi) => (React.createElement("div", { key: m.id, style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 10, marginBottom: 8 } },
React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 7, alignItems: "center" } },
React.createElement("input", { style: Object.assign(Object.assign({}, FORM_INP), { padding: "7px 10px", fontSize: 13 }), value: m.name, onChange: e => setMeasureField(si, mi, "name", e.target.value), placeholder: "Nome misura (es. Energia erogata)" }),
React.createElement("button", { onClick: () => removeMeasure(si, mi), style: DEL_BTN, title: "Rimuovi" }, "\u2715")),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(90px,1fr))", gap: 6 } },
React.createElement("input", { style: Object.assign(Object.assign({}, FORM_INP), { padding: "6px 9px", fontSize: 12 }), value: m.unit, onChange: e => setMeasureField(si, mi, "unit", e.target.value), placeholder: "Unit\u00E0 (J, V, \u00B5A)" }),
React.createElement("input", { style: Object.assign(Object.assign({}, FORM_INP), { padding: "6px 9px", fontSize: 12 }), value: m.expected, onChange: e => setMeasureField(si, mi, "expected", e.target.value), placeholder: "Atteso (testo)" }),
React.createElement("input", { style: Object.assign(Object.assign({}, FORM_INP), { padding: "6px 9px", fontSize: 12 }), type: "number", value: m.limitMin, onChange: e => setMeasureField(si, mi, "limitMin", e.target.value), placeholder: "Min" }),
React.createElement("input", { style: Object.assign(Object.assign({}, FORM_INP), { padding: "6px 9px", fontSize: 12 }), type: "number", value: m.limitVal, onChange: e => setMeasureField(si, mi, "limitVal", e.target.value), placeholder: "Max" }))))))),
React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 10 } },
React.createElement("button", { onClick: () => addItem(si), style: Object.assign(Object.assign({}, MINI_BTN), { color: "#5eead4", borderColor: "#2dd4bf33" }) }, "+ Controllo s\u00EC/no"),
React.createElement("button", { onClick: () => addMeasure(si), style: Object.assign(Object.assign({}, MINI_BTN), { color: "#a855f7", borderColor: "#a855f733" }) }, "+ Misura numerica"))))),
React.createElement("button", { onClick: addSection, style: Object.assign(Object.assign({}, FORM_BTN_GHOST), { width: "100%", marginBottom: 8, borderStyle: "dashed" }) }, "+ Aggiungi sezione"),
React.createElement("div", { style: FORM_FOOTER },
React.createElement("button", { onClick: onClose, style: FORM_BTN_GHOST }, "Annulla"),
React.createElement("button", { onClick: handleSave, style: FORM_BTN_PRIMARY }, initial ? "Salva modifiche" : "Crea template"))));
}
function RichiestePage({ richieste, assets, customers, onConvert, onRefresh, online }) {
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
function AppMain() {
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
const SECTION_ALIAS = { scadenze: "agenda", help: "procedures", ricognizione: "assets", scheda: "assets" };
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
{ id: "procedures", label: "Aiuto & Procedure", icon: "›" },
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
group.label && (React.createElement("div", { style: { padding: "8px 12px 4px", fontSize: 9, color: "var(--text-4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 } }, group.label)),
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
React.createElement("span", { style: { fontSize: 15, minWidth: 20, textAlign: "center", color: active ? "#2dd4bf" : "var(--text-3)" } }, n.icon),
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
group.label && (React.createElement("div", { style: { padding: "8px 12px 4px", fontSize: 9, color: "var(--text-4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 } }, group.label)),
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
fontSize: 12.5,
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
React.createElement("button", { onClick: () => { if (window.__mtToggle) window.__mtToggle(); }, title: "Tema chiaro / scuro", style: { background: "none", border: "none", color: "var(--text-3)", fontSize: 15, cursor: "pointer", padding: 0, lineHeight: 1 } }, "◐"), React.createElement("button", { onClick: () => setModal({ type: "settings" }), onMouseEnter: e => e.currentTarget.style.color = "#2dd4bf", onMouseLeave: e => e.currentTarget.style.color = "var(--text-3)", style: { background: "none", border: "none", color: "var(--text-3)", fontSize: 14, cursor: "pointer", transition: "color .15s" } }, "\u2699 Impostazioni"))))),
isMobile ? React.createElement("div", { style: { position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 90, display: "flex", background: "var(--card)", borderTop: "1px solid var(--border)", boxShadow: "0 -4px 24px rgba(0,0,0,.45)", paddingBottom: "env(safe-area-inset-bottom)" } }, BOTTOM_NAV.concat([{ id: "__altro", label: "Altro", paths: ["M4 7h16", "M4 12h16", "M4 17h16"] }]).map(it => {
const active = it.id === "__altro" ? navOpen : tab === it.id;
return React.createElement("button", { key: it.id, onClick: () => { if (it.id === "__altro") { setNavOpen(true); } else { setTab(it.id); setSearch(""); setNavOpen(false); } }, style: { flex: 1, background: "transparent", border: "none", cursor: "pointer", padding: "9px 2px 7px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: active ? "#2dd4bf" : "var(--text-3)", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", position: "relative" } }, (active && it.id !== "__altro") ? React.createElement("span", { style: { position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 26, height: 3, borderRadius: "0 0 3px 3px", background: "#2dd4bf" } }) : null, __bnIcon(it.paths), React.createElement("div", { style: { fontSize: 9.5, fontWeight: active ? 700 : 500, letterSpacing: 0.1, whiteSpace: "nowrap" } }, it.label));
})) : null,
isMobile ? React.createElement("div", { style: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 80, background: "var(--card)", borderBottom: "1px solid var(--border)", boxShadow: "0 2px 12px rgba(0,0,0,.25)", paddingTop: "env(safe-area-inset-top)" } },
React.createElement("div", { style: { height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px" } },
React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
React.createElement("svg", { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "#2dd4bf", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M2 12h4l2-6 4 12 2-6h6" })),
React.createElement("span", { style: { fontWeight: 800, fontSize: 15.5, color: "var(--text)", letterSpacing: -.3 } }, "MedTrace")),
React.createElement("button", { onClick: () => setScanOpen(true), title: "Scansiona QR apparecchio", style: { background: "var(--acc-teal)", color: "#04211d", border: "none", borderRadius: 10, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 } },
React.createElement("svg", { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" }), React.createElement("circle", { cx: 12, cy: 13, r: 3 }))))) : null,
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
isMobile && (ptrPull > 0 || ptrRefreshing) && (React.createElement("div", { style: { position: "fixed", top: 8, left: "50%", transform: `translateX(-50%) translateY(${Math.min(ptrPull, 50) - 50}px)`, zIndex: 500, background: "var(--bg)", border: "1px solid #2dd4bf66", borderRadius: 24, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 14px #000a", opacity: ptrRefreshing ? 1 : Math.min(ptrPull / 60, 1), transition: ptrRefreshing ? "none" : "transform .15s" } },
React.createElement("span", { style: { display: "inline-block", width: 14, height: 14, border: "2px solid var(--border-4)", borderTopColor: "#2dd4bf", borderRadius: "50%", animation: ptrRefreshing ? "ptr-spin .6s linear infinite" : "none", transform: ptrRefreshing ? "none" : `rotate(${ptrPull * 4}deg)` } }),
React.createElement("span", { style: { fontSize: 12, color: "#2dd4bf", fontWeight: 700 } }, ptrRefreshing ? "Aggiornamento…" : ptrPull > 60 ? "Rilascia per aggiornare" : "Tira per aggiornare"))),
React.createElement("style", null, `@keyframes ptr-spin { to { transform: rotate(360deg); } }`),
isMobile && (React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, background: "var(--bg-deep)", borderRadius: 12, padding: "10px 12px", border: "1px solid var(--border)", gap: 8 } },
React.createElement("div", { style: { width: 32, flexShrink: 0 } }),
React.createElement("div", { style: { flex: 1, textAlign: "center", minWidth: 0 } },
company.name && React.createElement("div", { style: { fontSize: 9, color: "#2dd4bf", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, company.name),
React.createElement("div", { style: { fontSize: 15, fontWeight: 900, color: "var(--text-bright)", textTransform: "uppercase", letterSpacing: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, tab === "scheda" ? (((assets.find(a => a.id === schedaId) || {}).assetCode) || "Apparecchio") : (((_a = NAV.find(n => n.id === tab)) === null || _a === void 0 ? void 0 : _a.label) || "MedTrace"))),
React.createElement("button", { onClick: () => setModal({ type: "settings" }), style: { background: "none", border: "none", color: "var(--text-3)", fontSize: 20, cursor: "pointer", padding: "4px 8px", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } }, "\u2699"))),
tab === "scheda" && (function () {
var schedaAsset = assets.find(function (x) { return x.id === schedaId; });
if (!schedaAsset) return React.createElement("div", { style: { maxWidth: 700, margin: "40px auto", textAlign: "center", color: "var(--text-3)" } },
React.createElement("div", { style: { fontSize: 15, fontWeight: 700, marginBottom: 8 } }, "Apparecchio non trovato"),
React.createElement("button", { onClick: function () { setTab("assets"); }, style: { background: "#2dd4bf", color: "#04201c", border: "none", borderRadius: 8, padding: "9px 18px", fontWeight: 700, cursor: "pointer" } }, "Vai agli apparecchi"));
return React.createElement("div", { style: { maxWidth: 1100, margin: "0 auto" } },
React.createElement("button", { onClick: function () { try { window.history.back(); } catch (e) { setTab("assets"); } }, style: { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-2)", padding: "7px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600, marginBottom: 14, display: "inline-flex", alignItems: "center", gap: 6, touchAction: "manipulation" } }, "\u2190 Indietro"),
React.createElement(AssetDetailModal, { asset: schedaAsset, page: true, recalls: recalls, jobs: jobs, parts: parts, iecReports: iecReports, funcReports: funcReports, customers: customers, company: company, templates: allTemplates, generateIECPDF: generateIECPDF, generateFuncPDF: generateFuncPDF, onClose: function () { try { window.history.back(); } catch (e) { setTab("assets"); } }, onEditAsset: function () { pushModal({ type: "asset", data: schedaAsset }); }, onNewJob: function () { pushModal({ type: "job", data: { assetId: schedaAsset.id, type: "correttiva", priority: "normale", status: "aperto", description: "", openDate: new Date().toISOString().slice(0, 10), parts: [], laborHours: 0, laborRate: 55, notes: "", timeline: [], photos: [] } }); }, onNewIec: function () { pushModal({ type: "iec", assetId: schedaAsset.id, data: null }); }, onNewFunc: function () { pushModal({ type: "func", assetId: schedaAsset.id, data: null }); }, onAssetSticker: function () { pushModal({ type: "sticker", data: {}, kind: "asset", assetId: schedaAsset.id }); }, onOpenJob: function (j) { pushModal({ type: "job", data: j }); }, onOpenIec: function (r) { pushModal({ type: "iec", data: r }); }, onOpenFunc: function (r) { pushModal({ type: "func", data: r }); }, onOpenRecall: openRecall, onQuickLocation: function (loc) { var _now = new Date().toISOString(); var rec = withUpdateMeta(Object.assign(Object.assign({}, schedaAsset), { lastLocation: loc, lastLocationDate: _now, lastSeenAt: _now })); setAssets(function (a) { return upsertInList(a, rec); }); showToast("\uD83D\uDCCD Posizione rilevata", "#2dd4bf"); }, onAddDoc: function (att) { var rec = withUpdateMeta(Object.assign(Object.assign({}, schedaAsset), { documents: (schedaAsset.documents || []).concat([att]) })); setAssets(function (a) { return upsertInList(a, rec); }); }, onDeleteDoc: function (id) { var rec = withUpdateMeta(Object.assign(Object.assign({}, schedaAsset), { documents: (schedaAsset.documents || []).filter(function (d) { return d.id !== id; }) })); setAssets(function (a) { return upsertInList(a, rec); }); }, showToast: showToast }));
})(),
tab === "dashboard" && (React.createElement("div", null,
!isMobile && React.createElement("h1", { style: { margin: "0 0 20px", fontSize: 20, fontWeight: 900 } }, "Dashboard"),
isEmpty ? (React.createElement("div", { style: { maxWidth: 520, margin: "20px auto" } },
React.createElement("div", { style: { textAlign: "center", marginBottom: 24 } },
React.createElement("div", { style: { fontSize: 22, fontWeight: 900, color: "var(--text-bright)", marginBottom: 6 } }, "Benvenuto" + (company.name ? " in " + company.name : " in MedTrace")),
React.createElement("div", { style: { fontSize: 13, color: "var(--text-2)", lineHeight: 1.5 } }, "Tre passi per iniziare. Bastano un paio di minuti.")),
[
{ n: 1, t: "Aggiungi un cliente", d: "La struttura o lo studio dove si trovano gli apparecchi.", show: isAdmin, btn: "+ Nuovo cliente", go: () => { setTab("customers"); setModal({ type: "customer", data: null }); } },
{ n: 2, t: "Registra un apparecchio", d: "Il dispositivo da gestire: nome, marca, numero di serie.", show: true, btn: "+ Nuovo apparecchio", go: () => { setTab("assets"); setModal({ type: "asset", data: null }); } },
{ n: 3, t: "Esegui la prima verifica", d: "Sicurezza elettrica o funzionale, dalla scheda dell'apparecchio.", show: true, btn: "Vai agli apparecchi", go: () => setTab("assets") },
].filter(s => s.show).map(s => (React.createElement("div", { key: s.n, style: { display: "flex", gap: 14, alignItems: "center", background: "var(--surface)", border: "1px solid #24242F", borderRadius: 12, padding: "14px 16px", marginBottom: 10 } },
React.createElement("div", { style: { width: 32, height: 32, borderRadius: "50%", background: "#2dd4bf22", border: "1px solid #2dd4bf55", color: "#5eead4", fontWeight: 900, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, s.n),
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { fontSize: 14, fontWeight: 800, color: "var(--text)" } }, s.t),
React.createElement("div", { style: { fontSize: 11.5, color: "var(--text-3)", lineHeight: 1.4 } }, s.d)),
React.createElement("button", { onClick: s.go, style: { background: "#2dd4bf", color: "#0a0a0e", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12.5, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 } }, s.btn)))),
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
React.createElement("span", { style: { fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "'Space Grotesk', sans-serif" } }, row.v)))))),
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
React.createElement("div", { style: { fontSize: 9, color: "var(--text-4)", fontFamily: "'IBM Plex Mono', monospace" } }, a.nextService))));
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
React.createElement("div", { style: { fontSize: 11.5, color: "var(--text-3)", marginTop: 2 } }, "Scansiona gli apparecchi di un reparto: aggiorna la posizione e gestisci le scadenze sul posto.")),
React.createElement("div", { style: { background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 10, padding: 12, marginBottom: 10 } },
React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", fontWeight: 700, marginBottom: 6 } }, "REPARTO"),
React.createElement("input", { value: reconWard, onChange: e => setReconWard(e.target.value), list: "recon-wards", placeholder: "es. Cardiologia", style: { width: "100%", boxSizing: "border-box", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "10px 12px", fontSize: 14 } }),
React.createElement("datalist", { id: "recon-wards" }, (reconWards || []).map(w => React.createElement("option", { key: w, value: w }))),
React.createElement("div", { style: { fontSize: 10, color: "var(--text-4)", marginTop: 6 } }, "Pi\u00f9 avanti: un tag-reparto imposter\u00e0 il reparto in automatico alla scansione.")),
React.createElement("div", { style: { background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 10, padding: 12, marginBottom: 10 } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 } },
React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", fontWeight: 700 } }, "EPC SCANSIONATI"),
React.createElement("div", { style: { display: "flex", gap: 6 } },
React.createElement("button", { onClick: reconToggleListen, style: { background: reconListening ? "#2dd4bf" : "transparent", border: "1px solid " + (reconListening ? "#2dd4bf" : "var(--border)"), borderRadius: 6, color: reconListening ? "#04201c" : "#2dd4bf", padding: "3px 8px", fontSize: 10.5, cursor: "pointer", fontWeight: 700 } }, reconListening ? ("\u25a0 Termina (" + reconLive + ")") : "\u25b6 Ascolto lettore"),
React.createElement("button", { onClick: reconSimulate, style: { background: "transparent", border: "1px solid var(--border)", borderRadius: 6, color: "#2dd4bf", padding: "3px 8px", fontSize: 10.5, cursor: "pointer", fontWeight: 700 } }, "Simula scansione"))),
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
(reconResult.applied ? React.createElement("div", { style: { background: "var(--ok-bg)", border: "1px solid #22c55e55", borderRadius: 8, color: "#4ade80", padding: "9px 12px", fontSize: 12.5, fontWeight: 700, marginBottom: 10 } }, "\u2713 Posizione aggiornata: " + reconResult.applied + (DEMO_LOCKED ? " (demo: non salvato)" : "")) : (reconResult.found.length > 0 ? React.createElement("div", { style: { background: "#3a2a10", border: "1px solid #f59e0b44", borderRadius: 8, color: "#fbbf24", padding: "9px 12px", fontSize: 12, marginBottom: 10 } }, "Imposta un reparto e ri-scansiona per aggiornare la posizione") : null)),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, reconResult.found.map(f => React.createElement("div", { key: f.asset.id, onClick: () => openAsset(f.asset.id), style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--surface)", border: "1px solid " + (f.status === "scaduta" ? "#ef444455" : f.status === "scadenza" ? "#f59e0b44" : "var(--border-2)"), borderRadius: 8, cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { fontSize: 13.5, fontWeight: 700, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, f.asset.name || f.asset.assetCode || f.asset.id),
React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, (f.asset.brand || "") + (f.asset.model ? (" " + f.asset.model) : "") + (f.asset.lastLocation ? (" \u00b7 " + f.asset.lastLocation) : ""))),
f.status !== "ok" && React.createElement("span", { style: { fontSize: 10, fontWeight: 800, color: f.status === "scaduta" ? "#ef4444" : "#f59e0b", background: (f.status === "scaduta" ? "#ef4444" : "#f59e0b") + "18", padding: "3px 7px", borderRadius: 5, whiteSpace: "nowrap" } }, f.status === "scaduta" ? ("scaduta " + Math.abs(f.days) + "g") : ("scade " + f.days + "g")),
React.createElement("span", { style: { color: "var(--text-4)", fontSize: 16 } }, "\u203a")))),
reconResult.missing && reconResult.missing.length > 0 && React.createElement("div", { style: { marginTop: 10, padding: "10px 12px", background: "var(--bg)", border: "1px dashed #ef444455", borderRadius: 8 } },
React.createElement("div", { style: { fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 2 } }, "NON TROVATI QUI (" + reconResult.missing.length + ")"),
React.createElement("div", { style: { fontSize: 10, color: "var(--text-4)", marginBottom: 6 } }, "Risultavano in questo reparto e non sono stati letti nel giro."),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 4 } }, reconResult.missing.map(a => React.createElement("div", { key: a.id, onClick: () => openAsset(a.id), style: { display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 6, cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, a.name || a.assetCode || a.id),
React.createElement("div", { style: { fontSize: 10.5, color: "var(--text-3)" } }, a.lastLocationDate ? ("ultima lettura: " + fmtDateTimeIt(a.lastLocationDate)) : "mai letto")),
React.createElement("span", { style: { color: "var(--text-4)", fontSize: 16 } }, "\u203a"))))),
reconResult.unknown.length > 0 && React.createElement("div", { style: { marginTop: 10, padding: "10px 12px", background: "var(--bg)", border: "1px dashed #f59e0b44", borderRadius: 8 } },
React.createElement("div", { style: { fontSize: 11, color: "#f59e0b", fontWeight: 700, marginBottom: 4 } }, "EPC sconosciuti (" + reconResult.unknown.length + ")"),
React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, reconResult.unknown.map(e => React.createElement("span", { key: e, onClick: () => setAssocEpc(assocEpc === e ? null : e), style: { fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: assocEpc === e ? "#04201c" : "var(--text-2)", background: assocEpc === e ? "#f59e0b" : "var(--surface)", border: "1px solid " + (assocEpc === e ? "#f59e0b" : "var(--border)"), borderRadius: 6, padding: "4px 8px", cursor: "pointer", wordBreak: "break-all", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } }, e))),
assocEpc && reconResult.unknown.indexOf(assocEpc) !== -1 && React.createElement(RfidAssocPicker, { epc: assocEpc, assets: assets, onAssign: reconAssign, onClose: () => setAssocEpc(null), wards: reconWards, onAssignWard: reconAssignWard }),
React.createElement("div", { style: { fontSize: 10, color: "var(--text-4)", marginTop: 4 } }, "Tag non associati. Tocca un EPC per associarlo a un apparecchio.")))),
reconByWard.length > 0 && (React.createElement("div", { style: { background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 10, padding: 12 } },
React.createElement("div", { style: { fontSize: 11, color: "var(--text-2)", fontWeight: 700, marginBottom: 8 } }, "REPARTI SCANSIONATI"),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, reconByWard.map(r => React.createElement("div", { key: r.ward, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "var(--surface)", borderRadius: 6 } },
React.createElement("div", null, React.createElement("span", { style: { fontSize: 13, color: "var(--text)", fontWeight: 600 } }, r.ward), r.last ? React.createElement("span", { style: { fontSize: 10.5, color: "var(--text-3)", marginLeft: 8 } }, fmtDateTimeIt(r.last)) : null),
React.createElement("span", { style: { fontSize: 12, color: "#2dd4bf", fontWeight: 700 } }, r.count)))),
React.createElement("div", { style: { fontSize: 10, color: "var(--text-4)", marginTop: 8 } }, "Calcolato dall'ultima posizione di ogni apparecchio. Nessun dato aggiuntivo salvato."))))),
tab === "assets" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: isMobile ? 14 : 18, fontWeight: 900, display: isMobile ? "none" : "block" } }, "Apparecchi Medicali"),
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
React.createElement("span", { style: { color: "var(--text-strong)", fontSize: 12.5, overflow: "hidden", textOverflow: "ellipsis" } }, displayName)),
React.createElement("div", { style: { color: "var(--text-3)", fontSize: 10.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, [a.serial && ("S/N " + a.serial), brandModel, a.location].filter(Boolean).join(" · ") || "—")),
days !== null && React.createElement(AlertChip, { days: days })));
}
return (React.createElement(SwipeableCard, { key: a.id, onDelete: () => delAsset(a.id) },
React.createElement("div", { style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 12, overflow: "hidden" } },
React.createElement("div", { onClick: () => openAsset(a.id), style: { padding: "12px 14px 10px", cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", borderBottom: "1px solid var(--border-2)" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 5 } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" } },
React.createElement("strong", { style: { color: "#5eead4", fontSize: 16, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: .5, lineHeight: 1.2 } }, a.assetCode || a.id),
a.serial && React.createElement("span", { style: { fontSize: 11.5, color: "var(--text-2)", fontFamily: "'IBM Plex Mono', monospace" } },
"S/N ",
a.serial),
assetHasOpenRecall(a.id, recalls) && React.createElement("span", { onClick: function (e) { e.stopPropagation(); var rc = assetOpenRecall(a.id, recalls); if (rc) openRecall(rc.id); }, title: "Apri avviso di sicurezza", style: { fontSize: 10.5, color: "#fca5a5", background: "#3a1212", border: "1px solid #ef444466", borderRadius: 5, padding: "1px 6px", fontWeight: 700, cursor: "pointer" } }, "⚠ avviso")),
React.createElement("div", { style: { color: "var(--text)", fontSize: 13, marginTop: 3, wordBreak: "break-word", lineHeight: 1.3 } }, displayName)),
React.createElement(Badge, { text: a.status, color: statusColor })),
brandModel && React.createElement("div", { style: { fontSize: 11.5, color: "var(--text-2)", marginBottom: 3 } }, brandModel),
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
React.createElement("button", { onClick: () => openAsset(row.id), title: "Scheda apparecchio", style: { background: "var(--surface-3)", border: "1px solid var(--border)", borderRadius: 5, color: "var(--text-2)", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, "\uD83D\uDCCB"),
React.createElement("button", { onClick: () => setModal({ type: "iec", assetId: row.id, data: null }), title: "Verifica di Sicurezza Elettrica", style: { background: "var(--surface-3)", border: "1px solid var(--border)", borderRadius: 5, color: "#5eead4", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, "\u26A1"),
React.createElement("button", { onClick: () => setModal({ type: "func", assetId: row.id, data: null }), title: "Verifica funzionale", style: { background: "var(--surface-3)", border: "1px solid var(--border)", borderRadius: 5, color: "#a855f7", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, "\u2713"))) })))),
tab === "jobs" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900, display: isMobile ? "none" : "block" } }, "Job / Interventi"),
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
React.createElement("button", { onClick: () => setModal({ type: "timeline", data: jobs.find(j => j.id === row.id) }), title: "Timeline interventi", style: { background: "var(--surface-3)", border: "1px solid var(--border)", borderRadius: 5, color: "var(--text-2)", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, "\uD83D\uDD52"),
React.createElement("button", { onClick: () => generateJobPDF(jobs.find(j => j.id === row.id), assets, parts, customers, company), title: "PDF rapporto", style: { background: "var(--surface-3)", border: "1px solid var(--border)", borderRadius: 5, color: "var(--text-2)", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, "\uD83D\uDCC4"))) })))),
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
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900, display: isMobile ? "none" : "block" } }, "Stock Parti"),
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
React.createElement("span", { style: { padding: "2px 8px", background: borderC + "22", color: borderC, borderRadius: 5, fontSize: 13, fontWeight: 800, whiteSpace: "nowrap", fontFamily: "'IBM Plex Mono', monospace" } }, p.qty)),
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
], rows: parts.map(p => (Object.assign(Object.assign({}, p), { sellPrice: p.sellPrice || p.unitPrice, margine: ((p.sellPrice || p.unitPrice) - p.unitPrice).toFixed(2), valoreStock: (p.qty * p.unitPrice).toFixed(2) }))), onEdit: row => setModal({ type: "part", data: parts.find(p => p.id === row.id) }), onDelete: id => delPart(id), actions: row => (React.createElement("button", { onClick: () => duplicatePart(parts.find(p => p.id === row.id)), title: "Duplica parte", style: { background: "var(--surface-3)", border: "1px solid var(--border)", borderRadius: 5, color: "var(--text-2)", padding: "3px 7px", cursor: "pointer", fontSize: 11, fontWeight: 700 } }, "\u2398")) })))),
tab === "customers" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900, display: isMobile ? "none" : "block" } }, "Clienti"),
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
nApp > 0 && React.createElement("span", { style: { padding: "2px 8px", background: "#2dd4bf22", color: "#2dd4bf", borderRadius: 5, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" } },
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
React.createElement("button", { onClick: () => setModal({ type: "clientReport", data: customers.find(c => c.id === row.id) }), title: "Report parco macchine", style: { background: "#2dd4bf15", border: "1px solid #2dd4bf33", borderRadius: 5, color: "#5eead4", padding: "3px 7px", cursor: "pointer", fontSize: 11, fontWeight: 700, marginRight: 2 } }, "\uD83D\uDCCB"),
React.createElement("button", { onClick: () => duplicateCustomer(customers.find(c => c.id === row.id)), title: "Duplica cliente", style: { background: "var(--surface-3)", border: "1px solid var(--border)", borderRadius: 5, color: "var(--text-2)", padding: "3px 7px", cursor: "pointer", fontSize: 11, fontWeight: 700 } }, "\u2398"))) })))),
tab === "invoices" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900, display: isMobile ? "none" : "block" } }, "Preventivi"),
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
React.createElement("span", { style: { fontSize: 16, color: "#22c55e", fontWeight: 900, fontFamily: "'IBM Plex Mono', monospace" } },
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
React.createElement("button", { onClick: () => generateInvoicePDF(inv, cust, jobs, assets, parts, company), title: "PDF", style: { background: "var(--surface-3)", border: "1px solid var(--border)", borderRadius: 5, color: "var(--text-2)", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }),
(inv === null || inv === void 0 ? void 0 : inv.status) !== "pagata" && (inv === null || inv === void 0 ? void 0 : inv.status) !== "annullato" && React.createElement("button", { onClick: () => markInvoicePaid(inv), title: "Segna pagata", style: { background: "#22c55e15", border: "1px solid #22c55e33", borderRadius: 5, color: "#22c55e", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, "\u2713")));
} })))),
tab === "calendar" && (React.createElement("div", null,
React.createElement("h1", { style: { margin: "0 0 16px", fontSize: 18, fontWeight: 900 } }, "Calendario Manutenzioni"),
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
], rows: assets.filter(a => a.nextService).map(a => { var _a; return (Object.assign(Object.assign({}, a), { cliente: ((_a = customers.find(c => c.id === a.customerId)) === null || _a === void 0 ? void 0 : _a.name) || "", daysToService: Math.round((new Date(a.nextService) - new Date()) / 86400000) })); }), actions: row => (React.createElement("button", { onClick: () => setModal({ type: "job", data: { assetId: row.id, type: "preventiva", priority: "normale", status: "aperto", description: "Manutenzione programmata", openDate: new Date().toISOString().slice(0, 10), parts: [], laborHours: 0, laborRate: 55, notes: "", timeline: [], photos: [] } }), style: { background: "#2dd4bf15", border: "1px solid #2563eb33", borderRadius: 5, color: "#5eead4", padding: "3px 8px", cursor: "pointer", fontSize: 11, whiteSpace: "nowrap" } }, "+ Job")) }))),
tab === "finance" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", { style: { fontSize: 18, fontWeight: 900 } }, "Analytics & Report"),
React.createElement("div", { style: { display: "flex", gap: 6 } },
React.createElement("select", { value: filterYear, onChange: e => setFilterYear(e.target.value), style: { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 7, padding: "6px 11px", color: "var(--text)", fontSize: 12 } }, [new Date().getFullYear() - 2, new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1].map(y => React.createElement("option", { key: y, value: y }, y))),
React.createElement("select", { value: filterMonth, onChange: e => setFilterMonth(e.target.value), style: { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 7, padding: "6px 11px", color: "var(--text)", fontSize: 12 } },
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
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900, display: isMobile ? "none" : "block" } }, " Verifiche Funzionali"),
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
React.createElement("span", { style: { padding: "2px 8px", background: badgeC + "22", color: badgeC, borderRadius: 5, fontSize: 11, fontWeight: 800, whiteSpace: "nowrap" } }, badgeLabel)),
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
{ key: "jobId", label: "Intervento", render: v => v ? React.createElement("span", { title: "Questa verifica \u00E8 registrata anche come intervento nello storico/agenda", style: { fontSize: 11, color: "#5eead4", background: "#2dd4bf15", border: "1px solid #2dd4bf33", borderRadius: 5, padding: "2px 8px", fontWeight: 700, whiteSpace: "nowrap" } }, "\u2713 in agenda") : React.createElement("span", { style: { color: "var(--text-4)" } }, "\u2014") },
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
React.createElement("button", { onClick: () => setModal({ type: "sticker", data: rep, kind: "func" }), title: "Sticker QR", style: { background: "#a855f715", border: "1px solid #a855f733", borderRadius: 5, color: "#c084fc", padding: "3px 7px", cursor: "pointer", fontSize: 11, marginRight: 2 } }, "\uD83C\uDFF7"),
React.createElement("button", { onClick: () => generateFuncPDF(rep, a, c, company, allTemplates), title: "PDF", style: { background: "#2dd4bf15", border: "1px solid #2563eb33", borderRadius: 5, color: "#5eead4", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, " PDF")));
} })))),
tab === "iec" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900, display: isMobile ? "none" : "block" } }, "\u26A1 Verifiche di Sicurezza Elettrica"),
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
React.createElement("div", { style: { color: "var(--text-3)", fontSize: 10.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, [a.name, r.date].filter(Boolean).join(" · ") || "—")),
React.createElement("span", { style: { padding: "2px 7px", background: badgeC + "22", color: badgeC, borderRadius: 5, fontSize: 10, fontWeight: 700, flexShrink: 0 } }, badgeLabel)));
}
return (React.createElement(SwipeableCard, { key: r.id, onDelete: () => delIecReport(r.id) },
React.createElement("div", { style: { background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 12, overflow: "hidden", borderLeft: "3px solid " + borderC } },
React.createElement("div", { onClick: () => setModal({ type: "iec", data: r }), style: { padding: "12px 14px 10px", cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", borderBottom: "1px solid var(--border-2)" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 } },
React.createElement("strong", { style: { color: "var(--text)", fontSize: 14, fontFamily: "'IBM Plex Mono', monospace", flex: 1, minWidth: 0, wordBreak: "break-word" } }, r.reportNumber || r.id),
React.createElement("span", { style: { padding: "2px 8px", background: badgeC + "22", color: badgeC, borderRadius: 5, fontSize: 11, fontWeight: 800, whiteSpace: "nowrap" } }, badgeLabel)),
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
{ key: "jobId", label: "Intervento", render: v => v ? React.createElement("span", { title: "Questa verifica \u00E8 registrata anche come intervento nello storico/agenda", style: { fontSize: 11, color: "#5eead4", background: "#2dd4bf15", border: "1px solid #2dd4bf33", borderRadius: 5, padding: "2px 8px", fontWeight: 700, whiteSpace: "nowrap" } }, "\u2713 in agenda") : React.createElement("span", { style: { color: "var(--text-4)" } }, "\u2014") },
], rows: iecReports.map(r => { const a = assets.find(x => x.id === r.assetId) || {}; const c = customers.find(x => x.id === a.customerId) || {}; return Object.assign(Object.assign({}, r), { apparecchio: a.name || r.assetId || "—", serial: a.serial || "", cliente: c.name || "" }); }), onEdit: row => setModal({ type: "iec", data: iecReports.find(r => r.id === row.id), assetId: row.assetId }), onDelete: id => delIecReport(id), actions: row => {
const rep = iecReports.find(r => r.id === row.id);
const a = assets.find(x => x.id === (rep === null || rep === void 0 ? void 0 : rep.assetId)) || {};
const c = customers.find(x => x.id === a.customerId) || {};
return (React.createElement(React.Fragment, null,
React.createElement("button", { onClick: () => setModal({ type: "sticker", data: rep, kind: "iec" }), title: "Sticker QR", style: { background: "#a855f715", border: "1px solid #a855f733", borderRadius: 5, color: "#c084fc", padding: "3px 7px", cursor: "pointer", fontSize: 11, marginRight: 2 } }, "\uD83C\uDFF7"),
React.createElement("button", { onClick: () => generateIECPDF(rep, a, c, company), title: "PDF", style: { background: "#2dd4bf15", border: "1px solid #2563eb33", borderRadius: 5, color: "#5eead4", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, " PDF")));
} })))),
tab === "schedule" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900, display: isMobile ? "none" : "block" } }, "Pianificazione Annuale"),
React.createElement("p", { style: { color: "var(--text-3)", margin: "2px 0 0", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" } }, "Attivit\u00E0 programmate per anno \u2014 basato su nextService degli apparecchi")),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement("select", { value: scheduleYear, onChange: e => setScheduleYear(+e.target.value), style: { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 7, padding: "7px 11px", color: "var(--text)", fontSize: 13 } }, [new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1, new Date().getFullYear() + 2].map(y => React.createElement("option", { key: y, value: y }, y))),
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
React.createElement("span", { style: { fontWeight: 800, fontSize: 15, color: "var(--text)" } },
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
], rows: items, actions: row => (React.createElement("button", { onClick: () => setModal({ type: "iec", data: null, assetId: row.assetId }), style: { background: "#2dd4bf15", border: "1px solid #2563eb33", borderRadius: 5, color: "#5eead4", padding: "3px 8px", cursor: "pointer", fontSize: 11, whiteSpace: "nowrap" } }, "Verifica")) })))))),
tab === "richieste" && (React.createElement(RichiestePage, { richieste: richieste, assets: assets, customers: customers, onConvert: convertRichiesta, onRefresh: loadRichieste, online: !OFFLINE_MODE })),
(tab === "procedures" || tab === "help") && (React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" } }, [["procedures", "\uD83D\uDCCB Procedure"], ["help", "❓ Guida"]].map(pair => (React.createElement("button", { key: pair[0], onClick: () => setTab(pair[0]), style: { background: tab === pair[0] ? "#2dd4bf22" : "var(--card)", border: "1px solid " + (tab === pair[0] ? "#2dd4bf" : "var(--border-2)"), borderRadius: 999, padding: "7px 16px", color: tab === pair[0] ? "#5eead4" : "var(--text-2)", fontSize: 13, fontWeight: 700, cursor: "pointer" } }, pair[1]))))),
tab === "help" && React.createElement(HelpTab, { helpOpen: helpOpen, setHelpOpen: setHelpOpen }),
tab === "instruments" && (React.createElement(InstrumentsPage, { instruments: instruments, setInstruments: setInstruments, showToast: showToast, checkLocked: checkLocked })),
tab === "procedures" && (React.createElement(ProceduresPage, { procedures: procedures, setProcedures: setProcedures, assets: assets, showToast: showToast, moveToTrash: moveToTrash })),
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
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900, display: isMobile ? "none" : "block" } }, "Ordini Fornitori"),
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
? React.createElement("button", { onClick: () => quickReceive(o), style: { background: "#22c55e15", border: "1px solid #22c55e33", borderRadius: 5, color: "#22c55e", padding: "3px 8px", cursor: "pointer", fontSize: 11, whiteSpace: "nowrap" } }, "\u2713 Ricevuto")
: null;
} })))),
tab === "withdrawals" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900, display: isMobile ? "none" : "block" } }, "Scarichi Magazzino"),
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
React.createElement("div", { style: { fontWeight: 800, fontSize: 15, color: "var(--text)" } }, csvModal.isJson ? " Backup JSON" : " Esporta dati"),
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
}, style: { background: "#2dd4bf", color: "#fff", border: "none", borderRadius: 7, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700 } }, "Copia negli appunti"),
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
}, style: { background: "#22c55e", color: "#fff", border: "none", borderRadius: 7, padding: "8px 18px", cursor: "pointer", fontSize: 13, fontWeight: 700 } }, "Copia tutto"),
React.createElement("button", { onClick: () => setCsvModal(null), style: { background: "var(--surface-2)", color: "var(--text-2)", border: "1px solid var(--border)", borderRadius: 7, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700 } }, "Chiudi"))))),
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
}, style: { background: "#2dd4bf", color: "#000", border: "none", borderRadius: 7, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 6, touchAction: "manipulation" } }, "\uD83D\uDDA8 Salva PDF"),
React.createElement("button", { onClick: () => setPdfHtml(null), style: { background: "var(--surface-2)", color: "var(--text-2)", border: "1px solid var(--border)", borderRadius: 7, padding: "7px 14px", cursor: "pointer", fontSize: 12, fontWeight: 700, touchAction: "manipulation" } }, "\u2715 Chiudi"))),
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
let _subInfo = null;
let _subFetched = false;
function fetchSubStatus() {
return __awaiter(this, void 0, void 0, function* () {
if (_subFetched)
return _subInfo;
_subFetched = true;
try {
if (typeof OFFLINE_MODE !== "undefined" && OFFLINE_MODE)
return null;
if (typeof DEMO_LOCKED !== "undefined" && DEMO_LOCKED)
return null;
const c = yield getSupabaseClient();
if (!c)
return null;
const { data, error } = yield c.rpc("stato_abbonamento");
if (!error && data && typeof data === "object") {
_subInfo = data;
}
}
catch (e) { }
return _subInfo;
});
}
function subScaduto() { return !!(_subInfo && _subInfo.scaduto); }
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
function App() {
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
React.createElement("div", { style: { fontSize: 30, fontWeight: 900, color: '#2dd4bf', marginBottom: 8 } }, "MedTrace"),
React.createElement("div", { style: { fontSize: 14, color: 'var(--text)', fontWeight: 700, marginBottom: 10 } }, "Connessione richiesta per il primo accesso"),
React.createElement("div", { style: { fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 18 } }, "Non e stato possibile contattare il servizio di autenticazione. Per accedere la prima volta serve una connessione a internet. Una volta effettuato l'accesso, potrai lavorare anche offline."),
React.createElement("button", { onClick: () => window.location.reload(), style: { background: '#2dd4bf', color: '#06251f', border: 'none', borderRadius: 9, padding: '11px 22px', fontWeight: 800, fontSize: 14, cursor: 'pointer' } }, "Riprova"))));
if (!currentUser)
return React.createElement(LoginScreen, { onLogin: setCurrentUser });
return (React.createElement(React.Fragment, null,
React.createElement(MTErrorBoundary, null, React.createElement(AppMain, null)),
React.createElement(OfflineBanner, null),
React.createElement(SubscriptionBanner, null)));
}
App;
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
export { App, AppMain }; // export di test: render_check renderizza AppMain direttamente (nell'app vera ci si arriva solo da loggati)
