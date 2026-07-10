/* MedTrace — entry: bootstrap tema/SW, versione, mount (v3.07) */
import { App, AppMain } from "./components/main.js";
import { bootLoadData } from "./lib/sync.js";
/* MedTrace v2.05 ONLINE */
(function () { try {
var l = document.createElement("link"); l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"; document.head.appendChild(l);
var st = document.createElement("style"); st.textContent = "body,input,button,select,textarea,h1,h2,h3{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;}"; document.head.appendChild(st);
var tk = document.createElement("style"); tk.textContent = "@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');:root{--bg:#0D0D12;--bg-deep:#0a0a0e;--bg-2:#101016;--surface:#15151b;--card:#1a1a22;--surface-2:#1e1e27;--surface-3:#23232e;--surface-4:#2e2e3a;--border:#2a2a38;--border-2:#23232e;--border-3:#2e2e3a;--border-4:#2a2a38;--text:#e8e8ef;--text-strong:#f0f0f5;--text-2:#9a9aab;--text-3:#6a6a78;--text-4:#56564e;--ok-bg:#06231f;--warn-bg:#1f1808;--err-bg:#1f0e0e;--info-bg:#101820;--acc-slate:#94a3b8;--acc-teal:#2dd4bf;--acc-purple:#a855f7;--acc-cyan:#22d3ee;--acc-amber:#f59e0b;--acc-green:#22c55e;--text-bright:#f0f0f5;}[data-theme='light']{--bg:#e4e9f1;--bg-deep:#d8dfe9;--bg-2:#e0e6ef;--surface:#ffffff;--card:#ffffff;--surface-2:#eef2f7;--surface-3:#e3e9f1;--surface-4:#d6dde7;--border:#b4c1d3;--border-2:#c6d1e0;--border-3:#bfcbda;--border-4:#b4c1d3;--text:#14202e;--text-strong:#0b1320;--text-2:#445268;--text-3:#586579;--text-4:#737f92;--ok-bg:#e7f6ee;--warn-bg:#fbf2dd;--err-bg:#fdeaea;--info-bg:#eaf1fb;--acc-slate:#475569;--acc-teal:#0d9488;--acc-purple:#7c3aed;--acc-cyan:#0e7490;--acc-amber:#b45309;--acc-green:#15803d;--text-bright:#0b1320;}html,body{background:var(--bg);color:var(--text);font-family:'IBM Plex Sans',system-ui,sans-serif;}input:focus,textarea:focus,select:focus{border-color:#2dd4bf;box-shadow:0 0 0 3px rgba(45,212,191,.18);} body{transition:background-color .2s ease;}"; document.head.appendChild(tk);
if (localStorage.getItem('mt-theme') === 'light') document.documentElement.setAttribute('data-theme', 'light');
var tgl = function(){ var d = document.documentElement; if (d.getAttribute('data-theme') === 'light'){ d.removeAttribute('data-theme'); localStorage.setItem('mt-theme','dark'); } else { d.setAttribute('data-theme','light'); localStorage.setItem('mt-theme','light'); } };
var addToggle = function(){ if (document.getElementById('mt-theme-btn')) return; var b = document.createElement('button'); b.id='mt-theme-btn'; b.type='button'; b.title='Tema chiaro / scuro'; b.innerHTML='\u25D0'; b.style.cssText='position:fixed;left:12px;bottom:12px;z-index:99998;width:38px;height:38px;border-radius:50%;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:17px;line-height:1;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.35);opacity:.5;transition:opacity .15s;display:flex;align-items:center;justify-content:center;'; b.onmouseenter=function(){b.style.opacity='1';}; b.onmouseleave=function(){b.style.opacity='.5';}; b.onclick=tgl; document.body.appendChild(b); };
window.__mtToggle = tgl;
} catch (e) {} })();










// ===== PPM (Manutenzione Programmata) — checklist meccaniche/manutentive =====
// Checklist di DEFAULT per CATEGORIA (stesso id dei template funzionali).
// Le voci specifiche per MODELLO si aggiungono via custom e vengono UNITE a queste.
// Custom: aggiunte per CATEGORIA (byCat) e per MODELLO (byModel, key = "marca|modello"), in localStorage.
// Categoria PPM = stessa logica di auto-rilevamento dei template funzionali.
// Helper di normalizzazione (minuscolo, senza accenti, spazi compattati) per il match di modello.
// Checklist di DEFAULT per MODELLO, pre-caricate dal codice. Si AGGIUNGONO a quelle di categoria.
// "model"/"brand" sono sottostringhe normalizzate cercate in marca/modello/nome dell'apparecchio.
// Restituisce le voci di default del MODELLO se l'apparecchio corrisponde, altrimenti null.
// Voci checklist UNITE: categoria default + categoria custom + modello custom (deduplicate).










App;
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
export { App, AppMain }; // export di test: render_check renderizza AppMain direttamente (nell'app vera ci si arriva solo da loggati)
