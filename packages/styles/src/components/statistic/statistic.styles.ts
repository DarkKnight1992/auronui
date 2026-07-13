import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const statisticVariants = tv({
  defaultVariants: {
    color: "default",
  },
  slots: {
    base: "statistic",
    label: "statistic__label",
    valueWrapper: "statistic__value-wrapper",
    value: "statistic__value",
    affix: "statistic__affix",
    description: "statistic__description",
    trend: "statistic__trend",
  },
  variants: {
    color: {
      default: {
        value: "statistic__value--default",
      },
      primary: {
        value: "statistic__value--primary",
      },
      success: {
        value: "statistic__value--success",
      },
      warning: {
        value: "statistic__value--warning",
      },
      danger: {
        value: "statistic__value--danger",
      },
    },
  },
});

export type StatisticVariants = VariantProps<typeof statisticVariants>;
