import type { Meta, StoryObj } from "@storybook/react-vite";
import { Surface } from "@auronui/react";

const meta: Meta<typeof Surface> = {
  component: Surface,
  title: "Components/Surface",
  tags: ["autodocs"],
  argTypes: {
    as: { control: "select", options: ["div", "section", "article", "aside"] },
    variant: {
      control: "select",
      options: ["default", "secondary", "tertiary", "transparent"],
    },
  },
  args: {
    as: "div",
    variant: "default",
  },
};

export default meta;
type Story = StoryObj<typeof Surface>;

export const Default: Story = {
  render: (args) => (
    <Surface {...args} style={{ padding: 16, borderRadius: 8 }}>
      <p style={{ margin: 0 }}>Surface content area</p>
    </Surface>
  ),
};

export const Secondary: Story = {
  args: { variant: "secondary" },
  render: (args) => (
    <Surface {...args} style={{ padding: 16, borderRadius: 8 }}>
      <p style={{ margin: 0 }}>Secondary surface</p>
    </Surface>
  ),
};

export const Tertiary: Story = {
  args: { variant: "tertiary" },
  render: (args) => (
    <Surface {...args} style={{ padding: 16, borderRadius: 8 }}>
      <p style={{ margin: 0 }}>Tertiary surface</p>
    </Surface>
  ),
};

export const Transparent: Story = {
  args: { variant: "transparent" },
  render: (args) => (
    <Surface {...args} style={{ padding: 16, borderRadius: 8, border: "1px dashed #ccc" }}>
      <p style={{ margin: 0 }}>Transparent surface (border added for visibility)</p>
    </Surface>
  ),
};

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Surface {...args} variant="default" style={{ padding: 16, borderRadius: 8 }}>
        <p style={{ margin: 0, fontWeight: 600 }}>Default</p>
        <p style={{ margin: "4px 0 0" }}>Base background surface</p>
      </Surface>
      <Surface {...args} variant="secondary" style={{ padding: 16, borderRadius: 8 }}>
        <p style={{ margin: 0, fontWeight: 600 }}>Secondary</p>
        <p style={{ margin: "4px 0 0" }}>Slightly elevated surface</p>
      </Surface>
      <Surface {...args} variant="tertiary" style={{ padding: 16, borderRadius: 8 }}>
        <p style={{ margin: 0, fontWeight: 600 }}>Tertiary</p>
        <p style={{ margin: "4px 0 0" }}>Most elevated surface</p>
      </Surface>
      <Surface {...args} variant="transparent" style={{ padding: 16, borderRadius: 8, border: "1px dashed #ccc" }}>
        <p style={{ margin: 0, fontWeight: 600 }}>Transparent</p>
        <p style={{ margin: "4px 0 0" }}>No background (border for visibility)</p>
      </Surface>
    </div>
  ),
};
