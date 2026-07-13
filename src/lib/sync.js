/* MedTrace — layer sync/persistenza: Supabase, localStorage/IndexedDB mirror, boot data (estratto da app.js, v2.84) */
import { __awaiter } from "./tslib.js";

const SUPA_URL = 'https://gkkkcbwttkxecaacqvwp.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdra2tjYnd0dGt4ZWNhYWNxdndwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNDIzMTksImV4cCI6MjA5NTYxODMxOX0.MkhQ-9XAeCGPNoqlKwygT5AQp6LBDhDEUSUXuhdhz9I';
let _supa = null;
export function getSupa() {
if (!_supa && window.supabase) {
_supa = window.supabase.createClient(SUPA_URL, SUPA_KEY, {
auth: { autoRefreshToken: true, persistSession: true },
});
}
return _supa;
}
export const STORAGE_KEY = "medtrace-v1";
export const OFFLINE_MODE = false;
let _bootData = null;
let _bootDone = false;
export function loadData() { try {
if (_bootDone) return _bootData;
const r = localStorage.getItem(STORAGE_KEY);
return r ? JSON.parse(r) : null;
}
catch (_a) {
return null;
} }
function idbOpen() {
return new Promise((res, rej) => {
try {
const rq = indexedDB.open("medtrace-mirror", 1);
rq.onupgradeneeded = () => { try {
rq.result.createObjectStore("kv");
}
catch (e) { } };
rq.onsuccess = () => res(rq.result);
rq.onerror = () => rej(rq.error);
}
catch (e) {
rej(e);
}
});
}
export function idbSet(key, val) {
return idbOpen().then(db => new Promise((res) => {
try {
const tx = db.transaction("kv", "readwrite");
tx.objectStore("kv").put(val, key);
tx.oncomplete = () => { db.close(); res(true); };
tx.onerror = () => { db.close(); res(false); };
}
catch (e) {
res(false);
}
})).catch(() => false);
}
export function idbGet(key) {
return idbOpen().then(db => new Promise((res) => {
try {
const tx = db.transaction("kv", "readonly");
const rq = tx.objectStore("kv").get(key);
rq.onsuccess = () => { db.close(); res(rq.result); };
rq.onerror = () => { db.close(); res(undefined); };
}
catch (e) {
res(undefined);
}
})).catch(() => undefined);
}
let _mirrorTimer = null;
let _mirrorPending = null;
function _mirrorFlush() {
if (_mirrorTimer) {
clearTimeout(_mirrorTimer);
_mirrorTimer = null;
}
if (_mirrorPending != null) {
const v = _mirrorPending;
_mirrorPending = null;
idbSet(STORAGE_KEY, v);
}
}
export function mirrorToIdb(json) {
_mirrorPending = json;
if (_mirrorTimer)
return;
_mirrorTimer = setTimeout(_mirrorFlush, 2500);
}
try {
window.addEventListener("pagehide", _mirrorFlush);
document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden")
_mirrorFlush(); });
}
catch (e) { }
let _quotaAlerted = false;
let _storageWarnedPct = 0;
let _usageCache = null;
export function storageUsage(force) {
if (!force && _usageCache && (Date.now() - _usageCache.ts < 15000))
return _usageCache;
let chars = 0;
try {
for (let i = 0; i < localStorage.length; i++) {
const k = localStorage.key(i) || "";
chars += k.length + (localStorage.getItem(k) || "").length;
}
}
catch (e) { }
const budget = 4800000;
_usageCache = { chars, budget, pct: Math.min(999, Math.round(chars / budget * 100)), ts: Date.now() };
return _usageCache;
}
export function saveData(d) {
let _json = null;
try {
_json = JSON.stringify(d);
}
catch (e0) {
return false;
}
try {
localStorage.setItem(STORAGE_KEY, _json);
mirrorToIdb(_json);
_quotaAlerted = false;
try {
const u = storageUsage(true);
if (u.pct < 75)
_storageWarnedPct = 0;
if (u.pct >= 80 && u.pct > _storageWarnedPct) {
_storageWarnedPct = u.pct;
window.dispatchEvent(new CustomEvent("toast", { detail: { msg: "Spazio dati al " + u.pct + "% — vedi Impostazioni → Spazio dati locale", color: "#f59e0b" } }));
}
}
catch (e2) { }
return true;
}
catch (e) {
if (_json) { try { idbSet(STORAGE_KEY, _json); } catch (e3) { } mirrorToIdb(_json); }
if (!_quotaAlerted) {
_quotaAlerted = true;
try { window.dispatchEvent(new CustomEvent("toast", { detail: { msg: "Memoria rapida piena — i dati restano salvati nell'archivio locale esteso", color: "#2dd4bf" } })); } catch (e4) { }
}
return true;
}
}
export function upsertInList(list, record) {
const exists = list.some(x => x.id === record.id);
if (exists)
return list.map(x => x.id === record.id ? record : x);
return [...list, record];
}
export function getSupabaseConfig() {
try {
const raw = localStorage.getItem("medtrace-supabase-config");
if (raw) {
const c = JSON.parse(raw);
if (c.url && c.anonKey)
return c;
}
}
catch (e) { }
return { url: "", anonKey: "" };
}
let _supabaseClient = null;
let _supabaseLibPromise = null;
export function getSupabaseClient() {
return __awaiter(this, void 0, void 0, function* () {
if (typeof getSupa === "function") {
const c = getSupa();
if (c)
return c;
}
const cfg = getSupabaseConfig();
if (!cfg.url || !cfg.anonKey)
return null;
if (_supabaseClient)
return _supabaseClient;
if (!window.supabase) {
if (!_supabaseLibPromise) {
_supabaseLibPromise = new Promise((resolve, reject) => {
const s = document.createElement("script");
s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
s.onload = resolve;
s.onerror = () => reject(new Error("Impossibile connettersi al cloud (sei online?)"));
document.head.appendChild(s);
});
}
yield _supabaseLibPromise;
}
_supabaseClient = window.supabase.createClient(cfg.url, cfg.anonKey);
return _supabaseClient;
});
}
const SUPABASE_TABLES = {
customers: "customers",
assets: "assets",
parts: "parts",
jobs: "jobs",
iecReports: "iec_reports",
funcReports: "func_reports",
invoices: "invoices",
quotes: "quotes",
orders: "orders",
withdrawals: "withdrawals",
instruments: "instruments",
procedures: "procedures",
recalls: "recalls",
};
const SUPABASE_CHUNK = 20;
/* Chunk a budget di byte: dal v3.03 i report portano firme base64 (anche 100KB+ l'una);
   20 righe fisse potevano superare i limiti del body e la fetch moriva ("Failed to fetch").
   Qui si accumula finche' il JSON resta sotto ~700KB, con retry sui transienti di rete. */
