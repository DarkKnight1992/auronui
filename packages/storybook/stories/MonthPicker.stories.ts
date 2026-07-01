import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { CalendarDate } from "@internationalized/date";
import { MonthPicker } from "@auronui/vue";

const meta: Meta<typeof MonthPicker> = {
  component: MonthPicker,
  title: "Components/MonthPicker",
  tags: ["autodocs"],
  argTypes: {
    readonly: { control: "boolean" },
    disabled: { control: "boolean" },
    locale: { control: "text" },
    classNames: { control: "object", description: "Per-slot class overrides. Keys match the component anatomy slot names." },
  },
  args: {
    readonly: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof MonthPicker>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { MonthPicker } from '@auronui/vue'
</script>

<template>
  <MonthPicker />
</template>`,
        type: 'code',
        language: 'vue',
      }
    }
  },
};

export const WithSelected: Story = {
  args: {
    defaultValue: new CalendarDate(2024, 6, 1),
  },
};

export const MinMax: Story = {
  args: {
    defaultValue: new CalendarDate(2024, 6, 1),
    minValue: new CalendarDate(2024, 3, 1),
    maxValue: new CalendarDate(2024, 9, 1),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: new CalendarDate(2024, 6, 1),
  },
};

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  args: {
    defaultValue: new CalendarDate(2024, 6, 15),
    classNames: {
      base: "border-2 border-blue-500 rounded-lg p-4",
      header: "mb-4 pb-3 border-b-2 border-blue-200",
      navButton: "text-blue-600 hover:bg-blue-100 rounded-md",
      heading: "text-lg font-semibold text-blue-700",
      monthCell: "hover:bg-blue-50 text-blue-900",
    },
  },
};
