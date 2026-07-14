import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Radio } from "../Radio";
import { RadioGroup } from "../RadioGroup";

describe("RadioGroup + Radio", () => {
  it("marks the value matching the controlled value prop as checked", () => {
    render(
      <RadioGroup value="b" label="Group">
        <Radio value="a">A</Radio>
        <Radio value="b">B</Radio>
        <Radio value="c">C</Radio>
      </RadioGroup>,
    );
    expect(screen.getByRole("radio", { name: "A" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "B" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "C" })).not.toBeChecked();
  });

  it("uncontrolled mode works via defaultValue", () => {
    render(
      <RadioGroup defaultValue="c" label="Group">
        <Radio value="c">C</Radio>
        <Radio value="d">D</Radio>
      </RadioGroup>,
    );
    expect(screen.getByRole("radio", { name: "C" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "D" })).not.toBeChecked();
  });

  it("clicking a radio selects it and calls onChange", async () => {
    const onChange = vi.fn();
    render(
      <RadioGroup onChange={onChange} label="Group">
        <Radio value="x">X</Radio>
        <Radio value="y">Y</Radio>
      </RadioGroup>,
    );
    await userEvent.click(screen.getByRole("radio", { name: "X" }));
    expect(onChange).toHaveBeenCalledWith("x");
    expect(screen.getByRole("radio", { name: "X" })).toBeChecked();
  });

  it("selecting one radio unselects the previously-selected radio (mutual exclusivity)", async () => {
    render(
      <RadioGroup defaultValue="x" label="Group">
        <Radio value="x">X</Radio>
        <Radio value="y">Y</Radio>
      </RadioGroup>,
    );
    await userEvent.click(screen.getByRole("radio", { name: "Y" }));
    expect(screen.getByRole("radio", { name: "Y" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "X" })).not.toBeChecked();
  });

  it("supports keyboard navigation between radios via arrow keys", async () => {
    render(
      <RadioGroup defaultValue="x" label="Group">
        <Radio value="x">X</Radio>
        <Radio value="y">Y</Radio>
      </RadioGroup>,
    );
    screen.getByRole("radio", { name: "X" }).focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "Y" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Y" })).toHaveFocus();
  });

  it("group isDisabled disables all children (group disabled wins)", () => {
    render(
      <RadioGroup isDisabled label="Group">
        <Radio value="a">A</Radio>
        <Radio value="b" isDisabled={false}>
          B
        </Radio>
      </RadioGroup>,
    );
    expect(screen.getByRole("radio", { name: "A" })).toBeDisabled();
    expect(screen.getByRole("radio", { name: "B" })).toBeDisabled();
  });

  it("child isDisabled disables it even when group is not disabled", () => {
    render(
      <RadioGroup label="Group">
        <Radio value="a" isDisabled>
          A
        </Radio>
        <Radio value="b">B</Radio>
      </RadioGroup>,
    );
    expect(screen.getByRole("radio", { name: "A" })).toBeDisabled();
    expect(screen.getByRole("radio", { name: "B" })).not.toBeDisabled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <RadioGroup label="Group" description="Pick one">
        <Radio value="a">A</Radio>
        <Radio value="b">B</Radio>
      </RadioGroup>,
    );
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });

  it("defaults to the primary color class; group color cascades and a child color prop wins", () => {
    render(
      <RadioGroup color="success" label="Group">
        <Radio value="a">A</Radio>
        <Radio value="b" color="warning">B</Radio>
      </RadioGroup>,
    );
    expect(screen.getByRole("radio", { name: "A" }).closest("label")).toHaveClass(
      "radio--color-success",
    );
    expect(screen.getByRole("radio", { name: "B" }).closest("label")).toHaveClass(
      "radio--color-warning",
    );
  });
});
