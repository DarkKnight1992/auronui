import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@auronui/vue";

const meta: Meta<typeof Select> = {
  component: Select,
  title: "Form/Select",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["flat", "bordered", "faded", "underlined", "raised"],
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
    fullWidth: { control: "boolean" },
    isDisabled: { control: "boolean" },
    isReadonly: { control: "boolean" },
    isInvalid: { control: "boolean" },
    isRequired: { control: "boolean" },
  },
  args: {
    variant: "flat",
    size: "md",
    color: "default",
    labelPlacement: "inside",
    fullWidth: false,
    isDisabled: false,
    isReadonly: false,
    isInvalid: false,
    isRequired: false,
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const allFruits = [
  { value: "apple", label: "Apple" },
  { value: "apricot", label: "Apricot" },
  { value: "avocado", label: "Avocado" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "cherry", label: "Cherry" },
  { value: "cranberry", label: "Cranberry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
  { value: "grapefruit", label: "Grapefruit" },
];

/* ─── Playground & Default ───────────────────────────────────────────── */

export const Playground: Story = {
  args: {
    variant: "bordered",
    label: "Favorite Fruit",
    placeholder: "Pick a fruit",
    description: "Pick from the list.",
    errorMessage: "Please select a valid option.",
  },
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:360px">
        <Select v-bind="args">
          <SelectTrigger>
            <SelectValue :placeholder="args.placeholder" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    `,
  }),
};

export const Default: Story = {
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <Select v-bind="args" label="Favorite Fruit">
        <SelectTrigger>
          <SelectValue placeholder="Pick a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem>
        </SelectContent>
      </Select>
    `,
  }),
};

export const Controlled: Story = {
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup() {
      const fruit = ref("banana");
      return { args, fruit, items: allFruits };
    },
    template: `
      <div>
        <p style="margin-bottom:8px;font-size:14px">Selected: {{ fruit }}</p>
        <Select v-bind="args" v-model="fruit" label="Favorite Fruit">
          <SelectTrigger>
            <SelectValue placeholder="Pick a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    `,
  }),
};

/* ─── Variants / Sizes / Colors ──────────────────────────────────────── */

export const Variants: Story = {
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => {
      const variants = ["flat", "bordered", "faded", "underlined", "raised"] as const;
      return { args, items: allFruits, variants };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px; max-width: 360px;">
        <Select
          v-for="v in variants"
          :key="v"
          v-bind="args"
          :variant="v"
          :label="v.charAt(0).toUpperCase() + v.slice(1)"
        >
          <SelectTrigger>
            <SelectValue :placeholder="v + ' variant...'" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:320px">
        <Select v-bind="args" size="sm" variant="bordered" aria-label="Small select">
          <SelectTrigger><SelectValue placeholder="Small (sm)" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
        <Select v-bind="args" size="md" variant="bordered" aria-label="Medium select">
          <SelectTrigger><SelectValue placeholder="Medium (md) — default" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
        <Select v-bind="args" size="lg" variant="bordered" aria-label="Large select">
          <SelectTrigger><SelectValue placeholder="Large (lg)" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
      </div>
    `,
  }),
};

export const Colors: Story = {
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="display:flex;flex-direction:column;gap:12px;max-width:320px">
        <Select v-bind="args" variant="bordered" color="default" aria-label="Default color"><SelectTrigger><SelectValue placeholder="default" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
        <Select v-bind="args" variant="bordered" color="primary" aria-label="Primary color"><SelectTrigger><SelectValue placeholder="primary" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
        <Select v-bind="args" variant="bordered" color="secondary" aria-label="Secondary color"><SelectTrigger><SelectValue placeholder="secondary" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
        <Select v-bind="args" variant="bordered" color="success" aria-label="Success color"><SelectTrigger><SelectValue placeholder="success" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
        <Select v-bind="args" variant="bordered" color="warning" aria-label="Warning color"><SelectTrigger><SelectValue placeholder="warning" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
        <Select v-bind="args" variant="bordered" color="danger" aria-label="Danger color"><SelectTrigger><SelectValue placeholder="danger" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
      </div>
    `,
  }),
};

