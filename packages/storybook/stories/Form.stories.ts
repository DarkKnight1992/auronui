import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { Form, FormField, Input } from '@auronui/vue'

const meta: Meta<typeof Form> = {
  title: 'Components/Form',
  tags: ['autodocs'],
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Form, FormField, Input } from '@auronui/vue'

const email = ref('')
const password = ref('')
const submitted = ref(null)

function handleSubmit({ values, setErrors }) {
  if (values.email === 'taken@example.com') {
    setErrors({ email: 'This email is already registered' })
    return
  }
  submitted.value = values
}
</script>

<template>
  <div style="max-width: 360px; display: flex; flex-direction: column; gap: 24px;">
    <Form validation-mode="on-submit" @submit="handleSubmit" style="display: flex; flex-direction: column; gap: 16px;">
      <FormField name="email" v-model="email" :rules="{ required: true, email: true }">
        <template #default="{ fieldProps }">
          <Input v-bind="fieldProps" label="Email" type="email" />
        </template>
      </FormField>

      <FormField name="password" v-model="password" :rules="{ required: true, minLength: 8 }">
        <template #default="{ fieldProps }">
          <Input v-bind="fieldProps" label="Password" type="password" show-password-toggle />
        </template>
      </FormField>

      <button type="submit">Sign up</button>
    </Form>
  </div>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: () => ({
    components: { Form, FormField, Input },
    setup() {
      const email = ref('')
      const password = ref('')
      const submitted = ref<Record<string, unknown> | null>(null)

      function handleSubmit({ values, setErrors }: { values: Record<string, unknown>; setErrors: (e: Record<string, string>) => void }) {
        // Simulate a server check
        if (values.email === 'taken@example.com') {
          setErrors({ email: 'This email is already registered' })
          return
        }
        submitted.value = values
      }

      return { email, password, submitted, handleSubmit }
    },
    template: `
      <div style="max-width: 360px; display: flex; flex-direction: column; gap: 24px;">
        <Form validation-mode="on-submit" @submit="handleSubmit" @invalid="submitted = null" style="display: flex; flex-direction: column; gap: 16px;">
          <FormField name="email" v-model="email" :rules="{ required: true, email: true }">
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Form, FormField, Input } from '@auronui/vue'

const username = ref('')
const email = ref('')
</script>

<template>
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
</template>`,
        language: 'vue',
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Form, FormField, Input } from '@auronui/vue'

const name = ref('')
const email = ref('')
</script>

<template>
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
</template>`,
        language: 'vue',
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Form, FormField, Input } from '@auronui/vue'

const username = ref('')
const TAKEN = ['admin', 'root', 'auron']

async function checkUsername(value) {
  // Simulate async availability check
  await new Promise((r) => setTimeout(r, 400))
  if (TAKEN.includes(String(value).toLowerCase())) {
    return \`"\${value}" is already taken\`
  }
  return undefined
}
</script>

<template>
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
</template>`,
        language: 'vue',
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Form, FormField, Input } from '@auronui/vue'

const name = ref('Jane Doe')
const email = ref('jane@example.com')
</script>

<template>
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
</template>`,
        language: 'vue',
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { FormField, Input } from '@auronui/vue'

const value = ref('')
</script>

<template>
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
</template>`,
        language: 'vue',
      },
    },
  },
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

// ── isSubmitted / submitCount ─────────────────────────────────────────────────

export const SubmitState: Story = {
  name: 'Submit State (isSubmitted / submitCount)',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Form, FormField, Input } from '@auronui/vue'

const email = ref('')
</script>

