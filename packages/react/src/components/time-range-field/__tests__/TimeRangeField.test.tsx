import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Time } from "@internationalized/date";
import { TimeRangeField } from "../TimeRangeField";

describe("TimeRangeField", () => {
  it("renders two segment lists", () => {
    const { container } = render(<TimeRangeField label="Shift" />);
    expect(container.querySelectorAll('[data-slot="segment-list"]').length).toBe(2);
  });

  it("reports a full range once both start and end are filled", async () => {
    const onChange = vi.fn();
    render(
      <TimeRangeField label="Shift" defaultValue={{ start: new Time(9, 0), end: new Time(17, 0) }} onChange={onChange} />,
    );
    const segments = screen.getAllByRole("spinbutton");
    segments[0]?.focus();
    await userEvent.keyboard("{ArrowUp}");
    expect(onChange).toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TimeRangeField label="Shift" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
