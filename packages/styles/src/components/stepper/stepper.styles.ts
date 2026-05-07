import type {VariantProps} from "../../utils";
import { tv } from "tailwind-variants";

export const stepperVariants = tv({
  slots: {
    base: "stepper",
    item: "stepper__item",
    indicator: "stepper__indicator",
    indicatorText: "stepper__indicator-text",
    title: "stepper__title",
    description: "stepper__description",
    content: "stepper__content",
    separator: "stepper__separator",
  },
  variants: {
    orientation: {
      horizontal: {
        base: "stepper--horizontal",
        item: "stepper__item--horizontal",
        separator: "stepper__separator--horizontal",
      },
      vertical: {
        base: "stepper--vertical",
        item: "stepper__item--vertical",
        separator: "stepper__separator--vertical",
      },
    },
    size: {
      sm: {
        indicator: "stepper__indicator--sm",
        title: "stepper__title--sm",
      },
      md: {
        indicator: "stepper__indicator--md",
        title: "stepper__title--md",
      },
      lg: {
        indicator: "stepper__indicator--lg",
        title: "stepper__title--lg",
      },
    },
    color: {
      default: { indicator: "stepper__indicator--default" },
      accent: { indicator: "stepper__indicator--accent" },
      success: { indicator: "stepper__indicator--success" },
      warning: { indicator: "stepper__indicator--warning" },
      danger: { indicator: "stepper__indicator--danger" },
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    size: "md",
    color: "accent",
  },
});

export type StepperVariants = VariantProps<typeof stepperVariants>;
