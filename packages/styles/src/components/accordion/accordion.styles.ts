import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const accordionVariants = tv({
  slots: {
    base: "accordion",
    body: "accordion__body",
    bodyInner: "accordion__body-inner",
    heading: "accordion__heading",
    indicator: "accordion__indicator",
    item: "accordion__item",
    trigger: "accordion__trigger",
  },
  variants: {
    variant: {
      default: {},
      surface: {
        base: "accordion--surface",
      },
    },
    size: {
      sm: {
        base: "accordion--sm",
      },
      md: {
        base: "accordion--md",
      },
      lg: {
        base: "accordion--lg",
      },
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

// Render props that should be excluded from AccordionVariants (framework-specific)
type DisclosureRenderPropsKeys = "isExpanded" | "isDisabled" | "state";

export type AccordionVariants = Omit<
  VariantProps<typeof accordionVariants>,
  DisclosureRenderPropsKeys
>;
