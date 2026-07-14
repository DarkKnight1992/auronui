import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DatePicker } from "@auronui/react";
import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date";

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
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
    visibleMonths: { control: "number" },
    closeOnSelect: { control: "boolean" },
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
    visibleMonths: 1,
    closeOnSelect: true,
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: (args) => <DatePicker {...args} />,
};

export const MinMax: Story = {
  args: {
    label: "Constrained Date",
    description: "Select a date in June 2024",
    defaultValue: new CalendarDate(2024, 6, 15),
    minValue: new CalendarDate(2024, 6, 1),
    maxValue: new CalendarDate(2024, 6, 30),
  },
  render: (args) => <DatePicker {...args} />,
};

export const UnavailableDates: Story = {
  args: {
    label: "Business days only",
    description: "Weekends are unavailable",
    defaultValue: today(getLocalTimeZone()),
  },
  render: (args) => (
    <DatePicker
      {...args}
      isDateUnavailable={(date) => {
        const d = date.toDate(getLocalTimeZone()).getDay();
        return d === 0 || d === 6;
      }}
    />
  ),
};

export const Controlled: Story = {
  name: "Controlled (value/onChange)",
  render: (args) => {
    function ControlledDatePicker() {
      const [value, setValue] = useState<CalendarDate | null>(new CalendarDate(2024, 6, 15));
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 16 }}>
          <DatePicker {...args} value={value} onChange={(v) => setValue(v as CalendarDate | null)} label="Date" />
          <p style={{ fontSize: 13, color: "#666" }}>Value: {value ? value.toString() : "none"}</p>
        </div>
      );
    }
    return <ControlledDatePicker />;
  },
};
