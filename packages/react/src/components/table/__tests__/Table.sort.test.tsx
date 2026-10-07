import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ColumnDef } from "@tanstack/react-table";
import { Table } from "../Table";

interface Person {
  id: string;
  name: string;
  age: number;
}

const data: Person[] = [
  { id: "1", name: "Charlie", age: 30 },
  { id: "2", name: "Alice", age: 25 },
  { id: "3", name: "Bob", age: 28 },
];

const sortableColumns: ColumnDef<Person, string | number>[] = [
  { id: "name", accessorKey: "name", header: "Name", enableSorting: true },
  { id: "age", accessorKey: "age", header: "Age", enableSorting: true },
];

function getCellText(container: HTMLElement, rowIndex: number, colIndex: number): string {
  return (
    container.querySelector(`tbody [data-row-index="${rowIndex}"][data-col-index="${colIndex}"]`)?.textContent ?? ""
  );
}

describe("Table — controlled / manual sorting", () => {
  it("fires onSortingChange when a sortable header is clicked", async () => {
    const onSortingChange = vi.fn();
    render(<Table columns={sortableColumns} data={data} onSortingChange={onSortingChange} />);
    await userEvent.click(screen.getByRole("columnheader", { name: "Name" }));
    expect(onSortingChange).toHaveBeenCalledWith([{ id: "name", desc: false }]);
  });

  it("reflects a controlled sorting prop in aria-sort and row order", () => {
    const { container, rerender } = render(
      <Table columns={sortableColumns} data={data} sorting={[{ id: "age", desc: true }]} />,
    );
    expect(screen.getByRole("columnheader", { name: "Age" })).toHaveAttribute("aria-sort", "descending");
    expect(getCellText(container, 0, 0)).toBe("Charlie");
    rerender(<Table columns={sortableColumns} data={data} sorting={[{ id: "name", desc: false }]} />);
    expect(getCellText(container, 0, 0)).toBe("Alice");
  });

  it("manualSorting leaves row order to the caller but still reports the sort", async () => {
    const onSortingChange = vi.fn();
    const { container } = render(
      <Table columns={sortableColumns} data={data} manualSorting onSortingChange={onSortingChange} />,
    );
    const nameHeader = screen.getByRole("columnheader", { name: "Name" });
    await userEvent.click(nameHeader);
    expect(onSortingChange).toHaveBeenCalledWith([{ id: "name", desc: false }]);
    expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
    // data order unchanged: Charlie, Alice, Bob
    expect(getCellText(container, 0, 0)).toBe("Charlie");
    expect(getCellText(container, 1, 0)).toBe("Alice");
  });
});
