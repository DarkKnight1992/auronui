import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Autocomplete } from "../Autocomplete";

const items = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

describe("Autocomplete", () => {
  it("renders an input with a placeholder", () => {
    render(<Autocomplete items={items} placeholder="Search fruit" label="Fruit" />);
    expect(screen.getByRole("combobox")).toHaveAttribute("placeholder", "Search fruit");
  });

  it("single mode: selects an item via click", async () => {
    const onValueChange = vi.fn();
    render(<Autocomplete items={items} label="Fruit" onValueChange={onValueChange} />);
    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    await userEvent.keyboard("{ArrowDown}");
    const option = await screen.findByRole("option", { name: "Banana" });
    await userEvent.click(option);
    expect(onValueChange).toHaveBeenCalledWith("banana");
    expect(input).toHaveValue("Banana");
  });

  it("single mode: selects an item via keyboard", async () => {
    const onValueChange = vi.fn();
    render(<Autocomplete items={items} label="Fruit" onValueChange={onValueChange} />);
    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("apple");
  });

  it("filters items as the user types", async () => {
    render(<Autocomplete items={items} label="Fruit" />);
    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    await userEvent.type(input, "ban");
    expect(await screen.findByRole("option", { name: "Banana" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Apple" })).not.toBeInTheDocument();
  });

  it("multiple mode: selects items and renders them as removable chips", async () => {
    const onValueChange = vi.fn();
    render(<Autocomplete items={items} label="Fruit" multiple onValueChange={onValueChange} />);
    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    await userEvent.keyboard("{ArrowDown}");
    const option = await screen.findByRole("option", { name: "Apple" });
    await userEvent.click(option);
    expect(onValueChange).toHaveBeenCalledWith(["apple"]);
  });

  it("multiple mode: removes a chip via its close button", async () => {
    const onValueChange = vi.fn();
    render(<Autocomplete items={items} label="Fruit" multiple value={["apple"]} onValueChange={onValueChange} />);
    const removeButton = screen.getByRole("button", { name: "Remove Apple" });
    await userEvent.click(removeButton);
    expect(onValueChange).toHaveBeenCalledWith([]);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Autocomplete items={items} label="Fruit" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
