import type {VariantProps} from "../../utils";
import { tv } from "tailwind-variants";

export const treeVariants = tv({
  slots: {
    root: "tree",
    item: "tree__item",
    itemContent: "tree__item-content",
    itemToggle: "tree__item-toggle",
    itemIcon: "tree__item-icon",
  },
  variants: {
    size: {
      sm: {
        item: "tree__item--sm",
        itemContent: "tree__item-content--sm",
      },
      md: {
        item: "tree__item--md",
        itemContent: "tree__item-content--md",
      },
      lg: {
        item: "tree__item--lg",
        itemContent: "tree__item-content--lg",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type TreeVariants = VariantProps<typeof treeVariants>;
