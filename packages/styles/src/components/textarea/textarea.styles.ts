import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const textAreaVariants = tv({
  slots: {
    base: "textarea-root",
    mainWrapper: "textarea__main-wrapper",
    inputWrapper: "textarea",
    input: "textarea__input",
    startContent: "textarea__start-content",
    endContent: "textarea__end-content",
    label: "textarea__label",
    clearButton: "textarea__clear-button",
    helperWrapper: "textarea__helper-wrapper",
    description: "textarea__description",
    errorMessage: "textarea__error-message",
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
      flat:       { inputWrapper: "textarea--flat" },
      bordered:   { inputWrapper: "textarea--bordered" },
      faded:      { inputWrapper: "textarea--faded" },
      underlined: { inputWrapper: "textarea--underlined" },
      raised:     { inputWrapper: "textarea--raised" },
    },
    size: {
      sm: { inputWrapper: "textarea--sm" },
      md: {},
      lg: { inputWrapper: "textarea--lg" },
    },
    color: {
      default:   { inputWrapper: "textarea--default" },
      primary:   { inputWrapper: "textarea--primary" },
      secondary: { inputWrapper: "textarea--secondary" },
      success:   { inputWrapper: "textarea--success" },
      warning:   { inputWrapper: "textarea--warning" },
      danger:    { inputWrapper: "textarea--danger" },
    },
    fullWidth: {
      false: {},
      true:  { base: "textarea-root--full-width", inputWrapper: "textarea--full-width" },
    },
    isInvalid: {
      false: {},
      true:  { base: "textarea-root--invalid", inputWrapper: "textarea--invalid" },
    },
    isDisabled: {
      false: {},
      true:  { base: "textarea-root--disabled", inputWrapper: "textarea--disabled" },
    },
    isReadonly: {
      false: {},
      true:  { inputWrapper: "textarea--readonly" },
    },
    hasLabel: {
      false: {},
      true:  {},
    },
    labelPlacement: {
      inside:         { base: "textarea-root--label-inside" },
      outside:        { base: "textarea-root--label-outside" },
      "outside-left": { base: "textarea-root--label-outside-left" },
    },
  },
  compoundVariants: [
    {
      hasLabel: true,
      labelPlacement: "inside",
      class: { inputWrapper: "textarea--label-inside" },
    },
  ],
});

export type TextAreaVariants = VariantProps<typeof textAreaVariants>;
