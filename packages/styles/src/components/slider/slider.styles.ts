import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const sliderVariants = tv({
  slots: {
    base: "slider",
    fill: "slider__fill",
    marks: "slider__marks",
    output: "slider__output",
    thumb: "slider__thumb",
    track: "slider__track",
  },
  variants: {
    size: {
      sm: { track: "slider--size-sm", thumb: "slider--size-sm" },
      md: { track: "slider--size-md", thumb: "slider--size-md" },
      lg: { track: "slider--size-lg", thumb: "slider--size-lg" },
    },
    color: {
      primary:   { fill: "slider--primary",   thumb: "slider--primary" },
      secondary: { fill: "slider--secondary", thumb: "slider--secondary" },
      success:   { fill: "slider--success",   thumb: "slider--success" },
      warning:   { fill: "slider--warning",   thumb: "slider--warning" },
      danger:    { fill: "slider--danger",    thumb: "slider--danger" },
    },
    radius: {
      none: { track: "slider--radius-none", thumb: "slider--radius-none" },
      sm:   { track: "slider--radius-sm",   thumb: "slider--radius-sm" },
      md:   { track: "slider--radius-md",   thumb: "slider--radius-md" },
      lg:   { track: "slider--radius-lg",   thumb: "slider--radius-lg" },
      full: { track: "slider--radius-full", thumb: "slider--radius-full" },
    },
  },
  defaultVariants: {
    color: "primary",
  },
});

export type SliderVariants = VariantProps<typeof sliderVariants>;
