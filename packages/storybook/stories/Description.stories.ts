import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Description, Input, Label } from "@auronui/vue";

const meta: Meta<typeof Description> = {
  component: Description,
  title: "Form/Description",
  tags: ["autodocs"],
  argTypes: {
    id: { control: "text" },
  },
  args: {
    id: "description-1",
  },
};

export default meta;
type Story = StoryObj<typeof Description>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Description } from '@auronui/vue'
</script>

<template>
  <Description>This is a helpful description for the form field above.</Description>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Description },
    setup: () => ({ args }),
    template: `<Description v-bind="args">This is a helpful description for the form field above.</Description>`,
  }),
};

export const WithLabel: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Description, Input, Label } from '@auronui/vue'
</script>

<template>
  <div class="flex flex-col gap-1">
    <Label for="email-input">Email address</Label>
    <Input id="email-input" type="email" aria-describedby="email-desc" placeholder="you@example.com" />
    <Description id="email-desc">We'll never share your email with anyone else.</Description>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Description, Input, Label },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <Label for="email-input">Email address</Label>
        <Input id="email-input" type="email" aria-describedby="email-desc" placeholder="you@example.com" />
        <Description v-bind="args" id="email-desc">We'll never share your email with anyone else.</Description>
      </div>
    `,
  }),
};
