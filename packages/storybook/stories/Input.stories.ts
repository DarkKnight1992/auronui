import { setup, type Meta, type StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import { Input } from "@auronui/vue";

const meta: Meta<typeof Input> = {
  title: "Form/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["flat", "faded", "bordered", "underlined", "raised"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "success", "warning", "danger"],
    },
    labelPlacement: {
      control: "select",
      options: ["inside", "outside", "outside-left"],
    },
    label: { control: "text" },
    placeholder: { control: "text" },
    description: { control: "text" },
    errorMessage: { control: "text" },
    isDisabled: { control: "boolean" },
    isReadonly: { control: "boolean" },
    isInvalid: { control: "boolean" },
    isRequired: { control: "boolean" },
    isClearable: { control: "boolean" },
    showPasswordToggle: { control: "boolean" },
    fullWidth: { control: "boolean" },
    classNames: { control: "object", description: "Per-slot class overrides. Keys match the component anatomy slot names." },
  },
  args: {
    variant: "flat",
    size: "md",
    color: "default",
    labelPlacement: "inside",
    isDisabled: false,
    isReadonly: false,
    isInvalid: false,
    isRequired: false,
    isClearable: false,
    showPasswordToggle: false,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

type PlaygroundArgs = NonNullable<Story["args"]> & {
  showStartIcon?: boolean;
  showEndIcon?: boolean;
};

export const Playground: Story = {
  argTypes: {
    showStartIcon: { control: "boolean", name: "start icon" },
    showEndIcon: { control: "boolean", name: "end icon" },
  },
  args: {
    variant: "bordered",
    label: "Email",
    placeholder: "you@example.com",
    description: "We'll never share your email.",
    errorMessage: "Error ",
    showStartIcon: false,
    showEndIcon: false,
  } as PlaygroundArgs,
  render: (args: PlaygroundArgs) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: `
      <div style="max-width:360px">
        <Input v-bind="args" aria-label="Playground input">
          <template v-if="args.showStartIcon" #startContent>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </template>
          <template v-if="args.showEndIcon" #endContent>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </template>
        </Input>
      </div>
    `,
  }),
};

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Input } from '@auronui/vue'
</script>

<template>
  <Input variant="underlined" size="sm" color="warning" placeholder="Type something..." />
</template>`,
        type: 'code',
        language: 'vue',
      }
    }
  },
  args: {
    variant: "underlined",
    size: "sm",
    color: "warning",
  },
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: '<Input v-bind="args" placeholder="Type something..." aria-label="Default input" />',
  }),
};

export const Variants: Story = {
  args: {
    size: "sm",
  },

  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:320px">
        <div>
          <label style="display:block;font-size:12px;color:#666;margin-bottom:4px">flat (default)</label>
          <Input v-bind="args" variant="flat" placeholder="Flat input" aria-label="Flat input" />
        </div>
        <div>
          <label style="display:block;font-size:12px;color:#666;margin-bottom:4px">faded</label>
          <Input v-bind="args" variant="faded" placeholder="Faded input" aria-label="Faded input" />
        </div>
        <div>
          <label style="display:block;font-size:12px;color:#666;margin-bottom:4px">bordered</label>
          <Input v-bind="args" variant="bordered" placeholder="Bordered input" aria-label="Bordered input" />
        </div>
        <div>
          <label style="display:block;font-size:12px;color:#666;margin-bottom:4px">underlined</label>
          <Input v-bind="args" variant="underlined" placeholder="Underlined input" aria-label="Underlined input" />
        </div>
        <div>
          <label style="display:block;font-size:12px;color:#666;margin-bottom:4px">raised</label>
          <Input v-bind="args" variant="raised" placeholder="Raised input" aria-label="Raised input" />
        </div>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:320px">
        <Input v-bind="args" size="sm" variant="bordered" placeholder="Small (sm)" aria-label="Small input" />
        <Input v-bind="args" size="md" variant="bordered" placeholder="Medium (md) — default" aria-label="Medium input" />
        <Input v-bind="args" size="lg" variant="bordered" placeholder="Large (lg)" aria-label="Large input" />
      </div>
    `,
  }),
};

