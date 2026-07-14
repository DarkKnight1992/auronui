import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabList, Tab, TabPanel, TabIndicator } from "@auronui/react";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    variant: { control: "select", options: ["primary", "secondary"] },
    color: {
      control: "select",
      options: ["primary", "secondary", "accent", "success", "warning", "danger"],
      description: "Indicator color — only visible on the secondary (underline) variant.",
    },
  },
  args: {
    orientation: "horizontal",
    variant: "primary",
    color: "primary",
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Horizontal: Story = {
  args: { defaultValue: "one" },
  render: (args) => (
    <Tabs {...args}>
      <TabList>
        <Tab value="one">Overview</Tab>
        <Tab value="two">Specifications</Tab>
        <Tab value="three">Reviews</Tab>
      </TabList>
      <TabIndicator />
      <TabPanel value="one">Overview content</TabPanel>
      <TabPanel value="two">Specs content</TabPanel>
      <TabPanel value="three">Reviews content</TabPanel>
    </Tabs>
  ),
};

export const Vertical: Story = {
  args: { orientation: "vertical", defaultValue: "one" },
  render: (args) => (
    <Tabs {...args}>
      <TabList>
        <Tab value="one">Profile</Tab>
        <Tab value="two">Security</Tab>
        <Tab value="three">Billing</Tab>
      </TabList>
      <TabIndicator />
      <TabPanel value="one">Profile form</TabPanel>
      <TabPanel value="two">Security settings</TabPanel>
      <TabPanel value="three">Billing info</TabPanel>
    </Tabs>
  ),
};

export const SecondaryVariant: Story = {
  args: { variant: "secondary", defaultValue: "one" },
  render: (args) => (
    <Tabs {...args}>
      <TabList>
        <Tab value="one">Alpha</Tab>
        <Tab value="two">Beta</Tab>
      </TabList>
      <TabIndicator />
      <TabPanel value="one">Alpha panel</TabPanel>
      <TabPanel value="two">Beta panel</TabPanel>
    </Tabs>
  ),
};

export const DisabledTab: Story = {
  render: (args) => (
    <Tabs {...args} defaultValue="one">
      <TabList>
        <Tab value="one">Enabled</Tab>
        <Tab value="two" isDisabled>Disabled</Tab>
        <Tab value="three">Enabled</Tab>
      </TabList>
      <TabIndicator />
      <TabPanel value="one">One</TabPanel>
      <TabPanel value="two">Two</TabPanel>
      <TabPanel value="three">Three</TabPanel>
    </Tabs>
  ),
};

export const ArrayAPI: Story = {
  name: "Array API (items prop)",
  render: (args) => (
    <Tabs
      {...args}
      items={[
        { value: "overview", label: "Overview", content: "High-level product summary and key benefits." },
        { value: "specs", label: "Specifications", content: "Technical details, dimensions, and compatibility." },
        { value: "reviews", label: "Reviews", content: "Customer ratings and written feedback." },
        { value: "support", label: "Support", content: "FAQs, documentation links, and contact options.", disabled: true },
      ]}
    />
  ),
};
