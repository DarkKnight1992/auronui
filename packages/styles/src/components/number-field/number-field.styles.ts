import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const numberFieldVariants = tv({
  slots: {
    base: "number-field",
    group: "number-field__group",
    input: "number-field__input",
    incrementButton: "number-field__increment-button",
    decrementButton: "number-field__decrement-button",
  },
  defaultVariants: {
    variant: "flat",
    size: "md",
    color: "default",
    fullWidth: false,
    isInvalid: false,
    isDisabled: false,
    isReadonly: false,
  },
  variants: {
    variant: {
      flat:       { base: "number-field--flat" },
      bordered:   { base: "number-field--bordered" },
      faded:      { base: "number-field--faded" },
      underlined: { base: "number-field--underlined" },
      raised:     { base: "number-field--raised" },
    },
    size: {
      sm: {
        base: "number-field--sm",
        group: "number-field__group--sm",
        incrementButton: "number-field__increment-button--sm",
        decrementButton: "number-field__decrement-button--sm",
      },
      md: {
        base: "",
        group: "",
        incrementButton: "",
        decrementButton: "",
      },
      lg: {
        base: "number-field--lg",
        group: "number-field__group--lg",
        incrementButton: "number-field__increment-button--lg",
        decrementButton: "number-field__decrement-button--lg",
      },
    },
    color: {
      default:   { base: "number-field--default" },
      primary:   { base: "number-field--primary" },
      secondary: { base: "number-field--secondary" },
      success:   { base: "number-field--success" },
      warning:   { base: "number-field--warning" },
      danger:    { base: "number-field--danger" },
    },
    fullWidth: {
      false: {},
      true:  {
        base: "number-field--full-width",
        group: "number-field__group--full-width",
      },
    },
    isInvalid: {
      false: {},
      true:  { base: "number-field--invalid" },
    },
    isDisabled: {
      false: {},
      true:  { base: "number-field--disabled" },
    },
    isReadonly: {
      false: {},
      true:  { base: "number-field--readonly" },
    },
  },
});

export type NumberFieldVariants = VariantProps<typeof numberFieldVariants>;
