import type { TreeVariants } from "@auronui/styles";
import { createStrictContext } from "../../utils";

export interface TreeContext {
  size: TreeVariants["size"];
  isDisabled: boolean;
  getChildren: (item: unknown) => unknown[] | undefined;
  isSelected: (key: string) => boolean;
  isExpanded: (key: string) => boolean;
  select: (key: string) => void;
  toggleExpand: (key: string) => void;
}

export const DEFAULT_TREE_CONTEXT: TreeContext = {
  size: "md",
  isDisabled: false,
  getChildren: () => undefined,
  isSelected: () => false,
  isExpanded: () => false,
  select: () => {},
  toggleExpand: () => {},
};

export const { Provider: TreeProvider, useStrictContext: useTreeContext } =
  createStrictContext<TreeContext>("Tree");
