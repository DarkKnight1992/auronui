import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Button, ButtonGroup } from '@auronui/vue'
import { ref } from 'vue'

const meta: Meta = {
  title: 'Components/ButtonGroup',
  tags: ['autodocs'],
  component: ButtonGroup,
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'default', 'bordered', 'ghost', 'soft'],
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'accent', 'success', 'warning', 'danger'],
    },
    classNames: {
      control: 'object',
      description: 'Per-slot class overrides. Keys match the component anatomy slot names.',
    },
  },
}

export default meta
type Story = StoryObj

export const HorizontalDefault: Story = {
  args: {
    variant: 'bordered',
  },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ButtonGroup, Button } from '@auronui/vue'
</script>

<template>
  <ButtonGroup orientation="horizontal" variant="bordered">
    <Button>One</Button>
    <Button>Two</Button>
    <Button>Three</Button>
  </ButtonGroup>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Button, ButtonGroup },
    setup: () => ({ args }),
    template: `
      <ButtonGroup v-bind="args" orientation="horizontal">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
    `,
  }),
}

export const VerticalGroup: Story = {
  args: {
    variant: 'bordered',
  },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ButtonGroup, Button } from '@auronui/vue'
</script>

<template>
  <ButtonGroup orientation="vertical" variant="bordered">
    <Button>Top</Button>
    <Button>Middle</Button>
    <Button>Bottom</Button>
  </ButtonGroup>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Button, ButtonGroup },
    setup: () => ({ args }),
    template: `
      <ButtonGroup v-bind="args" orientation="vertical">
        <Button>Top</Button>
        <Button>Middle</Button>
        <Button>Bottom</Button>
      </ButtonGroup>
    `,
  }),
}

export const VariantPropagation: Story = {
  parameters: {
    controls: { exclude: ['variant'] },
    docs: {
      source: {
        code: `<script setup>
import { ButtonGroup, Button } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:16px">
    <ButtonGroup variant="success">
      <Button>A</Button>
      <Button>B</Button>
      <Button variant="danger">Override</Button>
    </ButtonGroup>
    <ButtonGroup variant="warning">
      <Button>X</Button>
      <Button>Y</Button>
    </ButtonGroup>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: () => ({
    components: { Button, ButtonGroup },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px">
        <ButtonGroup variant="success">
          <Button>A</Button>
          <Button>B</Button>
          <Button variant="danger">Override</Button>
        </ButtonGroup>
        <ButtonGroup variant="warning">
          <Button>X</Button>
          <Button>Y</Button>
        </ButtonGroup>
      </div>
    `,
  }),
}

export const GroupDisabled: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ButtonGroup, Button } from '@auronui/vue'
import { ref } from 'vue'

const disabled = ref(false)
</script>

<template>
  <div>
    <Button variant="flat" style="margin-bottom:16px" @click="disabled = !disabled">
      Toggle Group Disabled (currently: {{ disabled }})
    </Button>
    <ButtonGroup :disabled="disabled">
      <Button>Save</Button>
      <Button>Discard</Button>
      <Button>Cancel</Button>
    </ButtonGroup>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Button, ButtonGroup },
    setup() {
      const disabled = ref(false)
      return { args, disabled }
    },
    template: `
      <div>
        <Button variant="flat" style="margin-bottom:16px" @click="disabled = !disabled">
          Toggle Group Disabled (currently: {{ disabled }})
        </Button>
        <ButtonGroup v-bind="args" :disabled="disabled">
          <Button>Save</Button>
          <Button>Discard</Button>
          <Button>Cancel</Button>
        </ButtonGroup>
      </div>
    `,
  }),
}

export const DisabledHorizontal: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ButtonGroup, Button } from '@auronui/vue'
</script>

<template>
  <ButtonGroup orientation="horizontal" :disabled="true">
    <Button>One</Button>
    <Button>Two</Button>
    <Button>Three</Button>
  </ButtonGroup>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Button, ButtonGroup },
    setup: () => ({ args }),
    template: `
      <ButtonGroup v-bind="args" orientation="horizontal" :disabled="true">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
    `,
  }),
}

export const DisabledVertical: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ButtonGroup, Button } from '@auronui/vue'
</script>

<template>
  <ButtonGroup orientation="vertical" :disabled="true">
    <Button>Top</Button>
    <Button>Bottom</Button>
  </ButtonGroup>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Button, ButtonGroup },
    setup: () => ({ args }),
    template: `
      <ButtonGroup v-bind="args" orientation="vertical" :disabled="true">
        <Button>Top</Button>
        <Button>Bottom</Button>
      </ButtonGroup>
    `,
  }),
}

