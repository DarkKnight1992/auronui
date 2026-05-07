import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Kbd } from "@auronui/vue";

const meta: Meta<typeof Kbd> = {
  component: Kbd,
  title: "Components/Kbd",
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "light"] },
  },
  args: {
    variant: "default",
  },
};

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Default: Story = {
  render: (args) => ({
    components: { Kbd },
    setup: () => ({ args }),
    template: `<Kbd v-bind="args">⌘K</Kbd>`,
  }),
};

export const Light: Story = {
  render: (args) => ({
    components: { Kbd },
    setup: () => ({ args }),
    template: `<Kbd v-bind="args">⌘K</Kbd>`,
  }),
  args: { variant: "light" },
};

export const WithAbbr: Story = {
  render: (args) => ({
    components: { Kbd },
    setup: () => ({ args }),
    template: `
      <Kbd v-bind="args">
        <template #abbr>Ctrl</template>
        C
      </Kbd>
    `,
  }),
};

export const CommonShortcuts: Story = {
  render: (args) => ({
    components: { Kbd },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        <Kbd v-bind="args">⌘</Kbd>
        <Kbd v-bind="args">⌥</Kbd>
        <Kbd v-bind="args">⇧</Kbd>
        <Kbd v-bind="args">⌃</Kbd>
        <Kbd v-bind="args">⌫</Kbd>
        <Kbd v-bind="args">↵</Kbd>
        <Kbd v-bind="args">⎋</Kbd>
        <Kbd v-bind="args">⇥</Kbd>
      </div>
    `,
  }),
};

export const LightVariantShowcase: Story = {
  render: (args) => ({
    components: { Kbd },
    setup: () => ({ args }),
    template: `
      <div style="display: flex; gap: 8px; align-items: center;">
        <Kbd v-bind="args" variant="default">⌘K</Kbd>
        <span style="font-size: 12px; color: #888;">vs</span>
        <Kbd v-bind="args" variant="light">⌘K</Kbd>
      </div>
    `,
  }),
};
