import type { Meta, StoryObj } from "@storybook/react-vite";
import { Timeline, TimelineItem } from "@auronui/react";

const meta: Meta<typeof Timeline> = {
  title: "Data Display/Timeline",
  component: Timeline,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
    },
  },
  args: {
    orientation: "vertical",
  },
};

export default meta;
type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 320 }}>
      <Timeline {...args}>
        <TimelineItem title="Order placed" timestamp="Jan 3, 9:00 AM" status="done" />
        <TimelineItem title="Shipped" timestamp="Jan 5, 2:15 PM" status="done" />
        <TimelineItem title="Out for delivery" timestamp="Jan 7, 8:00 AM" status="current" />
        <TimelineItem title="Delivered" status="pending" />
      </Timeline>
    </div>
  ),
};

export const WithDescriptions: Story = {
  name: "With descriptions",
  render: () => (
    <div style={{ width: 360 }}>
      <Timeline>
        <TimelineItem
          title="Deployment started"
          description="v2.4.0 pushed to production"
          timestamp="10:32 AM"
          status="done"
        />
        <TimelineItem
          title="Health checks passing"
          description="All 12 service instances healthy"
          timestamp="10:34 AM"
          status="current"
          color="success"
        />
        <TimelineItem title="Rollout complete" status="pending" />
      </Timeline>
    </div>
  ),
};

export const Horizontal: Story = {
  args: { orientation: "horizontal" },
  render: (args) => (
    <div style={{ width: 480 }}>
      <Timeline {...args}>
        <TimelineItem title="Requested" status="done" />
        <TimelineItem title="Approved" status="done" />
        <TimelineItem title="In progress" status="current" />
        <TimelineItem title="Completed" status="pending" />
      </Timeline>
    </div>
  ),
};
