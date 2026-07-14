import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { CalendarDate } from "@internationalized/date";
import { RangeCalendar } from "../RangeCalendar";

describe("RangeCalendar", () => {
  it("renders a month grid", () => {
    render(<RangeCalendar defaultPlaceholder={new CalendarDate(2024, 3, 1)} />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("selects a start and end date via two clicks", async () => {
    const onValueChange = vi.fn();
    render(
      <RangeCalendar defaultPlaceholder={new CalendarDate(2024, 3, 1)} onValueChange={onValueChange} />,
    );
    await userEvent.click(screen.getByRole("button", { name: /march 10, 2024/i }));
    await userEvent.click(screen.getByRole("button", { name: /march 20, 2024/i }));
    expect(onValueChange).toHaveBeenCalled();
    const last = onValueChange.mock.calls[onValueChange.mock.calls.length - 1]?.[0] as {
      start: CalendarDate;
      end: CalendarDate;
    };
    expect(last.start.day).toBe(10);
    expect(last.end.day).toBe(20);
  });

  it("moves focus between cells with arrow keys", async () => {
    render(<RangeCalendar defaultPlaceholder={new CalendarDate(2024, 3, 1)} />);
    const cell = screen.getByRole("button", { name: /march 15, 2024/i });
    cell.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: /march 16, 2024/i })).toHaveFocus();
  });

  it("cycles to the month drill-up view via the heading button", async () => {
    render(<RangeCalendar defaultPlaceholder={new CalendarDate(2024, 3, 1)} />);
    await userEvent.click(screen.getByRole("button", { name: /switch to month view/i }));
    expect(screen.getByRole("button", { name: /switch to year view/i })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<RangeCalendar defaultPlaceholder={new CalendarDate(2024, 3, 1)} />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
