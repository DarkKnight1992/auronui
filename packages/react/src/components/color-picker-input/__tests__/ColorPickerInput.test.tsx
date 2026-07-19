import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { ColorPickerInput } from "../ColorPickerInput";

describe("ColorPickerInput", () => {
  it("renders a hex input and a swatch trigger button", () => {
    render(<ColorPickerInput defaultValue="#ff0000" label="Accent color" />);
    expect(screen.getByLabelText("Accent color")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open color picker" })).toBeInTheDocument();
  });

  it("does not render the dropdown ColorPicker in the DOM when closed", () => {
    render(<ColorPickerInput defaultValue="#ff0000" label="Accent color" />);
    expect(screen.queryByLabelText("Hex color")).not.toBeInTheDocument();
  });

  it("clicking the swatch trigger opens the popover", async () => {
    render(<ColorPickerInput defaultValue="#ff0000" label="Accent color" />);
    await userEvent.click(screen.getByRole("button", { name: "Open color picker" }));
    expect(await screen.findByLabelText("Hex color")).toBeInTheDocument();
  });

  it("typing a new hex value in the trigger field updates the swatch color", async () => {
    render(<ColorPickerInput defaultValue="#ff0000" label="Accent color" />);
    const input = screen.getByLabelText("Accent color");
    await userEvent.clear(input);
    await userEvent.type(input, "#00ff00");
    const swatch = screen.getByRole("img");
    expect(swatch.getAttribute("aria-label")?.toLowerCase()).toBe("#00ff00");
  });

  it("editing the dropdown ColorPicker's hex field syncs the trigger field's displayed value", async () => {
    render(<ColorPickerInput defaultValue="#ff0000" label="Accent color" />);
    await userEvent.click(screen.getByRole("button", { name: "Open color picker" }));
    const dropdownInput = await screen.findByLabelText("Hex color");
    await userEvent.clear(dropdownInput);
    await userEvent.type(dropdownInput, "#00ff00");
    await userEvent.tab();
    await waitFor(() => expect(screen.getByLabelText("Accent color")).toHaveValue("#00FF00"));
  });

  it("isDisabled disables the trigger field input and the swatch button", () => {
    render(<ColorPickerInput defaultValue="#ff0000" label="Accent color" isDisabled />);
    expect(screen.getByLabelText("Accent color")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Open color picker" })).toBeDisabled();
  });

  it("supports controlled open state", async () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <ColorPickerInput defaultValue="#ff0000" label="Accent color" open={false} onOpenChange={onOpenChange} />,
    );
    expect(screen.queryByLabelText("Hex color")).not.toBeInTheDocument();

    rerender(<ColorPickerInput defaultValue="#ff0000" label="Accent color" open onOpenChange={onOpenChange} />);
    expect(await screen.findByLabelText("Hex color")).toBeInTheDocument();
  });

  it("has no accessibility violations, closed and open", async () => {
    const { container, rerender } = render(<ColorPickerInput defaultValue="#3b82f6" label="Accent color" />);
    expect(await axe.run(container)).toHaveNoViolations();

    rerender(<ColorPickerInput defaultValue="#3b82f6" label="Accent color" open />);
    await screen.findByLabelText("Hex color");
    expect(await axe.run(container)).toHaveNoViolations();
  });
});
