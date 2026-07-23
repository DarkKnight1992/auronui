import { describe, expect, it, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { ColorPicker } from "../ColorPicker";

describe("ColorPicker", () => {
  it("renders the area, hue/alpha sliders, swatch, and hex field", () => {
    render(<ColorPicker defaultValue="#3b82f6" label="Brand color" />);
    expect(screen.getByRole("group", { name: "Brand color" })).toBeInTheDocument();
    expect(screen.getAllByRole("slider")).toHaveLength(3); // area + hue + alpha
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByLabelText("Hex color")).toBeInTheDocument();
  });

  it("propagates a hex field edit through context to onValueChange", async () => {
    const onValueChange = vi.fn();
    render(<ColorPicker defaultValue="#000000" label="Brand color" onValueChange={onValueChange} />);
    const input = screen.getByLabelText("Hex color");
    await userEvent.clear(input);
    await userEvent.type(input, "#00ff00");
    expect(onValueChange).toHaveBeenCalled();
    expect(onValueChange.mock.calls.at(-1)?.[0]).toBe("#00FF00");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ColorPicker defaultValue="#3b82f6" label="Brand color" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });

  it("typing a new hex value into the hex field, then dragging the area, does not revert to the previous hue", async () => {
    // Mirrors the Vue package's ColorPickerInput regression test for a bug
    // found there: a hex-field edit writes red/green/blue/alpha channels
    // (not hue) through the shared context, and a subsequent ColorArea drag
    // must not reintroduce whatever hue was current before the hex edit.
    // This package's ColorArea always derives its next color via
    // color.withChannelValue(xChannel, ...).withChannelValue(yChannel, ...)
    // starting from the *current* (already-correct) color, so hue is carried
    // forward directly rather than reasserted from a remembered value — this
    // test confirms that holds through the full ColorPicker composition, not
    // just ColorArea in isolation.
    const onValueChange = vi.fn();
    render(<ColorPicker defaultValue="#3b82f6" label="Brand color" onValueChange={onValueChange} />);

    const hexInput = screen.getByLabelText("Hex color");
    await userEvent.clear(hexInput);
    await userEvent.type(hexInput, "#c9a84c");
    expect(onValueChange.mock.calls.at(-1)?.[0]).toBe("#C9A84C");

    const areaSlider = screen.getByRole("slider", { name: "saturation / brightness" });
    const area = areaSlider.parentElement as HTMLElement;
    area.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 200, height: 200, right: 200, bottom: 200 }) as DOMRect;
    area.setPointerCapture = vi.fn();
    area.releasePointerCapture = vi.fn();

    act(() => {
      const down = new MouseEvent("pointerdown", { clientX: 120, clientY: 80, bubbles: true });
      Object.defineProperty(down, "pointerId", { value: 1 });
      area.dispatchEvent(down);
      const move = new MouseEvent("pointermove", { clientX: 60, clientY: 140, bubbles: true });
      Object.defineProperty(move, "pointerId", { value: 1 });
      area.dispatchEvent(move);
    });

    const { parseColor } = await import("react-stately");
    const finalHex = onValueChange.mock.calls.at(-1)?.[0] as string;
    const finalHue = Math.round(parseColor(finalHex).toFormat("hsl").getChannelValue("hue"));
    // Must stay in the gold family (hue ~40°), never revert toward the
    // original blue (hue ~217°).
    expect(finalHue).toBeGreaterThan(20);
    expect(finalHue).toBeLessThan(70);
  });
});
