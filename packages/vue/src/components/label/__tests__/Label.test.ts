import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import axe from "axe-core";
import Label from "../Label.vue";

describe("Label", () => {
  it("renders <label> element", () => {
    const wrapper = mount(Label, { slots: { default: "My label" } });
    expect(wrapper.element.tagName).toBe("LABEL");
  });

  it("has base class 'label'", () => {
    const wrapper = mount(Label, { slots: { default: "Label" } });
    expect(wrapper.classes()).toContain("label");
  });

  it("has no modifier classes with all defaults", () => {
    const wrapper = mount(Label, { slots: { default: "Label" } });
    const classes = wrapper.classes();
    expect(classes).not.toContain("label--disabled");
    expect(classes).not.toContain("label--invalid");
    expect(classes).not.toContain("label--required");
  });

  it("applies 'label--disabled' when isDisabled=true (boolean)", () => {
    const wrapper = mount(Label, { props: { isDisabled: true } });
    expect(wrapper.classes()).toContain("label--disabled");
  });

  it("does NOT apply 'label--disabled' when isDisabled=false", () => {
    const wrapper = mount(Label, { props: { isDisabled: false } });
    expect(wrapper.classes()).not.toContain("label--disabled");
  });

  it("applies 'label--invalid' when isInvalid=true", () => {
    const wrapper = mount(Label, { props: { isInvalid: true } });
    expect(wrapper.classes()).toContain("label--invalid");
  });

  it("does NOT apply 'label--invalid' when isInvalid=false", () => {
    const wrapper = mount(Label, { props: { isInvalid: false } });
    expect(wrapper.classes()).not.toContain("label--invalid");
  });

  it("applies 'label--required' when isRequired=true", () => {
    const wrapper = mount(Label, { props: { isRequired: true } });
    expect(wrapper.classes()).toContain("label--required");
  });

  it("does NOT apply 'label--required' when isRequired=false", () => {
    const wrapper = mount(Label, { props: { isRequired: false } });
    expect(wrapper.classes()).not.toContain("label--required");
  });

  it("binds :for attribute when for prop provided", () => {
    const wrapper = mount(Label, { props: { for: "my-input" } });
    expect(wrapper.attributes("for")).toBe("my-input");
  });

  it("renders slot content", () => {
    const wrapper = mount(Label, { slots: { default: "Email" } });
    expect(wrapper.text()).toBe("Email");
  });

  it("merges consumer class prop", () => {
    const wrapper = mount(Label, { props: { class: "custom-label" } });
    expect(wrapper.classes()).toContain("custom-label");
  });

  it("passes axe audit", async () => {
    const wrapper = mount(Label, {
      slots: { default: "Email address" },
      attachTo: document.body,
    });
    const results = await axe.run(wrapper.element);
    expect(results).toHaveNoViolations();
    wrapper.unmount();
  });
});
