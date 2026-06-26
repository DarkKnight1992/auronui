import type { Meta, StoryObj } from '@storybook/vue3-vite'
import {
  Button,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from '@auronui/vue'

const meta: Meta = {
  title: 'Components/Tooltip',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state (uncontrolled).',
      table: { category: 'Tooltip', defaultValue: { summary: 'false' } },
    },
    open: {
      control: 'boolean',
      description: 'Controlled open state.',
      table: { category: 'Tooltip', defaultValue: { summary: 'undefined' } },
    },
    delayDuration: {
      control: 'number',
      description: 'Delay in ms before the tooltip opens.',
      table: { category: 'Tooltip', defaultValue: { summary: 'undefined' } },
    },
    disableHoverableContent: {
      control: 'boolean',
      description: 'Prevent the tooltip from staying open when hovering over its content.',
      table: { category: 'Tooltip', defaultValue: { summary: 'false' } },
    },
    disableClosingTrigger: {
      control: 'boolean',
      description: 'Prevent the trigger from closing the tooltip when clicked.',
      table: { category: 'Tooltip', defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the tooltip entirely.',
      table: { category: 'Tooltip', defaultValue: { summary: 'false' } },
    },
    ignoreNonKeyboardFocus: {
      control: 'boolean',
      description: 'Only show tooltip when focused via keyboard.',
      table: { category: 'Tooltip', defaultValue: { summary: 'false' } },
    },
    contentEscapeKeyDown: {
      control: false,
      description: 'Event fired when the Escape key is pressed while the tooltip is open.',
      table: { category: 'TooltipContent' },
    },
    contentPointerDownOutside: {
      control: false,
      description: 'Event fired when a pointer-down occurs outside the tooltip content.',
      table: { category: 'TooltipContent' },
    },
    providerDisableClosingTrigger: {
      control: 'boolean',
      description: 'Provider-level: prevent trigger from closing tooltip on click.',
      table: { category: 'TooltipProvider', defaultValue: { summary: 'false' } },
    },
    providerDisabled: {
      control: 'boolean',
      description: 'Provider-level: disable all tooltips.',
      table: { category: 'TooltipProvider', defaultValue: { summary: 'false' } },
    },
    providerIgnoreNonKeyboardFocus: {
      control: 'boolean',
      description: 'Provider-level: only show tooltips when focused via keyboard.',
      table: { category: 'TooltipProvider', defaultValue: { summary: 'false' } },
    },
    providerContent: {
      control: 'text',
      description: 'Provider-level: default content for all tooltips.',
      table: { category: 'TooltipProvider', defaultValue: { summary: 'undefined' } },
    },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  args: {
    defaultOpen: false,
    disableHoverableContent: false,
    disableClosingTrigger: false,
    disabled: false,
    ignoreNonKeyboardFocus: false,
    providerDisableClosingTrigger: false,
    providerDisabled: false,
    providerIgnoreNonKeyboardFocus: false,
  },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Button, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@auronui/vue'
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <div style="padding: 6px 10px; font-size: 13px; background: #222; color: #fff; border-radius: 4px;">
          Tooltip content
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>`,
        type: 'code',
        language: 'vue',
      }
    }
  },

  render: (args) => ({
    components: { Button, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent },
    setup: () => ({ args }),
    template: `
      <TooltipProvider
        :disable-closing-trigger="args.providerDisableClosingTrigger"
        :disabled="args.providerDisabled"
        :ignore-non-keyboard-focus="args.providerIgnoreNonKeyboardFocus"
        :content="args.providerContent"
      >
        <Tooltip
          :default-open="args.defaultOpen"
          :open="args.open"
          :delay-duration="args.delayDuration"
          :disable-hoverable-content="args.disableHoverableContent"
          :disable-closing-trigger="args.disableClosingTrigger"
          :disabled="args.disabled"
          :ignore-non-keyboard-focus="args.ignoreNonKeyboardFocus"
          @update:open="args['onUpdate:open']"
        >
          <TooltipTrigger as-child>
            <Button variant="outline">Hover me</Button>
          </TooltipTrigger>
          <TooltipContent
            @escape-key-down="args.contentEscapeKeyDown"
            @pointer-down-outside="args.contentPointerDownOutside"
          >
            <div style="padding: 6px 10px; font-size: 13px; background: #222; color: #fff; border-radius: 4px;">
              Tooltip content
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    `,
  }),
}

export const WithDelay: Story = {
  name: 'With Delay (1200ms)',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Button, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@auronui/vue'
</script>

<template>
  <TooltipProvider :delay-duration="1200">
    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="outline">Hover (slow)</Button>
      </TooltipTrigger>
      <TooltipContent>
        <div style="padding: 6px 10px; font-size: 13px; background: #222; color: #fff; border-radius: 4px;">
          Appears after 1200ms delay
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Button, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent },
    setup: () => ({ args }),
    template: `
      <TooltipProvider :delay-duration="1200">
        <Tooltip v-bind="args">
          <TooltipTrigger as-child>
            <Button variant="outline">Hover (slow)</Button>
          </TooltipTrigger>
          <TooltipContent>
            <div style="padding: 6px 10px; font-size: 13px; background: #222; color: #fff; border-radius: 4px;">
              Appears after 1200ms delay
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    `,
  }),
}

export const FourSides: Story = {
  name: 'Four Sides',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Button, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@auronui/vue'
</script>

<template>
  <TooltipProvider :delay-duration="300">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: center;">
      <Tooltip v-for="side in ['top', 'right', 'bottom', 'left']" :key="side">
        <TooltipTrigger as-child>
          <Button variant="outline" style="text-transform: capitalize;">{{ side }}</Button>
        </TooltipTrigger>
        <TooltipContent :side="side">
          <div style="padding: 6px 10px; font-size: 13px; background: #222; color: #fff; border-radius: 4px;">
            Appears on {{ side }}
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Button, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent },
    setup: () => ({ args }),
    template: `
      <TooltipProvider :delay-duration="300">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: center;">
          <Tooltip v-bind="args" v-for="side in ['top', 'right', 'bottom', 'left']" :key="side">
            <TooltipTrigger as-child>
              <Button variant="outline" style="text-transform: capitalize;">{{ side }}</Button>
            </TooltipTrigger>
            <TooltipContent :side="side">
              <div style="padding: 6px 10px; font-size: 13px; background: #222; color: #fff; border-radius: 4px;">
                Appears on {{ side }}
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    `,
  }),
}

export const WithArrow: Story = {
  name: 'With Arrow',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Button, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, TooltipArrow } from '@auronui/vue'
</script>

<template>
  <TooltipProvider :delay-duration="300">
    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="outline">Hover for arrow</Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" :side-offset="8">
        <div style="padding: 6px 10px; font-size: 13px; background: #222; color: #fff; border-radius: 4px;">
          Tooltip with directional arrow
        </div>
        <TooltipArrow style="fill: #222;" />
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Button, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, TooltipArrow },
    setup: () => ({ args }),
    template: `
      <TooltipProvider :delay-duration="300">
        <Tooltip v-bind="args">
          <TooltipTrigger as-child>
            <Button variant="outline">Hover for arrow</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" :side-offset="8">
            <div style="padding: 6px 10px; font-size: 13px; background: #222; color: #fff; border-radius: 4px;">
              Tooltip with directional arrow
            </div>
            <TooltipArrow style="fill: #222;" />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    `,
  }),
}

export const WithCustomContent: Story = {
  name: 'With Custom Content',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Button, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@auronui/vue'
</script>

<template>
  <TooltipProvider :delay-duration="300">
    <Tooltip>
      <TooltipTrigger as-child>
        <Button color="primary">Rich Tooltip</Button>
      </TooltipTrigger>
      <TooltipContent :side-offset="8">
        <div style="padding: 10px 14px; max-width: 220px; background: #1e1b4b; color: #e0e7ff; border-radius: 8px; font-size: 13px;">
          <strong style="display: block; margin-bottom: 4px; color: #a5b4fc;">Pro tip</strong>
          <span>You can add rich content including icons, links, and formatted text inside a tooltip.</span>
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Button, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent },
    setup: () => ({ args }),
    template: `
      <TooltipProvider :delay-duration="300">
        <Tooltip v-bind="args">
          <TooltipTrigger as-child>
            <Button color="primary">Rich Tooltip</Button>
          </TooltipTrigger>
          <TooltipContent :side-offset="8">
            <div style="padding: 10px 14px; max-width: 220px; background: #1e1b4b; color: #e0e7ff; border-radius: 8px; font-size: 13px;">
              <strong style="display: block; margin-bottom: 4px; color: #a5b4fc;">Pro tip</strong>
              <span>You can add rich content including icons, links, and formatted text inside a tooltip.</span>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    `,
  }),
}
