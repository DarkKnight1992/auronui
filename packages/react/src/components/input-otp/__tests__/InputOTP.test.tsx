import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { InputOTP } from "../InputOTP";

describe("InputOTP", () => {
  it("renders `length` segment inputs (default 6)", () => {
    render(<InputOTP aria-label="One-time password" />);
    expect(screen.getAllByRole("textbox")).toHaveLength(6);
  });

  it("renders 4 segments when length=4", () => {
    render(<InputOTP length={4} aria-label="One-time password" />);
    expect(screen.getAllByRole("textbox")).toHaveLength(4);
  });

  it("typing a digit advances focus to the next segment and calls onValueChange", async () => {
    const onValueChange = vi.fn();
    render(<InputOTP length={4} aria-label="One-time password" onValueChange={onValueChange} />);
    const inputs = screen.getAllByRole("textbox");
    await userEvent.type(inputs[0]!, "1");

    expect(onValueChange).toHaveBeenCalledWith("1");
    expect(inputs[1]).toHaveFocus();
  });

  it("typing the full code calls onComplete with the joined string", async () => {
    const onComplete = vi.fn();
    render(<InputOTP length={4} aria-label="One-time password" onComplete={onComplete} />);
    const inputs = screen.getAllByRole("textbox");
    await userEvent.type(inputs[0]!, "1");
    await userEvent.type(inputs[1]!, "2");
    await userEvent.type(inputs[2]!, "3");
    await userEvent.type(inputs[3]!, "4");

    expect(onComplete).toHaveBeenCalledWith("1234");
  });

  it("backspace on an empty segment moves focus to and clears the previous segment", async () => {
    render(<InputOTP length={4} aria-label="One-time password" defaultValue="12" />);
    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    inputs[2]!.focus();
    await userEvent.keyboard("{Backspace}");

    expect(inputs[1]).toHaveFocus();
    expect(inputs[1]!.value).toBe("");
  });

  it("pasting a full code fills every segment", async () => {
    const onComplete = vi.fn();
    render(<InputOTP length={4} aria-label="One-time password" onComplete={onComplete} />);
    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    inputs[0]!.focus();
    await userEvent.paste("1234");

    expect(onComplete).toHaveBeenCalledWith("1234");
  });

  it("isDisabled disables every segment", () => {
    render(<InputOTP length={4} aria-label="One-time password" isDisabled />);
    for (const input of screen.getAllByRole("textbox")) {
      expect(input).toBeDisabled();
    }
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<InputOTP aria-label="One-time password" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
