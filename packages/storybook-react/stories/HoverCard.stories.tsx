import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link, HoverCard, HoverCardTrigger, HoverCardContent, HoverCardArrow } from "@auronui/react";

const meta: Meta = {
  title: "Components/HoverCard",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger>
        <Link href="#">@auronui</Link>
      </HoverCardTrigger>
      <HoverCardContent>
        <div style={{ padding: 16, maxWidth: 280 }}>
          <h3 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 600 }}>Auron UI</h3>
          <p style={{ margin: 0, fontSize: 13, color: "#555" }}>
            React component library with full HeroUI visual parity.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const WithArrow: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger>
        <Link href="#">Hover for details</Link>
      </HoverCardTrigger>
      <HoverCardContent>
        <div style={{ padding: "12px 16px" }}>
          <p style={{ margin: 0, fontSize: 13 }}>This hover card has a directional arrow.</p>
        </div>
        <HoverCardArrow />
      </HoverCardContent>
    </HoverCard>
  ),
};

export const FastDelays: Story = {
  name: "Custom delays (fast)",
  render: () => (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger>
        <Link href="#">Quick hover</Link>
      </HoverCardTrigger>
      <HoverCardContent>
        <div style={{ padding: "12px 16px" }}>
          <p style={{ margin: 0, fontSize: 13 }}>Opens and closes after 100ms.</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};
