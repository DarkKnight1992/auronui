import type { Meta, StoryObj } from "@storybook/react-vite";
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
} from "@auronui/react";

const meta: Meta = {
  title: "Components/Modal",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Modal>
      <ModalTrigger>
        <Button>Open Modal</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalClose>
          <CloseButton aria-label="Close modal" className="modal__close-trigger" />
        </ModalClose>
        <ModalHeader>
          <ModalTitle>Modal Title</ModalTitle>
          <ModalDescription>This is a description for the modal dialog.</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <p style={{ margin: 0, fontSize: 14, color: "#555" }}>
            Modal content goes here. Press Escape or click outside to close.
          </p>
        </ModalBody>
        <ModalFooter>
          <ModalClose>
            <Button variant="default">Close</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const SizeSm: Story = {
  name: "Size: sm",
  render: () => (
    <Modal size="sm">
      <ModalTrigger>
        <Button>Open Small Modal</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalClose>
          <CloseButton aria-label="Close modal" className="modal__close-trigger" />
        </ModalClose>
        <ModalHeader>
          <ModalTitle>Small Modal</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p style={{ margin: 0, fontSize: 14, color: "#555" }}>This is a small modal.</p>
        </ModalBody>
        <ModalFooter>
          <ModalClose>
            <Button variant="default">Close</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const SizeLg: Story = {
  name: "Size: lg",
  render: () => (
    <Modal size="lg">
      <ModalTrigger>
        <Button>Open Large Modal</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalClose>
          <CloseButton aria-label="Close modal" className="modal__close-trigger" />
        </ModalClose>
        <ModalHeader>
          <ModalTitle>Large Modal</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p style={{ margin: 0, fontSize: 14, color: "#555" }}>
            This is a large modal with more space for content.
          </p>
        </ModalBody>
        <ModalFooter>
          <ModalClose>
            <Button variant="default">Close</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const WithScrollableContent: Story = {
  name: "Scrollable Content (scroll inside)",
  render: () => (
    <Modal scroll="inside" size="md">
      <ModalTrigger>
        <Button>Open Scrollable Modal</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalClose>
          <CloseButton aria-label="Close modal" className="modal__close-trigger" />
        </ModalClose>
        <ModalHeader>
          <ModalTitle>Scrollable Content</ModalTitle>
        </ModalHeader>
        <ModalBody>
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i} style={{ margin: "0 0 12px", fontSize: 14, color: "#555" }}>
              Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          ))}
        </ModalBody>
        <ModalFooter>
          <ModalClose>
            <Button variant="default">Close</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};

export const BlurBackdrop: Story = {
  name: "Variant: Blur Backdrop",
  render: () => (
    <Modal variant="blur">
      <ModalTrigger>
        <Button>Open with Blur Backdrop</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalClose>
          <CloseButton aria-label="Close modal" className="modal__close-trigger" />
        </ModalClose>
        <ModalHeader>
          <ModalTitle>Blur Backdrop</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p style={{ margin: 0, fontSize: 14, color: "#555" }}>
            The backdrop has a blur effect behind the dialog.
          </p>
        </ModalBody>
        <ModalFooter>
          <ModalClose>
            <Button variant="default">Close</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
};
