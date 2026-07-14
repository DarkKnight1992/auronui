import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorInputGroup } from "@auronui/react";

const meta: Meta<typeof ColorInputGroup> = {
  title: "Components/ColorInputGroup",
  component: ColorInputGroup,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary"] },
    fullWidth: { control: "boolean" },
    label: { control: "text" },
    description: { control: "text" },
    errorMessage: { control: "text" },
    suffixLabel: { control: "text" },
  },
  args: {
    defaultValue: "#ff0000",
    suffixLabel: "HEX",
    fullWidth: false,
    variant: "primary",
  },
};

export default meta;
type Story = StoryObj<typeof ColorInputGroup>;

export const Default: Story = {
  render: (args) => <ColorInputGroup {...args} />,
};

export const WithLabel: Story = {
  render: (args) => <ColorInputGroup {...args} defaultValue="#0066ff" label="Background color" suffixLabel="HEX" />,
};

export const WithDescription: Story = {
  render: (args) => (
    <ColorInputGroup
      {...args}
      defaultValue="#00cc44"
      label="Accent color"
      description="Pick a color for accent elements"
      suffixLabel="HEX"
    />
  ),
};

export const WithError: Story = {
  render: (args) => (
    <ColorInputGroup {...args} defaultValue="#ff0000" label="Color" errorMessage="Please enter a valid color" suffixLabel="HEX" />
  ),
};

export const FullWidth: Story = {
  render: (args) => <ColorInputGroup {...args} defaultValue="#aa00ff" label="Theme color" fullWidth suffixLabel="HEX" />,
};

export const Secondary: Story = {
  name: "Secondary Variant",
  render: (args) => <ColorInputGroup {...args} defaultValue="#ff6b00" label="Border color" variant="secondary" suffixLabel="HEX" />,
};