<template>
  <div style="max-width: 360px; display: flex; flex-direction: column; gap: 16px;">
    <Form validation-mode="on-submit" @submit="() => {}" v-slot="{ isSubmitted, submitCount, isValid, errors }">
      <FormField name="email" v-model="email" :rules="{ required: true, email: true }">
        <template #default="{ fieldProps }">
          <Input v-bind="fieldProps" label="Email" type="email" />
        </template>
      </FormField>

      <button type="submit" style="padding: 8px 16px; background: #006FEE; color: white; border: none; border-radius: 8px; cursor: pointer;">
        Submit
      </button>

      <div style="padding: 12px; background: #f4f4f5; border-radius: 8px; font-size: 13px; display: flex; flex-direction: column; gap: 4px;">
        <div><strong>isSubmitted:</strong> {{ isSubmitted }}</div>
        <div><strong>submitCount:</strong> {{ submitCount }}</div>
        <div><strong>isValid:</strong> {{ isValid }}</div>
        <div><strong>errors:</strong> {{ JSON.stringify(errors) }}</div>
      </div>
    </Form>
    <p style="font-size: 12px; color: #71717a;">Submit multiple times to watch submitCount increment. isSubmitted becomes true after the first attempt.</p>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: () => ({
    components: { Form, FormField, Input },
    setup() {
      const email = ref('')
      return { email }
    },
    template: `
      <div style="max-width: 360px; display: flex; flex-direction: column; gap: 16px;">
        <Form validation-mode="on-submit" @submit="() => {}" v-slot="{ isSubmitted, submitCount, isValid, errors }">
          <FormField name="email" v-model="email" :rules="{ required: true, email: true }">
            <template #default="{ fieldProps }">
              <Input v-bind="fieldProps" label="Email" type="email" />
            </template>
          </FormField>

          <button type="submit" style="padding: 8px 16px; background: #006FEE; color: white; border: none; border-radius: 8px; cursor: pointer;">
            Submit
          </button>

          <div style="padding: 12px; background: #f4f4f5; border-radius: 8px; font-size: 13px; display: flex; flex-direction: column; gap: 4px;">
            <div><strong>isSubmitted:</strong> {{ isSubmitted }}</div>
            <div><strong>submitCount:</strong> {{ submitCount }}</div>
            <div><strong>isValid:</strong> {{ isValid }}</div>
            <div><strong>errors:</strong> {{ JSON.stringify(errors) }}</div>
          </div>
        </Form>
        <p style="font-size: 12px; color: #71717a;">Submit multiple times to watch submitCount increment. isSubmitted becomes true after the first attempt.</p>
      </div>
    `,
  }),
}

// ── isDirty / isTouched / touched+dirty slot props ───────────────────────────

export const DirtyAndTouched: Story = {
  name: 'Dirty & Touched State',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Form, FormField, Input } from '@auronui/vue'

const name = ref('Jane Doe')
const email = ref('jane@example.com')
</script>

<template>
  <div style="max-width: 400px; display: flex; flex-direction: column; gap: 16px;">
    <Form v-slot="{ isDirty, isTouched }" style="display: flex; flex-direction: column; gap: 12px;">
      <FormField name="name" v-model="name" default-value="Jane Doe" validation-mode="on-blur">
        <template #default="{ fieldProps, touched, dirty }">
          <Input v-bind="fieldProps" label="Full name" />
          <div style="font-size: 11px; color: #71717a; margin-top: 2px;">
            touched: {{ touched }} · dirty: {{ dirty }}
          </div>
        </template>
      </FormField>

      <FormField name="email" v-model="email" default-value="jane@example.com" :rules="{ required: true, email: true }" validation-mode="on-blur">
        <template #default="{ fieldProps, touched, dirty }">
          <Input v-bind="fieldProps" label="Email" type="email" />
          <div style="font-size: 11px; color: #71717a; margin-top: 2px;">
            touched: {{ touched }} · dirty: {{ dirty }}
          </div>
        </template>
      </FormField>

      <div style="padding: 10px; background: #f4f4f5; border-radius: 8px; font-size: 13px; display: flex; gap: 16px;">
        <div><strong>Form isDirty:</strong> {{ isDirty }}</div>
        <div><strong>Form isTouched:</strong> {{ isTouched }}</div>
      </div>

      <button type="submit" style="padding: 8px 16px; background: #006FEE; color: white; border: none; border-radius: 8px; cursor: pointer;">
        Save changes
      </button>
    </Form>
    <p style="font-size: 12px; color: #71717a;">Edit a field and blur it. dirty tracks changes from defaultValue; touched tracks blur.</p>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: () => ({
    components: { Form, FormField, Input },
    setup() {
      const name = ref('Jane Doe')
      const email = ref('jane@example.com')
      return { name, email }
    },
    template: `
      <div style="max-width: 400px; display: flex; flex-direction: column; gap: 16px;">
        <Form v-slot="{ isDirty, isTouched }" style="display: flex; flex-direction: column; gap: 12px;">
          <FormField name="name" v-model="name" default-value="Jane Doe" validation-mode="on-blur">
            <template #default="{ fieldProps, touched, dirty }">
              <Input v-bind="fieldProps" label="Full name" />
              <div style="font-size: 11px; color: #71717a; margin-top: 2px;">
                touched: {{ touched }} · dirty: {{ dirty }}
              </div>
            </template>
          </FormField>

          <FormField name="email" v-model="email" default-value="jane@example.com" :rules="{ required: true, email: true }" validation-mode="on-blur">
            <template #default="{ fieldProps, touched, dirty }">
              <Input v-bind="fieldProps" label="Email" type="email" />
              <div style="font-size: 11px; color: #71717a; margin-top: 2px;">
                touched: {{ touched }} · dirty: {{ dirty }}
              </div>
            </template>
          </FormField>

          <div style="padding: 10px; background: #f4f4f5; border-radius: 8px; font-size: 13px; display: flex; gap: 16px;">
            <div><strong>Form isDirty:</strong> {{ isDirty }}</div>
            <div><strong>Form isTouched:</strong> {{ isTouched }}</div>
          </div>

          <button type="submit" style="padding: 8px 16px; background: #006FEE; color: white; border: none; border-radius: 8px; cursor: pointer;">
            Save changes
          </button>
        </Form>
        <p style="font-size: 12px; color: #71717a;">Edit a field and blur it. dirty tracks changes from defaultValue; touched tracks blur.</p>
      </div>
    `,
  }),
}

