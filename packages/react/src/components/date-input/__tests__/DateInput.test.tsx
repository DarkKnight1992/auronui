import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { CalendarDate } from "@internationalized/date";
import { DateInput } from "../DateInput";

describe("DateInput", () => {
  it("renders segments", () => {
    render(<DateInput label="Date" />);
    expect(screen.getAllByRole("spinbutton").length).toBeGreaterThan(0);
  });

  it("increments the focused segment on ArrowUp and reports the change once all segments are filled", async () => {
    const onChange = vi.fn();
    render(<DateInput label="Date" defaultValue={new CalendarDate(2024, 1, 1)} onChange={onChange} />);
    const segments = screen.getAllByRole("spinbutton");
    segments[0]?.focus();
    await userEvent.keyboard("{ArrowUp}");
    expect(onChange).toHaveBeenCalled();
    const called = onChange.mock.calls[0]?.[0] as CalendarDate;
    expect(called.month).toBe(2);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<DateInput label="Date" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
