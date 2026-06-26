import type { Meta, StoryObj } from '@storybook/vue3-vite'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerMain,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
  DrawerTitle,
  Button,
  CloseButton,
  Input,
  Textarea,
} from '@auronui/vue'

const meta: Meta = {
  title: 'Components/Drawer',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    triggerAs: {
      control: 'text',
      description: 'Render the trigger as a different HTML element.',
      table: { category: 'DrawerTrigger', defaultValue: { summary: 'undefined' } },
    },
    triggerAsChild: {
      control: 'boolean',
      description: 'Merge trigger props onto its immediate child element.',
      table: { category: 'DrawerTrigger', defaultValue: { summary: 'false' } },
    },
    closeAs: {
      control: 'text',
      description: 'Render the close button as a different HTML element.',
      table: { category: 'DrawerClose', defaultValue: { summary: 'undefined' } },
    },
    contentAs: {
      control: 'text',
      description: 'Render the content panel as a different HTML element.',
      table: { category: 'DrawerContent', defaultValue: { summary: 'undefined' } },
    },
    contentAsChild: {
      control: 'boolean',
      description: 'Merge content props onto its immediate child element.',
      table: { category: 'DrawerContent', defaultValue: { summary: 'false' } },
    },
    contentForceMount: {
      control: 'boolean',
      description: 'Keep the content mounted in the DOM even when the drawer is closed.',
      table: { category: 'DrawerContent', defaultValue: { summary: 'false' } },
    },
    contentDisableOutsidePointerEvents: {
      control: 'boolean',
      description: 'Disable pointer events outside the content when open.',
      table: { category: 'DrawerContent', defaultValue: { summary: 'false' } },
    },
    contentTo: {
      control: 'text',
      description: 'Portal target selector or element for the drawer content.',
      table: { category: 'DrawerContent (Portal)', defaultValue: { summary: 'undefined' } },
    },
    contentDisabled: {
      control: 'boolean',
      description: 'Disable the portal, rendering content inline instead.',
      table: { category: 'DrawerContent (Portal)', defaultValue: { summary: 'false' } },
    },
    contentDefer: {
      control: 'boolean',
      description: 'Defer portal rendering until after the component is mounted.',
      table: { category: 'DrawerContent (Portal)', defaultValue: { summary: 'false' } },
    },
    overlayAs: {
      control: 'text',
      description: 'Render the overlay as a different HTML element.',
      table: { category: 'DrawerOverlay', defaultValue: { summary: 'undefined' } },
    },
    overlayAsChild: {
      control: 'boolean',
      description: 'Merge overlay props onto its immediate child element.',
      table: { category: 'DrawerOverlay', defaultValue: { summary: 'false' } },
    },
    overlayForceMount: {
      control: 'boolean',
      description: 'Keep the overlay mounted in the DOM even when the drawer is closed.',
      table: { category: 'DrawerOverlay', defaultValue: { summary: 'false' } },
    },
    titleAsChild: {
      control: 'boolean',
      description: 'Merge title props onto its immediate child element.',
      table: { category: 'DrawerTitle', defaultValue: { summary: 'false' } },
    },
  },
  args: {
    triggerAsChild: false,
    contentAsChild: false,
    contentForceMount: false,
    contentDisableOutsidePointerEvents: false,
    contentDisabled: false,
    contentDefer: false,
    overlayAsChild: false,
    overlayForceMount: false,
    titleAsChild: false,
  },
}

export default meta
type Story = StoryObj

const baseComponents = {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerMain,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
  DrawerTitle,
  Button,
  CloseButton,
}

const closeButton = `
  <DrawerClose as-child class="absolute top-3 right-3">
    <CloseButton aria-label="Close drawer" size="sm" />
  </DrawerClose>
`

export const Right: Story = {
  name: 'Placement: Right (default)',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerBody, DrawerClose, DrawerTitle, Button, CloseButton } from '@auronui/vue'
</script>

