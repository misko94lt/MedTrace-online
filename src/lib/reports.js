/* Generatori HTML/PDF dei report (funzionale, IEC), stile PDF, registro strumenti (privato, con setter),
   naming file, export bulk ZIP. Estratto da app.js, fase 1 - unico ritocco: setter del registro (ESM read-only). */
import { __awaiter, __rest } from "./tslib.js";
import { mtEnsurePdfLibs, mtRenderReportPdfBlob, downloadJSON, openPrintWindow } from "./export.js";
import { FUNC_TEMPLATES, cndToTemplate, guessTemplate } from "../constants/funcTemplates.js";

function mtBulkExportZip(reports, kind, ctx, onProgress, onDone, onError) {
mtEnsurePdfLibs(function(ok){
if (!ok) { if (onError) onError("Non riesco a caricare le librerie PDF (serve internet la prima volta)."); return; }
var zip=new window.JSZip(), i=0, used={};
function finish(){
zip.generateAsync({ type:"blob" }).then(function(content){
var url=URL.createObjectURL(content), a=document.createElement("a");
a.href=url; a.download=(kind==="iec"?"VSE":"Funzionali")+"_"+new Date().toISOString().slice(0,10)+".zip";
document.body.appendChild(a); a.click(); document.body.removeChild(a);
setTimeout(function(){ URL.revokeObjectURL(url); }, 6000);
if (onDone) onDone(reports.length);
}).catch(function(e){ if (onError) onError(String(e && e.message || e)); });
}
function step(){
if (i>=reports.length) { finish(); return; }
var r=reports[i];
var asset=(ctx.assets||[]).find(function(a){ return a.id===r.assetId; })||null;
var customer=(ctx.customers||[]).find(function(c){ return asset && c.id===asset.customerId; })||{};
var html=null;
window.__mtPdfCapture=function(h){ html=h; };
try { if (kind==="iec") generateIECPDF(r, asset, customer, ctx.company); else generateFuncPDF(r, asset, customer, ctx.company, ctx.templates); } catch(e){}
window.__mtPdfCapture=null;
if (!html) { i++; if (onProgress) onProgress(i, reports.length); setTimeout(step, 8); return; }
var base=((typeof pdfFileName==="function") ? pdfFileName(r) : (r.reportNumber||r.id)) || "documento";
base=String(base).replace(/[\\\/:*?"<>|]+/g,"-");
var name=base+".pdf", n=2; while (used[name]) { name=base+"_"+(n++)+".pdf"; } used[name]=1;
mtRenderReportPdfBlob(html).then(function(blob){
zip.file(name, blob); i++; if (onProgress) onProgress(i, reports.length); setTimeout(step, 8);
}).catch(function(){ i++; if (onProgress) onProgress(i, reports.length); setTimeout(step, 8); });
}
step();
});
}

function mtBulkOverlay(total) {
var wrap=document.createElement("div");
wrap.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.78);z-index:3000;display:flex;align-items:center;justify-content:center;padding:24px;";
var card=document.createElement("div");
card.style.cssText="background:#15151c;border:1px solid #2a2a38;border-radius:14px;padding:22px 24px;max-width:360px;width:100%;color:#f0f0f5;font-family:-apple-system,system-ui,sans-serif;box-shadow:0 12px 48px #000a;";
card.innerHTML='<div style="font-size:15px;font-weight:800;margin-bottom:4px">Esporto i PDF\u2026</div><div class="mtbk-sub" style="font-size:12px;color:#9aa7b8;margin-bottom:14px">Preparo le librerie\u2026</div><div style="height:10px;background:#24242f;border-radius:6px;overflow:hidden"><div class="mtbk-bar" style="height:100%;width:0%;background:linear-gradient(90deg,#0E7490,#2dd4bf);transition:width .2s"></div></div><div class="mtbk-cnt" style="font-size:11px;color:#778;margin-top:8px;text-align:right"></div>';
wrap.appendChild(card); document.body.appendChild(wrap);
var bar=card.querySelector(".mtbk-bar"), sub=card.querySelector(".mtbk-sub"), cnt=card.querySelector(".mtbk-cnt");
function close(){ try { document.body.removeChild(wrap); } catch(e){} }
return {
update:function(d,t){ var p=t?Math.round(d*100/t):0; bar.style.width=p+"%"; sub.textContent="Genero i documenti, non chiudere l'app\u2026"; cnt.textContent=d+" / "+t; },
done:function(n){ bar.style.width="100%"; sub.textContent="Fatto! Scarico lo ZIP\u2026"; setTimeout(close, 1000); },
fail:function(msg){ sub.textContent=msg||"Errore durante l'esportazione."; sub.style.color="#fca5a5"; var b=document.createElement("button"); b.textContent="Chiudi"; b.style.cssText="margin-top:14px;background:#2a2a38;color:#f0f0f5;border:none;border-radius:8px;padding:8px 16px;cursor:pointer;font-weight:700"; b.onclick=close; card.appendChild(b); }
};
}

export function mtStartBulk(reports, kind, ctx) {
if (!reports || !reports.length) return;
var ov=mtBulkOverlay(reports.length);
mtBulkExportZip(reports, kind, ctx, function(d,t){ ov.update(d,t); }, function(n){ ov.done(n); }, function(m){ ov.fail(m); });
}

export const PDF_STYLE = `
@page { size: A4; margin: 0; }
@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Helvetica Neue', 'Segoe UI', Arial, sans-serif; font-size: 11px; color: #1e293b; line-height: 1.5; background: #fff; }
/* ── LAYOUT: barra laterale come background del body (zero altezza extra) ── */
html, body { height: auto; }
body { background: linear-gradient(90deg, #0E7490 0mm, #2dd4bf 8mm, #fff 8mm); background-repeat: no-repeat; }
.side { display: none; }
.main { padding: 11mm 13mm 9mm 13mm; }
/* ── HEADER ── */
.header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; }
.header .brand-logo { height: 52px; max-width: 200px; object-fit: contain; margin-bottom: 8px; display: block; }
.header h1 { font-size: 18px; font-weight: 800; letter-spacing: -0.3px; color: #0F172A; line-height: 1.15; }
.header .sub { font-size: 9.5px; color: #64748B; margin-top: 3px; font-weight: 500; }
.header .right { text-align: right; }
.header .doctype { display: inline-block; background: #0F172A; color: #fff; font-size: 8.5px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase; padding: 5px 12px; border-radius: 3px; }
.header .docnum { font-size: 22px; font-weight: 800; color: #0E7490; margin-top: 6px; }
.header .docdate { font-size: 10px; color: #64748B; margin-top: 1px; }
/* ── TITLE BAR (nome azienda) ── */
.titlebar { background: #F0FDFA; border-left: 4px solid #0E7490; padding: 10px 16px; margin: 14px 0 4px; border-radius: 0 6px 6px 0; }
.titlebar h2 { font-size: 15px; color: #0F172A; font-weight: 800; }
.titlebar p { font-size: 10px; color: #64748B; margin-top: 2px; }
/* ── SEZIONI NUMERATE ── */
.section { margin: 10px 0; }
.sec-head { display: flex; align-items: center; gap: 9px; margin-bottom: 7px; }
.sec-num { width: 22px; height: 22px; border-radius: 50%; background: #0E7490; color: #fff; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.sec-title { font-size: 11.5px; font-weight: 800; color: #0F172A; text-transform: uppercase; letter-spacing: .5px; }
/* compatibilità: vecchio .section-title */
.section-title { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #0E7490; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid #E2E8F0; }
/* ── COPPIE CHIAVE-VALORE ── */
.kv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px 22px; }
.kv { display: flex; gap: 8px; padding: 4px 0; border-bottom: 1px solid #F1F5F9; }
.kv-label { color: #94A3B8; min-width: 100px; font-size: 10px; font-weight: 500; }
.kv-value { font-weight: 600; font-size: 11px; color: #1E293B; }
/* ── TABELLE ── */
table { width: 100%; border-collapse: collapse; margin: 6px 0; font-size: 10.5px; }
th { background: #0F172A; color: #F1F5F9; font-size: 8.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; padding: 8px 9px; text-align: left; }
td { padding: 7px 9px; border-bottom: 1px solid #EEF2F6; vertical-align: middle; }
tbody tr:nth-child(even) { background: #F8FAFC; }
/* ── ESITO ── */
.verdict { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 14px; border-radius: 8px; margin: 12px 0; font-weight: 800; font-size: 16px; letter-spacing: .5px; }
.verdict.ok { background: #ECFDF5; color: #047857; border: 2px solid #6EE7B7; }
.verdict.ko { background: #FEF2F2; color: #B91C1C; border: 2px solid #FECACA; }
/* ── TOTALE (fatture) ── */
.total-box { background: #0E7490; color: #fff; padding: 13px 18px; display: flex; justify-content: space-between; align-items: center; border-radius: 6px; margin-top: 8px; }
.total-box .label { font-size: 11px; font-weight: 600; }
.total-box .amount { font-size: 19px; font-weight: 800; }
/* ── BADGE ── */
.badge { display: inline-block; padding: 3px 9px; border-radius: 20px; font-size: 8.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .4px; }
.pass { color: #047857; background: #D1FAE5; }
.fail { color: #B91C1C; background: #FEE2E2; }
.nd { color: #64748B; background: #F1F5F9; }
/* ── STAT CARDS ── */
.stat-row { display: flex; gap: 10px; margin: 12px 0; }
.stat { flex: 1; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 10px; text-align: center; }
.stat .n { font-size: 22px; font-weight: 800; color: #0E7490; line-height: 1; }
.stat .l { font-size: 8.5px; color: #64748B; text-transform: uppercase; letter-spacing: .5px; margin-top: 5px; font-weight: 600; }
/* ── BOX NOTE/DESCRIZIONE ── */
.desc-box { background: #F8FAFC; border-left: 3px solid #0E7490; padding: 10px 14px; margin: 6px 0; font-size: 10.5px; line-height: 1.55; border-radius: 0 4px 4px 0; }
.vis-row { display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px solid #F1F5F9; font-size: 10.5px; }
/* ── VOCI VERIFICA FUNZIONALE (check ✓/✗) ── */
.section-note { font-size: 9.5px; color: #6B7280; font-style: italic; white-space: pre-line; margin: 0 0 7px 0; padding: 5px 9px; background: #FFFBEB; border-left: 2px solid #F59E0B; border-radius: 0 3px 3px 0; }
.check-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 2px; border-bottom: 1px solid #F1F5F9; gap: 10px; }
.check-text { font-size: 10.5px; color: #334155; flex: 1; }
.check-result { font-size: 10px; font-weight: 800; padding: 2px 9px; border-radius: 4px; border: 1px solid; white-space: nowrap; }
/* ── FIRME ── */
.sign-row { display: flex; gap: 40px; margin-top: 14px; break-inside: avoid; page-break-inside: avoid; }
.sign { flex: 1; text-align: center; break-inside: avoid; page-break-inside: avoid; }
.sign .line { border-top: 1px solid #94A3B8; margin-top: 28px; padding-top: 6px; }
.sign .label { font-size: 9px; color: #64748B; }
/* ── FOOTER ── */
.footer { margin-top: 10px; padding-top: 8px; border-top: 2px solid #0E7490; display: flex; justify-content: space-between; font-size: 8.5px; color: #94A3B8; }
/* ── INTERRUZIONI DI PAGINA: niente blocchi spezzati / righe orfane ── */
.section, tr, .kv, .check-row, .vis-row, .desc-box, .section-note,
.verdict, .total-box, .stat-row, .stat, .sign-row, .sign, .footer {
break-inside: avoid; page-break-inside: avoid;
}
.sec-head { break-after: avoid; page-break-after: avoid; }
thead { display: table-header-group; }
body { orphans: 3; widows: 3; }
`;

let _instrumentsRegistry = [];

function pdfFileName(rep) {
const num = String((rep && (rep.reportNumber || rep.id)) || "verifica").replace(/[^A-Za-z0-9]/g, "");
const dm = String((rep && rep.date) || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
let ddmmyy = "";
if (dm) ddmmyy = dm[3] + dm[2] + dm[1].slice(-2);
else { const d = new Date(); ddmmyy = String(d.getDate()).padStart(2, "0") + String(d.getMonth() + 1).padStart(2, "0") + String(d.getFullYear()).slice(-2); }
return ddmmyy ? (num + "-" + ddmmyy) : num;
}

export function generateIECPDF(rep, asset, customer, company) {
let _instSerial = rep.instrumentSerial || "";
let _instExpiry = rep.instrumentCalExpiry || "";
if ((!_instSerial || !_instExpiry) && rep.instrument && Array.isArray(_instrumentsRegistry)) {
const _m = _instrumentsRegistry.find(i => { const t = [i.brand, i.model].filter(Boolean).join(" "); return rep.instrument === t || rep.instrument === (t + (i.internalCode ? (" (" + i.internalCode + ")") : "")); });
if (_m) {
if (!_instSerial)
_instSerial = _m.serial || "";
if (!_instExpiry)
_instExpiry = _m.calExpiry || "";
}
}
const normL = rep.norm === '61010' ? 'IEC 61010-1 — Strumentazione Lab.' : rep.norm === '60601' ? 'IEC 60601-1 — Prova approfondita' : 'IEC 62353 — Elettromedicale';
const ptLabel = rep.norm !== '61010' ? (' · Tipo ' + (rep.patientType || 'BF')) : '';
const vi = rep.visual || {};
const visItems = [
['Involucro integro', vi.housing],
['Cavo di rete e spina integri', vi.cable],
['Connettori in buono stato', vi.connectors],
['Etichette e marcatura CE leggibili', vi.labels],
['Documentazione tecnica presente', vi.docs],
];
const visItemsFilled = visItems.filter(([label, val]) => val === true || val === false);
const visRows = visItemsFilled.map(([label, val]) => `
<div class="vis-row">
<span>${label}</span>
<span class="badge ${val === true ? 'pass' : 'fail'}">${val === true ? '✓ OK' : '✗ NO'}</span>
</div>`).join('');
const measFilled = (rep.measures || []).filter(m => m.na || (m.value !== '' && m.value !== undefined && m.value !== null && !isNaN(parseFloat(m.value))));
const measRows = measFilled.map(m => {
if (m.na) {
return `<tr style="opacity:.7">
<td>${m.name}</td>
<td style="text-align:center;font-family:monospace">${m.limit}</td>
<td style="text-align:center;font-family:monospace">—</td>
<td style="text-align:center">${m.unit}</td>
<td style="text-align:center"><span class="badge" style="background:#e5e7eb;color:#6b7280">N/A</span></td>
</tr>`;
}
const v = parseFloat(m.value);
const lv = parseFloat(m.limitVal);
const pass = (m.limitMin == null || v >= parseFloat(m.limitMin)) && (m.limitVal == null || (m.invertPass ? v >= lv : v <= lv));
return `<tr>
<td>${m.name}</td>
<td style="text-align:center;font-family:monospace">${m.limit}</td>
<td style="text-align:center;font-family:monospace;font-weight:700">${m.value}</td>
<td style="text-align:center">${m.unit}</td>
<td style="text-align:center"><span class="badge ${pass ? 'pass' : 'fail'}">${pass ? '✓ PASS' : '✗ FAIL'}</span></td>
</tr>`;
}).join('');
const isNotAvail = rep.verifyStatus === "non_disponibile";
const esitoColor = isNotAvail ? '#f59e0b' : (rep.overallPass ? '#059669' : '#dc2626');
const esitoLabel = isNotAvail ? 'NON ESEGUITA' : (rep.overallPass ? 'CONFORME' : 'NON CONFORME');
const reasonLabel = {
in_uso: "Apparecchio in uso su paziente",
non_trovato: "Apparecchio non reperibile in reparto",
trasferito: "Apparecchio trasferito ad altro reparto",
riparazione_esterna: "In riparazione esterna",
dismesso: "Dismesso / non più in uso",
rifiuto_reparto: "Reparto non autorizza intervento ora",
altro: "Altro motivo"
}[rep.notAvailableReason] || rep.notAvailableReason || "Non specificato";
const html = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8">
<title>${pdfFileName(rep)}</title>
<style>${PDF_STYLE}</style></head><body><div class="wrap"><div class="side"></div><div class="main">
<div class="header">
<div>
${company.logo ? `<img src="${company.logo}" class="brand-logo"/>` : `<h1>${company.name || 'Documento'}</h1>`}
<div class="sub">Rapporto di Verifica Sicurezza Elettrica</div>
<div class="sub">${normL}${ptLabel}</div>
</div>
<div class="right">
<div class="doctype">Verifica Sicurezza Elettrica</div>
<div class="docnum">${rep.reportNumber || rep.id}</div>
<div style="margin-top:6px;background:${esitoColor};color:#fff;padding:4px 12px;border-radius:4px;font-size:11px;font-weight:800">${esitoLabel}</div>
<div style="font-size:10px;margin-top:4px;opacity:.8">Data: ${rep.date || '—'}</div>
</div>
</div>
${(function(){var _h2=(company.logo && company.logoHasName) ? '' : `<h2>${company.name || 'Documento'}</h2>`;var _p=[company.subtitle, company.vat ? 'P.IVA ' + company.vat : '', company.address].filter(Boolean).join(' · ');return (_h2 || _p) ? `<div class="titlebar">${_h2}${_p ? `<p>${_p}</p>` : ''}</div>` : '';})()}
<div class="section">
<div class="sec-head"><span class="sec-num">1</span><span class="sec-title">Apparecchio</span></div>
<div class="kv-grid">
<div class="kv"><span class="kv-label">Nome</span><span class="kv-value">${(asset === null || asset === void 0 ? void 0 : asset.name) || '—'}</span></div>
<div class="kv"><span class="kv-label">Marca / Modello</span><span class="kv-value">${(asset === null || asset === void 0 ? void 0 : asset.brand) || ''} ${(asset === null || asset === void 0 ? void 0 : asset.model) || ''}</span></div>
<div class="kv"><span class="kv-label">N° Serie</span><span class="kv-value" style="font-family:monospace">${(asset === null || asset === void 0 ? void 0 : asset.serial) || '—'}</span></div>
<div class="kv"><span class="kv-label">Ubicazione</span><span class="kv-value">${(asset === null || asset === void 0 ? void 0 : asset.location) || '—'}</span></div>
<div class="kv"><span class="kv-label">N° Inventario</span><span class="kv-value" style="font-family:monospace">${(asset && asset.assetCode) || '—'}</span></div>
<div class="kv"><span class="kv-label">Prossima verifica</span><span class="kv-value">${(function(){ var nd = rep.nextDate; if (!nd && rep.date){ var d = new Date(rep.date); if(!isNaN(d.getTime())){ var mm=(asset && parseInt(asset.intervalIec,10))||12; d.setMonth(d.getMonth()+mm); nd=d.toISOString().slice(0,10);} } return nd || '—'; })()}</span></div>
${(customer === null || customer === void 0 ? void 0 : customer.name) ? `<div class="kv"><span class="kv-label">Cliente</span><span class="kv-value">${customer.name}</span></div>` : ''}
</div>
</div>
<div class="section">
<div class="sec-head"><span class="sec-num">2</span><span class="sec-title">Dati Verifica</span></div>
<div class="kv-grid">
<div class="kv"><span class="kv-label">Tecnico</span><span class="kv-value">${rep.technician || '—'}</span></div>
${isNotAvail ? `
<div class="kv"><span class="kv-label">Data</span><span class="kv-value">${rep.date || '—'}</span></div>
` : `
<div class="kv"><span class="kv-label">Strumento di misura</span><span class="kv-value">${rep.instrument || '—'}</span></div>
<div class="kv"><span class="kv-label">N° Serie strumento</span><span class="kv-value" style="font-family:monospace">${_instSerial || '—'}</span></div>
<div class="kv"><span class="kv-label">Scadenza taratura</span><span class="kv-value">${_instExpiry || '—'}</span></div>
<div class="kv"><span class="kv-label">Tipo verifica</span><span class="kv-value" style="text-transform:capitalize">${rep.verifyType || '—'}</span></div>
${rep.norm === '62353' && rep.equipClass !== 'III' ? `<div class="kv"><span class="kv-label">Metodo misura dispersione</span><span class="kv-value" style="text-transform:capitalize">${rep.leakageMethod || 'diretto'}</span></div>` : ''}
<div class="kv"><span class="kv-label">Classe apparecchio</span><span class="kv-value">Classe ${rep.equipClass || '—'}</span></div>
${rep.norm !== '61010' ? `<div class="kv"><span class="kv-label">Tipo parte paziente</span><span class="kv-value">Tipo ${rep.patientType || 'BF'}</span></div>` : ''}
`}
</div>
</div>
${isNotAvail ? `
<div class="section">
<div class="section-title" style="color:#d97706">⚠ Verifica Non Eseguita</div>
<table style="width:100%;border-collapse:collapse;font-size:11px">
<tr><td style="padding:6px;border:1px solid #cbd5e1;background:#fef3c7;width:35%"><strong>Motivo</strong></td><td style="padding:6px;border:1px solid #e5e7eb">${reasonLabel}</td></tr>
<tr><td style="padding:6px;border:1px solid #cbd5e1;background:#fef3c7"><strong>Reparto / Unità</strong></td><td style="padding:6px;border:1px solid #e5e7eb">${rep.departmentName || '—'}</td></tr>
<tr><td style="padding:6px;border:1px solid #cbd5e1;background:#fef3c7"><strong>Referente reparto</strong></td><td style="padding:6px;border:1px solid #e5e7eb">${rep.departmentContact || '—'}</td></tr>
<tr><td style="padding:6px;border:1px solid #cbd5e1;background:#fef3c7"><strong>Data tentativo</strong></td><td style="padding:6px;border:1px solid #e5e7eb">${rep.date}</td></tr>
</table>
<p style="margin-top:10px;font-size:11px;color:#64748b;font-style:italic">Il presente rapporto documenta l'impossibilità di eseguire la verifica programmata. La verifica sarà ripianificata e l'apparecchio resterà in stato "verifica scaduta" fino al completamento.</p>
</div>` : `
${visRows ? `<div class="section">
<div class="sec-head"><span class="sec-num">3</span><span class="sec-title">Ispezione Visiva</span></div>
${visRows}
</div>` : ''}
${measRows ? `<div class="section">
<div class="sec-head"><span class="sec-num">4</span><span class="sec-title">Misure Elettriche</span></div>
<table>
<thead><tr><th>Parametro</th><th style="text-align:center">Limite (norma)</th><th style="text-align:center">Valore misurato</th><th style="text-align:center">Unità</th><th style="text-align:center">Esito</th></tr></thead>
<tbody>${measRows}</tbody>
</table>
</div>` : ''}`}
<div class="total-box" style="margin-top:12px">
<span class="label">ESITO FINALE VERIFICA</span>
<span class="amount">${esitoLabel}</span>
</div>
${rep.notes ? `<div style="margin-top:12px;padding:8px 12px;background:#f8fafc;border-left:3px solid #64748b;font-size:11px"><strong>Note:</strong> ${rep.notes}</div>` : ''}
<div class="sign-row">
<div class="sign">
${rep.technicianSignature ? `<img src="${rep.technicianSignature}" style="max-height:55px;max-width:200px;display:block;margin:0 auto"/>` : '<div style="height:55px"></div>'}
<div class="line"><span class="label">Firma Tecnico Verificatore</span><br><strong style="color:#1e293b;font-size:11px">${rep.technician || ''}</strong></div>
</div>
${(rep.departmentSignature || rep.departmentContact || rep.departmentName) ? `
<div class="sign">
${rep.departmentSignature ? `<img src="${rep.departmentSignature}" style="max-height:55px;max-width:200px;display:block;margin:0 auto"/>` : '<div style="height:55px"></div>'}
<div class="line"><span class="label">Firma Referente Reparto / Cliente</span><br><strong style="color:#1e293b;font-size:11px">${rep.departmentContact || rep.departmentName || ''}</strong></div>
</div>` : ''}
</div>
<div class="footer">
<span>${(company.name || 'Documento')} — Generato il ${new Date().toLocaleDateString('it-IT')} — ${normL}</span>
<span>${rep.reportNumber || rep.id} · ${(asset === null || asset === void 0 ? void 0 : asset.serial) || ''}</span>
</div>
</div></div></body></html>`;
openPrintWindow(html);
}

export function generateFuncPDF(rep, asset, customer, company, templates) {
let _instSerial = rep.instrumentSerial || "";
let _instExpiry = rep.instrumentCalExpiry || "";
if ((!_instSerial || !_instExpiry) && rep.instrument && Array.isArray(_instrumentsRegistry)) {
const _m = _instrumentsRegistry.find(i => { const t = [i.brand, i.model].filter(Boolean).join(" "); return rep.instrument === t || rep.instrument === (t + (i.internalCode ? (" (" + i.internalCode + ")") : "")); });
if (_m) {
if (!_instSerial)
_instSerial = _m.serial || "";
if (!_instExpiry)
_instExpiry = _m.calExpiry || "";
}
}
const _TPLS = templates || (typeof FUNC_TEMPLATES !== "undefined" ? FUNC_TEMPLATES : {});
const tpl = _TPLS[rep.templateId] || { label: "Verifica Funzionale", icon: "›", norm: "IEC 60601-1", sections: [] };
const isNotAvail = rep.verifyStatus === "non_disponibile";
const esitoColor = isNotAvail ? "#f59e0b" : (rep.overallPass ? "#1F7468" : "#dc2626");
const esitoLabel = isNotAvail ? "NON ESEGUITA" : (rep.overallPass ? "CONFORME" : "NON CONFORME");
const reasonLabel = {
in_uso: "Apparecchio in uso su paziente",
non_trovato: "Apparecchio non reperibile in reparto",
trasferito: "Apparecchio trasferito ad altro reparto",
riparazione_esterna: "In riparazione esterna",
dismesso: "Dismesso / non più in uso",
rifiuto_reparto: "Reparto non autorizza intervento ora",
altro: "Altro motivo"
}[rep.notAvailableReason] || rep.notAvailableReason || "Non specificato";
let secNum = 1;
const sectionsHtml = (tpl.sections || []).map(sec => {
const sd = (rep.sections || {})[sec.id] || { items: {}, measures: {} };
const hasItem = (sec.items || []).some(it => {
const v = sd.items[it.id];
return v === true || v === false;
});
const hasMeas = (sec.measures || []).some(m => {
const v = sd.measures[m.id];
return v !== undefined && v !== null && String(v).trim() !== "";
});
if (!hasItem && !hasMeas)
return "";
const itemsHtml = (sec.items || []).map(item => {
const val = sd.items[item.id];
const icon = val === true ? "✓" : val === false ? "✗" : "—";
const color = val === true ? "#1F7468" : val === false ? "#dc2626" : "#9ca3af";
return `<div class="check-row">
<span class="check-text">${item.text}</span>
<span class="check-result" style="color:${color};background:${color}18;border-color:${color}44">${icon}</span>
</div>`;
}).join("");
const measHtml = (sec.measures || []).map(m => {
const val = sd.measures[m.id] || "";
const vNum = parseFloat(val);
let pass = null;
if (!isNaN(vNum) && val !== "") {
pass = true;
if (m.limitMin !== undefined && vNum < m.limitMin)
pass = false;
if (m.limitVal !== undefined) {
if (m.invertPass) {
if (vNum < m.limitVal)
pass = false;
}
else {
if (vNum > m.limitVal)
pass = false;
}
}
}
const pc = pass === null ? "#9ca3af" : pass ? "#1F7468" : "#dc2626";
return `<tr>
<td>${m.name}</td>
<td style="text-align:center;font-family:monospace;font-size:10px;color:#6b7280">${m.expected || ""}</td>
<td style="text-align:center;font-family:monospace;font-weight:700">${val || "—"}</td>
<td style="text-align:center;color:#6b7280">${m.unit}</td>
<td style="text-align:center"><span class="badge ${pass === null ? "nd" : pass ? "pass" : "fail"}">${pass === null ? "N/D" : pass ? "✓ PASS" : "✗ FAIL"}</span></td>
</tr>`;
}).join("");
secNum++;
return `<div class="section">
<div class="sec-head"><span class="sec-num">${secNum}</span><span class="sec-title">${sec.title}</span></div>
${sec.note ? `<div class="section-note">${sec.note}</div>` : ""}
${itemsHtml}
${measHtml ? `<table style="margin-top:${(sec.items || []).length > 0 ? 8 : 0}px">
<thead><tr><th>Misura</th><th style="text-align:center">Atteso</th><th style="text-align:center">Valore</th><th style="text-align:center">U.M.</th><th style="text-align:center">Esito</th></tr></thead>
<tbody>${measHtml}</tbody>
</table>` : ""}
</div>`;
}).join("");
const html = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8">
<title>${pdfFileName(rep)}</title>
<style>${PDF_STYLE}</style></head><body><div class="wrap"><div class="side"></div><div class="main">
<div class="header">
<div>
${company.logo ? `<img src="${company.logo}" class="brand-logo"/>` : `<h1>${(company.name || 'Documento')}</h1>`}
<div class="sub">Rapporto di Verifica Funzionale</div>
<div class="sub">${tpl.norm}</div>
</div>
<div class="right">
<div class="doctype">Verifica Funzionale</div>
<div class="docnum">${rep.reportNumber || rep.id}</div>
<div style="margin-top:6px;background:${esitoColor};color:#fff;padding:4px 12px;border-radius:4px;font-size:11px;font-weight:800">${esitoLabel}</div>
<div style="font-size:10px;margin-top:4px;opacity:.8">Data: ${rep.date || "—"}</div>
</div>
</div>
${(function(){var _h2=(company.logo && company.logoHasName) ? '' : `<h2>${company.name || 'Documento'}</h2>`;var _p=[company.subtitle, company.vat ? 'P.IVA ' + company.vat : '', company.address].filter(Boolean).join(' · ');return (_h2 || _p) ? `<div class="titlebar">${_h2}${_p ? `<p>${_p}</p>` : ''}</div>` : '';})()}
<div class="section">
<div class="sec-head"><span class="sec-num">1</span><span class="sec-title">Apparecchio</span></div>
<div class="kv-grid">
${(function(){ var t = (tpl && tpl.label) || ""; var n = (asset && asset.name) || ""; var tl = t.toLowerCase(), nl = n.toLowerCase(); if (t && (!nl || (tl.indexOf(nl) === -1 && nl.indexOf(tl) === -1))) { return '<div class="kv"><span class="kv-label">Tipo apparecchio</span><span class="kv-value">' + t + '</span></div>'; } return ''; })()}
<div class="kv"><span class="kv-label">Apparecchio</span><span class="kv-value">${(asset === null || asset === void 0 ? void 0 : asset.name) || "—"}</span></div>
<div class="kv"><span class="kv-label">Marca / Modello</span><span class="kv-value">${(asset === null || asset === void 0 ? void 0 : asset.brand) || ""} ${(asset === null || asset === void 0 ? void 0 : asset.model) || ""}</span></div>
<div class="kv"><span class="kv-label">N° Serie</span><span class="kv-value" style="font-family:monospace">${(asset === null || asset === void 0 ? void 0 : asset.serial) || "—"}</span></div>
<div class="kv"><span class="kv-label">Ubicazione</span><span class="kv-value">${(asset === null || asset === void 0 ? void 0 : asset.location) || "—"}</span></div>
<div class="kv"><span class="kv-label">N° Inventario</span><span class="kv-value" style="font-family:monospace">${(asset && asset.assetCode) || "—"}</span></div>
<div class="kv"><span class="kv-label">Prossima verifica</span><span class="kv-value">${(function(){ var nd = rep.nextDate; if (!nd && rep.date){ var d = new Date(rep.date); if(!isNaN(d.getTime())){ var mm=(asset && parseInt(asset.intervalFunc,10))||12; d.setMonth(d.getMonth()+mm); nd=d.toISOString().slice(0,10);} } return nd || "—"; })()}</span></div>
${(customer === null || customer === void 0 ? void 0 : customer.name) ? `<div class="kv"><span class="kv-label">Cliente</span><span class="kv-value">${customer.name}</span></div>` : ""}
<div class="kv"><span class="kv-label">Tecnico verificatore</span><span class="kv-value">${rep.technician || "—"}</span></div>
${isNotAvail ? '' : `<div class="kv"><span class="kv-label">Strumento/tester</span><span class="kv-value">${rep.instrument || "—"}</span></div>
<div class="kv"><span class="kv-label">N° Serie strumento</span><span class="kv-value" style="font-family:monospace">${_instSerial || "—"}</span></div>
<div class="kv"><span class="kv-label">Scadenza taratura</span><span class="kv-value">${_instExpiry || "—"}</span></div>`}
</div>
</div>
${isNotAvail ? `
<div class="section">
<div class="section-title" style="color:#d97706">⚠ Verifica Non Eseguita</div>
<table style="width:100%;border-collapse:collapse;font-size:11px">
<tr><td style="padding:6px;border:1px solid #cbd5e1;background:#fef3c7;width:35%"><strong>Motivo</strong></td><td style="padding:6px;border:1px solid #e5e7eb">${reasonLabel}</td></tr>
<tr><td style="padding:6px;border:1px solid #cbd5e1;background:#fef3c7"><strong>Reparto / Unità</strong></td><td style="padding:6px;border:1px solid #e5e7eb">${rep.departmentName || '—'}</td></tr>
<tr><td style="padding:6px;border:1px solid #cbd5e1;background:#fef3c7"><strong>Referente reparto</strong></td><td style="padding:6px;border:1px solid #e5e7eb">${rep.departmentContact || '—'}</td></tr>
<tr><td style="padding:6px;border:1px solid #cbd5e1;background:#fef3c7"><strong>Data tentativo</strong></td><td style="padding:6px;border:1px solid #e5e7eb">${rep.date}</td></tr>
</table>
<p style="margin-top:10px;font-size:11px;color:#64748b;font-style:italic">Il presente rapporto documenta l'impossibilità di eseguire la verifica funzionale programmata. La verifica sarà ripianificata.</p>
</div>` : sectionsHtml}
${rep.notes ? `<div style="margin-top:8px;padding:8px 10px;background:#f8fafc;border-left:3px solid #64748b;font-size:10px"><strong>Note:</strong> ${rep.notes}</div>` : ""}
<div class="total-box">
<span class="label">ESITO FINALE VERIFICA FUNZIONALE</span>
<span class="amount">${esitoLabel}</span>
</div>
<div class="sign-row">
<div class="sign">
${rep.technicianSignature ? `<img src="${rep.technicianSignature}" style="max-height:55px;max-width:200px;display:block;margin:0 auto"/>` : '<div style="height:55px"></div>'}
<div class="line"><span class="label">Firma Tecnico Verificatore</span><br><strong style="color:#1e293b;font-size:11px">${rep.technician || ''}</strong></div>
</div>
${(isNotAvail || rep.departmentSignature || rep.departmentContact || rep.departmentName) ? `
<div class="sign">
${rep.departmentSignature ? `<img src="${rep.departmentSignature}" style="max-height:55px;max-width:200px;display:block;margin:0 auto"/>` : '<div style="height:55px"></div>'}
<div class="line"><span class="label">Firma Referente Reparto / Cliente</span><br><strong style="color:#1e293b;font-size:11px">${rep.departmentContact || rep.departmentName || ''}</strong></div>
</div>` : ''}
</div>
<div style="margin-top:12px;padding:9px 11px;border:1px solid #e2e8f0;border-radius:6px;background:#f8fafc;font-size:7.8px;color:#64748b;line-height:1.5"><div style="font-weight:700;color:#475569;margin-bottom:3px">Avvertenze e limitazioni</div><b>a)</b> Verbale di verifica, non atto di certificazione; i risultati si riferiscono al solo esemplare provato e alle prove eseguite. &nbsp; <b>b)</b> Sicurezza elettrica secondo IEC 62353 (CEI EN 62353); le prove funzionali sono buona tecnica di categoria, per il singolo modello prevale il manuale del fabbricante. &nbsp; <b>c)</b> L'esito positivo attesta che i parametri rientrano nei valori previsti, non l'idoneità a impieghi specifici (riferirsi a normative e linee guida). &nbsp; <b>d)</b> ${company.name || '[Ragione sociale]'} non risponde di danni derivanti dall'inosservanza dei manuali del fabbricante; il Cliente è tenuto a usare l'apparecchio secondo le istruzioni del Costruttore.</div>
<div class="footer">
<span>${(company.name || 'Documento')} — Generato il ${new Date().toLocaleDateString("it-IT")} — ${tpl.norm}</span>
<span>${rep.reportNumber || rep.id} · ${(asset === null || asset === void 0 ? void 0 : asset.serial) || ""}</span>
</div>
</div></div></body></html>`;
openPrintWindow(html);
}

export function setInstrumentsRegistry(v) { _instrumentsRegistry = v || []; }

/* — numerazione report e misure IEC (spostati con il taglio verifiche, v2.90) — */
export const getNextReportNumber = (reports, prefix) => {
const year = new Date().getFullYear();
const pattern = new RegExp("^" + prefix + "-" + year + "-(\\d+)$");
let maxNum = 0;
(reports || []).forEach(r => {
const m = (r.reportNumber || "").match(pattern);
if (m)
maxNum = Math.max(maxNum, parseInt(m[1], 10));
});
const next = String(maxNum + 1).padStart(3, "0");
return prefix + "-" + year + "-" + next;
};
export function iecGetMeasures(norm, cls, patientType, method, sfc, fixed) {
if (norm === "61010")
return [
{ id: "pe", name: "Resistenza conduttore di protezione (PE)", unit: "Ω", limit: "≤ 0.1", limitVal: 0.1, value: "" },
{ id: "ins", name: "Resistenza di isolamento (500 Vdc)", unit: "MΩ", limit: "≥ 1", limitVal: 1, value: "", invertPass: true },
{ id: "id1", name: "Corrente di dispersione — carcassa", unit: "mA", limit: "≤ 3.5", limitVal: 3.5, value: "" },
{ id: "id2", name: "Corrente di dispersione — circuito prova", unit: "mA", limit: "≤ 0.5", limitVal: 0.5, value: "" },
];
if (norm === "60601") {
const pt60 = patientType || "BF";
const plNC = pt60 === "CF" ? 10 : 100;
const plSFC = pt60 === "CF" ? 50 : 500;
const mapVal = pt60 === "CF" ? 50 : 5000;
const arr = [];
if (cls === "I") {
arr.push({ id: "pe", name: "Resistenza conduttore di protezione (PE)", unit: "Ω", limit: "≤ 0.1", limitVal: 0.1, value: "" });
arr.push({ id: "earth_nc", name: "Dispersione verso terra (earth) — NC", unit: "µA", limit: "≤ 5000", limitVal: 5000, value: "" });
}
if (cls !== "III")
arr.push({ id: "encl_nc", name: "Dispersione involucro (touch) — NC", unit: "µA", limit: "≤ 100", limitVal: 100, value: "" });
arr.push({ id: "pat_nc", name: "Dispersione paziente " + pt60 + " — NC", unit: "µA", limit: "≤ " + plNC, limitVal: plNC, value: "" });
arr.push({ id: "aux_nc", name: "Corrente ausiliaria paziente " + pt60 + " — NC", unit: "µA", limit: "≤ " + plNC, limitVal: plNC, value: "" });
if (sfc) {
if (cls === "I")
arr.push({ id: "earth_sfc", name: "Dispersione verso terra (earth) — SFC", unit: "µA", limit: "≤ 10000", limitVal: 10000, value: "" });
if (cls !== "III")
arr.push({ id: "encl_sfc", name: "Dispersione involucro (touch) — SFC", unit: "µA", limit: "≤ 500", limitVal: 500, value: "" });
arr.push({ id: "pat_sfc", name: "Dispersione paziente " + pt60 + " — SFC", unit: "µA", limit: "≤ " + plSFC, limitVal: plSFC, value: "" });
arr.push({ id: "aux_sfc", name: "Corrente ausiliaria paziente " + pt60 + " — SFC", unit: "µA", limit: "≤ " + plSFC, limitVal: plSFC, value: "" });
if (pt60 !== "B")
arr.push({ id: "map_sfc", name: "Dispersione paziente — rete su PA (MAP) " + pt60 + " — SFC", unit: "µA", limit: "≤ " + mapVal, limitVal: mapVal, value: "" });
}
return arr;
}
const pt = patientType || "BF";
const m = method || "diretto";
const eqLim = {
"I": { diretto: 500, differenziale: 500, alternativo: 1000 },
"II": { diretto: 100, differenziale: 100, alternativo: 500 },
};
const eqVal = eqLim[cls] ? eqLim[cls][m] : 500;
const methodLabel = m === "diretto" ? "metodo diretto" : m === "differenziale" ? "metodo differenziale" : "metodo alternativo";
const apLim = {
"B": null,
"BF": { lim: "≤ 5000", val: 5000 },
"CF": { lim: "≤ 50", val: 50 },
};
const ap = apLim[pt];
if (cls === "III")
return [
{ id: "ins_pa", name: "Resistenza isolamento parte applicata — rete (500 Vdc)", unit: "MΩ", limit: "≥ 2", limitVal: 2, value: "", invertPass: true },
...(ap ? [{ id: "id_pa", name: "Dispersione parte applicata " + pt + " (" + methodLabel + ")", unit: "µA", limit: ap.lim, limitVal: ap.val, value: "" }] : []),
];
if (cls === "II")
return [
{ id: "ins_main", name: "Resistenza isolamento — rete vs accessibili (500 Vdc)", unit: "MΩ", limit: "≥ 7", limitVal: 7, value: "", invertPass: true },
{ id: "ins_pa", name: "Resistenza isolamento parte applicata — rete (500 Vdc)", unit: "MΩ", limit: "≥ 2", limitVal: 2, value: "", invertPass: true },
{ id: "id_eq", name: "Equipment Leakage Cl.II (" + methodLabel + ")", unit: "µA", limit: "≤ " + eqVal, limitVal: eqVal, value: "" },
...(ap ? [{ id: "id_pa", name: "Dispersione parte applicata " + pt + " (" + methodLabel + ")", unit: "µA", limit: ap.lim, limitVal: ap.val, value: "" }] : []),
];
if (fixed) {
return [
{ id: "pe", name: "Resistenza di terra → nodo equipotenziale", unit: "Ω", limit: "≤ 0.3", limitVal: 0.3, value: "", editableLimit: true },
{ id: "encl", name: "Dispersione involucro (touch) — parti non a terra", unit: "µA", limit: "≤ 100", limitVal: 100, value: "" },
...(ap ? [{ id: "id_pa", name: "Dispersione parte applicata " + pt + " (" + methodLabel + ")", unit: "µA", limit: ap.lim, limitVal: ap.val, value: "" }] : []),
];
}
return [
{ id: "pe", name: "Resistenza conduttore di protezione (PE)", unit: "Ω", limit: "≤ 0.3", limitVal: 0.3, value: "" },
{ id: "ins_main", name: "Resistenza isolamento — rete vs PE (500 Vdc)", unit: "MΩ", limit: "≥ 2", limitVal: 2, value: "", invertPass: true },
{ id: "ins_pa", name: "Resistenza isolamento parte applicata — rete (500 Vdc)", unit: "MΩ", limit: "≥ 2", limitVal: 2, value: "", invertPass: true },
{ id: "id_eq", name: "Equipment Leakage Cl.I (" + methodLabel + ")", unit: "µA", limit: "≤ " + eqVal, limitVal: eqVal, value: "" },
...(ap ? [{ id: "id_pa", name: "Dispersione parte applicata " + pt + " (" + methodLabel + ")", unit: "µA", limit: ap.lim, limitVal: ap.val, value: "" }] : []),
];
}

/* — PDF unico PPM (spostato con il taglio PPM, v2.97) — */
export function generatePPMPDF(ppm, asset, customer, company, templates, funcRep, iecRep) {
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
+ '<div class="sign-row" style="display:flex;justify-content:space-around;gap:24px;margin-top:26px;text-align:center">'
+ '<div style="flex:1;max-width:260px">' + (ppm.technicianSignature ? '<img src="' + ppm.technicianSignature + '" style="max-height:55px;max-width:200px;display:block;margin:0 auto"/>' : '<div style="height:55px"></div>') + '<div style="border-top:1px solid #94A3B8;padding-top:4px;font-size:9.5px;color:#64748B">Firma Tecnico<br/><strong style="color:#1e293b;font-size:11px">' + (ppm.technician || '') + '</strong></div></div>'
+ ((ppm.departmentSignature || ppm.departmentContact || ppm.departmentName) ? '<div style="flex:1;max-width:260px">' + (ppm.departmentSignature ? '<img src="' + ppm.departmentSignature + '" style="max-height:55px;max-width:200px;display:block;margin:0 auto"/>' : '<div style="height:55px"></div>') + '<div style="border-top:1px solid #94A3B8;padding-top:4px;font-size:9.5px;color:#64748B">Firma Referente Reparto / Cliente<br/><strong style="color:#1e293b;font-size:11px">' + (ppm.departmentContact || ppm.departmentName || '') + '</strong></div></div>' : '')
+ '</div>'
+ '<div style="margin-top:14px;padding:9px 11px;border:1px solid #e2e8f0;border-radius:6px;background:#f8fafc;font-size:7.8px;color:#64748b;line-height:1.5"><div style="font-weight:700;color:#475569;margin-bottom:3px">Avvertenze e limitazioni</div><b>a)</b> Verbale di verifica, non atto di certificazione; i risultati si riferiscono al solo esemplare provato e alle prove eseguite. &nbsp; <b>b)</b> Sicurezza elettrica secondo IEC 62353 (CEI EN 62353); le prove funzionali sono buona tecnica di categoria, per il singolo modello prevale il manuale del fabbricante. &nbsp; <b>c)</b> L\'esito positivo attesta che i parametri rientrano nei valori previsti, non l\'idoneità a impieghi specifici (riferirsi a normative e linee guida). &nbsp; <b>d)</b> ' + esc(company.name || '[Ragione sociale]') + ' non risponde di danni derivanti dall\'inosservanza dei manuali del fabbricante; il Cliente è tenuto a usare l\'apparecchio secondo le istruzioni del Costruttore.</div>'
+ '</div></div></body></html>';
openPrintWindow(html);
}
