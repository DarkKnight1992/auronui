/**
 * useListData — React port of the Vue `useListData` composable, itself a
 * port of @react-stately/data's `useListData`.
 *
 * Original: https://github.com/adobe/react-spectrum/blob/main/packages/@react-stately/data/src/useListData.ts
 * Copyright 2020 Adobe. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Note: this intentionally does NOT delegate to `react-stately`'s own
 * `useListData` (which has a different return shape) — it re-implements the
 * Vue package's specific `items`/`selectedKeys`/`filterText` API surface with
 * React state, so the hook's public shape matches @auronui/vue one-for-one.
 */

import { useCallback, useMemo, useState } from "react";

export type Key = string | number;

export interface ListOptions<T> {
  /** Initial items for the list */
  initialItems?: T[];
  /** Initial set of selected keys */
  initialSelectedKeys?: "all" | Iterable<Key>;
  /** Initial filter text */
  initialFilterText?: string;
  /** Returns a unique key for a given item. Defaults to item.key ?? item.id */
  getKey?: (item: T) => Key;
  /** Filter function. Called with each item and current filterText. Defaults to always-true. */
  filter?: (item: T, filterText: string) => boolean;
}

export interface ListData<T> {
  /** All items (filtered if filterText is set and a filter fn is provided) */
  items: T[];
  /** Current selection */
  selectedKeys: "all" | Set<Key>;
  /** Current filter text */
  filterText: string;
  /** Replace the selection */
  setSelectedKeys(keys: "all" | Iterable<Key>): void;
  /** Update the filter text */
  setFilterText(text: string): void;
  /** Add items to the end of the list */
  append(...items: T[]): void;
  /** Add items to the beginning of the list */
  prepend(...items: T[]): void;
  /** Remove items by key */
  remove(...keys: Key[]): void;
  /** Move an item to a target index */
  move(key: Key, toIndex: number): void;
  /** Replace an item by key */
  update(key: Key, newItem: T): void;
  /** Insert items at a given index */
  insert(index: number, ...items: T[]): void;
  /** Get a single item by key */
  getItem(key: Key): T | undefined;
}

/**
 * Manages list state: filter text, selected keys, and item CRUD operations.
 * Ported from @react-stately/data (Apache 2.0).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useListData<T extends Record<string, any>>(options: ListOptions<T>): ListData<T> {
  const {
    initialItems = [],
    initialSelectedKeys,
    initialFilterText = "",
    getKey = (item: T) => (item["key"] ?? item["id"]) as Key,
    filter,
  } = options;

  const [allItems, setAllItems] = useState<T[]>([...initialItems]);
  const [filterText, setFilterTextState] = useState<string>(initialFilterText);

  const [selectedKeys, setSelectedKeysState] = useState<"all" | Set<Key>>(() => {
    if (initialSelectedKeys === "all") return "all";
    if (initialSelectedKeys) return new Set<Key>(initialSelectedKeys);
    return new Set<Key>();
  });

  const items = useMemo<T[]>(() => {
    if (filter && filterText) {
      return allItems.filter((item) => filter(item, filterText));
    }
    return allItems;
  }, [allItems, filter, filterText]);

  const setSelectedKeys = useCallback((keys: "all" | Iterable<Key>): void => {
    setSelectedKeysState(keys === "all" ? "all" : new Set<Key>(keys));
  }, []);

  const setFilterText = useCallback((text: string): void => {
    setFilterTextState(text);
  }, []);

  const append = useCallback((...newItems: T[]): void => {
    setAllItems((prev) => [...prev, ...newItems]);
  }, []);

  const prepend = useCallback((...newItems: T[]): void => {
    setAllItems((prev) => [...newItems, ...prev]);
  }, []);

  const remove = useCallback(
    (...keys: Key[]): void => {
      const keySet = new Set(keys);
      setAllItems((prev) => prev.filter((item) => !keySet.has(getKey(item))));
    },
    [getKey],
  );

  const move = useCallback(
    (key: Key, toIndex: number): void => {
      setAllItems((prev) => {
        const list = [...prev];
        const fromIndex = list.findIndex((item) => getKey(item) === key);
        if (fromIndex === -1) return prev;
        const [moved] = list.splice(fromIndex, 1);
        list.splice(toIndex, 0, moved as T);
        return list;
      });
    },
    [getKey],
  );

  const update = useCallback(
    (key: Key, newItem: T): void => {
      setAllItems((prev) => prev.map((item) => (getKey(item) === key ? newItem : item)));
    },
    [getKey],
  );

  const insert = useCallback((index: number, ...newItems: T[]): void => {
    setAllItems((prev) => {
      const list = [...prev];
      list.splice(index, 0, ...newItems);
      return list;
    });
  }, []);

  const getItem = useCallback(
    (key: Key): T | undefined => allItems.find((item) => getKey(item) === key),
    [allItems, getKey],
  );

  return {
    items,
    selectedKeys,
    filterText,
    setSelectedKeys,
    setFilterText,
    append,
    prepend,
    remove,
    move,
    update,
    insert,
    getItem,
  };
}
