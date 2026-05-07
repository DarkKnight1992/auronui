import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Skeleton } from "@auronui/vue";

const meta: Meta<typeof Skeleton> = {
  component: Skeleton,
  title: "Components/Skeleton",
  tags: ["autodocs"],
  argTypes: {
    animationType: { control: "select", options: ["shimmer", "pulse", "none"] },
  },
  args: {
    animationType: "shimmer",
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  render: (args) => ({
    components: { Skeleton },
    setup: () => ({ args }),
    template: `<Skeleton v-bind="args" style="width: 200px; height: 16px; border-radius: 4px;" />`,
  }),
};

export const Shimmer: Story = {
  render: (args) => ({
    components: { Skeleton },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <Skeleton v-bind="args" style="width: 300px; height: 16px; border-radius: 4px;" />
        <Skeleton v-bind="args" style="width: 240px; height: 16px; border-radius: 4px;" />
        <Skeleton v-bind="args" style="width: 180px; height: 16px; border-radius: 4px;" />
      </div>
    `,
  }),
  args: { animationType: "shimmer" },
};

export const Pulse: Story = {
  render: (args) => ({
    components: { Skeleton },
    setup: () => ({ args }),
    template: `<Skeleton v-bind="args" style="width: 200px; height: 100px; border-radius: 8px;" />`,
  }),
  args: { animationType: "pulse" },
};

export const NoAnimation: Story = {
  render: (args) => ({
    components: { Skeleton },
    setup: () => ({ args }),
    template: `<Skeleton v-bind="args" style="width: 200px; height: 16px; border-radius: 4px;" />`,
  }),
  args: { animationType: "none" },
};

export const Card: Story = {
  render: (args) => ({
    components: { Skeleton },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 300px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <Skeleton v-bind="args" style="width: 100%; height: 160px; border-radius: 6px;" />
        <Skeleton v-bind="args" style="width: 80%; height: 16px; border-radius: 4px;" />
        <Skeleton v-bind="args" style="width: 60%; height: 14px; border-radius: 4px;" />
      </div>
    `,
  }),
  args: { animationType: "shimmer" },
};
