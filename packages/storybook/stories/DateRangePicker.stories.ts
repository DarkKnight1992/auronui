import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date";
import { DateRangePicker } from "@auronui/vue";

const meta: Meta<typeof DateRangePicker> = {
  component: DateRangePicker,
  title: "Form/DateRangePicker",
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
      options: ["default", "primary", "secondary", "success", "warning", "danger"],
    },
    labelPlacement: {
      control: "select",
      options: ["inside", "outside", "outside-left"],
    },
    granularity: {
      control: "select",
      options: ["day", "hour", "minute", "second"],
    },
    hourCycle: {
      control: "select",
      options: [12, 24],
    },
    visibleMonths: { control: "number" },
    closeOnSelect: { control: "boolean" },
    modal: { control: "boolean" },
    isInvalid: { control: "boolean" },
    isDisabled: { control: "boolean" },
    isReadOnly: { control: "boolean" },
    isRequired: { control: "boolean" },
    fullWidth: { control: "boolean" },
    hideTimeZone: { control: "boolean" },
    label: { control: "text" },
    description: { control: "text" },
    errorMessage: { control: "text" },
    locale: { control: "text" },
    name: { control: "text" },
    classNames: { control: "object", description: "Per-slot class overrides. Keys match the component anatomy slot names." },
  },
  args: {
    label: "Date Range",
    variant: "flat",
    size: "md",
    color: "default",
    labelPlacement: "inside",
    isInvalid: false,
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
    fullWidth: false,
    hideTimeZone: false,
    visibleMonths: 1,
    closeOnSelect: true,
    modal: false,
  },
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

/* ─── Playground / Default ──────────────────────────────────────────────── */

export const Playground: Story = {
  render: (args: any) => ({
    components: { DateRangePicker },
    setup: () => {
      const value = ref(undefined);
      return { args, value };
    },
    template: `<DateRangePicker v-bind="args" v-model="value" />`,
  }),
};

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { DateRangePicker } from '@auronui/vue'

const value = ref(undefined)
</script>

<template>
  <DateRangePicker v-model="value" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args: any) => ({
    components: { DateRangePicker },
    setup: () => {
      const value = ref(undefined);
      return { args, value };
    },
    template: `<DateRangePicker v-bind="args" v-model="value" />`,
  }),
};

/* ─── Variants / Sizes / Colors ─────────────────────────────────────────── */

export const Variants: Story = {
  render: (args: any) => ({
    components: { DateRangePicker },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:420px">
        <DateRangePicker v-bind="args" v-for="v in ['flat','bordered','faded','underlined','raised']" :key="v" :variant="v" :label="v" />
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: (args: any) => ({
    components: { DateRangePicker },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:420px">
        <DateRangePicker v-bind="args" v-for="s in ['sm','md','lg']" :key="s" :size="s" :label="'size ' + s" />
      </div>
    `,
  }),
};

export const Colors: Story = {
  render: (args: any) => ({
    components: { DateRangePicker },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:420px">
        <DateRangePicker
          v-bind="args"
          v-for="c in ['default','primary','secondary','success','warning','danger']"
          :key="c"
          :color="c"
          :label="c"
        />
      </div>
    `,
  }),
};

/* ─── Label placement ───────────────────────────────────────────────────── */

export const LabelPlacementInside: Story = {
  args: { label: "Trip Dates", labelPlacement: "inside" },
};

export const LabelPlacementOutside: Story = {
  args: { label: "Trip Dates", labelPlacement: "outside" },
};

export const LabelPlacementOutsideLeft: Story = {
  args: { label: "Trip Dates", labelPlacement: "outside-left" },
};

/* ─── Value / constraints ───────────────────────────────────────────────── */

export const WithDefaultRange: Story = {
  args: {
    label: "Trip Dates",
    defaultValue: {
      start: new CalendarDate(2024, 6, 10),
      end: new CalendarDate(2024, 6, 20),
    },
  },
};

export const WithDescription: Story = {
  args: {
    label: "Vacation Dates",
    description: "Select your vacation start and end dates",
    defaultValue: {
      start: new CalendarDate(2024, 7, 1),
      end: new CalendarDate(2024, 7, 14),
    },
  },
};

export const Required: Story = {
  args: { label: "Due Range", isRequired: true },
};

export const Invalid: Story = {
  args: {
    label: "Event Dates",
    isInvalid: true,
    errorMessage: "Please select a valid date range",
    defaultValue: {
      start: new CalendarDate(2024, 6, 10),
      end: new CalendarDate(2024, 6, 20),
    },
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Range",
    isDisabled: true,
    defaultValue: {
      start: new CalendarDate(2024, 6, 10),
      end: new CalendarDate(2024, 6, 20),
    },
  },
};

export const ReadOnly: Story = {
  args: {
    label: "Fixed Range",
    isReadOnly: true,
    defaultValue: {
      start: new CalendarDate(2024, 12, 20),
      end: new CalendarDate(2024, 12, 31),
    },
  },
};

export const FullWidth: Story = {
  args: { label: "Full Width Range", fullWidth: true },
};

export const MinMax: Story = {
  args: {
    label: "Constrained Range",
    description: "Select a range within June 2024",
    defaultValue: {
      start: new CalendarDate(2024, 6, 10),
      end: new CalendarDate(2024, 6, 20),
    },
    minValue: new CalendarDate(2024, 6, 1),
    maxValue: new CalendarDate(2024, 6, 30),
  },
};

/* ─── Popover behavior ──────────────────────────────────────────────────── */

export const MultipleMonths: Story = {
  args: {
    label: "Date Range (2 months)",
    defaultValue: {
      start: new CalendarDate(2024, 6, 25),
      end: new CalendarDate(2024, 7, 10),
    },
    visibleMonths: 2,
  },
};

export const DefaultOpen: Story = {
  args: {
    label: "Open by default",
    defaultOpen: true,
    defaultValue: {
      start: today(getLocalTimeZone()),
      end: today(getLocalTimeZone()).add({ days: 3 }),
    },
  },
};

/* ─── Custom styles via classNames ─────────────────────────────────────── */

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  args: {
    label: "Styled Range",
    defaultValue: {
      start: new CalendarDate(2024, 6, 10),
      end: new CalendarDate(2024, 6, 20),
    },
    classNames: {
      trigger: "border-2 border-blue-500 rounded-lg hover:bg-blue-50",
      triggerIndicator: "text-blue-600 group-hover:text-blue-700",
      popover: "border-2 border-blue-300 shadow-lg",
    },
  },
};
