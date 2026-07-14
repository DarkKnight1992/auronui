import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { ColorInputGroup } from "../ColorInputGroup";

describe("ColorInputGroup", () => {
  it("renders the swatch and hex input", () => {
    const { container } = render(<ColorInputGroup defaultValue="#ff0000" label="Color" />);
    // The prefix swatch is wrapped in an aria-hidden decorative span (matches
    // the Vue source), so it's queried by class rather than accessible role.
    expect(container.querySelector(".color-swatch")).toBeInTheDocument();
    expect(screen.getByLabelText("Color")).toHaveValue("#FF0000");
  });

  it("shows the HEX suffix label by default", () => {
    render(<ColorInputGroup defaultValue="#ff0000" label="Color" />);
    expect(screen.getByText("HEX")).toBeInTheDocument();
  });

  it("fires onChange once a valid color is typed", async () => {
    const onChange = vi.fn();
    render(<ColorInputGroup defaultValue="#000000" label="Color" onChange={onChange} />);
    const input = screen.getByLabelText("Color");
    await userEvent.clear(input);
    await userEvent.type(input, "#00ff00");
    expect(onChange).toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ColorInputGroup defaultValue="#3b82f6" label="Color" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
