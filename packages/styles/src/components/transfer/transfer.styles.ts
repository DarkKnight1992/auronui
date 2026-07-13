import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const transferVariants = tv({
  slots: {
    base: "transfer",
    panel: "transfer__panel",
    panelHeader: "transfer__panel-header",
    panelSearch: "transfer__panel-search",
    panelBody: "transfer__panel-body",
    controls: "transfer__controls",
    controlButton: "transfer__control-button",
  },
  variants: {
    isDisabled: {
      true: {
        base: "transfer--disabled",
      },
      false: {},
    },
  },
  defaultVariants: {
    isDisabled: false,
  },
});

export type TransferVariants = VariantProps<typeof transferVariants>;