// ── reset() ───────────────────────────────────────────────────────────────────

export const FormReset: Story = {
  name: 'Form Reset',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Form, FormField, Input } from '@auronui/vue'

const name = ref('Jane Doe')
const email = ref('jane@example.com')
</script>

<template>
  <div style="max-width: 360px; display: flex; flex-direction: column; gap: 16px;">
    <Form v-slot="{ reset, isDirty, isSubmitted, submitCount }" style="display: flex; flex-direction: column; gap: 12px;">
      <FormField name="name" v-model="name" default-value="Jane Doe" :rules="{ required: true }">
        <template #default="{ fieldProps }">
          <Input v-bind="fieldProps" label="Full name" />
        </template>
      </FormField>

      <FormField name="email" v-model="email" default-value="jane@example.com" :rules="{ required: true, email: true }">
        <template #default="{ fieldProps }">
          <Input v-bind="fieldProps" label="Email" type="email" />
        </template>
      </FormField>

      <div style="display: flex; gap: 8px;">
        <button type="submit" style="padding: 8px 16px; background: #006FEE; color: white; border: none; border-radius: 8px; cursor: pointer; flex: 1;">
          Save
        </button>
        <button type="button" @click="reset()" style="padding: 8px 16px; background: #f4f4f5; color: #3f3f46; border: none; border-radius: 8px; cursor: pointer; flex: 1;">
          Reset
        </button>
      </div>

      <div style="padding: 10px; background: #f4f4f5; border-radius: 8px; font-size: 13px; display: flex; gap: 16px;">
        <div><strong>isDirty:</strong> {{ isDirty }}</div>
        <div><strong>isSubmitted:</strong> {{ isSubmitted }}</div>
        <div><strong>submitCount:</strong> {{ submitCount }}</div>
      </div>
    </Form>
    <p style="font-size: 12px; color: #71717a;">Edit the fields, then hit Reset. Values return to defaultValue, all state clears.</p>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: () => ({
    components: { Form, FormField, Input },
    setup() {
      const name = ref('Jane Doe')
      const email = ref('jane@example.com')
      return { name, email }
    },
    template: `
      <div style="max-width: 360px; display: flex; flex-direction: column; gap: 16px;">
        <Form v-slot="{ reset, isDirty, isSubmitted, submitCount }" style="display: flex; flex-direction: column; gap: 12px;">
          <FormField name="name" v-model="name" default-value="Jane Doe" :rules="{ required: true }">
            <template #default="{ fieldProps }">
              <Input v-bind="fieldProps" label="Full name" />
            </template>
          </FormField>

          <FormField name="email" v-model="email" default-value="jane@example.com" :rules="{ required: true, email: true }">
            <template #default="{ fieldProps }">
              <Input v-bind="fieldProps" label="Email" type="email" />
            </template>
          </FormField>

          <div style="display: flex; gap: 8px;">
            <button type="submit" style="padding: 8px 16px; background: #006FEE; color: white; border: none; border-radius: 8px; cursor: pointer; flex: 1;">
              Save
            </button>
            <button type="button" @click="reset()" style="padding: 8px 16px; background: #f4f4f5; color: #3f3f46; border: none; border-radius: 8px; cursor: pointer; flex: 1;">
              Reset
            </button>
          </div>

          <div style="padding: 10px; background: #f4f4f5; border-radius: 8px; font-size: 13px; display: flex; gap: 16px;">
            <div><strong>isDirty:</strong> {{ isDirty }}</div>
            <div><strong>isSubmitted:</strong> {{ isSubmitted }}</div>
            <div><strong>submitCount:</strong> {{ submitCount }}</div>
          </div>
        </Form>
        <p style="font-size: 12px; color: #71717a;">Edit the fields, then hit Reset. Values return to defaultValue, all state clears.</p>
      </div>
    `,
  }),
}

