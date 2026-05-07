import { describe, it, expect } from "vitest";
import { motion, AnimatePresence } from "../motion";

describe("motion barrel", () => {
  it("re-exports motion component factory", () => {
    expect(motion).toBeDefined();
    // motion-v exposes `motion` as a proxy / object of components (motion.div, motion.span, ...)
    expect(typeof motion).toMatch(/object|function/);
  });

  it("re-exports AnimatePresence", () => {
    expect(AnimatePresence).toBeDefined();
  });
});
