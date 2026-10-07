import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import axe from "axe-core";
import { Checkbox } from "../Checkbox";
import { Switch } from "../../switch/Switch";
import { NumberField } from "../../number-field/NumberField";

describe.each([
  ["Checkbox", Checkbox, '[role="checkbox"], input[type="checkbox"]'],
  ["Switch", Switch, '[role="switch"], input[type="checkbox"]'],
] as const)("%s errorMessage", (_name, Comp, controlSel) => {
  it("renders the message when invalid and links it with aria-describedby", () => {
    const { container } = render(<Comp isInvalid errorMessage="You must accept">Accept terms</Comp>);
    const msg = container.querySelector('[data-slot="error-message"]');
    expect(msg?.textContent).toBe("You must accept");
    const control = container.querySelector(controlSel)!;
    expect(control.getAttribute("aria-describedby")).toContain(msg!.id);
  });

  it("hides the message while valid and leaks no attribute", () => {
    const { container } = render(<Comp errorMessage="Nope">Label</Comp>);
    expect(container.querySelector('[data-slot="error-message"]')).toBeNull();
    expect(container.innerHTML).not.toMatch(/errormessage=/i);
  });

  it("passes axe with an error shown", async () => {
    const { container } = render(<Comp isInvalid errorMessage="You must accept">Accept terms</Comp>);
    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});

describe("NumberField description / errorMessage", () => {
  it("renders the description and links it to the input", () => {
    const { container } = render(<NumberField label="Seats" description="Max 10" />);
    const desc = container.querySelector('[data-slot="description"]')!;
    expect(desc.textContent).toBe("Max 10");
    expect(container.querySelector("input")!.getAttribute("aria-describedby")).toContain(desc.id);
  });

  it("shows the error instead of the description when invalid", () => {
    const { container } = render(<NumberField label="Seats" description="Max 10" isInvalid errorMessage="Too many" />);
    expect(container.querySelector('[data-slot="description"]')).toBeNull();
    const err = container.querySelector('[data-slot="error-message"]')!;
    expect(err.textContent).toBe("Too many");
    expect(container.querySelector("input")!.getAttribute("aria-describedby")).toContain(err.id);
  });
});
