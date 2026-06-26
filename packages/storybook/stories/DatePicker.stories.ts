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
    dir: {
      control: { type: "select" },
      options: ["ltr", "rtl"],
      description: "Text direction.",
      table: { category: "DatePickerRoot", defaultValue: { summary: "ltr" } },
    },
    pagedNavigation: {
      control: "boolean",
      description: "Advance by numberOfMonths when navigating.",
      table: { category: "DatePickerRoot", defaultValue: { summary: "false" } },
    },
    fixedWeeks: {
      control: "boolean",
      description: "Always show 6 weeks per month.",
      table: { category: "DatePickerRoot", defaultValue: { summary: "false" } },
    },
    preventDeselect: {
      control: "boolean",
      description: "Prevent deselecting a selected date.",
      table: { category: "DatePickerRoot", defaultValue: { summary: "false" } },
    },
    triggerAs: {
      control: "text",
      description: "Render trigger as a different element.",
      table: { category: "DatePickerTrigger", defaultValue: { summary: "button" } },
    },
    triggerAsChild: {
      control: "boolean",
      description: "Render trigger child as root element.",
      table: { category: "DatePickerTrigger", defaultValue: { summary: "false" } },
    },
    forceMount: {
      control: "boolean",
      description: "Force the content to stay mounted.",
      table: { category: "DatePickerContent", defaultValue: { summary: "false" } },
    },
    side: {
      control: { type: "select" },
      options: ["top", "right", "bottom", "left"],
      description: "Side of the anchor the content appears on.",
      table: { category: "DatePickerContent", defaultValue: { summary: "bottom" } },
    },
    sideOffset: {
      control: "number",
      description: "Distance in px from the anchor.",
      table: { category: "DatePickerContent", defaultValue: { summary: "8" } },
    },
    align: {
      control: { type: "select" },
      options: ["start", "center", "end"],
      description: "Alignment of the content relative to the anchor.",
      table: { category: "DatePickerContent", defaultValue: { summary: "start" } },
    },
    avoidCollisions: {
      control: "boolean",
      description: "Avoid collisions with the viewport.",
      table: { category: "DatePickerContent", defaultValue: { summary: "true" } },
    },
    collisionPadding: {
      control: false,
      description: "Padding for collision detection.",
      table: { category: "DatePickerContent" },
    },
    sticky: {
      control: { type: "select" },
      options: ["partial", "always"],
      description: "Sticky behavior when overflowing.",
      table: { category: "DatePickerContent", defaultValue: { summary: "partial" } },
    },
    positionStrategy: {
      control: { type: "select" },
      options: ["fixed", "absolute"],
      description: "CSS position strategy.",
      table: { category: "DatePickerContent", defaultValue: { summary: "fixed" } },
    },
    disableOutsidePointerEvents: {
      control: "boolean",
      description: "Disable pointer events outside the content.",
      table: { category: "DatePickerContent", defaultValue: { summary: "false" } },
    },
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
    pagedNavigation: false,
    fixedWeeks: false,
    preventDeselect: false,
    triggerAsChild: false,
    forceMount: false,
    avoidCollisions: true,
    disableOutsidePointerEvents: false,
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

/* ─── Playground / Default ──────────────────────────────────────────────── */

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { DatePicker } from '@auronui/vue'

const value = ref(undefined)
</script>

<template>
  <DatePicker label="Date" v-model="value" />
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
        type: 'code',
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DatePicker } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:16px;max-width:360px">
    <DatePicker v-for="v in ['flat','bordered','faded','underlined','raised']" :key="v" :variant="v" :label="v" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DatePicker } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:16px;max-width:360px">
    <DatePicker v-for="s in ['sm','md','lg']" :key="s" :size="s" :label="'size ' + s" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DatePicker } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:16px;max-width:360px">
    <DatePicker
      v-for="c in ['default','primary','secondary','success','warning','danger']"
      :key="c"
      :color="c"
      :label="c"
    />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DatePicker } from '@auronui/vue'
</script>

<template>
  <DatePicker label="Birth Date" label-placement="inside" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `<DatePicker v-bind="args" />`,
  }),
};

export const LabelPlacementOutside: Story = {
  args: { label: "Birth Date", labelPlacement: "outside" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DatePicker } from '@auronui/vue'
</script>

<template>
  <DatePicker label="Birth Date" label-placement="outside" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `<DatePicker v-bind="args" />`,
  }),
};

export const LabelPlacementOutsideLeft: Story = {
  args: { label: "Birth Date", labelPlacement: "outside-left" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DatePicker } from '@auronui/vue'
</script>

<template>
  <DatePicker label="Birth Date" label-placement="outside-left" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `<DatePicker v-bind="args" />`,
  }),
};

/* ─── Value / constraints ───────────────────────────────────────────────── */

export const WithDefaultValue: Story = {
  args: { label: "Appointment Date" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { CalendarDate } from '@internationalized/date'
import { DatePicker } from '@auronui/vue'

const value = ref(new CalendarDate(2024, 6, 15))
</script>

<template>
  <DatePicker label="Appointment Date" v-model="value" />
</template>`,
        language: 'vue',
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { CalendarDate } from '@internationalized/date'
import { DatePicker } from '@auronui/vue'
</script>

<template>
  <DatePicker
    label="Next Appointment"
    :placeholder-value="new CalendarDate(2030, 1, 1)"
  />
</template>`,
        language: 'vue',
      },
    },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { CalendarDate } from '@internationalized/date'
import { DatePicker } from '@auronui/vue'
</script>

<template>
  <DatePicker
    label="Constrained Date"
    description="Select a date in June 2024"
    :default-value="new CalendarDate(2024, 6, 15)"
    :min-value="new CalendarDate(2024, 6, 1)"
    :max-value="new CalendarDate(2024, 6, 30)"
  />
