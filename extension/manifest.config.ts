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
    { matches: ["https://example.com/*"], js: ["src/content.tsx"] },
  ],

  background: {
    service_worker: "src/service-worker.ts",
    type: "module",
  },

  permissions: ["storage"],

  host_permissions: ["http://localhost:3000/*", "https://example.com/*"],

  externally_connectable: {
    matches: ["http://localhost:3000/*"],
  },
});
