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
}

export default meta
type Story = StoryObj

export const Default: Story = {
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
        Tooltip content
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
      <TooltipProvider>
        <Tooltip v-bind="args">
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
    `,
  }),
}

export const WithDelay: Story = {
  name: 'With Delay (1200ms)',
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
