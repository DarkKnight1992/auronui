import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from "@auronui/react";

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  argTypes: {
    type: { control: "select", options: ["single", "multiple"] },
    variant: { control: "select", options: ["default", "surface"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
  args: {
    type: "single",
    collapsible: true,
    variant: "default",
    size: "md",
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: { defaultValue: "faq-1" },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="faq-1">
        <AccordionHeader>
          <AccordionTrigger>What is Auron?</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>A React component library with full HeroUI visual parity.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="faq-2">
        <AccordionHeader>
          <AccordionTrigger>What primitives does it use?</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Radix UI primitives + react-aria-components, depending on the component.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="faq-3">
        <AccordionHeader>
          <AccordionTrigger>Is it MIT licensed?</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Yes — MIT, clean-room implementation.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  args: { type: "multiple", defaultValue: ["a", "b"] },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="a">
        <AccordionHeader>
          <AccordionTrigger>Alpha</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Alpha content</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionHeader>
          <AccordionTrigger>Beta</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Beta content</AccordionContent>
      </AccordionItem>
      <AccordionItem value="c">
        <AccordionHeader>
          <AccordionTrigger>Gamma</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Gamma content</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const SurfaceVariant: Story = {
  args: { variant: "surface", defaultValue: "one" },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="one">
        <AccordionHeader>
          <AccordionTrigger>Surface one</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Surface content one</AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionHeader>
          <AccordionTrigger>Surface two</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Surface content two</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const WithDisabledItem: Story = {
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="enabled">
        <AccordionHeader>
          <AccordionTrigger>Enabled</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>You can toggle me.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="disabled" isDisabled>
        <AccordionHeader>
          <AccordionTrigger>Disabled</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>I am locked.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const ArrayAPI: Story = {
  name: "Array API (items prop)",
  render: (args) => (
    <Accordion
      {...args}
      items={[
        { value: "q1", title: "What is Auron?", content: "A React component library with full HeroUI visual parity." },
        { value: "q2", title: "What primitives does it use?", content: "Radix UI + react-aria-components." },
        { value: "q3", title: "Is it MIT licensed?", content: "Yes — MIT, clean-room implementation." },
        { value: "q4", title: "Does it support dark mode?", content: "Yes, via CSS custom properties.", disabled: true },
      ]}
    />
  ),
};
