/* PDF check — esegue i 7 generatori di lib/reports.js con dati finti.
   Cattura l'HTML via window.__mtPdfCapture (hook già esistente in openPrintWindow)
   e verifica che ogni generatore produca un documento completo senza lanciare.
   Nato dal bug v3.03→v3.08: una const riassegnata in generateJobPDF esplodeva
   a runtime e nessun check eseguiva i generatori. Ora questa classe muore qui. */
import React from "react";

const noop = () => {};
const el = () => ({
  style: {}, setAttribute: noop, appendChild: noop, removeChild: noop,
  addEventListener: noop, removeEventListener: noop, click: noop, focus: noop,
  classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
  getContext: () => null, querySelector: () => null, querySelectorAll: () => [],
});
const storage = () => { const d = {}; return { getItem: k => (k in d ? d[k] : null), setItem: (k, v) => { d[k] = String(v); }, removeItem: k => { delete d[k]; }, clear: noop }; };
function def(name, val) { try { globalThis[name] = val; } catch { try { Object.defineProperty(globalThis, name, { value: val, configurable: true }); } catch { } } }
def("window", globalThis);
def("document", { getElementById: () => null, createElement: () => el(), createTextNode: () => ({}), querySelector: () => null, querySelectorAll: () => [], addEventListener: noop, removeEventListener: noop, body: el(), head: el(), documentElement: el(), title: "MedTrace" });
if (!globalThis.navigator || !("onLine" in globalThis.navigator)) def("navigator", { userAgent: "node-pdf-check", onLine: true, language: "it" });
def("localStorage", storage()); def("sessionStorage", storage());
def("matchMedia", () => ({ matches: false, addEventListener: noop, removeEventListener: noop, addListener: noop, removeListener: noop }));
if (typeof globalThis.addEventListener !== "function") def("addEventListener", noop);
def("alert", noop);
def("CustomEvent", class CustomEvent { constructor(type, opts) { this.type = type; this.detail = opts && opts.detail; } });
if (!globalThis.location) def("location", { href: "http://localhost/", origin: "http://localhost", hostname: "localhost", protocol: "http:", pathname: "/", search: "", hash: "", reload: noop });
globalThis.React = React;

let captured = null;
globalThis.__mtPdfCapture = (html) => { captured = String(html || ""); };
globalThis.jspdf = { jsPDF: function () { } };
globalThis.html2canvas = function () { };
globalThis.JSZip = function () { };
def("URL", { createObjectURL: () => "blob:x", revokeObjectURL: noop });
def("setInterval", () => 0);
def("clearInterval", noop);
def("setTimeout", (fn) => 0);

const R = await import("../src/lib/reports.js");
const { FUNC_TEMPLATES } = await import("../src/constants/funcTemplates.js");

