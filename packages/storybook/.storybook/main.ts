import type { StorybookConfig } from "@storybook/vue3-vite";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

const config: StorybookConfig = {
  stories: [
    "../../../packages/vue/src/**/*.stories.ts",
    "../../../packages/vue/src/**/*.stories.vue",
    "../stories/**/*.stories.ts",
    "../stories/**/*.stories.vue",
  ],
  // In Storybook 10, @storybook/addon-essentials was absorbed into the core storybook package.
  // Essential addons (controls, actions, docs, etc.) are built-in and do not require separate installation.
  addons: ["@storybook/addon-vitest", "@storybook/addon-essentials", "@storybook/addon-docs"],
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
  viteFinal(config) {
    // CRITICAL: @tailwindcss/vite must be added here or CSS layers won't apply
    // See RESEARCH.md Pitfall 5
    // vue() must be explicit — @storybook/vue3-vite does not bundle @vitejs/plugin-vue
    // vue() MUST come before storybook's own plugins.
    // The storybook meta plugin appends __docgenInfo raw JS outside any <script> block.
    // If vite:vue processes the file first (already-compiled JS), the meta plugin appends
    // to valid JS instead of raw SFC content, avoiding "Element is missing end tag" errors.
    config.plugins = [vue(), tailwindcss(), ...(config.plugins ?? [])];
    config.resolve = {
      ...config.resolve,
      // Prevent duplicate vue/reka-ui instances when aliasing @auronui/vue to source.
      // packages/vue and packages/storybook each have their own node_modules/vue,
      // which breaks provide/inject across compound components.
      dedupe: ['vue', 'reka-ui', '@vueuse/core'],
      alias: {
        ...config.resolve?.alias,
        '@auronui/vue': path.resolve(import.meta.dirname, '../../../packages/vue/src/index.ts'),
      },
    }
    return config;
  },
};

export default config;
