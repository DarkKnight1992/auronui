import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const external = [
  "vue",
  "reka-ui",
  "@vueuse/core",
  "tailwind-variants",
  "tailwind-merge",
  "@auronui/styles",
];

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    dts({
      include: ["src/**/*.ts", "src/**/*.vue"],
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
      // CRITICAL: Externalize all peer deps — do NOT bundle them
      // See RESEARCH.md Pitfall 3
      external,
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
