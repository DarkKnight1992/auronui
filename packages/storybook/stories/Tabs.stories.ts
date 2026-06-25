import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Tabs, TabList, Tab, TabPanel, TabIndicator } from '@auronui/vue'

// overflow belongs to TabList, not Tabs — extend the arg type to include it
type TabsArgs = InstanceType<typeof Tabs>['$props'] & { overflow?: 'arrows' | 'dropdown' }

const meta: Meta<TabsArgs> = {
  title: 'Components/Tabs',
  tags: ['autodocs'],
  component: Tabs,
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant: { control: 'select', options: ['primary', 'secondary'] },
    overflow: { control: 'select', options: [undefined, 'arrows', 'dropdown'], name: 'overflow (TabList)' },
    classNames: { control: 'object', description: 'Per-slot class overrides. Keys match the component anatomy slot names.' },
  },
}
export default meta
type Story = StoryObj<TabsArgs>

export const Horizontal: Story = {
  args: { orientation: 'horizontal', variant: 'primary', defaultValue: 'one' },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Tabs, TabList, Tab, TabPanel, TabIndicator } from '@auronui/vue'
</script>

<template>
  <Tabs orientation="horizontal" variant="primary" default-value="one">
    <TabList>
      <Tab value="one">Overview</Tab>
      <Tab value="two">Specifications</Tab>
      <Tab value="three">Reviews</Tab>
      <TabIndicator />
    </TabList>
    <TabPanel value="one">Overview content</TabPanel>
    <TabPanel value="two">Specs content</TabPanel>
    <TabPanel value="three">Reviews content</TabPanel>
  </Tabs>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Tabs, TabList, Tab, TabPanel, TabIndicator },
    setup() { return { args } },
    template: `
      <Tabs v-bind="args">
        <TabList>
          <Tab value="one">Overview</Tab>
          <Tab value="two">Specifications</Tab>
          <Tab value="three">Reviews</Tab>
          <TabIndicator />
        </TabList>
        <TabPanel value="one">Overview content</TabPanel>
        <TabPanel value="two">Specs content</TabPanel>
        <TabPanel value="three">Reviews content</TabPanel>
      </Tabs>
    `,
  }),
}

export const Vertical: Story = {
  args: { orientation: 'vertical', defaultValue: 'one' },
  render: (args) => ({
    components: { Tabs, TabList, Tab, TabPanel, TabIndicator },
    setup() { return { args } },
    template: `
      <Tabs v-bind="args">
        <TabList>
          <Tab value="one">Profile</Tab>
          <Tab value="two">Security</Tab>
          <Tab value="three">Billing</Tab>
          <TabIndicator />
        </TabList>
        <TabPanel value="one">Profile form</TabPanel>
        <TabPanel value="two">Security settings</TabPanel>
        <TabPanel value="three">Billing info</TabPanel>
      </Tabs>
    `,
  }),
}

export const SecondaryVariant: Story = {
  args: { variant: 'secondary', defaultValue: 'one' },
  render: (args) => ({
    components: { Tabs, TabList, Tab, TabPanel, TabIndicator },
    setup() { return { args } },
    template: `
      <Tabs v-bind="args">
        <TabList>
          <Tab value="one">Alpha</Tab>
          <Tab value="two">Beta</Tab>
          <TabIndicator />
        </TabList>
        <TabPanel value="one">Alpha panel</TabPanel>
        <TabPanel value="two">Beta panel</TabPanel>
      </Tabs>
    `,
  }),
}

export const DisabledTab: Story = {
  render: (args) => ({
    components: { Tabs, TabList, Tab, TabPanel, TabIndicator },
    setup: () => ({ args }),
    template: `
      <Tabs v-bind="args" default-value="one">
        <TabList>
          <Tab value="one">Enabled</Tab>
          <Tab value="two" disabled>Disabled</Tab>
          <Tab value="three">Enabled</Tab>
          <TabIndicator />
        </TabList>
        <TabPanel value="one">One</TabPanel>
        <TabPanel value="two">Two</TabPanel>
        <TabPanel value="three">Three</TabPanel>
      </Tabs>
    `,
  }),
}

export const Controlled: Story = {
  render: (args) => ({
    components: { Tabs, TabList, Tab, TabPanel, TabIndicator },
    setup: () => ({ args }),
    data() { return { selected: 'one' } },
    template: `
      <div>
        <p>Selected: {{ selected }}</p>
        <Tabs v-bind="args" v-model="selected">
          <TabList>
            <Tab value="one">One</Tab>
            <Tab value="two">Two</Tab>
            <TabIndicator />
          </TabList>
          <TabPanel value="one">One</TabPanel>
          <TabPanel value="two">Two</TabPanel>
        </Tabs>
      </div>
    `,
  }),
}

