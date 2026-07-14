import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sidebar } from "@auronui/react";
import type { SidebarSectionData } from "@auronui/react";

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
    items: [{ label: "GitHub", href: "https://github.com", isExternal: true, icon: "lucide:github" }],
  },
];

const meta: Meta<typeof Sidebar> = {
  title: "Components/Sidebar",
  component: Sidebar,
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
  render: (args) => (
    <div style={{ height: 480, width: 280 }}>
      <Sidebar {...args} sections={sections} />
    </div>
  ),
};

export const WithStickySearch: Story = {
  name: "With sticky search",
  args: { search: true },
  render: (args) => (
    <div style={{ height: 320, width: 280 }}>
      <Sidebar {...args} sections={sections} />
    </div>
  ),
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
  render: (args) => (
    <div style={{ height: 480, width: 280 }}>
      <Sidebar {...args} sections={sections} />
    </div>
  ),
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
  render: (args) => (
    <div style={{ height: 320, width: 280 }}>
      <Sidebar {...args} sections={nestedSections} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "An item's items field renders its own nested, indented sub-links. In the React port, nested sub-links are always rendered (visibility toggles only — no collapse/expand affordance).",
      },
    },
  },
};
