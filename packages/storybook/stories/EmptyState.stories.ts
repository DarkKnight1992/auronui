import type { Meta, StoryObj } from "@storybook/vue3-vite";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  EmptyState,
  EmptyStateContent,
  Text,
} from "@auronui/vue";

const meta: Meta<typeof EmptyState> = {
  component: EmptyState,
  title: "Components/EmptyState",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

const InboxIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`;
const SearchIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
const FolderIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`;
const UsersIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;

const baseComponents = {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  EmptyState,
  EmptyStateContent,
  Text,
};

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Card, CardBody, Chip, EmptyState, EmptyStateContent, Text } from '@auronui/vue'

const InboxIcon = \`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>\`
</script>

<template>
  <Card shadow="sm" radius="lg" variant="bordered">
    <CardBody>
      <EmptyState>
        <EmptyStateContent>
          <Chip variant="flat" color="default">
            <span v-html="InboxIcon" />
          </Chip>
          <Text as="h3" size="lg">Your inbox is empty</Text>
          <Text size="sm" variant="muted">
            New messages will show up here as soon as they arrive.
          </Text>
        </EmptyStateContent>
      </EmptyState>
    </CardBody>
  </Card>
</template>`,
        language: 'vue',
      }
    }
  },
  render: () => ({
    components: baseComponents,
    setup: () => ({ InboxIcon }),
    template: `
      <Card shadow="sm" radius="lg" class="empty-state-story__card" variant="bordered">
        <CardBody>
          <EmptyState>
            <EmptyStateContent class="empty-state-story__content">
              <Chip variant="flat" color="default" class="empty-state-story__chip">
                <span v-html="InboxIcon" />
              </Chip>
              <Text as="h3" size="lg" class="empty-state-story__title">Your inbox is empty</Text>
              <Text size="sm" variant="muted" class="empty-state-story__desc">
                New messages will show up here as soon as they arrive.
              </Text>
            </EmptyStateContent>
          </EmptyState>
        </CardBody>
      </Card>
    `,
  }),
};

export const NoResults: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Card, CardBody, Chip, EmptyState, EmptyStateContent, Text } from '@auronui/vue'

const SearchIcon = \`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>\`
</script>

<template>
  <Card shadow="sm" radius="lg" variant="bordered">
    <CardBody>
      <EmptyState>
        <EmptyStateContent>
          <Chip variant="flat" color="primary">
            <span v-html="SearchIcon" />
          </Chip>
          <Text as="h3" size="lg">No results found</Text>
          <Text size="sm" variant="muted">
            We couldn't find anything matching your search. Try different keywords or clear your filters.
          </Text>
        </EmptyStateContent>
      </EmptyState>
    </CardBody>
  </Card>
</template>`,
        language: 'vue',
      },
    },
  },
  render: () => ({
    components: baseComponents,
    setup: () => ({ SearchIcon }),
    template: `
      <Card shadow="sm" radius="lg" class="empty-state-story__card" variant="bordered">
        <CardBody>
          <EmptyState>
            <EmptyStateContent class="empty-state-story__content">
              <Chip variant="flat" color="primary" class="empty-state-story__chip">
                <span v-html="SearchIcon" />
              </Chip>
              <Text as="h3" size="lg" class="empty-state-story__title">No results found</Text>
              <Text size="sm" variant="muted" class="empty-state-story__desc">
                We couldn't find anything matching your search. Try different keywords or clear your filters.
              </Text>
            </EmptyStateContent>
          </EmptyState>
        </CardBody>
      </Card>
    `,
  }),
};

export const WithAction: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Button, Card, CardBody, CardFooter, Chip, EmptyState, EmptyStateContent, Text } from '@auronui/vue'

const FolderIcon = \`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>\`
</script>

<template>
  <Card shadow="sm" radius="lg" variant="bordered">
    <CardBody>
      <EmptyState>
        <EmptyStateContent>
          <Chip variant="flat" color="warning">
            <span v-html="FolderIcon" />
          </Chip>
          <Text as="h3" size="lg">No files uploaded</Text>
          <Text size="sm" variant="muted">
            Upload your first file to get started. Drag and drop or click to browse.
          </Text>
        </EmptyStateContent>
      </EmptyState>
    </CardBody>
    <CardFooter>
      <Button variant="ghost" size="sm">Learn more</Button>
      <Button color="primary" size="sm">Upload File</Button>
    </CardFooter>
  </Card>
</template>`,
        language: 'vue',
      },
    },
  },
  render: () => ({
    components: baseComponents,
    setup: () => ({ FolderIcon }),
    template: `
      <Card shadow="sm" radius="lg" class="empty-state-story__card" variant="bordered">
        <CardBody>
          <EmptyState>
            <EmptyStateContent class="empty-state-story__content">
              <Chip variant="flat" color="warning" class="empty-state-story__chip">
                <span v-html="FolderIcon" />
              </Chip>
              <Text as="h3" size="lg" class="empty-state-story__title">No files uploaded</Text>
              <Text size="sm" variant="muted" class="empty-state-story__desc">
                Upload your first file to get started. Drag and drop or click to browse.
              </Text>
            </EmptyStateContent>
          </EmptyState>
        </CardBody>
        <CardFooter class="empty-state-story__footer">
          <Button variant="ghost" size="sm">Learn more</Button>
          <Button color="primary" size="sm">Upload File</Button>
        </CardFooter>
      </Card>
    `,
  }),
};

export const InCard: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup>
import { Button, Card, CardBody, CardHeader, Chip, EmptyState, EmptyStateContent, Text } from '@auronui/vue'

const UsersIcon = \`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>\`
</script>

<template>
  <Card shadow="sm" radius="lg" variant="bordered">
    <CardHeader>
      <div>
        <div>Team members</div>
        <Chip size="sm" variant="flat">0 active</Chip>
      </div>
    </CardHeader>
    <CardBody>
      <EmptyState>
        <EmptyStateContent>
          <Chip variant="flat" color="secondary">
            <span v-html="UsersIcon" />
          </Chip>
          <Text as="h3" size="lg">Invite your team</Text>
          <Text size="sm" variant="muted">
            Collaborate better by inviting teammates to your workspace.
          </Text>
          <Button color="primary" size="sm">Invite members</Button>
        </EmptyStateContent>
      </EmptyState>
    </CardBody>
  </Card>
</template>`,
        language: 'vue',
      },
    },
  },
  render: () => ({
    components: baseComponents,
    setup: () => ({ UsersIcon }),
    template: `
      <Card shadow="sm" radius="lg" class="empty-state-story__card empty-state-story__card--wide" variant="bordered">
        <CardHeader>
          <div class="empty-state-story__header">
            <div class="card__title">Team members</div>
            <Chip size="sm" variant="flat">0 active</Chip>
          </div>
        </CardHeader>
        <CardBody>
          <EmptyState>
            <EmptyStateContent class="empty-state-story__content">
              <Chip variant="flat" color="secondary" class="empty-state-story__chip">
                <span v-html="UsersIcon" />
              </Chip>
              <Text as="h3" size="lg" class="empty-state-story__title">Invite your team</Text>
              <Text size="sm" variant="muted" class="empty-state-story__desc">
                Collaborate better by inviting teammates to your workspace.
              </Text>
              <Button color="primary" size="sm" class="empty-state-story__cta">Invite members</Button>
            </EmptyStateContent>
          </EmptyState>
        </CardBody>
      </Card>
    `,
  }),
};
