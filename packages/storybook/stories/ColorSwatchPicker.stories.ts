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
  },
  args: {
    colors: defaultPalette,
    layout: 'grid',
    size: 'md',
    variant: 'circle',
  },
}

export default meta
type Story = StoryObj<typeof ColorSwatchPicker>

export const Default: Story = {
  name: 'Default Palette',
  render: (args) => ({
    components: { ColorSwatchPicker },
    setup() { return { args } },
    template: '<ColorSwatchPicker v-bind="args" aria-label="Color palette" />',
  }),
}

export const PastelPalette: Story = {
  name: 'Pastel Palette',
  render: (args) => ({
    components: { ColorSwatchPicker },
    setup() { return { args, colors: pastelPalette } },
    template: '<ColorSwatchPicker v-bind="args" :colors="colors" aria-label="Pastel colors" />',
  }),
}

export const NeutralPalette: Story = {
  name: 'Neutral / Grayscale',
  render: (args) => ({
    components: { ColorSwatchPicker },
    setup() { return { args, colors: neutralPalette } },
    template: '<ColorSwatchPicker v-bind="args" :colors="colors" aria-label="Neutral colors" variant="square" />',
  }),
}

export const WithSelection: Story = {
  name: 'With Pre-selected',
  render: (args) => ({
    components: { ColorSwatchPicker },
    setup() { return { args, colors: defaultPalette } },
    template: '<ColorSwatchPicker v-bind="args" :colors="colors" defaultValue="#00cc44" aria-label="Color palette with selection" />',
  }),
}

export const SquareVariant: Story = {
  name: 'Square Swatches',
  render: (args) => ({
    components: { ColorSwatchPicker },
    setup() { return { args, colors: defaultPalette } },
    template: '<ColorSwatchPicker v-bind="args" :colors="colors" variant="square" aria-label="Square color swatches" />',
  }),
}
