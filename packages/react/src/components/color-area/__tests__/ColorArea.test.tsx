import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { ColorArea } from "../ColorArea";

describe("ColorArea", () => {
  it("renders a slider thumb", () => {
    render(<ColorArea defaultValue="#3b82f6" />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("changes saturation via ArrowRight", async () => {
    const onChange = vi.fn();
    render(<ColorArea defaultValue="hsb(200, 50%, 50%)" onChange={onChange} />);
    const thumb = screen.getByRole("slider");
    thumb.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalled();
  });

  it("does not respond to keyboard when disabled", () => {
    render(<ColorArea defaultValue="#3b82f6" isDisabled />);
    const thumb = screen.getByRole("slider");
    expect(thumb).toHaveAttribute("tabIndex", "-1");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ColorArea defaultValue="#3b82f6" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
