import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { Description } from "../Description";

describe("Description", () => {
  it("renders as <p> with base class", () => {
    render(<Description>Some description</Description>);
    const el = screen.getByText("Some description");
    expect(el.tagName).toBe("P");
    expect(el).toHaveClass("description");
  });

  it("accepts id prop", () => {
    render(<Description id="field-description">Help text</Description>);
    expect(screen.getByText("Help text")).toHaveAttribute("id", "field-description");
  });

  it("merges consumer className prop", () => {
    render(<Description className="custom-desc">Text</Description>);
    expect(screen.getByText("Text")).toHaveClass("custom-desc");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Description>Accessible description</Description>);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
