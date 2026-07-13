import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalTitle,
  Button,
} from "@auronui/vue";

const meta: Meta<typeof Select> = {
  component: Select,
  title: "Form/Select",
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
      options: ["default", "primary", "secondary", "accent", "success", "warning", "danger"],
    },
    labelPlacement: {
      control: "select",
      options: ["inside", "outside", "outside-left"],
    },
    label: { control: "text" },
    placeholder: { control: "text" },
    description: { control: "text" },
    errorMessage: { control: "text" },
    fullWidth: { control: "boolean" },
    isDisabled: { control: "boolean" },
    isReadOnly: { control: "boolean" },
    isInvalid: { control: "boolean" },
    isRequired: { control: "boolean" },
    classNames: { control: "object", description: "Per-slot class overrides. Keys match the component anatomy slot names." },
    // Select (root)
    dir: {
      control: { type: 'select' },
      options: ['ltr', 'rtl'],
      description: 'Text direction for the select.',
      table: { category: 'Select', defaultValue: { summary: 'undefined' } },
    },
    autocomplete: {
      control: 'text',
      description: 'Native autocomplete attribute for the hidden input.',
      table: { category: 'Select', defaultValue: { summary: 'undefined' } },
    },
    by: {
      control: false,
      description: 'Comparison key or function for value matching.',
      table: { category: 'Select', defaultValue: { summary: 'undefined' } },
    },
    // SelectContent
    contentForceMount: {
      control: 'boolean',
      description: 'Keep the content mounted even when the select is closed.',
      table: { category: 'SelectContent', defaultValue: { summary: 'false' } },
    },
    contentBodyLock: {
      control: 'boolean',
      description: 'Lock body scroll when the content is open.',
      table: { category: 'SelectContent', defaultValue: { summary: 'false' } },
    },
    contentSide: {
      control: { type: 'select' },
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Side of the trigger to render the content.',
      table: { category: 'SelectContent', defaultValue: { summary: 'undefined' } },
    },
    contentAlign: {
      control: { type: 'select' },
      options: ['start', 'center', 'end'],
      description: 'Alignment of the content relative to the trigger.',
      table: { category: 'SelectContent', defaultValue: { summary: 'undefined' } },
    },
    contentCollisionPadding: {
      control: false,
      description: 'Padding around the collision boundary.',
      table: { category: 'SelectContent', defaultValue: { summary: 'undefined' } },
    },
    contentAvoidCollisions: {
      control: 'boolean',
      description: 'Avoid collisions with viewport edges.',
      table: { category: 'SelectContent', defaultValue: { summary: 'false' } },
    },
    contentHideWhenDetached: {
      control: 'boolean',
      description: 'Hide content when fully detached from trigger.',
      table: { category: 'SelectContent', defaultValue: { summary: 'false' } },
    },
    contentPositionStrategy: {
      control: { type: 'select' },
      options: ['fixed', 'absolute'],
      description: 'CSS position strategy for the floating element.',
      table: { category: 'SelectContent', defaultValue: { summary: 'undefined' } },
    },
    contentDisableOutsidePointerEvents: {
      control: 'boolean',
      description: 'Disable pointer events outside the content while open.',
      table: { category: 'SelectContent', defaultValue: { summary: 'false' } },
    },
    contentTo: {
      control: 'text',
      description: 'Portal target element or selector.',
      table: { category: 'SelectContent', defaultValue: { summary: 'undefined' } },
    },
    // SelectTrigger
    triggerDisabled: {
      control: 'boolean',
      description: 'Whether the trigger is disabled.',
      table: { category: 'SelectTrigger', defaultValue: { summary: 'false' } },
    },
    triggerAs: {
      control: 'text',
      description: 'Render the trigger as a different element or component.',
      table: { category: 'SelectTrigger', defaultValue: { summary: 'undefined' } },
    },
    triggerAsChild: {
      control: 'boolean',
      description: 'Merge trigger props onto its child element.',
      table: { category: 'SelectTrigger', defaultValue: { summary: 'false' } },
    },
  },
  args: {
    variant: "flat",
    size: "md",
    color: "default",
    labelPlacement: "inside",
    fullWidth: false,
    isDisabled: false,
    isReadOnly: false,
    isInvalid: false,
    isRequired: false,
    contentForceMount: false,
    contentBodyLock: false,
    contentAvoidCollisions: false,
    contentHideWhenDetached: false,
    contentDisableOutsidePointerEvents: false,
    triggerDisabled: false,
    triggerAsChild: false,
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const allFruits = [
  { value: "apple", label: "Apple" },
  { value: "apricot", label: "Apricot" },
  { value: "avocado", label: "Avocado" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "cherry", label: "Cherry" },
  { value: "cranberry", label: "Cranberry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
  { value: "grapefruit", label: "Grapefruit" },
];

/* ─── Playground & Default ───────────────────────────────────────────── */

export const Playground: Story = {
  args: {
    variant: "bordered",
    label: "Favorite Fruit",
    placeholder: "Pick a fruit",
    description: "Pick from the list.",
    errorMessage: "Please select a valid option.",
  },
  render: (args) => ({
    components: { Select },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:360px">
        <Select v-bind="args" :items="items" :placeholder="args.placeholder" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Select } from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="max-width:360px">
    <Select
      variant="bordered"
      label="Favorite Fruit"
      placeholder="Pick a fruit"
      description="Pick from the list."
      errorMessage="Please select a valid option."
      :items="items"
    />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Default: Story = {
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:360px">
        <Select v-bind="args" label="Favorite Fruit" :dir="args.dir" :autocomplete="args.autocomplete" :by="args.by">
          <SelectTrigger
            :disabled="args.triggerDisabled"
            :as="args.triggerAs"
            :as-child="args.triggerAsChild"
          >
            <SelectValue placeholder="Pick a fruit" />
          </SelectTrigger>
          <SelectContent
            :force-mount="args.contentForceMount"
            :body-lock="args.contentBodyLock"
            :side="args.contentSide"
            :align="args.contentAlign"
            :avoid-collisions="args.contentAvoidCollisions"
            :collision-padding="args.contentCollisionPadding"
            :hide-when-detached="args.contentHideWhenDetached"
            :position-strategy="args.contentPositionStrategy"
            :disable-outside-pointer-events="args.contentDisableOutsidePointerEvents"
            :to="args.contentTo"
          >
            <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Select } from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <Select label="Favorite Fruit" placeholder="Pick a fruit" :items="items" />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
};

export const AdvancedComposition: Story = {
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <Select v-bind="args" label="Favorite Fruit">
        <SelectTrigger>
          <SelectValue placeholder="Pick a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
        </SelectContent>
      </Select>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <Select label="Favorite Fruit">
    <SelectTrigger>
      <SelectValue placeholder="Pick a fruit" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
    </SelectContent>
  </Select>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Controlled: Story = {
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup() {
      const fruit = ref("banana");
      return { args, fruit, items: allFruits };
    },
    template: `
      <div>
        <p style="margin-bottom:8px;font-size:14px">Selected: {{ fruit }}</p>
        <Select v-bind="args" v-model="fruit" label="Favorite Fruit">
          <SelectTrigger>
            <SelectValue placeholder="Pick a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

const fruit = ref('banana')
</script>

<template>
  <div>
    <p style="margin-bottom:8px;font-size:14px">Selected: {{ fruit }}</p>
    <Select v-model="fruit" label="Favorite Fruit">
      <SelectTrigger>
        <SelectValue placeholder="Pick a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

/* ─── Variants / Sizes / Colors ──────────────────────────────────────── */

export const Variants: Story = {
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => {
      const variants = ["flat", "bordered", "faded", "underlined", "raised"] as const;
      return { args, items: allFruits, variants };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px; max-width: 360px;">
        <Select
          v-for="v in variants"
          :key="v"
          v-bind="args"
          :variant="v"
          :label="v.charAt(0).toUpperCase() + v.slice(1)"
        >
          <SelectTrigger>
            <SelectValue :placeholder="v + ' variant...'" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 20px; max-width: 360px;">
    <Select variant="flat" label="Flat">
      <SelectTrigger><SelectValue placeholder="flat variant..." /></SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
    <Select variant="bordered" label="Bordered">
      <SelectTrigger><SelectValue placeholder="bordered variant..." /></SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
    <Select variant="faded" label="Faded">
      <SelectTrigger><SelectValue placeholder="faded variant..." /></SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
    <Select variant="underlined" label="Underlined">
      <SelectTrigger><SelectValue placeholder="underlined variant..." /></SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
    <Select variant="raised" label="Raised">
      <SelectTrigger><SelectValue placeholder="raised variant..." /></SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Sizes: Story = {
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:320px">
        <Select v-bind="args" size="sm" variant="bordered" aria-label="Small select">
          <SelectTrigger><SelectValue placeholder="Small (sm)" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
        <Select v-bind="args" size="md" variant="bordered" aria-label="Medium select">
          <SelectTrigger><SelectValue placeholder="Medium (md) — default" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
        <Select v-bind="args" size="lg" variant="bordered" aria-label="Large select">
          <SelectTrigger><SelectValue placeholder="Large (lg)" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px;max-width:320px">
    <Select size="sm" variant="bordered" aria-label="Small select">
      <SelectTrigger><SelectValue placeholder="Small (sm)" /></SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
    <Select size="md" variant="bordered" aria-label="Medium select">
      <SelectTrigger><SelectValue placeholder="Medium (md) — default" /></SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
    <Select size="lg" variant="bordered" aria-label="Large select">
      <SelectTrigger><SelectValue placeholder="Large (lg)" /></SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Colors: Story = {
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:320px">
        <Select v-bind="args" variant="bordered" color="default" aria-label="Default color"><SelectTrigger><SelectValue placeholder="default" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
        <Select v-bind="args" variant="bordered" color="primary" aria-label="Primary color"><SelectTrigger><SelectValue placeholder="primary" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
        <Select v-bind="args" variant="bordered" color="secondary" aria-label="Secondary color"><SelectTrigger><SelectValue placeholder="secondary" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
        <Select v-bind="args" variant="bordered" color="accent" aria-label="Accent color"><SelectTrigger><SelectValue placeholder="accent" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
        <Select v-bind="args" variant="bordered" color="success" aria-label="Success color"><SelectTrigger><SelectValue placeholder="success" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
        <Select v-bind="args" variant="bordered" color="warning" aria-label="Warning color"><SelectTrigger><SelectValue placeholder="warning" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
        <Select v-bind="args" variant="bordered" color="danger" aria-label="Danger color"><SelectTrigger><SelectValue placeholder="danger" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px;max-width:320px">
    <Select variant="bordered" color="default" aria-label="Default color">
      <SelectTrigger><SelectValue placeholder="default" /></SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
    <Select variant="bordered" color="primary" aria-label="Primary color">
      <SelectTrigger><SelectValue placeholder="primary" /></SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
    <Select variant="bordered" color="secondary" aria-label="Secondary color">
      <SelectTrigger><SelectValue placeholder="secondary" /></SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
    <Select variant="bordered" color="accent" aria-label="Accent color">
      <SelectTrigger><SelectValue placeholder="accent" /></SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
    <Select variant="bordered" color="success" aria-label="Success color">
      <SelectTrigger><SelectValue placeholder="success" /></SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
    <Select variant="bordered" color="warning" aria-label="Warning color">
      <SelectTrigger><SelectValue placeholder="warning" /></SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
    <Select variant="bordered" color="danger" aria-label="Danger color">
      <SelectTrigger><SelectValue placeholder="danger" /></SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const FocusByColor: Story = {
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => {
      const variants = ["flat", "faded", "bordered", "underlined", "raised"] as const;
      const colors = ["default", "primary", "secondary", "accent", "success", "warning", "danger"] as const;
      return { args, items: allFruits, variants, colors };
    },
    template: `
      <div style="display:grid;grid-template-columns:80px repeat(7,minmax(0,1fr));gap:8px;max-width:1040px;align-items:center">
        <div></div>
        <div v-for="c in colors" :key="c" style="font-size:11px;color:#666">{{ c }}</div>

        <template v-for="v in variants" :key="v">
          <div style="font-size:11px;color:#666">{{ v }}</div>
          <Select
            v-for="c in colors"
            :key="v + '-' + c"
            v-bind="args"
            :variant="v"
            :color="c"
            :aria-label="v + ' ' + c"
          >
            <SelectTrigger><SelectValue :placeholder="c" /></SelectTrigger>
            <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
          </Select>
        </template>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

const variants = ['flat', 'faded', 'bordered', 'underlined', 'raised'] as const
const colors = ['default', 'primary', 'secondary', 'accent', 'success', 'warning', 'danger'] as const
</script>

<template>
  <div style="display:grid;grid-template-columns:80px repeat(7,minmax(0,1fr));gap:8px;max-width:1040px;align-items:center">
    <div></div>
    <div v-for="c in colors" :key="c" style="font-size:11px;color:#666">{{ c }}</div>

    <template v-for="v in variants" :key="v">
      <div style="font-size:11px;color:#666">{{ v }}</div>
      <Select
        v-for="c in colors"
        :key="v + '-' + c"
        :variant="v"
        :color="c"
        :aria-label="v + ' ' + c"
      >
        <SelectTrigger><SelectValue :placeholder="c" /></SelectTrigger>
        <SelectContent>
          <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
        </SelectContent>
      </Select>
    </template>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

/* ─── labelPlacement ─────────────────────────────────────────────────── */

export const LabelPlacementInside: Story = {
  args: {
    variant: "bordered",
    label: "Favorite Fruit",
    labelPlacement: "inside",
  },
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:360px">
        <Select v-bind="args">
          <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="max-width:360px">
    <Select variant="bordered" label="Favorite Fruit" label-placement="inside">
      <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const LabelPlacementOutside: Story = {
  args: {
    variant: "bordered",
    label: "Favorite Fruit",
    labelPlacement: "outside",
  },
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:360px">
        <Select v-bind="args">
          <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="max-width:360px">
    <Select variant="bordered" label="Favorite Fruit" label-placement="outside">
      <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const LabelPlacementOutsideLeft: Story = {
  args: {
    variant: "bordered",
    label: "Favorite Fruit",
    labelPlacement: "outside-left",
  },
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:520px">
        <Select v-bind="args">
          <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="max-width:520px">
    <Select variant="bordered" label="Favorite Fruit" label-placement="outside-left">
      <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const LabelPlacementMatrix: Story = {
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="display:flex;flex-direction:column;gap:32px;max-width:520px">
        <div>
          <h4 style="margin:0 0 8px;font-size:12px;color:#666;text-transform:uppercase">Inside (default)</h4>
          <div style="display:flex;flex-direction:column;gap:12px">
            <Select v-bind="args" variant="flat" label="Full name"><SelectTrigger><SelectValue placeholder="Jane Doe" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
            <Select v-bind="args" variant="bordered" label="Email"><SelectTrigger><SelectValue placeholder="jane@example.com" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
            <Select v-bind="args" variant="underlined" label="Phone"><SelectTrigger><SelectValue placeholder="+1 555 000 0000" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
          </div>
        </div>

        <div>
          <h4 style="margin:0 0 8px;font-size:12px;color:#666;text-transform:uppercase">Outside</h4>
          <div style="display:flex;flex-direction:column;gap:12px">
            <Select v-bind="args" variant="flat" label-placement="outside" label="Full name"><SelectTrigger><SelectValue placeholder="Jane Doe" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
            <Select v-bind="args" variant="bordered" label-placement="outside" label="Email"><SelectTrigger><SelectValue placeholder="jane@example.com" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
            <Select v-bind="args" variant="underlined" label-placement="outside" label="Phone"><SelectTrigger><SelectValue placeholder="+1 555 000 0000" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
          </div>
        </div>

        <div>
          <h4 style="margin:0 0 8px;font-size:12px;color:#666;text-transform:uppercase">Outside-left</h4>
          <div style="display:flex;flex-direction:column;gap:12px">
            <Select v-bind="args" variant="flat" label-placement="outside-left" label="Full name"><SelectTrigger><SelectValue placeholder="Jane Doe" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
            <Select v-bind="args" variant="bordered" label-placement="outside-left" label="Email"><SelectTrigger><SelectValue placeholder="jane@example.com" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
            <Select v-bind="args" variant="underlined" label-placement="outside-left" label="Phone"><SelectTrigger><SelectValue placeholder="+1 555 000 0000" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:32px;max-width:520px">
    <div>
      <h4 style="margin:0 0 8px;font-size:12px;color:#666;text-transform:uppercase">Inside (default)</h4>
      <div style="display:flex;flex-direction:column;gap:12px">
        <Select variant="flat" label="Full name">
          <SelectTrigger><SelectValue placeholder="Jane Doe" /></SelectTrigger>
          <SelectContent>
            <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
          </SelectContent>
        </Select>
        <Select variant="bordered" label="Email">
          <SelectTrigger><SelectValue placeholder="jane@example.com" /></SelectTrigger>
          <SelectContent>
            <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
          </SelectContent>
        </Select>
        <Select variant="underlined" label="Phone">
          <SelectTrigger><SelectValue placeholder="+1 555 000 0000" /></SelectTrigger>
          <SelectContent>
            <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div>
      <h4 style="margin:0 0 8px;font-size:12px;color:#666;text-transform:uppercase">Outside</h4>
      <div style="display:flex;flex-direction:column;gap:12px">
        <Select variant="flat" label-placement="outside" label="Full name">
          <SelectTrigger><SelectValue placeholder="Jane Doe" /></SelectTrigger>
          <SelectContent>
            <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
          </SelectContent>
        </Select>
        <Select variant="bordered" label-placement="outside" label="Email">
          <SelectTrigger><SelectValue placeholder="jane@example.com" /></SelectTrigger>
          <SelectContent>
            <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
          </SelectContent>
        </Select>
        <Select variant="underlined" label-placement="outside" label="Phone">
          <SelectTrigger><SelectValue placeholder="+1 555 000 0000" /></SelectTrigger>
          <SelectContent>
            <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div>
      <h4 style="margin:0 0 8px;font-size:12px;color:#666;text-transform:uppercase">Outside-left</h4>
      <div style="display:flex;flex-direction:column;gap:12px">
        <Select variant="flat" label-placement="outside-left" label="Full name">
          <SelectTrigger><SelectValue placeholder="Jane Doe" /></SelectTrigger>
          <SelectContent>
            <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
          </SelectContent>
        </Select>
        <Select variant="bordered" label-placement="outside-left" label="Email">
          <SelectTrigger><SelectValue placeholder="jane@example.com" /></SelectTrigger>
          <SelectContent>
            <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
          </SelectContent>
        </Select>
        <Select variant="underlined" label-placement="outside-left" label="Phone">
          <SelectTrigger><SelectValue placeholder="+1 555 000 0000" /></SelectTrigger>
          <SelectContent>
            <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

/* ─── description / errorMessage / isRequired ────────────────────────── */

export const WithDescription: Story = {
  args: {
    variant: "bordered",
    label: "Favorite Fruit",
    labelPlacement: "outside",
    description: "Pick from the list. Sorted alphabetically.",
  },
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:400px">
        <Select v-bind="args">
          <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="max-width:400px">
    <Select
      variant="bordered"
      label="Favorite Fruit"
      label-placement="outside"
      description="Pick from the list. Sorted alphabetically."
    >
      <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const WithErrorMessage: Story = {
  args: {
    variant: "bordered",
    label: "Favorite Fruit",
    labelPlacement: "outside",
    isInvalid: true,
    errorMessage: "Please select a valid option.",
  },
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:400px">
        <Select v-bind="args">
          <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="max-width:400px">
    <Select
      variant="bordered"
      label="Favorite Fruit"
      label-placement="outside"
      :is-invalid="true"
      error-message="Please select a valid option."
    >
      <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const ErrorSupersedesDescription: Story = {
  name: "Error supersedes description",
  args: {
    variant: "bordered",
    label: "Favorite Fruit",
    labelPlacement: "outside",
    description: "Sorted alphabetically.",
    errorMessage: "That fruit is not in the catalog.",
    isInvalid: true,
  },
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:400px">
        <Select v-bind="args">
          <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="max-width:400px">
    <Select
      variant="bordered"
      label="Favorite Fruit"
      label-placement="outside"
      description="Sorted alphabetically."
      error-message="That fruit is not in the catalog."
      :is-invalid="true"
    >
      <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Required: Story = {
  args: {
    variant: "bordered",
    label: "Favorite Fruit",
    labelPlacement: "outside",
    isRequired: true,
    description: "Required field — asterisk is rendered next to the label.",
  },
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:400px">
        <Select v-bind="args">
          <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="max-width:400px">
    <Select
      variant="bordered"
      label="Favorite Fruit"
      label-placement="outside"
      :is-required="true"
      description="Required field — asterisk is rendered next to the label."
    >
      <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const RequiredAcrossPlacements: Story = {
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:520px">
        <Select v-bind="args" variant="bordered" label="Inside" :is-required="true">
          <SelectTrigger><SelectValue placeholder="Required inside" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
        <Select v-bind="args" variant="bordered" label="Outside" label-placement="outside" :is-required="true">
          <SelectTrigger><SelectValue placeholder="Required outside" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
        <Select v-bind="args" variant="bordered" label="Outside-left" label-placement="outside-left" :is-required="true">
          <SelectTrigger><SelectValue placeholder="Required outside-left" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:16px;max-width:520px">
    <Select variant="bordered" label="Inside" :is-required="true">
      <SelectTrigger><SelectValue placeholder="Required inside" /></SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
    <Select variant="bordered" label="Outside" label-placement="outside" :is-required="true">
      <SelectTrigger><SelectValue placeholder="Required outside" /></SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
    <Select variant="bordered" label="Outside-left" label-placement="outside-left" :is-required="true">
      <SelectTrigger><SelectValue placeholder="Required outside-left" /></SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

/* ─── State primitives ─────────────────────────────────────────────── */

export const Invalid: Story = {
  args: {
    variant: "bordered",
    label: "Favorite Fruit",
    labelPlacement: "outside",
    isInvalid: true,
    errorMessage: "This field has an error.",
  },
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:360px">
        <Select v-bind="args">
          <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="max-width:360px">
    <Select
      variant="bordered"
      label="Favorite Fruit"
      label-placement="outside"
      :is-invalid="true"
      error-message="This field has an error."
    >
      <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    variant: "bordered",
    isDisabled: true,
  },
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <Select v-bind="args" aria-label="Disabled select">
        <SelectTrigger><SelectValue placeholder="Disabled select" /></SelectTrigger>
        <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
      </Select>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <Select variant="bordered" :is-disabled="true" aria-label="Disabled select">
    <SelectTrigger><SelectValue placeholder="Disabled select" /></SelectTrigger>
    <SelectContent>
      <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
    </SelectContent>
  </Select>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Readonly: Story = {
  args: {
    variant: "bordered",
    isReadOnly: true,
    label: "Favorite Fruit",
    labelPlacement: "outside",
    defaultValue: "banana",
  },
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <Select v-bind="args">
        <SelectTrigger><SelectValue placeholder="Readonly" /></SelectTrigger>
        <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
      </Select>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <Select
    variant="bordered"
    :is-readonly="true"
    label="Favorite Fruit"
    label-placement="outside"
    default-value="banana"
  >
    <SelectTrigger><SelectValue placeholder="Readonly" /></SelectTrigger>
    <SelectContent>
      <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
    </SelectContent>
  </Select>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const FullWidth: Story = {
  args: {
    variant: "bordered",
    fullWidth: true,
    label: "Framework",
    labelPlacement: "outside",
  },
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="width:100%">
        <Select v-bind="args">
          <SelectTrigger><SelectValue placeholder="Choose..." /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="width:100%">
    <Select variant="bordered" :full-width="true" label="Framework" label-placement="outside">
      <SelectTrigger><SelectValue placeholder="Choose..." /></SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const WithDisabledItems: Story = {
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args }),
    template: `
      <Select v-bind="args" label="Favorite Fruit" variant="bordered">
        <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana" :is-disabled="true">Banana (unavailable)</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
          <SelectItem value="date" :is-disabled="true">Date (unavailable)</SelectItem>
          <SelectItem value="elderberry">Elderberry</SelectItem>
        </SelectContent>
      </Select>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@auronui/vue'
</script>

<template>
  <Select label="Favorite Fruit" variant="bordered">
    <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
    <SelectContent>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana" :is-disabled="true">Banana (unavailable)</SelectItem>
      <SelectItem value="cherry">Cherry</SelectItem>
      <SelectItem value="date" :is-disabled="true">Date (unavailable)</SelectItem>
      <SelectItem value="elderberry">Elderberry</SelectItem>
    </SelectContent>
  </Select>
</template>`,
        language: 'vue',
      },
    },
  },
};

/* ─── Z-index regression ─────────────────────────────────────────────── */

export const InsideModal: Story = {
  name: "Inside Modal (z-index regression)",
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Modal, ModalTrigger, ModalContent, ModalHeader, ModalBody, ModalTitle, Button },
    setup: () => ({ args, items: allFruits }),
    template: `
      <Modal>
        <ModalTrigger as-child>
          <Button color="primary">Open modal</Button>
        </ModalTrigger>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Select inside a modal</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p style="margin-bottom:16px;font-size:14px;color:var(--color-default-500)">
              The dropdown must appear above the modal overlay — not behind it.
            </p>
            <Select v-bind="args" label="Favorite Fruit" variant="bordered" label-placement="outside">
              <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
              <SelectContent>
                <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
              </SelectContent>
            </Select>
          </ModalBody>
        </ModalContent>
      </Modal>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalTitle,
  Button,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <Modal>
    <ModalTrigger as-child>
      <Button color="primary">Open modal</Button>
    </ModalTrigger>
    <ModalContent>
      <ModalHeader>
        <ModalTitle>Select inside a modal</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <p style="margin-bottom:16px;font-size:14px;color:var(--color-default-500)">
          The dropdown must appear above the modal overlay — not behind it.
        </p>
        <Select label="Favorite Fruit" variant="bordered" label-placement="outside">
          <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
          <SelectContent>
            <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
          </SelectContent>
        </Select>
      </ModalBody>
    </ModalContent>
  </Modal>
</template>`,
        language: 'vue',
      },
    },
  },
};

/* ─── Multiple selection ──────────────────────────────────────────────────── */

export const Multiple: Story = {
  name: "Multiple selection",
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup() {
      const selected = ref<string[]>([]);
      return { args, selected, items: allFruits };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 360px;">
        <Select v-bind="args" v-model="selected" :multiple="true" label="Favourite fruits">
          <SelectTrigger>
            <SelectValue placeholder="Pick one or more fruits" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="item in items" :key="item.value" :value="item.value">
              {{ item.label }}
            </SelectItem>
          </SelectContent>
        </Select>
        <p style="font-size:12px;color:#64748b">Selected: {{ selected.join(', ') || '—' }}</p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

const selected = ref<string[]>([])
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; max-width: 360px;">
    <Select v-model="selected" :multiple="true" label="Favourite fruits">
      <SelectTrigger>
        <SelectValue placeholder="Pick one or more fruits" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">
          {{ item.label }}
        </SelectItem>
      </SelectContent>
    </Select>
    <p style="font-size:12px;color:#64748b">Selected: {{ selected.join(', ') || '—' }}</p>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const MultipleWithInitialValues: Story = {
  name: "Multiple — pre-selected values",
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup() {
      const selected = ref<string[]>(["apple", "cherry", "grape"]);
      return { args, selected, items: allFruits };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 360px;">
        <Select v-bind="args" v-model="selected" :multiple="true" label="Favourite fruits" variant="bordered">
          <SelectTrigger>
            <SelectValue placeholder="Pick one or more fruits" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="item in items" :key="item.value" :value="item.value">
              {{ item.label }}
            </SelectItem>
          </SelectContent>
        </Select>
        <p style="font-size:12px;color:#64748b">Selected: {{ selected.join(', ') || '—' }}</p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
]

const selected = ref<string[]>(['apple', 'cherry', 'grape'])
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; max-width: 360px;">
    <Select v-model="selected" :multiple="true" label="Favourite fruits" variant="bordered">
      <SelectTrigger>
        <SelectValue placeholder="Pick one or more fruits" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem v-for="item in items" :key="item.value" :value="item.value">
          {{ item.label }}
        </SelectItem>
      </SelectContent>
    </Select>
    <p style="font-size:12px;color:#64748b">Selected: {{ selected.join(', ') || '—' }}</p>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

/* ─── Custom Styles ──────────────────────────────────────────────────── */

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:360px">
        <Select
          v-bind="args"
          variant="bordered"
          label="Favorite Fruit"
          placeholder="Pick a fruit"
          :items="items"
          :class-names="{
            base: 'border-2 border-blue-500 rounded-lg',
            label: 'text-blue-600 font-semibold',
            mainWrapper: 'bg-blue-50',
            description: 'text-blue-500 italic',
          }"
          description="Custom styled with blue theme"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Select } from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="max-width:360px">
    <Select
      variant="bordered"
      label="Favorite Fruit"
      placeholder="Pick a fruit"
      :items="items"
      :class-names="{
        base: 'border-2 border-blue-500 rounded-lg',
        label: 'text-blue-600 font-semibold',
        mainWrapper: 'bg-blue-50',
        description: 'text-blue-500 italic',
      }"
      description="Custom styled with blue theme"
    />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};
