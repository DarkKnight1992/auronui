import type { Meta, StoryObj } from '@storybook/vue3'
import {
  Toolbar,
  ToolbarButton,
  ToolbarLink,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from '@auronui/vue'

const meta: Meta<typeof Toolbar> = {
  title: 'Components/Toolbar',
  component: Toolbar,
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
}
export default meta
type Story = StoryObj<typeof Toolbar>

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
  render: (args) => ({
    components: { Toolbar, ToolbarButton, ToolbarLink, ToolbarSeparator, ToolbarToggleGroup, ToolbarToggleItem },
    setup() { return { args } },
    template: `
      <Toolbar v-bind="args">
        <ToolbarButton>New</ToolbarButton>
        <ToolbarButton>Open</ToolbarButton>
        <ToolbarSeparator />
        <ToolbarToggleGroup type="multiple">
          <ToolbarToggleItem value="bold">B</ToolbarToggleItem>
          <ToolbarToggleItem value="italic">I</ToolbarToggleItem>
          <ToolbarToggleItem value="underline">U</ToolbarToggleItem>
        </ToolbarToggleGroup>
        <ToolbarSeparator />
        <ToolbarLink href="https://example.com/docs">Docs</ToolbarLink>
      </Toolbar>
    `,
  }),
}

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => ({
    components: { Toolbar, ToolbarButton },
    setup() { return { args } },
    template: `
      <Toolbar v-bind="args">
        <ToolbarButton>Up</ToolbarButton>
        <ToolbarButton>Down</ToolbarButton>
        <ToolbarButton>Delete</ToolbarButton>
      </Toolbar>
    `,
  }),
}

export const SingleSelectToggle: Story = {
  render: (args) => ({
    components: { Toolbar, ToolbarToggleGroup, ToolbarToggleItem },
    setup: () => ({ args }),
    template: `
      <Toolbar v-bind="args">
        <ToolbarToggleGroup type="single" default-value="center">
          <ToolbarToggleItem value="left">Left</ToolbarToggleItem>
          <ToolbarToggleItem value="center">Center</ToolbarToggleItem>
          <ToolbarToggleItem value="right">Right</ToolbarToggleItem>
        </ToolbarToggleGroup>
      </Toolbar>
    `,
  }),
}
