import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Card, CardHeader, CardBody, CardFooter, Button, Avatar, Chip } from "@auronui/vue";

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
    classNames: {
      control: "object",
      description: "Per-slot class overrides. Keys match the component anatomy slot names (base, header, content, footer).",
    },
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

/* ============================================================
 * Playground — tweak all props from the Storybook controls
 * ============================================================ */
export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Card, CardHeader, CardBody, CardFooter, Button } from '@auronui/vue'
</script>

<template>
  <Card variant="default" shadow="sm" radius="lg" style="width: 340px;">
    <CardHeader>
      <div class="card__title">Onboarding checklist</div>
      <div class="card__description">Finish setup to unlock your workspace.</div>
    </CardHeader>
    <CardBody>
      Complete the remaining 3 steps to publish your first project. Your progress is saved automatically.
    </CardBody>
    <CardFooter>
      <Button variant="primary" size="sm">Continue</Button>
      <Button variant="ghost" size="sm">Skip</Button>
    </CardFooter>
  </Card>
</template>`,
        type: 'code',
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Card, CardHeader, CardBody, CardFooter, Button },
    setup: () => ({ args }),
    template: `
      <Card v-bind="args" style="width: 340px;">
        <CardHeader>
          <div class="card__title">Onboarding checklist</div>
          <div class="card__description">Finish setup to unlock your workspace.</div>
        </CardHeader>
        <CardBody>
          Complete the remaining 3 steps to publish your first project. Your progress is saved automatically.
        </CardBody>
        <CardFooter>
          <Button variant="primary" size="sm">Continue</Button>
          <Button variant="ghost" size="sm">Skip</Button>
        </CardFooter>
      </Card>
    `,
  }),
};

/* ============================================================
 * Showcase — real product card patterns
 * ============================================================ */
export const ProductCard: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Card, CardHeader, CardBody, CardFooter, Button, Chip } from '@auronui/vue'
</script>

<template>
  <Card isHoverable shadow="md" style="width: 320px;">
    <div style="aspect-ratio: 16/10; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); position: relative;">
      <Chip color="success" variant="soft" style="position: absolute; top: 12px; right: 12px;">New</Chip>
    </div>
    <CardHeader>
      <div class="card__title">Atlas Pro Headphones</div>
      <div class="card__description">Active noise cancellation · 40h battery</div>
    </CardHeader>
    <CardBody>
      <div style="display: flex; align-items: baseline; gap: 8px;">
        <span style="font-size: 24px; font-weight: 700; letter-spacing: -0.02em;">$249</span>
        <span style="color: var(--muted); text-decoration: line-through;">$299</span>
      </div>
    </CardBody>
    <CardFooter divider>
      <Button variant="primary" size="sm" fullWidth>Add to cart</Button>
    </CardFooter>
  </Card>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Card, CardHeader, CardBody, CardFooter, Button, Chip },
    setup: () => ({ args }),
    template: `
      <Card v-bind="args" isHoverable shadow="md" style="width: 320px;">
        <div style="aspect-ratio: 16/10; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); position: relative;">
          <Chip color="success" variant="soft" style="position: absolute; top: 12px; right: 12px;">New</Chip>
        </div>
        <CardHeader>
          <div class="card__title">Atlas Pro Headphones</div>
          <div class="card__description">Active noise cancellation · 40h battery</div>
        </CardHeader>
        <CardBody>
          <div style="display: flex; align-items: baseline; gap: 8px;">
            <span style="font-size: 24px; font-weight: 700; letter-spacing: -0.02em;">$249</span>
            <span style="color: var(--muted); text-decoration: line-through;">$299</span>
          </div>
        </CardBody>
        <CardFooter divider>
          <Button variant="primary" size="sm" fullWidth>Add to cart</Button>
        </CardFooter>
      </Card>
    `,
  }),
};

export const UserProfileCard: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Card, CardHeader, CardBody, CardFooter, Button, Avatar, Chip } from '@auronui/vue'
</script>

<template>
  <Card shadow="md" style="width: 340px;">
    <CardHeader>
      <div style="display: flex; gap: 12px; align-items: center;">
        <Avatar size="lg" src="https://i.pravatar.cc/96?img=47" name="Elena" />
        <div style="flex: 1; min-width: 0;">
          <div class="card__title">Elena Martinez</div>
          <div class="card__description">Product Designer · San Francisco</div>
        </div>
        <Chip color="success" variant="soft" size="sm">Online</Chip>
      </div>
    </CardHeader>
    <CardBody>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 4px 0;">
        <div style="text-align: center;">
          <div style="font-size: 20px; font-weight: 700;">127</div>
          <div style="font-size: 12px; color: var(--muted);">Projects</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 20px; font-weight: 700;">2.4k</div>
          <div style="font-size: 12px; color: var(--muted);">Followers</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 20px; font-weight: 700;">318</div>
          <div style="font-size: 12px; color: var(--muted);">Following</div>
        </div>
      </div>
    </CardBody>
    <CardFooter divider>
      <Button variant="primary" size="sm">Follow</Button>
      <Button variant="outline" size="sm">Message</Button>
    </CardFooter>
  </Card>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Card, CardHeader, CardBody, CardFooter, Button, Avatar, Chip },
    setup: () => ({ args }),
    template: `
      <Card v-bind="args" shadow="md" style="width: 340px;">
        <CardHeader>
          <div style="display: flex; gap: 12px; align-items: center;">
            <Avatar size="lg" src="https://i.pravatar.cc/96?img=47" name="Elena" />
            <div style="flex: 1; min-width: 0;">
              <div class="card__title">Elena Martinez</div>
              <div class="card__description">Product Designer · San Francisco</div>
            </div>
            <Chip color="success" variant="soft" size="sm">Online</Chip>
          </div>
        </CardHeader>
        <CardBody>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 4px 0;">
            <div style="text-align: center;">
              <div style="font-size: 20px; font-weight: 700;">127</div>
              <div style="font-size: 12px; color: var(--muted);">Projects</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 20px; font-weight: 700;">2.4k</div>
              <div style="font-size: 12px; color: var(--muted);">Followers</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 20px; font-weight: 700;">318</div>
              <div style="font-size: 12px; color: var(--muted);">Following</div>
            </div>
          </div>
        </CardBody>
        <CardFooter divider>
          <Button variant="primary" size="sm">Follow</Button>
          <Button variant="outline" size="sm">Message</Button>
        </CardFooter>
      </Card>
    `,
  }),
};

export const StatCard: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Card, CardBody, Chip } from '@auronui/vue'
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 900px;">
    <Card shadow="sm">
      <CardBody>
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div style="font-size: 13px; color: var(--muted); font-weight: 500;">Monthly revenue</div>
          <Chip color="success" variant="soft" size="sm">+12.4%</Chip>
        </div>
        <div style="font-size: 30px; font-weight: 700; letter-spacing: -0.03em; margin-top: 8px;">$84,219</div>
        <div style="font-size: 12px; color: var(--muted); margin-top: 4px;">vs $74,943 last month</div>
      </CardBody>
    </Card>
    <Card shadow="sm">
      <CardBody>
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div style="font-size: 13px; color: var(--muted); font-weight: 500;">Active users</div>
          <Chip color="warning" variant="soft" size="sm">-3.1%</Chip>
        </div>
        <div style="font-size: 30px; font-weight: 700; letter-spacing: -0.03em; margin-top: 8px;">12,847</div>
        <div style="font-size: 12px; color: var(--muted); margin-top: 4px;">vs 13,258 last week</div>
      </CardBody>
    </Card>
    <Card shadow="sm">
      <CardBody>
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div style="font-size: 13px; color: var(--muted); font-weight: 500;">Conversion rate</div>
          <Chip color="success" variant="soft" size="sm">+0.8%</Chip>
        </div>
        <div style="font-size: 30px; font-weight: 700; letter-spacing: -0.03em; margin-top: 8px;">4.7%</div>
        <div style="font-size: 12px; color: var(--muted); margin-top: 4px;">vs 3.9% last month</div>
      </CardBody>
    </Card>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Card, CardBody, Chip },
    setup: () => ({ args }),
    template: `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 900px;">
        <Card v-bind="args" shadow="sm">
          <CardBody>
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <div style="font-size: 13px; color: var(--muted); font-weight: 500;">Monthly revenue</div>
              <Chip color="success" variant="soft" size="sm">+12.4%</Chip>
            </div>
            <div style="font-size: 30px; font-weight: 700; letter-spacing: -0.03em; margin-top: 8px;">$84,219</div>
            <div style="font-size: 12px; color: var(--muted); margin-top: 4px;">vs $74,943 last month</div>
          </CardBody>
        </Card>
        <Card v-bind="args" shadow="sm">
          <CardBody>
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <div style="font-size: 13px; color: var(--muted); font-weight: 500;">Active users</div>
              <Chip color="warning" variant="soft" size="sm">-3.1%</Chip>
            </div>
            <div style="font-size: 30px; font-weight: 700; letter-spacing: -0.03em; margin-top: 8px;">12,847</div>
            <div style="font-size: 12px; color: var(--muted); margin-top: 4px;">vs 13,258 last week</div>
          </CardBody>
        </Card>
        <Card v-bind="args" shadow="sm">
          <CardBody>
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <div style="font-size: 13px; color: var(--muted); font-weight: 500;">Conversion rate</div>
              <Chip color="success" variant="soft" size="sm">+0.8%</Chip>
            </div>
            <div style="font-size: 30px; font-weight: 700; letter-spacing: -0.03em; margin-top: 8px;">4.7%</div>
            <div style="font-size: 12px; color: var(--muted); margin-top: 4px;">vs 3.9% last month</div>
          </CardBody>
        </Card>
      </div>
    `,
  }),
};

export const PricingCard: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Card, CardHeader, CardBody, CardFooter, Button, Chip } from '@auronui/vue'
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 900px;">
    <Card shadow="sm">
      <CardHeader>
        <div class="card__title">Starter</div>
        <div class="card__description">For side projects and experiments.</div>
      </CardHeader>
      <CardBody>
        <div style="display: flex; align-items: baseline; gap: 4px;">
          <span style="font-size: 36px; font-weight: 700; letter-spacing: -0.03em;">$0</span>
          <span style="color: var(--muted);">/ month</span>
        </div>
        <ul style="list-style: none; padding: 0; margin: 16px 0 0; display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
          <li>✓ 1 project</li>
          <li>✓ 5 GB storage</li>
          <li>✓ Community support</li>
        </ul>
      </CardBody>
      <CardFooter>
        <Button variant="outline" fullWidth size="sm">Get started</Button>
      </CardFooter>
    </Card>

    <Card shadow="lg" style="border: 1px solid var(--color-accent);">
      <CardHeader>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div class="card__title">Pro</div>
          <Chip color="accent" variant="soft" size="sm">Most popular</Chip>
        </div>
        <div class="card__description">Everything you need to ship fast.</div>
      </CardHeader>
      <CardBody>
        <div style="display: flex; align-items: baseline; gap: 4px;">
          <span style="font-size: 36px; font-weight: 700; letter-spacing: -0.03em;">$24</span>
          <span style="color: var(--muted);">/ month</span>
        </div>
        <ul style="list-style: none; padding: 0; margin: 16px 0 0; display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
          <li>✓ Unlimited projects</li>
          <li>✓ 100 GB storage</li>
          <li>✓ Priority support</li>
          <li>✓ Team collaboration</li>
        </ul>
      </CardBody>
      <CardFooter>
        <Button variant="primary" fullWidth size="sm">Start 14-day trial</Button>
      </CardFooter>
    </Card>

    <Card shadow="sm">
      <CardHeader>
        <div class="card__title">Enterprise</div>
        <div class="card__description">For teams with custom needs.</div>
      </CardHeader>
      <CardBody>
        <div style="display: flex; align-items: baseline; gap: 4px;">
          <span style="font-size: 36px; font-weight: 700; letter-spacing: -0.03em;">Custom</span>
        </div>
        <ul style="list-style: none; padding: 0; margin: 16px 0 0; display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
          <li>✓ Everything in Pro</li>
          <li>✓ Dedicated support</li>
          <li>✓ SSO & audit logs</li>
          <li>✓ Custom SLA</li>
        </ul>
      </CardBody>
      <CardFooter>
        <Button variant="outline" fullWidth size="sm">Contact sales</Button>
      </CardFooter>
    </Card>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Card, CardHeader, CardBody, CardFooter, Button, Chip },
    setup: () => ({ args }),
    template: `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 900px;">
        <Card v-bind="args" shadow="sm">
          <CardHeader>
            <div class="card__title">Starter</div>
            <div class="card__description">For side projects and experiments.</div>
          </CardHeader>
          <CardBody>
            <div style="display: flex; align-items: baseline; gap: 4px;">
              <span style="font-size: 36px; font-weight: 700; letter-spacing: -0.03em;">$0</span>
              <span style="color: var(--muted);">/ month</span>
            </div>
            <ul style="list-style: none; padding: 0; margin: 16px 0 0; display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
              <li>✓ 1 project</li>
              <li>✓ 5 GB storage</li>
              <li>✓ Community support</li>
            </ul>
          </CardBody>
          <CardFooter>
            <Button variant="outline" fullWidth size="sm">Get started</Button>
          </CardFooter>
        </Card>

        <Card v-bind="args" shadow="lg" style="border: 1px solid var(--color-accent);">
          <CardHeader>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div class="card__title">Pro</div>
              <Chip color="accent" variant="soft" size="sm">Most popular</Chip>
            </div>
            <div class="card__description">Everything you need to ship fast.</div>
          </CardHeader>
          <CardBody>
            <div style="display: flex; align-items: baseline; gap: 4px;">
              <span style="font-size: 36px; font-weight: 700; letter-spacing: -0.03em;">$24</span>
              <span style="color: var(--muted);">/ month</span>
            </div>
            <ul style="list-style: none; padding: 0; margin: 16px 0 0; display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
              <li>✓ Unlimited projects</li>
              <li>✓ 100 GB storage</li>
              <li>✓ Priority support</li>
              <li>✓ Team collaboration</li>
            </ul>
          </CardBody>
          <CardFooter>
            <Button variant="primary" fullWidth size="sm">Start 14-day trial</Button>
          </CardFooter>
        </Card>

        <Card v-bind="args" shadow="sm">
          <CardHeader>
            <div class="card__title">Enterprise</div>
            <div class="card__description">For teams with custom needs.</div>
          </CardHeader>
          <CardBody>
            <div style="display: flex; align-items: baseline; gap: 4px;">
              <span style="font-size: 36px; font-weight: 700; letter-spacing: -0.03em;">Custom</span>
            </div>
            <ul style="list-style: none; padding: 0; margin: 16px 0 0; display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
              <li>✓ Everything in Pro</li>
              <li>✓ Dedicated support</li>
              <li>✓ SSO & audit logs</li>
              <li>✓ Custom SLA</li>
            </ul>
          </CardBody>
          <CardFooter>
            <Button variant="outline" fullWidth size="sm">Contact sales</Button>
          </CardFooter>
        </Card>
      </div>
    `,
  }),
};

export const MediaCard: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Card, CardHeader, CardFooter, Avatar } from '@auronui/vue'
</script>

<template>
  <Card isHoverable isPressable shadow="md" style="width: 340px;">
    <div style="aspect-ratio: 16/9; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);"></div>
    <CardHeader>
      <div style="font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); font-weight: 600;">Product</div>
      <div class="card__title" style="margin-top: 4px;">Introducing Auron 1.0</div>
      <div class="card__description">A 1:1 Vue 3 85 accessible, themed components ready for production.</div>
    </CardHeader>
    <CardFooter>
      <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
        <Avatar size="sm" src="https://i.pravatar.cc/80?img=12" name="Team" />
        <div style="font-size: 13px;">
          <div style="font-weight: 500;">Auron Team</div>
          <div style="color: var(--muted); font-size: 12px;">5 min read · Apr 19</div>
        </div>
      </div>
    </CardFooter>
  </Card>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Card, CardHeader, CardBody, CardFooter, Button, Avatar },
    setup: () => ({ args }),
    template: `
      <Card v-bind="args" isHoverable isPressable shadow="md" style="width: 340px;">
        <div style="aspect-ratio: 16/9; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);"></div>
        <CardHeader>
          <div style="font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); font-weight: 600;">Product</div>
          <div class="card__title" style="margin-top: 4px;">Introducing Auron 1.0</div>
          <div class="card__description">A 1:1 Vue 3 85 accessible, themed components ready for production.</div>
        </CardHeader>
        <CardFooter>
          <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
            <Avatar size="sm" src="https://i.pravatar.cc/80?img=12" name="Team" />
            <div style="font-size: 13px;">
              <div style="font-weight: 500;">Auron Team</div>
              <div style="color: var(--muted); font-size: 12px;">5 min read · Apr 19</div>
            </div>
          </div>
        </CardFooter>
      </Card>
    `,
  }),
};

export const NotificationCard: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Card, CardHeader, CardBody, CardFooter, Button } from '@auronui/vue'
</script>

<template>
  <Card variant="bordered" style="width: 380px;">
    <CardHeader>
      <div style="display: flex; gap: 12px; align-items: start;">
        <div style="flex-shrink: 0; width: 36px; height: 36px; border-radius: 10px; background: var(--color-accent-soft); color: var(--color-accent); display: flex; align-items: center; justify-content: center; font-weight: 600;">!</div>
        <div style="flex: 1;">
          <div class="card__title">Storage almost full</div>
          <div class="card__description">You've used 92% of your 100 GB quota.</div>
        </div>
      </div>
    </CardHeader>
    <CardBody>
      Upgrade your plan to get 1 TB of storage, or free up space by archiving old projects.
    </CardBody>
    <CardFooter>
      <Button variant="primary" size="sm">Upgrade</Button>
      <Button variant="ghost" size="sm">Manage storage</Button>
    </CardFooter>
  </Card>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Card, CardHeader, CardBody, CardFooter, Button },
    setup: () => ({ args }),
    template: `
      <Card v-bind="args" variant="bordered" style="width: 380px;">
        <CardHeader>
          <div style="display: flex; gap: 12px; align-items: start;">
            <div style="flex-shrink: 0; width: 36px; height: 36px; border-radius: 10px; background: var(--color-accent-soft); color: var(--color-accent); display: flex; align-items: center; justify-content: center; font-weight: 600;">!</div>
            <div style="flex: 1;">
              <div class="card__title">Storage almost full</div>
              <div class="card__description">You've used 92% of your 100 GB quota.</div>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          Upgrade your plan to get 1 TB of storage, or free up space by archiving old projects.
        </CardBody>
        <CardFooter>
          <Button variant="primary" size="sm">Upgrade</Button>
          <Button variant="ghost" size="sm">Manage storage</Button>
        </CardFooter>
      </Card>
    `,
  }),
};

/* ============================================================
 * Variant gallery — surface, bordered, blurred
 * ============================================================ */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Card, CardHeader, CardBody } from '@auronui/vue'
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 900px;">
    <Card variant="default">
      <CardHeader><div class="card__title">Default</div><div class="card__description">Primary surface</div></CardHeader>
      <CardBody>Base surface with subtle elevation.</CardBody>
    </Card>
    <Card variant="secondary">
      <CardHeader><div class="card__title">Secondary</div><div class="card__description">Nested surface</div></CardHeader>
      <CardBody>Softer background for nested content.</CardBody>
    </Card>
    <Card variant="tertiary">
      <CardHeader><div class="card__title">Tertiary</div><div class="card__description">Deeply nested surface</div></CardHeader>
      <CardBody>Highest contrast background tier.</CardBody>
    </Card>
    <Card variant="transparent">
      <CardHeader><div class="card__title">Transparent</div><div class="card__description">No background</div></CardHeader>
      <CardBody>Inherits parent background, no shadow.</CardBody>
    </Card>
    <Card variant="bordered">
      <CardHeader><div class="card__title">Bordered</div><div class="card__description">Outlined card</div></CardHeader>
      <CardBody>Border in place of shadow for flat UI.</CardBody>
    </Card>
    <div style="position: relative; padding: 20px; border-radius: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <Card variant="blurred">
        <CardHeader><div class="card__title">Blurred</div><div class="card__description">Frosted glass</div></CardHeader>
        <CardBody>Backdrop-blurred over imagery.</CardBody>
      </Card>
    </div>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Card, CardHeader, CardBody, CardFooter },
    setup: () => ({ args }),
    template: `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 900px;">
        <Card v-bind="args" variant="default">
          <CardHeader><div class="card__title">Default</div><div class="card__description">Primary surface</div></CardHeader>
          <CardBody>Base surface with subtle elevation.</CardBody>
        </Card>
        <Card v-bind="args" variant="secondary">
          <CardHeader><div class="card__title">Secondary</div><div class="card__description">Nested surface</div></CardHeader>
          <CardBody>Softer background for nested content.</CardBody>
        </Card>
        <Card v-bind="args" variant="tertiary">
          <CardHeader><div class="card__title">Tertiary</div><div class="card__description">Deeply nested surface</div></CardHeader>
          <CardBody>Highest contrast background tier.</CardBody>
        </Card>
        <Card v-bind="args" variant="transparent">
          <CardHeader><div class="card__title">Transparent</div><div class="card__description">No background</div></CardHeader>
          <CardBody>Inherits parent background, no shadow.</CardBody>
        </Card>
        <Card v-bind="args" variant="bordered">
          <CardHeader><div class="card__title">Bordered</div><div class="card__description">Outlined card</div></CardHeader>
          <CardBody>Border in place of shadow for flat UI.</CardBody>
        </Card>
        <div style="position: relative; padding: 20px; border-radius: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <Card v-bind="args" variant="blurred">
            <CardHeader><div class="card__title">Blurred</div><div class="card__description">Frosted glass</div></CardHeader>
            <CardBody>Backdrop-blurred over imagery.</CardBody>
          </Card>
        </div>
      </div>
    `,
  }),
};

/* ============================================================
 * Shadow scale
 * ============================================================ */
export const ShadowScale: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Card, CardHeader, CardBody } from '@auronui/vue'
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; max-width: 900px; padding: 24px;">
    <Card shadow="none">
      <CardHeader><div class="card__title">None</div></CardHeader>
      <CardBody>No shadow</CardBody>
    </Card>
    <Card shadow="sm">
      <CardHeader><div class="card__title">Small</div></CardHeader>
      <CardBody>Subtle depth</CardBody>
    </Card>
    <Card shadow="md">
      <CardHeader><div class="card__title">Medium</div></CardHeader>
      <CardBody>Moderate lift</CardBody>
    </Card>
    <Card shadow="lg">
      <CardHeader><div class="card__title">Large</div></CardHeader>
      <CardBody>Floating depth</CardBody>
    </Card>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Card, CardHeader, CardBody },
    setup: () => ({ args }),
    template: `
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; max-width: 900px; padding: 24px;">
        <Card v-bind="args" shadow="none">
          <CardHeader><div class="card__title">None</div></CardHeader>
          <CardBody>No shadow</CardBody>
        </Card>
        <Card v-bind="args" shadow="sm">
          <CardHeader><div class="card__title">Small</div></CardHeader>
          <CardBody>Subtle depth</CardBody>
        </Card>
        <Card v-bind="args" shadow="md">
          <CardHeader><div class="card__title">Medium</div></CardHeader>
          <CardBody>Moderate lift</CardBody>
        </Card>
        <Card v-bind="args" shadow="lg">
          <CardHeader><div class="card__title">Large</div></CardHeader>
          <CardBody>Floating depth</CardBody>
        </Card>
      </div>
    `,
  }),
};

/* ============================================================
 * Radius scale
 * ============================================================ */
export const RadiusScale: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Card, CardBody } from '@auronui/vue'
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; max-width: 900px;">
    <Card radius="none"><CardBody>none</CardBody></Card>
    <Card radius="sm"><CardBody>sm</CardBody></Card>
    <Card radius="md"><CardBody>md</CardBody></Card>
    <Card radius="lg"><CardBody>lg</CardBody></Card>
    <Card radius="xl"><CardBody>xl</CardBody></Card>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Card, CardBody },
    setup: () => ({ args }),
    template: `
      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; max-width: 900px;">
        <Card v-bind="args" radius="none"><CardBody>none</CardBody></Card>
        <Card v-bind="args" radius="sm"><CardBody>sm</CardBody></Card>
        <Card v-bind="args" radius="md"><CardBody>md</CardBody></Card>
        <Card v-bind="args" radius="lg"><CardBody>lg</CardBody></Card>
        <Card v-bind="args" radius="xl"><CardBody>xl</CardBody></Card>
      </div>
    `,
  }),
};

/* ============================================================
 * Interactive — hoverable + pressable
 * ============================================================ */
export const Hoverable: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Card, CardHeader, CardBody } from '@auronui/vue'
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; max-width: 640px;">
    <Card isHoverable shadow="sm">
      <CardHeader><div class="card__title">Hover me</div></CardHeader>
      <CardBody>Lifts up and raises shadow on hover.</CardBody>
    </Card>
    <Card isHoverable shadow="md">
      <CardHeader><div class="card__title">Hover me</div></CardHeader>
      <CardBody>Works with any base shadow level.</CardBody>
    </Card>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Card, CardHeader, CardBody },
    setup: () => ({ args }),
    template: `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; max-width: 640px;">
        <Card v-bind="args" isHoverable shadow="sm">
          <CardHeader><div class="card__title">Hover me</div></CardHeader>
          <CardBody>Lifts up and raises shadow on hover.</CardBody>
        </Card>
        <Card v-bind="args" isHoverable shadow="md">
          <CardHeader><div class="card__title">Hover me</div></CardHeader>
          <CardBody>Works with any base shadow level.</CardBody>
        </Card>
      </div>
    `,
  }),
};

export const Pressable: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Card, CardHeader, CardBody, CardFooter, Chip } from '@auronui/vue'
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; max-width: 720px;">
    <Card isPressable isHoverable shadow="md" @press="() => console.log('card pressed')">
      <CardHeader>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div class="card__title">Deploy to production</div>
          <Chip color="success" variant="soft" size="sm">Ready</Chip>
        </div>
        <div class="card__description">Click the card to trigger deploy</div>
      </CardHeader>
      <CardBody>All tests passing. Last commit 2 min ago.</CardBody>
    </Card>
    <Card isPressable variant="bordered" @press="() => console.log('settings pressed')">
      <CardHeader>
        <div class="card__title">Open settings</div>
        <div class="card__description">Bordered + pressable</div>
      </CardHeader>
      <CardBody>Full-card click target with keyboard support.</CardBody>
      <CardFooter>Enter or Space to activate</CardFooter>
    </Card>
  </div>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Card, CardHeader, CardBody, CardFooter, Chip },
    setup: () => ({ args }),
    template: `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; max-width: 720px;">
        <Card v-bind="args" isPressable isHoverable shadow="md" @press="() => console.log('card pressed')">
          <CardHeader>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div class="card__title">Deploy to production</div>
              <Chip color="success" variant="soft" size="sm">Ready</Chip>
            </div>
            <div class="card__description">Click the card to trigger deploy</div>
          </CardHeader>
          <CardBody>All tests passing. Last commit 2 min ago.</CardBody>
        </Card>
        <Card v-bind="args" isPressable variant="bordered" @press="() => console.log('settings pressed')">
          <CardHeader>
            <div class="card__title">Open settings</div>
            <div class="card__description">Bordered + pressable</div>
          </CardHeader>
          <CardBody>Full-card click target with keyboard support.</CardBody>
          <CardFooter>Enter or Space to activate</CardFooter>
        </Card>
      </div>
    `,
  }),
};

/* ============================================================
 * Disabled
 * ============================================================ */
export const Disabled: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Card, CardHeader, CardBody, CardFooter, Button } from '@auronui/vue'
</script>

<template>
  <Card isDisabled isPressable shadow="sm" style="width: 340px;">
    <CardHeader>
      <div class="card__title">Archived project</div>
      <div class="card__description">This project has been archived</div>
    </CardHeader>
    <CardBody>Restore the project to continue editing.</CardBody>
    <CardFooter>
      <Button variant="outline" size="sm">Restore</Button>
    </CardFooter>
  </Card>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Card, CardHeader, CardBody, CardFooter, Button },
    setup: () => ({ args }),
    template: `
      <Card v-bind="args" isDisabled isPressable shadow="sm" style="width: 340px;">
        <CardHeader>
          <div class="card__title">Archived project</div>
          <div class="card__description">This project has been archived</div>
        </CardHeader>
        <CardBody>Restore the project to continue editing.</CardBody>
        <CardFooter>
          <Button variant="outline" size="sm">Restore</Button>
        </CardFooter>
      </Card>
    `,
  }),
};

/* ============================================================
 * Dividers on header / footer
 * ============================================================ */
export const WithDividers: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Card, CardHeader, CardBody, CardFooter, Button } from '@auronui/vue'
</script>

<template>
  <Card shadow="md" style="width: 360px;">
    <CardHeader divider>
      <div class="card__title">Invoice #INV-2401</div>
      <div class="card__description">Apr 01 — Apr 30, 2026</div>
    </CardHeader>
    <CardBody>
      <div style="display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
        <div style="display: flex; justify-content: space-between;"><span>Subtotal</span><span>$1,240.00</span></div>
        <div style="display: flex; justify-content: space-between;"><span>Tax (8.5%)</span><span>$105.40</span></div>
        <div style="display: flex; justify-content: space-between; font-weight: 600; padding-top: 8px; border-top: 1px solid var(--color-border);"><span>Total</span><span>$1,345.40</span></div>
      </div>
    </CardBody>
    <CardFooter divider>
      <Button variant="primary" size="sm" fullWidth>Pay invoice</Button>
    </CardFooter>
  </Card>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Card, CardHeader, CardBody, CardFooter, Button },
    setup: () => ({ args }),
    template: `
      <Card v-bind="args" shadow="md" style="width: 360px;">
        <CardHeader divider>
          <div class="card__title">Invoice #INV-2401</div>
          <div class="card__description">Apr 01 — Apr 30, 2026</div>
        </CardHeader>
        <CardBody>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
            <div style="display: flex; justify-content: space-between;"><span>Subtotal</span><span>$1,240.00</span></div>
            <div style="display: flex; justify-content: space-between;"><span>Tax (8.5%)</span><span>$105.40</span></div>
            <div style="display: flex; justify-content: space-between; font-weight: 600; padding-top: 8px; border-top: 1px solid var(--color-border);"><span>Total</span><span>$1,345.40</span></div>
          </div>
        </CardBody>
        <CardFooter divider>
          <Button variant="primary" size="sm" fullWidth>Pay invoice</Button>
        </CardFooter>
      </Card>
    `,
  }),
};

/* ============================================================
 * Custom styles via classNames
 * ============================================================ */
export const CustomStyles: Story = {
  name: "Custom styles via classNames",
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Card, CardHeader, CardBody, CardFooter, Button } from '@auronui/vue'
</script>

<template>
  <Card
    :class-names="{
      base: 'border-2 border-blue-500 rounded-2xl shadow-lg',
      header: 'bg-blue-50 border-b-2 border-blue-200',
      content: 'text-blue-900 font-medium',
      footer: 'bg-gradient-to-r from-blue-50 to-blue-100',
    }"
    style="width: 360px;"
  >
    <CardHeader>
      <div class="card__title">Customized Card</div>
      <div class="card__description">Using classNames for per-slot styling</div>
    </CardHeader>
    <CardBody>
      Override individual card sections with Tailwind utilities without CSS files. The classNames prop accepts partial overrides for base, header, content, and footer slots.
    </CardBody>
    <CardFooter>
      <Button variant="primary" size="sm">Learn more</Button>
      <Button variant="outline" size="sm">Cancel</Button>
    </CardFooter>
  </Card>
</template>`,
        language: 'vue',
      },
    },
  },
  render: (args) => ({
    components: { Card, CardHeader, CardBody, CardFooter, Button },
    setup: () => ({ args }),
    template: `
      <Card
        v-bind="args"
        :class-names="{
          base: 'border-2 border-blue-500 rounded-2xl shadow-lg',
          header: 'bg-blue-50 border-b-2 border-blue-200',
          content: 'text-blue-900 font-medium',
          footer: 'bg-gradient-to-r from-blue-50 to-blue-100',
        }"
        style="width: 360px;"
      >
        <CardHeader>
          <div class="card__title">Customized Card</div>
          <div class="card__description">Using classNames for per-slot styling</div>
        </CardHeader>
        <CardBody>
          Override individual card sections with Tailwind utilities without CSS files. The classNames prop accepts partial overrides for base, header, content, and footer slots.
        </CardBody>
        <CardFooter>
          <Button variant="primary" size="sm">Learn more</Button>
          <Button variant="outline" size="sm">Cancel</Button>
        </CardFooter>
      </Card>
    `,
  }),
};
