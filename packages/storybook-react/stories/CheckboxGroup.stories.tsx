import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckboxGroup, Checkbox } from "@auronui/react";

const meta: Meta<typeof CheckboxGroup> = {
  title: "Components/CheckboxGroup",
  component: CheckboxGroup,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"],
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
    orientation: "vertical",
    isDisabled: false,
    isInvalid: false,
  },
};

export default meta;
type Story = StoryObj<typeof CheckboxGroup>;

export const Default: Story = {
  args: {
    label: "Notifications",
    defaultValue: ["email"],
  },
  render: (args) => (
    <CheckboxGroup {...args}>
      <Checkbox value="email">Email</Checkbox>
      <Checkbox value="sms">SMS</Checkbox>
      <Checkbox value="push">Push</Checkbox>
    </CheckboxGroup>
  ),
};

export const Horizontal: Story = {
  args: {
    label: "Notifications",
    orientation: "horizontal",
    defaultValue: ["email"],
  },
  render: (args) => (
    <CheckboxGroup {...args}>
      <Checkbox value="email">Email</Checkbox>
      <Checkbox value="sms">SMS</Checkbox>
      <Checkbox value="push">Push</Checkbox>
    </CheckboxGroup>
  ),
};

export const ShorthandItems: Story = {
  name: "Shorthand `items` API",
  args: {
    label: "Toppings",
    items: [
      { value: "cheese", label: "Cheese" },
      { value: "olives", label: "Olives" },
      { value: "mushrooms", label: "Mushrooms", disabled: true },
    ],
  },
  render: (args) => <CheckboxGroup {...args} />,
};

export const Invalid: Story = {
  args: {
    label: "Interests",
    isInvalid: true,
    errorMessage: "Select at least one interest.",
  },
  render: (args) => (
    <CheckboxGroup {...args}>
      <Checkbox value="tech">Technology</Checkbox>
      <Checkbox value="art">Art</Checkbox>
    </CheckboxGroup>
  ),
};

export const Disabled: Story = {
  args: {
    label: "Notifications",
    isDisabled: true,
    defaultValue: ["email"],
  },
  render: (args) => (
    <CheckboxGroup {...args}>
      <Checkbox value="email">Email</Checkbox>
      <Checkbox value="sms">SMS</Checkbox>
    </CheckboxGroup>
  ),
};
