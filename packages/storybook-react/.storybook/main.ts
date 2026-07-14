import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";

const config: StorybookConfig = {
  stories: [
    "../../../packages/react/src/**/*.stories.tsx",
    "../stories/**/*.stories.tsx",
  ],
  addons: ["@storybook/addon-vitest", "@storybook/addon-essentials", "@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal(config) {
    // CRITICAL: @tailwindcss/vite must be added here or CSS layers won't apply — same pitfall
    // as the Vue Storybook config (see packages/storybook/.storybook/main.ts).
    config.plugins = [react(), tailwindcss(), ...(config.plugins ?? [])];
    config.resolve = {
      ...config.resolve,
      // Prevent duplicate react instances when aliasing @auronui/react to source —
      // same reasoning as the Vue config's `dedupe` for vue/reka-ui/@vueuse/core.
      dedupe: ["react", "react-dom"],
      alias: {
        ...config.resolve?.alias,
        "@auronui/react": path.resolve(import.meta.dirname, "../../../packages/react/src/index.ts"),
      },
    };
    return config;
  },
};

export default config;
