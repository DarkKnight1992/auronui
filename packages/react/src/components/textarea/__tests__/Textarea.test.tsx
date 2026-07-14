import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Textarea } from "../Textarea";

describe("Textarea", () => {
  it("renders with a label and wires aria-describedby to the error message", () => {
    render(<Textarea label="Bio" isInvalid errorMessage="Too short" description="Tell us about you" />);
    const textarea = screen.getByRole("textbox", { name: "Bio" });
    const error = screen.getByText("Too short");
    expect(textarea).toHaveAttribute("aria-describedby", error.id);
  });

  it("supports uncontrolled usage via defaultValue", async () => {
    render(<Textarea label="Bio" defaultValue="Hello" />);
    const textarea = screen.getByRole("textbox", { name: "Bio" }) as HTMLTextAreaElement;
    expect(textarea.value).toBe("Hello");
    await userEvent.type(textarea, " world");
    expect(textarea.value).toBe("Hello world");
  });

  it("shows a clear button when isClearable and filled, and clears on click", async () => {
    render(<Textarea label="Bio" defaultValue="Hello" isClearable />);
    const clearButton = screen.getByRole("button", { name: "Clear textarea" });
    await userEvent.click(clearButton);
    const textarea = screen.getByRole("textbox", { name: "Bio" }) as HTMLTextAreaElement;
    expect(textarea.value).toBe("");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Textarea label="Bio" description="Tell us about you" isRequired />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
