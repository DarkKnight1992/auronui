import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { ColorPicker } from "../ColorPicker";

describe("ColorPicker", () => {
  it("renders the area, hue/alpha sliders, swatch, and hex field", () => {
    render(<ColorPicker defaultValue="#3b82f6" label="Brand color" />);
    expect(screen.getByRole("group", { name: "Brand color" })).toBeInTheDocument();
    expect(screen.getAllByRole("slider")).toHaveLength(3); // area + hue + alpha
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByLabelText("Hex color")).toBeInTheDocument();
  });

  it("propagates a hex field edit through context to onValueChange", async () => {
    const onValueChange = vi.fn();
    render(<ColorPicker defaultValue="#000000" label="Brand color" onValueChange={onValueChange} />);
    const input = screen.getByLabelText("Hex color");
    await userEvent.clear(input);
    await userEvent.type(input, "#00ff00");
    expect(onValueChange).toHaveBeenCalled();
    expect(onValueChange.mock.calls.at(-1)?.[0]).toBe("#00FF00");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ColorPicker defaultValue="#3b82f6" label="Brand color" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
