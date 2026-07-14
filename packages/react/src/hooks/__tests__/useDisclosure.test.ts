import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useDisclosure } from "../useDisclosure";

describe("useDisclosure", () => {
  it("defaults to closed", () => {
    const { result } = renderHook(() => useDisclosure());
    expect(result.current.isOpen).toBe(false);
  });

  it("respects defaultOpen", () => {
    const { result } = renderHook(() => useDisclosure(true));
    expect(result.current.isOpen).toBe(true);
  });

  it("opens and closes", () => {
    const { result } = renderHook(() => useDisclosure());

    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
  });

  it("toggles", () => {
    const { result } = renderHook(() => useDisclosure());

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(false);
  });

  it("syncs via onOpenChange", () => {
    const { result } = renderHook(() => useDisclosure());

    act(() => result.current.onOpenChange(true));
    expect(result.current.isOpen).toBe(true);
  });
});
