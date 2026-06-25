import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent } from 'vue'
import {
  Button,
  CloseButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverClose,
} from '@auronui/vue'

const meta: Meta = {
  title: 'Components/Popover',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: (args) => ({
    components: { Button, Popover, PopoverTrigger, PopoverContent },
    setup: () => ({ args }),
    template: `
      <Popover v-bind="args">
        <PopoverTrigger as-child>
          <Button>Open Popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div style="padding: 16px; max-width: 280px;">
            <h3 style="margin: 0 0 8px; font-size: 14px; font-weight: 600;">Popover Title</h3>
            <p style="margin: 0; font-size: 13px; color: #555;">
              This is the popover content. Click outside or press Escape to close.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Popover, PopoverTrigger, PopoverContent, Button } from '@auronui/vue'
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button>Open Popover</Button>
    </PopoverTrigger>
    <PopoverContent>
      <div style="padding: 16px; max-width: 280px;">
        <h3 style="margin: 0 0 8px; font-size: 14px; font-weight: 600;">Popover Title</h3>
        <p style="margin: 0; font-size: 13px; color: #555;">
          This is the popover content. Click outside or press Escape to close.
        </p>
      </div>
    </PopoverContent>
  </Popover>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
}

export const SideTop: Story = {
  name: 'Side: Top',
  render: (args) => ({
    components: { Button, Popover, PopoverTrigger, PopoverContent },
    setup: () => ({ args }),
    template: `
      <Popover v-bind="args">
        <PopoverTrigger as-child>
          <Button>Open (Top)</Button>
        </PopoverTrigger>
        <PopoverContent side="top">
          <div style="padding: 12px 16px;">
            <p style="margin: 0; font-size: 13px;">Appears above the trigger.</p>
          </div>
        </PopoverContent>
      </Popover>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Popover, PopoverTrigger, PopoverContent, Button } from '@auronui/vue'
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button>Open (Top)</Button>
    </PopoverTrigger>
    <PopoverContent side="top">
      <div style="padding: 12px 16px;">
        <p style="margin: 0; font-size: 13px;">Appears above the trigger.</p>
      </div>
    </PopoverContent>
  </Popover>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const SideRight: Story = {
  name: 'Side: Right',
  render: (args) => ({
    components: { Button, Popover, PopoverTrigger, PopoverContent },
    setup: () => ({ args }),
    template: `
      <Popover v-bind="args">
        <PopoverTrigger as-child>
          <Button>Open (Right)</Button>
        </PopoverTrigger>
        <PopoverContent side="right">
          <div style="padding: 12px 16px;">
            <p style="margin: 0; font-size: 13px;">Appears to the right of the trigger.</p>
          </div>
        </PopoverContent>
      </Popover>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Popover, PopoverTrigger, PopoverContent, Button } from '@auronui/vue'
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button>Open (Right)</Button>
    </PopoverTrigger>
    <PopoverContent side="right">
      <div style="padding: 12px 16px;">
        <p style="margin: 0; font-size: 13px;">Appears to the right of the trigger.</p>
      </div>
    </PopoverContent>
  </Popover>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const SideLeft: Story = {
  name: 'Side: Left',
  render: (args) => ({
    components: { Button, Popover, PopoverTrigger, PopoverContent },
    setup: () => ({ args }),
    template: `
      <Popover v-bind="args">
        <PopoverTrigger as-child>
          <Button>Open (Left)</Button>
        </PopoverTrigger>
        <PopoverContent side="left">
          <div style="padding: 12px 16px;">
            <p style="margin: 0; font-size: 13px;">Appears to the left of the trigger.</p>
          </div>
        </PopoverContent>
      </Popover>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Popover, PopoverTrigger, PopoverContent, Button } from '@auronui/vue'
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button>Open (Left)</Button>
    </PopoverTrigger>
    <PopoverContent side="left">
      <div style="padding: 12px 16px;">
        <p style="margin: 0; font-size: 13px;">Appears to the left of the trigger.</p>
      </div>
    </PopoverContent>
  </Popover>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const WithArrow: Story = {
  render: (args) => ({
    components: { Button, Popover, PopoverTrigger, PopoverContent, PopoverArrow },
    setup: () => ({ args }),
    template: `
      <Popover v-bind="args">
        <PopoverTrigger as-child>
          <Button>Open with Arrow</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div style="padding: 12px 16px;">
            <p style="margin: 0; font-size: 13px;">This popover has a directional arrow.</p>
          </div>
          <PopoverArrow style="fill: white; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.15));" />
        </PopoverContent>
      </Popover>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Popover, PopoverTrigger, PopoverContent, PopoverArrow, Button } from '@auronui/vue'
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button>Open with Arrow</Button>
    </PopoverTrigger>
    <PopoverContent>
      <div style="padding: 12px 16px;">
        <p style="margin: 0; font-size: 13px;">This popover has a directional arrow.</p>
      </div>
      <PopoverArrow style="fill: white; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.15));" />
    </PopoverContent>
  </Popover>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const WithCloseButton: Story = {
  render: (args) => ({
    components: { Button, CloseButton, Popover, PopoverTrigger, PopoverContent, PopoverClose },
    setup: () => ({ args }),
    template: `
      <Popover v-bind="args">
        <PopoverTrigger as-child>
          <Button>Open with Close Button</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div style="padding: 16px; max-width: 280px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <h3 style="margin: 0; font-size: 14px; font-weight: 600;">Popover Title</h3>
              <PopoverClose as-child>
                <CloseButton size="sm" aria-label="Close popover" />
              </PopoverClose>
            </div>
            <p style="margin: 0; font-size: 13px; color: #555;">
              Click the × button or press Escape to close this popover.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Popover, PopoverTrigger, PopoverContent, PopoverClose, Button, CloseButton } from '@auronui/vue'
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button>Open with Close Button</Button>
    </PopoverTrigger>
    <PopoverContent>
      <div style="padding: 16px; max-width: 280px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h3 style="margin: 0; font-size: 14px; font-weight: 600;">Popover Title</h3>
          <PopoverClose as-child>
            <CloseButton size="sm" aria-label="Close popover" />
          </PopoverClose>
        </div>
        <p style="margin: 0; font-size: 13px; color: #555;">
          Click the × button or press Escape to close this popover.
        </p>
      </div>
    </PopoverContent>
  </Popover>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const Controlled: Story = {
  render: (args) => ({
    components: { Button, Popover, PopoverTrigger, PopoverContent },
    setup() {
      const { ref } = defineComponent({ setup: () => ({}) })
      return { args }
    },
    data() {
      return { isOpen: false }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; align-items: center;">
        <p style="margin: 0; font-size: 13px;">
          Controlled open state: <strong>{{ isOpen ? 'open' : 'closed' }}</strong>
        </p>
        <Popover v-bind="args" v-model:open="isOpen">
          <PopoverTrigger as-child>
            <Button>Toggle Popover</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div style="padding: 12px 16px;">
              <p style="margin: 0; font-size: 13px;">Controlled via v-model:open.</p>
            </div>
          </PopoverContent>
        </Popover>
        <Button variant="flat" @click="isOpen = !isOpen">Toggle from outside</Button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Popover, PopoverTrigger, PopoverContent, Button } from '@auronui/vue'

const isOpen = ref(false)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px; align-items: center;">
    <p style="margin: 0; font-size: 13px;">
      Controlled open state: <strong>{{ isOpen ? 'open' : 'closed' }}</strong>
    </p>
    <Popover v-model:open="isOpen">
      <PopoverTrigger as-child>
        <Button>Toggle Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div style="padding: 12px 16px;">
          <p style="margin: 0; font-size: 13px;">Controlled via v-model:open.</p>
        </div>
      </PopoverContent>
    </Popover>
    <Button variant="flat" @click="isOpen = !isOpen">Toggle from outside</Button>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}
