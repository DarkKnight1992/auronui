import { describe, it, expect } from "vitest";
import { composeClassName, cx } from "../composeClassName";

describe("composeClassName", () => {
  it("joins two simple classes", () => {
    expect(composeClassName("a", "b")).toBe("a b");
  });

  it("resolves Tailwind padding conflict", () => {
    // tailwind-merge: last one wins for same utility group
    expect(composeClassName("p-4", "p-2")).toBe("p-2");
  });

  it("ignores falsy values", () => {
    expect(composeClassName(undefined, null, false, "a")).toBe("a");
  });

  it("returns empty string with no arguments", () => {
    expect(composeClassName()).toBe("");
  });

  it("returns single class as-is", () => {
    expect(composeClassName("btn")).toBe("btn");
  });

  it("handles undefined only", () => {
    expect(composeClassName(undefined)).toBe("");
  });
});

describe("cx", () => {
  it("is exported and is a function", () => {
    expect(typeof cx).toBe("function");
  });

  it("joins classes", () => {
    const result = cx("a", "b");
    expect(result).toContain("a");
    expect(result).toContain("b");
  });
});
