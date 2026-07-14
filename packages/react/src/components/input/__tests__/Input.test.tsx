import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Input } from "../Input";

describe("Input", () => {
  it("renders with a label and wires aria-describedby to the error message", () => {
    render(<Input label="Email" isInvalid errorMessage="Required" description="Your email" />);
    const input = screen.getByRole("textbox", { name: "Email" });
    const error = screen.getByText("Required");
    expect(input).toHaveAttribute("aria-describedby", error.id);
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("wires aria-describedby to the description when not invalid", () => {
    render(<Input label="Email" description="Your email" />);
    const input = screen.getByRole("textbox", { name: "Email" });
    const description = screen.getByText("Your email");
    expect(input).toHaveAttribute("aria-describedby", description.id);
  });

  it("supports uncontrolled usage via defaultValue", async () => {
    render(<Input label="Name" defaultValue="Ada" />);
    const input = screen.getByRole("textbox", { name: "Name" }) as HTMLInputElement;
    expect(input.value).toBe("Ada");
    await userEvent.type(input, " Lovelace");
    expect(input.value).toBe("Ada Lovelace");
  });

  it("supports controlled usage via value + onChange", async () => {
    const onChange = vi.fn();
    render(<Input label="Name" value="Ada" onChange={onChange} />);
    const input = screen.getByRole("textbox", { name: "Name" }) as HTMLInputElement;
    await userEvent.type(input, "x");
    expect(onChange).toHaveBeenCalled();
  });

  it("shows a clear button when isClearable and filled, and clears on click", async () => {
    render(<Input label="Name" defaultValue="Ada" isClearable />);
    const clearButton = screen.getByRole("button", { name: "Clear input" });
    await userEvent.click(clearButton);
    const input = screen.getByRole("textbox", { name: "Name" }) as HTMLInputElement;
    expect(input.value).toBe("");
  });

  it("disables the input when isDisabled", () => {
    render(<Input label="Name" isDisabled />);
    expect(screen.getByRole("textbox", { name: "Name" })).toBeDisabled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Input label="Email" description="We'll never share it" isRequired />,
    );
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
