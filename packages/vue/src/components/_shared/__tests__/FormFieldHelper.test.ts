import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import FormFieldHelper from "../FormFieldHelper.vue";

describe("FormFieldHelper", () => {
  it("renders nothing when hasHelper is false", () => {
    const wrapper = mount(FormFieldHelper, {
      props: {
        hasHelper: false,
        showError: false,
        showDescription: false,
        errorMessageId: "f-error",
        descriptionId: "f-description",
      },
    });
    expect(wrapper.find("div").exists()).toBe(false);
  });

  it("renders the error message with its id when showError is true", () => {
    const wrapper = mount(FormFieldHelper, {
      props: {
        hasHelper: true,
        showError: true,
        showDescription: false,
        errorMessage: "Required field",
        errorMessageId: "f-error",
        descriptionId: "f-description",
      },
    });
    const errorEl = wrapper.find("#f-error");
    expect(errorEl.exists()).toBe(true);
    expect(errorEl.text()).toBe("Required field");
    expect(wrapper.find("#f-description").exists()).toBe(false);
  });

  it("renders the description with its id when showDescription is true", () => {
    const wrapper = mount(FormFieldHelper, {
      props: {
        hasHelper: true,
        showError: false,
        showDescription: true,
        description: "Helper text",
        errorMessageId: "f-error",
        descriptionId: "f-description",
      },
    });
    const descEl = wrapper.find("#f-description");
    expect(descEl.exists()).toBe(true);
    expect(descEl.text()).toBe("Helper text");
    expect(wrapper.find("#f-error").exists()).toBe(false);
  });

  it("applies wrapperClass, errorClass, descriptionClass to the right elements", () => {
    const wrapper = mount(FormFieldHelper, {
      props: {
        hasHelper: true,
        showError: true,
        showDescription: false,
        errorMessage: "err",
        errorMessageId: "f-error",
        descriptionId: "f-description",
        wrapperClass: "wrapper-class",
        errorClass: "error-class",
      },
    });
    expect(wrapper.find("div").classes()).toContain("wrapper-class");
    expect(wrapper.find("#f-error").classes()).toContain("error-class");
  });
});
