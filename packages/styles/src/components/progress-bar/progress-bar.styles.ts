import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const progressBarVariants = tv({
  defaultVariants: {
    color: "default",
    size: "md",
    radius: "full",
    isStriped: false,
    isIndeterminate: false,
    isDisabled: false,
  },
  slots: {
    base: "progress-bar",
    labelWrapper: "progress-bar__label-wrapper flex justify-between",
    label: "progress-bar__label text-sm font-medium text-foreground",
    value: "progress-bar__value text-sm font-medium text-foreground",
    track: "progress-bar__track",
    indicator: "progress-bar__fill",
  },
  variants: {
    color: {
      default: {
        base: "progress-bar--default",
      },
      primary: {
        base: "progress-bar--primary",
      },
      secondary: {
        base: "progress-bar--secondary",
      },
      success: {
        base: "progress-bar--success",
      },
      warning: {
        base: "progress-bar--warning",
      },
      danger: {
        base: "progress-bar--danger",
      },
      accent: {
        base: "progress-bar--accent",
      },
    },
    size: {
      sm: {
        track: "h-1 rounded-full progress-bar--sm",
      },
      md: {
        track: "h-2 rounded-full progress-bar--md",
      },
      lg: {
        track: "h-3 rounded-full progress-bar--lg",
      },
    },
    radius: {
      none: {
        track: "rounded-none",
        indicator: "rounded-none",
      },
      sm: {
        track: "rounded-sm",
        indicator: "rounded-sm",
      },
      md: {
        track: "rounded-md",
        indicator: "rounded-md",
      },
      lg: {
        track: "rounded-lg",
        indicator: "rounded-lg",
      },
      full: {
        track: "rounded-full",
        indicator: "rounded-full",
      },
    },
    isStriped: {
      true: {
        indicator: "progress-bar__fill--striped",
      },
    },
    isIndeterminate: {
      true: {
        // data-state="indeterminate" (set by Reka) drives the CSS animation
        indicator: "progress-bar__fill--indeterminate",
      },
    },
    isDisabled: {
      true: {
        base: "opacity-50 cursor-not-allowed",
      },
    },
  },
});

export type ProgressBarVariants = VariantProps<typeof progressBarVariants>;
