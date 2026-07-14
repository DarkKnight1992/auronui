import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { CalendarDate } from "@internationalized/date";
import { MonthPicker } from "../MonthPicker";

describe("MonthPicker", () => {
  it("renders a 3x4 grid of months", () => {
    render(<MonthPicker defaultPlaceholder={new CalendarDate(2024, 1, 1)} />);
    expect(screen.getAllByRole("gridcell")).toHaveLength(12);
  });

  it("selects a month via click", async () => {
    const onValueChange = vi.fn();
    render(
      <MonthPicker defaultPlaceholder={new CalendarDate(2024, 1, 1)} onValueChange={onValueChange} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Mar" }));
    expect(onValueChange).toHaveBeenCalledOnce();
    const arg = onValueChange.mock.calls[0]?.[0] as CalendarDate;
    expect(arg.month).toBe(3);
  });

  it("moves focus between cells with arrow keys", async () => {
    render(<MonthPicker defaultPlaceholder={new CalendarDate(2024, 1, 1)} />);
    const first = screen.getAllByRole("gridcell")[0]?.querySelector("button") as HTMLButtonElement;
    first.focus();
    await userEvent.keyboard("{ArrowDown}");
    const fourth = screen.getAllByRole("gridcell")[3]?.querySelector("button") as HTMLButtonElement;
    expect(fourth).toHaveFocus();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<MonthPicker defaultPlaceholder={new CalendarDate(2024, 1, 1)} />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
