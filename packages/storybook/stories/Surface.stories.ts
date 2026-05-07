import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Surface } from "@auronui/vue";

const meta: Meta<typeof Surface> = {
  component: Surface,
  title: "Components/Surface",
  tags: ["autodocs"],
  argTypes: {
    as: { control: "select", options: ["div", "section", "article", "aside"] },
    variant: {
      control: "select",
      options: ["default", "secondary", "tertiary", "transparent"],
    },
  },
  args: {
    as: "div",
    variant: "default",
  },
};

export default meta;
type Story = StoryObj<typeof Surface>;

export const Default: Story = {
  render: (args) => ({
    components: { Surface },
    setup: () => ({ args }),
    template: `
      <Surface v-bind="args" style="padding: 16px; border-radius: 8px;">
        <p style="margin: 0;">Surface content area</p>
      </Surface>
    `,
  }),
};

export const Secondary: Story = {
  render: (args) => ({
    components: { Surface },
    setup: () => ({ args }),
    template: `
      <Surface v-bind="args" style="padding: 16px; border-radius: 8px;">
        <p style="margin: 0;">Secondary surface</p>
      </Surface>
    `,
  }),
  args: { variant: "secondary" },
};

export const Tertiary: Story = {
  render: (args) => ({
    components: { Surface },
    setup: () => ({ args }),
    template: `
      <Surface v-bind="args" style="padding: 16px; border-radius: 8px;">
        <p style="margin: 0;">Tertiary surface</p>
      </Surface>
    `,
  }),
  args: { variant: "tertiary" },
};

export const Transparent: Story = {
  render: (args) => ({
    components: { Surface },
    setup: () => ({ args }),
    template: `
      <Surface v-bind="args" style="padding: 16px; border-radius: 8px; border: 1px dashed #ccc;">
        <p style="margin: 0;">Transparent surface (border added for visibility)</p>
      </Surface>
    `,
  }),
  args: { variant: "transparent" },
};

export const AllVariants: Story = {
  render: (args) => ({
    components: { Surface },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <Surface v-bind="args" variant="default" style="padding: 16px; border-radius: 8px;">
          <p style="margin: 0; font-weight: 600;">Default</p>
          <p style="margin: 4px 0 0;">Base background surface</p>
        </Surface>
        <Surface v-bind="args" variant="secondary" style="padding: 16px; border-radius: 8px;">
          <p style="margin: 0; font-weight: 600;">Secondary</p>
          <p style="margin: 4px 0 0;">Slightly elevated surface</p>
        </Surface>
        <Surface v-bind="args" variant="tertiary" style="padding: 16px; border-radius: 8px;">
          <p style="margin: 0; font-weight: 600;">Tertiary</p>
          <p style="margin: 4px 0 0;">Most elevated surface</p>
        </Surface>
        <Surface v-bind="args" variant="transparent" style="padding: 16px; border-radius: 8px; border: 1px dashed #ccc;">
          <p style="margin: 0; font-weight: 600;">Transparent</p>
          <p style="margin: 4px 0 0;">No background (border for visibility)</p>
        </Surface>
      </div>
    `,
  }),
};
