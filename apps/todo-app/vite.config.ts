import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";

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
    proxy: {
      "/api/v1": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), tsconfigPaths()],
});
