import { describe, it, expect, vi } from "vitest";
import { composeSlotClassName } from "../composeSlotClassName";

describe("composeSlotClassName", () => {
  it("returns className when slotFn is undefined", () => {
    expect(composeSlotClassName(undefined, "my-class", {})).toBe("my-class");
  });

  it("calls slotFn with variants and className when slotFn is function", () => {
    const slotFn = vi.fn().mockReturnValue("slot-result");
    const result = composeSlotClassName(slotFn, "my-class", { size: "md" });
    expect(slotFn).toHaveBeenCalledWith({ size: "md", className: "my-class" });
    expect(result).toBe("slot-result");
  });

  it("passes empty variants to slotFn with className", () => {
    const slotFn = vi.fn().mockReturnValue("computed");
    composeSlotClassName(slotFn, "base-class", {});
    expect(slotFn).toHaveBeenCalledWith({ className: "base-class" });
  });

  it("returns undefined className when slotFn is undefined and className is undefined", () => {
    expect(composeSlotClassName(undefined, undefined, {})).toBeUndefined();
  });
});
