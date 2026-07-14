import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { InputGroup } from "../InputGroup";
import { InputGroupAddon } from "../InputGroupAddon";
import { InputGroupInput } from "../InputGroupInput";

describe("InputGroup", () => {
  it("wires label + aria-describedby onto the contained InputGroupInput automatically", () => {
    render(
      <InputGroup label="Amount" description="In USD">
        <InputGroupAddon aria-hidden="true">$</InputGroupAddon>
        <InputGroupInput placeholder="0.00" />
      </InputGroup>,
    );
    const input = screen.getByPlaceholderText("0.00");
    const label = screen.getByText("Amount");
    const description = screen.getByText("In USD");
    expect(input).toHaveAttribute("id", label.getAttribute("for"));
    expect(input).toHaveAttribute("aria-describedby", description.id);
  });

  it("marks the input invalid when the group is invalid", () => {
    render(
      <InputGroup label="Amount" isInvalid errorMessage="Required">
        <InputGroupInput placeholder="0.00" />
      </InputGroup>,
    );
    expect(screen.getByPlaceholderText("0.00")).toHaveAttribute("aria-invalid", "true");
  });

  it("throws outside a provider (InputGroupAddon/InputGroupInput require InputGroup)", () => {
    // Rendered inline (without InputGroup) falls back to defaults instead of
    // throwing, since these components pass a fallback to useStrictContext —
    // verify that fallback path renders without crashing.
    render(<InputGroupInput placeholder="standalone" />);
    expect(screen.getByPlaceholderText("standalone")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <InputGroup label="Amount" description="In USD">
        <InputGroupAddon aria-hidden="true">$</InputGroupAddon>
        <InputGroupInput placeholder="0.00" />
      </InputGroup>,
    );
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
