import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import { CalendarDate, CalendarDateTime, toZoned, today, getLocalTimeZone } from "@internationalized/date";
import { DatePicker } from "@auronui/vue";

const meta: Meta<typeof DatePicker> = {
  component: DatePicker,
  title: "Form/DatePicker",
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
    label: "Date",
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
type Story = StoryObj<typeof DatePicker>;

/* ─── Playground / Default ──────────────────────────────────────────────── */

export const Playground: Story = {
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => {
      const value = ref(undefined);
      return { args, value };
    },
    template: `<DatePicker v-bind="args" v-model="value" />`,
  }),
};

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { DatePicker } from '@auronui/vue'

const value = ref(undefined)
</script>

<template>
  <DatePicker v-model="value" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => {
      const value = ref(undefined);
      return { args, value };
    },
    template: `<DatePicker v-bind="args" v-model="value" />`,
  }),
};

/* ─── Variants / Sizes / Colors ─────────────────────────────────────────── */

export const Variants: Story = {
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:360px">
        <DatePicker v-bind="args" v-for="v in ['flat','bordered','faded','underlined','raised']" :key="v" :variant="v" :label="v" />
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:360px">
        <DatePicker v-bind="args" v-for="s in ['sm','md','lg']" :key="s" :size="s" :label="'size ' + s" />
      </div>
    `,
  }),
};

export const Colors: Story = {
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:360px">
        <DatePicker
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
  args: { label: "Birth Date", labelPlacement: "inside" },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `<DatePicker v-bind="args" />`,
  }),
};

export const LabelPlacementOutside: Story = {
  args: { label: "Birth Date", labelPlacement: "outside" },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `<DatePicker v-bind="args" />`,
  }),
};

export const LabelPlacementOutsideLeft: Story = {
  args: { label: "Birth Date", labelPlacement: "outside-left" },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `<DatePicker v-bind="args" />`,
  }),
};

/* ─── Value / constraints ───────────────────────────────────────────────── */

export const WithDefaultValue: Story = {
  args: { label: "Appointment Date" },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => {
      const value = ref(new CalendarDate(2024, 6, 15));
      return { args, value };
    },
    template: `<DatePicker v-bind="args" v-model="value" />`,
  }),
};

export const WithPlaceholderValue: Story = {
  args: {
    label: "Next Appointment",
    placeholderValue: new CalendarDate(2030, 1, 1),
  },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `<DatePicker v-bind="args" />`,
  }),
};

export const MinMax: Story = {
  args: {
    label: "Constrained Date",
    description: "Select a date in June 2024",
    defaultValue: new CalendarDate(2024, 6, 15),
    minValue: new CalendarDate(2024, 6, 1),
    maxValue: new CalendarDate(2024, 6, 30),
  },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `<DatePicker v-bind="args" />`,
  }),
};

export const UnavailableDates: Story = {
  args: {
    label: "Business days only",
    description: "Weekends are unavailable",
    defaultValue: today(getLocalTimeZone()),
  },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => {
      const isDateUnavailable = (date: { toDate: (tz: string) => Date }) => {
        const d = date.toDate(getLocalTimeZone()).getDay();
        return d === 0 || d === 6;
      };
      return { args, isDateUnavailable };
    },
    template: `<DatePicker v-bind="args" :is-date-unavailable="isDateUnavailable" />`,
  }),
};

/* ─── Description / validation / states ─────────────────────────────────── */

export const WithDescription: Story = {
  args: { label: "Birth Date", description: "Enter your date of birth" },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `<DatePicker v-bind="args" />`,
  }),
};

export const Required: Story = {
  args: { label: "Due Date", isRequired: true },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `<DatePicker v-bind="args" />`,
  }),
};

export const Invalid: Story = {
  args: {
    label: "Event Date",
    isInvalid: true,
    errorMessage: "Please select a valid date",
    defaultValue: new CalendarDate(2024, 6, 15),
  },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `<DatePicker v-bind="args" />`,
  }),
};

export const Disabled: Story = {
  args: {
    label: "Locked Date",
    isDisabled: true,
    defaultValue: new CalendarDate(2024, 3, 20),
  },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `<DatePicker v-bind="args" />`,
  }),
};

export const ReadOnly: Story = {
  args: {
    label: "Fixed Date",
    isReadOnly: true,
    defaultValue: new CalendarDate(2024, 12, 31),
  },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `<DatePicker v-bind="args" />`,
  }),
};

export const FullWidth: Story = {
  args: { label: "Full Width Date", fullWidth: true },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `<DatePicker v-bind="args" />`,
  }),
};

/* ─── Granularity / locale / time zone ──────────────────────────────────── */

export const TimeGranularity: Story = {
  args: {
    label: "Date and Time",
    granularity: "minute",
    defaultValue: toZoned(new CalendarDateTime(2024, 6, 15, 10, 30), "America/New_York"),
  },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `<DatePicker v-bind="args" />`,
  }),
};

export const TwelveHourCycle: Story = {
  args: {
    label: "Date and Time (12h)",
    granularity: "hour",
    hourCycle: 12,
    defaultValue: toZoned(new CalendarDateTime(2024, 6, 15, 14, 0), "America/New_York"),
  },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `<DatePicker v-bind="args" />`,
  }),
};

export const HideTimeZone: Story = {
  args: {
    label: "Date and Time — TZ hidden",
    granularity: "minute",
    hideTimeZone: true,
    // hideTimeZone only affects ZonedDateTime values (timezone display is irrelevant
    // for CalendarDateTime). toZoned promotes a CalendarDateTime to a ZonedDateTime.
    defaultValue: toZoned(new CalendarDateTime(2024, 6, 15, 10, 30), "America/New_York"),
  },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `<DatePicker v-bind="args" />`,
  }),
};

export const LocaleGerman: Story = {
  args: {
    label: "Geburtsdatum",
    locale: "de-DE",
    defaultValue: new CalendarDate(1990, 1, 1),
  },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `<DatePicker v-bind="args" />`,
  }),
};

/* ─── Popover behavior ──────────────────────────────────────────────────── */

export const MultipleMonths: Story = {
  args: {
    label: "Date (2 months)",
    defaultValue: new CalendarDate(2024, 6, 15),
    visibleMonths: 2,
  },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `<DatePicker v-bind="args" />`,
  }),
};

export const CloseOnSelectDisabled: Story = {
  args: {
    label: "Stays open after select",
    closeOnSelect: false,
  },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `<DatePicker v-bind="args" />`,
  }),
};

export const ModalPopover: Story = {
  args: {
    label: "Modal popover",
    modal: true,
  },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `<DatePicker v-bind="args" />`,
  }),
};

export const DefaultOpen: Story = {
  args: {
    label: "Open by default",
    defaultOpen: true,
    defaultValue: today(getLocalTimeZone()),
  },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `<DatePicker v-bind="args" />`,
  }),
};

/* ─── Named form field ──────────────────────────────────────────────────── */

export const WithName: Story = {
  args: {
    label: "Hidden form input",
    name: "birth_date",
    defaultValue: new CalendarDate(1990, 1, 1),
  },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `<DatePicker v-bind="args" />`,
  }),
};

/* ─── Custom styles via classNames ────────────────────────────────────── */

export const CustomStyles: Story = {
  args: {
    label: "Custom Styled Date",
    defaultValue: new CalendarDate(2024, 6, 15),
    classNames: {
      trigger: "border-2 border-blue-500 rounded-lg bg-blue-50",
      triggerIndicator: "text-blue-600",
      popover: "border-2 border-blue-500 rounded-lg shadow-lg",
    },
  },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `<DatePicker v-bind="args" />`,
  }),
};
