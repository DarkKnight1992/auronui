import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ColorPickerInput from '../../vue/src/components/color-picker-input/ColorPickerInput.vue'

const meta: Meta<typeof ColorPickerInput> = {
  title: 'Color/ColorPickerInput',
  component: ColorPickerInput,
  tags: ['autodocs'],
  argTypes: {
    format: {
      control: 'select',
      options: ['hex', 'hsl', 'rgb'],
    },
    isDisabled: { control: 'boolean' },
    label: { control: 'text' },
    defaultValue: { control: 'text' },
  },
  args: {
    defaultValue: '#3b82f6',
    format: 'hex',
    isDisabled: false,
  },
}

export default meta
type Story = StoryObj<typeof ColorPickerInput>

export const Default: Story = {
  name: 'Default (Blue, hex)',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorPickerInput } from '@auronui/vue'
</script>

<template>
  <ColorPickerInput defaultValue="#3b82f6" label="Accent color" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorPickerInput },
    setup() { return { args } },
    template: '<ColorPickerInput v-bind="args" label="Accent color" @update:modelValue="args[\'onUpdate:modelValue\']" />',
  }),
  args: {
    defaultValue: '#3b82f6',
  },
}

export const HslFormat: Story = {
  name: 'HSL Format',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorPickerInput } from '@auronui/vue'
</script>

<template>
  <ColorPickerInput defaultValue="#ff0000" format="hsl" label="HSL color" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorPickerInput },
    setup() { return { args } },
    template: '<ColorPickerInput v-bind="args" @update:modelValue="args[\'onUpdate:modelValue\']" />',
  }),
  args: {
    defaultValue: '#ff0000',
    format: 'hsl',
    label: 'HSL color',
  },
}

export const RgbFormat: Story = {
  name: 'RGB Format',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorPickerInput } from '@auronui/vue'
</script>

<template>
  <ColorPickerInput defaultValue="#00ff00" format="rgb" label="RGB color" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorPickerInput },
    setup() { return { args } },
    template: '<ColorPickerInput v-bind="args" @update:modelValue="args[\'onUpdate:modelValue\']" />',
  }),
  args: {
    defaultValue: '#00ff00',
    format: 'rgb',
    label: 'RGB color',
  },
}

export const Controlled: Story = {
  name: 'Controlled Mode',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { ColorPickerInput } from '@auronui/vue'

const color = ref('#3b82f6')
</script>

<template>
  <div>
    <ColorPickerInput :modelValue="color" format="hex" label="Controlled color" @update:modelValue="color = $event" />
    <p style="margin-top: 8px; font-family: monospace; font-size: 14px;">Current: {{ color }}</p>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorPickerInput },
    setup: () => ({ args }),
    data() {
      return { color: '#3b82f6' }
    },
    template: `
      <div>
        <ColorPickerInput v-bind="args" :modelValue="color" format="hex" label="Controlled color" @update:modelValue="color = $event" />
        <p style="margin-top: 8px; font-family: monospace; font-size: 14px;">Current: {{ color }}</p>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  name: 'Disabled',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorPickerInput } from '@auronui/vue'
</script>

<template>
  <ColorPickerInput defaultValue="#3b82f6" :isDisabled="true" label="Disabled color picker" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorPickerInput },
    setup: () => ({ args }),
    template: '<ColorPickerInput v-bind="args" defaultValue="#3b82f6" :isDisabled="true" label="Disabled color picker" />',
  }),
}

export const WithDescriptionAndError: Story = {
  name: 'With Description / Error',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorPickerInput } from '@auronui/vue'
</script>

<template>
  <ColorPickerInput
    defaultValue="#8b5cf6"
    label="Background color"
    description="Pick an accent color for the theme"
    errorMessage="This color fails contrast requirements"
  />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorPickerInput },
    setup: () => ({ args }),
    template: `<ColorPickerInput
      v-bind="args"
      defaultValue="#8b5cf6"
      label="Background color"
      description="Pick an accent color for the theme"
      errorMessage="This color fails contrast requirements"
    />`,
  }),
}

export const StartingFromBlack: Story = {
  name: 'Starting from Black',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorPickerInput } from '@auronui/vue'
</script>

<template>
  <ColorPickerInput defaultValue="#000000" label="Black color picker" format="hex" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorPickerInput },
    setup: () => ({ args }),
    template: '<ColorPickerInput v-bind="args" defaultValue="#000000" label="Black color picker" format="hex" />',
  }),
}
