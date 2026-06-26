import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { defineComponent, ref } from "vue";
import { Slider } from "@auronui/vue";

const meta: Meta<typeof Slider> = {
  component: Slider,
  title: "Components/Slider",
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "secondary", "success", "warning", "danger"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    radius: {
      control: "select",
      options: ["none", "sm", "md", "lg", "full"],
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
    showSteps: { control: "boolean" },
    hideValue: { control: "boolean" },
    label: { control: "text" },
    classNames: { control: "object", description: "Per-slot class overrides. Keys match the component anatomy slot names." },
    dir: {
      control: { type: "select" },
      options: ["ltr", "rtl"],
      description: "Text direction forwarded to SliderRoot.",
      table: { category: "SliderRoot", defaultValue: { summary: "undefined" } },
    },
    thumbAlignment: {
      control: { type: "select" },
      options: ["contain", "overflow"],
      description: "How the thumbs align relative to the track ends.",
      table: { category: "SliderRoot", defaultValue: { summary: "undefined" } },
    },
    asChild: {
      control: "boolean",
      description: "Whether SliderRoot renders as a child element.",
      table: { category: "SliderRoot", defaultValue: { summary: "false" } },
    },
    as: {
      control: "text",
      description: "Element or component to render SliderRoot as.",
      table: { category: "SliderRoot", defaultValue: { summary: "undefined" } },
    },
    name: {
      control: "text",
      description: "HTML name attribute forwarded to SliderRoot.",
      table: { category: "SliderRoot", defaultValue: { summary: "undefined" } },
    },
    required: {
      control: "boolean",
      description: "Whether the slider is required.",
      table: { category: "SliderRoot", defaultValue: { summary: "false" } },
    },
    trackAsChild: {
      control: "boolean",
      description: "Whether SliderTrack renders as a child element.",
      table: { category: "SliderTrack", defaultValue: { summary: "false" } },
    },
    trackAs: {
      control: "text",
      description: "Element or component to render SliderTrack as.",
      table: { category: "SliderTrack", defaultValue: { summary: "undefined" } },
    },
    rangeAsChild: {
      control: "boolean",
      description: "Whether SliderRange renders as a child element.",
      table: { category: "SliderRange", defaultValue: { summary: "false" } },
    },
    rangeAs: {
      control: "text",
      description: "Element or component to render SliderRange as.",
      table: { category: "SliderRange", defaultValue: { summary: "undefined" } },
    },
    thumbAsChild: {
      control: "boolean",
      description: "Whether SliderThumb renders as a child element.",
      table: { category: "SliderThumb", defaultValue: { summary: "false" } },
    },
    thumbAs: {
      control: "text",
      description: "Element or component to render SliderThumb as.",
      table: { category: "SliderThumb", defaultValue: { summary: "undefined" } },
    },
  },
  args: {
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    showSteps: false,
    hideValue: false,
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    asChild: false,
    required: false,
    trackAsChild: false,
    rangeAsChild: false,
    thumbAsChild: false,
  },
  render: (args) => ({
    components: { Slider },
    setup() {
      const value = ref(50);
      return { args, value };
    },
    template: `<Slider
      v-bind="args"
      v-model="value"
      :dir="args.dir"
      :thumb-alignment="args.thumbAlignment"
      :as-child="args.asChild"
      :as="args.as"
      :name="args.name"
      :required="args.required"
      :track-as-child="args.trackAsChild"
      :track-as="args.trackAs"
      :range-as-child="args.rangeAsChild"
      :range-as="args.rangeAs"
      :thumb-as-child="args.thumbAsChild"
      :thumb-as="args.thumbAs"
      style="max-width: 400px;"
    />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Slider } from '@auronui/vue'

const value = ref(50)
</script>

<template>
  <Slider v-model="value" style="max-width: 400px;" />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
};

export const Range: Story = {
  render: (args) => ({
    components: { Slider },
    setup() {
      const value = ref([20, 80]);
      return { args, value };
    },
    template: `<Slider v-bind="args" v-model="value" label="Price range" style="max-width: 400px;" />`,
  }),
  args: {
    min: 0,
    max: 100,
  },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Slider } from '@auronui/vue'

const value = ref([20, 80])
</script>

<template>
  <Slider v-model="value" label="Price range" :min="0" :max="100" style="max-width: 400px;" />
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Sizes: Story = {
  render: (args) => ({
    components: { Slider },
    setup() {
      const sm = ref(30);
      const md = ref(50);
      const lg = ref(70);
      return { args, sm, md, lg };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
        <Slider v-bind="args" v-model="sm" size="sm" label="Small" min="0" max="100" />
        <Slider v-bind="args" v-model="md" size="md" label="Medium" min="0" max="100" />
        <Slider v-bind="args" v-model="lg" size="lg" label="Large" min="0" max="100" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Slider } from '@auronui/vue'

const sm = ref(30)
const md = ref(50)
const lg = ref(70)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
    <Slider v-model="sm" size="sm" label="Small" :min="0" :max="100" />
    <Slider v-model="md" size="md" label="Medium" :min="0" :max="100" />
    <Slider v-model="lg" size="lg" label="Large" :min="0" :max="100" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Colors: Story = {
  render: (args) => ({
    components: { Slider },
    setup() {
      const primary = ref(40);
      const secondary = ref(50);
      const success = ref(60);
      const warning = ref(70);
      const danger = ref(80);
      return { args, primary, secondary, success, warning, danger };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
        <Slider v-bind="args" v-model="primary" color="primary" label="Primary" min="0" max="100" />
        <Slider v-bind="args" v-model="secondary" color="secondary" label="Secondary" min="0" max="100" />
        <Slider v-bind="args" v-model="success" color="success" label="Success" min="0" max="100" />
        <Slider v-bind="args" v-model="warning" color="warning" label="Warning" min="0" max="100" />
        <Slider v-bind="args" v-model="danger" color="danger" label="Danger" min="0" max="100" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Slider } from '@auronui/vue'

const primary = ref(40)
const secondary = ref(50)
const success = ref(60)
const warning = ref(70)
const danger = ref(80)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
    <Slider v-model="primary" color="primary" label="Primary" :min="0" :max="100" />
    <Slider v-model="secondary" color="secondary" label="Secondary" :min="0" :max="100" />
    <Slider v-model="success" color="success" label="Success" :min="0" :max="100" />
    <Slider v-model="warning" color="warning" label="Warning" :min="0" :max="100" />
    <Slider v-model="danger" color="danger" label="Danger" :min="0" :max="100" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const WithLabel: Story = {
  render: (args) => ({
    components: { Slider },
    setup() {
      const value = ref(30);
      return { args, value };
    },
    template: `<Slider v-bind="args" v-model="value" label="Volume" style="max-width: 400px;" />`,
  }),
  args: {
    min: 0,
    max: 100,
  },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Slider } from '@auronui/vue'

const value = ref(30)
</script>

<template>
  <Slider v-model="value" label="Volume" :min="0" :max="100" style="max-width: 400px;" />
</template>`,
        language: 'vue',
      },
    },
  },
};

