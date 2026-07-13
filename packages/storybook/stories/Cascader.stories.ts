import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { Cascader } from '@auronui/vue'

interface LocationNode {
  value: string
  label: string
  children?: LocationNode[]
}

const locations: LocationNode[] = [
  {
    value: 'ca',
    label: 'California',
    children: [
      { value: 'sf', label: 'San Francisco' },
      { value: 'la', label: 'Los Angeles' },
      { value: 'sd', label: 'San Diego' },
    ],
  },
  {
    value: 'ny',
    label: 'New York',
    children: [
      { value: 'nyc', label: 'New York City' },
      { value: 'buf', label: 'Buffalo' },
    ],
  },
  {
    value: 'tx',
    label: 'Texas',
    children: [
      { value: 'aus', label: 'Austin' },
      { value: 'hou', label: 'Houston' },
    ],
  },
]

const meta: Meta<typeof Cascader> = {
  title: 'Form/Cascader',
  component: Cascader,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    separator: { control: 'text' },
    isDisabled: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
    isRequired: { control: 'boolean' },
  },
  args: {
    placeholder: 'Select a location',
    isDisabled: false,
    isInvalid: false,
    isRequired: false,
  },
}

export default meta
type Story = StoryObj<typeof Cascader>

export const Default: Story = {
  args: { label: 'Location' },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Cascader } from '@auronui/vue'

const locations = [
  {
    value: 'ca', label: 'California',
    children: [
      { value: 'sf', label: 'San Francisco' },
      { value: 'la', label: 'Los Angeles' },
    ],
  },
  { value: 'tx', label: 'Texas' },
]
const selected = ref([])
</script>

<template>
  <Cascader
    v-model="selected"
    label="Location"
    :items="locations"
    :get-key="(i) => i.value"
    :get-children="(i) => i.children"
  />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Cascader },
    setup() {
      const selected = ref<string[]>([])
      return { args, locations, selected }
    },
    template: `
      <div style="width: 280px;">
        <Cascader
          v-bind="args"
          v-model="selected"
          :items="locations"
          :get-key="(i) => i.value"
          :get-children="(i) => i.children"
        />
      </div>
    `,
  }),
}

export const Preselected: Story = {
  name: 'With an initial value',
  args: { label: 'Location' },
  render: (args) => ({
    components: { Cascader },
    setup() {
      const selected = ref<string[]>(['ca', 'sf'])
      return { args, locations, selected }
    },
    template: `
      <div style="width: 280px;">
        <Cascader
          v-bind="args"
          v-model="selected"
          :items="locations"
          :get-key="(i) => i.value"
          :get-children="(i) => i.children"
        />
      </div>
    `,
  }),
}

export const Invalid: Story = {
  args: { label: 'Location', isInvalid: true, errorMessage: 'Please choose a location', isRequired: true },
  render: (args) => ({
    components: { Cascader },
    setup() {
      const selected = ref<string[]>([])
      return { args, locations, selected }
    },
    template: `
      <div style="width: 280px;">
        <Cascader
          v-bind="args"
          v-model="selected"
          :items="locations"
          :get-key="(i) => i.value"
          :get-children="(i) => i.children"
        />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: { label: 'Location', isDisabled: true },
  render: (args) => ({
    components: { Cascader },
    setup() {
      const selected = ref<string[]>(['ca'])
      return { args, locations, selected }
    },
    template: `
      <div style="width: 280px;">
        <Cascader
          v-bind="args"
          v-model="selected"
          :items="locations"
          :get-key="(i) => i.value"
          :get-children="(i) => i.children"
        />
      </div>
    `,
  }),
}
