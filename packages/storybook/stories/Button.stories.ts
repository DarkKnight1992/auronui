import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Button } from "@auronui/vue";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "default", "outline", "ghost", "soft"],
    },
    color: {
      control: "select",
      options: ["default", "primary", "success", "warning", "danger"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    radius: {
      control: "select",
      options: [undefined, "none", "sm", "md", "lg", "full"],
    },
    isIconOnly: { control: "boolean" },
    fullWidth: { control: "boolean" },
    disabled: { control: "boolean" },
    isLoading: { control: "boolean" },
    classNames: {
      control: "object",
      description:
        "Per-slot class overrides. Keys match the component anatomy slot names: base, startContent, label, endContent, spinner.",
    },
  },
  args: {
    variant: "solid",
    color: "primary",
    size: "md",
    radius: undefined,
    isIconOnly: false,
    fullWidth: false,
    disabled: false,
    isLoading: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Click me</Button>',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Button } from '@auronui/vue'
</script>

<template>
  <Button variant="primary">Click me</Button>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
};

export const AllVariants: Story = {
  args: {
    isLoading: false,
    size: "sm",
    color: "primary",
  },

  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        <Button v-bind="args" variant="solid">Solid</Button>
        <Button v-bind="args" variant="soft">Soft</Button>
        <Button v-bind="args" variant="default">Default</Button>
        <Button v-bind="args" variant="outline">Outline</Button>
        <Button v-bind="args" variant="ghost">Ghost</Button>
      </div>
    `,
  }),
};

export const AllColors: Story = {
  args: {
    isLoading: false,
    size: "sm",
    variant: "solid",
  },

  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        <Button v-bind="args" color="default">Default</Button>
        <Button v-bind="args" color="primary">Primary</Button>
        <Button v-bind="args" color="success">Success</Button>
        <Button v-bind="args" color="warning">Warning</Button>
        <Button v-bind="args" color="danger">Danger</Button>
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: `
      <div style="display:flex;align-items:center;gap:8px">
        <Button v-bind="args" size="sm">Small</Button>
        <Button v-bind="args" size="md">Medium</Button>
        <Button v-bind="args" size="lg">Large</Button>
      </div>
    `,
  }),
};

export const Loading: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: `
      <div style="display:flex;gap:8px">
        <Button v-bind="args" :isLoading="true" size="sm">Loading</Button>
        <Button v-bind="args" :isLoading="true" size="md">Loading</Button>
        <Button v-bind="args" :isLoading="true" size="lg">Loading</Button>
      </div>
    `,
  }),
};

export const DisabledState: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: `
      <div style="display:flex;gap:8px">
        <Button v-bind="args" :disabled="true" variant="solid">Disabled Solid</Button>
        <Button v-bind="args" :disabled="true" variant="outline">Disabled Outline</Button>
      </div>
    `,
  }),
};

export const FullWidth: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args" :fullWidth="true">Full Width Button</Button>',
  }),
};

export const WithContentSlots: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: `
      <div style="display:flex;gap:8px">
        <Button v-bind="args">
          <template #startContent><span>★</span></template>
          With Icon
        </Button>
        <Button v-bind="args">
          With Icon
          <template #endContent><span>→</span></template>
        </Button>
      </div>
    `,
  }),
};

export const AllRadii: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: `
      <div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px">
        <Button v-bind="args" radius="none">None</Button>
        <Button v-bind="args" radius="sm">Small</Button>
        <Button v-bind="args" radius="md">Medium</Button>
        <Button v-bind="args" radius="lg">Large</Button>
        <Button v-bind="args" radius="full">Full</Button>
      </div>
    `,
  }),
};

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: `
      <div style="display:flex;gap:16px">
        <Button
          v-bind="args"
          :class-names="{
            base: 'border-2 border-blue-500 rounded-xl',
            label: 'text-blue-700 font-semibold',
            startContent: 'text-blue-600',
          }"
        >
          <template #startContent>★</template>
          Custom Styled
        </Button>
        <Button
          v-bind="args"
          variant="outline"
          :class-names="{
            base: 'border-2 border-emerald-400 bg-emerald-50',
            label: 'text-emerald-700 font-bold',
          }"
        >
          Success Theme
        </Button>
      </div>
    `,
  }),
};
