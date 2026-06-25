import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { Checkbox, CheckboxGroup } from '@auronui/vue'

const meta: Meta<typeof CheckboxGroup> = {
  title: 'Form/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    orientation: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
    },
  },
  args: {
    variant: 'primary',
    orientation: 'vertical',
    disabled: false,
    label: 'Choose frameworks',
  },
}

export default meta
type Story = StoryObj<typeof CheckboxGroup>

/* ─── Playground ────────────────────────────────────────────────────────── */

export const Default: Story = {
  render: (args) => ({
    components: { Checkbox, CheckboxGroup },
    setup() {
      const selected = ref<string[]>([])
      return { args, selected }
    },
    template: `
      <CheckboxGroup v-bind="args" v-model="selected">
        <Checkbox value="vue">Vue</Checkbox>
        <Checkbox value="react">React</Checkbox>
        <Checkbox value="svelte">Svelte</Checkbox>
        <Checkbox value="solid">Solid</Checkbox>
      </CheckboxGroup>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { CheckboxGroup, Checkbox } from '@auronui/vue'

const selected = ref([])
</script>

<template>
  <CheckboxGroup v-model="selected" label="Choose frameworks">
    <Checkbox value="vue">Vue</Checkbox>
    <Checkbox value="react">React</Checkbox>
    <Checkbox value="svelte">Svelte</Checkbox>
    <Checkbox value="solid">Solid</Checkbox>
  </CheckboxGroup>
</template>`,
        type: 'code',
        language: 'vue',
      }
    }
  },
}

/* ─── Variants ──────────────────────────────────────────────────────────── */

