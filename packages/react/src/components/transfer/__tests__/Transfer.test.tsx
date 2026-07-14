import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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
});
