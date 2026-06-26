import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ListBox, ListBoxItem, ListBoxSection } from '@auronui/vue'
import { defineComponent, ref } from 'vue'

const meta: Meta = {
  title: 'Components/ListBox',
  tags: ['autodocs'],
  component: ListBox,
  argTypes: {
    classNames: {
      control: 'object',
      description: 'Per-slot class overrides. Keys match the component anatomy slot names.',
    },
    // ListboxRoot pass-through props
    multiple: {
      control: 'boolean',
      description: 'Allow selecting multiple values (alias for selectionMode="multiple").',
      table: { category: 'ListboxRoot', defaultValue: { summary: 'false' } },
    },
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the listbox for keyboard navigation.',
      table: { category: 'ListboxRoot', defaultValue: { summary: 'undefined' } },
    },
    dir: {
      control: { type: 'select' },
      options: ['ltr', 'rtl'],
      description: 'Reading direction for the component.',
      table: { category: 'ListboxRoot', defaultValue: { summary: 'undefined' } },
    },
    selectionBehavior: {
      control: { type: 'select' },
      options: ['toggle', 'replace'],
      description: 'Selection behavior when multiple is true.',
      table: { category: 'ListboxRoot', defaultValue: { summary: 'undefined' } },
    },
    highlightOnHover: {
      control: 'boolean',
      description: 'Highlight item on hover.',
      table: { category: 'ListboxRoot', defaultValue: { summary: 'undefined' } },
    },
    by: {
      control: 'text',
      description: 'Key used to compare items for equality.',
      table: { category: 'ListboxRoot', defaultValue: { summary: 'undefined' } },
    },
    as: {
      control: 'text',
      description: 'Render as a different element or component.',
      table: { category: 'ListboxRoot', defaultValue: { summary: 'undefined' } },
    },
    asChild: {
      control: 'boolean',
      description: 'Merge props onto child element instead of rendering a wrapper.',
      table: { category: 'ListboxRoot', defaultValue: { summary: 'false' } },
    },
    name: {
      control: 'text',
      description: 'Form field name for native form submission.',
      table: { category: 'ListboxRoot', defaultValue: { summary: 'undefined' } },
    },
    required: {
      control: 'boolean',
      description: 'Mark the field as required.',
      table: { category: 'ListboxRoot', defaultValue: { summary: 'undefined' } },
    },
    // ListboxContent pass-through props
    contentAs: {
      control: 'text',
      description: 'Render the ListboxContent as a different element.',
      table: { category: 'ListboxContent', defaultValue: { summary: 'undefined' } },
    },
    contentAsChild: {
      control: 'boolean',
      description: 'Merge content props onto child element.',
      table: { category: 'ListboxContent', defaultValue: { summary: 'false' } },
    },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ListBox, ListBoxItem } from '@auronui/vue'
</script>

<template>
  <ListBox aria-label="Favorite fruit">
    <ListBoxItem value="apple">Apple</ListBoxItem>
    <ListBoxItem value="banana">Banana</ListBoxItem>
    <ListBoxItem value="cherry">Cherry</ListBoxItem>
    <ListBoxItem value="date">Date</ListBoxItem>
    <ListBoxItem value="elderberry">Elderberry</ListBoxItem>
  </ListBox>
