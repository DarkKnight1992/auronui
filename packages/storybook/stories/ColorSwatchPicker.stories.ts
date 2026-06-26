import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ColorSwatchPicker from '../../vue/src/components/color-swatch-picker/ColorSwatchPicker.vue'

const defaultPalette = ['#ff0000', '#ff6b00', '#ffcc00', '#00cc44', '#0066ff', '#aa00ff']
const pastelPalette = ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#e8baff']
const neutralPalette = ['#ffffff', '#d4d4d4', '#a3a3a3', '#737373', '#404040', '#000000']

const meta: Meta<typeof ColorSwatchPicker> = {
  title: 'Color/ColorSwatchPicker',
  component: ColorSwatchPicker,
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'select',
      options: ['grid', 'stack'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    variant: {
      control: 'select',
      options: ['circle', 'square'],
    },
    as: {
      control: 'text',
      description: 'The element or component the ColorSwatchPickerRoot renders as.',
      table: { category: 'ColorSwatchPickerRoot', defaultValue: { summary: 'div' } },
    },
    asChild: {
      control: 'boolean',
      description: 'Merge props onto the child element instead of rendering a wrapper.',
      table: { category: 'ColorSwatchPickerRoot', defaultValue: { summary: 'false' } },
    },
    name: {
      control: 'text',
      description: 'The name of the swatch picker for form submission.',
      table: { category: 'ColorSwatchPickerRoot', defaultValue: { summary: '' } },
    },
    required: {
      control: 'boolean',
      description: 'Whether the swatch picker is required in a form.',
      table: { category: 'ColorSwatchPickerRoot', defaultValue: { summary: 'false' } },
    },
    multiple: {
      control: 'boolean',
      description: 'Whether multiple colors can be selected.',
      table: { category: 'ColorSwatchPickerRoot', defaultValue: { summary: 'false' } },
    },
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the swatch picker.',
      table: { category: 'ColorSwatchPickerRoot', defaultValue: { summary: 'horizontal' } },
    },
    dir: {
      control: { type: 'select' },
      options: ['ltr', 'rtl'],
      description: 'The reading direction of the swatch picker.',
      table: { category: 'ColorSwatchPickerRoot', defaultValue: { summary: 'ltr' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether all swatches in the picker are disabled.',
      table: { category: 'ColorSwatchPickerRoot', defaultValue: { summary: 'false' } },
    },
    selectionBehavior: {
      control: 'text',
      description: 'The selection behavior of the swatch picker.',
      table: { category: 'ColorSwatchPickerRoot', defaultValue: { summary: '' } },
    },
    highlightOnHover: {
      control: 'boolean',
      description: 'Whether swatches are highlighted on hover.',
      table: { category: 'ColorSwatchPickerRoot', defaultValue: { summary: 'false' } },
    },
  },
  args: {
    colors: defaultPalette,
    layout: 'grid',
    size: 'md',
    variant: 'circle',
    asChild: false,
    required: false,
    multiple: false,
    disabled: false,
    highlightOnHover: false,
  },
}

export default meta
type Story = StoryObj<typeof ColorSwatchPicker>

export const Default: Story = {
  name: 'Default Palette',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorSwatchPicker } from '@auronui/vue'

const colors = ['#ff0000', '#ff6b00', '#ffcc00', '#00cc44', '#0066ff', '#aa00ff']
</script>

<template>
  <ColorSwatchPicker :colors="colors" layout="grid" size="md" variant="circle" aria-label="Color palette" />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorSwatchPicker },
    setup() { return { args } },
    template: '<ColorSwatchPicker v-bind="args" aria-label="Color palette" />',
  }),
}

export const PastelPalette: Story = {
  name: 'Pastel Palette',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorSwatchPicker } from '@auronui/vue'

const colors = ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#e8baff']
</script>

<template>
  <ColorSwatchPicker :colors="colors" aria-label="Pastel colors" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorSwatchPicker },
    setup() { return { args, colors: pastelPalette } },
    template: '<ColorSwatchPicker v-bind="args" :colors="colors" aria-label="Pastel colors" />',
  }),
}

export const NeutralPalette: Story = {
  name: 'Neutral / Grayscale',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorSwatchPicker } from '@auronui/vue'

const colors = ['#ffffff', '#d4d4d4', '#a3a3a3', '#737373', '#404040', '#000000']
</script>

<template>
  <ColorSwatchPicker :colors="colors" variant="square" aria-label="Neutral colors" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorSwatchPicker },
    setup() { return { args, colors: neutralPalette } },
    template: '<ColorSwatchPicker v-bind="args" :colors="colors" aria-label="Neutral colors" variant="square" />',
  }),
}

export const WithSelection: Story = {
  name: 'With Pre-selected',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorSwatchPicker } from '@auronui/vue'

const colors = ['#ff0000', '#ff6b00', '#ffcc00', '#00cc44', '#0066ff', '#aa00ff']
</script>

<template>
  <ColorSwatchPicker :colors="colors" defaultValue="#00cc44" aria-label="Color palette with selection" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorSwatchPicker },
    setup() { return { args, colors: defaultPalette } },
    template: '<ColorSwatchPicker v-bind="args" :colors="colors" defaultValue="#00cc44" aria-label="Color palette with selection" />',
  }),
}

export const SquareVariant: Story = {
  name: 'Square Swatches',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorSwatchPicker } from '@auronui/vue'

const colors = ['#ff0000', '#ff6b00', '#ffcc00', '#00cc44', '#0066ff', '#aa00ff']
</script>

<template>
  <ColorSwatchPicker :colors="colors" variant="square" aria-label="Square color swatches" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorSwatchPicker },
    setup() { return { args, colors: defaultPalette } },
    template: '<ColorSwatchPicker v-bind="args" :colors="colors" variant="square" aria-label="Square color swatches" />',
  }),
}
