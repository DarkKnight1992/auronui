import { describe, it, expect } from "vitest";
import { dataAttr } from "../dataAttr";

describe("dataAttr", () => {
  it("returns string 'true' for true", () => {
    expect(dataAttr(true)).toBe("true");
  });

  it("returns undefined for false", () => {
    expect(dataAttr(false)).toBeUndefined();
  });

  it("returns undefined for undefined", () => {
    expect(dataAttr(undefined)).toBeUndefined();
  });

  it("returns 'true' for truthy value (1)", () => {
    // Cast truthy number to boolean context
    expect(dataAttr(1 as unknown as boolean)).toBe("true");
  });

  it("returns undefined for falsy value (0)", () => {
    expect(dataAttr(0 as unknown as boolean)).toBeUndefined();
  });

  it("return type is string 'true', not boolean true", () => {
    const result = dataAttr(true);
    expect(typeof result).toBe("string");
    expect(result).not.toBe(true);
  });
});
