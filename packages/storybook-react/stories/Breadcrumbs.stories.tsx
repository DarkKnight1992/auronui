import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumbs, BreadcrumbItem } from "@auronui/react";

const meta: Meta<typeof Breadcrumbs> = {
  title: "Components/Breadcrumbs",
  tags: ["autodocs"],
  component: Breadcrumbs,
};
export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  render: (args) => (
    <Breadcrumbs {...args}>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/products">Products</BreadcrumbItem>
      <BreadcrumbItem href="/products/shoes">Shoes</BreadcrumbItem>
      <BreadcrumbItem>Sneakers</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const Truncated: Story = {
  render: (args) => (
    <Breadcrumbs {...args} maxItems={3} items={[
      { label: "Home", href: "/" },
      { label: "Category", href: "/a" },
      { label: "Subcategory", href: "/a/b" },
      { label: "Item", href: "/a/b/c" },
      { label: "Detail" },
    ]} />
  ),
};

export const CustomSeparator: Story = {
  render: (args) => (
    <Breadcrumbs {...args} separator="›">
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
      <BreadcrumbItem>Guide</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  render: (args) => (
    <Breadcrumbs
      {...args}
      classNames={{
        base: "gap-4 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200",
        item: "font-medium",
      }}
    >
      <BreadcrumbItem href="/" classNames={{ link: "text-blue-600 hover:text-blue-800 font-semibold", separator: "text-blue-400" }}>
        Home
      </BreadcrumbItem>
      <BreadcrumbItem href="/products" classNames={{ link: "text-blue-600 hover:text-blue-800 font-semibold", separator: "text-blue-400" }}>
        Products
      </BreadcrumbItem>
      <BreadcrumbItem href="/products/shoes" classNames={{ link: "text-blue-600 hover:text-blue-800 font-semibold", separator: "text-blue-400" }}>
        Shoes
      </BreadcrumbItem>
      <BreadcrumbItem classNames={{ link: "text-indigo-700 font-bold" }}>Sneakers</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const ArrayAPI: Story = {
  name: "Array API (items prop)",
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Breadcrumbs {...args} items={[
        { label: "Home", href: "/" },
        { label: "Components", href: "/components" },
        { label: "Breadcrumbs" },
      ]} />
      <Breadcrumbs {...args} maxItems={3} items={[
        { label: "Home", href: "/" },
        { label: "Docs", href: "/docs" },
        { label: "Components", href: "/components" },
        { label: "Navigation", href: "/components/navigation" },
        { label: "Breadcrumbs" },
      ]} />
    </div>
  ),
};
