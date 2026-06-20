import type { Meta, StoryObj } from '@storybook/vue3-vite'
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from '@auronui/vue'

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  argTypes: {
    type: { control: 'select', options: ['single', 'multiple'] },
    variant: { control: 'select', options: ['default', 'surface'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    classNames: { control: 'object', description: 'Per-slot class overrides. Keys match the component anatomy slot names.' },
  },
}
export default meta
type Story = StoryObj<typeof Accordion>

export const Single: Story = {
  args: { type: 'single', collapsible: true, defaultValue: 'faq-1' },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent } from '@auronui/vue'
</script>

<template>
  <Accordion type="single" :collapsible="true" default-value="faq-1">
    <AccordionItem value="faq-1">
      <AccordionHeader><AccordionTrigger>What is Auron?</AccordionTrigger></AccordionHeader>
      <AccordionContent>A Vue 3 designed component library.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="faq-2">
      <AccordionHeader><AccordionTrigger>What is Reka UI?</AccordionTrigger></AccordionHeader>
      <AccordionContent>Reka UI is Radix UI for Vue — accessibility primitives used by Auron.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="faq-3">
      <AccordionHeader><AccordionTrigger>Is it MIT licensed?</AccordionTrigger></AccordionHeader>
      <AccordionContent>Yes — MIT, clean-room</AccordionContent>
    </AccordionItem>
  </Accordion>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent },
    setup() { return { args } },
    template: `
      <Accordion v-bind="args">
        <AccordionItem value="faq-1">
          <AccordionHeader><AccordionTrigger>What is Auron?</AccordionTrigger></AccordionHeader>
          <AccordionContent>A Vue 3 designed component library.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-2">
          <AccordionHeader><AccordionTrigger>What is Reka UI?</AccordionTrigger></AccordionHeader>
          <AccordionContent>Reka UI is Radix UI for Vue — accessibility primitives used by Auron.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-3">
          <AccordionHeader><AccordionTrigger>Is it MIT licensed?</AccordionTrigger></AccordionHeader>
          <AccordionContent>Yes — MIT, clean-room</AccordionContent>
        </AccordionItem>
      </Accordion>
    `,
  }),
}

export const Multiple: Story = {
  args: { type: 'multiple', defaultValue: ['a', 'b'] },
  render: (args) => ({
    components: { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent },
    setup() { return { args } },
    template: `
      <Accordion v-bind="args">
        <AccordionItem value="a">
          <AccordionHeader><AccordionTrigger>Alpha</AccordionTrigger></AccordionHeader>
          <AccordionContent>Alpha content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionHeader><AccordionTrigger>Beta</AccordionTrigger></AccordionHeader>
          <AccordionContent>Beta content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="c">
          <AccordionHeader><AccordionTrigger>Gamma</AccordionTrigger></AccordionHeader>
          <AccordionContent>Gamma content</AccordionContent>
        </AccordionItem>
      </Accordion>
    `,
  }),
}

export const SurfaceVariant: Story = {
  args: { type: 'single', variant: 'surface' },
  render: (args) => ({
    components: { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent },
    setup() { return { args } },
    template: `
      <Accordion v-bind="args">
        <AccordionItem value="one">
          <AccordionHeader><AccordionTrigger>Surface one</AccordionTrigger></AccordionHeader>
          <AccordionContent>Surface content one</AccordionContent>
        </AccordionItem>
        <AccordionItem value="two">
          <AccordionHeader><AccordionTrigger>Surface two</AccordionTrigger></AccordionHeader>
          <AccordionContent>Surface content two</AccordionContent>
        </AccordionItem>
      </Accordion>
    `,
  }),
}

export const Compact: Story = {
  args: { type: 'single', collapsible: true, size: 'sm', defaultValue: 'faq-1' },
  render: (args) => ({
    components: { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent },
    setup() { return { args } },
    template: `
      <Accordion v-bind="args">
        <AccordionItem value="faq-1">
          <AccordionHeader><AccordionTrigger>Compact one</AccordionTrigger></AccordionHeader>
          <AccordionContent>Compact spacing for dense layouts.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-2">
          <AccordionHeader><AccordionTrigger>Compact two</AccordionTrigger></AccordionHeader>
          <AccordionContent>Same styling, tighter paddings and smaller text.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-3">
          <AccordionHeader><AccordionTrigger>Compact three</AccordionTrigger></AccordionHeader>
          <AccordionContent>Use size="sm" for sidebars and settings panes.</AccordionContent>
        </AccordionItem>
      </Accordion>
    `,
  }),
}

export const CustomIndicator: Story = {
  args: { type: 'single', collapsible: true, defaultValue: 'a' },
  render: (args) => ({
    components: { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent },
    setup() { return { args } },
    template: `
      <Accordion v-bind="args">
        <AccordionItem value="a">
          <AccordionHeader>
            <AccordionTrigger>
              <span>Plus / minus indicator</span>
              <template #indicator="{ open }">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="100%" height="100%">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <line v-if="!open" x1="12" y1="5" x2="12" y2="19"/>
                </svg>
              </template>
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>Uses the \`open\` slot prop to switch between plus and minus icons instead of rotating a chevron.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionHeader>
            <AccordionTrigger>
              <span>Arrow indicator</span>
              <template #indicator>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="100%" height="100%">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </template>
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>An arrow that inherits the same rotate-on-open animation as the default chevron — just replace the icon contents.</AccordionContent>
        </AccordionItem>
      </Accordion>
    `,
  }),
}

export const WithDisabledItem: Story = {
  render: (args) => ({
    components: { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent },
    setup: () => ({ args }),
    template: `
      <Accordion v-bind="args" type="single" collapsible>
        <AccordionItem value="enabled">
          <AccordionHeader><AccordionTrigger>Enabled</AccordionTrigger></AccordionHeader>
          <AccordionContent>You can toggle me.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="disabled" disabled>
          <AccordionHeader><AccordionTrigger>Disabled</AccordionTrigger></AccordionHeader>
          <AccordionContent>I am locked.</AccordionContent>
        </AccordionItem>
      </Accordion>
    `,
  }),
}

export const CustomStyles: Story = {
  name: 'Custom styles via classNames',
  args: { type: 'single', collapsible: true, defaultValue: 'item-1' },
  render: (args) => ({
    components: { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent },
    setup() { return { args } },
    template: `
      <Accordion v-bind="args" :class-names="{ base: 'border-2 border-blue-500 rounded-lg overflow-hidden' }">
        <AccordionItem value="item-1" :class-names="{ item: 'border-b-2 border-blue-200' }">
          <AccordionHeader>
            <AccordionTrigger :class-names="{ trigger: 'bg-blue-50 hover:bg-blue-100', indicator: 'text-blue-600' }">
              Styled trigger with custom colors
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent :class-names="{ body: 'bg-blue-50', bodyInner: 'text-blue-900' }">
            This accordion uses custom Tailwind classes to style the base container with a blue border, triggers with blue background, and content with blue tinting.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" :class-names="{ item: 'border-b-2 border-blue-200' }">
          <AccordionHeader>
            <AccordionTrigger :class-names="{ trigger: 'bg-blue-50 hover:bg-blue-100', indicator: 'text-blue-600' }">
              Another styled item
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent :class-names="{ body: 'bg-blue-50', bodyInner: 'text-blue-900' }">
            All slots support the classNames prop for fine-grained styling without CSS files.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    `,
  }),
}
