import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ColorSlider from '../../vue/src/components/color-slider/ColorSlider.vue'

const meta: Meta<typeof ColorSlider> = {
  title: 'Color/ColorSlider',
  component: ColorSlider,
  tags: ['autodocs'],
  argTypes: {
    channel: {
      control: 'select',
      options: ['hue', 'saturation', 'lightness', 'alpha'],
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    showOutput: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    defaultValue: '#ff0000',
    channel: 'hue',
    orientation: 'horizontal',
    showOutput: false,
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof ColorSlider>

export const Hue: Story = {
  name: 'Hue',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorSlider } from '@auronui/vue'
</script>

<template>
  <ColorSlider channel="hue" default-value="#ff0000" aria-label="Hue" style="width: 200px;" />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorSlider },
    setup: () => ({ args }),
    template: '<ColorSlider v-bind="args" channel="hue" defaultValue="#ff0000" aria-label="Hue" style="width: 200px;" />',
  }),
}

export const Saturation: Story = {
  name: 'Saturation',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorSlider } from '@auronui/vue'
</script>

<template>
  <ColorSlider channel="saturation" default-value="#ff0000" aria-label="Saturation" style="width: 200px;" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorSlider },
    setup: () => ({ args }),
    template: '<ColorSlider v-bind="args" channel="saturation" defaultValue="#ff0000" aria-label="Saturation" style="width: 200px;" />',
  }),
}

export const Lightness: Story = {
  name: 'Lightness',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorSlider } from '@auronui/vue'
</script>

<template>
  <ColorSlider channel="lightness" default-value="#ff0000" aria-label="Lightness" style="width: 200px;" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorSlider },
    setup: () => ({ args }),
    template: '<ColorSlider v-bind="args" channel="lightness" defaultValue="#ff0000" aria-label="Lightness" style="width: 200px;" />',
  }),
}

export const Alpha: Story = {
  name: 'Alpha',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorSlider } from '@auronui/vue'
</script>

<template>
  <ColorSlider channel="alpha" default-value="#ff0000" aria-label="Alpha" style="width: 200px;" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorSlider },
    setup: () => ({ args }),
    template: '<ColorSlider v-bind="args" channel="alpha" defaultValue="#ff0000" aria-label="Alpha" style="width: 200px;" />',
  }),
}

export const Vertical: Story = {
  name: 'Vertical',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorSlider } from '@auronui/vue'
</script>

<template>
  <ColorSlider channel="hue" default-value="#ff0000" orientation="vertical" aria-label="Hue vertical" style="height: 200px;" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorSlider },
    setup: () => ({ args }),
    template: '<ColorSlider v-bind="args" channel="hue" defaultValue="#ff0000" orientation="vertical" aria-label="Hue vertical" style="height: 200px;" />',
  }),
}

export const WithOutput: Story = {
  name: 'With Output',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorSlider } from '@auronui/vue'
</script>

<template>
  <ColorSlider channel="hue" default-value="#ff0000" :show-output="true" aria-label="Hue with output" style="width: 200px;" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorSlider },
    setup: () => ({ args }),
    template: '<ColorSlider v-bind="args" channel="hue" defaultValue="#ff0000" :showOutput="true" aria-label="Hue with output" style="width: 200px;" />',
  }),
}

export const Disabled: Story = {
  name: 'Disabled',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorSlider } from '@auronui/vue'
</script>

<template>
  <ColorSlider channel="hue" default-value="#ff0000" :disabled="true" aria-label="Disabled hue" style="width: 200px;" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorSlider },
    setup: () => ({ args }),
    template: '<ColorSlider v-bind="args" channel="hue" defaultValue="#ff0000" :disabled="true" aria-label="Disabled hue" style="width: 200px;" />',
  }),
}
