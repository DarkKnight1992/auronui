import { describe, expect, it, vi } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import type { ColumnDef } from "@tanstack/react-table";
import { Table } from "../Table";

interface Person {
  id: string;
  name: string;
  age: number;
}

const data: Person[] = [
  { id: "1", name: "Alice", age: 30 },
  { id: "2", name: "Bob", age: 25 },
  { id: "3", name: "Carol", age: 40 },
];

const columns: ColumnDef<Person, any>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "age", header: "Age" },
];

describe("Table", () => {
  it("renders header and row data", () => {
    render(<Table columns={columns} data={data} ariaLabel="People" />);
    expect(screen.getByRole("grid", { name: "People" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(4); // 1 header + 3 body rows
  });

  it("sorts a column when its header is clicked", async () => {
    render(<Table columns={columns} data={data} />);
    const nameHeader = screen.getByRole("columnheader", { name: "Name" });
    await userEvent.click(nameHeader);
    expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
  });

  it("supports multiple row selection with checkboxes", async () => {
    render(<Table columns={columns} data={data} selection="multiple" />);
    const checkboxes = screen.getAllByRole("checkbox");
    // 1 select-all header checkbox + 3 row checkboxes
    expect(checkboxes).toHaveLength(4);
    await userEvent.click(checkboxes[1]);
    expect(checkboxes[1]).toBeChecked();
  });

  it("calls onRowSelectionChange when a row checkbox is toggled", async () => {
    const onRowSelectionChange = vi.fn();
    render(
      <Table columns={columns} data={data} selection="multiple" onRowSelectionChange={onRowSelectionChange} />,
    );
    const checkboxes = screen.getAllByRole("checkbox");
    await userEvent.click(checkboxes[1]);
    // Table derives a stable row id from the row's own `id` field (getRowId),
    // not the array index — the first data row (Alice) has id "1".
    expect(onRowSelectionChange).toHaveBeenCalledWith({ 1: true });
  });

  it("selection survives a row being removed from `data` (stable getRowId, not index)", () => {
    // Regression test: previously TanStack fell back to index-based row ids,
    // so removing a row shifted every subsequent row's "id" and desynced
    // selection from the underlying data. Now selection is keyed by each
    // row's own `id` field and follows the row across removals.
    const onRowSelectionChange = vi.fn();
    const { rerender } = render(
      <Table
        columns={columns}
        data={data}
        selection="multiple"
        rowSelection={{ "3": true }}
        onRowSelectionChange={onRowSelectionChange}
      />,
    );
    // Carol (id "3", row index 2) is selected
    let rows = screen.getAllByRole("row");
    expect(rows[3]).toHaveAttribute("data-state", "checked"); // header row + 3 body rows

    // Remove Alice (id "1") — Carol shifts from index 2 to index 1
    const dataWithoutAlice = data.filter((p) => p.id !== "1");
    rerender(
      <Table
        columns={columns}
        data={dataWithoutAlice}
        selection="multiple"
        rowSelection={{ "3": true }}
        onRowSelectionChange={onRowSelectionChange}
      />,
    );
    rows = screen.getAllByRole("row");
    // Bob (id "2") is now first, Carol (id "3") is now second — Carol is still checked
    expect(within(rows[1]).getByText("Bob")).toBeInTheDocument();
    expect(rows[1]).not.toHaveAttribute("data-state", "checked");
    expect(within(rows[2]).getByText("Carol")).toBeInTheDocument();
    expect(rows[2]).toHaveAttribute("data-state", "checked");
  });

  it("header select-all only selects rows on the current page, not the whole dataset", async () => {
    // Regression test: TableCheckboxCell previously called
    // getIsAllRowsSelected/toggleAllRowsSelected, which operate on the whole
    // filtered dataset regardless of pagination — "select all" would
    // silently select rows on pages the user never saw.
    const onRowSelectionChange = vi.fn();
    const manyRows = Array.from({ length: 10 }, (_, i) => ({ id: String(i), name: `Row ${i}`, age: 20 + i }));
    render(
      <Table
        columns={columns}
        data={manyRows}
        selection="multiple"
        pagination={{ pageSize: 3 }}
        onRowSelectionChange={onRowSelectionChange}
      />,
    );
    const checkboxes = screen.getAllByRole("checkbox");
    await userEvent.click(checkboxes[0]); // header select-all
    const lastCall = onRowSelectionChange.mock.calls[onRowSelectionChange.mock.calls.length - 1][0];
    const selectedIds = Object.keys(lastCall).filter((k) => lastCall[k]);
    expect(selectedIds.sort()).toEqual(["0", "1", "2"]);
  });

  it("clicking a cell directly syncs the roving tabindex, so a subsequent arrow key moves from the actually-focused cell", async () => {
    // Regression test: onCellFocus previously existed in useTableKeyboardNav
    // but was never bound to any cell's focus event, so clicking a cell
    // directly left the tracked activeCell stale — the next arrow key would
    // jump from a stale position instead of the cell the user actually
    // clicked into.
    render(<Table columns={columns} data={data} ariaLabel="People" />);
    const grid = screen.getByRole("grid", { name: "People" });
    const cells = within(grid).getAllByRole("gridcell");
    // 2 columns x 3 rows; cell index 3 = row 1, col 1 (Bob's age)
    const targetCell = cells[3];
    act(() => {
      targetCell.focus();
    });
    expect(targetCell).toHaveAttribute("tabindex", "0");
    expect(cells[0]).toHaveAttribute("tabindex", "-1");

    await userEvent.keyboard("{ArrowDown}");

    // Nav should move from (1,1) -> (2,1), the cell actually focused, not
    // from a stale tracked position (which, before the fix, would still
    // have been null/(0,0), moving to (1,0) instead).
    expect(cells[5]).toHaveAttribute("tabindex", "0");
    expect(targetCell).toHaveAttribute("tabindex", "-1");
  });

  it("navigates cells with arrow keys (roving tabindex)", async () => {
    render(<Table columns={columns} data={data} ariaLabel="People" />);
    const grid = screen.getByRole("grid", { name: "People" });
    const firstCell = within(grid).getAllByRole("gridcell")[0];
    firstCell.focus();
    await userEvent.keyboard("{ArrowDown}");
    const cells = within(grid).getAllByRole("gridcell");
    // second row, first column cell should now be the roving-tabindex target
    expect(cells[2]).toHaveAttribute("tabindex", "0");
  });

  it("renders a built-in pager when pagination is enabled", () => {
    render(<Table columns={columns} data={data} pagination={{ pageSize: 2 }} />);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    // Only 2 of the 3 rows should render on page 1
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.queryByText("Carol")).not.toBeInTheDocument();
  });

  it("virtualizes rows when virtualRows is true (structure check only)", () => {
    const { container } = render(<Table columns={columns} data={data} virtualRows />);
    // jsdom reports zero viewport size, so @tanstack/react-virtual renders 0
    // virtual items — this asserts the virtualized <tbody> path is wired up
    // (no crash, correct scroll-container styling) rather than exact row counts.
    const scrollContainer = container.querySelector(".table__scroll-container") as HTMLElement;
    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer.style.overflow).toBe("auto");
    expect(container.querySelector("tbody")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Table columns={columns} data={data} ariaLabel="People" />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
