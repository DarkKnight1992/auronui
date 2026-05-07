import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const chipVariants = tv({
  defaultVariants: {
    color: "default",
    variant: "solid",
    size: "md",
  },
  slots: {
    base: "chip",
    label: "chip__label",
    dot: "chip__dot",
    startContent: "chip__start-content",
    endContent: "chip__end-content",
    closeButton: "chip__close-button",
  },
  variants: {
    color: {
      accent: {
        base: "chip--accent",
      },
      danger: {
        base: "chip--danger",
      },
      default: {
        base: "chip--default",
      },
      success: {
        base: "chip--success",
      },
      warning: {
        base: "chip--warning",
      },
    },
    size: {
      lg: {
        base: "chip--lg",
      },
      md: {
        base: "chip--md",
      },
      sm: {
        base: "chip--sm",
      },
    },
    variant: {
      solid: {
        base: "chip--solid",
      },
      soft: {
        base: "chip--soft",
      },
      outlined: {
        base: "chip--outlined",
      },
      text: {
        base: "chip--text",
      },
    },
  },
});

export type ChipVariants = VariantProps<typeof chipVariants>;
