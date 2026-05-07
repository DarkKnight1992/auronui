import type { Meta, StoryObj } from "@storybook/vue3-vite";
import SmokeTest from "./SmokeTest.vue";

const meta: Meta<typeof SmokeTest> = {
  component: SmokeTest,
  title: "Components/SmokeTest",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SmokeTest>;

export const Default: Story = {
  name: "Smoke Test — Phase 0 Infrastructure",
};
