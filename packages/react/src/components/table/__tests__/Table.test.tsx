import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
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
    expect(onRowSelectionChange).toHaveBeenCalledWith({ 0: true });
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
