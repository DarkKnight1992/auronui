import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { defineComponent, ref } from "vue";
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
    dir: {
      control: { type: "select" },
      options: ["ltr", "rtl"],
      description: "Text direction for the field.",
      table: { category: "TimeFieldRoot", defaultValue: { summary: "ltr" } },
    },
    hideTimeZone: {
      control: "boolean",
      description: "Hide the time zone display.",
      table: { category: "TimeFieldRoot", defaultValue: { summary: "false" } },
    },
    stepSnapping: {
      control: "boolean",
      description: "Enable step snapping behavior.",
      table: { category: "TimeFieldRoot", defaultValue: { summary: "true" } },
    },
    required: {
      control: "boolean",
      description: "Marks the field as required for form submission.",
      table: { category: "TimeFieldRoot", defaultValue: { summary: "false" } },
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
    hideTimeZone: false,
    stepSnapping: true,
    required: false,
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
  <TimeField label="Time" v-model="value" />
</template>`,
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { TimeField } from '@auronui/vue'
import { Time } from '@internationalized/date'

const v1 = ref(new Time(10, 30))
const v2 = ref(new Time(10, 30))
const v3 = ref(new Time(10, 30))
const v4 = ref(new Time(10, 30))
const v5 = ref(new Time(10, 30))
</script>

<template>
  <div class="flex flex-col gap-4 max-w-64">
    <TimeField label="Flat" variant="flat" v-model="v1" />
    <TimeField label="Bordered" variant="bordered" v-model="v2" />
    <TimeField label="Faded" variant="faded" v-model="v3" />
    <TimeField label="Underlined" variant="underlined" v-model="v4" />
    <TimeField label="Raised" variant="raised" v-model="v5" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { TimeField } from '@auronui/vue'
import { Time } from '@internationalized/date'

const v1 = ref(new Time(10, 30))
const v2 = ref(new Time(10, 30))
const v3 = ref(new Time(10, 30))
</script>

<template>
  <div class="flex flex-col gap-4 max-w-64">
    <TimeField label="Small" size="sm" v-model="v1" />
    <TimeField label="Medium" size="md" v-model="v2" />
    <TimeField label="Large" size="lg" v-model="v3" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { TimeField } from '@auronui/vue'
import { Time } from '@internationalized/date'

const v1 = ref(new Time(10, 30))
const v2 = ref(new Time(10, 30))
const v3 = ref(new Time(10, 30))
const v4 = ref(new Time(10, 30))
const v5 = ref(new Time(10, 30))
const v6 = ref(new Time(10, 30))
</script>

<template>
  <div class="flex flex-col gap-4 max-w-64">
    <TimeField label="Default" color="default" variant="bordered" v-model="v1" />
    <TimeField label="Primary" color="primary" variant="bordered" v-model="v2" />
    <TimeField label="Secondary" color="secondary" variant="bordered" v-model="v3" />
    <TimeField label="Success" color="success" variant="bordered" v-model="v4" />
    <TimeField label="Warning" color="warning" variant="bordered" v-model="v5" />
    <TimeField label="Danger" color="danger" variant="bordered" v-model="v6" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { TimeField } from '@auronui/vue'

const value = ref(undefined)
</script>

<template>
  <TimeField label="Inside Label" labelPlacement="inside" v-model="value" />
</template>`,
        language: 'vue',
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { TimeField } from '@auronui/vue'

const value = ref(undefined)
</script>

<template>
  <TimeField label="Outside Label" labelPlacement="outside" v-model="value" />
</template>`,
        language: 'vue',
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { TimeField } from '@auronui/vue'

const value = ref(undefined)
</script>

<template>
  <TimeField label="Time" labelPlacement="outside-left" v-model="value" />
</template>`,
        language: 'vue',
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { TimeField } from '@auronui/vue'
import { Time } from '@internationalized/date'

const value = ref(new Time(10, 30))
</script>

<template>
  <TimeField label="Time" variant="bordered" v-model="value">
    <template #startContent>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    </template>
  </TimeField>
</template>`,
        language: 'vue',
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { TimeField } from '@auronui/vue'
import { Time } from '@internationalized/date'

const value = ref(new Time(10, 30))
</script>

<template>
  <TimeField label="Time" variant="bordered" v-model="value">
    <template #endContent>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    </template>
  </TimeField>
</template>`,
        language: 'vue',
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { TimeField } from '@auronui/vue'
import { Time } from '@internationalized/date'

const value = ref(new Time(10, 30))
</script>

<template>
  <TimeField label="Meeting Time" :hourCycle="12" v-model="value" />
</template>`,
        language: 'vue',
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { TimeField } from '@auronui/vue'
import { Time } from '@internationalized/date'

const value = ref(new Time(14, 30))
</script>

<template>
  <TimeField label="Event Time" :hourCycle="24" v-model="value" />
</template>`,
        language: 'vue',
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { TimeField } from '@auronui/vue'
import { Time } from '@internationalized/date'

const value = ref(new Time(9, 15, 30))
</script>

<template>
  <TimeField label="Precise Time" granularity="second" v-model="value" />
</template>`,
        language: 'vue',
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { TimeField } from '@auronui/vue'

const value = ref(undefined)
</script>

<template>
  <TimeField label="Start Time" v-model="value" />
</template>`,
        language: 'vue',
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { TimeField } from '@auronui/vue'

const value = ref(undefined)
</script>

<template>
  <TimeField
    label="Appointment Time"
    description="Select the appointment time"
    v-model="value"
  />
</template>`,
        language: 'vue',
      },
    },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { TimeField } from '@auronui/vue'

const value = ref(undefined)
</script>

<template>
  <TimeField label="Arrival" isRequired v-model="value" />
</template>`,
        language: 'vue',
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { TimeField } from '@auronui/vue'

const value = ref(undefined)
</script>

<template>
  <TimeField
    label="Required Time"
    isInvalid
    errorMessage="Time is required"
    v-model="value"
  />
</template>`,
        language: 'vue',
      },
    },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { TimeField } from '@auronui/vue'
import { Time } from '@internationalized/date'

const value = ref(new Time(9, 0))
</script>

<template>
  <TimeField label="Locked Time" isDisabled v-model="value" />
</template>`,
        language: 'vue',
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { TimeField } from '@auronui/vue'
import { Time } from '@internationalized/date'

const value = ref(new Time(9, 0))
</script>

<template>
  <TimeField label="Fixed Time" isReadOnly v-model="value" />
</template>`,
        language: 'vue',
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { TimeField } from '@auronui/vue'

const value = ref(undefined)
</script>

<template>
  <TimeField label="Full Width Time" fullWidth v-model="value" />
</template>`,
        language: 'vue',
      },
    },
  },
};

