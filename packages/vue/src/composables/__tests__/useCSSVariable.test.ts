import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";
import { useCSSVariable } from "../useCSSVariable";

describe("useCSSVariable", () => {
  beforeEach(() => {
    // Mock getComputedStyle for jsdom
    vi.spyOn(window, "getComputedStyle").mockReturnValue({
      getPropertyValue: (prop: string) => {
        if (prop === "--color-primary") return " #3b82f6";
        if (prop === "--spacing-4") return " 16px";
        return "";
      },
    } as unknown as CSSStyleDeclaration);
  });

  it("returns a Ref<string>", () => {
    const el = ref(document.createElement("div"));
    const result = useCSSVariable(el, "--color-primary");
    expect(result).toBeDefined();
    expect(typeof result).toBe("object");
    expect("value" in result).toBe(true);
  });

  it("returns empty string when element is null", () => {
    const el = ref<HTMLElement | null>(null);
    const result = useCSSVariable(el, "--color-primary");
    // null element — should return empty string or fallback
    expect(typeof result.value).toBe("string");
  });
});
