import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useColorState } from "../useColorState";

describe("useColorState — empty values", () => {
  it.each(["", null, undefined])('treats %j as "no value" instead of throwing', (v) => {
    const { result } = renderHook(() => useColorState({ value: v as string }));
    expect(result.current.toHex()).toBe("#000000");
  });

  it("falls back to defaultValue when value is an empty string", () => {
    const { result } = renderHook(() => useColorState({ value: "", defaultValue: "#ff0000" }));
    expect(result.current.toHex()).toBe("#FF0000");
  });

  it("ignores a controlled value that changes to an empty string or null", () => {
    const { result, rerender } = renderHook(({ value }) => useColorState({ value }), {
      initialProps: { value: "#00ff00" as string | null },
    });
    rerender({ value: "" });
    rerender({ value: null });
    expect(result.current.toHex()).toBe("#00FF00");
  });
});