/* ─── Custom Styles ─────────────────────────────────────────────────────── */

export const Controlled: Story = {
  name: 'Controlled (v-model)',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { TimeField } from '@auronui/vue'
import { Time } from '@internationalized/date'

const value = ref(new Time(10, 30))
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:8px;padding:16px;">
    <TimeField v-model="value" label="Time" />
    <p style="font-size:13px;color:#666;">Value: {{ value }}</p>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) =>
    defineComponent({
      components: { TimeField },
      setup() {
        const value = ref(new Time(10, 30))
        return { args, value }
      },
      template: `
        <div style="display:flex;flex-direction:column;gap:8px;padding:16px;">
          <TimeField v-bind="args" v-model="value" label="Time" />
          <p style="font-size:13px;color:#666;">Value: {{ value }}</p>
        </div>
      `,
    }),
}

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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { TimeField } from '@auronui/vue'
import { Time } from '@internationalized/date'

const value = ref(new Time(14, 30))
</script>

<template>
  <TimeField
    label="Custom Styled Time"
    variant="bordered"
    description="Styled with custom Tailwind classes"
    :classNames="{
      label: 'text-blue-600 font-semibold',
      inputWrapper: 'border-2 border-blue-500 rounded-xl',
      segment: 'font-mono text-lg',
      helperWrapper: 'text-blue-500 text-sm',
    }"
    v-model="value"
  />
</template>`,
        language: 'vue',
      },
    },
  },
};
