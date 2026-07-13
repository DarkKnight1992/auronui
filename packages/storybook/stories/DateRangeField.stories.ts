import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { defineComponent, ref } from "vue";
import { CalendarDate } from "@internationalized/date";
import { DateRangeField } from "@auronui/vue";

const meta: Meta<typeof DateRangeField> = {
  component: DateRangeField,
  title: "Form/DateRangeField",
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
      options: ["default", "primary", "secondary", "accent", "success", "warning", "danger"],
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
    dir: {
      control: { type: "select" },
      options: ["ltr", "rtl"],
      description: "Text direction for the field.",
      table: { category: "DateRangeFieldRoot", defaultValue: { summary: "ltr" } },
    },
    required: {
      control: "boolean",
      description: "Marks the field as required for form submission.",
      table: { category: "DateRangeFieldRoot", defaultValue: { summary: "false" } },
    },
    classNames: {
      control: "object",
      description: "Per-slot class overrides. Keys match the component anatomy slot names.",
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
    required: false,
  },
};

export default meta;
type Story = StoryObj<typeof DateRangeField>;

export const Default: Story = {
  render: (args) => ({
    components: { DateRangeField },
    setup: () => {
      const value = ref(undefined);
      return { args, value };
    },
    template: `<DateRangeField v-bind="args" v-model="value" />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { DateRangeField } from '@auronui/vue'

const value = ref(undefined)
</script>

<template>
  <DateRangeField label="Date Range" v-model="value" />
</template>`,
        type: "code",
        language: "vue",
      },
    },
  },
};

export const WithDefaultValue: Story = {
  args: {
    label: "Trip Dates",
    defaultValue: {
      start: new CalendarDate(2024, 6, 10),
      end: new CalendarDate(2024, 6, 20),
    },
  },
};

export const Variants: Story = {
  render: (args) => ({
    components: { DateRangeField },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:420px">
        <DateRangeField v-bind="args" v-for="v in ['flat','bordered','faded','underlined','raised']" :key="v" :variant="v" :label="v" />
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: (args) => ({
    components: { DateRangeField },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:420px">
        <DateRangeField v-bind="args" v-for="s in ['sm','md','lg']" :key="s" :size="s" :label="'size ' + s" />
      </div>
    `,
  }),
};

export const WithDescription: Story = {
  args: {
    label: "Vacation Dates",
    description: "Select your vacation start and end dates",
  },
};

export const Required: Story = {
  args: { label: "Required Range", isRequired: true },
};

export const Invalid: Story = {
  args: {
    label: "Event Dates",
    isInvalid: true,
    errorMessage: "Please select a valid date range",
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

export const LabelPlacementOutside: Story = {
  args: { label: "Trip Dates", labelPlacement: "outside" },
};

export const LabelPlacementOutsideLeft: Story = {
  args: { label: "Trip Dates", labelPlacement: "outside-left" },
};

export const Controlled: Story = {
  name: 'Controlled (v-model)',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { DateRangeField } from '@auronui/vue'
import { CalendarDate } from '@internationalized/date'

const value = ref({ start: new CalendarDate(2024, 6, 1), end: new CalendarDate(2024, 6, 15) })
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:8px;padding:16px;">
    <DateRangeField v-model="value" label="Date Range" />
    <p style="font-size:13px;color:#666;">Value: {{ value }}</p>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) =>
    defineComponent({
      components: { DateRangeField },
      setup() {
        const value = ref({ start: new CalendarDate(2024, 6, 1), end: new CalendarDate(2024, 6, 15) })
        return { args, value }
      },
      template: `
        <div style="display:flex;flex-direction:column;gap:8px;padding:16px;">
          <DateRangeField v-bind="args" v-model="value" label="Date Range" />
          <p style="font-size:13px;color:#666;">Value: {{ value }}</p>
        </div>
      `,
    }),
}
