import type { Meta, StoryObj } from "@storybook/react-vite";
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
} from "@auronui/react";

const meta: Meta = {
  title: "Components/Drawer",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

export const Right: Story = {
  name: "Placement: Right (default)",
  render: () => (
    <Drawer placement="right">
      <DrawerTrigger>
        <Button variant="bordered">Open Right Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerClose>
          <CloseButton aria-label="Close drawer" size="sm" className="absolute top-3 right-3" />
        </DrawerClose>
        <DrawerHeader>
          <DrawerTitle>Right Drawer</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <p style={{ margin: 0, fontSize: 14 }}>
            This drawer slides in from the right edge. Press Escape or click outside to close.
          </p>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
};

export const Left: Story = {
  name: "Placement: Left",
  render: () => (
    <Drawer placement="left">
      <DrawerTrigger>
        <Button variant="bordered">Open Left Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerClose>
          <CloseButton aria-label="Close drawer" size="sm" className="absolute top-3 right-3" />
        </DrawerClose>
        <DrawerHeader>
          <DrawerTitle>Left Drawer</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <p style={{ margin: 0, fontSize: 14 }}>This drawer slides in from the left edge.</p>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
};

export const Bottom: Story = {
  name: "Placement: Bottom",
  render: () => (
    <Drawer placement="bottom">
      <DrawerTrigger>
        <Button variant="bordered">Open Bottom Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerClose>
          <CloseButton aria-label="Close drawer" size="sm" className="absolute top-3 right-3" />
        </DrawerClose>
        <DrawerHeader>
          <DrawerTitle>Bottom Drawer</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <p style={{ margin: 0, fontSize: 14 }}>This drawer slides in from the bottom edge.</p>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
};

export const HideBackdrop: Story = {
  name: "Hide Backdrop (no overlay, close via icon only)",
  render: () => (
    <Drawer hideBackdrop placement="right">
      <DrawerTrigger>
        <Button variant="bordered">Open (No Backdrop)</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerClose>
          <CloseButton aria-label="Close drawer" size="sm" className="absolute top-3 right-3" />
        </DrawerClose>
        <DrawerHeader>
          <DrawerTitle>No Backdrop</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <p style={{ margin: 0, fontSize: 14 }}>
            No overlay is shown. The page stays visible and interactive behind the drawer. Click
            the × icon to close — clicking outside does nothing.
          </p>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
};

export const WithForm: Story = {
  name: "With Form",
  render: () => (
    <Drawer placement="right">
      <DrawerTrigger>
        <Button variant="bordered">Open Form Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerClose>
          <CloseButton aria-label="Close drawer" size="sm" className="absolute top-3 right-3" />
        </DrawerClose>
        <DrawerHeader>
          <DrawerTitle>Edit Profile</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Name" placeholder="Enter your name" />
            <Input label="Email" type="email" placeholder="Enter your email" />
            <Textarea label="Bio" placeholder="Tell us about yourself" />
          </div>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose>
            <Button variant="ghost">Cancel</Button>
          </DrawerClose>
          <DrawerClose>
            <Button color="primary">Save</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};
