import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { defineComponent, ref } from "vue";
import {
  Button,
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  ToastViewport,
  useToast,
} from "@auronui/vue";

const meta: Meta<typeof Toast> = {
  title: "Components/Toast",
  component: Toast,
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: [
        "top-right",
        "top-center",
        "top-left",
        "bottom-right",
        "bottom-center",
        "bottom-left",
      ],
    },
    variant: {
      control: "select",
      options: ["default", "success", "warning", "danger", "accent"],
    },
    duration: { control: "number" },
    defaultOpen: {
      control: 'boolean',
      description: 'Default open state for uncontrolled usage.',
      table: { category: 'Toast', defaultValue: { summary: 'false' } },
    },
    forceMount: {
      control: 'boolean',
      description: 'Keep the toast mounted in the DOM even when closed.',
      table: { category: 'Toast', defaultValue: { summary: 'false' } },
    },
    type: {
      control: { type: 'select' },
      options: ['foreground', 'background'],
      description: 'Toast urgency type: foreground for urgent, background for passive.',
      table: { category: 'Toast', defaultValue: { summary: 'undefined' } },
    },
    as: {
      control: 'text',
      description: 'Render Toast as a different HTML element.',
      table: { category: 'Toast', defaultValue: { summary: 'li' } },
    },
    asChild: {
      control: 'boolean',
      description: 'Merge Toast props onto the child element.',
      table: { category: 'Toast', defaultValue: { summary: 'false' } },
    },
    viewportDuration: {
      control: 'number',
      description: 'Default duration for all toasts in the viewport provider (ms).',
      table: { category: 'ToastViewport', defaultValue: { summary: '5000' } },
    },
    viewportDisableSwipe: {
      control: 'boolean',
      description: 'Disable swipe gestures for all toasts in the viewport.',
      table: { category: 'ToastViewport', defaultValue: { summary: 'false' } },
    },
    viewportSwipeThreshold: {
      control: 'number',
      description: 'Distance in pixels before a swipe is recognised.',
      table: { category: 'ToastViewport', defaultValue: { summary: '50' } },
    },
  },
  args: {
    position: "bottom-right",
    variant: "default",
    duration: 5000,
    defaultOpen: false,
    forceMount: false,
    asChild: false,
    viewportDisableSwipe: false,
  },
  decorators: [
    () => ({
      components: { ToastProvider, ToastViewport },
      template: `
        <ToastProvider>
          <story />
          <ToastViewport position="top-right" />
          <ToastViewport position="top-center" />
          <ToastViewport position="top-left" />
          <ToastViewport position="bottom-right" />
          <ToastViewport position="bottom-center" />
          <ToastViewport position="bottom-left" />
        </ToastProvider>
      `,
    }),
  ],
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  args: {
    position: "bottom-right",
  },

  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { ToastProvider, Toast, ToastTitle, ToastDescription, ToastClose, ToastViewport } from '@auronui/vue'

const open = ref(true)
</script>

<template>
  <ToastProvider>
    <Toast :open="open" :duration="0" position="bottom-right" @update:open="open = $event">
      <ToastTitle>Notification</ToastTitle>
      <ToastDescription>This is a default toast message.</ToastDescription>
      <ToastClose />
    </Toast>
    <ToastViewport position="bottom-right" />
  </ToastProvider>
