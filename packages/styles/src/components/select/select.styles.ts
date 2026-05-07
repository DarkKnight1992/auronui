import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const selectVariants = tv({
  slots: {
    base: "select-root",
    mainWrapper: "select__main-wrapper",
    trigger: "select__trigger",
    value: "select__value",
    startContent: "select__start-content",
    indicator: "select__indicator",
    label: "select__label",
    helperWrapper: "select__helper-wrapper",
    description: "select__description",
    errorMessage: "select__error-message",
    popover: "select__popover",
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
      flat:       { trigger: "select__trigger--flat" },
      bordered:   { trigger: "select__trigger--bordered" },
      faded:      { trigger: "select__trigger--faded" },
      underlined: { trigger: "select__trigger--underlined" },
      raised:     { trigger: "select__trigger--raised" },
    },
    size: {
      sm: { trigger: "select__trigger--sm" },
      md: {},
      lg: { trigger: "select__trigger--lg" },
    },
    color: {
      default:   { trigger: "select__trigger--default" },
      primary:   { trigger: "select__trigger--primary" },
      secondary: { trigger: "select__trigger--secondary" },
      success:   { trigger: "select__trigger--success" },
      warning:   { trigger: "select__trigger--warning" },
      danger:    { trigger: "select__trigger--danger" },
    },
    fullWidth: {
      false: {},
      true:  { base: "select-root--full-width", trigger: "select__trigger--full-width" },
    },
    isInvalid: {
      false: {},
      true:  { base: "select-root--invalid", trigger: "select__trigger--invalid" },
    },
    isDisabled: {
      false: {},
      true:  { base: "select-root--disabled", trigger: "select__trigger--disabled" },
    },
    isReadonly: {
      false: {},
      true:  { trigger: "select__trigger--readonly" },
    },
    hasLabel: {
      false: {},
      true:  {},
    },
    labelPlacement: {
      inside:         { base: "select-root--label-inside" },
      outside:        { base: "select-root--label-outside" },
      "outside-left": { base: "select-root--label-outside-left" },
    },
  },
  compoundVariants: [
    {
      hasLabel: true,
      labelPlacement: "inside",
      class: { trigger: "select__trigger--label-inside" },
    },
  ],
});

export type SelectVariants = VariantProps<typeof selectVariants>;
