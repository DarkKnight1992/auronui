import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { Label } from "../Label";

describe("Label", () => {
  it("renders a <label> element with base class", () => {
    render(<Label>My label</Label>);
    const el = screen.getByText("My label");
    expect(el.tagName).toBe("LABEL");
    expect(el).toHaveClass("label");
  });

  it("applies modifier classes for isDisabled/isInvalid/isRequired", () => {
    render(
      <Label isDisabled isInvalid isRequired>
        Field
      </Label>,
    );
    const el = screen.getByText("Field");
    expect(el).toHaveClass("label--disabled");
    expect(el).toHaveClass("label--invalid");
    expect(el).toHaveClass("label--required");
  });

  it("binds htmlFor when 'for' prop-style htmlFor is provided", () => {
    render(<Label htmlFor="my-input">Email</Label>);
    expect(screen.getByText("Email")).toHaveAttribute("for", "my-input");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Label htmlFor="email">Email address</Label>);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
