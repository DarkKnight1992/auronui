import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import { TimeField } from "@auronui/vue";
import { Time } from "@internationalized/date";

const meta: Meta<typeof TimeField> = {
  component: TimeField,
  title: "Form/TimeField",
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
  },
  args: {
    label: "Time",
    variant: "flat",
    size: "md",
    color: "default",
    labelPlacement: "inside",
    isInvalid: false,
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof TimeField>;

export const Default: Story = {
  render: (args) => ({
    components: { TimeField },
    setup: () => {
      const value = ref(undefined);
      return { args, value };
    },
    template: `<TimeField v-bind="args" v-model="value" />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { TimeField } from '@auronui/vue'

const value = ref(undefined)
</script>

<template>
  <TimeField v-model="value" />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
};

/* ─── Variants ──────────────────────────────────────────────────────────── */

export const Variants: Story = {
  render: (args) => ({
    components: { TimeField },
    setup: () => {
      const v1 = ref(new Time(10, 30));
      const v2 = ref(new Time(10, 30));
      const v3 = ref(new Time(10, 30));
      const v4 = ref(new Time(10, 30));
      const v5 = ref(new Time(10, 30));
      return { args, v1, v2, v3, v4, v5 };
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:1rem; max-width:16rem;">
        <TimeField v-bind="args" label="Flat" variant="flat" v-model="v1" />
        <TimeField v-bind="args" label="Bordered" variant="bordered" v-model="v2" />
        <TimeField v-bind="args" label="Faded" variant="faded" v-model="v3" />
        <TimeField v-bind="args" label="Underlined" variant="underlined" v-model="v4" />
        <TimeField v-bind="args" label="Raised" variant="raised" v-model="v5" />
      </div>
    `,
  }),
};

/* ─── Sizes ─────────────────────────────────────────────────────────────── */

export const Sizes: Story = {
  render: (args) => ({
    components: { TimeField },
    setup: () => {
      const v1 = ref(new Time(10, 30));
      const v2 = ref(new Time(10, 30));
      const v3 = ref(new Time(10, 30));
      return { args, v1, v2, v3 };
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:1rem; max-width:16rem;">
        <TimeField v-bind="args" label="Small" size="sm" v-model="v1" />
        <TimeField v-bind="args" label="Medium" size="md" v-model="v2" />
        <TimeField v-bind="args" label="Large" size="lg" v-model="v3" />
      </div>
    `,
  }),
};

/* ─── Colors ────────────────────────────────────────────────────────────── */

export const Colors: Story = {
  render: (args) => ({
    components: { TimeField },
    setup: () => {
      const v1 = ref(new Time(10, 30));
      const v2 = ref(new Time(10, 30));
      const v3 = ref(new Time(10, 30));
      const v4 = ref(new Time(10, 30));
      const v5 = ref(new Time(10, 30));
      const v6 = ref(new Time(10, 30));
      return { args, v1, v2, v3, v4, v5, v6 };
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:1rem; max-width:16rem;">
        <TimeField v-bind="args" label="Default" color="default" variant="bordered" v-model="v1" />
        <TimeField v-bind="args" label="Primary" color="primary" variant="bordered" v-model="v2" />
        <TimeField v-bind="args" label="Secondary" color="secondary" variant="bordered" v-model="v3" />
        <TimeField v-bind="args" label="Success" color="success" variant="bordered" v-model="v4" />
        <TimeField v-bind="args" label="Warning" color="warning" variant="bordered" v-model="v5" />
        <TimeField v-bind="args" label="Danger" color="danger" variant="bordered" v-model="v6" />
      </div>
    `,
  }),
};

/* ─── Label Placement ───────────────────────────────────────────────────── */

export const LabelPlacementInside: Story = {
  render: (args) => ({
    components: { TimeField },
    setup: () => {
      const value = ref(undefined);
      return { args, value };
    },
    template: `<TimeField v-bind="args" v-model="value" />`,
  }),
  args: { label: "Inside Label", labelPlacement: "inside" },
};

export const LabelPlacementOutside: Story = {
  render: (args) => ({
    components: { TimeField },
    setup: () => {
      const value = ref(undefined);
      return { args, value };
    },
    template: `<TimeField v-bind="args" v-model="value" />`,
  }),
  args: { label: "Outside Label", labelPlacement: "outside" },
};

export const LabelPlacementOutsideLeft: Story = {
  render: (args) => ({
    components: { TimeField },
    setup: () => {
      const value = ref(undefined);
      return { args, value };
    },
    template: `<TimeField v-bind="args" v-model="value" />`,
  }),
  args: { label: "Time", labelPlacement: "outside-left" },
};

/* ─── Content slots ─────────────────────────────────────────────────────── */

export const StartContent: Story = {
  render: (args) => ({
    components: { TimeField },
    setup: () => {
      const value = ref(new Time(10, 30));
      return { args, value };
    },
    template: `
      <TimeField v-bind="args" v-model="value">
        <template #startContent>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </template>
      </TimeField>
    `,
  }),
  args: { label: "Time", variant: "bordered" },
};

export const EndContent: Story = {
  render: (args) => ({
    components: { TimeField },
    setup: () => {
      const value = ref(new Time(10, 30));
      return { args, value };
    },
    template: `
      <TimeField v-bind="args" v-model="value">
        <template #endContent>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </template>
      </TimeField>
    `,
  }),
  args: { label: "Time", variant: "bordered" },
};

/* ─── Hour cycles and granularity ───────────────────────────────────────── */

export const TwelveHour: Story = {
  render: (args) => ({
    components: { TimeField },
    setup: () => {
      const value = ref(new Time(10, 30));
      return { args, value };
    },
    template: `<TimeField v-bind="args" v-model="value" />`,
  }),
  args: { label: "Meeting Time", hourCycle: 12 },
};

export const TwentyFourHour: Story = {
  render: (args) => ({
    components: { TimeField },
    setup: () => {
      const value = ref(new Time(14, 30));
      return { args, value };
    },
    template: `<TimeField v-bind="args" v-model="value" />`,
  }),
  args: { label: "Event Time", hourCycle: 24 },
};

export const WithSeconds: Story = {
  render: (args) => ({
    components: { TimeField },
    setup: () => {
      const value = ref(new Time(9, 15, 30));
      return { args, value };
    },
    template: `<TimeField v-bind="args" v-model="value" />`,
  }),
  args: { label: "Precise Time", granularity: "second" },
};

/* ─── State / helpers ───────────────────────────────────────────────────── */

export const WithLabel: Story = {
  render: (args) => ({
    components: { TimeField },
    setup: () => {
      const value = ref(undefined);
      return { args, value };
    },
    template: `<TimeField v-bind="args" v-model="value" />`,
  }),
  args: { label: "Start Time" },
};

export const WithDescription: Story = {
  render: (args) => ({
    components: { TimeField },
    setup: () => {
      const value = ref(undefined);
      return { args, value };
    },
    template: `<TimeField v-bind="args" v-model="value" />`,
  }),
  args: {
    label: "Appointment Time",
    description: "Select the appointment time",
  },
};

export const Required: Story = {
  render: (args) => ({
    components: { TimeField },
    setup: () => {
      const value = ref(undefined);
      return { args, value };
    },
    template: `<TimeField v-bind="args" v-model="value" />`,
  }),
  args: { label: "Arrival", isRequired: true },
};

export const Invalid: Story = {
  render: (args) => ({
    components: { TimeField },
    setup: () => {
      const value = ref(undefined);
      return { args, value };
    },
    template: `<TimeField v-bind="args" v-model="value" />`,
  }),
  args: {
    label: "Required Time",
    isInvalid: true,
    errorMessage: "Time is required",
  },
};

export const Disabled: Story = {
  render: (args) => ({
    components: { TimeField },
    setup: () => {
      const value = ref(new Time(9, 0));
      return { args, value };
    },
    template: `<TimeField v-bind="args" v-model="value" />`,
  }),
  args: { label: "Locked Time", isDisabled: true },
};

export const ReadOnly: Story = {
  render: (args) => ({
    components: { TimeField },
    setup: () => {
      const value = ref(new Time(9, 0));
      return { args, value };
    },
    template: `<TimeField v-bind="args" v-model="value" />`,
  }),
  args: { label: "Fixed Time", isReadOnly: true },
};

export const FullWidth: Story = {
  render: (args) => ({
    components: { TimeField },
    setup: () => {
      const value = ref(undefined);
      return { args, value };
    },
    template: `<TimeField v-bind="args" v-model="value" />`,
  }),
  args: { label: "Full Width Time", fullWidth: true },
};

/* ─── Custom Styles ─────────────────────────────────────────────────────── */

export const CustomStyles: Story = {
  render: (args) => ({
    components: { TimeField },
    setup: () => {
      const value = ref(new Time(14, 30));
      return { args, value };
    },
    template: `
      <TimeField
        v-bind="args"
        v-model="value"
        :class-names="{
          label: 'text-blue-600 font-semibold',
          inputWrapper: 'border-2 border-blue-500 rounded-xl',
          segment: 'font-mono text-lg',
          helperWrapper: 'text-blue-500 text-sm',
        }"
      />
    `,
  }),
  args: {
    label: "Custom Styled Time",
    variant: "bordered",
    description: "Styled with custom Tailwind classes",
  },
  name: "Custom styles via classNames",
};
