import globals from "globals";
export default [{
  files: ["src/app.js"],
  languageOptions: {
    ecmaVersion: 2023,
    sourceType: "module",
    globals: { ...globals.browser, React: "readonly", ReactDOM: "readonly" }
  },
  rules: { "no-undef": "error" }
}];
