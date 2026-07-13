import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { FileUpload } from '@auronui/vue'

const meta: Meta<typeof FileUpload> = {
  title: 'Form/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  argTypes: {
    multiple: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    accept: { control: 'text' },
  },
  args: {
    multiple: false,
    isDisabled: false,
    isInvalid: false,
    isRequired: false,
  },
}

export default meta
type Story = StoryObj<typeof FileUpload>

export const Default: Story = {
  args: { label: 'Attachment' },
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { FileUpload } from '@auronui/vue'

const files = ref([])
</script>

<template>
  <FileUpload v-model="files" label="Attachment" />
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { FileUpload },
    setup() {
      const files = ref([])
      return { args, files }
    },
    template: '<div style="width: 360px;"><FileUpload v-bind="args" v-model="files" /></div>',
  }),
}

export const Multiple: Story = {
  args: { label: 'Attachments', multiple: true, description: 'Up to 5 files' },
  render: (args) => ({
    components: { FileUpload },
    setup() {
      const files = ref([])
      return { args, files }
    },
    template: '<div style="width: 360px;"><FileUpload v-bind="args" v-model="files" :max-files="5" /></div>',
  }),
}

export const AcceptImagesOnly: Story = {
  name: 'Restricted to images',
  args: { label: 'Profile photo', accept: 'image/*', description: 'PNG or JPG, up to 2MB' },
  render: (args) => ({
    components: { FileUpload },
    setup() {
      const files = ref([])
      return { args, files }
    },
    template: '<div style="width: 360px;"><FileUpload v-bind="args" v-model="files" :max-size-bytes="2 * 1024 * 1024" /></div>',
  }),
}

export const Invalid: Story = {
  args: { label: 'Resume', isInvalid: true, errorMessage: 'A resume is required', isRequired: true },
  render: (args) => ({
    components: { FileUpload },
    setup() {
      const files = ref([])
      return { args, files }
    },
    template: '<div style="width: 360px;"><FileUpload v-bind="args" v-model="files" /></div>',
  }),
}

export const Disabled: Story = {
  args: { label: 'Attachment', isDisabled: true },
  render: (args) => ({
    components: { FileUpload },
    setup() {
      const files = ref([])
      return { args, files }
    },
    template: '<div style="width: 360px;"><FileUpload v-bind="args" v-model="files" /></div>',
  }),
}
