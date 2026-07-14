import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { Statistic } from "../Statistic";

describe("Statistic", () => {
  it("renders the label and value", () => {
    render(<Statistic label="Revenue" value={1024} />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("1024")).toBeInTheDocument();
  });

  it("applies precision formatting to numeric values", () => {
    render(<Statistic label="Revenue" value={12.345} precision={2} />);
    expect(screen.getByText("12.35")).toBeInTheDocument();
  });

  it("renders prefix, suffix, and trend value", () => {
    render(<Statistic label="Revenue" value={100} prefix="$" suffix="k" trend="up" trendValue="12%" />);
    expect(screen.getByText("$")).toBeInTheDocument();
    expect(screen.getByText("k")).toBeInTheDocument();
    expect(screen.getByText("12%")).toBeInTheDocument();
  });

  it("renders a loading placeholder instead of the value when isLoading", () => {
    const { container } = render(<Statistic label="Revenue" value={100} isLoading />);
    expect(container.querySelector('[data-slot="statistic-loading"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="statistic-value"]')).not.toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Statistic label="Revenue" value={100} prefix="$" description="Last 30 days" trend="up" trendValue="12%" />,
    );
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