// ── Imperative API (getValues / setValue / setError / clearErrors / trigger) ──

export const ImperativeAPI: Story = {
  name: 'Imperative API',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Form, FormField, Input } from '@auronui/vue'

const name = ref('')
const email = ref('')
const formRef = ref(null)
const snapshot = ref(null)

function prefill() {
  formRef.value?.setValue('name', 'Jane Doe')
  formRef.value?.setValue('email', 'jane@example.com')
}

function getSnapshot() {
  snapshot.value = formRef.value?.getValues() ?? null
}

function injectError() {
  formRef.value?.setError('email', 'This email is already in use')
}

function clearAll() {
  formRef.value?.clearErrors()
}

async function validate() {
  const valid = await formRef.value?.trigger()
  snapshot.value = { valid: valid ?? false, errors: formRef.value?.errors }
}
</script>

<template>
  <div style="max-width: 400px; display: flex; flex-direction: column; gap: 16px;">
    <Form ref="formRef" style="display: flex; flex-direction: column; gap: 12px;">
      <FormField name="name" v-model="name" :rules="{ required: true, minLength: 2 }">
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
        Submit
      </button>
    </Form>

    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
      <button @click="prefill()" style="padding: 6px 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; cursor: pointer; font-size: 13px;">
        setValue() — Prefill
      </button>
      <button @click="getSnapshot()" style="padding: 6px 12px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; cursor: pointer; font-size: 13px;">
        getValues()
      </button>
      <button @click="validate()" style="padding: 6px 12px; background: #fefce8; border: 1px solid #fde68a; border-radius: 6px; cursor: pointer; font-size: 13px;">
        trigger()
      </button>
      <button @click="injectError()" style="padding: 6px 12px; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 6px; cursor: pointer; font-size: 13px;">
        setError()
      </button>
      <button @click="clearAll()" style="padding: 6px 12px; background: #f4f4f5; border: 1px solid #d4d4d8; border-radius: 6px; cursor: pointer; font-size: 13px;">
        clearErrors()
      </button>
    </div>

    <div v-if="snapshot" style="padding: 12px; background: #f4f4f5; border-radius: 8px; font-size: 12px; font-family: monospace; white-space: pre-wrap;">{{ JSON.stringify(snapshot, null, 2) }}</div>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: () => ({
    components: { Form, FormField, Input },
    setup() {
      const name = ref('')
      const email = ref('')
      const formRef = ref<InstanceType<typeof Form> | null>(null)
      const snapshot = ref<Record<string, unknown> | null>(null)

      function prefill() {
        formRef.value?.setValue('name', 'Jane Doe')
        formRef.value?.setValue('email', 'jane@example.com')
      }

      function getSnapshot() {
        snapshot.value = formRef.value?.getValues() ?? null
      }

      function injectError() {
        formRef.value?.setError('email', 'This email is already in use')
      }

      function clearAll() {
        formRef.value?.clearErrors()
      }

      async function validate() {
        const valid = await formRef.value?.trigger()
        snapshot.value = { valid: valid ?? false, errors: formRef.value?.errors }
      }

      return { name, email, formRef, snapshot, prefill, getSnapshot, injectError, clearAll, validate }
    },
    template: `
      <div style="max-width: 400px; display: flex; flex-direction: column; gap: 16px;">
        <Form ref="formRef" style="display: flex; flex-direction: column; gap: 12px;">
          <FormField name="name" v-model="name" :rules="{ required: true, minLength: 2 }">
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
            Submit
          </button>
        </Form>

        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          <button @click="prefill()" style="padding: 6px 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; cursor: pointer; font-size: 13px;">
            setValue() — Prefill
          </button>
          <button @click="getSnapshot()" style="padding: 6px 12px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; cursor: pointer; font-size: 13px;">
            getValues()
          </button>
          <button @click="validate()" style="padding: 6px 12px; background: #fefce8; border: 1px solid #fde68a; border-radius: 6px; cursor: pointer; font-size: 13px;">
            trigger()
          </button>
          <button @click="injectError()" style="padding: 6px 12px; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 6px; cursor: pointer; font-size: 13px;">
            setError()
          </button>
          <button @click="clearAll()" style="padding: 6px 12px; background: #f4f4f5; border: 1px solid #d4d4d8; border-radius: 6px; cursor: pointer; font-size: 13px;">
            clearErrors()
          </button>
        </div>

        <div v-if="snapshot" style="padding: 12px; background: #f4f4f5; border-radius: 8px; font-size: 12px; font-family: monospace; white-space: pre-wrap;">{{ JSON.stringify(snapshot, null, 2) }}</div>
      </div>
    `,
  }),
}

