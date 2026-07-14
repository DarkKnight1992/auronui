import type { Meta, StoryObj } from "@storybook/react-vite";
import { Meter } from "@auronui/react";

const meta: Meta<typeof Meter> = {
  component: Meter,
  title: "Components/Meter",
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "accent", "success", "warning", "danger"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    minValue: { control: { type: "number" } },
    maxValue: { control: { type: "number" } },
  },
  args: {
    value: 50,
    minValue: 0,
    maxValue: 100,
    color: "primary",
    size: "md",
  },
};

export default meta;
type Story = StoryObj<typeof Meter>;

export const Default: Story = {
  render: (args) => <Meter {...args} />,
};

export const WithLabel: Story = {
  args: { value: 70, label: "CPU Usage" },
  render: (args) => <Meter {...args} />,
};

export const WithValueLabel: Story = {
  args: {
    value: 0.7,
    minValue: 0,
    maxValue: 1,
    label: "Memory",
    showValueLabel: true,
    formatOptions: { style: "percent" },
  },
  render: (args) => <Meter {...args} />,
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
      <Meter {...args} value={60} size="sm" label="Small" />
      <Meter {...args} value={60} size="md" label="Medium" />
      <Meter {...args} value={60} size="lg" label="Large" />
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
      <Meter {...args} value={60} color="default" label="Default" />
      <Meter {...args} value={60} color="primary" label="Primary" />
      <Meter {...args} value={60} color="secondary" label="Secondary" />
      <Meter {...args} value={60} color="accent" label="Accent" />
      <Meter {...args} value={60} color="success" label="Success" />
      <Meter {...args} value={60} color="warning" label="Warning" />
      <Meter {...args} value={60} color="danger" label="Danger" />
    </div>
  ),
};

export const CustomRange: Story = {
  args: {
    value: 150,
    minValue: 0,
    maxValue: 200,
    label: "Temperature (°C)",
    showValueLabel: true,
  },
  render: (args) => <Meter {...args} />,
};

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  args: {
    value: 65,
    minValue: 0,
    maxValue: 100,
    label: "System Load",
    showValueLabel: true,
    classNames: {
      base: "gap-3",
      label: "text-blue-600 font-semibold text-lg",
      output: "text-blue-700 font-bold",
      track: "border-2 border-blue-400 rounded-full bg-blue-50",
      fill: "bg-gradient-to-r from-blue-500 to-blue-600 rounded-full",
    },
  },
  render: (args) => <Meter {...args} />,
};
