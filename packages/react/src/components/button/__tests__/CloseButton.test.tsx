import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { CloseButton } from "../CloseButton";

describe("CloseButton", () => {
  it("renders with a default 'Close' accessible name", () => {
    render(<CloseButton />);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("supports a custom aria-label", () => {
    render(<CloseButton aria-label="Dismiss dialog" />);
    expect(screen.getByRole("button", { name: "Dismiss dialog" })).toBeInTheDocument();
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    render(<CloseButton onClick={onClick} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("disables the button and blocks clicks when isDisabled", async () => {
    const onClick = vi.fn();
    render(<CloseButton isDisabled onClick={onClick} />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders a spinner when isLoading", () => {
    const { container } = render(<CloseButton isLoading />);
    expect(container.querySelector('[data-slot="spinner"]')).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<CloseButton />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
