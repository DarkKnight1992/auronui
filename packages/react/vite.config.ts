import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { isExternal } from "./vite.external";

const __dirname = fileURLToPath(new URL(".", import.meta.url));


export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: ["src/**/__tests__/**"],
      outDir: "dist",
      rollupTypes: true,
      compilerOptions: { rootDir: "src", noEmitOnError: false, skipLibCheck: true },
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    rollupOptions: {
      // Every dependency and peer dependency, subpaths included — see vite.external.ts.
      external: isExternal,
      output: [
        {
          format: "es",
          dir: "dist",
          preserveModules: true,
          preserveModulesRoot: "src",
          entryFileNames: "[name].js",
        },
        {
          format: "cjs",
          dir: "dist/cjs",
          preserveModules: false,
          entryFileNames: "index.cjs",
        },
      ],
    },
    cssCodeSplit: false,
    sourcemap: true,
    minify: false,
  },
});
