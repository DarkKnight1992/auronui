import type { Meta, StoryObj } from "@storybook/react-vite";
import { Collapsible, CollapsibleTrigger, CollapsibleContent, CollapsibleGroup } from "@auronui/react";

const meta: Meta<typeof Collapsible> = {
  title: "Components/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Standalone: Story = {
  render: (args) => (
    <Collapsible {...args} defaultOpen>
      <CollapsibleTrigger>Show more</CollapsibleTrigger>
      <CollapsibleContent>Extra detail revealed inside the collapsible.</CollapsibleContent>
    </Collapsible>
  ),
};

export const GroupMultiOpen: Story = {
  name: "Group: Multiple Open",
  render: () => (
    <CollapsibleGroup>
      <Collapsible>
        <CollapsibleTrigger>Shipping</CollapsibleTrigger>
        <CollapsibleContent>Free over $50</CollapsibleContent>
      </Collapsible>
      <Collapsible>
        <CollapsibleTrigger>Returns</CollapsibleTrigger>
        <CollapsibleContent>30-day window</CollapsibleContent>
      </Collapsible>
      <Collapsible>
        <CollapsibleTrigger>Warranty</CollapsibleTrigger>
        <CollapsibleContent>2-year limited</CollapsibleContent>
      </Collapsible>
    </CollapsibleGroup>
  ),
};

export const GroupSingleOpen: Story = {
  name: "Group: Single Open",
  render: () => (
    <CollapsibleGroup singleOpen>
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Section A</CollapsibleTrigger>
        <CollapsibleContent>Content A</CollapsibleContent>
      </Collapsible>
      <Collapsible>
        <CollapsibleTrigger>Section B</CollapsibleTrigger>
        <CollapsibleContent>Content B</CollapsibleContent>
      </Collapsible>
      <Collapsible>
        <CollapsibleTrigger>Section C</CollapsibleTrigger>
        <CollapsibleContent>Content C</CollapsibleContent>
      </Collapsible>
    </CollapsibleGroup>
  ),
};

export const GroupArrayAPI: Story = {
  name: "Group: Array API (items prop)",
  render: () => (
    <CollapsibleGroup
      singleOpen
      items={[
        { title: "Getting Started", content: "Install with pnpm add @auronui/react", defaultOpen: true },
        { title: "Configuration", content: "Import components directly from @auronui/react." },
        { title: "Theming", content: "Override CSS custom properties to match your brand." },
        { title: "Advanced Usage", content: "Use the classNames prop for per-slot style overrides.", disabled: true },
      ]}
    />
  ),
};
