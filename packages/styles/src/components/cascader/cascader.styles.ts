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
    isInvalid: false,
    isDisabled: false,
  },
});

export type CascaderVariants = VariantProps<typeof cascaderVariants>;
