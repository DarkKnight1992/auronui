import type {VariantProps} from "../../utils";
import { tv } from "tailwind-variants";

export const buttonVariants = tv({
  slots: {
    base: "button",
    startContent: "button__start-content",
    label: "button__label",
    endContent: "button__end-content",
    spinner: "button__spinner",
  },
  defaultVariants: {
    fullWidth: false,
    isIconOnly: false,
    isLoading: false,
    size: "md",
    variant: "primary",
  },
  variants: {
    fullWidth: {
      false: { base: "" },
      true: { base: "button--full-width" },
    },
    isIconOnly: {
      false: {},
      true: { base: "button--icon-only" },
    },
    isLoading: {
      false: {},
      true: {
        base: "button--loading",
        label: "button__label--loading",
      },
    },
    radius: {
      none: { base: "button--radius-none" },
      sm: { base: "button--radius-sm" },
      md: { base: "button--radius-md" },
      lg: { base: "button--radius-lg" },
      full: { base: "button--radius-full" },
    },
    size: {
      xl: { base: "button--xl" },
      lg: { base: "button--lg" },
      md: { base: "button--md" },
      sm: { base: "button--sm" },
      xs: { base: "button--xs" },
    },
    variant: {
      danger: { base: "button--danger" },
      "danger-soft": { base: "button--danger-soft" },
      ghost: { base: "button--ghost" },
      outline: { base: "button--outline" },
      primary: { base: "button--primary" },
      secondary: { base: "button--secondary" },
      success: { base: "button--success" },
      "success-soft": { base: "button--success-soft" },
      tertiary: { base: "button--tertiary" },
      warning: { base: "button--warning" },
      "warning-soft": { base: "button--warning-soft" },
    },
  },
});

export type ButtonVariants = VariantProps<typeof buttonVariants>;
