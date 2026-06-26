import type { Meta, StoryObj } from '@storybook/vue3'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  CollapsibleGroup,
} from '@auronui/vue'

const meta: Meta<typeof Collapsible> = {
  title: 'Components/Collapsible',
  tags: ['autodocs'],
  component: Collapsible,
  argTypes: {
    classNames: { control: 'object', description: 'Per-slot class overrides. Keys match the component anatomy slot names.' },
    triggerAs: {
      control: 'text',
      description: 'Render CollapsibleTrigger as a different element type.',
      table: { category: 'CollapsibleTrigger', defaultValue: { summary: 'button' } },
    },
    triggerAsChild: {
      control: 'boolean',
      description: 'Merge CollapsibleTrigger props onto child element instead of rendering a wrapper.',
      table: { category: 'CollapsibleTrigger', defaultValue: { summary: 'false' } },
    },
    contentAs: {
      control: 'text',
      description: 'Render CollapsibleContent as a different element type.',
      table: { category: 'CollapsibleContent', defaultValue: { summary: 'div' } },
    },
    contentAsChild: {
      control: 'boolean',
      description: 'Merge CollapsibleContent props onto child element instead of rendering a wrapper.',
      table: { category: 'CollapsibleContent', defaultValue: { summary: 'false' } },
    },
  },
  args: {
    triggerAsChild: false,
    contentAsChild: false,
  },
}
export default meta
type Story = StoryObj<typeof Collapsible>

export const Standalone: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@auronui/vue'
</script>

<template>
  <Collapsible :default-open="true">
    <CollapsibleTrigger>Show more</CollapsibleTrigger>
    <CollapsibleContent>Extra detail revealed inside the collapsible.</CollapsibleContent>
  </Collapsible>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
    setup: () => ({ args }),
    template: `
      <Collapsible v-bind="args" :default-open="true">
        <CollapsibleTrigger :as="args.triggerAs" :as-child="args.triggerAsChild">Show more</CollapsibleTrigger>
        <CollapsibleContent :as="args.contentAs" :as-child="args.contentAsChild">Extra detail revealed inside the collapsible.</CollapsibleContent>
      </Collapsible>
    `,
  }),
}

export const GroupMultiOpen: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { CollapsibleGroup, Collapsible, CollapsibleTrigger, CollapsibleContent } from '@auronui/vue'
</script>

<template>
  <CollapsibleGroup>
    <Collapsible>
      <CollapsibleTrigger>Shipping</CollapsibleTrigger>
      <CollapsibleContent>Free over $50</CollapsibleContent>
    </Collapsible>
    <Collapsible>
      <CollapsibleTrigger>Returns</CollapsibleTrigger>
      <CollapsibleContent>30-day window</CollapsibleContent>
    </Collapsible>
    <Collapsible>
      <CollapsibleTrigger>Warranty</CollapsibleTrigger>
      <CollapsibleContent>2-year limited</CollapsibleContent>
    </Collapsible>
  </CollapsibleGroup>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { CollapsibleGroup, Collapsible, CollapsibleTrigger, CollapsibleContent },
    setup: () => ({ args }),
    template: `
      <CollapsibleGroup>
        <Collapsible v-bind="args">
          <CollapsibleTrigger>Shipping</CollapsibleTrigger>
          <CollapsibleContent>Free over $50</CollapsibleContent>
        </Collapsible>
        <Collapsible v-bind="args">
          <CollapsibleTrigger>Returns</CollapsibleTrigger>
          <CollapsibleContent>30-day window</CollapsibleContent>
        </Collapsible>
        <Collapsible v-bind="args">
          <CollapsibleTrigger>Warranty</CollapsibleTrigger>
          <CollapsibleContent>2-year limited</CollapsibleContent>
        </Collapsible>
      </CollapsibleGroup>
    `,
  }),
}

export const GroupSingleOpen: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { CollapsibleGroup, Collapsible, CollapsibleTrigger, CollapsibleContent } from '@auronui/vue'
</script>

<template>
  <CollapsibleGroup :single-open="true">
    <Collapsible :default-open="true">
      <CollapsibleTrigger>Section A</CollapsibleTrigger>
      <CollapsibleContent>Content A</CollapsibleContent>
    </Collapsible>
    <Collapsible>
      <CollapsibleTrigger>Section B</CollapsibleTrigger>
      <CollapsibleContent>Content B</CollapsibleContent>
    </Collapsible>
    <Collapsible>
      <CollapsibleTrigger>Section C</CollapsibleTrigger>
      <CollapsibleContent>Content C</CollapsibleContent>
    </Collapsible>
  </CollapsibleGroup>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { CollapsibleGroup, Collapsible, CollapsibleTrigger, CollapsibleContent },
    setup: () => ({ args }),
    template: `
      <CollapsibleGroup :single-open="true">
        <Collapsible v-bind="args" :default-open="true">
          <CollapsibleTrigger>Section A</CollapsibleTrigger>
          <CollapsibleContent>Content A</CollapsibleContent>
        </Collapsible>
        <Collapsible v-bind="args">
          <CollapsibleTrigger>Section B</CollapsibleTrigger>
          <CollapsibleContent>Content B</CollapsibleContent>
        </Collapsible>
        <Collapsible v-bind="args">
          <CollapsibleTrigger>Section C</CollapsibleTrigger>
          <CollapsibleContent>Content C</CollapsibleContent>
        </Collapsible>
      </CollapsibleGroup>
    `,
  }),
}

export const CustomStyles: Story = {
  name: 'Custom styles via classNames',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@auronui/vue'
</script>

<template>
  <Collapsible
    :default-open="true"
    :class-names="{ base: 'border-2 border-blue-500 rounded-lg bg-blue-50' }"
  >
    <CollapsibleTrigger>Show more details</CollapsibleTrigger>
    <CollapsibleContent>This collapsible has a custom blue border and light blue background styling applied via classNames.</CollapsibleContent>
  </Collapsible>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
    setup: () => ({
      args: {
        ...args,
        classNames: {
          base: 'border-2 border-blue-500 rounded-lg bg-blue-50',
        },
      },
    }),
    template: `
      <Collapsible v-bind="args" :default-open="true">
        <CollapsibleTrigger>Show more details</CollapsibleTrigger>
        <CollapsibleContent>This collapsible has a custom blue border and light blue background styling applied via classNames.</CollapsibleContent>
      </Collapsible>
    `,
  }),
}

export const GroupArrayAPI: Story = {
  name: 'Group: Array API (items prop)',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { CollapsibleGroup } from '@auronui/vue'
</script>

<template>
  <CollapsibleGroup
    :single-open="true"
    :items="[
      { title: 'Getting Started', content: 'Install with pnpm add @auronui/vue', defaultOpen: true },
      { title: 'Configuration', content: 'Import and register components globally or locally.' },
      { title: 'Theming', content: 'Override CSS custom properties to match your brand.' },
      { title: 'Advanced Usage', content: 'Use the classNames prop for per-slot style overrides.', disabled: true },
    ]"
  />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { CollapsibleGroup },
    setup() { return { args } },
    template: `
      <CollapsibleGroup v-bind="args" :single-open="true" :items="[
        { title: 'Getting Started', content: 'Install with pnpm add @auronui/vue', defaultOpen: true },
        { title: 'Configuration', content: 'Import and register components globally or locally.' },
        { title: 'Theming', content: 'Override CSS custom properties to match your brand.' },
        { title: 'Advanced Usage', content: 'Use the classNames prop for per-slot style overrides.', disabled: true },
      ]" />
    `,
  }),
}
