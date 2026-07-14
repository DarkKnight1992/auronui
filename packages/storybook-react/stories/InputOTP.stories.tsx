import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputOTP } from "@auronui/react";

const meta: Meta<typeof InputOTP> = {
  title: "Components/InputOTP",
  component: InputOTP,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"],
    },
    length: { control: "number" },
    mask: { control: "boolean" },
    isDisabled: { control: "boolean" },
    isRequired: { control: "boolean" },
  },
  args: {
    variant: "primary",
    length: 6,
    mask: false,
    isDisabled: false,
    isRequired: false,
  },
};

export default meta;
type Story = StoryObj<typeof InputOTP>;

export const Default: Story = {
  render: (args) => <InputOTP {...args} aria-label="Verification code" />,
};

export const FourDigits: Story = {
  args: { length: 4 },
  render: (args) => <InputOTP {...args} aria-label="4-digit code" />,
};

export const Masked: Story = {
  args: { mask: true },
  render: (args) => <InputOTP {...args} aria-label="Masked code" />,
};

export const Prefilled: Story = {
  args: { defaultValue: "123" },
  render: (args) => <InputOTP {...args} aria-label="Prefilled code" />,
};

export const Disabled: Story = {
  args: { isDisabled: true, defaultValue: "123456" },
  render: (args) => <InputOTP {...args} aria-label="Disabled code" />,
};
