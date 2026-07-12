import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Button } from "@auronui/vue";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "default", "bordered", "ghost", "soft"],
    },
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "accent", "success", "warning", "danger"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    radius: {
      control: "select",
      options: [undefined, "none", "sm", "md", "lg", "full"],
    },
    isIconOnly: { control: "boolean" },
    fullWidth: { control: "boolean" },
    disabled: { control: "boolean" },
    isLoading: { control: "boolean" },
    classNames: {
      control: "object",
      description:
        "Per-slot class overrides. Keys match the component anatomy slot names: base, startContent, label, endContent, spinner.",
    },
  },
  args: {
    variant: "solid",
    color: "primary",
    size: "md",
    radius: undefined,
    isIconOnly: false,
    fullWidth: false,
    disabled: false,
    isLoading: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const LegacyVariants: Story = {
  name: '⚠️ Legacy Variants (deprecated)',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: `
> **Deprecated** — these single-prop variant names still work but are superseded by the \`variant\` + \`color\` API introduced in v1.1.
>
> | Old | New equivalent |
> |-----|----------------|
> | \`variant="primary"\` | \`variant="solid" color="primary"\` |
> | \`variant="secondary"\` | \`variant="default"\` |
> | \`variant="tertiary"\` | \`variant="default"\` |
> | \`variant="danger"\` | \`variant="solid" color="danger"\` |
> | \`variant="danger-soft"\` | \`variant="soft" color="danger"\` |
> | \`variant="success"\` | \`variant="solid" color="success"\` |
> | \`variant="success-soft"\` | \`variant="soft" color="success"\` |
> | \`variant="warning"\` | \`variant="solid" color="warning"\` |
> | \`variant="warning-soft"\` | \`variant="soft" color="warning"\` |
        `,
      },
      source: {
        code: `<script setup>
import { Button } from '@auronui/vue'
</script>

<!-- These still work, but prefer the new variant+color API -->
<template>
  <Button variant="primary">Primary</Button>
  <Button variant="danger">Danger</Button>
  <Button variant="danger-soft">Danger soft</Button>
  <Button variant="success">Success</Button>
  <Button variant="warning">Warning</Button>

  <!-- New equivalent -->
  <Button variant="solid" color="primary">Primary</Button>
  <Button variant="solid" color="danger">Danger</Button>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: () => ({
    components: { Button },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px">
        <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
          <Button size="sm" variant="primary">primary</Button>
          <Button size="sm" variant="secondary">secondary</Button>
          <Button size="sm" variant="tertiary">tertiary</Button>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
          <Button size="sm" variant="danger">danger</Button>
          <Button size="sm" variant="danger-soft">danger-soft</Button>
          <Button size="sm" variant="success">success</Button>
          <Button size="sm" variant="success-soft">success-soft</Button>
          <Button size="sm" variant="warning">warning</Button>
          <Button size="sm" variant="warning-soft">warning-soft</Button>
        </div>
      </div>
    `,
  }),
}

export const Default: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Click me</Button>',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Button } from '@auronui/vue'
</script>

<template>
  <Button variant="solid" color="primary">Click me</Button>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
};

