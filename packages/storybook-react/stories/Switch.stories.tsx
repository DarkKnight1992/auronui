import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "@auronui/react";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    isDisabled: { control: "boolean" },
    isInvalid: { control: "boolean" },
  },
  args: {
    size: "md",
    isDisabled: false,
    isInvalid: false,
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: (args) => <Switch {...args}>Airplane mode</Switch>,
};

export const Checked: Story = {
  args: { defaultSelected: true },
  render: (args) => <Switch {...args}>Wi-Fi</Switch>,
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Switch {...args} size="sm">Small</Switch>
      <Switch {...args} size="md">Medium</Switch>
      <Switch {...args} size="lg">Large</Switch>
    </div>
  ),
};

export const Invalid: Story = {
  args: { isInvalid: true },
  render: (args) => <Switch {...args}>Accept required setting</Switch>,
};

export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Switch {...args} isDisabled>
        Disabled off
      </Switch>
      <Switch {...args} isDisabled defaultSelected>
        Disabled on
      </Switch>
    </div>
  ),
};
