import type { Meta, StoryObj } from '@storybook/vue3-vite'
import {
  Button,
  CloseButton,
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
  argTypes: {
    triggerAs: {
      control: 'text',
      description: 'Render the trigger as a different HTML element.',
      table: { category: 'ModalTrigger', defaultValue: { summary: 'undefined' } },
    },
    closeAs: {
      control: 'text',
      description: 'Render the close button as a different HTML element.',
      table: { category: 'ModalClose', defaultValue: { summary: 'undefined' } },
    },
    contentAs: {
      control: 'text',
      description: 'Render the content panel as a different HTML element.',
      table: { category: 'ModalContent', defaultValue: { summary: 'undefined' } },
    },
    contentAsChild: {
      control: 'boolean',
      description: 'Merge content props onto its immediate child element.',
      table: { category: 'ModalContent', defaultValue: { summary: 'false' } },
    },
    contentForceMount: {
      control: 'boolean',
      description: 'Keep the content mounted in the DOM even when the modal is closed.',
      table: { category: 'ModalContent', defaultValue: { summary: 'false' } },
    },
    contentDisableOutsidePointerEvents: {
      control: 'boolean',
      description: 'Disable pointer events outside the content when open.',
      table: { category: 'ModalContent', defaultValue: { summary: 'false' } },
    },
    contentTo: {
      control: 'text',
      description: 'Portal target selector or element for the modal content.',
      table: { category: 'ModalContent (Portal)', defaultValue: { summary: 'undefined' } },
    },
    contentDisabled: {
      control: 'boolean',
      description: 'Disable the portal, rendering content inline instead.',
      table: { category: 'ModalContent (Portal)', defaultValue: { summary: 'false' } },
    },
    contentDefer: {
      control: 'boolean',
      description: 'Defer portal rendering until after the component is mounted.',
      table: { category: 'ModalContent (Portal)', defaultValue: { summary: 'false' } },
    },
    overlayAs: {
      control: 'text',
      description: 'Render the overlay as a different HTML element.',
      table: { category: 'ModalOverlay', defaultValue: { summary: 'undefined' } },
    },
    overlayAsChild: {
      control: 'boolean',
      description: 'Merge overlay props onto its immediate child element.',
      table: { category: 'ModalOverlay', defaultValue: { summary: 'false' } },
    },
    overlayForceMount: {
      control: 'boolean',
      description: 'Keep the overlay mounted in the DOM even when the modal is closed.',
      table: { category: 'ModalOverlay', defaultValue: { summary: 'false' } },
    },
    titleAsChild: {
      control: 'boolean',
      description: 'Merge title props onto its immediate child element.',
      table: { category: 'ModalTitle', defaultValue: { summary: 'false' } },
    },
    descriptionAsChild: {
      control: 'boolean',
      description: 'Merge description props onto its immediate child element.',
      table: { category: 'ModalDescription', defaultValue: { summary: 'false' } },
    },
  },
  args: {
    contentAsChild: false,
    contentForceMount: false,
    contentDisableOutsidePointerEvents: false,
    contentDisabled: false,
    contentDefer: false,
    overlayAsChild: false,
    overlayForceMount: false,
    titleAsChild: false,
    descriptionAsChild: false,
  },
}

export default meta
type Story = StoryObj

const components = {
  Button,
  CloseButton,
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
        <ModalTrigger :as="args.triggerAs" as-child>
          <Button>Open Modal</Button>
        </ModalTrigger>
        <ModalContent
          :as="args.contentAs"
          :as-child="args.contentAsChild"
          :force-mount="args.contentForceMount"
          :disable-outside-pointer-events="args.contentDisableOutsidePointerEvents"
          :to="args.contentTo"
          :disabled="args.contentDisabled"
          :defer="args.contentDefer"
        >
          <ModalClose as-child class="modal__close-trigger">
            <CloseButton aria-label="Close modal" />
          </ModalClose>
          <ModalHeader>
            <ModalTitle :as-child="args.titleAsChild">Modal Title</ModalTitle>
            <ModalDescription :as-child="args.descriptionAsChild">This is a description for the modal dialog.</ModalDescription>
          </ModalHeader>
          <ModalBody>
            <p style="margin: 0; font-size: 14px; color: #555;">
              Modal content goes here. Press Escape or click outside to close.
            </p>
          </ModalBody>
          <ModalFooter>
            <ModalClose :as="args.closeAs" as-child>
              <Button variant="flat">Close</Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalClose,
  Button,
  CloseButton,
} from '@auronui/vue'
</script>

