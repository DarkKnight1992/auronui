import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "@auronui/react";

const meta: Meta<typeof Select> = {
  component: Select,
  title: "Form/Select",
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
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

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
  args: {
    variant: "bordered",
    label: "Favorite Fruit",
    placeholder: "Pick a fruit",
  },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <Select {...args} items={allFruits} />
    </div>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    function Demo() {
      const [fruit, setFruit] = useState("banana");
      return (
        <div>
          <p style={{ marginBottom: 8, fontSize: 14 }}>Selected: {fruit}</p>
          <Select
            {...args}
            label="Favorite Fruit"
            items={allFruits}
            value={fruit}
            onValueChange={(v) => setFruit(v as string)}
          />
        </div>
      );
    }
    return <Demo />;
  },
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 360 }}>
      {(["flat", "bordered", "faded", "underlined", "raised"] as const).map((v) => (
        <Select
          key={v}
          {...args}
          variant={v}
          items={allFruits}
          label={v.charAt(0).toUpperCase() + v.slice(1)}
          placeholder={`${v} variant...`}
        />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 320 }}>
      <Select {...args} size="sm" variant="bordered" items={allFruits} placeholder="Small (sm)" aria-label="Small select" />
      <Select {...args} size="md" variant="bordered" items={allFruits} placeholder="Medium (md) — default" aria-label="Medium select" />
      <Select {...args} size="lg" variant="bordered" items={allFruits} placeholder="Large (lg)" aria-label="Large select" />
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 320 }}>
      {(["default", "primary", "secondary", "accent", "success", "warning", "danger"] as const).map((c) => (
        <Select
          key={c}
          {...args}
          variant="bordered"
          color={c}
          items={allFruits}
          placeholder={c}
          aria-label={`${c} color`}
        />
      ))}
    </div>
  ),
};

export const WithDescription: Story = {
  args: {
    variant: "bordered",
    label: "Favorite Fruit",
    labelPlacement: "outside",
    description: "Pick from the list. Sorted alphabetically.",
  },
  render: (args) => (
    <div style={{ maxWidth: 400 }}>
      <Select {...args} items={allFruits} placeholder="Pick a fruit" />
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
      <Select {...args} items={allFruits} placeholder="Pick a fruit" />
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
      <Select {...args} items={allFruits} placeholder="Pick a fruit" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { variant: "bordered", isDisabled: true },
  render: (args) => <Select {...args} items={allFruits} aria-label="Disabled select" placeholder="Disabled select" />,
};

export const FullWidth: Story = {
  args: { variant: "bordered", fullWidth: true, label: "Framework", labelPlacement: "outside" },
  render: (args) => (
    <div style={{ width: "100%" }}>
      <Select {...args} items={allFruits} placeholder="Choose..." />
    </div>
  ),
};
