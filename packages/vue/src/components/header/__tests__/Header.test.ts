import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import axe from "axe-core";
import Header from "../Header.vue";

describe("Header", () => {
  it("renders as <h2> by default", () => {
    const wrapper = mount(Header, { slots: { default: "Section Title" } });
    expect(wrapper.element.tagName).toBe("H2");
  });

  it("renders as <h1> when as='h1'", () => {
    const wrapper = mount(Header, { props: { as: "h1" }, slots: { default: "Title" } });
    expect(wrapper.element.tagName).toBe("H1");
  });

  it("renders as <h3> when as='h3'", () => {
    const wrapper = mount(Header, { props: { as: "h3" }, slots: { default: "Title" } });
    expect(wrapper.element.tagName).toBe("H3");
  });

  it("renders as <h4> when as='h4'", () => {
    const wrapper = mount(Header, { props: { as: "h4" }, slots: { default: "Title" } });
    expect(wrapper.element.tagName).toBe("H4");
  });

  it("renders as <h5> when as='h5'", () => {
    const wrapper = mount(Header, { props: { as: "h5" }, slots: { default: "Title" } });
    expect(wrapper.element.tagName).toBe("H5");
  });

  it("renders as <h6> when as='h6'", () => {
    const wrapper = mount(Header, { props: { as: "h6" }, slots: { default: "Title" } });
    expect(wrapper.element.tagName).toBe("H6");
  });

  it("has base class 'header'", () => {
    const wrapper = mount(Header, { slots: { default: "Header" } });
    expect(wrapper.classes()).toContain("header");
  });

  it("merges consumer class prop", () => {
    const wrapper = mount(Header, { props: { class: "custom-header" } });
    expect(wrapper.classes()).toContain("custom-header");
  });

  it("renders slot content", () => {
    const wrapper = mount(Header, { slots: { default: "Slot heading" } });
    expect(wrapper.text()).toBe("Slot heading");
  });

  it("passes axe audit as <h2>", async () => {
    const wrapper = mount(Header, {
      slots: { default: "Section Title" },
      attachTo: document.body,
    });
    const results = await axe.run(wrapper.element);
    expect(results).toHaveNoViolations();
    wrapper.unmount();
  });

  it("passes axe audit as <h1>", async () => {
    const wrapper = mount(Header, {
      props: { as: "h1" },
      slots: { default: "Page Title" },
      attachTo: document.body,
    });
    const results = await axe.run(wrapper.element);
    expect(results).toHaveNoViolations();
    wrapper.unmount();
  });
});