</template>`,
        type: 'code',
        language: 'vue',
      }
    }
  },
  render: (args) => ({
    components: { ListBox, ListBoxItem },
    setup: () => ({ args }),
    template: `
      <ListBox v-bind="args" aria-label="Favorite fruit">
        <ListBoxItem value="apple">Apple</ListBoxItem>
        <ListBoxItem value="banana">Banana</ListBoxItem>
        <ListBoxItem value="cherry">Cherry</ListBoxItem>
        <ListBoxItem value="date">Date</ListBoxItem>
        <ListBoxItem value="elderberry">Elderberry</ListBoxItem>
      </ListBox>
    `,
  }),
}

export const SingleSelection: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { ListBox, ListBoxItem } from '@auronui/vue'

const selected = ref('')
</script>

<template>
  <div>
    <p style="margin-bottom:8px;font-size:14px">Selected: {{ selected || 'none' }}</p>
    <ListBox v-model="selected" aria-label="Select a fruit" selection-mode="single">
      <ListBoxItem value="apple">Apple</ListBoxItem>
      <ListBoxItem value="banana">Banana</ListBoxItem>
      <ListBoxItem value="cherry">Cherry</ListBoxItem>
      <ListBoxItem value="date">Date</ListBoxItem>
      <ListBoxItem value="elderberry">Elderberry</ListBoxItem>
    </ListBox>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ListBox, ListBoxItem },
    setup() {
      const selected = ref<string>('')
      return { args, selected }
    },
    template: `
      <div>
        <p style="margin-bottom:8px;font-size:14px">Selected: {{ selected || 'none' }}</p>
        <ListBox v-bind="args" v-model="selected" aria-label="Select a fruit" selection-mode="single">
          <ListBoxItem value="apple">Apple</ListBoxItem>
          <ListBoxItem value="banana">Banana</ListBoxItem>
          <ListBoxItem value="cherry">Cherry</ListBoxItem>
          <ListBoxItem value="date">Date</ListBoxItem>
          <ListBoxItem value="elderberry">Elderberry</ListBoxItem>
        </ListBox>
      </div>
    `,
  }),
}

export const MultipleSelection: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { ListBox, ListBoxItem } from '@auronui/vue'

const selected = ref(['apple', 'cherry'])
</script>

<template>
  <div>
    <p style="margin-bottom:8px;font-size:14px">Selected: {{ selected.join(', ') || 'none' }}</p>
    <ListBox v-model="selected" aria-label="Select fruits" selection-mode="multiple">
      <ListBoxItem value="apple">Apple</ListBoxItem>
      <ListBoxItem value="banana">Banana</ListBoxItem>
      <ListBoxItem value="cherry">Cherry</ListBoxItem>
      <ListBoxItem value="date">Date</ListBoxItem>
      <ListBoxItem value="elderberry">Elderberry</ListBoxItem>
    </ListBox>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ListBox, ListBoxItem },
    setup() {
      const selected = ref<string[]>(['apple', 'cherry'])
      return { args, selected }
    },
    template: `
      <div>
        <p style="margin-bottom:8px;font-size:14px">Selected: {{ selected.join(', ') || 'none' }}</p>
        <ListBox v-bind="args" v-model="selected" aria-label="Select fruits" selection-mode="multiple">
          <ListBoxItem value="apple">Apple</ListBoxItem>
          <ListBoxItem value="banana">Banana</ListBoxItem>
          <ListBoxItem value="cherry">Cherry</ListBoxItem>
          <ListBoxItem value="date">Date</ListBoxItem>
          <ListBoxItem value="elderberry">Elderberry</ListBoxItem>
        </ListBox>
      </div>
    `,
  }),
}

export const WithSections: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { ListBox, ListBoxItem, ListBoxSection } from '@auronui/vue'

const selected = ref('')
</script>

<template>
  <ListBox v-model="selected" aria-label="Select food" selection-mode="single">
    <ListBoxSection title="Fruits">
      <ListBoxItem value="apple">Apple</ListBoxItem>
      <ListBoxItem value="banana">Banana</ListBoxItem>
      <ListBoxItem value="cherry">Cherry</ListBoxItem>
    </ListBoxSection>
    <ListBoxSection title="Vegetables">
      <ListBoxItem value="carrot">Carrot</ListBoxItem>
      <ListBoxItem value="broccoli">Broccoli</ListBoxItem>
      <ListBoxItem value="spinach">Spinach</ListBoxItem>
    </ListBoxSection>
  </ListBox>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ListBox, ListBoxItem, ListBoxSection },
    setup() {
      const selected = ref<string>('')
      return { args, selected }
    },
    template: `
      <ListBox v-bind="args" v-model="selected" aria-label="Select food" selection-mode="single">
        <ListBoxSection title="Fruits">
          <ListBoxItem value="apple">Apple</ListBoxItem>
          <ListBoxItem value="banana">Banana</ListBoxItem>
          <ListBoxItem value="cherry">Cherry</ListBoxItem>
        </ListBoxSection>
        <ListBoxSection title="Vegetables">
          <ListBoxItem value="carrot">Carrot</ListBoxItem>
          <ListBoxItem value="broccoli">Broccoli</ListBoxItem>
          <ListBoxItem value="spinach">Spinach</ListBoxItem>
        </ListBoxSection>
      </ListBox>
    `,
  }),
}

export const WithDisabledItems: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { ListBox, ListBoxItem } from '@auronui/vue'

const selected = ref('')
</script>

<template>
  <ListBox v-model="selected" aria-label="Select a fruit" selection-mode="single">
    <ListBoxItem value="apple">Apple</ListBoxItem>
    <ListBoxItem value="banana" :is-disabled="true">Banana (unavailable)</ListBoxItem>
    <ListBoxItem value="cherry">Cherry</ListBoxItem>
    <ListBoxItem value="date" :is-disabled="true">Date (unavailable)</ListBoxItem>
    <ListBoxItem value="elderberry">Elderberry</ListBoxItem>
  </ListBox>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ListBox, ListBoxItem },
    setup() {
      const selected = ref<string>('')
      return { args, selected }
    },
    template: `
      <ListBox v-bind="args" v-model="selected" aria-label="Select a fruit" selection-mode="single">
        <ListBoxItem value="apple">Apple</ListBoxItem>
        <ListBoxItem value="banana" :is-disabled="true">Banana (unavailable)</ListBoxItem>
        <ListBoxItem value="cherry">Cherry</ListBoxItem>
        <ListBoxItem value="date" :is-disabled="true">Date (unavailable)</ListBoxItem>
        <ListBoxItem value="elderberry">Elderberry</ListBoxItem>
      </ListBox>
    `,
  }),
}

export const FullyDisabled: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ListBox, ListBoxItem } from '@auronui/vue'
</script>

<template>
  <ListBox aria-label="Disabled list" :is-disabled="true" selection-mode="single">
    <ListBoxItem value="apple">Apple</ListBoxItem>
    <ListBoxItem value="banana">Banana</ListBoxItem>
    <ListBoxItem value="cherry">Cherry</ListBoxItem>
  </ListBox>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ListBox, ListBoxItem },
    setup: () => ({ args }),
    template: `
      <ListBox v-bind="args" aria-label="Disabled list" :is-disabled="true" selection-mode="single">
        <ListBoxItem value="apple">Apple</ListBoxItem>
        <ListBoxItem value="banana">Banana</ListBoxItem>
        <ListBoxItem value="cherry">Cherry</ListBoxItem>
      </ListBox>
    `,
  }),
}

export const WithDividers: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { ListBox, ListBoxItem, ListBoxSection } from '@auronui/vue'

const selected = ref('')
</script>

<template>
  <ListBox v-model="selected" aria-label="Select food" selection-mode="single">
    <ListBoxSection title="Fruits" :show-divider="true">
      <ListBoxItem value="apple">Apple</ListBoxItem>
      <ListBoxItem value="banana">Banana</ListBoxItem>
    </ListBoxSection>
    <ListBoxSection title="Vegetables" :show-divider="true">
      <ListBoxItem value="carrot">Carrot</ListBoxItem>
      <ListBoxItem value="broccoli">Broccoli</ListBoxItem>
    </ListBoxSection>
    <ListBoxSection title="Grains">
      <ListBoxItem value="rice">Rice</ListBoxItem>
      <ListBoxItem value="wheat">Wheat</ListBoxItem>
    </ListBoxSection>
  </ListBox>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ListBox, ListBoxItem, ListBoxSection },
    setup() {
      const selected = ref<string>('')
      return { args, selected }
    },
    template: `
      <ListBox v-bind="args" v-model="selected" aria-label="Select food" selection-mode="single">
        <ListBoxSection title="Fruits" :show-divider="true">
          <ListBoxItem value="apple">Apple</ListBoxItem>
          <ListBoxItem value="banana">Banana</ListBoxItem>
        </ListBoxSection>
        <ListBoxSection title="Vegetables" :show-divider="true">
          <ListBoxItem value="carrot">Carrot</ListBoxItem>
          <ListBoxItem value="broccoli">Broccoli</ListBoxItem>
        </ListBoxSection>
        <ListBoxSection title="Grains">
          <ListBoxItem value="rice">Rice</ListBoxItem>
          <ListBoxItem value="wheat">Wheat</ListBoxItem>
        </ListBoxSection>
      </ListBox>
    `,
  }),
}

export const CustomStyles: Story = {
  name: 'Custom styles via classNames',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { ListBox, ListBoxItem } from '@auronui/vue'

const selected = ref('')
</script>

<template>
  <div>
    <p style="margin-bottom:8px;font-size:14px">Selected: {{ selected || 'none' }}</p>
    <ListBox
      v-model="selected"
      aria-label="Select a fruit"
      selection-mode="single"
      :class-names="{
        base: 'border-2 border-blue-500 rounded-lg bg-blue-50 shadow-md',
      }"
    >
      <ListBoxItem value="apple">Apple</ListBoxItem>
      <ListBoxItem value="banana">Banana</ListBoxItem>
      <ListBoxItem value="cherry">Cherry</ListBoxItem>
      <ListBoxItem value="date">Date</ListBoxItem>
      <ListBoxItem value="elderberry">Elderberry</ListBoxItem>
    </ListBox>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ListBox, ListBoxItem },
    setup() {
      const selected = ref<string>('')
      return { args, selected }
    },
    template: `
      <div>
        <p style="margin-bottom:8px;font-size:14px">Selected: {{ selected || 'none' }}</p>
        <ListBox
          v-bind="args"
          v-model="selected"
          aria-label="Select a fruit"
          selection-mode="single"
          :class-names="{
            base: 'border-2 border-blue-500 rounded-lg bg-blue-50 shadow-md',
          }"
        >
          <ListBoxItem value="apple">Apple</ListBoxItem>
          <ListBoxItem value="banana">Banana</ListBoxItem>
          <ListBoxItem value="cherry">Cherry</ListBoxItem>
          <ListBoxItem value="date">Date</ListBoxItem>
          <ListBoxItem value="elderberry">Elderberry</ListBoxItem>
        </ListBox>
      </div>
    `,
  }),
}

export const Controlled: Story = {
  name: 'Controlled (v-model)',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { ListBox, ListBoxItem } from '@auronui/vue'

const value = ref('apple')
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:8px;padding:16px;">
    <ListBox v-model="value" selection-mode="single" aria-label="Select a fruit">
      <ListBoxItem value="apple">Apple</ListBoxItem>
      <ListBoxItem value="banana">Banana</ListBoxItem>
      <ListBoxItem value="cherry">Cherry</ListBoxItem>
      <ListBoxItem value="date">Date</ListBoxItem>
      <ListBoxItem value="elderberry">Elderberry</ListBoxItem>
    </ListBox>
    <p style="font-size:13px;color:#666;">Value: {{ value }}</p>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) =>
    defineComponent({
      components: { ListBox, ListBoxItem },
      setup() {
        const value = ref('apple')
        return { args, value }
      },
      template: `
        <div style="display:flex;flex-direction:column;gap:8px;padding:16px;">
          <ListBox v-bind="args" v-model="value" selection-mode="single" aria-label="Select a fruit">
            <ListBoxItem value="apple">Apple</ListBoxItem>
            <ListBoxItem value="banana">Banana</ListBoxItem>
            <ListBoxItem value="cherry">Cherry</ListBoxItem>
            <ListBoxItem value="date">Date</ListBoxItem>
            <ListBoxItem value="elderberry">Elderberry</ListBoxItem>
          </ListBox>
          <p style="font-size:13px;color:#666;">Value: {{ value }}</p>
        </div>
      `,
    }),
}

export const ArrayAPI: Story = {
  name: 'Array API (items prop)',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { ListBox } from '@auronui/vue'

const selected = ref('react')
</script>

<template>
  <ListBox
    v-model="selected"
    aria-label="Select a framework"
    :items="[
      { value: 'vue', label: 'Vue' },
      { value: 'react', label: 'React' },
      { value: 'svelte', label: 'Svelte' },
      { value: 'solid', label: 'Solid' },
      { value: 'angular', label: 'Angular', disabled: true },
    ]"
  />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ListBox },
    setup() {
      const selected = ref('react')
      return { args, selected }
    },
    template: `
      <ListBox v-bind="args" v-model="selected" aria-label="Select a framework" :items="[
        { value: 'vue', label: 'Vue' },
        { value: 'react', label: 'React' },
        { value: 'svelte', label: 'Svelte' },
        { value: 'solid', label: 'Solid' },
        { value: 'angular', label: 'Angular', disabled: true },
      ]" />
    `,
  }),
}
