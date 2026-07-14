import { forwardRef, useMemo, type ReactNode } from "react";
import { colorPickerVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { useColorState, type ColorFormat } from "../../hooks";
import { ColorPickerContext, type ColorPickerContextValue } from "./color-picker.context";
import { ColorArea } from "../color-area";
import { ColorSlider } from "../color-slider";
import { ColorField } from "../color-field";
import { ColorSwatch } from "../color-swatch";

export interface ColorPickerOwnProps {
  value?: string;
  defaultValue?: string;
  format?: ColorFormat;
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  label?: string;
  className?: ClassValue;
  children?: ReactNode;
  onValueChange?: (value: string) => void;
}

export type ColorPickerProps = ColorPickerOwnProps;

/**
 * ColorPicker — the full compound picker (saturation/brightness area + hue
 * slider + alpha slider + hex field), composing ColorArea/ColorSlider/
 * ColorField/ColorSwatch via ColorPickerContext.
 *
 * Uses `useColorState` directly (not `useColorPicker`) to drive the context
 * provider: `useColorPicker` is a read-only convenience wrapper (it doesn't
 * expose `setChannel`/`setChannels`), while every child in this composition
 * needs to *write* individual channels through context — mirroring the Vue
 * source, which drives its `provideColorPickerContext` off `useColorState`
 * for the same reason. Fixed composition layout for v1.0 (no slot-based
 * customization yet), matching the Vue source's documented discretion call.
 */
export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(function ColorPicker(
  { value, defaultValue = "#000000", format = "hex", isDisabled, disabled, label, className, children, onValueChange },
  forwardedRef,
) {
  const resolvedDisabled = resolveDeprecatedBooleanProp("ColorPicker", "isDisabled", isDisabled, "disabled", disabled);

  const state = useColorState({
    value,
    defaultValue,
    format,
    onChange: (next) => onValueChange?.(next),
  });

  const contextValue = useMemo<ColorPickerContextValue>(
    () => ({
      color: state.color,
      setChannel: state.setChannel,
      setChannels: state.setChannels,
      format,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.color, format],
  );

  const styles = colorPickerVariants();

  return (
    <ColorPickerContext.Provider value={contextValue}>
      <div ref={forwardedRef} className={composeClassName(styles.base(), className)} aria-label={label} role="group">
        <ColorSwatch colorName={label ?? "Selected color"} />
        <ColorArea xChannel="saturation" yChannel="brightness" isDisabled={resolvedDisabled} />
        <ColorSlider channel="hue" isDisabled={resolvedDisabled} />
        <ColorSlider channel="alpha" isDisabled={resolvedDisabled} />
        <ColorField isDisabled={resolvedDisabled} label="Hex color" />
        {children}
      </div>
    </ColorPickerContext.Provider>
  );
});
