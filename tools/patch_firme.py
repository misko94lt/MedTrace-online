#!/usr/bin/env python3
# patch_firme.py — v2.92: firma a profilo tecnico + firme nei wizard + precompilazione + obbligo firma tecnico
import re, sys

def die(m): print("ABORT:", m); sys.exit(1)

V = open('src/components/verifiche.js').read()
U = open('src/components/ui.js').read()
S = open('src/components/shared.js').read()
A = open('src/app.js').read()
W = open('public/sw.js').read()
if 'const APP_VERSION = "2.91";' not in A: die("APP_VERSION attesa 2.91")
if "const CACHE_VERSION = 'medtrace-v3-16';" not in W: die("CACHE_VERSION attesa medtrace-v3-16")

def rep1(s, old, new, label):
    if s.count(old) != 1: die(f"{label}: occorrenze {s.count(old)} (attesa 1)")
    return s.replace(old, new)

def rep_nth(s, old, new, n, label):
    parts = s.split(old)
    if len(parts) - 1 < n: die(f"{label}: solo {len(parts)-1} occorrenze")
    return old.join(parts[:n]) + new + old.join(parts[n:])

# ---------- 1) SignaturePad: da verifiche.js a ui.js ----------
mark = "\nconst SignaturePad = ({ value, onChange, label, height = 140 }) => {"
i = V.find(mark)
if i < 0: die("blocco SignaturePad non trovato")
frag = V[i:]
V = V[:i] + "\n"
U = U + "\n/* — firma su canvas (spostata dal modulo verifiche: ora serve anche alle impostazioni tecnici, v2.92) — */\nexport" + frag.replace("\nconst SignaturePad", " const SignaturePad", 1)
# import in verifiche: SignaturePad da ui, techSignature da shared
V = rep1(V, 'import { Hint, useMedia, AssetCombobox, ErrorSummary } from "./ui.js";',
            'import { Hint, useMedia, AssetCombobox, ErrorSummary, SignaturePad } from "./ui.js";', "import ui")
V = rep1(V, 'import { TecnicoPicker, Btn, chkRow } from "./shared.js";',
            'import { TecnicoPicker, Btn, chkRow, techSignature } from "./shared.js";', "import shared")

# ---------- 2) render firme nello step esito dei due wizard ----------
firme = ('h("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 } },\n'
 'h(SignaturePad, { label: "Firma Tecnico verificatore (obbligatoria)", value: f.technicianSignature || "", onChange: v => setF(x => Object.assign({}, x, { technicianSignature: v })), height: 120 }),\n'
 'h(SignaturePad, { label: "Firma Referente reparto (opzionale)", value: f.departmentSignature || "", onChange: v => setF(x => Object.assign({}, x, { departmentSignature: v })), height: 120 }))')
oldF = ', placeholder: "Annotazioni finali\u2026", style: { width: "100%", minHeight: 64, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "10px", fontSize: 13, resize: "vertical", fontFamily: "inherit" } })));'
V = rep1(V, oldF, oldF[:-2] + ",\n" + firme + ");", "firme wizard Func")
oldI = ', placeholder: "Annotazioni finali, raccomandazioni\u2026", style: { width: "100%", minHeight: 70, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "10px", fontSize: 13, resize: "vertical", fontFamily: "inherit" } })));'
V = rep1(V, oldI, oldI[:-2] + ",\n" + firme + ");", "firme wizard IEC")

# ---------- 3) precompilazione dal profilo tecnico ----------
effW = 'React.useEffect(() => { if (sObj.key !== "esito" || f.technicianSignature) return; const sig = techSignature(technicians, f.technician); if (sig) setF(x => Object.assign({}, x, { technicianSignature: sig })); }, [sObj.key]);\n'
goF = 'const go = (i) => { setStep(Math.max(0, Math.min(TOT - 1, i))); try { window.scrollTo(0, 0); } catch (e) { } };\n'
V = rep1(V, goF, goF + effW, "effect wizard Func")
goI = 'const go = (i) => { setStep(Math.max(0, Math.min(TOT - 1, i))); setTutOpen(false); try { window.scrollTo(0, 0); } catch (e) { } };\n'
V = rep1(V, goI, goI + effW, "effect wizard IEC")
effC = 'React.useEffect(() => { if (f.technicianSignature) return; const sig = techSignature(technicians, f.technician); if (sig) setF(x => Object.assign({}, x, { technicianSignature: sig })); }, [f.technician]);\n'
errLine = 'const [errors, setErrors] = React.useState({});\n'
V = rep_nth(V, errLine, errLine + effC, 1, "effect classica Func")
V = rep_nth(V, errLine, errLine + effC, 2, "effect classica IEC")

# ---------- 4) obbligo firma tecnico ----------
V = rep1(V, 'const doSave = () => { if (!f.assetId) return; const cid = ast ? ast.customerId : null;',
            'const doSave = () => { if (!f.assetId) return; if (!f.technicianSignature) { showToast && showToast("Firma del tecnico obbligatoria", "#ef4444"); go(TOT - 1); return; } const cid = ast ? ast.customerId : null;', "save wizard Func")
V = rep1(V, 'const doSave = () => { if (!f.assetId) return; onSave(Object.assign({}, f, { overallPass: overall })); };',
            'const doSave = () => { if (!f.assetId) return; if (!f.technicianSignature) { try { window.dispatchEvent(new CustomEvent("toast", { detail: { msg: "Firma del tecnico obbligatoria", color: "#ef4444" } })); } catch (e) { } go(TOT - 1); return; } onSave(Object.assign({}, f, { overallPass: overall })); };', "save wizard IEC")
