import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const menuVariants = tv({
  base: "menu",
});

export type MenuVariants = VariantProps<typeof menuVariants>;
