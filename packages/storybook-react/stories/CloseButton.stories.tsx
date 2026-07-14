import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button, CloseButton, ButtonGroup } from "@auronui/react";

const meta: Meta<typeof CloseButton> = {
  title: "Components/CloseButton",
  component: CloseButton,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    variant: {
      control: "select",
      options: ["solid", "default", "bordered", "ghost", "soft"],
    },
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "accent", "success", "warning", "danger"],
    },
    isDisabled: { control: "boolean" },
    isLoading: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof CloseButton>;

export const Default: Story = {
  render: (args) => <CloseButton {...args} />,
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <CloseButton {...args} size="sm" />
      <CloseButton {...args} size="md" />
      <CloseButton {...args} size="lg" />
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <CloseButton {...args} color="default" />
      <CloseButton {...args} color="primary" />
      <CloseButton {...args} color="secondary" />
      <CloseButton {...args} color="accent" />
      <CloseButton {...args} color="success" />
      <CloseButton {...args} color="warning" />
      <CloseButton {...args} color="danger" />
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <CloseButton {...args} variant="solid" color="primary" />
      <CloseButton {...args} variant="default" color="primary" />
      <CloseButton {...args} variant="bordered" color="primary" />
      <CloseButton {...args} variant="ghost" color="primary" />
      <CloseButton {...args} variant="soft" color="primary" />
    </div>
  ),
};

export const DisabledState: Story = {
  render: (args) => <CloseButton {...args} isDisabled />,
};

export const CustomAriaLabel: Story = {
  render: (args) => <CloseButton {...args} aria-label="Dismiss notification" />,
};

export const InButtonGroup: Story = {
  render: (args) => {
    function Demo() {
      const [disabled, setDisabled] = useState(false);
      return (
        <div>
          <Button variant="ghost" style={{ marginBottom: 16 }} onClick={() => setDisabled((d) => !d)}>
            Toggle Group Disabled
          </Button>
          <ButtonGroup isDisabled={disabled}>
            <CloseButton {...args} aria-label="Close first" />
            <CloseButton {...args} aria-label="Close second" />
          </ButtonGroup>
        </div>
      );
    }
    return <Demo />;
  },
};