function chunkByBytes(rows, maxBytes) {
if (maxBytes === void 0) maxBytes = 200000; /* ~200KB: sotto le soglie tipiche dei middlebox aziendali (ispezione SSL) che troncano i body grossi */
const chunks = []; let cur = []; let size = 0;
for (const r of rows) {
let s = 0; try { s = JSON.stringify(r).length; } catch (e) { s = 2000; }
if (cur.length > 0 && (size + s > maxBytes || cur.length >= SUPABASE_CHUNK)) { chunks.push(cur); cur = []; size = 0; }
cur.push(r); size += s;
}
if (cur.length) chunks.push(cur);
return chunks;
}
function upsertWithRetry(client, table, chunk) {
return __awaiter(this, void 0, void 0, function* () {
let last = null;
for (let attempt = 0; attempt < 3; attempt++) {
try {
const { error } = yield client.from(table).upsert(chunk, { onConflict: "id" });
if (!error) return null;
last = error;
if (!/fetch|network|timeout/i.test(String(error.message || ""))) return error;
} catch (e) { last = { message: String((e && e.message) || e) }; }
yield new Promise(r => setTimeout(r, 700 * (attempt + 1)));
}
return last;
});
}
function toSnakeRecord(obj) {
const out = {};
for (const k in obj) {
const sk = k.replace(/[A-Z]/g, m => "_" + m.toLowerCase());
let v = obj[k];
if ((sk === "id" || sk.endsWith("_id")) && v === "")
v = null;
if ((sk.endsWith("_date") || sk.endsWith("_expiry") || sk === "date" || sk === "last_service" || sk === "next_service") && v === "")
v = null;
if (["labor_hours", "labor_rate", "travel_cost", "purchase_cost", "markup_pct", "min_qty", "qty", "sell_price", "service_interval", "interval_iec", "interval_func", "total", "unit_price", "price", "cost"].includes(sk) && v === "")
v = null;
out[sk] = v;
}
return out;
}
function toCamelRecord(obj) {
const out = {};
for (const k in obj) {
const ck = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
out[ck] = obj[k];
}
return out;
}
export function supabaseSyncMerge(localData) {
return __awaiter(this, void 0, void 0, function* () {
const client = yield getSupabaseClient();
if (!client)
throw new Error("Cloud non disponibile");
const orgId = yield supabaseGetOrgId();
if (!orgId)
throw new Error("Organizzazione non trovata: fai login e verifica di avere un ruolo assegnato.");
const mergeById = (a, b) => {
const __mergeReport = (a, b) => {
const ta = Date.parse(a.updatedAt || a.createdAt || 0) || 0, tb = Date.parse(b.updatedAt || b.createdAt || 0) || 0;
const nw = tb >= ta ? b : a, od = tb >= ta ? a : b;
const filled = v => String(v == null ? "" : v).trim() !== "";
const out = Object.assign({}, od, nw);
if (Array.isArray(a.measures) || Array.isArray(b.measures)) {
const am = Array.isArray(a.measures) ? a.measures : [], bm = Array.isArray(b.measures) ? b.measures : [];
const base = (Array.isArray(nw.measures) && nw.measures.length) ? nw.measures : (Array.isArray(od.measures) ? od.measures : []);
const gv = (arr, id) => { const x = arr.find(m => m && m.id === id); return x ? x.value : undefined; };
out.measures = base.map(m => { const mm = Object.assign({}, m); if (!filled(mm.value)) { const va = gv(am, m.id), vb = gv(bm, m.id); if (filled(va)) mm.value = va; else if (filled(vb)) mm.value = vb; } return mm; });
}
if ((a.sections && typeof a.sections === "object") || (b.sections && typeof b.sections === "object")) {
const as = a.sections || {}, bs = b.sections || {}, os = {};
new Set(Object.keys(as).concat(Object.keys(bs))).forEach(k => { const sa = as[k] || {}, sb = bs[k] || {}, M = {}, I = {};
new Set(Object.keys(sa.measures || {}).concat(Object.keys(sb.measures || {}))).forEach(mk => { const va = (sa.measures || {})[mk], vb = (sb.measures || {})[mk]; M[mk] = filled(va) ? va : (filled(vb) ? vb : va); });
new Set(Object.keys(sa.items || {}).concat(Object.keys(sb.items || {}))).forEach(ik => { const va = (sa.items || {})[ik], vb = (sb.items || {})[ik]; I[ik] = (va === true || va === false) ? va : ((vb === true || vb === false) ? vb : va); });
os[k] = Object.assign({}, sb, sa, { measures: M, items: I }); });
out.sections = os;
}
if ((a.visual && typeof a.visual === "object") || (b.visual && typeof b.visual === "object")) {
const av = a.visual || {}, bv = b.visual || {}, V = {};
new Set(Object.keys(av).concat(Object.keys(bv))).forEach(k => { const va = av[k], vb = bv[k]; V[k] = (va === true || va === false || filled(va)) ? va : vb; });
out.visual = V;
}
["technicianSignature", "departmentSignature", "techSignature", "deptSignature"].forEach(f => { out[f] = filled(nw[f]) ? nw[f] : (filled(od[f]) ? od[f] : nw[f]); });
out.notes = filled(nw.notes) ? nw.notes : (filled(od.notes) ? od.notes : nw.notes);
out.updatedAt = new Date().toISOString();
return out;
};
const map = new Map();
(a || []).forEach(r => { if (r && r.id != null)
map.set(r.id, r); });
(b || []).forEach(r => {
if (!r || r.id == null)
return;
const ex = map.get(r.id);
if (!ex) {
map.set(r.id, r);
return;
}
const tEx = Date.parse(ex.updatedAt || ex.createdAt || 0) || 0;
const tNew = Date.parse(r.updatedAt || r.createdAt || 0) || 0;
const exDel = !!(ex.deleted || ex.purged), rDel = !!(r.deleted || r.purged);
if (exDel !== rDel) { const del = exDel ? ex : r, act = exDel ? r : ex; const tDel = Date.parse(del.deletedAt || del.updatedAt || 0) || 0; const tAct = Date.parse(act.updatedAt || act.createdAt || 0) || 0; map.set(r.id, tDel >= tAct ? del : act); return; }
const isRepA = Array.isArray(ex.measures) || (ex.sections && typeof ex.sections === "object");
const isRepB = Array.isArray(r.measures) || (r.sections && typeof r.sections === "object");
let winner;
if (isRepA && isRepB) winner = __mergeReport(ex, r);
else winner = tNew >= tEx ? r : ex;
map.set(r.id, winner);
});
return [...map.values()];
};
const merged = {};
const mergedTrash = {};
const results = {};
const localTrash = localData.cestino || {};
for (const [stateKey, table] of Object.entries(SUPABASE_TABLES)) {
const { data: remoteRows, error: errDown } = yield client.from(table).select("*");
if (errDown)
throw new Error("Errore lettura " + table + ": " + errDown.message);
const remote = (remoteRows || []).map(toCamelRecord);
const localAll = [...(localData[stateKey] || []), ...((localTrash[stateKey]) || [])];
const fused = mergeById(localAll, remote);
const attivi = fused.filter(r => !r.deleted && !r.purged);
let cestinati = fused.filter(r => r.deleted && !r.purged);
const purgati = fused.filter(r => r.purged);
const LIMITE_LAPIDI = Date.now() - 90 * 24 * 60 * 60 * 1000;
const vecchie = cestinati.filter(r => { const t = Date.parse(r.deletedAt || r.updatedAt || ""); return t && t < LIMITE_LAPIDI; });
if (vecchie.length > 0) {
const vid = {};
vecchie.forEach(r => { vid[r.id] = true; });
cestinati = cestinati.filter(r => !vid[r.id]);
}
const daEliminare = [...purgati, ...vecchie];
const stubsDaTenere = [];
if (daEliminare.length > 0) {
const ids = daEliminare.map(r => r.id);
try {
yield client.from(table).delete().in("id", ids);
}
catch (e) { }
let rimasti = {};
try {
const { data: chk } = yield client.from(table).select("id").in("id", ids);
(chk || []).forEach(r => { rimasti[r.id] = true; });
}
catch (e) {
daEliminare.forEach(r => { rimasti[r.id] = true; });
}
daEliminare.forEach(r => {
if (rimasti[r.id])
stubsDaTenere.push({ id: r.id, deleted: true, purged: true, deletedAt: (r.deletedAt || null), updatedAt: (r.updatedAt || new Date().toISOString()) });
});
}
merged[stateKey] = attivi;
mergedTrash[stateKey] = [...cestinati, ...stubsDaTenere];
const rows = [...attivi, ...cestinati, ...stubsDaTenere].map(r => { const s = toSnakeRecord(r); s.org_id = orgId; return s; });
if (rows.length > 0) {
for (const chunk of chunkByBytes(rows)) {
const errUp = yield upsertWithRetry(client, table, chunk);
if (errUp)
throw new Error("Errore sync " + table + ": " + errUp.message);
}
}
results[table] = rows.length;
}
return { merged, mergedTrash, results };
});
}
export function supabaseSyncUp(localData) {
return __awaiter(this, void 0, void 0, function* () {
const client = yield getSupabaseClient();
if (!client)
throw new Error("Cloud non disponibile");
const orgId = yield supabaseGetOrgId();
if (!orgId)
throw new Error("Organizzazione non trovata: assicurati di aver fatto login e di avere un ruolo assegnato.");
const results = {};
for (const [stateKey, table] of Object.entries(SUPABASE_TABLES)) {
const rows = (localData[stateKey] || []).map(r => {
const snake = toSnakeRecord(r);
snake.org_id = orgId;
return snake;
});
if (rows.length === 0) {
results[table] = 0;
continue;
}
for (const chunk of chunkByBytes(rows)) {
const err = yield upsertWithRetry(client, table, chunk);
if (err)
throw new Error("Errore sync " + table + ": " + err.message);
}
results[table] = rows.length;
}
return results;
});
}
function supabaseSyncDown() {
return __awaiter(this, void 0, void 0, function* () {
const client = yield getSupabaseClient();
if (!client)
throw new Error("Cloud non disponibile");
const out = {};
for (const [stateKey, table] of Object.entries(SUPABASE_TABLES)) {
const { data, error } = yield client.from(table).select("*");
if (error)
throw new Error("Errore lettura " + table + ": " + error.message);
out[stateKey] = (data || []).map(toCamelRecord);
}
return out;
});
}
function supabaseIsTecnico() {
return __awaiter(this, void 0, void 0, function* () {
const client = yield getSupabaseClient();
if (!client)
return false;
const { data: udata } = yield client.auth.getUser();
const user = udata === null || udata === void 0 ? void 0 : udata.user;
if (!user)
return false;
const { data, error } = yield client.from("user_roles").select("role").eq("user_id", user.id).single();
if (error)
return false;
return (data === null || data === void 0 ? void 0 : data.role) === "tecnico" || (data === null || data === void 0 ? void 0 : data.role) === "admin";
});
}
export function supabaseGetRole() {
return __awaiter(this, void 0, void 0, function* () {
const client = yield getSupabaseClient();
if (!client)
return null;
try {
const { data: udata } = yield client.auth.getUser();
const user = udata === null || udata === void 0 ? void 0 : udata.user;
if (!user)
return null;
const { data } = yield client.from("user_roles").select("role").eq("user_id", user.id).single();
return (data === null || data === void 0 ? void 0 : data.role) || null;
}
catch (e) {
return null;
}
});
}
function supabaseGetOrgId() {
return __awaiter(this, void 0, void 0, function* () {
const client = yield getSupabaseClient();
if (!client)
return null;
try {
const { data: udata } = yield client.auth.getUser();
const user = udata === null || udata === void 0 ? void 0 : udata.user;
if (!user)
return null;
const { data } = yield client.from("user_roles").select("org_id").eq("user_id", user.id).single();
return (data === null || data === void 0 ? void 0 : data.org_id) || null;
}
catch (e) {
return null;
}
});
}
export function supabaseGetCompany() {
return __awaiter(this, void 0, void 0, function* () {
const client = yield getSupabaseClient();
if (!client)
return null;
try {
const { data, error } = yield client.rpc('get_org_company');
if (error || !data)
return null;
return {
name: data.name || "",
subtitle: data.subtitle || "",
address: data.address || "",
vat: data.vat || "",
iban: data.iban || "",
phone: data.phone || "",
email: data.email || "",
invoicePrefix: data.invoice_prefix || "F",
logo: data.logo || "",
technicians: Array.isArray(data.technicians) ? data.technicians : [],
};
}
catch (e) {
return null;
}
});
}
export function supabaseSaveCompany(c) {
return __awaiter(this, void 0, void 0, function* () {
const client = yield getSupabaseClient();
if (!client)
return false;
try {
const { data, error } = yield client.rpc('set_org_company', {
p_name: c.name || "", p_subtitle: c.subtitle || "", p_address: c.address || "",
p_vat: c.vat || "", p_iban: c.iban || "", p_phone: c.phone || "",
p_email: c.email || "", p_invoice_prefix: c.invoicePrefix || "F", p_logo: c.logo || "",
});
if (error)
return false;
return data === 'OK';
}
catch (e) {
return false;
}
});
}
export function supabaseSaveTechnicians(arr) {
return __awaiter(this, void 0, void 0, function* () {
const client = yield getSupabaseClient();
if (!client)
return false;
try {
const { data, error } = yield client.rpc('set_org_technicians', { p_technicians: arr || [] });
if (error)
return false;
return data === 'OK';
}
catch (e) {
return false;
}
});
}
export function supabaseDeleteById(stateKey, id) {
return __awaiter(this, void 0, void 0, function* () {
try {
if (typeof OFFLINE_MODE !== "undefined" && OFFLINE_MODE)
return;
const table = SUPABASE_TABLES[stateKey];
if (!table || id == null)
return;
const client = yield getSupabaseClient();
if (!client)
return;
yield client.from(table).delete().eq("id", id);
}
catch (e) { }
});
}
export function supabasePushOne(stateKey, record) {
return __awaiter(this, void 0, void 0, function* () {
try {
if (typeof OFFLINE_MODE !== "undefined" && OFFLINE_MODE)
return false;
const table = SUPABASE_TABLES[stateKey];
if (!table || !record)
return false;
const client = yield getSupabaseClient();
if (!client)
return false;
const orgId = yield supabaseGetOrgId();
if (!orgId)
return false;
const row = toSnakeRecord(record);
row.org_id = orgId;
const { error } = yield client.from(table).upsert([row], { onConflict: "id" });
return !error;
}
catch (e) {
return false;
}
});
}

