import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ColorField from '../../vue/src/components/color-field/ColorField.vue'

const meta: Meta<typeof ColorField> = {
  title: 'Color/ColorField',
  component: ColorField,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' },
    errorMessage: { control: 'text' },
    placeholder: { control: 'text' },
    as: {
      control: 'text',
      description: 'The element or component the ColorFieldRoot renders as.',
      table: { category: 'ColorFieldRoot', defaultValue: { summary: 'div' } },
    },
    asChild: {
      control: 'boolean',
      description: 'Merge props onto the child element instead of rendering a wrapper.',
      table: { category: 'ColorFieldRoot', defaultValue: { summary: 'false' } },
    },
    name: {
      control: 'text',
      description: 'The name of the color field for form submission.',
      table: { category: 'ColorFieldRoot', defaultValue: { summary: '' } },
    },
    required: {
      control: 'boolean',
      description: 'Whether the color field is required in a form.',
      table: { category: 'ColorFieldRoot', defaultValue: { summary: 'false' } },
    },
    colorSpace: {
      control: 'text',
      description: 'The color space to use for the field value.',
      table: { category: 'ColorFieldRoot', defaultValue: { summary: '' } },
    },
    channel: {
      control: 'text',
      description: 'The color channel to display and edit.',
      table: { category: 'ColorFieldRoot', defaultValue: { summary: '' } },
    },
    disableWheelChange: {
      control: 'boolean',
      description: 'Disable changing the value via mouse wheel scroll.',
      table: { category: 'ColorFieldRoot', defaultValue: { summary: 'false' } },
    },
    locale: {
      control: 'text',
      description: 'The locale to use for number formatting.',
      table: { category: 'ColorFieldRoot', defaultValue: { summary: '' } },
    },
    step: {
      control: 'number',
      description: 'The step increment for keyboard interactions.',
      table: { category: 'ColorFieldRoot', defaultValue: { summary: '1' } },
    },
  },
  args: {
    defaultValue: '#ff0000',
    disabled: false,
    readonly: false,
    asChild: false,
    required: false,
    disableWheelChange: false,
  },
}

export default meta
type Story = StoryObj<typeof ColorField>

export const Default: Story = {
  name: 'Default',
  render: (args) => ({
    components: { ColorField },
    setup() { return { args } },
    template: '<ColorField v-bind="args" />',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorField } from '@auronui/vue'
</script>

<template>
  <ColorField />
</template>`,
        type: 'code',
        language: 'vue',
      }
    }
  },
}

export const WithLabel: Story = {
  name: 'With Label',
  render: (args) => ({
    components: { ColorField },
    setup: () => ({ args }),
    template: '<ColorField v-bind="args" defaultValue="#0066ff" label="Background color" />',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorField } from '@auronui/vue'
</script>

<template>
  <ColorField defaultValue="#0066ff" label="Background color" />
</template>`,
        language: 'vue',
      },
    },
  },
}

export const WithDescription: Story = {
  name: 'With Description',
  render: (args) => ({
    components: { ColorField },
    setup: () => ({ args }),
    template: '<ColorField v-bind="args" defaultValue="#00cc44" label="Accent color" description="Enter a hex, hsl, or rgb color value" />',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorField } from '@auronui/vue'
</script>

<template>
  <ColorField defaultValue="#00cc44" label="Accent color" description="Enter a hex, hsl, or rgb color value" />
</template>`,
        language: 'vue',
      },
    },
  },
}

export const WithError: Story = {
  name: 'With Error',
  render: (args) => ({
    components: { ColorField },
    setup: () => ({ args }),
    template: '<ColorField v-bind="args" defaultValue="#ff0000" label="Color" errorMessage="Please enter a valid color" />',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorField } from '@auronui/vue'
</script>

<template>
  <ColorField defaultValue="#ff0000" label="Color" errorMessage="Please enter a valid color" />
</template>`,
        language: 'vue',
      },
    },
  },
}

export const Disabled: Story = {
  name: 'Disabled',
  render: (args) => ({
    components: { ColorField },
    setup: () => ({ args }),
    template: '<ColorField v-bind="args" defaultValue="#888888" label="Color (disabled)" :disabled="true" />',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorField } from '@auronui/vue'
</script>

<template>
  <ColorField defaultValue="#888888" label="Color (disabled)" :disabled="true" />
</template>`,
        language: 'vue',
      },
    },
  },
}

export const Readonly: Story = {
  name: 'Readonly',
  render: (args) => ({
    components: { ColorField },
    setup: () => ({ args }),
    template: '<ColorField v-bind="args" defaultValue="#ff6b00" label="Fixed color" :readonly="true" />',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ColorField } from '@auronui/vue'
</script>

<template>
  <ColorField defaultValue="#ff6b00" label="Fixed color" :readonly="true" />
</template>`,
        language: 'vue',
      },
    },
  },
}
