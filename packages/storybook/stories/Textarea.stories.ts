import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { Textarea } from '@auronui/vue'

const meta: Meta<typeof Textarea> = {
  title: 'Form/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['flat', 'bordered', 'faded', 'underlined', 'raised'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'danger'],
    },
    labelPlacement: {
      control: 'select',
      options: ['inside', 'outside', 'outside-left'],
    },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    description: { control: 'text' },
    errorMessage: { control: 'text' },
    isDisabled: { control: 'boolean' },
    isReadonly: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    isClearable: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    autoResize: { control: 'boolean' },
    rows: { control: 'number' },
    classNames: { control: 'object', description: 'Per-slot class overrides. Keys match the component anatomy slot names.' },
  },
  args: {
    variant: 'flat',
    size: 'md',
    color: 'default',
    labelPlacement: 'inside',
    isDisabled: false,
    isReadonly: false,
    isInvalid: false,
    isRequired: false,
    isClearable: false,
    fullWidth: false,
    autoResize: false,
    rows: 3,
  },
}

export default meta
type Story = StoryObj<typeof Textarea>

type PlaygroundArgs = NonNullable<Story['args']> & {
  showStartIcon?: boolean
  showEndIcon?: boolean
}

export const Playground: Story = {
  argTypes: {
    showStartIcon: { control: 'boolean', name: 'start icon' },
    showEndIcon: { control: 'boolean', name: 'end icon' },
  },
  args: {
    variant: 'bordered',
    label: 'Bio',
    placeholder: 'Tell us about yourself…',
    description: 'A short public bio shown on your profile.',
    errorMessage: 'Bio is required.',
    showStartIcon: false,
    showEndIcon: false,
  } as PlaygroundArgs,
  render: (args: PlaygroundArgs) => ({
    components: { Textarea },
    setup() { return { args } },
    template: `
      <div style="max-width:400px">
        <Textarea v-bind="args" aria-label="Playground textarea">
          <template v-if="args.showStartIcon" #startContent>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </template>
          <template v-if="args.showEndIcon" #endContent>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </template>
        </Textarea>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <div style="max-width:400px">
    <Textarea
      variant="bordered"
      label="Bio"
      placeholder="Tell us about yourself…"
      description="A short public bio shown on your profile."
    />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const Default: Story = {
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: '<Textarea v-bind="args" placeholder="Type something..." aria-label="Default textarea" />',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <Textarea placeholder="Type something..." />
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
}

/* ─── Variants ───────────────────────────────────────────────────────────── */

export const Variants: Story = {
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:360px">
        <div>
          <label style="display:block;font-size:12px;color:#666;margin-bottom:4px">flat (default)</label>
          <Textarea v-bind="args" variant="flat" placeholder="Flat textarea" aria-label="Flat textarea" />
        </div>
        <div>
          <label style="display:block;font-size:12px;color:#666;margin-bottom:4px">bordered</label>
          <Textarea v-bind="args" variant="bordered" placeholder="Bordered textarea" aria-label="Bordered textarea" />
        </div>
        <div>
          <label style="display:block;font-size:12px;color:#666;margin-bottom:4px">faded</label>
          <Textarea v-bind="args" variant="faded" placeholder="Faded textarea" aria-label="Faded textarea" />
        </div>
        <div>
          <label style="display:block;font-size:12px;color:#666;margin-bottom:4px">underlined</label>
          <Textarea v-bind="args" variant="underlined" placeholder="Underlined textarea" aria-label="Underlined textarea" />
        </div>
        <div>
          <label style="display:block;font-size:12px;color:#666;margin-bottom:4px">raised</label>
          <Textarea v-bind="args" variant="raised" placeholder="Raised textarea" aria-label="Raised textarea" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:16px;max-width:360px">
    <Textarea variant="flat" placeholder="Flat textarea" />
    <Textarea variant="bordered" placeholder="Bordered textarea" />
    <Textarea variant="faded" placeholder="Faded textarea" />
    <Textarea variant="underlined" placeholder="Underlined textarea" />
    <Textarea variant="raised" placeholder="Raised textarea" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const Sizes: Story = {
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:360px">
        <Textarea v-bind="args" size="sm" variant="bordered" placeholder="Small (sm)" aria-label="Small textarea" />
        <Textarea v-bind="args" size="md" variant="bordered" placeholder="Medium (md) — default" aria-label="Medium textarea" />
        <Textarea v-bind="args" size="lg" variant="bordered" placeholder="Large (lg)" aria-label="Large textarea" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px;max-width:360px">
    <Textarea size="sm" variant="bordered" placeholder="Small (sm)" />
    <Textarea size="md" variant="bordered" placeholder="Medium (md) — default" />
    <Textarea size="lg" variant="bordered" placeholder="Large (lg)" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const Colors: Story = {
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:360px">
        <Textarea v-bind="args" variant="bordered" color="default" placeholder="default" aria-label="Default color textarea" />
        <Textarea v-bind="args" variant="bordered" color="primary" placeholder="primary" aria-label="Primary color textarea" />
        <Textarea v-bind="args" variant="bordered" color="secondary" placeholder="secondary" aria-label="Secondary color textarea" />
        <Textarea v-bind="args" variant="bordered" color="success" placeholder="success" aria-label="Success color textarea" />
        <Textarea v-bind="args" variant="bordered" color="warning" placeholder="warning" aria-label="Warning color textarea" />
        <Textarea v-bind="args" variant="bordered" color="danger" placeholder="danger" aria-label="Danger color textarea" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px;max-width:360px">
    <Textarea variant="bordered" color="default" placeholder="default" />
    <Textarea variant="bordered" color="primary" placeholder="primary" />
    <Textarea variant="bordered" color="secondary" placeholder="secondary" />
    <Textarea variant="bordered" color="success" placeholder="success" />
    <Textarea variant="bordered" color="warning" placeholder="warning" />
    <Textarea variant="bordered" color="danger" placeholder="danger" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const FocusByColor: Story = {
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: `
      <div style="display:grid;grid-template-columns:80px repeat(6,minmax(0,1fr));gap:8px;max-width:1040px;align-items:center">
        <div></div>
        <div style="font-size:11px;color:#666">default</div>
        <div style="font-size:11px;color:#666">primary</div>
        <div style="font-size:11px;color:#666">secondary</div>
        <div style="font-size:11px;color:#666">success</div>
        <div style="font-size:11px;color:#666">warning</div>
        <div style="font-size:11px;color:#666">danger</div>

        <div style="font-size:11px;color:#666">flat</div>
        <Textarea v-bind="args" variant="flat" color="default" placeholder="default" aria-label="flat default" />
        <Textarea v-bind="args" variant="flat" color="primary" placeholder="primary" aria-label="flat primary" />
        <Textarea v-bind="args" variant="flat" color="secondary" placeholder="secondary" aria-label="flat secondary" />
        <Textarea v-bind="args" variant="flat" color="success" placeholder="success" aria-label="flat success" />
        <Textarea v-bind="args" variant="flat" color="warning" placeholder="warning" aria-label="flat warning" />
        <Textarea v-bind="args" variant="flat" color="danger" placeholder="danger" aria-label="flat danger" />

        <div style="font-size:11px;color:#666">faded</div>
        <Textarea v-bind="args" variant="faded" color="default" placeholder="default" aria-label="faded default" />
        <Textarea v-bind="args" variant="faded" color="primary" placeholder="primary" aria-label="faded primary" />
        <Textarea v-bind="args" variant="faded" color="secondary" placeholder="secondary" aria-label="faded secondary" />
        <Textarea v-bind="args" variant="faded" color="success" placeholder="success" aria-label="faded success" />
        <Textarea v-bind="args" variant="faded" color="warning" placeholder="warning" aria-label="faded warning" />
        <Textarea v-bind="args" variant="faded" color="danger" placeholder="danger" aria-label="faded danger" />

        <div style="font-size:11px;color:#666">bordered</div>
        <Textarea v-bind="args" variant="bordered" color="default" placeholder="default" aria-label="bordered default" />
        <Textarea v-bind="args" variant="bordered" color="primary" placeholder="primary" aria-label="bordered primary" />
        <Textarea v-bind="args" variant="bordered" color="secondary" placeholder="secondary" aria-label="bordered secondary" />
        <Textarea v-bind="args" variant="bordered" color="success" placeholder="success" aria-label="bordered success" />
        <Textarea v-bind="args" variant="bordered" color="warning" placeholder="warning" aria-label="bordered warning" />
        <Textarea v-bind="args" variant="bordered" color="danger" placeholder="danger" aria-label="bordered danger" />

        <div style="font-size:11px;color:#666">underlined</div>
        <Textarea v-bind="args" variant="underlined" color="default" placeholder="default" aria-label="underlined default" />
        <Textarea v-bind="args" variant="underlined" color="primary" placeholder="primary" aria-label="underlined primary" />
        <Textarea v-bind="args" variant="underlined" color="secondary" placeholder="secondary" aria-label="underlined secondary" />
        <Textarea v-bind="args" variant="underlined" color="success" placeholder="success" aria-label="underlined success" />
        <Textarea v-bind="args" variant="underlined" color="warning" placeholder="warning" aria-label="underlined warning" />
        <Textarea v-bind="args" variant="underlined" color="danger" placeholder="danger" aria-label="underlined danger" />

        <div style="font-size:11px;color:#666">raised</div>
        <Textarea v-bind="args" variant="raised" color="default" placeholder="default" aria-label="raised default" />
        <Textarea v-bind="args" variant="raised" color="primary" placeholder="primary" aria-label="raised primary" />
        <Textarea v-bind="args" variant="raised" color="secondary" placeholder="secondary" aria-label="raised secondary" />
        <Textarea v-bind="args" variant="raised" color="success" placeholder="success" aria-label="raised success" />
        <Textarea v-bind="args" variant="raised" color="warning" placeholder="warning" aria-label="raised warning" />
        <Textarea v-bind="args" variant="raised" color="danger" placeholder="danger" aria-label="raised danger" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <!-- flat -->
  <Textarea variant="flat" color="default" placeholder="default" />
  <Textarea variant="flat" color="primary" placeholder="primary" />
  <Textarea variant="flat" color="secondary" placeholder="secondary" />
  <Textarea variant="flat" color="success" placeholder="success" />
  <Textarea variant="flat" color="warning" placeholder="warning" />
  <Textarea variant="flat" color="danger" placeholder="danger" />

  <!-- faded -->
  <Textarea variant="faded" color="default" placeholder="default" />
  <Textarea variant="faded" color="primary" placeholder="primary" />

  <!-- bordered -->
  <Textarea variant="bordered" color="default" placeholder="default" />
  <Textarea variant="bordered" color="primary" placeholder="primary" />

  <!-- underlined -->
  <Textarea variant="underlined" color="default" placeholder="default" />
  <Textarea variant="underlined" color="primary" placeholder="primary" />

  <!-- raised -->
  <Textarea variant="raised" color="default" placeholder="default" />
  <Textarea variant="raised" color="primary" placeholder="primary" />
</template>`,
        language: 'vue',
      },
    },
  },
}

/* ─── labelPlacement ─────────────────────────────────────────────────── */

export const LabelPlacementInside: Story = {
  args: {
    variant: 'bordered',
    label: 'Bio',
    labelPlacement: 'inside',
    placeholder: 'Tell us about yourself…',
  },
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: '<div style="max-width:400px"><Textarea v-bind="args" /></div>',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <div style="max-width:400px">
    <Textarea
      variant="bordered"
      label="Bio"
      label-placement="inside"
      placeholder="Tell us about yourself…"
    />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const LabelPlacementOutside: Story = {
  args: {
    variant: 'bordered',
    label: 'Bio',
    labelPlacement: 'outside',
    placeholder: 'Tell us about yourself…',
  },
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: '<div style="max-width:400px"><Textarea v-bind="args" /></div>',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <div style="max-width:400px">
    <Textarea
      variant="bordered"
      label="Bio"
      label-placement="outside"
      placeholder="Tell us about yourself…"
    />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const LabelPlacementOutsideLeft: Story = {
  args: {
    variant: 'bordered',
    label: 'Bio',
    labelPlacement: 'outside-left',
    placeholder: 'Tell us about yourself…',
  },
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: '<div style="max-width:560px"><Textarea v-bind="args" /></div>',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <div style="max-width:560px">
    <Textarea
      variant="bordered"
      label="Bio"
      label-placement="outside-left"
      placeholder="Tell us about yourself…"
    />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const LabelPlacementMatrix: Story = {
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: `
      <div style="display:flex;flex-direction:column;gap:32px;max-width:560px">
        <div>
          <h4 style="margin:0 0 8px;font-size:12px;color:#666;text-transform:uppercase">Inside (default)</h4>
          <div style="display:flex;flex-direction:column;gap:12px">
            <Textarea v-bind="args" variant="flat" label="Notes" placeholder="Jot something down" />
            <Textarea v-bind="args" variant="bordered" label="Bio" placeholder="About you" />
            <Textarea v-bind="args" variant="underlined" label="Comments" placeholder="Any feedback?" />
          </div>
        </div>

        <div>
          <h4 style="margin:0 0 8px;font-size:12px;color:#666;text-transform:uppercase">Outside</h4>
          <div style="display:flex;flex-direction:column;gap:12px">
            <Textarea v-bind="args" variant="flat" labelPlacement="outside" label="Notes" placeholder="Jot something down" />
            <Textarea v-bind="args" variant="bordered" labelPlacement="outside" label="Bio" placeholder="About you" />
            <Textarea v-bind="args" variant="underlined" labelPlacement="outside" label="Comments" placeholder="Any feedback?" />
          </div>
        </div>

        <div>
          <h4 style="margin:0 0 8px;font-size:12px;color:#666;text-transform:uppercase">Outside-left</h4>
          <div style="display:flex;flex-direction:column;gap:12px">
            <Textarea v-bind="args" variant="flat" labelPlacement="outside-left" label="Notes" placeholder="Jot something down" />
            <Textarea v-bind="args" variant="bordered" labelPlacement="outside-left" label="Bio" placeholder="About you" />
            <Textarea v-bind="args" variant="underlined" labelPlacement="outside-left" label="Comments" placeholder="Any feedback?" />
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:32px;max-width:560px">
    <!-- Inside (default) -->
    <Textarea variant="flat" label="Notes" placeholder="Jot something down" />
    <Textarea variant="bordered" label="Bio" placeholder="About you" />
    <Textarea variant="underlined" label="Comments" placeholder="Any feedback?" />

    <!-- Outside -->
    <Textarea variant="flat" label-placement="outside" label="Notes" placeholder="Jot something down" />
    <Textarea variant="bordered" label-placement="outside" label="Bio" placeholder="About you" />
    <Textarea variant="underlined" label-placement="outside" label="Comments" placeholder="Any feedback?" />

    <!-- Outside-left -->
    <Textarea variant="flat" label-placement="outside-left" label="Notes" placeholder="Jot something down" />
    <Textarea variant="bordered" label-placement="outside-left" label="Bio" placeholder="About you" />
    <Textarea variant="underlined" label-placement="outside-left" label="Comments" placeholder="Any feedback?" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}

/* ─── description / errorMessage / isRequired ────────────────────────── */

export const WithDescription: Story = {
  args: {
    variant: 'bordered',
    label: 'Bio',
    labelPlacement: 'outside',
    placeholder: 'Tell us about yourself…',
    description: 'Max 500 characters. Shown publicly on your profile.',
  },
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: '<div style="max-width:420px"><Textarea v-bind="args" /></div>',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <div style="max-width:420px">
    <Textarea
      variant="bordered"
      label="Bio"
      label-placement="outside"
      placeholder="Tell us about yourself…"
      description="Max 500 characters. Shown publicly on your profile."
    />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const WithErrorMessage: Story = {
  args: {
    variant: 'bordered',
    label: 'Feedback',
    labelPlacement: 'outside',
    placeholder: 'Describe the issue…',
    isInvalid: true,
    errorMessage: 'Please provide at least 20 characters.',
  },
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: '<div style="max-width:420px"><Textarea v-bind="args" /></div>',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <div style="max-width:420px">
    <Textarea
      variant="bordered"
      label="Feedback"
      label-placement="outside"
      placeholder="Describe the issue…"
      :is-invalid="true"
      error-message="Please provide at least 20 characters."
    />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const ErrorSupersedesDescription: Story = {
  name: 'Error supersedes description',
  args: {
    variant: 'bordered',
    label: 'Review',
    labelPlacement: 'outside',
    placeholder: 'Your review…',
    description: 'Reviews help other customers decide.',
    errorMessage: 'Review cannot be empty.',
    isInvalid: true,
  },
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: '<div style="max-width:420px"><Textarea v-bind="args" /></div>',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <div style="max-width:420px">
    <Textarea
      variant="bordered"
      label="Review"
      label-placement="outside"
      placeholder="Your review…"
      description="Reviews help other customers decide."
      error-message="Review cannot be empty."
      :is-invalid="true"
    />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const Required: Story = {
  args: {
    variant: 'bordered',
    label: 'Summary',
    labelPlacement: 'outside',
    placeholder: 'One-paragraph summary',
    isRequired: true,
    description: 'Required field — asterisk is rendered next to the label.',
  },
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: '<div style="max-width:420px"><Textarea v-bind="args" /></div>',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <div style="max-width:420px">
    <Textarea
      variant="bordered"
      label="Summary"
      label-placement="outside"
      placeholder="One-paragraph summary"
      :is-required="true"
      description="Required field — asterisk is rendered next to the label."
    />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const RequiredAcrossPlacements: Story = {
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:560px">
        <Textarea v-bind="args" variant="bordered" label="Inside" :isRequired="true" placeholder="Required inside" />
        <Textarea v-bind="args" variant="bordered" label="Outside" labelPlacement="outside" :isRequired="true" placeholder="Required outside" />
        <Textarea v-bind="args" variant="bordered" label="Outside-left" labelPlacement="outside-left" :isRequired="true" placeholder="Required outside-left" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:16px;max-width:560px">
    <Textarea variant="bordered" label="Inside" :is-required="true" placeholder="Required inside" />
    <Textarea variant="bordered" label="Outside" label-placement="outside" :is-required="true" placeholder="Required outside" />
    <Textarea variant="bordered" label="Outside-left" label-placement="outside-left" :is-required="true" placeholder="Required outside-left" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}

/* ─── State primitives ─────────────────────────────────────────────── */

export const Invalid: Story = {
  args: {
    variant: 'bordered',
    label: 'Comments',
    labelPlacement: 'outside',
    isInvalid: true,
    errorMessage: 'This field has an error.',
    placeholder: 'Your comments…',
  },
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: '<div style="max-width:400px"><Textarea v-bind="args" /></div>',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <div style="max-width:400px">
    <Textarea
      variant="bordered"
      label="Comments"
      label-placement="outside"
      :is-invalid="true"
      error-message="This field has an error."
      placeholder="Your comments…"
    />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const Disabled: Story = {
  args: {
    variant: 'bordered',
    isDisabled: true,
  },
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: '<Textarea v-bind="args" placeholder="Disabled textarea" aria-label="Disabled textarea" style="max-width:400px" />',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <Textarea
    variant="bordered"
    :is-disabled="true"
    placeholder="Disabled textarea"
    style="max-width:400px"
  />
</template>`,
        language: 'vue',
      },
    },
  },
}

export const Readonly: Story = {
  args: {
    variant: 'bordered',
    isReadonly: true,
  },
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: '<Textarea v-bind="args" modelValue="This content is read-only and cannot be edited." aria-label="Readonly textarea" style="max-width:400px" />',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <Textarea
    variant="bordered"
    :is-readonly="true"
    model-value="This content is read-only and cannot be edited."
    style="max-width:400px"
  />
</template>`,
        language: 'vue',
      },
    },
  },
}

export const FullWidth: Story = {
  args: {
    variant: 'bordered',
    fullWidth: true,
    label: 'Full width',
    labelPlacement: 'outside',
  },
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: '<Textarea v-bind="args" placeholder="Takes the entire available width" />',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <Textarea
    variant="bordered"
    :full-width="true"
    label="Full width"
    label-placement="outside"
    placeholder="Takes the entire available width"
  />
</template>`,
        language: 'vue',
      },
    },
  },
}

/* ─── Clearable ──────────────────────────────────────────────────────── */

export const Clearable: Story = {
  args: {
    variant: 'bordered',
    label: 'Message',
    labelPlacement: 'outside',
    placeholder: 'Type your message…',
    isClearable: true,
  },
  render: (args) => ({
    components: { Textarea },
    setup() {
      const model = ref('Hello world — this textarea has a clear button.')
      return { args, model }
    },
    template: '<div style="max-width:400px"><Textarea v-bind="args" v-model="model" @clear="() => console.log(\'cleared\')" /></div>',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Textarea } from '@auronui/vue'

const message = ref('Hello world — this textarea has a clear button.')
</script>

<template>
  <div style="max-width:400px">
    <Textarea
      variant="bordered"
      label="Message"
      label-placement="outside"
      placeholder="Type your message…"
      :is-clearable="true"
      v-model="message"
      @clear="message = ''"
    />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const ClearableEmpty: Story = {
  name: 'Clearable (empty — button hidden)',
  args: {
    variant: 'bordered',
    label: 'Notes',
    labelPlacement: 'outside',
    placeholder: 'Type something…',
    isClearable: true,
    description: 'Clear button appears only when the textarea has content.',
  },
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: '<div style="max-width:400px"><Textarea v-bind="args" /></div>',
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <div style="max-width:400px">
    <Textarea
      variant="bordered"
      label="Notes"
      label-placement="outside"
      placeholder="Type something…"
      :is-clearable="true"
      description="Clear button appears only when the textarea has content."
    />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const ClearableSizes: Story = {
  render: (args) => ({
    components: { Textarea },
    setup() {
      const sm = ref('small value')
      const md = ref('medium value')
      const lg = ref('large value')
      return { args, sm, md, lg }
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:400px">
        <Textarea v-bind="args" size="sm" variant="bordered" label="Small" labelPlacement="outside" :isClearable="true" v-model="sm" />
        <Textarea v-bind="args" size="md" variant="bordered" label="Medium" labelPlacement="outside" :isClearable="true" v-model="md" />
        <Textarea v-bind="args" size="lg" variant="bordered" label="Large" labelPlacement="outside" :isClearable="true" v-model="lg" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { ref } from 'vue'
import { Textarea } from '@auronui/vue'

const sm = ref('small value')
const md = ref('medium value')
const lg = ref('large value')
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px;max-width:400px">
    <Textarea size="sm" variant="bordered" label="Small" label-placement="outside" :is-clearable="true" v-model="sm" />
    <Textarea size="md" variant="bordered" label="Medium" label-placement="outside" :is-clearable="true" v-model="md" />
    <Textarea size="lg" variant="bordered" label="Large" label-placement="outside" :is-clearable="true" v-model="lg" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}

/* ─── autoResize / rows ──────────────────────────────────────────────── */

export const AutoResize: Story = {
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: `
      <div style="max-width:400px">
        <p style="font-size:13px;color:#666;margin-bottom:8px">
          Type or paste multi-line text — the textarea grows automatically.
        </p>
        <Textarea
          v-bind="args"
          variant="bordered"
          :fullWidth="true"
          :autoResize="true"
          placeholder="Start typing here to see auto-resize in action..."
          aria-label="Auto-resizing textarea"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <div style="max-width:400px">
    <Textarea
      variant="bordered"
      :full-width="true"
      :auto-resize="true"
      placeholder="Start typing here to see auto-resize in action..."
    />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const Rows: Story = {
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:400px">
        <Textarea v-bind="args" variant="bordered" :rows="2" placeholder="rows={2}" aria-label="Rows 2" />
        <Textarea v-bind="args" variant="bordered" :rows="4" placeholder="rows={4} (default is 3)" aria-label="Rows 4" />
        <Textarea v-bind="args" variant="bordered" :rows="8" placeholder="rows={8}" aria-label="Rows 8" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px;max-width:400px">
    <Textarea variant="bordered" :rows="2" placeholder="rows=2" />
    <Textarea variant="bordered" :rows="4" placeholder="rows=4 (default is 3)" />
    <Textarea variant="bordered" :rows="8" placeholder="rows=8" />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}

/* ─── Icons (start/end content slots) ────────────────────────────────── */

export const WithStartIcon: Story = {
  args: { variant: 'bordered' },
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: `
      <div style="max-width:400px">
        <Textarea v-bind="args" placeholder="Leave a note…" aria-label="Note">
          <template #startContent>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </template>
        </Textarea>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <div style="max-width:400px">
    <Textarea variant="bordered" placeholder="Leave a note…">
      <template #startContent>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      </template>
    </Textarea>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const WithEndIcon: Story = {
  args: { variant: 'bordered' },
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: `
      <div style="max-width:400px">
        <Textarea v-bind="args" placeholder="Type to confirm…" aria-label="Confirm">
          <template #endContent>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </template>
        </Textarea>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <div style="max-width:400px">
    <Textarea variant="bordered" placeholder="Type to confirm…">
      <template #endContent>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </template>
    </Textarea>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const WithBothIcons: Story = {
  args: { variant: 'bordered' },
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: `
      <div style="max-width:400px">
        <Textarea v-bind="args" placeholder="Rich note…" aria-label="Rich note">
          <template #startContent>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </template>
          <template #endContent>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </template>
        </Textarea>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <div style="max-width:400px">
    <Textarea variant="bordered" placeholder="Rich note…">
      <template #startContent>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      </template>
      <template #endContent>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </template>
    </Textarea>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const WithLabelInsideAndIcons: Story = {
  args: {
    variant: 'bordered',
    size: 'sm',
    label: 'Note',
  },
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: `
      <div style="max-width:400px">
        <Textarea v-bind="args">
          <template #startContent>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </template>
        </Textarea>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <div style="max-width:400px">
    <Textarea variant="bordered" size="sm" label="Note">
      <template #startContent>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      </template>
    </Textarea>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}

/* ─── Matrix / showcase ─────────────────────────────────────────────── */

export const LabelStatesMatrix: Story = {
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: `
      <div style="display:grid;grid-template-columns:80px repeat(5,minmax(0,1fr));gap:12px;max-width:1000px;align-items:end">
        <div></div>
        <div style="font-size:11px;color:#666">empty</div>
        <div style="font-size:11px;color:#666">filled</div>
        <div style="font-size:11px;color:#666">invalid</div>
        <div style="font-size:11px;color:#666">disabled</div>
        <div style="font-size:11px;color:#666">readonly</div>

        <div style="font-size:11px;color:#666">inside</div>
        <Textarea v-bind="args" variant="bordered" label="Bio" />
        <Textarea v-bind="args" variant="bordered" label="Bio" :modelValue="'Short bio here'" />
        <Textarea v-bind="args" variant="bordered" label="Bio" :isInvalid="true" />
        <Textarea v-bind="args" variant="bordered" label="Bio" :isDisabled="true" />
        <Textarea v-bind="args" variant="bordered" label="Bio" :isReadonly="true" :modelValue="'read-only'" />

        <div style="font-size:11px;color:#666">outside</div>
        <Textarea v-bind="args" variant="bordered" labelPlacement="outside" label="Bio" placeholder="About you" />
        <Textarea v-bind="args" variant="bordered" labelPlacement="outside" label="Bio" :modelValue="'Short bio here'" />
        <Textarea v-bind="args" variant="bordered" labelPlacement="outside" label="Bio" :isInvalid="true" errorMessage="Invalid" />
        <Textarea v-bind="args" variant="bordered" labelPlacement="outside" label="Bio" :isDisabled="true" />
        <Textarea v-bind="args" variant="bordered" labelPlacement="outside" label="Bio" :isReadonly="true" :modelValue="'read-only'" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <!-- label inside -->
  <Textarea variant="bordered" label="Bio" />
  <Textarea variant="bordered" label="Bio" model-value="Short bio here" />
  <Textarea variant="bordered" label="Bio" :is-invalid="true" />
  <Textarea variant="bordered" label="Bio" :is-disabled="true" />
  <Textarea variant="bordered" label="Bio" :is-readonly="true" model-value="read-only" />

  <!-- label outside -->
  <Textarea variant="bordered" label-placement="outside" label="Bio" placeholder="About you" />
  <Textarea variant="bordered" label-placement="outside" label="Bio" model-value="Short bio here" />
  <Textarea variant="bordered" label-placement="outside" label="Bio" :is-invalid="true" error-message="Invalid" />
  <Textarea variant="bordered" label-placement="outside" label="Bio" :is-disabled="true" />
  <Textarea variant="bordered" label-placement="outside" label="Bio" :is-readonly="true" model-value="read-only" />
</template>`,
        language: 'vue',
      },
    },
  },
}

export const FormFieldShowcase: Story = {
  name: 'Full form field (label + description + error)',
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: `
      <form style="display:flex;flex-direction:column;gap:20px;max-width:440px" @submit.prevent>
        <Textarea
          v-bind="args"
          variant="bordered"
          labelPlacement="outside"
          label="Bio"
          placeholder="Tell us about yourself…"
          :isRequired="true"
          description="Max 500 characters. Shown publicly on your profile."
        />
        <Textarea
          v-bind="args"
          variant="bordered"
          labelPlacement="outside"
          label="Shipping notes"
          placeholder="Any special delivery instructions?"
          :isClearable="true"
          :rows="4"
        />
        <Textarea
          v-bind="args"
          variant="bordered"
          labelPlacement="outside"
          label="Feedback"
          :isInvalid="true"
          errorMessage="Please provide at least 20 characters."
        />
      </form>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <form style="display:flex;flex-direction:column;gap:20px;max-width:440px" @submit.prevent>
    <Textarea
      variant="bordered"
      label-placement="outside"
      label="Bio"
      placeholder="Tell us about yourself…"
      :is-required="true"
      description="Max 500 characters. Shown publicly on your profile."
    />
    <Textarea
      variant="bordered"
      label-placement="outside"
      label="Shipping notes"
      placeholder="Any special delivery instructions?"
      :is-clearable="true"
      :rows="4"
    />
    <Textarea
      variant="bordered"
      label-placement="outside"
      label="Feedback"
      :is-invalid="true"
      error-message="Please provide at least 20 characters."
    />
  </form>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const AllStates: Story = {
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:420px">
        <Textarea
          v-bind="args"
          variant="bordered"
          labelPlacement="outside"
          label="Normal"
          placeholder="Normal state"
          description="Everything is fine."
        />
        <Textarea
          v-bind="args"
          variant="bordered"
          labelPlacement="outside"
          label="Disabled"
          :isDisabled="true"
          placeholder="Disabled textarea"
        />
        <Textarea
          v-bind="args"
          variant="bordered"
          labelPlacement="outside"
          label="Readonly"
          :isReadonly="true"
          modelValue="Read only value"
        />
        <Textarea
          v-bind="args"
          variant="bordered"
          labelPlacement="outside"
          label="Invalid"
          :isInvalid="true"
          placeholder="Invalid textarea"
          errorMessage="This field has an error."
        />
        <Textarea
          v-bind="args"
          variant="bordered"
          labelPlacement="outside"
          label="Required"
          :isRequired="true"
          placeholder="A required field"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:16px;max-width:420px">
    <Textarea
      variant="bordered"
      label-placement="outside"
      label="Normal"
      placeholder="Normal state"
      description="Everything is fine."
    />
    <Textarea
      variant="bordered"
      label-placement="outside"
      label="Disabled"
      :is-disabled="true"
      placeholder="Disabled textarea"
    />
    <Textarea
      variant="bordered"
      label-placement="outside"
      label="Readonly"
      :is-readonly="true"
      model-value="Read only value"
    />
    <Textarea
      variant="bordered"
      label-placement="outside"
      label="Invalid"
      :is-invalid="true"
      placeholder="Invalid textarea"
      error-message="This field has an error."
    />
    <Textarea
      variant="bordered"
      label-placement="outside"
      label="Required"
      :is-required="true"
      placeholder="A required field"
    />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}

export const CustomStyles: Story = {
  name: 'Custom styles via classNames',
  args: {
    variant: 'bordered',
    label: 'Bio',
    labelPlacement: 'outside',
    placeholder: 'Tell us about yourself…',
    description: 'You can customize each slot with Tailwind classes.',
  },
  render: (args) => ({
    components: { Textarea },
    setup() { return { args } },
    template: `
      <div style="max-width:420px">
        <Textarea
          v-bind="args"
          :class-names="{
            inputWrapper: 'border-2 border-blue-500 rounded-lg',
            label: 'text-blue-600 font-semibold',
            input: 'text-base italic bg-blue-50',
            description: 'text-blue-700 font-medium',
          }"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Textarea } from '@auronui/vue'
</script>

<template>
  <div style="max-width:420px">
    <Textarea
      variant="bordered"
      label="Bio"
      label-placement="outside"
      placeholder="Tell us about yourself…"
      description="You can customize each slot with Tailwind classes."
      :class-names="{
        inputWrapper: 'border-2 border-blue-500 rounded-lg',
        label: 'text-blue-600 font-semibold',
        input: 'text-base italic bg-blue-50',
        description: 'text-blue-700 font-medium',
      }"
    />
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
}
