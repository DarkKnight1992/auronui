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
    classNames: { control: "object", description: "Per-slot class overrides. Keys match the component anatomy slot names." },
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

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { RangeCalendar } from '@auronui/vue'
</script>

<template>
  <RangeCalendar />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
};

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
      cellButton: "hover:bg-purple-200 data-[selected]:bg-purple-500 data-[selected]:text-white rounded",
    },
  },
};
