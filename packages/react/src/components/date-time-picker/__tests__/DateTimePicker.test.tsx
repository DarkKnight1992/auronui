import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { CalendarDateTime } from "@internationalized/date";
import { DateTimePicker } from "../DateTimePicker";

describe("DateTimePicker", () => {
  it("renders a field and a trigger button", () => {
    const { container } = render(<DateTimePicker label="Appointment" />);
    expect(screen.getAllByRole("spinbutton").length).toBeGreaterThan(0);
    expect(container.querySelector('[aria-label="Open date time picker"]')).toBeInTheDocument();
  });

  it("opens the calendar + scroller popover on trigger click", async () => {
    const { container } = render(<DateTimePicker label="Appointment" defaultValue={new CalendarDateTime(2024, 3, 15, 9, 30)} />);
    await userEvent.click(container.querySelector('[aria-label="Open date time picker"]') as HTMLElement);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getAllByRole("listbox").length).toBeGreaterThan(0);
  });

  it("increments the focused segment on ArrowUp", async () => {
    const onChange = vi.fn();
    render(<DateTimePicker label="Appointment" defaultValue={new CalendarDateTime(2024, 3, 15, 9, 30)} onChange={onChange} />);
    const segments = screen.getAllByRole("spinbutton");
    segments[0]?.focus();
    await userEvent.keyboard("{ArrowUp}");
    expect(onChange).toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<DateTimePicker label="Appointment" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
