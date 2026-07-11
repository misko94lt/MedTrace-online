import { t } from "../constants/i18n.js";
/* MedTrace — UI RFID: picker per associare un EPC sconosciuto a un apparecchio (v2.85) */

export function RfidAssocPicker({ epc, assets, onAssign, onClose, wards, onAssignWard }) {
const [q, setQ] = React.useState("");
const [wq, setWq] = React.useState("");
const list = React.useMemo(() => {
const s = String(q || "").trim().toLowerCase();
const all = assets || [];
const f = !s ? all : all.filter(a => ((a.name || "") + " " + (a.brand || "") + " " + (a.model || "") + " " + (a.assetCode || "") + " " + (a.serial || "")).toLowerCase().includes(s));
return f.slice(0, 8);
}, [q, assets]);
return React.createElement("div", { style: { marginTop: 8, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 10 } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 } },
React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: "var(--text-2)", fontFamily: "'IBM Plex Mono', monospace", wordBreak: "break-all" } }, "Associa " + epc + " a:"),
React.createElement("button", { onClick: onClose, style: { background: "transparent", border: "none", color: "var(--text-3)", fontSize: 16, cursor: "pointer", padding: "0 4px", lineHeight: 1 } }, "\u00d7")),
React.createElement("input", { value: q, onChange: e => setQ(e.target.value), placeholder: t("Cerca apparecchio (nome, marca, matricola)..."), style: { width: "100%", boxSizing: "border-box", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "9px 11px", fontSize: 13 } }),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 4, marginTop: 6 } },
list.map(a => React.createElement("div", { key: a.id, onClick: () => onAssign(a), style: { display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 6, cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, a.name || a.assetCode || a.id),
React.createElement("div", { style: { fontSize: 10.5, color: "var(--text-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, (a.brand || "") + (a.model ? (" " + a.model) : "") + (a.assetCode ? (" \u00b7 " + a.assetCode) : ""))),
a.epc ? React.createElement("span", { style: { fontSize: 9.5, fontWeight: 800, color: "#f59e0b", background: "#f59e0b18", padding: "2px 6px", borderRadius: 4, whiteSpace: "nowrap" } }, t("ha gi\u00e0 tag")) : null)),
!list.length && React.createElement("div", { style: { fontSize: 11.5, color: "var(--text-3)", fontStyle: "italic", padding: "6px 2px" } }, t("Nessun risultato"))),
React.createElement("div", { style: { borderTop: "1px solid var(--border-2)", marginTop: 8, paddingTop: 8 } },
React.createElement("div", { style: { fontSize: 10.5, color: "var(--text-3)", fontWeight: 700, marginBottom: 5 } }, t("Oppure segna come TAG-REPARTO (scansionarlo imposter\u00e0 il reparto):")),
React.createElement("div", { style: { display: "flex", gap: 6 } },
React.createElement("input", { value: wq, onChange: e => setWq(e.target.value), list: "rfid-ward-dl", placeholder: t("Nome reparto (es. Cardiologia)"), style: { flex: 1, minWidth: 0, boxSizing: "border-box", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", padding: "9px 11px", fontSize: 13 } }),
React.createElement("datalist", { id: "rfid-ward-dl" }, (wards || []).map(w => React.createElement("option", { key: w, value: w }))),
React.createElement("button", { onClick: () => { const n = String(wq || "").trim(); if (n && onAssignWard) onAssignWard(n); }, disabled: !String(wq || "").trim(), style: { background: String(wq || "").trim() ? "#2dd4bf" : "var(--surface)", border: "none", borderRadius: 8, color: String(wq || "").trim() ? "#04201c" : "var(--text-4)", padding: "9px 12px", fontSize: 12, fontWeight: 800, cursor: String(wq || "").trim() ? "pointer" : "default", whiteSpace: "nowrap" } }, t("Salva")))));
}
