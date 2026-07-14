import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComboBox } from "@auronui/react";

const meta: Meta<typeof ComboBox> = {
  component: ComboBox,
  title: "Components/ComboBox",
  tags: ["autodocs"],
  argTypes: {
    fullWidth: { control: "boolean" },
    isDisabled: { control: "boolean" },
    isInvalid: { control: "boolean" },
    isRequired: { control: "boolean" },
    allowsCustomValue: { control: "boolean" },
  },
  args: {
    fullWidth: false,
    isDisabled: false,
    isInvalid: false,
    isRequired: false,
    allowsCustomValue: false,
  },
};

export default meta;
type Story = StoryObj<typeof ComboBox>;

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
];

const animals = [
  { value: "cat", label: "Cat" },
  { value: "dog", label: "Dog" },
  { value: "elephant", label: "Elephant" },
  { value: "fox", label: "Fox" },
  { value: "giraffe", label: "Giraffe" },
];

const disabledFruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana", isDisabled: true },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date", isDisabled: true },
  { value: "elderberry", label: "Elderberry" },
];

export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <ComboBox {...args} items={fruits} placeholder="Select a fruit..." aria-label="Playground combobox" />
    </div>
  ),
};

export const WithDescription: Story = {
  render: (args) => (
    <ComboBox
      {...args}
      items={fruits}
      label="Favorite Fruit"
      description="Choose your favorite fruit from the list."
      placeholder="Search a fruit..."
      aria-label="Favorite fruit picker"
    />
  ),
};

export const WithErrorMessage: Story = {
  args: { isInvalid: true },
  render: (args) => (
    <ComboBox
      {...args}
      items={fruits}
      label="Favorite Fruit"
      errorMessage="Please select a valid fruit."
      placeholder="Search a fruit..."
      aria-label="Favorite fruit picker"
    />
  ),
};

export const WithDisabledItems: Story = {
  render: (args) => (
    <ComboBox
      {...args}
      items={disabledFruits}
      label="Favorite Fruit"
      placeholder="Search a fruit..."
      aria-label="Favorite fruit picker"
    />
  ),
};

export const Disabled: Story = {
  args: { isDisabled: true },
  render: (args) => (
    <ComboBox
      {...args}
      items={fruits}
      label="Favorite Fruit"
      placeholder="Search a fruit..."
      aria-label="Favorite fruit picker"
    />
  ),
};

export const AllowsCustomValue: Story = {
  args: { allowsCustomValue: true },
  render: (args) => (
    <ComboBox
      {...args}
      items={fruits}
      label="Favorite Fruit"
      placeholder="Type anything..."
      aria-label="Favorite fruit picker"
    />
  ),
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  render: (args) => (
    <ComboBox
      {...args}
      items={fruits}
      label="Favorite Fruit"
      placeholder="Search a fruit..."
      aria-label="Favorite fruit picker"
    />
  ),
};

export const MultipleCategories: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      <ComboBox {...args} items={fruits} label="Fruits" placeholder="Search fruits..." aria-label="Fruit picker" />
      <ComboBox {...args} items={animals} label="Animals" placeholder="Search animals..." aria-label="Animal picker" />
    </div>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    function Demo() {
      const [selected, setSelected] = useState("");
      return (
        <div>
          <ComboBox
            {...args}
            items={fruits}
            value={selected}
            onValueChange={setSelected}
            label="Favorite Fruit"
            placeholder="Search a fruit..."
            aria-label="Controlled fruit picker"
          />
          <p style={{ marginTop: 12, fontSize: 14, color: "#64748b" }}>
            Selected: <strong>{selected || "(none)"}</strong>
          </p>
        </div>
      );
    }
    return <Demo />;
  },
};
