import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import axe from "axe-core";
import Text from "../Text.vue";

describe("Text", () => {
  it("renders as <p> by default", () => {
    const wrapper = mount(Text, { slots: { default: "Hello" } });
    expect(wrapper.element.tagName).toBe("P");
  });

  it("renders as <h1> when as='h1'", () => {
    const wrapper = mount(Text, { props: { as: "h1" }, slots: { default: "Title" } });
    expect(wrapper.element.tagName).toBe("H1");
  });

  it("renders as <span> when as='span'", () => {
    const wrapper = mount(Text, { props: { as: "span" }, slots: { default: "Span" } });
    expect(wrapper.element.tagName).toBe("SPAN");
  });

  it("applies default Tailwind classes (text-base text-foreground)", () => {
    const wrapper = mount(Text, { slots: { default: "Text" } });
    const classes = wrapper.classes();
    expect(classes).toContain("text-base");
    expect(classes).toContain("text-foreground");
  });

  it("applies text-lg with size='lg'", () => {
    const wrapper = mount(Text, { props: { size: "lg" } });
    expect(wrapper.classes()).toContain("text-lg");
  });

  it("applies text-sm with size='sm'", () => {
    const wrapper = mount(Text, { props: { size: "sm" } });
    expect(wrapper.classes()).toContain("text-sm");
  });

  it("applies text-xl with size='xl'", () => {
    const wrapper = mount(Text, { props: { size: "xl" } });
    expect(wrapper.classes()).toContain("text-xl");
  });

  it("applies text-xs with size='xs'", () => {
    const wrapper = mount(Text, { props: { size: "xs" } });
    expect(wrapper.classes()).toContain("text-xs");
  });

  it("applies text-muted with variant='muted'", () => {
    const wrapper = mount(Text, { props: { variant: "muted" } });
    expect(wrapper.classes()).toContain("text-muted");
  });

  it("applies text-danger with variant='danger'", () => {
    const wrapper = mount(Text, { props: { variant: "danger" } });
    expect(wrapper.classes()).toContain("text-danger");
  });

  it("applies text-success with variant='success'", () => {
    const wrapper = mount(Text, { props: { variant: "success" } });
    expect(wrapper.classes()).toContain("text-success");
  });

  it("applies text-warning with variant='warning'", () => {
    const wrapper = mount(Text, { props: { variant: "warning" } });
    expect(wrapper.classes()).toContain("text-warning");
  });

  it("merges consumer class prop", () => {
    const wrapper = mount(Text, { props: { class: "custom-class" } });
    expect(wrapper.classes()).toContain("custom-class");
  });

  it("renders slot content", () => {
    const wrapper = mount(Text, { slots: { default: "Slot content" } });
    expect(wrapper.text()).toBe("Slot content");
  });

  it("passes axe audit as <p>", async () => {
    const wrapper = mount(Text, {
      slots: { default: "Accessible text" },
      attachTo: document.body,
    });
    const results = await axe.run(wrapper.element);
    expect(results).toHaveNoViolations();
    wrapper.unmount();
  });

  it("passes axe audit as <h1>", async () => {
    const wrapper = mount(Text, {
      props: { as: "h1" },
      slots: { default: "Heading" },
      attachTo: document.body,
    });
    const results = await axe.run(wrapper.element);
    expect(results).toHaveNoViolations();
    wrapper.unmount();
  });
});
