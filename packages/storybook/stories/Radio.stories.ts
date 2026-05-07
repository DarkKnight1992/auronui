import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Radio, RadioGroup } from '@auronui/vue'
import { ref } from 'vue'

const meta: Meta = {
  title: 'Form/Radio',
  component: RadioGroup,
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: (args) => ({
    components: { Radio, RadioGroup },
    setup() {
      const selected = ref('')
      return { args, selected }
    },
    template: `
      <RadioGroup v-bind="args" v-model="selected" label="Choose a framework">
        <Radio value="vue">Vue</Radio>
        <Radio value="react">React</Radio>
        <Radio value="svelte">Svelte</Radio>
      </RadioGroup>
    `,
  }),
}

export const Preselected: Story = {
  render: (args) => ({
    components: { Radio, RadioGroup },
    setup() {
      const selected = ref('vue')
      return { args, selected }
    },
    template: `
      <RadioGroup v-bind="args" v-model="selected" label="Choose a framework">
        <Radio value="vue">Vue</Radio>
        <Radio value="react">React</Radio>
        <Radio value="svelte">Svelte</Radio>
      </RadioGroup>
    `,
  }),
}

export const WithLabel: Story = {
  render: (args) => ({
    components: { Radio, RadioGroup },
    setup() {
      const selected = ref('')
      return { args, selected }
    },
    template: `
      <RadioGroup v-bind="args" v-model="selected" label="Notification frequency">
        <Radio value="daily">Daily digest</Radio>
        <Radio value="weekly">Weekly summary</Radio>
        <Radio value="never">Never</Radio>
      </RadioGroup>
    `,
  }),
}

export const WithDescription: Story = {
  render: (args) => ({
    components: { Radio, RadioGroup },
    setup() {
      const selected = ref('standard')
      return { args, selected }
    },
    template: `
      <RadioGroup
        v-bind="args"
        v-model="selected"
        label="Shipping method"
        description="Select how you'd like your order shipped."
      >
        <Radio value="standard">Standard (5-7 days)</Radio>
        <Radio value="express">Express (2-3 days)</Radio>
        <Radio value="overnight">Overnight (next day)</Radio>
      </RadioGroup>
    `,
  }),
}

export const Horizontal: Story = {
  render: (args) => ({
    components: { Radio, RadioGroup },
    setup() {
      const selected = ref('md')
      return { args, selected }
    },
    template: `
      <RadioGroup v-bind="args" v-model="selected" orientation="horizontal" label="Pick a size">
        <Radio value="sm">S</Radio>
        <Radio value="md">M</Radio>
        <Radio value="lg">L</Radio>
        <Radio value="xl">XL</Radio>
      </RadioGroup>
    `,
  }),
}

export const DisabledGroup: Story = {
  render: (args) => ({
    components: { Radio, RadioGroup },
    setup() {
      const selected = ref('a')
      return { args, selected }
    },
    template: `
      <RadioGroup v-bind="args" v-model="selected" :disabled="true" label="Disabled group">
        <Radio value="a">Option A</Radio>
        <Radio value="b">Option B</Radio>
        <Radio value="c">Option C</Radio>
      </RadioGroup>
    `,
  }),
}

export const OneDisabledItem: Story = {
  render: (args) => ({
    components: { Radio, RadioGroup },
    setup() {
      const selected = ref('')
      return { args, selected }
    },
    template: `
      <RadioGroup v-bind="args" v-model="selected" label="Choose a plan">
        <Radio value="free">Free</Radio>
        <Radio value="pro" :disabled="true">Pro (unavailable)</Radio>
        <Radio value="enterprise">Enterprise</Radio>
      </RadioGroup>
    `,
  }),
}

export const VariantPrimary: Story = {
  render: (args) => ({
    components: { Radio, RadioGroup },
    setup() {
      const selected = ref('a')
      return { args, selected }
    },
    template: `
      <RadioGroup v-bind="args" v-model="selected" variant="primary" label="Primary variant">
        <Radio value="a">Option A</Radio>
        <Radio value="b">Option B</Radio>
      </RadioGroup>
    `,
  }),
}

export const VariantSecondary: Story = {
  render: (args) => ({
    components: { Radio, RadioGroup },
    setup() {
      const selected = ref('a')
      return { args, selected }
    },
    template: `
      <RadioGroup v-bind="args" v-model="selected" variant="secondary" label="Secondary variant">
        <Radio value="a">Option A</Radio>
        <Radio value="b">Option B</Radio>
      </RadioGroup>
    `,
  }),
}