<template>
  <Modal>
    <ModalTrigger as-child>
      <Button>Open Modal</Button>
    </ModalTrigger>
    <ModalContent>
      <ModalClose as-child class="modal__close-trigger">
        <CloseButton aria-label="Close modal" />
      </ModalClose>
      <ModalHeader>
        <ModalTitle>Modal Title</ModalTitle>
        <ModalDescription>This is a description for the modal dialog.</ModalDescription>
      </ModalHeader>
      <ModalBody>
        <p>Modal content goes here. Press Escape or click outside to close.</p>
      </ModalBody>
      <ModalFooter>
        <ModalClose as-child>
          <Button variant="flat">Close</Button>
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  </Modal>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
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
          <ModalClose as-child class="modal__close-trigger">
            <CloseButton aria-label="Close modal" />
          </ModalClose>
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalClose,
  Button,
  CloseButton,
} from '@auronui/vue'
</script>

<template>
  <Modal size="sm">
    <ModalTrigger as-child>
      <Button>Open Small Modal</Button>
    </ModalTrigger>
    <ModalContent>
      <ModalClose as-child class="modal__close-trigger">
        <CloseButton aria-label="Close modal" />
      </ModalClose>
      <ModalHeader><ModalTitle>Small Modal</ModalTitle></ModalHeader>
      <ModalBody><p>This is a small modal.</p></ModalBody>
      <ModalFooter>
        <ModalClose as-child>
          <Button variant="flat">Close</Button>
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  </Modal>
</template>`,
        language: 'vue',
      },
    },
  },
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
          <ModalClose as-child class="modal__close-trigger">
            <CloseButton aria-label="Close modal" />
          </ModalClose>
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalClose,
  Button,
  CloseButton,
} from '@auronui/vue'
</script>

<template>
  <Modal size="lg">
    <ModalTrigger as-child>
      <Button>Open Large Modal</Button>
    </ModalTrigger>
    <ModalContent>
      <ModalClose as-child class="modal__close-trigger">
        <CloseButton aria-label="Close modal" />
      </ModalClose>
      <ModalHeader><ModalTitle>Large Modal</ModalTitle></ModalHeader>
      <ModalBody><p>This is a large modal with more space for content.</p></ModalBody>
      <ModalFooter>
        <ModalClose as-child>
          <Button variant="flat">Close</Button>
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  </Modal>
</template>`,
        language: 'vue',
      },
    },
  },
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
          <ModalClose as-child class="modal__close-trigger">
            <CloseButton aria-label="Close modal" />
          </ModalClose>
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalClose,
  Button,
  CloseButton,
} from '@auronui/vue'
</script>

<template>
  <Modal size="full">
    <ModalTrigger as-child>
      <Button>Open Full Modal</Button>
    </ModalTrigger>
    <ModalContent>
      <ModalClose as-child class="modal__close-trigger">
        <CloseButton aria-label="Close modal" />
      </ModalClose>
      <ModalHeader><ModalTitle>Full Screen Modal</ModalTitle></ModalHeader>
      <ModalBody><p>This modal takes up the full screen.</p></ModalBody>
      <ModalFooter>
        <ModalClose as-child>
          <Button variant="flat">Close</Button>
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  </Modal>
</template>`,
        language: 'vue',
      },
    },
  },
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
          <ModalClose as-child class="modal__close-trigger">
            <CloseButton aria-label="Close modal" />
          </ModalClose>
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalClose,
  Button,
  CloseButton,
} from '@auronui/vue'
</script>

<template>
  <Modal placement="top">
    <ModalTrigger as-child>
      <Button>Open Top Modal</Button>
    </ModalTrigger>
    <ModalContent>
      <ModalClose as-child class="modal__close-trigger">
        <CloseButton aria-label="Close modal" />
      </ModalClose>
      <ModalHeader><ModalTitle>Top Placement</ModalTitle></ModalHeader>
      <ModalBody><p>This modal aligns to the top.</p></ModalBody>
      <ModalFooter>
        <ModalClose as-child>
          <Button variant="flat">Close</Button>
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  </Modal>
</template>`,
        language: 'vue',
      },
    },
  },
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
          <ModalClose as-child class="modal__close-trigger">
            <CloseButton aria-label="Close modal" />
          </ModalClose>
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalClose,
  Button,
  CloseButton,
} from '@auronui/vue'
</script>

