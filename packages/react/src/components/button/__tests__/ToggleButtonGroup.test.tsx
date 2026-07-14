import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { ToggleButton } from "../ToggleButton";
import { ToggleButtonGroup } from "../ToggleButtonGroup";

describe("ToggleButtonGroup", () => {
  it("renders its children toggle buttons", () => {
    render(
      <ToggleButtonGroup>
        <ToggleButton value="bold">Bold</ToggleButton>
        <ToggleButton value="italic">Italic</ToggleButton>
      </ToggleButtonGroup>,
    );
    expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Italic" })).toBeInTheDocument();
  });

  it("renders buttons from the shorthand `buttons` array", () => {
    render(
      <ToggleButtonGroup buttons={[{ value: "bold", label: "Bold" }, { value: "italic", label: "Italic" }]} />,
    );
    expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Italic" })).toBeInTheDocument();
  });

  it("multiple selection mode (default): allows several toggle buttons pressed simultaneously", async () => {
    render(
      <ToggleButtonGroup>
        <ToggleButton value="bold">Bold</ToggleButton>
        <ToggleButton value="italic">Italic</ToggleButton>
      </ToggleButtonGroup>,
    );
    const bold = screen.getByRole("button", { name: "Bold" });
    const italic = screen.getByRole("button", { name: "Italic" });

    await userEvent.click(bold);
    await userEvent.click(italic);
    expect(bold).toHaveAttribute("aria-pressed", "true");
    expect(italic).toHaveAttribute("aria-pressed", "true");
  });

  it("single selection mode: selecting a new button deselects the previous one", async () => {
    render(
      <ToggleButtonGroup selectionMode="single">
        <ToggleButton value="bold">Bold</ToggleButton>
        <ToggleButton value="italic">Italic</ToggleButton>
      </ToggleButtonGroup>,
    );
    const bold = screen.getByRole("button", { name: "Bold" });
    const italic = screen.getByRole("button", { name: "Italic" });

    await userEvent.click(bold);
    expect(bold).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(italic);
    expect(bold).toHaveAttribute("aria-pressed", "false");
    expect(italic).toHaveAttribute("aria-pressed", "true");
  });

  it("supports controlled value via onValueChange", async () => {
    const onValueChange = vi.fn();
    render(
      <ToggleButtonGroup selectionMode="multiple" value={[]} onValueChange={onValueChange}>
        <ToggleButton value="bold">Bold</ToggleButton>
      </ToggleButtonGroup>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Bold" }));
    expect(onValueChange).toHaveBeenCalledWith(["bold"]);
  });

  it("group disabled propagates to child toggle buttons", () => {
    render(
      <ToggleButtonGroup isDisabled>
        <ToggleButton value="bold">Bold</ToggleButton>
      </ToggleButtonGroup>,
    );
    expect(screen.getByRole("button", { name: "Bold" })).toBeDisabled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ToggleButtonGroup>
        <ToggleButton value="bold">Bold</ToggleButton>
        <ToggleButton value="italic">Italic</ToggleButton>
      </ToggleButtonGroup>,
    );
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
