import { defineConfig } from "vite";

export default defineConfig({
  build: {
    // Nomi file STABILI (niente hash): il service worker e il modello
    // mentale "carico e funziona" restano identici a prima.
    rollupOptions: {
      output: {
        entryFileNames: "assets/main.js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
});
