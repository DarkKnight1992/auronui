import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Tag, TagDelete, TagGroup } from "@auronui/vue";

const meta: Meta = {
  title: "Components/Tag",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "surface"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => ({
    components: { TagGroup, Tag },
    setup: () => ({ args }),
    template: `
      <TagGroup :model-value="['hello']" aria-label="example">
        <Tag v-bind="args" value="hello">hello</Tag>
      </TagGroup>
    `,
  }),
};

export const AllVariants: Story = {
  render: (args) => ({
    components: { TagGroup, Tag },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <TagGroup :model-value="['default']" aria-label="default variant">
          <Tag v-bind="args" value="default" variant="default">default</Tag>
        </TagGroup>
        <TagGroup :model-value="['surface']" aria-label="surface variant">
          <Tag v-bind="args" value="surface" variant="surface">surface</Tag>
        </TagGroup>
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: (args) => ({
    components: { TagGroup, Tag },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <TagGroup :model-value="['sm']" aria-label="small">
          <Tag v-bind="args" value="sm" size="sm">Small</Tag>
        </TagGroup>
        <TagGroup :model-value="['md']" aria-label="medium">
          <Tag v-bind="args" value="md" size="md">Medium</Tag>
        </TagGroup>
        <TagGroup :model-value="['lg']" aria-label="large">
          <Tag v-bind="args" value="lg" size="lg">Large</Tag>
        </TagGroup>
      </div>
    `,
  }),
};

export const NonRemovable: Story = {
  render: (args) => ({
    components: { TagGroup, Tag },
    setup: () => ({ args }),
    template: `
      <TagGroup :model-value="['read-only']" :read-only="true" aria-label="non-removable">
        <Tag v-bind="args" value="read-only" :is-read-only="true">Non-removable</Tag>
      </TagGroup>
    `,
  }),
};
