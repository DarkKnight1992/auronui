import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TimePicker } from "@auronui/react";
import { Time } from "@internationalized/date";

const BASE_VALUE = new Time(10, 30);
const BASE_VALUE_WITH_SECONDS = new Time(10, 30, 45);

const meta: Meta<typeof TimePicker> = {
  title: "Components/TimePicker",
  component: TimePicker,
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
      options: ["hour", "minute", "second"],
    },
    hourCycle: {
      control: "select",
      options: [12, 24],
    },
    closeOnSelect: { control: "boolean" },
    isInvalid: { control: "boolean" },
    isDisabled: { control: "boolean" },
    isReadOnly: { control: "boolean" },
    isRequired: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
  args: {
    label: "Time",
    variant: "flat",
    size: "md",
    color: "default",
    labelPlacement: "inside",
    granularity: "minute",
    isInvalid: false,
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
    fullWidth: false,
    closeOnSelect: true,
  },
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

export const Default: Story = {
  args: {
    label: "Appointment Time",
    defaultValue: BASE_VALUE,
  },
  render: (args) => <TimePicker {...args} />,
};

export const Granularity: Story = {
  args: {
    label: "Time with Seconds",
    granularity: "second",
    defaultValue: BASE_VALUE_WITH_SECONDS,
  },
  render: (args) => <TimePicker {...args} />,
};

export const HourCycle12: Story = {
  args: {
    label: "Time (12h)",
    hourCycle: 12,
    defaultValue: BASE_VALUE,
  },
  render: (args) => <TimePicker {...args} />,
};

export const Controlled: Story = {
  name: "Controlled (value/onChange)",
  render: (args) => {
    function ControlledTimePicker() {
      const [value, setValue] = useState<Time | null>(BASE_VALUE);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 280 }}>
          <TimePicker {...args} value={value} onChange={(v) => setValue(v as Time | null)} label="Time" />
          <p style={{ fontSize: "0.875rem", color: "#666" }}>Emitted value: {value ? value.toString() : "none"}</p>
        </div>
      );
    }
    return <ControlledTimePicker />;
  },
};
