import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ScrollShadow } from "@auronui/vue";

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ".repeat(
    6
  );

const meta: Meta<typeof ScrollShadow> = {
  component: ScrollShadow,
  title: "Components/ScrollShadow",
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal", "both"],
    },
    size: { control: { type: "number", min: 0, max: 200 } },
    hideScrollBar: { control: "boolean" },
    classNames: {
      control: "object",
      description:
        "Per-slot class overrides. Keys match the component anatomy slot names.",
    },
  },
  args: {
    orientation: "vertical",
    size: 40,
    hideScrollBar: false,
  },
};

export default meta;
type Story = StoryObj<typeof ScrollShadow>;

export const Vertical: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ScrollShadow } from '@auronui/vue'
</script>

<template>
  <ScrollShadow orientation="vertical" style="height: 200px; width: 400px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px;">
    <p style="margin: 0; line-height: 1.6;">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
    </p>
  </ScrollShadow>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ScrollShadow },
    setup: () => ({ args, LOREM }),
    template: `
      <ScrollShadow v-bind="args" style="height: 200px; width: 400px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <p style="margin: 0; line-height: 1.6;">{{ LOREM }}</p>
      </ScrollShadow>
    `,
  }),
};

export const Horizontal: Story = {
  render: (args) => ({
    components: { ScrollShadow },
    setup: () => ({ args }),
    template: `
      <ScrollShadow v-bind="args" orientation="horizontal" style="width: 300px; padding: 8px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="display: flex; flex-direction: row; gap: 12px; width: max-content; padding: 4px 0;">
          <div v-for="n in 20" :key="n" style="width: 80px; height: 60px; background: #e2e8f0; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            {{ n }}
          </div>
        </div>
      </ScrollShadow>
    `,
  }),
};

export const HideScrollBar: Story = {
  render: (args) => ({
    components: { ScrollShadow },
    setup: () => ({ args, LOREM }),
    template: `
      <ScrollShadow v-bind="args" :hideScrollBar="true" style="height: 200px; width: 400px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <p style="margin: 0; line-height: 1.6;">{{ LOREM }}</p>
      </ScrollShadow>
    `,
  }),
  args: {
    hideScrollBar: true,
  },
};

export const CustomSize: Story = {
  render: (args) => ({
    components: { ScrollShadow },
    setup: () => ({ args, LOREM }),
    template: `
      <ScrollShadow v-bind="args" style="height: 200px; width: 400px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <p style="margin: 0; line-height: 1.6;">{{ LOREM }}</p>
      </ScrollShadow>
    `,
  }),
  args: {
    size: 80,
  },
};

export const BothOrientations: Story = {
  render: (args) => ({
    components: { ScrollShadow },
    setup: () => ({ args }),
    template: `
      <ScrollShadow v-bind="args" orientation="both" style="height: 200px; width: 300px; padding: 8px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: auto;">
        <div style="width: 600px;">
          <p v-for="n in 20" :key="n" style="margin: 0 0 8px; line-height: 1.6; white-space: nowrap;">
            Line {{ n }}: This is a very long line that extends beyond the container width to trigger horizontal scrolling.
          </p>
        </div>
      </ScrollShadow>
    `,
  }),
  args: {
    orientation: "both",
  },
};

export const CustomStyles: Story = {
  render: (args) => ({
    components: { ScrollShadow },
    setup: () => ({ args, LOREM }),
    template: `
      <ScrollShadow
        v-bind="args"
        style="height: 200px; width: 400px; padding: 12px; border-radius: 8px;"
        :class-names="{
          base: 'rounded-2xl border-2 border-blue-500 bg-blue-50 shadow-lg',
        }"
      >
        <p style="margin: 0; line-height: 1.6;">{{ LOREM }}</p>
      </ScrollShadow>
    `,
  }),
  args: {
    orientation: "vertical",
  },
  name: "Custom styles via classNames",
};
