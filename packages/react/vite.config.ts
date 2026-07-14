import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const external = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  "react-aria",
  "react-aria-components",
  "react-stately",
  "tailwind-variants",
  "tailwind-merge",
  "@auronui/styles",
  "@internationalized/date",
  "@radix-ui/react-accordion",
  "@radix-ui/react-context-menu",
  "@radix-ui/react-menubar",
  "@radix-ui/react-navigation-menu",
  "@radix-ui/react-scroll-area",
  "@radix-ui/react-slot",
  "@radix-ui/react-toolbar",
  "@tanstack/react-table",
  "@tanstack/react-virtual",
  "framer-motion",
  "react-hook-form",
];

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      include: ["src/**/*.ts", "src/**/*.tsx"],
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
      external,
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
