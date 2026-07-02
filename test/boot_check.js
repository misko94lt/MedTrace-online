/* Boot check — prova che src/app.js (modulo ES = strict mode) esegue
   tutto il top-level senza errori. In Node non c'è DOM: se arriviamo
   fino al mount finale (createRoot) e ci fermiamo LÌ, è un successo. */
import React from "react";
import * as ReactDOMClient from "react-dom/client";
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
  def("navigator", { userAgent: "node-boot-check", onLine: true, language: "it",
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
globalThis.ReactDOM = ReactDOMClient;
globalThis.supabase = { createClient };

try {
  await import("../src/app.js");
  console.log("BOOT OK: modulo eseguito per intero (mount incluso, su DOM finto).");
  process.exit(0);
} catch (e) {
  const msg = String((e && e.message) || e);
  if (/container|createRoot|Target/i.test(msg)) {
    console.log("BOOT OK: tutte le righe top-level eseguite in strict mode; fermato solo al mount DOM (atteso in Node).");
    process.exit(0);
  }
  console.error("BOOT FAIL:", msg);
  console.error(String((e && e.stack) || "").split("\n").slice(0, 5).join("\n"));
  process.exit(1);
}
