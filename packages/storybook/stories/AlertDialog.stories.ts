import type { Meta, StoryObj } from '@storybook/vue3-vite'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogIcon,
  AlertDialogAction,
  AlertDialogCancel,
  Button,
} from '@auronui/vue'

const meta: Meta = {
  title: 'Components/AlertDialog',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AlertDialog is a modal dialog for destructive or irreversible actions. ' +
          'Unlike Modal, it does NOT close on overlay click. Enter on the trigger opens the dialog ' +
          'but does NOT activate the confirm button (destructive safety).',
      },
    },
  },
  argTypes: {
    classNames: { control: 'object', description: 'Per-slot class overrides. Keys match the component anatomy slot names (e.g., base).' },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  name: 'Default (Delete Confirm)',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogIcon,
  AlertDialogAction,
  AlertDialogCancel,
  Button,
} from '@auronui/vue'
</script>

<template>
  <AlertDialog status="danger">
    <AlertDialogTrigger as-child>
      <Button variant="danger">Delete Item</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogIcon />
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogBody>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the item
          and remove it from our servers.
        </AlertDialogDescription>
      </AlertDialogBody>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction>Yes, delete it</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: {
      AlertDialog,
      AlertDialogTrigger,
      AlertDialogContent,
      AlertDialogHeader,
      AlertDialogBody,
      AlertDialogFooter,
      AlertDialogTitle,
      AlertDialogDescription,
      AlertDialogIcon,
      AlertDialogAction,
      AlertDialogCancel,
      Button,
    },
    setup: () => ({ args }),
    template: `
      <AlertDialog v-bind="args" status="danger">
        <AlertDialogTrigger as-child>
          <Button variant="danger">Delete Item</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogIcon />
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogBody>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the item
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogBody>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Yes, delete it</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    `,
  }),
}

export const Warning: Story = {
  name: 'Warning Status',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogIcon,
  AlertDialogAction,
  AlertDialogCancel,
  Button,
} from '@auronui/vue'
</script>

<template>
  <AlertDialog status="warning">
    <AlertDialogTrigger as-child>
      <Button variant="warning">Archive Project</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogIcon />
        <AlertDialogTitle>Archive this project?</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogBody>
        <AlertDialogDescription>
          Archiving the project will make it read-only. Team members will no longer
          be able to add new content.
        </AlertDialogDescription>
      </AlertDialogBody>
      <AlertDialogFooter>
        <AlertDialogCancel>Keep Active</AlertDialogCancel>
        <AlertDialogAction variant="warning">Archive Project</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: {
      AlertDialog,
      AlertDialogTrigger,
      AlertDialogContent,
      AlertDialogHeader,
      AlertDialogBody,
      AlertDialogFooter,
      AlertDialogTitle,
      AlertDialogDescription,
      AlertDialogIcon,
      AlertDialogAction,
      AlertDialogCancel,
      Button,
    },
    setup: () => ({ args }),
    template: `
      <AlertDialog v-bind="args" status="warning">
        <AlertDialogTrigger as-child>
          <Button variant="warning">Archive Project</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogIcon />
            <AlertDialogTitle>Archive this project?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogBody>
            <AlertDialogDescription>
              Archiving the project will make it read-only. Team members will no longer
              be able to add new content.
            </AlertDialogDescription>
          </AlertDialogBody>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Active</AlertDialogCancel>
            <AlertDialogAction variant="warning">Archive Project</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    `,
  }),
}

export const Success: Story = {
  name: 'Success Status',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogIcon,
  AlertDialogAction,
  AlertDialogCancel,
  Button,
} from '@auronui/vue'
</script>

<template>
  <AlertDialog status="success">
    <AlertDialogTrigger as-child>
      <Button variant="success">Publish Changes</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogIcon />
        <AlertDialogTitle>Publish these changes?</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogBody>
        <AlertDialogDescription>
          Your changes will be visible to all collaborators. You can still edit
          them afterwards.
        </AlertDialogDescription>
      </AlertDialogBody>
      <AlertDialogFooter>
        <AlertDialogCancel>Not yet</AlertDialogCancel>
        <AlertDialogAction variant="success">Publish</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: {
      AlertDialog,
      AlertDialogTrigger,
      AlertDialogContent,
      AlertDialogHeader,
      AlertDialogBody,
      AlertDialogFooter,
      AlertDialogTitle,
      AlertDialogDescription,
      AlertDialogIcon,
      AlertDialogAction,
      AlertDialogCancel,
      Button,
    },
    setup: () => ({ args }),
    template: `
      <AlertDialog v-bind="args" status="success">
        <AlertDialogTrigger as-child>
          <Button variant="success">Publish Changes</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogIcon />
            <AlertDialogTitle>Publish these changes?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogBody>
            <AlertDialogDescription>
              Your changes will be visible to all collaborators. You can still edit
              them afterwards.
            </AlertDialogDescription>
          </AlertDialogBody>
          <AlertDialogFooter>
            <AlertDialogCancel>Not yet</AlertDialogCancel>
            <AlertDialogAction variant="success">Publish</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    `,
  }),
}

