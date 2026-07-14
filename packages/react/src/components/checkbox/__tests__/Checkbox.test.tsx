import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Checkbox } from "../Checkbox";
import { CheckboxGroup } from "../CheckboxGroup";

describe("Checkbox (standalone)", () => {
  it("renders data-state=\"checked\" when isSelected=true", () => {
    render(<Checkbox isSelected aria-label="Accept" />);
    const label = screen.getByRole("checkbox", { name: "Accept" }).closest("label");
    expect(label).toHaveAttribute("data-state", "checked");
  });

  it("renders data-state=\"unchecked\" when isSelected=false", () => {
    render(<Checkbox isSelected={false} aria-label="Accept" />);
    const label = screen.getByRole("checkbox", { name: "Accept" }).closest("label");
    expect(label).toHaveAttribute("data-state", "unchecked");
  });

  it("renders data-state=\"indeterminate\" when isIndeterminate=true", () => {
    render(<Checkbox isIndeterminate aria-label="Select all" />);
    const label = screen.getByRole("checkbox", { name: "Select all" }).closest("label");
    expect(label).toHaveAttribute("data-state", "indeterminate");
  });

  it("toggles uncontrolled state on click and calls onChange", async () => {
    const onChange = vi.fn();
    render(<Checkbox defaultSelected={false} onChange={onChange} aria-label="Accept" />);
    const input = screen.getByRole("checkbox", { name: "Accept" });
    await userEvent.click(input);
    expect(input).toBeChecked();
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("toggles via keyboard (Space)", async () => {
    render(<Checkbox defaultSelected={false} aria-label="Accept" />);
    const input = screen.getByRole("checkbox", { name: "Accept" });
    input.focus();
    await userEvent.keyboard(" ");
    expect(input).toBeChecked();
  });

  it("disables the input and blocks changes when isDisabled", async () => {
    const onChange = vi.fn();
    render(<Checkbox isDisabled onChange={onChange} aria-label="Accept" />);
    const input = screen.getByRole("checkbox", { name: "Accept" });
    expect(input).toBeDisabled();
    await userEvent.click(input);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Checkbox aria-label="Accept">Accept terms</Checkbox>);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });

  it("defaults to the primary color class and applies a color prop's class", () => {
    const { rerender } = render(<Checkbox isSelected aria-label="Accept" />);
    const label = screen.getByRole("checkbox", { name: "Accept" }).closest("label");
    expect(label).toHaveClass("checkbox--color-primary");

    rerender(<Checkbox isSelected color="danger" aria-label="Accept" />);
    expect(label).toHaveClass("checkbox--color-danger");
    expect(label).not.toHaveClass("checkbox--color-primary");
  });
});

describe("CheckboxGroup", () => {
  it("marks values from the controlled value prop as checked", () => {
    render(
      <CheckboxGroup value={["a", "b"]} label="Group">
        <Checkbox value="a" aria-label="A" />
        <Checkbox value="b" aria-label="B" />
        <Checkbox value="c" aria-label="C" />
      </CheckboxGroup>,
    );
    expect(screen.getByRole("checkbox", { name: "A" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "B" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "C" })).not.toBeChecked();
  });

  it("clicking a child checkbox adds its value via onChange", async () => {
    const onChange = vi.fn();
    render(
      <CheckboxGroup defaultValue={[]} onChange={onChange} label="Group">
        <Checkbox value="x" aria-label="X" />
      </CheckboxGroup>,
    );
    await userEvent.click(screen.getByRole("checkbox", { name: "X" }));
    expect(onChange).toHaveBeenCalledWith(["x"]);
  });

  it("group isDisabled disables all children (group disabled wins)", () => {
    render(
      <CheckboxGroup isDisabled label="Group">
        <Checkbox value="a" aria-label="A" />
        <Checkbox value="b" isDisabled={false} aria-label="B" />
      </CheckboxGroup>,
    );
    expect(screen.getByRole("checkbox", { name: "A" })).toBeDisabled();
    expect(screen.getByRole("checkbox", { name: "B" })).toBeDisabled();
  });

  it("child isDisabled disables it even when group is not disabled", () => {
    render(
      <CheckboxGroup label="Group">
        <Checkbox value="a" aria-label="A" isDisabled />
        <Checkbox value="b" aria-label="B" />
      </CheckboxGroup>,
    );
    expect(screen.getByRole("checkbox", { name: "A" })).toBeDisabled();
    expect(screen.getByRole("checkbox", { name: "B" })).not.toBeDisabled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <CheckboxGroup label="Group" description="Pick some">
        <Checkbox value="a">A</Checkbox>
        <Checkbox value="b">B</Checkbox>
      </CheckboxGroup>,
    );
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });

  it("group color cascades to children; a child color prop wins", () => {
    render(
      <CheckboxGroup color="success" label="Group">
        <Checkbox value="a" aria-label="A" />
        <Checkbox value="b" aria-label="B" color="warning" />
      </CheckboxGroup>,
    );
    expect(screen.getByRole("checkbox", { name: "A" }).closest("label")).toHaveClass(
      "checkbox--color-success",
    );
    expect(screen.getByRole("checkbox", { name: "B" }).closest("label")).toHaveClass(
      "checkbox--color-warning",
    );
  });
});