</template>`,
        language: 'vue',
      }
    }
  },

  render: (args) => ({
    components: { Toast, ToastTitle, ToastDescription, ToastClose },
    setup() {
      const open = ref(true);
      return { args, open };
    },
    template: `
      <div style="min-height:100px;">
        <Toast
          v-bind="args"
          :open="open"
          :duration="0"
          position="bottom-right"
          :default-open="args.defaultOpen"
          :force-mount="args.forceMount"
          :type="args.type"
          :as="args.as"
          :as-child="args.asChild"
          @update:open="open = $event"
        >
          <ToastTitle>Notification</ToastTitle>
          <ToastDescription>This is a default toast message.</ToastDescription>
          <ToastClose />
        </Toast>
      </div>
    `,
  }),
};

export const AllPositions: Story = {
  name: "All 6 Positions (via useToast)",
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ToastProvider, ToastViewport, Button, useToast } from '@auronui/vue'

const { toast } = useToast()
const positions = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
]

function showAll() {
  positions.forEach((position, i) => {
    setTimeout(() => {
      toast({
        title: position,
        description: \`Toast at \${position}\`,
        position,
        duration: 4000,
      })
    }, i * 200)
  })
}
</script>

<template>
  <ToastProvider>
    <div style="padding:16px;">
      <Button @click="showAll">Show All Positions</Button>
      <p style="margin-top:8px;font-size:14px;color:#666;">
        Click to display toasts at all 6 positions simultaneously.
      </p>
    </div>
    <ToastViewport position="top-left" />
    <ToastViewport position="top-center" />
    <ToastViewport position="top-right" />
    <ToastViewport position="bottom-left" />
    <ToastViewport position="bottom-center" />
    <ToastViewport position="bottom-right" />
  </ToastProvider>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) =>
    defineComponent({
      components: { Button, ToastProvider, ToastViewport },
      setup() {
        const { toast } = useToast();
        const positions = [
          "top-left",
          "top-center",
          "top-right",
          "bottom-left",
          "bottom-center",
          "bottom-right",
        ] as const;

        function showAll() {
          positions.forEach((position, i) => {
            setTimeout(() => {
              toast({
                title: `${position}`,
                description: `Toast at ${position}`,
                position,
                duration: 4000,
              });
            }, i * 200);
          });
        }

        return { args, showAll };
      },
      template: `
      <div style="padding:16px;">
        <Button @click="showAll">Show All Positions</Button>
        <p style="margin-top:8px;font-size:14px;color:#666;">
          Click to display toasts at all 6 positions simultaneously.
        </p>
      </div>
    `,
    }),
};

export const ImperativeAPI: Story = {
  args: {
    position: "bottom-left",
  },

  name: "useToast() Imperative API",

  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { ToastProvider, ToastViewport, Button, useToast } from '@auronui/vue'

const { toast, dismiss } = useToast()
const lastId = ref(null)

function createToast() {
  lastId.value = toast({
    title: 'Action completed',
    description: 'Your item was saved successfully.',
    position: 'bottom-right',
    variant: 'default',
    duration: 5000,
  })
}

function dismissLast() {
  if (lastId.value) {
    dismiss(lastId.value)
    lastId.value = null
  }
}
</script>

<template>
  <ToastProvider>
    <div style="display:flex;gap:8px;padding:16px;">
      <Button @click="createToast">Create Toast</Button>
      <Button variant="flat" @click="dismissLast">Dismiss Last</Button>
    </div>
    <ToastViewport position="bottom-right" />
  </ToastProvider>
</template>`,
        language: 'vue',
      },
    },
  },

  render: (args) =>
    defineComponent({
      components: { Button },
      setup() {
        const { toast, dismiss } = useToast();
        const lastId = ref<string | null>(null);

        function createToast() {
          lastId.value = toast({
            title: "Action completed",
            description: "Your item was saved successfully.",
            position: "bottom-right",
            variant: "default",
            duration: 5000,
            ...args,
          });
        }

        function dismissLast() {
          if (lastId.value) {
            dismiss(lastId.value);
            lastId.value = null;
          }
        }

        return { args, createToast, dismissLast };
      },
      template: `
      <div style="display:flex;gap:8px;padding:16px;">
        <Button @click="createToast">Create Toast</Button>
        <Button variant="flat" @click="dismissLast">Dismiss Last</Button>
      </div>
    `,
    }),
};

export const AllVariants: Story = {
  name: "All Variants",
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ToastProvider, ToastViewport, Button, useToast } from '@auronui/vue'

const { toast } = useToast()
const variants = ['default', 'success', 'warning', 'danger', 'accent']

