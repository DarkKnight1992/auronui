import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Switch } from "../Switch";
import { SwitchGroup } from "../SwitchGroup";

describe("Switch (standalone)", () => {
  it("renders data-state=\"checked\" when isSelected=true", () => {
    render(<Switch isSelected aria-label="Enable notifications" />);
    expect(screen.getByRole("switch", { name: "Enable notifications" })).toHaveAttribute(
      "data-state",
      "checked",
    );
  });

  it("renders data-state=\"unchecked\" by default", () => {
    render(<Switch aria-label="Enable notifications" />);
    expect(screen.getByRole("switch", { name: "Enable notifications" })).toHaveAttribute(
      "data-state",
      "unchecked",
    );
  });

  it("toggles uncontrolled state on click and calls onChange", async () => {
    const onChange = vi.fn();
    render(<Switch defaultSelected={false} onChange={onChange} aria-label="Enable" />);
    const el = screen.getByRole("switch", { name: "Enable" });
    await userEvent.click(el);
    expect(el).toHaveAttribute("aria-checked", "true");
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("toggles via keyboard (Space)", async () => {
    render(<Switch defaultSelected={false} aria-label="Enable" />);
    const el = screen.getByRole("switch", { name: "Enable" });
    el.focus();
    await userEvent.keyboard(" ");
    expect(el).toHaveAttribute("aria-checked", "true");
  });

  it("disables the switch and blocks toggling when isDisabled", async () => {
    const onChange = vi.fn();
    render(<Switch isDisabled onChange={onChange} aria-label="Disabled switch" />);
    const el = screen.getByRole("switch", { name: "Disabled switch" });
    expect(el).toBeDisabled();
    await userEvent.click(el);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Switch aria-label="Enable notifications">Notifications</Switch>);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});

describe("SwitchGroup", () => {
  it("marks values from the controlled value prop as checked", () => {
    render(
      <SwitchGroup value={["a", "b"]} label="Group">
        <Switch value="a" aria-label="A" />
        <Switch value="b" aria-label="B" />
        <Switch value="c" aria-label="C" />
      </SwitchGroup>,
    );
    expect(screen.getByRole("switch", { name: "A" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("switch", { name: "B" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("switch", { name: "C" })).toHaveAttribute("aria-checked", "false");
  });

  it("clicking a child switch adds its value via onChange", async () => {
    const onChange = vi.fn();
    render(
      <SwitchGroup defaultValue={[]} onChange={onChange} label="Group">
        <Switch value="x" aria-label="X" />
      </SwitchGroup>,
    );
    await userEvent.click(screen.getByRole("switch", { name: "X" }));
    expect(onChange).toHaveBeenCalledWith(["x"]);
  });

  it("group isDisabled disables all children (group disabled wins)", () => {
    render(
      <SwitchGroup isDisabled label="Group">
        <Switch value="a" aria-label="A" />
        <Switch value="b" isDisabled={false} aria-label="B" />
      </SwitchGroup>,
    );
    expect(screen.getByRole("switch", { name: "A" })).toBeDisabled();
    expect(screen.getByRole("switch", { name: "B" })).toBeDisabled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <SwitchGroup label="Group" description="Pick some">
        <Switch value="a">A</Switch>
        <Switch value="b">B</Switch>
      </SwitchGroup>,
    );
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
