import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup, Radio } from "@auronui/react";

const meta: Meta<typeof RadioGroup> = {
  title: "Components/Radio",
  component: RadioGroup,
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
    orientation: {
      control: "radio",
      options: ["vertical", "horizontal"],
    },
    isDisabled: { control: "boolean" },
    isInvalid: { control: "boolean" },
  },
  args: {
    variant: "primary",
    color: "primary",
    orientation: "vertical",
    isDisabled: false,
    isInvalid: false,
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  args: {
    label: "Plan",
    defaultValue: "free",
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="free">Free</Radio>
      <Radio value="pro">Pro</Radio>
      <Radio value="enterprise">Enterprise</Radio>
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  args: {
    label: "Plan",
    orientation: "horizontal",
    defaultValue: "free",
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="free">Free</Radio>
      <Radio value="pro">Pro</Radio>
      <Radio value="enterprise">Enterprise</Radio>
    </RadioGroup>
  ),
};

export const ShorthandItems: Story = {
  name: "Shorthand `items` API",
  args: {
    label: "Size",
    items: [
      { value: "s", label: "Small" },
      { value: "m", label: "Medium" },
      { value: "l", label: "Large", disabled: true },
    ],
  },
  render: (args) => <RadioGroup {...args} />,
};

export const Colors: Story = {
  args: {
    label: "Color",
    defaultValue: "primary",
  },
  render: (args) => (
    <RadioGroup {...args}>
      {(["default", "primary", "secondary", "accent", "success", "warning", "danger"] as const).map(
        (color) => (
          <Radio key={color} value={color} color={color}>
            {color}
          </Radio>
        ),
      )}
    </RadioGroup>
  ),
};

export const Invalid: Story = {
  args: {
    label: "Shipping method",
    isInvalid: true,
    errorMessage: "Please select a shipping method.",
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="standard">Standard</Radio>
      <Radio value="express">Express</Radio>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  args: {
    label: "Plan",
    isDisabled: true,
    defaultValue: "free",
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="free">Free</Radio>
      <Radio value="pro">Pro</Radio>
    </RadioGroup>
  ),
};
