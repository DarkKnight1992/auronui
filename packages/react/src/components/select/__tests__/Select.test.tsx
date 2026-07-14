import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Select } from "../Select";

const items = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

describe("Select", () => {
  it("renders a trigger with a placeholder", () => {
    render(<Select aria-label="Fruit" items={items} placeholder="Pick a fruit" />);
    expect(screen.getByRole("button")).toHaveTextContent("Pick a fruit");
  });

  it("opens and selects an item via click", async () => {
    const onValueChange = vi.fn();
    render(<Select aria-label="Fruit" items={items} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button"));
    const option = await screen.findByRole("option", { name: "Banana" });
    await userEvent.click(option);
    expect(onValueChange).toHaveBeenCalledWith("banana");
  });

  it("opens and selects an item via keyboard", async () => {
    const onValueChange = vi.fn();
    render(<Select aria-label="Fruit" items={items} onValueChange={onValueChange} />);
    const trigger = screen.getByRole("button");
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("apple");
  });

  it("supports multiple selection with removable chips in the value", async () => {
    const onValueChange = vi.fn();
    render(<Select aria-label="Fruit" items={items} multiple onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button"));
    const option = await screen.findByRole("option", { name: "Apple" });
    await userEvent.click(option);
    expect(onValueChange).toHaveBeenCalledWith(["apple"]);
  });

  it("shows the error message when isInvalid", () => {
    render(<Select aria-label="Fruit" items={items} isInvalid errorMessage="Required" description="desc" />);
    expect(screen.getByText("Required")).toBeInTheDocument();
    expect(screen.queryByText("desc")).not.toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Select aria-label="Fruit" items={items} label="Fruit" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
