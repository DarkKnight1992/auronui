import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { Slider } from "../Slider";

describe("Slider", () => {
  it("renders a slider thumb with correct aria attributes", () => {
    render(<Slider defaultValue={40} min={0} max={100} label="Volume" />);
    const thumb = screen.getByRole("slider", { name: "Volume" });
    expect(thumb).toHaveAttribute("aria-valuenow", "40");
    expect(thumb).toHaveAttribute("aria-valuemin", "0");
    expect(thumb).toHaveAttribute("aria-valuemax", "100");
  });

  it("renders two thumbs in range mode", () => {
    render(<Slider defaultValue={[20, 80]} min={0} max={100} label="Range" />);
    const thumbs = screen.getAllByRole("slider");
    expect(thumbs).toHaveLength(2);
    expect(thumbs[0]).toHaveAttribute("aria-valuenow", "20");
    expect(thumbs[1]).toHaveAttribute("aria-valuenow", "80");
  });

  it("increments value on ArrowRight and calls onValueCommit", async () => {
    const onValueChange = vi.fn();
    const onValueCommit = vi.fn();
    render(
      <Slider
        defaultValue={40}
        min={0}
        max={100}
        step={1}
        label="Volume"
        onValueChange={onValueChange}
        onValueCommit={onValueCommit}
      />,
    );
    const thumb = screen.getByRole("slider", { name: "Volume" });
    thumb.focus();
    const { default: userEvent } = await import("@testing-library/user-event");
    await userEvent.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenCalledWith(41);
    expect(onValueCommit).toHaveBeenCalledWith(41);
  });

  it("does not respond to keyboard when disabled", async () => {
    const onValueChange = vi.fn();
    render(
      <Slider defaultValue={40} isDisabled label="Volume" onValueChange={onValueChange} />,
    );
    const thumb = screen.getByRole("slider", { name: "Volume" });
    expect(thumb).toHaveAttribute("tabIndex", "-1");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Slider defaultValue={40} label="Volume" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
