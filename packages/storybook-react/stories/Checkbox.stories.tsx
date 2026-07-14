import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "@auronui/react";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"],
    },
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "accent", "success", "warning", "danger"],
    },
    isDisabled: { control: "boolean" },
    isInvalid: { control: "boolean" },
    isIndeterminate: { control: "boolean" },
  },
  args: {
    variant: "primary",
    color: "primary",
    isDisabled: false,
    isInvalid: false,
    isIndeterminate: false,
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: (args) => <Checkbox {...args}>Accept terms and conditions</Checkbox>,
};

export const Checked: Story = {
  args: { defaultSelected: true },
  render: (args) => <Checkbox {...args}>Subscribed</Checkbox>,
};

export const Indeterminate: Story = {
  args: { isIndeterminate: true },
  render: (args) => <Checkbox {...args}>Select all</Checkbox>,
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Checkbox {...args} variant="primary" defaultSelected>
        Primary
      </Checkbox>
      <Checkbox {...args} variant="secondary" defaultSelected>
        Secondary
      </Checkbox>
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {(["default", "primary", "secondary", "accent", "success", "warning", "danger"] as const).map(
        (color) => (
          <Checkbox key={color} {...args} color={color} defaultSelected>
            {color}
          </Checkbox>
        ),
      )}
    </div>
  ),
};

export const Invalid: Story = {
  args: { isInvalid: true },
  render: (args) => <Checkbox {...args}>I agree (required)</Checkbox>,
};

export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Checkbox {...args} isDisabled>
        Disabled unchecked
      </Checkbox>
      <Checkbox {...args} isDisabled defaultSelected>
        Disabled checked
      </Checkbox>
    </div>
  ),
};
