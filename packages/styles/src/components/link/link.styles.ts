import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const linkVariants = tv({
  slots: {
    base: "link",
    icon: "link__icon",
  },
  variants: {
    color: {
      default: {base: "link--color-default"},
      primary: {base: "link--color-primary"},
      success: {base: "link--color-success"},
      warning: {base: "link--color-warning"},
      danger: {base: "link--color-danger"},
      foreground: {base: "link--color-foreground"},
    },
    underline: {
      none: {base: "link--underline-none"},
      hover: {base: "link--underline-hover"},
      always: {base: "link--underline-always"},
      active: {base: "link--underline-active"},
      focus: {base: "link--underline-focus"},
    },
  },
});

// Render props that should be excluded from LinkVariants (framework-specific)
type LinkRenderPropsKeys =
  | "isCurrent"
  | "isHovered"
  | "isPressed"
  | "isFocused"
  | "isFocusVisible"
  | "isDisabled";

export type LinkVariants = Omit<VariantProps<typeof linkVariants>, LinkRenderPropsKeys>;
