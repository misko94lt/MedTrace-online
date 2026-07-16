import { parse } from "acorn";
import fs from "node:fs";
const src = fs.readFileSync("src/app.js", "utf8");
const ast = parse(src, { ecmaVersion: "latest", sourceType: "module", locations: true });
const comps = [];
for (const n of ast.body) {
  if (n.type === "FunctionDeclaration" && n.id && /^[A-Z]/.test(n.id.name)) {
    comps.push({ name: n.id.name, lines: n.loc.end.line - n.loc.start.line + 1, start: n.start, end: n.end, line: n.loc.start.line });
  }
}
const rx = (name) => new RegExp("\\b" + name + "\\b", "g");
for (const c of comps) {
  const outside = (src.slice(0, c.start) + src.slice(c.end)).match(rx(c.name));
  c.refs = outside ? outside.length : 0;
}
comps.sort((a, b) => b.lines - a.lines);
console.log("COMPONENTE                    RIGHE  RIF.ESTERNI  @RIGA");
for (const c of comps) console.log(c.name.padEnd(30) + String(c.lines).padStart(5) + String(c.refs).padStart(12) + String(c.line).padStart(8));
console.log("\nTotale righe nei componenti top-level:", comps.reduce((a, c) => a + c.lines, 0), "su", src.split("\n").length);
