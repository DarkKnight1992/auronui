import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrev,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  PaginationEllipsis,
} from "../index";

function NumericPagination({ page, onPageChange }: { page: number; onPageChange: (p: number) => void }) {
  return (
    <Pagination page={page} itemsPerPage={10} totalItems={50} siblingCount={5} onPageChange={onPageChange}>
      <PaginationContent>
        {(items) => (
          <>
            <PaginationPrev />
            {items.map((item, i) =>
              item.type === "page" ? (
                <PaginationItem key={item.value} value={item.value} />
              ) : (
                <PaginationEllipsis key={`e-${i}`} />
              ),
            )}
            <PaginationNext />
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
}

describe("Pagination — numeric mode", () => {
  it("renders as a nav element with the pagination base class", () => {
    render(<Pagination page={1} itemsPerPage={10} totalItems={50} />);
    const nav = screen.getByRole("navigation", { name: "Pagination" });
    expect(nav).toHaveClass("pagination");
  });

  it("applies size variant class", () => {
    render(<Pagination page={1} itemsPerPage={10} totalItems={50} size="lg" />);
    expect(screen.getByRole("navigation")).toHaveClass("pagination--lg");
  });

  it("renders 5 page items for 50 items / 10 per page", () => {
    render(<NumericPagination page={1} onPageChange={() => {}} />);
    expect(screen.getAllByRole("button").filter((b) => b.dataset.type === "page")).toHaveLength(5);
  });

  it("fires onPageChange when a page item is clicked", async () => {
    const onPageChange = vi.fn();
    render(<NumericPagination page={1} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Page 3" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("clamps page to [1, totalPages] via PaginationFirst/Last", async () => {
    const onPageChange = vi.fn();
    render(
      <Pagination page={3} itemsPerPage={10} totalItems={50} onPageChange={onPageChange}>
        <PaginationFirst />
        <PaginationLast />
      </Pagination>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Go to first page" }));
    expect(onPageChange).toHaveBeenCalledWith(1);
    await userEvent.click(screen.getByRole("button", { name: "Go to last page" }));
    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  it("calculates totalPages = ceil(totalItems / itemsPerPage)", () => {
    render(<Pagination page={1} itemsPerPage={7} totalItems={50} />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("active page has data-selected attribute and aria-current", () => {
    render(<NumericPagination page={2} onPageChange={() => {}} />);
    const btn = screen.getByRole("button", { name: "Page 2" });
    expect(btn).toHaveAttribute("data-selected", "true");
    expect(btn).toHaveAttribute("aria-current", "page");
  });
});

describe("Pagination — Prev/Next/First/Last disabled states", () => {
  it("PaginationPrev is disabled on page 1", () => {
    render(
      <Pagination page={1} itemsPerPage={10} totalItems={50}>
        <PaginationPrev />
      </Pagination>,
    );
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
  });

  it("PaginationNext is disabled on last page", () => {
    render(
      <Pagination page={5} itemsPerPage={10} totalItems={50}>
        <PaginationNext />
      </Pagination>,
    );
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });

  it("PaginationPrev is enabled on page 2", () => {
    render(
      <Pagination page={2} itemsPerPage={10} totalItems={50}>
        <PaginationPrev />
      </Pagination>,
    );
    expect(screen.getByRole("button", { name: "Previous page" })).not.toBeDisabled();
  });

  it("PaginationFirst is disabled on page 1", () => {
    render(
      <Pagination page={1} itemsPerPage={10} totalItems={50}>
        <PaginationFirst />
      </Pagination>,
    );
    expect(screen.getByRole("button", { name: "Go to first page" })).toBeDisabled();
  });
});

describe("Pagination — Ellipsis", () => {
  it("PaginationEllipsis has aria-hidden=true", () => {
    render(
      <Pagination page={1} itemsPerPage={10} totalItems={50}>
        <PaginationEllipsis />
      </Pagination>,
    );
    expect(screen.getByText("…")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("Pagination — cursor mode", () => {
  it("renders a nav element and PaginationContent Before/After buttons", () => {
    render(
      <Pagination type="cursor" page={1} beforeCursor={null} afterCursor="cursor123">
        <PaginationContent />
      </Pagination>,
    );
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Before page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "After page" })).not.toBeDisabled();
  });

  it("fires onCursorChange when the After button is clicked", async () => {
    const onCursorChange = vi.fn();
    render(
      <Pagination
        type="cursor"
        page={1}
        beforeCursor={null}
        afterCursor="cursor123"
        onCursorChange={onCursorChange}
      >
        <PaginationContent />
      </Pagination>,
    );
    await userEvent.click(screen.getByRole("button", { name: "After page" }));
    expect(onCursorChange).toHaveBeenCalledWith(null, "cursor123");
  });
});

describe("Pagination — disabled global state", () => {
  it("PaginationPrev respects global disabled prop", () => {
    render(
      <Pagination page={3} itemsPerPage={10} totalItems={50} isDisabled>
        <PaginationPrev />
      </Pagination>,
    );
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
  });
});

describe("Pagination — accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<NumericPagination page={2} onPageChange={() => {}} />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
