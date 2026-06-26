import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ScrollArea } from '@auronui/vue'

const meta: Meta<typeof ScrollArea> = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['auto', 'always', 'scroll', 'hover'],
      description: 'Describes the nature of scrollbar visibility.',
      table: { category: 'ScrollAreaRoot', defaultValue: { summary: 'hover' } },
    },
    scrollHideDelay: {
      control: 'number',
      description: 'Duration in ms before scrollbars hide (when type is scroll or hover).',
      table: { category: 'ScrollAreaRoot', defaultValue: { summary: '600' } },
    },
    dir: {
      control: { type: 'select' },
      options: ['ltr', 'rtl'],
      description: 'Text direction for the scroll area.',
      table: { category: 'ScrollAreaRoot', defaultValue: { summary: 'undefined' } },
    },
    as: {
      control: 'text',
      description: 'Render the root element as a different HTML element.',
      table: { category: 'ScrollAreaRoot', defaultValue: { summary: 'div' } },
    },
    asChild: {
      control: 'boolean',
      description: 'Merge root props onto the child element.',
      table: { category: 'ScrollAreaRoot', defaultValue: { summary: 'false' } },
    },
    orientation: {
      control: { type: 'select' },
      options: ['vertical', 'horizontal', 'both'],
      description: 'Which scrollbar orientations to render.',
      table: { category: 'ScrollAreaScrollbar', defaultValue: { summary: 'vertical' } },
    },
    scrollbarForceMount: {
      control: 'boolean',
      description: 'Keep scrollbar mounted in the DOM even when hidden.',
      table: { category: 'ScrollAreaScrollbar', defaultValue: { summary: 'false' } },
    },
    viewportNonce: {
      control: 'text',
      description: 'Nonce for the viewport inline style (CSP).',
      table: { category: 'ScrollAreaViewport', defaultValue: { summary: 'undefined' } },
    },
  },
  args: {
    type: 'hover',
    scrollHideDelay: 600,
    orientation: 'vertical',
    asChild: false,
    scrollbarForceMount: false,
  },
  decorators: [
    () => ({
      template: `<div style="padding: 32px; width: 300px; height: 300px;"><story /></div>`,
    }),
  ],
}

export default meta
type Story = StoryObj<typeof ScrollArea>

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ScrollArea } from '@auronui/vue'
</script>

<template>
  <ScrollArea style="height: 200px; width: 250px;">
    <div v-for="i in 30" :key="i" style="padding: 4px 8px; font-size: 13px;">
      Item {{ i }}
    </div>
  </ScrollArea>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ScrollArea },
    setup: () => ({ args }),
    template: `
      <ScrollArea
        v-bind="args"
        :dir="args.dir"
        :as="args.as"
        :as-child="args.asChild"
        :scrollbar-force-mount="args.scrollbarForceMount"
        :viewport-nonce="args.viewportNonce"
        style="height: 200px; width: 250px; border: 1px solid #e2e8f0; border-radius: 8px;"
      >
        <div v-for="i in 30" :key="i" style="padding: 4px 16px; font-size: 13px; font-family: sans-serif; color: #475569;">
          Item {{ i }}
        </div>
      </ScrollArea>
    `,
  }),
}

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ScrollArea } from '@auronui/vue'
</script>

<template>
  <ScrollArea orientation="horizontal" style="height: 80px; width: 250px;">
    <div style="display: flex; gap: 8px; padding: 8px; width: max-content;">
      <div v-for="i in 20" :key="i" style="width: 80px; height: 50px; background: #f1f5f9; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0;">
        Card {{ i }}
      </div>
    </div>
  </ScrollArea>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ScrollArea },
    setup: () => ({ args }),
    template: `
      <ScrollArea
        v-bind="args"
        style="height: 80px; width: 250px; border: 1px solid #e2e8f0; border-radius: 8px;"
      >
        <div style="display: flex; gap: 8px; padding: 8px; width: max-content;">
          <div
            v-for="i in 20"
            :key="i"
            style="width: 80px; height: 50px; background: #f1f5f9; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-family: sans-serif; color: #475569; flex-shrink: 0;"
          >
            Card {{ i }}
          </div>
        </div>
      </ScrollArea>
    `,
  }),
}

export const Both: Story = {
  args: { orientation: 'both' },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ScrollArea } from '@auronui/vue'
</script>

<template>
  <ScrollArea orientation="both" style="height: 200px; width: 250px;">
    <div style="width: 600px;">
      <div v-for="i in 30" :key="i" style="padding: 4px 8px; font-size: 13px; white-space: nowrap;">
        Long scrollable item number {{ i }} with extra content to force horizontal scrolling
      </div>
    </div>
  </ScrollArea>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ScrollArea },
    setup: () => ({ args }),
    template: `
      <ScrollArea
        v-bind="args"
        style="height: 200px; width: 250px; border: 1px solid #e2e8f0; border-radius: 8px;"
      >
        <div style="width: 600px;">
          <div
            v-for="i in 30"
            :key="i"
            style="padding: 4px 16px; font-size: 13px; font-family: sans-serif; color: #475569; white-space: nowrap;"
          >
            Long scrollable item number {{ i }} with extra content
          </div>
        </div>
      </ScrollArea>
    `,
  }),
}

export const AlwaysVisible: Story = {
  args: { type: 'always' },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ScrollArea } from '@auronui/vue'
</script>

<template>
  <ScrollArea type="always" style="height: 200px; width: 250px;">
    <div v-for="i in 30" :key="i" style="padding: 4px 8px; font-size: 13px;">
      Item {{ i }}
    </div>
  </ScrollArea>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ScrollArea },
    setup: () => ({ args }),
    template: `
      <ScrollArea
        v-bind="args"
        style="height: 200px; width: 250px; border: 1px solid #e2e8f0; border-radius: 8px;"
      >
        <div
          v-for="i in 30"
          :key="i"
          style="padding: 4px 16px; font-size: 13px; font-family: sans-serif; color: #475569;"
        >
          Item {{ i }}
        </div>
      </ScrollArea>
    `,
  }),
}
