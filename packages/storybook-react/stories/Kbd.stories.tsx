import type { Meta, StoryObj } from "@storybook/react-vite";
import { Kbd } from "@auronui/react";

const meta: Meta<typeof Kbd> = {
  component: Kbd,
  title: "Components/Kbd",
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "light"] },
  },
  args: {
    variant: "default",
  },
};

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Default: Story = {
  render: (args) => <Kbd {...args}>⌘K</Kbd>,
};

export const Light: Story = {
  args: { variant: "light" },
  render: (args) => <Kbd {...args}>⌘K</Kbd>,
};

export const WithAbbr: Story = {
  render: (args) => (
    <Kbd {...args} abbr="Ctrl">
      C
    </Kbd>
  ),
};

export const CommonShortcuts: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      <Kbd {...args}>⌘</Kbd>
      <Kbd {...args}>⌥</Kbd>
      <Kbd {...args}>⇧</Kbd>
      <Kbd {...args}>⌃</Kbd>
      <Kbd {...args}>⌫</Kbd>
      <Kbd {...args}>↵</Kbd>
      <Kbd {...args}>⎋</Kbd>
      <Kbd {...args}>⇥</Kbd>
    </div>
  ),
};

export const LightVariantShowcase: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Kbd {...args} variant="default">⌘K</Kbd>
      <span style={{ fontSize: 12, color: "#888" }}>vs</span>
      <Kbd {...args} variant="light">⌘K</Kbd>
    </div>
  ),
};

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  render: (args) => (
    <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
      <Kbd
        {...args}
        classNames={{
          base: "border-2 border-blue-500 bg-blue-50 rounded-lg",
          content: "text-blue-700 font-semibold",
        }}
      >
        ⌘K
      </Kbd>
      <Kbd
        {...args}
        abbr="Ctrl"
        classNames={{
          base: "border-2 border-purple-500 bg-purple-50",
          abbr: "text-purple-600 font-bold",
          content: "text-purple-700",
        }}
      >
        C
      </Kbd>
    </div>
  ),
};
