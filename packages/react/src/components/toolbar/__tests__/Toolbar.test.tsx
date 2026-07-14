import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import {
  Toolbar,
  ToolbarButton,
  ToolbarLink,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from "../index";

describe("Toolbar", () => {
  it("renders horizontal toolbar with the base class", () => {
    const { container } = render(
      <Toolbar>
        <ToolbarButton>One</ToolbarButton>
      </Toolbar>,
    );
    expect(container.querySelector(".toolbar")).toBeInTheDocument();
    expect(container.querySelector(".toolbar--horizontal")).toBeInTheDocument();
  });

  it("vertical orientation applies toolbar--vertical", () => {
    const { container } = render(
      <Toolbar orientation="vertical">
        <ToolbarButton>One</ToolbarButton>
      </Toolbar>,
    );
    expect(container.querySelector(".toolbar--vertical")).toBeInTheDocument();
  });

  it("fires onClick on ToolbarButton", async () => {
    const onClick = vi.fn();
    render(
      <Toolbar>
        <ToolbarButton onClick={onClick}>Click me</ToolbarButton>
      </Toolbar>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Click me" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("toggles a single-select ToolbarToggleGroup item", async () => {
    render(
      <Toolbar>
        <ToolbarToggleGroup type="single">
          <ToolbarToggleItem value="bold" aria-label="Bold">
            B
          </ToolbarToggleItem>
          <ToolbarToggleItem value="italic" aria-label="Italic">
            I
          </ToolbarToggleItem>
        </ToolbarToggleGroup>
      </Toolbar>,
    );

    // Radix's single-select ToggleGroup renders items with role="radio" (radiogroup semantics).
    const bold = screen.getByRole("radio", { name: "Bold" });
    expect(bold).toHaveAttribute("aria-checked", "false");
    await userEvent.click(bold);
    expect(bold).toHaveAttribute("aria-checked", "true");
  });

  it("supports arrow-key navigation across toolbar controls", async () => {
    render(
      <Toolbar>
        <ToolbarButton aria-label="New">New</ToolbarButton>
        <ToolbarButton aria-label="Open">Open</ToolbarButton>
      </Toolbar>,
    );
    const first = screen.getByRole("button", { name: "New" });
    first.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Open" })).toHaveFocus();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Toolbar>
        <ToolbarButton aria-label="New">New</ToolbarButton>
        <ToolbarButton aria-label="Open">Open</ToolbarButton>
        <ToolbarSeparator />
        <ToolbarToggleGroup type="multiple">
          <ToolbarToggleItem value="bold" aria-label="Bold">
            B
          </ToolbarToggleItem>
          <ToolbarToggleItem value="italic" aria-label="Italic">
            I
          </ToolbarToggleItem>
        </ToolbarToggleGroup>
        <ToolbarSeparator />
        <ToolbarLink href="https://example.com">Docs</ToolbarLink>
      </Toolbar>,
    );
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
