import { describe, it, expect } from "vitest";
import { h, Fragment, defineComponent } from "vue";
import { hasSlotComponent } from "../hasSlotComponent";

const Marker = defineComponent({ name: "Marker", render: () => null });
const Other = defineComponent({ name: "Other", render: () => null });

describe("hasSlotComponent", () => {
  it("returns false for undefined nodes", () => {
    expect(hasSlotComponent(undefined, [Marker])).toBe(false);
  });

  it("returns false when no vnode matches", () => {
    expect(hasSlotComponent([h(Other)], [Marker])).toBe(false);
  });

  it("returns true for a direct matching vnode", () => {
    expect(hasSlotComponent([h(Marker)], [Marker])).toBe(true);
  });

  it("returns true when match is nested inside a Fragment (v-for output)", () => {
    const frag = h(Fragment, [h(Other), h(Marker)]);
    expect(hasSlotComponent([frag], [Marker])).toBe(true);
  });

  it("matches any of several target components", () => {
    expect(hasSlotComponent([h(Other)], [Marker, Other])).toBe(true);
  });

  it("ignores plain text vnodes", () => {
    expect(hasSlotComponent([h("span", "hi")], [Marker])).toBe(false);
  });
});
