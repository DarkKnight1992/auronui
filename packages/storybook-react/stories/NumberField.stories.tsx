import type { Meta, StoryObj } from "@storybook/react-vite";
import { NumberField } from "@auronui/react";

const meta: Meta<typeof NumberField> = {
  title: "Components/NumberField",
  component: NumberField,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["flat", "bordered", "faded", "underlined", "raised"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "accent", "success", "warning", "danger"],
    },
    isDisabled: { control: "boolean" },
    isReadOnly: { control: "boolean" },
    isInvalid: { control: "boolean" },
    isRequired: { control: "boolean" },
    fullWidth: { control: "boolean" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
  },
  args: {
    variant: "flat",
    size: "md",
    color: "default",
    isDisabled: false,
    isReadOnly: false,
    isInvalid: false,
    isRequired: false,
    fullWidth: false,
    step: 1,
  },
};

export default meta;
type Story = StoryObj<typeof NumberField>;

export const Default: Story = {
  args: {
    variant: "bordered",
    label: "Quantity",
    defaultValue: 1,
    min: 0,
    max: 100,
  },
  render: (args) => (
    <div style={{ maxWidth: 240 }}>
      <NumberField {...args} />
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 240 }}>
      {(["flat", "bordered", "faded", "underlined", "raised"] as const).map((variant) => (
        <NumberField key={variant} {...args} variant={variant} ariaLabel={`${variant} number field`} defaultValue={5} />
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 240 }}>
      {(["default", "primary", "secondary", "accent", "success", "warning", "danger"] as const).map((color) => (
        <NumberField key={color} {...args} variant="bordered" color={color} ariaLabel={`${color} number field`} defaultValue={5} />
      ))}
    </div>
  ),
};

export const Invalid: Story = {
  args: {
    variant: "bordered",
    label: "Amount",
    isInvalid: true,
    defaultValue: -5,
    min: 0,
  },
  render: (args) => (
    <div style={{ maxWidth: 240 }}>
      <NumberField {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { variant: "bordered", isDisabled: true, label: "Disabled", defaultValue: 10 },
  render: (args) => (
    <div style={{ maxWidth: 240 }}>
      <NumberField {...args} />
    </div>
  ),
};

export const FormatOptions: Story = {
  name: "Currency formatting",
  args: {
    variant: "bordered",
    label: "Price",
    defaultValue: 49.99,
    formatOptions: { style: "currency", currency: "USD" },
  },
  render: (args) => (
    <div style={{ maxWidth: 240 }}>
      <NumberField {...args} />
    </div>
  ),
};
