import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Text } from "@auronui/vue";

const meta: Meta<typeof Text> = {
  component: Text,
  title: "Components/Text",
  tags: ["autodocs"],
  argTypes: {
    as: { control: "select", options: ["p", "span", "div", "h1", "h2"] },
    size: { control: "select", options: ["xs", "sm", "base", "lg", "xl"] },
    variant: {
      control: "select",
      options: ["default", "muted", "accent", "danger", "success"],
    },
  },
  args: {
    as: "p",
    size: "base",
    variant: "default",
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {
  render: (args) => ({
    components: { Text },
    setup: () => ({ args }),
    template: `<Text v-bind="args">The quick brown fox jumps over the lazy dog.</Text>`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Text } from '@auronui/vue'
</script>

<template>
  <Text>The quick brown fox jumps over the lazy dog.</Text>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const ExtraSmall: Story = {
  render: (args) => ({
    components: { Text },
    setup: () => ({ args }),
    template: `<Text v-bind="args">Extra small text</Text>`,
  }),
  args: { size: "xs" },
};

export const Small: Story = {
  render: (args) => ({
    components: { Text },
    setup: () => ({ args }),
    template: `<Text v-bind="args">Small text</Text>`,
  }),
  args: { size: "sm" },
};

export const Large: Story = {
  render: (args) => ({
    components: { Text },
    setup: () => ({ args }),
    template: `<Text v-bind="args">Large text</Text>`,
  }),
  args: { size: "lg" },
};

export const ExtraLarge: Story = {
  render: (args) => ({
    components: { Text },
    setup: () => ({ args }),
    template: `<Text v-bind="args">Extra large text</Text>`,
  }),
  args: { size: "xl" },
};

export const Muted: Story = {
  render: (args) => ({
    components: { Text },
    setup: () => ({ args }),
    template: `<Text v-bind="args">Muted text variant</Text>`,
  }),
  args: { variant: "muted" },
};

export const Accent: Story = {
  render: (args) => ({
    components: { Text },
    setup: () => ({ args }),
    template: `<Text v-bind="args">Accent text variant</Text>`,
  }),
  args: { variant: "accent" },
};

export const Danger: Story = {
  render: (args) => ({
    components: { Text },
    setup: () => ({ args }),
    template: `<Text v-bind="args">Danger text variant</Text>`,
  }),
  args: { variant: "danger" },
};

export const Success: Story = {
  render: (args) => ({
    components: { Text },
    setup: () => ({ args }),
    template: `<Text v-bind="args">Success text variant</Text>`,
  }),
  args: { variant: "success" },
};

export const AsSpan: Story = {
  render: (args) => ({
    components: { Text },
    setup: () => ({ args }),
    template: `<Text v-bind="args">Rendered as a span element</Text>`,
  }),
  args: { as: "span" },
};
