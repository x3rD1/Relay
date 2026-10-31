import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "Reoverlay",
  version: "1.0.0",
  description: "Overlay for Relay app",

  action: {
    default_popup: "index.html",
  },

  content_scripts: [
    {
      matches: ["https://*.youtube.com/*"],
      js: ["src/content.tsx"],
    },
  ],

  background: {
    service_worker: "src/service-worker.ts",
    type: "module",
  },

  permissions: ["storage", "cookies", "tabCapture", "activeTab", "offscreen"],

  host_permissions: [
    "http://localhost:3000/*",
    "http://localhost/*",
    "https://*.youtube.com/*",
    "https://precise-flamingo-1156.clerk.accounts.dev/*",
  ],

  externally_connectable: {
    matches: ["http://localhost:3000/*"],
  },
});
