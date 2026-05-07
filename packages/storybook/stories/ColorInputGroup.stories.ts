import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ColorInputGroup from '../../vue/src/components/color-input-group/ColorInputGroup.vue'

const meta: Meta<typeof ColorInputGroup> = {
  title: 'Color/ColorInputGroup',
  component: ColorInputGroup,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    fullWidth: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' },
    errorMessage: { control: 'text' },
    suffixLabel: { control: 'text' },
  },
  args: {
    defaultValue: '#ff0000',
    suffixLabel: 'HEX',
    fullWidth: false,
    variant: 'primary',
  },
}

export default meta
type Story = StoryObj<typeof ColorInputGroup>

export const Default: Story = {
  name: 'Default',
  render: (args) => ({
    components: { ColorInputGroup },
    setup() { return { args } },
    template: '<ColorInputGroup v-bind="args" />',
  }),
}

export const WithLabel: Story = {
  name: 'With Label',
  render: (args) => ({
    components: { ColorInputGroup },
    setup: () => ({ args }),
    template: '<ColorInputGroup v-bind="args" defaultValue="#0066ff" label="Background color" suffixLabel="HEX" />',
  }),
}

export const WithDescription: Story = {
  name: 'With Description',
  render: (args) => ({
    components: { ColorInputGroup },
    setup: () => ({ args }),
    template: '<ColorInputGroup v-bind="args" defaultValue="#00cc44" label="Accent color" description="Pick a color for accent elements" suffixLabel="HEX" />',
  }),
}

export const WithError: Story = {
  name: 'With Error',
  render: (args) => ({
    components: { ColorInputGroup },
    setup: () => ({ args }),
    template: '<ColorInputGroup v-bind="args" defaultValue="#ff0000" label="Color" errorMessage="Please enter a valid color" suffixLabel="HEX" />',
  }),
}

export const FullWidth: Story = {
  name: 'Full Width',
  render: (args) => ({
    components: { ColorInputGroup },
    setup: () => ({ args }),
    template: '<ColorInputGroup v-bind="args" defaultValue="#aa00ff" label="Theme color" :fullWidth="true" suffixLabel="HEX" />',
  }),
}

export const Secondary: Story = {
  name: 'Secondary Variant',
  render: (args) => ({
    components: { ColorInputGroup },
    setup: () => ({ args }),
    template: '<ColorInputGroup v-bind="args" defaultValue="#ff6b00" label="Border color" variant="secondary" suffixLabel="HEX" />',
  }),
}
