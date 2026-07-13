import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { Button, CommandPalette } from '@auronui/vue'
import type { CommandPaletteItemData } from '@auronui/vue'

const baseItems: CommandPaletteItemData[] = [
  { value: 'new-file', label: 'New File', group: 'File', shortcut: '⌘N' },
  { value: 'open-file', label: 'Open File', group: 'File', shortcut: '⌘O' },
  { value: 'save-file', label: 'Save File', group: 'File', shortcut: '⌘S' },
  { value: 'toggle-theme', label: 'Toggle Theme', group: 'View' },
  { value: 'toggle-sidebar', label: 'Toggle Sidebar', group: 'View', shortcut: '⌘B' },
  { value: 'go-home', label: 'Go to Home' },
  { value: 'go-settings', label: 'Go to Settings' },
]

const meta: Meta<typeof CommandPalette> = {
  title: 'Overlays/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    shortcut: { control: 'text' },
    emptyMessage: { control: 'text' },
  },
  args: {
    placeholder: 'Type a command or search…',
    shortcut: 'mod+k',
    emptyMessage: 'No results found.',
  },
}

export default meta
type Story = StoryObj<typeof CommandPalette>

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { CommandPalette } from '@auronui/vue'

const items = [
  { value: 'new-file', label: 'New File', group: 'File', shortcut: '⌘N' },
  { value: 'open-file', label: 'Open File', group: 'File' },
  { value: 'toggle-theme', label: 'Toggle Theme', group: 'View' },
  { value: 'go-home', label: 'Go to Home' },
]
</script>

<template>
  <!-- Opens globally via Cmd/Ctrl+K from anywhere on the page -->
  <CommandPalette :items="items" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { CommandPalette, Button },
    setup() {
      const isOpen = ref(false)
      return { args, baseItems, isOpen }
    },
    template: `
      <div>
        <p style="font-size: 13px; color: #666; margin-bottom: 12px;">
          Press <kbd>Cmd/Ctrl+K</kbd> anywhere on this page, or click the button below.
        </p>
        <Button @click="isOpen = true">Open Command Palette</Button>
        <CommandPalette v-bind="args" v-model:open="isOpen" :items="baseItems" @select="(item) => console.log('selected', item)" />
      </div>
    `,
  }),
}

export const AlwaysOpen: Story = {
  name: 'Open (for visual review)',
  render: (args) => ({
    components: { CommandPalette },
    setup() {
      const isOpen = ref(true)
      return { args, baseItems, isOpen }
    },
    template: '<CommandPalette v-bind="args" v-model:open="isOpen" :items="baseItems" />',
  }),
}

export const EmptyResults: Story = {
  name: 'Empty state (search for "zzz")',
  render: (args) => ({
    components: { CommandPalette },
    setup() {
      const isOpen = ref(true)
      return { args, baseItems, isOpen }
    },
    template: '<CommandPalette v-bind="args" v-model:open="isOpen" :items="baseItems" />',
  }),
}

export const CustomShortcut: Story = {
  name: 'Custom shortcut (Cmd/Ctrl+P)',
  args: { shortcut: 'mod+p' },
  render: (args) => ({
    components: { CommandPalette, Button },
    setup() {
      const isOpen = ref(false)
      return { args, baseItems, isOpen }
    },
    template: `
      <div>
        <p style="font-size: 13px; color: #666; margin-bottom: 12px;">
          Press <kbd>Cmd/Ctrl+P</kbd> to open (not the default Cmd/Ctrl+K).
        </p>
        <Button @click="isOpen = true">Open Command Palette</Button>
        <CommandPalette v-bind="args" v-model:open="isOpen" :items="baseItems" />
      </div>
    `,
  }),
}
