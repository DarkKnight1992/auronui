import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Input } from "@auronui/react";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["flat", "faded", "bordered", "underlined", "raised"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "accent", "success", "warning", "danger"],
    },
    labelPlacement: {
      control: "select",
      options: ["inside", "outside", "outside-left"],
    },
    isDisabled: { control: "boolean" },
    isReadOnly: { control: "boolean" },
    isInvalid: { control: "boolean" },
    isRequired: { control: "boolean" },
    isClearable: { control: "boolean" },
    showPasswordToggle: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
  args: {
    variant: "flat",
    size: "md",
    color: "default",
    labelPlacement: "inside",
    isDisabled: false,
    isReadOnly: false,
    isInvalid: false,
    isRequired: false,
    isClearable: false,
    showPasswordToggle: false,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    variant: "bordered",
    label: "Email",
    placeholder: "you@example.com",
    description: "We'll never share your email.",
  },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <Input {...args} />
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 320 }}>
      {(["flat", "faded", "bordered", "underlined", "raised"] as const).map((variant) => (
        <Input key={variant} {...args} variant={variant} placeholder={`${variant} input`} aria-label={`${variant} input`} />
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 320 }}>
      {(["default", "primary", "secondary", "accent", "success", "warning", "danger"] as const).map((color) => (
        <Input key={color} {...args} variant="bordered" color={color} placeholder={color} aria-label={`${color} input`} />
      ))}
    </div>
  ),
};

export const Invalid: Story = {
  args: {
    variant: "bordered",
    label: "Email",
    labelPlacement: "outside",
    isInvalid: true,
    errorMessage: "Please enter a valid email address.",
    placeholder: "you@example.com",
  },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <Input {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { variant: "bordered", isDisabled: true },
  render: (args) => <Input {...args} placeholder="Disabled input" aria-label="Disabled input" />,
};

export const Clearable: Story = {
  render: (args) => {
    function ClearableInput() {
      const [value, setValue] = useState("hello world");
      return (
        <div style={{ maxWidth: 360 }}>
          <Input
            {...args}
            variant="bordered"
            label="Search"
            labelPlacement="outside"
            isClearable
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onClear={() => setValue("")}
          />
        </div>
      );
    }
    return <ClearableInput />;
  },
};

export const PasswordToggle: Story = {
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <Input
        {...args}
        variant="bordered"
        type="password"
        label="Password"
        labelPlacement="outside"
        placeholder="Enter password"
        showPasswordToggle
        defaultValue="s3cret-value"
      />
    </div>
  ),
};
