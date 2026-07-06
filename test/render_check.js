/* Render check — oltre il boot: esegue un RENDER vero di <App /> con
   react-dom/server. Il corpo del componente (useState initializer, useMemo,
   array di dipendenze degli useEffect) viene eseguito davvero: TDZ, riferimenti
   mancanti e crash al primo render falliscono QUI invece che sul telefono.
   Gli useEffect non vengono eseguiti (semantica server render): per quelli
   resta la verifica in preview. Mock DOM duplicati da boot_check di proposito,
   per tenere i due test indipendenti. */
import React from "react";
import { renderToString } from "react-dom/server";
import { createClient } from "@supabase/supabase-js";

const noop = () => {};
const el = () => ({
  style: {}, setAttribute: noop, appendChild: noop, removeChild: noop,
  addEventListener: noop, removeEventListener: noop, focus: noop, blur: noop,
  classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
  getContext: () => null, querySelector: () => null, querySelectorAll: () => [],
});
const storage = () => {
  const d = {};
  return {
    getItem: (k) => (k in d ? d[k] : null),
    setItem: (k, v) => { d[k] = String(v); },
    removeItem: (k) => { delete d[k]; },
    clear: () => { for (const k in d) delete d[k]; },
  };
};
function def(name, val) {
  try { globalThis[name] = val; }
  catch { try { Object.defineProperty(globalThis, name, { value: val, configurable: true }); } catch { /* pazienza */ } }
}

def("window", globalThis);
def("document", {
  getElementById: () => el(), createElement: () => el(), createTextNode: () => ({}),
  querySelector: () => null, querySelectorAll: () => [],
  addEventListener: noop, removeEventListener: noop,
  body: el(), head: el(), documentElement: el(),
  visibilityState: "visible", hidden: false, title: "MedTrace",
});
if (!globalThis.navigator || !("onLine" in globalThis.navigator)) {
  def("navigator", { userAgent: "node-render-check", onLine: true, language: "it",
    serviceWorker: { register: () => Promise.resolve() } });
}
def("localStorage", storage());
def("sessionStorage", storage());
def("matchMedia", () => ({ matches: false, addEventListener: noop, removeEventListener: noop, addListener: noop, removeListener: noop }));
if (typeof globalThis.addEventListener !== "function") def("addEventListener", noop);
if (typeof globalThis.removeEventListener !== "function") def("removeEventListener", noop);
if (!globalThis.location) def("location", { href: "http://localhost/", origin: "http://localhost", hostname: "localhost", protocol: "http:", pathname: "/", search: "", hash: "", reload: noop });
def("alert", noop); def("confirm", () => false); def("prompt", () => null);

globalThis.React = React;
globalThis.supabase = { createClient };

// ReactDOM finto: intercetta il mount e fa un render server-side vero.
let rendered = false;
let renderError = null;
globalThis.ReactDOM = {
  createRoot: () => ({
    render: (element) => {
      try { renderToString(element); rendered = true; }
      catch (e) { renderError = e; }
    },
    unmount: noop,
  }),
};

let mod = null;
try {
  mod = await import("../src/app.js");
} catch (e) {
  console.error("RENDER FAIL (top-level):", String((e && e.message) || e));
  console.error(String((e && e.stack) || "").split("\n").slice(0, 6).join("\n"));
  process.exit(1);
}
if (renderError) {
  console.error("RENDER FAIL (App):", String(renderError.message || renderError));
  console.error(String(renderError.stack || "").split("\n").slice(0, 8).join("\n"));
  process.exit(1);
}
if (!rendered) {
  console.error("RENDER FAIL: il mount non è mai stato raggiunto (createRoot non chiamato).");
  process.exit(1);
}
// App senza sessione ritorna LoginScreen: AppMain (dove vive quasi tutto) va
// renderizzata esplicitamente, altrimenti il test non copre il 90% del codice.
if (typeof mod.AppMain !== "function") {
  console.error("RENDER FAIL: AppMain non esportata da app.js (serve l'export di test).");
  process.exit(1);
}
try {
  renderToString(React.createElement(mod.AppMain));
} catch (e) {
  console.error("RENDER FAIL (AppMain):", String((e && e.message) || e));
  console.error(String((e && e.stack) || "").split("\n").slice(0, 8).join("\n"));
  process.exit(1);
}
console.log("RENDER OK: <App /> e <AppMain /> renderizzate server-side senza errori.");
process.exit(0);