<template>
  <Drawer placement="right">
    <DrawerTrigger as-child>
      <Button variant="bordered">Open Right Drawer</Button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerClose as-child class="absolute top-3 right-3">
        <CloseButton aria-label="Close drawer" size="sm" />
      </DrawerClose>
      <DrawerHeader>
        <DrawerTitle>Right Drawer</DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <p style="margin: 0; font-size: 14px;">
          This drawer slides in from the right edge. Press Escape or click outside to close.
        </p>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: baseComponents,
    setup: () => ({ args }),
    template: `
      <Drawer v-bind="args" placement="right">
        <DrawerTrigger :as="args.triggerAs" :as-child="args.triggerAsChild || true">
          <Button variant="bordered">Open Right Drawer</Button>
        </DrawerTrigger>
        <DrawerContent
          :as="args.contentAs"
          :as-child="args.contentAsChild"
          :force-mount="args.contentForceMount"
          :disable-outside-pointer-events="args.contentDisableOutsidePointerEvents"
          :to="args.contentTo"
          :disabled="args.contentDisabled"
          :defer="args.contentDefer"
        >
          <DrawerClose :as="args.closeAs" as-child class="absolute top-3 right-3">
            <CloseButton aria-label="Close drawer" size="sm" />
          </DrawerClose>
          <DrawerHeader>
            <DrawerTitle :as-child="args.titleAsChild">Right Drawer</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <p style="margin: 0; font-size: 14px;">
              This drawer slides in from the right edge. Press Escape or click outside to close.
            </p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    `,
  }),
}

export const Left: Story = {
  name: 'Placement: Left',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerBody, DrawerClose, DrawerTitle, Button, CloseButton } from '@auronui/vue'
</script>

<template>
  <Drawer placement="left">
    <DrawerTrigger as-child>
      <Button variant="bordered">Open Left Drawer</Button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerClose as-child class="absolute top-3 right-3">
        <CloseButton aria-label="Close drawer" size="sm" />
      </DrawerClose>
      <DrawerHeader>
        <DrawerTitle>Left Drawer</DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <p style="margin: 0; font-size: 14px;">
          This drawer slides in from the left edge.
        </p>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: baseComponents,
    setup: () => ({ args }),
    template: `
      <Drawer v-bind="args" placement="left">
        <DrawerTrigger as-child>
          <Button variant="bordered">Open Left Drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
          ${closeButton}
          <DrawerHeader>
            <DrawerTitle>Left Drawer</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <p style="margin: 0; font-size: 14px;">
              This drawer slides in from the left edge.
            </p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    `,
  }),
}

export const Top: Story = {
  name: 'Placement: Top',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerBody, DrawerClose, DrawerTitle, Button, CloseButton } from '@auronui/vue'
</script>

<template>
  <Drawer placement="top">
    <DrawerTrigger as-child>
      <Button variant="bordered">Open Top Drawer</Button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerClose as-child class="absolute top-3 right-3">
        <CloseButton aria-label="Close drawer" size="sm" />
      </DrawerClose>
      <DrawerHeader>
        <DrawerTitle>Top Drawer</DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <p style="margin: 0; font-size: 14px;">
          This drawer slides in from the top edge.
        </p>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: baseComponents,
    setup: () => ({ args }),
    template: `
      <Drawer v-bind="args" placement="top">
        <DrawerTrigger as-child>
          <Button variant="bordered">Open Top Drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
          ${closeButton}
          <DrawerHeader>
            <DrawerTitle>Top Drawer</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <p style="margin: 0; font-size: 14px;">
              This drawer slides in from the top edge.
            </p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    `,
  }),
}

export const Bottom: Story = {
  name: 'Placement: Bottom',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerBody, DrawerClose, DrawerTitle, Button, CloseButton } from '@auronui/vue'
</script>