export const LongDescription: Story = {
  name: 'Long Description',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogIcon,
  AlertDialogAction,
  AlertDialogCancel,
  Button,
} from '@auronui/vue'
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <Button variant="secondary">Reset Account</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogIcon />
        <AlertDialogTitle>Reset your account?</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogBody>
        <AlertDialogDescription>
          This will permanently reset your account and all associated data including:
          your profile, saved preferences, subscription history, all uploaded files,
          project data, and collaboration history. This action is irreversible and
          cannot be undone by any member of our support team. Your account will be
          removed from all shared workspaces, and any pending invoices will be voided.
          Please make sure you have exported any data you need before proceeding.
        </AlertDialogDescription>
      </AlertDialogBody>
      <AlertDialogFooter>
        <AlertDialogCancel>No, keep my account</AlertDialogCancel>
        <AlertDialogAction>Yes, reset everything</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: {
      AlertDialog,
      AlertDialogTrigger,
      AlertDialogContent,
      AlertDialogHeader,
      AlertDialogBody,
      AlertDialogFooter,
      AlertDialogTitle,
      AlertDialogDescription,
      AlertDialogIcon,
      AlertDialogAction,
      AlertDialogCancel,
      Button,
    },
    setup: () => ({ args }),
    template: `
      <AlertDialog v-bind="args">
        <AlertDialogTrigger as-child>
          <Button variant="secondary">Reset Account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogIcon />
            <AlertDialogTitle>Reset your account?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogBody>
            <AlertDialogDescription>
              This will permanently reset your account and all associated data including:
              your profile, saved preferences, subscription history, all uploaded files,
              project data, and collaboration history. This action is irreversible and
              cannot be undone by any member of our support team. Your account will be
              removed from all shared workspaces, and any pending invoices will be voided.
              Please make sure you have exported any data you need before proceeding.
            </AlertDialogDescription>
          </AlertDialogBody>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep my account</AlertDialogCancel>
            <AlertDialogAction>Yes, reset everything</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    `,
  }),
}

export const WithoutIcon: Story = {
  name: 'Without Icon',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  Button,
} from '@auronui/vue'
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <Button variant="danger">Delete</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete this file?</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogBody>
        <AlertDialogDescription>
          This file will be moved to the trash. You can restore it within 30 days.
        </AlertDialogDescription>
      </AlertDialogBody>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction>Delete</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: {
      AlertDialog,
      AlertDialogTrigger,
      AlertDialogContent,
      AlertDialogHeader,
      AlertDialogBody,
      AlertDialogFooter,
      AlertDialogTitle,
      AlertDialogDescription,
      AlertDialogAction,
      AlertDialogCancel,
      Button,
    },
    setup: () => ({ args }),
    template: `
      <AlertDialog v-bind="args">
        <AlertDialogTrigger as-child>
          <Button variant="danger">Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this file?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogBody>
            <AlertDialogDescription>
              This file will be moved to the trash. You can restore it within 30 days.
            </AlertDialogDescription>
          </AlertDialogBody>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    `,
  }),
}

export const CustomStyles: Story = {
  name: 'Custom styles via classNames',
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogIcon,
  AlertDialogAction,
  AlertDialogCancel,
  Button,
} from '@auronui/vue'
</script>

<template>
  <AlertDialog status="danger">
    <AlertDialogTrigger as-child>
      <Button variant="danger">Delete Item</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogIcon />
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogBody>
        <AlertDialogDescription>
          This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogBody>
      <AlertDialogFooter>
        <AlertDialogCancel :class-names="{ base: 'border-2 border-blue-500 text-blue-600 hover:bg-blue-50' }">
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction :class-names="{ base: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg' }">
          Yes, delete it
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: {
      AlertDialog,
      AlertDialogTrigger,
      AlertDialogContent,
      AlertDialogHeader,
      AlertDialogBody,
      AlertDialogFooter,
      AlertDialogTitle,
      AlertDialogDescription,
      AlertDialogIcon,
      AlertDialogAction,
      AlertDialogCancel,
      Button,
    },
    setup: () => ({ args }),
    template: `
      <AlertDialog v-bind="args" status="danger">
        <AlertDialogTrigger as-child>
          <Button variant="danger">Delete Item</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogIcon />
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogBody>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogBody>
          <AlertDialogFooter>
            <AlertDialogCancel :class-names="{ base: 'border-2 border-blue-500 text-blue-600 hover:bg-blue-50' }">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction :class-names="{ base: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg' }">
              Yes, delete it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    `,
  }),
}
