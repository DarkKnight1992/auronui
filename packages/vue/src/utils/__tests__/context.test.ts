import { describe, it, expect } from "vitest";
import { defineComponent, h } from "vue";
import { mount } from "@vue/test-utils";
import { createContext } from "../context";

interface TestContextValue {
  theme: string;
  count: number;
}

describe("createContext", () => {
  it("returns useProvide, useInject, and key", () => {
    const ctx = createContext<TestContextValue>("TestContext");
    expect(typeof ctx.useProvide).toBe("function");
    expect(typeof ctx.useInject).toBe("function");
    expect(typeof ctx.key).toBe("symbol");
  });

  it("Symbol key includes context name (for debugging)", () => {
    const ctx = createContext<TestContextValue>("MyContext");
    expect(ctx.key.toString()).toContain("MyContext");
  });

  it("useInject returns value from provider", () => {
    const ctx = createContext<TestContextValue>("TestContext");
    let injected: TestContextValue | undefined;

    const Consumer = defineComponent({
      setup() {
        injected = ctx.useInject();
        return () => h("span");
      },
    });

    const Provider = defineComponent({
      setup() {
        ctx.useProvide({ theme: "dark", count: 42 });
        return () => h(Consumer);
      },
    });

    mount(Provider);
    expect(injected?.theme).toBe("dark");
    expect(injected?.count).toBe(42);
  });

  it("useInject throws when no provider and no fallback", () => {
    const ctx = createContext<TestContextValue>("TestContext");
    let caughtError: Error | undefined;

    const Consumer = defineComponent({
      setup() {
        try {
          ctx.useInject();
        } catch (e) {
          caughtError = e as Error;
        }
        return () => h("div");
      },
    });

    mount(Consumer);
    expect(caughtError?.message).toBe(
      "[Auron] TestContext context used outside provider"
    );
  });

  it("useInject returns fallback when no provider", () => {
    const ctx = createContext<TestContextValue>("TestContext");
    const fallback: TestContextValue = { theme: "light", count: 0 };
    let injected: TestContextValue | undefined;

    const Consumer = defineComponent({
      setup() {
        injected = ctx.useInject(fallback);
        return () => h("div");
      },
    });

    mount(Consumer);
    expect(injected?.theme).toBe("light");
    expect(injected?.count).toBe(0);
  });

  it("exact error message matches specification", () => {
    const ctx = createContext<TestContextValue>("MySpecialContext");
    let caughtError: Error | undefined;

    const Consumer = defineComponent({
      setup() {
        try {
          ctx.useInject();
        } catch (e) {
          caughtError = e as Error;
        }
        return () => h("div");
      },
    });

    mount(Consumer);
    expect(caughtError?.message).toBe(
      "[Auron] MySpecialContext context used outside provider"
    );
  });
});
