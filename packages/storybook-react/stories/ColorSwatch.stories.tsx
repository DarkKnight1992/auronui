import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorSwatch } from "@auronui/react";

const meta: Meta<typeof ColorSwatch> = {
  title: "Components/ColorSwatch",
  component: ColorSwatch,
  tags: ["autodocs"],
  argTypes: {
    shape: { control: "select", options: ["circle", "square"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    color: { control: "color" },
    colorName: { control: "text" },
    label: { control: "text" },
  },
  args: {
    color: "#ff0000",
    colorName: "Red",
    shape: "circle",
    size: "md",
  },
};

export default meta;
type Story = StoryObj<typeof ColorSwatch>;

export const Default: Story = {
  name: "Default (Red)",
  render: (args) => <ColorSwatch {...args} />,
};

export const Green: Story = {
  render: (args) => <ColorSwatch {...args} color="#00cc44" colorName="Green" />,
};

export const Blue: Story = {
  render: (args) => <ColorSwatch {...args} color="#0066ff" colorName="Blue" />,
};

export const Square: Story = {
  name: "Square Shape",
  render: (args) => <ColorSwatch {...args} color="#ff6b00" colorName="Orange" shape="square" />,
};

export const Sizes: Story = {
  name: "All Sizes",
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <ColorSwatch {...args} color="#aa00ff" colorName="Purple xs" size="xs" />
      <ColorSwatch {...args} color="#aa00ff" colorName="Purple sm" size="sm" />
      <ColorSwatch {...args} color="#aa00ff" colorName="Purple md" size="md" />
      <ColorSwatch {...args} color="#aa00ff" colorName="Purple lg" size="lg" />
      <ColorSwatch {...args} color="#aa00ff" colorName="Purple xl" size="xl" />
    </div>
  ),
};

export const WithName: Story = {
  name: "Custom Color with Name",
  render: (args) => <ColorSwatch {...args} color="#ff1493" colorName="Deep Pink" size="lg" />,
};
