/* MedTrace — infrastruttura i18n minimale: t(testo italiano) → traduzione o fallback.
   La lingua è persistita in mt-lang; il cambio ricarica l'app per coerenza totale. */
import { EN } from "./i18n_en.js";
let LANG = "it";
try { LANG = (typeof localStorage !== "undefined" && localStorage.getItem("mt-lang")) || "it"; } catch (e) { }
export function getLang() { return LANG; }
export function setLang(l) {
const v = l === "en" ? "en" : "it";
try { localStorage.setItem("mt-lang", v); } catch (e) { }
try { location.reload(); } catch (e) { }
}
export function t(s) {
if (LANG === "en") { const v = EN[s]; if (v !== undefined) return v; }
return s;
}
