import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Fieldset, Input } from "@auronui/vue";

const meta: Meta<typeof Fieldset> = {
  component: Fieldset,
  title: "Form/Fieldset",
  tags: ["autodocs"],
  args: {
    legend: "Personal Information",
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Fieldset>;

/** 
 * Default fieldset with a legend and slot content showing labeled inputs.
 */
export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Fieldset, Input } from '@auronui/vue'
</script>

<template>
  <Fieldset legend="Personal Information">
    <Input label="First Name" placeholder="Jane" variant="bordered" />
    <Input label="Last Name" placeholder="Doe" variant="bordered" />
  </Fieldset>
</template>`,
        language: 'vue',
      }
    }
  },
  render: (args) => ({
    components: { Fieldset, Input },
    setup() { return { args } },
    template: `
      <Fieldset v-bind="args" style="padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 400px;">
        <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 8px;">
          <div>
            <Input label="First Name" placeholder="Jane" variant="bordered" />
          </div>
          <div>
            <Input label="Last Name" placeholder="Doe" variant="bordered" />
          </div>
        </div>
      </Fieldset>
    `,
  }),
};

/** Disabled fieldset — all contained controls are disabled. */
export const Disabled: Story = {
  render: (args) => ({
    components: { Fieldset, Input },
    setup() { return { args } },
    template: `
      <Fieldset v-bind="args" legend="Account Settings" :disabled="true" style="padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 400px; opacity: 0.6;">
        <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 8px;">
          <div>
            <Input label="First Name" placeholder="Jane" variant="bordered" />
          </div>
          <div>
            <Input label="Email" placeholder="john@example.com" variant="bordered" />
          </div>
        </div>
        <p style="margin-top: 8px; font-size: 12px; color: #9ca3af;">(All controls inside are natively disabled)</p>
      </Fieldset>
    `,
  }),
};

/** Fieldset without a legend — useful for structural grouping only. */
export const WithoutLegend: Story = {
  render: (args) => ({
    components: { Fieldset, Input },
    setup() { return { args } },
    template: `
      <Fieldset v-bind="args" style="padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 400px;">
        <div style="display: flex; gap: 12px;">
          <div style="flex: 1;">
            <Input label="City" placeholder="New York" variant="bordered" />
          </div>
          <div style="flex: 0 0 80px;">
            <Input label="ZIP" placeholder="10001" variant="bordered" />
          </div>
        </div>
      </Fieldset>
    `,
  }),
};

/** Custom class prop applied to the fieldset. */
export const WithCustomClass: Story = {
  args: {
    legend: "Custom Styled",
    class: "my-fieldset",
  },
  render: (args) => ({
    components: { Fieldset, Input },
    setup() { return { args } },
    template: `
      <Fieldset v-bind="args" style="padding: 16px; border: 2px solid #3b82f6; border-radius: 8px; max-width: 400px;">
        <div style="margin-top: 8px;">
          <Input label="Custom Field" placeholder="Custom fieldset" variant="bordered" />
        </div>
      </Fieldset>
    `,
  }),
};
