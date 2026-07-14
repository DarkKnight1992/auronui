import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "@auronui/react";

const meta: Meta<typeof Link> = {
  title: "Components/Link",
  component: Link,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "accent", "success", "warning", "danger", "foreground"],
    },
    underline: {
      control: "select",
      options: ["none", "hover", "always", "active", "focus"],
    },
    isExternal: { control: "boolean" },
    isDisabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: { href: "https://auron.dev" },
  render: (args) => <Link {...args}>Visit Auron</Link>,
};

export const ExternalLink: Story = {
  render: (args) => (
    <Link {...args} href="https://github.com/auron-inc/auron" isExternal>
      View on GitHub
    </Link>
  ),
};

export const AllColorVariants: Story = {
  parameters: { controls: { exclude: ["color"] } },
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
      <Link {...args} href="#" color="default">Default</Link>
      <Link {...args} href="#" color="primary">Primary</Link>
      <Link {...args} href="#" color="secondary">Secondary</Link>
      <Link {...args} href="#" color="accent">Accent</Link>
      <Link {...args} href="#" color="success">Success</Link>
      <Link {...args} href="#" color="warning">Warning</Link>
      <Link {...args} href="#" color="danger">Danger</Link>
      <Link {...args} href="#" color="foreground">Foreground</Link>
    </div>
  ),
};

export const UnderlineVariants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
      <Link {...args} href="#" underline="none">No underline</Link>
      <Link {...args} href="#" underline="hover">Underline on hover</Link>
      <Link {...args} href="#" underline="always">Always underline</Link>
      <Link {...args} href="#" underline="active">Underline when active</Link>
      <Link {...args} href="#" underline="focus">Underline when focused</Link>
    </div>
  ),
};

export const PolymorphicAs: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 16 }}>
      <Link {...args} href="https://example.com">Native anchor</Link>
      <Link {...args} as="button" type="button">As button element</Link>
    </div>
  ),
};

export const DisabledLink: Story = {
  render: (args) => (
    <Link {...args} href="https://example.com" isDisabled>
      Disabled link
    </Link>
  ),
};

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Link
        {...args}
        href="https://example.com"
        classNames={{ base: "border-b-2 border-blue-500 text-blue-600 font-semibold hover:text-blue-700" }}
      >
        Custom blue border and text
      </Link>
      <Link
        {...args}
        href="https://example.com"
        isExternal
        classNames={{ base: "px-3 py-1 rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200", icon: "text-amber-700" }}
      >
        With custom icon color
      </Link>
      <Link
        {...args}
        href="https://example.com"
        classNames={{ base: "underline decoration-2 decoration-emerald-500 hover:decoration-emerald-600" }}
      >
        Custom underline decoration
      </Link>
    </div>
  ),
};
