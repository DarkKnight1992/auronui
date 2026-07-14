import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { CalendarDate } from "@internationalized/date";
import { Calendar } from "../Calendar";

describe("Calendar", () => {
  it("renders a month grid", () => {
    render(<Calendar defaultPlaceholder={new CalendarDate(2024, 3, 1)} />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("selects a date via click", async () => {
    const onValueChange = vi.fn();
    render(
      <Calendar defaultPlaceholder={new CalendarDate(2024, 3, 1)} onValueChange={onValueChange} />,
    );
    await userEvent.click(screen.getByRole("button", { name: /march 15, 2024/i }));
    expect(onValueChange).toHaveBeenCalledOnce();
    const arg = onValueChange.mock.calls[0]?.[0] as CalendarDate;
    expect(arg.day).toBe(15);
  });

  it("moves focus between cells with arrow keys", async () => {
    render(<Calendar defaultPlaceholder={new CalendarDate(2024, 3, 1)} />);
    const cell = screen.getByRole("button", { name: /march 15, 2024/i });
    cell.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: /march 16, 2024/i })).toHaveFocus();
  });

  it("cycles to the month/year drill-up views via the heading button", async () => {
    render(<Calendar defaultPlaceholder={new CalendarDate(2024, 3, 1)} />);
    await userEvent.click(screen.getByRole("button", { name: /switch to month view/i }));
    expect(screen.getByRole("button", { name: /switch to year view/i })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Calendar defaultPlaceholder={new CalendarDate(2024, 3, 1)} />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
