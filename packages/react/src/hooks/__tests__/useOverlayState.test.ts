import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useOverlayState } from "../useOverlayState";

describe("useOverlayState", () => {
  it("defaults to closed in uncontrolled mode", () => {
    const { result } = renderHook(() => useOverlayState());
    expect(result.current.isOpen).toBe(false);
  });

  it("respects defaultOpen in uncontrolled mode", () => {
    const { result } = renderHook(() => useOverlayState({ defaultOpen: true }));
    expect(result.current.isOpen).toBe(true);
  });

  it("mutates internal state in uncontrolled mode", () => {
    const { result } = renderHook(() => useOverlayState());

    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);
  });

  it("fires onOpenChange in uncontrolled mode", () => {
    const onOpenChange = vi.fn();
    const { result } = renderHook(() => useOverlayState({ onOpenChange }));

    act(() => result.current.open());
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("reflects controlled value and does not mutate internal state", () => {
    const onOpenChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }) => useOverlayState({ value, onOpenChange }),
      { initialProps: { value: false } },
    );

    expect(result.current.isOpen).toBe(false);

    act(() => result.current.open());
    // setOpen fires the callback but does not flip isOpen itself in controlled mode
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(result.current.isOpen).toBe(false);

    rerender({ value: true });
    expect(result.current.isOpen).toBe(true);
  });
});
