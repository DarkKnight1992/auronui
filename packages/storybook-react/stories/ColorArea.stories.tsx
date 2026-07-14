import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorArea } from "@auronui/react";

const meta: Meta<typeof ColorArea> = {
  title: "Components/ColorArea",
  component: ColorArea,
  tags: ["autodocs"],
  argTypes: {
    xChannel: {
      control: "select",
      options: ["hue", "saturation", "brightness", "lightness", "red", "green", "blue", "alpha"],
    },
    yChannel: {
      control: "select",
      options: ["hue", "saturation", "brightness", "lightness", "red", "green", "blue", "alpha"],
    },
    showDots: { control: "boolean" },
    isDisabled: { control: "boolean" },
  },
  args: {
    defaultValue: "#ff0000",
    xChannel: "saturation",
    yChannel: "brightness",
    showDots: false,
    isDisabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof ColorArea>;

export const Default: Story = {
  name: "Default (Saturation/Brightness)",
  render: (args) => <ColorArea {...args} aria-label="Color area" style={{ width: 200, height: 200 }} />,
};

export const HueLightness: Story = {
  render: (args) => (
    <ColorArea
      {...args}
      defaultValue="#ff0000"
      xChannel="hue"
      yChannel="lightness"
      aria-label="Hue lightness area"
      style={{ width: 200, height: 200 }}
    />
  ),
};

export const ShowDots: Story = {
  render: (args) => (
    <ColorArea {...args} defaultValue="#ff0000" showDots aria-label="Color area with dots" style={{ width: 200, height: 200 }} />
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <ColorArea {...args} defaultValue="#ff0000" isDisabled aria-label="Disabled color area" style={{ width: 200, height: 200 }} />
  ),
};
