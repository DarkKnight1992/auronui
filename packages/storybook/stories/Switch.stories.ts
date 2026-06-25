import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Button, Switch, SwitchGroup } from '@auronui/vue'
import { ref } from 'vue'

const meta: Meta = {
  title: 'Form/Switch',
  tags: ['autodocs'],
  component: Switch,
  argTypes: {
    classNames: { control: 'object', description: 'Per-slot class overrides. Keys match the component anatomy slot names.' },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: (args) => ({
    components: { Switch },
    setup: () => ({ args }),
    template: `<Switch v-bind="args" aria-label="Enable feature" />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Switch } from '@auronui/vue'
</script>

<template>
  <Switch aria-label="Enable feature" />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
}

export const Checked: Story = {
  render: (args) => ({
    components: { Switch },
    setup() {
      const value = ref(true)
      return { args, value }
    },
    template: `<Switch v-bind="args" v-model="value" aria-label="Checked switch" />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Switch } from '@auronui/vue'

const value = ref(true)
</script>

<template>
  <Switch v-model="value" aria-label="Checked switch" />
</template>`,
        language: 'vue',
      },
    },
  },
}

export const Disabled: Story = {
  render: (args) => ({
    components: { Switch },
    setup: () => ({ args }),
    template: `<Switch v-bind="args" :disabled="true" aria-label="Disabled switch" />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Switch } from '@auronui/vue'
</script>

<template>
  <Switch :disabled="true" aria-label="Disabled switch" />
</template>`,
        language: 'vue',
      },
    },
  },
}

export const AllSizes: Story = {
  render: (args) => ({
    components: { Switch },
    setup() {
      const sm = ref(false)
      const md = ref(true)
      const lg = ref(false)
      return { args, sm, md, lg }
    },
    template: `
      <div style="display:flex;gap:16px;align-items:center">
        <Switch v-bind="args" v-model="sm" size="sm" aria-label="Small switch" />
        <Switch v-bind="args" v-model="md" size="md" aria-label="Medium switch" />
        <Switch v-bind="args" v-model="lg" size="lg" aria-label="Large switch" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Switch } from '@auronui/vue'

const sm = ref(false)
const md = ref(true)
const lg = ref(false)
</script>

<template>
  <div style="display:flex;gap:16px;align-items:center">
    <Switch v-model="sm" size="sm" aria-label="Small switch" />
    <Switch v-model="md" size="md" aria-label="Medium switch" />
    <Switch v-model="lg" size="lg" aria-label="Large switch" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const SizeSmall: Story = {
  render: (args) => ({
    components: { Switch },
    setup() {
      const value = ref(false)
      return { args, value }
    },
    template: `<Switch v-bind="args" v-model="value" size="sm" aria-label="Small switch" />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Switch } from '@auronui/vue'

const value = ref(false)
</script>

<template>
  <Switch v-model="value" size="sm" aria-label="Small switch" />
</template>`,
        language: 'vue',
      },
    },
  },
}

export const SizeLarge: Story = {
  render: (args) => ({
    components: { Switch },
    setup() {
      const value = ref(false)
      return { args, value }
    },
    template: `<Switch v-bind="args" v-model="value" size="lg" aria-label="Large switch" />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Switch } from '@auronui/vue'

const value = ref(false)
</script>

<template>
  <Switch v-model="value" size="lg" aria-label="Large switch" />
</template>`,
        language: 'vue',
      },
    },
  },
}

