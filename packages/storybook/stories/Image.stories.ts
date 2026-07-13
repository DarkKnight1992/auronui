import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Image } from '@auronui/vue'

const meta: Meta<typeof Image> = {
  title: 'Data Display/Image',
  component: Image,
  tags: ['autodocs'],
  argTypes: {
    fit: {
      control: 'select',
      options: ['cover', 'contain', 'fill'],
    },
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
    },
    isLazy: { control: 'boolean' },
    isZoomable: { control: 'boolean' },
  },
  args: {
    src: 'https://picsum.photos/id/1015/400/300',
    alt: 'A scenic river valley',
    fit: 'cover',
    radius: 'md',
    isLazy: false,
    isZoomable: false,
  },
}

export default meta
type Story = StoryObj<typeof Image>

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Image } from '@auronui/vue'
</script>

<template>
  <Image src="https://picsum.photos/id/1015/400/300" alt="A scenic river valley" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Image },
    setup() {
      return { args }
    },
    template: '<div style="width: 320px;"><Image v-bind="args" style="width: 320px; height: 240px;" /></div>',
  }),
}

export const Zoomable: Story = {
  args: { isZoomable: true },
  render: (args) => ({
    components: { Image },
    setup() {
      return { args }
    },
    template: '<div style="width: 320px;"><Image v-bind="args" style="width: 320px; height: 240px;" /></div>',
  }),
  parameters: {
    docs: {
      description: {
        story: 'Click the image to open a zoomed lightbox view, built on the existing Modal component.',
      },
    },
  },
}

export const ErrorFallback: Story = {
  name: 'Error fallback',
  args: { src: 'https://this-domain-does-not-exist-auron.example/broken.jpg' },
  render: (args) => ({
    components: { Image },
    setup() {
      return { args }
    },
    template: '<div style="width: 320px;"><Image v-bind="args" style="width: 320px; height: 240px;" /></div>',
  }),
  parameters: {
    docs: {
      description: {
        story: 'When the src fails to load, a fallback icon is shown in place of the broken image.',
      },
    },
  },
}

export const Radii: Story = {
  render: () => ({
    components: { Image },
    template: `
      <div style="display:flex;gap:16px;">
        <Image src="https://picsum.photos/id/1025/200/200" alt="none" radius="none" :is-lazy="false" style="width: 100px; height: 100px;" />
        <Image src="https://picsum.photos/id/1025/200/200" alt="sm" radius="sm" :is-lazy="false" style="width: 100px; height: 100px;" />
        <Image src="https://picsum.photos/id/1025/200/200" alt="lg" radius="lg" :is-lazy="false" style="width: 100px; height: 100px;" />
        <Image src="https://picsum.photos/id/1025/200/200" alt="full" radius="full" :is-lazy="false" style="width: 100px; height: 100px;" />
      </div>
    `,
  }),
}

export const LazyLoading: Story = {
  name: 'Lazy loading (scroll to reveal)',
  args: { isLazy: true },
  render: (args) => ({
    components: { Image },
    setup() {
      return { args }
    },
    template: `
      <div style="height: 200px; overflow-y: auto; border: 1px solid #ddd;">
        <div style="height: 400px; display: flex; align-items: center; justify-content: center; color: #888;">
          Scroll down to reveal the image
        </div>
        <Image v-bind="args" style="width: 100%; height: 240px;" />
      </div>
    `,
  }),
}
