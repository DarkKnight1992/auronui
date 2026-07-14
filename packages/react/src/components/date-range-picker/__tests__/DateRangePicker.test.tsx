import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { DateRangePicker } from "../DateRangePicker";

// NOTE: DateRangePicker depends on `../range-calendar`, which is being ported
// in a parallel batch and is not yet present in this package as of this
// writing. This suite (and the component's typecheck) will fail to resolve
// that import until `range-calendar` lands — see the port report.

describe("DateRangePicker", () => {
  it("renders a field and a trigger button", () => {
    const { container } = render(<DateRangePicker label="Stay" />);
    expect(screen.getAllByRole("spinbutton").length).toBeGreaterThan(0);
    expect(container.querySelector('[aria-label="Open date range picker"]')).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<DateRangePicker label="Stay" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
