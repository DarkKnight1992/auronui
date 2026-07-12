import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperTitle,
  StepperDescription,
  StepperContent,
  StepperSeparator,
} from '@auronui/vue'

const meta: Meta<typeof Stepper> = {
  title: 'Extended/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    color: { control: 'select', options: ['default', 'primary', 'accent', 'success', 'warning', 'danger'] },
    classNames: { control: 'object', description: 'Per-slot class overrides. Keys match the component anatomy slot names.' },
  },
  args: {
    orientation: 'horizontal',
    size: 'md',
    color: 'primary',
  },
  decorators: [
    () => ({
      template: `<div style="padding: 32px; max-width: 700px;"><story /></div>`,
    }),
  ],
}

export default meta
type Story = StoryObj<typeof Stepper>

const steps = [
  { label: 'Account', description: 'Create your account' },
  { label: 'Profile', description: 'Set up your profile' },
  { label: 'Review', description: 'Review your details' },
  { label: 'Done', description: 'You\'re all set!' },
]

export const Default: Story = {
  args: { orientation: 'horizontal', size: 'md', color: 'primary' },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperTitle,
  StepperDescription,
  StepperContent,
  StepperSeparator,
} from '@auronui/vue'

const currentStep = ref(1)
const steps = [
  { label: 'Account', description: 'Create your account' },
  { label: 'Profile', description: 'Set up your profile' },
  { label: 'Review', description: 'Review your details' },
  { label: 'Done', description: "You're all set!" },
]
</script>

<template>
  <Stepper v-model="currentStep" :total-steps="steps.length" orientation="horizontal" color="primary">
    <StepperItem v-for="(step, index) in steps" :key="index" :step="index + 1">
      <StepperIndicator>{{ index + 1 }}</StepperIndicator>
      <StepperSeparator v-if="index < steps.length - 1" />
      <StepperContent>
        <StepperTitle>{{ step.label }}</StepperTitle>
        <StepperDescription>{{ step.description }}</StepperDescription>
      </StepperContent>
    </StepperItem>
  </Stepper>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Stepper, StepperItem, StepperIndicator, StepperTitle, StepperDescription, StepperContent, StepperSeparator },
    setup() {
      const currentStep = ref(2)
      return { args, currentStep, steps }
    },
    template: `
      <Stepper v-bind="args" v-model="currentStep" :total-steps="steps.length">
        <StepperItem v-for="(step, index) in steps" :key="index" :step="index + 1">
          <StepperIndicator>{{ index + 1 }}</StepperIndicator>
          <StepperSeparator v-if="index < steps.length - 1" />
          <StepperContent>
            <StepperTitle>{{ step.label }}</StepperTitle>
            <StepperDescription>{{ step.description }}</StepperDescription>
          </StepperContent>
        </StepperItem>
      </Stepper>
      <div style="margin-top: 24px; display: flex; gap: 8px;">
        <button @click="currentStep = Math.max(1, currentStep - 1)" style="padding: 6px 12px; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer; font-size: 13px;">Back</button>
        <button @click="currentStep = Math.min(steps.length, currentStep + 1)" style="padding: 6px 12px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px;">Next</button>
      </div>
    `,
  }),
}

export const Vertical: Story = {
  args: { orientation: 'vertical', size: 'md', color: 'primary' },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperTitle,
  StepperDescription,
  StepperContent,
  StepperSeparator,
} from '@auronui/vue'

const currentStep = ref(2)
const steps = [
  { label: 'Account', description: 'Create your account' },
  { label: 'Profile', description: 'Set up your profile' },
  { label: 'Review', description: 'Review your details' },
  { label: 'Done', description: "You're all set!" },
]
</script>

<template>
  <Stepper v-model="currentStep" :total-steps="steps.length" orientation="vertical" size="md" color="primary">
    <StepperItem v-for="(step, index) in steps" :key="index" :step="index + 1">
      <StepperIndicator>{{ index + 1 }}</StepperIndicator>
      <StepperContent>
        <StepperTitle>{{ step.label }}</StepperTitle>
        <StepperDescription>{{ step.description }}</StepperDescription>
      </StepperContent>
      <StepperSeparator v-if="index < steps.length - 1" />
    </StepperItem>
  </Stepper>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Stepper, StepperItem, StepperIndicator, StepperTitle, StepperDescription, StepperContent, StepperSeparator },
    setup() {
      const currentStep = ref(2)
      return { args, currentStep, steps }
    },
    template: `
      <Stepper v-bind="args" v-model="currentStep" :total-steps="steps.length">
        <StepperItem v-for="(step, index) in steps" :key="index" :step="index + 1">
          <StepperIndicator>{{ index + 1 }}</StepperIndicator>
          <StepperContent>
            <StepperTitle>{{ step.label }}</StepperTitle>
            <StepperDescription>{{ step.description }}</StepperDescription>
          </StepperContent>
          <StepperSeparator v-if="index < steps.length - 1" />
        </StepperItem>
      </Stepper>
    `,
  }),
}

export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperTitle,
  StepperContent,
  StepperSeparator,
} from '@auronui/vue'

