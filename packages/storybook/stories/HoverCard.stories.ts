import type { Meta, StoryObj } from '@storybook/vue3-vite'
import {
  Link,
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
} from '@auronui/vue'

const meta: Meta = {
  title: 'Components/HoverCard',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state (uncontrolled).',
      table: { category: 'HoverCard', defaultValue: { summary: 'false' } },
    },
    openDelay: {
      control: 'number',
      description: 'Milliseconds from mouse-enter on the trigger until the card opens.',
      table: { category: 'HoverCard', defaultValue: { summary: '700' } },
    },
    closeDelay: {
      control: 'number',
      description: 'Milliseconds from mouse-leave until the card closes.',
      table: { category: 'HoverCard', defaultValue: { summary: '300' } },
    },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  args: {
    defaultOpen: false,
    openDelay: 700,
    closeDelay: 300,
  },
  render: (args) => ({
    components: { Link, HoverCard, HoverCardTrigger, HoverCardContent },
    setup: () => ({ args }),
    template: `
      <HoverCard :default-open="args.defaultOpen" :open-delay="args.openDelay" :close-delay="args.closeDelay">
        <HoverCardTrigger as-child>
          <Link href="#">@auronui</Link>
        </HoverCardTrigger>
        <HoverCardContent>
          <div style="padding: 16px; max-width: 280px;">
            <h3 style="margin: 0 0 8px; font-size: 14px; font-weight: 600;">Auron UI</h3>
            <p style="margin: 0; font-size: 13px; color: #555;">
              Vue 3 component library with full HeroUI visual parity.
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Link, HoverCard, HoverCardTrigger, HoverCardContent } from '@auronui/vue'
</script>

<template>
  <HoverCard>
    <HoverCardTrigger as-child>
      <Link href="#">@auronui</Link>
    </HoverCardTrigger>
    <HoverCardContent>
      <div style="padding: 16px; max-width: 280px;">
        <h3 style="margin: 0 0 8px; font-size: 14px; font-weight: 600;">Auron UI</h3>
        <p style="margin: 0; font-size: 13px; color: #555;">
          Vue 3 component library with full HeroUI visual parity.
        </p>
      </div>
    </HoverCardContent>
  </HoverCard>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
}

export const WithArrow: Story = {
  render: (args) => ({
    components: { Link, HoverCard, HoverCardTrigger, HoverCardContent, HoverCardArrow },
    setup: () => ({ args }),
    template: `
      <HoverCard v-bind="args">
        <HoverCardTrigger as-child>
          <Link href="#">Hover for details</Link>
        </HoverCardTrigger>
        <HoverCardContent>
          <div style="padding: 12px 16px;">
            <p style="margin: 0; font-size: 13px;">This hover card has a directional arrow.</p>
          </div>
          <HoverCardArrow style="fill: white; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.15));" />
        </HoverCardContent>
      </HoverCard>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Link, HoverCard, HoverCardTrigger, HoverCardContent, HoverCardArrow } from '@auronui/vue'
</script>

<template>
  <HoverCard>
    <HoverCardTrigger as-child>
      <Link href="#">Hover for details</Link>
    </HoverCardTrigger>
    <HoverCardContent>
      <div style="padding: 12px 16px;">
        <p style="margin: 0; font-size: 13px;">This hover card has a directional arrow.</p>
      </div>
      <HoverCardArrow style="fill: white; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.15));" />
    </HoverCardContent>
  </HoverCard>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const FastDelays: Story = {
  name: 'Custom delays (fast)',
  args: {
    openDelay: 100,
    closeDelay: 100,
  },
  render: (args) => ({
    components: { Link, HoverCard, HoverCardTrigger, HoverCardContent },
    setup: () => ({ args }),
    template: `
      <HoverCard :open-delay="args.openDelay" :close-delay="args.closeDelay">
        <HoverCardTrigger as-child>
          <Link href="#">Quick hover</Link>
        </HoverCardTrigger>
        <HoverCardContent>
          <div style="padding: 12px 16px;">
            <p style="margin: 0; font-size: 13px;">Opens and closes after 100ms.</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Link, HoverCard, HoverCardTrigger, HoverCardContent } from '@auronui/vue'
</script>

<template>
  <HoverCard :open-delay="100" :close-delay="100">
    <HoverCardTrigger as-child>
      <Link href="#">Quick hover</Link>
    </HoverCardTrigger>
    <HoverCardContent>
      <div style="padding: 12px 16px;">
        <p style="margin: 0; font-size: 13px;">Opens and closes after 100ms.</p>
      </div>
    </HoverCardContent>
  </HoverCard>
</template>`,
        language: 'vue',
      },
    },
  },
}
