import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { ToggleButton } from "../ToggleButton";

describe("ToggleButton", () => {
  it("renders its label", () => {
    render(<ToggleButton>Bold</ToggleButton>);
    expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();
  });

  it("toggles pressed state (uncontrolled) on click", async () => {
    render(<ToggleButton>Bold</ToggleButton>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "true");
    expect(btn).toHaveAttribute("data-state", "on");
    await userEvent.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "false");
    expect(btn).toHaveAttribute("data-state", "off");
  });

  it("respects defaultPressed", () => {
    render(<ToggleButton defaultPressed>Bold</ToggleButton>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("supports controlled pressed + onPressedChange", async () => {
    const onPressedChange = vi.fn();
    render(
      <ToggleButton pressed={false} onPressedChange={onPressedChange}>
        Bold
      </ToggleButton>,
    );
    const btn = screen.getByRole("button");
    await userEvent.click(btn);
    expect(onPressedChange).toHaveBeenCalledWith(true);
    // controlled: pressed prop unchanged, so DOM should not reflect the toggle
    expect(btn).toHaveAttribute("aria-pressed", "false");
  });

  it("disables the button and blocks toggling when isDisabled", async () => {
    const onPressedChange = vi.fn();
    render(
      <ToggleButton isDisabled onPressedChange={onPressedChange}>
        Bold
      </ToggleButton>,
    );
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    await userEvent.click(btn);
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ToggleButton>Bold</ToggleButton>);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
