import type { Meta, StoryObj } from "@storybook/vue3-vite";
import {
  ComboBox,
  ComboBoxInput,
  ComboBoxContent,
  ComboBoxItem,
  ComboBoxEmpty,
} from "@auronui/vue";

const meta: Meta<typeof ComboBox> = {
  component: ComboBox,
  title: "Components/ComboBox",
  tags: ["autodocs"],
  argTypes: {
    fullWidth: { control: "boolean" },
    isDisabled: { control: "boolean" },
    isInvalid: { control: "boolean" },
    isRequired: { control: "boolean" },
    classNames: { control: "object", description: "Per-slot class overrides. Keys match the component anatomy slot names." },
    // ComboboxRoot pass-through props
    resetSearchTermOnBlur: {
      control: "boolean",
      description: "Reset the search term when the input loses focus.",
      table: { category: "ComboboxRoot", defaultValue: { summary: "undefined" } },
    },
    resetSearchTermOnSelect: {
      control: "boolean",
      description: "Reset the search term after an item is selected.",
      table: { category: "ComboboxRoot", defaultValue: { summary: "undefined" } },
    },
    openOnFocus: {
      control: "boolean",
      description: "Open the dropdown when the input gains focus.",
      table: { category: "ComboboxRoot", defaultValue: { summary: "undefined" } },
    },
    openOnClick: {
      control: "boolean",
      description: "Open the dropdown when the input is clicked.",
      table: { category: "ComboboxRoot", defaultValue: { summary: "undefined" } },
    },
    ignoreFilter: {
      control: "boolean",
      description: "Disable Reka's built-in filter; handle filtering externally.",
      table: { category: "ComboboxRoot", defaultValue: { summary: "undefined" } },
    },
    resetModelValueOnClear: {
      control: "boolean",
      description: "Reset modelValue when the input is cleared.",
      table: { category: "ComboboxRoot", defaultValue: { summary: "undefined" } },
    },
    multiple: {
      control: "boolean",
      description: "Allow selecting multiple values.",
      table: { category: "ComboboxRoot", defaultValue: { summary: "false" } },
    },
    dir: {
      control: { type: "select" },
      options: ["ltr", "rtl"],
      description: "Reading direction for the component.",
      table: { category: "ComboboxRoot", defaultValue: { summary: "undefined" } },
    },
    highlightOnHover: {
      control: "boolean",
      description: "Highlight the matching item on hover.",
      table: { category: "ComboboxRoot", defaultValue: { summary: "undefined" } },
    },
    by: {
      control: "text",
      description: "Key used to compare items for equality.",
      table: { category: "ComboboxRoot", defaultValue: { summary: "undefined" } },
    },
    as: {
      control: "text",
      description: "Render as a different element or component.",
      table: { category: "ComboboxRoot", defaultValue: { summary: "undefined" } },
    },
    asChild: {
      control: "boolean",
      description: "Merge props onto child element instead of rendering a wrapper.",
      table: { category: "ComboboxRoot", defaultValue: { summary: "false" } },
    },
    name: {
      control: "text",
      description: "Form field name for native form submission.",
      table: { category: "ComboboxRoot", defaultValue: { summary: "undefined" } },
    },
    // ComboBoxContent pass-through props
    contentForceMount: {
      control: "boolean",
      description: "Force-mount the content even when closed.",
      table: { category: "ComboBoxContent", defaultValue: { summary: "undefined" } },
    },
    contentPosition: {
      control: { type: "select" },
      options: ["item-aligned", "popper"],
      description: "Positioning strategy for the content.",
      table: { category: "ComboBoxContent", defaultValue: { summary: "popper" } },
    },
    contentSide: {
      control: { type: "select" },
      options: ["top", "right", "bottom", "left"],
      description: "Side of the anchor to render on.",
      table: { category: "ComboBoxContent", defaultValue: { summary: "undefined" } },
    },
    contentAlign: {
      control: { type: "select" },
      options: ["start", "center", "end"],
      description: "Alignment relative to the anchor.",
      table: { category: "ComboBoxContent", defaultValue: { summary: "undefined" } },
    },
    contentSideOffset: {
      control: "number",
      description: "Side offset in pixels.",
      table: { category: "ComboBoxContent", defaultValue: { summary: "8" } },
    },
    contentAlignOffset: {
      control: "number",
      description: "Alignment offset in pixels.",
      table: { category: "ComboBoxContent", defaultValue: { summary: "undefined" } },
    },
    contentAvoidCollisions: {
      control: "boolean",
      description: "Avoid collisions with boundary.",
      table: { category: "ComboBoxContent", defaultValue: { summary: "undefined" } },
    },
    contentCollisionPadding: {
      control: false,
      description: "Padding from collision boundary.",
      table: { category: "ComboBoxContent", defaultValue: { summary: "undefined" } },
    },
    contentArrowPadding: {
      control: "number",
      description: "Padding from arrow.",
      table: { category: "ComboBoxContent", defaultValue: { summary: "undefined" } },
    },
    contentSticky: {
      control: { type: "select" },
      options: ["partial", "always"],
      description: "Sticky behavior on scroll.",
      table: { category: "ComboBoxContent", defaultValue: { summary: "undefined" } },
    },
    contentHideWhenDetached: {
      control: "boolean",
      description: "Hide when anchor is detached.",
      table: { category: "ComboBoxContent", defaultValue: { summary: "undefined" } },
    },
    contentPositionStrategy: {
      control: { type: "select" },
      options: ["fixed", "absolute"],
      description: "CSS position strategy.",
      table: { category: "ComboBoxContent", defaultValue: { summary: "undefined" } },
    },
    contentDisableOutsidePointerEvents: {
      control: "boolean",
      description: "Disable outside pointer events when open.",
      table: { category: "ComboBoxContent", defaultValue: { summary: "undefined" } },
    },
    contentBodyLock: {
      control: "boolean",
      description: "Lock body scroll when open.",
      table: { category: "ComboBoxContent", defaultValue: { summary: "undefined" } },
    },
  },
  args: {
    fullWidth: false,
    isDisabled: false,
    isInvalid: false,
    isRequired: false,
    multiple: false,
    asChild: false,
  },
};