export const Variants: Story = {
  render: (args) => ({
    components: { Checkbox, CheckboxGroup },
    setup() {
      const a = ref<string[]>(['vue'])
      const b = ref<string[]>(['vue'])
      return { args, a, b }
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:1.5rem; max-width:20rem;">
        <CheckboxGroup v-bind="args" v-model="a" variant="primary" label="Primary">
          <Checkbox value="vue">Vue</Checkbox>
          <Checkbox value="react">React</Checkbox>
          <Checkbox value="svelte">Svelte</Checkbox>
        </CheckboxGroup>

        <CheckboxGroup v-bind="args" v-model="b" variant="secondary" label="Secondary">
          <Checkbox value="vue">Vue</Checkbox>
          <Checkbox value="react">React</Checkbox>
          <Checkbox value="svelte">Svelte</Checkbox>
        </CheckboxGroup>
      </div>
    `,
  }),
}

/* ─── Orientation ───────────────────────────────────────────────────────── */

export const Vertical: Story = {
  render: (args) => ({
    components: { Checkbox, CheckboxGroup },
    setup() {
      const selected = ref<string[]>(['react'])
      return { args, selected }
    },
    template: `
      <CheckboxGroup v-bind="args" v-model="selected" orientation="vertical" label="Vertical group">
        <Checkbox value="vue">Vue</Checkbox>
        <Checkbox value="react">React</Checkbox>
        <Checkbox value="svelte">Svelte</Checkbox>
      </CheckboxGroup>
    `,
  }),
}

export const Horizontal: Story = {
  render: (args) => ({
    components: { Checkbox, CheckboxGroup },
    setup() {
      const selected = ref<string[]>(['vue'])
      return { args, selected }
    },
    template: `
      <CheckboxGroup v-bind="args" v-model="selected" orientation="horizontal" label="Horizontal group">
        <Checkbox value="vue">Vue</Checkbox>
        <Checkbox value="react">React</Checkbox>
        <Checkbox value="svelte">Svelte</Checkbox>
      </CheckboxGroup>
    `,
  }),
}

/* ─── States ────────────────────────────────────────────────────────────── */

export const WithDescription: Story = {
  render: (args) => ({
    components: { Checkbox, CheckboxGroup },
    setup() {
      const selected = ref<string[]>([])
      return { args, selected }
    },
    template: `
      <CheckboxGroup
        v-bind="args"
        v-model="selected"
        label="Notifications"
        description="Choose how you want to be notified"
      >
        <Checkbox value="email">Email</Checkbox>
        <Checkbox value="sms">SMS</Checkbox>
        <Checkbox value="push">Push</Checkbox>
      </CheckboxGroup>
    `,
  }),
}

export const DefaultValue: Story = {
  render: (args) => ({
    components: { Checkbox, CheckboxGroup },
    setup() {
      return { args }
    },
    template: `
      <CheckboxGroup v-bind="args" :default-value="['vue','svelte']" label="Pre-selected">
        <Checkbox value="vue">Vue</Checkbox>
        <Checkbox value="react">React</Checkbox>
        <Checkbox value="svelte">Svelte</Checkbox>
        <Checkbox value="solid">Solid</Checkbox>
      </CheckboxGroup>
    `,
  }),
}

export const GroupDisabled: Story = {
  render: (args) => ({
    components: { Checkbox, CheckboxGroup },
    setup() {
      const selected = ref<string[]>(['vue'])
      return { args, selected }
    },
    template: `
      <CheckboxGroup v-bind="args" v-model="selected" disabled label="Choose frameworks (group disabled)">
        <Checkbox value="vue">Vue</Checkbox>
        <Checkbox value="react">React</Checkbox>
        <Checkbox value="svelte">Svelte</Checkbox>
      </CheckboxGroup>
    `,
  }),
}

export const ItemDisabled: Story = {
  render: (args) => ({
    components: { Checkbox, CheckboxGroup },
    setup() {
      const selected = ref<string[]>(['vue'])
      return { args, selected }
    },
    template: `
      <CheckboxGroup v-bind="args" v-model="selected" label="Some disabled items">
        <Checkbox value="vue">Vue</Checkbox>
        <Checkbox value="react" disabled>React (disabled)</Checkbox>
        <Checkbox value="svelte">Svelte</Checkbox>
        <Checkbox value="solid" disabled>Solid (disabled)</Checkbox>
      </CheckboxGroup>
    `,
  }),
}

/* ─── Form integration ──────────────────────────────────────────────────── */

export const WithName: Story = {
  render: (args) => ({
    components: { Checkbox, CheckboxGroup },
    setup() {
      const selected = ref<string[]>(['vue'])
      return { args, selected }
    },
    template: `
      <form @submit.prevent style="display:flex; flex-direction:column; gap:1rem;">
        <CheckboxGroup
          v-bind="args"
          v-model="selected"
          name="frameworks"
          label="Frameworks you use"
          description="Submitted as frameworks[]"
        >
          <Checkbox value="vue">Vue</Checkbox>
          <Checkbox value="react">React</Checkbox>
          <Checkbox value="svelte">Svelte</Checkbox>
        </CheckboxGroup>
        <div style="font-size:12px; color:#888;">Selected: {{ selected.join(', ') || '—' }}</div>
      </form>
    `,
  }),
}

export const ArrayAPI: Story = {
  name: 'Array API (items prop)',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { CheckboxGroup } from '@auronui/vue'

const selected = ref(['vue', 'svelte'])
</script>

<template>
  <CheckboxGroup
    v-model="selected"
    label="Choose frameworks"
    :items="[
      { value: 'vue', label: 'Vue' },
      { value: 'react', label: 'React' },
      { value: 'svelte', label: 'Svelte' },
      { value: 'solid', label: 'Solid', disabled: true },
    ]"
  />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { CheckboxGroup },
    setup() {
      const selected = ref(['vue', 'svelte'])
      return { args, selected }
    },
    template: `
      <CheckboxGroup
        v-bind="args"
        v-model="selected"
        label="Choose frameworks"
        :items="[
          { value: 'vue', label: 'Vue' },
          { value: 'react', label: 'React' },
          { value: 'svelte', label: 'Svelte' },
          { value: 'solid', label: 'Solid', disabled: true },
        ]"
      />
    `,
  }),
}