export const Colors: Story = {
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:320px">
        <Input v-bind="args" variant="bordered" color="default" placeholder="default" aria-label="Default color input" />
        <Input v-bind="args" variant="bordered" color="primary" placeholder="primary" aria-label="Primary color input" />
        <Input v-bind="args" variant="bordered" color="secondary" placeholder="secondary" aria-label="Secondary color input" />
        <Input v-bind="args" variant="bordered" color="success" placeholder="success" aria-label="Success color input" />
        <Input v-bind="args" variant="bordered" color="warning" placeholder="warning" aria-label="Warning color input" />
        <Input v-bind="args" variant="bordered" color="danger" placeholder="danger" aria-label="Danger color input" />
      </div>
    `,
  }),
};

export const FocusByColor: Story = {
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
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
        <Input v-bind="args" variant="flat" color="default" placeholder="default" aria-label="flat default" />
        <Input v-bind="args" variant="flat" color="primary" placeholder="primary" aria-label="flat primary" />
        <Input v-bind="args" variant="flat" color="secondary" placeholder="secondary" aria-label="flat secondary" />
        <Input v-bind="args" variant="flat" color="success" placeholder="success" aria-label="flat success" />
        <Input v-bind="args" variant="flat" color="warning" placeholder="warning" aria-label="flat warning" />
        <Input v-bind="args" variant="flat" color="danger" placeholder="danger" aria-label="flat danger" />

        <div style="font-size:11px;color:#666">faded</div>
        <Input v-bind="args" variant="faded" color="default" placeholder="default" aria-label="faded default" />
        <Input v-bind="args" variant="faded" color="primary" placeholder="primary" aria-label="faded primary" />
        <Input v-bind="args" variant="faded" color="secondary" placeholder="secondary" aria-label="faded secondary" />
        <Input v-bind="args" variant="faded" color="success" placeholder="success" aria-label="faded success" />
        <Input v-bind="args" variant="faded" color="warning" placeholder="warning" aria-label="faded warning" />
        <Input v-bind="args" variant="faded" color="danger" placeholder="danger" aria-label="faded danger" />

        <div style="font-size:11px;color:#666">bordered</div>
        <Input v-bind="args" variant="bordered" color="default" placeholder="default" aria-label="bordered default" />
        <Input v-bind="args" variant="bordered" color="primary" placeholder="primary" aria-label="bordered primary" />
        <Input v-bind="args" variant="bordered" color="secondary" placeholder="secondary" aria-label="bordered secondary" />
        <Input v-bind="args" variant="bordered" color="success" placeholder="success" aria-label="bordered success" />
        <Input v-bind="args" variant="bordered" color="warning" placeholder="warning" aria-label="bordered warning" />
        <Input v-bind="args" variant="bordered" color="danger" placeholder="danger" aria-label="bordered danger" />

        <div style="font-size:11px;color:#666">underlined</div>
        <Input v-bind="args" variant="underlined" color="default" placeholder="default" aria-label="underlined default" />
        <Input v-bind="args" variant="underlined" color="primary" placeholder="primary" aria-label="underlined primary" />
        <Input v-bind="args" variant="underlined" color="secondary" placeholder="secondary" aria-label="underlined secondary" />
        <Input v-bind="args" variant="underlined" color="success" placeholder="success" aria-label="underlined success" />
        <Input v-bind="args" variant="underlined" color="warning" placeholder="warning" aria-label="underlined warning" />
        <Input v-bind="args" variant="underlined" color="danger" placeholder="danger" aria-label="underlined danger" />

        <div style="font-size:11px;color:#666">raised</div>
        <Input v-bind="args" variant="raised" color="default" placeholder="default" aria-label="raised default" />
        <Input v-bind="args" variant="raised" color="primary" placeholder="primary" aria-label="raised primary" />
        <Input v-bind="args" variant="raised" color="secondary" placeholder="secondary" aria-label="raised secondary" />
        <Input v-bind="args" variant="raised" color="success" placeholder="success" aria-label="raised success" />
        <Input v-bind="args" variant="raised" color="warning" placeholder="warning" aria-label="raised warning" />
        <Input v-bind="args" variant="raised" color="danger" placeholder="danger" aria-label="raised danger" />
      </div>
    `,
  }),
};

