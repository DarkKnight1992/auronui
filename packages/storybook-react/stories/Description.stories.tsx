import type { Meta, StoryObj } from "@storybook/react-vite";
import { Description, Input, Label } from "@auronui/react";

const meta: Meta<typeof Description> = {
  component: Description,
  title: "Form/Description",
  tags: ["autodocs"],
  argTypes: {
    id: { control: "text" },
  },
  args: {
    id: "description-1",
  },
};

export default meta;
type Story = StoryObj<typeof Description>;

export const Default: Story = {
  render: (args) => (
    <Description {...args}>This is a helpful description for the form field above.</Description>
  ),
};

export const WithLabel: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Label htmlFor="email-input">Email address</Label>
      <Input id="email-input" type="email" aria-describedby="email-desc" placeholder="you@example.com" />
      <Description {...args} id="email-desc">
        We&apos;ll never share your email with anyone else.
      </Description>
    </div>
  ),
};
