import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { ProgressBar } from "../ProgressBar";

describe("ProgressBar", () => {
  it("exposes the progressbar role with correct aria values", () => {
    render(<ProgressBar value={40} label="Upload" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("omits aria-valuenow when indeterminate", () => {
    render(<ProgressBar isIndeterminate label="Loading" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).not.toHaveAttribute("aria-valuenow");
  });

  it("renders the value label when showValueLabel is true", () => {
    render(<ProgressBar value={40} showValueLabel />);
    expect(screen.getByText("40%")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ProgressBar value={40} label="Upload" showValueLabel />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
