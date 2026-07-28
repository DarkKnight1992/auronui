import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Button } from "../Button";

describe("Button", () => {
  it("renders its label", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it('defaults type="button" so it never submits an ancestor form', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("an explicit type prop overrides the type=\"button\" default", () => {
    render(<Button type="submit">Save</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("does not force a type attr when rendered as a non-button element", () => {
    const { container } = render(<Button as="a">Click me</Button>);
    expect(container.querySelector("a")).not.toHaveAttribute("type");
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("disables the button and blocks clicks when isDisabled", async () => {
    const onClick = vi.fn();
    render(
      <Button isDisabled onClick={onClick}>
        Click me
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders a spinner when isLoading", () => {
    const { container } = render(<Button isLoading>Click me</Button>);
    expect(container.querySelector('[data-slot="spinner"]')).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
