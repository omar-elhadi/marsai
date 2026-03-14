import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // C'est cette ligne qui active le moteur Tailwind v4
    // alias à configuer

    // NOTE: configs HTTPS
  ],
  server: {
    https: {
      key: fs.readFileSync("/home/kaneki_ken/bin/certs/localhost+2-key.pem"),
      cert: fs.readFileSync("/home/kaneki_ken/bin/certs/localhost+2.pem"),
    },
    host: "localhost",
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
