import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const inputGroupVariants = tv({
  defaultVariants: {
    variant: "flat",
    size: "md",
    color: "default",
    fullWidth: false,
  },
  slots: {
    root: "input-group-root",
    base: "input-group",
    addon: "input-group__addon",
    input: "input-group__input",
    label: "input-group__label",
    helperWrapper: "input-group__helper-wrapper",
    description: "input-group__description",
    errorMessage: "input-group__error-message",
  },
  variants: {
    variant: {
      flat:       { base: "input-group--flat" },
      bordered:   { base: "input-group--bordered" },
      faded:      { base: "input-group--faded" },
      underlined: { base: "input-group--underlined" },
      raised:     { base: "input-group--raised" },
    },
    size: {
      sm: "input-group--sm",
      md: "input-group--md",
      lg: "input-group--lg",
    },
    color: {
      default:   { base: "input-group--default" },
      primary:   { base: "input-group--primary" },
      secondary: { base: "input-group--secondary" },
      success:   { base: "input-group--success" },
      warning:   { base: "input-group--warning" },
      danger:    { base: "input-group--danger" },
    },
    fullWidth: {
      false: {},
      true: {
        root: "input-group-root--full-width",
        base: "input-group--full-width",
      },
    },
  },
});

export type InputGroupVariants = VariantProps<typeof inputGroupVariants>;
