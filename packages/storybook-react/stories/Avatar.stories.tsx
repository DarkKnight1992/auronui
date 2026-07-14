import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "@auronui/react";

const meta: Meta<typeof Avatar> = {
  component: Avatar,
  title: "Components/Avatar",
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "accent", "success", "warning", "danger"],
    },
    variant: {
      control: "select",
      options: ["default", "soft"],
    },
    isBordered: { control: "boolean" },
    isDisabled: { control: "boolean" },
    showFallback: { control: "boolean" },
  },
  args: {
    size: "md",
    color: "default",
    variant: "default",
    isBordered: false,
    isDisabled: false,
    showFallback: false,
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: { name: "Jane Doe" },
  render: (args) => <Avatar {...args} />,
};

export const WithImage: Story = {
  args: {
    src: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    alt: "Jane Doe",
    name: "Jane Doe",
  },
  render: (args) => <Avatar {...args} />,
};

export const WithInitials: Story = {
  args: { name: "John Smith" },
  render: (args) => <Avatar {...args} />,
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Avatar {...args} size="sm" name="SM" />
      <Avatar {...args} size="md" name="MD" />
      <Avatar {...args} size="lg" name="LG" />
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <Avatar {...args} color="default" name="DF" />
      <Avatar {...args} color="primary" name="PR" />
      <Avatar {...args} color="secondary" name="SE" />
      <Avatar {...args} color="accent" name="AC" />
      <Avatar {...args} color="success" name="SC" />
      <Avatar {...args} color="warning" name="WA" />
      <Avatar {...args} color="danger" name="DG" />
    </div>
  ),
};

export const SoftVariant: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <Avatar {...args} variant="soft" color="primary" name="PR" />
      <Avatar {...args} variant="soft" color="accent" name="AC" />
      <Avatar {...args} variant="soft" color="success" name="SC" />
      <Avatar {...args} variant="soft" color="warning" name="WA" />
      <Avatar {...args} variant="soft" color="danger" name="DG" />
    </div>
  ),
};

export const Bordered: Story = {
  args: { name: "Bob Carol", isBordered: true },
  render: (args) => <Avatar {...args} />,
};

export const Disabled: Story = {
  args: { name: "Bob Carol", isDisabled: true },
  render: (args) => <Avatar {...args} />,
};

export const ShowFallback: Story = {
  args: {
    src: "https://broken-image.example.com/photo.jpg",
    name: "Jane Doe",
    showFallback: true,
  },
  render: (args) => <Avatar {...args} />,
};

export const CustomFallback: Story = {
  render: (args) => <Avatar {...args} fallback={<span style={{ fontSize: "1.25rem" }}>🎭</span>} />,
};

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  args: { name: "Alex Rivera", size: "lg" },
  render: (args) => (
    <Avatar
      {...args}
      classNames={{
        base: "ring-4 ring-blue-500 shadow-lg",
        fallback: "bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold",
      }}
    />
  ),
};
