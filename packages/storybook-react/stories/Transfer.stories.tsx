import type { Meta, StoryObj } from "@storybook/react-vite";
import { Transfer } from "@auronui/react";

const items = [
  { value: "alice", label: "Alice Chen" },
  { value: "bob", label: "Bob Martinez" },
  { value: "carol", label: "Carol Nguyen" },
  { value: "dave", label: "Dave Patel" },
  { value: "erin", label: "Erin Walsh" },
  { value: "frank", label: "Frank O'Brien" },
];

const meta: Meta<typeof Transfer> = {
  title: "Data Display/Transfer",
  component: Transfer,
  tags: ["autodocs"],
  argTypes: {
    isDisabled: { control: "boolean" },
    isSearchable: { control: "boolean" },
  },
  args: {
    isDisabled: false,
    isSearchable: false,
  },
};

export default meta;
type Story = StoryObj<typeof Transfer>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Move items with the buttons after checking them, or drag a row directly onto the other panel — both work the same way underneath.",
      },
    },
  },
  render: (args) => (
    <div style={{ width: 480 }}>
      <Transfer {...args} items={items} defaultValue={["bob", "carol"]} titles={["Available", "Selected"]} />
    </div>
  ),
};

export const Searchable: Story = {
  args: { isSearchable: true },
  render: (args) => (
    <div style={{ width: 480 }}>
      <Transfer {...args} items={items} titles={["Available", "Selected"]} />
    </div>
  ),
};

export const WithDisabledItem: Story = {
  name: "With a disabled item",
  render: () => {
    const withDisabled = [...items, { value: "locked", label: "Locked User (cannot move)", isDisabled: true }];
    return (
      <div style={{ width: 480 }}>
        <Transfer items={withDisabled} defaultValue={["locked"]} titles={["Available", "Selected"]} />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: { isDisabled: true },
  render: (args) => (
    <div style={{ width: 480 }}>
      <Transfer {...args} items={items} defaultValue={["bob"]} titles={["Available", "Selected"]} />
    </div>
  ),
};
