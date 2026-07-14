import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Toolbar,
  ToolbarButton,
  ToolbarLink,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from "@auronui/react";

const meta: Meta<typeof Toolbar> = {
  title: "Components/Toolbar",
  component: Toolbar,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
  args: {
    orientation: "horizontal",
  },
};

export default meta;
type Story = StoryObj<typeof Toolbar>;

export const Horizontal: Story = {
  render: (args) => (
    <Toolbar {...args}>
      <ToolbarButton>New</ToolbarButton>
      <ToolbarButton>Open</ToolbarButton>
      <ToolbarSeparator />
      <ToolbarToggleGroup type="multiple">
        <ToolbarToggleItem value="bold">B</ToolbarToggleItem>
        <ToolbarToggleItem value="italic">I</ToolbarToggleItem>
        <ToolbarToggleItem value="underline">U</ToolbarToggleItem>
      </ToolbarToggleGroup>
      <ToolbarSeparator />
      <ToolbarLink href="https://example.com/docs">Docs</ToolbarLink>
    </Toolbar>
  ),
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <Toolbar {...args}>
      <ToolbarButton>Up</ToolbarButton>
      <ToolbarButton>Down</ToolbarButton>
      <ToolbarButton>Delete</ToolbarButton>
    </Toolbar>
  ),
};

export const SingleSelectToggle: Story = {
  render: (args) => (
    <Toolbar {...args}>
      <ToolbarToggleGroup type="single" defaultValue="center">
        <ToolbarToggleItem value="left">Left</ToolbarToggleItem>
        <ToolbarToggleItem value="center">Center</ToolbarToggleItem>
        <ToolbarToggleItem value="right">Right</ToolbarToggleItem>
      </ToolbarToggleGroup>
    </Toolbar>
  ),
};

export const ToggleGroupArrayAPI: Story = {
  name: "ToggleGroup: Array API (items prop)",
  render: (args) => (
    <Toolbar {...args}>
      <ToolbarToggleGroup
        type="multiple"
        items={[
          { value: "bold", label: "Bold" },
          { value: "italic", label: "Italic" },
          { value: "underline", label: "Underline" },
        ]}
      />
    </Toolbar>
  ),
};