export default meta;
type Story = StoryObj<typeof ComboBox>;

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
  { value: "honeydew", label: "Honeydew" },
  { value: "kiwi", label: "Kiwi" },
  { value: "lemon", label: "Lemon" },
];

const animals = [
  { value: "cat", label: "Cat" },
  { value: "dog", label: "Dog" },
  { value: "elephant", label: "Elephant" },
  { value: "fox", label: "Fox" },
  { value: "giraffe", label: "Giraffe" },
];

const disabledFruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana", isDisabled: true },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date", isDisabled: true },
  { value: "elderberry", label: "Elderberry" },
];

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ComboBox } from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
]
</script>

<template>
  <ComboBox :items="items" placeholder="Select a fruit..." />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ComboBox },
    setup: () => ({ args, items: fruits }),
    template: `
      <div style="max-width:360px">
        <ComboBox v-bind="args" :items="items" :placeholder="args.placeholder" aria-label="Playground combobox" />
      </div>
    `,
  }),
};

export const AdvancedComposition: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem } from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <ComboBox :items="items" label="Favorite Fruit" aria-label="Fruit picker">
    <ComboBoxInput placeholder="Select a fruit..." />
    <ComboBoxContent>
      <ComboBoxItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</ComboBoxItem>
    </ComboBoxContent>
  </ComboBox>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem },
    setup: () => ({ args, items: fruits }),
    template: `
      <ComboBox v-bind="args" :items="items" label="Favorite Fruit" aria-label="Fruit picker">
        <ComboBoxInput placeholder="Select a fruit..." />
        <ComboBoxContent>
          <ComboBoxItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</ComboBoxItem>
        </ComboBoxContent>
      </ComboBox>
    `,
  }),
};

