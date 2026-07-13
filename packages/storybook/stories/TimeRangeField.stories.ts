import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import { TimeRangeField } from "@auronui/vue";
import { Time } from "@internationalized/date";

const meta: Meta<typeof TimeRangeField> = {
  component: TimeRangeField,
  title: "Form/TimeRangeField",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["flat", "bordered", "faded", "underlined", "raised"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    color: {
      control: "select",
      options: [
        "default",
        "primary",
        "secondary",
        "accent",
        "success",
        "warning",
        "danger",
      ],
    },
    labelPlacement: {
      control: "select",
      options: ["inside", "outside", "outside-left"],
    },
    granularity: {
      control: "select",
      options: ["hour", "minute", "second"],
    },
    hourCycle: {
      control: "select",
      options: [12, 24],
    },
    classNames: {
      control: "object",
      description: "Per-slot class overrides. Keys match the component anatomy slot names.",
    },
    dir: {
      control: { type: "select" },
      options: ["ltr", "rtl"],
      description: "Text direction for the field.",
      table: { category: "TimeRangeFieldRoot", defaultValue: { summary: "ltr" } },
    },
    hideTimeZone: {
      control: "boolean",
      description: "Hide the time zone display.",
      table: { category: "TimeRangeFieldRoot", defaultValue: { summary: "false" } },
    },
    required: {
      control: "boolean",
      description: "Marks the field as required for form submission.",
      table: { category: "TimeRangeFieldRoot", defaultValue: { summary: "false" } },
    },
  },
  args: {
    label: "Meeting Window",
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
    required: false,
  },
};

export default meta;
type Story = StoryObj<typeof TimeRangeField>;

export const Default: Story = {
  render: (args) => ({
    components: { TimeRangeField },
    setup: () => {
      const value = ref(undefined);
      return { args, value };
    },
    template: `<TimeRangeField v-bind="args" v-model="value" />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { TimeRangeField } from '@auronui/vue'

const value = ref(undefined)
</script>

<template>
  <TimeRangeField label="Meeting Window" v-model="value" />
</template>`,
        language: 'vue',
      },
    },
  },
};

/* ─── Variants ──────────────────────────────────────────────────────────── */

export const Variants: Story = {
  render: (args) => ({
    components: { TimeRangeField },
    setup: () => {
      const v1 = ref({ start: new Time(9, 0), end: new Time(17, 0) });
      const v2 = ref({ start: new Time(9, 0), end: new Time(17, 0) });
      const v3 = ref({ start: new Time(9, 0), end: new Time(17, 0) });
      const v4 = ref({ start: new Time(9, 0), end: new Time(17, 0) });
      const v5 = ref({ start: new Time(9, 0), end: new Time(17, 0) });
      return { args, v1, v2, v3, v4, v5 };
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:1rem; max-width:20rem;">
        <TimeRangeField v-bind="args" label="Flat" variant="flat" v-model="v1" />
        <TimeRangeField v-bind="args" label="Bordered" variant="bordered" v-model="v2" />
        <TimeRangeField v-bind="args" label="Faded" variant="faded" v-model="v3" />
        <TimeRangeField v-bind="args" label="Underlined" variant="underlined" v-model="v4" />
        <TimeRangeField v-bind="args" label="Raised" variant="raised" v-model="v5" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { TimeRangeField } from '@auronui/vue'
import { Time } from '@internationalized/date'

const value = ref({ start: new Time(9, 0), end: new Time(17, 0) })
</script>

<template>
  <TimeRangeField label="Flat" variant="flat" v-model="value" />
  <TimeRangeField label="Bordered" variant="bordered" v-model="value" />
  <TimeRangeField label="Faded" variant="faded" v-model="value" />
  <TimeRangeField label="Underlined" variant="underlined" v-model="value" />
  <TimeRangeField label="Raised" variant="raised" v-model="value" />
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Invalid: Story = {
  args: {
    isInvalid: true,
    errorMessage: "End time must be after start time",
  },
  render: (args) => ({
    components: { TimeRangeField },
    setup: () => {
      const value = ref({ start: new Time(17, 0), end: new Time(9, 0) });
      return { args, value };
    },
    template: `<TimeRangeField v-bind="args" v-model="value" />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { TimeRangeField } from '@auronui/vue'
import { Time } from '@internationalized/date'

const value = ref({ start: new Time(17, 0), end: new Time(9, 0) })
</script>

<template>
  <TimeRangeField
    label="Meeting Window"
    v-model="value"
    :is-invalid="true"
    error-message="End time must be after start time"
  />
</template>`,
        language: 'vue',
      },
    },
  },
};
