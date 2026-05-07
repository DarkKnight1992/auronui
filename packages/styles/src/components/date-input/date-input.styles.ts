import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const dateInputVariants = tv({
  slots: {
    base: "date-input-root",
    mainWrapper: "date-input__main-wrapper",
    inputWrapper: "date-input",
    segmentList: "date-input__segment-list",
    segment: "date-input__segment",
    startContent: "date-input__start-content",
    endContent: "date-input__end-content",
    label: "date-input__label",
    helperWrapper: "date-input__helper-wrapper",
    description: "date-input__description",
    errorMessage: "date-input__error-message",
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
      flat:       { inputWrapper: "date-input--flat" },
      bordered:   { inputWrapper: "date-input--bordered" },
      faded:      { inputWrapper: "date-input--faded" },
      underlined: { inputWrapper: "date-input--underlined" },
      raised:     { inputWrapper: "date-input--raised" },
    },
    size: {
      sm: { inputWrapper: "date-input--sm" },
      md: {},
      lg: { inputWrapper: "date-input--lg" },
    },
    color: {
      default:   { inputWrapper: "date-input--default" },
      primary:   { inputWrapper: "date-input--primary" },
      secondary: { inputWrapper: "date-input--secondary" },
      success:   { inputWrapper: "date-input--success" },
      warning:   { inputWrapper: "date-input--warning" },
      danger:    { inputWrapper: "date-input--danger" },
    },
    fullWidth: {
      false: {},
      true:  { base: "date-input-root--full-width", inputWrapper: "date-input--full-width" },
    },
    isInvalid: {
      false: {},
      true:  { base: "date-input-root--invalid", inputWrapper: "date-input--invalid" },
    },
    isDisabled: {
      false: {},
      true:  { base: "date-input-root--disabled", inputWrapper: "date-input--disabled" },
    },
    isReadonly: {
      false: {},
      true:  { inputWrapper: "date-input--readonly" },
    },
    hasLabel: {
      false: {},
      true:  {},
    },
    labelPlacement: {
      inside:         { base: "date-input-root--label-inside" },
      outside:        { base: "date-input-root--label-outside" },
      "outside-left": { base: "date-input-root--label-outside-left" },
    },
  },
  compoundVariants: [
    {
      hasLabel: true,
      labelPlacement: "inside",
      class: { inputWrapper: "date-input--label-inside" },
    },
  ],
});

export type DateInputVariants = VariantProps<typeof dateInputVariants>;