</template>`,
        language: 'vue',
      },
    },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { today, getLocalTimeZone } from '@internationalized/date'
import { DatePicker } from '@auronui/vue'

const isDateUnavailable = (date) => {
  const d = date.toDate(getLocalTimeZone()).getDay()
  return d === 0 || d === 6
}
</script>

<template>
  <DatePicker
    label="Business days only"
    description="Weekends are unavailable"
    :default-value="today(getLocalTimeZone())"
    :is-date-unavailable="isDateUnavailable"
  />
</template>`,
        language: 'vue',
      },
    },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DatePicker } from '@auronui/vue'
</script>

<template>
  <DatePicker label="Birth Date" description="Enter your date of birth" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `<DatePicker v-bind="args" />`,
  }),
};

export const Required: Story = {
  args: { label: "Due Date", isRequired: true },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DatePicker } from '@auronui/vue'
</script>

<template>
  <DatePicker label="Due Date" is-required />
</template>`,
        language: 'vue',
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { CalendarDate } from '@internationalized/date'
import { DatePicker } from '@auronui/vue'
</script>

<template>
  <DatePicker
    label="Event Date"
    is-invalid
    error-message="Please select a valid date"
    :default-value="new CalendarDate(2024, 6, 15)"
  />
</template>`,
        language: 'vue',
      },
    },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { CalendarDate } from '@internationalized/date'
import { DatePicker } from '@auronui/vue'
</script>

<template>
  <DatePicker
    label="Locked Date"
    is-disabled
    :default-value="new CalendarDate(2024, 3, 20)"
  />
</template>`,
        language: 'vue',
      },
    },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { CalendarDate } from '@internationalized/date'
import { DatePicker } from '@auronui/vue'
</script>

<template>
  <DatePicker
    label="Fixed Date"
    is-read-only
    :default-value="new CalendarDate(2024, 12, 31)"
  />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `<DatePicker v-bind="args" />`,
  }),
};

export const FullWidth: Story = {
  args: { label: "Full Width Date", fullWidth: true },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DatePicker } from '@auronui/vue'
</script>

<template>
  <DatePicker label="Full Width Date" full-width />
</template>`,
        language: 'vue',
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { CalendarDateTime, toZoned } from '@internationalized/date'
import { DatePicker } from '@auronui/vue'
</script>

<template>
  <DatePicker
    label="Date and Time"
    granularity="minute"
    :default-value="toZoned(new CalendarDateTime(2024, 6, 15, 10, 30), 'America/New_York')"
  />
</template>`,
        language: 'vue',
      },
    },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { CalendarDateTime, toZoned } from '@internationalized/date'
import { DatePicker } from '@auronui/vue'
</script>

<template>
  <DatePicker
    label="Date and Time (12h)"
    granularity="hour"
    :hour-cycle="12"
    :default-value="toZoned(new CalendarDateTime(2024, 6, 15, 14, 0), 'America/New_York')"
  />
</template>`,
        language: 'vue',
      },
    },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { CalendarDateTime, toZoned } from '@internationalized/date'
import { DatePicker } from '@auronui/vue'
</script>

<template>
  <DatePicker
    label="Date and Time — TZ hidden"
    granularity="minute"
    hide-time-zone
    :default-value="toZoned(new CalendarDateTime(2024, 6, 15, 10, 30), 'America/New_York')"
  />
</template>`,
        language: 'vue',
      },
    },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { CalendarDate } from '@internationalized/date'
import { DatePicker } from '@auronui/vue'
</script>

<template>
  <DatePicker
    label="Geburtsdatum"
    locale="de-DE"
    :default-value="new CalendarDate(1990, 1, 1)"
  />
</template>`,
        language: 'vue',
      },
    },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { CalendarDate } from '@internationalized/date'
import { DatePicker } from '@auronui/vue'
</script>

<template>
  <DatePicker
    label="Date (2 months)"
    :default-value="new CalendarDate(2024, 6, 15)"
    :visible-months="2"
  />
</template>`,
        language: 'vue',
      },
    },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DatePicker } from '@auronui/vue'
</script>

<template>
  <DatePicker label="Stays open after select" :close-on-select="false" />
</template>`,
        language: 'vue',
      },
    },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DatePicker } from '@auronui/vue'
</script>

<template>
  <DatePicker label="Modal popover" modal />
</template>`,
        language: 'vue',
      },
    },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { today, getLocalTimeZone } from '@internationalized/date'
import { DatePicker } from '@auronui/vue'
</script>

<template>
  <DatePicker
    label="Open by default"
    default-open
    :default-value="today(getLocalTimeZone())"
  />
</template>`,
        language: 'vue',
      },
    },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { CalendarDate } from '@internationalized/date'
import { DatePicker } from '@auronui/vue'
</script>

<template>
  <DatePicker
    label="Hidden form input"
    name="birth_date"
    :default-value="new CalendarDate(1990, 1, 1)"
  />
</template>`,
        language: 'vue',
      },
    },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { CalendarDate } from '@internationalized/date'
import { DatePicker } from '@auronui/vue'
</script>

<template>
  <DatePicker
    label="Custom Styled Date"
    :default-value="new CalendarDate(2024, 6, 15)"
    :class-names="{
      trigger: 'border-2 border-blue-500 rounded-lg bg-blue-50',
      triggerIndicator: 'text-blue-600',
      popover: 'border-2 border-blue-500 rounded-lg shadow-lg',
    }"
  />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args: any) => ({
    components: { DatePicker },
    setup: () => ({ args }),
    template: `<DatePicker v-bind="args" />`,
  }),
};
