import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSection,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from '@auronui/vue'

const meta: Meta = {
  title: 'Components/ContextMenu',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => ({
    components: { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem },
    template: `
      <ContextMenu>
        <ContextMenuTrigger as-child>
          <div style="display: flex; align-items: center; justify-content: center; width: 280px; height: 160px; border: 2px dashed var(--border, #d4d4d8); border-radius: 8px; font-size: 13px; color: #71717a;">
            Right-click here
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent aria-label="Actions">
          <ContextMenuItem>Cut</ContextMenuItem>
          <ContextMenuItem>Copy</ContextMenuItem>
          <ContextMenuItem>Paste</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@auronui/vue'
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger as-child>
      <div>Right-click here</div>
    </ContextMenuTrigger>
    <ContextMenuContent aria-label="Actions">
      <ContextMenuItem>Cut</ContextMenuItem>
      <ContextMenuItem>Copy</ContextMenuItem>
      <ContextMenuItem>Paste</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
}

export const WithSections: Story = {
  render: () => ({
    components: { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSection },
    template: `
      <ContextMenu>
        <ContextMenuTrigger as-child>
          <div style="display: flex; align-items: center; justify-content: center; width: 280px; height: 160px; border: 2px dashed var(--border, #d4d4d8); border-radius: 8px; font-size: 13px; color: #71717a;">
            Right-click here
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent aria-label="File actions">
          <ContextMenuSection title="File">
            <ContextMenuItem>New</ContextMenuItem>
            <ContextMenuItem>Open</ContextMenuItem>
          </ContextMenuSection>
          <ContextMenuSection title="Edit" show-divider>
            <ContextMenuItem>Rename</ContextMenuItem>
            <ContextMenuItem variant="danger">Delete</ContextMenuItem>
          </ContextMenuSection>
        </ContextMenuContent>
      </ContextMenu>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSection } from '@auronui/vue'
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger as-child>
      <div>Right-click here</div>
    </ContextMenuTrigger>
    <ContextMenuContent aria-label="File actions">
      <ContextMenuSection title="File">
        <ContextMenuItem>New</ContextMenuItem>
        <ContextMenuItem>Open</ContextMenuItem>
      </ContextMenuSection>
      <ContextMenuSection title="Edit" show-divider>
        <ContextMenuItem>Rename</ContextMenuItem>
        <ContextMenuItem variant="danger">Delete</ContextMenuItem>
      </ContextMenuSection>
    </ContextMenuContent>
  </ContextMenu>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const WithCheckboxAndRadio: Story = {
  render: () => ({
    components: {
      ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuSection,
      ContextMenuCheckboxItem, ContextMenuRadioGroup, ContextMenuRadioItem,
    },
    setup() {
      const showHidden = ref(false)
      const sortBy = ref('name')
      return { showHidden, sortBy }
    },
    template: `
      <ContextMenu>
        <ContextMenuTrigger as-child>
          <div style="display: flex; align-items: center; justify-content: center; width: 280px; height: 160px; border: 2px dashed var(--border, #d4d4d8); border-radius: 8px; font-size: 13px; color: #71717a;">
            Right-click here
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent aria-label="View options">
          <ContextMenuSection title="View">
            <ContextMenuCheckboxItem v-model:is-selected="showHidden">Show hidden files</ContextMenuCheckboxItem>
          </ContextMenuSection>
          <ContextMenuSection title="Sort by">
            <ContextMenuRadioGroup v-model="sortBy">
              <ContextMenuRadioItem value="name">Name</ContextMenuRadioItem>
              <ContextMenuRadioItem value="date">Date modified</ContextMenuRadioItem>
              <ContextMenuRadioItem value="size">Size</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuSection>
        </ContextMenuContent>
      </ContextMenu>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import {
  ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuSection,
  ContextMenuCheckboxItem, ContextMenuRadioGroup, ContextMenuRadioItem,
} from '@auronui/vue'

const showHidden = ref(false)
const sortBy = ref('name')
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger as-child>
      <div>Right-click here</div>
    </ContextMenuTrigger>
    <ContextMenuContent aria-label="View options">
      <ContextMenuSection title="View">
        <ContextMenuCheckboxItem v-model:is-selected="showHidden">Show hidden files</ContextMenuCheckboxItem>
      </ContextMenuSection>
      <ContextMenuSection title="Sort by">
        <ContextMenuRadioGroup v-model="sortBy">
          <ContextMenuRadioItem value="name">Name</ContextMenuRadioItem>
          <ContextMenuRadioItem value="date">Date modified</ContextMenuRadioItem>
          <ContextMenuRadioItem value="size">Size</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuSection>
    </ContextMenuContent>
  </ContextMenu>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const WithSubmenu: Story = {
  render: () => ({
    components: {
      ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem,
      ContextMenuSub, ContextMenuSubTrigger, ContextMenuSubContent,
    },
    template: `
      <ContextMenu>
        <ContextMenuTrigger as-child>
          <div style="display: flex; align-items: center; justify-content: center; width: 280px; height: 160px; border: 2px dashed var(--border, #d4d4d8); border-radius: 8px; font-size: 13px; color: #71717a;">
            Right-click here
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent aria-label="Share menu">
          <ContextMenuItem>Copy link</ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Share via</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Email</ContextMenuItem>
              <ContextMenuItem>Messages</ContextMenuItem>
              <ContextMenuItem>Slack</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem,
  ContextMenuSub, ContextMenuSubTrigger, ContextMenuSubContent,
} from '@auronui/vue'
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger as-child>
      <div>Right-click here</div>
    </ContextMenuTrigger>
    <ContextMenuContent aria-label="Share menu">
      <ContextMenuItem>Copy link</ContextMenuItem>
      <ContextMenuSub>
        <ContextMenuSubTrigger>Share via</ContextMenuSubTrigger>
        <ContextMenuSubContent>
          <ContextMenuItem>Email</ContextMenuItem>
          <ContextMenuItem>Messages</ContextMenuItem>
          <ContextMenuItem>Slack</ContextMenuItem>
        </ContextMenuSubContent>
      </ContextMenuSub>
    </ContextMenuContent>
  </ContextMenu>
</template>`,
        language: 'vue',
      },
    },
  },
}
