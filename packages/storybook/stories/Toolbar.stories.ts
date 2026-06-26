import type { Meta, StoryObj } from '@storybook/vue3'
import {
  Toolbar,
  ToolbarButton,
  ToolbarLink,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from '@auronui/vue'

const meta: Meta<typeof Toolbar> = {
  title: 'Components/Toolbar',
  tags: ['autodocs'],
  component: Toolbar,
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    dir: {
      control: { type: 'select' },
      options: ['ltr', 'rtl'],
      description: 'Text direction for the toolbar.',
      table: { category: 'Toolbar', defaultValue: { summary: 'undefined' } },
    },
    as: {
      control: 'text',
      description: 'Render Toolbar as a different HTML element.',
      table: { category: 'Toolbar', defaultValue: { summary: 'div' } },
    },
    asChild: {
      control: 'boolean',
      description: 'Merge Toolbar props onto the child element.',
      table: { category: 'Toolbar', defaultValue: { summary: 'false' } },
    },
    toggleGroupRovingFocus: {
      control: 'boolean',
      description: 'Whether ToolbarToggleGroup uses roving focus for keyboard navigation.',
      table: { category: 'ToolbarToggleGroup', defaultValue: { summary: 'true' } },
    },
    toggleGroupLoop: {
      control: 'boolean',
      description: 'Whether keyboard navigation loops around in ToolbarToggleGroup.',
      table: { category: 'ToolbarToggleGroup', defaultValue: { summary: 'true' } },
    },
    toggleGroupName: {
      control: 'text',
      description: 'Form field name for ToolbarToggleGroup.',
      table: { category: 'ToolbarToggleGroup', defaultValue: { summary: 'undefined' } },
    },
    toggleGroupRequired: {
      control: 'boolean',
      description: 'Whether a value is required in ToolbarToggleGroup.',
      table: { category: 'ToolbarToggleGroup', defaultValue: { summary: 'false' } },
    },
  },
}
export default meta
type Story = StoryObj<typeof Toolbar>

export const Horizontal: Story = {
  args: { orientation: 'horizontal', asChild: false, toggleGroupRovingFocus: true, toggleGroupLoop: true, toggleGroupRequired: false },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Toolbar, ToolbarButton, ToolbarSeparator, ToolbarToggleGroup, ToolbarToggleItem, ToolbarLink } from '@auronui/vue'
</script>

<template>
  <Toolbar orientation="horizontal">
    <ToolbarButton>New</ToolbarButton>
    <ToolbarButton>Open</ToolbarButton>
    <ToolbarSeparator />
    <ToolbarToggleGroup type="multiple">
      <ToolbarToggleItem value="bold">B</ToolbarToggleItem>
      <ToolbarToggleItem value="italic">I</ToolbarToggleItem>
      <ToolbarToggleItem value="underline">U</ToolbarToggleItem>
    </ToolbarToggleGroup>
    <ToolbarSeparator />
    <ToolbarLink href="https://example.com/docs">Docs</ToolbarLink>
  </Toolbar>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Toolbar, ToolbarButton, ToolbarLink, ToolbarSeparator, ToolbarToggleGroup, ToolbarToggleItem },
    setup() { return { args } },
    template: `
      <Toolbar v-bind="args" :dir="args.dir" :as="args.as" :as-child="args.asChild">
        <ToolbarButton>New</ToolbarButton>
        <ToolbarButton>Open</ToolbarButton>
        <ToolbarSeparator />
        <ToolbarToggleGroup
          type="multiple"
          :roving-focus="args.toggleGroupRovingFocus"
          :loop="args.toggleGroupLoop"
          :name="args.toggleGroupName"
          :required="args.toggleGroupRequired"
        >
          <ToolbarToggleItem value="bold">B</ToolbarToggleItem>
          <ToolbarToggleItem value="italic">I</ToolbarToggleItem>
          <ToolbarToggleItem value="underline">U</ToolbarToggleItem>
        </ToolbarToggleGroup>
        <ToolbarSeparator />
        <ToolbarLink href="https://example.com/docs">Docs</ToolbarLink>
      </Toolbar>
    `,
  }),
}

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Toolbar, ToolbarButton } from '@auronui/vue'
</script>

<template>
  <Toolbar orientation="vertical">
    <ToolbarButton>Up</ToolbarButton>
    <ToolbarButton>Down</ToolbarButton>
    <ToolbarButton>Delete</ToolbarButton>
  </Toolbar>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Toolbar, ToolbarButton },
    setup() { return { args } },
    template: `
      <Toolbar v-bind="args">
        <ToolbarButton>Up</ToolbarButton>
        <ToolbarButton>Down</ToolbarButton>
        <ToolbarButton>Delete</ToolbarButton>
      </Toolbar>
    `,
  }),
}

export const SingleSelectToggle: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Toolbar, ToolbarToggleGroup, ToolbarToggleItem } from '@auronui/vue'
</script>

<template>
  <Toolbar>
    <ToolbarToggleGroup type="single" default-value="center">
      <ToolbarToggleItem value="left">Left</ToolbarToggleItem>
      <ToolbarToggleItem value="center">Center</ToolbarToggleItem>
      <ToolbarToggleItem value="right">Right</ToolbarToggleItem>
    </ToolbarToggleGroup>
  </Toolbar>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Toolbar, ToolbarToggleGroup, ToolbarToggleItem },
    setup: () => ({ args }),
    template: `
      <Toolbar v-bind="args">
        <ToolbarToggleGroup type="single" default-value="center">
          <ToolbarToggleItem value="left">Left</ToolbarToggleItem>
          <ToolbarToggleItem value="center">Center</ToolbarToggleItem>
          <ToolbarToggleItem value="right">Right</ToolbarToggleItem>
        </ToolbarToggleGroup>
      </Toolbar>
    `,
  }),
}

export const ToggleGroupArrayAPI: Story = {
  name: 'ToggleGroup: Array API (items prop)',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Toolbar, ToolbarToggleGroup } from '@auronui/vue'
</script>

<template>
  <Toolbar>
    <ToolbarToggleGroup
      type="multiple"
      :items="[
        { value: 'bold', label: 'Bold' },
        { value: 'italic', label: 'Italic' },
        { value: 'underline', label: 'Underline' },
      ]"
    />
  </Toolbar>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Toolbar, ToolbarToggleGroup },
    setup() { return { args } },
    template: `
      <Toolbar v-bind="args">
        <ToolbarToggleGroup type="multiple" :items="[
          { value: 'bold', label: 'Bold' },
          { value: 'italic', label: 'Italic' },
          { value: 'underline', label: 'Underline' },
        ]" />
      </Toolbar>
    `,
  }),
}
