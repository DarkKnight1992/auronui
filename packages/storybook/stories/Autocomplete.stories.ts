import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { defineComponent, ref } from "vue";
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
  AutocompleteCreateItem,
} from "@auronui/vue";

const meta: Meta<typeof Autocomplete> = {
  component: Autocomplete,
  title: "Form/Autocomplete",
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
      options: ["default", "primary", "secondary", "success", "warning", "danger"],
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
    debounceMs: { control: "number" },
    classNames: { control: "object", description: "Per-slot class overrides. Keys match the component anatomy slot names." },
    // AutocompleteRoot pass-through props
    dir: {
      control: { type: "select" },
      options: ["ltr", "rtl"],
      description: "Reading direction for the component.",
      table: { category: "AutocompleteRoot", defaultValue: { summary: "undefined" } },
    },
    resetSearchTermOnBlur: {
      control: "boolean",
      description: "Reset the search term when the trigger loses focus.",
      table: { category: "AutocompleteRoot", defaultValue: { summary: "undefined" } },
    },
    openOnFocus: {
      control: "boolean",
      description: "Open the dropdown when the input gains focus.",
      table: { category: "AutocompleteRoot", defaultValue: { summary: "true" } },
    },
    openOnClick: {
      control: "boolean",
      description: "Open the dropdown when the input is clicked.",
      table: { category: "AutocompleteRoot", defaultValue: { summary: "undefined" } },
    },
    ignoreFilter: {
      control: "boolean",
      description: "Disable Reka's built-in filter; handle filtering externally.",
      table: { category: "AutocompleteRoot", defaultValue: { summary: "undefined" } },
    },
    highlightOnHover: {
      control: "boolean",
      description: "Highlight the matching item on hover.",
      table: { category: "AutocompleteRoot", defaultValue: { summary: "undefined" } },
    },
    as: {
      control: "text",
      description: "Render as a different element or component.",
      table: { category: "AutocompleteRoot", defaultValue: { summary: "undefined" } },
    },
    asChild: {
      control: "boolean",
      description: "Merge props onto child element instead of rendering a wrapper.",
      table: { category: "AutocompleteRoot", defaultValue: { summary: "false" } },
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
    debounceMs: 200,
  },
};

export default meta;
type Story = StoryObj<typeof Autocomplete>;

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

// Simulates an async API call with 500ms latency
function mockApiSearch(query: string) {
  return new Promise<{ value: string; label: string }[]>((resolve) => {
    setTimeout(() => {
      const results = allFruits.filter((f) =>
        f.label.toLowerCase().includes(query.toLowerCase())
      );
      resolve(results);
    }, 500);
  });
}

// Simulates an API that returns empty results
function mockEmptySearch() {
  return Promise.resolve([]);
}

/* ─── Playground & Default ───────────────────────────────────────────── */

export const Playground: Story = {
  args: {
    variant: "bordered",
    label: "Favorite Fruit",
    placeholder: "Search fruits...",
    description: "Type to filter the list.",
    errorMessage: "Please select a valid option.",
  },
  render: (args) => ({
    components: { Autocomplete },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:360px">
        <Autocomplete v-bind="args" :items="items" :placeholder="args.placeholder" aria-label="Playground autocomplete" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Autocomplete } from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="max-width:360px">
    <Autocomplete
      variant="bordered"
      label="Favorite Fruit"
      placeholder="Search fruits..."
      description="Type to filter the list."
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
    components: { Autocomplete },
    setup: () => ({ args, items: allFruits }),
    template: `
      <Autocomplete v-bind="args" :items="items" label="Favorite Fruit" placeholder="Search fruits..." aria-label="Fruit autocomplete" />
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Autocomplete } from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
]
</script>

<template>
  <Autocomplete
    :items="items"
    label="Favorite Fruit"
    placeholder="Search fruits..."
  />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
};

export const AdvancedComposition: Story = {
  render: (args) => ({
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <Autocomplete v-bind="args" :items="items" label="Favorite Fruit" aria-label="Fruit autocomplete">
        <AutocompleteInput placeholder="Search fruits..." />
        <AutocompleteContent>
          <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
        </AutocompleteContent>
      </Autocomplete>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
]
</script>

<template>
  <Autocomplete :items="items" label="Favorite Fruit">
    <AutocompleteInput placeholder="Search fruits..." />
    <AutocompleteContent>
      <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
        {{ item.label }}
      </AutocompleteItem>
    </AutocompleteContent>
  </Autocomplete>
</template>`,
        language: 'vue',
      },
    },
  },
};

/* ─── Variants / Sizes / Colors ──────────────────────────────────────── */

