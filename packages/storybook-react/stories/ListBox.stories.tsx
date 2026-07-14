import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ListBox, ListBoxItem, ListBoxSection } from "@auronui/react";

const meta: Meta<typeof ListBox> = {
  title: "Components/ListBox",
  component: ListBox,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "flat", "bordered", "faded"],
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    isDisabled: { control: "boolean" },
    hideSelectedIcon: { control: "boolean" },
  },
  args: {
    variant: "default",
    isDisabled: false,
    hideSelectedIcon: false,
  },
};

export default meta;
type Story = StoryObj<typeof ListBox>;

export const Default: Story = {
  render: (args) => (
    <ListBox {...args} aria-label="Favorite fruit">
      <ListBoxItem value="apple">Apple</ListBoxItem>
      <ListBoxItem value="banana">Banana</ListBoxItem>
      <ListBoxItem value="cherry">Cherry</ListBoxItem>
      <ListBoxItem value="date">Date</ListBoxItem>
      <ListBoxItem value="elderberry">Elderberry</ListBoxItem>
    </ListBox>
  ),
};

export const SingleSelection: Story = {
  render: (args) => {
    function Demo() {
      const [selected, setSelected] = useState<string | string[] | undefined>("");
      return (
        <div>
          <p style={{ marginBottom: 8, fontSize: 14 }}>Selected: {selected || "none"}</p>
          <ListBox
            {...args}
            aria-label="Select a fruit"
            selectionMode="single"
            value={selected}
            onSelectionChange={setSelected}
          >
            <ListBoxItem value="apple">Apple</ListBoxItem>
            <ListBoxItem value="banana">Banana</ListBoxItem>
            <ListBoxItem value="cherry">Cherry</ListBoxItem>
            <ListBoxItem value="date">Date</ListBoxItem>
            <ListBoxItem value="elderberry">Elderberry</ListBoxItem>
          </ListBox>
        </div>
      );
    }
    return <Demo />;
  },
};

export const MultipleSelection: Story = {
  render: (args) => {
    function Demo() {
      const [selected, setSelected] = useState<string | string[] | undefined>(["apple", "cherry"]);
      return (
        <div>
          <p style={{ marginBottom: 8, fontSize: 14 }}>
            Selected: {Array.isArray(selected) ? selected.join(", ") || "none" : "none"}
          </p>
          <ListBox
            {...args}
            aria-label="Select fruits"
            selectionMode="multiple"
            value={selected}
            onSelectionChange={setSelected}
          >
            <ListBoxItem value="apple">Apple</ListBoxItem>
            <ListBoxItem value="banana">Banana</ListBoxItem>
            <ListBoxItem value="cherry">Cherry</ListBoxItem>
            <ListBoxItem value="date">Date</ListBoxItem>
            <ListBoxItem value="elderberry">Elderberry</ListBoxItem>
          </ListBox>
        </div>
      );
    }
    return <Demo />;
  },
};

export const WithSections: Story = {
  render: (args) => (
    <ListBox {...args} aria-label="Select food" selectionMode="single">
      <ListBoxSection title="Fruits">
        <ListBoxItem value="apple">Apple</ListBoxItem>
        <ListBoxItem value="banana">Banana</ListBoxItem>
        <ListBoxItem value="cherry">Cherry</ListBoxItem>
      </ListBoxSection>
      <ListBoxSection title="Vegetables">
        <ListBoxItem value="carrot">Carrot</ListBoxItem>
        <ListBoxItem value="broccoli">Broccoli</ListBoxItem>
        <ListBoxItem value="spinach">Spinach</ListBoxItem>
      </ListBoxSection>
    </ListBox>
  ),
};

export const WithDisabledItems: Story = {
  render: (args) => (
    <ListBox {...args} aria-label="Select a fruit" selectionMode="single">
      <ListBoxItem value="apple">Apple</ListBoxItem>
      <ListBoxItem value="banana" isDisabled>
        Banana (unavailable)
      </ListBoxItem>
      <ListBoxItem value="cherry">Cherry</ListBoxItem>
      <ListBoxItem value="date" isDisabled>
        Date (unavailable)
      </ListBoxItem>
      <ListBoxItem value="elderberry">Elderberry</ListBoxItem>
    </ListBox>
  ),
};

export const ArrayAPI: Story = {
  name: "Array API (items prop)",
  render: (args) => (
    <ListBox
      {...args}
      aria-label="Select a framework"
      items={[
        { value: "vue", label: "Vue" },
        { value: "react", label: "React" },
        { value: "svelte", label: "Svelte" },
        { value: "solid", label: "Solid" },
        { value: "angular", label: "Angular", disabled: true },
      ]}
    />
  ),
};
