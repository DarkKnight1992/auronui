import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const scrollAreaVariants = tv({
  slots: {
    root: "scroll-area__root",
    viewport: "scroll-area__viewport",
    scrollbar: "scroll-area__scrollbar",
    thumb: "scroll-area__thumb",
    corner: "scroll-area__corner",
  },
});

export type ScrollAreaVariants = VariantProps<typeof scrollAreaVariants>;
