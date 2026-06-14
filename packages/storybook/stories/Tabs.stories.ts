import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Tabs, TabList, Tab, TabPanel, TabIndicator } from '@auronui/vue'

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant: { control: 'select', options: ['primary', 'secondary'] },
    // TabList prop — not on Tabs itself, exposed here so the overflow stories show a control
    overflow: { control: 'select', options: [undefined, 'arrows', 'dropdown'], name: 'overflow (TabList)' },
  },
}
export default meta
type Story = StoryObj<typeof Tabs>

export const Horizontal: Story = {
  args: { orientation: 'horizontal', variant: 'primary', defaultValue: 'one' },
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
