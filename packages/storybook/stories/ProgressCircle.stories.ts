import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ProgressCircle } from "@auronui/vue";

const meta: Meta<typeof ProgressCircle> = {
  component: ProgressCircle,
  title: "Components/ProgressCircle",
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "success", "warning", "danger"],
    },
    strokeWidth: { control: "number" },
    classNames: { control: "object", description: "Per-slot class overrides. Keys match the component anatomy slot names." },
  },
  args: {
    value: 75,
    maxValue: 100,
    size: "md",
    color: "primary",
    strokeWidth: 3,
  },
};

export default meta;
type Story = StoryObj<typeof ProgressCircle>;

export const Default: Story = {
  render: (args) => ({
    components: { ProgressCircle },
    setup: () => ({ args }),
    template: `<ProgressCircle v-bind="args" />`,
  }),
};

export const Determinate: Story = {
  render: (args) => ({
    components: { ProgressCircle },
    setup: () => ({ args }),
    template: `<ProgressCircle v-bind="args" />`,
  }),
  args: { value: 75, label: "Upload progress", showValueLabel: true },
};

export const Indeterminate: Story = {
  render: (args) => ({
    components: { ProgressCircle },
    setup: () => ({ args }),
    template: `<ProgressCircle v-bind="args" />`,
  }),
  args: { value: null, label: "Loading" },
};

export const Sizes: Story = {
  render: (args) => ({
    components: { ProgressCircle },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <ProgressCircle v-bind="args" value="60" size="sm" label="Small" />
        <ProgressCircle v-bind="args" value="60" size="md" label="Medium" />
        <ProgressCircle v-bind="args" value="60" size="lg" label="Large" />
      </div>
    `,
  }),
};

export const Colors: Story = {
  render: (args) => ({
    components: { ProgressCircle },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
        <ProgressCircle v-bind="args" value="60" color="default" label="Default" />
        <ProgressCircle v-bind="args" value="60" color="primary" label="Primary" />
        <ProgressCircle v-bind="args" value="60" color="secondary" label="Secondary" />
        <ProgressCircle v-bind="args" value="60" color="success" label="Success" />
        <ProgressCircle v-bind="args" value="60" color="warning" label="Warning" />
        <ProgressCircle v-bind="args" value="60" color="danger" label="Danger" />
      </div>
    `,
  }),
};

export const WithValueLabel: Story = {
  render: (args) => ({
    components: { ProgressCircle },
    setup: () => ({ args }),
    template: `<ProgressCircle v-bind="args" />`,
  }),
  args: { value: 75, showValueLabel: true, label: "Progress" },
};

export const CustomStrokeWidth: Story = {
  render: (args) => ({
    components: { ProgressCircle },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <ProgressCircle v-bind="args" value="60" :stroke-width="1" label="Thin (1)" />
        <ProgressCircle v-bind="args" value="60" :stroke-width="3" label="Default (3)" />
        <ProgressCircle v-bind="args" value="60" :stroke-width="5" label="Thick (5)" />
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: (args) => ({
    components: { ProgressCircle },
    setup: () => ({ args }),
    template: `<ProgressCircle v-bind="args" />`,
  }),
  args: { value: 50, isDisabled: true, label: "Disabled" },
};

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  render: (args) => ({
    components: { ProgressCircle },
    setup: () => ({ args }),
    template: `<ProgressCircle v-bind="args" />`,
  }),
  args: {
    value: 65,
    label: "Custom styled",
    showValueLabel: true,
    classNames: {
      svg: "drop-shadow-lg",
      track: "stroke-blue-200",
      indicator: "stroke-blue-600",
      value: "text-blue-700 font-bold text-sm",
    },
  },
};
