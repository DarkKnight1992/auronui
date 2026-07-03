import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import { Time } from "@internationalized/date";
import { TimePicker } from "@auronui/vue";

const BASE_VALUE = new Time(10, 30);
const BASE_VALUE_WITH_SECONDS = new Time(10, 30, 45);

const meta: Meta<typeof TimePicker> = {
  component: TimePicker,
  title: "Form/TimePicker",
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
      options: ["hour", "minute", "second"],
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
    doneLabel: { control: "text" },
    classNames: { control: "object", description: "Per-slot class overrides. Keys match the component anatomy slot names." },
    dir: {
      control: { type: "select" },
      options: ["ltr", "rtl"],
      description: "Text direction.",
      table: { category: "TimeFieldRoot", defaultValue: { summary: "ltr" } },
    },
    triggerAs: {
      control: "text",
      description: "Render trigger as a different element.",
      table: { category: "PopoverTrigger", defaultValue: { summary: "button" } },
    },
    triggerAsChild: {
      control: "boolean",
      description: "Render trigger child as root element.",
      table: { category: "PopoverTrigger", defaultValue: { summary: "false" } },
    },
    side: {
      control: { type: "select" },
      options: ["top", "right", "bottom", "left"],
      description: "Side of the anchor the content appears on.",
      table: { category: "PopoverContent", defaultValue: { summary: "bottom" } },
    },
    sideOffset: {
      control: "number",
      description: "Distance in px from the anchor.",
      table: { category: "PopoverContent", defaultValue: { summary: "8" } },
    },
    align: {
      control: { type: "select" },
      options: ["start", "center", "end"],
      description: "Alignment of the content relative to the anchor.",
      table: { category: "PopoverContent", defaultValue: { summary: "center" } },
    },
    avoidCollisions: {
      control: "boolean",
      description: "Avoid collisions with the viewport.",
      table: { category: "PopoverContent", defaultValue: { summary: "true" } },
    },
    sticky: {
      control: { type: "select" },
      options: ["partial", "always"],
      description: "Sticky behavior when overflowing.",
      table: { category: "PopoverContent", defaultValue: { summary: "partial" } },
    },
    positionStrategy: {
      control: { type: "select" },
      options: ["fixed", "absolute"],
      description: "CSS position strategy.",
      table: { category: "PopoverContent", defaultValue: { summary: "fixed" } },
    },
  },
  args: {
    label: "Time",
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
    triggerAsChild: false,
    avoidCollisions: true,
    doneLabel: "Done",
  },
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

/* ─── Playground / Default ──────────────────────────────────────────────── */

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { TimePicker } from '@auronui/vue'

const value = ref(undefined)
</script>

<template>
  <TimePicker v-model="value" label="Time" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args: any) => ({
    components: { TimePicker },
    setup: () => {
      const value = ref(undefined);
      return { args, value };
    },
    template: `<TimePicker v-bind="args" v-model="value" />`,
  }),
};

export const Default: Story = {
  args: {
    label: "Appointment Time",
    defaultValue: BASE_VALUE,
  },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { TimePicker } from '@auronui/vue'
</script>

<template>
  <TimePicker label="Appointment Time" />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args: any) => ({
    components: { TimePicker },
    setup: () => ({ args }),
    template: `<TimePicker v-bind="args" />`,
  }),
};

/* ─── Controlled value ──────────────────────────────────────────────────── */

export const Controlled: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Time } from '@internationalized/date'
import { TimePicker } from '@auronui/vue'

const value = ref(new Time(10, 30))
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px;max-width:280px">
    <TimePicker v-model="value" label="Time" />
    <p style="font-size:0.875rem;color:#666">Emitted value: {{ value ? value.toString() : 'none' }}</p>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args: any) => ({
    components: { TimePicker },
    setup: () => {
      const value = ref(BASE_VALUE);
      return { args, value };
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:280px">
        <TimePicker v-bind="args" v-model="value" />
        <p style="font-size:0.875rem;color:#666">Emitted value: {{ value ? value.toString() : 'none' }}</p>
      </div>
    `,
  }),
};

/* ─── Granularity / hour cycle ──────────────────────────────────────────── */

export const Granularity: Story = {
  args: {
    label: "Time with Seconds",
    granularity: "second",
    defaultValue: BASE_VALUE_WITH_SECONDS,
  },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Time } from '@internationalized/date'
import { TimePicker } from '@auronui/vue'
</script>

<template>
  <TimePicker
    label="Time with Seconds"
    granularity="second"
    :default-value="new Time(10, 30, 45)"
  />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args: any) => ({
    components: { TimePicker },
    setup: () => ({ args }),
    template: `<TimePicker v-bind="args" />`,
  }),
};

export const HourCycle12: Story = {
  args: {
    label: "Time (12h)",
    hourCycle: 12,
    defaultValue: BASE_VALUE,
  },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Time } from '@internationalized/date'
import { TimePicker } from '@auronui/vue'
</script>

<template>
  <TimePicker
    label="Time (12h)"
    :hour-cycle="12"
    :default-value="new Time(10, 30)"
  />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args: any) => ({
    components: { TimePicker },
    setup: () => ({ args }),
    template: `<TimePicker v-bind="args" />`,
  }),
};

/* ─── Variants / Sizes / Colors ─────────────────────────────────────────── */

export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { TimePicker } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:16px;max-width:280px">
    <TimePicker variant="flat" label="flat" />
    <TimePicker variant="bordered" label="bordered" />
    <TimePicker variant="faded" label="faded" />
    <TimePicker variant="underlined" label="underlined" />
    <TimePicker variant="raised" label="raised" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args: any) => ({
    components: { TimePicker },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:280px">
        <TimePicker v-bind="args" v-for="v in ['flat','bordered','faded','underlined','raised']" :key="v" :variant="v" :label="v" />
      </div>
    `,
  }),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { TimePicker } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:16px;max-width:280px">
    <TimePicker size="sm" label="size sm" />
    <TimePicker size="md" label="size md" />
    <TimePicker size="lg" label="size lg" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args: any) => ({
    components: { TimePicker },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:280px">
        <TimePicker v-bind="args" v-for="s in ['sm','md','lg']" :key="s" :size="s" :label="'size ' + s" />
      </div>
    `,
  }),
};

export const Colors: Story = {
  args: { variant: "bordered" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { TimePicker } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:16px;max-width:280px">
    <TimePicker variant="bordered" color="default" label="default" />
    <TimePicker variant="bordered" color="primary" label="primary" />
    <TimePicker variant="bordered" color="secondary" label="secondary" />
    <TimePicker variant="bordered" color="success" label="success" />
    <TimePicker variant="bordered" color="warning" label="warning" />
    <TimePicker variant="bordered" color="danger" label="danger" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args: any) => ({
    components: { TimePicker },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:280px">
        <TimePicker
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { TimePicker } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:16px;max-width:280px">
    <TimePicker label-placement="inside" label="inside" />
    <TimePicker label-placement="outside" label="outside" />
    <TimePicker label-placement="outside-left" label="outside-left" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args: any) => ({
    components: { TimePicker },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:280px">
        <TimePicker v-bind="args" v-for="p in ['inside','outside','outside-left']" :key="p" :labelPlacement="p" :label="p" />
      </div>
    `,
  }),
};

