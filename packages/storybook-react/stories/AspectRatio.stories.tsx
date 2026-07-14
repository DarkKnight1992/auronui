import type { Meta, StoryObj } from "@storybook/react-vite";
import { AspectRatio } from "@auronui/react";

const meta: Meta<typeof AspectRatio> = {
  title: "Extended/AspectRatio",
  component: AspectRatio,
  tags: ["autodocs"],
  argTypes: {
    ratio: { control: { type: "number", min: 0.1, max: 4, step: 0.1 } },
  },
  args: {
    ratio: 16 / 9,
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 32, maxWidth: 600 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AspectRatio>;

export const Default: Story = {
  render: (args) => (
    <AspectRatio {...args}>
      <img
        src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=600"
        alt="Landscape"
        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
      />
    </AspectRatio>
  ),
};

export const Widescreen: Story = {
  args: { ratio: 16 / 9 },
  render: (args) => (
    <AspectRatio {...args}>
      <img
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
        alt="Mountain"
        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
      />
    </AspectRatio>
  ),
};

export const Square: Story = {
  args: { ratio: 1 },
  render: (args) => (
    <AspectRatio {...args} style={{ maxWidth: 300 }}>
      <img
        src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400"
        alt="Portrait"
        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
      />
    </AspectRatio>
  ),
};

export const Portrait: Story = {
  args: { ratio: 3 / 4 },
  render: (args) => (
    <AspectRatio {...args} style={{ maxWidth: 280 }}>
      <img
        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400"
        alt="Portrait"
        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }}
      />
    </AspectRatio>
  ),
};

export const WithVideo: Story = {
  args: { ratio: 16 / 9 },
  render: (args) => (
    <AspectRatio {...args}>
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0f172a",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
          fontFamily: "sans-serif",
          fontSize: 14,
        }}
      >
        Video placeholder (16:9)
      </div>
    </AspectRatio>
  ),
};

export const CustomStyles: Story = {
  args: { ratio: 16 / 9, classNames: { base: "border-4 border-blue-500 rounded-lg shadow-lg" } },
  render: (args) => (
    <AspectRatio {...args}>
      <img
        src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=600"
        alt="Landscape"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AspectRatio>
  ),
};