V = rep1(V, 'var _conclude=function(){if(!_validate())return;var _miss=[];',
            'var _conclude=function(){if(!_validate())return;if(f.verifyStatus!=="non_disponibile"&&!f.technicianSignature){showToast&&showToast("Firma del tecnico obbligatoria per concludere","#ef4444");return;}var _miss=[];', "conclude classica Func")
V = rep1(V, 'var _conclude=function(){if(!_validate())return;onSave(Object.assign',
            'var _conclude=function(){if(!_validate())return;if(f.verifyStatus!=="non_disponibile"&&!f.technicianSignature){try{window.dispatchEvent(new CustomEvent("toast",{detail:{msg:"Firma del tecnico obbligatoria per concludere",color:"#ef4444"}}));}catch(e){}return;}onSave(Object.assign', "conclude classica IEC")

# ---------- 5) shared.js: import SignaturePad, TecniciManager a oggetti + firma, helper techSignature ----------
S = rep1(S, 'import { FORM_INP, FORM_LBL, FORM_FLD, FORM_ROW, FORM_COL, FORM_SECTION, FORM_BTN_PRIMARY, FORM_BTN_GHOST, STATUS_COLOR } from "../constants/ui.js";',
            'import { FORM_INP, FORM_LBL, FORM_FLD, FORM_ROW, FORM_COL, FORM_SECTION, FORM_BTN_PRIMARY, FORM_BTN_GHOST, STATUS_COLOR } from "../constants/ui.js";\nimport { SignaturePad } from "./ui.js";', "import shared ui")
tmStart = "export function TecniciManager({ technicians, onChange }) {"
tmEnd = "\n\nexport function chkRow"
a = S.find(tmStart); b = S.find(tmEnd)
if a < 0 or b < 0 or b <= a: die("marker TecniciManager non trovati")
newTM = '''export function TecniciManager({ technicians, onChange }) {
const raw = (technicians || []).map(t => typeof t === "string" ? { name: t } : (t || {})).filter(t => t && t.name);
const [name, setName] = React.useState("");
const [sigFor, setSigFor] = React.useState(null);
const add = () => { const nm = name.trim(); if (nm && !raw.some(x => String(x.name).toLowerCase() === nm.toLowerCase()))
onChange(raw.concat([{ name: nm }])); setName(""); };
const remove = nm => onChange(raw.filter(x => x.name !== nm));
const setSig = (nm, sig) => onChange(raw.map(x => x.name === nm ? Object.assign({}, x, { signature: sig || "" }) : x));
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
React.createElement("div", { style: { fontSize: 11.5, color: "var(--text-2)", lineHeight: 1.55 } }, "I tecnici registrati qui compaiono in una tendina quando crei un Job o una verifica. La firma salvata qui viene proposta in automatico nei report, cos\\u00ec non serve rifirmare ogni volta."),
raw.length > 0 ? (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, raw.map(t => (React.createElement("div", { key: t.name, style: { background: "var(--card)", border: "1px solid var(--border-3)", borderRadius: 9, padding: "10px 14px" } },
React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 } },
React.createElement("span", { style: { fontSize: 13.5, color: "var(--text)", fontWeight: 600 } }, t.name),
React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
React.createElement("button", { type: "button", onClick: () => setSigFor(sigFor === t.name ? null : t.name), style: { background: "transparent", border: "1px solid " + (t.signature ? "#2dd4bf" : "var(--border)"), borderRadius: 7, color: t.signature ? "#2dd4bf" : "var(--text-2)", fontSize: 11, fontWeight: 700, cursor: "pointer", padding: "4px 9px" } }, t.signature ? "Firma \\u2713" : "Firma"),
React.createElement("button", { type: "button", onClick: () => remove(t.name), title: "Rimuovi", style: { background: "transparent", border: "none", color: "#ef4444", fontSize: 16, cursor: "pointer" } }, "\\u2715"))),
sigFor === t.name ? React.createElement("div", { style: { marginTop: 10 } },
React.createElement(SignaturePad, { label: "Firma di " + t.name + " (proposta in automatico nei report)", value: t.signature || "", onChange: v => setSig(t.name, v), height: 120 })) : null))))) : React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)" } }, "Nessun tecnico ancora. Aggiungine uno qui sotto."),
React.createElement("div", { style: { display: "flex", gap: 6 } },
React.createElement("input", { value: name, onChange: e => setName(e.target.value), onKeyDown: e => { if (e.key === "Enter") {
e.preventDefault();
add();
} }, placeholder: "Nome tecnico (es. Mario Rossi)", style: { flex: 1, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "10px 12px", fontSize: 13.5 } }),
React.createElement("button", { type: "button", onClick: add, style: { background: "#2dd4bf", border: "none", borderRadius: 8, color: "#04201C", padding: "0 16px", fontSize: 14, fontWeight: 800, cursor: "pointer" } }, "Aggiungi"))));
}

export function techSignature(technicians, nameStr) {
const names = String(nameStr || "").split(",").map(x => x.trim()).filter(Boolean);
for (const nm of names) {
const t = (technicians || []).find(x => x && typeof x === "object" && String(x.name || "").toLowerCase() === nm.toLowerCase());
if (t && t.signature) return t.signature;
}
return "";
}'''
S = S[:a] + newTM + S[b:]

# ---------- 6) bump ----------
A = rep1(A, 'const APP_VERSION = "2.91";', 'const APP_VERSION = "2.92";', "APP_VERSION")
W = rep1(W, "const CACHE_VERSION = 'medtrace-v3-16';", "const CACHE_VERSION = 'medtrace-v3-17';", "CACHE_VERSION")

open('src/components/verifiche.js', 'w').write(V)
open('src/components/ui.js', 'w').write(U)
open('src/components/shared.js', 'w').write(S)
open('src/app.js', 'w').write(A)
open('public/sw.js', 'w').write(W)
print("OK: firme v2.92 / medtrace-v3-17")