export const WithDescription: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty } from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <ComboBox
    :items="items"
    label="Favorite Fruit"
    description="Choose your favorite fruit from the list."
    aria-label="Favorite fruit picker"
  >
    <ComboBoxInput placeholder="Search a fruit..." />
    <ComboBoxContent>
      <ComboBoxItem
        v-for="item in items"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </ComboBoxItem>
      <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
    </ComboBoxContent>
  </ComboBox>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty },
    setup: () => ({ args, items: fruits }),
    template: `
      <ComboBox
        v-bind="args"
        :items="items"
        label="Favorite Fruit"
        description="Choose your favorite fruit from the list."
        aria-label="Favorite fruit picker"
      >
        <ComboBoxInput placeholder="Search a fruit..." />
        <ComboBoxContent>
          <ComboBoxItem
            v-for="item in items"
            :key="item.value"
            :value="item.value"

          >
            {{ item.label }}
          </ComboBoxItem>
          <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
        </ComboBoxContent>
      </ComboBox>
    `,
  }),
};

export const WithErrorMessage: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty } from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <ComboBox
    :items="items"
    label="Favorite Fruit"
    error-message="Please select a valid fruit."
    :is-invalid="true"
    aria-label="Favorite fruit picker"
  >
    <ComboBoxInput placeholder="Search a fruit..." />
    <ComboBoxContent>
      <ComboBoxItem
        v-for="item in items"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </ComboBoxItem>
      <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
    </ComboBoxContent>
  </ComboBox>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty },
    setup: () => ({ args, items: fruits }),
    template: `
      <ComboBox
        v-bind="args"
        :items="items"
        label="Favorite Fruit"
        error-message="Please select a valid fruit."
        :is-invalid="true"
        aria-label="Favorite fruit picker"
      >
        <ComboBoxInput placeholder="Search a fruit..." />
        <ComboBoxContent>
          <ComboBoxItem
            v-for="item in items"
            :key="item.value"
            :value="item.value"

          >
            {{ item.label }}
          </ComboBoxItem>
          <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
        </ComboBoxContent>
      </ComboBox>
    `,
  }),
};

export const WithDisabledItems: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty } from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana', isDisabled: true },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date', isDisabled: true },
  { value: 'elderberry', label: 'Elderberry' },
]
</script>

<template>
  <ComboBox :items="items" label="Favorite Fruit" aria-label="Favorite fruit picker">
    <ComboBoxInput placeholder="Search a fruit..." />
    <ComboBoxContent>
      <ComboBoxItem
        v-for="item in items"
        :key="item.value"
        :value="item.value"
        :is-disabled="item.isDisabled"
      >
        {{ item.label }}
      </ComboBoxItem>
      <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
    </ComboBoxContent>
  </ComboBox>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty },
    setup: () => ({ args, items: disabledFruits }),
    template: `
      <ComboBox v-bind="args" :items="items" label="Favorite Fruit" aria-label="Favorite fruit picker">
        <ComboBoxInput placeholder="Search a fruit..." />
        <ComboBoxContent>
          <ComboBoxItem
            v-for="item in items"
            :key="item.value"
            :value="item.value"

            :is-disabled="item.isDisabled"
          >
            {{ item.label }}
          </ComboBoxItem>
          <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
        </ComboBoxContent>
      </ComboBox>
    `,
  }),
};

export const Disabled: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty } from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <ComboBox :items="items" label="Favorite Fruit" :is-disabled="true" aria-label="Favorite fruit picker">
    <ComboBoxInput placeholder="Search a fruit..." />
    <ComboBoxContent>
      <ComboBoxItem
        v-for="item in items"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </ComboBoxItem>
      <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
    </ComboBoxContent>
  </ComboBox>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty },
    setup: () => ({ args, items: fruits }),
    template: `
      <ComboBox v-bind="args" :items="items" label="Favorite Fruit" :is-disabled="true" aria-label="Favorite fruit picker">
        <ComboBoxInput placeholder="Search a fruit..." />
        <ComboBoxContent>
          <ComboBoxItem
            v-for="item in items"
            :key="item.value"
            :value="item.value"

          >
            {{ item.label }}
          </ComboBoxItem>
          <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
        </ComboBoxContent>
      </ComboBox>
    `,
  }),
  args: { isDisabled: true },
};

