import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { defineComponent, ref } from "vue";
import { DateInput } from "@auronui/vue";
import { CalendarDate, CalendarDateTime } from "@internationalized/date";

const meta: Meta<typeof DateInput> = {
  component: DateInput,
  title: "Form/DateInput",
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
    classNames: {
      control: "object",
      description: "Per-slot class overrides. Keys match the component anatomy slot names.",
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
  },
};

export default meta;
type Story = StoryObj<typeof DateInput>;

const calendarIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
`;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { DateInput } from '@auronui/vue'

const value = ref(undefined)
</script>

<template>
  <DateInput label="Date" v-model="value" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { DateInput },
    setup: () => {
      const value = ref(undefined);
      return { args, value };
    },
    template: `<DateInput v-bind="args" v-model="value" />`,
  }),
};

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { DateInput } from '@auronui/vue'

const value = ref(undefined)
</script>

<template>
  <DateInput v-model="value" />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { DateInput },
    setup: () => {
      const value = ref(undefined);
      return { args, value };
    },
    template: `<DateInput v-bind="args" v-model="value" />`,
  }),
};

/* ─── Variants ──────────────────────────────────────────────────────────── */

export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DateInput } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:16px;max-width:360px">
    <DateInput v-for="v in ['flat','bordered','faded','underlined','raised']" :key="v" :variant="v" :label="v" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { DateInput },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:360px">
        <DateInput v-bind="args" v-for="v in ['flat','bordered','faded','underlined','raised']" :key="v" :variant="v" :label="v" />
      </div>
    `,
  }),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DateInput } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:16px;max-width:360px">
    <DateInput v-for="s in ['sm','md','lg']" :key="s" :size="s" :label="'size ' + s" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { DateInput },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:360px">
        <DateInput v-bind="args" v-for="s in ['sm','md','lg']" :key="s" :size="s" :label="'size ' + s" />
      </div>
    `,
  }),
};

export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DateInput } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:16px;max-width:360px">
    <DateInput
      v-for="c in ['default','primary','secondary','accent','success','warning','danger']"
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
  render: (args) => ({
    components: { DateInput },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:360px">
        <DateInput
          v-bind="args"
          v-for="c in ['default','primary','secondary','accent','success','warning','danger']"
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
import { DateInput } from '@auronui/vue'
</script>

<template>
  <DateInput label="Birth Date" label-placement="inside" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { DateInput },
    setup: () => ({ args }),
    template: `<DateInput v-bind="args" />`,
  }),
};

export const LabelPlacementOutside: Story = {
  args: { label: "Birth Date", labelPlacement: "outside" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DateInput } from '@auronui/vue'
</script>

<template>
  <DateInput label="Birth Date" label-placement="outside" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { DateInput },
    setup: () => ({ args }),
    template: `<DateInput v-bind="args" />`,
  }),
};

export const LabelPlacementOutsideLeft: Story = {
  args: { label: "Birth Date", labelPlacement: "outside-left" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DateInput } from '@auronui/vue'
</script>

<template>
  <DateInput label="Birth Date" label-placement="outside-left" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { DateInput },
    setup: () => ({ args }),
    template: `<DateInput v-bind="args" />`,
  }),
};

/* ─── Start / end content ───────────────────────────────────────────────── */

export const WithStartContent: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DateInput } from '@auronui/vue'
</script>

<template>
  <DateInput label="Pick a date">
    <template #startContent>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    </template>
  </DateInput>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { DateInput },
    setup: () => ({ args, calendarIcon }),
    template: `
      <DateInput v-bind="args" label="Pick a date">
        <template #startContent>${calendarIcon}</template>
      </DateInput>
    `,
  }),
};

export const WithEndContent: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DateInput } from '@auronui/vue'
</script>

<template>
  <DateInput label="Pick a date">
    <template #endContent>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    </template>
  </DateInput>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { DateInput },
    setup: () => ({ args, calendarIcon }),
    template: `
      <DateInput v-bind="args" label="Pick a date">
        <template #endContent>${calendarIcon}</template>
      </DateInput>
    `,
  }),
};

export const WithStartAndEndContent: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DateInput } from '@auronui/vue'
</script>

<template>
  <DateInput label="Pick a date">
    <template #startContent>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    </template>
    <template #endContent>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    </template>
  </DateInput>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { DateInput },
    setup: () => ({ args, calendarIcon }),
    template: `
      <DateInput v-bind="args" label="Pick a date">
        <template #startContent>${calendarIcon}</template>
        <template #endContent>${calendarIcon}</template>
      </DateInput>
    `,
  }),
};

export const StartContentAcrossVariants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DateInput } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:16px;max-width:360px">
    <DateInput v-for="v in ['flat','bordered','faded','underlined','raised']" :key="v" :variant="v" :label="v">
      <template #startContent>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </template>
    </DateInput>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { DateInput },
    setup: () => ({ args, calendarIcon }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:360px">
        <DateInput v-bind="args" v-for="v in ['flat','bordered','faded','underlined','raised']" :key="v" :variant="v" :label="v">
          <template #startContent>${calendarIcon}</template>
        </DateInput>
      </div>
    `,
  }),
};

