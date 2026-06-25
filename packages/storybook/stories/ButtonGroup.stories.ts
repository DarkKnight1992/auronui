import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Button, ButtonGroup } from '@auronui/vue'
import { ref } from 'vue'

const meta: Meta = {
  title: 'Components/ButtonGroup',
  tags: ['autodocs'],
  component: ButtonGroup,
  argTypes: {
    classNames: {
      control: 'object',
      description: 'Per-slot class overrides. Keys match the component anatomy slot names.',
    },
  },
}

export default meta
type Story = StoryObj

export const HorizontalDefault: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ButtonGroup, Button } from '@auronui/vue'
</script>

<template>
  <ButtonGroup orientation="horizontal">
    <Button variant="bordered">One</Button>
    <Button variant="bordered">Two</Button>
    <Button variant="bordered">Three</Button>
  </ButtonGroup>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Button, ButtonGroup },
    setup: () => ({ args }),
    template: `
      <ButtonGroup v-bind="args" orientation="horizontal">
        <Button variant="bordered">One</Button>
        <Button variant="bordered">Two</Button>
        <Button variant="bordered">Three</Button>
      </ButtonGroup>
    `,
  }),
}

export const VerticalGroup: Story = {
  render: (args) => ({
    components: { Button, ButtonGroup },
    setup: () => ({ args }),
    template: `
      <ButtonGroup v-bind="args" orientation="vertical">
        <Button variant="bordered">Top</Button>
        <Button variant="bordered">Middle</Button>
        <Button variant="bordered">Bottom</Button>
      </ButtonGroup>
    `,
  }),
}

export const VariantPropagation: Story = {
  render: (args) => ({
    components: { Button, ButtonGroup },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px">
        <ButtonGroup v-bind="args" variant="success">
          <Button>A</Button>
          <Button>B</Button>
          <Button variant="danger">Override</Button>
        </ButtonGroup>
        <ButtonGroup v-bind="args" variant="warning">
          <Button>X</Button>
          <Button>Y</Button>
        </ButtonGroup>
      </div>
    `,
  }),
}

export const GroupDisabled: Story = {
  render: (args) => ({
    components: { Button, ButtonGroup },
    setup() {
      const disabled = ref(false)
      return { args, disabled }
    },
    template: `
      <div>
        <Button variant="flat" style="margin-bottom:16px" @click="disabled = !disabled">
          Toggle Group Disabled (currently: {{ disabled }})
        </Button>
        <ButtonGroup v-bind="args" :disabled="disabled">
          <Button>Save</Button>
          <Button>Discard</Button>
          <Button>Cancel</Button>
        </ButtonGroup>
      </div>
    `,
  }),
}

export const DisabledHorizontal: Story = {
  render: (args) => ({
    components: { Button, ButtonGroup },
    setup: () => ({ args }),
    template: `
      <ButtonGroup v-bind="args" orientation="horizontal" :disabled="true">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
    `,
  }),
}

export const DisabledVertical: Story = {
  render: (args) => ({
    components: { Button, ButtonGroup },
    setup: () => ({ args }),
    template: `
      <ButtonGroup v-bind="args" orientation="vertical" :disabled="true">
        <Button>Top</Button>
        <Button>Bottom</Button>
      </ButtonGroup>
    `,
  }),
}

export const SelectableVertical: Story = {
  render: (args) => ({
    components: { Button, ButtonGroup },
    setup() {
      const selected = ref<string>('middle')
      return { args, selected }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px">
        <ButtonGroup v-bind="args" orientation="vertical" variant="bordered" v-model="selected">
          <Button value="top">Top</Button>
          <Button value="middle">Middle</Button>
          <Button value="bottom">Bottom</Button>
        </ButtonGroup>
        <div>Selected: {{ selected }}</div>
      </div>
    `,
  }),
}

export const SelectableHorizontal: Story = {
  render: (args) => ({
    components: { Button, ButtonGroup },
    setup() {
      const selected = ref<string | null>(null)
      return { args, selected }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px">
        <ButtonGroup v-bind="args" orientation="horizontal" variant="bordered" v-model="selected">
          <Button value="left">Left</Button>
          <Button value="center">Center</Button>
          <Button value="right">Right</Button>
        </ButtonGroup>
        <div>Selected: {{ selected ?? 'none' }}</div>
      </div>
    `,
  }),
}

export const MultiSelect: Story = {
  render: (args) => ({
    components: { Button, ButtonGroup },
    setup() {
      const selected = ref<string[]>(['bold', 'italic'])
      return { args, selected }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px">
        <ButtonGroup v-bind="args" variant="bordered" selection-mode="multiple" v-model="selected">
          <Button value="bold">Bold</Button>
          <Button value="italic">Italic</Button>
          <Button value="underline">Underline</Button>
          <Button value="strike">Strike</Button>
        </ButtonGroup>
        <div>Selected: {{ selected.join(', ') || 'none' }}</div>
      </div>
    `,
  }),
}

export const MultiSelectVertical: Story = {
  render: (args) => ({
    components: { Button, ButtonGroup },
    setup() {
      const selected = ref<string[]>([])
      return { args, selected }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px">
        <ButtonGroup v-bind="args" orientation="vertical" variant="bordered" selection-mode="multiple" v-model="selected">
          <Button value="email">Email</Button>
          <Button value="sms">SMS</Button>
          <Button value="push">Push</Button>
        </ButtonGroup>
        <div>Channels: {{ selected.join(', ') || 'none' }}</div>
      </div>
    `,
  }),
}

export const CustomStyles: Story = {
  name: 'Custom styles via classNames',
  render: (args) => ({
    components: { Button, ButtonGroup },
    setup: () => ({ args }),
    template: `
      <ButtonGroup
        v-bind="args"
        orientation="horizontal"
        :class-names="{
          base: 'border-2 border-blue-500 rounded-xl bg-blue-50 p-2',
        }"
      >
        <Button variant="bordered">Option One</Button>
        <Button variant="bordered">Option Two</Button>
        <Button variant="bordered">Option Three</Button>
      </ButtonGroup>
    `,
  }),
}

export const ArrayAPI: Story = {
  name: 'Array API (buttons prop)',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ButtonGroup } from '@auronui/vue'
</script>

<template>
  <ButtonGroup
    :buttons="[
      { label: 'Cut', value: 'cut' },
      { label: 'Copy', value: 'copy' },
      { label: 'Paste', value: 'paste' },
    ]"
  />

  <ButtonGroup
    variant="bordered"
    :buttons="[
      { label: 'Day', value: 'day' },
      { label: 'Week', value: 'week' },
      { label: 'Month', value: 'month' },
      { label: 'Year', value: 'year', disabled: true },
    ]"
  />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ButtonGroup },
    setup() { return { args } },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px">
        <ButtonGroup v-bind="args" :buttons="[
          { label: 'Cut', value: 'cut' },
          { label: 'Copy', value: 'copy' },
          { label: 'Paste', value: 'paste' },
        ]" />
        <ButtonGroup v-bind="args" variant="bordered" :buttons="[
          { label: 'Day', value: 'day' },
          { label: 'Week', value: 'week' },
          { label: 'Month', value: 'month' },
          { label: 'Year', value: 'year', disabled: true },
        ]" />
      </div>
    `,
  }),
}
