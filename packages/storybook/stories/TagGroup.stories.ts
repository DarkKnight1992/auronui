import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import { TagGroup, TagGroupInput, Tag } from "@auronui/vue";

const meta: Meta = {
  title: "Components/TagGroup",
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
    setup() {
      const tags = ref<string[]>([]);
      return { args, tags };
    },
    template: `
      <TagGroup v-bind="args" v-model="tags" placeholder="Add a tag" aria-label="Tags">
      </TagGroup>
    `,
  }),
};

export const WithInitialTags: Story = {
  render: (args) => ({
    components: { TagGroup, Tag },
    setup() {
      const tags = ref(["Vue", "React", "Angular"]);
      return { args, tags };
    },
    template: `
      <TagGroup v-bind="args" v-model="tags" label="Frameworks">
        <Tag v-for="t in tags" :key="t" :value="t">{{ t }}</Tag>
      </TagGroup>
    `,
  }),
};

export const ReadOnly: Story = {
  render: (args) => ({
    components: { TagGroup, Tag },
    setup() {
      const tags = ref(["Design", "Development", "Testing"]);
      return { args, tags };
    },
    template: `
      <TagGroup v-bind="args" v-model="tags" :read-only="true" label="Skills (read-only)">
        <Tag v-for="t in tags" :key="t" :value="t">{{ t }}</Tag>
      </TagGroup>
    `,
  }),
};

export const Disabled: Story = {
  render: (args) => ({
    components: { TagGroup, Tag },
    setup() {
      const tags = ref(["Disabled", "Tags"]);
      return { args, tags };
    },
    template: `
      <TagGroup v-bind="args" v-model="tags" :is-disabled="true" label="Disabled group">
        <Tag v-for="t in tags" :key="t" :value="t">{{ t }}</Tag>
      </TagGroup>
    `,
  }),
};

export const WithMaxTags: Story = {
  render: (args) => ({
    components: { TagGroup, Tag },
    setup() {
      const tags = ref(["One", "Two"]);
      return { args, tags };
    },
    template: `
      <TagGroup v-bind="args" v-model="tags" :max-tags="3" label="Max 3 tags" description="You can add up to 3 tags.">
        <Tag v-for="t in tags" :key="t" :value="t">{{ t }}</Tag>
      </TagGroup>
    `,
  }),
};

export const AllSizes: Story = {
  render: (args) => ({
    components: { TagGroup, Tag },
    setup() {
      const sm = ref(["Small"]);
      const md = ref(["Medium"]);
      const lg = ref(["Large"]);
      return { args, sm, md, lg };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <TagGroup v-bind="args" v-model="sm" label="Small (sm)" size="sm">
          <Tag v-for="t in sm" :key="t" :value="t" size="sm">{{ t }}</Tag>
        </TagGroup>
        <TagGroup v-bind="args" v-model="md" label="Medium (md)" size="md">
          <Tag v-for="t in md" :key="t" :value="t" size="md">{{ t }}</Tag>
        </TagGroup>
        <TagGroup v-bind="args" v-model="lg" label="Large (lg)" size="lg">
          <Tag v-for="t in lg" :key="t" :value="t" size="lg">{{ t }}</Tag>
        </TagGroup>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  render: (args) => ({
    components: { TagGroup, Tag },
    setup() {
      const def = ref(["Default"]);
      const surface = ref(["Surface"]);
      return { args, def, surface };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <TagGroup v-bind="args" v-model="def" label="Default variant" variant="default">
          <Tag v-for="t in def" :key="t" :value="t" variant="default">{{ t }}</Tag>
        </TagGroup>
        <TagGroup v-bind="args" v-model="surface" label="Surface variant" variant="surface">
          <Tag v-for="t in surface" :key="t" :value="t" variant="surface">{{ t }}</Tag>
        </TagGroup>
      </div>
    `,
  }),
};

export const WithLabelDescriptionError: Story = {
  render: (args) => ({
    components: { TagGroup, Tag },
    setup() {
      const tags = ref<string[]>([]);
      return { args, tags };
    },
    template: `
      <TagGroup
        v-bind="args"
        v-model="tags"
        label="Project tags"
        description="Add relevant tags to categorise your project."
        :is-invalid="tags.length === 0"
        error-message="At least one tag is required."
        :is-required="true"
      >
        <Tag v-for="t in tags" :key="t" :value="t">{{ t }}</Tag>
      </TagGroup>
    `,
  }),
};

export const Controlled: Story = {
  render: (args) => ({
    components: { TagGroup, Tag },
    setup() {
      const tags = ref(["controlled", "v-model"]);
      return { args, tags };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <TagGroup v-bind="args" v-model="tags" label="Controlled TagGroup">
          <Tag v-for="t in tags" :key="t" :value="t">{{ t }}</Tag>
        </TagGroup>
        <p style="font-size: 12px; color: #666;">Current value: {{ tags }}</p>
      </div>
    `,
  }),
};
