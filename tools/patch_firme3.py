#!/usr/bin/env python3
# patch_firme3.py — v2.94: vista compatta quando la firma tecnico viene dal profilo
import sys

def die(m): print("ABORT:", m); sys.exit(1)

U = open('src/components/ui.js').read()
V = open('src/components/verifiche.js').read()
A = open('src/app.js').read()
W = open('public/sw.js').read()
if 'const APP_VERSION = "2.93";' not in A: die("APP_VERSION attesa 2.93")
if "const CACHE_VERSION = 'medtrace-v3-18';" not in W: die("CACHE_VERSION attesa medtrace-v3-18")

def repN(s, old, new, n, label):
    c = s.count(old)
    if c != n: die(f"{label}: occorrenze {c} (attese {n})")
    return s.replace(old, new)

# ---------- 1) ui.js: TechSignatureField ----------
U += '''
/* — campo firma tecnico: compatto se la firma viene dal profilo, pad completo altrimenti (v2.94) — */
export function TechSignatureField({ value, onChange, profileSig, techName, label, height = 120 }) {
const [editing, setEditing] = React.useState(false);
const fromProfile = !!value && !!profileSig && value === profileSig && !editing;
if (fromProfile)
return React.createElement("div", { style: { background: "var(--surface)", border: "1px solid #2dd4bf55", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 } },
React.createElement("div", { style: { fontSize: 12.5, color: "var(--text)", fontWeight: 600 } }, "\\u2713 Firma tecnico applicata dal profilo" + (techName ? " di " + techName : "")),
React.createElement("button", { type: "button", onClick: () => setEditing(true), style: { background: "transparent", border: "1px solid var(--border)", borderRadius: 7, color: "var(--text-2)", fontSize: 11, fontWeight: 700, cursor: "pointer", padding: "4px 9px", whiteSpace: "nowrap" } }, "Firma diversa"));
return React.createElement(SignaturePad, { label: label || "Firma Tecnico verificatore (obbligatoria)", value: value || "", onChange: onChange, height: height });
}
'''

# ---------- 2) verifiche.js: import + 6 sostituzioni ----------
V = repN(V, 'import { Hint, useMedia, AssetCombobox, ErrorSummary, SignaturePad } from "./ui.js";',
            'import { Hint, useMedia, AssetCombobox, ErrorSummary, SignaturePad, TechSignatureField } from "./ui.js";', 1, "import verifiche")
V = repN(V,
 'h(SignaturePad, { label: "Firma Tecnico verificatore (obbligatoria)", value: f.technicianSignature || "", onChange: v => setF(x => Object.assign({}, x, { technicianSignature: v })), height: 120 }),',
 'h(TechSignatureField, { profileSig: techSignature(technicians, f.technician), techName: f.technician, value: f.technicianSignature || "", onChange: v => setF(x => Object.assign({}, x, { technicianSignature: v })), height: 120 }),',
 2, "wizard Func+IEC")
V = repN(V,
 'React.createElement(SignaturePad, { label: "Firma Tecnico verificatore", value: f.technicianSignature || "", onChange: v => setF(x => (Object.assign(Object.assign({}, x), { technicianSignature: v }))), height: 120 }),',
 'React.createElement(TechSignatureField, { label: "Firma Tecnico verificatore", profileSig: techSignature(technicians, f.technician), techName: f.technician, value: f.technicianSignature || "", onChange: v => setF(x => (Object.assign(Object.assign({}, x), { technicianSignature: v }))), height: 120 }),',
 2, "classica Func")
V = repN(V,
 'React.createElement(SignaturePad, { label: "Firma Tecnico verificatore", value: f.technicianSignature, onChange: v => setF(x => (Object.assign(Object.assign({}, x), { technicianSignature: v }))), height: 120 }),',
 'React.createElement(TechSignatureField, { label: "Firma Tecnico verificatore", profileSig: techSignature(technicians, f.technician), techName: f.technician, value: f.technicianSignature, onChange: v => setF(x => (Object.assign(Object.assign({}, x), { technicianSignature: v }))), height: 120 }),',
 2, "classica IEC")

# ---------- 3) app.js: import + 3 sostituzioni ----------
A = repN(A, 'import { SignaturePad } from "./components/ui.js";',
            'import { SignaturePad, TechSignatureField } from "./components/ui.js";', 1, "import app")
A = repN(A,
 'h(SignaturePad, { label: "Firma Tecnico verificatore (obbligatoria)", value: f.technicianSignature || "", onChange: v => setF(x => Object.assign({}, x, { technicianSignature: v })), height: 120 }),',
 'h(TechSignatureField, { profileSig: techSignature(technicians, f.technician), techName: f.technician, value: f.technicianSignature || "", onChange: v => setF(x => Object.assign({}, x, { technicianSignature: v })), height: 120 }),',
 1, "ppm wizard")
A = repN(A,
 'React.createElement(SignaturePad, { label: "Firma Tecnico verificatore (obbligatoria)", value: f.technicianSignature || "", onChange: function (v) { setF(function (x) { return Object.assign({}, x, { technicianSignature: v }); }); }, height: 120 }),',
 'React.createElement(TechSignatureField, { profileSig: techSignature(technicians, f.technician), techName: f.technician, value: f.technicianSignature || "", onChange: function (v) { setF(function (x) { return Object.assign({}, x, { technicianSignature: v }); }); }, height: 120 }),',
 1, "ppm verify")
A = repN(A,
 'React.createElement(SignaturePad, { label: "Firma Tecnico (obbligatoria alla chiusura)", value: f.technicianSignature || "", onChange: v => setF(x => (Object.assign(Object.assign({}, x), { technicianSignature: v }))), height: 120 }),',
 'React.createElement(TechSignatureField, { label: "Firma Tecnico (obbligatoria alla chiusura)", profileSig: techSignature(technicians, f.assignee), techName: f.assignee, value: f.technicianSignature || "", onChange: v => setF(x => (Object.assign(Object.assign({}, x), { technicianSignature: v }))), height: 120 }),',
 1, "job")

# ---------- 4) bump ----------
A = repN(A, 'const APP_VERSION = "2.93";', 'const APP_VERSION = "2.94";', 1, "APP_VERSION")
W = repN(W, "const CACHE_VERSION = 'medtrace-v3-18';", "const CACHE_VERSION = 'medtrace-v3-19';", 1, "CACHE_VERSION")

open('src/components/ui.js', 'w').write(U)
open('src/components/verifiche.js', 'w').write(V)
open('src/app.js', 'w').write(A)
open('public/sw.js', 'w').write(W)
print("OK: TechSignatureField v2.94 / medtrace-v3-19")