/* ─── States ────────────────────────────────────────────────────────────── */

export const Disabled: Story = {
  args: {
    label: "Locked Time",
    isDisabled: true,
    defaultValue: BASE_VALUE,
  },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Time } from '@internationalized/date'
import { TimePicker } from '@auronui/vue'
</script>

<template>
  <TimePicker
    label="Locked Time"
    is-disabled
    :default-value="new Time(10, 30)"
  />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args: any) => ({
    components: { TimePicker },
    setup: () => ({ args }),
    template: `<TimePicker v-bind="args" />`,
  }),
};

export const ReadOnly: Story = {
  args: {
    label: "Fixed Time",
    isReadOnly: true,
    defaultValue: BASE_VALUE,
  },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Time } from '@internationalized/date'
import { TimePicker } from '@auronui/vue'
</script>

<template>
  <TimePicker
    label="Fixed Time"
    is-read-only
    :default-value="new Time(10, 30)"
  />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args: any) => ({
    components: { TimePicker },
    setup: () => ({ args }),
    template: `<TimePicker v-bind="args" />`,
  }),
};

export const Invalid: Story = {
  args: {
    label: "Meeting Time",
    isInvalid: true,
    errorMessage: "Please select a valid time",
    defaultValue: BASE_VALUE,
  },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Time } from '@internationalized/date'
import { TimePicker } from '@auronui/vue'
</script>

<template>
  <TimePicker
    label="Meeting Time"
    is-invalid
    error-message="Please select a valid time"
    :default-value="new Time(10, 30)"
  />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args: any) => ({
    components: { TimePicker },
    setup: () => ({ args }),
    template: `<TimePicker v-bind="args" />`,
  }),
};

export const Required: Story = {
  args: {
    label: "Reminder Time",
    isRequired: true,
  },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { TimePicker } from '@auronui/vue'
</script>

<template>
  <TimePicker label="Reminder Time" is-required />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args: any) => ({
    components: { TimePicker },
    setup: () => ({ args }),
    template: `<TimePicker v-bind="args" />`,
  }),
};

export const FullWidth: Story = {
  args: {
    label: "Full Width Time",
    fullWidth: true,
  },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { TimePicker } from '@auronui/vue'
</script>

<template>
  <TimePicker label="Full Width Time" full-width />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args: any) => ({
    components: { TimePicker },
    setup: () => ({ args }),
    template: `<TimePicker v-bind="args" />`,
  }),
};

/* ─── Constraints ───────────────────────────────────────────────────────── */

export const WithConstraints: Story = {
  args: {
    label: "Constrained Time",
    description: "Select a time between 9am and 5pm",
    defaultValue: BASE_VALUE,
    minValue: new Time(9, 0),
    maxValue: new Time(17, 0),
  },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Time } from '@internationalized/date'
import { TimePicker } from '@auronui/vue'
</script>

<template>
  <TimePicker
    label="Constrained Time"
    description="Select a time between 9am and 5pm"
    :default-value="new Time(10, 30)"
    :min-value="new Time(9, 0)"
    :max-value="new Time(17, 0)"
  />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args: any) => ({
    components: { TimePicker },
    setup: () => ({ args }),
    template: `<TimePicker v-bind="args" />`,
  }),
};

/* ─── Custom styles via classNames ─────────────────────────────────── */

export const CustomStyles: Story = {
  args: {
    label: "Styled Time",
    defaultValue: BASE_VALUE,
    classNames: {
      trigger: "border-2 border-blue-500 rounded-lg",
      panel: "bg-blue-50/30 rounded-xl",
    },
  },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Time } from '@internationalized/date'
import { TimePicker } from '@auronui/vue'
</script>

<template>
  <TimePicker
    label="Styled Time"
    :default-value="new Time(10, 30)"
    :class-names="{
      trigger: 'border-2 border-blue-500 rounded-lg',
      panel: 'bg-blue-50/30 rounded-xl',
    }"
  />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args: any) => ({
    components: { TimePicker },
    setup: () => ({ args }),
    template: `<TimePicker v-bind="args" />`,
  }),
};
