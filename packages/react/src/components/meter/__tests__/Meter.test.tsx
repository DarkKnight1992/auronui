import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { Meter } from "../Meter";

describe("Meter", () => {
  it("exposes the meter role with correct aria values", () => {
    render(<Meter value={40} minValue={0} maxValue={100} label="Storage" />);
    const meter = screen.getByRole("meter");
    expect(meter).toHaveAttribute("aria-valuenow", "40");
    expect(meter).toHaveAttribute("aria-valuemin", "0");
    expect(meter).toHaveAttribute("aria-valuemax", "100");
  });

  it("renders the value label when showValueLabel is true", () => {
    render(<Meter value={40} showValueLabel />);
    expect(screen.getByText("40%")).toBeInTheDocument();
  });

  it("clamps the fill percentage between 0 and 100", () => {
    const { container } = render(<Meter value={999} maxValue={100} />);
    const fill = container.querySelector('[style*="width"]') as HTMLElement;
    expect(fill.style.width).toBe("100%");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Meter value={40} label="Storage" showValueLabel />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
