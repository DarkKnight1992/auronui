import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const tooltipVariants = tv({
  slots: {
    base: "tooltip",
    trigger: "tooltip__trigger",
  },
});

export type TooltipVariants = VariantProps<typeof tooltipVariants>;
