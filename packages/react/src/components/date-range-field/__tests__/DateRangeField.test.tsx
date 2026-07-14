import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { CalendarDate } from "@internationalized/date";
import { DateRangeField } from "../DateRangeField";

describe("DateRangeField", () => {
  it("renders two segment lists", () => {
    const { container } = render(<DateRangeField label="Stay" />);
    expect(container.querySelectorAll('[data-slot="segment-list"]').length).toBe(2);
  });

  it("reports a full range once both start and end are filled", async () => {
    const onChange = vi.fn();
    render(
      <DateRangeField
        label="Stay"
        defaultValue={{ start: new CalendarDate(2024, 1, 1), end: new CalendarDate(2024, 1, 5) }}
        onChange={onChange}
      />,
    );
    const segments = screen.getAllByRole("spinbutton");
    segments[0]?.focus();
    await userEvent.keyboard("{ArrowUp}");
    expect(onChange).toHaveBeenCalled();
    const range = onChange.mock.calls[0]?.[0] as { start: CalendarDate; end: CalendarDate };
    expect(range.start).toBeTruthy();
    expect(range.end).toBeTruthy();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<DateRangeField label="Stay" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
