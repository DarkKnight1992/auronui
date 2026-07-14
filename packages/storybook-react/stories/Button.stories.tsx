import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@auronui/react";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "default", "bordered", "ghost", "soft"],
    },
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "accent", "success", "warning", "danger"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    radius: {
      control: "select",
      options: [undefined, "none", "sm", "md", "lg", "full"],
    },
    isIconOnly: { control: "boolean" },
    fullWidth: { control: "boolean" },
    isDisabled: { control: "boolean" },
    isLoading: { control: "boolean" },
  },
  args: {
    variant: "solid",
    color: "primary",
    size: "md",
    radius: undefined,
    isIconOnly: false,
    fullWidth: false,
    isDisabled: false,
    isLoading: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  render: (args) => <Button {...args}>Click me</Button>,
};

export const AllVariants: Story = {
  args: { isLoading: false, size: "sm", color: "primary" },
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <Button {...args} variant="solid">Solid</Button>
      <Button {...args} variant="soft">Soft</Button>
      <Button {...args} variant="default">Default</Button>
      <Button {...args} variant="bordered">Bordered</Button>
      <Button {...args} variant="ghost">Ghost</Button>
    </div>
  ),
};

export const AllColors: Story = {
  args: { isLoading: false, size: "sm", variant: "solid" },
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <Button {...args} color="default">Default</Button>
      <Button {...args} color="primary">Primary</Button>
      <Button {...args} color="secondary">Secondary</Button>
      <Button {...args} color="accent">Accent</Button>
      <Button {...args} color="success">Success</Button>
      <Button {...args} color="warning">Warning</Button>
      <Button {...args} color="danger">Danger</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
};

export const Loading: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 8 }}>
      <Button {...args} isLoading size="sm">Loading</Button>
      <Button {...args} isLoading size="md">Loading</Button>
      <Button {...args} isLoading size="lg">Loading</Button>
    </div>
  ),
};

export const DisabledState: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 8 }}>
      <Button {...args} isDisabled variant="solid">Disabled Solid</Button>
      <Button {...args} isDisabled variant="bordered">Disabled Bordered</Button>
    </div>
  ),
};

export const FullWidth: Story = {
  render: (args) => <Button {...args} fullWidth>Full Width Button</Button>,
};

export const WithContentSlots: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 8 }}>
      <Button {...args} startContent={<span>★</span>}>With Icon</Button>
      <Button {...args} endContent={<span>→</span>}>With Icon</Button>
    </div>
  ),
};

export const AllRadii: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
      <Button {...args} radius="none">None</Button>
      <Button {...args} radius="sm">Small</Button>
      <Button {...args} radius="md">Medium</Button>
      <Button {...args} radius="lg">Large</Button>
      <Button {...args} radius="full">Full</Button>
    </div>
  ),
};
