import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Transfer, type TransferItem } from "../Transfer";

const items: TransferItem[] = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
  { value: "c", label: "Gamma" },
];

describe("Transfer", () => {
  it("renders all items in the source panel initially", () => {
    render(<Transfer items={items} titles={["Available", "Selected"]} />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText("Gamma")).toBeInTheDocument();
  });

  it("checking an item and clicking move-right moves it to the target panel", async () => {
    const onValueChange = vi.fn();
    render(<Transfer items={items} titles={["Available", "Selected"]} onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole("option", { name: "Alpha" }));
    await userEvent.click(screen.getByRole("button", { name: /move selected to the right panel/i }));

    expect(onValueChange).toHaveBeenCalledWith(["a"]);
  });

  it("move-all-right moves every non-disabled source item", async () => {
    const onValueChange = vi.fn();
    render(<Transfer items={items} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: /move all to the right panel/i }));
    expect(onValueChange).toHaveBeenCalledWith(["a", "b", "c"]);
  });

  it("move-right button is disabled until an item is checked", () => {
    render(<Transfer items={items} />);
    expect(screen.getByRole("button", { name: /move selected to the right panel/i })).toBeDisabled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Transfer items={items} titles={["Available", "Selected"]} isSearchable />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });

  // ─── "Move all" respects the search filter ───────────────────────────
  // Regression: "Move all" used to operate on the full unfiltered
  // underlying array, so narrowing the source panel down to one visible
  // item and clicking move-all-right would move all 3 underlying items,
  // including 2 the user couldn't even see.

  it("move-all-right only moves the currently visible (filtered) source items, not filtered-out ones", async () => {
    const onValueChange = vi.fn();
    render(<Transfer items={items} titles={["Available", "Selected"]} onValueChange={onValueChange} isSearchable />);

    const sourceSearch = screen.getByRole("searchbox", { name: "Search Available" });
    await userEvent.type(sourceSearch, "Alpha");
    await userEvent.click(screen.getByRole("button", { name: /move all to the right panel/i }));

    expect(onValueChange).toHaveBeenCalledWith(["a"]);
  });

  it("move-all-right is disabled when the filtered source view is empty, even though unfiltered items exist", async () => {
    render(<Transfer items={items} titles={["Available", "Selected"]} isSearchable />);

    const sourceSearch = screen.getByRole("searchbox", { name: "Search Available" });
    await userEvent.type(sourceSearch, "no-such-item");

    expect(screen.getByRole("button", { name: /move all to the right panel/i })).toBeDisabled();
  });

  it("move-all-left only moves the currently visible (filtered) target items, not filtered-out ones", async () => {
    const onValueChange = vi.fn();
    render(
      <Transfer
        items={items}
        titles={["Available", "Selected"]}
        value={["a", "b", "c"]}
        onValueChange={onValueChange}
        isSearchable
      />,
    );

    const targetSearch = screen.getByRole("searchbox", { name: "Search Selected" });
    await userEvent.type(targetSearch, "Beta");
    await userEvent.click(screen.getByRole("button", { name: /move all to the left panel/i }));

    const [remaining] = onValueChange.mock.calls.at(-1)!;
    expect([...remaining].sort()).toEqual(["a", "c"]);
  });

  it("move-all-left is disabled when the filtered target view is empty, even though unfiltered items exist", async () => {
    render(<Transfer items={items} titles={["Available", "Selected"]} value={["a", "b", "c"]} isSearchable />);

    const targetSearch = screen.getByRole("searchbox", { name: "Search Selected" });
    await userEvent.type(targetSearch, "no-such-item");

    expect(screen.getByRole("button", { name: /move all to the left panel/i })).toBeDisabled();
  });

  // Regression: the drag/drop guards used `!draggedValue`/`!dropValue` truthy
  // checks instead of null/undefined checks, so an item whose value is the
  // falsy-but-valid empty string couldn't be dropped even though the same
  // item's checkbox+button move path worked fine for it.
  it("dragging and dropping an item whose value is an empty string still moves it", () => {
    const falsyItems: TransferItem[] = [{ value: "", label: "Falsy" }, ...items];
    const onValueChange = vi.fn();
    render(<Transfer items={falsyItems} onValueChange={onValueChange} />);

    const falsyOption = screen.getByRole("option", { name: "Falsy" });
    const targetBody = document.querySelector('[data-slot="transfer-target-body"]') as HTMLElement;

    const dataTransfer = { effectAllowed: "", dropEffect: "", setData: () => {} };

    const dragStartEvent = new Event("dragstart", { bubbles: true, cancelable: true }) as unknown as DragEvent;
    Object.defineProperty(dragStartEvent, "dataTransfer", { value: dataTransfer });
    act(() => {
      falsyOption.dispatchEvent(dragStartEvent);
    });

    const dropEvent = new Event("drop", { bubbles: true, cancelable: true }) as unknown as DragEvent;
    Object.defineProperty(dropEvent, "dataTransfer", { value: dataTransfer });
    act(() => {
      targetBody.dispatchEvent(dropEvent);
    });

    expect(onValueChange).toHaveBeenCalledWith([""]);
  });

  it("dragging and dropping a normal item still moves it (drag wiring sanity check)", () => {
    const onValueChange = vi.fn();
    render(<Transfer items={items} onValueChange={onValueChange} />);

    const option = screen.getByRole("option", { name: "Alpha" });
    const targetBody = document.querySelector('[data-slot="transfer-target-body"]') as HTMLElement;

    const dataTransfer = { effectAllowed: "", dropEffect: "", setData: () => {} };

    const dragStartEvent = new Event("dragstart", { bubbles: true, cancelable: true }) as unknown as DragEvent;
    Object.defineProperty(dragStartEvent, "dataTransfer", { value: dataTransfer });
    act(() => {
      option.dispatchEvent(dragStartEvent);
    });

    const dropEvent = new Event("drop", { bubbles: true, cancelable: true }) as unknown as DragEvent;
    Object.defineProperty(dropEvent, "dataTransfer", { value: dataTransfer });
    act(() => {
      targetBody.dispatchEvent(dropEvent);
    });

    expect(onValueChange).toHaveBeenCalledWith(["a"]);
  });
});
