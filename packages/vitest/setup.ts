import { expect } from "vitest";
import axeMatchers from "@chialab/vitest-axe";
import axe from "axe-core";

expect.extend(axeMatchers);

// Disable color-contrast globally — jsdom cannot compute styles or render canvas,
// so axe's color-contrast check always throws in the test environment.
axe.configure({ rules: [{ id: "color-contrast", enabled: false }] });

// jsdom lacks scrollIntoView — Reka UI's Listbox calls it during selection.
if (typeof Element !== "undefined" && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
