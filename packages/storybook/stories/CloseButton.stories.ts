import type { Meta, StoryObj } from '@storybook/vue3'
import { Button, CloseButton, ButtonGroup } from '@auronui/vue'
import { ref } from 'vue'

const meta: Meta<typeof CloseButton> = {
  title: 'Components/CloseButton',
  component: CloseButton,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
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
}

export const DisabledState: Story = {
  render: (args) => ({
    components: { CloseButton },
    setup: () => ({ args }),
    template: '<CloseButton v-bind="args" :disabled="true" />',
  }),
}

export const CustomAriaLabel: Story = {
  render: (args) => ({
    components: { CloseButton },
    setup: () => ({ args }),
    template: '<CloseButton v-bind="args" ariaLabel="Dismiss notification" />',
  }),
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
}
