import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Separator } from "@auronui/vue";

const meta: Meta<typeof Separator> = {
  component: Separator,
  title: "Components/Separator",
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    variant: { control: "select", options: ["default", "dashed"] },
  },
  args: {
    orientation: "horizontal",
    variant: "default",
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Separator } from '@auronui/vue'
</script>

<template>
  <Separator />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  decorators: [
    () => ({
      template: '<div style="display: flex; height: 64px; align-items: center;"><story /></div>',
    }),
  ],
};

export const Dashed: Story = { args: { variant: "dashed" } };

export const WithLabel: Story = {
  render: (args) => ({
    components: { Separator },
    setup: () => ({ args }),
    template: `<Separator v-bind="args"><template #default>OR</template></Separator>`,
  }),
  args: { orientation: "horizontal" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Separator } from '@auronui/vue'
</script>

<template>
  <Separator orientation="horizontal">OR</Separator>
</template>`,
        language: 'vue',
      },
    },
  },
};
