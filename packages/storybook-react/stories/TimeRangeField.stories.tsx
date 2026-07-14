import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TimeRangeField, type TimeRange } from "@auronui/react";
import { Time } from "@internationalized/date";

const meta: Meta<typeof TimeRangeField> = {
  title: "Components/TimeRangeField",
  component: TimeRangeField,
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
    labelPlacement: {
      control: "select",
      options: ["inside", "outside", "outside-left"],
    },
    granularity: {
      control: "select",
      options: ["hour", "minute", "second"],
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
    label: "Meeting Window",
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
type Story = StoryObj<typeof TimeRangeField>;

export const Default: Story = {
  render: (args) => <TimeRangeField {...args} />,
};

export const WithDefaultValue: Story = {
  args: { label: "Work Hours" },
  render: (args) => <TimeRangeField {...args} defaultValue={{ start: new Time(9, 0), end: new Time(17, 0) }} />,
};

export const Invalid: Story = {
  args: {
    isInvalid: true,
    errorMessage: "End time must be after start time",
  },
  render: (args) => <TimeRangeField {...args} defaultValue={{ start: new Time(17, 0), end: new Time(9, 0) }} />,
};

export const Controlled: Story = {
  name: "Controlled (value/onChange)",
  render: (args) => {
    function ControlledTimeRangeField() {
      const [value, setValue] = useState<TimeRange | null>({ start: new Time(9, 0), end: new Time(17, 0) });
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 16 }}>
          <TimeRangeField {...args} value={value} onChange={setValue} label="Meeting Window" />
          <p style={{ fontSize: 13, color: "#666" }}>
            Value: {value ? `${value.start.toString()} – ${value.end.toString()}` : "none"}
          </p>
        </div>
      );
    }
    return <ControlledTimeRangeField />;
  },
};
