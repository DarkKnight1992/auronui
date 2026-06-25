import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Avatar, AvatarGroup } from "@auronui/vue";

const meta: Meta<typeof AvatarGroup> = {
  component: AvatarGroup,
  title: "Components/AvatarGroup",
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    isBordered: { control: "boolean" },
    isDisabled: { control: "boolean" },
    max: { control: "number" },
  },
  args: {
    size: "md",
    isBordered: false,
    isDisabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof AvatarGroup>;

export const Default: Story = {
  render: (args) => ({
    components: { AvatarGroup, Avatar },
    setup: () => ({ args }),
    template: `
      <AvatarGroup v-bind="args" aria-label="Team members">
        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" name="Alice" />
        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026705e" name="Bob" />
        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026706f" name="Carol" />
      </AvatarGroup>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { AvatarGroup, Avatar } from '@auronui/vue'
</script>

<template>
  <AvatarGroup aria-label="Team members">
    <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" name="Alice" />
    <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026705e" name="Bob" />
    <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026706f" name="Carol" />
  </AvatarGroup>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
};

export const WithMax: Story = {
  render: (args) => ({
    components: { AvatarGroup, Avatar },
    setup: () => ({ args }),
    template: `
      <AvatarGroup v-bind="args" :max="3" aria-label="Team members (5 total, showing 3)">
        <Avatar name="Alice Bob" />
        <Avatar name="Carol Dan" />
        <Avatar name="Eve Frank" />
        <Avatar name="Grace Hopper" />
        <Avatar name="Ivan Jones" />
      </AvatarGroup>
    `,
  }),
};

export const Bordered: Story = {
  render: (args) => ({
    components: { AvatarGroup, Avatar },
    setup: () => ({ args }),
    template: `
      <AvatarGroup v-bind="args" :is-bordered="true" aria-label="Bordered team">
        <Avatar name="Alice Bob" />
        <Avatar name="Carol Dan" />
        <Avatar name="Eve Frank" />
      </AvatarGroup>
    `,
  }),
};

export const Disabled: Story = {
  render: (args) => ({
    components: { AvatarGroup, Avatar },
    setup: () => ({ args }),
    template: `
      <AvatarGroup v-bind="args" :is-disabled="true" aria-label="Disabled team">
        <Avatar name="Alice Bob" />
        <Avatar name="Carol Dan" />
        <Avatar name="Eve Frank" />
      </AvatarGroup>
    `,
  }),
};

export const Sizes: Story = {
  render: (args) => ({
    components: { AvatarGroup, Avatar },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <AvatarGroup v-bind="args" size="sm" aria-label="Small group">
          <Avatar name="Alice Bob" />
          <Avatar name="Carol Dan" />
          <Avatar name="Eve Frank" />
        </AvatarGroup>
        <AvatarGroup v-bind="args" size="md" aria-label="Medium group">
          <Avatar name="Alice Bob" />
          <Avatar name="Carol Dan" />
          <Avatar name="Eve Frank" />
        </AvatarGroup>
        <AvatarGroup v-bind="args" size="lg" aria-label="Large group">
          <Avatar name="Alice Bob" />
          <Avatar name="Carol Dan" />
          <Avatar name="Eve Frank" />
        </AvatarGroup>
      </div>
    `,
  }),
};

export const ArrayAPI: Story = {
  name: 'Array API (avatars prop)',
  render: (args) => ({
    components: { AvatarGroup },
    setup() { return { args } },
    template: `
      <AvatarGroup v-bind="args" :is-bordered="true" :max="4" :avatars="[
        { name: 'Alice Martin', src: 'https://i.pravatar.cc/150?u=alice' },
        { name: 'Bob Chen' },
        { name: 'Carol White', src: 'https://i.pravatar.cc/150?u=carol' },
        { name: 'Dave Kim', src: 'https://i.pravatar.cc/150?u=dave' },
        { name: 'Eve Torres' },
        { name: 'Frank Lee' },
      ]" />
    `,
  }),
}
