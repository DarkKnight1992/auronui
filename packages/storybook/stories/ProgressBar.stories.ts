import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ProgressBar } from "@auronui/vue";

const meta: Meta<typeof ProgressBar> = {
  component: ProgressBar,
  title: "Components/ProgressBar",
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "success", "warning", "danger"],
    },
    radius: {
      control: "select",
      options: ["none", "sm", "md", "lg", "full"],
    },
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
    indicatorAs: {
      control: "text",
      description: "Element or component to render ProgressIndicator as.",
      table: { category: "ProgressIndicator", defaultValue: { summary: "undefined" } },
    },
    indicatorAsChild: {
      control: "boolean",
      description: "Whether ProgressIndicator renders as a child element.",
      table: { category: "ProgressIndicator", defaultValue: { summary: "false" } },
    },
  },
  args: {
    value: 60,
    maxValue: 100,
    size: "md",
    color: "primary",
    radius: "full",
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: {
    asChild: false,
    indicatorAsChild: false,
  },
  render: (args) => ({
    components: { ProgressBar },
    setup: () => ({ args }),
    template: `<ProgressBar v-bind="args" :as="args.as" :as-child="args.asChild" :indicator-as="args.indicatorAs" :indicator-as-child="args.indicatorAsChild" />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ProgressBar } from '@auronui/vue'
</script>

<template>
  <ProgressBar :value="60" :max-value="100" size="md" color="primary" radius="full" />
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Determinate: Story = {
  render: (args) => ({
    components: { ProgressBar },
    setup: () => ({ args }),
    template: `<ProgressBar v-bind="args" />`,
  }),
  args: { value: 60, label: "File upload", showValueLabel: true },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ProgressBar } from '@auronui/vue'
</script>

<template>
  <ProgressBar :value="60" label="File upload" :show-value-label="true" />
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Indeterminate: Story = {
  render: (args) => ({
    components: { ProgressBar },
    setup: () => ({ args }),
    template: `<ProgressBar v-bind="args" />`,
  }),
  args: { value: null, label: "Loading...", isIndeterminate: true },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ProgressBar } from '@auronui/vue'
</script>

<template>
  <ProgressBar label="Loading..." :is-indeterminate="true" />
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Sizes: Story = {
  render: (args) => ({
    components: { ProgressBar },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 320px;">
        <ProgressBar v-bind="args" value="40" size="sm" label="Small" />
        <ProgressBar v-bind="args" value="60" size="md" label="Medium" />
        <ProgressBar v-bind="args" value="80" size="lg" label="Large" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ProgressBar } from '@auronui/vue'
</script>

<template>
  <div class="flex flex-col gap-4 w-80">
    <ProgressBar :value="40" size="sm" label="Small" />
    <ProgressBar :value="60" size="md" label="Medium" />
    <ProgressBar :value="80" size="lg" label="Large" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Colors: Story = {
  render: (args) => ({
    components: { ProgressBar },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 320px;">
        <ProgressBar v-bind="args" value="60" color="default" label="Default" />
        <ProgressBar v-bind="args" value="60" color="primary" label="Primary" />
        <ProgressBar v-bind="args" value="60" color="secondary" label="Secondary" />
        <ProgressBar v-bind="args" value="60" color="success" label="Success" />
        <ProgressBar v-bind="args" value="60" color="warning" label="Warning" />
        <ProgressBar v-bind="args" value="60" color="danger" label="Danger" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ProgressBar } from '@auronui/vue'
</script>

<template>
  <div class="flex flex-col gap-4 w-80">
    <ProgressBar :value="60" color="default" label="Default" />
    <ProgressBar :value="60" color="primary" label="Primary" />
    <ProgressBar :value="60" color="secondary" label="Secondary" />
    <ProgressBar :value="60" color="success" label="Success" />
    <ProgressBar :value="60" color="warning" label="Warning" />
    <ProgressBar :value="60" color="danger" label="Danger" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Striped: Story = {
  render: (args) => ({
    components: { ProgressBar },
    setup: () => ({ args }),
    template: `<ProgressBar v-bind="args" />`,
  }),
  args: { value: 70, isStriped: true, label: "Striped progress" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ProgressBar } from '@auronui/vue'
</script>

<template>
  <ProgressBar :value="70" :is-striped="true" label="Striped progress" />
</template>`,
        language: 'vue',
      },
    },
  },
};

export const WithLabel: Story = {
  render: (args) => ({
    components: { ProgressBar },
    setup: () => ({ args }),
    template: `<ProgressBar v-bind="args" />`,
  }),
  args: { value: 45, label: "Uploading files" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ProgressBar } from '@auronui/vue'
</script>

<template>
  <ProgressBar :value="45" label="Uploading files" />
</template>`,
        language: 'vue',
      },
    },
  },
};

export const WithValueLabel: Story = {
  render: (args) => ({
    components: { ProgressBar },
    setup: () => ({ args }),
    template: `<ProgressBar v-bind="args" />`,
  }),
  args: { value: 75, label: "Progress", showValueLabel: true },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ProgressBar } from '@auronui/vue'
</script>

<template>
  <ProgressBar :value="75" label="Progress" :show-value-label="true" />
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Disabled: Story = {
  render: (args) => ({
    components: { ProgressBar },
    setup: () => ({ args }),
    template: `<ProgressBar v-bind="args" />`,
  }),
  args: { value: 50, isDisabled: true, label: "Disabled" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ProgressBar } from '@auronui/vue'
</script>

<template>
  <ProgressBar :value="50" :is-disabled="true" label="Disabled" />
</template>`,
        language: 'vue',
      },
    },
  },
};

export const CustomStyles: Story = {
  render: (args) => ({
    components: { ProgressBar },
    setup: () => ({ args }),
    template: `<ProgressBar v-bind="args" />`,
  }),
  name: "Custom styles via classNames",
  args: {
    value: 65,
    label: "Custom styled progress",
    showValueLabel: true,
    classNames: {
      labelWrapper: "gap-3",
      label: "text-blue-600 font-semibold",
      value: "text-green-600 font-bold",
      track: "border-2 border-blue-400 bg-blue-50",
      indicator: "bg-gradient-to-r from-blue-500 to-purple-500",
    },
  },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ProgressBar } from '@auronui/vue'
</script>

<template>
  <ProgressBar
    :value="65"
    label="Custom styled progress"
    :show-value-label="true"
    :class-names="{
      labelWrapper: 'gap-3',
      label: 'text-blue-600 font-semibold',
      value: 'text-green-600 font-bold',
      track: 'border-2 border-blue-400 bg-blue-50',
      indicator: 'bg-gradient-to-r from-blue-500 to-purple-500',
    }"
  />
</template>`,
        language: 'vue',
      },
    },
  },
};
