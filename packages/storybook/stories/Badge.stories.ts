import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Badge, Avatar, Button } from "@auronui/vue";

const meta: Meta<typeof Badge> = {
  component: Badge,
  title: "Components/Badge",
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["default", "accent", "success", "warning", "danger"],
    },
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    variant: { control: "select", options: ["primary", "secondary", "soft"] },
    placement: {
      control: "select",
      options: ["top-right", "top-left", "bottom-right", "bottom-left"],
    },
    classNames: {
      control: "object",
      description: "Per-slot class overrides. Keys match the component anatomy slot names.",
    },
  },
  args: {
    color: "danger",
    size: "md",
    variant: "primary",
    placement: "top-right",
  },
  decorators: [
    () => ({
      template: `<div style="padding: 32px; display: flex; align-items: center; justify-content: center;"><story /></div>`,
    }),
  ],
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  render: (args) => ({
    components: { Badge, Avatar },
    setup: () => ({ args }),
    template: `
      <Badge v-bind="args">
        <Avatar name="JD" />
        <template #label>5</template>
      </Badge>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Badge, Avatar } from '@auronui/vue'
</script>

<template>
  <Badge color="danger" size="md" variant="primary" placement="top-right">
    <Avatar name="JD" />
    <template #label>5</template>
  </Badge>
</template>`,
        language: 'vue',
      },
    },
  },
};

export const OnAvatar: Story = {
  render: (args) => ({
    components: { Badge, Avatar },
    setup: () => ({ args }),
    template: `
      <Badge v-bind="args">
        <Avatar src="https://i.pravatar.cc/150?u=alex" />
        <template #label>3</template>
      </Badge>
    `,
  }),
  args: { color: "danger", placement: "top-right" },
};

export const OnButton: Story = {
  render: (args) => ({
    components: { Badge, Button },
    setup: () => ({ args }),
    template: `
      <Badge v-bind="args">
        <Button variant="secondary">Inbox</Button>
        <template #label>12</template>
      </Badge>
    `,
  }),
  args: { color: "danger" },
};

export const Dot: Story = {
  render: (args) => ({
    components: { Badge, Avatar },
    setup: () => ({ args }),
    template: `
      <Badge v-bind="args">
        <Avatar name="ON" />
      </Badge>
    `,
  }),
  args: { size: "xs", color: "success", placement: "bottom-right" },
};

export const Sizes: Story = {
  render: (args) => ({
    components: { Badge, Avatar },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 32px; align-items: center;">
        <Badge v-bind="args" size="xs" color="success" placement="bottom-right">
          <Avatar name="X" />
        </Badge>
        <Badge v-bind="args" size="sm" color="danger">
          <Avatar name="S" />
          <template #label>2</template>
        </Badge>
        <Badge v-bind="args" size="md" color="danger">
          <Avatar name="M" />
          <template #label>5</template>
        </Badge>
        <Badge v-bind="args" size="lg" color="danger">
          <Avatar name="L" />
          <template #label>9+</template>
        </Badge>
      </div>
    `,
  }),
};

export const Colors: Story = {
  render: (args) => ({
    components: { Badge, Avatar },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 32px; align-items: center; flex-wrap: wrap;">
        <Badge v-bind="args" color="default"><Avatar name="D" /><template #label>1</template></Badge>
        <Badge v-bind="args" color="accent"><Avatar name="A" /><template #label>2</template></Badge>
        <Badge v-bind="args" color="success"><Avatar name="S" /><template #label>3</template></Badge>
        <Badge v-bind="args" color="warning"><Avatar name="W" /><template #label>4</template></Badge>
        <Badge v-bind="args" color="danger"><Avatar name="E" /><template #label>5</template></Badge>
      </div>
    `,
  }),
};

export const Variants: Story = {
  render: (args) => ({
    components: { Badge, Avatar },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 32px; align-items: center; flex-wrap: wrap;">
        <Badge v-bind="args" variant="primary" color="danger">
          <Avatar name="P" />
          <template #label>5</template>
        </Badge>
        <Badge v-bind="args" variant="secondary" color="danger">
          <Avatar name="S" />
          <template #label>5</template>
        </Badge>
        <Badge v-bind="args" variant="soft" color="danger">
          <Avatar name="So" />
          <template #label>5</template>
        </Badge>
      </div>
    `,
  }),
};

export const Placements: Story = {
  args: {
    size: "xs",
  },

  render: (args) => ({
    components: { Badge, Avatar },
    setup: () => ({ args }),
    template: `
      <div style="display: grid; grid-template-columns: repeat(4, auto); gap: 32px; align-items: center; justify-content: center;">
        <Badge v-bind="args" placement="top-left" color="danger">
          <Avatar name="TL" size="lg" />
          <template #label>1</template>
        </Badge>
        <Badge v-bind="args" placement="top-right" color="danger">
          <Avatar name="TR" size="lg" />
          <template #label>2</template>
        </Badge>
        <Badge v-bind="args" placement="bottom-left" color="danger">
          <Avatar name="BL" size="lg" />
          <template #label>3</template>
        </Badge>
        <Badge v-bind="args" placement="bottom-right" color="danger">
          <Avatar name="BR" size="lg" />
          <template #label>4</template>
        </Badge>
      </div>
    `,
  }),
};

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  render: (args) => ({
    components: { Badge, Avatar },
    setup: () => ({ args }),
    template: `
      <Badge v-bind="args" :class-names="{ anchor: 'ring-2 ring-blue-400', base: 'bg-blue-500 border-2 border-blue-700', label: 'text-white font-bold text-lg' }">
        <Avatar name="CS" />
        <template #label>7</template>
      </Badge>
    `,
  }),
  args: { color: "default", size: "md", variant: "primary", placement: "top-right" },
};
