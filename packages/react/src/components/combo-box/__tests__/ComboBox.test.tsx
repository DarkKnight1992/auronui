import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { ComboBox } from "../ComboBox";

const items = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

describe("ComboBox", () => {
  it("renders an input with a placeholder", () => {
    render(<ComboBox items={items} placeholder="Search fruit" label="Fruit" />);
    expect(screen.getByRole("combobox")).toHaveAttribute("placeholder", "Search fruit");
  });

  it("opens and selects an item via click", async () => {
    const onValueChange = vi.fn();
    render(<ComboBox items={items} label="Fruit" onValueChange={onValueChange} />);
    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    await userEvent.keyboard("{ArrowDown}");
    const option = await screen.findByRole("option", { name: "Banana" });
    await userEvent.click(option);
    expect(onValueChange).toHaveBeenCalledWith("banana");
    expect(input).toHaveValue("Banana");
  });

  it("selects an item via keyboard", async () => {
    const onValueChange = vi.fn();
    render(<ComboBox items={items} label="Fruit" onValueChange={onValueChange} />);
    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("apple");
  });

  it("filters items as the user types", async () => {
    render(<ComboBox items={items} label="Fruit" />);
    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    await userEvent.type(input, "ban");
    expect(await screen.findByRole("option", { name: "Banana" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Apple" })).not.toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ComboBox items={items} label="Fruit" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
