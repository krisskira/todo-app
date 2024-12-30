import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: path.resolve(__dirname, "../../", "dist/apps/api/public"),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    origin: "http://0.0.0.0:3000",
  },
  plugins: [react()],
});