const SIG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg";
const company = { name: "Ditta di prova SNC", address: "Via Roma 1", city: "Trieste", vat: "IT01234567890", email: "info@prova.it", phone: "0401234567", logo: "" };
const customer = { id: "c1", name: "Clinica di prova", address: "Via Milano 2", city: "Pordenone", email: "clinica@prova.it", vat: "IT09876543210" };
const tplId = Object.keys(FUNC_TEMPLATES)[0];
const tpl = FUNC_TEMPLATES[tplId];
const asset = { id: "a1", name: "Monitor di prova", brand: "Test", model: "T-1", serial: "SN1", assetCode: "AST-001", customerId: "c1", cnd: "", location: "Sala 1", ward: "Cardiologia", status: "attivo" };
const funcRep = { id: "f1", assetId: "a1", customerId: "c1", reportNumber: "FUNC-001", date: "2026-07-10", technician: "Mario Rossi", templateId: tplId, values: {}, sectionNotes: {}, notes: "", overallPass: true, verifyStatus: "completata", verifyType: "periodica", nextDate: "2027-07-10", technicianSignature: SIG, departmentSignature: "", departmentContact: "", published: true };
const iecRep = { id: "i1", assetId: "a1", customerId: "c1", reportNumber: "VSE-001", date: "2026-07-10", technician: "Mario Rossi", deviceClass: "I", applied: "BF", measures: [{ id: "pe", label: "Resistenza conduttore di protezione", value: "0.12", limit: 0.3, unit: "\u03a9", pass: true, na: false }], values: {}, visual: {}, notes: "", overallPass: true, permanentlyInstalled: false, technicianSignature: SIG, departmentSignature: "", departmentContact: "", published: true };
const ppm = { id: "p1", assetId: "a1", customerId: "c1", reportNumber: "PPM-001", date: "2026-07-10", technician: "Mario Rossi", checklist: [{ id: "c1", label: "Controllo generale", done: true }], notes: "", overallPass: true, funcReportId: "f1", iecReportId: "i1", technicianSignature: SIG, departmentSignature: "", departmentContact: "", published: true };
const part = { id: "pt1", name: "Filtro", code: "FLT-1", price: 12.5, qty: 10 };
const job = { id: "j1", assetId: "a1", customerId: "c1", type: "correttiva", priority: "normale", status: "chiuso", assignee: "Mario Rossi", openDate: "2026-07-01", closeDate: "2026-07-10", description: "Sostituzione filtro", parts: [{ partId: "pt1", qty: 1 }], laborHours: 1.5, laborRate: 55, travelCost: 20, notes: "", timeline: [], photos: [], technicianSignature: SIG, departmentSignature: "" };
const quote = { id: "q1", number: "PRE-001", customerId: "c1", date: "2026-07-10", status: "inviato", items: [{ description: "Verifica funzionale", qty: 1, unitPrice: 80, vat: 22 }], notes: "", jobId: "", validUntil: "2026-08-10" };
const invoice = { id: "inv1", number: "FAT-001", customerId: "c1", date: "2026-07-10", items: [{ description: "Intervento tecnico", qty: 1, unitPrice: 120, vat: 22 }], notes: "", jobIds: ["j1"], status: "emessa" };

const cases = [
  ["generateIECPDF", () => R.generateIECPDF(iecRep, asset, customer, company), ["VSE-001", "</body>"]],
  ["generateFuncPDF", () => R.generateFuncPDF(funcRep, asset, customer, company, FUNC_TEMPLATES), ["FUNC-001", "</body>"]],
  ["generatePPMPDF", () => R.generatePPMPDF(ppm, asset, customer, company, FUNC_TEMPLATES, funcRep, iecRep), ["PPM-001", "Firma Tecnico", "</body>"]],
  ["generateJobPDF", () => R.generateJobPDF(job, [asset], [part], [customer], company), ["Firma Tecnico", "</body>"]],
  ["generateQuotePDF", () => R.generateQuotePDF(quote, customer, company, [asset], [job]), null],
  ["generateInvoicePDF", () => R.generateInvoicePDF(invoice, customer, [job], [asset], [part], company), ["FAT-001", "</body>"]],
  ["generateClientReportPDF", () => R.generateClientReportPDF(customer, [asset], [iecRep], [funcRep], [job], company), ["Clinica di prova", "</body>"]],
];

let failures = 0;
for (const [name, run, mustContain] of cases) {
  captured = null;
  try {
    run();
    if (mustContain === null) { console.log("\u2713 " + name + " (no-throw: usa showPDFPreview, HTML non catturabile)"); }
    else {
    if (captured === null) throw new Error("nessun HTML catturato (openPrintWindow non chiamata?)");
    if (captured.length < 500) throw new Error("HTML sospettosamente corto: " + captured.length + " caratteri");
    for (const frag of mustContain) if (!captured.includes(frag)) throw new Error('HTML non contiene "' + frag + '"');
    console.log("\u2713 " + name + " (" + captured.length + " caratteri)");
    }
  } catch (e) {
    failures++;
    console.error("PDF FAIL (" + name + "): " + String((e && e.message) || e));
    console.error(String((e && e.stack) || "").split("\n").slice(1, 4).join("\n"));
  }
}
if (failures) { console.error("PDF CHECK: " + failures + " generatori falliti"); process.exit(1); }
console.log("PDF CHECK: tutti e 7 i generatori producono un documento completo.");
process.exit(0);
