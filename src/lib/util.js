/* MedTrace — util condivisa: meta record, date, codici, foto cloud, recalls, normalizzazione import (estratti da app.js, v3.00) */
import { __awaiter } from "./tslib.js";
import { getSupabaseClient, getSupabaseConfig, OFFLINE_MODE, DEMO_LOCKED } from "./sync.js";
export function genUUID() {
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
export function jobTipoLabel(j) {
return ({ preventiva: "Manutenzione preventiva", correttiva: "Intervento correttivo", straordinaria: "Intervento straordinario", verifica: "Verifica", calibrazione: "Calibrazione" })[j && j.type] || "Intervento";
}
export function jobShortCode(j) {
return j && j.id ? "#" + String(j.id).replace(/-/g, "").slice(-6).toUpperCase() : "";
}
export function withCreateMeta(record) {
const now = new Date().toISOString();
return Object.assign(Object.assign({}, record), { id: record.id || genUUID(), createdAt: record.createdAt || now, updatedAt: now });
}
export function withUpdateMeta(record) {
return Object.assign(Object.assign({}, record), { updatedAt: new Date().toISOString() });
}
export function customerPrefix(name) {
if (!name)
return "GEN";
const clean = String(name).replace(/[^A-Za-z0-9]/g, "");
if (clean.length === 0)
return "GEN";
return clean.slice(0, 3).toUpperCase();
}
export function nextAssetCode(prefix, allAssets) {
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
export function isCloudPhoto(u) { return typeof u === "string" && u.lastIndexOf("http", 0) === 0 && u.indexOf("/job-photos/") !== -1; }
export function uploadPhotoToCloud(dataUrl) {
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
export function deleteCloudPhoto(url) {
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
export function compressImage(file, maxWidth = 1024, quality = 0.7) {
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
export function assetHasOpenRecall(assetId, recalls) {
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
export function assetOpenRecall(assetId, recalls) {
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
export function impNorm(t) { return String(t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, ""); }
export function fmtDateTimeIt(dateStr) {
if (!dateStr) return "";
const str = String(dateStr);
const d = new Date(str);
if (isNaN(d.getTime())) return str;
const p = n => String(n).padStart(2, "0");
const dmy = p(d.getDate()) + "/" + p(d.getMonth() + 1) + "/" + d.getFullYear();
return /T\d{2}:\d{2}/.test(str) ? (dmy + " " + p(d.getHours()) + ":" + p(d.getMinutes())) : dmy;
}
