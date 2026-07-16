import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const avatarVariants = tv({
  defaultVariants: {
    color: "default",
    size: "md",
  },
  slots: {
    base: "avatar",
    fallback: "avatar__fallback",
    image: "avatar__image",
    icon: "avatar__icon",
    name: "avatar__name",
  },
  variants: {
    color: {
      primary: {
        base: "avatar--color-primary",
        fallback: "avatar__fallback--primary",
      },
      accent: {
        base: "avatar--color-accent",
        fallback: "avatar__fallback--accent",
      },
      secondary: {
        base: "avatar--color-secondary",
        fallback: "avatar__fallback--secondary",
      },
      danger: {
        base: "avatar--color-danger",
        fallback: "avatar__fallback--danger",
      },
      default: {
        base: "avatar--color-default",
        fallback: "avatar__fallback--default",
      },
      success: {
        base: "avatar--color-success",
        fallback: "avatar__fallback--success",
      },
      warning: {
        base: "avatar--color-warning",
        fallback: "avatar__fallback--warning",
      },
    },
    size: {
      lg: {
        base: "avatar--lg",
      },
      md: {
        base: "avatar--md",
      },
      sm: {
        base: "avatar--sm",
      },
    },
    variant: {
      default: {},
      soft: {
        base: "avatar--soft",
      },
      solid: {
        base: "avatar--solid",
      },
      bordered: {
        base: "avatar--bordered",
      },
    },
  },
});

export type AvatarVariants = VariantProps<typeof avatarVariants>;