/* setter/getter per lo stato boot riassegnato da app.js (pattern _instrumentsRegistry, cfr. reports.js) */
export function setBootData(v) { _bootData = v; }
export function setBootDone(v) { _bootDone = v; }
export function getBootDone() { return _bootDone; }

/* — flag build demo (spostata col taglio apparecchi, v3.00) — */
export const DEMO_LOCKED = false;

/* — auth e canale db legacy (spostati col taglio impostazioni, v3.06) — */
export const supaSignUp = (email, pw) => { var _a; return (_a = getSupa()) === null || _a === void 0 ? void 0 : _a.auth.signUp({ email, password: pw }); };
export const supaSignIn = (email, pw) => { var _a; return (_a = getSupa()) === null || _a === void 0 ? void 0 : _a.auth.signInWithPassword({ email, password: pw }); };
export const supaSignOut = () => { var _a; return (_a = getSupa()) === null || _a === void 0 ? void 0 : _a.auth.signOut(); };
export const supaDB = {
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

/* — stato abbonamento (spostato col taglio impostazioni, v3.06) — */
let _subInfo = null;
let _subFetched = false;
export function subScaduto() { return !!(_subInfo && _subInfo.scaduto); }
export function fetchSubStatus() {
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

/* — boot dati con scelta locale/IDB (trasloco finale, v3.07) — */
export async function bootLoadData() {
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
