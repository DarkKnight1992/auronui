import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { ColorSwatchPicker } from "../ColorSwatchPicker";

const colors = ["#ff0000", "#00FF00", "#0000FF"];

describe("ColorSwatchPicker", () => {
  it("renders one radio per color", () => {
    render(<ColorSwatchPicker colors={colors} />);
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("marks the matching defaultValue swatch as checked", () => {
    render(<ColorSwatchPicker colors={colors} defaultValue="#00FF00" />);
    expect(screen.getByRole("radio", { name: "#00FF00" })).toHaveAttribute("aria-checked", "true");
  });

  it("selects a swatch on click and fires onValueChange", async () => {
    const onValueChange = vi.fn();
    render(<ColorSwatchPicker colors={colors} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("radio", { name: "#0000FF" }));
    expect(onValueChange).toHaveBeenCalledWith("#0000FF");
    expect(screen.getByRole("radio", { name: "#0000FF" })).toHaveAttribute("aria-checked", "true");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ColorSwatchPicker colors={colors} />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
