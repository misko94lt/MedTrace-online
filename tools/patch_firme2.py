#!/usr/bin/env python3
# patch_firme2.py — v2.93: firme su Job + PPM (wizard e checklist), precompilazione, obblighi
import sys

def die(m): print("ABORT:", m); sys.exit(1)

A = open('src/app.js').read()
W = open('public/sw.js').read()
if 'const APP_VERSION = "2.92";' not in A: die("APP_VERSION attesa 2.92")
if "const CACHE_VERSION = 'medtrace-v3-17';" not in W: die("CACHE_VERSION attesa medtrace-v3-17")

def rep1(s, old, new, label):
    if s.count(old) != 1: die(f"{label}: occorrenze {s.count(old)} (attesa 1)")
    return s.replace(old, new)

# ---------- A) import ----------
impV = 'import { FuncVerifyForm, FuncWizardForm, IECReportForm, IecWizardForm } from "./components/verifiche.js";\n'
A = rep1(A, impV, impV + 'import { SignaturePad } from "./components/ui.js";\nimport { techSignature } from "./components/shared.js";\n', "import firme")

# ---------- B) JobForm ----------
A = rep1(A, 'notes: "", timeline: [], photos: [] };',
            'notes: "", timeline: [], photos: [], technicianSignature: "", departmentSignature: "" };', "blank job")
addPart = 'const addPart = () => setF(x => { var _a; return (Object.assign(Object.assign({}, x), { parts: [...x.parts, { partId: ((_a = parts[0]) === null || _a === void 0 ? void 0 : _a.id) || "", qty: 1 }] })); });'
eff = 'React.useEffect(() => { if (f.technicianSignature) return; const sig = techSignature(technicians, f.assignee); if (sig) setF(x => (Object.assign(Object.assign({}, x), { technicianSignature: sig }))); }, [f.assignee]);\n'
A = rep1(A, addPart, eff + addPart, "effect job")
A = rep1(A, 'if (f.status === "chiuso" && !f.closeDate)\nerrs.closeDate = "Data chiusura obbligatoria se lo stato \u00e8 chiuso";',
            'if (f.status === "chiuso" && !f.closeDate)\nerrs.closeDate = "Data chiusura obbligatoria se lo stato \u00e8 chiuso";\nif (f.status === "chiuso" && !f.technicianSignature)\nerrs.technicianSignature = "Firma del tecnico obbligatoria per chiudere l\'intervento";', "obbligo job")
jobNote = 'React.createElement(Txt, { label: "Note", value: f.notes, onChange: s("notes") }),'
firmeJob = ('React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 } },\n'
 'React.createElement(SignaturePad, { label: "Firma Tecnico (obbligatoria alla chiusura)", value: f.technicianSignature || "", onChange: v => setF(x => (Object.assign(Object.assign({}, x), { technicianSignature: v }))), height: 120 }),\n'
 'React.createElement(SignaturePad, { label: "Firma Referente reparto (opzionale)", value: f.departmentSignature || "", onChange: v => setF(x => (Object.assign(Object.assign({}, x), { departmentSignature: v }))), height: 120 })),\n'
 'errors.technicianSignature ? React.createElement("div", { style: { fontSize: 11, color: "#ef4444" } }, errors.technicianSignature) : null,\n')
A = rep1(A, jobNote, jobNote + "\n" + firmeJob, "render firme job")

# ---------- C) PpmWizardForm ----------
A = rep1(A, 'assetId: aid, templateId: tplId, categoryId: cl.categoryId,',
            'assetId: aid, templateId: tplId, categoryId: cl.categoryId,\ntechnicianSignature: "", departmentSignature: "",', "buildState ppm")
ppmNote = ', placeholder: "Annotazioni finali\u2026", style: { width: "100%", minHeight: 64, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "10px", fontSize: 13, resize: "vertical", fontFamily: "inherit" } })),'
firmeW = ('h("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 } },\n'
 'h(SignaturePad, { label: "Firma Tecnico verificatore (obbligatoria)", value: f.technicianSignature || "", onChange: v => setF(x => Object.assign({}, x, { technicianSignature: v })), height: 120 }),\n'
 'h(SignaturePad, { label: "Firma Referente reparto (opzionale)", value: f.departmentSignature || "", onChange: v => setF(x => Object.assign({}, x, { departmentSignature: v })), height: 120 })),')
