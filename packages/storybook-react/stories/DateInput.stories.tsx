import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DateInput } from "@auronui/react";
import { CalendarDate, CalendarDateTime } from "@internationalized/date";

const meta: Meta<typeof DateInput> = {
  title: "Components/DateInput",
  component: DateInput,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["flat", "faded", "bordered", "underlined", "raised"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "accent", "success", "warning", "danger"],
    },
    labelPlacement: {
      control: "select",
      options: ["inside", "outside", "outside-left"],
    },
    granularity: {
      control: "select",
      options: ["day", "hour", "minute", "second"],
    },
    hourCycle: {
      control: "select",
      options: [12, 24],
    },
    isInvalid: { control: "boolean" },
    isDisabled: { control: "boolean" },
    isReadOnly: { control: "boolean" },
    isRequired: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
  args: {
    label: "Date",
    variant: "flat",
    size: "md",
    color: "default",
    labelPlacement: "inside",
    isInvalid: false,
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof DateInput>;

export const Default: Story = {
  render: (args) => <DateInput {...args} />,
};

export const WithDefaultValue: Story = {
  args: { label: "Appointment Date" },
  render: (args) => <DateInput {...args} defaultValue={new CalendarDate(2024, 6, 15)} />,
};

export const WithTime: Story = {
  args: { label: "Appointment", granularity: "minute" },
  render: (args) => <DateInput {...args} defaultValue={new CalendarDateTime(2024, 6, 15, 10, 30)} />,
};

export const Controlled: Story = {
  name: "Controlled (value/onChange)",
  render: (args) => {
    function ControlledDateInput() {
      const [value, setValue] = useState<CalendarDate | null>(new CalendarDate(2024, 6, 15));
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 16 }}>
          <DateInput {...args} value={value} onChange={(v) => setValue(v as CalendarDate | null)} label="Appointment Date" />
          <p style={{ fontSize: 13, color: "#666" }}>Value: {value ? value.toString() : "none"}</p>
        </div>
      );
    }
    return <ControlledDateInput />;
  },
};

export const Invalid: Story = {
  args: { label: "Expiry Date", isInvalid: true, errorMessage: "Date is required" },
  render: (args) => <DateInput {...args} />,
};

export const Disabled: Story = {
  args: { label: "Locked Date", isDisabled: true },
  render: (args) => <DateInput {...args} defaultValue={new CalendarDate(2024, 3, 20)} />,
};
