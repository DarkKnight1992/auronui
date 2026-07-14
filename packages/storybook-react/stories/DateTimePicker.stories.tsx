import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DateTimePicker } from "@auronui/react";
import { CalendarDateTime } from "@internationalized/date";

const BASE_VALUE = new CalendarDateTime(2024, 6, 15, 10, 30);
const BASE_VALUE_WITH_SECONDS = new CalendarDateTime(2024, 6, 15, 10, 30, 45);

const meta: Meta<typeof DateTimePicker> = {
  title: "Components/DateTimePicker",
  component: DateTimePicker,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["flat", "bordered", "faded", "underlined"],
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
      options: ["minute", "second"],
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
    label: "Date & Time",
    size: "md",
    color: "default",
    labelPlacement: "inside",
    granularity: "minute",
    isInvalid: false,
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof DateTimePicker>;

export const Default: Story = {
  args: {
    label: "Appointment",
    defaultValue: BASE_VALUE,
  },
  render: (args) => <DateTimePicker {...args} />,
};

export const WithSeconds: Story = {
  args: {
    label: "Date & Time with Seconds",
    granularity: "second",
    defaultValue: BASE_VALUE_WITH_SECONDS,
  },
  render: (args) => <DateTimePicker {...args} />,
};

export const TwelveHour: Story = {
  args: {
    label: "Date & Time (12h)",
    hourCycle: 12,
    defaultValue: BASE_VALUE,
  },
  render: (args) => <DateTimePicker {...args} />,
};

export const Controlled: Story = {
  name: "Controlled (value/onChange)",
  render: (args) => {
    function ControlledDateTimePicker() {
      const [value, setValue] = useState<CalendarDateTime | null>(BASE_VALUE);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 420 }}>
          <DateTimePicker {...args} value={value} onChange={(v) => setValue(v as CalendarDateTime | null)} />
          <p style={{ fontSize: "0.875rem", color: "#666" }}>Emitted value: {value ? value.toString() : "none"}</p>
        </div>
      );
    }
    return <ControlledDateTimePicker />;
  },
};
