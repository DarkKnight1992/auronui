import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Button, Checkbox, CheckboxGroup } from '@auronui/vue'
import { ref } from 'vue'

const meta: Meta = {
  title: 'Form/Checkbox',
  component: Checkbox,
  argTypes: {
    classNames: { control: 'object', description: 'Per-slot class overrides. Keys match the component anatomy slot names.' },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args }),
    template: `<Checkbox v-bind="args" aria-label="Accept terms" />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Checkbox } from '@auronui/vue'
</script>

<template>
  <Checkbox aria-label="Accept terms" />
</template>`,
        type: 'code',
        language: 'vue',
      }
    }
  },
}

export const Checked: Story = {
  render: (args) => ({
    components: { Checkbox },
    setup() {
      const value = ref(true)
      return { args, value }
    },
    template: `<Checkbox v-bind="args" v-model="value" aria-label="Checked option" />`,
  }),
}

export const Indeterminate: Story = {
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args }),
    template: `<Checkbox v-bind="args" :isIndeterminate="true" aria-label="Select all" />`,
  }),
}

export const Disabled: Story = {
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args }),
    template: `<Checkbox v-bind="args" :disabled="true" aria-label="Disabled option" />`,
  }),
}

export const WithLabel: Story = {
  render: (args) => ({
    components: { Checkbox },
    setup() {
      const value = ref(false)
      return { args, value }
    },
    template: `<Checkbox v-bind="args" v-model="value" aria-label="Subscribe to newsletter">Subscribe to newsletter</Checkbox>`,
  }),
}

export const SecondaryVariant: Story = {
  render: (args) => ({
    components: { Checkbox },
    setup() {
      const value = ref(true)
      return { args, value }
    },
    template: `<Checkbox v-bind="args" v-model="value" variant="secondary" aria-label="Secondary variant">Secondary</Checkbox>`,
  }),
}

export const GroupDefault: Story = {
  render: (args) => ({
    components: { Checkbox, CheckboxGroup },
    setup() {
      const selected = ref<string[]>([])
      return { args, selected }
    },
    template: `
      <CheckboxGroup v-model="selected" label="Choose frameworks">
        <Checkbox v-bind="args" value="vue" aria-label="Vue">Vue</Checkbox>
        <Checkbox v-bind="args" value="react" aria-label="React">React</Checkbox>
        <Checkbox v-bind="args" value="svelte" aria-label="Svelte">Svelte</Checkbox>
      </CheckboxGroup>
    `,
  }),
}

export const GroupPreselected: Story = {
  render: (args) => ({
    components: { Checkbox, CheckboxGroup },
    setup() {
      const selected = ref<string[]>(['vue', 'svelte'])
      return { args, selected }
    },
    template: `
      <CheckboxGroup v-model="selected" label="Choose frameworks">
        <Checkbox v-bind="args" value="vue" aria-label="Vue">Vue</Checkbox>
        <Checkbox v-bind="args" value="react" aria-label="React">React</Checkbox>
        <Checkbox v-bind="args" value="svelte" aria-label="Svelte">Svelte</Checkbox>
      </CheckboxGroup>
    `,
  }),
}

export const GroupDisabled: Story = {
  render: (args) => ({
    components: { Button, Checkbox, CheckboxGroup },
    setup() {
      const groupDisabled = ref(false)
      const selected = ref<string[]>(['vue'])
      return { args, groupDisabled, selected }
    },
    template: `
      <div>
        <Button variant="flat" style="margin-bottom:16px" @click="groupDisabled = !groupDisabled">
          Toggle Group Disabled ({{ groupDisabled }})
        </Button>
        <CheckboxGroup v-model="selected" :disabled="groupDisabled" label="Choose frameworks (group disabled wins)">
          <Checkbox v-bind="args" value="vue" aria-label="Vue">Vue</Checkbox>
          <Checkbox v-bind="args" value="react" aria-label="React">React</Checkbox>
          <Checkbox v-bind="args" value="svelte" aria-label="Svelte" :disabled="true">Svelte (also disabled)</Checkbox>
        </CheckboxGroup>
      </div>
    `,
  }),
}

export const GroupHorizontal: Story = {
  render: (args) => ({
    components: { Checkbox, CheckboxGroup },
    setup() {
      const selected = ref<string[]>([])
      return { args, selected }
    },
    template: `
      <CheckboxGroup v-model="selected" orientation="horizontal" label="Pick options">
        <Checkbox v-bind="args" value="a" aria-label="Option A">Option A</Checkbox>
        <Checkbox v-bind="args" value="b" aria-label="Option B">Option B</Checkbox>
        <Checkbox v-bind="args" value="c" aria-label="Option C">Option C</Checkbox>
      </CheckboxGroup>
    `,
  }),
}

export const GroupWithDescription: Story = {
  render: (args) => ({
    components: { Checkbox, CheckboxGroup },
    setup() {
      const selected = ref<string[]>([])
      return { args, selected }
    },
    template: `
      <CheckboxGroup
        v-model="selected"
        label="Notification preferences"
        description="Select which notifications you'd like to receive."
      >
        <Checkbox v-bind="args" value="email" aria-label="Email">Email</Checkbox>
        <Checkbox v-bind="args" value="sms" aria-label="SMS">SMS</Checkbox>
        <Checkbox v-bind="args" value="push" aria-label="Push notifications">Push notifications</Checkbox>
      </CheckboxGroup>
    `,
  }),
}

export const CustomStyles: Story = {
  name: 'Custom styles via classNames',
  render: (args) => ({
    components: { Checkbox },
    setup() {
      const value = ref(true)
      return { args, value }
    },
    template: `
      <Checkbox
        v-bind="args"
        v-model="value"
        :class-names="{
          control: 'border-2 border-blue-500 rounded-lg',
          indicator: 'bg-blue-600',
          content: 'text-blue-700 font-semibold ml-2',
        }"
        aria-label="Custom styled checkbox"
      >
        Custom styled checkbox
      </Checkbox>
    `,
  }),
}
