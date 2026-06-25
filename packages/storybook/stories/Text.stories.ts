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
        type: 'code',
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Text } from '@auronui/vue'
</script>

<template>
  <Text size="xs">Extra small text</Text>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Small: Story = {
  render: (args) => ({
    components: { Text },
    setup: () => ({ args }),
    template: `<Text v-bind="args">Small text</Text>`,
  }),
  args: { size: "sm" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Text } from '@auronui/vue'
</script>

<template>
  <Text size="sm">Small text</Text>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Large: Story = {
  render: (args) => ({
    components: { Text },
    setup: () => ({ args }),
    template: `<Text v-bind="args">Large text</Text>`,
  }),
  args: { size: "lg" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Text } from '@auronui/vue'
</script>

<template>
  <Text size="lg">Large text</Text>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const ExtraLarge: Story = {
  render: (args) => ({
    components: { Text },
    setup: () => ({ args }),
    template: `<Text v-bind="args">Extra large text</Text>`,
  }),
  args: { size: "xl" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Text } from '@auronui/vue'
</script>

<template>
  <Text size="xl">Extra large text</Text>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Muted: Story = {
  render: (args) => ({
    components: { Text },
    setup: () => ({ args }),
    template: `<Text v-bind="args">Muted text variant</Text>`,
  }),
  args: { variant: "muted" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Text } from '@auronui/vue'
</script>

<template>
  <Text variant="muted">Muted text variant</Text>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Accent: Story = {
  render: (args) => ({
    components: { Text },
    setup: () => ({ args }),
    template: `<Text v-bind="args">Accent text variant</Text>`,
  }),
  args: { variant: "accent" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Text } from '@auronui/vue'
</script>

<template>
  <Text variant="accent">Accent text variant</Text>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Danger: Story = {
  render: (args) => ({
    components: { Text },
    setup: () => ({ args }),
    template: `<Text v-bind="args">Danger text variant</Text>`,
  }),
  args: { variant: "danger" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Text } from '@auronui/vue'
</script>

<template>
  <Text variant="danger">Danger text variant</Text>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Success: Story = {
  render: (args) => ({
    components: { Text },
    setup: () => ({ args }),
    template: `<Text v-bind="args">Success text variant</Text>`,
  }),
  args: { variant: "success" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Text } from '@auronui/vue'
</script>

<template>
  <Text variant="success">Success text variant</Text>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const AsSpan: Story = {
  render: (args) => ({
    components: { Text },
    setup: () => ({ args }),
    template: `<Text v-bind="args">Rendered as a span element</Text>`,
  }),
  args: { as: "span" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Text } from '@auronui/vue'
</script>

<template>
  <Text as="span">Rendered as a span element</Text>
</template>`,
        language: 'vue',
      },
    },
  },
};
