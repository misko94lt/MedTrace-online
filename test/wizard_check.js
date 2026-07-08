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

const { FuncWizardForm, IecWizardForm } = await import("../src/components/verifiche.js");
const { PpmWizardForm } = await import("../src/components/ppm.js");
const { FUNC_TEMPLATES } = await import("../src/constants/funcTemplates.js");

const asset = { id: "a1", name: "Monitor di prova", brand: "Test", model: "T-1", serial: "SN1", assetCode: "AST-001", customerId: "c1", cnd: "", epc: "" };
const common = {
  assets: [asset], customers: [{ id: "c1", name: "Clinica di prova" }],
  technicians: [{ name: "Mario Rossi", signature: "" }], instruments: [],
  existingReports: [], onSave: noop, onClose: noop, showToast: noop, onClassic: noop, isAdmin: true,
};

const cases = [
  ["FuncWizardForm", FuncWizardForm, { ...common, templates: FUNC_TEMPLATES, assetId: "a1" }],
  ["FuncWizardForm (senza asset)", FuncWizardForm, { ...common, templates: FUNC_TEMPLATES }],
  ["IecWizardForm", IecWizardForm, { ...common, assetId: "a1" }],
  ["IecWizardForm (senza asset)", IecWizardForm, { ...common }],
  ["PpmWizardForm", PpmWizardForm, { ...common, templates: FUNC_TEMPLATES, existingFunc: [], existingIec: [], onSaveFull: noop, assetId: "a1" }],
  ["PpmWizardForm (senza asset)", PpmWizardForm, { ...common, templates: FUNC_TEMPLATES, existingFunc: [], existingIec: [], onSaveFull: noop }],
];
let failures = 0;
for (const [name, Comp, props] of cases) {
  if (typeof Comp !== "function") { console.error("WIZARD FAIL: " + name + " non esportato"); failures++; continue; }
  try { renderToString(React.createElement(Comp, props)); console.log("\u2713 " + name); }
  catch (e) {
    failures++;
    console.error("WIZARD FAIL (" + name + "): " + String((e && e.message) || e));
    console.error(String((e && e.stack) || "").split("\n").slice(0, 5).join("\n"));
  }
}
if (failures) { console.error("WIZARD CHECK: " + failures + " falliti"); process.exit(1); }
console.log("WIZARD CHECK: tutti e 3 i wizard renderizzati (con e senza asset).");
process.exit(0);
