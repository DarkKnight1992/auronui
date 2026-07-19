import { forwardRef } from "react";
import { colorPickerInputVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useColorState, type Color, type ColorFormat } from "../../hooks";
import { Popover, PopoverTrigger, PopoverContent } from "../popover";
import { ColorField } from "../color-field";
import { ColorSwatch } from "../color-swatch";
import { ColorPicker } from "../color-picker";

export interface ColorPickerInputProps {
  value?: string;
  defaultValue?: string;
  format?: ColorFormat;
  label?: string;
  description?: string;
  errorMessage?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
  name?: string;
  defaultOpen?: boolean;
  /** Controlled open state. Omit for uncontrolled usage. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** @default 'bottom' */
  side?: "top" | "right" | "bottom" | "left";
  /** @default 'start' */
  align?: "start" | "center" | "end";
  /** @default 8 */
  sideOffset?: number;
  modal?: boolean;
  className?: ClassValue;
  classNames?: Partial<{
    base: ClassValue;
    trigger: ClassValue;
    swatch: ClassValue;
    popover: ClassValue;
  }>;
  onValueChange?: (value: string) => void;
}

/**
 * ColorPickerInput — a hex field with a swatch trigger merged into its
 * bordered box (via ColorField's `endContent`), opening a popover with the
 * full `ColorPicker` (area + sliders + hex field). Mirrors the Vue port's
 * composition: one shared color string, held here via `useColorState`, is
 * handed down as a *controlled* `value` to both `ColorField` (trigger) and
 * `ColorPicker` (dropdown) — neither talks to the other directly, this
 * component is the single source of truth both sync through.
 *
 * Unlike the Vue port, `Popover`'s own `useOverlayState`-backed
 * controlled/uncontrolled handling is reused directly (`open`/`defaultOpen`/
 * `onOpenChange` passed straight through) — no analogous "Boolean prop
 * silently defaults to false" footgun exists in React, so no extra bridging
 * layer is needed here the way the Vue version required.
 */
export const ColorPickerInput = forwardRef<HTMLDivElement, ColorPickerInputProps>(function ColorPickerInput(
  {
    value,
    defaultValue = "#000000",
    format = "hex",
    label,
    description,
    errorMessage,
    isDisabled,
    isReadOnly,
    isRequired,
    fullWidth = false,
    placeholder,
    name,
    defaultOpen = false,
    open,
    onOpenChange,
    side = "bottom",
    align = "start",
    sideOffset = 8,
    modal = false,
    className,
    classNames,
    onValueChange,
  },
  forwardedRef,
) {
  const state = useColorState({
    value,
    defaultValue,
    format,
    onChange: (next) => onValueChange?.(next),
  });

  const sharedValue = state.color.toString(format);
  const styles = colorPickerInputVariants();

  return (
    <div
      ref={forwardedRef}
      className={composeClassName(styles.base(), className, classNames?.base)}
      data-slot="color-picker-input"
    >
      <Popover open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
        <ColorField
          value={sharedValue}
          onChange={(next: Color) => state.setColor(next)}
          label={label}
          description={description}
          errorMessage={errorMessage}
          isDisabled={isDisabled}
          isReadOnly={isReadOnly}
          isRequired={isRequired}
          fullWidth={fullWidth}
          placeholder={placeholder}
          name={name}
          endContent={
            <PopoverTrigger>
              <button
                type="button"
                className={composeClassName(styles.trigger(), classNames?.trigger)}
                disabled={isDisabled}
                aria-label="Open color picker"
              >
                <ColorSwatch
                  color={sharedValue}
                  shape="circle"
                  size="xs"
                  className={composeClassName(styles.swatch(), classNames?.swatch)}
                />
              </button>
            </PopoverTrigger>
          }
        />

        <PopoverContent
          side={side}
          align={align}
          sideOffset={sideOffset}
          aria-label="Color picker"
          className={composeClassName(styles.popover(), classNames?.popover)}
        >
          <ColorPicker
            value={sharedValue}
            format={format}
            isDisabled={isDisabled}
            onValueChange={(next) => state.setColor(next)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
});
