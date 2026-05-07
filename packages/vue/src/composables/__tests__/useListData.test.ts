import { describe, it, expect } from "vitest";
import { useListData } from "../useListData";

interface Item {
  id: number;
  name: string;
}

describe("useListData", () => {
  it("initializes with items", () => {
    const list = useListData<Item>({
      initialItems: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ],
    });
    expect(list.items.value).toHaveLength(2);
    expect(list.items.value[0].name).toBe("Alice");
  });

  it("defaults to empty items", () => {
    const list = useListData<Item>({});
    expect(list.items.value).toHaveLength(0);
  });

  it("initializes filterText", () => {
    const list = useListData<Item>({ initialFilterText: "hello" });
    expect(list.filterText.value).toBe("hello");
  });

  it("setFilterText updates filterText", () => {
    const list = useListData<Item>({});
    list.setFilterText("search");
    expect(list.filterText.value).toBe("search");
  });

  it("filters items when filter fn is provided", () => {
    const list = useListData<Item>({
      initialItems: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ],
      filter: (item, text) => item.name.toLowerCase().includes(text.toLowerCase()),
      initialFilterText: "al",
    });
    expect(list.items.value).toHaveLength(1);
    expect(list.items.value[0].name).toBe("Alice");
  });

  it("setSelectedKeys updates selectedKeys", () => {
    const list = useListData<Item>({});
    list.setSelectedKeys(new Set([1, 2]));
    expect(list.selectedKeys.value).toEqual(new Set([1, 2]));
  });

  it("initializes with 'all' selectedKeys", () => {
    const list = useListData<Item>({
      initialSelectedKeys: "all",
    });
    expect(list.selectedKeys.value).toBe("all");
  });

  it("append adds items to end", () => {
    const list = useListData<Item>({
      initialItems: [{ id: 1, name: "Alice" }],
    });
    list.append({ id: 2, name: "Bob" });
    expect(list.items.value).toHaveLength(2);
    expect(list.items.value[1].name).toBe("Bob");
  });

  it("prepend adds items to start", () => {
    const list = useListData<Item>({
      initialItems: [{ id: 2, name: "Bob" }],
    });
    list.prepend({ id: 1, name: "Alice" });
    expect(list.items.value).toHaveLength(2);
    expect(list.items.value[0].name).toBe("Alice");
  });

  it("remove removes item by key", () => {
    const list = useListData<Item>({
      initialItems: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ],
    });
    list.remove(1);
    expect(list.items.value).toHaveLength(1);
    expect(list.items.value[0].name).toBe("Bob");
  });

  it("update replaces item", () => {
    const list = useListData<Item>({
      initialItems: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ],
    });
    list.update(1, { id: 1, name: "Updated Alice" });
    expect(list.items.value[0].name).toBe("Updated Alice");
  });

  it("insert inserts at index", () => {
    const list = useListData<Item>({
      initialItems: [
        { id: 1, name: "Alice" },
        { id: 3, name: "Carol" },
      ],
    });
    list.insert(1, { id: 2, name: "Bob" });
    expect(list.items.value[1].name).toBe("Bob");
  });

  it("move reorders item", () => {
    const list = useListData<Item>({
      initialItems: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Carol" },
      ],
    });
    list.move(1, 2);
    expect(list.items.value[2].name).toBe("Alice");
  });

  it("getItem returns item by key", () => {
    const list = useListData<Item>({
      initialItems: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ],
    });
    const item = list.getItem(2);
    expect(item?.name).toBe("Bob");
  });

  it("getItem returns undefined for missing key", () => {
    const list = useListData<Item>({
      initialItems: [{ id: 1, name: "Alice" }],
    });
    const item = list.getItem(999);
    expect(item).toBeUndefined();
  });

  it("uses custom getKey", () => {
    const list = useListData<Item>({
      initialItems: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ],
      getKey: (item) => item.name,
    });
    const item = list.getItem("Alice");
    expect(item?.id).toBe(1);
  });
});
