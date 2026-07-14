import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollShadow } from "@auronui/react";

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ".repeat(
    6,
  );

const meta: Meta<typeof ScrollShadow> = {
  title: "Components/ScrollShadow",
  component: ScrollShadow,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["vertical", "horizontal", "both"] },
    size: { control: { type: "number", min: 0, max: 200 } },
    hideScrollBar: { control: "boolean" },
  },
  args: {
    orientation: "vertical",
    size: 40,
    hideScrollBar: false,
  },
};

export default meta;
type Story = StoryObj<typeof ScrollShadow>;

export const Vertical: Story = {
  render: (args) => (
    <ScrollShadow {...args} style={{ height: 200, width: 400, padding: 12, border: "1px solid #e2e8f0", borderRadius: 8 }}>
      <p style={{ margin: 0, lineHeight: 1.6 }}>{LOREM}</p>
    </ScrollShadow>
  ),
};

export const Horizontal: Story = {
  args: { orientation: "horizontal" },
  render: (args) => (
    <ScrollShadow {...args} style={{ width: 300, padding: 8, border: "1px solid #e2e8f0", borderRadius: 8 }}>
      <div style={{ display: "flex", flexDirection: "row", gap: 12, width: "max-content", padding: "4px 0" }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            style={{
              width: 80,
              height: 60,
              background: "#e2e8f0",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </ScrollShadow>
  ),
};

export const HideScrollBar: Story = {
  args: { hideScrollBar: true },
  render: (args) => (
    <ScrollShadow {...args} style={{ height: 200, width: 400, padding: 12, border: "1px solid #e2e8f0", borderRadius: 8 }}>
      <p style={{ margin: 0, lineHeight: 1.6 }}>{LOREM}</p>
    </ScrollShadow>
  ),
};

export const CustomSize: Story = {
  args: { size: 80 },
  render: (args) => (
    <ScrollShadow {...args} style={{ height: 200, width: 400, padding: 12, border: "1px solid #e2e8f0", borderRadius: 8 }}>
      <p style={{ margin: 0, lineHeight: 1.6 }}>{LOREM}</p>
    </ScrollShadow>
  ),
};

export const BothOrientations: Story = {
  args: { orientation: "both" },
  render: (args) => (
    <ScrollShadow
      {...args}
      style={{ height: 200, width: 300, padding: 8, border: "1px solid #e2e8f0", borderRadius: 8, overflow: "auto" }}
    >
      <div style={{ width: 600 }}>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} style={{ margin: "0 0 8px", lineHeight: 1.6, whiteSpace: "nowrap" }}>
            Line {i + 1}: This is a very long line that extends beyond the container width to trigger horizontal scrolling.
          </p>
        ))}
      </div>
    </ScrollShadow>
  ),
};
