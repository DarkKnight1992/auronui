import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { NumberField } from '@auronui/vue'

const meta: Meta<typeof NumberField> = {
  title: 'Form/NumberField',
  component: NumberField,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['flat', 'bordered', 'faded', 'underlined', 'raised'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'danger'],
    },
    fullWidth: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isReadonly: { control: 'boolean' },
    step: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    classNames: { control: 'object', description: 'Per-slot class overrides. Keys match the component anatomy slot names.' },
  },
  args: {
    variant: 'flat',
    size: 'md',
    color: 'default',
    fullWidth: false,
    isInvalid: false,
    isDisabled: false,
    isReadonly: false,
    step: 1,
  },
}

export default meta
type Story = StoryObj<typeof NumberField>

export const Default: Story = {
  render: (args) => ({
    components: { NumberField },
    setup() { return { args } },
    template: '<NumberField v-bind="args" label="Quantity" />',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { NumberField } from '@auronui/vue'
</script>

<template>
  <NumberField label="Quantity" />
</template>`,
        language: 'vue',
      },
    },
  },
}

export const WithStepMinMax: Story = {
  name: 'With Min/Max/Step Constraints',
  render: (args) => ({
    components: { NumberField },
    setup() { return { args } },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px">
        <NumberField v-bind="args" label="Count (min=10, max=50, step=5)" :min="10" :max="50" :step="5" :model-value="10" />
        <NumberField v-bind="args" label="Percentage (0-100)" :min="0" :max="100" :step="1" :model-value="50" />
      </div>
    `,
  }),
}

export const Currency: Story = {
  name: 'Currency Formatting',
  render: (args) => ({
    components: { NumberField },
    setup() { return { args } },
    template: `
      <NumberField
        v-bind="args"
        label="Price"
        :format-options="{ style: 'currency', currency: 'USD' }"
        :model-value="1000"
      />
    `,
  }),
}

export const Percentage: Story = {
  name: 'Percentage Formatting',
  render: (args) => ({
    components: { NumberField },
    setup() { return { args } },
    template: `
      <NumberField
        v-bind="args"
        label="Percentage"
        :format-options="{ style: 'percent', maximumFractionDigits: 0 }"
        :model-value="0.42"
        :step="0.01"
      />
    `,
  }),
}

export const Variants: Story = {
  name: 'All Variants',
  render: (args) => ({
    components: { NumberField },
    setup() { return { args } },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px">
        <NumberField v-bind="args" label="Flat (default)" variant="flat" />
        <NumberField v-bind="args" label="Bordered" variant="bordered" />
        <NumberField v-bind="args" label="Faded" variant="faded" />
        <NumberField v-bind="args" label="Underlined" variant="underlined" />
        <NumberField v-bind="args" label="Raised" variant="raised" />
      </div>
    `,
  }),
}

export const Sizes: Story = {
  name: 'All Sizes',
  render: (args) => ({
    components: { NumberField },
    setup() { return { args } },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px">
        <NumberField v-bind="args" label="Small" size="sm" />
        <NumberField v-bind="args" label="Medium (default)" size="md" />
        <NumberField v-bind="args" label="Large" size="lg" />
      </div>
    `,
  }),
}

export const Colors: Story = {
  name: 'All Colors',
  render: (args) => ({
    components: { NumberField },
    setup() { return { args } },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px">
        <NumberField v-bind="args" label="Default" color="default" />
        <NumberField v-bind="args" label="Primary" color="primary" />
        <NumberField v-bind="args" label="Secondary" color="secondary" />
        <NumberField v-bind="args" label="Success" color="success" />
        <NumberField v-bind="args" label="Warning" color="warning" />
        <NumberField v-bind="args" label="Danger" color="danger" />
      </div>
    `,
  }),
}

export const Invalid: Story = {
  name: 'Invalid State',
  render: (args) => ({
    components: { NumberField },
    setup() { return { args } },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px">
        <NumberField v-bind="args" label="Invalid Flat" :is-invalid="true" />
        <NumberField v-bind="args" label="Invalid Bordered" variant="bordered" :is-invalid="true" />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  name: 'Disabled',
  render: (args) => ({
    components: { NumberField },
    setup() { return { args } },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px">
        <NumberField v-bind="args" label="Disabled (no value)" :is-disabled="true" />
        <NumberField v-bind="args" label="Disabled (with value)" :is-disabled="true" :model-value="42" />
      </div>
    `,
  }),
}

export const Readonly: Story = {
  name: 'Readonly',
  render: (args) => ({
    components: { NumberField },
    setup() { return { args } },
    template: '<NumberField v-bind="args" label="Readonly Field" :is-readonly="true" :model-value="100" />',
  }),
}

export const FullWidth: Story = {
  name: 'Full Width',
  render: (args) => ({
    components: { NumberField },
    setup() { return { args } },
    template: '<NumberField v-bind="args" label="Full Width Field" :full-width="true" />',
  }),
}

export const WithAriaLabel: Story = {
  name: 'With aria-label (screen-reader only label)',
  render: (args) => ({
    components: { NumberField },
    setup() { return { args } },
    template: '<NumberField v-bind="args" aria-label="Quantity" :step="1" :min="0" :max="100" />',
  }),
}

export const CustomStyles: Story = {
  name: 'Custom styles via classNames',
  render: (args) => ({
    components: { NumberField },
    setup() { return { args } },
    template: `
      <NumberField
        v-bind="args"
        label="Price with Custom Styles"
        :model-value="99"
        :class-names="{
          base: 'border-2 border-blue-500 rounded-lg p-4',
          group: 'gap-3',
          input: 'text-blue-600 font-semibold text-lg',
          incrementButton: 'bg-green-100 hover:bg-green-200 text-green-700 rounded-md',
          decrementButton: 'bg-red-100 hover:bg-red-200 text-red-700 rounded-md',
        }"
      />
    `,
  }),
}
