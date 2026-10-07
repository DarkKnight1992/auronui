// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["@auronui/styles/css"],
  compatibilityDate: "2024-11-01",
  ssr: true, // Explicitly enabled (default)
  // DevTools' dev-server RPC is the only consumer of simple-git, whose 3.x line
  // (all @nuxt/devtools 3 supports) has unpatched command-execution advisories.
  // This app only exists for the SSR smoke test, so it never needs DevTools.
  devtools: { enabled: false },
  typescript: {
    strict: true,
  },
});
