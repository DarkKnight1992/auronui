import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync } from "node:fs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Collect all component index.ts as explicit entries so rolldown preserves them
const componentEntries = readdirSync(resolve(__dirname, "src/components"), {
  withFileTypes: true,
})
  .filter((d) => d.isDirectory())
  .reduce<Record<string, string>>((acc, d) => {
    acc[`components/${d.name}/index`] = resolve(
      __dirname,
      `src/components/${d.name}/index.ts`,
    );
    return acc;
  }, {});

export default defineConfig({
  plugins: [
    dts({
      include: ["src/**/*.ts"],
      outDir: "dist",
      compilerOptions: { rootDir: "src", noEmitOnError: false, skipLibCheck: true },
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        ...componentEntries,
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: [/^tailwind-variants/],
      output: {
        format: "es",
        dir: "dist",
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
    sourcemap: true,
    minify: false,
  },
});
