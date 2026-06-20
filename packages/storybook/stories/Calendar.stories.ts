import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date";
import { Calendar } from "@auronui/vue";

const meta: Meta<typeof Calendar> = {
  component: Calendar,
  title: "Components/Calendar",
  tags: ["autodocs"],
  argTypes: {
    numberOfMonths: { control: "number" },
    fixedWeeks: { control: "boolean" },
    readonly: { control: "boolean" },
    disabled: { control: "boolean" },
    locale: { control: "text" },
    weekdayFormat: {
      control: "select",
      options: ["narrow", "short", "long"],
    },
    weekStartsOn: {
      control: "select",
      options: [0, 1, 2, 3, 4, 5, 6],
    },
    classNames: {
      control: "object",
      description:
        "Per-slot class overrides. Keys match the component anatomy slot names.",
    },
  },
  args: {
    numberOfMonths: 1,
    fixedWeeks: false,
    readonly: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Calendar } from '@auronui/vue'
</script>

<template>
  <Calendar />
</template>`,
        language: 'vue',
      }
    }
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: new CalendarDate(2024, 6, 15),
    weekdayFormat: "narrow",
  },
};

export const DisabledDates: Story = {
  args: {
    defaultValue: today(getLocalTimeZone()),
    isDateDisabled: (date: any) => date.day % 7 === 0,
  },
};

export const MinMaxConstrained: Story = {
  args: {
    defaultValue: new CalendarDate(2024, 6, 15),
    minValue: new CalendarDate(2024, 6, 5),
    maxValue: new CalendarDate(2024, 6, 25),
  },
};

export const MultipleMonths: Story = {
  args: {
    numberOfMonths: 2,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: new CalendarDate(2024, 6, 15),
  },
};

export const Readonly: Story = {
  args: {
    readonly: true,
    defaultValue: new CalendarDate(2024, 6, 15),
  },
};

export const ViewSwitching: Story = {
  args: {
    defaultValue: new CalendarDate(2024, 6, 15),
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

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  args: {
    defaultValue: new CalendarDate(2024, 6, 15),
    classNames: {
      base: "border-2 border-blue-500 rounded-lg p-4",
      heading: "text-blue-700 font-semibold text-lg",
      headingButton: "text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded",
      navButton: "text-blue-500 hover:bg-blue-100 rounded-md p-1",
      headerCell: "text-blue-600 font-medium bg-blue-50",
      cellButton: "hover:bg-blue-200 data-[selected]:bg-blue-500 data-[selected]:text-white rounded",
    },
  },
};