/* ─── labelPlacement ─────────────────────────────────────────────────── */

export const LabelPlacementInside: Story = {
  args: {
    variant: "bordered",
    label: "Email",
    labelPlacement: "inside",
    placeholder: "you@example.com",
  },
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: '<div style="max-width:360px"><Input v-bind="args" /></div>',
  }),
};

export const LabelPlacementOutside: Story = {
  args: {
    variant: "bordered",
    label: "Email",
    labelPlacement: "outside",
    placeholder: "you@example.com",
  },
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: '<div style="max-width:360px"><Input v-bind="args" /></div>',
  }),
};

export const LabelPlacementOutsideLeft: Story = {
  args: {
    variant: "bordered",
    label: "Email",
    labelPlacement: "outside-left",
    placeholder: "you@example.com",
  },
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: '<div style="max-width:520px"><Input v-bind="args" /></div>',
  }),
};

export const LabelPlacementMatrix: Story = {
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:32px;max-width:520px">
        <div>
          <h4 style="margin:0 0 8px;font-size:12px;color:#666;text-transform:uppercase">Inside (default)</h4>
          <div style="display:flex;flex-direction:column;gap:12px">
            <Input v-bind="args" variant="flat" label="Full name" placeholder="Jane Doe" />
            <Input v-bind="args" variant="bordered" label="Email" placeholder="jane@example.com" />
            <Input v-bind="args" variant="underlined" label="Phone" placeholder="+1 555 000 0000" />
          </div>
        </div>

        <div>
          <h4 style="margin:0 0 8px;font-size:12px;color:#666;text-transform:uppercase">Outside</h4>
          <div style="display:flex;flex-direction:column;gap:12px">
            <Input v-bind="args" variant="flat" labelPlacement="outside" label="Full name" placeholder="Jane Doe" />
            <Input v-bind="args" variant="bordered" labelPlacement="outside" label="Email" placeholder="jane@example.com" />
            <Input v-bind="args" variant="underlined" labelPlacement="outside" label="Phone" placeholder="+1 555 000 0000" />
          </div>
        </div>

        <div>
          <h4 style="margin:0 0 8px;font-size:12px;color:#666;text-transform:uppercase">Outside-left</h4>
          <div style="display:flex;flex-direction:column;gap:12px">
            <Input v-bind="args" variant="flat" labelPlacement="outside-left" label="Full name" placeholder="Jane Doe" />
            <Input v-bind="args" variant="bordered" labelPlacement="outside-left" label="Email" placeholder="jane@example.com" />
            <Input v-bind="args" variant="underlined" labelPlacement="outside-left" label="Phone" placeholder="+1 555 000 0000" />
          </div>
        </div>
      </div>
    `,
  }),
};

/* ─── description / errorMessage / isRequired ────────────────────────── */

export const WithDescription: Story = {
  args: {
    variant: "bordered",
    label: "Username",
    labelPlacement: "outside",
    placeholder: "choose a username",
    description: "3–20 characters. Letters, numbers, and underscores only.",
  },
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: '<div style="max-width:400px"><Input v-bind="args" /></div>',
  }),
};

export const WithErrorMessage: Story = {
  args: {
    variant: "bordered",
    label: "Email",
    labelPlacement: "outside",
    placeholder: "you@example.com",
    isInvalid: true,
    errorMessage: "Please enter a valid email address.",
  },
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: '<div style="max-width:400px"><Input v-bind="args" /></div>',
  }),
};

export const ErrorSupersedesDescription: Story = {
  name: "Error supersedes description",
  args: {
    variant: "bordered",
    label: "Email",
    labelPlacement: "outside",
    placeholder: "you@example.com",
    description: "We'll only contact you about your account.",
    errorMessage: "That email is already in use.",
    isInvalid: true,
  },
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: '<div style="max-width:400px"><Input v-bind="args" /></div>',
  }),
};

export const Required: Story = {
  args: {
    variant: "bordered",
    label: "Full name",
    labelPlacement: "outside",
    placeholder: "Jane Doe",
    isRequired: true,
    description: "Required field — asterisk is rendered next to the label.",
  },
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: '<div style="max-width:400px"><Input v-bind="args" /></div>',
  }),
};

export const RequiredAcrossPlacements: Story = {
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:520px">
        <Input v-bind="args" variant="bordered" label="Inside" :isRequired="true" placeholder="Required inside" />
        <Input v-bind="args" variant="bordered" label="Outside" labelPlacement="outside" :isRequired="true" placeholder="Required outside" />
        <Input v-bind="args" variant="bordered" label="Outside-left" labelPlacement="outside-left" :isRequired="true" placeholder="Required outside-left" />
      </div>
    `,
  }),
};