export const WithSteps: Story = {
  render: (args) => ({
    components: { Slider },
    setup() {
      const value = ref(40);
      return { args, value };
    },
    template: `<Slider v-bind="args" v-model="value" label="Brightness" show-steps style="max-width: 400px;" />`,
  }),
  args: {
    min: 0,
    max: 100,
    step: 10,
    showSteps: true,
  },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Slider } from '@auronui/vue'

const value = ref(40)
</script>

<template>
  <Slider v-model="value" label="Brightness" :min="0" :max="100" :step="10" show-steps style="max-width: 400px;" />
</template>`,
        language: 'vue',
      },
    },
  },
};

export const WithMarks: Story = {
  render: (args) => ({
    components: { Slider },
    setup() {
      const value = ref(50);
      const marks = [
        { value: 25, label: "1/4" },
        { value: 50, label: "1/2" },
        { value: 75, label: "3/4" },
      ];
      return { args, value, marks };
    },
    template: `<Slider v-bind="args" v-model="value" label="Progress" :marks="marks" style="max-width: 400px;" />`,
  }),
  args: {
    min: 0,
    max: 100,
  },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Slider } from '@auronui/vue'

const value = ref(50)
const marks = [
  { value: 25, label: '1/4' },
  { value: 50, label: '1/2' },
  { value: 75, label: '3/4' },
]
</script>

<template>
  <Slider v-model="value" label="Progress" :min="0" :max="100" :marks="marks" style="max-width: 400px;" />
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Vertical: Story = {
  render: (args) => ({
    components: { Slider },
    setup() {
      const value = ref(50);
      return { args, value };
    },
    template: `<Slider v-bind="args" v-model="value" label="Level" style="height: 200px;" />`,
  }),
  args: {
    orientation: "vertical",
    min: 0,
    max: 100,
  },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Slider } from '@auronui/vue'

const value = ref(50)
</script>

<template>
  <Slider v-model="value" orientation="vertical" label="Level" :min="0" :max="100" style="height: 200px;" />
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Disabled: Story = {
  render: (args) => ({
    components: { Slider },
    setup() {
      const value = ref(40);
      return { args, value };
    },
    template: `<Slider v-bind="args" v-model="value" label="Disabled slider" style="max-width: 400px;" />`,
  }),
  args: {
    disabled: true,
    min: 0,
    max: 100,
  },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Slider } from '@auronui/vue'

const value = ref(40)
</script>

<template>
  <Slider v-model="value" label="Disabled slider" :min="0" :max="100" disabled style="max-width: 400px;" />
</template>`,
        language: 'vue',
      },
    },
  },
};

