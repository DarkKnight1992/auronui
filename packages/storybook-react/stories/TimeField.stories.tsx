import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TimeField } from "@auronui/react";
import { Time } from "@internationalized/date";

const meta: Meta<typeof TimeField> = {
  title: "Components/TimeField",
  component: TimeField,
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
    label: "Time",
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
type Story = StoryObj<typeof TimeField>;

export const Default: Story = {
  render: (args) => <TimeField {...args} />,
};

export const WithSeconds: Story = {
  args: { label: "Precise Time", granularity: "second" },
  render: (args) => <TimeField {...args} defaultValue={new Time(9, 15, 30)} />,
};

export const MinMax: Story = {
  args: {
    label: "Business hours",
    description: "Select a time between 9am and 5pm",
  },
  render: (args) => <TimeField {...args} defaultValue={new Time(10, 30)} minValue={new Time(9, 0)} maxValue={new Time(17, 0)} />,
};

export const Controlled: Story = {
  name: "Controlled (value/onChange)",
  render: (args) => {
    function ControlledTimeField() {
      const [value, setValue] = useState<Time | null>(new Time(10, 30));
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 16 }}>
          <TimeField {...args} value={value} onChange={(v) => setValue(v as Time | null)} label="Time" />
          <p style={{ fontSize: 13, color: "#666" }}>Value: {value ? value.toString() : "none"}</p>
        </div>
      );
    }
    return <ControlledTimeField />;
  },
};

export const Invalid: Story = {
  args: {
    label: "Required Time",
    isInvalid: true,
    errorMessage: "Time is required",
  },
  render: (args) => <TimeField {...args} />,
};
