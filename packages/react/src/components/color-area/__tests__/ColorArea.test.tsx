import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { ColorArea } from "../ColorArea";

describe("ColorArea", () => {
  it("renders a slider thumb", () => {
    render(<ColorArea defaultValue="#3b82f6" />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("changes saturation via ArrowRight", async () => {
    const onChange = vi.fn();
    render(<ColorArea defaultValue="hsb(200, 50%, 50%)" onChange={onChange} />);
    const thumb = screen.getByRole("slider");
    thumb.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalled();
  });

  it("does not respond to keyboard when disabled", () => {
    render(<ColorArea defaultValue="#3b82f6" isDisabled />);
    const thumb = screen.getByRole("slider");
    expect(thumb).toHaveAttribute("tabIndex", "-1");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ColorArea defaultValue="#3b82f6" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });

  it("preserves hue when dragging through the white and black corners and back", () => {
    // Confirms this hand-built React implementation does NOT share a confirmed
    // reka-ui@2.9.5 bug found in the Vue package: reka-ui's shared
    // setChannelValues() loses hue whenever a color round-trips through an
    // achromatic state (zero saturation or brightness). This React ColorArea
    // never round-trips through such an intermediate at all — colorFromPercent()
    // always derives the next color via color.withChannelValue(xChannel, ...)
    // .withChannelValue(yChannel, ...) starting from the *current* color, so
    // hue (an untouched channel) is carried forward directly rather than
    // re-derived from a lossy conversion.
    const onChange = vi.fn();
    render(<ColorArea defaultValue="#3b82f6" onChange={onChange} />);
    const area = screen.getByRole("slider").parentElement as HTMLElement;
    area.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 200, height: 200, right: 200, bottom: 200 }) as DOMRect;
    // jsdom doesn't implement Pointer Events capture APIs this component touches.
    area.setPointerCapture = vi.fn();
    area.releasePointerCapture = vi.fn();

    function dragTo(x: number, y: number) {
      // jsdom has no PointerEvent constructor — a MouseEvent carries the same
      // clientX/clientY/pointerId-shaped fields this handler actually reads.
      const down = new MouseEvent("pointerdown", { clientX: x, clientY: y, bubbles: true });
      Object.defineProperty(down, "pointerId", { value: 1 });
      area.dispatchEvent(down);
      const move = new MouseEvent("pointermove", { clientX: x, clientY: y, bubbles: true });
      Object.defineProperty(move, "pointerId", { value: 1 });
      area.dispatchEvent(move);
    }

    dragTo(0, 0); // white corner: saturation 0
    dragTo(200, 0); // back to saturation 100, brightness 100

    const lastColor = onChange.mock.calls.at(-1)?.[0];
    expect(lastColor).toBeDefined();
    expect(Math.round(lastColor.getChannelValue("hue"))).toBe(217);
    expect(lastColor.getChannelValue("saturation")).toBe(100);
    expect(lastColor.getChannelValue("brightness")).toBe(100);
  });
});
