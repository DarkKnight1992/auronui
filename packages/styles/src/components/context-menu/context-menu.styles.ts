import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const contextMenuVariants = tv({
  slots: {
    root: "context-menu",
    trigger: "context-menu__trigger",
    popover: "context-menu__popover",
  },
});

export type ContextMenuVariants = VariantProps<typeof contextMenuVariants>;
