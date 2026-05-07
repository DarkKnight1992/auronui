import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import axe from "axe-core";
import Description from "../Description.vue";

describe("Description", () => {
  it("renders as <p> by default", () => {
    const wrapper = mount(Description, { slots: { default: "Some description" } });
    expect(wrapper.element.tagName).toBe("P");
  });

  it("has base class 'description'", () => {
    const wrapper = mount(Description, { slots: { default: "Description" } });
    expect(wrapper.classes()).toContain("description");
  });

  it("accepts id prop and renders as id attribute", () => {
    const wrapper = mount(Description, {
      props: { id: "field-description" },
      slots: { default: "Help text" },
    });
    expect(wrapper.attributes("id")).toBe("field-description");
  });

  it("merges consumer class prop", () => {
    const wrapper = mount(Description, { props: { class: "custom-desc" } });
    expect(wrapper.classes()).toContain("custom-desc");
  });

  it("renders slot content", () => {
    const wrapper = mount(Description, { slots: { default: "Slot text" } });
    expect(wrapper.text()).toBe("Slot text");
  });

  it("passes axe audit", async () => {
    const wrapper = mount(Description, {
      slots: { default: "Accessible description" },
      attachTo: document.body,
    });
    const results = await axe.run(wrapper.element);
    expect(results).toHaveNoViolations();
    wrapper.unmount();
  });
});
