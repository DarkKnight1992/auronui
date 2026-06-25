import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Button, ToggleButton, ToggleButtonGroup } from '@auronui/vue'
import { ref } from 'vue'

const meta: Meta = {
  title: 'Components/ToggleButton',
  tags: ['autodocs'],
  component: ToggleButton,
}

export default meta
type Story = StoryObj

// 1. Default (unpressed)
export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { ToggleButton } from '@auronui/vue'

const pressed = ref(false)
</script>

<template>
  <ToggleButton v-model="pressed" aria-label="Toggle bold">Bold</ToggleButton>
</template>`,
        type: 'code',
        language: 'vue',
      }
    }
  },

  render: (args) => ({
    components: { ToggleButton },
    setup() {
      const pressed = ref(false)
      return { args, pressed }
    },
    template: `
      <div>
        <ToggleButton v-bind="args" v-model="pressed" aria-label="Toggle bold">Bold</ToggleButton>
        <p style="margin-top:8px;font-size:12px">pressed: {{ pressed }}</p>
      </div>
    `,
  }),
}

// 2. Pressed (default-on)
export const Pressed: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { ToggleButton } from '@auronui/vue'

const pressed = ref(true)
</script>

<template>
  <div>
    <ToggleButton v-model="pressed" aria-label="Toggle bold">Bold (starts pressed)</ToggleButton>
    <p style="margin-top:8px;font-size:12px">pressed: {{ pressed }}</p>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ToggleButton },
    setup() {
      const pressed = ref(true)
      return { args, pressed }
    },
    template: `
      <div>
        <ToggleButton v-bind="args" v-model="pressed" aria-label="Toggle bold">Bold (starts pressed)</ToggleButton>
        <p style="margin-top:8px;font-size:12px">pressed: {{ pressed }}</p>
      </div>
    `,
  }),
}

// 3. Disabled
export const Disabled: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ToggleButton } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;gap:8px">
    <ToggleButton :disabled="true" aria-label="Disabled unpressed">Disabled</ToggleButton>
    <ToggleButton :disabled="true" :model-value="true" aria-label="Disabled pressed">Disabled + Pressed</ToggleButton>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ToggleButton },
    setup: () => ({ args }),
    template: `
      <div style="display:flex;gap:8px">
        <ToggleButton v-bind="args" :disabled="true" aria-label="Disabled unpressed">Disabled</ToggleButton>
        <ToggleButton v-bind="args" :disabled="true" :model-value="true" aria-label="Disabled pressed">Disabled + Pressed</ToggleButton>
      </div>
    `,
  }),
}

// 4. AllSizes
export const AllSizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { ToggleButton } from '@auronui/vue'

const sm = ref(false)
const md = ref(false)
const lg = ref(false)
</script>

<template>
  <div style="display:flex;align-items:center;gap:8px">
    <ToggleButton v-model="sm" size="sm" aria-label="Small">Small</ToggleButton>
    <ToggleButton v-model="md" size="md" aria-label="Medium">Medium</ToggleButton>
    <ToggleButton v-model="lg" size="lg" aria-label="Large">Large</ToggleButton>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ToggleButton },
    setup() {
      const sm = ref(false)
      const md = ref(false)
      const lg = ref(false)
      return { args, sm, md, lg }
    },
    template: `
      <div style="display:flex;align-items:center;gap:8px">
        <ToggleButton v-bind="args" v-model="sm" size="sm" aria-label="Small">Small</ToggleButton>
        <ToggleButton v-bind="args" v-model="md" size="md" aria-label="Medium">Medium</ToggleButton>
        <ToggleButton v-bind="args" v-model="lg" size="lg" aria-label="Large">Large</ToggleButton>
      </div>
    `,
  }),
}

// 5. AllVariants
export const AllVariants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { ToggleButton } from '@auronui/vue'

const a = ref(false)
const b = ref(false)
</script>

<template>
  <div style="display:flex;gap:8px">
    <ToggleButton v-model="a" variant="default" aria-label="Default variant">Default</ToggleButton>
    <ToggleButton v-model="b" variant="ghost" aria-label="Ghost variant">Ghost</ToggleButton>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ToggleButton },
    setup() {
      const a = ref(false)
      const b = ref(false)
      return { args, a, b }
    },
    template: `
      <div style="display:flex;gap:8px">
        <ToggleButton v-bind="args" v-model="a" variant="default" aria-label="Default variant">Default</ToggleButton>
        <ToggleButton v-bind="args" v-model="b" variant="ghost" aria-label="Ghost variant">Ghost</ToggleButton>
      </div>
    `,
  }),
}

// 6. IconOnly
export const IconOnly: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { ToggleButton } from '@auronui/vue'

const b = ref(false)
const i = ref(false)
const u = ref(false)
</script>

<template>
  <div style="display:flex;gap:8px">
    <ToggleButton v-model="b" :isIconOnly="true" aria-label="Bold">B</ToggleButton>
    <ToggleButton v-model="i" :isIconOnly="true" aria-label="Italic">I</ToggleButton>
    <ToggleButton v-model="u" :isIconOnly="true" aria-label="Underline">U</ToggleButton>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ToggleButton },
    setup() {
      const b = ref(false)
      const i = ref(false)
      const u = ref(false)
      return { args, b, i, u }
    },
    template: `
      <div style="display:flex;gap:8px">
        <ToggleButton v-bind="args" v-model="b" :isIconOnly="true" aria-label="Bold">B</ToggleButton>
        <ToggleButton v-bind="args" v-model="i" :isIconOnly="true" aria-label="Italic">I</ToggleButton>
        <ToggleButton v-bind="args" v-model="u" :isIconOnly="true" aria-label="Underline">U</ToggleButton>
      </div>
    `,
  }),
}

// 7. Group Single Selection (v-model)
export const GroupSingleSelection: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { ToggleButton, ToggleButtonGroup } from '@auronui/vue'

const selected = ref('left')
</script>

<template>
  <div>
    <ToggleButtonGroup selectionMode="single" v-model="selected" orientation="horizontal">
      <ToggleButton value="left" aria-label="Left align">Left</ToggleButton>
      <ToggleButton value="center" aria-label="Center align">Center</ToggleButton>
      <ToggleButton value="right" aria-label="Right align">Right</ToggleButton>
    </ToggleButtonGroup>
    <p style="margin-top:8px;font-size:12px">selected: {{ selected }}</p>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ToggleButton, ToggleButtonGroup },
    setup() {
      const selected = ref('left')
      return { args, selected }
    },
    template: `
      <div>
        <ToggleButtonGroup selectionMode="single" v-model="selected" orientation="horizontal">
          <ToggleButton v-bind="args" value="left" aria-label="Left align">Left</ToggleButton>
          <ToggleButton v-bind="args" value="center" aria-label="Center align">Center</ToggleButton>
          <ToggleButton v-bind="args" value="right" aria-label="Right align">Right</ToggleButton>
        </ToggleButtonGroup>
        <p style="margin-top:8px;font-size:12px">selected: {{ selected }}</p>
      </div>
    `,
  }),
}

// 8. Group Multiple Selection (v-model)
export const GroupMultipleSelection: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { ToggleButton, ToggleButtonGroup } from '@auronui/vue'

const selected = ref(['bold'])
</script>

<template>
  <div>
    <ToggleButtonGroup selectionMode="multiple" v-model="selected" orientation="horizontal">
      <ToggleButton value="bold" aria-label="Bold">B</ToggleButton>
      <ToggleButton value="italic" aria-label="Italic">I</ToggleButton>
      <ToggleButton value="underline" aria-label="Underline">U</ToggleButton>
      <ToggleButton value="strikethrough" aria-label="Strikethrough">S</ToggleButton>
    </ToggleButtonGroup>
    <p style="margin-top:8px;font-size:12px">selected: {{ selected }}</p>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ToggleButton, ToggleButtonGroup },
    setup() {
      const selected = ref(['bold'])
      return { args, selected }
    },
    template: `
      <div>
        <ToggleButtonGroup selectionMode="multiple" v-model="selected" orientation="horizontal">
          <ToggleButton v-bind="args" value="bold" aria-label="Bold">B</ToggleButton>
          <ToggleButton v-bind="args" value="italic" aria-label="Italic">I</ToggleButton>
          <ToggleButton v-bind="args" value="underline" aria-label="Underline">U</ToggleButton>
          <ToggleButton v-bind="args" value="strikethrough" aria-label="Strikethrough">S</ToggleButton>
        </ToggleButtonGroup>
        <p style="margin-top:8px;font-size:12px">selected: {{ selected }}</p>
      </div>
    `,
  }),
}

// 9. Group Disabled (group disabled wins over child)
export const GroupDisabled: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Button, ToggleButton, ToggleButtonGroup } from '@auronui/vue'

const disabled = ref(false)
const selected = ref('a')
</script>

<template>
  <div>
    <Button variant="flat" style="margin-bottom:16px" @click="disabled = !disabled">
      Toggle Group Disabled (currently: {{ disabled }})
    </Button>
    <ToggleButtonGroup selectionMode="single" v-model="selected" :disabled="disabled">
      <ToggleButton value="a" aria-label="Option A">Option A</ToggleButton>
      <ToggleButton value="b" aria-label="Option B">Option B</ToggleButton>
      <ToggleButton value="c" aria-label="Option C" :disabled="false">Child not disabled</ToggleButton>
    </ToggleButtonGroup>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Button, ToggleButton, ToggleButtonGroup },
    setup() {
      const disabled = ref(false)
      const selected = ref('a')
      return { args, disabled, selected }
    },
    template: `
      <div>
        <Button variant="flat" style="margin-bottom:16px" @click="disabled = !disabled">
          Toggle Group Disabled (currently: {{ disabled }})
        </Button>
        <ToggleButtonGroup selectionMode="single" v-model="selected" :disabled="disabled">
          <ToggleButton v-bind="args" value="a" aria-label="Option A">Option A</ToggleButton>
          <ToggleButton v-bind="args" value="b" aria-label="Option B">Option B</ToggleButton>
          <ToggleButton v-bind="args" value="c" aria-label="Option C" :disabled="false">Child not disabled</ToggleButton>
        </ToggleButtonGroup>
      </div>
    `,
  }),
}

// 10. Group Vertical
export const GroupVertical: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { ToggleButton, ToggleButtonGroup } from '@auronui/vue'

const selected = ref('top')
</script>

<template>
  <div>
    <ToggleButtonGroup selectionMode="single" v-model="selected" orientation="vertical">
      <ToggleButton value="top" aria-label="Top">Top</ToggleButton>
      <ToggleButton value="middle" aria-label="Middle">Middle</ToggleButton>
      <ToggleButton value="bottom" aria-label="Bottom">Bottom</ToggleButton>
    </ToggleButtonGroup>
    <p style="margin-top:8px;font-size:12px">selected: {{ selected }}</p>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ToggleButton, ToggleButtonGroup },
    setup() {
      const selected = ref('top')
      return { args, selected }
    },
    template: `
      <div>
        <ToggleButtonGroup selectionMode="single" v-model="selected" orientation="vertical">
          <ToggleButton v-bind="args" value="top" aria-label="Top">Top</ToggleButton>
          <ToggleButton v-bind="args" value="middle" aria-label="Middle">Middle</ToggleButton>
          <ToggleButton v-bind="args" value="bottom" aria-label="Bottom">Bottom</ToggleButton>
        </ToggleButtonGroup>
        <p style="margin-top:8px;font-size:12px">selected: {{ selected }}</p>
      </div>
    `,
  }),
}

// 11. Detached Group
export const DetachedGroup: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { ToggleButton, ToggleButtonGroup } from '@auronui/vue'

const selected = ref<string[]>([])
</script>

<template>
  <div>
    <ToggleButtonGroup selectionMode="multiple" v-model="selected" :isDetached="true">
      <ToggleButton value="left" aria-label="Left">Left</ToggleButton>
      <ToggleButton value="center" aria-label="Center">Center</ToggleButton>
      <ToggleButton value="right" aria-label="Right">Right</ToggleButton>
    </ToggleButtonGroup>
    <p style="margin-top:8px;font-size:12px">selected: {{ selected }}</p>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ToggleButton, ToggleButtonGroup },
    setup() {
      const selected = ref<string[]>([])
      return { args, selected }
    },
    template: `
      <div>
        <ToggleButtonGroup selectionMode="multiple" v-model="selected" :isDetached="true">
          <ToggleButton v-bind="args" value="left" aria-label="Left">Left</ToggleButton>
          <ToggleButton v-bind="args" value="center" aria-label="Center">Center</ToggleButton>
          <ToggleButton v-bind="args" value="right" aria-label="Right">Right</ToggleButton>
        </ToggleButtonGroup>
        <p style="margin-top:8px;font-size:12px">selected: {{ selected }}</p>
      </div>
    `,
  }),
}

export const GroupArrayAPI: Story = {
  name: 'Group: Array API (buttons prop)',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { ToggleButtonGroup } from '@auronui/vue'

const selected = ref(['bold'])
</script>

<template>
  <ToggleButtonGroup
    v-model="selected"
    selection-mode="multiple"
    :buttons="[
      { value: 'bold', label: 'Bold' },
      { value: 'italic', label: 'Italic' },
      { value: 'underline', label: 'Underline' },
      { value: 'strike', label: 'Strike', disabled: true },
    ]"
  />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { ToggleButtonGroup },
    setup() {
      const selected = ref(['bold'])
      return { args, selected }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px">
        <ToggleButtonGroup v-bind="args" v-model="selected" selection-mode="multiple" :buttons="[
          { value: 'bold', label: 'Bold' },
          { value: 'italic', label: 'Italic' },
          { value: 'underline', label: 'Underline' },
          { value: 'strike', label: 'Strike', disabled: true },
        ]" />
      </div>
    `,
  }),
}
