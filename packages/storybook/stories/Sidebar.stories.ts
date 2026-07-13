import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Sidebar } from "@auronui/vue";
import type { SidebarSectionData } from "@auronui/vue";

const sections: SidebarSectionData[] = [
  {
    label: "Getting Started",
    items: [
      { label: "Introduction", href: "/intro", icon: "lucide:book-open" },
      { label: "Installation", href: "/install", icon: "lucide:download" },
    ],
  },
  {
    label: "Components",
    items: [
      { label: "Button", href: "/components/button" },
      { label: "Select", href: "/components/select" },
      { label: "Table", href: "/components/table", badge: "New", badgeColor: "primary" },
      { label: "Sidebar", href: "/components/sidebar", badge: "New", badgeColor: "primary" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "GitHub", href: "https://github.com", isExternal: true, icon: "lucide:github" },
    ],
  },
];

const meta: Meta<typeof Sidebar> = {
  title: "Components/Sidebar",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: Sidebar as any,
  tags: ["autodocs"],
  argTypes: {
    search: { control: "boolean" },
    ariaLabel: { control: "text" },
  },
  args: {
    search: false,
    ariaLabel: "Docs navigation",
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  render: (args) => ({
    components: { Sidebar },
    setup() {
      return { args, sections };
    },
    template:
      '<div style="height: 480px; width: 280px;"><Sidebar v-bind="args" :sections="sections" /></div>',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Sidebar } from '@auronui/vue'
import type { SidebarSectionData } from '@auronui/vue'

const sections: SidebarSectionData[] = [
  {
    label: 'Getting Started',
    items: [
      { label: 'Introduction', href: '/intro', icon: 'lucide:book-open' },
      { label: 'Installation', href: '/install', icon: 'lucide:download' },
    ],
  },
  {
    label: 'Components',
    items: [
      { label: 'Button', href: '/components/button' },
      { label: 'Select', href: '/components/select' },
    ],
  },
]
</script>

<template>
  <Sidebar :sections="sections" ariaLabel="Docs navigation" />
</template>`,
        language: 'vue',
      },
    },
  },
};

export const WithStickySearch: Story = {
  name: "With sticky search",
  args: { search: true },
  render: (args) => ({
    components: { Sidebar },
    setup() {
      return { args, sections };
    },
    template:
      '<div style="height: 320px; width: 280px;"><Sidebar v-bind="args" :sections="sections" /></div>',
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The search box is sticky to the top of the scroll container and stays visible while scrolling through a long list of links, filtering items as you type.",
      },
    },
  },
};

export const ControlledActiveLink: Story = {
  name: "Controlled active link",
  args: { activeHref: "/components/select" },
  render: (args) => ({
    components: { Sidebar },
    setup() {
      return { args, sections };
    },
    template:
      '<div style="height: 480px; width: 280px;"><Sidebar v-bind="args" :sections="sections" /></div>',
  }),
  parameters: {
    docs: {
      description: {
        story:
          "When activeHref is set, it overrides auto-detection from window.location.pathname — useful for SSR or when the consumer already tracks the current route.",
      },
    },
  },
};

const nestedSections: SidebarSectionData[] = [
  {
    label: "Components",
    items: [
      {
        label: "Forms",
        items: [
          { label: "Input", href: "/components/input" },
          { label: "Select", href: "/components/select" },
          { label: "Checkbox", href: "/components/checkbox" },
        ],
      },
      { label: "Table", href: "/components/table" },
    ],
  },
];

export const WithNestedChildren: Story = {
  name: "With nested children",
  args: { activeHref: "/components/select" },
  render: (args) => ({
    components: { Sidebar },
    setup() {
      return { args, nestedSections };
    },
    template:
      '<div style="height: 320px; width: 280px;"><Sidebar v-bind="args" :sections="nestedSections" /></div>',
  }),
  parameters: {
    docs: {
      description: {
        story:
          "An item's items field renders its own nested sub-links, indented and always visible (no collapse/expand toggle).",
      },
    },
  },
};
