import type { Meta, StoryObj } from '@storybook/vue3'
import { Breadcrumbs, BreadcrumbItem } from '@auronui/vue'

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Components/Breadcrumbs',
  tags: ['autodocs'],
  component: Breadcrumbs,
  argTypes: {
    classNames: {
      control: 'object',
      description: 'Per-slot class overrides. Keys match the component anatomy slot names.',
    },
  },
}
export default meta
type Story = StoryObj<typeof Breadcrumbs>

export const Default: Story = {
  render: (args) => ({
    components: { Breadcrumbs, BreadcrumbItem },
    setup: () => ({ args }),
    template: `
      <Breadcrumbs v-bind="args">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/products">Products</BreadcrumbItem>
        <BreadcrumbItem href="/products/shoes">Shoes</BreadcrumbItem>
        <BreadcrumbItem>Sneakers</BreadcrumbItem>
      </Breadcrumbs>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Breadcrumbs, BreadcrumbItem } from '@auronui/vue'
</script>

<template>
  <Breadcrumbs>
    <BreadcrumbItem href="/">Home</BreadcrumbItem>
    <BreadcrumbItem href="/products">Products</BreadcrumbItem>
    <BreadcrumbItem href="/products/shoes">Shoes</BreadcrumbItem>
    <BreadcrumbItem>Sneakers</BreadcrumbItem>
  </Breadcrumbs>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
}

export const Truncated: Story = {
  render: (args) => ({
    components: { Breadcrumbs, BreadcrumbItem },
    setup: () => ({ args }),
    template: `
      <Breadcrumbs v-bind="args" :max-items="3">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/a">Category</BreadcrumbItem>
        <BreadcrumbItem href="/a/b">Subcategory</BreadcrumbItem>
        <BreadcrumbItem href="/a/b/c">Item</BreadcrumbItem>
        <BreadcrumbItem>Detail</BreadcrumbItem>
      </Breadcrumbs>
    `,
  }),
}

export const CustomSeparator: Story = {
  render: (args) => ({
    components: { Breadcrumbs, BreadcrumbItem },
    setup: () => ({ args }),
    template: `
      <Breadcrumbs v-bind="args">
        <template #separator>›</template>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
        <BreadcrumbItem>Guide</BreadcrumbItem>
      </Breadcrumbs>
    `,
  }),
}

export const CustomStyles: Story = {
  name: 'Custom styles via classNames',
  render: (args) => ({
    components: { Breadcrumbs, BreadcrumbItem },
    setup: () => ({ args }),
    template: `
      <Breadcrumbs v-bind="args" :class-names="{
        base: 'gap-4 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200',
        item: 'font-medium',
      }">
        <BreadcrumbItem href="/" :class-names="{ link: 'text-blue-600 hover:text-blue-800 font-semibold', separator: 'text-blue-400' }">Home</BreadcrumbItem>
        <BreadcrumbItem href="/products" :class-names="{ link: 'text-blue-600 hover:text-blue-800 font-semibold', separator: 'text-blue-400' }">Products</BreadcrumbItem>
        <BreadcrumbItem href="/products/shoes" :class-names="{ link: 'text-blue-600 hover:text-blue-800 font-semibold', separator: 'text-blue-400' }">Shoes</BreadcrumbItem>
        <BreadcrumbItem :class-names="{ link: 'text-indigo-700 font-bold' }">Sneakers</BreadcrumbItem>
      </Breadcrumbs>
    `,
  }),
}

export const ArrayAPI: Story = {
  name: 'Array API (items prop)',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Breadcrumbs } from '@auronui/vue'
</script>

<template>
  <!-- Basic -->
  <Breadcrumbs
    :items="[
      { label: 'Home', href: '/' },
      { label: 'Components', href: '/components' },
      { label: 'Breadcrumbs' },
    ]"
  />

  <!-- With max-items truncation -->
  <Breadcrumbs
    :max-items="3"
    :items="[
      { label: 'Home', href: '/' },
      { label: 'Docs', href: '/docs' },
      { label: 'Components', href: '/components' },
      { label: 'Navigation', href: '/components/navigation' },
      { label: 'Breadcrumbs' },
    ]"
  />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Breadcrumbs },
    setup() { return { args } },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px">
        <Breadcrumbs v-bind="args" :items="[
          { label: 'Home', href: '/' },
          { label: 'Components', href: '/components' },
          { label: 'Breadcrumbs' },
        ]" />
        <Breadcrumbs v-bind="args" :max-items="3" :items="[
          { label: 'Home', href: '/' },
          { label: 'Docs', href: '/docs' },
          { label: 'Components', href: '/components' },
          { label: 'Navigation', href: '/components/navigation' },
          { label: 'Breadcrumbs' },
        ]" />
      </div>
    `,
  }),
}
