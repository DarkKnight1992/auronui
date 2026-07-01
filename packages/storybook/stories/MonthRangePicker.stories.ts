import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { CalendarDate } from "@internationalized/date";
import { MonthRangePicker } from "@auronui/vue";

const meta: Meta<typeof MonthRangePicker> = {
  component: MonthRangePicker,
  title: "Components/MonthRangePicker",
  tags: ["autodocs"],
  argTypes: {
    readonly: { control: "boolean" },
    disabled: { control: "boolean" },
    locale: { control: "text" },
    allowNonContiguousRanges: { control: "boolean" },
    classNames: { control: "object", description: "Per-slot class overrides. Keys match the component anatomy slot names." },
  },
  args: {
    readonly: false,
    disabled: false,
    allowNonContiguousRanges: false,
  },
};

export default meta;
type Story = StoryObj<typeof MonthRangePicker>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { MonthRangePicker } from '@auronui/vue'
</script>

<template>
  <MonthRangePicker />
</template>`,
        type: 'code',
        language: 'vue',
      }
    }
  },
};

export const WithSelectedRange: Story = {
  args: {
    defaultValue: {
      start: new CalendarDate(2024, 3, 1),
      end: new CalendarDate(2024, 8, 1),
    },
  },
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
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: {
      start: new CalendarDate(2024, 3, 1),
      end: new CalendarDate(2024, 8, 1),
    },
  },
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
};