export const AllVariants: Story = {
  args: {
    isLoading: false,
    size: "sm",
    color: "primary",
  },

  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        <Button v-bind="args" variant="solid">Solid</Button>
        <Button v-bind="args" variant="soft">Soft</Button>
        <Button v-bind="args" variant="default">Default</Button>
        <Button v-bind="args" variant="bordered">Bordered</Button>
        <Button v-bind="args" variant="ghost">Ghost</Button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Button } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:8px">
    <Button size="sm" color="primary" variant="solid">Solid</Button>
    <Button size="sm" color="primary" variant="soft">Soft</Button>
    <Button size="sm" color="primary" variant="default">Default</Button>
    <Button size="sm" color="primary" variant="bordered">Bordered</Button>
    <Button size="sm" color="primary" variant="ghost">Ghost</Button>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const AllColors: Story = {
  args: {
    isLoading: false,
    size: "sm",
    variant: "solid",
  },

  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        <Button v-bind="args" color="default">Default</Button>
        <Button v-bind="args" color="primary">Primary</Button>
        <Button v-bind="args" color="secondary">Secondary</Button>
        <Button v-bind="args" color="accent">Accent</Button>
        <Button v-bind="args" color="success">Success</Button>
        <Button v-bind="args" color="warning">Warning</Button>
        <Button v-bind="args" color="danger">Danger</Button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Button } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;gap:8px">
    <Button size="sm" variant="solid" color="default">Default</Button>
    <Button size="sm" variant="solid" color="primary">Primary</Button>
    <Button size="sm" variant="solid" color="secondary">Secondary</Button>
    <Button size="sm" variant="solid" color="accent">Accent</Button>
    <Button size="sm" variant="solid" color="success">Success</Button>
    <Button size="sm" variant="solid" color="warning">Warning</Button>
    <Button size="sm" variant="solid" color="danger">Danger</Button>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const AllSizes: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: `
      <div style="display:flex;align-items:center;gap:8px">
        <Button v-bind="args" size="sm">Small</Button>
        <Button v-bind="args" size="md">Medium</Button>
        <Button v-bind="args" size="lg">Large</Button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Button } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;align-items:center;gap:8px">
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Loading: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: `
      <div style="display:flex;gap:8px">
        <Button v-bind="args" :isLoading="true" size="sm">Loading</Button>
        <Button v-bind="args" :isLoading="true" size="md">Loading</Button>
        <Button v-bind="args" :isLoading="true" size="lg">Loading</Button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Button } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;gap:8px">
    <Button :isLoading="true" size="sm">Loading</Button>
    <Button :isLoading="true" size="md">Loading</Button>
    <Button :isLoading="true" size="lg">Loading</Button>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const DisabledState: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: `
      <div style="display:flex;gap:8px">
        <Button v-bind="args" :disabled="true" variant="solid">Disabled Solid</Button>
        <Button v-bind="args" :disabled="true" variant="bordered">Disabled Bordered</Button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Button } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;gap:8px">
    <Button :disabled="true" variant="solid">Disabled Solid</Button>
    <Button :disabled="true" variant="bordered">Disabled Bordered</Button>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const FullWidth: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args" :fullWidth="true">Full Width Button</Button>',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Button } from '@auronui/vue'
</script>

<template>
  <Button :fullWidth="true">Full Width Button</Button>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const WithContentSlots: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: `
      <div style="display:flex;gap:8px">
        <Button v-bind="args">
          <template #startContent><span>★</span></template>
          With Icon
        </Button>
        <Button v-bind="args">
          With Icon
          <template #endContent><span>→</span></template>
        </Button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Button } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;gap:8px">
    <Button>
      <template #startContent><span>★</span></template>
      With Icon
    </Button>
    <Button>
      With Icon
      <template #endContent><span>→</span></template>
    </Button>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const AllRadii: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: `
      <div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px">
        <Button v-bind="args" radius="none">None</Button>
        <Button v-bind="args" radius="sm">Small</Button>
        <Button v-bind="args" radius="md">Medium</Button>
        <Button v-bind="args" radius="lg">Large</Button>
        <Button v-bind="args" radius="full">Full</Button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Button } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px">
    <Button radius="none">None</Button>
    <Button radius="sm">Small</Button>
    <Button radius="md">Medium</Button>
    <Button radius="lg">Large</Button>
    <Button radius="full">Full</Button>
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
    components: { Button },
    setup() {
      return { args };
    },
    template: `
      <div style="display:flex;gap:16px">
        <Button
          v-bind="args"
          :class-names="{
            base: 'border-2 border-blue-500 rounded-xl',
            label: 'text-blue-700 font-semibold',
            startContent: 'text-blue-600',
          }"
        >
          <template #startContent>★</template>
          Custom Styled
        </Button>
        <Button
          v-bind="args"
          variant="bordered"
          :class-names="{
            base: 'border-2 border-emerald-400 bg-emerald-50',
            label: 'text-emerald-700 font-bold',
          }"
        >
          Success Theme
        </Button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Button } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;gap:16px">
    <Button
      :class-names="{
        base: 'border-2 border-blue-500 rounded-xl',
        label: 'text-blue-700 font-semibold',
        startContent: 'text-blue-600',
      }"
    >
      <template #startContent>★</template>
      Custom Styled
    </Button>
    <Button
      variant="bordered"
      :class-names="{
        base: 'border-2 border-emerald-400 bg-emerald-50',
        label: 'text-emerald-700 font-bold',
      }"
    >
      Success Theme
    </Button>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};
