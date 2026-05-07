import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Header } from "@auronui/vue";

const meta: Meta<typeof Header> = {
  component: Header,
  title: "Components/Header",
  tags: ["autodocs"],
  argTypes: {
    as: { control: "select", options: ["h1", "h2", "h3", "h4", "h5", "h6"] },
  },
  args: {
    as: "h2",
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  render: (args) => ({
    components: { Header },
    setup: () => ({ args }),
    template: `<Header v-bind="args">Section Heading</Header>`,
  }),
};

export const H1: Story = {
  render: (args) => ({
    components: { Header },
    setup: () => ({ args }),
    template: `<Header v-bind="args">Page Title (h1)</Header>`,
  }),
  args: { as: "h1" },
};

export const H2: Story = {
  render: (args) => ({
    components: { Header },
    setup: () => ({ args }),
    template: `<Header v-bind="args">Section Heading (h2)</Header>`,
  }),
  args: { as: "h2" },
};

export const H3: Story = {
  render: (args) => ({
    components: { Header },
    setup: () => ({ args }),
    template: `<Header v-bind="args">Subsection Heading (h3)</Header>`,
  }),
  args: { as: "h3" },
};

export const AllLevels: Story = {
  render: (args) => ({
    components: { Header },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <Header v-bind="args" as="h1">Heading Level 1</Header>
        <Header v-bind="args" as="h2">Heading Level 2</Header>
        <Header v-bind="args" as="h3">Heading Level 3</Header>
        <Header v-bind="args" as="h4">Heading Level 4</Header>
        <Header v-bind="args" as="h5">Heading Level 5</Header>
        <Header v-bind="args" as="h6">Heading Level 6</Header>
      </div>
    `,
  }),
};
