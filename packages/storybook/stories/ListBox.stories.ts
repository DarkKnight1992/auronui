import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ListBox, ListBoxItem, ListBoxSection } from '@auronui/vue'
import { ref } from 'vue'

const meta: Meta = {
  title: 'Components/ListBox',
  component: ListBox,
  argTypes: {
    classNames: {
      control: 'object',
      description: 'Per-slot class overrides. Keys match the component anatomy slot names.',
    },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ListBox, ListBoxItem } from '@auronui/vue'
</script>

<template>
  <ListBox aria-label="Favorite fruit">
    <ListBoxItem value="apple">Apple</ListBoxItem>
    <ListBoxItem value="banana">Banana</ListBoxItem>
    <ListBoxItem value="cherry">Cherry</ListBoxItem>
  </ListBox>
</template>`,
        type: 'code',
        language: 'vue',
      }
    }
  },
  render: (args) => ({
    components: { ListBox, ListBoxItem },
    setup: () => ({ args }),
    template: `
      <ListBox v-bind="args" aria-label="Favorite fruit">
        <ListBoxItem value="apple">Apple</ListBoxItem>
        <ListBoxItem value="banana">Banana</ListBoxItem>
        <ListBoxItem value="cherry">Cherry</ListBoxItem>
        <ListBoxItem value="date">Date</ListBoxItem>
        <ListBoxItem value="elderberry">Elderberry</ListBoxItem>
      </ListBox>
    `,
  }),
}

export const SingleSelection: Story = {
  render: (args) => ({
    components: { ListBox, ListBoxItem },
    setup() {
      const selected = ref<string>('')
      return { args, selected }
    },
    template: `
      <div>
        <p style="margin-bottom:8px;font-size:14px">Selected: {{ selected || 'none' }}</p>
        <ListBox v-bind="args" v-model="selected" aria-label="Select a fruit" selection-mode="single">
          <ListBoxItem value="apple">Apple</ListBoxItem>
          <ListBoxItem value="banana">Banana</ListBoxItem>
          <ListBoxItem value="cherry">Cherry</ListBoxItem>
          <ListBoxItem value="date">Date</ListBoxItem>
          <ListBoxItem value="elderberry">Elderberry</ListBoxItem>
        </ListBox>
      </div>
    `,
  }),
}

export const MultipleSelection: Story = {
  render: (args) => ({
    components: { ListBox, ListBoxItem },
    setup() {
      const selected = ref<string[]>(['apple', 'cherry'])
      return { args, selected }
    },
    template: `
      <div>
        <p style="margin-bottom:8px;font-size:14px">Selected: {{ selected.join(', ') || 'none' }}</p>
        <ListBox v-bind="args" v-model="selected" aria-label="Select fruits" selection-mode="multiple">
          <ListBoxItem value="apple">Apple</ListBoxItem>
          <ListBoxItem value="banana">Banana</ListBoxItem>
          <ListBoxItem value="cherry">Cherry</ListBoxItem>
          <ListBoxItem value="date">Date</ListBoxItem>
          <ListBoxItem value="elderberry">Elderberry</ListBoxItem>
        </ListBox>
      </div>
    `,
  }),
}

export const WithSections: Story = {
  render: (args) => ({
    components: { ListBox, ListBoxItem, ListBoxSection },
    setup() {
      const selected = ref<string>('')
      return { args, selected }
    },
    template: `
      <ListBox v-bind="args" v-model="selected" aria-label="Select food" selection-mode="single">
        <ListBoxSection title="Fruits">
          <ListBoxItem value="apple">Apple</ListBoxItem>
          <ListBoxItem value="banana">Banana</ListBoxItem>
          <ListBoxItem value="cherry">Cherry</ListBoxItem>
        </ListBoxSection>
        <ListBoxSection title="Vegetables">
          <ListBoxItem value="carrot">Carrot</ListBoxItem>
          <ListBoxItem value="broccoli">Broccoli</ListBoxItem>
          <ListBoxItem value="spinach">Spinach</ListBoxItem>
        </ListBoxSection>
      </ListBox>
    `,
  }),
}

export const WithDisabledItems: Story = {
  render: (args) => ({
    components: { ListBox, ListBoxItem },
    setup() {
      const selected = ref<string>('')
      return { args, selected }
    },
    template: `
      <ListBox v-bind="args" v-model="selected" aria-label="Select a fruit" selection-mode="single">
        <ListBoxItem value="apple">Apple</ListBoxItem>
        <ListBoxItem value="banana" :is-disabled="true">Banana (unavailable)</ListBoxItem>
        <ListBoxItem value="cherry">Cherry</ListBoxItem>
        <ListBoxItem value="date" :is-disabled="true">Date (unavailable)</ListBoxItem>
        <ListBoxItem value="elderberry">Elderberry</ListBoxItem>
      </ListBox>
    `,
  }),
}

export const FullyDisabled: Story = {
  render: (args) => ({
    components: { ListBox, ListBoxItem },
    setup: () => ({ args }),
    template: `
      <ListBox v-bind="args" aria-label="Disabled list" :is-disabled="true" selection-mode="single">
        <ListBoxItem value="apple">Apple</ListBoxItem>
        <ListBoxItem value="banana">Banana</ListBoxItem>
        <ListBoxItem value="cherry">Cherry</ListBoxItem>
      </ListBox>
    `,
  }),
}

export const WithDividers: Story = {
  render: (args) => ({
    components: { ListBox, ListBoxItem, ListBoxSection },
    setup() {
      const selected = ref<string>('')
      return { args, selected }
    },
    template: `
      <ListBox v-bind="args" v-model="selected" aria-label="Select food" selection-mode="single">
        <ListBoxSection title="Fruits" :show-divider="true">
          <ListBoxItem value="apple">Apple</ListBoxItem>
          <ListBoxItem value="banana">Banana</ListBoxItem>
        </ListBoxSection>
        <ListBoxSection title="Vegetables" :show-divider="true">
          <ListBoxItem value="carrot">Carrot</ListBoxItem>
          <ListBoxItem value="broccoli">Broccoli</ListBoxItem>
        </ListBoxSection>
        <ListBoxSection title="Grains">
          <ListBoxItem value="rice">Rice</ListBoxItem>
          <ListBoxItem value="wheat">Wheat</ListBoxItem>
        </ListBoxSection>
      </ListBox>
    `,
  }),
}

export const CustomStyles: Story = {
  name: 'Custom styles via classNames',
  render: (args) => ({
    components: { ListBox, ListBoxItem },
    setup() {
      const selected = ref<string>('')
      return { args, selected }
    },
    template: `
      <div>
        <p style="margin-bottom:8px;font-size:14px">Selected: {{ selected || 'none' }}</p>
        <ListBox
          v-bind="args"
          v-model="selected"
          aria-label="Select a fruit"
          selection-mode="single"
          :class-names="{
            base: 'border-2 border-blue-500 rounded-lg bg-blue-50 shadow-md',
          }"
        >
          <ListBoxItem value="apple">Apple</ListBoxItem>
          <ListBoxItem value="banana">Banana</ListBoxItem>
          <ListBoxItem value="cherry">Cherry</ListBoxItem>
          <ListBoxItem value="date">Date</ListBoxItem>
          <ListBoxItem value="elderberry">Elderberry</ListBoxItem>
        </ListBox>
      </div>
    `,
  }),
}
