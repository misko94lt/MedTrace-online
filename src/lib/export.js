/* Utilita' di export e stampa: CSV, XLSX, JSON, finestra stampa, PDF (CDN lazy). Estratto verbatim, fase 1.
   Il trio bulk (mtBulkExportZip/Overlay/StartBulk) resta in app.js finche' non migrano i generatori PDF. */
import { __awaiter, __rest } from "./tslib.js";

function buildCSV(rows, cols) {
var keys = cols.map(function (c) { return typeof c === "string" ? c : c.key; });
var hdrs = cols.map(function (c) { return typeof c === "string" ? c : (c.label || c.key); });
function esc(v) {
var s = (v === null || v === undefined) ? "" : v;
if (Array.isArray(s))
s = s.join(", ");
if (typeof s === "object")
s = JSON.stringify(s);
s = String(s).split('"').join('""');
return '"' + s + '"';
}
var lines = [hdrs.map(esc).join(";")].concat(rows.map(function (r) {
return keys.map(function (k) { return esc(r[k]); }).join(";");
}));
return lines.join("\r\n");
}
function downloadCSV(filename, rows, cols) {
var csvData = buildCSV(rows, cols);
try {
var blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8' });
var url = URL.createObjectURL(blob);
var a = document.createElement('a');
a.href = url;
a.download = filename;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
window.dispatchEvent(new CustomEvent("toast", { detail: { msg: "Dati esportati: " + filename, color: "#22c55e" } }));
}
catch (err) {
window.dispatchEvent(new CustomEvent("show-csv", { detail: { filename: filename, data: csvData } }));
}
}
let _xlsxLibPromise = null;
function loadXLSXLib() {
if (window.XLSX)
return Promise.resolve(window.XLSX);
if (!_xlsxLibPromise) {
_xlsxLibPromise = new Promise((resolve, reject) => {
const s = document.createElement("script");
s.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
s.onload = () => resolve(window.XLSX);
s.onerror = () => reject(new Error("Impossibile caricare la libreria Excel (sei online?)"));
document.head.appendChild(s);
});
}
return _xlsxLibPromise;
}
export function downloadXLSX(filename, rows, cols, sheetName) {
return __awaiter(this, void 0, void 0, function* () {
try {
const XLSX = yield loadXLSXLib();
const data = (rows || []).map(r => {
const o = {};
cols.forEach(c => {
let v = r[c.key];
if (v === undefined || v === null)
v = "";
o[c.label] = v;
});
return o;
});
const ws = XLSX.utils.json_to_sheet(data, { header: cols.map(c => c.label) });
ws["!cols"] = cols.map(c => {
let maxLen = c.label.length;
(rows || []).forEach(r => {
var _a;
const val = String((_a = r[c.key]) !== null && _a !== void 0 ? _a : "");
if (val.length > maxLen)
maxLen = val.length;
});
return { wch: Math.min(Math.max(maxLen + 2, 8), 50) };
});
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, sheetName || "Dati");
XLSX.writeFile(wb, filename);
window.dispatchEvent(new CustomEvent("toast", { detail: { msg: "Excel scaricato: " + filename, color: "#22c55e" } }));
}
catch (err) {
window.dispatchEvent(new CustomEvent("toast", { detail: { msg: "Excel non disponibile offline: esporto in formato compatibile", color: "#f59e0b" } }));
downloadCSV(filename.replace(/\.xlsx$/, ".csv"), rows, cols);
}
});
}
export function downloadJSON(filename, data) {
var jsonData = JSON.stringify(data, null, 2);
try {
var blob = new Blob([jsonData], { type: 'application/json' });
var url = URL.createObjectURL(blob);
var a = document.createElement('a');
a.href = url;
a.download = filename;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
window.dispatchEvent(new CustomEvent("toast", { detail: { msg: "Backup scaricato: " + filename, color: "#22c55e" } }));
}
catch (err) {
window.dispatchEvent(new CustomEvent("show-csv", {
detail: { filename: filename, data: jsonData, isJson: true }
}));
}
}
export function openPrintWindow(htmlContent) {
if (window.__mtPdfCapture) { try { window.__mtPdfCapture(htmlContent); } catch (e) {} return; }
window.dispatchEvent(new CustomEvent('show-pdf', { detail: htmlContent }));
}
// ===== Bulk PDF export (ZIP) — additive, riusa i generatori PDF esistenti via __mtPdfCapture =====
export function mtEnsurePdfLibs(cb) {
function ready(){ return window.jspdf && window.jspdf.jsPDF && window.html2canvas && window.JSZip; }
if (ready()) { cb(true); return; }
var srcs = [
["mt-jspdf", "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"],
["mt-html2canvas", "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"],
["mt-jszip", "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"]
];
srcs.forEach(function(s){ if (!document.getElementById(s[0])) { var el=document.createElement("script"); el.id=s[0]; el.src=s[1]; document.head.appendChild(el); } });
var waited=0;
var iv=setInterval(function(){ if (ready()) { clearInterval(iv); cb(true); } else { waited+=200; if (waited>=25000) { clearInterval(iv); cb(false); } } }, 200);
}
export function mtRenderReportPdfBlob(htmlDoc) {
return new Promise(function(resolve, reject){
var A4W_PX=794, A4W_MM=210, A4H_MM=297, S=2;
var iframe=document.createElement("iframe");
iframe.style.cssText="position:fixed;left:-9999px;top:0;width:"+A4W_PX+"px;border:0;";
iframe.setAttribute("srcdoc", htmlDoc);
document.body.appendChild(iframe);
iframe.onload=function(){
setTimeout(function(){
try {
var idoc=iframe.contentDocument, body=idoc.body;
window.html2canvas(body, { scale:S, useCORS:true, backgroundColor:"#ffffff", width:A4W_PX, windowWidth:A4W_PX, height:body.scrollHeight }).then(function(canvas){
var bodyTop=body.getBoundingClientRect().top;
var els=[].slice.call(idoc.querySelectorAll('.header,.titlebar,.section .sec-head,.vis-row,table tr,.footer,.sign-row,div[style*="border-left"]'));
var bounds=els.map(function(e){ return Math.round((e.getBoundingClientRect().bottom-bodyTop)*S); }).filter(function(b){ return b>0; }).sort(function(a,b){ return a-b; });
var jsPDF=window.jspdf.jsPDF, pdf=new jsPDF("p","mm","a4");
var H=canvas.height, pageH=Math.floor((A4H_MM/A4W_MM)*canvas.width), y0=0, pages=0;
while (y0 < H-2) {
var limit=y0+pageH, cut=(H<=limit)?H:0;
if (H>limit) { for (var i=0;i<bounds.length;i++){ var b=bounds[i]; if (b>y0+40 && b<=limit) cut=b; } if (!cut) cut=limit; }
var sliceH=cut-y0;
var c=document.createElement("canvas"); c.width=canvas.width; c.height=sliceH;
c.getContext("2d").drawImage(canvas,0,y0,canvas.width,sliceH,0,0,canvas.width,sliceH);
var imgH=sliceH*A4W_MM/canvas.width;
if (pages>0) pdf.addPage();
pdf.addImage(c.toDataURL("image/jpeg",0.86),"JPEG",0,0,A4W_MM,imgH);
pages++; y0=cut;
}
try { document.body.removeChild(iframe); } catch(e){}
resolve(pdf.output("blob"));
}).catch(function(err){ try { document.body.removeChild(iframe); } catch(e){} reject(err); });
} catch(err){ try { document.body.removeChild(iframe); } catch(e){} reject(err); }
}, 220);
};
});
}
export function showPDFPreview(html, filename) {
mtEnsurePdfLibs(function(ok){
if (!ok) { alert("Non riesco a caricare le librerie PDF (serve internet la prima volta)."); return; }
mtRenderReportPdfBlob(html).then(function(blob){
var url = URL.createObjectURL(blob), a = document.createElement("a");
a.href = url; a.download = filename || "documento.pdf";
document.body.appendChild(a); a.click(); document.body.removeChild(a);
setTimeout(function(){ URL.revokeObjectURL(url); }, 6000);
}).catch(function(e){ alert("Errore PDF: " + String(e && e.message || e)); });
});
}
