import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const descriptionVariants = tv({
  base: "description",
});

export type DescriptionVariants = VariantProps<typeof descriptionVariants>;
