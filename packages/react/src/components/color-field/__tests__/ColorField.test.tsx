import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { ColorField } from "../ColorField";

describe("ColorField", () => {
  it("renders the initial color as hex text", () => {
    render(<ColorField defaultValue="#ff0000" label="Hex color" />);
    expect(screen.getByLabelText("Hex color")).toHaveValue("#FF0000");
  });

  it("fires onChange once a valid color is typed", async () => {
    const onChange = vi.fn();
    render(<ColorField defaultValue="#000000" label="Hex color" onChange={onChange} />);
    const input = screen.getByLabelText("Hex color");
    await userEvent.clear(input);
    await userEvent.type(input, "#00ff00");
    expect(onChange).toHaveBeenCalled();
  });

  it("shows an error message with role alert", () => {
    render(<ColorField defaultValue="#000000" label="Hex color" errorMessage="Invalid color" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid color");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ColorField defaultValue="#3b82f6" label="Hex color" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
