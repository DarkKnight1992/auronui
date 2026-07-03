import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.spec.ts"],
    testTimeout: 60000,
    // Nuxt's server: true setup() cold-starts a dev server, which can exceed
    // vitest's default 120s hook timeout in slower/sandboxed environments.
    hookTimeout: 180000,
  },
});
