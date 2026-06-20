import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Label } from "@auronui/vue";

const meta: Meta<typeof Label> = {
  component: Label,
  title: "Form/Label",
  tags: ["autodocs"],
  argTypes: {
    isDisabled: { control: "boolean" },
    isInvalid: { control: "boolean" },
    isRequired: { control: "boolean" },
  },
  args: {
    isDisabled: false,
    isInvalid: false,
    isRequired: false,
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Label } from '@auronui/vue'
</script>

<template>
  <Label>Email address</Label>
</template>`,
        type: 'code',
        language: 'vue',
      }
    }
  },
  render: (args) => ({
    components: { Label },
    setup: () => ({ args }),
    template: `<Label v-bind="args">Email address</Label>`,
  }),
};

export const Disabled: Story = {
  render: (args) => ({
    components: { Label },
    setup: () => ({ args }),
    template: `<Label v-bind="args">Disabled label</Label>`,
  }),
  args: { isDisabled: true },
};

export const Invalid: Story = {
  render: (args) => ({
    components: { Label },
    setup: () => ({ args }),
    template: `<Label v-bind="args">Invalid field label</Label>`,
  }),
  args: { isInvalid: true },
};

export const Required: Story = {
  render: (args) => ({
    components: { Label },
    setup: () => ({ args }),
    template: `<Label v-bind="args">Required field *</Label>`,
  }),
  args: { isRequired: true },
};

export const AllStates: Story = {
  render: (args) => ({
    components: { Label },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <Label v-bind="args">Default label</Label>
        <Label v-bind="args" :isDisabled="true">Disabled label</Label>
        <Label v-bind="args" :isInvalid="true">Invalid label</Label>
        <Label v-bind="args" :isRequired="true">Required label *</Label>
      </div>
    `,
  }),
};
