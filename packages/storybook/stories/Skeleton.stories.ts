import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Skeleton } from "@auronui/vue";

const meta: Meta<typeof Skeleton> = {
  component: Skeleton,
  title: "Components/Skeleton",
  tags: ["autodocs"],
  argTypes: {
    animationType: { control: "select", options: ["shimmer", "pulse", "none"] },
    classNames: { control: "object", description: "Per-slot class overrides. Keys match the component anatomy slot names." },
  },
  args: {
    animationType: "shimmer",
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  render: (args) => ({
    components: { Skeleton },
    setup: () => ({ args }),
    template: `<Skeleton v-bind="args" style="width: 200px; height: 16px; border-radius: 4px;" />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Skeleton } from '@auronui/vue'
</script>

<template>
  <Skeleton style="width: 200px; height: 16px; border-radius: 4px;" />
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Shimmer: Story = {
  render: (args) => ({
    components: { Skeleton },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <Skeleton v-bind="args" style="width: 300px; height: 16px; border-radius: 4px;" />
        <Skeleton v-bind="args" style="width: 240px; height: 16px; border-radius: 4px;" />
        <Skeleton v-bind="args" style="width: 180px; height: 16px; border-radius: 4px;" />
      </div>
    `,
  }),
  args: { animationType: "shimmer" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Skeleton } from '@auronui/vue'
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <Skeleton animation-type="shimmer" style="width: 300px; height: 16px; border-radius: 4px;" />
    <Skeleton animation-type="shimmer" style="width: 240px; height: 16px; border-radius: 4px;" />
    <Skeleton animation-type="shimmer" style="width: 180px; height: 16px; border-radius: 4px;" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Pulse: Story = {
  render: (args) => ({
    components: { Skeleton },
    setup: () => ({ args }),
    template: `<Skeleton v-bind="args" style="width: 200px; height: 100px; border-radius: 8px;" />`,
  }),
  args: { animationType: "pulse" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Skeleton } from '@auronui/vue'
</script>

<template>
  <Skeleton animation-type="pulse" style="width: 200px; height: 100px; border-radius: 8px;" />
</template>`,
        language: 'vue',
      },
    },
  },
};

export const NoAnimation: Story = {
  render: (args) => ({
    components: { Skeleton },
    setup: () => ({ args }),
    template: `<Skeleton v-bind="args" style="width: 200px; height: 16px; border-radius: 4px;" />`,
  }),
  args: { animationType: "none" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Skeleton } from '@auronui/vue'
</script>

<template>
  <Skeleton animation-type="none" style="width: 200px; height: 16px; border-radius: 4px;" />
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Card: Story = {
  render: (args) => ({
    components: { Skeleton },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 300px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <Skeleton v-bind="args" style="width: 100%; height: 160px; border-radius: 6px;" />
        <Skeleton v-bind="args" style="width: 80%; height: 16px; border-radius: 4px;" />
        <Skeleton v-bind="args" style="width: 60%; height: 14px; border-radius: 4px;" />
      </div>
    `,
  }),
  args: { animationType: "shimmer" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Skeleton } from '@auronui/vue'
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px; width: 300px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px;">
    <Skeleton animation-type="shimmer" style="width: 100%; height: 160px; border-radius: 6px;" />
    <Skeleton animation-type="shimmer" style="width: 80%; height: 16px; border-radius: 4px;" />
    <Skeleton animation-type="shimmer" style="width: 60%; height: 14px; border-radius: 4px;" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  render: (args) => ({
    components: { Skeleton },
    setup: () => ({ args }),
    template: `<Skeleton v-bind="args" style="width: 200px; height: 16px;" />`,
  }),
  args: {
    animationType: "shimmer",
    classNames: {
      base: "border-2 border-blue-500 rounded-lg",
    },
  },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Skeleton } from '@auronui/vue'
</script>

<template>
  <Skeleton
    animation-type="shimmer"
    :class-names="{ base: 'border-2 border-blue-500 rounded-lg' }"
    style="width: 200px; height: 16px;"
  />
</template>`,
        language: 'vue',
      },
    },
  },
};
