import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ColorArea from '../../vue/src/components/color-area/ColorArea.vue'

const meta: Meta<typeof ColorArea> = {
  title: 'Color/ColorArea',
  component: ColorArea,
  tags: ['autodocs'],
  argTypes: {
    xChannel: {
      control: 'select',
      options: ['hue', 'saturation', 'brightness', 'lightness', 'red', 'green', 'blue', 'alpha'],
    },
    yChannel: {
      control: 'select',
      options: ['hue', 'saturation', 'brightness', 'lightness', 'red', 'green', 'blue', 'alpha'],
    },
    showDots: { control: 'boolean' },
    disabled: { control: 'boolean' },
    as: {
      control: 'text',
      description: 'The element or component the ColorAreaRoot renders as.',
      table: { category: 'ColorAreaRoot', defaultValue: { summary: 'div' } },
    },
    asChild: {
      control: 'boolean',
      description: 'Merge props onto the child element instead of rendering a wrapper.',
      table: { category: 'ColorAreaRoot', defaultValue: { summary: 'false' } },
    },
    name: {
      control: 'text',
      description: 'The name of the color area field for form submission.',
      table: { category: 'ColorAreaRoot', defaultValue: { summary: '' } },
    },
    required: {
      control: 'boolean',
      description: 'Whether the color area is required in a form.',
      table: { category: 'ColorAreaRoot', defaultValue: { summary: 'false' } },
    },
    xName: {
      control: 'text',
      description: 'The name for the x-axis hidden input field.',
      table: { category: 'ColorAreaRoot', defaultValue: { summary: '' } },
    },
    yName: {
      control: 'text',
      description: 'The name for the y-axis hidden input field.',
      table: { category: 'ColorAreaRoot', defaultValue: { summary: '' } },
    },
  },
  args: {
    defaultValue: '#ff0000',
    xChannel: 'saturation',
    yChannel: 'brightness',
    showDots: false,
    disabled: false,
    asChild: false,
    required: false,
  },
}

export default meta
type Story = StoryObj<typeof ColorArea>

export const Default: Story = {
  name: 'Default (Saturation/Brightness)',
  render: (args) => ({
    components: { ColorArea },
    setup() { return { args } },
    template: '<ColorArea v-bind="args" aria-label="Color area" style="width: 200px; height: 200px;" />',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorArea } from '@auronui/vue'
</script>

<template>
  <ColorArea aria-label="Color area" style="width: 200px; height: 200px;" />
</template>`,
        type: 'code',
        language: 'vue',
      }
    }
  },
}

export const HueLightness: Story = {
  name: 'Hue/Lightness',
  render: (args) => ({
    components: { ColorArea },
    setup: () => ({ args }),
    template: '<ColorArea v-bind="args" defaultValue="#ff0000" xChannel="hue" yChannel="lightness" aria-label="Hue lightness area" style="width: 200px; height: 200px;" />',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorArea } from '@auronui/vue'
</script>

<template>
  <ColorArea defaultValue="#ff0000" xChannel="hue" yChannel="lightness" aria-label="Hue lightness area" style="width: 200px; height: 200px;" />
</template>`,
        language: 'vue',
      },
    },
  },
}

export const ShowDots: Story = {
  name: 'Show Dots',
  render: (args) => ({
    components: { ColorArea },
    setup: () => ({ args }),
    template: '<ColorArea v-bind="args" defaultValue="#ff0000" :showDots="true" aria-label="Color area with dots" style="width: 200px; height: 200px;" />',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorArea } from '@auronui/vue'
</script>

<template>
  <ColorArea defaultValue="#ff0000" :showDots="true" aria-label="Color area with dots" style="width: 200px; height: 200px;" />
</template>`,
        language: 'vue',
      },
    },
  },
}

export const Disabled: Story = {
  name: 'Disabled',
  render: (args) => ({
    components: { ColorArea },
    setup: () => ({ args }),
    template: '<ColorArea v-bind="args" defaultValue="#ff0000" :disabled="true" aria-label="Disabled color area" style="width: 200px; height: 200px;" />',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorArea } from '@auronui/vue'
</script>

<template>
  <ColorArea defaultValue="#ff0000" :disabled="true" aria-label="Disabled color area" style="width: 200px; height: 200px;" />
</template>`,
        language: 'vue',
      },
    },
  },
}

export const WithAriaLabel: Story = {
  name: 'With Aria Label',
  render: (args) => ({
    components: { ColorArea },
    setup: () => ({ args }),
    template: '<ColorArea v-bind="args" defaultValue="#0066ff" aria-label="Select color saturation and brightness" style="width: 200px; height: 200px;" />',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorArea } from '@auronui/vue'
</script>

<template>
  <ColorArea defaultValue="#0066ff" aria-label="Select color saturation and brightness" style="width: 200px; height: 200px;" />
</template>`,
        language: 'vue',
      },
    },
  },
}
