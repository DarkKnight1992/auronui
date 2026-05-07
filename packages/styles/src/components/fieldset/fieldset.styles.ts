import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const fieldsetVariants = tv({
  slots: {
    base: "fieldset",
    legend: "fieldset__legend",
    fieldGroup: "fieldset__field-group",
    description: "fieldset__description",
    actions: "fieldset__actions",
  },
  defaultVariants: {
    orientation: "vertical",
    isDisabled: false,
  },
  variants: {
    orientation: {
      vertical:   { fieldGroup: "fieldset__field-group--vertical" },
      horizontal: { fieldGroup: "fieldset__field-group--horizontal" },
    },
    isDisabled: {
      false: {},
      true:  { base: "fieldset--disabled" },
    },
  },
});

export type FieldsetVariants = VariantProps<typeof fieldsetVariants>;
