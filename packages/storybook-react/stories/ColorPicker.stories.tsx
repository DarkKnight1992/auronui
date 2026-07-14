import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorPicker } from "@auronui/react";

const meta: Meta<typeof ColorPicker> = {
  title: "Components/ColorPicker",
  component: ColorPicker,
  tags: ["autodocs"],
  argTypes: {
    format: { control: "select", options: ["hex", "hsl", "rgb"] },
    isDisabled: { control: "boolean" },
    label: { control: "text" },
    defaultValue: { control: "text" },
  },
  args: {
    defaultValue: "#3b82f6",
    format: "hex",
    isDisabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Default: Story = {
  name: "Default (Blue, hex)",
  render: (args) => <ColorPicker {...args} defaultValue="#3b82f6" />,
};

export const HslFormat: Story = {
  render: (args) => <ColorPicker {...args} defaultValue="#ff0000" format="hsl" label="HSL color" />,
};

export const RgbFormat: Story = {
  render: (args) => <ColorPicker {...args} defaultValue="#00ff00" format="rgb" label="RGB color" />,
};

export const Controlled: Story = {
  name: "Controlled Mode",
  render: (args) => {
    function ControlledColorPicker() {
      const [color, setColor] = useState("#3b82f6");
      return (
        <div>
          <ColorPicker {...args} value={color} format="hex" label="Controlled color" onValueChange={setColor} />
          <p style={{ marginTop: 8, fontFamily: "monospace", fontSize: 14 }}>Current: {color}</p>
        </div>
      );
    }
    return <ControlledColorPicker />;
  },
};

export const Disabled: Story = {
  render: (args) => <ColorPicker {...args} defaultValue="#3b82f6" isDisabled label="Disabled color picker" />,
};

export const WithLabel: Story = {
  render: (args) => <ColorPicker {...args} defaultValue="#8b5cf6" label="Background color" format="hex" />,
};

export const StartingFromBlack: Story = {
  render: (args) => <ColorPicker {...args} defaultValue="#000000" label="Black color picker" format="hex" />,
};

export const StartingFromWhite: Story = {
  render: (args) => <ColorPicker {...args} defaultValue="#ffffff" label="White color picker" format="hex" />,
};
