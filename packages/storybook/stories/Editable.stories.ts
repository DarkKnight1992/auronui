import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import {
  Editable,
  EditableArea,
  EditablePreview,
  EditableInput,
  EditableEditTrigger,
  EditableSubmitTrigger,
  EditableCancelTrigger,
} from '@auronui/vue'

const meta: Meta = {
  title: 'Components/Editable',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    activationMode: {
      control: 'select',
      options: ['focus', 'dblclick', 'none'],
      description: 'How the field enters edit mode.',
      table: { category: 'Editable', defaultValue: { summary: 'focus' } },
    },
    submitMode: {
      control: 'select',
      options: ['blur', 'enter', 'none', 'both'],
      description: 'How the edited value is submitted.',
      table: { category: 'Editable', defaultValue: { summary: 'blur' } },
    },
    disabled: {
      control: 'boolean',
      table: { category: 'Editable', defaultValue: { summary: 'false' } },
    },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  args: {
    activationMode: 'focus',
    submitMode: 'blur',
    disabled: false,
  },
  render: (args) => ({
    components: { Editable, EditableArea, EditablePreview, EditableInput },
    setup: () => ({ args }),
    template: `
      <Editable default-value="Click to edit" :activation-mode="args.activationMode" :submit-mode="args.submitMode" :disabled="args.disabled">
        <EditableArea>
          <EditablePreview />
          <EditableInput />
        </EditableArea>
      </Editable>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Editable, EditableArea, EditablePreview, EditableInput } from '@auronui/vue'
</script>

<template>
  <Editable default-value="Click to edit">
    <EditableArea>
      <EditablePreview />
      <EditableInput />
    </EditableArea>
  </Editable>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
}

export const WithTriggers: Story = {
  render: (args) => ({
    components: {
      Editable, EditableArea, EditablePreview, EditableInput,
      EditableEditTrigger, EditableSubmitTrigger, EditableCancelTrigger,
    },
    setup: () => ({ args }),
    template: `
      <Editable default-value="Hover then click the pencil" activation-mode="none">
        <EditableArea>
          <EditablePreview />
          <EditableInput />
        </EditableArea>
        <EditableEditTrigger />
        <EditableSubmitTrigger />
        <EditableCancelTrigger />
      </Editable>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  Editable, EditableArea, EditablePreview, EditableInput,
  EditableEditTrigger, EditableSubmitTrigger, EditableCancelTrigger,
} from '@auronui/vue'
</script>

<template>
  <Editable default-value="Hover then click the pencil" activation-mode="none">
    <EditableArea>
      <EditablePreview />
      <EditableInput />
    </EditableArea>
    <EditableEditTrigger />
    <EditableSubmitTrigger />
    <EditableCancelTrigger />
  </Editable>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const DoubleClickToEdit: Story = {
  render: (args) => ({
    components: { Editable, EditableArea, EditablePreview, EditableInput },
    setup: () => ({ args }),
    template: `
      <Editable default-value="Double-click to edit" activation-mode="dblclick">
        <EditableArea>
          <EditablePreview />
          <EditableInput />
        </EditableArea>
      </Editable>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Editable, EditableArea, EditablePreview, EditableInput } from '@auronui/vue'
</script>

<template>
  <Editable default-value="Double-click to edit" activation-mode="dblclick">
    <EditableArea>
      <EditablePreview />
      <EditableInput />
    </EditableArea>
  </Editable>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const Controlled: Story = {
  render: (args) => ({
    components: { Editable, EditableArea, EditablePreview, EditableInput },
    setup() {
      const value = ref('Controlled value')
      return { args, value }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; align-items: center;">
        <p style="margin: 0; font-size: 13px;">Current value: <strong>{{ value }}</strong></p>
        <Editable v-model="value">
          <EditableArea>
            <EditablePreview />
            <EditableInput />
          </EditableArea>
        </Editable>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Editable, EditableArea, EditablePreview, EditableInput } from '@auronui/vue'

const value = ref('Controlled value')
</script>

<template>
  <Editable v-model="value">
    <EditableArea>
      <EditablePreview />
      <EditableInput />
    </EditableArea>
  </Editable>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const Disabled: Story = {
  render: (args) => ({
    components: { Editable, EditableArea, EditablePreview, EditableInput },
    setup: () => ({ args }),
    template: `
      <Editable default-value="Cannot edit this" :disabled="true">
        <EditableArea>
          <EditablePreview />
          <EditableInput />
        </EditableArea>
      </Editable>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Editable, EditableArea, EditablePreview, EditableInput } from '@auronui/vue'
</script>

<template>
  <Editable default-value="Cannot edit this" :disabled="true">
    <EditableArea>
      <EditablePreview />
      <EditableInput />
    </EditableArea>
  </Editable>
</template>`,
        language: 'vue',
      },
    },
  },
}
