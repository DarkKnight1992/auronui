import type { Meta, StoryObj } from "@storybook/react-vite";
import { Header } from "@auronui/react";

const meta: Meta<typeof Header> = {
  component: Header,
  title: "Components/Header",
  tags: ["autodocs"],
  argTypes: {
    as: { control: "select", options: ["h1", "h2", "h3", "h4", "h5", "h6"] },
  },
  args: {
    as: "h2",
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  render: (args) => <Header {...args}>Section Heading</Header>,
};

export const H1: Story = {
  args: { as: "h1" },
  render: (args) => <Header {...args}>Page Title (h1)</Header>,
};

export const H2: Story = {
  args: { as: "h2" },
  render: (args) => <Header {...args}>Section Heading (h2)</Header>,
};

export const H3: Story = {
  args: { as: "h3" },
  render: (args) => <Header {...args}>Subsection Heading (h3)</Header>,
};

export const AllLevels: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Header {...args} as="h1">Heading Level 1</Header>
      <Header {...args} as="h2">Heading Level 2</Header>
      <Header {...args} as="h3">Heading Level 3</Header>
      <Header {...args} as="h4">Heading Level 4</Header>
      <Header {...args} as="h5">Heading Level 5</Header>
      <Header {...args} as="h6">Heading Level 6</Header>
    </div>
  ),
};
