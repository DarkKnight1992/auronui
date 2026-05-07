import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const collapsibleVariants = tv({
  defaultVariants: {},
  slots: {
    base: "collapsible",
    body: "collapsible__body",
    bodyInner: "collapsible__body-inner",
    content: "collapsible__content",
    heading: "collapsible__heading",
    indicator: "collapsible__indicator",
    trigger: "collapsible__trigger",
  },
  variants: {},
});

// Render props that should be excluded from CollapsibleVariants (framework-specific)
type CollapsibleRenderPropsKeys = "isExpanded" | "isDisabled" | "state";

export type CollapsibleVariants = Omit<
  VariantProps<typeof collapsibleVariants>,
  CollapsibleRenderPropsKeys
>;
