import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

const separatorVariants = tv({
  slots: {
    base: "separator",
    line: "separator__line",
    content: "separator__content",
  },
  defaultVariants: {
    orientation: "horizontal",
    variant: "default",
  },
  variants: {
    orientation: {
      horizontal: {
        base: "separator--horizontal",
      },
      vertical: {
        base: "separator--vertical",
      },
    },
    variant: {
      default: {
        base: "separator--default",
      },
      secondary: {
        base: "separator--secondary",
      },
      tertiary: {
        base: "separator--tertiary",
      },
    },
  },
});

export {separatorVariants};
export type SeparatorVariants = VariantProps<typeof separatorVariants>;
