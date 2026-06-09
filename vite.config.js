import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" keeps asset paths relative, so the build works whether it's
// served from a domain root (Vercel/Netlify) or a subfolder (GitHub Pages).
export default defineConfig({
  base: "./",
  plugins: [react()],
});
