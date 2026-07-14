import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { CalendarDate } from "@internationalized/date";
import { DatePicker } from "../DatePicker";

describe("DatePicker", () => {
  it("renders a field and a trigger button", () => {
    const { container } = render(<DatePicker label="Date" />);
    expect(screen.getAllByRole("spinbutton").length).toBeGreaterThan(0);
    // RAC fuses the trigger's aria-labelledby with the field's own label, so its
    // computed accessible name isn't a plain string match — assert on the
    // aria-label attribute we set instead of role+name.
    expect(container.querySelector('[aria-label="Open date picker"]')).toBeInTheDocument();
  });

  it("opens the calendar popover on trigger click", async () => {
    const { container } = render(<DatePicker label="Date" defaultValue={new CalendarDate(2024, 3, 15)} />);
    await userEvent.click(container.querySelector('[aria-label="Open date picker"]') as HTMLElement);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("increments the focused segment on ArrowUp", async () => {
    const onChange = vi.fn();
    render(<DatePicker label="Date" defaultValue={new CalendarDate(2024, 3, 15)} onChange={onChange} />);
    const segments = screen.getAllByRole("spinbutton");
    segments[0]?.focus();
    await userEvent.keyboard("{ArrowUp}");
    expect(onChange).toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<DatePicker label="Date" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