export const FocusByColor: Story = {
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => {
      const variants = ["flat", "faded", "bordered", "underlined", "raised"] as const;
      const colors = ["default", "primary", "secondary", "success", "warning", "danger"] as const;
      return { args, items: allFruits, variants, colors };
    },
    template: `
      <div style="display:grid;grid-template-columns:80px repeat(6,minmax(0,1fr));gap:8px;max-width:1040px;align-items:center">
        <div></div>
        <div v-for="c in colors" :key="c" style="font-size:11px;color:#666">{{ c }}</div>

        <template v-for="v in variants" :key="v">
          <div style="font-size:11px;color:#666">{{ v }}</div>
          <Select
            v-for="c in colors"
            :key="v + '-' + c"
            v-bind="args"
            :variant="v"
            :color="c"
            :aria-label="v + ' ' + c"
          >
            <SelectTrigger><SelectValue :placeholder="c" /></SelectTrigger>
            <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
          </Select>
        </template>
      </div>
    `,
  }),
};

/* ─── labelPlacement ─────────────────────────────────────────────────── */

export const LabelPlacementInside: Story = {
  args: {
    variant: "bordered",
    label: "Favorite Fruit",
    labelPlacement: "inside",
  },
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:360px">
        <Select v-bind="args">
          <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
      </div>
    `,
  }),
};

export const LabelPlacementOutside: Story = {
  args: {
    variant: "bordered",
    label: "Favorite Fruit",
    labelPlacement: "outside",
  },
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:360px">
        <Select v-bind="args">
          <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
      </div>
    `,
  }),
};

export const LabelPlacementOutsideLeft: Story = {
  args: {
    variant: "bordered",
    label: "Favorite Fruit",
    labelPlacement: "outside-left",
  },
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:520px">
        <Select v-bind="args">
          <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
      </div>
    `,
  }),
};

export const LabelPlacementMatrix: Story = {
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="display:flex;flex-direction:column;gap:32px;max-width:520px">
        <div>
          <h4 style="margin:0 0 8px;font-size:12px;color:#666;text-transform:uppercase">Inside (default)</h4>
          <div style="display:flex;flex-direction:column;gap:12px">
            <Select v-bind="args" variant="flat" label="Full name"><SelectTrigger><SelectValue placeholder="Jane Doe" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
            <Select v-bind="args" variant="bordered" label="Email"><SelectTrigger><SelectValue placeholder="jane@example.com" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
            <Select v-bind="args" variant="underlined" label="Phone"><SelectTrigger><SelectValue placeholder="+1 555 000 0000" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
          </div>
        </div>

        <div>
          <h4 style="margin:0 0 8px;font-size:12px;color:#666;text-transform:uppercase">Outside</h4>
          <div style="display:flex;flex-direction:column;gap:12px">
            <Select v-bind="args" variant="flat" label-placement="outside" label="Full name"><SelectTrigger><SelectValue placeholder="Jane Doe" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
            <Select v-bind="args" variant="bordered" label-placement="outside" label="Email"><SelectTrigger><SelectValue placeholder="jane@example.com" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
            <Select v-bind="args" variant="underlined" label-placement="outside" label="Phone"><SelectTrigger><SelectValue placeholder="+1 555 000 0000" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
          </div>
        </div>

        <div>
          <h4 style="margin:0 0 8px;font-size:12px;color:#666;text-transform:uppercase">Outside-left</h4>
          <div style="display:flex;flex-direction:column;gap:12px">
            <Select v-bind="args" variant="flat" label-placement="outside-left" label="Full name"><SelectTrigger><SelectValue placeholder="Jane Doe" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
            <Select v-bind="args" variant="bordered" label-placement="outside-left" label="Email"><SelectTrigger><SelectValue placeholder="jane@example.com" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
            <Select v-bind="args" variant="underlined" label-placement="outside-left" label="Phone"><SelectTrigger><SelectValue placeholder="+1 555 000 0000" /></SelectTrigger><SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent></Select>
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
    label: "Favorite Fruit",
    labelPlacement: "outside",
    description: "Pick from the list. Sorted alphabetically.",
  },
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:400px">
        <Select v-bind="args">
          <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
      </div>
    `,
  }),
};