<template>
  <Drawer placement="bottom">
    <DrawerTrigger as-child>
      <Button variant="bordered">Open Bottom Drawer</Button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerClose as-child class="absolute top-3 right-3">
        <CloseButton aria-label="Close drawer" size="sm" />
      </DrawerClose>
      <DrawerHeader>
        <DrawerTitle>Bottom Drawer</DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <p style="margin: 0; font-size: 14px;">
          This drawer slides in from the bottom edge.
        </p>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: baseComponents,
    setup: () => ({ args }),
    template: `
      <Drawer v-bind="args" placement="bottom">
        <DrawerTrigger as-child>
          <Button variant="bordered">Open Bottom Drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
          ${closeButton}
          <DrawerHeader>
            <DrawerTitle>Bottom Drawer</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <p style="margin: 0; font-size: 14px;">
              This drawer slides in from the bottom edge.
            </p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    `,
  }),
}

export const WithScrollableBody: Story = {
  name: 'With Scrollable Body',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerBody, DrawerClose, DrawerTitle, Button, CloseButton } from '@auronui/vue'
</script>

<template>
  <Drawer placement="right">
    <DrawerTrigger as-child>
      <Button variant="bordered">Open Scrollable Drawer</Button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerClose as-child class="absolute top-3 right-3">
        <CloseButton aria-label="Close drawer" size="sm" />
      </DrawerClose>
      <DrawerHeader>
        <DrawerTitle>Scrollable Content</DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <p v-for="i in 20" :key="i" style="margin: 0 0 12px; font-size: 14px;">
          Item {{ i }}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: baseComponents,
    setup: () => ({ args }),
    template: `
      <Drawer v-bind="args" placement="right">
        <DrawerTrigger as-child>
          <Button variant="bordered">Open Scrollable Drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
          ${closeButton}
          <DrawerHeader>
            <DrawerTitle>Scrollable Content</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <p v-for="i in 20" :key="i" style="margin: 0 0 12px; font-size: 14px;">
              Item {{ i }}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    `,
  }),
}

export const Dock: Story = {
  name: 'Dock (shifts content in DOM)',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Drawer, DrawerTrigger, DrawerMain, DrawerContent, DrawerHeader, DrawerBody, DrawerClose, DrawerTitle, Button, CloseButton } from '@auronui/vue'
const open = ref(false)
</script>

<template>
  <!--
    Drawer with dock=true renders a flex container.
    DrawerMain holds the page content; DrawerContent slides in as a flex sibling.
    No overlay — both areas remain in the normal document flow.
  -->
  <Drawer dock placement="right" v-model:open="open" style="height: 400px;">
    <DrawerMain>
      <div style="padding: 24px;">
        <p>Main content — the drawer pushes this area when it opens.</p>
        <DrawerTrigger as-child>
          <Button variant="bordered" style="margin-top: 16px;">
            {{ open ? 'Close Sidebar' : 'Open Sidebar' }}
          </Button>
        </DrawerTrigger>
      </div>
    </DrawerMain>
    <DrawerContent>
      <DrawerClose as-child class="absolute top-3 right-3">
        <CloseButton aria-label="Close drawer" size="sm" />
      </DrawerClose>
      <DrawerHeader>
        <DrawerTitle>Sidebar</DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <p style="margin: 0; font-size: 14px;">
          This panel lives in the DOM alongside the main content.
          It does not use a portal or overlay.
        </p>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: baseComponents,
    setup() {
      const { ref } = require('vue')
      const open = ref(false)
      return { args, open }
    },
    template: `
      <Drawer dock placement="right" v-model:open="open" style="height: 400px; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        <DrawerMain>
          <div style="padding: 24px; height: 100%; box-sizing: border-box;">
            <p style="margin: 0 0 8px; font-size: 14px;">Main content — the drawer shifts this area when it opens.</p>
            <DrawerTrigger as-child>
              <Button variant="bordered">{{ open ? 'Close Sidebar' : 'Open Sidebar' }}</Button>
            </DrawerTrigger>
          </div>
        </DrawerMain>
        <DrawerContent>
          ${closeButton}
          <DrawerHeader>
            <DrawerTitle>Sidebar</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <p style="margin: 0; font-size: 14px;">
              This panel is in the DOM flow — no portal, no overlay.
            </p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    `,
  }),
}

