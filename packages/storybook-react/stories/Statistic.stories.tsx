import type { Meta, StoryObj } from "@storybook/react-vite";
import { Statistic } from "@auronui/react";

const meta: Meta<typeof Statistic> = {
  title: "Data Display/Statistic",
  component: Statistic,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "accent", "success", "warning", "danger"],
    },
    isLoading: { control: "boolean" },
    trend: {
      control: "select",
      options: [undefined, "up", "down", "neutral"],
    },
  },
  args: {
    label: "Revenue",
    value: 45231,
    prefix: "$",
    color: "default",
    isLoading: false,
  },
};

export default meta;
type Story = StoryObj<typeof Statistic>;

export const Default: Story = {
  render: (args) => <Statistic {...args} />,
};

export const WithTrend: Story = {
  name: "With trend indicator",
  args: {
    label: "Active Users",
    value: 2103,
    trend: "up",
    trendValue: "+12.5%",
    description: "Compared to last month",
  },
  render: (args) => <Statistic {...args} />,
};

export const TrendDown: Story = {
  name: "Trend down",
  args: {
    label: "Churn Rate",
    value: 3.2,
    suffix: "%",
    trend: "down",
    trendValue: "-0.4%",
    color: "danger",
  },
  render: (args) => <Statistic {...args} />,
};

export const Loading: Story = {
  args: {
    label: "Revenue",
    value: 0,
    isLoading: true,
  },
  render: (args) => <Statistic {...args} />,
};

export const Row: Story = {
  name: "Multiple statistics in a row",
  render: () => (
    <div style={{ display: "flex", gap: 32 }}>
      <Statistic label="Revenue" value={45231} prefix="$" trend="up" trendValue="+12.5%" />
      <Statistic label="Subscriptions" value={2350} trend="up" trendValue="+8.2%" color="success" />
      <Statistic label="Churn" value={3.2} suffix="%" trend="down" trendValue="-0.4%" color="danger" />
    </div>
  ),
};
