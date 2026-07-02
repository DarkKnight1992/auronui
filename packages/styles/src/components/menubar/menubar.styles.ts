import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const menubarVariants = tv({
  slots: {
    root: "menubar",
    trigger: "menubar__trigger",
    popover: "menubar__popover",
  },
});

export type MenubarVariants = VariantProps<typeof menubarVariants>;
