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
