import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SearchField } from "@auronui/react";

const meta: Meta<typeof SearchField> = {
  title: "Components/SearchField",
  component: SearchField,
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
    isClearable: true,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof SearchField>;

export const Default: Story = {
  args: {
    variant: "bordered",
    label: "Search",
    placeholder: "Search…",
  },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <SearchField {...args} />
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 320 }}>
      {(["flat", "faded", "bordered", "underlined", "raised"] as const).map((variant) => (
        <SearchField key={variant} {...args} variant={variant} placeholder={`${variant} search`} aria-label={`${variant} search`} />
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 320 }}>
      {(["default", "primary", "secondary", "accent", "success", "warning", "danger"] as const).map((color) => (
        <SearchField key={color} {...args} variant="bordered" color={color} placeholder={color} aria-label={`${color} search`} />
      ))}
    </div>
  ),
};

export const Invalid: Story = {
  args: {
    variant: "bordered",
    label: "Search",
    labelPlacement: "outside",
    isInvalid: true,
    errorMessage: "Search term is invalid.",
  },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <SearchField {...args} />
    </div>
  ),
};

export const EscapeToClear: Story = {
  name: "Clearable (Escape or × clears)",
  render: (args) => {
    function ClearableSearch() {
      const [value, setValue] = useState("hello world");
      return (
        <div style={{ maxWidth: 360 }}>
          <SearchField
            {...args}
            variant="bordered"
            label="Search"
            labelPlacement="outside"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onClear={() => setValue("")}
          />
        </div>
      );
    }
    return <ClearableSearch />;
  },
};
