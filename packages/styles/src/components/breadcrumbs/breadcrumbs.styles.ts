import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const breadcrumbsVariants = tv({
  slots: {
    base: "breadcrumbs",
    item: "breadcrumbs__item",
    link: "breadcrumbs__link",
    separator: "breadcrumbs__separator",
  },
});

export type BreadcrumbsVariants = VariantProps<typeof breadcrumbsVariants>;
