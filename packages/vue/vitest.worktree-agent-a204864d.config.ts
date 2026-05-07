import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const WORKTREE = "/home/ghost/workspace/ai/auron/.claude/worktrees/agent-a204864d";
const MAIN_VUE_NM = "/home/ghost/workspace/ai/auron/packages/vue/node_modules";

// Resolve a package from the main repo's packages/vue node_modules
const res = (pkg: string) => `${MAIN_VUE_NM}/${pkg}`;

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [
      fileURLToPath(new URL("../../packages/vitest/setup.ts", import.meta.url)),
    ],
    include: [
      `${WORKTREE}/packages/vue/src/components/list-box/**/*.{test,spec}.ts`,
      `${WORKTREE}/packages/vue/src/components/select/**/*.{test,spec}.ts`,
    ],
  },
  resolve: {
    alias: [
      { find: "@auronui/styles", replacement: `${WORKTREE}/packages/styles/src/index.ts` },
      { find: "@auronui/vue", replacement: `${WORKTREE}/packages/vue/src/index.ts` },
      { find: "vue", replacement: res("vue") },
      { find: "reka-ui", replacement: res("reka-ui") },
      { find: "motion-v", replacement: res("motion-v") },
      { find: "@vue/test-utils", replacement: res("@vue/test-utils") },
      { find: "axe-core", replacement: res("axe-core") },
      { find: "tailwind-variants", replacement: res("tailwind-variants") },
      { find: "tailwind-merge", replacement: res("tailwind-merge") },
      { find: "@vueuse/core", replacement: res("@vueuse/core") },
    ],
  },
});