export const FormFieldShowcase: Story = {
  name: "Full form field (label + description + error)",
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: `
      <form style="display:flex;flex-direction:column;gap:20px;max-width:420px" @submit.prevent>
        <Input
          v-bind="args"
          variant="bordered"
          labelPlacement="outside"
          label="Email"
          placeholder="you@example.com"
          type="email"
          :isRequired="true"
          description="We use this to send important account notifications."
        />
        <Input
          v-bind="args"
          variant="bordered"
          labelPlacement="outside"
          label="Password"
          type="password"
          placeholder="Enter a password"
          :isRequired="true"
          description="Must be at least 12 characters."
        />
        <Input
          v-bind="args"
          variant="bordered"
          labelPlacement="outside"
          label="Confirm password"
          type="password"
          :isInvalid="true"
          errorMessage="Passwords do not match."
        />
      </form>
    `,
  }),
};

/* ─── State primitives ─────────────────────────────────────────────── */

export const Invalid: Story = {
  args: {
    variant: "bordered",
    label: "Email",
    labelPlacement: "outside",
    isInvalid: true,
    errorMessage: "This field has an error.",
    placeholder: "you@example.com",
  },
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: '<div style="max-width:360px"><Input v-bind="args" /></div>',
  }),
};

export const Disabled: Story = {
  args: {
    variant: "bordered",
    isDisabled: true,
  },
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: `
      <Input
        v-bind="args"
        placeholder="Disabled input"
        aria-label="Disabled input"
      />
    `,
  }),
};

export const Readonly: Story = {
  args: {
    variant: "bordered",
    isReadonly: true,
  },
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: `
      <Input
        v-bind="args"
        :modelValue="'Read-only value'"
        aria-label="Readonly input"
      />
    `,
  }),
};

export const FullWidth: Story = {
  args: {
    variant: "bordered",
    fullWidth: true,
    label: "Full width",
    labelPlacement: "outside",
  },
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: '<Input v-bind="args" placeholder="Takes the entire available width" />',
  }),
};

/* ─── Types ──────────────────────────────────────────────────────────── */

export const TypePassword: Story = {
  args: {
    variant: "bordered",
    type: "password",
    label: "Password",
    labelPlacement: "outside",
    description: "At least 12 characters.",
  },
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template:
      '<div style="max-width:360px"><Input v-bind="args" placeholder="Enter password" /></div>',
  }),
};

