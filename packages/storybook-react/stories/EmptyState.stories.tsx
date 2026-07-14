import type { Meta, StoryObj } from "@storybook/react-vite";
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
} from "@auronui/react";

const meta: Meta<typeof EmptyState> = {
  component: EmptyState,
  title: "Components/EmptyState",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

const InboxIcon = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);
const SearchIcon = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const FolderIcon = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);
const UsersIcon = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const Default: Story = {
  render: () => (
    <Card shadow="sm" radius="lg" variant="bordered">
      <CardBody>
        <EmptyState>
          <EmptyStateContent>
            <Chip variant="soft" color="default">{InboxIcon}</Chip>
            <Text as="h3" size="lg">Your inbox is empty</Text>
            <Text size="sm" variant="muted">
              New messages will show up here as soon as they arrive.
            </Text>
          </EmptyStateContent>
        </EmptyState>
      </CardBody>
    </Card>
  ),
};

export const NoResults: Story = {
  render: () => (
    <Card shadow="sm" radius="lg" variant="bordered">
      <CardBody>
        <EmptyState>
          <EmptyStateContent>
            <Chip variant="soft" color="primary">{SearchIcon}</Chip>
            <Text as="h3" size="lg">No results found</Text>
            <Text size="sm" variant="muted">
              We couldn&apos;t find anything matching your search. Try different keywords or clear your filters.
            </Text>
          </EmptyStateContent>
        </EmptyState>
      </CardBody>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card shadow="sm" radius="lg" variant="bordered">
      <CardBody>
        <EmptyState>
          <EmptyStateContent>
            <Chip variant="soft" color="warning">{FolderIcon}</Chip>
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
  ),
};

export const InCard: Story = {
  render: () => (
    <Card shadow="sm" radius="lg" variant="bordered" style={{ width: 420 }}>
      <CardHeader>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <span>Team members</span>
          <Chip size="sm" variant="soft">0 active</Chip>
        </div>
      </CardHeader>
      <CardBody>
        <EmptyState>
          <EmptyStateContent>
            <Chip variant="soft" color="secondary">{UsersIcon}</Chip>
            <Text as="h3" size="lg">Invite your team</Text>
            <Text size="sm" variant="muted">
              Collaborate better by inviting teammates to your workspace.
            </Text>
            <Button color="primary" size="sm">Invite members</Button>
          </EmptyStateContent>
        </EmptyState>
      </CardBody>
    </Card>
  ),
};