export const Required: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty } from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <ComboBox :items="items" label="Favorite Fruit" :is-required="true" aria-label="Favorite fruit picker">
    <ComboBoxInput placeholder="Search a fruit..." />
    <ComboBoxContent>
      <ComboBoxItem
        v-for="item in items"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </ComboBoxItem>
      <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
    </ComboBoxContent>
  </ComboBox>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty },
    setup: () => ({ args, items: fruits }),
    template: `
      <ComboBox v-bind="args" :items="items" label="Favorite Fruit" :is-required="true" aria-label="Favorite fruit picker">
        <ComboBoxInput placeholder="Search a fruit..." />
        <ComboBoxContent>
          <ComboBoxItem
            v-for="item in items"
            :key="item.value"
            :value="item.value"

          >
            {{ item.label }}
          </ComboBoxItem>
          <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
        </ComboBoxContent>
      </ComboBox>
    `,
  }),
  args: { isRequired: true },
};

export const AllowsCustomValue: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty } from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <ComboBox :items="items" label="Favorite Fruit" :allows-custom-value="true" aria-label="Favorite fruit picker">
    <ComboBoxInput placeholder="Type anything..." />
    <ComboBoxContent>
      <ComboBoxItem
        v-for="item in items"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </ComboBoxItem>
      <ComboBoxEmpty>No match — your input will be used as-is</ComboBoxEmpty>
    </ComboBoxContent>
  </ComboBox>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty },
    setup: () => ({ args, items: fruits }),
    template: `
      <ComboBox v-bind="args" :items="items" label="Favorite Fruit" :allows-custom-value="true" aria-label="Favorite fruit picker">
        <ComboBoxInput placeholder="Type anything..." />
        <ComboBoxContent>
          <ComboBoxItem
            v-for="item in items"
            :key="item.value"
            :value="item.value"

          >
            {{ item.label }}
          </ComboBoxItem>
          <ComboBoxEmpty>No match — your input will be used as-is</ComboBoxEmpty>
        </ComboBoxContent>
      </ComboBox>
    `,
  }),
  args: { allowsCustomValue: true },
};

export const FullWidth: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty } from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <ComboBox :items="items" label="Favorite Fruit" :full-width="true" aria-label="Favorite fruit picker">
    <ComboBoxInput placeholder="Search a fruit..." />
    <ComboBoxContent>
      <ComboBoxItem
        v-for="item in items"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </ComboBoxItem>
      <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
    </ComboBoxContent>
  </ComboBox>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty },
    setup: () => ({ args, items: fruits }),
    template: `
      <ComboBox v-bind="args" :items="items" label="Favorite Fruit" :full-width="true" aria-label="Favorite fruit picker">
        <ComboBoxInput placeholder="Search a fruit..." />
        <ComboBoxContent>
          <ComboBoxItem
            v-for="item in items"
            :key="item.value"
            :value="item.value"

          >
            {{ item.label }}
          </ComboBoxItem>
          <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
        </ComboBoxContent>
      </ComboBox>
    `,
  }),
  args: { fullWidth: true },
};

export const MultipleCategories: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty } from '@auronui/vue'

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

const animals = [
  { value: 'cat', label: 'Cat' },
  { value: 'dog', label: 'Dog' },
  { value: 'elephant', label: 'Elephant' },
]
</script>

