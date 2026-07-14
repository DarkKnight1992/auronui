import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { SearchField } from "../SearchField";

describe("SearchField", () => {
  it("renders a search input with a label", () => {
    render(<SearchField label="Search" />);
    expect(screen.getByRole("searchbox", { name: "Search" })).toBeInTheDocument();
  });

  it("wires aria-describedby to the description", () => {
    render(<SearchField label="Search" description="Filter results" />);
    const input = screen.getByRole("searchbox", { name: "Search" });
    const description = screen.getByText("Filter results");
    expect(input).toHaveAttribute("aria-describedby", description.id);
  });

  it("shows a clear button by default once filled, and Escape also clears", async () => {
    render(<SearchField label="Search" defaultValue="hello" />);
    const input = screen.getByRole("searchbox", { name: "Search" }) as HTMLInputElement;
    expect(screen.getByRole("button", { name: "Clear search" })).toBeInTheDocument();
    input.focus();
    await userEvent.keyboard("{Escape}");
    expect(input.value).toBe("");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<SearchField label="Search" description="Filter results" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
