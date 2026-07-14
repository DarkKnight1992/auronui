import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressBar } from "@auronui/react";

const meta: Meta<typeof ProgressBar> = {
  component: ProgressBar,
  title: "Components/ProgressBar",
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "accent", "success", "warning", "danger"],
    },
    radius: {
      control: "select",
      options: ["none", "sm", "md", "lg", "full"],
    },
  },
  args: {
    value: 60,
    maxValue: 100,
    size: "md",
    color: "primary",
    radius: "full",
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  render: (args) => <ProgressBar {...args} />,
};

export const Determinate: Story = {
  args: { value: 60, label: "File upload", showValueLabel: true },
  render: (args) => <ProgressBar {...args} />,
};

export const Indeterminate: Story = {
  args: { value: null, label: "Loading...", isIndeterminate: true },
  render: (args) => <ProgressBar {...args} />,
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
      <ProgressBar {...args} value={40} size="sm" label="Small" />
      <ProgressBar {...args} value={60} size="md" label="Medium" />
      <ProgressBar {...args} value={80} size="lg" label="Large" />
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
      <ProgressBar {...args} value={60} color="default" label="Default" />
      <ProgressBar {...args} value={60} color="primary" label="Primary" />
      <ProgressBar {...args} value={60} color="secondary" label="Secondary" />
      <ProgressBar {...args} value={60} color="accent" label="Accent" />
      <ProgressBar {...args} value={60} color="success" label="Success" />
      <ProgressBar {...args} value={60} color="warning" label="Warning" />
      <ProgressBar {...args} value={60} color="danger" label="Danger" />
    </div>
  ),
};

export const Striped: Story = {
  args: { value: 70, isStriped: true, label: "Striped progress" },
  render: (args) => <ProgressBar {...args} />,
};

export const WithValueLabel: Story = {
  args: { value: 75, label: "Progress", showValueLabel: true },
  render: (args) => <ProgressBar {...args} />,
};

export const Disabled: Story = {
  args: { value: 50, isDisabled: true, label: "Disabled" },
  render: (args) => <ProgressBar {...args} />,
};

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  args: {
    value: 65,
    label: "Custom styled progress",
    showValueLabel: true,
    classNames: {
      labelWrapper: "gap-3",
      label: "text-blue-600 font-semibold",
      value: "text-green-600 font-bold",
      track: "border-2 border-blue-400 bg-blue-50",
      indicator: "bg-gradient-to-r from-blue-500 to-purple-500",
    },
  },
  render: (args) => <ProgressBar {...args} />,
};
