import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date";
import { RangeCalendar } from "@auronui/vue";

const meta: Meta<typeof RangeCalendar> = {
  component: RangeCalendar,
  title: "Components/RangeCalendar",
  tags: ["autodocs"],
  argTypes: {
    numberOfMonths: { control: "number" },
    fixedWeeks: { control: "boolean" },
    readonly: { control: "boolean" },
    disabled: { control: "boolean" },
    allowNonContiguousRanges: { control: "boolean" },
    locale: { control: "text" },
    weekdayFormat: {
      control: "select",
      options: ["narrow", "short", "long"],
    },
  },
  args: {
    numberOfMonths: 1,
    fixedWeeks: false,
    readonly: false,
    disabled: false,
    allowNonContiguousRanges: false,
  },
};

export default meta;
type Story = StoryObj<typeof RangeCalendar>;

export const Default: Story = {};

export const WithDefaultRange: Story = {
  args: {
    defaultValue: {
      start: new CalendarDate(2024, 6, 10),
      end: new CalendarDate(2024, 6, 20),
    },
  },
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
};

export const DisabledDates: Story = {
  args: {
    isDateDisabled: (date: any) => date.day % 7 === 0,
  },
};

export const MultipleMonths: Story = {
  args: {
    numberOfMonths: 2,
    defaultValue: {
      start: new CalendarDate(2024, 6, 10),
      end: new CalendarDate(2024, 7, 5),
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: {
      start: new CalendarDate(2024, 6, 10),
      end: new CalendarDate(2024, 6, 20),
    },
  },
};

export const Readonly: Story = {
  args: {
    readonly: true,
    defaultValue: {
      start: new CalendarDate(2024, 6, 10),
      end: new CalendarDate(2024, 6, 20),
    },
  },
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
};

export const Today: Story = {
  args: {
    defaultPlaceholder: today(getLocalTimeZone()),
  },
};
