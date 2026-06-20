import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import { CalendarDateTime } from "@internationalized/date";
import { DateTimePicker } from "@auronui/vue";

const BASE_VALUE = new CalendarDateTime(2024, 6, 15, 10, 30);
const BASE_VALUE_WITH_SECONDS = new CalendarDateTime(2024, 6, 15, 10, 30, 45);

const meta: Meta<typeof DateTimePicker> = {
  component: DateTimePicker,
  title: "Form/DateTimePicker",
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
      options: ["minute", "second"],
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
    hideTimeZone: { control: "boolean" },
    label: { control: "text" },
    description: { control: "text" },
    errorMessage: { control: "text" },
    locale: { control: "text" },
    name: { control: "text" },
    classNames: { control: "object", description: "Per-slot class overrides. Keys match the component anatomy slot names." },
  },
  args: {
    label: "Date & Time",
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
    hideTimeZone: false,
    closeOnSelect: true,
  },
};

export default meta;
type Story = StoryObj<typeof DateTimePicker>;

/* ─── Playground / Default ──────────────────────────────────────────────── */

export const Playground: Story = {
  render: (args: any) => ({
    components: { DateTimePicker },
    setup: () => {
      const value = ref(undefined);
      return { args, value };
    },
    template: `<DateTimePicker v-bind="args" v-model="value" />`,
  }),
};

export const Default: Story = {
  args: {
    label: "Appointment",
    defaultValue: BASE_VALUE,
  },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DateTimePicker } from '@auronui/vue'
</script>

<template>
  <DateTimePicker label="Appointment" />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args: any) => ({
    components: { DateTimePicker },
    setup: () => ({ args }),
    template: `<DateTimePicker v-bind="args" />`,
  }),
};

/* ─── Hour cycle / granularity / time zone ──────────────────────────────── */

export const TwelveHour: Story = {
  args: {
    label: "Date & Time (12h)",
    hourCycle: 12,
    defaultValue: BASE_VALUE,
  },
  render: (args: any) => ({
    components: { DateTimePicker },
    setup: () => ({ args }),
    template: `<DateTimePicker v-bind="args" />`,
  }),
};

export const WithSeconds: Story = {
  args: {
    label: "Date & Time with Seconds",
    granularity: "second",
    defaultValue: BASE_VALUE_WITH_SECONDS,
  },
  render: (args: any) => ({
    components: { DateTimePicker },
    setup: () => ({ args }),
    template: `<DateTimePicker v-bind="args" />`,
  }),
};

export const HideTimeZone: Story = {
  args: {
    label: "Date & Time — TZ hidden",
    hideTimeZone: true,
    defaultValue: BASE_VALUE,
  },
  render: (args: any) => ({
    components: { DateTimePicker },
    setup: () => ({ args }),
    template: `<DateTimePicker v-bind="args" />`,
  }),
};

/* ─── Variants / Sizes / Colors ─────────────────────────────────────────── */

export const Variants: Story = {
  render: (args: any) => ({
    components: { DateTimePicker },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:420px">
        <DateTimePicker v-bind="args" v-for="v in ['flat','bordered','faded','underlined','raised']" :key="v" :variant="v" :label="v" />
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: (args: any) => ({
    components: { DateTimePicker },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:420px">
        <DateTimePicker v-bind="args" v-for="s in ['sm','md','lg']" :key="s" :size="s" :label="'size ' + s" />
      </div>
    `,
  }),
};

export const Colors: Story = {
  args: { variant: "bordered" },
  render: (args: any) => ({
    components: { DateTimePicker },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:420px">
        <DateTimePicker
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

/* ─── Label placements ──────────────────────────────────────────────────── */

export const LabelPlacements: Story = {
  render: (args: any) => ({
    components: { DateTimePicker },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:420px">
        <DateTimePicker v-bind="args" v-for="p in ['inside','outside','outside-left']" :key="p" :labelPlacement="p" :label="p" />
      </div>
    `,
  }),
};

/* ─── States ────────────────────────────────────────────────────────────── */

export const Disabled: Story = {
  args: {
    label: "Locked Date & Time",
    isDisabled: true,
    defaultValue: BASE_VALUE,
  },
  render: (args: any) => ({
    components: { DateTimePicker },
    setup: () => ({ args }),
    template: `<DateTimePicker v-bind="args" />`,
  }),
};

export const ReadOnly: Story = {
  args: {
    label: "Fixed Date & Time",
    isReadOnly: true,
    defaultValue: BASE_VALUE,
  },
  render: (args: any) => ({
    components: { DateTimePicker },
    setup: () => ({ args }),
    template: `<DateTimePicker v-bind="args" />`,
  }),
};

export const Invalid: Story = {
  args: {
    label: "Event Date & Time",
    isInvalid: true,
    errorMessage: "Please select a valid date and time",
    defaultValue: BASE_VALUE,
  },
  render: (args: any) => ({
    components: { DateTimePicker },
    setup: () => ({ args }),
    template: `<DateTimePicker v-bind="args" />`,
  }),
};

export const Required: Story = {
  args: {
    label: "Due Date & Time",
    isRequired: true,
  },
  render: (args: any) => ({
    components: { DateTimePicker },
    setup: () => ({ args }),
    template: `<DateTimePicker v-bind="args" />`,
  }),
};

export const FullWidth: Story = {
  args: {
    label: "Full Width Date & Time",
    fullWidth: true,
  },
  render: (args: any) => ({
    components: { DateTimePicker },
    setup: () => ({ args }),
    template: `<DateTimePicker v-bind="args" />`,
  }),
};

/* ─── Controlled value ──────────────────────────────────────────────────── */

export const ControlledValue: Story = {
  render: (args: any) => ({
    components: { DateTimePicker },
    setup: () => {
      const value = ref(BASE_VALUE);
      return { args, value };
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:420px">
        <DateTimePicker v-bind="args" v-model="value" />
        <p style="font-size:0.875rem;color:#666">Emitted value: {{ value ? value.toString() : 'none' }}</p>
      </div>
    `,
  }),
};

/* ─── Constraints ───────────────────────────────────────────────────────── */

export const WithConstraints: Story = {
  args: {
    label: "Constrained Date & Time",
    description: "Select a date and time within June 2024",
    defaultValue: BASE_VALUE,
    minValue: new CalendarDateTime(2024, 6, 1, 0, 0),
    maxValue: new CalendarDateTime(2024, 6, 30, 23, 59),
  },
  render: (args: any) => ({
    components: { DateTimePicker },
    setup: () => ({ args }),
    template: `<DateTimePicker v-bind="args" />`,
  }),
};

/* ─── Custom styles via classNames ─────────────────────────────────── */

export const CustomStyles: Story = {
  args: {
    label: "Styled Date & Time",
    defaultValue: BASE_VALUE,
    classNames: {
      trigger: "border-2 border-blue-500 rounded-lg",
      stepHeader: "bg-blue-50 border-b-2 border-blue-200",
      stepTitle: "text-blue-700 font-semibold",
      navButton: "text-blue-600 hover:bg-blue-100 rounded-md",
    },
  },
  render: (args: any) => ({
    components: { DateTimePicker },
    setup: () => ({ args }),
    template: `<DateTimePicker v-bind="args" />`,
  }),
};
