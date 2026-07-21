import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.spec.ts"],
    testTimeout: 60000,
    // Nuxt's server: true setup() cold-starts a dev server, which can exceed
    // vitest's default 120s hook timeout in slower/sandboxed environments.
    // Note: @nuxt/test-utils' setup() also needs its own `setupTimeout` option
    // passed directly (see test/ssr.spec.ts) — this hookTimeout alone does not
    // cover that hook, since test-utils registers it with an explicit timeout
    // that overrides vitest's global setting.
    hookTimeout: 300000,
  },
});