export const DockFullPage: Story = {
  name: 'Dock — Full Page',
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Drawer, DrawerTrigger, DrawerMain, DrawerContent, DrawerHeader, DrawerBody, DrawerClose, DrawerTitle, Button, CloseButton } from '@auronui/vue'
const open = ref(false)
</script>

<template>
  <Drawer dock placement="right" v-model:open="open" style="height: 100vh;">
    <DrawerMain>
      <!-- Topbar -->
      <header style="display: flex; align-items: center; gap: 12px; padding: 0 24px; height: 56px; border-bottom: 1px solid #e5e7eb;">
        <DrawerTrigger as-child>
          <Button variant="light" size="sm">☰ Menu</Button>
        </DrawerTrigger>
        <span style="font-weight: 600;">My App</span>
      </header>
      <!-- Page content -->
      <main style="padding: 24px;">
        <p>Main page content. The sidebar slides in alongside this without covering it.</p>
      </main>
    </DrawerMain>
    <DrawerContent>
      <DrawerClose as-child class="absolute top-3 right-3">
        <CloseButton aria-label="Close sidebar" size="sm" />
      </DrawerClose>
      <DrawerHeader>
        <DrawerTitle>Navigation</DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <nav style="display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
          <a href="#" style="padding: 8px 0;">Dashboard</a>
          <a href="#" style="padding: 8px 0;">Settings</a>
          <a href="#" style="padding: 8px 0;">Profile</a>
        </nav>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: baseComponents,
    setup() {
      const { ref } = require('vue')
      const open = ref(false)
      return { args, open }
    },
    template: `
      <Drawer dock placement="right" v-model:open="open" style="height: 100vh;">
        <DrawerMain>
          <header style="display: flex; align-items: center; gap: 12px; padding: 0 24px; height: 56px; border-bottom: 1px solid #e5e7eb; flex-shrink: 0;">
            <DrawerTrigger as-child>
              <Button variant="light" size="sm">☰ Menu</Button>
            </DrawerTrigger>
            <span style="font-weight: 600; font-size: 16px;">My App</span>
          </header>
          <main style="padding: 24px; overflow: auto; flex: 1;">
            <h2 style="margin: 0 0 12px; font-size: 18px; font-weight: 600;">Dashboard</h2>
            <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280;">
              The sidebar slides in as a flex sibling — this content area narrows
              instead of being covered by an overlay.
            </p>
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
              Click ☰ Menu to toggle the sidebar.
            </p>
          </main>
        </DrawerMain>
        <DrawerContent>
          ${closeButton}
          <DrawerHeader>
            <DrawerTitle>Navigation</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <nav style="display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
              <a href="#" style="padding: 8px 0; text-decoration: none; color: inherit;">Dashboard</a>
              <a href="#" style="padding: 8px 0; text-decoration: none; color: inherit;">Settings</a>
              <a href="#" style="padding: 8px 0; text-decoration: none; color: inherit;">Profile</a>
              <a href="#" style="padding: 8px 0; text-decoration: none; color: inherit;">Help</a>
            </nav>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    `,
  }),
}

export const Inline: Story = {
  name: 'Inline (scoped to container)',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerBody, DrawerClose, DrawerTitle, Button, CloseButton } from '@auronui/vue'
const open = ref(false)
</script>

