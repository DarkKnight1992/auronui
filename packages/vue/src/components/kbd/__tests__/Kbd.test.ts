import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import axe from "axe-core";
import Kbd from "../Kbd.vue";

describe("Kbd", () => {
  it("renders a <kbd> element at the root", () => {
    const wrapper = mount(Kbd, {
      slots: { default: "Ctrl" },
    });
    expect(wrapper.element.tagName).toBe("KBD");
  });

  it("applies base class 'kbd' with default variant", () => {
    const wrapper = mount(Kbd, {
      slots: { default: "Ctrl" },
    });
    expect(wrapper.classes()).toContain("kbd");
  });

  it("applies 'kbd--default' modifier with variant='default'", () => {
    const wrapper = mount(Kbd, {
      props: { variant: "default" },
      slots: { default: "Ctrl" },
    });
    expect(wrapper.classes()).toContain("kbd--default");
  });

  it("applies 'kbd--light' modifier with variant='light'", () => {
    const wrapper = mount(Kbd, {
      props: { variant: "light" },
      slots: { default: "Ctrl" },
    });
    expect(wrapper.classes()).toContain("kbd--light");
  });

  it("renders default slot content inside the kbd__content span", () => {
    const wrapper = mount(Kbd, {
      slots: { default: "Escape" },
    });
    const contentSpan = wrapper.find(".kbd__content");
    expect(contentSpan.exists()).toBe(true);
    expect(contentSpan.text()).toBe("Escape");
  });

  it("renders named 'abbr' slot content in kbd__abbr element when provided", () => {
    const wrapper = mount(Kbd, {
      slots: {
        default: "Ctrl",
        abbr: "Ctrl",
      },
    });
    const abbrEl = wrapper.find(".kbd__abbr");
    expect(abbrEl.exists()).toBe(true);
    expect(abbrEl.text()).toBe("Ctrl");
  });

  it("does not render abbr element when abbr slot is not provided", () => {
    const wrapper = mount(Kbd, {
      slots: { default: "Ctrl" },
    });
    const abbrEl = wrapper.find(".kbd__abbr");
    expect(abbrEl.exists()).toBe(false);
  });

  it("merges consumer class prop with base slot class", () => {
    const wrapper = mount(Kbd, {
      props: { class: "custom-class" },
      slots: { default: "Ctrl" },
    });
    expect(wrapper.classes()).toContain("kbd");
    expect(wrapper.classes()).toContain("custom-class");
  });

  it("passes axe audit with zero violations", async () => {
    const wrapper = mount(Kbd, {
      slots: { default: "Ctrl" },
      attachTo: document.body,
    });
    const results = await axe.run(wrapper.element);
    expect(results).toHaveNoViolations();
    wrapper.unmount();
  });
});
