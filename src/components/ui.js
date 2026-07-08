/* MedTrace — mattoncini UI condivisi: input, modal, chip, grafici, tabella, dialog imperativi (estratti da app.js, v2.89) */
import { __rest } from "../lib/tslib.js";
import { downloadXLSX } from "../lib/export.js";

export function useMedia(q) {
const [m, setM] = React.useState(() => window.matchMedia(q).matches);
React.useEffect(() => {
const mq = window.matchMedia(q);
const h = e => setM(e.matches);
mq.addEventListener("change", h);
return () => mq.removeEventListener("change", h);
}, [q]);
return m;
}
const TH_S = { background: "var(--bg-2)", color: "var(--text-3)", padding: "11px 16px", textAlign: "left", fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: .7, borderBottom: "1px solid var(--border)", whiteSpace: "nowrap", cursor: "pointer", userSelect: "none", position: "sticky", top: 0, zIndex: 2 };
const TD_S = { padding: "11px 16px", borderBottom: "1px solid var(--border-2)", fontSize: 12.5, color: "var(--text)", whiteSpace: "nowrap", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", verticalAlign: "middle" };
export function ExcelTable({ cols, rows, onEdit, onDelete, actions, defaultSort, rowBg, onRowClick, exportName }) {
var _a;
const isMobile = useMedia("(max-width:900px)");
const isMobileTbl = useMedia("(max-width:900px)");
const PKEY = exportName ? "medtrace-tblfilter-" + exportName : null;
const loadPersist = () => { if (!PKEY)
return null; try {
const raw = localStorage.getItem(PKEY);
return raw ? JSON.parse(raw) : null;
}
catch (e) {
return null;
} };
const _saved = loadPersist();
const [sort, setSort] = React.useState({ key: defaultSort || ((_a = cols[0]) === null || _a === void 0 ? void 0 : _a.key), dir: "asc" });
const [filters, setFilters] = React.useState((_saved && _saved.filters) || {});
const [txt, setTxt] = React.useState((_saved && _saved.txt) || {});
const [gs, setGs] = React.useState((_saved && _saved.gs) || "");
React.useEffect(() => { if (!PKEY)
return; try {
localStorage.setItem(PKEY, JSON.stringify({ filters, txt, gs }));
}
catch (e) { } }, [filters, txt, gs, PKEY]);
const [openCol, setOpenCol] = React.useState(null);
const [optSearch, setOptSearch] = React.useState("");
const setTextF = (k, v) => setTxt(f => (Object.assign(Object.assign({}, f), { [k]: v })));
const toggleVal = (k, val) => setFilters(f => { const cur = f[k] || []; const has = cur.indexOf(val) >= 0; return Object.assign(Object.assign({}, f), { [k]: has ? cur.filter(x => x !== val) : [...cur, val] }); });
const setAll = (k, vals) => setFilters(f => (Object.assign(Object.assign({}, f), { [k]: vals })));
const clearOne = (k) => setFilters(f => { const n = Object.assign({}, f); delete n[k]; return n; });
const clearF = () => { setFilters({}); setTxt({}); setGs(""); setOpenCol(null); };
const hasF = Object.values(filters).some(v => v && v.length) || Object.values(txt).some(v => v) || gs;
const filtered = React.useMemo(() => {
let r = rows;
if (gs) {
const words = gs.toLowerCase().split(/\s+/).filter(Boolean);
r = r.filter(row => { const hay = cols.map(c => String(row[c.key] || "")).join(" ").toLowerCase(); return words.every(w => hay.includes(w)); });
}
Object.entries(filters).forEach(([k, vals]) => { if (!vals || !vals.length)
return; r = r.filter(row => vals.indexOf(String(row[k] || "")) >= 0); });
Object.entries(txt).forEach(([k, v]) => { if (!v)
return; r = r.filter(row => String(row[k] || "").toLowerCase().includes(v.toLowerCase())); });
return [...r].sort((a, b) => {
let av = a[sort.key] || "", bv = b[sort.key] || "";
if (!isNaN(av) && !isNaN(bv)) {
av = +av;
bv = +bv;
}
if (av < bv)
return sort.dir === "asc" ? -1 : 1;
if (av > bv)
return sort.dir === "asc" ? 1 : -1;
return 0;
});
}, [rows, filters, txt, gs, sort]);
const toggleSort = k => setSort(s => s.key === k ? Object.assign(Object.assign({}, s), { dir: s.dir === "asc" ? "desc" : "asc" }) : { key: k, dir: "asc" });
return (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", padding: "8px 10px", background: "var(--bg-2)", border: "1px solid var(--border-2)", borderBottom: "none", borderRadius: "10px 10px 0 0", flexWrap: "wrap" } },
React.createElement("input", { placeholder: " Cerca\u2026", value: gs, onChange: e => setGs(e.target.value), style: { background: "var(--card)", border: "1px solid var(--border-2)", borderRadius: 6, padding: "5px 10px", color: "var(--text)", fontSize: 12, outline: "none", width: 200 } }),
hasF && React.createElement("button", { onClick: clearF, style: { background: "none", border: "1px solid #ef444433", borderRadius: 5, color: "#ef4444", padding: "4px 10px", cursor: "pointer", fontSize: 11, fontWeight: 700 } }, "\u2715 Azzera"),
React.createElement("span", { style: { marginLeft: "auto", fontSize: 11, color: "var(--text-4)", fontFamily: "'IBM Plex Mono', monospace" } },
filtered.length,
"/",
rows.length),
exportName && filtered.length > 0 && (React.createElement("button", { onClick: () => {
const expCols = cols.map(c => ({ key: c.key, label: c.label }));
downloadXLSX(exportName + ".xlsx", filtered, expCols, exportName);
}, style: { background: "#2dd4bf15", border: "1px solid #2dd4bf44", borderRadius: 5, color: "#2dd4bf", padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }, title: "Esporta in Excel i risultati filtrati" }, "\u2B07 Excel"))),
React.createElement("div", { style: { overflowX: isMobile ? "auto" : "visible", overflowY: "auto", border: "1px solid var(--border-2)", borderRadius: "0 0 10px 10px", background: "var(--surface)", maxHeight: "68vh" } },
React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: isMobile ? 12 : 12.5, fontFamily: "inherit" } },
React.createElement("thead", null,
React.createElement("tr", null,
cols.map(c => (React.createElement("th", { key: c.key, style: Object.assign(Object.assign({}, TH_S), { color: sort.key === c.key ? "#5eead4" : "var(--text-3)", whiteSpace: isMobile ? "nowrap" : "normal" }), onClick: () => toggleSort(c.key) },
c.label,
" ",
React.createElement("span", { style: { fontSize: 9, opacity: .6 } }, sort.key === c.key ? (sort.dir === "asc" ? "▲" : "▼") : "⇅")))),
(onEdit || onDelete || actions) && React.createElement("th", { style: Object.assign(Object.assign({}, TH_S), { cursor: "default" }) }, "Azioni")),
React.createElement("tr", null,
cols.map(c => (React.createElement("td", { key: c.key, style: { padding: "3px 5px", background: "var(--bg-deep)", borderBottom: "1px solid var(--border-2)" } }, c.opts ? (() => {
const sel = filters[c.key] || [];
const open = openCol === c.key;
const present = [...new Set(rows.map(r => String(r[c.key] || "")).filter(x => x !== ""))];
const counts = {};
rows.forEach(r => { const v = String(r[c.key] || ""); if (v)
counts[v] = (counts[v] || 0) + 1; });
const label = sel.length === 0 ? "Tutti" : sel.length === 1 ? sel[0] : sel.length + " selez.";
return (React.createElement("div", { style: { position: "relative" } },
React.createElement("button", { onClick: () => { setOptSearch(""); setOpenCol(open ? null : c.key); }, title: sel.length ? sel.join(", ") : "Filtra", style: { display: "flex", alignItems: "center", gap: 4, width: "100%", background: sel.length ? "#2dd4bf18" : "var(--card)", border: "1px solid " + (sel.length ? "#2dd4bf66" : "var(--border-2)"), borderRadius: 4, padding: "3px 6px", color: sel.length ? "#5eead4" : "var(--text-2)", fontSize: 11, cursor: "pointer", outline: "none", whiteSpace: "nowrap", overflow: "hidden" } },
React.createElement("span", { style: { flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis" } }, label),
React.createElement("span", { style: { fontSize: 8, opacity: .7 } }, "\u25BC")),
open && (React.createElement(React.Fragment, null,
React.createElement("div", { onClick: () => setOpenCol(null), style: { position: "fixed", inset: 0, zIndex: 40, background: isMobileTbl ? "rgba(0,0,0,.55)" : "transparent" } }),
React.createElement("div", { style: isMobileTbl
? { position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 41, maxHeight: "62vh", overflowY: "auto", background: "var(--card)", borderTop: "1px solid #2dd4bf44", borderRadius: "16px 16px 0 0", boxShadow: "0 -8px 30px rgba(0,0,0,.6)", padding: "14px 14px calc(14px + env(safe-area-inset-bottom))" }
: { position: "absolute", top: "calc(100% + 3px)", left: 0, zIndex: 41, minWidth: 180, maxWidth: 260, maxHeight: 280, overflowY: "auto", background: "var(--card)", border: "1px solid #2dd4bf44", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,.5)", padding: 6 } },
isMobileTbl && React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } },
React.createElement("div", { style: { fontSize: 14, fontWeight: 800, color: "var(--text)" } }, c.label),
React.createElement("button", { onClick: () => setOpenCol(null), style: { background: "none", border: "none", color: "var(--text-2)", fontSize: 22, cursor: "pointer", lineHeight: 1, padding: "0 4px" } }, "\u00D7")),
present.length > 8 && (React.createElement("input", { autoFocus: true, placeholder: "Filtra voci\u2026", value: optSearch, onChange: e => setOptSearch(e.target.value), onMouseDown: e => e.stopPropagation(), style: { width: "100%", boxSizing: "border-box", background: "var(--bg-2)", border: "1px solid var(--border-2)", borderRadius: 5, padding: "5px 8px", color: "var(--text)", fontSize: 12, outline: "none", marginBottom: 6 } })),
React.createElement("div", { style: { display: "flex", gap: 6, padding: "0 6px 8px", borderBottom: "1px solid var(--border-2)", marginBottom: 4 } },
React.createElement("button", { onClick: () => setAll(c.key, optSearch ? present.filter(o => o.toLowerCase().includes(optSearch.toLowerCase())) : present), style: { flex: 1, background: "none", border: "1px solid #2dd4bf44", borderRadius: 4, color: "#5eead4", fontSize: 10, fontWeight: 700, padding: "3px 0", cursor: "pointer" } }, optSearch ? "Tutti i visibili" : "Tutti"),
React.createElement("button", { onClick: () => clearOne(c.key), style: { flex: 1, background: "none", border: "1px solid #ef444433", borderRadius: 4, color: "#ef4444", fontSize: 10, fontWeight: 700, padding: "3px 0", cursor: "pointer" } }, "Nessuno")),
(() => {
const shown = optSearch ? present.filter(o => o.toLowerCase().includes(optSearch.toLowerCase())) : present;
return shown.length === 0 ? React.createElement("div", { style: { padding: "6px 8px", fontSize: 11, color: "var(--text-4)" } }, "Nessuna voce") :
shown.sort().map(o => (React.createElement("label", { key: o, style: { display: "flex", alignItems: "center", gap: 8, padding: "5px 8px", borderRadius: 5, cursor: "pointer", fontSize: 12, color: "var(--text)" }, onMouseDown: e => e.preventDefault(), onClick: () => toggleVal(c.key, o) },
React.createElement("span", { style: { width: 15, height: 15, flexShrink: 0, borderRadius: 3, border: "1px solid " + (sel.indexOf(o) >= 0 ? "#2dd4bf" : "var(--text-4)"), background: sel.indexOf(o) >= 0 ? "#2dd4bf" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--bg-deep)", fontWeight: 900 } }, sel.indexOf(o) >= 0 ? "✓" : ""),
React.createElement("span", { style: { flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, c.render ? c.render(o, {}) : o),
React.createElement("span", { style: { fontSize: 10, color: "var(--text-4)", fontFamily: "'IBM Plex Mono', monospace" } }, counts[o]))));
})())))));
})() : (React.createElement("input", { placeholder: "\u2026", value: txt[c.key] || "", onChange: e => setTextF(c.key, e.target.value), style: { background: "var(--card)", border: "1px solid var(--border-2)", borderRadius: 4, padding: "3px 6px", color: "var(--text)", fontSize: 11, width: "100%", outline: "none" } }))))),
(onEdit || onDelete || actions) && React.createElement("td", { style: { padding: "3px 5px", background: "var(--bg-deep)", borderBottom: "1px solid var(--border-2)" } }))),
React.createElement("tbody", null, filtered.length === 0 ? (React.createElement("tr", null,
React.createElement("td", { colSpan: cols.length + (onEdit || onDelete || actions ? 1 : 0), style: { textAlign: "center", padding: 32, color: "var(--text-4)" } }, "Nessun risultato"))) : filtered.map((row, i) => {
const bg = (rowBg && rowBg(row)) || "transparent";
return (React.createElement("tr", { key: row.id || i, className: "mt-table-row", style: { background: bg, cursor: onRowClick ? "pointer" : undefined }, onDoubleClick: onRowClick ? () => onRowClick(row) : undefined },
cols.map(c => (React.createElement("td", { key: c.key, style: Object.assign(Object.assign({}, TD_S), { whiteSpace: isMobile ? "nowrap" : "normal", maxWidth: isMobile ? 200 : 280, wordBreak: "normal", overflowWrap: "anywhere" }), title: String(row[c.key] || "") }, c.render ? c.render(row[c.key], row) : String(row[c.key] || "—")))),
(onEdit || onDelete || actions) && (React.createElement("td", { style: Object.assign(Object.assign({}, TD_S), { whiteSpace: "nowrap" }) },
React.createElement("div", { style: { display: "flex", gap: 4 } },
actions && actions(row),
onEdit && React.createElement("button", { onClick: () => onEdit(row), style: { background: "var(--surface-3)", border: "1px solid var(--border)", borderRadius: 5, color: "var(--text-2)", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, "\u270F"),
onDelete && React.createElement("button", { onClick: () => onDelete(row.id), style: { background: "#ef444415", border: "1px solid #ef444430", borderRadius: 5, color: "#ef4444", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, "\u2715"))))));
}))))));
}
export function AlertChip({ days }) {
if (days === null || days === undefined)
return React.createElement("span", { style: { color: "var(--text-4)", fontSize: 11 } }, "\u2014");
const [bg, col, label] = days < 0 ? ["#ef444420", "#ef4444", "SCAD." + (Math.abs(days)) + "gg"] : days === 0 ? ["#ef444420", "#ef4444", "OGGI"] : days <= 7 ? ["#f9730020", "#f97316", "⚠" + (days) + "gg"] : days <= 30 ? ["#f59e0b20", "#f59e0b", (days) + "gg"] : ["#22c55e20", "#22c55e", (days) + "gg"];
return React.createElement("span", { style: { background: bg, color: col, border: "1px solid " + (col) + "44", borderRadius: 5, padding: "2px 7px", fontSize: 10, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" } }, label);
}
export const Hint = ({ text }) => {
const [open, setOpen] = React.useState(false);
const ref = React.useRef(null);
React.useEffect(() => {
if (!open)
return;
const handler = (e) => { if (ref.current && !ref.current.contains(e.target))
setOpen(false); };
document.addEventListener("mousedown", handler);
document.addEventListener("touchstart", handler);
return () => {
document.removeEventListener("mousedown", handler);
document.removeEventListener("touchstart", handler);
};
}, [open]);
return (React.createElement("span", { ref: ref, style: { position: "relative", display: "inline-flex", alignItems: "center" } },
React.createElement("button", { type: "button", onClick: (e) => { e.stopPropagation(); e.preventDefault(); setOpen(o => !o); }, style: {
marginLeft: 5, width: 14, height: 14, borderRadius: "50%",
background: open ? "#2dd4bf" : "transparent",
border: "1px solid " + (open ? "#2dd4bf" : "var(--text-4)"),
color: open ? "#0a0a0e" : "var(--text-2)",
fontSize: 9, fontWeight: 800, lineHeight: 1, padding: 0,
cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
touchAction: "manipulation", WebkitTapHighlightColor: "transparent"
} }, "?"),
open && (React.createElement("span", { style: {
position: "absolute",
top: "100%",
left: 0,
marginTop: 6,
background: "var(--bg-2)",
border: "1px solid #2dd4bf66",
borderRadius: 8,
padding: "10px 12px",
fontSize: 11,
color: "var(--text)",
lineHeight: 1.5,
width: 280,
maxWidth: "calc(100vw - 40px)",
zIndex: 2000,
boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
fontWeight: 400,
textTransform: "none",
letterSpacing: "normal",
whiteSpace: "normal"
} }, text))));
};
export function Inp(_a) {
var { label, hint } = _a, p = __rest(_a, ["label", "hint"]);
return (React.createElement("label", { style: { display: "flex", flexDirection: "column", gap: 5 } },
label && React.createElement("span", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, display: "flex", alignItems: "center" } },
label,
hint && React.createElement(Hint, { text: hint })),
React.createElement("input", Object.assign({}, p, { style: Object.assign({ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", color: "var(--text)", outline: "none", width: "100%", boxSizing: "border-box" }, (p.style || {})) }))));
}
export function Sel(_a) {
var { label, hint, children } = _a, p = __rest(_a, ["label", "hint", "children"]);
return (React.createElement("label", { style: { display: "flex", flexDirection: "column", gap: 5 } },
label && React.createElement("span", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, display: "flex", alignItems: "center" } },
label,
hint && React.createElement(Hint, { text: hint })),
React.createElement("select", Object.assign({}, p, { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", color: "var(--text)", outline: "none", width: "100%", boxSizing: "border-box" } }), children)));
}
export function Txt(_a) {
var { label } = _a, p = __rest(_a, ["label"]);
return (React.createElement("label", { style: { display: "flex", flexDirection: "column", gap: 5 } },
label && React.createElement("span", { style: { fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } }, label),
React.createElement("textarea", Object.assign({}, p, { style: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", color: "var(--text)", outline: "none", width: "100%", boxSizing: "border-box", resize: "vertical", minHeight: 64 } }))));
}
export function Modal({ title, onClose, wide, children }) {
return (React.createElement("div", { style: { position: "fixed", inset: 0, background: "#000c", zIndex: 900, display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }, onClick: e => e.target === e.currentTarget && onClose() },
React.createElement("div", { style: { background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, width: wide ? "min(820px,97vw)" : "min(620px,97vw)", maxHeight: "93vh", overflowY: "auto", padding: 0, boxSizing: "border-box", animation: "mtFadeIn .2s ease", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }, onClick: e => e.stopPropagation() },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid var(--border-2)", position: "sticky", top: 0, background: "var(--card)", zIndex: 5, borderRadius: "16px 16px 0 0" } },
React.createElement("span", { style: { fontWeight: 800, fontSize: 16 } }, title),
React.createElement("button", { onClick: onClose, style: { background: "none", border: "none", color: "var(--text-3)", fontSize: 24, cursor: "pointer", lineHeight: 1, padding: 0 } }, "\u00D7")),
React.createElement("div", { style: { padding: 24 } }, children))));
}
export function Grid({ cols, gap = 14, children }) {
const isMobile = useMedia("(max-width:600px)");
return React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : cols, gap } }, children);
}
export function Span2({ children }) {
const isMobile = useMedia("(max-width:600px)");
return React.createElement("div", { style: { gridColumn: isMobile ? "span 1" : "span 2" } }, children);
}
export function BarChart({ data, height = 160, color = "#2dd4bf" }) {
if (!data.length)
return null;
const max = Math.max(...data.map(d => d.value), 1);
return (React.createElement("div", { style: { display: "flex", alignItems: "flex-end", gap: 6, height, padding: "10px 0" } }, data.map((d, i) => (React.createElement("div", { key: i, style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 0 } },
React.createElement("div", { style: { fontSize: 10, color: "var(--text-2)", fontWeight: 700 } }, d.value > 0 ? "€" + (d.value.toFixed(0)) : ""),
React.createElement("div", { style: { width: "100%", maxWidth: 40, background: color, opacity: .7, height: ((d.value / max) * 100) + "%", minHeight: 2, borderRadius: "4px 4px 0 0", transition: "height .3s" } }),
React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)", textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" } }, d.label))))));
}
export function AreaTrend({ data, valueKey, color, height, suffix, money }) {
color = color || "#2dd4bf"; height = height || 96;
const pts = (data || []).map((d, i) => ({ i: i, v: d[valueKey], label: d.label }));
const n = pts.length;
const valid = pts.filter(p => p.v !== null && p.v !== undefined && !isNaN(p.v));
if (valid.length < 2) {
return React.createElement("div", { style: { height: height + 16, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-4)", fontSize: 11 } }, "Dati insufficienti per il grafico");
}
const vals = valid.map(p => p.v);
let vmin = Math.min.apply(null, vals), vmax = Math.max.apply(null, vals);
if (vmin === vmax) { vmin = vmin - 1; vmax = vmax + 1; }
const range = (vmax - vmin) || 1;
const X = i => n > 1 ? (i / (n - 1)) * 100 : 50;
const Y = v => 8 + (1 - (v - vmin) / range) * 84;
const co = valid.map(p => ({ x: X(p.i), y: Y(p.v) }));
let line = "M " + co[0].x.toFixed(2) + " " + co[0].y.toFixed(2);
for (let k = 1; k < co.length; k++) {
const pr = co[k - 1], cu = co[k];
const mx = (pr.x + cu.x) / 2, my = (pr.y + cu.y) / 2;
line += " Q " + pr.x.toFixed(2) + " " + pr.y.toFixed(2) + " " + mx.toFixed(2) + " " + my.toFixed(2);
}
line += " L " + co[co.length - 1].x.toFixed(2) + " " + co[co.length - 1].y.toFixed(2);
const area = line + " L " + co[co.length - 1].x.toFixed(2) + " 100 L " + co[0].x.toFixed(2) + " 100 Z";
const last = co[co.length - 1];
const lastVal = valid[valid.length - 1].v;
const gid = "atg_" + valueKey;
const lbl = money ? ("\u20AC " + Math.round(lastVal).toLocaleString("it-IT")) : (Math.round(lastVal) + (suffix || ""));
return React.createElement("div", null,
React.createElement("div", { style: { position: "relative", height: height } },
React.createElement("svg", { viewBox: "0 0 100 100", preserveAspectRatio: "none", style: { width: "100%", height: "100%", display: "block", overflow: "visible" } },
React.createElement("defs", null,
React.createElement("linearGradient", { id: gid, x1: "0", y1: "0", x2: "0", y2: "1" },
React.createElement("stop", { offset: "0%", stopColor: color, stopOpacity: 0.30 }),
React.createElement("stop", { offset: "100%", stopColor: color, stopOpacity: 0 }))),
React.createElement("path", { d: area, fill: "url(#" + gid + ")" }),
React.createElement("path", { d: line, fill: "none", stroke: color, strokeWidth: 2, vectorEffect: "non-scaling-stroke", strokeLinecap: "round", strokeLinejoin: "round" })),
React.createElement("div", { style: { position: "absolute", left: last.x + "%", top: last.y + "%", width: 9, height: 9, marginLeft: -4.5, marginTop: -4.5, borderRadius: "50%", background: color, boxShadow: "0 0 0 3px " + color + "33" } }),
React.createElement("div", { style: { position: "absolute", right: 0, top: 0, fontSize: 13, fontWeight: 700, color: color, fontFamily: "'Space Grotesk', sans-serif" } }, lbl)),
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 5 } }, pts.map((p, i) => React.createElement("span", { key: i, style: { fontSize: 8.5, color: "var(--text-4)" } }, p.label))));
}
export function Donut({ segments, size, thickness, centerTop, centerSub }) {
size = size || 132; thickness = thickness || 15;
const segs = (segments || []).filter(s => s.value > 0);
const total = segs.reduce((a, s) => a + s.value, 0);
const r = (size - thickness) / 2;
const cx = size / 2, cy = size / 2;
const circ = 2 * Math.PI * r;
let acc = 0;
const rings = total > 0 ? segs.map((s, i) => {
const len = (s.value / total) * circ;
const el = React.createElement("circle", { key: i, cx: cx, cy: cy, r: r, fill: "none", stroke: s.color, strokeWidth: thickness, strokeDasharray: len.toFixed(2) + " " + (circ - len + 0.001).toFixed(2), strokeDashoffset: (-acc).toFixed(2) });
acc += len;
return el;
}) : [];
return React.createElement("svg", { width: size, height: size, viewBox: "0 0 " + size + " " + size, style: { flexShrink: 0 } },
React.createElement("g", { transform: "rotate(-90 " + cx + " " + cy + ")" },
React.createElement("circle", { cx: cx, cy: cy, r: r, fill: "none", stroke: "var(--border-2)", strokeWidth: thickness }),
rings),
(centerTop != null && centerTop !== undefined) ? React.createElement("text", { x: cx, y: cy - 3, textAnchor: "middle", dominantBaseline: "central", fill: "var(--text-strong)", style: { fontSize: 25, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" } }, String(centerTop)) : null,
centerSub ? React.createElement("text", { x: cx, y: cy + 15, textAnchor: "middle", dominantBaseline: "central", fill: "var(--text-3)", style: { fontSize: 9, letterSpacing: "0.05em" } }, centerSub) : null);
}
export function KpiCard({ label, value, color, sub, icon, onClick }) {
color = color || "#2dd4bf";
return React.createElement("div", { onClick: onClick, style: { background: "var(--card)", border: "1px solid var(--border-2)", borderRadius: 14, padding: "14px 15px", cursor: onClick ? "pointer" : "default", transition: "transform .15s ease, border-color .15s ease", WebkitTapHighlightColor: "transparent" }, onMouseEnter: onClick ? (e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = color + "66"; } : undefined, onMouseLeave: onClick ? (e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--border-2)"; } : undefined },
React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9, gap: 8 } },
React.createElement("span", { style: { fontSize: 10.5, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, label),
icon ? React.createElement("span", { style: { width: 28, height: 28, borderRadius: 8, background: color + "1f", display: "flex", alignItems: "center", justifyContent: "center", color: color, flexShrink: 0 } }, icon) : null),
React.createElement("div", { style: { fontSize: 27, fontWeight: 700, color: color, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 } }, value),
sub ? React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, sub) : null);
}
var _confirmCallback = null;
var _setConfirmState = null;
var _setPromptState = null;
export function appConfirm(msg, onYes, kind) {
_confirmCallback = onYes;
if (_setConfirmState)
_setConfirmState({ open: true, msg: msg, kind: kind || 'danger' });
}
export function appPromptCb(msg, onOk) {
if (_setPromptState)
_setPromptState({ open: true, msg: msg, value: '', cb: onOk });
}
export function ConfirmDialog() {
const [state, setState] = React.useState({ open: false, msg: '', kind: 'danger' });
React.useEffect(() => { _setConfirmState = setState; }, []);
if (!state.open)
return null;
const isPositive = state.kind === 'positive';
const confirmBg = isPositive ? '#2dd4bf' : '#dc2626';
const confirmFg = isPositive ? '#04201C' : '#fff';
const answer = ok => {
setState({ open: false, msg: '', kind: 'danger' });
if (ok && _confirmCallback)
_confirmCallback();
_confirmCallback = null;
};
return (React.createElement("div", { style: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999,
display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }, onClick: () => answer(false) },
React.createElement("div", { style: { background: 'var(--surface-2)', border: '1px solid #2A2A38', borderRadius: 14,
padding: '24px 22px', maxWidth: 340, width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,.7)' }, onClick: e => e.stopPropagation() },
React.createElement("div", { style: { fontSize: 14, color: 'var(--text)', lineHeight: 1.6, marginBottom: 20,
whiteSpace: 'pre-line' } }, state.msg),
React.createElement("div", { style: { display: 'flex', gap: 10, justifyContent: 'flex-end' } },
React.createElement("button", { onClick: () => answer(false), style: { background: 'var(--border-4)',
border: '1px solid #3A3A4A', borderRadius: 8, color: 'var(--text-2)', padding: '9px 18px',
cursor: 'pointer', fontSize: 13, fontWeight: 600, touchAction: 'manipulation',
WebkitTapHighlightColor: 'transparent' } }, "Annulla"),
React.createElement("button", { onClick: () => answer(true), style: { background: confirmBg,
border: 'none', borderRadius: 8, color: confirmFg, padding: '9px 18px', cursor: 'pointer',
fontSize: 13, fontWeight: 700, touchAction: 'manipulation',
WebkitTapHighlightColor: 'transparent' } }, "Conferma")))));
}
export function PromptDialog() {
const [state, setState] = React.useState({ open: false, msg: '', value: '', cb: null });
React.useEffect(() => { _setPromptState = setState; }, []);
if (!state.open)
return null;
const answer = ok => {
const val = ok ? state.value : null;
const cb = state.cb;
setState({ open: false, msg: '', value: '', cb: null });
if (cb)
cb(val);
};
return (React.createElement("div", { style: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999,
display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }, onClick: () => answer(false) },
React.createElement("div", { style: { background: 'var(--surface-2)', border: '1px solid #2A2A38', borderRadius: 14,
padding: '24px 22px', maxWidth: 340, width: '100%' }, onClick: e => e.stopPropagation() },
React.createElement("div", { style: { fontSize: 14, color: 'var(--text)', lineHeight: 1.6, marginBottom: 14,
whiteSpace: 'pre-line' } }, state.msg),
React.createElement("input", { autoFocus: true, value: state.value, onChange: e => setState(s => (Object.assign(Object.assign({}, s), { value: e.target.value }))), onKeyDown: e => { if (e.key === 'Enter')
answer(true); }, style: { width: '100%', background: 'var(--bg)', border: '1px solid #2A2A38',
borderRadius: 8, color: 'var(--text-bright)', padding: '9px 12px', fontSize: 14,
marginBottom: 16, boxSizing: 'border-box' } }),
React.createElement("div", { style: { display: 'flex', gap: 10, justifyContent: 'flex-end' } },
React.createElement("button", { onClick: () => answer(false), style: { background: 'var(--border-4)',
border: '1px solid #3A3A4A', borderRadius: 8, color: 'var(--text-2)', padding: '9px 18px',
cursor: 'pointer', fontSize: 13, fontWeight: 600, touchAction: 'manipulation' } }, "Annulla"),
React.createElement("button", { onClick: () => answer(true), style: { background: '#2dd4bf',
border: 'none', borderRadius: 8, color: '#000', padding: '9px 18px', cursor: 'pointer',
fontSize: 13, fontWeight: 700, touchAction: 'manipulation' } }, "OK")))));
}

/* — combobox apparecchi e riepilogo errori (spostati con il taglio verifiche, v2.90) — */
export const ErrorSummary = ({ errors }) => {
const ref = React.useRef(null);
const [shake, setShake] = React.useState(0);
const errorList = Object.entries(errors).filter(([k, v]) => v);
React.useEffect(() => {
if (errorList.length > 0 && ref.current) {
try {
ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
}
catch (e) {
ref.current.scrollIntoView(true);
}
setShake(s => s + 1);
if (navigator.vibrate)
try {
navigator.vibrate([30, 50, 30]);
}
catch (e) { }
}
}, [Object.keys(errors).join(",")]);
if (errorList.length === 0)
return null;
return (React.createElement("div", { ref: ref, key: shake, style: {
background: "#ef444415",
border: "1px solid #ef4444aa",
borderRadius: 8,
padding: "12px 16px",
marginBottom: 8,
fontSize: 12,
color: "#ef4444",
boxShadow: "0 0 0 3px #ef444422",
animation: "mtShake .45s cubic-bezier(.36,.07,.19,.97) both"
} },
React.createElement("div", { style: { fontWeight: 800, marginBottom: 6, fontSize: 13, display: "flex", alignItems: "center", gap: 6 } },
React.createElement("span", { style: { fontSize: 16 } }, "\u26A0"),
React.createElement("span", null, errorList.length === 1 ? "Un campo da completare prima di salvare" : errorList.length + " campi da completare prima di salvare")),
React.createElement("ul", { style: { margin: 0, paddingLeft: 22, fontSize: 12, lineHeight: 1.7, color: "#fca5a5" } }, errorList.map(([k, v]) => React.createElement("li", { key: k }, v)))));
};
export const AssetCombobox = ({ value, onChange, assets, customers, placeholder = "Cerca apparecchio…", error, autoFocus = false }) => {
const [open, setOpen] = React.useState(false);
const [query, setQuery] = React.useState("");
const [highlighted, setHighlighted] = React.useState(0);
const wrapperRef = React.useRef(null);
const inputRef = React.useRef(null);
const selected = assets.find(a => a.id === value);
const filtered = React.useMemo(() => {
if (!query.trim())
return assets.slice(0, 50);
const q = query.toLowerCase();
return assets.filter(a => {
var _a;
const cust = ((_a = customers === null || customers === void 0 ? void 0 : customers.find(c => c.id === a.customerId)) === null || _a === void 0 ? void 0 : _a.name) || "";
return [a.assetCode, a.name, a.brand, a.model, a.serial, a.location, a.id, cust]
.filter(Boolean)
.some(f => String(f).toLowerCase().includes(q));
}).slice(0, 100);
}, [query, assets, customers]);
React.useEffect(() => {
if (!open)
return;
const handler = (e) => {
if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
setOpen(false);
setQuery("");
}
};
document.addEventListener("mousedown", handler);
document.addEventListener("touchstart", handler);
return () => {
document.removeEventListener("mousedown", handler);
document.removeEventListener("touchstart", handler);
};
}, [open]);
React.useEffect(() => {
if (open && inputRef.current)
inputRef.current.focus();
}, [open]);
React.useEffect(() => { setHighlighted(0); }, [query]);
const handleSelect = (asset) => {
onChange(asset.id);
setOpen(false);
setQuery("");
};
const handleKey = (e) => {
if (e.key === "ArrowDown") {
e.preventDefault();
setHighlighted(h => Math.min(h + 1, filtered.length - 1));
}
else if (e.key === "ArrowUp") {
e.preventDefault();
setHighlighted(h => Math.max(h - 1, 0));
}
else if (e.key === "Enter") {
e.preventDefault();
if (filtered[highlighted])
handleSelect(filtered[highlighted]);
}
else if (e.key === "Escape") {
setOpen(false);
setQuery("");
}
};
const INP_BASE = {
background: "var(--surface)",
border: "1px solid " + (error ? "#ef4444" : "var(--border)"),
borderRadius: 8,
padding: "9px 11px",
color: "var(--text)",
fontSize: 13,
outline: "none",
width: "100%",
boxSizing: "border-box",
cursor: "pointer"
};
return (React.createElement("div", { ref: wrapperRef, style: { position: "relative", width: "100%" } }, !open ? (React.createElement("div", { onClick: () => setOpen(true), style: Object.assign(Object.assign({}, INP_BASE), { display: "flex", alignItems: "center", gap: 8, minHeight: 38 }) }, selected ? (React.createElement(React.Fragment, null,
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 7, minWidth: 0 } },
selected.assetCode && React.createElement("span", { style: { color: "#5eead4", fontSize: 11.5, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0 } }, selected.assetCode),
React.createElement("span", { style: { color: "var(--text)", fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, selected.name)),
React.createElement("div", { style: { color: "var(--text-3)", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } },
[selected.brand, selected.model].filter(Boolean).join(" "),
selected.serial && React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", marginLeft: 6 } },
"\u00B7 S/N: ",
selected.serial))),
React.createElement("button", { type: "button", onClick: (e) => { e.stopPropagation(); onChange(""); }, title: "Rimuovi selezione", style: { background: "none", border: "none", color: "var(--text-3)", fontSize: 14, cursor: "pointer", padding: "2px 6px", touchAction: "manipulation" } }, "\u2715"),
React.createElement("span", { style: { color: "var(--text-3)", fontSize: 11 } }, "\u25BE"))) : (React.createElement(React.Fragment, null,
React.createElement("span", { style: { flex: 1, color: "var(--text-3)", fontSize: 13 } }, placeholder),
React.createElement("span", { style: { color: "var(--text-3)", fontSize: 11 } }, "\u25BE"))))) : (React.createElement(React.Fragment, null,
React.createElement("input", { ref: inputRef, type: "text", value: query, onChange: e => setQuery(e.target.value), onKeyDown: handleKey, placeholder: "Cerca per codice, nome, marca, S/N, ubicazione\u2026", style: Object.assign(Object.assign({}, INP_BASE), { cursor: "text" }) }),
React.createElement("div", { style: {
position: "absolute",
top: "calc(100% + 4px)",
left: 0,
right: 0,
background: "var(--bg-2)",
border: "1px solid var(--border)",
borderRadius: 8,
maxHeight: 320,
overflowY: "auto",
zIndex: 1000,
boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
} }, filtered.length === 0 ? (React.createElement("div", { style: { padding: "16px", textAlign: "center", color: "var(--text-3)", fontSize: 12 } }, assets.length === 0 ? "Nessun apparecchio registrato" : "Nessun risultato per \"" + query + "\"")) : (React.createElement(React.Fragment, null,
!query.trim() && assets.length > 50 && (React.createElement("div", { style: { padding: "6px 12px", fontSize: 10, color: "var(--text-3)", borderBottom: "1px solid var(--border-2)", background: "#0a0a0e", fontStyle: "italic" } },
"Mostro primi 50 \u00B7 digita per cercare tra tutti i ",
assets.length)),
filtered.map((a, i) => {
var _a;
const cust = (_a = customers === null || customers === void 0 ? void 0 : customers.find(c => c.id === a.customerId)) === null || _a === void 0 ? void 0 : _a.name;
const isHigh = i === highlighted;
const isSel = a.id === value;
return (React.createElement("div", { key: a.id, onClick: () => handleSelect(a), onMouseEnter: () => setHighlighted(i), style: {
padding: "9px 12px",
cursor: "pointer",
borderBottom: "1px solid var(--border-2)",
background: isHigh ? "#2dd4bf11" : (isSel ? "var(--border-2)" : "transparent"),
borderLeft: isSel ? "3px solid #2dd4bf" : "3px solid transparent",
transition: "all .1s"
} },
React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 7, lineHeight: 1.3 } },
a.assetCode && React.createElement("span", { style: { color: "#5eead4", fontSize: 11.5, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0 } }, a.assetCode),
React.createElement("span", { style: { color: "var(--text)", fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, a.name)),
React.createElement("div", { style: { color: "var(--text-3)", fontSize: 11, marginTop: 2, lineHeight: 1.4 } },
[a.brand, a.model].filter(Boolean).join(" "),
a.serial && React.createElement("span", { style: { fontFamily: "'IBM Plex Mono', monospace", marginLeft: 6 } },
"\u00B7 S/N: ",
a.serial),
a.location && React.createElement("span", { style: { marginLeft: 6 } },
"\u00B7 ",
a.location)),
cust && React.createElement("div", { style: { color: "var(--text-2)", fontSize: 10, marginTop: 2 } }, cust)));
}),
filtered.length === 100 && (React.createElement("div", { style: { padding: "6px 12px", fontSize: 10, color: "var(--text-3)", textAlign: "center", borderTop: "1px solid var(--border-2)", fontStyle: "italic" } }, "Solo primi 100 risultati \u00B7 affina la ricerca per vedere pi\u00F9 specifico")))))))));
};

/* — firma su canvas (spostata dal modulo verifiche: ora serve anche alle impostazioni tecnici, v2.92) — */
export const SignaturePad = ({ value, onChange, label, height = 140 }) => {
const canvasRef = React.useRef(null);
const isDrawing = React.useRef(false);
const lastPoint = React.useRef(null);
const [hasContent, setHasContent] = React.useState(!!value);
React.useEffect(() => {
const canvas = canvasRef.current;
if (!canvas)
return;
const rect = canvas.getBoundingClientRect();
const dpr = window.devicePixelRatio || 1;
canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;
const ctx = canvas.getContext("2d");
ctx.scale(dpr, dpr);
ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.strokeStyle = "#000";
ctx.lineWidth = 2;
ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, rect.width, rect.height);
if (value) {
const img = new Image();
img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
img.src = value;
}
}, [height]);
const getXY = (e) => {
const canvas = canvasRef.current;
const rect = canvas.getBoundingClientRect();
if (e.touches && e.touches.length > 0) {
return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
}
const cl = (v, m) => Math.max(0, Math.min(m, v));
return { x: cl(e.clientX - rect.left, rect.width), y: cl(e.clientY - rect.top, rect.height) };
};
const usePointer = typeof window !== "undefined" && !!window.PointerEvent;
const legacy = (e) => usePointer && (e.type.indexOf("touch") === 0 || e.type.indexOf("mouse") === 0);
const start = (e) => {
if (legacy(e)) return;
e.preventDefault();
isDrawing.current = true;
lastPoint.current = getXY(e);
if (e.pointerId !== undefined && canvasRef.current && canvasRef.current.setPointerCapture) {
try { canvasRef.current.setPointerCapture(e.pointerId); } catch (err) { }
}
};
const draw = (e) => {
if (legacy(e) || !isDrawing.current)
return;
e.preventDefault();
const canvas = canvasRef.current;
const ctx = canvas.getContext("2d");
const p = getXY(e);
let pressure = 0.5;
if (e.pointerType === "pen" && e.pressure)
pressure = e.pressure;
else if (e.touches && e.touches[0] && e.touches[0].force)
pressure = e.touches[0].force;
ctx.lineWidth = 1 + pressure * 2.5;
ctx.beginPath();
ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
ctx.lineTo(p.x, p.y);
ctx.stroke();
lastPoint.current = p;
setHasContent(true);
};
const end = (e) => {
if (legacy(e) || !isDrawing.current)
return;
isDrawing.current = false;
const canvas = canvasRef.current;
const b64 = canvas.toDataURL("image/png");
onChange && onChange(b64);
};
const clear = () => {
const canvas = canvasRef.current;
const ctx = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect();
ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, rect.width, rect.height);
setHasContent(false);
onChange && onChange("");
};
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } },
label && React.createElement("label", { style: { fontSize: 11, color: "var(--text-2)", fontWeight: 600 } }, label),
React.createElement("div", { style: { position: "relative", border: "1px solid var(--border)", borderRadius: 8, background: "#fff", overflow: "hidden" } },
React.createElement("canvas", { ref: canvasRef, style: { display: "block", width: "100%", height: height + "px", touchAction: "none", cursor: "crosshair" }, onMouseDown: start, onMouseMove: draw, onMouseUp: end, onMouseLeave: end, onTouchStart: start, onTouchMove: draw, onTouchEnd: end, onPointerDown: start, onPointerMove: draw, onPointerUp: end, onPointerCancel: end, onPointerLeave: end }),
!hasContent && (React.createElement("div", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", color: "var(--text-2)", fontSize: 13, fontStyle: "italic" } }, "Firma qui (usa S-Pen o dito)"))),
React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 6 } },
React.createElement("button", { type: "button", onClick: clear, style: { background: "transparent", border: "1px solid var(--border)", color: "var(--text-2)", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", touchAction: "manipulation" } }, "Cancella firma"))));
};

/* — campo firma tecnico: compatto se la firma viene dal profilo, pad completo altrimenti (v2.94) — */
export function TechSignatureField({ value, onChange, profileSig, techName, label, height = 120 }) {
const [editing, setEditing] = React.useState(false);
const fromProfile = !!value && !!profileSig && value === profileSig && !editing;
if (fromProfile)
return React.createElement("div", { style: { background: "var(--surface)", border: "1px solid #2dd4bf55", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 } },
React.createElement("div", { style: { fontSize: 12.5, color: "var(--text)", fontWeight: 600 } }, "\u2713 Firma tecnico applicata dal profilo" + (techName ? " di " + techName : "")),
React.createElement("button", { type: "button", onClick: () => { setEditing(true); onChange && onChange(""); }, style: { background: "transparent", border: "1px solid var(--border)", borderRadius: 7, color: "var(--text-2)", fontSize: 11, fontWeight: 700, cursor: "pointer", padding: "4px 9px", whiteSpace: "nowrap" } }, "Firma diversa"));
return React.createElement(SignaturePad, { label: label || "Firma Tecnico verificatore (obbligatoria)", value: value || "", onChange: onChange, height: height });
}

/* — stato vuoto riusabile (spostato con il taglio PPM, v2.97) — */
export const EmptyState = ({ icon, title, subtitle, actions = [], compact = false }) => {
return (React.createElement("div", { style: {
textAlign: "center",
padding: compact ? "30px 18px" : "48px 24px",
background: "var(--bg-2)",
borderRadius: 14,
border: "1px dashed var(--border)",
maxWidth: 460,
margin: "12px auto"
} },
icon && (React.createElement("div", { style: {
fontSize: compact ? 36 : 48,
marginBottom: 14,
opacity: 0.4,
filter: "grayscale(0.3)"
} }, icon)),
title && (React.createElement("div", { style: {
fontSize: compact ? 14 : 16,
fontWeight: 700,
color: "var(--text)",
marginBottom: subtitle ? 6 : 16
} }, title)),
subtitle && (React.createElement("div", { style: {
fontSize: 12,
color: "var(--text-3)",
lineHeight: 1.6,
marginBottom: actions.length > 0 ? 20 : 0,
maxWidth: 360,
marginLeft: "auto",
marginRight: "auto"
} }, subtitle)),
actions.length > 0 && (React.createElement("div", { style: {
display: "flex",
gap: 10,
justifyContent: "center",
flexWrap: "wrap"
} }, actions.map((a, i) => (React.createElement("button", { key: i, onClick: a.onClick, style: {
background: a.primary ? "#2dd4bf" : "transparent",
color: a.primary ? "#0a0a0e" : "var(--text-2)",
border: a.primary ? "none" : "1px solid var(--border)",
borderRadius: 8,
padding: "9px 18px",
fontSize: 13,
fontWeight: 700,
cursor: "pointer",
touchAction: "manipulation",
WebkitTapHighlightColor: "transparent",
transition: "all .15s"
} }, a.label)))))));
};

/* — badge stato e factory icone SVG (spostati col taglio apparecchi, v3.00) — */
export const Badge = ({ text, color }) => (React.createElement("span", { style: { background: color + "18", color, border: "1px solid " + (color) + "40", borderRadius: 20, padding: "2px 10px", fontSize: 10, fontWeight: 700, letterSpacing: .5, textTransform: "uppercase", whiteSpace: "nowrap" } }, text));
export function _ic(kids) {
return React.createElement("svg", { width: 17, height: 17, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" }, kids);
}

/* — icone residue del monolite che usano _ic (v3.01) — */
export const ICON_MONITOR = _ic([React.createElement("rect", { key: "a", x: 2, y: 3, width: 20, height: 14, rx: 2 }), React.createElement("path", { key: "b", d: "M8 21h8M12 17v4" })]);
export const ICON_TOOL = _ic(React.createElement("path", { d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" }));
export const ICON_BUILDING = _ic([React.createElement("rect", { key: "a", x: 4, y: 3, width: 16, height: 18, rx: 1 }), React.createElement("path", { key: "b", d: "M9 8h.01M15 8h.01M9 12h.01M15 12h.01M10 21v-4h4v4" })]);
