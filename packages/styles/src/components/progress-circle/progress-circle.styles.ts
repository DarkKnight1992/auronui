import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const progressCircleVariants = tv({
  defaultVariants: {
    color: "default",
    size: "md",
    isIndeterminate: false,
    isDisabled: false,
  },
  slots: {
    base: "progress-circle relative inline-flex items-center justify-center",
    svg: "progress-circle__svg",
    track: "progress-circle__track stroke-default-200",
    indicator: "progress-circle__indicator",
    label: "progress-circle__label absolute flex items-center justify-center",
    value: "progress-circle__value text-sm font-medium text-foreground",
  },
  variants: {
    color: {
      default: {
        indicator: "stroke-default-foreground progress-circle--default",
      },
      primary: {
        indicator: "stroke-accent progress-circle--primary",
      },
      secondary: {
        indicator: "stroke-default-foreground progress-circle--secondary",
      },
      success: {
        indicator: "stroke-success progress-circle--success",
      },
      warning: {
        indicator: "stroke-warning progress-circle--warning",
      },
      danger: {
        indicator: "stroke-danger progress-circle--danger",
      },
      accent: {
        indicator: "stroke-accent progress-circle--accent",
      },
    },
    size: {
      sm: {
        base: "h-12 w-12 progress-circle--sm",
        svg: "h-12 w-12",
        value: "text-xs",
      },
      md: {
        base: "h-16 w-16 progress-circle--md",
        svg: "h-16 w-16",
        value: "text-sm",
      },
      lg: {
        base: "h-24 w-24 progress-circle--lg",
        svg: "h-24 w-24",
        value: "text-base",
      },
    },
    isIndeterminate: {
      true: {
        svg: "animate-spin",
      },
    },
    isDisabled: {
      true: {
        base: "opacity-50 cursor-not-allowed",
      },
    },
  },
});

export type ProgressCircleVariants = VariantProps<typeof progressCircleVariants>;