<template>
  <div style="display: flex; gap: 24px; flex-wrap: wrap;">
    <ComboBox :items="fruits" label="Fruits" aria-label="Fruit picker">
      <ComboBoxInput placeholder="Search fruits..." />
      <ComboBoxContent>
        <ComboBoxItem
          v-for="item in fruits"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </ComboBoxItem>
        <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
      </ComboBoxContent>
    </ComboBox>
    <ComboBox :items="animals" label="Animals" aria-label="Animal picker">
      <ComboBoxInput placeholder="Search animals..." />
      <ComboBoxContent>
        <ComboBoxItem
          v-for="item in animals"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </ComboBoxItem>
        <ComboBoxEmpty>No animals found</ComboBoxEmpty>
      </ComboBoxContent>
    </ComboBox>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty },
    setup: () => ({ args, fruits, animals }),
    template: `
      <div style="display: flex; gap: 24px; flex-wrap: wrap;">
        <ComboBox v-bind="args" :items="fruits" label="Fruits" aria-label="Fruit picker">
          <ComboBoxInput placeholder="Search fruits..." />
          <ComboBoxContent>
            <ComboBoxItem
              v-for="item in fruits"
              :key="item.value"
              :value="item.value"

            >
              {{ item.label }}
            </ComboBoxItem>
            <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
          </ComboBoxContent>
        </ComboBox>
        <ComboBox v-bind="args" :items="animals" label="Animals" aria-label="Animal picker">
          <ComboBoxInput placeholder="Search animals..." />
          <ComboBoxContent>
            <ComboBoxItem
              v-for="item in animals"
              :key="item.value"
              :value="item.value"

            >
              {{ item.label }}
            </ComboBoxItem>
            <ComboBoxEmpty>No animals found</ComboBoxEmpty>
          </ComboBoxContent>
        </ComboBox>
      </div>
    `,
  }),
};

export const Controlled: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty } from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

const selected = ref('')
</script>

<template>
  <div>
    <ComboBox
      :items="items"
      :model-value="selected"
      @update:model-value="selected = $event"
      label="Favorite Fruit"
      aria-label="Controlled fruit picker"
    >
      <ComboBoxInput placeholder="Search a fruit..." />
      <ComboBoxContent>
        <ComboBoxItem
          v-for="item in items"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </ComboBoxItem>
        <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
      </ComboBoxContent>
    </ComboBox>
    <p style="margin-top: 12px; font-size: 14px; color: #64748b;">
      Selected: <strong>{{ selected || '(none)' }}</strong>
    </p>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty },
    setup() {
      const { ref } = window.Vue ?? { ref: () => ({ value: "" }) }
      const selected = ref("")
      return { args, items: fruits, selected }
    },
    template: `
      <div>
        <ComboBox
          v-bind="args"
          :items="items"
          :model-value="selected"
          @update:model-value="selected = $event"
          label="Favorite Fruit"
          aria-label="Controlled fruit picker"
        >
          <ComboBoxInput placeholder="Search a fruit..." />
          <ComboBoxContent>
            <ComboBoxItem
              v-for="item in items"
              :key="item.value"
              :value="item.value"

            >
              {{ item.label }}
            </ComboBoxItem>
            <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
          </ComboBoxContent>
        </ComboBox>
        <p style="margin-top: 12px; font-size: 14px; color: #64748b;">
          Selected: <strong>{{ selected || '(none)' }}</strong>
        </p>
      </div>
    `,
  }),
};

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty } from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <ComboBox
    :items="items"
    label="Favorite Fruit"
    :class-names="{
      base: 'border-2 border-blue-500 rounded-lg bg-blue-50 p-4',
    }"
    aria-label="Fruit picker with custom styles"
  >
    <ComboBoxInput placeholder="Search a fruit..." />
    <ComboBoxContent>
      <ComboBoxItem
        v-for="item in items"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </ComboBoxItem>
      <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
    </ComboBoxContent>
  </ComboBox>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty },
    setup: () => ({ args, items: fruits }),
    template: `
      <ComboBox
        v-bind="args"
        :items="items"
        label="Favorite Fruit"
        :class-names="{
          base: 'border-2 border-blue-500 rounded-lg bg-blue-50 p-4',
        }"
        aria-label="Fruit picker with custom styles"
      >
        <ComboBoxInput placeholder="Search a fruit..." />
        <ComboBoxContent>
          <ComboBoxItem
            v-for="item in items"
            :key="item.value"
            :value="item.value"

          >
            {{ item.label }}
          </ComboBoxItem>
          <ComboBoxEmpty>No fruits found</ComboBoxEmpty>
        </ComboBoxContent>
      </ComboBox>
    `,
  }),
};
