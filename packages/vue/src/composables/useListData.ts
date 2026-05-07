/**
 * useListData — Vue port of @react-stately/data useListData
 *
 * Original: https://github.com/adobe/react-spectrum/blob/main/packages/@react-stately/data/src/useListData.ts
 * Copyright 2020 Adobe. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Adapted for Vue 3 by Auron contributors. Uses Vue refs instead of React state.
 */

import { ref, computed, type Ref, type ComputedRef } from "vue";

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
  items: ComputedRef<T[]>;
  /** Current selection */
  selectedKeys: Ref<"all" | Set<Key>>;
  /** Current filter text */
  filterText: Ref<string>;
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
export function useListData<T extends Record<string, any>>(
  options: ListOptions<T>
): ListData<T> {
  const {
    initialItems = [],
    initialSelectedKeys,
    initialFilterText = "",
    getKey = (item: T) => (item["key"] ?? item["id"]) as Key,
    filter,
  } = options;

  const allItems = ref<T[]>([...initialItems]) as Ref<T[]>;
  const filterText = ref<string>(initialFilterText);

  let initKeys: "all" | Set<Key>;
  if (initialSelectedKeys === "all") {
    initKeys = "all";
  } else if (initialSelectedKeys) {
    initKeys = new Set<Key>(initialSelectedKeys);
  } else {
    initKeys = new Set<Key>();
  }
  const selectedKeys = ref<"all" | Set<Key>>(initKeys) as Ref<"all" | Set<Key>>;

  const items = computed<T[]>(() => {
    if (filter && filterText.value) {
      return allItems.value.filter((item) => filter(item, filterText.value));
    }
    return allItems.value;
  });

  function setSelectedKeys(keys: "all" | Iterable<Key>): void {
    if (keys === "all") {
      selectedKeys.value = "all";
    } else {
      selectedKeys.value = new Set<Key>(keys);
    }
  }

  function setFilterText(text: string): void {
    filterText.value = text;
  }

  function append(...newItems: T[]): void {
    allItems.value = [...allItems.value, ...newItems];
  }

  function prepend(...newItems: T[]): void {
    allItems.value = [...newItems, ...allItems.value];
  }

  function remove(...keys: Key[]): void {
    const keySet = new Set(keys);
    allItems.value = allItems.value.filter((item) => !keySet.has(getKey(item)));
  }

  function move(key: Key, toIndex: number): void {
    const list = [...allItems.value];
    const fromIndex = list.findIndex((item) => getKey(item) === key);
    if (fromIndex === -1) return;
    const [moved] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, moved);
    allItems.value = list;
  }

  function update(key: Key, newItem: T): void {
    allItems.value = allItems.value.map((item) => (getKey(item) === key ? newItem : item));
  }

  function insert(index: number, ...newItems: T[]): void {
    const list = [...allItems.value];
    list.splice(index, 0, ...newItems);
    allItems.value = list;
  }

  function getItem(key: Key): T | undefined {
    return allItems.value.find((item) => getKey(item) === key);
  }

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
