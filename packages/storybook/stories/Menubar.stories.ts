import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSection,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from '@auronui/vue'

const meta: Meta = {
  title: 'Components/Menubar',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => ({
    components: { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem },
    template: `
      <Menubar>
        <MenubarMenu value="file">
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent aria-label="File menu">
            <MenubarItem>New File</MenubarItem>
            <MenubarItem>Open...</MenubarItem>
            <MenubarItem>Save</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu value="edit">
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent aria-label="Edit menu">
            <MenubarItem>Cut</MenubarItem>
            <MenubarItem>Copy</MenubarItem>
            <MenubarItem>Paste</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu value="view">
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent aria-label="View menu">
            <MenubarItem>Zoom In</MenubarItem>
            <MenubarItem>Zoom Out</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from '@auronui/vue'
</script>

<template>
  <Menubar>
    <MenubarMenu value="file">
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent aria-label="File menu">
        <MenubarItem>New File</MenubarItem>
        <MenubarItem>Open...</MenubarItem>
        <MenubarItem>Save</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu value="edit">
      <MenubarTrigger>Edit</MenubarTrigger>
      <MenubarContent aria-label="Edit menu">
        <MenubarItem>Cut</MenubarItem>
        <MenubarItem>Copy</MenubarItem>
        <MenubarItem>Paste</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu value="view">
      <MenubarTrigger>View</MenubarTrigger>
      <MenubarContent aria-label="View menu">
        <MenubarItem>Zoom In</MenubarItem>
        <MenubarItem>Zoom Out</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
}

export const WithSections: Story = {
  render: () => ({
    components: { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSection },
    template: `
      <Menubar>
        <MenubarMenu value="file">
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent aria-label="File menu">
            <MenubarSection title="Recent">
              <MenubarItem>report.pdf</MenubarItem>
              <MenubarItem>notes.txt</MenubarItem>
            </MenubarSection>
            <MenubarSection title="Actions" show-divider>
              <MenubarItem>New</MenubarItem>
              <MenubarItem variant="danger">Delete</MenubarItem>
            </MenubarSection>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSection } from '@auronui/vue'
</script>

<template>
  <Menubar>
    <MenubarMenu value="file">
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent aria-label="File menu">
        <MenubarSection title="Recent">
          <MenubarItem>report.pdf</MenubarItem>
          <MenubarItem>notes.txt</MenubarItem>
        </MenubarSection>
        <MenubarSection title="Actions" show-divider>
          <MenubarItem>New</MenubarItem>
          <MenubarItem variant="danger">Delete</MenubarItem>
        </MenubarSection>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const WithCheckboxAndRadio: Story = {
  render: () => ({
    components: {
      Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarSection,
      MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem,
    },
    setup() {
      const showToolbar = ref(true)
      const zoom = ref('100')
      return { showToolbar, zoom }
    },
    template: `
      <Menubar>
        <MenubarMenu value="view">
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent aria-label="View menu">
            <MenubarSection title="Panels">
              <MenubarCheckboxItem v-model:is-selected="showToolbar">Show Toolbar</MenubarCheckboxItem>
            </MenubarSection>
            <MenubarSection title="Zoom">
              <MenubarRadioGroup v-model="zoom">
                <MenubarRadioItem value="100">100%</MenubarRadioItem>
                <MenubarRadioItem value="150">150%</MenubarRadioItem>
                <MenubarRadioItem value="200">200%</MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarSection>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import {
  Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarSection,
  MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem,
} from '@auronui/vue'

const showToolbar = ref(true)
const zoom = ref('100')
</script>

<template>
  <Menubar>
    <MenubarMenu value="view">
      <MenubarTrigger>View</MenubarTrigger>
      <MenubarContent aria-label="View menu">
        <MenubarSection title="Panels">
          <MenubarCheckboxItem v-model:is-selected="showToolbar">Show Toolbar</MenubarCheckboxItem>
        </MenubarSection>
        <MenubarSection title="Zoom">
          <MenubarRadioGroup v-model="zoom">
            <MenubarRadioItem value="100">100%</MenubarRadioItem>
            <MenubarRadioItem value="150">150%</MenubarRadioItem>
            <MenubarRadioItem value="200">200%</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarSection>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const WithSubmenu: Story = {
  render: () => ({
    components: {
      Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem,
      MenubarSub, MenubarSubTrigger, MenubarSubContent,
    },
    template: `
      <Menubar>
        <MenubarMenu value="file">
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent aria-label="File menu">
            <MenubarItem>New</MenubarItem>
            <MenubarSub>
              <MenubarSubTrigger>Open Recent</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>report.pdf</MenubarItem>
                <MenubarItem>notes.txt</MenubarItem>
                <MenubarItem>budget.xlsx</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem,
  MenubarSub, MenubarSubTrigger, MenubarSubContent,
} from '@auronui/vue'
</script>

<template>
  <Menubar>
    <MenubarMenu value="file">
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent aria-label="File menu">
        <MenubarItem>New</MenubarItem>
        <MenubarSub>
          <MenubarSubTrigger>Open Recent</MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarItem>report.pdf</MenubarItem>
            <MenubarItem>notes.txt</MenubarItem>
            <MenubarItem>budget.xlsx</MenubarItem>
          </MenubarSubContent>
        </MenubarSub>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
</template>`,
        language: 'vue',
      },
    },
  },
}
