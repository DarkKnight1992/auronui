import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "@auronui/react";

const meta: Meta<typeof Text> = {
  component: Text,
  title: "Components/Text",
  tags: ["autodocs"],
  argTypes: {
    as: { control: "select", options: ["p", "span", "div", "h1", "h2"] },
    size: { control: "select", options: ["xs", "sm", "base", "lg", "xl"] },
    variant: {
      control: "select",
      options: ["default", "muted", "accent", "danger", "success"],
    },
  },
  args: {
    as: "p",
    size: "base",
    variant: "default",
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {
  render: (args) => <Text {...args}>The quick brown fox jumps over the lazy dog.</Text>,
};

export const ExtraSmall: Story = {
  args: { size: "xs" },
  render: (args) => <Text {...args}>Extra small text</Text>,
};

export const Small: Story = {
  args: { size: "sm" },
  render: (args) => <Text {...args}>Small text</Text>,
};

export const Large: Story = {
  args: { size: "lg" },
  render: (args) => <Text {...args}>Large text</Text>,
};

export const ExtraLarge: Story = {
  args: { size: "xl" },
  render: (args) => <Text {...args}>Extra large text</Text>,
};

export const Muted: Story = {
  args: { variant: "muted" },
  render: (args) => <Text {...args}>Muted text variant</Text>,
};

export const Accent: Story = {
  args: { variant: "accent" },
  render: (args) => <Text {...args}>Accent text variant</Text>,
};

export const Danger: Story = {
  args: { variant: "danger" },
  render: (args) => <Text {...args}>Danger text variant</Text>,
};

export const Success: Story = {
  args: { variant: "success" },
  render: (args) => <Text {...args}>Success text variant</Text>,
};

export const AsSpan: Story = {
  args: { as: "span" },
  render: (args) => <Text {...args}>Rendered as a span element</Text>,
};
