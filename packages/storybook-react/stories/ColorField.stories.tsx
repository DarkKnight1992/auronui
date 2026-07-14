import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorField } from "@auronui/react";

const meta: Meta<typeof ColorField> = {
  title: "Components/ColorField",
  component: ColorField,
  tags: ["autodocs"],
  argTypes: {
    isDisabled: { control: "boolean" },
    isReadOnly: { control: "boolean" },
    label: { control: "text" },
    description: { control: "text" },
    errorMessage: { control: "text" },
    placeholder: { control: "text" },
  },
  args: {
    defaultValue: "#ff0000",
    isDisabled: false,
    isReadOnly: false,
  },
};

export default meta;
type Story = StoryObj<typeof ColorField>;

export const Default: Story = {
  render: (args) => <ColorField {...args} />,
};

export const WithLabel: Story = {
  render: (args) => <ColorField {...args} defaultValue="#0066ff" label="Background color" />,
};

export const WithDescription: Story = {
  render: (args) => (
    <ColorField {...args} defaultValue="#00cc44" label="Accent color" description="Enter a hex, hsl, or rgb color value" />
  ),
};

export const WithError: Story = {
  render: (args) => <ColorField {...args} defaultValue="#ff0000" label="Color" errorMessage="Please enter a valid color" />,
};

export const Disabled: Story = {
  render: (args) => <ColorField {...args} defaultValue="#888888" label="Color (disabled)" isDisabled />,
};

export const Controlled: Story = {
  name: "Controlled (value/onChange)",
  render: (args) => {
    function ControlledColorField() {
      const [value, setValue] = useState("#ff0000");
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 16 }}>
          <ColorField {...args} value={value} onChange={(c) => setValue(c.toString("hex"))} label="Color" />
          <p style={{ fontSize: 13, color: "#666" }}>Value: {value}</p>
        </div>
      );
    }
    return <ControlledColorField />;
  },
};

export const Readonly: Story = {
  render: (args) => <ColorField {...args} defaultValue="#ff6b00" label="Fixed color" isReadOnly />,
};
