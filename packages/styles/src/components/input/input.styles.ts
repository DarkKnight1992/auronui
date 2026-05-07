import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const inputVariants = tv({
  slots: {
    base: "input-root",
    mainWrapper: "input__main-wrapper",
    inputWrapper: "input",
    input: "input__input",
    startContent: "input__start-content",
    endContent: "input__end-content",
    label: "input__label",
    clearButton: "input__clear-button",
    passwordToggle: "input__password-toggle",
    helperWrapper: "input__helper-wrapper",
    description: "input__description",
    errorMessage: "input__error-message",
  },
  defaultVariants: {
    variant: "flat",
    size: "md",
    color: "default",
    fullWidth: false,
    isInvalid: false,
    isDisabled: false,
    isReadonly: false,
    hasLabel: false,
    labelPlacement: "inside",
  },
  variants: {
    variant: {
      flat:       { inputWrapper: "input--flat" },
      bordered:   { inputWrapper: "input--bordered" },
      faded:      { inputWrapper: "input--faded" },
      underlined: { inputWrapper: "input--underlined" },
      raised:     { inputWrapper: "input--raised" },
    },
    size: {
      sm: { inputWrapper: "input--sm" },
      md: {},
      lg: { inputWrapper: "input--lg" },
    },
    color: {
      default:   { inputWrapper: "input--default" },
      primary:   { inputWrapper: "input--primary" },
      secondary: { inputWrapper: "input--secondary" },
      success:   { inputWrapper: "input--success" },
      warning:   { inputWrapper: "input--warning" },
      danger:    { inputWrapper: "input--danger" },
    },
    fullWidth: {
      false: {},
      true:  { base: "input-root--full-width", inputWrapper: "input--full-width" },
    },
    isInvalid: {
      false: {},
      true:  { base: "input-root--invalid", inputWrapper: "input--invalid" },
    },
    isDisabled: {
      false: {},
      true:  { base: "input-root--disabled", inputWrapper: "input--disabled" },
    },
    isReadonly: {
      false: {},
      true:  { inputWrapper: "input--readonly" },
    },
    hasLabel: {
      false: {},
      true:  {},
    },
    labelPlacement: {
      inside:         { base: "input-root--label-inside" },
      outside:        { base: "input-root--label-outside" },
      "outside-left": { base: "input-root--label-outside-left" },
    },
  },
  compoundVariants: [
    {
      hasLabel: true,
      labelPlacement: "inside",
      class: { inputWrapper: "input--label-inside" },
    },
  ],
});

export type InputVariants = VariantProps<typeof inputVariants>;
