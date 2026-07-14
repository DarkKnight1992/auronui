import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import axe from "axe-core";
import { EmptyState } from "../EmptyState";
import { EmptyStateContent } from "../EmptyStateContent";

describe("EmptyState", () => {
  it("EmptyState root renders a div with class 'empty-state' and aria-live='polite'", () => {
    const { container } = render(<EmptyState />);
    const el = container.firstElementChild;
    expect(el?.tagName).toBe("DIV");
    expect(el).toHaveClass("empty-state");
    expect(el).toHaveAttribute("aria-live", "polite");
  });

  it("EmptyStateContent renders a child div with class 'empty-state__content'", () => {
    const { container } = render(<EmptyStateContent />);
    const el = container.firstElementChild;
    expect(el?.tagName).toBe("DIV");
    expect(el).toHaveClass("empty-state__content");
  });

  it("composes EmptyState + EmptyStateContent together", () => {
    const { getByText, container } = render(
      <EmptyState>
        <EmptyStateContent>No results</EmptyStateContent>
      </EmptyState>,
    );
    expect(container.firstElementChild).toHaveClass("empty-state");
    expect(getByText("No results")).toHaveClass("empty-state__content");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <EmptyState>
        <EmptyStateContent>Nothing found</EmptyStateContent>
      </EmptyState>,
    );
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
