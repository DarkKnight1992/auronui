import type { Meta, StoryObj } from '@storybook/vue3'
import { Button, CloseButton, ButtonGroup } from '@auronui/vue'
import { ref } from 'vue'

const meta: Meta<typeof CloseButton> = {
  title: 'Components/CloseButton',
  tags: ['autodocs'],
  component: CloseButton,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: {
      control: 'select',
      options: ['solid', 'default', 'bordered', 'ghost', 'soft'],
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'accent', 'success', 'warning', 'danger'],
    },
    disabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    ariaLabel: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof CloseButton>

export const Default: Story = {
  render: (args) => ({
    components: { CloseButton },
    setup: () => ({ args }),
    template: '<CloseButton v-bind="args" />',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { CloseButton } from '@auronui/vue'
</script>

<template>
  <CloseButton />
</template>`,
        type: 'code',
        language: 'vue',
      }
    }
  },
}

export const AllSizes: Story = {
  render: (args) => ({
    components: { CloseButton },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;align-items:center;gap:8px">
        <CloseButton v-bind="args" size="sm" />
        <CloseButton v-bind="args" size="md" />
        <CloseButton v-bind="args" size="lg" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { CloseButton } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;align-items:center;gap:8px">
    <CloseButton size="sm" />
    <CloseButton size="md" />
    <CloseButton size="lg" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const Colors: Story = {
  parameters: {
    controls: { exclude: ['color'] },
    docs: {
      source: {
        code: `<script setup>
import { CloseButton } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;align-items:center;gap:8px">
    <CloseButton color="default" />
    <CloseButton color="primary" />
    <CloseButton color="secondary" />
    <CloseButton color="accent" />
    <CloseButton color="success" />
    <CloseButton color="warning" />
    <CloseButton color="danger" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { CloseButton },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;align-items:center;gap:8px">
        <CloseButton v-bind="args" color="default" />
        <CloseButton v-bind="args" color="primary" />
        <CloseButton v-bind="args" color="secondary" />
        <CloseButton v-bind="args" color="accent" />
        <CloseButton v-bind="args" color="success" />
        <CloseButton v-bind="args" color="warning" />
        <CloseButton v-bind="args" color="danger" />
      </div>
    `,
  }),
}

export const Variants: Story = {
  parameters: {
    controls: { exclude: ['variant'] },
    docs: {
      source: {
        code: `<script setup>
import { CloseButton } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;align-items:center;gap:8px">
    <CloseButton variant="solid" color="primary" />
    <CloseButton variant="default" color="primary" />
    <CloseButton variant="bordered" color="primary" />
    <CloseButton variant="ghost" color="primary" />
    <CloseButton variant="soft" color="primary" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { CloseButton },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;align-items:center;gap:8px">
        <CloseButton v-bind="args" variant="solid" color="primary" />
        <CloseButton v-bind="args" variant="default" color="primary" />
        <CloseButton v-bind="args" variant="bordered" color="primary" />
        <CloseButton v-bind="args" variant="ghost" color="primary" />
        <CloseButton v-bind="args" variant="soft" color="primary" />
      </div>
    `,
  }),
}

export const DisabledState: Story = {
  render: (args) => ({
    components: { CloseButton },
    setup: () => ({ args }),
    template: '<CloseButton v-bind="args" :disabled="true" />',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { CloseButton } from '@auronui/vue'
</script>

<template>
  <CloseButton :disabled="true" />
</template>`,
        language: 'vue',
      },
    },
  },
}

export const CustomAriaLabel: Story = {
  render: (args) => ({
    components: { CloseButton },
    setup: () => ({ args }),
    template: '<CloseButton v-bind="args" ariaLabel="Dismiss notification" />',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { CloseButton } from '@auronui/vue'
</script>

<template>
  <CloseButton ariaLabel="Dismiss notification" />
</template>`,
        language: 'vue',
      },
    },
  },
}

export const InButtonGroup: Story = {
  render: (args) => ({
    components: { Button, CloseButton, ButtonGroup },
    setup() {
      const disabled = ref(false)
      return { args, disabled }
    },
    template: `
      <div>
        <Button variant="flat" style="margin-bottom:16px" @click="disabled = !disabled">
          Toggle Group Disabled
        </Button>
        <ButtonGroup :disabled="disabled">
          <CloseButton v-bind="args" ariaLabel="Close first" />
          <CloseButton v-bind="args" ariaLabel="Close second" />
        </ButtonGroup>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Button, CloseButton, ButtonGroup } from '@auronui/vue'

const disabled = ref(false)
</script>

<template>
  <div>
    <Button variant="flat" style="margin-bottom:16px" @click="disabled = !disabled">
      Toggle Group Disabled
    </Button>
    <ButtonGroup :disabled="disabled">
      <CloseButton ariaLabel="Close first" />
      <CloseButton ariaLabel="Close second" />
    </ButtonGroup>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}
