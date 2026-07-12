import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Spinner } from "@auronui/vue";

const meta: Meta<typeof Spinner> = {
  component: Spinner,
  title: "Components/Spinner",
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg", "xl"] },
    color: {
      control: "select",
      options: ["primary", "accent", "current", "danger", "success", "warning"],
    },
  },
  args: {
    size: "md",
    color: "primary",
    label: "Loading",
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Spinner } from '@auronui/vue'
</script>

<template>
  <Spinner size="md" color="primary" label="Loading" />
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
export const ExtraLarge: Story = { args: { size: "xl" } };
export const Accent: Story = { args: { color: "accent" } };
export const Danger: Story = { args: { color: "danger" } };
export const Success: Story = { args: { color: "success" } };
export const Warning: Story = { args: { color: "warning" } };
export const Current: Story = { args: { color: "current" } };
