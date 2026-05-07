import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: "src/main.ts",
      output: {
        format: "es",
      },
    },
    minify: false, // Unminified so we can grep for function names
  },
});
