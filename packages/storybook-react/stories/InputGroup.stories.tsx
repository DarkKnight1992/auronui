import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@auronui/react";

const meta: Meta<typeof InputGroup> = {
  title: "Components/InputGroup",
  component: InputGroup,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["flat", "bordered", "faded", "underlined", "raised"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "accent", "success", "warning", "danger"],
    },
    isInvalid: { control: "boolean" },
    isDisabled: { control: "boolean" },
    isRequired: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
  args: {
    variant: "flat",
    size: "md",
    color: "default",
    isInvalid: false,
    isDisabled: false,
    isRequired: false,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof InputGroup>;

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const Default: Story = {
  args: {
    variant: "bordered",
    label: "Search",
  },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <InputGroup {...args}>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search…" />
      </InputGroup>
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 320 }}>
      {(["flat", "bordered", "faded", "underlined", "raised"] as const).map((variant) => (
        <InputGroup key={variant} {...args} variant={variant}>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder={`${variant} input group`} aria-label={`${variant} input group`} />
        </InputGroup>
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 320 }}>
      {(["default", "primary", "secondary", "accent", "success", "warning", "danger"] as const).map((color) => (
        <InputGroup key={color} {...args} variant="bordered" color={color}>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder={color} aria-label={`${color} input group`} />
        </InputGroup>
      ))}
    </div>
  ),
};

export const Invalid: Story = {
  args: {
    variant: "bordered",
    label: "Email",
    isInvalid: true,
    errorMessage: "Please enter a valid email address.",
  },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <InputGroup {...args}>
        <InputGroupInput type="email" placeholder="you@example.com" />
      </InputGroup>
    </div>
  ),
};

export const Disabled: Story = {
  args: { variant: "bordered", isDisabled: true, label: "Disabled" },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <InputGroup {...args}>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput placeholder="Disabled" />
      </InputGroup>
    </div>
  ),
};
