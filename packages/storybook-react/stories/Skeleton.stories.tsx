import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "@auronui/react";

const meta: Meta<typeof Skeleton> = {
  component: Skeleton,
  title: "Components/Skeleton",
  tags: ["autodocs"],
  argTypes: {
    animationType: { control: "select", options: ["shimmer", "pulse", "none"] },
  },
  args: {
    animationType: "shimmer",
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  render: (args) => <Skeleton {...args} style={{ width: 200, height: 16, borderRadius: 4 }} />,
};

export const Shimmer: Story = {
  args: { animationType: "shimmer" },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Skeleton {...args} style={{ width: 300, height: 16, borderRadius: 4 }} />
      <Skeleton {...args} style={{ width: 240, height: 16, borderRadius: 4 }} />
      <Skeleton {...args} style={{ width: 180, height: 16, borderRadius: 4 }} />
    </div>
  ),
};

export const Pulse: Story = {
  args: { animationType: "pulse" },
  render: (args) => <Skeleton {...args} style={{ width: 200, height: 100, borderRadius: 8 }} />,
};

export const NoAnimation: Story = {
  args: { animationType: "none" },
  render: (args) => <Skeleton {...args} style={{ width: 200, height: 16, borderRadius: 4 }} />,
};

export const Card: Story = {
  args: { animationType: "shimmer" },
  render: (args) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        width: 300,
        padding: 16,
        border: "1px solid #e2e8f0",
        borderRadius: 8,
      }}
    >
      <Skeleton {...args} style={{ width: "100%", height: 160, borderRadius: 6 }} />
      <Skeleton {...args} style={{ width: "80%", height: 16, borderRadius: 4 }} />
      <Skeleton {...args} style={{ width: "60%", height: 14, borderRadius: 4 }} />
    </div>
  ),
};

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  args: {
    animationType: "shimmer",
    classNames: { base: "border-2 border-blue-500 rounded-lg" },
  },
  render: (args) => <Skeleton {...args} style={{ width: 200, height: 16 }} />,
};
