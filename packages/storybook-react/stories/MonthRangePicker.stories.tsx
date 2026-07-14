import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarDate } from "@internationalized/date";
import { MonthRangePicker } from "@auronui/react";

const meta: Meta<typeof MonthRangePicker> = {
  title: "Components/MonthRangePicker",
  component: MonthRangePicker,
  tags: ["autodocs"],
  argTypes: {
    isReadOnly: { control: "boolean" },
    isDisabled: { control: "boolean" },
    locale: { control: "text" },
    maximumMonths: { control: "number" },
    classNames: {
      control: "object",
      description: "Per-slot class overrides. Keys match the component anatomy slot names.",
    },
  },
  args: {
    isReadOnly: false,
    isDisabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof MonthRangePicker>;

export const Default: Story = {
  render: (args) => <MonthRangePicker {...args} />,
};

export const WithSelectedRange: Story = {
  args: {
    defaultValue: {
      start: new CalendarDate(2024, 3, 1),
      end: new CalendarDate(2024, 8, 1),
    },
  },
  render: (args) => <MonthRangePicker {...args} />,
};

export const MinMax: Story = {
  args: {
    defaultValue: {
      start: new CalendarDate(2024, 3, 1),
      end: new CalendarDate(2024, 6, 1),
    },
    minValue: new CalendarDate(2024, 2, 1),
    maxValue: new CalendarDate(2024, 10, 1),
  },
  render: (args) => <MonthRangePicker {...args} />,
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
    defaultValue: {
      start: new CalendarDate(2024, 3, 1),
      end: new CalendarDate(2024, 8, 1),
    },
  },
  render: (args) => <MonthRangePicker {...args} />,
};

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  args: {
    defaultValue: {
      start: new CalendarDate(2024, 3, 1),
      end: new CalendarDate(2024, 6, 1),
    },
    classNames: {
      base: "border-2 border-blue-500 rounded-lg p-4",
      header: "mb-4 pb-3 border-b-2 border-blue-200",
      navButton: "text-blue-600 hover:bg-blue-100 rounded-md",
      heading: "text-lg font-semibold text-blue-700",
      cell: "hover:bg-blue-50 text-blue-900",
    },
  },
  render: (args) => <MonthRangePicker {...args} />,
};