<template>
  <Modal placement="bottom">
    <ModalTrigger as-child>
      <Button>Open Bottom Modal</Button>
    </ModalTrigger>
    <ModalContent>
      <ModalClose as-child class="modal__close-trigger">
        <CloseButton aria-label="Close modal" />
      </ModalClose>
      <ModalHeader><ModalTitle>Bottom Placement</ModalTitle></ModalHeader>
      <ModalBody><p>This modal aligns to the bottom.</p></ModalBody>
      <ModalFooter>
        <ModalClose as-child>
          <Button variant="flat">Close</Button>
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  </Modal>
</template>`,
        language: 'vue',
      },
    },
  },
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
          <ModalClose as-child class="modal__close-trigger">
            <CloseButton aria-label="Close modal" />
          </ModalClose>
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalClose,
  Button,
  CloseButton,
} from '@auronui/vue'
</script>

<template>
  <Modal scroll="inside" size="md">
    <ModalTrigger as-child>
      <Button>Open Scrollable Modal</Button>
    </ModalTrigger>
    <ModalContent>
      <ModalClose as-child class="modal__close-trigger">
        <CloseButton aria-label="Close modal" />
      </ModalClose>
      <ModalHeader><ModalTitle>Scrollable Content</ModalTitle></ModalHeader>
      <ModalBody>
        <p v-for="i in 20" :key="i">
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
</template>`,
        language: 'vue',
      },
    },
  },
}

export const NestedModals: Story = {
  name: 'Nested Modals (stacking)',
  render: (args) => ({
    components,
    setup: () => ({ args }),
    template: `
      <Modal v-bind="args">
        <ModalTrigger as-child>
          <Button>Open First Modal</Button>
        </ModalTrigger>
        <ModalContent>
          <ModalClose as-child class="modal__close-trigger">
            <CloseButton aria-label="Close modal" />
          </ModalClose>
          <ModalHeader>
            <ModalTitle>First Modal</ModalTitle>
            <ModalDescription>This is the first modal. Open a second one on top.</ModalDescription>
          </ModalHeader>
          <ModalBody>
            <Modal>
              <ModalTrigger as-child>
                <Button color="primary" variant="solid">Open Second Modal</Button>
              </ModalTrigger>
              <ModalContent>
                <ModalClose as-child class="modal__close-trigger">
                  <CloseButton aria-label="Close modal" />
                </ModalClose>
                <ModalHeader>
                  <ModalTitle>Second Modal</ModalTitle>
                  <ModalDescription>The second modal's backdrop should cover the first modal completely.</ModalDescription>
                </ModalHeader>
                <ModalBody>
                  <p style="margin: 0; font-size: 14px; color: #555;">
                    If the backdrop covers the first modal, stacking is working correctly.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <ModalClose as-child>
                    <Button variant="default">Close Second</Button>
                  </ModalClose>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </ModalBody>
          <ModalFooter>
            <ModalClose as-child>
              <Button variant="default">Close First</Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalClose,
  Button,
  CloseButton,
} from '@auronui/vue'
</script>

<template>
  <Modal>
    <ModalTrigger as-child>
      <Button>Open First Modal</Button>
    </ModalTrigger>
    <ModalContent>
      <ModalClose as-child class="modal__close-trigger">
        <CloseButton aria-label="Close modal" />
      </ModalClose>
      <ModalHeader>
        <ModalTitle>First Modal</ModalTitle>
        <ModalDescription>This is the first modal. Open a second one on top.</ModalDescription>
      </ModalHeader>
      <ModalBody>
        <Modal>
          <ModalTrigger as-child>
            <Button color="primary" variant="solid">Open Second Modal</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalClose as-child class="modal__close-trigger">
              <CloseButton aria-label="Close modal" />
            </ModalClose>
            <ModalHeader>
              <ModalTitle>Second Modal</ModalTitle>
              <ModalDescription>The second modal's backdrop should cover the first modal completely.</ModalDescription>
            </ModalHeader>
            <ModalBody>
              <p>If the backdrop covers the first modal, stacking is working correctly.</p>
            </ModalBody>
            <ModalFooter>
              <ModalClose as-child>
                <Button variant="default">Close Second</Button>
              </ModalClose>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </ModalBody>
      <ModalFooter>
        <ModalClose as-child>
          <Button variant="default">Close First</Button>
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  </Modal>
</template>`,
        language: 'vue',
      },
    },
  },
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
          <ModalClose as-child class="modal__close-trigger">
            <CloseButton aria-label="Close modal" />
          </ModalClose>
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalClose,
  Button,
  CloseButton,
} from '@auronui/vue'
</script>

<template>
  <Modal variant="blur">
    <ModalTrigger as-child>
      <Button>Open with Blur Backdrop</Button>
    </ModalTrigger>
    <ModalContent>
      <ModalClose as-child class="modal__close-trigger">
        <CloseButton aria-label="Close modal" />
      </ModalClose>
      <ModalHeader><ModalTitle>Blur Backdrop</ModalTitle></ModalHeader>
      <ModalBody><p>The backdrop has a blur effect behind the dialog.</p></ModalBody>
      <ModalFooter>
        <ModalClose as-child>
          <Button variant="flat">Close</Button>
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  </Modal>
</template>`,
        language: 'vue',
      },
    },
  },
}
