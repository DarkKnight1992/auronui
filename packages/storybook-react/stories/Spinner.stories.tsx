import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "@auronui/react";

const meta: Meta<typeof Spinner> = {
  component: Spinner,
  title: "Components/Spinner",
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg", "xl"] },
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "accent", "current", "danger", "success", "warning"],
    },
  },
  args: {
    size: "md",
    color: "primary",
    label: "Loading",
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  render: (args) => <Spinner {...args} />,
};

export const Small: Story = { args: { size: "sm" }, render: (args) => <Spinner {...args} /> };
export const Large: Story = { args: { size: "lg" }, render: (args) => <Spinner {...args} /> };
export const ExtraLarge: Story = { args: { size: "xl" }, render: (args) => <Spinner {...args} /> };
export const Accent: Story = { args: { color: "accent" }, render: (args) => <Spinner {...args} /> };
export const Danger: Story = { args: { color: "danger" }, render: (args) => <Spinner {...args} /> };
export const Success: Story = { args: { color: "success" }, render: (args) => <Spinner {...args} /> };
export const Warning: Story = { args: { color: "warning" }, render: (args) => <Spinner {...args} /> };
export const Current: Story = { args: { color: "current" }, render: (args) => <Spinner {...args} /> };