export const TypeEmail: Story = {
  args: {
    variant: "bordered",
    type: "email",
    label: "Email",
    labelPlacement: "outside",
  },
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template:
      '<div style="max-width:360px"><Input v-bind="args" placeholder="you@example.com" /></div>',
  }),
};

/* ─── Clearable & Password Toggle ────────────────────────────────────── */

export const Clearable: Story = {
  args: {
    variant: "bordered",
    label: "Search",
    labelPlacement: "outside",
    placeholder: "Type to search…",
    isClearable: true,
  },
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      const model = ref("hello world");
      return { args, model };
    },
    template:
      '<div style="max-width:360px"><Input v-bind="args" v-model="model" @clear="() => console.log(\'cleared\')" /></div>',
  }),
};

export const ClearableEmpty: Story = {
  name: "Clearable (empty — button hidden)",
  args: {
    variant: "bordered",
    label: "Nickname",
    labelPlacement: "outside",
    placeholder: "Type something…",
    isClearable: true,
    description: "Clear button appears only when the input has content.",
  },
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: '<div style="max-width:360px"><Input v-bind="args" /></div>',
  }),
};

export const ClearableSizes: Story = {
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      const sm = ref("small value");
      const md = ref("medium value");
      const lg = ref("large value");
      return { args, sm, md, lg };
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:360px">
        <Input v-bind="args" size="sm" variant="bordered" label="Small" labelPlacement="outside" :isClearable="true" v-model="sm" />
        <Input v-bind="args" size="md" variant="bordered" label="Medium" labelPlacement="outside" :isClearable="true" v-model="md" />
        <Input v-bind="args" size="lg" variant="bordered" label="Large" labelPlacement="outside" :isClearable="true" v-model="lg" />
      </div>
    `,
  }),
};

export const PasswordToggle: Story = {
  args: {
    variant: "bordered",
    type: "password",
    label: "Password",
    labelPlacement: "outside",
    placeholder: "Enter password",
    showPasswordToggle: true,
  },
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      const model = ref("s3cret-value");
      return { args, model };
    },
    template: '<div style="max-width:360px"><Input v-bind="args" v-model="model" /></div>',
  }),
};

export const PasswordToggleWithClear: Story = {
  name: "Password toggle + clearable",
  args: {
    variant: "bordered",
    type: "password",
    label: "Password",
    labelPlacement: "outside",
    placeholder: "Enter password",
    showPasswordToggle: true,
    isClearable: true,
    description: "Both clear × and show/hide eye are rendered side-by-side.",
  },
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      const model = ref("my-password");
      return { args, model };
    },
    template: '<div style="max-width:360px"><Input v-bind="args" v-model="model" /></div>',
  }),
};

export const PasswordToggleIgnoredForNonPassword: Story = {
  name: "showPasswordToggle ignored when type != password",
  args: {
    variant: "bordered",
    type: "email",
    label: "Email",
    labelPlacement: "outside",
    placeholder: "you@example.com",
    showPasswordToggle: true,
    description: "showPasswordToggle is a no-op unless type is 'password'.",
  },
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      const model = ref("user@example.com");
      return { args, model };
    },
    template: '<div style="max-width:360px"><Input v-bind="args" v-model="model" /></div>',
  }),
};

/* ─── Icons ──────────────────────────────────────────────────────────── */

export const WithStartIcon: Story = {
  args: {
    variant: "bordered",
    size: "md",
  },
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: `
      <div style="max-width:320px">
        <Input v-bind="args" placeholder="Search…" aria-label="Search">
          <template #startContent>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </template>
        </Input>
      </div>
    `,
  }),
};

export const WithEndIcon: Story = {
  args: {
    variant: "bordered",
  },
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: `
      <div style="max-width:320px">
        <Input v-bind="args" placeholder="Clearable input" aria-label="Clearable">
          <template #endContent>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </template>
        </Input>
      </div>
    `,
  }),
};

export const WithBothIcons: Story = {
  args: {
    variant: "bordered",
    type: "email",
  },
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: `
      <div style="max-width:320px">
        <Input v-bind="args" placeholder="you@example.com" aria-label="Email">
          <template #startContent>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </template>
          <template #endContent>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </template>
        </Input>
      </div>
    `,
  }),
};

export const WithLabelInsideAndIcons: Story = {
  args: {
    variant: "bordered",
    size: "sm",
    label: "Search",
  },
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: `
      <div style="max-width:320px">
        <Input v-bind="args">
          <template #startContent>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </template>
        </Input>
      </div>
    `,
  }),
};

/* ─── Matrix stories ─────────────────────────────────────────────── */

export const LabelStatesMatrix: Story = {
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: `
      <div style="display:grid;grid-template-columns:80px repeat(5,minmax(0,1fr));gap:12px;max-width:900px;align-items:end">
        <div></div>
        <div style="font-size:11px;color:#666">empty</div>
        <div style="font-size:11px;color:#666">filled</div>
        <div style="font-size:11px;color:#666">invalid</div>
        <div style="font-size:11px;color:#666">disabled</div>
        <div style="font-size:11px;color:#666">readonly</div>

        <div style="font-size:11px;color:#666">inside</div>
        <Input v-bind="args" variant="bordered" label="Email" />
        <Input v-bind="args" variant="bordered" label="Email" :modelValue="'jane@example.com'" />
        <Input v-bind="args" variant="bordered" label="Email" :isInvalid="true" />
        <Input v-bind="args" variant="bordered" label="Email" :isDisabled="true" />
        <Input v-bind="args" variant="bordered" label="Email" :isReadonly="true" :modelValue="'read-only'" />

        <div style="font-size:11px;color:#666">outside</div>
        <Input v-bind="args" variant="bordered" labelPlacement="outside" label="Email" placeholder="you@example.com" />
        <Input v-bind="args" variant="bordered" labelPlacement="outside" label="Email" :modelValue="'jane@example.com'" />
        <Input v-bind="args" variant="bordered" labelPlacement="outside" label="Email" :isInvalid="true" errorMessage="Invalid" />
        <Input v-bind="args" variant="bordered" labelPlacement="outside" label="Email" :isDisabled="true" />
        <Input v-bind="args" variant="bordered" labelPlacement="outside" label="Email" :isReadonly="true" :modelValue="'read-only'" />
      </div>
    `,
  }),
};

export const AllStates: Story = {
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:400px">
        <Input
          v-bind="args"
          variant="bordered"
          labelPlacement="outside"
          label="Normal"
          placeholder="Normal state"
          description="Everything is fine."
        />
        <Input
          v-bind="args"
          variant="bordered"
          labelPlacement="outside"
          label="Disabled"
          :isDisabled="true"
          placeholder="Disabled input"
        />
        <Input
          v-bind="args"
          variant="bordered"
          labelPlacement="outside"
          label="Readonly"
          :isReadonly="true"
          :modelValue="'Read only value'"
        />
        <Input
          v-bind="args"
          variant="bordered"
          labelPlacement="outside"
          label="Invalid"
          :isInvalid="true"
          placeholder="Invalid input"
          errorMessage="This field has an error."
        />
        <Input
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
};

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  args: {
    variant: "bordered",
    label: "Email",
    labelPlacement: "outside",
    placeholder: "you@example.com",
  },
  render: (args: Story["args"]) => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: `
      <div style="max-width:400px">
        <Input
          v-bind="args"
          :class-names="{
            inputWrapper: 'border-2 border-blue-500 rounded-lg',
            label: 'text-blue-600 font-semibold',
            input: 'text-base placeholder-blue-300',
            helperWrapper: 'text-blue-600',
          }"
          description="Custom styling applied via classNames prop"
        />
      </div>
    `,
  }),
};
