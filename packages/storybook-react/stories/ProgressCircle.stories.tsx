import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressCircle } from "@auronui/react";

const meta: Meta<typeof ProgressCircle> = {
  component: ProgressCircle,
  title: "Components/ProgressCircle",
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "accent", "success", "warning", "danger"],
    },
    strokeWidth: { control: "number" },
  },
  args: {
    value: 75,
    maxValue: 100,
    size: "md",
    color: "primary",
    strokeWidth: 3,
  },
};

export default meta;
type Story = StoryObj<typeof ProgressCircle>;

export const Default: Story = {
  render: (args) => <ProgressCircle {...args} />,
};

export const Determinate: Story = {
  args: { value: 75, label: "Upload progress", showValueLabel: true },
  render: (args) => <ProgressCircle {...args} />,
};

export const Indeterminate: Story = {
  args: { value: null, label: "Loading" },
  render: (args) => <ProgressCircle {...args} />,
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      <ProgressCircle {...args} value={60} size="sm" label="Small" />
      <ProgressCircle {...args} value={60} size="md" label="Medium" />
      <ProgressCircle {...args} value={60} size="lg" label="Large" />
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
      <ProgressCircle {...args} value={60} color="default" label="Default" />
      <ProgressCircle {...args} value={60} color="primary" label="Primary" />
      <ProgressCircle {...args} value={60} color="secondary" label="Secondary" />
      <ProgressCircle {...args} value={60} color="accent" label="Accent" />
      <ProgressCircle {...args} value={60} color="success" label="Success" />
      <ProgressCircle {...args} value={60} color="warning" label="Warning" />
      <ProgressCircle {...args} value={60} color="danger" label="Danger" />
    </div>
  ),
};

export const WithValueLabel: Story = {
  args: { value: 75, showValueLabel: true, label: "Progress" },
  render: (args) => <ProgressCircle {...args} />,
};

export const CustomStrokeWidth: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      <ProgressCircle {...args} value={60} strokeWidth={1} label="Thin (1)" />
      <ProgressCircle {...args} value={60} strokeWidth={3} label="Default (3)" />
      <ProgressCircle {...args} value={60} strokeWidth={5} label="Thick (5)" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { value: 50, isDisabled: true, label: "Disabled" },
  render: (args) => <ProgressCircle {...args} />,
};

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  args: {
    value: 65,
    label: "Custom styled",
    showValueLabel: true,
    classNames: {
      svg: "drop-shadow-lg",
      track: "stroke-blue-200",
      indicator: "stroke-blue-600",
      value: "text-blue-700 font-bold text-sm",
    },
  },
  render: (args) => <ProgressCircle {...args} />,
};
