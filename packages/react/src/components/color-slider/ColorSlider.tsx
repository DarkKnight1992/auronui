import {
  forwardRef,
  useMemo,
  useRef,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { colorSliderVariants } from "@auronui/styles";
import { composeClassName, dataAttr, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { useColorState, type Color, type ColorChannel, type ColorFormat } from "../../hooks";
import { useColorPickerContext } from "../color-picker/color-picker.context";

function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

/**
 * A color parsed from hex starts in the `rgb` format, which doesn't support
 * channels like `hue`/`saturation`/`lightness` directly — convert to the
 * format that supports the requested channel before doing any channel math
 * (mirrors `useColorState`'s internal per-channel fallback).
 */
function formatForChannel(channel: ColorChannel): ColorFormat {
  switch (channel) {
    case "hue":
    case "saturation":
    case "lightness":
      return "hsl";
    case "brightness":
      return "hsb";
    default:
      return "rgb";
  }
}

/** Builds a linear gradient sweeping a single channel across its full range. */
function getSliderBackgroundStyle(
  color: Color,
  channel: ColorChannel,
  orientation: "horizontal" | "vertical",
): CSSProperties {
  const { minValue, maxValue } = color.getChannelRange(channel);
  const steps = 8;
  const stops: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const v = minValue + ((maxValue - minValue) * i) / steps;
    stops.push(color.withChannelValue(channel, v).toString("css"));
  }
  const direction = orientation === "vertical" ? "to top" : "to right";
  return { backgroundImage: `linear-gradient(${direction}, ${stops.join(", ")})` };
}

export interface ColorSliderOwnProps {
  value?: Color | string;
  defaultValue?: Color | string;
  channel: ColorChannel;
  orientation?: "horizontal" | "vertical";
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  showOutput?: boolean;
  className?: ClassValue;
  trackClassName?: ClassValue;
  thumbClassName?: ClassValue;
  outputClassName?: ClassValue;
  name?: string;
  isRequired?: boolean;
  /** @deprecated Use isRequired instead. */
  required?: boolean;
  /** Overrides the channel's own default step size. */
  step?: number;
  onChange?: (color: Color) => void;
  onChangeEnd?: (color: Color) => void;
}

export type ColorSliderProps = ColorSliderOwnProps;

export const ColorSlider = forwardRef<HTMLDivElement, ColorSliderProps>(function ColorSlider(
  {
    value,
    defaultValue,
    channel,
    orientation = "horizontal",
    isDisabled,
    disabled,
    showOutput = false,
    className,
    trackClassName,
    thumbClassName,
    outputClassName,
    name,
    isRequired,
    required,
    step,
    onChange,
    onChangeEnd,
  },
  forwardedRef,
) {
  const resolvedDisabled = resolveDeprecatedBooleanProp("ColorSlider", "isDisabled", isDisabled, "disabled", disabled);
  const resolvedRequired = resolveDeprecatedBooleanProp("ColorSlider", "isRequired", isRequired, "required", required);

  const pickerCtx = useColorPickerContext();
  const local = useColorState(pickerCtx ? {} : { value, defaultValue });
  const rawColor = pickerCtx ? pickerCtx.color : local.color;
  const color = useMemo(() => rawColor.toFormat(formatForChannel(channel)), [rawColor, channel]);

  const styles = colorSliderVariants();
  const trackBgStyle = useMemo(() => getSliderBackgroundStyle(color, channel, orientation), [color, channel, orientation]);
  const channelDisplay = Math.round(color.getChannelValue(channel)).toString();
  // Opaque (alpha=1) so the thumb ring stays visible even on the alpha channel itself,
  // where the "true" color at low positions would otherwise be near-transparent.
  const thumbColorCss = useMemo(() => color.withChannelValue("alpha", 1).toString("css"), [color]);

  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  function applyColor(next: Color, commit: boolean) {
    if (pickerCtx) {
      pickerCtx.setChannel(channel, next.getChannelValue(channel));
    } else {
      local.setColor(next);
    }
    onChange?.(next);
    if (commit) onChangeEnd?.(next);
  }

  function colorFromPercent(pct: number): Color {
    const { minValue, maxValue, step: channelStep } = color.getChannelRange(channel);
    const s = step ?? channelStep ?? 1;
    const raw = orientation === "vertical" ? minValue + (1 - pct) * (maxValue - minValue) : minValue + pct * (maxValue - minValue);
    // Snap to the nearest step during drag too, not just via keyboard — matches
    // reka-ui's `handleSlideMove` (`roundValue(Math.round((value - min) / step)
    // * step + min, decimalCount)`); the React port previously left dragged
    // values fully continuous/unsnapped.
    const decimalCount = (String(s).split(".")[1] || "").length;
    const rounder = 10 ** decimalCount;
    const snapped = Math.round(Math.round((raw - minValue) / s) * s * rounder + minValue * rounder) / rounder;
    return color.withChannelValue(channel, clamp(snapped, minValue, maxValue));
  }

  function getPointerPercent(clientX: number, clientY: number): number {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    if (orientation === "vertical") {
      return rect.height === 0 ? 0 : clamp((clientY - rect.top) / rect.height, 0, 1);
    }
    return rect.width === 0 ? 0 : clamp((clientX - rect.left) / rect.width, 0, 1);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (resolvedDisabled) return;
    draggingRef.current = true;
    applyColor(colorFromPercent(getPointerPercent(event.clientX, event.clientY)), false);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!draggingRef.current || resolvedDisabled) return;
    applyColor(colorFromPercent(getPointerPercent(event.clientX, event.clientY)), false);
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
    onChangeEnd?.(color);
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (resolvedDisabled) return;
    const { minValue, maxValue, step: channelStep } = color.getChannelRange(channel);
    // `step` prop overrides the channel's own default step — matches reka-ui's
    // ColorSliderRoot: `step.value = stepProp.value ?? channelRange.value.step`.
    const s = step ?? channelStep ?? 1;
    const current = color.getChannelValue(channel);
    let next: number | null = null;
    const forwardKey = orientation === "vertical" ? "ArrowUp" : "ArrowRight";
    const backwardKey = orientation === "vertical" ? "ArrowDown" : "ArrowLeft";
    // PageUp/PageDown and Shift+Arrow jump by 10 steps at once — matches
    // reka-ui's Slider (`isSkipKey = isPageKey || (shiftKey && isArrowKey)`,
    // `multiplier = isSkipKey ? 10 : 1`), which the Vue ColorSlider inherits
    // via ColorSliderThumb -> SliderThumb. The hand-rolled React port never
    // wired this up, so keyboard users lost the large-jump shortcut.
    const isArrowKey = event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight";
    const isPageKey = event.key === "PageUp" || event.key === "PageDown";
    const multiplier = isPageKey || (event.shiftKey && isArrowKey) ? 10 : 1;
    if (event.key === forwardKey || event.key === "PageUp") next = current + s * multiplier;
    else if (event.key === backwardKey || event.key === "PageDown") next = current - s * multiplier;
    else if (event.key === "Home") next = minValue;
    else if (event.key === "End") next = maxValue;
    else return;
    event.preventDefault();
    applyColor(color.withChannelValue(channel, clamp(next, minValue, maxValue)), true);
  }

  const { minValue, maxValue } = color.getChannelRange(channel);
  const range = maxValue - minValue;
  const normalized = range === 0 ? 0 : (color.getChannelValue(channel) - minValue) / range;
  const thumbPct = (orientation === "vertical" ? 1 - normalized : normalized) * 100;
  const positionAxis = orientation === "vertical" ? "top" : "left";

  return (
    <div
      ref={forwardedRef}
      className={composeClassName(styles.base(), className)}
      data-disabled={dataAttr(resolvedDisabled)}
      data-orientation={orientation}
    >
      <div
        ref={trackRef}
        className={composeClassName(styles.track(), trackClassName)}
        style={trackBgStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div
          role="slider"
          tabIndex={resolvedDisabled ? -1 : 0}
          aria-label={channel}
          aria-valuenow={color.getChannelValue(channel)}
          aria-valuemin={minValue}
          aria-valuemax={maxValue}
          aria-orientation={orientation}
          aria-disabled={dataAttr(resolvedDisabled)}
          aria-required={resolvedRequired || undefined}
          className={composeClassName(styles.thumb(), thumbClassName)}
          style={
            {
              position: "absolute",
              [positionAxis]: `${thumbPct}%`,
              // Centers the thumb ON its position along the track axis (reka-ui
              // applies this same translate inline) — without it, `left`/`top`
              // place the thumb's edge (not center) at the percentage mark, so
              // the thumb overflows past the track boundary near 0%/100%.
              transform: orientation === "vertical" ? "translateY(-50%)" : "translateX(-50%)",
              "--color-slider-thumb-color": thumbColorCss,
            } as CSSProperties
          }
          onKeyDown={handleKeyDown}
        />
      </div>
      {showOutput && <output className={composeClassName(styles.output(), outputClassName)}>{channelDisplay}</output>}
      {name && <input type="hidden" name={name} value={color.getChannelValue(channel)} readOnly />}
    </div>
  );
});
