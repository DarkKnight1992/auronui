import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Time } from "@internationalized/date";
import { TimeField } from "../TimeField";

describe("TimeField", () => {
  it("renders segments", () => {
    render(<TimeField label="Time" />);
    expect(screen.getAllByRole("spinbutton").length).toBeGreaterThan(0);
  });

  it("increments the hour segment on ArrowUp", async () => {
    const onChange = vi.fn();
    render(<TimeField label="Time" defaultValue={new Time(10, 30)} onChange={onChange} />);
    const segments = screen.getAllByRole("spinbutton");
    segments[0]?.focus();
    await userEvent.keyboard("{ArrowUp}");
    expect(onChange).toHaveBeenCalled();
    const called = onChange.mock.calls[0]?.[0] as Time;
    expect(called.hour).toBe(11);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TimeField label="Time" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });

  it("keeps data-filled=\"true\" on the field root (not the segment-list) after blur when a value is present", async () => {
    render(<TimeField label="Time" defaultValue={new Time(11, 11)} />);
    const field = document.querySelector('[data-slot="time-field"]') as HTMLElement;
    const segments = screen.getAllByRole("spinbutton");

    segments[0]?.focus();
    await userEvent.tab(); // move focus elsewhere, triggering blur
    document.body.focus();

    expect(field).toHaveAttribute("data-filled", "true");
  });

  it("does not mark the field as filled when there is no value", () => {
    render(<TimeField label="Time" />);
    const field = document.querySelector('[data-slot="time-field"]') as HTMLElement;
    expect(field).not.toHaveAttribute("data-filled");
  });
});
