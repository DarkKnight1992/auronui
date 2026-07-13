import type {VariantProps} from "../../utils";

import { tv } from "tailwind-variants";

export const timeRangeFieldVariants = tv({
  slots: {
    base: "time-range-field-root",
    mainWrapper: "time-range-field__main-wrapper",
    inputWrapper: "time-range-field",
    segmentList: "time-range-field__segment-list",
    segment: "time-range-field__segment",
    separator: "time-range-field__separator",
    startContent: "time-range-field__start-content",
    endContent: "time-range-field__end-content",
    label: "time-range-field__label",
    helperWrapper: "time-range-field__helper-wrapper",
    description: "time-range-field__description",
    errorMessage: "time-range-field__error-message",
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
      flat:       { inputWrapper: "time-range-field--flat" },
      bordered:   { inputWrapper: "time-range-field--bordered" },
      faded:      { inputWrapper: "time-range-field--faded" },
      underlined: { inputWrapper: "time-range-field--underlined" },
      raised:     { inputWrapper: "time-range-field--raised" },
    },
    size: {
      sm: { inputWrapper: "time-range-field--sm" },
      md: {},
      lg: { inputWrapper: "time-range-field--lg" },
    },
    color: {
      default:   { inputWrapper: "time-range-field--default" },
      primary:   { inputWrapper: "time-range-field--primary" },
      secondary: { inputWrapper: "time-range-field--secondary" },
      accent:    { inputWrapper: "time-range-field--accent" },
      success:   { inputWrapper: "time-range-field--success" },
      warning:   { inputWrapper: "time-range-field--warning" },
      danger:    { inputWrapper: "time-range-field--danger" },
    },
    fullWidth: {
      false: {},
      true:  { base: "time-range-field-root--full-width", inputWrapper: "time-range-field--full-width" },
    },
    isInvalid: {
      false: {},
      true:  { base: "time-range-field-root--invalid", inputWrapper: "time-range-field--invalid" },
    },
    isDisabled: {
      false: {},
      true:  { base: "time-range-field-root--disabled", inputWrapper: "time-range-field--disabled" },
    },
    isReadonly: {
      false: {},
      true:  { inputWrapper: "time-range-field--readonly" },
    },
    hasLabel: {
      false: {},
      true:  {},
    },
    labelPlacement: {
      inside:         { base: "time-range-field-root--label-inside" },
      outside:        { base: "time-range-field-root--label-outside" },
      "outside-left": { base: "time-range-field-root--label-outside-left" },
    },
  },
  compoundVariants: [
    {
      hasLabel: true,
      labelPlacement: "inside",
      class: { inputWrapper: "time-range-field--label-inside" },
    },
  ],
});

export type TimeRangeFieldVariants = VariantProps<typeof timeRangeFieldVariants>;
