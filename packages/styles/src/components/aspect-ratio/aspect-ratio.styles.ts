import type {VariantProps} from "../../utils";
import { tv } from "tailwind-variants";

export const aspectRatioVariants = tv({
  slots: {
    base: "aspect-ratio",
  },
});

export type AspectRatioVariants = VariantProps<typeof aspectRatioVariants>;
