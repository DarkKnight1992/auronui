import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Chip } from "@auronui/vue";

const meta: Meta<typeof Chip> = {
  component: Chip,
  title: "Components/Chip",
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["default", "accent", "success", "warning", "danger"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    variant: {
      control: "select",
      options: ["solid", "soft", "bordered", "text"],
    },
    dot: { control: "boolean" },
    isClosable: { control: "boolean" },
    classNames: {
      control: "object",
      description:
        "Per-slot class overrides. Keys match the component anatomy slot names: base, dot, startContent, label, endContent, closeButton.",
    },
  },
  args: {
    color: "default",
    variant: "solid",
    size: "md",
    dot: false,
    isClosable: false,
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  render: (args) => ({
    components: { Chip },
    setup: () => ({ args }),
    template: `<Chip v-bind="args">Label</Chip>`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Chip } from '@auronui/vue'
</script>

<template>
  <Chip>Label</Chip>
</template>`,
        type: 'code',
        language: 'vue',
      }
    }
  },
};

export const Solid: Story = {
  render: (args) => ({
    components: { Chip },
    setup: () => ({ args }),
    template: `<Chip v-bind="args">Solid</Chip>`,
  }),
  args: { variant: "solid", color: "accent" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Chip } from '@auronui/vue'
</script>

<template>
  <Chip variant="solid" color="accent">Solid</Chip>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Soft: Story = {
  render: (args) => ({
    components: { Chip },
    setup: () => ({ args }),
    template: `<Chip v-bind="args">Soft</Chip>`,
  }),
  args: { variant: "soft", color: "accent" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Chip } from '@auronui/vue'
</script>

<template>
  <Chip variant="soft" color="accent">Soft</Chip>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Outlined: Story = {
  render: (args) => ({
    components: { Chip },
    setup: () => ({ args }),
    template: `<Chip v-bind="args">Bordered</Chip>`,
  }),
  args: { variant: "bordered", color: "accent" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Chip } from '@auronui/vue'
</script>

<template>
  <Chip variant="bordered" color="accent">Bordered</Chip>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Text: Story = {
  render: (args) => ({
    components: { Chip },
    setup: () => ({ args }),
    template: `<Chip v-bind="args">Text</Chip>`,
  }),
  args: { variant: "text", color: "accent" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Chip } from '@auronui/vue'
</script>

<template>
  <Chip variant="text" color="accent">Text</Chip>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const WithDot: Story = {
  render: (args) => ({
    components: { Chip },
    setup: () => ({ args }),
    template: `<Chip v-bind="args">Active</Chip>`,
  }),
  args: { dot: true, variant: "soft", color: "success" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Chip } from '@auronui/vue'
</script>

<template>
  <Chip dot variant="soft" color="success">Active</Chip>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Closable: Story = {
  render: (args) => ({
    components: { Chip },
    setup: () => ({ args }),
    template: `<Chip v-bind="args" @close="onClose">Dismiss me</Chip>`,
    methods: {
      onClose: () => console.log("close clicked"),
    },
  }),
  args: { isClosable: true, variant: "soft", color: "accent" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Chip } from '@auronui/vue'

function onClose() {
  console.log('close clicked')
}
</script>

<template>
  <Chip isClosable variant="soft" color="accent" @close="onClose">Dismiss me</Chip>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const WithStartContent: Story = {
  render: (args) => ({
    components: { Chip },
    setup: () => ({ args }),
    template: `
      <Chip v-bind="args">
        <template #startContent>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m9 12 2 2 4-4" />
            <circle cx="12" cy="12" r="9" />
          </svg>
        </template>
        Verified
      </Chip>
    `,
  }),
  args: { variant: "soft", color: "success" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Chip } from '@auronui/vue'
</script>

<template>
  <Chip variant="soft" color="success">
    <template #startContent>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m9 12 2 2 4-4" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    </template>
    Verified
  </Chip>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const WithEndContent: Story = {
  render: (args) => ({
    components: { Chip },
    setup: () => ({ args }),
    template: `
      <Chip v-bind="args">
        Beta
        <template #endContent>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14" />
            <path d="m13 5 7 7-7 7" />
          </svg>
        </template>
      </Chip>
    `,
  }),
  args: { variant: "soft", color: "accent" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Chip } from '@auronui/vue'
</script>

<template>
  <Chip variant="soft" color="accent">
    Beta
    <template #endContent>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14" />
        <path d="m13 5 7 7-7 7" />
      </svg>
    </template>
  </Chip>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Sizes: Story = {
  render: (args) => ({
    components: { Chip },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <Chip v-bind="args" size="sm" variant="soft" color="accent">Small</Chip>
        <Chip v-bind="args" size="md" variant="soft" color="accent">Medium</Chip>
        <Chip v-bind="args" size="lg" variant="soft" color="accent">Large</Chip>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Chip } from '@auronui/vue'
</script>

<template>
  <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
    <Chip size="sm" variant="soft" color="accent">Small</Chip>
    <Chip size="md" variant="soft" color="accent">Medium</Chip>
    <Chip size="lg" variant="soft" color="accent">Large</Chip>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const AllColors: Story = {
  render: (args) => ({
    components: { Chip },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
          <Chip v-bind="args" variant="solid" color="default">Default</Chip>
          <Chip v-bind="args" variant="solid" color="accent">Accent</Chip>
          <Chip v-bind="args" variant="solid" color="success">Success</Chip>
          <Chip v-bind="args" variant="solid" color="warning">Warning</Chip>
          <Chip v-bind="args" variant="solid" color="danger">Danger</Chip>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
          <Chip v-bind="args" variant="soft" color="default">Default</Chip>
          <Chip v-bind="args" variant="soft" color="accent">Accent</Chip>
          <Chip v-bind="args" variant="soft" color="success">Success</Chip>
          <Chip v-bind="args" variant="soft" color="warning">Warning</Chip>
          <Chip v-bind="args" variant="soft" color="danger">Danger</Chip>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
          <Chip v-bind="args" variant="bordered" color="default">Default</Chip>
          <Chip v-bind="args" variant="bordered" color="accent">Accent</Chip>
          <Chip v-bind="args" variant="bordered" color="success">Success</Chip>
          <Chip v-bind="args" variant="bordered" color="warning">Warning</Chip>
          <Chip v-bind="args" variant="bordered" color="danger">Danger</Chip>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
          <Chip v-bind="args" variant="text" color="default">Default</Chip>
          <Chip v-bind="args" variant="text" color="accent">Accent</Chip>
          <Chip v-bind="args" variant="text" color="success">Success</Chip>
          <Chip v-bind="args" variant="text" color="warning">Warning</Chip>
          <Chip v-bind="args" variant="text" color="danger">Danger</Chip>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Chip } from '@auronui/vue'
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
      <Chip variant="solid" color="default">Default</Chip>
      <Chip variant="solid" color="accent">Accent</Chip>
      <Chip variant="solid" color="success">Success</Chip>
      <Chip variant="solid" color="warning">Warning</Chip>
      <Chip variant="solid" color="danger">Danger</Chip>
    </div>
    <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
      <Chip variant="soft" color="default">Default</Chip>
      <Chip variant="soft" color="accent">Accent</Chip>
      <Chip variant="soft" color="success">Success</Chip>
      <Chip variant="soft" color="warning">Warning</Chip>
      <Chip variant="soft" color="danger">Danger</Chip>
    </div>
    <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
      <Chip variant="bordered" color="default">Default</Chip>
      <Chip variant="bordered" color="accent">Accent</Chip>
      <Chip variant="bordered" color="success">Success</Chip>
      <Chip variant="bordered" color="warning">Warning</Chip>
      <Chip variant="bordered" color="danger">Danger</Chip>
    </div>
    <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
      <Chip variant="text" color="default">Default</Chip>
      <Chip variant="text" color="accent">Accent</Chip>
      <Chip variant="text" color="success">Success</Chip>
      <Chip variant="text" color="warning">Warning</Chip>
      <Chip variant="text" color="danger">Danger</Chip>
    </div>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const AllVariants: Story = {
  render: (args) => ({
    components: { Chip },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <Chip v-bind="args" variant="solid" color="accent">Solid</Chip>
        <Chip v-bind="args" variant="soft" color="accent">Soft</Chip>
        <Chip v-bind="args" variant="bordered" color="accent">Bordered</Chip>
        <Chip v-bind="args" variant="text" color="accent">Text</Chip>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Chip } from '@auronui/vue'
</script>

<template>
  <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
    <Chip variant="solid" color="accent">Solid</Chip>
    <Chip variant="soft" color="accent">Soft</Chip>
    <Chip variant="bordered" color="accent">Bordered</Chip>
    <Chip variant="text" color="accent">Text</Chip>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const StatusPills: Story = {
  render: (args) => ({
    components: { Chip },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <Chip v-bind="args" dot variant="soft" color="success">Online</Chip>
        <Chip v-bind="args" dot variant="soft" color="warning">Away</Chip>
        <Chip v-bind="args" dot variant="soft" color="danger">Offline</Chip>
        <Chip v-bind="args" dot variant="soft" color="default">Idle</Chip>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Chip } from '@auronui/vue'
</script>

<template>
  <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
    <Chip dot variant="soft" color="success">Online</Chip>
    <Chip dot variant="soft" color="warning">Away</Chip>
    <Chip dot variant="soft" color="danger">Offline</Chip>
    <Chip dot variant="soft" color="default">Idle</Chip>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const FilterChips: Story = {
  render: (args) => ({
    components: { Chip },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <Chip v-bind="args" isClosable variant="soft" color="accent" @close="() => {}">Design</Chip>
        <Chip v-bind="args" isClosable variant="soft" color="accent" @close="() => {}">Engineering</Chip>
        <Chip v-bind="args" isClosable variant="soft" color="accent" @close="() => {}">Product</Chip>
        <Chip v-bind="args" isClosable variant="soft" color="accent" @close="() => {}">Research</Chip>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Chip } from '@auronui/vue'

function removeFilter(name: string) {
  // handle removal
}
</script>

<template>
  <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
    <Chip isClosable variant="soft" color="accent" @close="() => removeFilter('Design')">Design</Chip>
    <Chip isClosable variant="soft" color="accent" @close="() => removeFilter('Engineering')">Engineering</Chip>
    <Chip isClosable variant="soft" color="accent" @close="() => removeFilter('Product')">Product</Chip>
    <Chip isClosable variant="soft" color="accent" @close="() => removeFilter('Research')">Research</Chip>
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
    components: { Chip },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <Chip
          v-bind="args"
          :class-names="{
            base: 'border-2 border-blue-500 rounded-lg',
            label: 'text-blue-600 font-semibold',
          }"
        >
          Custom Border
        </Chip>
        <Chip
          v-bind="args"
          :class-names="{
            base: 'bg-purple-100 shadow-lg',
            label: 'text-purple-700 font-bold',
          }"
        >
          Styled Base
        </Chip>
        <Chip
          v-bind="args"
          dot
          :class-names="{
            dot: 'bg-green-500 shadow-md',
            label: 'text-green-800',
          }"
        >
          Custom Dot
        </Chip>
      </div>
    `,
  }),
  args: { variant: "soft" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Chip } from '@auronui/vue'
</script>

<template>
  <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
    <Chip
      variant="soft"
      :class-names="{
        base: 'border-2 border-blue-500 rounded-lg',
        label: 'text-blue-600 font-semibold',
      }"
    >
      Custom Border
    </Chip>
    <Chip
      variant="soft"
      :class-names="{
        base: 'bg-purple-100 shadow-lg',
        label: 'text-purple-700 font-bold',
      }"
    >
      Styled Base
    </Chip>
    <Chip
      variant="soft"
      dot
      :class-names="{
        dot: 'bg-green-500 shadow-md',
        label: 'text-green-800',
      }"
    >
      Custom Dot
    </Chip>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};
