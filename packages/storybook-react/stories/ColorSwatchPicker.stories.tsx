import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorSwatchPicker } from "@auronui/react";

const defaultPalette = ["#ff0000", "#ff6b00", "#ffcc00", "#00cc44", "#0066ff", "#aa00ff"];
const pastelPalette = ["#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff", "#e8baff"];
const neutralPalette = ["#ffffff", "#d4d4d4", "#a3a3a3", "#737373", "#404040", "#000000"];

const meta: Meta<typeof ColorSwatchPicker> = {
  title: "Components/ColorSwatchPicker",
  component: ColorSwatchPicker,
  tags: ["autodocs"],
  argTypes: {
    layout: { control: "select", options: ["grid", "stack"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    variant: { control: "select", options: ["circle", "square"] },
    isDisabled: { control: "boolean" },
  },
  args: {
    colors: defaultPalette,
    layout: "grid",
    size: "md",
    variant: "circle",
    isDisabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof ColorSwatchPicker>;

export const Default: Story = {
  name: "Default Palette",
  render: (args) => <ColorSwatchPicker {...args} aria-label="Color palette" />,
};

export const PastelPalette: Story = {
  render: (args) => <ColorSwatchPicker {...args} colors={pastelPalette} aria-label="Pastel colors" />,
};

export const NeutralPalette: Story = {
  name: "Neutral / Grayscale",
  render: (args) => <ColorSwatchPicker {...args} colors={neutralPalette} variant="square" aria-label="Neutral colors" />,
};

export const WithSelection: Story = {
  name: "With Pre-selected",
  render: (args) => (
    <ColorSwatchPicker {...args} colors={defaultPalette} defaultValue="#00cc44" aria-label="Color palette with selection" />
  ),
};

export const SquareVariant: Story = {
  name: "Square Swatches",
  render: (args) => <ColorSwatchPicker {...args} colors={defaultPalette} variant="square" aria-label="Square color swatches" />,
};
