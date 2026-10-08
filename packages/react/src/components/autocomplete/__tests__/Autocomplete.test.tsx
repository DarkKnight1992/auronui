import { describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
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

// Flush pending microtasks/timers-free promise chains so an awaited loadItems settles.
async function flushPromises() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

describe("Autocomplete — lazy loadItems", () => {
  it("does not call loadItems on mount when nothing is selected", async () => {
    const loadItems = vi.fn().mockResolvedValue([]);
    render(<Autocomplete loadItems={loadItems} debounceMs={0} label="Async fruit" />);
    await flushPromises();
    expect(loadItems).not.toHaveBeenCalled();
  });

  it("loads once the dropdown opens", async () => {
    const loadItems = vi.fn().mockResolvedValue([{ value: "apple", label: "Apple" }]);
    render(<Autocomplete loadItems={loadItems} debounceMs={0} label="Async fruit" />);
    await flushPromises();
    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    await userEvent.keyboard("{ArrowDown}");
    await flushPromises();
    expect(loadItems).toHaveBeenCalledTimes(1);
    expect(loadItems).toHaveBeenCalledWith("");
    expect(await screen.findByRole("option", { name: "Apple" })).toBeInTheDocument();
  });

  it("loads on mount when a value is pre-selected (so its label can resolve)", async () => {
    const loadItems = vi.fn().mockResolvedValue([{ value: "apple", label: "Apple" }]);
    render(<Autocomplete loadItems={loadItems} debounceMs={0} value="apple" label="Async fruit" />);
    await flushPromises();
    expect(loadItems).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("combobox")).toHaveValue("Apple");
  });

  it("loads on mount in multiple mode when values are pre-selected", async () => {
    const loadItems = vi.fn().mockResolvedValue([{ value: "apple", label: "Apple" }]);
    render(<Autocomplete loadItems={loadItems} debounceMs={0} multiple value={["apple"]} label="Async fruit" />);
    await flushPromises();
    expect(loadItems).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Remove Apple" })).toBeInTheDocument();
  });

  it("loadOnMount forces an eager load", async () => {
    const loadItems = vi.fn().mockResolvedValue([]);
    render(<Autocomplete loadItems={loadItems} debounceMs={0} loadOnMount label="Async fruit" />);
    await flushPromises();
    expect(loadItems).toHaveBeenCalledTimes(1);
  });

  it("still loads as the user types", async () => {
    const loadItems = vi.fn().mockResolvedValue([]);
    render(<Autocomplete loadItems={loadItems} debounceMs={0} label="Async fruit" />);
    const input = screen.getByRole("combobox");
    await userEvent.type(input, "ap");
    await flushPromises();
    expect(loadItems).toHaveBeenLastCalledWith("ap");
  });
});

describe("Autocomplete — creatable (default chrome)", () => {
  function optionTexts() {
    return screen.queryAllByRole("option").map((o) => o.textContent?.trim());
  }

  it("offers a create item for unmatched text", async () => {
    render(<Autocomplete items={items} creatable label="Fruit" />);
    await userEvent.type(screen.getByRole("combobox"), "Carol");
    expect(optionTexts()).toContain('Create "Carol"');
  });

  it("selecting the create item sets the typed text as the value and fires onCreate", async () => {
    const onValueChange = vi.fn();
    const onCreate = vi.fn();
    render(<Autocomplete items={items} creatable label="Fruit" onValueChange={onValueChange} onCreate={onCreate} />);
    const input = screen.getByRole("combobox");
    await userEvent.type(input, "Carol");
    await userEvent.click(await screen.findByRole("option", { name: 'Create "Carol"' }));
    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onCreate).toHaveBeenCalledWith("Carol");
    expect(onValueChange).toHaveBeenLastCalledWith("Carol");
    expect(input).toHaveValue("Carol");
  });

  it("creates via the keyboard (ArrowDown + Enter)", async () => {
    const onValueChange = vi.fn();
    const onCreate = vi.fn();
    render(<Autocomplete items={items} creatable label="Fruit" onValueChange={onValueChange} onCreate={onCreate} />);
    const input = screen.getByRole("combobox");
    await userEvent.type(input, "Carol");
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onCreate).toHaveBeenCalledWith("Carol");
    expect(onValueChange).toHaveBeenLastCalledWith("Carol");
  });

  it("supports a custom createLabel", async () => {
    render(<Autocomplete items={items} creatable createLabel={(t) => `Add ${t}`} label="Fruit" />);
    await userEvent.type(screen.getByRole("combobox"), "Carol");
    expect(optionTexts()).toContain("Add Carol");
  });

  it("offers the create item in multiple mode too", async () => {
    const onValueChange = vi.fn();
    const onCreate = vi.fn();
    render(
      <Autocomplete items={items} creatable multiple label="Fruit" onValueChange={onValueChange} onCreate={onCreate} />,
    );
    await userEvent.type(screen.getByRole("combobox"), "Carol");
    await userEvent.click(await screen.findByRole("option", { name: 'Create "Carol"' }));
    expect(onCreate).toHaveBeenCalledWith("Carol");
    expect(onValueChange).toHaveBeenLastCalledWith(["Carol"]);
  });

  it("does not render a create item without creatable", async () => {
    render(<Autocomplete items={items} label="Fruit" />);
    await userEvent.type(screen.getByRole("combobox"), "Carol");
    expect(optionTexts().some((o) => o?.startsWith("Create"))).toBe(false);
  });
});

