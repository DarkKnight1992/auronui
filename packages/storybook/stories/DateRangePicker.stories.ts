import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { defineComponent, ref } from "vue";
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
    dir: {
      control: { type: "select" },
      options: ["ltr", "rtl"],
      description: "Text direction.",
      table: { category: "DateRangePickerRoot", defaultValue: { summary: "ltr" } },
    },
    pagedNavigation: {
      control: "boolean",
      description: "Advance by numberOfMonths when navigating.",
      table: { category: "DateRangePickerRoot", defaultValue: { summary: "false" } },
    },
    fixedWeeks: {
      control: "boolean",
      description: "Always show 6 weeks per month.",
      table: { category: "DateRangePickerRoot", defaultValue: { summary: "false" } },
    },
    preventDeselect: {
      control: "boolean",
      description: "Prevent deselecting a selected date.",
      table: { category: "DateRangePickerRoot", defaultValue: { summary: "false" } },
    },
    allowNonContiguousRanges: {
      control: "boolean",
      description: "Allow non-contiguous date ranges.",
      table: { category: "DateRangePickerRoot", defaultValue: { summary: "false" } },
    },
    maximumDays: {
      control: "number",
      description: "Maximum number of days in the range.",
      table: { category: "DateRangePickerRoot" },
    },
    triggerAs: {
      control: "text",
      description: "Render trigger as a different element.",
      table: { category: "DateRangePickerTrigger", defaultValue: { summary: "button" } },
    },
    triggerAsChild: {
      control: "boolean",
      description: "Render trigger child as root element.",
      table: { category: "DateRangePickerTrigger", defaultValue: { summary: "false" } },
    },
    forceMount: {
      control: "boolean",
      description: "Force the content to stay mounted.",
      table: { category: "DateRangePickerContent", defaultValue: { summary: "false" } },
    },
    side: {
      control: { type: "select" },
      options: ["top", "right", "bottom", "left"],
      description: "Side of the anchor the content appears on.",
      table: { category: "DateRangePickerContent", defaultValue: { summary: "bottom" } },
    },
    sideOffset: {
      control: "number",
      description: "Distance in px from the anchor.",
      table: { category: "DateRangePickerContent", defaultValue: { summary: "8" } },
    },
    align: {
      control: { type: "select" },
      options: ["start", "center", "end"],
      description: "Alignment of the content relative to the anchor.",
      table: { category: "DateRangePickerContent", defaultValue: { summary: "start" } },
    },
    avoidCollisions: {
      control: "boolean",
      description: "Avoid collisions with the viewport.",
      table: { category: "DateRangePickerContent", defaultValue: { summary: "true" } },
    },
    collisionPadding: {
      control: false,
      description: "Padding for collision detection.",
      table: { category: "DateRangePickerContent" },
    },
    sticky: {
      control: { type: "select" },
      options: ["partial", "always"],
      description: "Sticky behavior when overflowing.",
      table: { category: "DateRangePickerContent", defaultValue: { summary: "partial" } },
    },
    positionStrategy: {
      control: { type: "select" },
      options: ["fixed", "absolute"],
      description: "CSS position strategy.",
      table: { category: "DateRangePickerContent", defaultValue: { summary: "fixed" } },
    },
    disableOutsidePointerEvents: {
      control: "boolean",
      description: "Disable pointer events outside the content.",
      table: { category: "DateRangePickerContent", defaultValue: { summary: "false" } },
    },
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
    pagedNavigation: false,
    fixedWeeks: false,
    preventDeselect: false,
    allowNonContiguousRanges: false,
    triggerAsChild: false,
    forceMount: false,
    avoidCollisions: true,
    disableOutsidePointerEvents: false,
  },
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

/* ─── Playground / Default ──────────────────────────────────────────────── */

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { DateRangePicker } from '@auronui/vue'

const value = ref(undefined)
</script>

<template>
  <DateRangePicker label="Date Range" v-model="value" />
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
        type: 'code',
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DateRangePicker } from '@auronui/vue'
</script>

<template>
  <div class="flex flex-col gap-4 max-w-[420px]">
    <DateRangePicker v-for="v in ['flat', 'bordered', 'faded', 'underlined', 'raised']" :key="v" :variant="v" :label="v" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DateRangePicker } from '@auronui/vue'
</script>

<template>
  <div class="flex flex-col gap-4 max-w-[420px]">
    <DateRangePicker v-for="s in ['sm', 'md', 'lg']" :key="s" :size="s" :label="'size ' + s" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DateRangePicker } from '@auronui/vue'
</script>

<template>
  <div class="flex flex-col gap-4 max-w-[420px]">
    <DateRangePicker
      v-for="c in ['default', 'primary', 'secondary', 'success', 'warning', 'danger']"
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

export const Controlled: Story = {
  name: 'Controlled (v-model)',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { DateRangePicker } from '@auronui/vue'
import { CalendarDate } from '@internationalized/date'

const value = ref({ start: new CalendarDate(2024, 6, 1), end: new CalendarDate(2024, 6, 15) })
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:8px;padding:16px;">
    <DateRangePicker v-model="value" label="Date Range" />
    <p style="font-size:13px;color:#666;">Value: {{ value }}</p>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) =>
    defineComponent({
      components: { DateRangePicker },
      setup() {
        const value = ref({ start: new CalendarDate(2024, 6, 1), end: new CalendarDate(2024, 6, 15) })
        return { args, value }
      },
      template: `
        <div style="display:flex;flex-direction:column;gap:8px;padding:16px;">
          <DateRangePicker v-bind="args" v-model="value" label="Date Range" />
          <p style="font-size:13px;color:#666;">Value: {{ value }}</p>
        </div>
      `,
    }),
}

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
