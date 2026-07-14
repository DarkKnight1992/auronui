import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date";
import { RangeCalendar } from "@auronui/react";

const meta: Meta<typeof RangeCalendar> = {
  title: "Components/RangeCalendar",
  component: RangeCalendar,
  tags: ["autodocs"],
  argTypes: {
    numberOfMonths: { control: "number" },
    isReadOnly: { control: "boolean" },
    isDisabled: { control: "boolean" },
    locale: { control: "text" },
    weekdayFormat: {
      control: "select",
      options: ["narrow", "short", "long"],
    },
    weekStartsOn: {
      control: "select",
      options: [0, 1, 2, 3, 4, 5, 6],
    },
    initialFocus: { control: "boolean" },
    classNames: {
      control: "object",
      description: "Per-slot class overrides. Keys match the component anatomy slot names.",
    },
  },
  args: {
    numberOfMonths: 1,
    isReadOnly: false,
    isDisabled: false,
    initialFocus: false,
  },
};

export default meta;
type Story = StoryObj<typeof RangeCalendar>;

export const Default: Story = {
  render: (args) => <RangeCalendar {...args} />,
};

export const WithDefaultRange: Story = {
  args: {
    defaultValue: {
      start: new CalendarDate(2024, 6, 10),
      end: new CalendarDate(2024, 6, 20),
    },
  },
  render: (args) => <RangeCalendar {...args} />,
};

export const MinMax: Story = {
  args: {
    minValue: new CalendarDate(2024, 6, 5),
    maxValue: new CalendarDate(2024, 6, 25),
    defaultValue: {
      start: new CalendarDate(2024, 6, 10),
      end: new CalendarDate(2024, 6, 15),
    },
  },
  render: (args) => <RangeCalendar {...args} />,
};

export const DisabledDates: Story = {
  args: {
    isDateDisabled: (date) => date.day % 7 === 0,
  },
  render: (args) => <RangeCalendar {...args} />,
};

export const MultipleMonths: Story = {
  args: {
    numberOfMonths: 2,
    defaultValue: {
      start: new CalendarDate(2024, 6, 10),
      end: new CalendarDate(2024, 7, 5),
    },
  },
  render: (args) => <RangeCalendar {...args} />,
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
    defaultValue: {
      start: new CalendarDate(2024, 6, 10),
      end: new CalendarDate(2024, 6, 20),
    },
  },
  render: (args) => <RangeCalendar {...args} />,
};

export const Readonly: Story = {
  args: {
    isReadOnly: true,
    defaultValue: {
      start: new CalendarDate(2024, 6, 10),
      end: new CalendarDate(2024, 6, 20),
    },
  },
  render: (args) => <RangeCalendar {...args} />,
};

export const ViewSwitching: Story = {
  args: {
    defaultValue: {
      start: new CalendarDate(2024, 6, 10),
      end: new CalendarDate(2024, 6, 20),
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Click the month+year heading to cycle through date → month → year → date views. Selecting a month returns to date view focused on that month; selecting a year returns to month view for that year.",
      },
    },
  },
  render: (args) => <RangeCalendar {...args} />,
};

export const Today: Story = {
  args: {
    defaultPlaceholder: today(getLocalTimeZone()),
  },
  render: (args) => <RangeCalendar {...args} />,
};

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  args: {
    defaultValue: {
      start: new CalendarDate(2024, 6, 10),
      end: new CalendarDate(2024, 6, 20),
    },
    classNames: {
      base: "border-2 border-purple-500 rounded-lg p-4",
      header: "bg-purple-50 mb-4",
      heading: "text-purple-700 font-bold text-lg",
      headingButton: "hover:bg-purple-100 rounded px-2 py-1",
      navButton: "text-purple-600 hover:bg-purple-100 rounded",
      grid: "border border-purple-200 rounded",
      cellButton:
        "hover:bg-purple-200 data-[selected]:bg-purple-500 data-[selected]:text-white rounded",
    },
  },
  render: (args) => <RangeCalendar {...args} />,
};
