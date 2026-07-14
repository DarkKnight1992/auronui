import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useListData } from "../useListData";

interface Fruit {
  id: string;
  name: string;
}

const fruits: Fruit[] = [
  { id: "apple", name: "Apple" },
  { id: "banana", name: "Banana" },
  { id: "cherry", name: "Cherry" },
];

describe("useListData", () => {
  it("initializes items and default selection", () => {
    const { result } = renderHook(() => useListData<Fruit>({ initialItems: fruits }));
    expect(result.current.items).toEqual(fruits);
    expect(result.current.selectedKeys).toEqual(new Set());
    expect(result.current.filterText).toBe("");
  });

  it("supports 'all' as the initial selection", () => {
    const { result } = renderHook(() =>
      useListData<Fruit>({ initialItems: fruits, initialSelectedKeys: "all" }),
    );
    expect(result.current.selectedKeys).toBe("all");
  });

  it("appends, prepends, and removes items", () => {
    const { result } = renderHook(() => useListData<Fruit>({ initialItems: fruits }));

    act(() => result.current.append({ id: "date", name: "Date" }));
    expect(result.current.items.map((f) => f.id)).toEqual(["apple", "banana", "cherry", "date"]);

    act(() => result.current.prepend({ id: "elderberry", name: "Elderberry" }));
    expect(result.current.items[0]?.id).toBe("elderberry");

    act(() => result.current.remove("apple", "banana"));
    expect(result.current.items.map((f) => f.id)).toEqual(["elderberry", "cherry", "date"]);
  });

  it("moves and updates an item", () => {
    const { result } = renderHook(() => useListData<Fruit>({ initialItems: fruits }));

    act(() => result.current.move("cherry", 0));
    expect(result.current.items.map((f) => f.id)).toEqual(["cherry", "apple", "banana"]);

    act(() => result.current.update("apple", { id: "apple", name: "Green Apple" }));
    expect(result.current.getItem("apple")?.name).toBe("Green Apple");
  });

  it("inserts items at a given index", () => {
    const { result } = renderHook(() => useListData<Fruit>({ initialItems: fruits }));

    act(() => result.current.insert(1, { id: "kiwi", name: "Kiwi" }));
    expect(result.current.items.map((f) => f.id)).toEqual(["apple", "kiwi", "banana", "cherry"]);
  });

  it("filters items via filterText and a filter function", () => {
    const { result } = renderHook(() =>
      useListData<Fruit>({
        initialItems: fruits,
        filter: (item, text) => item.name.toLowerCase().includes(text.toLowerCase()),
      }),
    );

    act(() => result.current.setFilterText("an"));
    expect(result.current.items.map((f) => f.id)).toEqual(["banana"]);

    act(() => result.current.setFilterText(""));
    expect(result.current.items).toEqual(fruits);
  });

  it("replaces the selection via setSelectedKeys", () => {
    const { result } = renderHook(() => useListData<Fruit>({ initialItems: fruits }));

    act(() => result.current.setSelectedKeys(["apple", "cherry"]));
    expect(result.current.selectedKeys).toEqual(new Set(["apple", "cherry"]));

    act(() => result.current.setSelectedKeys("all"));
    expect(result.current.selectedKeys).toBe("all");
  });
});
