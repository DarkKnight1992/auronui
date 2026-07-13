import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const cascaderVariants = tv({
  slots: {
    base: "cascader-root",
    label: "cascader__label",
    trigger: "cascader__trigger",
    triggerValue: "cascader__trigger-value",
    triggerIcon: "cascader__trigger-icon",
    panel: "cascader__panel",
    column: "cascader__column",
    item: "cascader__item",
    itemIcon: "cascader__item-icon",
    helperWrapper: "cascader__helper-wrapper",
    description: "cascader__description",
    errorMessage: "cascader__error-message",
  },
  variants: {
    variant: {
      flat:       { trigger: "cascader__trigger--flat" },
      bordered:   { trigger: "cascader__trigger--bordered" },
      faded:      { trigger: "cascader__trigger--faded" },
      underlined: { trigger: "cascader__trigger--underlined" },
      raised:     { trigger: "cascader__trigger--raised" },
    },
    color: {
      default:   { trigger: "cascader__trigger--default" },
      primary:   { trigger: "cascader__trigger--primary" },
      secondary: { trigger: "cascader__trigger--secondary" },
      success:   { trigger: "cascader__trigger--success" },
      warning:   { trigger: "cascader__trigger--warning" },
      danger:    { trigger: "cascader__trigger--danger" },
    },
    isInvalid: {
      true: {
        trigger: "cascader__trigger--invalid",
      },
      false: {},
    },
    isDisabled: {
      true: {
        trigger: "cascader__trigger--disabled",
      },
      false: {},
    },
  },
  defaultVariants: {
    variant: "flat",
    color: "default",
    isInvalid: false,
    isDisabled: false,
  },
});

export type CascaderVariants = VariantProps<typeof cascaderVariants>;
