import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Avatar, Button } from "@auronui/react";

const meta: Meta<typeof Badge> = {
  component: Badge,
  title: "Components/Badge",
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["default", "primary", "accent", "success", "warning", "danger"],
    },
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    variant: { control: "select", options: ["primary", "secondary", "soft"] },
    placement: {
      control: "select",
      options: ["top-right", "top-left", "bottom-right", "bottom-left"],
    },
  },
  args: {
    color: "danger",
    size: "md",
    variant: "primary",
    placement: "top-right",
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  render: (args) => (
    <Badge {...args} label="5">
      <Avatar name="JD" />
    </Badge>
  ),
};

export const OnAvatar: Story = {
  args: { color: "danger", placement: "top-right" },
  render: (args) => (
    <Badge {...args} label="3">
      <Avatar src="https://i.pravatar.cc/150?u=alex" />
    </Badge>
  ),
};

export const OnButton: Story = {
  args: { color: "danger" },
  render: (args) => (
    <Badge {...args} label="12">
      <Button variant="secondary">Inbox</Button>
    </Badge>
  ),
};

export const Dot: Story = {
  args: { size: "xs", color: "success", placement: "bottom-right" },
  render: (args) => (
    <Badge {...args}>
      <Avatar name="ON" />
    </Badge>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
      <Badge {...args} size="xs" color="success" placement="bottom-right">
        <Avatar name="X" />
      </Badge>
      <Badge {...args} size="sm" color="danger" label="2">
        <Avatar name="S" />
      </Badge>
      <Badge {...args} size="md" color="danger" label="5">
        <Avatar name="M" />
      </Badge>
      <Badge {...args} size="lg" color="danger" label="9+">
        <Avatar name="L" />
      </Badge>
    </div>
  ),
};

export const Colors: Story = {
  parameters: { controls: { exclude: ["color"] } },
  render: (args) => (
    <div style={{ display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap" }}>
      <Badge {...args} color="default" label="1"><Avatar name="D" /></Badge>
      <Badge {...args} color="primary" label="2"><Avatar name="P" /></Badge>
      <Badge {...args} color="accent" label="3"><Avatar name="A" /></Badge>
      <Badge {...args} color="success" label="4"><Avatar name="S" /></Badge>
      <Badge {...args} color="warning" label="5"><Avatar name="W" /></Badge>
      <Badge {...args} color="danger" label="6"><Avatar name="E" /></Badge>
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap" }}>
      <Badge {...args} variant="primary" color="danger" label="5"><Avatar name="P" /></Badge>
      <Badge {...args} variant="secondary" color="danger" label="5"><Avatar name="S" /></Badge>
      <Badge {...args} variant="soft" color="danger" label="5"><Avatar name="So" /></Badge>
    </div>
  ),
};

export const Placements: Story = {
  args: { size: "xs" },
  render: (args) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, auto)", gap: 32, alignItems: "center", justifyContent: "center" }}>
      <Badge {...args} placement="top-left" color="danger" label="1"><Avatar name="TL" size="lg" /></Badge>
      <Badge {...args} placement="top-right" color="danger" label="2"><Avatar name="TR" size="lg" /></Badge>
      <Badge {...args} placement="bottom-left" color="danger" label="3"><Avatar name="BL" size="lg" /></Badge>
      <Badge {...args} placement="bottom-right" color="danger" label="4"><Avatar name="BR" size="lg" /></Badge>
    </div>
  ),
};

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  args: { color: "default", size: "md", variant: "primary", placement: "top-right" },
  render: (args) => (
    <Badge
      {...args}
      label="7"
      classNames={{
        anchor: "ring-2 ring-blue-400",
        base: "bg-blue-500 border-2 border-blue-700",
        label: "text-white font-bold text-lg",
      }}
    >
      <Avatar name="CS" />
    </Badge>
  ),
};
