import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ColorPicker from '../../vue/src/components/color-picker/ColorPicker.vue'

const meta: Meta<typeof ColorPicker> = {
  title: 'Color/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  argTypes: {
    format: {
      control: 'select',
      options: ['hex', 'hsl', 'rgb'],
    },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    defaultValue: { control: 'text' },
  },
  args: {
    defaultValue: '#3b82f6',
    format: 'hex',
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof ColorPicker>

export const Default: Story = {
  name: 'Default (Blue, hex)',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorPicker } from '@auronui/vue'
</script>

<template>
  <ColorPicker defaultValue="#3b82f6" />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorPicker },
    setup() { return { args } },
    template: '<ColorPicker v-bind="args" @update:modelValue="args[\'onUpdate:modelValue\']" />',
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
import { ColorPicker } from '@auronui/vue'
</script>

<template>
  <ColorPicker defaultValue="#ff0000" format="hsl" label="HSL color" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorPicker },
    setup() { return { args } },
    template: '<ColorPicker v-bind="args" @update:modelValue="args[\'onUpdate:modelValue\']" />',
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
import { ColorPicker } from '@auronui/vue'
</script>

<template>
  <ColorPicker defaultValue="#00ff00" format="rgb" label="RGB color" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorPicker },
    setup() { return { args } },
    template: '<ColorPicker v-bind="args" @update:modelValue="args[\'onUpdate:modelValue\']" />',
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
import { ColorPicker } from '@auronui/vue'

const color = ref('#3b82f6')
</script>

<template>
  <div>
    <ColorPicker :modelValue="color" format="hex" label="Controlled color" @update:modelValue="color = $event" />
    <p style="margin-top: 8px; font-family: monospace; font-size: 14px;">Current: {{ color }}</p>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorPicker },
    setup: () => ({ args }),
    data() {
      return { color: '#3b82f6' }
    },
    template: `
      <div>
        <ColorPicker v-bind="args" :modelValue="color" format="hex" label="Controlled color" @update:modelValue="color = $event" />
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
import { ColorPicker } from '@auronui/vue'
</script>

<template>
  <ColorPicker defaultValue="#3b82f6" :disabled="true" label="Disabled color picker" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorPicker },
    setup: () => ({ args }),
    template: '<ColorPicker v-bind="args" defaultValue="#3b82f6" :disabled="true" label="Disabled color picker" />',
  }),
}

export const WithLabel: Story = {
  name: 'With Label',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorPicker } from '@auronui/vue'
</script>

<template>
  <ColorPicker defaultValue="#8b5cf6" label="Background color" format="hex" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorPicker },
    setup: () => ({ args }),
    template: '<ColorPicker v-bind="args" defaultValue="#8b5cf6" label="Background color" format="hex" />',
  }),
}

export const StartingFromBlack: Story = {
  name: 'Starting from Black',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorPicker } from '@auronui/vue'
</script>

<template>
  <ColorPicker defaultValue="#000000" label="Black color picker" format="hex" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorPicker },
    setup: () => ({ args }),
    template: '<ColorPicker v-bind="args" defaultValue="#000000" label="Black color picker" format="hex" />',
  }),
}

export const StartingFromWhite: Story = {
  name: 'Starting from White',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorPicker } from '@auronui/vue'
</script>

<template>
  <ColorPicker defaultValue="#ffffff" label="White color picker" format="hex" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ColorPicker },
    setup: () => ({ args }),
    template: '<ColorPicker v-bind="args" defaultValue="#ffffff" label="White color picker" format="hex" />',
  }),
}
