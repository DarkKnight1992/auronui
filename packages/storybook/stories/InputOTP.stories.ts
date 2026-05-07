import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { InputOTP } from '@auronui/vue'

const meta: Meta<typeof InputOTP> = {
  title: 'Form/InputOTP',
  component: InputOTP,
  tags: ['autodocs'],
  argTypes: {
    length: {
      control: { type: 'number', min: 4, max: 8, step: 1 },
    },
    type: {
      control: 'select',
      options: ['numeric', 'alphanumeric', 'all'],
    },
    otp: { control: 'boolean' },
    mask: { control: 'boolean' },
    disabled: { control: 'boolean' },
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
  },
  args: {
    length: 6,
    type: 'numeric',
    otp: true,
    mask: false,
    disabled: false,
    variant: 'primary',
  },
}

export default meta
type Story = StoryObj<typeof InputOTP>

export const Default: Story = {
  render: (args) => ({
    components: { InputOTP },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: '<InputOTP v-bind="args" v-model="value" aria-label="One-time password" />',
  }),
}

export const Length4: Story = {
  render: (args) => ({
    components: { InputOTP },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: '<InputOTP v-bind="args" :length="4" v-model="value" aria-label="4-digit code" />',
  }),
}

export const Alphanumeric: Story = {
  render: (args) => ({
    components: { InputOTP },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: '<InputOTP v-bind="args" type="alphanumeric" :length="6" v-model="value" aria-label="Alphanumeric code" />',
  }),
}

export const Numeric: Story = {
  render: (args) => ({
    components: { InputOTP },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: '<InputOTP v-bind="args" type="numeric" :length="6" v-model="value" aria-label="Numeric code" />',
  }),
}

export const Masked: Story = {
  render: (args) => ({
    components: { InputOTP },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: '<InputOTP v-bind="args" :mask="true" :length="6" v-model="value" aria-label="Masked one-time password" />',
  }),
}

export const Disabled: Story = {
  render: (args) => ({
    components: { InputOTP },
    setup() {
      const value = ref('123456')
      return { args, value }
    },
    template: '<InputOTP v-bind="args" :disabled="true" :length="6" v-model="value" aria-label="Disabled one-time password" />',
  }),
}

export const Prefilled: Story = {
  render: (args) => ({
    components: { InputOTP },
    setup() {
      const value = ref('123456')
      return { args, value }
    },
    template: '<InputOTP v-bind="args" :length="6" v-model="value" aria-label="Pre-filled one-time password" />',
  }),
}

export const AllSizes: Story = {
  render: (args) => ({
    components: { InputOTP },
    setup() {
      const sm = ref('')
      const md = ref('')
      const lg = ref('')
      return { args, sm, md, lg }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px">
        <div>
          <p style="margin-bottom:4px;font-size:12px;color:#666">sm</p>
          <InputOTP v-bind="args" size="sm" :length="6" v-model="sm" aria-label="Small OTP" />
        </div>
        <div>
          <p style="margin-bottom:4px;font-size:12px;color:#666">md (default)</p>
          <InputOTP v-bind="args" size="md" :length="6" v-model="md" aria-label="Medium OTP" />
        </div>
        <div>
          <p style="margin-bottom:4px;font-size:12px;color:#666">lg</p>
          <InputOTP v-bind="args" size="lg" :length="6" v-model="lg" aria-label="Large OTP" />
        </div>
      </div>
    `,
  }),
}
