import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DateRangeField, type DateRange } from "@auronui/react";
import { CalendarDate } from "@internationalized/date";

const meta: Meta<typeof DateRangeField> = {
  title: "Components/DateRangeField",
  component: DateRangeField,
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
  },
};

export default meta;
type Story = StoryObj<typeof DateRangeField>;

export const Default: Story = {
  render: (args) => <DateRangeField {...args} />,
};

export const WithDefaultValue: Story = {
  args: {
    label: "Trip Dates",
    defaultValue: {
      start: new CalendarDate(2024, 6, 10),
      end: new CalendarDate(2024, 6, 20),
    },
  },
  render: (args) => <DateRangeField {...args} />,
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
  render: (args) => <DateRangeField {...args} />,
};

export const Controlled: Story = {
  name: "Controlled (value/onChange)",
  render: (args) => {
    function ControlledDateRangeField() {
      const [value, setValue] = useState<DateRange | null>({
        start: new CalendarDate(2024, 6, 1),
        end: new CalendarDate(2024, 6, 15),
      });
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 16 }}>
          <DateRangeField {...args} value={value} onChange={setValue} label="Date Range" />
          <p style={{ fontSize: 13, color: "#666" }}>
            Value: {value ? `${value.start.toString()} – ${value.end.toString()}` : "none"}
          </p>
        </div>
      );
    }
    return <ControlledDateRangeField />;
  },
};

export const Invalid: Story = {
  args: {
    label: "Event Dates",
    isInvalid: true,
    errorMessage: "Please select a valid date range",
  },
  render: (args) => <DateRangeField {...args} />,
};
