import type { TreeVariants } from "@auronui/styles";
import { createStrictContext } from "../../utils";

/**
 * One entry per currently-*visible* row (ancestors all expanded), in
 * depth-first document order — the same order flattenItems renders in.
 * Enough to compute WAI-ARIA TreeView arrow-key navigation (next/previous
 * visible row, parent, first child) without every TreeItem needing its own
 * copy of the full tree shape.
 */
export interface TreeNavEntry {
  key: string;
  parentKey: string | null;
}

export interface TreeContext {
  size: TreeVariants["size"];
  isDisabled: boolean;
  getChildren: (item: unknown) => unknown[] | undefined;
  isSelected: (key: string) => boolean;
  isExpanded: (key: string) => boolean;
  select: (key: string) => void;
  toggleExpand: (key: string) => void;
  /** Roving-tabindex target: the one tree-wide node with tabIndex 0. */
  activeKey: string | null;
  setActiveKey: (key: string) => void;
  navOrder: TreeNavEntry[];
  registerNode: (key: string, el: HTMLElement | null) => void;
  /** Imperatively focuses a row's DOM node and marks it the active key. */
  focusNode: (key: string) => void;
}

export const DEFAULT_TREE_CONTEXT: TreeContext = {
  size: "md",
  isDisabled: false,
  getChildren: () => undefined,
  isSelected: () => false,
  isExpanded: () => false,
  select: () => {},
  toggleExpand: () => {},
  activeKey: null,
  setActiveKey: () => {},
  navOrder: [],
  registerNode: () => {},
  focusNode: () => {},
};

export const { Provider: TreeProvider, useStrictContext: useTreeContext } =
  createStrictContext<TreeContext>("Tree");
