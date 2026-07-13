import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { SearchField } from '@auronui/vue'

const meta: Meta<typeof SearchField> = {
  title: 'Form/SearchField',
  component: SearchField,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['flat', 'faded', 'bordered', 'underlined', 'raised'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'danger'],
    },
    labelPlacement: {
      control: 'select',
      options: ['inside', 'outside', 'outside-left'],
    },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    description: { control: 'text' },
    errorMessage: { control: 'text' },
    isDisabled: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    isClearable: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  args: {
    variant: 'flat',
    size: 'md',
    color: 'default',
    labelPlacement: 'inside',
    placeholder: 'Search…',
  },
}

export default meta
type Story = StoryObj<typeof SearchField>

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { SearchField } from '@auronui/vue'

const query = ref('')
</script>

<template>
  <SearchField v-model="query" placeholder="Search…" aria-label="Search" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { SearchField },
    setup() {
      return { args }
    },
    template: '<div style="width: 320px;"><SearchField v-bind="args" aria-label="Search" /></div>',
  }),
}

export const WithLabel: Story = {
  name: 'With label',
  args: { label: 'Search components' },
  render: (args) => ({
    components: { SearchField },
    setup() {
      return { args }
    },
    template: '<div style="width: 320px;"><SearchField v-bind="args" /></div>',
  }),
}

export const Prefilled: Story = {
  name: 'Prefilled — clear button visible',
  args: { modelValue: 'button', label: 'Search components' },
  render: (args) => ({
    components: { SearchField },
    setup() {
      return { args }
    },
    template: '<div style="width: 320px;"><SearchField v-bind="args" /></div>',
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The × clear button appears automatically once the field has a value — click it, or press Escape while the field is focused, to clear.',
      },
    },
  },
}

export const Invalid: Story = {
  args: {
    label: 'Search components',
    isInvalid: true,
    errorMessage: 'No components match that query',
    modelValue: 'zzz',
  },
  render: (args) => ({
    components: { SearchField },
    setup() {
      return { args }
    },
    template: '<div style="width: 320px;"><SearchField v-bind="args" /></div>',
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { SearchField },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;width:320px;">
        <SearchField size="sm" placeholder="Small" aria-label="Small search" />
        <SearchField size="md" placeholder="Medium" aria-label="Medium search" />
        <SearchField size="lg" placeholder="Large" aria-label="Large search" />
      </div>
    `,
  }),
}
