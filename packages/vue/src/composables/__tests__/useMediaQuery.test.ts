import { describe, it, expect, beforeEach, vi } from "vitest";
import { defineComponent, isRef } from "vue";
import { mount } from "@vue/test-utils";
import { useMediaQuery } from "../useMediaQuery";

describe("useMediaQuery", () => {
  beforeEach(() => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({
      matches: false,
      media: "",
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it("returns a reactive Ref<boolean>", () => {
    let result: ReturnType<typeof useMediaQuery> | undefined;
    const TestComponent = defineComponent({
      setup() {
        result = useMediaQuery("(max-width: 768px)");
        return {};
      },
      template: "<div></div>",
    });
    mount(TestComponent);
    expect(result).toBeDefined();
    expect(isRef(result)).toBe(true);
    expect(typeof result!.value).toBe("boolean");
  });

  it("accepts a media query string", () => {
    let result: ReturnType<typeof useMediaQuery> | undefined;
    const TestComponent = defineComponent({
      setup() {
        result = useMediaQuery("(prefers-color-scheme: dark)");
        return {};
      },
      template: "<div></div>",
    });
    mount(TestComponent);
    expect(result).toBeDefined();
  });

  it("returns false when matchMedia returns matches: false", () => {
    let result: ReturnType<typeof useMediaQuery> | undefined;
    const TestComponent = defineComponent({
      setup() {
        result = useMediaQuery("(max-width: 768px)");
        return {};
      },
      template: "<div></div>",
    });
    mount(TestComponent);
    expect(result!.value).toBe(false);
  });

  it("returns true when matchMedia returns matches: true", () => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({
      matches: true,
      media: "",
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    let result: ReturnType<typeof useMediaQuery> | undefined;
    const TestComponent = defineComponent({
      setup() {
        result = useMediaQuery("(min-width: 1024px)");
        return {};
      },
      template: "<div></div>",
    });
    mount(TestComponent);
    expect(result!.value).toBe(true);
  });
});