export const WithLabel: Story = {
  render: (args) => ({
    components: { Switch },
    setup() {
      const value = ref(false)
      return { args, value }
    },
    template: `<Switch v-bind="args" v-model="value" aria-label="Dark mode">Dark mode</Switch>`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Switch } from '@auronui/vue'

const value = ref(false)
</script>

<template>
  <Switch v-model="value" aria-label="Dark mode">Dark mode</Switch>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const GroupDefault: Story = {
  render: (args) => ({
    components: { Switch, SwitchGroup },
    setup() {
      const selected = ref<string[]>([])
      return { args, selected }
    },
    template: `
      <SwitchGroup v-model="selected" label="Notification channels">
        <Switch v-bind="args" value="email" aria-label="Email">Email</Switch>
        <Switch v-bind="args" value="sms" aria-label="SMS">SMS</Switch>
        <Switch v-bind="args" value="push" aria-label="Push">Push notifications</Switch>
      </SwitchGroup>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Switch, SwitchGroup } from '@auronui/vue'

const selected = ref<string[]>([])
</script>

<template>
  <SwitchGroup v-model="selected" label="Notification channels">
    <Switch value="email" aria-label="Email">Email</Switch>
    <Switch value="sms" aria-label="SMS">SMS</Switch>
    <Switch value="push" aria-label="Push">Push notifications</Switch>
  </SwitchGroup>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const GroupPreselected: Story = {
  render: (args) => ({
    components: { Switch, SwitchGroup },
    setup() {
      const selected = ref<string[]>(['email', 'push'])
      return { args, selected }
    },
    template: `
      <SwitchGroup v-model="selected" label="Notification channels">
        <Switch v-bind="args" value="email" aria-label="Email">Email</Switch>
        <Switch v-bind="args" value="sms" aria-label="SMS">SMS</Switch>
        <Switch v-bind="args" value="push" aria-label="Push">Push notifications</Switch>
      </SwitchGroup>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Switch, SwitchGroup } from '@auronui/vue'

const selected = ref(['email', 'push'])
</script>

<template>
  <SwitchGroup v-model="selected" label="Notification channels">
    <Switch value="email" aria-label="Email">Email</Switch>
    <Switch value="sms" aria-label="SMS">SMS</Switch>
    <Switch value="push" aria-label="Push">Push notifications</Switch>
  </SwitchGroup>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const GroupDisabled: Story = {
  render: (args) => ({
    components: { Button, Switch, SwitchGroup },
    setup() {
      const groupDisabled = ref(false)
      const selected = ref<string[]>(['email'])
      return { args, groupDisabled, selected }
    },
    template: `
      <div>
        <Button variant="flat" style="margin-bottom:16px" @click="groupDisabled = !groupDisabled">
          Toggle Group Disabled ({{ groupDisabled }})
        </Button>
        <SwitchGroup v-model="selected" :disabled="groupDisabled" label="Notification channels">
          <Switch v-bind="args" value="email" aria-label="Email">Email</Switch>
          <Switch v-bind="args" value="sms" aria-label="SMS">SMS</Switch>
          <Switch v-bind="args" value="push" aria-label="Push" :disabled="true">Push (always disabled)</Switch>
        </SwitchGroup>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Button, Switch, SwitchGroup } from '@auronui/vue'

const groupDisabled = ref(false)
const selected = ref(['email'])
</script>

<template>
  <div>
    <Button variant="flat" style="margin-bottom:16px" @click="groupDisabled = !groupDisabled">
      Toggle Group Disabled ({{ groupDisabled }})
    </Button>
    <SwitchGroup v-model="selected" :disabled="groupDisabled" label="Notification channels">
      <Switch value="email" aria-label="Email">Email</Switch>
      <Switch value="sms" aria-label="SMS">SMS</Switch>
      <Switch value="push" aria-label="Push" :disabled="true">Push (always disabled)</Switch>
    </SwitchGroup>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const GroupHorizontal: Story = {
  render: (args) => ({
    components: { Switch, SwitchGroup },
    setup() {
      const selected = ref<string[]>([])
      return { args, selected }
    },
    template: `
      <SwitchGroup v-model="selected" orientation="horizontal" label="Features">
        <Switch v-bind="args" value="a" aria-label="Feature A">Feature A</Switch>
        <Switch v-bind="args" value="b" aria-label="Feature B">Feature B</Switch>
        <Switch v-bind="args" value="c" aria-label="Feature C">Feature C</Switch>
      </SwitchGroup>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Switch, SwitchGroup } from '@auronui/vue'

const selected = ref<string[]>([])
</script>

<template>
  <SwitchGroup v-model="selected" orientation="horizontal" label="Features">
    <Switch value="a" aria-label="Feature A">Feature A</Switch>
    <Switch value="b" aria-label="Feature B">Feature B</Switch>
    <Switch value="c" aria-label="Feature C">Feature C</Switch>
  </SwitchGroup>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const CustomStyles: Story = {
  name: 'Custom styles via classNames',
  render: (args) => ({
    components: { Switch },
    setup() {
      const value = ref(false)
      return { args, value }
    },
    template: `
      <Switch
        v-bind="args"
        v-model="value"
        :class-names="{
          control: 'border-2 border-blue-500 rounded-lg',
          thumb: 'bg-gradient-to-r from-blue-400 to-blue-600',
          content: 'text-blue-700 font-semibold ml-3',
        }"
        aria-label="Custom styled switch"
      >Custom Styled Switch</Switch>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Switch } from '@auronui/vue'

const value = ref(false)
</script>

<template>
  <Switch
    v-model="value"
    :class-names="{
      control: 'border-2 border-blue-500 rounded-lg',
      thumb: 'bg-gradient-to-r from-blue-400 to-blue-600',
      content: 'text-blue-700 font-semibold ml-3',
    }"
    aria-label="Custom styled switch"
  >Custom Styled Switch</Switch>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const GroupArrayAPI: Story = {
  name: 'SwitchGroup: Array API (items prop)',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { SwitchGroup } from '@auronui/vue'

const selected = ref(['email', 'push'])
</script>

<template>
  <SwitchGroup
    v-model="selected"
    label="Notification channels"
    :items="[
      { value: 'email', label: 'Email notifications' },
      { value: 'sms', label: 'SMS notifications' },
      { value: 'push', label: 'Push notifications' },
      { value: 'slack', label: 'Slack notifications', disabled: true },
    ]"
  />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { SwitchGroup },
    setup() {
      const selected = ref(['email', 'push'])
      return { args, selected }
    },
    template: `
      <SwitchGroup
        v-bind="args"
        v-model="selected"
        label="Notification channels"
        :items="[
          { value: 'email', label: 'Email notifications' },
          { value: 'sms', label: 'SMS notifications' },
          { value: 'push', label: 'Push notifications' },
          { value: 'slack', label: 'Slack notifications', disabled: true },
        ]"
      />
    `,
  }),
}
