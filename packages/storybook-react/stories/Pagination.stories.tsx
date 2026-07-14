import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  Button,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrev,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  PaginationEllipsis,
} from "@auronui/react";

const meta: Meta<typeof Pagination> = {
  component: Pagination,
  title: "Components/Pagination",
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    type: { control: "select", options: ["numeric", "cursor"] },
    page: { control: "number" },
    itemsPerPage: { control: "number" },
    totalItems: { control: "number" },
    siblingCount: { control: "number" },
    showEdges: { control: "boolean" },
    isDisabled: { control: "boolean" },
  },
  args: {
    size: "md",
    type: "numeric",
    page: 1,
    itemsPerPage: 10,
    totalItems: 50,
    siblingCount: 2,
    showEdges: false,
    isDisabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

function NumericPagination({ showEdges, ...rest }: React.ComponentProps<typeof Pagination> & { showEdges?: boolean }) {
  return (
    <Pagination {...rest}>
      <PaginationContent>
        {(items) => (
          <>
            {showEdges && <PaginationFirst />}
            <PaginationPrev />
            {items.map((item) =>
              item.type === "page" ? (
                <PaginationItem key={item.value} value={item.value} />
              ) : (
                <PaginationEllipsis key={`e-${item.value}`} />
              ),
            )}
            <PaginationNext />
            {showEdges && <PaginationLast />}
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
}

export const NumericSmall: Story = {
  name: "Numeric — Small",
  args: { size: "sm", totalItems: 50, page: 1 },
  render: (args) => <NumericPagination {...args} size="sm" totalItems={50} itemsPerPage={10} />,
};

export const NumericDefault: Story = {
  name: "Numeric — Default (with Ellipsis)",
  args: { totalItems: 100, page: 5, showEdges: true, siblingCount: 2 },
  render: (args) => (
    <NumericPagination {...args} totalItems={100} itemsPerPage={10} showEdges siblingCount={2} />
  ),
};

export const NumericLarge: Story = {
  name: "Numeric — Large (50 pages)",
  args: { size: "lg", totalItems: 500, page: 25, showEdges: true, siblingCount: 1 },
  render: (args) => (
    <NumericPagination {...args} size="lg" totalItems={500} itemsPerPage={10} showEdges siblingCount={1} page={25} />
  ),
};

export const NumericDisabledBoundaries: Story = {
  name: "Numeric — Disabled Boundaries",
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <p style={{ marginBottom: 8, fontSize: 13, color: "#666" }}>Page 1 — Prev/First disabled:</p>
        <NumericPagination {...args} page={1} itemsPerPage={10} totalItems={50} showEdges />
      </div>
      <div>
        <p style={{ marginBottom: 8, fontSize: 13, color: "#666" }}>Page 5 — Next/Last disabled:</p>
        <NumericPagination {...args} page={5} itemsPerPage={10} totalItems={50} showEdges />
      </div>
      <div>
        <p style={{ marginBottom: 8, fontSize: 13, color: "#666" }}>Globally disabled:</p>
        <NumericPagination {...args} page={3} itemsPerPage={10} totalItems={50} isDisabled />
      </div>
    </div>
  ),
};

export const CursorMode: Story = {
  name: "Cursor Mode",
  render: (args) => {
    function Demo() {
      const [beforeCursor, setBeforeCursor] = useState<string | null>(null);
      const [afterCursor, setAfterCursor] = useState<string | null>("cursor_page2");
      const [pageInfo, setPageInfo] = useState("Page 1");

      function onCursorChange(before: string | null, after: string | null) {
        setBeforeCursor(before);
        setAfterCursor(after);
        setPageInfo(before ? "Page 2+" : "Page 1");
      }

      return (
        <div>
          <p style={{ marginBottom: 12, fontSize: 13, color: "#666" }}>
            Cursor mode — relay-style pagination (before/after cursors). Before: {beforeCursor ?? "null"}, After:{" "}
            {afterCursor ?? "null"}
          </p>
          <Pagination
            {...args}
            type="cursor"
            page={1}
            itemsPerPage={10}
            totalItems={100}
            beforeCursor={beforeCursor}
            afterCursor={afterCursor}
            onCursorChange={onCursorChange}
          >
            <PaginationContent pageInfo={pageInfo} />
          </Pagination>
        </div>
      );
    }
    return <Demo />;
  },
};

export const Interactive: Story = {
  name: "Interactive — controlled page",
  render: (args) => {
    function Demo() {
      const [page, setPage] = useState(1);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ fontSize: 13, color: "#666" }}>
            Current page: <strong>{page}</strong>
          </p>
          <NumericPagination
            {...args}
            page={page}
            onPageChange={setPage}
            itemsPerPage={10}
            totalItems={100}
            showEdges
            siblingCount={2}
          />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[1, 3, 5, 7, 10].map((p) => (
              <Button key={p} variant="ghost" size="sm" onClick={() => setPage(p)}>
                Jump to {p}
              </Button>
            ))}
          </div>
        </div>
      );
    }
    return <Demo />;
  },
};

export const AllSizes: Story = {
  name: "All Sizes",
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size}>
          <p style={{ marginBottom: 8, fontSize: 13, color: "#666", textTransform: "uppercase", fontWeight: 600 }}>
            {size}
          </p>
          <NumericPagination {...args} page={3} itemsPerPage={10} totalItems={50} size={size} />
        </div>
      ))}
    </div>
  ),
};
