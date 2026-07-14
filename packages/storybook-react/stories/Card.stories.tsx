import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardHeader, CardBody, CardFooter, Button, Avatar, Chip } from "@auronui/react";

const meta: Meta<typeof Card> = {
  component: Card,
  title: "Components/Card",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "tertiary", "transparent", "bordered", "blurred"],
    },
    shadow: {
      control: "select",
      options: ["none", "sm", "md", "lg"],
    },
    radius: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl"],
    },
    isHoverable: { control: "boolean" },
    isPressable: { control: "boolean" },
    isDisabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
  args: {
    variant: "default",
    shadow: "sm",
    radius: "lg",
    isHoverable: false,
    isPressable: false,
    isDisabled: false,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Playground: Story = {
  render: (args) => (
    <Card {...args} style={{ width: 340 }}>
      <CardHeader>
        <div className="card__title">Onboarding checklist</div>
        <div className="card__description">Finish setup to unlock your workspace.</div>
      </CardHeader>
      <CardBody>
        Complete the remaining 3 steps to publish your first project. Your progress is saved automatically.
      </CardBody>
      <CardFooter>
        <Button color="primary" size="sm">Continue</Button>
        <Button variant="ghost" size="sm">Skip</Button>
      </CardFooter>
    </Card>
  ),
};

export const ProductCard: Story = {
  render: (args) => (
    <Card {...args} isHoverable shadow="md" style={{ width: 320 }}>
      <div
        style={{
          aspectRatio: "16/10",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          position: "relative",
        }}
      >
        <Chip color="success" variant="soft" style={{ position: "absolute", top: 12, right: 12 }}>
          New
        </Chip>
      </div>
      <CardHeader>
        <div className="card__title">Atlas Pro Headphones</div>
        <div className="card__description">Active noise cancellation · 40h battery</div>
      </CardHeader>
      <CardBody>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>$249</span>
          <span style={{ color: "var(--muted)", textDecoration: "line-through" }}>$299</span>
        </div>
      </CardBody>
      <CardFooter>
        <Button color="primary" size="sm" fullWidth>
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const UserProfileCard: Story = {
  render: (args) => (
    <Card {...args} shadow="md" style={{ width: 340 }}>
      <CardHeader>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Avatar size="lg" src="https://i.pravatar.cc/96?img=47" name="Elena" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="card__title">Elena Martinez</div>
            <div className="card__description">Product Designer · San Francisco</div>
          </div>
          <Chip color="success" variant="soft" size="sm">
            Online
          </Chip>
        </div>
      </CardHeader>
      <CardBody>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, padding: "4px 0" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>127</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Projects</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>2.4k</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Followers</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>318</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Following</div>
          </div>
        </div>
      </CardBody>
      <CardFooter>
        <Button color="primary" size="sm">Follow</Button>
        <Button variant="bordered" size="sm">Message</Button>
      </CardFooter>
    </Card>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 900 }}>
      <Card {...args} variant="default">
        <CardHeader><div className="card__title">Default</div><div className="card__description">Primary surface</div></CardHeader>
        <CardBody>Base surface with subtle elevation.</CardBody>
      </Card>
      <Card {...args} variant="secondary">
        <CardHeader><div className="card__title">Secondary</div><div className="card__description">Nested surface</div></CardHeader>
        <CardBody>Softer background for nested content.</CardBody>
      </Card>
      <Card {...args} variant="tertiary">
        <CardHeader><div className="card__title">Tertiary</div><div className="card__description">Deeply nested surface</div></CardHeader>
        <CardBody>Highest contrast background tier.</CardBody>
      </Card>
      <Card {...args} variant="transparent">
        <CardHeader><div className="card__title">Transparent</div><div className="card__description">No background</div></CardHeader>
        <CardBody>Inherits parent background, no shadow.</CardBody>
      </Card>
      <Card {...args} variant="bordered">
        <CardHeader><div className="card__title">Bordered</div><div className="card__description">Outlined card</div></CardHeader>
        <CardBody>Border in place of shadow for flat UI.</CardBody>
      </Card>
      <div style={{ position: "relative", padding: 20, borderRadius: 20, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <Card {...args} variant="blurred">
          <CardHeader><div className="card__title">Blurred</div><div className="card__description">Frosted glass</div></CardHeader>
          <CardBody>Backdrop-blurred over imagery.</CardBody>
        </Card>
      </div>
    </div>
  ),
};

export const Pressable: Story = {
  render: (args) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, maxWidth: 720 }}>
      <Card {...args} isPressable isHoverable shadow="md" onPress={() => console.log("card pressed")}>
        <CardHeader>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="card__title">Deploy to production</div>
            <Chip color="success" variant="soft" size="sm">Ready</Chip>
          </div>
          <div className="card__description">Click the card to trigger deploy</div>
        </CardHeader>
        <CardBody>All tests passing. Last commit 2 min ago.</CardBody>
      </Card>
      <Card {...args} isPressable variant="bordered" onPress={() => console.log("settings pressed")}>
        <CardHeader>
          <div className="card__title">Open settings</div>
          <div className="card__description">Bordered + pressable</div>
        </CardHeader>
        <CardBody>Full-card click target with keyboard support.</CardBody>
        <CardFooter>Enter or Space to activate</CardFooter>
      </Card>
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Card {...args} isDisabled isPressable shadow="sm" style={{ width: 340 }}>
      <CardHeader>
        <div className="card__title">Archived project</div>
        <div className="card__description">This project has been archived</div>
      </CardHeader>
      <CardBody>Restore the project to continue editing.</CardBody>
      <CardFooter>
        <Button variant="bordered" size="sm">Restore</Button>
      </CardFooter>
    </Card>
  ),
};

export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  render: (args) => (
    <Card
      {...args}
      classNames={{
        base: "border-2 border-blue-500 rounded-2xl shadow-lg",
      }}
      style={{ width: 360 }}
    >
      <CardHeader>
        <div className="card__title">Customized Card</div>
        <div className="card__description">Using classNames for per-slot styling</div>
      </CardHeader>
      <CardBody>
        Override individual card sections with Tailwind utilities without CSS files. The classNames prop accepts
        partial overrides for card slots.
      </CardBody>
      <CardFooter>
        <Button color="primary" size="sm">Learn more</Button>
        <Button variant="bordered" size="sm">Cancel</Button>
      </CardFooter>
    </Card>
  ),
};
