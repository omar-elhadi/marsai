import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const keyPath = "/home/kaneki_ken/bin/certs/localhost+2-key.pem";
const certPath = "/home/kaneki_ken/bin/certs/localhost+2.pem";
const httpsConfig =
  fs.existsSync(keyPath) && fs.existsSync(certPath)
    ? { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) }
    : false;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // C'est cette ligne qui active le moteur Tailwind v4
    // alias à configuer

    // NOTE: configs HTTPS
  ],
  server: {
    https: httpsConfig,
    host: "0.0.0.0",
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
