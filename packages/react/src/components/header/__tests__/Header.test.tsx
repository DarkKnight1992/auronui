import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { Header } from "../Header";

describe("Header", () => {
  it("renders as <h2> by default with base class", () => {
    render(<Header>Section Title</Header>);
    const el = screen.getByText("Section Title");
    expect(el.tagName).toBe("H2");
    expect(el).toHaveClass("header");
  });

  it("renders as <h1> when as='h1'", () => {
    render(<Header as="h1">Title</Header>);
    expect(screen.getByText("Title").tagName).toBe("H1");
  });

  it("merges consumer className prop", () => {
    render(<Header className="custom-header">Header</Header>);
    expect(screen.getByText("Header")).toHaveClass("custom-header");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Header>Section Title</Header>);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
