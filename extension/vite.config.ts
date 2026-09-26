import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import { defineConfig } from "vite";

import manifest from "./manifest.config.ts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],

  build: {
    modulePreload: false,

    rollupOptions: {
      input: {
        main: "index.html",
        offscreen: "src/offscreen/offscreen.html",
      },
    },
  },

  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 5173,
    },
  },
});
