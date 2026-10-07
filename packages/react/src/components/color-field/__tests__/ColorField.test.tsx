import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { ColorField } from "../ColorField";

describe("ColorField", () => {
  it("renders the initial color as hex text", () => {
    render(<ColorField defaultValue="#ff0000" label="Hex color" />);
    expect(screen.getByLabelText("Hex color")).toHaveValue("#FF0000");
  });

  it("fires onChange once a valid color is typed", async () => {
    const onChange = vi.fn();
    render(<ColorField defaultValue="#000000" label="Hex color" onChange={onChange} />);
    const input = screen.getByLabelText("Hex color");
    await userEvent.clear(input);
    await userEvent.type(input, "#00ff00");
    expect(onChange).toHaveBeenCalled();
  });

  it("shows an error message with role alert", () => {
    render(<ColorField defaultValue="#000000" label="Hex color" errorMessage="Invalid color" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid color");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ColorField defaultValue="#3b82f6" label="Hex color" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });

  it("does not render an end-content slot by default", () => {
    render(<ColorField defaultValue="#ff0000" label="Hex color" />);
    expect(screen.queryByTestId("end-content-marker")).not.toBeInTheDocument();
  });

  it("renders endContent inside the input wrapper", () => {
    render(
      <ColorField
        defaultValue="#ff0000"
        label="Hex color"
        endContent={<button data-testid="end-content-marker">Open</button>}
      />,
    );
    expect(screen.getByTestId("end-content-marker")).toBeInTheDocument();
  });

  it("applies classNames.inputWrapper and classNames.endContent overrides", () => {
    const { container } = render(
      <ColorField
        defaultValue="#ff0000"
        label="Hex color"
        endContent={<button>Open</button>}
        classNames={{ inputWrapper: "custom-wrapper", endContent: "custom-end" }}
      />,
    );
    expect(container.querySelector(".custom-wrapper")).not.toBeNull();
    expect(container.querySelector(".custom-end")).not.toBeNull();
  });
});

describe("ColorField — empty value", () => {
  it.each(["", null])("shows an empty input (and its placeholder) for a %j value", (v) => {
    render(<ColorField value={v} placeholder="No colour" label="Color" />);
    const input = screen.getByLabelText("Color") as HTMLInputElement;
    expect(input.value).toBe("");
    expect(input.placeholder).toBe("No colour");
  });

  it("stays empty after focus and blur without typing, and emits nothing", async () => {
    const onChange = vi.fn();
    render(<ColorField value="" onChange={onChange} label="Color" />);
    const input = screen.getByLabelText("Color") as HTMLInputElement;
    await userEvent.click(input);
    await userEvent.tab();
    expect(input.value).toBe("");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("reverts to empty (not black) when invalid text is blurred", async () => {
    const onChange = vi.fn();
    render(<ColorField value="" onChange={onChange} label="Color" />);
    const input = screen.getByLabelText("Color") as HTMLInputElement;
    await userEvent.type(input, "zz");
    await userEvent.tab();
    expect(input.value).toBe("");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("accepts a typed colour starting from empty", async () => {
    const onChange = vi.fn();
    render(<ColorField value="" onChange={onChange} label="Color" />);
    const input = screen.getByLabelText("Color") as HTMLInputElement;
    await userEvent.type(input, "#ff0000");
    await userEvent.tab();
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls.at(-1)![0].toString("hex")).toBe("#FF0000");
    expect(input.value.toLowerCase()).toBe("#ff0000");
  });
});
