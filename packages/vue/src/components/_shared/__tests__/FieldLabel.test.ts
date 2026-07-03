import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import FieldLabel from "../FieldLabel.vue";

describe("FieldLabel", () => {
  it("renders nothing when label is unset", () => {
    const wrapper = mount(FieldLabel, { props: { for: "my-id" } });
    expect(wrapper.find("label").exists()).toBe(false);
  });

  it("renders the label text associated to the given id", () => {
    const wrapper = mount(FieldLabel, { props: { for: "my-id", label: "Email" } });
    const label = wrapper.find("label");
    expect(label.exists()).toBe(true);
    expect(label.attributes("for")).toBe("my-id");
    expect(label.text()).toContain("Email");
  });

  it("shows an aria-hidden asterisk when isRequired is true", () => {
    const wrapper = mount(FieldLabel, {
      props: { for: "my-id", label: "Email", isRequired: true },
    });
    const asterisk = wrapper.find("span");
    expect(asterisk.exists()).toBe(true);
    expect(asterisk.attributes("aria-hidden")).toBe("true");
    expect(asterisk.text()).toBe("*");
  });

  it("does not show the asterisk when isRequired is false or unset", () => {
    const wrapper = mount(FieldLabel, { props: { for: "my-id", label: "Email" } });
    expect(wrapper.find("span").exists()).toBe(false);
  });

  it("applies the class prop to the label element", () => {
    const wrapper = mount(FieldLabel, {
      props: { for: "my-id", label: "Email", class: "custom-label-class" },
    });
    expect(wrapper.find("label").classes()).toContain("custom-label-class");
  });
});
