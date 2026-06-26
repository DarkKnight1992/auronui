import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Radio, RadioGroup } from '@auronui/vue'
import { ref } from 'vue'

const meta: Meta = {
  title: 'Form/Radio',
  tags: ['autodocs'],
  component: RadioGroup,
  argTypes: {
    classNames: { control: 'object', description: 'Per-slot class overrides. Keys match the component anatomy slot names.' },
    dir: {
      control: { type: 'select' },
      options: ['ltr', 'rtl'],
      description: 'Text direction forwarded to RadioGroupRoot.',
      table: { category: 'RadioGroupRoot', defaultValue: { summary: 'undefined' } },
    },
    loop: {
      control: 'boolean',
      description: 'Whether keyboard navigation loops from last to first item.',
      table: { category: 'RadioGroupRoot', defaultValue: { summary: 'true' } },
    },
    asChild: {
      control: 'boolean',
      description: 'Whether RadioGroupRoot renders as a child element.',
      table: { category: 'RadioGroupRoot', defaultValue: { summary: 'false' } },
    },
    as: {
      control: 'text',
      description: 'Element or component to render RadioGroupRoot as.',
      table: { category: 'RadioGroupRoot', defaultValue: { summary: 'undefined' } },
    },
    required: {
      control: 'boolean',
      description: 'Whether the radio group is required.',
      table: { category: 'RadioGroupRoot', defaultValue: { summary: 'false' } },
    },
    itemId: {
      control: 'text',
      description: 'HTML id attribute forwarded to RadioGroupItem.',
      table: { category: 'RadioGroupItem', defaultValue: { summary: 'undefined' } },
    },
    itemAsChild: {
      control: 'boolean',
      description: 'Whether RadioGroupItem renders as a child element.',
      table: { category: 'RadioGroupItem', defaultValue: { summary: 'false' } },
    },
    itemAs: {
      control: 'text',
      description: 'Element or component to render RadioGroupItem as.',
      table: { category: 'RadioGroupItem', defaultValue: { summary: 'undefined' } },
    },
    itemName: {
      control: 'text',
      description: 'HTML name attribute forwarded to RadioGroupItem.',
      table: { category: 'RadioGroupItem', defaultValue: { summary: 'undefined' } },
    },
    itemRequired: {
      control: 'boolean',
      description: 'Whether each radio item is required.',
      table: { category: 'RadioGroupItem', defaultValue: { summary: 'false' } },
    },
    indicatorForceMount: {
      control: 'boolean',
      description: 'Force-mount the RadioGroupIndicator even when unselected, useful for CSS animations.',
      table: { category: 'RadioGroupIndicator', defaultValue: { summary: 'undefined' } },
    },
    indicatorAsChild: {
      control: 'boolean',
      description: 'Whether RadioGroupIndicator renders as a child element.',
      table: { category: 'RadioGroupIndicator', defaultValue: { summary: 'false' } },
    },
    indicatorAs: {
      control: 'text',
      description: 'Element or component to render RadioGroupIndicator as.',
      table: { category: 'RadioGroupIndicator', defaultValue: { summary: 'undefined' } },
    },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  args: {
    loop: true,
    asChild: false,
    required: false,
    itemAsChild: false,
    itemRequired: false,
    indicatorForceMount: false,
    indicatorAsChild: false,
  },
  render: (args) => ({
    components: { Radio, RadioGroup },
    setup() {
      const selected = ref('')
      return { args, selected }
    },
    template: `
      <RadioGroup
        v-bind="args"
        v-model="selected"
        label="Choose a framework"
        :dir="args.dir"
        :loop="args.loop"
        :as-child="args.asChild"
        :as="args.as"
        :required="args.required"
      >
        <Radio
          value="vue"
          :id="args.itemId"
          :as-child="args.itemAsChild"
          :as="args.itemAs"
          :name="args.itemName"
          :required="args.itemRequired"
          :indicator-force-mount="args.indicatorForceMount"
          :indicator-as-child="args.indicatorAsChild"
          :indicator-as="args.indicatorAs"
        >Vue</Radio>
        <Radio value="react">React</Radio>
        <Radio value="svelte">Svelte</Radio>
      </RadioGroup>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Radio, RadioGroup } from '@auronui/vue'

const selected = ref('')
</script>

<template>
  <RadioGroup v-model="selected" label="Choose a framework">
    <Radio value="vue">Vue</Radio>
    <Radio value="react">React</Radio>
    <Radio value="svelte">Svelte</Radio>
  </RadioGroup>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
}

export const Preselected: Story = {
  render: (args) => ({
    components: { Radio, RadioGroup },
    setup() {
      const selected = ref('vue')
      return { args, selected }
    },
    template: `
      <RadioGroup v-bind="args" v-model="selected" label="Choose a framework">
        <Radio value="vue">Vue</Radio>
        <Radio value="react">React</Radio>
        <Radio value="svelte">Svelte</Radio>
      </RadioGroup>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Radio, RadioGroup } from '@auronui/vue'

const selected = ref('vue')
</script>

<template>
  <RadioGroup v-model="selected" label="Choose a framework">
    <Radio value="vue">Vue</Radio>
    <Radio value="react">React</Radio>
    <Radio value="svelte">Svelte</Radio>
  </RadioGroup>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const WithLabel: Story = {
  render: (args) => ({
    components: { Radio, RadioGroup },
    setup() {
      const selected = ref('')
      return { args, selected }
    },
    template: `
      <RadioGroup v-bind="args" v-model="selected" label="Notification frequency">
        <Radio value="daily">Daily digest</Radio>
        <Radio value="weekly">Weekly summary</Radio>
        <Radio value="never">Never</Radio>
      </RadioGroup>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Radio, RadioGroup } from '@auronui/vue'

const selected = ref('')
</script>

<template>
  <RadioGroup v-model="selected" label="Notification frequency">
    <Radio value="daily">Daily digest</Radio>
    <Radio value="weekly">Weekly summary</Radio>
    <Radio value="never">Never</Radio>
  </RadioGroup>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const WithDescription: Story = {
  render: (args) => ({
    components: { Radio, RadioGroup },
    setup() {
      const selected = ref('standard')
      return { args, selected }
    },
    template: `
      <RadioGroup
        v-bind="args"
        v-model="selected"
        label="Shipping method"
        description="Select how you'd like your order shipped."
      >
        <Radio value="standard">Standard (5-7 days)</Radio>
        <Radio value="express">Express (2-3 days)</Radio>
        <Radio value="overnight">Overnight (next day)</Radio>
      </RadioGroup>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Radio, RadioGroup } from '@auronui/vue'

const selected = ref('standard')
</script>

<template>
  <RadioGroup
    v-model="selected"
    label="Shipping method"
    description="Select how you'd like your order shipped."
  >
    <Radio value="standard">Standard (5-7 days)</Radio>
    <Radio value="express">Express (2-3 days)</Radio>
    <Radio value="overnight">Overnight (next day)</Radio>
  </RadioGroup>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const Horizontal: Story = {
  render: (args) => ({
    components: { Radio, RadioGroup },
    setup() {
      const selected = ref('md')
      return { args, selected }
    },
    template: `
      <RadioGroup v-bind="args" v-model="selected" orientation="horizontal" label="Pick a size">
        <Radio value="sm">S</Radio>
        <Radio value="md">M</Radio>
        <Radio value="lg">L</Radio>
        <Radio value="xl">XL</Radio>
      </RadioGroup>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Radio, RadioGroup } from '@auronui/vue'

const selected = ref('md')
</script>

<template>
  <RadioGroup v-model="selected" orientation="horizontal" label="Pick a size">
    <Radio value="sm">S</Radio>
    <Radio value="md">M</Radio>
    <Radio value="lg">L</Radio>
    <Radio value="xl">XL</Radio>
  </RadioGroup>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const DisabledGroup: Story = {
  render: (args) => ({
    components: { Radio, RadioGroup },
    setup() {
      const selected = ref('a')
      return { args, selected }
    },
    template: `
      <RadioGroup v-bind="args" v-model="selected" :disabled="true" label="Disabled group">
        <Radio value="a">Option A</Radio>
        <Radio value="b">Option B</Radio>
        <Radio value="c">Option C</Radio>
      </RadioGroup>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Radio, RadioGroup } from '@auronui/vue'

const selected = ref('a')
</script>

<template>
  <RadioGroup v-model="selected" :disabled="true" label="Disabled group">
    <Radio value="a">Option A</Radio>
    <Radio value="b">Option B</Radio>
    <Radio value="c">Option C</Radio>
  </RadioGroup>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const OneDisabledItem: Story = {
  render: (args) => ({
    components: { Radio, RadioGroup },
    setup() {
      const selected = ref('')
      return { args, selected }
    },
    template: `
      <RadioGroup v-bind="args" v-model="selected" label="Choose a plan">
        <Radio value="free">Free</Radio>
        <Radio value="pro" :disabled="true">Pro (unavailable)</Radio>
        <Radio value="enterprise">Enterprise</Radio>
      </RadioGroup>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Radio, RadioGroup } from '@auronui/vue'

const selected = ref('')
</script>

<template>
  <RadioGroup v-model="selected" label="Choose a plan">
    <Radio value="free">Free</Radio>
    <Radio value="pro" :disabled="true">Pro (unavailable)</Radio>
    <Radio value="enterprise">Enterprise</Radio>
  </RadioGroup>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const VariantPrimary: Story = {
  render: (args) => ({
    components: { Radio, RadioGroup },
    setup() {
      const selected = ref('a')
      return { args, selected }
    },
    template: `
      <RadioGroup v-bind="args" v-model="selected" variant="primary" label="Primary variant">
        <Radio value="a">Option A</Radio>
        <Radio value="b">Option B</Radio>
      </RadioGroup>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Radio, RadioGroup } from '@auronui/vue'

const selected = ref('a')
</script>

<template>
  <RadioGroup v-model="selected" variant="primary" label="Primary variant">
    <Radio value="a">Option A</Radio>
    <Radio value="b">Option B</Radio>
  </RadioGroup>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const VariantSecondary: Story = {
  render: (args) => ({
    components: { Radio, RadioGroup },
    setup() {
      const selected = ref('a')
      return { args, selected }
    },
    template: `
      <RadioGroup v-bind="args" v-model="selected" variant="secondary" label="Secondary variant">
        <Radio value="a">Option A</Radio>
        <Radio value="b">Option B</Radio>
      </RadioGroup>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Radio, RadioGroup } from '@auronui/vue'

const selected = ref('a')
</script>

<template>
  <RadioGroup v-model="selected" variant="secondary" label="Secondary variant">
    <Radio value="a">Option A</Radio>
    <Radio value="b">Option B</Radio>
  </RadioGroup>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const CustomStyles: Story = {
  name: 'Custom styles via classNames',
  render: (args) => ({
    components: { Radio, RadioGroup },
    setup() {
      const selected = ref('vue')
      return { args, selected }
    },
    template: `
      <RadioGroup
        v-bind="args"
        v-model="selected"
        label="Choose a framework"
        :class-names="{
          control: 'border-2 border-blue-500 rounded-lg',
          indicator: 'bg-blue-600',
          content: 'text-blue-700 font-semibold',
        }"
      >
        <Radio value="vue">Vue</Radio>
        <Radio value="react">React</Radio>
        <Radio value="svelte">Svelte</Radio>
      </RadioGroup>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Radio, RadioGroup } from '@auronui/vue'

const selected = ref('vue')
</script>

<template>
  <RadioGroup
    v-model="selected"
    label="Choose a framework"
    :class-names="{
      control: 'border-2 border-blue-500 rounded-lg',
      indicator: 'bg-blue-600',
      content: 'text-blue-700 font-semibold',
    }"
  >
    <Radio value="vue">Vue</Radio>
    <Radio value="react">React</Radio>
    <Radio value="svelte">Svelte</Radio>
  </RadioGroup>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const ArrayAPI: Story = {
  name: 'Array API (items prop)',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { RadioGroup } from '@auronui/vue'

const selected = ref('react')
</script>

<template>
  <RadioGroup
    v-model="selected"
    label="Favourite framework"
    :items="[
      { value: 'vue', label: 'Vue' },
      { value: 'react', label: 'React' },
      { value: 'svelte', label: 'Svelte' },
      { value: 'solid', label: 'Solid', disabled: true },
    ]"
  />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { RadioGroup },
    setup() {
      const selected = ref('react')
      return { args, selected }
    },
    template: `
      <RadioGroup
        v-bind="args"
        v-model="selected"
        label="Favourite framework"
        :items="[
          { value: 'vue', label: 'Vue' },
          { value: 'react', label: 'React' },
          { value: 'svelte', label: 'Svelte' },
          { value: 'solid', label: 'Solid', disabled: true },
        ]"
      />
    `,
  }),
}