describe("Autocomplete — selected labels survive a narrowed loadItems result", () => {
  const all = [
    { value: "ap", label: "Apple" },
    { value: "bn", label: "Banana" },
    { value: "ch", label: "Cherry" },
  ];
  const loadItems = (q: string) =>
    Promise.resolve(all.filter((i) => i.label.toLowerCase().includes(q.toLowerCase())));

  it("multiple: chips keep their labels while the results no longer contain them", async () => {
    const { container } = render(
      <Autocomplete multiple value={["ap", "bn"]} loadItems={loadItems} debounceMs={0} label="Fruit" />,
    );
    const chipText = () =>
      [...container.querySelectorAll('[data-slot="selected-chip"]')].map((c) => c.textContent?.trim());
    await act(async () => {});
    expect(chipText()).toEqual(["Apple", "Banana"]);
    await userEvent.type(screen.getByRole("combobox"), "che");
    await act(async () => {});
    expect(chipText()).toEqual(["Apple", "Banana"]);
  });

  it("single: a value set from outside resolves to a label loaded earlier", async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Autocomplete value="ap" loadItems={loadItems} debounceMs={0} label="Fruit" onValueChange={onValueChange} />,
    );
    await act(async () => {});
    const input = screen.getByRole("combobox");
    // Search everything (Banana is loaded), then narrow to Cherry.
    await userEvent.clear(input);
    await act(async () => {});
    await userEvent.type(input, "che");
    await act(async () => {});
    rerender(
      <Autocomplete value="bn" loadItems={loadItems} debounceMs={0} label="Fruit" onValueChange={onValueChange} />,
    );
    await act(async () => {});
    expect(input).toHaveValue("Banana");
  });
});

describe("Autocomplete — value changes only on selection (single mode)", () => {
  it("typing does not change the value", async () => {
    const onValueChange = vi.fn();
    render(<Autocomplete items={items} label="Fruit" onValueChange={onValueChange} />);
    await userEvent.type(screen.getByRole("combobox"), "ban");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("clearing the input clears the value", async () => {
    const onValueChange = vi.fn();
    render(<Autocomplete items={items} defaultValue="banana" label="Fruit" onValueChange={onValueChange} />);
    await userEvent.clear(screen.getByRole("combobox"));
    expect(onValueChange).toHaveBeenLastCalledWith("");
  });

  it("emptying the input and leaving keeps it cleared", async () => {
    const onValueChange = vi.fn();
    render(<Autocomplete items={items} defaultValue="banana" label="Fruit" onValueChange={onValueChange} />);
    const input = screen.getByRole("combobox");
    await userEvent.clear(input);
    await userEvent.tab();
    expect(input).toHaveValue("");
    expect(onValueChange).toHaveBeenLastCalledWith("");
  });

  it("the clear button clears the value", async () => {
    const onValueChange = vi.fn();
    render(<Autocomplete items={items} defaultValue="banana" label="Fruit" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.getByRole("combobox")).toHaveValue("");
    expect(onValueChange).toHaveBeenLastCalledWith("");
  });

  it("unmatched text reverts to the selected label on blur", async () => {
    const onValueChange = vi.fn();
    render(<Autocomplete items={items} defaultValue="banana" label="Fruit" onValueChange={onValueChange} />);
    const input = screen.getByRole("combobox");
    await userEvent.type(input, "zz");
    await userEvent.tab();
    expect(input).toHaveValue("Banana");
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
