import type { Preview } from "@storybook/react-vite";
import { addons } from "storybook/preview-api";
import { GLOBALS_UPDATED } from "storybook/internal/core-events";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@auronui/styles/css";
import "./storybook.css";

function applyTheme(theme: string) {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(theme);
}

// React to toolbar clicks immediately — no page refresh needed
addons.getChannel().on(GLOBALS_UPDATED, ({ globals }: { globals: Record<string, string> }) => {
  applyTheme(globals.colorScheme ?? "light");
});

export const globalTypes = {
  colorScheme: {
    name: "Color scheme",
    defaultValue: "light",
    toolbar: {
      icon: "mirror",
      items: [
        { value: "light", title: "Light", icon: "sun" },
        { value: "dark", title: "Dark", icon: "moon" },
      ],
      dynamicTitle: true,
    },
  },
};

export const decorators = [
  (Story: React.ComponentType, context: { globals: Record<string, string> }) => {
    applyTheme(context.globals.colorScheme ?? "light");
    return <Story />;
  },
];

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/i,
    },
  },
  backgrounds: { disable: true },
  docs: {
    codePanel: true,
  },
};

const preview: Preview = {};
export default preview;