export const StartContentAcrossSizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DateInput } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:16px;max-width:360px">
    <DateInput v-for="s in ['sm','md','lg']" :key="s" :size="s" :label="'size ' + s">
      <template #startContent>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </template>
    </DateInput>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { DateInput },
    setup: () => ({ args, calendarIcon }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:360px">
        <DateInput v-bind="args" v-for="s in ['sm','md','lg']" :key="s" :size="s" :label="'size ' + s">
          <template #startContent>${calendarIcon}</template>
        </DateInput>
      </div>
    `,
  }),
};

/* ─── States ────────────────────────────────────────────────────────────── */

export const WithDescription: Story = {
  args: { label: "Start Date", description: "Enter the event start date" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DateInput } from '@auronui/vue'
</script>

<template>
  <DateInput label="Start Date" description="Enter the event start date" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { DateInput },
    setup: () => ({ args }),
    template: `<DateInput v-bind="args" />`,
  }),
};

export const WithDefaultValue: Story = {
  args: { label: "Appointment Date" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { DateInput } from '@auronui/vue'
import { CalendarDate } from '@internationalized/date'

const value = ref(new CalendarDate(2024, 6, 15))
</script>

<template>
  <DateInput label="Appointment Date" v-model="value" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { DateInput },
    setup: () => {
      const value = ref(new CalendarDate(2024, 6, 15));
      return { args, value };
    },
    template: `<DateInput v-bind="args" v-model="value" />`,
  }),
};

export const Required: Story = {
  args: { label: "Due Date", isRequired: true },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DateInput } from '@auronui/vue'
</script>

<template>
  <DateInput label="Due Date" is-required />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { DateInput },
    setup: () => ({ args }),
    template: `<DateInput v-bind="args" />`,
  }),
};

export const Invalid: Story = {
  args: { label: "Expiry Date", isInvalid: true, errorMessage: "Date is required" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { DateInput } from '@auronui/vue'
</script>

<template>
  <DateInput label="Expiry Date" is-invalid error-message="Date is required" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { DateInput },
    setup: () => ({ args }),
    template: `<DateInput v-bind="args" />`,
  }),
};

export const Disabled: Story = {
  args: { label: "Locked Date", isDisabled: true },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { DateInput } from '@auronui/vue'
import { CalendarDate } from '@internationalized/date'

const value = ref(new CalendarDate(2024, 3, 20))
</script>

<template>
  <DateInput label="Locked Date" is-disabled v-model="value" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { DateInput },
    setup: () => {
      const value = ref(new CalendarDate(2024, 3, 20));
      return { args, value };
    },
    template: `<DateInput v-bind="args" v-model="value" />`,
  }),
};

export const ReadOnly: Story = {
  args: { label: "Fixed Date", isReadOnly: true },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { DateInput } from '@auronui/vue'
import { CalendarDate } from '@internationalized/date'

const value = ref(new CalendarDate(2024, 12, 31))
</script>

<template>
  <DateInput label="Fixed Date" is-read-only v-model="value" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { DateInput },
    setup: () => {
      const value = ref(new CalendarDate(2024, 12, 31));
      return { args, value };
    },
    template: `<DateInput v-bind="args" v-model="value" />`,
  }),
};

export const FullWidth: Story = {
  args: { label: "Full Width Date", fullWidth: true },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { DateInput } from '@auronui/vue'

const value = ref(undefined)
</script>

<template>
  <DateInput label="Full Width Date" full-width v-model="value" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { DateInput },
    setup: () => {
      const value = ref(undefined);
      return { args, value };
    },
    template: `<DateInput v-bind="args" v-model="value" />`,
  }),
};

/* ─── Time ──────────────────────────────────────────────────────────────── */

export const WithTime: Story = {
  args: { label: "Appointment", granularity: "minute" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { DateInput } from '@auronui/vue'
import { CalendarDateTime } from '@internationalized/date'

const value = ref(new CalendarDateTime(2024, 6, 15, 10, 30))
</script>

<template>
  <DateInput label="Appointment" granularity="minute" v-model="value" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { DateInput },
    setup: () => {
      const value = ref(new CalendarDateTime(2024, 6, 15, 10, 30));
      return { args, value };
    },
    template: `<DateInput v-bind="args" v-model="value" />`,
  }),
};

export const WithTimeAndSeconds: Story = {
  args: { label: "Log Timestamp", granularity: "second" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { DateInput } from '@auronui/vue'
import { CalendarDateTime } from '@internationalized/date'

const value = ref(new CalendarDateTime(2024, 6, 15, 10, 30, 45))
</script>

<template>
  <DateInput label="Log Timestamp" granularity="second" v-model="value" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { DateInput },
    setup: () => {
      const value = ref(new CalendarDateTime(2024, 6, 15, 10, 30, 45));
      return { args, value };
    },
    template: `<DateInput v-bind="args" v-model="value" />`,
  }),
};

export const WithTime12Hour: Story = {
  args: { label: "Meeting Time", granularity: "minute", hourCycle: 12 },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { DateInput } from '@auronui/vue'
import { CalendarDateTime } from '@internationalized/date'

const value = ref(new CalendarDateTime(2024, 6, 15, 14, 0))
</script>

<template>
  <DateInput label="Meeting Time" granularity="minute" :hour-cycle="12" v-model="value" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { DateInput },
    setup: () => {
      const value = ref(new CalendarDateTime(2024, 6, 15, 14, 0));
      return { args, value };
    },
    template: `<DateInput v-bind="args" v-model="value" />`,
  }),
};

/* ─── Custom styles via classNames ──────────────────────────────────── */

export const Controlled: Story = {
  name: 'Controlled (v-model)',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { DateInput } from '@auronui/vue'
import { CalendarDate } from '@internationalized/date'

const value = ref(new CalendarDate(2024, 6, 15))
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:8px;padding:16px;">
    <DateInput v-model="value" label="Appointment Date" />
    <p style="font-size:13px;color:#666;">Value: {{ value }}</p>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) =>
    defineComponent({
      components: { DateInput },
      setup() {
        const value = ref(new CalendarDate(2024, 6, 15))
        return { args, value }
      },
      template: `
        <div style="display:flex;flex-direction:column;gap:8px;padding:16px;">
          <DateInput v-bind="args" v-model="value" label="Appointment Date" />
          <p style="font-size:13px;color:#666;">Value: {{ value }}</p>
        </div>
      `,
    }),
}

export const CustomStyles: Story = {
  args: { label: "Styled Date" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { DateInput } from '@auronui/vue'

const value = ref(undefined)

const classNames = {
  inputWrapper: 'border-2 border-blue-500 rounded-xl',
  label: 'text-blue-600 font-semibold',
  segment: 'text-lg font-mono',
  helperWrapper: 'text-blue-500 text-sm',
}
</script>

<template>
  <DateInput
    label="Styled Date"
    v-model="value"
    :class-names="classNames"
    description="Custom styled date input"
  />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { DateInput },
    setup: () => {
      const value = ref(undefined);
      return {
        args,
        value,
        classNames: {
          inputWrapper: "border-2 border-blue-500 rounded-xl",
          label: "text-blue-600 font-semibold",
          segment: "text-lg font-mono",
          helperWrapper: "text-blue-500 text-sm",
        },
      };
    },
    template: `<DateInput v-bind="args" v-model="value" :class-names="classNames" description="Custom styled date input" />`,
  }),
};
