import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const imageVariants = tv({
  defaultVariants: {
    fit: "cover",
    radius: "md",
  },
  slots: {
    base: "image",
    img: "image__img",
    fallback: "image__fallback",
    zoomTrigger: "image__zoom-trigger",
  },
  variants: {
    fit: {
      cover: {
        img: "image__img--cover",
      },
      contain: {
        img: "image__img--contain",
      },
      fill: {
        img: "image__img--fill",
      },
    },
    radius: {
      none: {
        base: "image--radius-none",
      },
      sm: {
        base: "image--radius-sm",
      },
      md: {
        base: "image--radius-md",
      },
      lg: {
        base: "image--radius-lg",
      },
      full: {
        base: "image--radius-full",
      },
    },
  },
});

export type ImageVariants = VariantProps<typeof imageVariants>;
