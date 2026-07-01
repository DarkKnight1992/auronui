import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const hoverCardVariants = tv({
  slots: {
    base: "hover-card",
    trigger: "hover-card__trigger",
  },
});

export type HoverCardVariants = VariantProps<typeof hoverCardVariants>;
