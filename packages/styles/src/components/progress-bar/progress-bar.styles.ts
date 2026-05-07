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
    indicator: "progress-bar__indicator transition-transform duration-300 ease-out",
  },
  variants: {
    color: {
      default: {
        indicator: "bg-default-400 progress-bar--default",
      },
      primary: {
        indicator: "bg-primary progress-bar--primary",
      },
      secondary: {
        indicator: "bg-secondary progress-bar--secondary",
      },
      success: {
        indicator: "bg-success progress-bar--success",
      },
      warning: {
        indicator: "bg-warning progress-bar--warning",
      },
      danger: {
        indicator: "bg-danger progress-bar--danger",
      },
      accent: {
        indicator: "bg-primary progress-bar--accent",
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
        indicator: "progress-bar__indicator--striped",
      },
    },
    isIndeterminate: {
      true: {
        indicator: "progress-bar__indicator--indeterminate animate-indeterminate",
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
