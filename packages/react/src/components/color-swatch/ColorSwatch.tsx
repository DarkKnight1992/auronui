import { forwardRef, useMemo } from "react";
import { colorSwatchVariants, type ColorSwatchVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { parseColor } from "react-stately";
import type { Color } from "../../hooks";
import { useColorPickerContext } from "../color-picker/color-picker.context";

export interface ColorSwatchProps {
  /** Color to preview (string or Color object). Falls back to the ColorPicker context's color, then black. */
  color?: Color | string;
  /** Name used to build the accessible label when `label` isn't provided. */
  colorName?: string;
  shape?: ColorSwatchVariants["shape"];
  size?: ColorSwatchVariants["size"];
  className?: ClassValue;
  /** Explicit accessible label. Defaults to colorName, then the color's hex string. */
  label?: string;
}

export const ColorSwatch = forwardRef<HTMLDivElement, ColorSwatchProps>(function ColorSwatch(
  { color, colorName, shape, size, className, label },
  forwardedRef,
) {
  const pickerCtx = useColorPickerContext();

  const resolvedColor: Color = useMemo(() => {
    if (color) return typeof color === "string" ? parseColor(color) : color;
    if (pickerCtx) return pickerCtx.color;
    return parseColor("#000000");
  }, [color, pickerCtx]);

  const hex = resolvedColor.toString("hex");
  const accessibleLabel = label ?? colorName ?? hex;

  const styles = useMemo(() => colorSwatchVariants({ shape, size }), [shape, size]);

  return (
    <div
      ref={forwardedRef}
      role="img"
      aria-label={accessibleLabel}
      className={composeClassName(styles, className)}
      style={{ backgroundColor: resolvedColor.toString("css") }}
    />
  );
});
