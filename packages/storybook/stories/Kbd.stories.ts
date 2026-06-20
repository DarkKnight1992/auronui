import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Kbd } from "@auronui/vue";

const meta: Meta<typeof Kbd> = {
  component: Kbd,
  title: "Components/Kbd",
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "light"] },
    classNames: { control: "object", description: "Per-slot class overrides. Keys match the component anatomy slot names." },
  },
  args: {
    variant: "default",
  },
};

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Kbd } from '@auronui/vue'
</script>

<template>
  <Kbd>⌘K</Kbd>
</template>`,
        language: 'vue',
      }
    }
  },
  render: (args) => ({
    components: { Kbd },
    setup: () => ({ args }),
    template: `<Kbd v-bind="args">⌘K</Kbd>`,
  }),
};

export const Light: Story = {
  render: (args) => ({
    components: { Kbd },
    setup: () => ({ args }),
    template: `<Kbd v-bind="args">⌘K</Kbd>`,
  }),
  args: { variant: "light" },
};

export const WithAbbr: Story = {
  render: (args) => ({
    components: { Kbd },
    setup: () => ({ args }),
    template: `
      <Kbd v-bind="args">
        <template #abbr>Ctrl</template>
        C
      </Kbd>
    `,
  }),
};

export const CommonShortcuts: Story = {
  render: (args) => ({
    components: { Kbd },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        <Kbd v-bind="args">⌘</Kbd>
        <Kbd v-bind="args">⌥</Kbd>
        <Kbd v-bind="args">⇧</Kbd>
        <Kbd v-bind="args">⌃</Kbd>
        <Kbd v-bind="args">⌫</Kbd>
        <Kbd v-bind="args">↵</Kbd>
        <Kbd v-bind="args">⎋</Kbd>
        <Kbd v-bind="args">⇥</Kbd>
      </div>
    `,
  }),
};

export const LightVariantShowcase: Story = {
  render: (args) => ({
    components: { Kbd },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 8px; align-items: center;">
        <Kbd v-bind="args" variant="default">⌘K</Kbd>
        <span style="font-size: 12px; color: #888;">vs</span>
        <Kbd v-bind="args" variant="light">⌘K</Kbd>
      </div>
    `,
  }),
};

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  render: (args) => ({
    components: { Kbd },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <Kbd v-bind="args" :class-names="{
          base: 'border-2 border-blue-500 bg-blue-50 rounded-lg',
          content: 'text-blue-700 font-semibold',
        }">⌘K</Kbd>
        <Kbd v-bind="args" :class-names="{
          base: 'border-2 border-purple-500 bg-purple-50',
          abbr: 'text-purple-600 font-bold',
          content: 'text-purple-700',
        }">
          <template #abbr>Ctrl</template>
          C
        </Kbd>
      </div>
    `,
  }),
};
