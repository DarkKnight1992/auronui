import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Meter } from "@auronui/vue";

const meta: Meta<typeof Meter> = {
  component: Meter,
  title: "Components/Meter",
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["default", "accent", "success", "warning", "danger"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    minValue: { control: { type: "number" } },
    maxValue: { control: { type: "number" } },
  },
  args: {
    value: 50,
    minValue: 0,
    maxValue: 100,
    color: "accent",
    size: "md",
  },
};

export default meta;
type Story = StoryObj<typeof Meter>;

export const Default: Story = {
  render: (args) => ({
    components: { Meter },
    setup: () => ({ args }),
    template: `<Meter v-bind="args" />`,
  }),
};

export const WithLabel: Story = {
  render: (args) => ({
    components: { Meter },
    setup: () => ({ args }),
    template: `<Meter v-bind="args" />`,
  }),
  args: {
    value: 70,
    label: "CPU Usage",
  },
};

export const WithValueLabel: Story = {
  render: (args) => ({
    components: { Meter },
    setup: () => ({ args }),
    template: `<Meter v-bind="args" />`,
  }),
  args: {
    value: 0.7,
    minValue: 0,
    maxValue: 1,
    label: "Memory",
    showValueLabel: true,
    formatOptions: { style: "percent" },
  },
};

export const Sizes: Story = {
  render: (args) => ({
    components: { Meter },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 320px;">
        <Meter v-bind="args" :value="60" size="sm" label="Small" />
        <Meter v-bind="args" :value="60" size="md" label="Medium" />
        <Meter v-bind="args" :value="60" size="lg" label="Large" />
      </div>
    `,
  }),
};

export const Colors: Story = {
  render: (args) => ({
    components: { Meter },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 320px;">
        <Meter v-bind="args" :value="60" color="default" label="Default" />
        <Meter v-bind="args" :value="60" color="accent" label="Accent" />
        <Meter v-bind="args" :value="60" color="success" label="Success" />
        <Meter v-bind="args" :value="60" color="warning" label="Warning" />
        <Meter v-bind="args" :value="60" color="danger" label="Danger" />
      </div>
    `,
  }),
};

export const CustomRange: Story = {
  render: (args) => ({
    components: { Meter },
    setup: () => ({ args }),
    template: `<Meter v-bind="args" />`,
  }),
  args: {
    value: 150,
    minValue: 0,
    maxValue: 200,
    label: "Temperature (°C)",
    showValueLabel: true,
  },
};
