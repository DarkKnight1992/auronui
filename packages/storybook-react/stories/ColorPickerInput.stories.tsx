import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorPickerInput } from "@auronui/react";

const meta: Meta<typeof ColorPickerInput> = {
  title: "Components/ColorPickerInput",
  component: ColorPickerInput,
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
type Story = StoryObj<typeof ColorPickerInput>;

export const Default: Story = {
  name: "Default (Blue, hex)",
  render: (args) => <ColorPickerInput {...args} defaultValue="#3b82f6" label="Accent color" />,
};

export const HslFormat: Story = {
  render: (args) => <ColorPickerInput {...args} defaultValue="#ff0000" format="hsl" label="HSL color" />,
};

export const RgbFormat: Story = {
  render: (args) => <ColorPickerInput {...args} defaultValue="#00ff00" format="rgb" label="RGB color" />,
};

export const Controlled: Story = {
  name: "Controlled Mode",
  render: (args) => {
    function ControlledColorPickerInput() {
      const [color, setColor] = useState("#3b82f6");
      return (
        <div>
          <ColorPickerInput {...args} value={color} format="hex" label="Controlled color" onValueChange={setColor} />
          <p style={{ marginTop: 8, fontFamily: "monospace", fontSize: 14 }}>Current: {color}</p>
        </div>
      );
    }
    return <ControlledColorPickerInput />;
  },
};

export const Disabled: Story = {
  render: (args) => <ColorPickerInput {...args} defaultValue="#3b82f6" isDisabled label="Disabled color picker" />,
};

export const WithDescriptionAndError: Story = {
  name: "With Description / Error",
  render: (args) => (
    <ColorPickerInput
      {...args}
      defaultValue="#8b5cf6"
      label="Background color"
      description="Pick an accent color for the theme"
      errorMessage="This color fails contrast requirements"
    />
  ),
};

export const StartingFromBlack: Story = {
  render: (args) => <ColorPickerInput {...args} defaultValue="#000000" label="Black color picker" format="hex" />,
};
