import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ProgressCircle } from "@auronui/vue";

const meta: Meta<typeof ProgressCircle> = {
  component: ProgressCircle,
  title: "Components/ProgressCircle",
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "accent", "success", "warning", "danger"],
    },
    strokeWidth: { control: "number" },
    classNames: { control: "object", description: "Per-slot class overrides. Keys match the component anatomy slot names." },
    as: {
      control: "text",
      description: "Element or component to render ProgressRoot as.",
      table: { category: "ProgressRoot", defaultValue: { summary: "undefined" } },
    },
    asChild: {
      control: "boolean",
      description: "Whether ProgressRoot renders as a child element.",
      table: { category: "ProgressRoot", defaultValue: { summary: "false" } },
    },
    getValueLabel: {
      control: false,
      description: "Function to get the accessible label for the current value.",
      table: { category: "ProgressRoot", defaultValue: { summary: "undefined" } },
    },
    getValueText: {
      control: false,
      description: "Function to get the accessible text for the current value.",
      table: { category: "ProgressRoot", defaultValue: { summary: "undefined" } },
    },
  },
  args: {
    value: 75,
    maxValue: 100,
    size: "md",
    color: "primary",
    strokeWidth: 3,
  },
};

export default meta;
type Story = StoryObj<typeof ProgressCircle>;

export const Default: Story = {
  args: {
    asChild: false,
  },
  render: (args) => ({
    components: { ProgressCircle },
    setup: () => ({ args }),
    template: `<ProgressCircle v-bind="args" :as="args.as" :as-child="args.asChild" />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ProgressCircle } from '@auronui/vue'
</script>

<template>
  <ProgressCircle :value="75" :max-value="100" size="md" color="primary" :stroke-width="3" />
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Determinate: Story = {
  render: (args) => ({
    components: { ProgressCircle },
    setup: () => ({ args }),
    template: `<ProgressCircle v-bind="args" />`,
  }),
  args: { value: 75, label: "Upload progress", showValueLabel: true },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ProgressCircle } from '@auronui/vue'
</script>

<template>
  <ProgressCircle :value="75" label="Upload progress" :show-value-label="true" />
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Indeterminate: Story = {
  render: (args) => ({
    components: { ProgressCircle },
    setup: () => ({ args }),
    template: `<ProgressCircle v-bind="args" />`,
  }),
  args: { value: null, label: "Loading" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ProgressCircle } from '@auronui/vue'
</script>

<template>
  <ProgressCircle :value="null" label="Loading" />
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Sizes: Story = {
  render: (args) => ({
    components: { ProgressCircle },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <ProgressCircle v-bind="args" value="60" size="sm" label="Small" />
        <ProgressCircle v-bind="args" value="60" size="md" label="Medium" />
        <ProgressCircle v-bind="args" value="60" size="lg" label="Large" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ProgressCircle } from '@auronui/vue'
</script>

<template>
  <div style="display: flex; gap: 24px; align-items: center;">
    <ProgressCircle :value="60" size="sm" label="Small" />
    <ProgressCircle :value="60" size="md" label="Medium" />
    <ProgressCircle :value="60" size="lg" label="Large" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Colors: Story = {
  parameters: {
    controls: { exclude: ['color'] },
    docs: {
      source: {
        code: `<script setup>
import { ProgressCircle } from '@auronui/vue'
</script>

<template>
  <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
    <ProgressCircle :value="60" color="default" label="Default" />
    <ProgressCircle :value="60" color="primary" label="Primary" />
    <ProgressCircle :value="60" color="secondary" label="Secondary" />
    <ProgressCircle :value="60" color="accent" label="Accent" />
    <ProgressCircle :value="60" color="success" label="Success" />
    <ProgressCircle :value="60" color="warning" label="Warning" />
    <ProgressCircle :value="60" color="danger" label="Danger" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ProgressCircle },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
        <ProgressCircle v-bind="args" value="60" color="default" label="Default" />
        <ProgressCircle v-bind="args" value="60" color="primary" label="Primary" />
        <ProgressCircle v-bind="args" value="60" color="secondary" label="Secondary" />
        <ProgressCircle v-bind="args" value="60" color="accent" label="Accent" />
        <ProgressCircle v-bind="args" value="60" color="success" label="Success" />
        <ProgressCircle v-bind="args" value="60" color="warning" label="Warning" />
        <ProgressCircle v-bind="args" value="60" color="danger" label="Danger" />
      </div>
    `,
  }),
};

export const WithValueLabel: Story = {
  render: (args) => ({
    components: { ProgressCircle },
    setup: () => ({ args }),
    template: `<ProgressCircle v-bind="args" />`,
  }),
  args: { value: 75, showValueLabel: true, label: "Progress" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ProgressCircle } from '@auronui/vue'
</script>

<template>
  <ProgressCircle :value="75" :show-value-label="true" label="Progress" />
</template>`,
        language: 'vue',
      },
    },
  },
};

export const CustomStrokeWidth: Story = {
  render: (args) => ({
    components: { ProgressCircle },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <ProgressCircle v-bind="args" value="60" :stroke-width="1" label="Thin (1)" />
        <ProgressCircle v-bind="args" value="60" :stroke-width="3" label="Default (3)" />
        <ProgressCircle v-bind="args" value="60" :stroke-width="5" label="Thick (5)" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ProgressCircle } from '@auronui/vue'
</script>

<template>
  <div style="display: flex; gap: 24px; align-items: center;">
    <ProgressCircle :value="60" :stroke-width="1" label="Thin (1)" />
    <ProgressCircle :value="60" :stroke-width="3" label="Default (3)" />
    <ProgressCircle :value="60" :stroke-width="5" label="Thick (5)" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Disabled: Story = {
  render: (args) => ({
    components: { ProgressCircle },
    setup: () => ({ args }),
    template: `<ProgressCircle v-bind="args" />`,
  }),
  args: { value: 50, isDisabled: true, label: "Disabled" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ProgressCircle } from '@auronui/vue'
</script>

<template>
  <ProgressCircle :value="50" :is-disabled="true" label="Disabled" />
</template>`,
        language: 'vue',
      },
    },
  },
};

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  render: (args) => ({
    components: { ProgressCircle },
    setup: () => ({ args }),
    template: `<ProgressCircle v-bind="args" />`,
  }),
  args: {
    value: 65,
    label: "Custom styled",
    showValueLabel: true,
    classNames: {
      svg: "drop-shadow-lg",
      track: "stroke-blue-200",
      indicator: "stroke-blue-600",
      value: "text-blue-700 font-bold text-sm",
    },
  },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ProgressCircle } from '@auronui/vue'
</script>

<template>
  <ProgressCircle
    :value="65"
    label="Custom styled"
    :show-value-label="true"
    :class-names="{
      svg: 'drop-shadow-lg',
      track: 'stroke-blue-200',
      indicator: 'stroke-blue-600',
      value: 'text-blue-700 font-bold text-sm',
    }"
  />
</template>`,
        language: 'vue',
      },
    },
  },
};
