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
    variant: { control: 'select', options: ['flat', 'bordered', 'faded', 'underlined', 'raised'] },
    color: { control: 'select', options: ['default', 'primary', 'secondary', 'accent', 'success', 'warning', 'danger'] },
    isDisabled: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
    isRequired: { control: 'boolean' },
  },
  args: {
    placeholder: 'Select a location',
    variant: 'flat',
    color: 'default',
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

export const Variants: Story = {
  render: () => ({
    components: { Cascader },
    setup() {
      const flat = ref<string[]>([])
      const bordered = ref<string[]>([])
      const faded = ref<string[]>([])
      const underlined = ref<string[]>([])
      const raised = ref<string[]>([])
      return { locations, flat, bordered, faded, underlined, raised }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;width:280px;">
        <Cascader variant="flat" label="Flat" v-model="flat" :items="locations" :get-key="(i) => i.value" :get-children="(i) => i.children" />
        <Cascader variant="bordered" label="Bordered" v-model="bordered" :items="locations" :get-key="(i) => i.value" :get-children="(i) => i.children" />
        <Cascader variant="faded" label="Faded" v-model="faded" :items="locations" :get-key="(i) => i.value" :get-children="(i) => i.children" />
        <Cascader variant="underlined" label="Underlined" v-model="underlined" :items="locations" :get-key="(i) => i.value" :get-children="(i) => i.children" />
        <Cascader variant="raised" label="Raised" v-model="raised" :items="locations" :get-key="(i) => i.value" :get-children="(i) => i.children" />
      </div>
    `,
  }),
}

export const Colors: Story = {
  render: () => ({
    components: { Cascader },
    setup() {
      const primary = ref<string[]>([])
      const secondary = ref<string[]>([])
      const accent = ref<string[]>([])
      const success = ref<string[]>([])
      const warning = ref<string[]>([])
      const danger = ref<string[]>([])
      return { locations, primary, secondary, accent, success, warning, danger }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;width:280px;">
        <Cascader color="primary" variant="bordered" label="Primary (open me)" v-model="primary" :items="locations" :get-key="(i) => i.value" :get-children="(i) => i.children" />
        <Cascader color="secondary" variant="bordered" label="Secondary (open me)" v-model="secondary" :items="locations" :get-key="(i) => i.value" :get-children="(i) => i.children" />
        <Cascader color="accent" variant="bordered" label="Accent (open me)" v-model="accent" :items="locations" :get-key="(i) => i.value" :get-children="(i) => i.children" />
        <Cascader color="success" variant="bordered" label="Success (open me)" v-model="success" :items="locations" :get-key="(i) => i.value" :get-children="(i) => i.children" />
        <Cascader color="warning" variant="bordered" label="Warning (open me)" v-model="warning" :items="locations" :get-key="(i) => i.value" :get-children="(i) => i.children" />
        <Cascader color="danger" variant="bordered" label="Danger (open me)" v-model="danger" :items="locations" :get-key="(i) => i.value" :get-children="(i) => i.children" />
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
