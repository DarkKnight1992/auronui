import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { Transfer } from '@auronui/vue'

const items = [
  { value: 'alice', label: 'Alice Chen' },
  { value: 'bob', label: 'Bob Martinez' },
  { value: 'carol', label: 'Carol Nguyen' },
  { value: 'dave', label: 'Dave Patel' },
  { value: 'erin', label: 'Erin Walsh' },
  { value: 'frank', label: 'Frank O\'Brien' },
]

const meta: Meta<typeof Transfer> = {
  title: 'Data Display/Transfer',
  component: Transfer,
  tags: ['autodocs'],
  argTypes: {
    isDisabled: { control: 'boolean' },
    isSearchable: { control: 'boolean' },
  },
  args: {
    isDisabled: false,
    isSearchable: false,
  },
}

export default meta
type Story = StoryObj<typeof Transfer>

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Transfer } from '@auronui/vue'

const items = [
  { value: 'alice', label: 'Alice Chen' },
  { value: 'bob', label: 'Bob Martinez' },
  { value: 'carol', label: 'Carol Nguyen' },
]
const selected = ref(['bob'])
</script>

<template>
  <Transfer v-model="selected" :items="items" :titles="['Available', 'Selected']" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Transfer },
    setup() {
      const selected = ref(['bob', 'carol'])
      return { args, items, selected }
    },
    template: `
      <div style="width: 480px;">
        <Transfer v-bind="args" v-model="selected" :items="items" :titles="['Available', 'Selected']" />
      </div>
    `,
  }),
}

export const Searchable: Story = {
  args: { isSearchable: true },
  render: (args) => ({
    components: { Transfer },
    setup() {
      const selected = ref<string[]>([])
      return { args, items, selected }
    },
    template: `
      <div style="width: 480px;">
        <Transfer v-bind="args" v-model="selected" :items="items" :titles="['Available', 'Selected']" />
      </div>
    `,
  }),
}

export const WithDisabledItem: Story = {
  name: 'With a disabled item',
  render: () => ({
    components: { Transfer },
    setup() {
      const withDisabled = [
        ...items,
        { value: 'locked', label: 'Locked User (cannot move)', isDisabled: true },
      ]
      const selected = ref(['locked'])
      return { withDisabled, selected }
    },
    template: `
      <div style="width: 480px;">
        <Transfer v-model="selected" :items="withDisabled" :titles="['Available', 'Selected']" />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: { isDisabled: true },
  render: (args) => ({
    components: { Transfer },
    setup() {
      const selected = ref(['bob'])
      return { args, items, selected }
    },
    template: `
      <div style="width: 480px;">
        <Transfer v-bind="args" v-model="selected" :items="items" :titles="['Available', 'Selected']" />
      </div>
    `,
  }),
}
