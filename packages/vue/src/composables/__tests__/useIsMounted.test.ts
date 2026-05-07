import { describe, it, expect } from "vitest";
import { defineComponent } from "vue";
import { mount } from "@vue/test-utils";
import { useIsMounted } from "../useIsMounted";

describe("useIsMounted", () => {
  it("returns a Ref<boolean>", () => {
    let result: ReturnType<typeof useIsMounted> | undefined;
    const TestComponent = defineComponent({
      setup() {
        result = useIsMounted();
        return {};
      },
      template: "<div></div>",
    });
    mount(TestComponent);
    expect(result).toBeDefined();
    expect(typeof result!.value).toBe("boolean");
  });

  it("is true after the component mounts", async () => {
    let isMounted: ReturnType<typeof useIsMounted> | undefined;
    const TestComponent = defineComponent({
      setup() {
        isMounted = useIsMounted();
        return {};
      },
      template: "<div></div>",
    });
    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();
    expect(isMounted!.value).toBe(true);
  });

  it("is false before the component mounts (initial value)", () => {
    // We verify the initial ref value is false before onMounted fires
    const initialValues: boolean[] = [];
    const TestComponent = defineComponent({
      setup() {
        const isMounted = useIsMounted();
        // Capture value synchronously before onMounted can fire
        initialValues.push(isMounted.value);
        return {};
      },
      template: "<div></div>",
    });
    mount(TestComponent);
    expect(initialValues[0]).toBe(false);
  });
});
