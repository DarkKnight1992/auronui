import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Time } from "@internationalized/date";
import { TimePicker } from "../TimePicker";

describe("TimePicker", () => {
  it("renders a field and a trigger button", () => {
    const { container } = render(<TimePicker label="Time" />);
    expect(screen.getAllByRole("spinbutton").length).toBeGreaterThan(0);
    expect(container.querySelector('[aria-label="Open time picker"]')).toBeInTheDocument();
  });

  it("opens the scroller popover on trigger click", async () => {
    const { container } = render(<TimePicker label="Time" defaultValue={new Time(9, 30)} />);
    await userEvent.click(container.querySelector('[aria-label="Open time picker"]') as HTMLElement);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getAllByRole("listbox").length).toBeGreaterThan(0);
  });

  it("updates the field when a segment is incremented", async () => {
    const onChange = vi.fn();
    render(<TimePicker label="Time" defaultValue={new Time(9, 30)} onChange={onChange} />);
    const segments = screen.getAllByRole("spinbutton");
    segments[0]?.focus();
    await userEvent.keyboard("{ArrowUp}");
    expect(onChange).toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TimePicker label="Time" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
