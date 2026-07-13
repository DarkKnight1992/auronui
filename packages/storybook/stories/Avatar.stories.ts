import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Avatar } from "@auronui/vue";

const meta: Meta<typeof Avatar> = {
  component: Avatar,
  title: "Components/Avatar",
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "accent", "success", "warning", "danger"],
    },
    variant: {
      control: "select",
      options: ["default", "soft"],
    },
    isBordered: { control: "boolean" },
    isDisabled: { control: "boolean" },
    showFallback: { control: "boolean" },
    classNames: {
      control: "object",
      description: "Per-slot class overrides. Keys match the component anatomy slot names.",
    },
  },
  args: {
    size: "md",
    color: "default",
    variant: "default",
    isBordered: false,
    isDisabled: false,
    showFallback: false,
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: { name: "Jane Doe" },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Avatar } from '@auronui/vue'
</script>

<template>
  <Avatar name="Jane Doe" />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
};

export const WithImage: Story = {
  args: {
    src: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    alt: "Jane Doe",
    name: "Jane Doe",
  },
};

export const WithInitials: Story = {
  args: { name: "John Smith" },
};

export const WithIcon: Story = {
  args: {},
};

export const Sizes: Story = {
  render: (args) => ({
    components: { Avatar },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <Avatar v-bind="args" size="sm" name="SM" />
        <Avatar v-bind="args" size="md" name="MD" />
        <Avatar v-bind="args" size="lg" name="LG" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Avatar } from '@auronui/vue'
</script>

<template>
  <div style="display: flex; gap: 12px; align-items: center;">
    <Avatar size="sm" name="SM" />
    <Avatar size="md" name="MD" />
    <Avatar size="lg" name="LG" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const Colors: Story = {
  parameters: {
    controls: { exclude: ['color'] },
    docs: {
      source: {
        code: `<script setup>
import { Avatar } from '@auronui/vue'
</script>

<template>
  <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
    <Avatar color="default" name="DF" />
    <Avatar color="primary" name="PR" />
    <Avatar color="secondary" name="SE" />
    <Avatar color="accent" name="AC" />
    <Avatar color="success" name="SC" />
    <Avatar color="warning" name="WA" />
    <Avatar color="danger" name="DG" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Avatar },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <Avatar v-bind="args" color="default" name="DF" />
        <Avatar v-bind="args" color="primary" name="PR" />
        <Avatar v-bind="args" color="secondary" name="SE" />
        <Avatar v-bind="args" color="accent" name="AC" />
        <Avatar v-bind="args" color="success" name="SC" />
        <Avatar v-bind="args" color="warning" name="WA" />
        <Avatar v-bind="args" color="danger" name="DG" />
      </div>
    `,
  }),
};

export const SoftVariant: Story = {
  parameters: {
    controls: { exclude: ['color'] },
    docs: {
      source: {
        code: `<script setup>
import { Avatar } from '@auronui/vue'
</script>

<template>
  <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
    <Avatar variant="soft" color="primary" name="PR" />
    <Avatar variant="soft" color="accent" name="AC" />
    <Avatar variant="soft" color="success" name="SC" />
    <Avatar variant="soft" color="warning" name="WA" />
    <Avatar variant="soft" color="danger" name="DG" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Avatar },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <Avatar v-bind="args" variant="soft" color="primary" name="PR" />
        <Avatar v-bind="args" variant="soft" color="accent" name="AC" />
        <Avatar v-bind="args" variant="soft" color="success" name="SC" />
        <Avatar v-bind="args" variant="soft" color="warning" name="WA" />
        <Avatar v-bind="args" variant="soft" color="danger" name="DG" />
      </div>
    `,
  }),
};

export const Bordered: Story = {
  args: {
    name: "Bob Carol",
    isBordered: true,
  },
};

export const Disabled: Story = {
  args: {
    name: "Bob Carol",
    isDisabled: true,
  },
};

export const ShowFallback: Story = {
  args: {
    src: "https://broken-image.example.com/photo.jpg",
    name: "Jane Doe",
    showFallback: true,
  },
};

export const CustomFallback: Story = {
  render: (args) => ({
    components: { Avatar },
    setup: () => ({ args }),
    template: `
      <Avatar v-bind="args">
        <template #fallback>
          <span style="font-size: 1.25rem;">🎭</span>
        </template>
      </Avatar>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Avatar } from '@auronui/vue'
</script>

<template>
  <Avatar>
    <template #fallback>
      <span style="font-size: 1.25rem;">🎭</span>
    </template>
  </Avatar>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  args: {
    name: "Alex Rivera",
    size: "lg",
  },
  render: (args) => ({
    components: { Avatar },
    setup: () => ({ args }),
    template: `
      <Avatar
        v-bind="args"
        :class-names="{
          base: 'ring-4 ring-blue-500 shadow-lg',
          fallback: 'bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold',
        }"
      />
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Avatar } from '@auronui/vue'
</script>

<template>
  <Avatar
    name="Alex Rivera"
    size="lg"
    :class-names="{
      base: 'ring-4 ring-blue-500 shadow-lg',
      fallback: 'bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold',
    }"
  />
</template>`,
        language: 'vue',
      },
    },
  },
};
