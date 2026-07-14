import { forwardRef, useMemo, useState } from "react";
import { colorSwatchPickerVariants, type ColorSwatchPickerVariants } from "@auronui/styles";
import { composeClassName, dataAttr, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { parseColor } from "react-stately";
import type { Color } from "../../hooks";
import { useColorPickerContext } from "../color-picker/color-picker.context";

function toHexString(c: Color | string): string {
  return typeof c === "string" ? parseColor(c).toString("hex") : c.toString("hex");
}

export interface ColorSwatchPickerOwnProps {
  /** Controlled selected color, as a hex string. */
  value?: string;
  /** Uncontrolled initial selected color, as a hex string. */
  defaultValue?: string;
  colors: Array<Color | string>;
  layout?: ColorSwatchPickerVariants["layout"];
  size?: ColorSwatchPickerVariants["size"];
  variant?: ColorSwatchPickerVariants["variant"];
  className?: ClassValue;
  name?: string;
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  "aria-label"?: string;
  onValueChange?: (value: string) => void;
}

export type ColorSwatchPickerProps = ColorSwatchPickerOwnProps;

export const ColorSwatchPicker = forwardRef<HTMLDivElement, ColorSwatchPickerProps>(function ColorSwatchPicker(
  {
    value,
    defaultValue,
    colors,
    layout = "grid",
    size = "md",
    variant = "circle",
    className,
    name,
    isDisabled,
    disabled,
    "aria-label": ariaLabel = "Color swatches",
    onValueChange,
  },
  forwardedRef,
) {
  const resolvedDisabled = resolveDeprecatedBooleanProp("ColorSwatchPicker", "isDisabled", isDisabled, "disabled", disabled);

  const pickerCtx = useColorPickerContext();
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "");
  const selected = pickerCtx ? pickerCtx.color.toString("hex") : isControlled ? value : uncontrolledValue;

  const styles = useMemo(() => colorSwatchPickerVariants({ layout, size, variant }), [layout, size, variant]);

  function handleSelect(hex: string) {
    if (resolvedDisabled) return;
    if (pickerCtx) {
      const parsed = parseColor(hex);
      pickerCtx.setChannels([
        { channel: "red", value: parsed.getChannelValue("red") },
        { channel: "green", value: parsed.getChannelValue("green") },
        { channel: "blue", value: parsed.getChannelValue("blue") },
        { channel: "alpha", value: parsed.getChannelValue("alpha") },
      ]);
    } else if (!isControlled) {
      setUncontrolledValue(hex);
    }
    onValueChange?.(hex);
  }

  return (
    <div
      ref={forwardedRef}
      role="radiogroup"
      aria-label={ariaLabel}
      className={composeClassName(styles.base(), className)}
      data-disabled={dataAttr(resolvedDisabled)}
    >
      {colors.map((c, i) => {
        const hex = toHexString(c);
        const isSelected = hex === selected;
        return (
          <button
            key={`${hex}-${i}`}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={hex}
            disabled={resolvedDisabled || undefined}
            className={styles.item()}
            data-selected={dataAttr(isSelected)}
            onClick={() => handleSelect(hex)}
          >
            <span className={styles.swatch()} style={{ backgroundColor: hex }} aria-hidden="true" />
            {isSelected && (
              <span className={styles.indicator()} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            )}
          </button>
        );
      })}
      {name && <input type="hidden" name={name} value={selected} readOnly />}
    </div>
  );
});
