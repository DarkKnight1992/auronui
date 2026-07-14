import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from "@auronui/react";

const meta: Meta = {
  title: "Components/Tooltip",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="bordered">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>
          <div style={{ padding: "6px 10px", fontSize: 13, background: "#222", color: "#fff", borderRadius: 4 }}>
            Tooltip content
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const WithDelay: Story = {
  name: "With Delay (1200ms)",
  render: () => (
    <TooltipProvider delayDuration={1200}>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="bordered">Hover (slow)</Button>
        </TooltipTrigger>
        <TooltipContent>
          <div style={{ padding: "6px 10px", fontSize: 13, background: "#222", color: "#fff", borderRadius: 4 }}>
            Appears after 1200ms delay
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const FourSides: Story = {
  name: "Four Sides",
  render: () => (
    <TooltipProvider delayDuration={300}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "center" }}>
        {(["top", "right", "bottom", "left"] as const).map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger>
              <Button variant="bordered" style={{ textTransform: "capitalize" }}>
                {side}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={side}>
              <div style={{ padding: "6px 10px", fontSize: 13, background: "#222", color: "#fff", borderRadius: 4 }}>
                Appears on {side}
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
};

export const WithArrow: Story = {
  name: "With Arrow",
  render: () => (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="bordered">Hover for arrow</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={8}>
          <div style={{ padding: "6px 10px", fontSize: 13, background: "#222", color: "#fff", borderRadius: 4 }}>
            Tooltip with directional arrow
          </div>
          <TooltipArrow />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
