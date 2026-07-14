import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { ColorSwatch } from "../ColorSwatch";

describe("ColorSwatch", () => {
  it("renders with an accessible label derived from the hex value", () => {
    render(<ColorSwatch color="#FF0000" />);
    expect(screen.getByRole("img", { name: "#FF0000" })).toBeInTheDocument();
  });

  it("prefers an explicit label over colorName/hex", () => {
    render(<ColorSwatch color="#FF0000" colorName="Red" label="Brand red" />);
    expect(screen.getByRole("img", { name: "Brand red" })).toBeInTheDocument();
  });

  it("defaults to black when no color or context is available", () => {
    render(<ColorSwatch />);
    expect(screen.getByRole("img", { name: "#000000" })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ColorSwatch color="#3b82f6" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
