import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { NumberField } from "../NumberField";

describe("NumberField", () => {
  it("renders a labeled numeric input with stepper buttons", () => {
    render(<NumberField label="Quantity" defaultValue={1} />);
    expect(screen.getByRole("textbox", { name: "Quantity" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /increase/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /decrease/i })).toBeInTheDocument();
  });

  it("increments and decrements the value via the stepper buttons", async () => {
    render(<NumberField label="Quantity" defaultValue={1} />);
    const input = screen.getByRole("textbox", { name: "Quantity" }) as HTMLInputElement;
    await userEvent.click(screen.getByRole("button", { name: /increase/i }));
    expect(input.value).toBe("2");
    await userEvent.click(screen.getByRole("button", { name: /decrease/i }));
    await userEvent.click(screen.getByRole("button", { name: /decrease/i }));
    expect(input.value).toBe("0");
  });

  it("disables the field when isDisabled", () => {
    render(<NumberField label="Quantity" defaultValue={1} isDisabled />);
    expect(screen.getByRole("textbox", { name: "Quantity" })).toBeDisabled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<NumberField label="Quantity" defaultValue={1} min={0} max={10} />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
