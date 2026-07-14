import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorSlider } from "@auronui/react";

const meta: Meta<typeof ColorSlider> = {
  title: "Components/ColorSlider",
  component: ColorSlider,
  tags: ["autodocs"],
  argTypes: {
    channel: { control: "select", options: ["hue", "saturation", "lightness", "alpha"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    showOutput: { control: "boolean" },
    isDisabled: { control: "boolean" },
  },
  args: {
    defaultValue: "#ff0000",
    channel: "hue",
    orientation: "horizontal",
    showOutput: false,
    isDisabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof ColorSlider>;

export const Hue: Story = {
  render: (args) => <ColorSlider {...args} channel="hue" defaultValue="#ff0000" aria-label="Hue" style={{ width: 200 }} />,
};

export const Saturation: Story = {
  render: (args) => (
    <ColorSlider {...args} channel="saturation" defaultValue="#ff0000" aria-label="Saturation" style={{ width: 200 }} />
  ),
};

export const Lightness: Story = {
  render: (args) => (
    <ColorSlider {...args} channel="lightness" defaultValue="#ff0000" aria-label="Lightness" style={{ width: 200 }} />
  ),
};

export const Alpha: Story = {
  render: (args) => <ColorSlider {...args} channel="alpha" defaultValue="#ff0000" aria-label="Alpha" style={{ width: 200 }} />,
};

export const Vertical: Story = {
  render: (args) => (
    <ColorSlider {...args} channel="hue" defaultValue="#ff0000" orientation="vertical" aria-label="Hue vertical" style={{ height: 200 }} />
  ),
};

export const WithOutput: Story = {
  render: (args) => (
    <ColorSlider {...args} channel="hue" defaultValue="#ff0000" showOutput aria-label="Hue with output" style={{ width: 200 }} />
  ),
};

export const Controlled: Story = {
  name: "Controlled (value/onChange)",
  render: (args) => {
    function ControlledColorSlider() {
      const [value, setValue] = useState("#ff0000");
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 16 }}>
          <ColorSlider {...args} value={value} onChange={(c) => setValue(c.toString("hex"))} channel="hue" aria-label="Hue" style={{ width: 200 }} />
          <p style={{ fontSize: 13, color: "#666" }}>Value: {value}</p>
        </div>
      );
    }
    return <ControlledColorSlider />;
  },
};

export const Disabled: Story = {
  render: (args) => (
    <ColorSlider {...args} channel="hue" defaultValue="#ff0000" isDisabled aria-label="Disabled hue" style={{ width: 200 }} />
  ),
};
