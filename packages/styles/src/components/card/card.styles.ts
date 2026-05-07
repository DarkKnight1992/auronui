import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

const cardVariants = tv({
  defaultVariants: {
    variant: "default",
    shadow: "sm",
    radius: "lg",
    isHoverable: false,
    isPressable: false,
    isDisabled: false,
    fullWidth: false,
  },
  slots: {
    base: "card",
    content: "card__content",
    description: "card__description",
    footer: "card__footer",
    header: "card__header",
    title: "card__title",
  },
  variants: {
    variant: {
      default: {base: "card--default"},
      secondary: {base: "card--secondary"},
      tertiary: {base: "card--tertiary"},
      transparent: {base: "card--transparent"},
      bordered: {base: "card--bordered"},
      blurred: {base: "card--blurred"},
    },
    shadow: {
      none: {base: "card--shadow-none"},
      sm: {base: "card--shadow-sm"},
      md: {base: "card--shadow-md"},
      lg: {base: "card--shadow-lg"},
    },
    radius: {
      none: {base: "card--radius-none"},
      sm: {base: "card--radius-sm"},
      md: {base: "card--radius-md"},
      lg: {base: "card--radius-lg"},
      xl: {base: ""},
    },
    isHoverable: {
      true: {base: "card--hoverable"},
      false: {},
    },
    isPressable: {
      true: {base: "card--pressable"},
      false: {},
    },
    isDisabled: {
      true: {base: "card--disabled"},
      false: {},
    },
    fullWidth: {
      true: {base: "card--full-width"},
      false: {},
    },
  },
});

export {cardVariants};
export type CardVariants = VariantProps<typeof cardVariants>;
