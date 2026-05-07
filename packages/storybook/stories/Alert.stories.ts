import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent } from 'vue'
import { Button, Alert, AlertIcon, AlertTitle, AlertDescription } from '@auronui/vue'

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    severity: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'danger'],
    },
    isClosable: { control: 'boolean' },
  },
  args: {
    severity: 'default',
    isClosable: false,
  },
}

export default meta
type Story = StoryObj<typeof Alert>

export const Default: Story = {
  render: (args) => ({
    components: { Alert },
    setup() { return { args } },
    template: '<Alert v-bind="args">This is a default alert message.</Alert>',
  }),
}

export const AllSeverities: Story = {
  render: (args) => ({
    components: { Alert, AlertTitle, AlertDescription },
    setup() { return { args } },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <Alert v-bind="args" severity="default">
          <AlertTitle>Default</AlertTitle>
          <AlertDescription>This is a default informational alert.</AlertDescription>
        </Alert>
        <Alert v-bind="args" severity="primary">
          <AlertTitle>Primary</AlertTitle>
          <AlertDescription>This is a primary branded alert.</AlertDescription>
        </Alert>
        <Alert v-bind="args" severity="success">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Your action was completed successfully.</AlertDescription>
        </Alert>
        <Alert v-bind="args" severity="warning">
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>Please review before proceeding.</AlertDescription>
        </Alert>
        <Alert v-bind="args" severity="danger">
          <AlertTitle>Danger</AlertTitle>
          <AlertDescription>Something went wrong. Please try again.</AlertDescription>
        </Alert>
      </div>
    `,
  }),
}

export const Closable: Story = {
  render: (args) => ({
    components: { Alert, AlertTitle, AlertDescription },
    setup() { return { args } },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <Alert v-bind="args" severity="success" :isClosable="true">
          <AlertTitle>Dismissible Success</AlertTitle>
          <AlertDescription>Click the X button to dismiss this alert.</AlertDescription>
        </Alert>
        <Alert v-bind="args" severity="warning" :isClosable="true">
          <AlertTitle>Dismissible Warning</AlertTitle>
          <AlertDescription>This alert can be closed by the user.</AlertDescription>
        </Alert>
        <Alert v-bind="args" severity="danger" :isClosable="true">
          <AlertTitle>Dismissible Danger</AlertTitle>
          <AlertDescription>Dismiss this error once acknowledged.</AlertDescription>
        </Alert>
      </div>
    `,
  }),
}

export const FullStructure: Story = {
  name: 'Full Structure (Icon + Title + Description)',
  render: (args) => ({
    components: { Alert, AlertIcon, AlertTitle, AlertDescription },
    setup() { return { args } },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <Alert v-bind="args" severity="success">
          <template #icon><AlertIcon>✓</AlertIcon></template>
          <AlertTitle>Upload complete</AlertTitle>
          <AlertDescription>Your file has been uploaded and is ready to use.</AlertDescription>
        </Alert>
        <Alert v-bind="args" severity="warning">
          <template #icon><AlertIcon>⚠</AlertIcon></template>
          <AlertTitle>Session expiring</AlertTitle>
          <AlertDescription>Your session will expire in 5 minutes. Save your work.</AlertDescription>
        </Alert>
        <Alert v-bind="args" severity="danger">
          <template #icon><AlertIcon class="text-sm">✕</AlertIcon></template>
          <AlertTitle>Payment failed</AlertTitle>
          <AlertDescription>Your card was declined. Please update your payment method.</AlertDescription>
        </Alert>
        <Alert v-bind="args" severity="primary">
          <template #icon><AlertIcon>ℹ</AlertIcon></template>
          <AlertTitle>New features available</AlertTitle>
          <AlertDescription>We shipped several improvements. Check the changelog.</AlertDescription>
        </Alert>
      </div>
    `,
  }),
}

export const WithAnimation: Story = {
  name: 'Dismiss Animation Demo',
  render: (args) => defineComponent({
    components: { Button, Alert, AlertTitle, AlertDescription },
    setup: () => ({ args }),
    data() {
      return { shown: true }
    },
    methods: {
      reset() { this.shown = false; setTimeout(() => { this.shown = true }, 500) },
    },
    template: `
      <div>
        <Button variant="flat" style="margin-bottom:16px" @click="reset">Dismiss &amp; Reset</Button>
        <Alert v-bind="args" v-if="shown" severity="warning" :isClosable="true" @close="reset">
          <AlertTitle>Dismiss animation</AlertTitle>
          <AlertDescription>Click X or the button above to see the fade + collapse animation.</AlertDescription>
        </Alert>
      </div>
    `,
  }),
}
