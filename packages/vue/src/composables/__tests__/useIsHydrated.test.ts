import { describe, it, expect } from "vitest";
import { defineComponent } from "vue";
import { mount } from "@vue/test-utils";
import { useIsHydrated } from "../useIsHydrated";

describe("useIsHydrated", () => {
  it("returns a Ref<boolean>", () => {
    let result: ReturnType<typeof useIsHydrated> | undefined;
    const TestComponent = defineComponent({
      setup() {
        result = useIsHydrated();
        return {};
      },
      template: "<div></div>",
    });
    mount(TestComponent);
    expect(result).toBeDefined();
    expect(typeof result!.value).toBe("boolean");
  });

  it("is false initially (SSR-safe — ref starts as false before onMounted)", () => {
    const initialValues: boolean[] = [];
    const TestComponent = defineComponent({
      setup() {
        const isHydrated = useIsHydrated();
        // Capture synchronously before onMounted fires
        initialValues.push(isHydrated.value);
        return {};
      },
      template: "<div></div>",
    });
    mount(TestComponent);
    expect(initialValues[0]).toBe(false);
  });

  it("is true after the component mounts (hydrated)", async () => {
    let isHydrated: ReturnType<typeof useIsHydrated> | undefined;
    const TestComponent = defineComponent({
      setup() {
        isHydrated = useIsHydrated();
        return {};
      },
      template: "<div></div>",
    });
    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();
    expect(isHydrated!.value).toBe(true);
  });
});