export const StartEndContent: Story = {
  render: (args) => ({
    components: { Slider },
    setup() {
      const value = ref(50);
      return { args, value };
    },
    template: `
      <Slider v-bind="args" v-model="value" label="Volume" style="max-width: 440px;">
        <template #startContent>
          <span style="font-size: 18px;">🔇</span>
        </template>
        <template #endContent>
          <span style="font-size: 18px;">🔊</span>
        </template>
      </Slider>
    `,
  }),
  args: {
    min: 0,
    max: 100,
  },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Slider } from '@auronui/vue'

const value = ref(50)
</script>

<template>
  <Slider v-model="value" label="Volume" :min="0" :max="100" style="max-width: 440px;">
    <template #startContent>
      <span style="font-size: 18px;">🔇</span>
    </template>
    <template #endContent>
      <span style="font-size: 18px;">🔊</span>
    </template>
  </Slider>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Controlled: Story = {
  name: 'Controlled (v-model)',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Slider } from '@auronui/vue'

const value = ref(50)
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:8px;padding:16px;">
    <Slider v-model="value" label="Volume" style="max-width:400px;" />
    <p style="font-size:13px;color:#666;">Value: {{ value }}</p>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) =>
    defineComponent({
      components: { Slider },
      setup() {
        const value = ref(50)
        return { args, value }
      },
      template: `
        <div style="display:flex;flex-direction:column;gap:8px;padding:16px;">
          <Slider v-bind="args" v-model="value" label="Volume" style="max-width:400px;" />
          <p style="font-size:13px;color:#666;">Value: {{ value }}</p>
        </div>
      `,
    }),
}

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  render: (args) => ({
    components: { Slider },
    setup() {
      const value = ref(65);
      return { args, value };
    },
    template: `
      <Slider
        v-bind="args"
        v-model="value"
        label="Custom styled slider"
        style="max-width: 400px;"
        :class-names="{
          output: 'text-lg font-bold text-blue-600',
          track: 'bg-blue-100 border-2 border-blue-400 rounded-full',
          fill: 'bg-gradient-to-r from-blue-500 to-blue-600',
          thumb: 'border-2 border-blue-600 bg-white shadow-lg',
        }"
      />
    `,
  }),
  args: {
    min: 0,
    max: 100,
  },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Slider } from '@auronui/vue'

const value = ref(65)
</script>

<template>
  <Slider
    v-model="value"
    label="Custom styled slider"
    :min="0"
    :max="100"
    style="max-width: 400px;"
    :class-names="{
      output: 'text-lg font-bold text-blue-600',
      track: 'bg-blue-100 border-2 border-blue-400 rounded-full',
      fill: 'bg-gradient-to-r from-blue-500 to-blue-600',
      thumb: 'border-2 border-blue-600 bg-white shadow-lg',
    }"
  />
</template>`,
        language: 'vue',
      },
    },
  },
};
