import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import axe from "axe-core";
import Badge from "../Badge.vue";

describe("Badge", () => {
  it("renders a root div with class 'badge-anchor' (anchor slot)", () => {
    const wrapper = mount(Badge);
    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.classes()).toContain("badge-anchor");
  });

  it("renders a child span with class 'badge' (base slot)", () => {
    const wrapper = mount(Badge);
    const badgeSpan = wrapper.find(".badge");
    expect(badgeSpan.exists()).toBe(true);
    expect(badgeSpan.element.tagName).toBe("SPAN");
  });

  it("applies 'badge--default badge--md badge--primary badge--top-right' with all defaults", () => {
    const wrapper = mount(Badge);
    const badgeSpan = wrapper.find(".badge");
    expect(badgeSpan.classes()).toContain("badge--default");
    expect(badgeSpan.classes()).toContain("badge--md");
    expect(badgeSpan.classes()).toContain("badge--primary");
    expect(badgeSpan.classes()).toContain("badge--top-right");
  });

  it("applies 'badge--accent' with color='accent'", () => {
    const wrapper = mount(Badge, { props: { color: "accent" } });
    expect(wrapper.find(".badge").classes()).toContain("badge--accent");
  });

  it("applies 'badge--danger' with color='danger'", () => {
    const wrapper = mount(Badge, { props: { color: "danger" } });
    expect(wrapper.find(".badge").classes()).toContain("badge--danger");
  });

  it("applies 'badge--success' with color='success'", () => {
    const wrapper = mount(Badge, { props: { color: "success" } });
    expect(wrapper.find(".badge").classes()).toContain("badge--success");
  });

  it("applies 'badge--warning' with color='warning'", () => {
    const wrapper = mount(Badge, { props: { color: "warning" } });
    expect(wrapper.find(".badge").classes()).toContain("badge--warning");
  });

  it("applies 'badge--sm' with size='sm'", () => {
    const wrapper = mount(Badge, { props: { size: "sm" } });
    expect(wrapper.find(".badge").classes()).toContain("badge--sm");
  });

  it("applies 'badge--lg' with size='lg'", () => {
    const wrapper = mount(Badge, { props: { size: "lg" } });
    expect(wrapper.find(".badge").classes()).toContain("badge--lg");
  });

  it("applies 'badge--secondary' with variant='secondary'", () => {
    const wrapper = mount(Badge, { props: { variant: "secondary" } });
    expect(wrapper.find(".badge").classes()).toContain("badge--secondary");
  });

  it("applies 'badge--soft' with variant='soft'", () => {
    const wrapper = mount(Badge, { props: { variant: "soft" } });
    expect(wrapper.find(".badge").classes()).toContain("badge--soft");
  });

  it("applies 'badge--top-left' with placement='top-left'", () => {
    const wrapper = mount(Badge, { props: { placement: "top-left" } });
    expect(wrapper.find(".badge").classes()).toContain("badge--top-left");
  });

  it("applies 'badge--bottom-right' with placement='bottom-right'", () => {
    const wrapper = mount(Badge, { props: { placement: "bottom-right" } });
    expect(wrapper.find(".badge").classes()).toContain("badge--bottom-right");
  });

  it("applies 'badge--bottom-left' with placement='bottom-left'", () => {
    const wrapper = mount(Badge, { props: { placement: "bottom-left" } });
    expect(wrapper.find(".badge").classes()).toContain("badge--bottom-left");
  });

  it("renders default slot content (anchored element) inside anchor div", () => {
    const wrapper = mount(Badge, {
      slots: { default: "<button>Button</button>" },
    });
    expect(wrapper.find("button").exists()).toBe(true);
  });

  it("renders named 'label' slot inside badge label span", () => {
    const wrapper = mount(Badge, {
      slots: { label: "5" },
    });
    const labelSpan = wrapper.find(".badge__label");
    expect(labelSpan.exists()).toBe(true);
    expect(labelSpan.text()).toBe("5");
  });

  it("merges consumer class prop with base slot class", () => {
    const wrapper = mount(Badge, { props: { class: "custom-badge" } });
    const badgeSpan = wrapper.find(".badge");
    expect(badgeSpan.classes()).toContain("badge");
    expect(badgeSpan.classes()).toContain("custom-badge");
  });

  it("passes axe audit with zero violations", async () => {
    const wrapper = mount(Badge, {
      slots: {
        default: '<button aria-label="Profile">Profile</button>',
        label: "3",
      },
      attachTo: document.body,
    });
    const results = await axe.run(wrapper.element);
    expect(results).toHaveNoViolations();
    wrapper.unmount();
  });
});
