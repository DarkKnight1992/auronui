import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarGroup } from "@auronui/react";

const meta: Meta<typeof AvatarGroup> = {
  component: AvatarGroup,
  title: "Components/AvatarGroup",
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    isBordered: { control: "boolean" },
    isDisabled: { control: "boolean" },
    max: { control: "number" },
  },
  args: {
    size: "md",
    isBordered: false,
    isDisabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof AvatarGroup>;

export const Default: Story = {
  render: (args) => (
    <AvatarGroup {...args}>
      <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" name="Alice" />
      <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026705e" name="Bob" />
      <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026706f" name="Carol" />
    </AvatarGroup>
  ),
};

export const WithMax: Story = {
  render: (args) => (
    <AvatarGroup {...args} max={3}>
      <Avatar name="Alice Bob" />
      <Avatar name="Carol Dan" />
      <Avatar name="Eve Frank" />
      <Avatar name="Grace Hopper" />
      <Avatar name="Ivan Jones" />
    </AvatarGroup>
  ),
};

export const Bordered: Story = {
  render: (args) => (
    <AvatarGroup {...args} isBordered>
      <Avatar name="Alice Bob" />
      <Avatar name="Carol Dan" />
      <Avatar name="Eve Frank" />
    </AvatarGroup>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <AvatarGroup {...args} size="sm">
        <Avatar name="Alice Bob" />
        <Avatar name="Carol Dan" />
        <Avatar name="Eve Frank" />
      </AvatarGroup>
      <AvatarGroup {...args} size="md">
        <Avatar name="Alice Bob" />
        <Avatar name="Carol Dan" />
        <Avatar name="Eve Frank" />
      </AvatarGroup>
      <AvatarGroup {...args} size="lg">
        <Avatar name="Alice Bob" />
        <Avatar name="Carol Dan" />
        <Avatar name="Eve Frank" />
      </AvatarGroup>
    </div>
  ),
};

export const ArrayAPI: Story = {
  name: "Array API (avatars prop)",
  render: (args) => (
    <AvatarGroup
      {...args}
      isBordered
      max={4}
      avatars={[
        { name: "Alice Martin", src: "https://i.pravatar.cc/150?u=alice" },
        { name: "Bob Chen" },
        { name: "Carol White", src: "https://i.pravatar.cc/150?u=carol" },
        { name: "Dave Kim", src: "https://i.pravatar.cc/150?u=dave" },
        { name: "Eve Torres" },
        { name: "Frank Lee" },
      ]}
    />
  ),
};
