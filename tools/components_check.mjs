/* Wizard check — renderizza server-side i tre wizard (Func, IEC, PPM) come moduli
   veri, con props minime. Chiude i tre "test rinviato a Fase 1" del validate:
   la Fase 1 è arrivata. Mock DOM come render_check, volutamente duplicati. */
import React from "react";
import { renderToString } from "react-dom/server";

const noop = () => {};
const el = () => ({
  style: {}, setAttribute: noop, appendChild: noop, removeChild: noop,
  addEventListener: noop, removeEventListener: noop, focus: noop, blur: noop,
  classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
  getContext: () => null, querySelector: () => null, querySelectorAll: () => [],
});
const storage = () => { const d = {}; return { getItem: k => (k in d ? d[k] : null), setItem: (k, v) => { d[k] = String(v); }, removeItem: k => { delete d[k]; }, clear: noop }; };
function def(name, val) { try { globalThis[name] = val; } catch { try { Object.defineProperty(globalThis, name, { value: val, configurable: true }); } catch { } } }
def("window", globalThis);
def("document", { getElementById: () => el(), createElement: () => el(), createTextNode: () => ({}), querySelector: () => null, querySelectorAll: () => [], addEventListener: noop, removeEventListener: noop, body: el(), head: el(), documentElement: el(), visibilityState: "visible", hidden: false, title: "MedTrace" });
if (!globalThis.navigator || !("onLine" in globalThis.navigator)) def("navigator", { userAgent: "node-wizard-check", onLine: true, language: "it" });
def("localStorage", storage()); def("sessionStorage", storage());
def("matchMedia", () => ({ matches: false, addEventListener: noop, removeEventListener: noop, addListener: noop, removeListener: noop }));
if (typeof globalThis.addEventListener !== "function") def("addEventListener", noop);
if (typeof globalThis.removeEventListener !== "function") def("removeEventListener", noop);
if (!globalThis.location) def("location", { href: "http://localhost/", origin: "http://localhost", hostname: "localhost", protocol: "http:", pathname: "/", search: "", hash: "", reload: noop });
globalThis.React = React;

const dataVuota = { assets: [], customers: [], jobs: [], parts: [], orders: [], withdrawals: [], invoices: [], quotes: [], instruments: [], procedures: [], iecReports: [], funcReports: [], recalls: [], company: {}, customTemplates: {}, cestino: {} };
const fn = () => {};
const base = { onClose: fn, onSave: fn, showToast: fn, setToast: fn, data: dataVuota, isAdmin: true, isSuperuser: true };

const targets = [
  ["settings.js", "SettingsModal", { ...base, onCloudPull: fn, onCloudPush: fn, onReplaceAll: fn, userRole: "superuser", technicians: [], onSaveTechnicians: fn, company: {}, onSaveCompany: fn }],
  ["assets.js", "ImportAssetsModal", { ...base, customers: [], onImport: fn }],
  ["assets.js", "AssetForm", { ...base, asset: null, customers: [], assets: [] }],
  ["assets.js", "TimelineModal", { ...base, job: { id: "j1", timeline: [], title: "Test", status: "aperto" }, parts: [] }],
  ["assets.js", "WithdrawalModal", { ...base, parts: [{ id: "p1", code: "P-1", name: "Parte", qty: 3, minQty: 1 }], assets: [], preselectPartId: null, onWithdraw: fn }],
  ["assets.js", "StickerModal", { ...base, kind: "asset", report: { id: "r1", date: "2026-01-01", reportNumber: "VSE-1" }, asset: { id: "x", assetCode: "T-1", name: "Test" }, customer: { id: "c1", name: "Cliente" }, company: {}, assets: [] }],
  ["fatturazione.js", "InvoiceForm", { ...base, initial: null, customers: [], jobs: [], assets: [], parts: [], generateNumber: () => "F-0001/2026" }],
  ["strumenti.js", "TemplateEditor", { ...base, template: null, onSaveTemplate: fn }],
];

let fail = 0;
for (const [file, name, props] of targets) {
  try {
    const mod = await import("../src/components/" + file);
    const C = mod[name];
    if (!C) throw new Error("export non trovato");
    renderToString(React.createElement(C, props));
    console.log("  ok " + name);
  } catch (e) {
    fail++;
    console.error("  FAIL " + name + " (" + file + "): " + String(e.message || e).slice(0, 140));
  }
}
if (fail) { console.error("components_check: " + fail + " componenti falliti"); process.exit(1); }
console.log("components_check OK (" + targets.length + " componenti)");
