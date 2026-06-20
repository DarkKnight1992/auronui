import type { Meta, StoryObj } from '@storybook/vue3-vite'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
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
}

export default meta
type Story = StoryObj

const baseComponents = {
  Drawer,
  DrawerTrigger,
  DrawerContent,
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
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, DrawerClose, DrawerTitle, Button, CloseButton } from '@auronui/vue'
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
          <Button variant="bordered">Open Right Drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
          ${closeButton}
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
    `,
  }),
}

export const Left: Story = {
  name: 'Placement: Left',
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

export const WithForm: Story = {
  name: 'With Form',
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
