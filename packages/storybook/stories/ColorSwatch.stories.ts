import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ColorSwatch from '../../vue/src/components/color-swatch/ColorSwatch.vue'

const meta: Meta<typeof ColorSwatch> = {
  title: 'Color/ColorSwatch',
  component: ColorSwatch,
  tags: ['autodocs'],
  argTypes: {
    shape: {
      control: 'select',
      options: ['circle', 'square'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    color: { control: 'color' },
    colorName: { control: 'text' },
  },
  args: {
    color: '#ff0000',
    colorName: 'Red',
    shape: 'circle',
    size: 'md',
  },
}

export default meta
type Story = StoryObj<typeof ColorSwatch>

export const Default: Story = {
  name: 'Default (Red)',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorSwatch } from '@auronui/vue'
</script>

<template>
  <ColorSwatch color="#ff0000" colorName="Red" />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorSwatch },
    setup() { return { args } },
    template: '<ColorSwatch v-bind="args" />',
  }),
}

export const Green: Story = {
  name: 'Green',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorSwatch } from '@auronui/vue'
</script>

<template>
  <ColorSwatch color="#00cc44" colorName="Green" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorSwatch },
    setup: () => ({ args }),
    template: '<ColorSwatch v-bind="args" color="#00cc44" colorName="Green" />',
  }),
}

export const Blue: Story = {
  name: 'Blue',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorSwatch } from '@auronui/vue'
</script>

<template>
  <ColorSwatch color="#0066ff" colorName="Blue" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorSwatch },
    setup: () => ({ args }),
    template: '<ColorSwatch v-bind="args" color="#0066ff" colorName="Blue" />',
  }),
}

export const Square: Story = {
  name: 'Square Shape',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorSwatch } from '@auronui/vue'
</script>

<template>
  <ColorSwatch color="#ff6b00" colorName="Orange" shape="square" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorSwatch },
    setup: () => ({ args }),
    template: '<ColorSwatch v-bind="args" color="#ff6b00" colorName="Orange" shape="square" />',
  }),
}

export const Sizes: Story = {
  name: 'All Sizes',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorSwatch } from '@auronui/vue'
</script>

<template>
  <div style="display: flex; align-items: center; gap: 8px;">
    <ColorSwatch color="#aa00ff" colorName="Purple xs" size="xs" />
    <ColorSwatch color="#aa00ff" colorName="Purple sm" size="sm" />
    <ColorSwatch color="#aa00ff" colorName="Purple md" size="md" />
    <ColorSwatch color="#aa00ff" colorName="Purple lg" size="lg" />
    <ColorSwatch color="#aa00ff" colorName="Purple xl" size="xl" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorSwatch },
    setup: () => ({ args }),
    template: `<div style="display: flex; align-items: center; gap: 8px;">
      <ColorSwatch v-bind="args" color="#aa00ff" colorName="Purple xs" size="xs" />
      <ColorSwatch v-bind="args" color="#aa00ff" colorName="Purple sm" size="sm" />
      <ColorSwatch v-bind="args" color="#aa00ff" colorName="Purple md" size="md" />
      <ColorSwatch v-bind="args" color="#aa00ff" colorName="Purple lg" size="lg" />
      <ColorSwatch v-bind="args" color="#aa00ff" colorName="Purple xl" size="xl" />
    </div>`,
  }),
}

export const WithName: Story = {
  name: 'Custom Color with Name',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorSwatch } from '@auronui/vue'
</script>

<template>
  <ColorSwatch color="#ff1493" colorName="Deep Pink" size="lg" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorSwatch },
    setup: () => ({ args }),
    template: '<ColorSwatch v-bind="args" color="#ff1493" colorName="Deep Pink" size="lg" />',
  }),
}
