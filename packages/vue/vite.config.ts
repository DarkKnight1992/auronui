import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { isExternal } from "./vite.external";

const __dirname = fileURLToPath(new URL(".", import.meta.url));


export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    dts({
      include: ["src/**/*.ts", "src/**/*.vue"],
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
      // CRITICAL: externalize every dependency and peer dependency, subpaths
      // included — see vite.external.ts. See RESEARCH.md Pitfall 3.
      external: isExternal,
      output: [
        {
          format: "es",
          dir: "dist",
          preserveModules: true,
          preserveModulesRoot: "src",
          entryFileNames: "[name].js",
          globals: {
            vue: "Vue",
            "reka-ui": "RekaUI",
            "@vueuse/core": "VueUse",
          },
        },
        {
          format: "cjs",
          dir: "dist/cjs",
          preserveModules: false,
          entryFileNames: "index.cjs",
          globals: {
            vue: "Vue",
            "reka-ui": "RekaUI",
            "@vueuse/core": "VueUse",
          },
        },
      ],
    },
    cssCodeSplit: false,
    sourcemap: true,
    minify: false,
  },
});
