import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "@auronui/react";

const meta: Meta<typeof Separator> = {
  component: Separator,
  title: "Components/Separator",
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    variant: { control: "select", options: ["default", "dashed"] },
  },
  args: {
    orientation: "horizontal",
    variant: "default",
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Default: Story = {
  render: (args) => <Separator {...args} />,
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div style={{ display: "flex", height: 64, alignItems: "center" }}>
      <Separator {...args} />
    </div>
  ),
};

export const Dashed: Story = {
  args: { variant: "dashed" },
  render: (args) => <Separator {...args} />,
};

export const WithLabel: Story = {
  args: { orientation: "horizontal" },
  render: (args) => <Separator {...args}>OR</Separator>,
};