export const ArrowOverflow: Story = {
  name: 'Overflow — Arrows',
  args: { defaultValue: 'one', variant: 'primary', overflow: 'arrows' },
  parameters: {
    docs: {
      description: {
        story: 'When `overflow="arrows"` is set on `TabList`, left/right arrow buttons appear as tabs overflow the container width.',
      },
    },
  },
  render: (args) => ({
    components: { Tabs, TabList, Tab, TabPanel, TabIndicator },
    setup() { return { args } },
    template: `
      <div style="width: 400px; border: 1px dashed #ccc; padding: 8px; border-radius: 8px;">
        <Tabs :default-value="args.defaultValue" :variant="args.variant" :orientation="args.orientation">
          <TabList :overflow="args.overflow">
            <Tab value="one">Overview</Tab>
            <Tab value="two">Specifications</Tab>
            <Tab value="three">Reviews</Tab>
            <Tab value="four">Questions</Tab>
            <Tab value="five">Shipping</Tab>
            <Tab value="six">Returns</Tab>
            <Tab value="seven">Warranty</Tab>
            <TabIndicator />
          </TabList>
          <TabPanel value="one">Overview content</TabPanel>
          <TabPanel value="two">Specifications content</TabPanel>
          <TabPanel value="three">Reviews content</TabPanel>
          <TabPanel value="four">Questions content</TabPanel>
          <TabPanel value="five">Shipping content</TabPanel>
          <TabPanel value="six">Returns content</TabPanel>
          <TabPanel value="seven">Warranty content</TabPanel>
        </Tabs>
      </div>
    `,
  }),
}

export const DropdownOverflow: Story = {
  name: 'Overflow — Dropdown',
  args: { defaultValue: 'one', variant: 'primary', overflow: 'dropdown' },
  parameters: {
    docs: {
      description: {
        story: 'When `overflow="dropdown"` is set on `TabList`, tabs that don\'t fit collapse into a "+N" dropdown button.',
      },
    },
  },
  render: (args) => ({
    components: { Tabs, TabList, Tab, TabPanel, TabIndicator },
    setup() { return { args } },
    template: `
      <div style="width: 390px; border: 1px dashed #ccc; padding: 8px; border-radius: 8px;">
        <Tabs :default-value="args.defaultValue" :variant="args.variant" :orientation="args.orientation">
          <TabList :overflow="args.overflow">
            <Tab value="one">Overview</Tab>
            <Tab value="two">Specifications</Tab>
            <Tab value="three">Reviews</Tab>
            <Tab value="four">Questions</Tab>
            <Tab value="five">Shipping</Tab>
            <Tab value="six">Returns</Tab>
            <Tab value="seven">Warranty</Tab>
            <TabIndicator />
          </TabList>
          <TabPanel value="one">Overview content</TabPanel>
          <TabPanel value="two">Specifications content</TabPanel>
          <TabPanel value="three">Reviews content</TabPanel>
          <TabPanel value="four">Questions content</TabPanel>
          <TabPanel value="five">Shipping content</TabPanel>
          <TabPanel value="six">Returns content</TabPanel>
          <TabPanel value="seven">Warranty content</TabPanel>
        </Tabs>
      </div>
    `,
  }),
}

export const CustomStyles: Story = {
  name: 'Custom styles via classNames',
  args: {
    defaultValue: 'one',
    variant: 'primary',
    classNames: {
      tabList: 'border-b-2 border-blue-500',
    },
  },
  render: (args) => ({
    components: { Tabs, TabList, Tab, TabPanel, TabIndicator },
    setup() { return { args } },
    template: `
      <Tabs v-bind="args">
        <TabList :class-names="args.classNames">
          <Tab value="one" :class-names="{ tab: 'text-blue-600 hover:bg-blue-50' }">Styled Tab 1</Tab>
          <Tab value="two" :class-names="{ tab: 'text-blue-600 hover:bg-blue-50' }">Styled Tab 2</Tab>
          <Tab value="three" :class-names="{ tab: 'text-blue-600 hover:bg-blue-50' }">Styled Tab 3</Tab>
          <TabIndicator />
        </TabList>
        <TabPanel value="one" :class-names="{ tabPanel: 'bg-blue-50 p-4 rounded-lg' }">Custom styled content panel 1</TabPanel>
        <TabPanel value="two" :class-names="{ tabPanel: 'bg-blue-50 p-4 rounded-lg' }">Custom styled content panel 2</TabPanel>
        <TabPanel value="three" :class-names="{ tabPanel: 'bg-blue-50 p-4 rounded-lg' }">Custom styled content panel 3</TabPanel>
      </Tabs>
    `,
  }),
}

export const ArrayAPI: Story = {
  name: 'Array API (items prop)',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Tabs } from '@auronui/vue'
</script>

<template>
  <Tabs
    :items="[
      { value: 'overview', label: 'Overview', content: 'High-level product summary and key benefits.' },
      { value: 'specs', label: 'Specifications', content: 'Technical details, dimensions, and compatibility.' },
      { value: 'reviews', label: 'Reviews', content: 'Customer ratings and written feedback.' },
      { value: 'support', label: 'Support', content: 'FAQs, documentation links, and contact options.', disabled: true },
    ]"
  />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Tabs },
    setup() { return { args } },
    template: `
      <Tabs v-bind="args" :items="[
        { value: 'overview', label: 'Overview', content: 'High-level product summary and key benefits.' },
        { value: 'specs', label: 'Specifications', content: 'Technical details, dimensions, and compatibility.' },
        { value: 'reviews', label: 'Reviews', content: 'Customer ratings and written feedback.' },
        { value: 'support', label: 'Support', content: 'FAQs, documentation links, and contact options.', disabled: true },
      ]" />
    `,
  }),
}
