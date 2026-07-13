import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { InputGroup, InputGroupAddon, InputGroupInput, Button } from '@auronui/vue'

const meta: Meta<typeof InputGroup> = {
  title: 'Form/InputGroup',
  component: InputGroup,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['flat', 'faded', 'bordered', 'underlined', 'raised'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'accent', 'success', 'warning', 'danger'],
    },
    label: { control: 'text' },
    description: { control: 'text' },
    errorMessage: { control: 'text' },
    isInvalid: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  args: {
    variant: 'flat',
    size: 'md',
    color: 'default',
    isInvalid: false,
    isDisabled: false,
    isRequired: false,
    fullWidth: false,
  },
}

export default meta
type Story = StoryObj<typeof InputGroup>

export const LeadingIcon: Story = {
  name: 'Leading icon addon',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { InputGroup, InputGroupAddon, InputGroupInput } from '@auronui/vue'
</script>

<template>
  <InputGroup>
    <InputGroupAddon aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </InputGroupAddon>
    <InputGroupInput placeholder="Search…" aria-label="Search" />
  </InputGroup>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { InputGroup, InputGroupAddon, InputGroupInput },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 280px;">
        <InputGroup v-bind="args">
          <InputGroupAddon aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </InputGroupAddon>
          <InputGroupInput placeholder="Search…" aria-label="Search" />
        </InputGroup>
      </div>
    `,
  }),
}

export const TrailingUnit: Story = {
  name: 'Trailing unit addon',
  render: (args) => ({
    components: { InputGroup, InputGroupAddon, InputGroupInput },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 220px;">
        <InputGroup v-bind="args">
          <InputGroupInput placeholder="0.00" aria-label="Amount" />
          <InputGroupAddon>kg</InputGroupAddon>
        </InputGroup>
      </div>
    `,
  }),
}

export const WithButton: Story = {
  name: 'Trailing button addon',
  render: (args) => ({
    components: { InputGroup, InputGroupAddon, InputGroupInput, Button },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 320px;">
        <InputGroup v-bind="args">
          <InputGroupInput placeholder="you@example.com" aria-label="Email" />
          <InputGroupAddon>
            <Button size="sm">Subscribe</Button>
          </InputGroupAddon>
        </InputGroup>
      </div>
    `,
  }),
}

export const Invalid: Story = {
  args: { isInvalid: true, label: 'Price', errorMessage: 'Enter a valid price' },
  render: (args) => ({
    components: { InputGroup, InputGroupAddon, InputGroupInput },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 280px;">
        <InputGroup v-bind="args">
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupInput placeholder="0.00" />
        </InputGroup>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          'label/description/errorMessage are owned by InputGroup itself — aria-describedby is wired to the contained InputGroupInput automatically, no manual ids required.',
      },
    },
  },
}

export const WithDescription: Story = {
  name: 'With label + description',
  args: { label: 'Price', description: 'In US dollars, before tax' },
  render: (args) => ({
    components: { InputGroup, InputGroupAddon, InputGroupInput },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 280px;">
        <InputGroup v-bind="args">
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupInput placeholder="0.00" />
        </InputGroup>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  args: { isDisabled: true },
  render: (args) => ({
    components: { InputGroup, InputGroupAddon, InputGroupInput },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 280px;">
        <InputGroup v-bind="args">
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupInput placeholder="0.00" aria-label="Price" model-value="120" />
        </InputGroup>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { InputGroup, InputGroupAddon, InputGroupInput },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;width:280px;">
        <InputGroup size="sm">
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupInput placeholder="Small" aria-label="Small amount" />
        </InputGroup>
        <InputGroup size="md">
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupInput placeholder="Medium" aria-label="Medium amount" />
        </InputGroup>
        <InputGroup size="lg">
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupInput placeholder="Large" aria-label="Large amount" />
        </InputGroup>
      </div>
    `,
  }),
}

export const Variants: Story = {
  render: () => ({
    components: { InputGroup, InputGroupAddon, InputGroupInput },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;width:280px;">
        <InputGroup variant="flat">
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupInput placeholder="Flat" aria-label="Flat amount" />
        </InputGroup>
        <InputGroup variant="bordered">
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupInput placeholder="Bordered" aria-label="Bordered amount" />
        </InputGroup>
        <InputGroup variant="faded">
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupInput placeholder="Faded" aria-label="Faded amount" />
        </InputGroup>
        <InputGroup variant="underlined">
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupInput placeholder="Underlined" aria-label="Underlined amount" />
        </InputGroup>
        <InputGroup variant="raised">
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupInput placeholder="Raised" aria-label="Raised amount" />
        </InputGroup>
      </div>
    `,
  }),
}

export const Colors: Story = {
  render: () => ({
    components: { InputGroup, InputGroupAddon, InputGroupInput },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;width:280px;">
        <InputGroup color="default" variant="bordered">
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupInput placeholder="Default (focus me)" aria-label="Default amount" />
        </InputGroup>
        <InputGroup color="primary" variant="bordered">
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupInput placeholder="Primary (focus me)" aria-label="Primary amount" />
        </InputGroup>
        <InputGroup color="accent" variant="bordered">
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupInput placeholder="Accent (focus me)" aria-label="Accent amount" />
        </InputGroup>
        <InputGroup color="success" variant="bordered">
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupInput placeholder="Success (focus me)" aria-label="Success amount" />
        </InputGroup>
        <InputGroup color="danger" variant="bordered">
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupInput placeholder="Danger (focus me)" aria-label="Danger amount" />
        </InputGroup>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Color only affects the focus-ring accent — click into each field to see it.',
      },
    },
  },
}
