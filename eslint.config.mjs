import globals from "globals";
export default [{
  files: ["src/**/*.js"],
  languageOptions: {
    ecmaVersion: 2023,
    sourceType: "module",
    globals: { ...globals.browser, React: "readonly", ReactDOM: "readonly", XLSX: "readonly", JSZip: "readonly", jspdf: "readonly", html2canvas: "readonly" }
  },
  rules: { "no-undef": "error" }
}];