export const SelectableVertical: Story = {
  parameters: {
    controls: { exclude: ['variant'] },
    docs: {
      source: {
        code: `<script setup>
import { ButtonGroup, Button } from '@auronui/vue'
import { ref } from 'vue'

const selected = ref('middle')
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <ButtonGroup orientation="vertical" variant="bordered" v-model="selected">
      <Button value="top">Top</Button>
      <Button value="middle">Middle</Button>
      <Button value="bottom">Bottom</Button>
    </ButtonGroup>
    <div>Selected: {{ selected }}</div>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Button, ButtonGroup },
    setup() {
      const selected = ref<string>('middle')
      return { args, selected }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px">
        <ButtonGroup v-bind="args" orientation="vertical" variant="bordered" v-model="selected">
          <Button value="top">Top</Button>
          <Button value="middle">Middle</Button>
          <Button value="bottom">Bottom</Button>
        </ButtonGroup>
        <div>Selected: {{ selected }}</div>
      </div>
    `,
  }),
}

export const SelectableHorizontal: Story = {
  parameters: {
    controls: { exclude: ['variant'] },
    docs: {
      source: {
        code: `<script setup>
import { ButtonGroup, Button } from '@auronui/vue'
import { ref } from 'vue'

const selected = ref(null)
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <ButtonGroup orientation="horizontal" variant="bordered" v-model="selected">
      <Button value="left">Left</Button>
      <Button value="center">Center</Button>
      <Button value="right">Right</Button>
    </ButtonGroup>
    <div>Selected: {{ selected ?? 'none' }}</div>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Button, ButtonGroup },
    setup() {
      const selected = ref<string | null>(null)
      return { args, selected }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px">
        <ButtonGroup v-bind="args" orientation="horizontal" variant="bordered" v-model="selected">
          <Button value="left">Left</Button>
          <Button value="center">Center</Button>
          <Button value="right">Right</Button>
        </ButtonGroup>
        <div>Selected: {{ selected ?? 'none' }}</div>
      </div>
    `,
  }),
}

export const MultiSelect: Story = {
  parameters: {
    controls: { exclude: ['variant'] },
    docs: {
      source: {
        code: `<script setup>
import { ButtonGroup, Button } from '@auronui/vue'
import { ref } from 'vue'

const selected = ref(['bold', 'italic'])
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <ButtonGroup variant="bordered" selection-mode="multiple" v-model="selected">
      <Button value="bold">Bold</Button>
      <Button value="italic">Italic</Button>
      <Button value="underline">Underline</Button>
      <Button value="strike">Strike</Button>
    </ButtonGroup>
    <div>Selected: {{ selected.join(', ') || 'none' }}</div>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Button, ButtonGroup },
    setup() {
      const selected = ref<string[]>(['bold', 'italic'])
      return { args, selected }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px">
        <ButtonGroup v-bind="args" variant="bordered" selection-mode="multiple" v-model="selected">
          <Button value="bold">Bold</Button>
          <Button value="italic">Italic</Button>
          <Button value="underline">Underline</Button>
          <Button value="strike">Strike</Button>
        </ButtonGroup>
        <div>Selected: {{ selected.join(', ') || 'none' }}</div>
      </div>
    `,
  }),
}

export const MultiSelectVertical: Story = {
  parameters: {
    controls: { exclude: ['variant'] },
    docs: {
      source: {
        code: `<script setup>
import { ButtonGroup, Button } from '@auronui/vue'
import { ref } from 'vue'

const selected = ref([])
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <ButtonGroup orientation="vertical" variant="bordered" selection-mode="multiple" v-model="selected">
      <Button value="email">Email</Button>
      <Button value="sms">SMS</Button>
      <Button value="push">Push</Button>
    </ButtonGroup>
    <div>Channels: {{ selected.join(', ') || 'none' }}</div>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Button, ButtonGroup },
    setup() {
      const selected = ref<string[]>([])
      return { args, selected }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px">
        <ButtonGroup v-bind="args" orientation="vertical" variant="bordered" selection-mode="multiple" v-model="selected">
          <Button value="email">Email</Button>
          <Button value="sms">SMS</Button>
          <Button value="push">Push</Button>
        </ButtonGroup>
        <div>Channels: {{ selected.join(', ') || 'none' }}</div>
      </div>
    `,
  }),
}

export const CustomStyles: Story = {
  name: 'Custom styles via classNames',
  args: {
    variant: 'bordered',
  },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ButtonGroup, Button } from '@auronui/vue'
</script>

<template>
  <ButtonGroup
    orientation="horizontal"
    variant="bordered"
    :class-names="{
      base: 'border-2 border-blue-500 rounded-xl bg-blue-50 p-2',
    }"
  >
    <Button>Option One</Button>
    <Button>Option Two</Button>
    <Button>Option Three</Button>
  </ButtonGroup>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Button, ButtonGroup },
    setup: () => ({ args }),
    template: `
      <ButtonGroup
        v-bind="args"
        orientation="horizontal"
        :class-names="{
          base: 'border-2 border-blue-500 rounded-xl bg-blue-50 p-2',
        }"
      >
        <Button>Option One</Button>
        <Button>Option Two</Button>
        <Button>Option Three</Button>
      </ButtonGroup>
    `,
  }),
}

export const ArrayAPI: Story = {
  name: 'Array API (buttons prop)',
  parameters: {
    controls: { exclude: ['variant'] },
    docs: {
      source: {
        code: `<script setup>
import { ButtonGroup } from '@auronui/vue'
</script>

<template>
  <ButtonGroup
    :buttons="[
      { label: 'Cut', value: 'cut' },
      { label: 'Copy', value: 'copy' },
      { label: 'Paste', value: 'paste' },
    ]"
  />

  <ButtonGroup
    variant="bordered"
    :buttons="[
      { label: 'Day', value: 'day' },
      { label: 'Week', value: 'week' },
      { label: 'Month', value: 'month' },
      { label: 'Year', value: 'year', disabled: true },
    ]"
  />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ButtonGroup },
    setup() { return { args } },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px">
        <ButtonGroup v-bind="args" :buttons="[
          { label: 'Cut', value: 'cut' },
          { label: 'Copy', value: 'copy' },
          { label: 'Paste', value: 'paste' },
        ]" />
        <ButtonGroup v-bind="args" variant="bordered" :buttons="[
          { label: 'Day', value: 'day' },
          { label: 'Week', value: 'week' },
          { label: 'Month', value: 'month' },
          { label: 'Year', value: 'year', disabled: true },
        ]" />
      </div>
    `,
  }),
}
