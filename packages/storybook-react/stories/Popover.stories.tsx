import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  CloseButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverClose,
} from "@auronui/react";

const meta: Meta = {
  title: "Components/Popover",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger>
        <Button>Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Popover">
        <div style={{ padding: 16, maxWidth: 280 }}>
          <h3 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 600 }}>Popover Title</h3>
          <p style={{ margin: 0, fontSize: 13, color: "#555" }}>
            This is the popover content. Click outside or press Escape to close.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const SideTop: Story = {
  name: "Side: Top",
  render: () => (
    <Popover>
      <PopoverTrigger>
        <Button>Open (Top)</Button>
      </PopoverTrigger>
      <PopoverContent side="top" aria-label="Popover">
        <div style={{ padding: "12px 16px" }}>
          <p style={{ margin: 0, fontSize: 13 }}>Appears above the trigger.</p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithArrow: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger>
        <Button>Open with Arrow</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Popover">
        <div style={{ padding: "12px 16px" }}>
          <p style={{ margin: 0, fontSize: 13 }}>This popover has a directional arrow.</p>
        </div>
        <PopoverArrow />
      </PopoverContent>
    </Popover>
  ),
};

export const WithCloseButton: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger>
        <Button>Open with Close Button</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Popover">
        <div style={{ padding: 16, maxWidth: 280 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Popover Title</h3>
            <PopoverClose>
              <CloseButton size="sm" aria-label="Close popover" />
            </PopoverClose>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#555" }}>
            Click the × button or press Escape to close this popover.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const Controlled: Story = {
  render: () => {
    function ControlledPopover() {
      const [isOpen, setIsOpen] = useState(false);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <p style={{ margin: 0, fontSize: 13 }}>
            Controlled open state: <strong>{isOpen ? "open" : "closed"}</strong>
          </p>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger>
              <Button>Toggle Popover</Button>
            </PopoverTrigger>
            <PopoverContent aria-label="Popover">
              <div style={{ padding: "12px 16px" }}>
                <p style={{ margin: 0, fontSize: 13 }}>Controlled via the open prop.</p>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="ghost" onClick={() => setIsOpen((v) => !v)}>
            Toggle from outside
          </Button>
        </div>
      );
    }
    return <ControlledPopover />;
  },
};