A = rep1(A, ppmNote, ppmNote + "\n" + firmeW, "render firme ppm wizard")
oldSave = 'const doSave = () => { if (!f.assetId) return; onSaveFull({ assetId: f.assetId,'
newSave = ('React.useEffect(() => { if (sObj.key !== "esito" || f.technicianSignature) return; const sig = techSignature(technicians, f.technician); if (sig) setF(x => Object.assign({}, x, { technicianSignature: sig })); }, [sObj.key]);\n'
 'const doSave = () => { if (!f.assetId) return; if (!f.technicianSignature) { try { window.dispatchEvent(new CustomEvent("toast", { detail: { msg: "Firma del tecnico obbligatoria", color: "#ef4444" } })); } catch (e) { } return; } onSaveFull({ technicianSignature: f.technicianSignature || "", departmentSignature: f.departmentSignature || "", assetId: f.assetId,')
A = rep1(A, oldSave, newSave, "save ppm wizard")

# ---------- D) savePpmFull: firme sui 3 record ----------
sig2 = 'technicianSignature: p.technicianSignature || "", departmentSignature: p.departmentSignature || "", '
A = rep1(A, 'verifyStatus: "completata", verifyType: "periodica", nextDate: funcNext, notes: "", published: true });',
            'verifyStatus: "completata", verifyType: "periodica", nextDate: funcNext, notes: "", ' + sig2 + 'published: true });', "funcRep firme")
A = rep1(A, 'overallPass: !!p.vsePass, notes: "", published: true });',
            'overallPass: !!p.vsePass, notes: "", ' + sig2 + 'published: true });', "iecRep firme")
A = rep1(A, 'notes: p.notes || "", funcReportId: funcRep.id, iecReportId: iecRep.id, published: true });',
            'notes: p.notes || "", funcReportId: funcRep.id, iecReportId: iecRep.id, ' + sig2 + 'published: true });', "ppm firme")

# ---------- E) PpmVerifyForm ----------
A = rep1(A, 'overallPass: true,\nverifyType: "programmata"\n};',
            'overallPass: true,\nverifyType: "programmata",\ntechnicianSignature: "",\ndepartmentSignature: ""\n};', "blank ppm verify")
destr = 'return init;\n});\nvar f = _f[0], setF = _f[1];'
effV = '\nReact.useEffect(function () { if (f.technicianSignature) return; var sig = techSignature(technicians, f.technician); if (sig) setF(function (x) { return Object.assign({}, x, { technicianSignature: sig }); }); }, [f.technician]);'
A = rep1(A, destr, destr + effV, "effect ppm verify")
A = rep1(A, 'function doSave() {\n',
            'function doSave() {\nif (!f.technicianSignature) { showToast && showToast("Firma del tecnico obbligatoria", "#ef4444"); return; }\n', "obbligo ppm verify")
footV = 'React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 } },\nReact.createElement(Btn, { variant: "ghost", onClick: function () { onClose(); } }, "Annulla"),\nReact.createElement(Btn, { onClick: doSave }, "Salva PPM")));'
footV2 = 'React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 } },\nReact.createElement(Btn, { variant: "ghost", onClick: onClose }, "Annulla"),\nReact.createElement(Btn, { onClick: doSave }, "Salva PPM")));'
firmeV = ('React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 } },\n'
 'React.createElement(SignaturePad, { label: "Firma Tecnico verificatore (obbligatoria)", value: f.technicianSignature || "", onChange: function (v) { setF(function (x) { return Object.assign({}, x, { technicianSignature: v }); }); }, height: 120 }),\n'
 'React.createElement(SignaturePad, { label: "Firma Referente reparto (opzionale)", value: f.departmentSignature || "", onChange: function (v) { setF(function (x) { return Object.assign({}, x, { departmentSignature: v }); }); }, height: 120 })),\n')
if A.count(footV2) == 1:
    A = A.replace(footV2, firmeV + footV2)
elif A.count(footV) == 1:
    A = A.replace(footV, firmeV + footV)
else:
    die("footer ppm verify non trovato in nessuna variante")

# ---------- F) bump ----------
A = rep1(A, 'const APP_VERSION = "2.92";', 'const APP_VERSION = "2.93";', "APP_VERSION")
W = rep1(W, "const CACHE_VERSION = 'medtrace-v3-17';", "const CACHE_VERSION = 'medtrace-v3-18';", "CACHE_VERSION")

open('src/app.js', 'w').write(A)
open('public/sw.js', 'w').write(W)
print("OK: firme Job+PPM v2.93 / medtrace-v3-18")
