import { expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import axeMatchers from "@chialab/vitest-axe";
import axe from "axe-core";

expect.extend(axeMatchers);

// jsdom cannot compute styles or render canvas, so axe's color-contrast check always throws.
axe.configure({ rules: [{ id: "color-contrast", enabled: false }] });

if (typeof Element !== "undefined" && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
