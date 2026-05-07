import type { Meta, StoryObj } from '@storybook/vue3-vite'
import {
  Button,
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalClose,
} from '@auronui/vue'

const meta: Meta = {
  title: 'Components/Modal',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj

const components = {
  Button,
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalClose,
}

export const Default: Story = {
  render: (args) => ({
    components,
    setup: () => ({ args }),
    template: `
      <Modal v-bind="args">
        <ModalTrigger as-child>
          <Button>Open Modal</Button>
        </ModalTrigger>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Modal Title</ModalTitle>
            <ModalDescription>This is a description for the modal dialog.</ModalDescription>
          </ModalHeader>
          <ModalBody>
            <p style="margin: 0; font-size: 14px; color: #555;">
              Modal content goes here. Press Escape or click outside to close.
            </p>
          </ModalBody>
          <ModalFooter>
            <ModalClose as-child>
              <Button variant="flat">Close</Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    `,
  }),
}

export const SizeSm: Story = {
  name: 'Size: sm',
  render: (args) => ({
    components,
    setup: () => ({ args }),
    template: `
      <Modal v-bind="args" size="sm">
        <ModalTrigger as-child>
          <Button>Open Small Modal</Button>
        </ModalTrigger>
        <ModalContent>
          <ModalHeader><ModalTitle>Small Modal</ModalTitle></ModalHeader>
          <ModalBody><p>This is a small modal.</p></ModalBody>
          <ModalFooter>
            <ModalClose as-child>
              <Button variant="flat">Close</Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    `,
  }),
}

export const SizeLg: Story = {
  name: 'Size: lg',
  render: (args) => ({
    components,
    setup: () => ({ args }),
    template: `
      <Modal v-bind="args" size="lg">
        <ModalTrigger as-child>
          <Button>Open Large Modal</Button>
        </ModalTrigger>
        <ModalContent>
          <ModalHeader><ModalTitle>Large Modal</ModalTitle></ModalHeader>
          <ModalBody><p>This is a large modal with more space for content.</p></ModalBody>
          <ModalFooter>
            <ModalClose as-child>
              <Button variant="flat">Close</Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    `,
  }),
}

export const SizeFull: Story = {
  name: 'Size: full',
  render: (args) => ({
    components,
    setup: () => ({ args }),
    template: `
      <Modal v-bind="args" size="full">
        <ModalTrigger as-child>
          <Button>Open Full Modal</Button>
        </ModalTrigger>
        <ModalContent>
          <ModalHeader><ModalTitle>Full Screen Modal</ModalTitle></ModalHeader>
          <ModalBody><p>This modal takes up the full screen.</p></ModalBody>
          <ModalFooter>
            <ModalClose as-child>
              <Button variant="flat">Close</Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    `,
  }),
}

export const PlacementTop: Story = {
  name: 'Placement: top',
  render: (args) => ({
    components,
    setup: () => ({ args }),
    template: `
      <Modal v-bind="args" placement="top">
        <ModalTrigger as-child>
          <Button>Open Top Modal</Button>
        </ModalTrigger>
        <ModalContent>
          <ModalHeader><ModalTitle>Top Placement</ModalTitle></ModalHeader>
          <ModalBody><p>This modal aligns to the top.</p></ModalBody>
          <ModalFooter>
            <ModalClose as-child>
              <Button variant="flat">Close</Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    `,
  }),
}

export const PlacementBottom: Story = {
  name: 'Placement: bottom',
  render: (args) => ({
    components,
    setup: () => ({ args }),
    template: `
      <Modal v-bind="args" placement="bottom">
        <ModalTrigger as-child>
          <Button>Open Bottom Modal</Button>
        </ModalTrigger>
        <ModalContent>
          <ModalHeader><ModalTitle>Bottom Placement</ModalTitle></ModalHeader>
          <ModalBody><p>This modal aligns to the bottom.</p></ModalBody>
          <ModalFooter>
            <ModalClose as-child>
              <Button variant="flat">Close</Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    `,
  }),
}

export const WithScrollableContent: Story = {
  name: 'Scrollable Content (scroll inside)',
  render: (args) => ({
    components,
    setup: () => ({ args }),
    template: `
      <Modal v-bind="args" scroll="inside" size="md">
        <ModalTrigger as-child>
          <Button>Open Scrollable Modal</Button>
        </ModalTrigger>
        <ModalContent>
          <ModalHeader><ModalTitle>Scrollable Content</ModalTitle></ModalHeader>
          <ModalBody>
            <p v-for="i in 20" :key="i" style="margin: 0 0 12px; font-size: 14px; color: #555;">
              Paragraph {{ i }}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </ModalBody>
          <ModalFooter>
            <ModalClose as-child>
              <Button variant="flat">Close</Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    `,
  }),
}

export const BlurBackdrop: Story = {
  name: 'Variant: Blur Backdrop',
  render: (args) => ({
    components,
    setup: () => ({ args }),
    template: `
      <Modal v-bind="args" variant="blur">
        <ModalTrigger as-child>
          <Button>Open with Blur Backdrop</Button>
        </ModalTrigger>
        <ModalContent>
          <ModalHeader><ModalTitle>Blur Backdrop</ModalTitle></ModalHeader>
          <ModalBody><p>The backdrop has a blur effect behind the dialog.</p></ModalBody>
          <ModalFooter>
            <ModalClose as-child>
              <Button variant="flat">Close</Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    `,
  }),
}
