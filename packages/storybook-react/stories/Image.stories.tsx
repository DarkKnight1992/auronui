import type { Meta, StoryObj } from "@storybook/react-vite";
import { Image } from "@auronui/react";

const meta: Meta<typeof Image> = {
  title: "Components/Image",
  component: Image,
  tags: ["autodocs"],
  argTypes: {
    fit: {
      control: "select",
      options: ["cover", "contain", "fill"],
    },
    radius: {
      control: "select",
      options: ["none", "sm", "md", "lg", "full"],
    },
    isLazy: { control: "boolean" },
    isZoomable: { control: "boolean" },
  },
  args: {
    src: "https://picsum.photos/id/1015/400/300",
    alt: "A scenic river valley",
    fit: "cover",
    radius: "md",
    isLazy: false,
    isZoomable: false,
  },
};

export default meta;
type Story = StoryObj<typeof Image>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 320 }}>
      <Image {...args} style={{ width: 320, height: 240 }} />
    </div>
  ),
};

export const Zoomable: Story = {
  args: { isZoomable: true },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Image {...args} style={{ width: 320, height: 240 }} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Click the image to open a zoomed lightbox view, built on the existing Modal component.",
      },
    },
  },
};

export const ErrorFallback: Story = {
  name: "Error fallback",
  args: { src: "https://this-domain-does-not-exist-auron.example/broken.jpg" },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Image {...args} style={{ width: 320, height: 240 }} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "When the src fails to load, a fallback icon is shown in place of the broken image.",
      },
    },
  },
};

export const Radii: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <Image src="https://picsum.photos/id/1025/200/200" alt="none" radius="none" isLazy={false} style={{ width: 100, height: 100 }} />
      <Image src="https://picsum.photos/id/1025/200/200" alt="sm" radius="sm" isLazy={false} style={{ width: 100, height: 100 }} />
      <Image src="https://picsum.photos/id/1025/200/200" alt="lg" radius="lg" isLazy={false} style={{ width: 100, height: 100 }} />
      <Image src="https://picsum.photos/id/1025/200/200" alt="full" radius="full" isLazy={false} style={{ width: 100, height: 100 }} />
    </div>
  ),
};

export const LazyLoading: Story = {
  name: "Lazy loading (scroll to reveal)",
  args: { isLazy: true },
  render: (args) => (
    <div style={{ height: 200, overflowY: "auto", border: "1px solid #ddd" }}>
      <div style={{ height: 400, display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>
        Scroll down to reveal the image
      </div>
      <Image {...args} style={{ width: "100%", height: 240 }} />
    </div>
  ),
};
