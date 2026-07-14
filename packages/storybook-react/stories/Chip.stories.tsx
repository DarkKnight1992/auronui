import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip } from "@auronui/react";

const meta: Meta<typeof Chip> = {
  component: Chip,
  title: "Components/Chip",
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "accent", "success", "warning", "danger"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    variant: {
      control: "select",
      options: ["solid", "soft", "bordered", "text"],
    },
    dot: { control: "boolean" },
    isClosable: { control: "boolean" },
  },
  args: {
    color: "default",
    variant: "solid",
    size: "md",
    dot: false,
    isClosable: false,
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  render: (args) => <Chip {...args}>Label</Chip>,
};

export const Solid: Story = {
  args: { variant: "solid", color: "accent" },
  render: (args) => <Chip {...args}>Solid</Chip>,
};

export const Soft: Story = {
  args: { variant: "soft", color: "accent" },
  render: (args) => <Chip {...args}>Soft</Chip>,
};

export const Outlined: Story = {
  args: { variant: "bordered", color: "accent" },
  render: (args) => <Chip {...args}>Bordered</Chip>,
};

export const Text: Story = {
  args: { variant: "text", color: "accent" },
  render: (args) => <Chip {...args}>Text</Chip>,
};

export const WithDot: Story = {
  args: { dot: true, variant: "soft", color: "success" },
  render: (args) => <Chip {...args}>Active</Chip>,
};

export const Closable: Story = {
  args: { isClosable: true, variant: "soft", color: "accent" },
  render: (args) => (
    <Chip {...args} onClose={() => console.log("close clicked")}>
      Dismiss me
    </Chip>
  ),
};

export const WithStartContent: Story = {
  args: { variant: "soft", color: "success" },
  render: (args) => (
    <Chip
      {...args}
      startContent={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 12 2 2 4-4" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      }
    >
      Verified
    </Chip>
  ),
};

export const WithEndContent: Story = {
  args: { variant: "soft", color: "accent" },
  render: (args) => (
    <Chip
      {...args}
      endContent={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="m13 5 7 7-7 7" />
        </svg>
      }
    >
      Beta
    </Chip>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      <Chip {...args} size="sm" variant="soft" color="accent">Small</Chip>
      <Chip {...args} size="md" variant="soft" color="accent">Medium</Chip>
      <Chip {...args} size="lg" variant="soft" color="accent">Large</Chip>
    </div>
  ),
};

export const AllColors: Story = {
  parameters: { controls: { exclude: ["color"] } },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <Chip {...args} variant="solid" color="default">Default</Chip>
        <Chip {...args} variant="solid" color="primary">Primary</Chip>
        <Chip {...args} variant="solid" color="secondary">Secondary</Chip>
        <Chip {...args} variant="solid" color="accent">Accent</Chip>
        <Chip {...args} variant="solid" color="success">Success</Chip>
        <Chip {...args} variant="solid" color="warning">Warning</Chip>
        <Chip {...args} variant="solid" color="danger">Danger</Chip>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <Chip {...args} variant="soft" color="default">Default</Chip>
        <Chip {...args} variant="soft" color="primary">Primary</Chip>
        <Chip {...args} variant="soft" color="secondary">Secondary</Chip>
        <Chip {...args} variant="soft" color="accent">Accent</Chip>
        <Chip {...args} variant="soft" color="success">Success</Chip>
        <Chip {...args} variant="soft" color="warning">Warning</Chip>
        <Chip {...args} variant="soft" color="danger">Danger</Chip>
      </div>
    </div>
  ),
};

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      <Chip {...args} variant="solid" color="accent">Solid</Chip>
      <Chip {...args} variant="soft" color="accent">Soft</Chip>
      <Chip {...args} variant="bordered" color="accent">Bordered</Chip>
      <Chip {...args} variant="text" color="accent">Text</Chip>
    </div>
  ),
};

export const StatusPills: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      <Chip {...args} dot variant="soft" color="success">Online</Chip>
      <Chip {...args} dot variant="soft" color="warning">Away</Chip>
      <Chip {...args} dot variant="soft" color="danger">Offline</Chip>
      <Chip {...args} dot variant="soft" color="default">Idle</Chip>
    </div>
  ),
};

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  args: { variant: "soft" },
  render: (args) => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      <Chip
        {...args}
        classNames={{
          base: "border-2 border-blue-500 rounded-lg",
          label: "text-blue-600 font-semibold",
        }}
      >
        Custom Border
      </Chip>
      <Chip
        {...args}
        classNames={{
          base: "bg-purple-100 shadow-lg",
          label: "text-purple-700 font-bold",
        }}
      >
        Styled Base
      </Chip>
      <Chip
        {...args}
        dot
        classNames={{
          dot: "bg-green-500 shadow-md",
          label: "text-green-800",
        }}
      >
        Custom Dot
      </Chip>
    </div>
  ),
};
