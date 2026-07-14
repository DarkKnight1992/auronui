import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DateRangePicker, type DateRange } from "@auronui/react";
import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date";

const meta: Meta<typeof DateRangePicker> = {
  title: "Components/DateRangePicker",
  component: DateRangePicker,
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
    label: "Date Range",
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
type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {
  render: (args) => <DateRangePicker {...args} />,
};

export const MinMax: Story = {
  args: {
    label: "Constrained Range",
    description: "Select a range within June 2024",
    defaultValue: {
      start: new CalendarDate(2024, 6, 10),
      end: new CalendarDate(2024, 6, 20),
    },
    minValue: new CalendarDate(2024, 6, 1),
    maxValue: new CalendarDate(2024, 6, 30),
  },
  render: (args) => <DateRangePicker {...args} />,
};

export const MultipleMonths: Story = {
  args: {
    label: "Date Range (2 months)",
    defaultValue: {
      start: today(getLocalTimeZone()),
      end: today(getLocalTimeZone()).add({ days: 10 }),
    },
    visibleMonths: 2,
  },
  render: (args) => <DateRangePicker {...args} />,
};

export const Controlled: Story = {
  name: "Controlled (value/onChange)",
  render: (args) => {
    function ControlledDateRangePicker() {
      const [value, setValue] = useState<DateRange | null>({
        start: new CalendarDate(2024, 6, 1),
        end: new CalendarDate(2024, 6, 15),
      });
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 16 }}>
          <DateRangePicker {...args} value={value} onChange={setValue} label="Date Range" />
          <p style={{ fontSize: 13, color: "#666" }}>
            Value: {value ? `${value.start.toString()} – ${value.end.toString()}` : "none"}
          </p>
        </div>
      );
    }
    return <ControlledDateRangePicker />;
  },
};