export const Variants: Story = {
  render: (args) => ({
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => {
      const variants = ["flat", "bordered", "faded", "underlined", "raised"] as const;
      return { args, items: allFruits, variants };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px; max-width: 360px;">
        <Autocomplete
          v-for="v in variants"
          :key="v"
          v-bind="args"
          :variant="v"
          :items="items"
          :label="v.charAt(0).toUpperCase() + v.slice(1)"
          :aria-label="v + ' variant'"
        >
          <AutocompleteInput :placeholder="v + ' variant...'" />
          <AutocompleteContent>
            <AutocompleteItem
              v-for="item in items" :key="item.value"
              :value="item.value"
            >{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 20px; max-width: 360px;">
    <Autocomplete variant="flat" label="Flat" :items="items">
      <AutocompleteInput placeholder="flat variant..." />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
          {{ item.label }}
        </AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
    <Autocomplete variant="bordered" label="Bordered" :items="items">
      <AutocompleteInput placeholder="bordered variant..." />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
          {{ item.label }}
        </AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
    <Autocomplete variant="faded" label="Faded" :items="items">
      <AutocompleteInput placeholder="faded variant..." />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
          {{ item.label }}
        </AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
    <Autocomplete variant="underlined" label="Underlined" :items="items">
      <AutocompleteInput placeholder="underlined variant..." />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
          {{ item.label }}
        </AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
    <Autocomplete variant="raised" label="Raised" :items="items">
      <AutocompleteInput placeholder="raised variant..." />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
          {{ item.label }}
        </AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Sizes: Story = {
  render: (args) => ({
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:320px">
        <Autocomplete v-bind="args" size="sm" variant="bordered" :items="items" aria-label="Small autocomplete">
          <AutocompleteInput placeholder="Small (sm)" />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
        <Autocomplete v-bind="args" size="md" variant="bordered" :items="items" aria-label="Medium autocomplete">
          <AutocompleteInput placeholder="Medium (md) — default" />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
        <Autocomplete v-bind="args" size="lg" variant="bordered" :items="items" aria-label="Large autocomplete">
          <AutocompleteInput placeholder="Large (lg)" />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px;max-width:320px">
    <Autocomplete size="sm" variant="bordered" :items="items">
      <AutocompleteInput placeholder="Small (sm)" />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
          {{ item.label }}
        </AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
    <Autocomplete size="md" variant="bordered" :items="items">
      <AutocompleteInput placeholder="Medium (md) — default" />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
          {{ item.label }}
        </AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
    <Autocomplete size="lg" variant="bordered" :items="items">
      <AutocompleteInput placeholder="Large (lg)" />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
          {{ item.label }}
        </AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Colors: Story = {
  render: (args) => ({
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:320px">
        <Autocomplete v-bind="args" variant="bordered" color="default" :items="items" aria-label="Default color"><AutocompleteInput placeholder="default" /><AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent></Autocomplete>
        <Autocomplete v-bind="args" variant="bordered" color="primary" :items="items" aria-label="Primary color"><AutocompleteInput placeholder="primary" /><AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent></Autocomplete>
        <Autocomplete v-bind="args" variant="bordered" color="secondary" :items="items" aria-label="Secondary color"><AutocompleteInput placeholder="secondary" /><AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent></Autocomplete>
        <Autocomplete v-bind="args" variant="bordered" color="success" :items="items" aria-label="Success color"><AutocompleteInput placeholder="success" /><AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent></Autocomplete>
        <Autocomplete v-bind="args" variant="bordered" color="warning" :items="items" aria-label="Warning color"><AutocompleteInput placeholder="warning" /><AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent></Autocomplete>
        <Autocomplete v-bind="args" variant="bordered" color="danger" :items="items" aria-label="Danger color"><AutocompleteInput placeholder="danger" /><AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent></Autocomplete>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px;max-width:320px">
    <Autocomplete variant="bordered" color="default" :items="items">
      <AutocompleteInput placeholder="default" />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
    <Autocomplete variant="bordered" color="primary" :items="items">
      <AutocompleteInput placeholder="primary" />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
    <Autocomplete variant="bordered" color="secondary" :items="items">
      <AutocompleteInput placeholder="secondary" />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
    <Autocomplete variant="bordered" color="success" :items="items">
      <AutocompleteInput placeholder="success" />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
    <Autocomplete variant="bordered" color="warning" :items="items">
      <AutocompleteInput placeholder="warning" />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
    <Autocomplete variant="bordered" color="danger" :items="items">
      <AutocompleteInput placeholder="danger" />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const FocusByColor: Story = {
  render: (args) => ({
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => {
      const variants = ["flat", "faded", "bordered", "underlined", "raised"] as const;
      const colors = ["default", "primary", "secondary", "success", "warning", "danger"] as const;
      return { args, items: allFruits, variants, colors };
    },
    template: `
      <div style="display:grid;grid-template-columns:80px repeat(6,minmax(0,1fr));gap:8px;max-width:1040px;align-items:center">
        <div></div>
        <div v-for="c in colors" :key="c" style="font-size:11px;color:#666">{{ c }}</div>

        <template v-for="v in variants" :key="v">
          <div style="font-size:11px;color:#666">{{ v }}</div>
          <Autocomplete
            v-bind="args"
            v-for="c in colors"
            :key="v + '-' + c"
            :variant="v"
            :color="c"
            :items="items"
            :aria-label="v + ' ' + c"
          >
            <AutocompleteInput :placeholder="c" />
            <AutocompleteContent>
              <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem>
            </AutocompleteContent>
          </Autocomplete>
        </template>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

const variants = ['flat', 'faded', 'bordered', 'underlined', 'raised'] as const
const colors = ['default', 'primary', 'secondary', 'success', 'warning', 'danger'] as const
</script>

<template>
  <div style="display:grid;grid-template-columns:80px repeat(6,minmax(0,1fr));gap:8px;max-width:1040px;align-items:center">
    <div></div>
    <div v-for="c in colors" :key="c" style="font-size:11px;color:#666">{{ c }}</div>

    <template v-for="v in variants" :key="v">
      <div style="font-size:11px;color:#666">{{ v }}</div>
      <Autocomplete
        v-for="c in colors"
        :key="v + '-' + c"
        :variant="v"
        :color="c"
        :items="items"
        :aria-label="v + ' ' + c"
      >
        <AutocompleteInput :placeholder="c" />
        <AutocompleteContent>
          <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
            {{ item.label }}
          </AutocompleteItem>
        </AutocompleteContent>
      </Autocomplete>
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
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:360px">
        <Autocomplete v-bind="args" :items="items" aria-label="Inside label autocomplete">
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="max-width:360px">
    <Autocomplete variant="bordered" label="Favorite Fruit" label-placement="inside" :items="items">
      <AutocompleteInput placeholder="Search fruits..." />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
          {{ item.label }}
        </AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
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
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:360px">
        <Autocomplete v-bind="args" :items="items" aria-label="Outside label autocomplete">
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="max-width:360px">
    <Autocomplete variant="bordered" label="Favorite Fruit" label-placement="outside" :items="items">
      <AutocompleteInput placeholder="Search fruits..." />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
          {{ item.label }}
        </AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
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
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:520px">
        <Autocomplete v-bind="args" :items="items" aria-label="Outside-left label autocomplete">
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="max-width:520px">
    <Autocomplete variant="bordered" label="Favorite Fruit" label-placement="outside-left" :items="items">
      <AutocompleteInput placeholder="Search fruits..." />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
          {{ item.label }}
        </AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const LabelPlacementMatrix: Story = {
  render: (args) => ({
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="display:flex;flex-direction:column;gap:32px;max-width:520px">
        <div>
          <h4 style="margin:0 0 8px;font-size:12px;color:#666;text-transform:uppercase">Inside (default)</h4>
          <div style="display:flex;flex-direction:column;gap:12px">
            <Autocomplete v-bind="args" variant="flat" label="Full name" :items="items" aria-label="inside-flat">
              <AutocompleteInput placeholder="Jane Doe" />
              <AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent>
            </Autocomplete>
            <Autocomplete v-bind="args" variant="bordered" label="Email" :items="items" aria-label="inside-bordered">
              <AutocompleteInput placeholder="jane@example.com" />
              <AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent>
            </Autocomplete>
            <Autocomplete v-bind="args" variant="underlined" label="Phone" :items="items" aria-label="inside-underlined">
              <AutocompleteInput placeholder="+1 555 000 0000" />
              <AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent>
            </Autocomplete>
          </div>
        </div>

        <div>
          <h4 style="margin:0 0 8px;font-size:12px;color:#666;text-transform:uppercase">Outside</h4>
          <div style="display:flex;flex-direction:column;gap:12px">
            <Autocomplete v-bind="args" variant="flat" label-placement="outside" label="Full name" :items="items" aria-label="outside-flat">
              <AutocompleteInput placeholder="Jane Doe" />
              <AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent>
            </Autocomplete>
            <Autocomplete v-bind="args" variant="bordered" label-placement="outside" label="Email" :items="items" aria-label="outside-bordered">
              <AutocompleteInput placeholder="jane@example.com" />
              <AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent>
            </Autocomplete>
            <Autocomplete v-bind="args" variant="underlined" label-placement="outside" label="Phone" :items="items" aria-label="outside-underlined">
              <AutocompleteInput placeholder="+1 555 000 0000" />
              <AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent>
            </Autocomplete>
          </div>
        </div>

        <div>
          <h4 style="margin:0 0 8px;font-size:12px;color:#666;text-transform:uppercase">Outside-left</h4>
          <div style="display:flex;flex-direction:column;gap:12px">
            <Autocomplete v-bind="args" variant="flat" label-placement="outside-left" label="Full name" :items="items" aria-label="outsideleft-flat">
              <AutocompleteInput placeholder="Jane Doe" />
              <AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent>
            </Autocomplete>
            <Autocomplete v-bind="args" variant="bordered" label-placement="outside-left" label="Email" :items="items" aria-label="outsideleft-bordered">
              <AutocompleteInput placeholder="jane@example.com" />
              <AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent>
            </Autocomplete>
            <Autocomplete v-bind="args" variant="underlined" label-placement="outside-left" label="Phone" :items="items" aria-label="outsideleft-underlined">
              <AutocompleteInput placeholder="+1 555 000 0000" />
              <AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent>
            </Autocomplete>
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
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
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
        <Autocomplete variant="flat" label="Full name" :items="items">
          <AutocompleteInput placeholder="Jane Doe" />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
        <Autocomplete variant="bordered" label="Email" :items="items">
          <AutocompleteInput placeholder="jane@example.com" />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
        <Autocomplete variant="underlined" label="Phone" :items="items">
          <AutocompleteInput placeholder="+1 555 000 0000" />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      </div>
    </div>

    <div>
      <h4 style="margin:0 0 8px;font-size:12px;color:#666;text-transform:uppercase">Outside</h4>
      <div style="display:flex;flex-direction:column;gap:12px">
        <Autocomplete variant="flat" label-placement="outside" label="Full name" :items="items">
          <AutocompleteInput placeholder="Jane Doe" />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
        <Autocomplete variant="bordered" label-placement="outside" label="Email" :items="items">
          <AutocompleteInput placeholder="jane@example.com" />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
        <Autocomplete variant="underlined" label-placement="outside" label="Phone" :items="items">
          <AutocompleteInput placeholder="+1 555 000 0000" />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      </div>
    </div>

    <div>
      <h4 style="margin:0 0 8px;font-size:12px;color:#666;text-transform:uppercase">Outside-left</h4>
      <div style="display:flex;flex-direction:column;gap:12px">
        <Autocomplete variant="flat" label-placement="outside-left" label="Full name" :items="items">
          <AutocompleteInput placeholder="Jane Doe" />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
        <Autocomplete variant="bordered" label-placement="outside-left" label="Email" :items="items">
          <AutocompleteInput placeholder="jane@example.com" />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
        <Autocomplete variant="underlined" label-placement="outside-left" label="Phone" :items="items">
          <AutocompleteInput placeholder="+1 555 000 0000" />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
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
    description: "Type or pick from the list. Sorted alphabetically.",
  },
  render: (args) => ({
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:400px">
        <Autocomplete v-bind="args" :items="items" aria-label="Autocomplete with description">
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="max-width:400px">
    <Autocomplete
      variant="bordered"
      label="Favorite Fruit"
      label-placement="outside"
      description="Type or pick from the list. Sorted alphabetically."
      :items="items"
    >
      <AutocompleteInput placeholder="Search fruits..." />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
          {{ item.label }}
        </AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
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
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:400px">
        <Autocomplete v-bind="args" :items="items" aria-label="Autocomplete with error">
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="max-width:400px">
    <Autocomplete
      variant="bordered"
      label="Favorite Fruit"
      label-placement="outside"
      :is-invalid="true"
      error-message="Please select a valid option."
      :items="items"
    >
      <AutocompleteInput placeholder="Search fruits..." />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
          {{ item.label }}
        </AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
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
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:400px">
        <Autocomplete v-bind="args" :items="items" aria-label="Error supersedes description">
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="max-width:400px">
    <!-- When both description and errorMessage are set, the error takes precedence -->
    <Autocomplete
      variant="bordered"
      label="Favorite Fruit"
      label-placement="outside"
      description="Sorted alphabetically."
      error-message="That fruit is not in the catalog."
      :is-invalid="true"
      :items="items"
    >
      <AutocompleteInput placeholder="Search fruits..." />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
          {{ item.label }}
        </AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
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
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:400px">
        <Autocomplete v-bind="args" :items="items" aria-label="Required autocomplete">
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="max-width:400px">
    <Autocomplete
      variant="bordered"
      label="Favorite Fruit"
      label-placement="outside"
      :is-required="true"
      description="Required field — asterisk is rendered next to the label."
      :items="items"
    >
      <AutocompleteInput placeholder="Search fruits..." />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
          {{ item.label }}
        </AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const RequiredAcrossPlacements: Story = {
  render: (args) => ({
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:520px">
        <Autocomplete v-bind="args" variant="bordered" label="Inside" :is-required="true" :items="items" aria-label="required-inside">
          <AutocompleteInput placeholder="Required inside" />
          <AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent>
        </Autocomplete>
        <Autocomplete v-bind="args" variant="bordered" label="Outside" label-placement="outside" :is-required="true" :items="items" aria-label="required-outside">
          <AutocompleteInput placeholder="Required outside" />
          <AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent>
        </Autocomplete>
        <Autocomplete v-bind="args" variant="bordered" label="Outside-left" label-placement="outside-left" :is-required="true" :items="items" aria-label="required-outside-left">
          <AutocompleteInput placeholder="Required outside-left" />
          <AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent>
        </Autocomplete>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:16px;max-width:520px">
    <Autocomplete variant="bordered" label="Inside" :is-required="true" :items="items">
      <AutocompleteInput placeholder="Required inside" />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
    <Autocomplete variant="bordered" label="Outside" label-placement="outside" :is-required="true" :items="items">
      <AutocompleteInput placeholder="Required outside" />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
    <Autocomplete variant="bordered" label="Outside-left" label-placement="outside-left" :is-required="true" :items="items">
      <AutocompleteInput placeholder="Required outside-left" />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
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
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:360px">
        <Autocomplete v-bind="args" :items="items" aria-label="Invalid autocomplete">
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="max-width:360px">
    <Autocomplete
      variant="bordered"
      label="Favorite Fruit"
      label-placement="outside"
      :is-invalid="true"
      error-message="This field has an error."
      :items="items"
    >
      <AutocompleteInput placeholder="Search fruits..." />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
          {{ item.label }}
        </AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
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
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <Autocomplete v-bind="args" :items="items" aria-label="Disabled autocomplete">
        <AutocompleteInput placeholder="Disabled autocomplete" />
        <AutocompleteContent>
          <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem>
        </AutocompleteContent>
      </Autocomplete>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <Autocomplete variant="bordered" :is-disabled="true" :items="items">
    <AutocompleteInput placeholder="Disabled autocomplete" />
    <AutocompleteContent>
      <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
        {{ item.label }}
      </AutocompleteItem>
    </AutocompleteContent>
  </Autocomplete>
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
    modelValue: "apple",
  },
  render: (args) => ({
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <Autocomplete v-bind="args" :items="items" aria-label="Readonly autocomplete">
        <AutocompleteInput placeholder="Readonly value" />
        <AutocompleteContent>
          <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem>
        </AutocompleteContent>
      </Autocomplete>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <Autocomplete variant="bordered" :is-readonly="true" model-value="apple" :items="items">
    <AutocompleteInput placeholder="Readonly value" />
    <AutocompleteContent>
      <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
        {{ item.label }}
      </AutocompleteItem>
    </AutocompleteContent>
  </Autocomplete>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
  },
  render: (args) => ({
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <Autocomplete v-bind="args" :items="items" label="Full Width" aria-label="Full width autocomplete">
        <AutocompleteInput placeholder="Search fruits..." />
        <AutocompleteContent>
          <AutocompleteItem
            v-for="item in items"
            :key="item.value"
            :value="item.value"

          >
            {{ item.label }}
          </AutocompleteItem>
        </AutocompleteContent>
      </Autocomplete>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <Autocomplete :full-width="true" label="Full Width" :items="items">
    <AutocompleteInput placeholder="Search fruits..." />
    <AutocompleteContent>
      <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
        {{ item.label }}
      </AutocompleteItem>
    </AutocompleteContent>
  </Autocomplete>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const WithStartContent: Story = {
  render: (args) => ({
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <Autocomplete v-bind="args" :items="items" label="Search Fruit" aria-label="Fruit autocomplete with search icon">
        <AutocompleteInput placeholder="Search fruits...">
          <template #startContent>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </template>
        </AutocompleteInput>
        <AutocompleteContent>
          <AutocompleteItem
            v-for="item in items"
            :key="item.value"
            :value="item.value"

          >
            {{ item.label }}
          </AutocompleteItem>
        </AutocompleteContent>
      </Autocomplete>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <Autocomplete label="Search Fruit" :items="items">
    <AutocompleteInput placeholder="Search fruits...">
      <template #startContent>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </template>
    </AutocompleteInput>
    <AutocompleteContent>
      <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
        {{ item.label }}
      </AutocompleteItem>
    </AutocompleteContent>
  </Autocomplete>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const StartContentAcrossVariants: Story = {
  render: (args) => ({
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:360px">
        <Autocomplete v-bind="args" v-for="v in ['flat','bordered','faded','underlined','raised']" :key="v" :variant="v" :items="items" :label="v" aria-label="Variant autocomplete with start content">
          <AutocompleteInput placeholder="Search fruits...">
            <template #startContent>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </template>
          </AutocompleteInput>
          <AutocompleteContent>
            <AutocompleteItem
              v-for="item in items"
              :key="item.value"
              :value="item.value"

            >
              {{ item.label }}
            </AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:16px;max-width:360px">
    <Autocomplete
      v-for="v in ['flat', 'bordered', 'faded', 'underlined', 'raised']"
      :key="v"
      :variant="v"
      :label="v"
      :items="items"
    >
      <AutocompleteInput placeholder="Search fruits...">
        <template #startContent>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </template>
      </AutocompleteInput>
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
          {{ item.label }}
        </AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const StartContentAcrossSizes: Story = {
  render: (args) => ({
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:360px">
        <Autocomplete v-bind="args" v-for="s in ['sm','md','lg']" :key="s" :size="s" :items="items" :label="'size ' + s" aria-label="Size autocomplete with start content">
          <AutocompleteInput placeholder="Search fruits...">
            <template #startContent>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </template>
          </AutocompleteInput>
          <AutocompleteContent>
            <AutocompleteItem
              v-for="item in items"
              :key="item.value"
              :value="item.value"

            >
              {{ item.label }}
            </AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:16px;max-width:360px">
    <Autocomplete
      v-for="s in ['sm', 'md', 'lg']"
      :key="s"
      :size="s"
      :label="'size ' + s"
      :items="items"
    >
      <AutocompleteInput placeholder="Search fruits...">
        <template #startContent>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </template>
      </AutocompleteInput>
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
          {{ item.label }}
        </AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

/* ─── Matrix stories ─────────────────────────────────────────────── */

export const LabelStatesMatrix: Story = {
  render: (args) => ({
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="display:grid;grid-template-columns:80px repeat(5,minmax(0,1fr));gap:12px;max-width:900px;align-items:end">
        <div></div>
        <div style="font-size:11px;color:#666">empty</div>
        <div style="font-size:11px;color:#666">filled</div>
        <div style="font-size:11px;color:#666">invalid</div>
        <div style="font-size:11px;color:#666">disabled</div>
        <div style="font-size:11px;color:#666">readonly</div>

        <div style="font-size:11px;color:#666">inside</div>
        <Autocomplete v-bind="args" variant="bordered" label="Fruit" :items="items" aria-label="inside-empty"><AutocompleteInput /><AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent></Autocomplete>
        <Autocomplete v-bind="args" variant="bordered" label="Fruit" :model-value="'apple'" :items="items" aria-label="inside-filled"><AutocompleteInput /><AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent></Autocomplete>
        <Autocomplete v-bind="args" variant="bordered" label="Fruit" :is-invalid="true" :items="items" aria-label="inside-invalid"><AutocompleteInput /><AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent></Autocomplete>
        <Autocomplete v-bind="args" variant="bordered" label="Fruit" :is-disabled="true" :items="items" aria-label="inside-disabled"><AutocompleteInput /><AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent></Autocomplete>
        <Autocomplete v-bind="args" variant="bordered" label="Fruit" :is-readonly="true" :model-value="'apple'" :items="items" aria-label="inside-readonly"><AutocompleteInput /><AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent></Autocomplete>

        <div style="font-size:11px;color:#666">outside</div>
        <Autocomplete v-bind="args" variant="bordered" label-placement="outside" label="Fruit" :items="items" aria-label="outside-empty"><AutocompleteInput placeholder="Pick one" /><AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent></Autocomplete>
        <Autocomplete v-bind="args" variant="bordered" label-placement="outside" label="Fruit" :model-value="'apple'" :items="items" aria-label="outside-filled"><AutocompleteInput /><AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent></Autocomplete>
        <Autocomplete v-bind="args" variant="bordered" label-placement="outside" label="Fruit" :is-invalid="true" error-message="Invalid" :items="items" aria-label="outside-invalid"><AutocompleteInput /><AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent></Autocomplete>
        <Autocomplete v-bind="args" variant="bordered" label-placement="outside" label="Fruit" :is-disabled="true" :items="items" aria-label="outside-disabled"><AutocompleteInput /><AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent></Autocomplete>
        <Autocomplete v-bind="args" variant="bordered" label-placement="outside" label="Fruit" :is-readonly="true" :model-value="'apple'" :items="items" aria-label="outside-readonly"><AutocompleteInput /><AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent></Autocomplete>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="display:grid;grid-template-columns:80px repeat(5,minmax(0,1fr));gap:12px;max-width:900px;align-items:end">
    <div></div>
    <div style="font-size:11px;color:#666">empty</div>
    <div style="font-size:11px;color:#666">filled</div>
    <div style="font-size:11px;color:#666">invalid</div>
    <div style="font-size:11px;color:#666">disabled</div>
    <div style="font-size:11px;color:#666">readonly</div>

    <!-- inside label placement row -->
    <div style="font-size:11px;color:#666">inside</div>
    <Autocomplete variant="bordered" label="Fruit" :items="items">
      <AutocompleteInput /><AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem></AutocompleteContent>
    </Autocomplete>
    <Autocomplete variant="bordered" label="Fruit" model-value="apple" :items="items">
      <AutocompleteInput /><AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem></AutocompleteContent>
    </Autocomplete>
    <Autocomplete variant="bordered" label="Fruit" :is-invalid="true" :items="items">
      <AutocompleteInput /><AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem></AutocompleteContent>
    </Autocomplete>
    <Autocomplete variant="bordered" label="Fruit" :is-disabled="true" :items="items">
      <AutocompleteInput /><AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem></AutocompleteContent>
    </Autocomplete>
    <Autocomplete variant="bordered" label="Fruit" :is-readonly="true" model-value="apple" :items="items">
      <AutocompleteInput /><AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem></AutocompleteContent>
    </Autocomplete>

    <!-- outside label placement row -->
    <div style="font-size:11px;color:#666">outside</div>
    <Autocomplete variant="bordered" label-placement="outside" label="Fruit" :items="items">
      <AutocompleteInput placeholder="Pick one" /><AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem></AutocompleteContent>
    </Autocomplete>
    <Autocomplete variant="bordered" label-placement="outside" label="Fruit" model-value="apple" :items="items">
      <AutocompleteInput /><AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem></AutocompleteContent>
    </Autocomplete>
    <Autocomplete variant="bordered" label-placement="outside" label="Fruit" :is-invalid="true" error-message="Invalid" :items="items">
      <AutocompleteInput /><AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem></AutocompleteContent>
    </Autocomplete>
    <Autocomplete variant="bordered" label-placement="outside" label="Fruit" :is-disabled="true" :items="items">
      <AutocompleteInput /><AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem></AutocompleteContent>
    </Autocomplete>
    <Autocomplete variant="bordered" label-placement="outside" label="Fruit" :is-readonly="true" model-value="apple" :items="items">
      <AutocompleteInput /><AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem></AutocompleteContent>
    </Autocomplete>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const AllStates: Story = {
  render: (args) => ({
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:400px">
        <Autocomplete v-bind="args" variant="bordered" label-placement="outside" label="Normal" description="Everything is fine." :items="items" aria-label="all-normal">
          <AutocompleteInput placeholder="Normal state" />
          <AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent>
        </Autocomplete>
        <Autocomplete v-bind="args" variant="bordered" label-placement="outside" label="Disabled" :is-disabled="true" :items="items" aria-label="all-disabled">
          <AutocompleteInput placeholder="Disabled autocomplete" />
          <AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent>
        </Autocomplete>
        <Autocomplete v-bind="args" variant="bordered" label-placement="outside" label="Readonly" :is-readonly="true" :model-value="'apple'" :items="items" aria-label="all-readonly">
          <AutocompleteInput />
          <AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent>
        </Autocomplete>
        <Autocomplete v-bind="args" variant="bordered" label-placement="outside" label="Invalid" :is-invalid="true" error-message="This field has an error." :items="items" aria-label="all-invalid">
          <AutocompleteInput placeholder="Invalid autocomplete" />
          <AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent>
        </Autocomplete>
        <Autocomplete v-bind="args" variant="bordered" label-placement="outside" label="Required" :is-required="true" :items="items" aria-label="all-required">
          <AutocompleteInput placeholder="A required field" />
          <AutocompleteContent><AutocompleteItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</AutocompleteItem></AutocompleteContent>
        </Autocomplete>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:16px;max-width:400px">
    <Autocomplete variant="bordered" label-placement="outside" label="Normal" description="Everything is fine." :items="items">
      <AutocompleteInput placeholder="Normal state" />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
    <Autocomplete variant="bordered" label-placement="outside" label="Disabled" :is-disabled="true" :items="items">
      <AutocompleteInput placeholder="Disabled autocomplete" />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
    <Autocomplete variant="bordered" label-placement="outside" label="Readonly" :is-readonly="true" model-value="apple" :items="items">
      <AutocompleteInput />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
    <Autocomplete variant="bordered" label-placement="outside" label="Invalid" :is-invalid="true" error-message="This field has an error." :items="items">
      <AutocompleteInput placeholder="Invalid autocomplete" />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
    <Autocomplete variant="bordered" label-placement="outside" label="Required" :is-required="true" :items="items">
      <AutocompleteInput placeholder="A required field" />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

/* ─── Async behavior (preserved verbatim) ─────────────────────────────── */

export const AsyncLoad: Story = {
  render: (args) => ({
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => {
      const items = ref<{ value: string; label: string }[]>([])
      const loadItems = async (query: string) => {
        const results = await mockApiSearch(query)
        items.value = results
        return results
      }
      return { args, items, loadItems }
    },
    template: `
      <div>
        <p style="margin-bottom: 12px; font-size: 13px; color: #64748b;">
          Type to trigger async search (500ms simulated delay)
        </p>
        <Autocomplete
          v-bind="args"
          :load-items="loadItems"
          :debounce-ms="300"
          label="Fruit Search"
          aria-label="Async fruit autocomplete"
        >
          <AutocompleteInput placeholder="Type to search..." />
          <AutocompleteContent>
            <AutocompleteItem
              v-for="item in items"
              :key="item.value"
              :value="item.value"

            >
              {{ item.label }}
            </AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const items = ref([])

async function loadItems(query) {
  // Replace with your actual API call
  const response = await fetch(\`/api/fruits?q=\${query}\`)
  const results = await response.json()
  items.value = results
  return results
}
</script>

<template>
  <Autocomplete
    :load-items="loadItems"
    :debounce-ms="300"
    label="Fruit Search"
  >
    <AutocompleteInput placeholder="Type to search..." />
    <AutocompleteContent>
      <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
        {{ item.label }}
      </AutocompleteItem>
    </AutocompleteContent>
  </Autocomplete>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const AsyncWithDebounce: Story = {
  render: (args) => ({
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => {
      const items = ref<{ value: string; label: string }[]>([])
      const loadItems = async (query: string) => {
        const results = await mockApiSearch(query)
        items.value = results
        return results
      }
      return { args, items, loadItems }
    },
    template: `
      <div>
        <p style="margin-bottom: 12px; font-size: 13px; color: #64748b;">
          300ms debounce — only fires after user stops typing
        </p>
        <Autocomplete
          v-bind="args"
          :load-items="loadItems"
          :debounce-ms="300"
          label="Debounced Search"
          description="Waits 300ms after you stop typing before searching."
          aria-label="Debounced fruit autocomplete"
        >
          <AutocompleteInput placeholder="Type to search (debounced)..." />
          <AutocompleteContent>
            <AutocompleteItem
              v-for="item in items"
              :key="item.value"
              :value="item.value"

            >
              {{ item.label }}
            </AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const items = ref([])

async function loadItems(query) {
  // Replace with your actual API call — debounced by the component
  const response = await fetch(\`/api/fruits?q=\${query}\`)
  const results = await response.json()
  items.value = results
  return results
}
</script>

<template>
  <Autocomplete
    :load-items="loadItems"
    :debounce-ms="300"
    label="Debounced Search"
    description="Waits 300ms after you stop typing before searching."
  >
    <AutocompleteInput placeholder="Type to search (debounced)..." />
    <AutocompleteContent>
      <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
        {{ item.label }}
      </AutocompleteItem>
    </AutocompleteContent>
  </Autocomplete>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const EmptyState: Story = {
  render: (args) => ({
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => {
      const loadItems = () => mockEmptySearch()
      return { args, loadItems }
    },
    template: `
      <div>
        <p style="margin-bottom: 12px; font-size: 13px; color: #64748b;">
          loadItems always returns empty — shows empty state
        </p>
        <Autocomplete
          v-bind="args"
          :load-items="loadItems"
          :debounce-ms="0"
          label="Empty Results"
          aria-label="Empty results autocomplete"
        >
          <AutocompleteInput placeholder="Type anything..." />
          <AutocompleteContent>
            <template #empty>
              <div style="padding: 12px; text-align: center; color: #94a3b8;">
                No results for your search. Try a different term.
              </div>
            </template>
          </AutocompleteContent>
        </Autocomplete>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
} from '@auronui/vue'

async function loadItems(query) {
  // Replace with your actual API call
  const response = await fetch(\`/api/search?q=\${query}\`)
  return response.json()
}
</script>

<template>
  <Autocomplete :load-items="loadItems" :debounce-ms="0" label="Empty Results">
    <AutocompleteInput placeholder="Type anything..." />
    <AutocompleteContent>
      <template #empty>
        <div style="padding: 12px; text-align: center; color: #94a3b8;">
          No results for your search. Try a different term.
        </div>
      </template>
    </AutocompleteContent>
  </Autocomplete>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const LoadingState: Story = {
  render: (args) => ({
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => {
      // Never resolves — keeps loading state active
      const loadItems = () => new Promise<never>(() => {})
      return { args, loadItems }
    },
    template: `
      <div>
        <p style="margin-bottom: 12px; font-size: 13px; color: #64748b;">
          Simulates a never-resolving async call — shows permanent loading indicator
        </p>
        <Autocomplete
          v-bind="args"
          :load-items="loadItems"
          :debounce-ms="0"
          :default-open="true"
          label="Always Loading"
          aria-label="Loading state autocomplete"
        >
          <AutocompleteInput placeholder="Triggers loading..." />
          <AutocompleteContent>
            <template #loading>
              <div style="padding: 16px; text-align: center; color: #94a3b8;">
                Searching the database...
              </div>
            </template>
          </AutocompleteContent>
        </Autocomplete>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
} from '@auronui/vue'

async function loadItems(query) {
  // Replace with your actual API call
  const response = await fetch(\`/api/search?q=\${query}\`)
  return response.json()
}
</script>

<template>
  <Autocomplete :load-items="loadItems" :debounce-ms="0" label="Search">
    <AutocompleteInput placeholder="Type to search..." />
    <AutocompleteContent>
      <template #loading>
        <div style="padding: 16px; text-align: center; color: #94a3b8;">
          Searching the database...
        </div>
      </template>
    </AutocompleteContent>
  </Autocomplete>
</template>`,
        language: 'vue',
      },
    },
  },
};

/* ─── Multiple selection ──────────────────────────────────────────────────── */

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "grape", label: "Grape" },
  { value: "mango", label: "Mango" },
  { value: "orange", label: "Orange" },
  { value: "peach", label: "Peach" },
  { value: "pear", label: "Pear" },
  { value: "pineapple", label: "Pineapple" },
  { value: "strawberry", label: "Strawberry" },
];

export const Multiple: Story = {
  name: "Multiple selection",
  render: (args) => ({
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup() {
      const selected = ref<string[]>([]);
      return { args, selected, fruits };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <Autocomplete
          v-bind="args"
          v-model="selected"
          :multiple="true"
          :items="fruits"
          label="Favourite fruits"
        >
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="f in fruits" :key="f.value" :value="f.value">
              {{ f.label }}
            </AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
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
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'mango', label: 'Mango' },
]

const selected = ref([])
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
    <Autocomplete
      v-model="selected"
      :multiple="true"
      :items="fruits"
      label="Favourite fruits"
    >
      <AutocompleteInput placeholder="Search fruits..." />
      <AutocompleteContent>
        <AutocompleteItem v-for="f in fruits" :key="f.value" :value="f.value">
          {{ f.label }}
        </AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
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
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup() {
      const selected = ref<string[]>(["apple", "mango", "strawberry"]);
      return { args, selected, fruits };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <Autocomplete
          v-bind="args"
          v-model="selected"
          :multiple="true"
          :items="fruits"
          label="Favourite fruits"
          variant="bordered"
        >
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="f in fruits" :key="f.value" :value="f.value">
              {{ f.label }}
            </AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
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
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'mango', label: 'Mango' },
  { value: 'strawberry', label: 'Strawberry' },
]

// Pre-selected values on mount
const selected = ref(['apple', 'mango', 'strawberry'])
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
    <Autocomplete
      v-model="selected"
      :multiple="true"
      :items="fruits"
      label="Favourite fruits"
      variant="bordered"
    >
      <AutocompleteInput placeholder="Search fruits..." />
      <AutocompleteContent>
        <AutocompleteItem v-for="f in fruits" :key="f.value" :value="f.value">
          {{ f.label }}
        </AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
    <p style="font-size:12px;color:#64748b">Selected: {{ selected.join(', ') || '—' }}</p>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const MultipleWrap: Story = {
  name: "Multiple — wrap overflow",
  render: (args) => ({
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup() {
      const selected = ref<string[]>(["apple", "banana", "cherry", "grape"]);
      return { args, selected, fruits };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <Autocomplete
          v-bind="args"
          v-model="selected"
          :multiple="true"
          multiple-overflow="wrap"
          :items="fruits"
          label="Favourite fruits"
          variant="bordered"
        >
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="f in fruits" :key="f.value" :value="f.value">
              {{ f.label }}
            </AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
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
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'mango', label: 'Mango' },
]

const selected = ref(['apple', 'banana', 'cherry', 'grape'])
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
    <Autocomplete
      v-model="selected"
      :multiple="true"
      multiple-overflow="wrap"
      :items="fruits"
      label="Favourite fruits"
      variant="bordered"
    >
      <AutocompleteInput placeholder="Search fruits..." />
      <AutocompleteContent>
        <AutocompleteItem v-for="f in fruits" :key="f.value" :value="f.value">
          {{ f.label }}
        </AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
    <p style="font-size:12px;color:#64748b">Selected: {{ selected.join(', ') || '—' }}</p>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const MultipleCollapse: Story = {
  name: "Multiple — collapse overflow",
  render: (args) => ({
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup() {
      const selected = ref<string[]>(["apple", "banana", "cherry", "grape"]);
      return { args, selected, fruits };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <Autocomplete
          v-bind="args"
          v-model="selected"
          :multiple="true"
          multiple-overflow="collapse"
          :items="fruits"
          label="Favourite fruits"
          variant="bordered"
        >
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="f in fruits" :key="f.value" :value="f.value">
              {{ f.label }}
            </AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
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
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'mango', label: 'Mango' },
]

const selected = ref(['apple', 'banana', 'cherry', 'grape'])
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
    <Autocomplete
      v-model="selected"
      :multiple="true"
      multiple-overflow="collapse"
      :items="fruits"
      label="Favourite fruits"
      variant="bordered"
    >
      <AutocompleteInput placeholder="Search fruits..." />
      <AutocompleteContent>
        <AutocompleteItem v-for="f in fruits" :key="f.value" :value="f.value">
          {{ f.label }}
        </AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
    <p style="font-size:12px;color:#64748b">Selected: {{ selected.join(', ') || '—' }}</p>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

/* ─── Creatable ───────────────────────────────────────────────────────────── */

export const CreatableComponent: Story = {
  name: "Creatable — AutocompleteCreateItem compound component",
  render: (args) => ({
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem, AutocompleteCreateItem },
    setup() {
      const selected = ref("");
      const items = ref([
        { value: "react", label: "React" },
        { value: "vue", label: "Vue" },
        { value: "svelte", label: "Svelte" },
      ]);
      function onCreate(value: string) {
        items.value = [...items.value, { value, label: value }];
        selected.value = value;
      }
      return { args, selected, items, onCreate };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <Autocomplete
          v-bind="args"
          v-model="selected"
          :items="items"
          label="Framework"
          variant="bordered"
          @create="onCreate"
        >
          <AutocompleteInput placeholder="Search or create..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="i in items" :key="i.value" :value="i.value">
              {{ i.label }}
            </AutocompleteItem>
            <AutocompleteCreateItem>
              <template #default="{ term }">
                ✦ New framework: {{ term }}
              </template>
            </AutocompleteCreateItem>
          </AutocompleteContent>
        </Autocomplete>
        <p style="font-size:12px;color:#64748b">Selected: {{ selected || '—' }}</p>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
  AutocompleteCreateItem,
} from '@auronui/vue'

const selected = ref('')
const items = ref([
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
])

function onCreate(value) {
  items.value = [...items.value, { value, label: value }]
  selected.value = value
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
    <Autocomplete
      v-model="selected"
      :items="items"
      label="Framework"
      variant="bordered"
      @create="onCreate"
    >
      <AutocompleteInput placeholder="Search or create..." />
      <AutocompleteContent>
        <AutocompleteItem v-for="i in items" :key="i.value" :value="i.value">
          {{ i.label }}
        </AutocompleteItem>
        <AutocompleteCreateItem>
          <template #default="{ term }">
            ✦ New framework: {{ term }}
          </template>
        </AutocompleteCreateItem>
      </AutocompleteContent>
    </Autocomplete>
    <p style="font-size:12px;color:#64748b">Selected: {{ selected || '—' }}</p>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const CreatableMultiple: Story = {
  name: "Creatable — multiple mode",
  render: (args) => ({
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem, AutocompleteCreateItem },
    setup() {
      const selected = ref<string[]>([]);
      const items = ref([
        { value: "react", label: "React" },
        { value: "vue", label: "Vue" },
        { value: "svelte", label: "Svelte" },
      ]);
      function onCreate(value: string) {
        items.value = [...items.value, { value, label: value }];
      }
      return { args, selected, items, onCreate };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <Autocomplete
          v-bind="args"
          v-model="selected"
          :multiple="true"
          :items="items"
          label="Frameworks"
          variant="bordered"
          @create="onCreate"
        >
          <AutocompleteInput placeholder="Search or create..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="i in items" :key="i.value" :value="i.value">
              {{ i.label }}
            </AutocompleteItem>
            <AutocompleteCreateItem />
          </AutocompleteContent>
        </Autocomplete>
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
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
  AutocompleteCreateItem,
} from '@auronui/vue'

const selected = ref([])
const items = ref([
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
])

function onCreate(value) {
  items.value = [...items.value, { value, label: value }]
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
    <Autocomplete
      v-model="selected"
      :multiple="true"
      :items="items"
      label="Frameworks"
      variant="bordered"
      @create="onCreate"
    >
      <AutocompleteInput placeholder="Search or create..." />
      <AutocompleteContent>
        <AutocompleteItem v-for="i in items" :key="i.value" :value="i.value">
          {{ i.label }}
        </AutocompleteItem>
        <AutocompleteCreateItem />
      </AutocompleteContent>
    </Autocomplete>
    <p style="font-size:12px;color:#64748b">Selected: {{ selected.join(', ') || '—' }}</p>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  render: (args) => ({
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:360px">
        <Autocomplete
          v-bind="args"
          :items="items"
          label="Favorite Fruit"
          variant="bordered"
          :class-names="{
            base: 'rounded-lg border-2 border-blue-500 p-4',
            label: 'text-blue-600 font-semibold',
            mainWrapper: 'rounded-md bg-blue-50',
            description: 'text-blue-500 italic',
          }"
          description="Custom styled with per-slot class overrides."
          aria-label="Autocomplete with custom styles"
        >
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]
</script>

<template>
  <div style="max-width:360px">
    <Autocomplete
      :items="items"
      label="Favorite Fruit"
      variant="bordered"
      :class-names="{
        base: 'rounded-lg border-2 border-blue-500 p-4',
        label: 'text-blue-600 font-semibold',
        mainWrapper: 'rounded-md bg-blue-50',
        description: 'text-blue-500 italic',
      }"
      description="Custom styled with per-slot class overrides."
    >
      <AutocompleteInput placeholder="Search fruits..." />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
          {{ item.label }}
        </AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
  </div>
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
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
} from '@auronui/vue'

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
]

const value = ref('apple')
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:8px;padding:16px;">
    <Autocomplete v-model="value" label="Favorite Fruit" :items="items">
      <AutocompleteInput placeholder="Search fruits..." />
      <AutocompleteContent>
        <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
          {{ item.label }}
        </AutocompleteItem>
      </AutocompleteContent>
    </Autocomplete>
    <p style="font-size:13px;color:#666;">Value: {{ value }}</p>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) =>
    defineComponent({
      components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
      setup() {
        const items = [
          { value: 'apple', label: 'Apple' },
          { value: 'banana', label: 'Banana' },
          { value: 'cherry', label: 'Cherry' },
          { value: 'date', label: 'Date' },
          { value: 'elderberry', label: 'Elderberry' },
        ]
        const value = ref('apple')
        return { args, items, value }
      },
      template: `
        <div style="display:flex;flex-direction:column;gap:8px;padding:16px;">
          <Autocomplete v-bind="args" v-model="value" label="Favorite Fruit" :items="items">
            <AutocompleteInput placeholder="Search fruits..." />
            <AutocompleteContent>
              <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">
                {{ item.label }}
              </AutocompleteItem>
            </AutocompleteContent>
          </Autocomplete>
          <p style="font-size:13px;color:#666;">Value: {{ value }}</p>
        </div>
      `,
    }),
}
