import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "@auronui/react";

const meta: Meta<typeof Label> = {
  component: Label,
  title: "Form/Label",
  tags: ["autodocs"],
  argTypes: {
    isDisabled: { control: "boolean" },
    isInvalid: { control: "boolean" },
    isRequired: { control: "boolean" },
  },
  args: {
    isDisabled: false,
    isInvalid: false,
    isRequired: false,
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  render: (args) => <Label {...args}>Email address</Label>,
};

export const Disabled: Story = {
  args: { isDisabled: true },
  render: (args) => <Label {...args}>Disabled label</Label>,
};

export const Invalid: Story = {
  args: { isInvalid: true },
  render: (args) => <Label {...args}>Invalid field label</Label>,
};

export const Required: Story = {
  args: { isRequired: true },
  render: (args) => <Label {...args}>Required field *</Label>,
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Label {...args}>Default label</Label>
      <Label {...args} isDisabled>Disabled label</Label>
      <Label {...args} isInvalid>Invalid label</Label>
      <Label {...args} isRequired>Required label *</Label>
    </div>
  ),
};
