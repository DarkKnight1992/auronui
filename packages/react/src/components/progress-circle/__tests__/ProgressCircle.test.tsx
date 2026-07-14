import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { ProgressCircle } from "../ProgressCircle";

describe("ProgressCircle", () => {
  it("exposes the progressbar role with correct aria values", () => {
    render(<ProgressCircle value={40} label="Upload" />);
    const circle = screen.getByRole("progressbar");
    expect(circle).toHaveAttribute("aria-valuenow", "40");
    expect(circle).toHaveAttribute("aria-valuemin", "0");
    expect(circle).toHaveAttribute("aria-valuemax", "100");
  });

  it("omits aria-valuenow when indeterminate", () => {
    render(<ProgressCircle isIndeterminate label="Loading" />);
    const circle = screen.getByRole("progressbar");
    expect(circle).not.toHaveAttribute("aria-valuenow");
  });

  it("renders the value label when showValueLabel is true", () => {
    render(<ProgressCircle value={40} showValueLabel />);
    expect(screen.getByText("40")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ProgressCircle value={40} label="Upload" showValueLabel />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
