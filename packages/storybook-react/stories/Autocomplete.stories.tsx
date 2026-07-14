import type { Meta, StoryObj } from "@storybook/react-vite";
import { Autocomplete } from "@auronui/react";

const meta: Meta<typeof Autocomplete> = {
  component: Autocomplete,
  title: "Form/Autocomplete",
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
    fullWidth: { control: "boolean" },
    isDisabled: { control: "boolean" },
    isReadOnly: { control: "boolean" },
    isInvalid: { control: "boolean" },
    isRequired: { control: "boolean" },
    multiple: { control: "boolean" },
    creatable: { control: "boolean" },
    debounceMs: { control: "number" },
  },
  args: {
    variant: "flat",
    size: "md",
    color: "default",
    labelPlacement: "inside",
    fullWidth: false,
    isDisabled: false,
    isReadOnly: false,
    isInvalid: false,
    isRequired: false,
    multiple: false,
    creatable: false,
    debounceMs: 200,
  },
};

export default meta;
type Story = StoryObj<typeof Autocomplete>;

const allFruits = [
  { value: "apple", label: "Apple" },
  { value: "apricot", label: "Apricot" },
  { value: "avocado", label: "Avocado" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "cherry", label: "Cherry" },
  { value: "cranberry", label: "Cranberry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
];

export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <Autocomplete {...args} items={allFruits} label="Favorite Fruit" placeholder="Search fruits..." aria-label="Fruit autocomplete" />
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 360 }}>
      {(["flat", "bordered", "faded", "underlined", "raised"] as const).map((v) => (
        <Autocomplete
          key={v}
          {...args}
          variant={v}
          items={allFruits}
          label={v.charAt(0).toUpperCase() + v.slice(1)}
          placeholder={`${v} variant...`}
          aria-label={`${v} variant`}
        />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 320 }}>
      <Autocomplete {...args} size="sm" variant="bordered" items={allFruits} placeholder="Small (sm)" aria-label="Small autocomplete" />
      <Autocomplete {...args} size="md" variant="bordered" items={allFruits} placeholder="Medium (md) — default" aria-label="Medium autocomplete" />
      <Autocomplete {...args} size="lg" variant="bordered" items={allFruits} placeholder="Large (lg)" aria-label="Large autocomplete" />
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 320 }}>
      {(["default", "primary", "secondary", "accent", "success", "warning", "danger"] as const).map((c) => (
        <Autocomplete key={c} {...args} variant="bordered" color={c} items={allFruits} placeholder={c} aria-label={`${c} color`} />
      ))}
    </div>
  ),
};

export const WithDescription: Story = {
  args: {
    variant: "bordered",
    label: "Favorite Fruit",
    labelPlacement: "outside",
    description: "Type or pick from the list. Sorted alphabetically.",
  },
  render: (args) => (
    <div style={{ maxWidth: 400 }}>
      <Autocomplete {...args} items={allFruits} placeholder="Search fruits..." aria-label="Autocomplete with description" />
    </div>
  ),
};

export const WithErrorMessage: Story = {
  args: {
    variant: "bordered",
    label: "Favorite Fruit",
    labelPlacement: "outside",
    isInvalid: true,
    errorMessage: "Please select a valid option.",
  },
  render: (args) => (
    <div style={{ maxWidth: 400 }}>
      <Autocomplete {...args} items={allFruits} placeholder="Search fruits..." aria-label="Autocomplete with error" />
    </div>
  ),
};

export const Required: Story = {
  args: {
    variant: "bordered",
    label: "Favorite Fruit",
    labelPlacement: "outside",
    isRequired: true,
    description: "Required field — asterisk is rendered next to the label.",
  },
  render: (args) => (
    <div style={{ maxWidth: 400 }}>
      <Autocomplete {...args} items={allFruits} placeholder="Search fruits..." aria-label="Required autocomplete" />
    </div>
  ),
};

export const Multiple: Story = {
  args: { multiple: true, label: "Fruits", labelPlacement: "outside", variant: "bordered" },
  render: (args) => (
    <div style={{ maxWidth: 400 }}>
      <Autocomplete {...args} items={allFruits} placeholder="Search fruits..." aria-label="Multiple fruit autocomplete" />
    </div>
  ),
};

export const Creatable: Story = {
  args: { creatable: true, label: "Favorite Fruit", labelPlacement: "outside", variant: "bordered" },
  render: (args) => (
    <div style={{ maxWidth: 400 }}>
      <Autocomplete {...args} items={allFruits} placeholder="Type anything..." aria-label="Creatable autocomplete" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { variant: "bordered", isDisabled: true },
  render: (args) => (
    <Autocomplete {...args} items={allFruits} placeholder="Disabled autocomplete" aria-label="Disabled autocomplete" />
  ),
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  render: (args) => (
    <Autocomplete {...args} items={allFruits} label="Full Width" placeholder="Search fruits..." aria-label="Full width autocomplete" />
  ),
};
