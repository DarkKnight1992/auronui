import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import axe from "axe-core";
import Chip from "../Chip.vue";

describe("Chip", () => {
  it("renders a <span> element at root", () => {
    const wrapper = mount(Chip, {
      slots: { default: "Tag" },
    });
    expect(wrapper.element.tagName).toBe("SPAN");
  });

  it("applies base class 'chip chip--default chip--solid' with defaults", () => {
    const wrapper = mount(Chip, {
      slots: { default: "Tag" },
    });
    expect(wrapper.classes()).toContain("chip");
    expect(wrapper.classes()).toContain("chip--default");
    expect(wrapper.classes()).toContain("chip--solid");
  });

  it("applies 'chip--accent' with color='accent'", () => {
    const wrapper = mount(Chip, { props: { color: "accent" } });
    expect(wrapper.classes()).toContain("chip--accent");
  });

  it("applies 'chip--danger' with color='danger'", () => {
    const wrapper = mount(Chip, { props: { color: "danger" } });
    expect(wrapper.classes()).toContain("chip--danger");
  });

  it("applies 'chip--success' with color='success'", () => {
    const wrapper = mount(Chip, { props: { color: "success" } });
    expect(wrapper.classes()).toContain("chip--success");
  });

  it("applies 'chip--warning' with color='warning'", () => {
    const wrapper = mount(Chip, { props: { color: "warning" } });
    expect(wrapper.classes()).toContain("chip--warning");
  });

  it("applies 'chip--sm' with size='sm'", () => {
    const wrapper = mount(Chip, { props: { size: "sm" } });
    expect(wrapper.classes()).toContain("chip--sm");
  });

  it("applies 'chip--md' with size='md'", () => {
    const wrapper = mount(Chip, { props: { size: "md" } });
    expect(wrapper.classes()).toContain("chip--md");
  });

  it("applies 'chip--lg' with size='lg'", () => {
    const wrapper = mount(Chip, { props: { size: "lg" } });
    expect(wrapper.classes()).toContain("chip--lg");
  });

  it("applies 'chip--solid' with variant='solid'", () => {
    const wrapper = mount(Chip, { props: { variant: "solid" } });
    expect(wrapper.classes()).toContain("chip--solid");
  });

  it("applies 'chip--soft' with variant='soft'", () => {
    const wrapper = mount(Chip, { props: { variant: "soft" } });
    expect(wrapper.classes()).toContain("chip--soft");
  });

  it("applies 'chip--outlined' with variant='outlined'", () => {
    const wrapper = mount(Chip, { props: { variant: "outlined" } });
    expect(wrapper.classes()).toContain("chip--outlined");
  });

  it("applies 'chip--text' with variant='text'", () => {
    const wrapper = mount(Chip, { props: { variant: "text" } });
    expect(wrapper.classes()).toContain("chip--text");
  });

  it("renders default slot content inside chip__label span", () => {
    const wrapper = mount(Chip, {
      slots: { default: "My Tag" },
    });
    const labelSpan = wrapper.find(".chip__label");
    expect(labelSpan.exists()).toBe(true);
    expect(labelSpan.text()).toBe("My Tag");
  });

  it("merges consumer class prop with base slot class", () => {
    const wrapper = mount(Chip, {
      props: { class: "custom-chip" },
      slots: { default: "Tag" },
    });
    expect(wrapper.classes()).toContain("chip");
    expect(wrapper.classes()).toContain("custom-chip");
  });

  it("passes axe audit with zero violations", async () => {
    const wrapper = mount(Chip, {
      slots: { default: "Accessible Tag" },
      attachTo: document.body,
    });
    const results = await axe.run(wrapper.element);
    expect(results).toHaveNoViolations();
    wrapper.unmount();
  });
});