const colors = ['default', 'primary', 'accent', 'success', 'warning', 'danger']
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:24px;">
    <div v-for="color in colors" :key="color">
      <p style="font-size:12px;color:#64748b;margin-bottom:8px;font-family:sans-serif;text-transform:capitalize;">{{ color }}</p>
      <Stepper :color="color" :model-value="2" :total-steps="3">
        <StepperItem :step="1">
          <StepperIndicator>1</StepperIndicator>
          <StepperSeparator />
          <StepperContent><StepperTitle>Step one</StepperTitle></StepperContent>
        </StepperItem>
        <StepperItem :step="2">
          <StepperIndicator>2</StepperIndicator>
          <StepperSeparator />
          <StepperContent><StepperTitle>Step two</StepperTitle></StepperContent>
        </StepperItem>
        <StepperItem :step="3">
          <StepperIndicator>3</StepperIndicator>
          <StepperContent><StepperTitle>Step three</StepperTitle></StepperContent>
        </StepperItem>
      </Stepper>
    </div>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: () => ({
    components: { Stepper, StepperItem, StepperIndicator, StepperTitle, StepperContent, StepperSeparator },
    setup() {
      return { colors: ['default', 'primary', 'accent', 'success', 'warning', 'danger'] as const }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:24px;">
        <div v-for="color in colors" :key="color">
          <p style="font-size:12px;color:#64748b;margin-bottom:8px;font-family:sans-serif;text-transform:capitalize;">{{ color }}</p>
          <Stepper :color="color" :model-value="2" :total-steps="3">
            <StepperItem :step="1">
              <StepperIndicator>1</StepperIndicator>
              <StepperSeparator />
              <StepperContent><StepperTitle>Step one</StepperTitle></StepperContent>
            </StepperItem>
            <StepperItem :step="2">
              <StepperIndicator>2</StepperIndicator>
              <StepperSeparator />
              <StepperContent><StepperTitle>Step two</StepperTitle></StepperContent>
            </StepperItem>
            <StepperItem :step="3">
              <StepperIndicator>3</StepperIndicator>
              <StepperContent><StepperTitle>Step three</StepperTitle></StepperContent>
            </StepperItem>
          </Stepper>
        </div>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperTitle,
  StepperContent,
  StepperSeparator,
} from '@auronui/vue'

const sizes = ['sm', 'md', 'lg']
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:32px;">
    <div v-for="size in sizes" :key="size">
      <p style="font-size:12px;color:#64748b;margin-bottom:8px;font-family:sans-serif;">size="{{ size }}"</p>
      <Stepper :size="size" :model-value="2" :total-steps="3">
        <StepperItem :step="1">
          <StepperIndicator>1</StepperIndicator>
          <StepperSeparator />
          <StepperContent><StepperTitle>Account</StepperTitle></StepperContent>
        </StepperItem>
        <StepperItem :step="2">
          <StepperIndicator>2</StepperIndicator>
          <StepperSeparator />
          <StepperContent><StepperTitle>Profile</StepperTitle></StepperContent>
        </StepperItem>
        <StepperItem :step="3">
          <StepperIndicator>3</StepperIndicator>
          <StepperContent><StepperTitle>Done</StepperTitle></StepperContent>
        </StepperItem>
      </Stepper>
    </div>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: () => ({
    components: { Stepper, StepperItem, StepperIndicator, StepperTitle, StepperContent, StepperSeparator },
    setup() {
      return { sizes: ['sm', 'md', 'lg'] as const }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:32px;">
        <div v-for="size in sizes" :key="size">
          <p style="font-size:12px;color:#64748b;margin-bottom:8px;font-family:sans-serif;">size="{{ size }}"</p>
          <Stepper :size="size" :model-value="2" :total-steps="3">
            <StepperItem :step="1">
              <StepperIndicator>1</StepperIndicator>
              <StepperSeparator />
              <StepperContent><StepperTitle>Account</StepperTitle></StepperContent>
            </StepperItem>
            <StepperItem :step="2">
              <StepperIndicator>2</StepperIndicator>
              <StepperSeparator />
              <StepperContent><StepperTitle>Profile</StepperTitle></StepperContent>
            </StepperItem>
            <StepperItem :step="3">
              <StepperIndicator>3</StepperIndicator>
              <StepperContent><StepperTitle>Done</StepperTitle></StepperContent>
            </StepperItem>
          </Stepper>
        </div>
      </div>
    `,
  }),
}

export const WithIcons: Story = {
  args: { orientation: 'horizontal', color: 'primary' },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperTitle,
  StepperDescription,
  StepperContent,
  StepperSeparator,
} from '@auronui/vue'

const currentStep = ref(3)
</script>

<template>
  <Stepper v-model="currentStep" :total-steps="3" orientation="horizontal" color="primary">
    <StepperItem :step="1">
      <StepperIndicator>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </StepperIndicator>
      <StepperSeparator />
      <StepperContent>
        <StepperTitle>Account</StepperTitle>
        <StepperDescription>Personal info</StepperDescription>
      </StepperContent>
    </StepperItem>
    <StepperItem :step="2">
      <StepperIndicator>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg>
      </StepperIndicator>
      <StepperSeparator />
      <StepperContent>
        <StepperTitle>Payment</StepperTitle>
        <StepperDescription>Billing details</StepperDescription>
      </StepperContent>
    </StepperItem>
    <StepperItem :step="3">
      <StepperIndicator>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </StepperIndicator>
      <StepperContent>
        <StepperTitle>Confirm</StepperTitle>
        <StepperDescription>Review & submit</StepperDescription>
      </StepperContent>
    </StepperItem>
  </Stepper>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Stepper, StepperItem, StepperIndicator, StepperTitle, StepperDescription, StepperContent, StepperSeparator },
    setup() {
      const currentStep = ref(3)
      return { args, currentStep }
    },
    template: `
      <Stepper v-bind="args" v-model="currentStep" :total-steps="3">
        <StepperItem :step="1">
          <StepperIndicator>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </StepperIndicator>
          <StepperSeparator />
          <StepperContent>
            <StepperTitle>Account</StepperTitle>
            <StepperDescription>Personal info</StepperDescription>
          </StepperContent>
        </StepperItem>
        <StepperItem :step="2">
          <StepperIndicator>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg>
          </StepperIndicator>
          <StepperSeparator />
          <StepperContent>
            <StepperTitle>Payment</StepperTitle>
            <StepperDescription>Billing details</StepperDescription>
          </StepperContent>
        </StepperItem>
        <StepperItem :step="3">
          <StepperIndicator>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </StepperIndicator>
          <StepperContent>
            <StepperTitle>Confirm</StepperTitle>
            <StepperDescription>Review & submit</StepperDescription>
          </StepperContent>
        </StepperItem>
      </Stepper>
    `,
  }),
}

export const CustomStyles: Story = {
  name: 'Custom styles via classNames',
  args: { orientation: 'horizontal', size: 'md', color: 'primary' },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperTitle,
  StepperDescription,
  StepperContent,
  StepperSeparator,
} from '@auronui/vue'

const currentStep = ref(2)
const steps = [
  { label: 'Account', description: 'Create your account' },
  { label: 'Profile', description: 'Set up your profile' },
  { label: 'Review', description: 'Review your details' },
  { label: 'Done', description: "You're all set!" },
]
</script>

<template>
  <Stepper
    v-model="currentStep"
    :total-steps="steps.length"
    orientation="horizontal"
    size="md"
    color="primary"
    :class-names="{
      base: 'border-l-4 border-blue-500 pl-4',
    }"
  >
    <StepperItem
      v-for="(step, index) in steps"
      :key="index"
      :step="index + 1"
      :class-names="{
        item: 'bg-slate-50 rounded-lg px-4 py-3',
      }"
    >
      <StepperIndicator>{{ index + 1 }}</StepperIndicator>
      <StepperSeparator v-if="index < steps.length - 1" />
      <StepperContent
        :class-names="{
          content: 'text-blue-700 font-semibold',
        }"
      >
        <StepperTitle>{{ step.label }}</StepperTitle>
        <StepperDescription>{{ step.description }}</StepperDescription>
      </StepperContent>
    </StepperItem>
  </Stepper>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Stepper, StepperItem, StepperIndicator, StepperTitle, StepperDescription, StepperContent, StepperSeparator },
    setup() {
      const currentStep = ref(2)
      return { args, currentStep, steps }
    },
    template: `
      <Stepper
        v-bind="args"
        v-model="currentStep"
        :total-steps="steps.length"
        :class-names="{
          base: 'border-l-4 border-blue-500 pl-4',
        }"
      >
        <StepperItem
          v-for="(step, index) in steps"
          :key="index"
          :step="index + 1"
          :class-names="{
            item: 'bg-slate-50 rounded-lg px-4 py-3',
          }"
        >
          <StepperIndicator>{{ index + 1 }}</StepperIndicator>
          <StepperSeparator v-if="index < steps.length - 1" />
          <StepperContent
            :class-names="{
              content: 'text-blue-700 font-semibold',
            }"
          >
            <StepperTitle>{{ step.label }}</StepperTitle>
            <StepperDescription>{{ step.description }}</StepperDescription>
          </StepperContent>
        </StepperItem>
      </Stepper>
    `,
  }),
}

export const ArrayAPI: Story = {
  name: 'Array API (items prop)',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Stepper } from '@auronui/vue'

const currentStep = ref(2)
</script>

<template>
  <Stepper
    v-model="currentStep"
    :items="[
      { title: 'Account', description: 'Create your account' },
      { title: 'Profile', description: 'Set up your profile' },
      { title: 'Review', description: 'Review your details' },
      { title: 'Done', description: 'You are all set!' },
    ]"
  />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Stepper },
    setup() {
      const currentStep = ref(2)
      return { args, currentStep }
    },
    template: `
      <Stepper v-bind="args" v-model="currentStep" :items="[
        { title: 'Account', description: 'Create your account' },
        { title: 'Profile', description: 'Set up your profile' },
        { title: 'Review', description: 'Review your details' },
        { title: 'Done', description: 'You are all set!' },
      ]" />
    `,
  }),
}