export const WithErrorMessage: Story = {
  args: {
    variant: "bordered",
    label: "Favorite Fruit",
    labelPlacement: "outside",
    isInvalid: true,
    errorMessage: "Please select a valid option.",
  },
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:400px">
        <Select v-bind="args">
          <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
      </div>
    `,
  }),
};

export const ErrorSupersedesDescription: Story = {
  name: "Error supersedes description",
  args: {
    variant: "bordered",
    label: "Favorite Fruit",
    labelPlacement: "outside",
    description: "Sorted alphabetically.",
    errorMessage: "That fruit is not in the catalog.",
    isInvalid: true,
  },
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:400px">
        <Select v-bind="args">
          <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
      </div>
    `,
  }),
};

export const Required: Story = {
  args: {
    variant: "bordered",
    label: "Favorite Fruit",
    labelPlacement: "outside",
    isRequired: true,
    description: "Required field — asterisk is rendered next to the label.",
  },
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:400px">
        <Select v-bind="args">
          <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
      </div>
    `,
  }),
};

export const RequiredAcrossPlacements: Story = {
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:520px">
        <Select v-bind="args" variant="bordered" label="Inside" :is-required="true">
          <SelectTrigger><SelectValue placeholder="Required inside" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
        <Select v-bind="args" variant="bordered" label="Outside" label-placement="outside" :is-required="true">
          <SelectTrigger><SelectValue placeholder="Required outside" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
        <Select v-bind="args" variant="bordered" label="Outside-left" label-placement="outside-left" :is-required="true">
          <SelectTrigger><SelectValue placeholder="Required outside-left" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
      </div>
    `,
  }),
};

/* ─── State primitives ─────────────────────────────────────────────── */

export const Invalid: Story = {
  args: {
    variant: "bordered",
    label: "Favorite Fruit",
    labelPlacement: "outside",
    isInvalid: true,
    errorMessage: "This field has an error.",
  },
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="max-width:360px">
        <Select v-bind="args">
          <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  args: {
    variant: "bordered",
    isDisabled: true,
  },
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <Select v-bind="args" aria-label="Disabled select">
        <SelectTrigger><SelectValue placeholder="Disabled select" /></SelectTrigger>
        <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
      </Select>
    `,
  }),
};

export const Readonly: Story = {
  args: {
    variant: "bordered",
    isReadonly: true,
    label: "Favorite Fruit",
    labelPlacement: "outside",
    defaultValue: "banana",
  },
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <Select v-bind="args">
        <SelectTrigger><SelectValue placeholder="Readonly" /></SelectTrigger>
        <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
      </Select>
    `,
  }),
};

export const FullWidth: Story = {
  args: {
    variant: "bordered",
    fullWidth: true,
    label: "Framework",
    labelPlacement: "outside",
  },
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args, items: allFruits }),
    template: `
      <div style="width:100%">
        <Select v-bind="args">
          <SelectTrigger><SelectValue placeholder="Choose..." /></SelectTrigger>
          <SelectContent><SelectItem v-for="item in items" :key="item.value" :value="item.value" >{{ item.label }}</SelectItem></SelectContent>
        </Select>
      </div>
    `,
  }),
};

export const WithDisabledItems: Story = {
  render: (args) => ({
    components: { Select, SelectTrigger, SelectValue, SelectContent, SelectItem },
    setup: () => ({ args }),
    template: `
      <Select v-bind="args" label="Favorite Fruit" variant="bordered">
        <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana" :is-disabled="true">Banana (unavailable)</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
          <SelectItem value="date" :is-disabled="true">Date (unavailable)</SelectItem>
          <SelectItem value="elderberry">Elderberry</SelectItem>
        </SelectContent>
      </Select>
    `,
  }),
};
