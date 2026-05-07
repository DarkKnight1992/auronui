import type {VariantProps} from "../../utils";

import { tv } from "tailwind-variants";

export const dateRangeFieldVariants = tv({
  slots: {
    base: "date-range-field-root",
    mainWrapper: "date-range-field__main-wrapper",
    inputWrapper: "date-range-field",
    segmentList: "date-range-field__segment-list",
    segment: "date-range-field__segment",
    separator: "date-range-field__separator",
    startContent: "date-range-field__start-content",
    endContent: "date-range-field__end-content",
    label: "date-range-field__label",
    helperWrapper: "date-range-field__helper-wrapper",
    description: "date-range-field__description",
    errorMessage: "date-range-field__error-message",
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
      flat:       { inputWrapper: "date-range-field--flat" },
      bordered:   { inputWrapper: "date-range-field--bordered" },
      faded:      { inputWrapper: "date-range-field--faded" },
      underlined: { inputWrapper: "date-range-field--underlined" },
      raised:     { inputWrapper: "date-range-field--raised" },
    },
    size: {
      sm: { inputWrapper: "date-range-field--sm" },
      md: {},
      lg: { inputWrapper: "date-range-field--lg" },
    },
    color: {
      default:   { inputWrapper: "date-range-field--default" },
      primary:   { inputWrapper: "date-range-field--primary" },
      secondary: { inputWrapper: "date-range-field--secondary" },
      success:   { inputWrapper: "date-range-field--success" },
      warning:   { inputWrapper: "date-range-field--warning" },
      danger:    { inputWrapper: "date-range-field--danger" },
    },
    fullWidth: {
      false: {},
      true:  { base: "date-range-field-root--full-width", inputWrapper: "date-range-field--full-width" },
    },
    isInvalid: {
      false: {},
      true:  { base: "date-range-field-root--invalid", inputWrapper: "date-range-field--invalid" },
    },
    isDisabled: {
      false: {},
      true:  { base: "date-range-field-root--disabled", inputWrapper: "date-range-field--disabled" },
    },
    isReadonly: {
      false: {},
      true:  { inputWrapper: "date-range-field--readonly" },
    },
    hasLabel: {
      false: {},
      true:  {},
    },
    labelPlacement: {
      inside:         { base: "date-range-field-root--label-inside" },
      outside:        { base: "date-range-field-root--label-outside" },
      "outside-left": { base: "date-range-field-root--label-outside-left" },
    },
  },
  compoundVariants: [
    {
      hasLabel: true,
      labelPlacement: "inside",
      class: { inputWrapper: "date-range-field--label-inside" },
    },
  ],
});

export type DateRangeFieldVariants = VariantProps<typeof dateRangeFieldVariants>;
