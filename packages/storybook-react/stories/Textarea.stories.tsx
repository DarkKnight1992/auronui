import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Textarea } from "@auronui/react";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
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
    labelPlacement: {
      control: "select",
      options: ["inside", "outside", "outside-left"],
    },
    isDisabled: { control: "boolean" },
    isReadOnly: { control: "boolean" },
    isInvalid: { control: "boolean" },
    isRequired: { control: "boolean" },
    isClearable: { control: "boolean" },
    fullWidth: { control: "boolean" },
    autoResize: { control: "boolean" },
    rows: { control: "number" },
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
    fullWidth: false,
    autoResize: false,
    rows: 3,
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    variant: "bordered",
    label: "Bio",
    placeholder: "Tell us about yourself…",
    description: "A short public bio shown on your profile.",
  },
  render: (args) => (
    <div style={{ maxWidth: 400 }}>
      <Textarea {...args} />
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 360 }}>
      {(["flat", "bordered", "faded", "underlined", "raised"] as const).map((variant) => (
        <Textarea key={variant} {...args} variant={variant} placeholder={`${variant} textarea`} aria-label={`${variant} textarea`} />
      ))}
    </div>
  ),
};

export const Invalid: Story = {
  args: {
    variant: "bordered",
    label: "Comments",
    labelPlacement: "outside",
    isInvalid: true,
    errorMessage: "This field has an error.",
    placeholder: "Your comments…",
  },
  render: (args) => (
    <div style={{ maxWidth: 400 }}>
      <Textarea {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { variant: "bordered", isDisabled: true },
  render: (args) => (
    <div style={{ maxWidth: 400 }}>
      <Textarea {...args} placeholder="Disabled textarea" aria-label="Disabled textarea" />
    </div>
  ),
};

export const AutoResize: Story = {
  render: (args) => (
    <div style={{ maxWidth: 400 }}>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>
        Type or paste multi-line text — the textarea grows automatically.
      </p>
      <Textarea
        {...args}
        variant="bordered"
        fullWidth
        autoResize
        placeholder="Start typing here to see auto-resize in action..."
        aria-label="Auto-resizing textarea"
      />
    </div>
  ),
};

export const Clearable: Story = {
  render: (args) => {
    function ClearableTextarea() {
      const [value, setValue] = useState("Hello world — this textarea has a clear button.");
      return (
        <div style={{ maxWidth: 400 }}>
          <Textarea
            {...args}
            variant="bordered"
            label="Message"
            labelPlacement="outside"
            isClearable
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onClear={() => setValue("")}
          />
        </div>
      );
    }
    return <ClearableTextarea />;
  },
};