// ── URL / Integer / Matches rules ─────────────────────────────────────────────

export const NewValidationRules: Story = {
  name: 'New Rules: url, integer, matches',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Form, FormField, Input } from '@auronui/vue'

const website = ref('')
const quantity = ref('')
const password = ref('')
const confirm = ref('')
const submitted = ref(null)
</script>

<template>
  <div style="max-width: 360px; display: flex; flex-direction: column; gap: 16px;">
    <Form
      validation-mode="on-submit"
      @submit="({ values }) => submitted = values"
      style="display: flex; flex-direction: column; gap: 12px;"
    >
      <FormField name="website" v-model="website" :rules="{ url: true }">
        <template #default="{ fieldProps }">
          <Input v-bind="fieldProps" label="Website (url rule)" placeholder="https://example.com" />
        </template>
      </FormField>

      <FormField name="quantity" v-model="quantity" :rules="{ required: true, integer: true, min: 1, max: 100 }">
        <template #default="{ fieldProps }">
          <Input v-bind="fieldProps" label="Quantity (integer rule)" type="number" placeholder="1–100, no decimals" />
        </template>
      </FormField>

      <FormField name="password" v-model="password" :rules="{ required: true, minLength: 8 }">
        <template #default="{ fieldProps }">
          <Input v-bind="fieldProps" label="Password" type="password" show-password-toggle />
        </template>
      </FormField>

      <FormField name="confirm" v-model="confirm" :rules="{ required: true, matches: { value: 'password', message: 'Passwords must match' } }">
        <template #default="{ fieldProps }">
          <Input v-bind="fieldProps" label="Confirm password (matches rule)" type="password" />
        </template>
      </FormField>

      <button type="submit" style="padding: 8px 16px; background: #006FEE; color: white; border: none; border-radius: 8px; cursor: pointer;">
        Submit
      </button>
    </Form>

    <div v-if="submitted" style="padding: 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; font-size: 13px;">
      <strong>Submitted:</strong> {{ JSON.stringify(submitted) }}
    </div>
    <p style="font-size: 12px; color: #71717a;">
      Demonstrates the three new rules: <code>url</code>, <code>integer</code>, and cross-field <code>matches</code>.
    </p>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: () => ({
    components: { Form, FormField, Input },
    setup() {
      const website = ref('')
      const quantity = ref('')
      const password = ref('')
      const confirm = ref('')
      const submitted = ref<Record<string, unknown> | null>(null)
      return { website, quantity, password, confirm, submitted }
    },
    template: `
      <div style="max-width: 360px; display: flex; flex-direction: column; gap: 16px;">
        <Form
          validation-mode="on-submit"
          @submit="({ values }) => submitted = values"
          style="display: flex; flex-direction: column; gap: 12px;"
        >
          <FormField name="website" v-model="website" :rules="{ url: true }">
            <template #default="{ fieldProps }">
              <Input v-bind="fieldProps" label="Website (url rule)" placeholder="https://example.com" />
            </template>
          </FormField>

          <FormField name="quantity" v-model="quantity" :rules="{ required: true, integer: true, min: 1, max: 100 }">
            <template #default="{ fieldProps }">
              <Input v-bind="fieldProps" label="Quantity (integer rule)" type="number" placeholder="1–100, no decimals" />
            </template>
          </FormField>

          <FormField name="password" v-model="password" :rules="{ required: true, minLength: 8 }">
            <template #default="{ fieldProps }">
              <Input v-bind="fieldProps" label="Password" type="password" show-password-toggle />
            </template>
          </FormField>

          <FormField name="confirm" v-model="confirm" :rules="{ required: true, matches: { value: 'password', message: 'Passwords must match' } }">
            <template #default="{ fieldProps }">
              <Input v-bind="fieldProps" label="Confirm password (matches rule)" type="password" />
            </template>
          </FormField>

          <button type="submit" style="padding: 8px 16px; background: #006FEE; color: white; border: none; border-radius: 8px; cursor: pointer;">
            Submit
          </button>
        </Form>

        <div v-if="submitted" style="padding: 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; font-size: 13px;">
          <strong>Submitted:</strong> {{ JSON.stringify(submitted) }}
        </div>
        <p style="font-size: 12px; color: #71717a;">
          Demonstrates the three new rules: <code>url</code>, <code>integer</code>, and cross-field <code>matches</code>.
        </p>
      </div>
    `,
  }),
}
