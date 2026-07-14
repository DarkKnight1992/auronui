import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollArea } from "@auronui/react";

const meta: Meta<typeof ScrollArea> = {
  title: "Components/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  argTypes: {
    type: { control: "select", options: ["auto", "always", "scroll", "hover"] },
    scrollHideDelay: { control: "number" },
    dir: { control: "select", options: ["ltr", "rtl"] },
    orientation: { control: "select", options: ["vertical", "horizontal", "both"] },
    scrollbarForceMount: { control: "boolean" },
  },
  args: {
    type: "hover",
    scrollHideDelay: 600,
    orientation: "vertical",
    scrollbarForceMount: false,
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 32, width: 300, height: 300 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

export const Default: Story = {
  render: (args) => (
    <ScrollArea {...args} style={{ height: 200, width: 250, border: "1px solid #e2e8f0", borderRadius: 8 }}>
      {Array.from({ length: 30 }, (_, i) => (
        <div key={i} style={{ padding: "4px 16px", fontSize: 13, fontFamily: "sans-serif", color: "#475569" }}>
          Item {i + 1}
        </div>
      ))}
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  args: { orientation: "horizontal" },
  render: (args) => (
    <ScrollArea {...args} style={{ height: 80, width: 250, border: "1px solid #e2e8f0", borderRadius: 8 }}>
      <div style={{ display: "flex", gap: 8, padding: 8, width: "max-content" }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            style={{
              width: 80,
              height: 50,
              background: "#f1f5f9",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontFamily: "sans-serif",
              color: "#475569",
              flexShrink: 0,
            }}
          >
            Card {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Both: Story = {
  args: { orientation: "both" },
  render: (args) => (
    <ScrollArea {...args} style={{ height: 200, width: 250, border: "1px solid #e2e8f0", borderRadius: 8 }}>
      <div style={{ width: 600 }}>
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            style={{ padding: "4px 16px", fontSize: 13, fontFamily: "sans-serif", color: "#475569", whiteSpace: "nowrap" }}
          >
            Long scrollable item number {i + 1} with extra content to force horizontal scrolling
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const AlwaysVisible: Story = {
  args: { type: "always" },
  render: (args) => (
    <ScrollArea {...args} style={{ height: 200, width: 250, border: "1px solid #e2e8f0", borderRadius: 8 }}>
      {Array.from({ length: 30 }, (_, i) => (
        <div key={i} style={{ padding: "4px 16px", fontSize: 13, fontFamily: "sans-serif", color: "#475569" }}>
          Item {i + 1}
        </div>
      ))}
    </ScrollArea>
  ),
};
