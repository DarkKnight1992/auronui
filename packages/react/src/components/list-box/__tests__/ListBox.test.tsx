import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { ListBox } from "../ListBox";
import { ListBoxItem } from "../ListBoxItem";
import { ListBoxSection } from "../ListBoxSection";

describe("ListBox", () => {
  it("renders items from the shorthand items prop", () => {
    render(
      <ListBox
        aria-label="Fruits"
        items={[
          { value: "apple", label: "Apple" },
          { value: "banana", label: "Banana" },
        ]}
      />,
    );
    expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Banana" })).toBeInTheDocument();
  });

  it("renders compound ListBoxItem children", () => {
    render(
      <ListBox aria-label="Fruits">
        <ListBoxItem value="apple">Apple</ListBoxItem>
        <ListBoxItem value="banana">Banana</ListBoxItem>
      </ListBox>,
    );
    expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument();
  });

  it("selects an item on click and calls onSelectionChange", async () => {
    const onSelectionChange = vi.fn();
    render(
      <ListBox aria-label="Fruits" onSelectionChange={onSelectionChange}>
        <ListBoxItem value="apple">Apple</ListBoxItem>
        <ListBoxItem value="banana">Banana</ListBoxItem>
      </ListBox>,
    );
    await userEvent.click(screen.getByRole("option", { name: "Apple" }));
    expect(onSelectionChange).toHaveBeenCalledWith("apple");
    expect(screen.getByRole("option", { name: "Apple" })).toHaveAttribute("aria-selected", "true");
  });

  it("selects an item via keyboard", async () => {
    const onSelectionChange = vi.fn();
    render(
      <ListBox aria-label="Fruits" onSelectionChange={onSelectionChange}>
        <ListBoxItem value="apple">Apple</ListBoxItem>
        <ListBoxItem value="banana">Banana</ListBoxItem>
      </ListBox>,
    );
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(onSelectionChange).toHaveBeenCalledWith("apple");
  });

  it("supports multiple selection", async () => {
    const onSelectionChange = vi.fn();
    render(
      <ListBox aria-label="Fruits" selectionMode="multiple" onSelectionChange={onSelectionChange}>
        <ListBoxItem value="apple">Apple</ListBoxItem>
        <ListBoxItem value="banana">Banana</ListBoxItem>
      </ListBox>,
    );
    await userEvent.click(screen.getByRole("option", { name: "Apple" }));
    await userEvent.click(screen.getByRole("option", { name: "Banana" }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(expect.arrayContaining(["apple", "banana"]));
  });

  it("respects isDisabled on the ListBox", async () => {
    const onSelectionChange = vi.fn();
    render(
      <ListBox aria-label="Fruits" isDisabled onSelectionChange={onSelectionChange}>
        <ListBoxItem value="apple">Apple</ListBoxItem>
      </ListBox>,
    );
    await userEvent.click(screen.getByRole("option", { name: "Apple" }));
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("renders sections with a title", () => {
    render(
      <ListBox aria-label="Fruits">
        <ListBoxSection title="Citrus">
          <ListBoxItem value="orange">Orange</ListBoxItem>
        </ListBoxSection>
      </ListBox>,
    );
    expect(screen.getByText("Citrus")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Orange" })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ListBox aria-label="Fruits">
        <ListBoxItem value="apple">Apple</ListBoxItem>
        <ListBoxItem value="banana">Banana</ListBoxItem>
      </ListBox>,
    );
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});
