import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Button } from "@auronui/vue";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "tertiary",
        "outline",
        "ghost",
        "danger",
        "danger-soft",
        "success",
        "success-soft",
        "warning",
        "warning-soft",
      ],
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
  },
  args: {
    variant: "primary",
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

export const Default: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Click me</Button>',
  }),
};

export const AllVariants: Story = {
  args: {
    isLoading: true,
    size: "sm",
  },

  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        <Button v-bind="args" variant="primary">Primary</Button>
        <Button v-bind="args" variant="secondary">Secondary</Button>
        <Button v-bind="args" variant="tertiary">Tertiary</Button>
        <Button v-bind="args" variant="outline">Outline</Button>
        <Button v-bind="args" variant="ghost">Ghost</Button>
        <Button v-bind="args" variant="danger">Danger</Button>
        <Button v-bind="args" variant="danger-soft">Danger Soft</Button>
        <Button v-bind="args" variant="success">Success</Button>
        <Button v-bind="args" variant="success-soft">Success Soft</Button>
        <Button v-bind="args" variant="warning">Warning</Button>
        <Button v-bind="args" variant="warning-soft">Warning Soft</Button>
      </div>
    `,
  }),
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
};

export const DisabledState: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: `
      <div style="display:flex;gap:8px">
        <Button v-bind="args" :disabled="true" variant="primary">Disabled Primary</Button>
        <Button v-bind="args" :disabled="true" variant="outline">Disabled Outline</Button>
      </div>
    `,
  }),
};

export const FullWidth: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args" :fullWidth="true">Full Width Button</Button>',
  }),
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
};
