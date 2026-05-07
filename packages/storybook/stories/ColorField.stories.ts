import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ColorField from '../../vue/src/components/color-field/ColorField.vue'

const meta: Meta<typeof ColorField> = {
  title: 'Color/ColorField',
  component: ColorField,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' },
    errorMessage: { control: 'text' },
    placeholder: { control: 'text' },
  },
  args: {
    defaultValue: '#ff0000',
    disabled: false,
    readonly: false,
  },
}

export default meta
type Story = StoryObj<typeof ColorField>

export const Default: Story = {
  name: 'Default',
  render: (args) => ({
    components: { ColorField },
    setup() { return { args } },
    template: '<ColorField v-bind="args" />',
  }),
}

export const WithLabel: Story = {
  name: 'With Label',
  render: (args) => ({
    components: { ColorField },
    setup: () => ({ args }),
    template: '<ColorField v-bind="args" defaultValue="#0066ff" label="Background color" />',
  }),
}

export const WithDescription: Story = {
  name: 'With Description',
  render: (args) => ({
    components: { ColorField },
    setup: () => ({ args }),
    template: '<ColorField v-bind="args" defaultValue="#00cc44" label="Accent color" description="Enter a hex, hsl, or rgb color value" />',
  }),
}

export const WithError: Story = {
  name: 'With Error',
  render: (args) => ({
    components: { ColorField },
    setup: () => ({ args }),
    template: '<ColorField v-bind="args" defaultValue="#ff0000" label="Color" errorMessage="Please enter a valid color" />',
  }),
}

export const Disabled: Story = {
  name: 'Disabled',
  render: (args) => ({
    components: { ColorField },
    setup: () => ({ args }),
    template: '<ColorField v-bind="args" defaultValue="#888888" label="Color (disabled)" :disabled="true" />',
  }),
}

export const Readonly: Story = {
  name: 'Readonly',
  render: (args) => ({
    components: { ColorField },
    setup: () => ({ args }),
    template: '<ColorField v-bind="args" defaultValue="#ff6b00" label="Fixed color" :readonly="true" />',
  }),
}
