import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Link } from '@auronui/vue'

const meta: Meta<typeof Link> = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  argTypes: {
    isExternal: { control: 'boolean' },
    disabled: { control: 'boolean' },
    classNames: { control: 'object', description: 'Per-slot class overrides. Keys match the component anatomy slot names.' },
  },
}

export default meta
type Story = StoryObj<typeof Link>

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Link } from '@auronui/vue'
</script>

<template>
  <Link href="https://auron.dev">Visit Auron</Link>
</template>`,
        type: 'code',
        language: 'vue',
      }
    }
  },
  args: { href: 'https://auron.dev' },
  render: (args) => ({
    components: { Link },
    setup() { return { args } },
    template: '<Link v-bind="args">Visit Auron</Link>',
  }),
}

export const ExternalLink: Story = {
  render: (args) => ({
    components: { Link },
    setup() { return { args } },
    template: `
      <Link v-bind="args" href="https://github.com/auron-inc/auron" :isExternal="true">
        View on GitHub
      </Link>
    `,
  }),
}

export const AllColorVariants: Story = {
  render: (args) => ({
    components: { Link },
    setup() { return { args } },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:16px">
        <Link v-bind="args" href="#" color="default">Default</Link>
        <Link v-bind="args" href="#" color="primary">Primary</Link>
        <Link v-bind="args" href="#" color="success">Success</Link>
        <Link v-bind="args" href="#" color="warning">Warning</Link>
        <Link v-bind="args" href="#" color="danger">Danger</Link>
        <Link v-bind="args" href="#" color="foreground">Foreground</Link>
      </div>
    `,
  }),
}

export const UnderlineVariants: Story = {
  render: (args) => ({
    components: { Link },
    setup() { return { args } },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:16px">
        <Link v-bind="args" href="#" class="link--underline-none">No underline</Link>
        <Link v-bind="args" href="#" class="link--underline-hover">Underline on hover</Link>
        <Link v-bind="args" href="#" class="link--underline-always">Always underline</Link>
        <Link v-bind="args" href="#" class="link--underline-active">Underline when active</Link>
        <Link v-bind="args" href="#" class="link--underline-focus">Underline when focused</Link>
      </div>
    `,
  }),
}

export const PolymorphicAs: Story = {
  render: (args) => ({
    components: { Link },
    setup() { return { args } },
    template: `
      <div style="display:flex;gap:16px">
        <Link v-bind="args" href="https://example.com">Native anchor</Link>
        <Link v-bind="args" as="button" type="button">As button element</Link>
      </div>
    `,
  }),
}

export const DisabledLink: Story = {
  render: (args) => ({
    components: { Link },
    setup() { return { args } },
    template: '<Link v-bind="args" href="https://example.com" :disabled="true">Disabled link</Link>',
  }),
}

export const CustomStyles: Story = {
  name: 'Custom styles via classNames',
  render: (args) => ({
    components: { Link },
    setup() { return { args } },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px">
        <Link
          v-bind="args"
          href="https://example.com"
          :class-names="{ base: 'border-b-2 border-blue-500 text-blue-600 font-semibold hover:text-blue-700' }"
        >
          Custom blue border and text
        </Link>
        <Link
          v-bind="args"
          href="https://example.com"
          :is-external="true"
          :class-names="{ base: 'px-3 py-1 rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200', icon: 'text-amber-700' }"
        >
          With custom icon color
        </Link>
        <Link
          v-bind="args"
          href="https://example.com"
          :class-names="{ base: 'underline decoration-2 decoration-emerald-500 hover:decoration-emerald-600' }"
        >
          Custom underline decoration
        </Link>
      </div>
    `,
  }),
}
