import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const autocompleteVariants = tv({
  slots: {
    base: "autocomplete-root",
    mainWrapper: "autocomplete__main-wrapper",
    trigger: "autocomplete__trigger",
    input: "autocomplete__input",
    startContent: "autocomplete__start-content",
    indicator: "autocomplete__indicator",
    clearButton: "autocomplete__clear-button",
    label: "autocomplete__label",
    helperWrapper: "autocomplete__helper-wrapper",
    description: "autocomplete__description",
    errorMessage: "autocomplete__error-message",
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
      flat:       { trigger: "autocomplete__trigger--flat" },
      bordered:   { trigger: "autocomplete__trigger--bordered" },
      faded:      { trigger: "autocomplete__trigger--faded" },
      underlined: { trigger: "autocomplete__trigger--underlined" },
      raised:     { trigger: "autocomplete__trigger--raised" },
    },
    size: {
      sm: { trigger: "autocomplete__trigger--sm" },
      md: {},
      lg: { trigger: "autocomplete__trigger--lg" },
    },
    color: {
      default:   { trigger: "autocomplete__trigger--default" },
      primary:   { trigger: "autocomplete__trigger--primary" },
      secondary: { trigger: "autocomplete__trigger--secondary" },
      success:   { trigger: "autocomplete__trigger--success" },
      warning:   { trigger: "autocomplete__trigger--warning" },
      danger:    { trigger: "autocomplete__trigger--danger" },
    },
    fullWidth: {
      false: {},
      true:  { base: "autocomplete-root--full-width", trigger: "autocomplete__trigger--full-width" },
    },
    isInvalid: {
      false: {},
      true:  { base: "autocomplete-root--invalid", trigger: "autocomplete__trigger--invalid" },
    },
    isDisabled: {
      false: {},
      true:  { base: "autocomplete-root--disabled", trigger: "autocomplete__trigger--disabled" },
    },
    isReadonly: {
      false: {},
      true:  { trigger: "autocomplete__trigger--readonly" },
    },
    hasLabel: {
      false: {},
      true:  {},
    },
    labelPlacement: {
      inside:         { base: "autocomplete-root--label-inside" },
      outside:        { base: "autocomplete-root--label-outside" },
      "outside-left": { base: "autocomplete-root--label-outside-left" },
    },
  },
  compoundVariants: [
    {
      hasLabel: true,
      labelPlacement: "inside",
      class: { trigger: "autocomplete__trigger--label-inside" },
    },
  ],
});

export type AutocompleteVariants = VariantProps<typeof autocompleteVariants>;
