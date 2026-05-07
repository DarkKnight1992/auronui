import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";
import { useMeasuredHeight } from "../useMeasuredHeight";

// Mock ResizeObserver for jsdom — must use function syntax for constructor
beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).ResizeObserver = function ResizeObserver(
    _callback: ResizeObserverCallback
  ) {
    return {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    };
  };
});

describe("useMeasuredHeight", () => {
  it("returns a Ref<number>", () => {
    const el = ref<HTMLElement | null>(null);
    const height = useMeasuredHeight(el);
    expect(height).toBeDefined();
    expect(typeof height.value).toBe("number");
  });

  it("returns 0 before mount (null element)", () => {
    const el = ref<HTMLElement | null>(null);
    const height = useMeasuredHeight(el);
    expect(height.value).toBe(0);
  });

  it("returns 0 for element with no layout (jsdom)", () => {
    const el = ref<HTMLElement | null>(document.createElement("div"));
    const height = useMeasuredHeight(el);
    // jsdom has no layout engine, offsetHeight is always 0
    expect(height.value).toBe(0);
  });
});
