import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const timeFieldVariants = tv({
  slots: {
    base: "time-field-root",
    mainWrapper: "time-field__main-wrapper",
    inputWrapper: "time-field",
    segmentList: "time-field__segment-list",
    segment: "time-field__segment",
    startContent: "time-field__start-content",
    endContent: "time-field__end-content",
    label: "time-field__label",
    helperWrapper: "time-field__helper-wrapper",
    description: "time-field__description",
    errorMessage: "time-field__error-message",
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
      flat:       { inputWrapper: "time-field--flat" },
      bordered:   { inputWrapper: "time-field--bordered" },
      faded:      { inputWrapper: "time-field--faded" },
      underlined: { inputWrapper: "time-field--underlined" },
      raised:     { inputWrapper: "time-field--raised" },
    },
    size: {
      sm: { inputWrapper: "time-field--sm" },
      md: {},
      lg: { inputWrapper: "time-field--lg" },
    },
    color: {
      default:   { inputWrapper: "time-field--default" },
      primary:   { inputWrapper: "time-field--primary" },
      secondary: { inputWrapper: "time-field--secondary" },
      success:   { inputWrapper: "time-field--success" },
      warning:   { inputWrapper: "time-field--warning" },
      danger:    { inputWrapper: "time-field--danger" },
    },
    fullWidth: {
      false: {},
      true:  { base: "time-field-root--full-width", inputWrapper: "time-field--full-width" },
    },
    isInvalid: {
      false: {},
      true:  { base: "time-field-root--invalid", inputWrapper: "time-field--invalid" },
    },
    isDisabled: {
      false: {},
      true:  { base: "time-field-root--disabled", inputWrapper: "time-field--disabled" },
    },
    isReadonly: {
      false: {},
      true:  { inputWrapper: "time-field--readonly" },
    },
    hasLabel: {
      false: {},
      true:  {},
    },
    labelPlacement: {
      inside:         { base: "time-field-root--label-inside" },
      outside:        { base: "time-field-root--label-outside" },
      "outside-left": { base: "time-field-root--label-outside-left" },
    },
  },
  compoundVariants: [
    {
      hasLabel: true,
      labelPlacement: "inside",
      class: { inputWrapper: "time-field--label-inside" },
    },
  ],
});

export type TimeFieldVariants = VariantProps<typeof timeFieldVariants>;