function showAll() {
  variants.forEach((variant, i) => {
    setTimeout(() => {
      toast({
        title: \`\${variant} toast\`,
        description: \`This is a \${variant} variant.\`,
        position: 'bottom-right',
        variant,
        duration: 5000,
      })
    }, i * 200)
  })
}
</script>

<template>
  <ToastProvider>
    <div style="padding:16px;">
      <Button @click="showAll">Show All Variants</Button>
    </div>
    <ToastViewport position="bottom-right" />
  </ToastProvider>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) =>
    defineComponent({
      components: { Button },
      setup() {
        const { toast } = useToast();
        const variants = ["default", "success", "warning", "danger", "accent"] as const;

        function showAll() {
          variants.forEach((variant, i) => {
            setTimeout(() => {
              toast({
                title: `${variant} toast`,
                description: `This is a ${variant} variant.`,
                position: "bottom-right",
                variant,
                duration: 5000,
              });
            }, i * 200);
          });
        }

        return { args, showAll };
      },
      template: `
      <div style="padding:16px;">
        <Button @click="showAll">Show All Variants</Button>
      </div>
    `,
    }),
};

export const WithAction: Story = {
  args: {
    position: "top-center",
  },

  name: "Toast with Action Button",

  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { ToastProvider, Toast, ToastTitle, ToastDescription, ToastAction, ToastClose, ToastViewport } from '@auronui/vue'

const open = ref(true)

function handleAction() {
  alert('Action clicked!')
  open.value = false
}
</script>

<template>
  <ToastProvider>
    <Toast :open="open" :duration="0" position="bottom-right" @update:open="open = $event">
      <ToastTitle>Update available</ToastTitle>
      <ToastDescription>A new version is ready to install.</ToastDescription>
      <ToastAction alt-text="Install update" @click="handleAction">Install</ToastAction>
      <ToastClose />
    </Toast>
    <ToastViewport position="bottom-right" />
  </ToastProvider>
</template>`,
        language: 'vue',
      },
    },
  },

  render: (args) => ({
    components: { Toast, ToastTitle, ToastDescription, ToastAction, ToastClose },
    setup() {
      const open = ref(true);
      function handleAction() {
        alert("Action clicked!");
        open.value = false;
      }
      return { args, open, handleAction };
    },
    template: `
      <div style="min-height:100px;">
        <Toast v-bind="args" :open="open" :duration="0" position="bottom-right" @update:open="open = $event">
          <ToastTitle>Update available</ToastTitle>
          <ToastDescription>A new version is ready to install.</ToastDescription>
          <ToastAction alt-text="Install update" @click="handleAction">Install</ToastAction>
          <ToastClose />
        </Toast>
      </div>
    `,
  }),
};

export const MultipleStacking: Story = {
  name: "Multiple Stacking Toasts",
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { ToastProvider, ToastViewport, Button, useToast } from '@auronui/vue'

const { toast } = useToast()
const count = ref(0)

function addToast() {
  count.value++
  toast({
    title: \`Toast #\${count.value}\`,
    description: 'Toasts stack in order of creation.',
    position: 'bottom-right',
    duration: 8000,
  })
}
</script>

<template>
  <ToastProvider>
    <div style="padding:16px;">
      <Button @click="addToast">Add Toast ({{ count }})</Button>
      <p style="margin-top:8px;font-size:14px;color:#666;">
        Click multiple times. Max 5 concurrent toasts (oldest dismissed on overflow).
      </p>
    </div>
    <ToastViewport position="bottom-right" />
  </ToastProvider>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) =>
    defineComponent({
      components: { Button },
      setup() {
        const { toast } = useToast();
        let count = ref(0);

        function addToast() {
          count.value++;
          toast({
            title: `Toast #${count.value}`,
            description: "Toasts stack in order of creation.",
            position: "bottom-right",
            duration: 8000,
          });
        }

        return { args, addToast, count };
      },
      template: `
      <div style="padding:16px;">
        <Button @click="addToast">Add Toast ({{ count }})</Button>
        <p style="margin-top:8px;font-size:14px;color:#666;">
          Click multiple times. Max 5 concurrent toasts (oldest dismissed on overflow).
        </p>
      </div>
    `,
    }),
};

export const CustomDuration: Story = {
  name: "Custom Auto-Dismiss Duration",
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ToastProvider, ToastViewport, Button, useToast } from '@auronui/vue'

const { toast } = useToast()

function showShort() {
  toast({
    title: 'Quick toast',
    description: 'Auto-dismisses in 1.5s',
    position: 'top-right',
    duration: 1500,
  })
}

function showLong() {
  toast({
    title: 'Long toast',
    description: 'Auto-dismisses in 10s',
    position: 'top-right',
    duration: 10000,
  })
}
</script>

<template>
  <ToastProvider>
    <div style="display:flex;gap:8px;padding:16px;">
      <Button variant="bordered" @click="showShort">1.5s Toast</Button>
      <Button variant="bordered" @click="showLong">10s Toast</Button>
    </div>
    <ToastViewport position="top-right" />
  </ToastProvider>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) =>
    defineComponent({
      components: { Button },
      setup() {
        const { toast } = useToast();

        function showShort() {
          toast({
            title: "Quick toast",
            description: "Auto-dismisses in 1.5s",
            position: "top-right",
            duration: 1500,
          });
        }

        function showLong() {
          toast({
            title: "Long toast",
            description: "Auto-dismisses in 10s",
            position: "top-right",
            duration: 10000,
          });
        }

        return { args, showShort, showLong };
      },
      template: `
      <div style="display:flex;gap:8px;padding:16px;">
        <Button variant="outline" @click="showShort">1.5s Toast</Button>
        <Button variant="outline" @click="showLong">10s Toast</Button>
      </div>
    `,
    }),
};
