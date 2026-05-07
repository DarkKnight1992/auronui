import { describe, it, expect } from "vitest";
import { mapPropsVariants } from "../mapPropsVariants";

describe("mapPropsVariants", () => {
  it("splits props into [rest, variants]", () => {
    const props = { size: "md", variant: "solid", disabled: true };
    const [rest, variants] = mapPropsVariants(props, ["size", "variant"]);
    expect(rest).toEqual({ disabled: true });
    expect(variants).toEqual({ size: "md", variant: "solid" });
  });

  it("returns full props with removeVariantProps=false", () => {
    const props = { size: "md", variant: "solid", disabled: true };
    const [rest, variants] = mapPropsVariants(props, ["size", "variant"], false);
    expect(rest).toEqual({ size: "md", variant: "solid", disabled: true });
    expect(variants).toEqual({ size: "md", variant: "solid" });
  });

  it("handles missing variant keys gracefully", () => {
    const props = { disabled: false };
    const [rest, variants] = mapPropsVariants(props, ["size", "variant"]);
    expect(rest).toEqual({ disabled: false });
    expect(variants).toEqual({});
  });

  it("returns empty rest when all props are variants", () => {
    const props = { size: "sm", color: "primary" };
    const [rest, variants] = mapPropsVariants(props, ["size", "color"]);
    expect(rest).toEqual({});
    expect(variants).toEqual({ size: "sm", color: "primary" });
  });

  it("handles empty props", () => {
    const [rest, variants] = mapPropsVariants({}, ["size"]);
    expect(rest).toEqual({});
    expect(variants).toEqual({});
  });

  it("handles empty variantKeys", () => {
    const props = { size: "md", disabled: true };
    const [rest, variants] = mapPropsVariants(props, []);
    expect(rest).toEqual({ size: "md", disabled: true });
    expect(variants).toEqual({});
  });
});
