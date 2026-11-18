import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import pluginChecker from "vite-plugin-checker";
import path from "path";

export default defineConfig({
  plugins: [react(), pluginChecker({ typescript: true })],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "ShKit",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "shkit.js" : "shkit.cjs")
    },
    rollupOptions: {
      external: ["react", "react-dom", "react-dom/client", "react/jsx-runtime"]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  }
});
