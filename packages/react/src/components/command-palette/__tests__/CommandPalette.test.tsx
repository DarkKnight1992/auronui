import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { CommandPalette, type CommandPaletteItemData } from "../CommandPalette";

const items: CommandPaletteItemData[] = [
  { value: "new-file", label: "New File" },
  { value: "open-file", label: "Open File" },
  { value: "close-tab", label: "Close Tab" },
];

describe("CommandPalette", () => {
  it("renders nothing when closed", () => {
    render(<CommandPalette items={items} defaultOpen={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the item list when open, and search input is auto-focused", async () => {
    render(<CommandPalette items={items} defaultOpen />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("New File")).toBeInTheDocument();
    expect(await screen.findByRole("combobox")).toHaveFocus();
  });

  it("typing filters the list without losing focus from the search input", async () => {
    render(<CommandPalette items={items} defaultOpen />);
    const search = screen.getByRole("combobox");
    await userEvent.type(search, "open");
    expect(screen.getByText("Open File")).toBeInTheDocument();
    expect(screen.queryByText("New File")).not.toBeInTheDocument();
    expect(search).toHaveFocus();
  });

  it("ArrowDown then Enter selects the second item without ever moving focus off the search input", async () => {
    const onSelect = vi.fn();
    render(<CommandPalette items={items} defaultOpen onSelect={onSelect} />);
    const search = screen.getByRole("combobox");
    await vi.waitFor(() => expect(search).toHaveFocus());
    await userEvent.keyboard("{ArrowDown}");
    expect(search).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledWith(items[1]);
  });

  it("keeps the visually highlighted row and the Enter-selected row in sync when items interleave across groups", async () => {
    const groupedInterleaved: CommandPaletteItemData[] = [
      { value: "a", label: "Alpha", group: "G1" },
      { value: "b", label: "Bravo", group: "G2" },
      { value: "c", label: "Charlie", group: "G1" },
    ];
    const onSelect = vi.fn();
    render(<CommandPalette items={groupedInterleaved} defaultOpen onSelect={onSelect} />);
    const search = screen.getByRole("combobox");
    await vi.waitFor(() => expect(search).toHaveFocus());

    // Grouped render order is Alpha, Charlie (both G1), then Bravo (G2) —
    // different from the raw item order (Alpha, Bravo, Charlie). One
    // ArrowDown should visually highlight Charlie, not Bravo.
    await userEvent.keyboard("{ArrowDown}");
    const activeId = search.getAttribute("aria-activedescendant");
    expect(activeId).toBe("command-palette-item-c");
    const highlighted = document.getElementById(activeId!);
    expect(highlighted).toHaveAttribute("data-active", "true");

    await userEvent.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledTimes(1);
    const selectedItem = onSelect.mock.calls[0]![0] as CommandPaletteItemData;
    // The item Enter actually selected must be the same one that was
    // visually highlighted, regardless of grouping.
    expect(`command-palette-item-${selectedItem.value}`).toBe(activeId);
    expect(selectedItem.value).toBe("c");
  });

  it("closes on Escape", async () => {
    const onOpenChange = vi.fn();
    render(<CommandPalette items={items} defaultOpen onOpenChange={onOpenChange} />);
    await userEvent.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("has no accessibility violations", async () => {
    render(<CommandPalette items={items} defaultOpen />);
    const dialog = screen.getByRole("dialog");
    const results = await axe.run(dialog);
    expect(results).toHaveNoViolations();
  });
});
