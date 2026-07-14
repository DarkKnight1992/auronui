import type { Meta, StoryObj } from "@storybook/react-vite";
import { Fieldset, Input } from "@auronui/react";

const meta: Meta<typeof Fieldset> = {
  component: Fieldset,
  title: "Form/Fieldset",
  tags: ["autodocs"],
  argTypes: {
    isDisabled: { control: "boolean" },
  },
  args: {
    legend: "Personal Information",
    isDisabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Fieldset>;

export const Default: Story = {
  render: (args) => (
    <Fieldset {...args} style={{ padding: 16, border: "1px solid #e2e8f0", borderRadius: 8, maxWidth: 400 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
        <Input label="First Name" placeholder="Jane" variant="bordered" />
        <Input label="Last Name" placeholder="Doe" variant="bordered" />
      </div>
    </Fieldset>
  ),
};

export const Disabled: Story = {
  args: { legend: "Account Settings", isDisabled: true },
  render: (args) => (
    <Fieldset
      {...args}
      style={{ padding: 16, border: "1px solid #e2e8f0", borderRadius: 8, maxWidth: 400, opacity: 0.6 }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
        <Input label="First Name" placeholder="Jane" variant="bordered" />
        <Input label="Email" placeholder="john@example.com" variant="bordered" />
      </div>
      <p style={{ marginTop: 8, fontSize: 12, color: "#9ca3af" }}>
        (All controls inside are natively disabled)
      </p>
    </Fieldset>
  ),
};

export const WithoutLegend: Story = {
  args: { legend: undefined },
  render: (args) => (
    <Fieldset {...args} style={{ padding: 16, border: "1px solid #e2e8f0", borderRadius: 8, maxWidth: 400 }}>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <Input label="City" placeholder="New York" variant="bordered" />
        </div>
        <div style={{ flex: "0 0 80px" }}>
          <Input label="ZIP" placeholder="10001" variant="bordered" />
        </div>
      </div>
    </Fieldset>
  ),
};

export const WithCustomClass: Story = {
  args: { legend: "Custom Styled" },
  render: (args) => (
    <Fieldset
      {...args}
      style={{ padding: 16, border: "2px solid #3b82f6", borderRadius: 8, maxWidth: 400 }}
    >
      <div style={{ marginTop: 8 }}>
        <Input label="Custom Field" placeholder="Custom fieldset" variant="bordered" />
      </div>
    </Fieldset>
  ),
};
