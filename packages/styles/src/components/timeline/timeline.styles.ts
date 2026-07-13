import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const timelineVariants = tv({
  defaultVariants: {
    orientation: "vertical",
    status: "pending",
  },
  slots: {
    base: "timeline",
    item: "timeline__item",
    dot: "timeline__dot",
    line: "timeline__line",
    content: "timeline__content",
    title: "timeline__title",
    description: "timeline__description",
    timestamp: "timeline__timestamp",
  },
  variants: {
    orientation: {
      vertical: {
        base: "timeline--vertical",
        item: "timeline__item--vertical",
      },
      horizontal: {
        base: "timeline--horizontal",
        item: "timeline__item--horizontal",
      },
    },
    status: {
      done: {
        dot: "timeline__dot--done",
      },
      current: {
        dot: "timeline__dot--current",
      },
      pending: {
        dot: "timeline__dot--pending",
      },
    },
    color: {
      default: {
        dot: "timeline__dot--color-default",
      },
      primary: {
        dot: "timeline__dot--color-primary",
      },
      secondary: {
        dot: "timeline__dot--color-secondary",
      },
      accent: {
        dot: "timeline__dot--color-accent",
      },
      success: {
        dot: "timeline__dot--color-success",
      },
      warning: {
        dot: "timeline__dot--color-warning",
      },
      danger: {
        dot: "timeline__dot--color-danger",
      },
    },
  },
});

export type TimelineVariants = VariantProps<typeof timelineVariants>;