<template>
  <!--
    The container must have position:relative and overflow:hidden.
    The drawer renders position:absolute within it instead of fixed to the viewport.
  -->
  <div style="position: relative; overflow: hidden; height: 400px; border: 1px solid #e5e7eb; border-radius: 12px;">
    <Drawer inline v-model:open="open" placement="right">
      <div style="padding: 24px;">
        <p>Main content lives here and remains interactive while the drawer is open.</p>
        <DrawerTrigger as-child>
          <Button variant="bordered" style="margin-top: 16px;">Open Inline Drawer</Button>
        </DrawerTrigger>
      </div>
      <DrawerContent>
        <DrawerClose as-child class="absolute top-3 right-3">
          <CloseButton aria-label="Close drawer" size="sm" />
        </DrawerClose>
        <DrawerHeader>
          <DrawerTitle>Inline Drawer</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <p style="margin: 0; font-size: 14px;">
            This drawer is scoped to the container. It does not cover the whole page.
          </p>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  </div>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: baseComponents,
    setup() {
      const { ref } = require('vue')
      const open = ref(false)
      return { args, open }
    },
    template: `
      <div style="position: relative; overflow: hidden; height: 400px; width: 600px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <Drawer inline v-model:open="open" placement="right">
          <div style="padding: 24px;">
            <p style="margin: 0 0 8px; font-size: 14px;">Main content — stays interactive while the drawer is open.</p>
            <DrawerTrigger as-child>
              <Button variant="bordered">Open Inline Drawer</Button>
            </DrawerTrigger>
          </div>
          <DrawerContent>
            ${closeButton}
            <DrawerHeader>
              <DrawerTitle>Inline Drawer</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>
              <p style="margin: 0; font-size: 14px;">
                Scoped to the container above — no viewport overlay.
              </p>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </div>
    `,
  }),
}

export const HideBackdrop: Story = {
  name: 'Hide Backdrop (no overlay, close via icon only)',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerBody, DrawerClose, DrawerTitle, Button, CloseButton } from '@auronui/vue'
</script>

<template>
  <!--
    No backdrop is rendered. Clicking outside the panel does not close the drawer.
    The user must click the close icon to dismiss it.
  -->
  <Drawer hide-backdrop placement="right">
    <DrawerTrigger as-child>
      <Button variant="bordered">Open Drawer</Button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerClose as-child class="absolute top-3 right-3">
        <CloseButton aria-label="Close drawer" size="sm" />
      </DrawerClose>
      <DrawerHeader>
        <DrawerTitle>No Backdrop</DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <p style="margin: 0; font-size: 14px;">
          The rest of the page is visible and interactive. Close using the × icon above.
        </p>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: baseComponents,
    setup: () => ({ args }),
    template: `
      <Drawer v-bind="args" hide-backdrop placement="right">
        <DrawerTrigger as-child>
          <Button variant="bordered">Open (No Backdrop)</Button>
        </DrawerTrigger>
        <DrawerContent>
          ${closeButton}
          <DrawerHeader>
            <DrawerTitle>No Backdrop</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <p style="margin: 0; font-size: 14px;">
              No overlay is shown. The page stays visible and interactive behind the drawer.
              Click the × icon to close — clicking outside does nothing.
            </p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    `,
  }),
}

export const WithForm: Story = {
  name: 'With Form',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, DrawerClose, DrawerTitle, Button, CloseButton, Input, Textarea } from '@auronui/vue'
</script>

<template>
  <Drawer placement="right">
    <DrawerTrigger as-child>
      <Button variant="bordered">Open Form Drawer</Button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerClose as-child class="absolute top-3 right-3">
        <CloseButton aria-label="Close drawer" size="sm" />
      </DrawerClose>
      <DrawerHeader>
        <DrawerTitle>Edit Profile</DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <Input label="Name" placeholder="Enter your name" />
          <Input label="Email" type="email" placeholder="Enter your email" />
          <Textarea label="Bio" placeholder="Tell us about yourself" />
        </div>
      </DrawerBody>
      <DrawerFooter>
        <DrawerClose as-child>
          <Button variant="light">Cancel</Button>
        </DrawerClose>
        <DrawerClose as-child>
          <Button color="primary">Save</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ...baseComponents, Input, Textarea },
    setup: () => ({ args }),
    template: `
      <Drawer v-bind="args" placement="right">
        <DrawerTrigger as-child>
          <Button variant="bordered">Open Form Drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
          ${closeButton}
          <DrawerHeader>
            <DrawerTitle>Edit Profile</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <Input label="Name" placeholder="Enter your name" />
              <Input label="Email" type="email" placeholder="Enter your email" />
              <Textarea label="Bio" placeholder="Tell us about yourself" />
            </div>
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose as-child>
              <Button variant="light">Cancel</Button>
            </DrawerClose>
            <DrawerClose as-child>
              <Button color="primary">Save</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    `,
  }),
}
