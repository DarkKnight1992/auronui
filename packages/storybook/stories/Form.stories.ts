import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { Form, FormField, Input } from '@auronui/vue'

const meta: Meta<typeof Form> = {
  title: 'Components/Form',
  component: Form,
  argTypes: {
    validationMode: {
      control: 'select',
      options: ['on-submit', 'on-blur', 'on-change'],
    },
    isDisabled: { control: 'boolean' },
  },
}
export default meta
type Story = StoryObj<typeof Form>

// ── On Submit (default) ──────────────────────────────────────────────────────

export const OnSubmit: Story = {
  name: 'On Submit (default)',
  render: () => ({
    components: { Form, FormField, Input },
    setup() {
      const email = ref('')
      const password = ref('')
      const submitted = ref<Record<string, unknown> | null>(null)
      const serverError = ref('')

      function handleSubmit({ values, setErrors }: { values: Record<string, unknown>; setErrors: (e: Record<string, string>) => void }) {
        // Simulate a server check
        if (values.email === 'taken@example.com') {
          setErrors({ email: 'This email is already registered' })
          return
        }
        submitted.value = values
      }

      return { email, password, submitted, serverError, handleSubmit }
    },
    template: `
      <div style="max-width: 360px; display: flex; flex-direction: column; gap: 24px;">
        <Form validation-mode="on-submit" @submit="handleSubmit" @invalid="submitted = null" style="display: flex; flex-direction: column; gap: 16px;">
          <FormField name="email" :rules="{ required: true, email: true }">
            <template #default="{ fieldProps }">
              <Input v-bind="fieldProps" label="Email" type="email" />
            </template>
          </FormField>

          <FormField name="password" v-model="password" :rules="{ required: true, minLength: 8 }">
            <template #default="{ fieldProps }">
              <Input v-bind="fieldProps" label="Password" type="password" show-password-toggle />
            </template>
          </FormField>

          <button type="submit" style="padding: 8px 16px; background: #006FEE; color: white; border: none; border-radius: 8px; cursor: pointer;">
            Sign up
          </button>
        </Form>

        <div v-if="submitted" style="padding: 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; font-size: 13px;">
          <strong>Submitted:</strong> {{ JSON.stringify(submitted) }}
        </div>
        <p style="font-size: 12px; color: #71717a;">
          Try submitting empty, then try <code>taken@example.com</code> to see server errors.
        </p>
      </div>
    `,
  }),
}

// ── On Change ────────────────────────────────────────────────────────────────

export const OnChange: Story = {
  name: 'On Change',
  render: () => ({
    components: { Form, FormField, Input },
    setup() {
      const username = ref('')
      const email = ref('')
      return { username, email }
    },
    template: `
      <div style="max-width: 360px;">
        <Form validation-mode="on-change" style="display: flex; flex-direction: column; gap: 16px;">
          <FormField name="username" v-model="username" :rules="{ required: true, minLength: 3, maxLength: 20 }">
            <template #default="{ fieldProps }">
              <Input v-bind="fieldProps" label="Username" placeholder="3–20 characters" />
            </template>
          </FormField>

          <FormField name="email" v-model="email" :rules="{ required: true, email: true }">
            <template #default="{ fieldProps }">
              <Input v-bind="fieldProps" label="Email" type="email" />
            </template>
          </FormField>

          <button type="submit" style="padding: 8px 16px; background: #006FEE; color: white; border: none; border-radius: 8px; cursor: pointer;">
            Continue
          </button>
        </Form>
      </div>
    `,
  }),
}

// ── On Blur ──────────────────────────────────────────────────────────────────

export const OnBlur: Story = {
  name: 'On Blur',
  render: () => ({
    components: { Form, FormField, Input },
    setup() {
      const name = ref('')
      const email = ref('')
      return { name, email }
    },
    template: `
      <div style="max-width: 360px;">
        <Form validation-mode="on-blur" style="display: flex; flex-direction: column; gap: 16px;">
          <FormField name="name" v-model="name" :rules="{ required: true }">
            <template #default="{ fieldProps }">
              <Input v-bind="fieldProps" label="Full name" />
            </template>
          </FormField>

          <FormField name="email" v-model="email" :rules="{ required: true, email: true }">
            <template #default="{ fieldProps }">
              <Input v-bind="fieldProps" label="Email" type="email" />
            </template>
          </FormField>

          <button type="submit" style="padding: 8px 16px; background: #006FEE; color: white; border: none; border-radius: 8px; cursor: pointer;">
            Save
          </button>
        </Form>
      </div>
    `,
  }),
}

// ── Custom Validator ─────────────────────────────────────────────────────────

export const CustomValidator: Story = {
  name: 'Custom Validator',
  render: () => ({
    components: { Form, FormField, Input },
    setup() {
      const username = ref('')
      const TAKEN = ['admin', 'root', 'auron']

      async function checkUsername(value: unknown) {
        // Simulate async availability check
        await new Promise((r) => setTimeout(r, 400))
        if (TAKEN.includes(String(value).toLowerCase())) {
          return `"${value}" is already taken`
        }
        return undefined
      }

      return { username, checkUsername }
    },
    template: `
      <div style="max-width: 360px;">
        <Form validation-mode="on-blur" style="display: flex; flex-direction: column; gap: 16px;">
          <FormField name="username" v-model="username" :rules="{ required: true, minLength: 3 }" :validate="checkUsername">
            <template #default="{ fieldProps }">
              <Input v-bind="fieldProps" label="Username" placeholder="Try: admin, root, auron" />
            </template>
          </FormField>

          <button type="submit" style="padding: 8px 16px; background: #006FEE; color: white; border: none; border-radius: 8px; cursor: pointer;">
            Check availability
          </button>
        </Form>
        <p style="margin-top: 8px; font-size: 12px; color: #71717a;">
          Blur the field to trigger async validation. Reserved names: admin, root, auron.
        </p>
      </div>
    `,
  }),
}

// ── Disabled Form ────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => ({
    components: { Form, FormField, Input },
    setup() {
      const name = ref('Jane Doe')
      const email = ref('jane@example.com')
      return { name, email }
    },
    template: `
      <div style="max-width: 360px;">
        <Form :is-disabled="true" style="display: flex; flex-direction: column; gap: 16px;">
          <FormField name="name" v-model="name">
            <template #default="{ fieldProps }">
              <Input v-bind="fieldProps" label="Full name" />
            </template>
          </FormField>
          <FormField name="email" v-model="email">
            <template #default="{ fieldProps }">
              <Input v-bind="fieldProps" label="Email" type="email" />
            </template>
          </FormField>
          <button type="submit" disabled style="padding: 8px 16px; background: #d4d4d8; color: white; border: none; border-radius: 8px; cursor: not-allowed;">
            Save
          </button>
        </Form>
      </div>
    `,
  }),
}

// ── Standalone FormField (outside Form) ──────────────────────────────────────

export const StandaloneField: Story = {
  name: 'Standalone FormField',
  render: () => ({
    components: { FormField, Input },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `
      <div style="max-width: 360px; display: flex; flex-direction: column; gap: 16px;">
        <p style="font-size: 13px; color: #71717a; margin: 0;">
          FormField works outside &lt;Form&gt; too — validation is local to the field.
        </p>
        <FormField name="email" v-model="value" :rules="{ required: true, email: true }" validation-mode="on-change">
          <template #default="{ fieldProps }">
            <Input v-bind="fieldProps" label="Email" type="email" placeholder="Validates on every keystroke" />
          </template>
        </FormField>
      </div>
    `,
  }),
}
