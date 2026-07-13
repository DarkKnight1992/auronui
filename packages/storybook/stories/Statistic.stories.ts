import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Statistic } from '@auronui/vue'

const meta: Meta<typeof Statistic> = {
  title: 'Data Display/Statistic',
  component: Statistic,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'danger'],
    },
    isLoading: { control: 'boolean' },
    trend: {
      control: 'select',
      options: [undefined, 'up', 'down', 'neutral'],
    },
  },
  args: {
    label: 'Revenue',
    value: 45231,
    prefix: '$',
    color: 'default',
    isLoading: false,
  },
}

export default meta
type Story = StoryObj<typeof Statistic>

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Statistic } from '@auronui/vue'
</script>

<template>
  <Statistic label="Revenue" :value="45231" prefix="$" />
</template>`,
        language: 'vue',
      },
    },
  },
}

export const WithTrend: Story = {
  name: 'With trend indicator',
  args: {
    label: 'Active Users',
    value: 2103,
    trend: 'up',
    trendValue: '+12.5%',
    description: 'Compared to last month',
  },
}

export const TrendDown: Story = {
  name: 'Trend down',
  args: {
    label: 'Churn Rate',
    value: 3.2,
    suffix: '%',
    trend: 'down',
    trendValue: '-0.4%',
    color: 'danger',
  },
}

export const Loading: Story = {
  args: {
    label: 'Revenue',
    value: 0,
    isLoading: true,
  },
}

export const Row: Story = {
  name: 'Multiple statistics in a row',
  render: () => ({
    components: { Statistic },
    template: `
      <div style="display:flex;gap:32px;">
        <Statistic label="Revenue" :value="45231" prefix="$" trend="up" trend-value="+12.5%" />
        <Statistic label="Subscriptions" :value="2350" trend="up" trend-value="+8.2%" color="success" />
        <Statistic label="Churn" :value="3.2" suffix="%" trend="down" trend-value="-0.4%" color="danger" />
      </div>
    `,
  }),
}
