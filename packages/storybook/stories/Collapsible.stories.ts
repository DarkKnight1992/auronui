import type { Meta, StoryObj } from '@storybook/vue3'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  CollapsibleGroup,
} from '@auronui/vue'

const meta: Meta<typeof Collapsible> = {
  title: 'Components/Collapsible',
  component: Collapsible,
}
export default meta
type Story = StoryObj<typeof Collapsible>

export const Standalone: Story = {
  render: (args) => ({
    components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
    setup: () => ({ args }),
    template: `
      <Collapsible v-bind="args" :default-open="true">
        <CollapsibleTrigger>Show more</CollapsibleTrigger>
        <CollapsibleContent>Extra detail revealed inside the collapsible.</CollapsibleContent>
      </Collapsible>
    `,
  }),
}

export const GroupMultiOpen: Story = {
  render: (args) => ({
    components: { CollapsibleGroup, Collapsible, CollapsibleTrigger, CollapsibleContent },
    setup: () => ({ args }),
    template: `
      <CollapsibleGroup>
        <Collapsible v-bind="args">
          <CollapsibleTrigger>Shipping</CollapsibleTrigger>
          <CollapsibleContent>Free over $50</CollapsibleContent>
        </Collapsible>
        <Collapsible v-bind="args">
          <CollapsibleTrigger>Returns</CollapsibleTrigger>
          <CollapsibleContent>30-day window</CollapsibleContent>
        </Collapsible>
        <Collapsible v-bind="args">
          <CollapsibleTrigger>Warranty</CollapsibleTrigger>
          <CollapsibleContent>2-year limited</CollapsibleContent>
        </Collapsible>
      </CollapsibleGroup>
    `,
  }),
}

export const GroupSingleOpen: Story = {
  render: (args) => ({
    components: { CollapsibleGroup, Collapsible, CollapsibleTrigger, CollapsibleContent },
    setup: () => ({ args }),
    template: `
      <CollapsibleGroup :single-open="true">
        <Collapsible v-bind="args" :default-open="true">
          <CollapsibleTrigger>Section A</CollapsibleTrigger>
          <CollapsibleContent>Content A</CollapsibleContent>
        </Collapsible>
        <Collapsible v-bind="args">
          <CollapsibleTrigger>Section B</CollapsibleTrigger>
          <CollapsibleContent>Content B</CollapsibleContent>
        </Collapsible>
        <Collapsible v-bind="args">
          <CollapsibleTrigger>Section C</CollapsibleTrigger>
          <CollapsibleContent>Content C</CollapsibleContent>
        </Collapsible>
      </CollapsibleGroup>
    `,
  }),
}
