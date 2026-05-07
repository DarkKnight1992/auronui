import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const emptyStateVariants = tv({
  base: "empty-state",
});

export type EmptyStateVariants = VariantProps<typeof emptyStateVariants>;
