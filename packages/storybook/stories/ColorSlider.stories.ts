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
  render: (args) => ({
    components: { ColorSlider },
    setup: () => ({ args }),
    template: '<ColorSlider v-bind="args" channel="hue" defaultValue="#ff0000" aria-label="Hue" style="width: 200px;" />',
  }),
}

export const Saturation: Story = {
  name: 'Saturation',
  render: (args) => ({
    components: { ColorSlider },
    setup: () => ({ args }),
    template: '<ColorSlider v-bind="args" channel="saturation" defaultValue="#ff0000" aria-label="Saturation" style="width: 200px;" />',
  }),
}

export const Lightness: Story = {
  name: 'Lightness',
  render: (args) => ({
    components: { ColorSlider },
    setup: () => ({ args }),
    template: '<ColorSlider v-bind="args" channel="lightness" defaultValue="#ff0000" aria-label="Lightness" style="width: 200px;" />',
  }),
}

export const Alpha: Story = {
  name: 'Alpha',
  render: (args) => ({
    components: { ColorSlider },
    setup: () => ({ args }),
    template: '<ColorSlider v-bind="args" channel="alpha" defaultValue="#ff0000" aria-label="Alpha" style="width: 200px;" />',
  }),
}

export const Vertical: Story = {
  name: 'Vertical',
  render: (args) => ({
    components: { ColorSlider },
    setup: () => ({ args }),
    template: '<ColorSlider v-bind="args" channel="hue" defaultValue="#ff0000" orientation="vertical" aria-label="Hue vertical" style="height: 200px;" />',
  }),
}

export const WithOutput: Story = {
  name: 'With Output',
  render: (args) => ({
    components: { ColorSlider },
    setup: () => ({ args }),
    template: '<ColorSlider v-bind="args" channel="hue" defaultValue="#ff0000" :showOutput="true" aria-label="Hue with output" style="width: 200px;" />',
  }),
}

export const Disabled: Story = {
  name: 'Disabled',
  render: (args) => ({
    components: { ColorSlider },
    setup: () => ({ args }),
    template: '<ColorSlider v-bind="args" channel="hue" defaultValue="#ff0000" :disabled="true" aria-label="Disabled hue" style="width: 200px;" />',
  }),
}
