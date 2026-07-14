import {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { colorAreaVariants, type ColorAreaVariants } from "@auronui/styles";
import { composeClassName, dataAttr, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { useColorState, type Color, type ColorChannel, type ColorFormat } from "../../hooks";
import { useColorPickerContext } from "../color-picker/color-picker.context";

function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

/**
 * Picks the color-space format that has both requested channels. Channels
 * like `saturation` exist in more than one space (hsl AND hsb), so this
 * looks at the *pair* rather than converting per-channel — a color parsed
 * from hex starts in the `rgb` format, which doesn't support `saturation`/
 * `brightness` directly, so callers must convert with this before doing any
 * channel math (mirrors `useColorState`'s internal per-channel fallback,
 * generalized to a channel pair).
 */
function formatForChannelPair(xChannel: ColorChannel, yChannel: ColorChannel): ColorFormat {
  const channels = [xChannel, yChannel];
  if (channels.includes("lightness")) return "hsl";
  if (channels.includes("brightness")) return "hsb";
  if (channels.some((c) => c === "red" || c === "green" || c === "blue")) return "rgb";
  return "hsb";
}

/**
 * Builds a two-gradient background approximating the (x, y) color plane:
 * a horizontal gradient sweeping xChannel at yChannel's max, overlaid with a
 * black-to-transparent vertical gradient standing in for the y falloff.
 * This is the standard approach used across color-picker implementations —
 * it is exact for the common saturation/brightness or saturation/lightness
 * pairings and a reasonable approximation for other channel combinations.
 */
function getAreaBackgroundStyle(color: Color, xChannel: ColorChannel, yChannel: ColorChannel): CSSProperties {
  const { minValue: xMin, maxValue: xMax } = color.getChannelRange(xChannel);
  const { maxValue: yMax } = color.getChannelRange(yChannel);
  const fullY = color.withChannelValue(yChannel, yMax);
  const start = fullY.withChannelValue(xChannel, xMin).toString("css");
  const end = fullY.withChannelValue(xChannel, xMax).toString("css");
  return {
    backgroundImage: `linear-gradient(to top, black, transparent), linear-gradient(to right, ${start}, ${end})`,
  };
}

export interface ColorAreaOwnProps {
  /** Controlled color value (string or Color object). */
  value?: Color | string;
  /** Uncontrolled initial color value. */
  defaultValue?: Color | string;
  /** Horizontal-axis channel. @default 'saturation' */
  xChannel?: ColorChannel;
  /** Vertical-axis channel. @default 'brightness' */
  yChannel?: ColorChannel;
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  showDots?: ColorAreaVariants["showDots"];
  className?: ClassValue;
  thumbClassName?: ClassValue;
  name?: string;
  isRequired?: boolean;
  /** @deprecated Use isRequired instead. */
  required?: boolean;
  xName?: string;
  yName?: string;
  onChange?: (color: Color) => void;
  onChangeEnd?: (color: Color) => void;
}

export type ColorAreaProps = ColorAreaOwnProps;

export const ColorArea = forwardRef<HTMLDivElement, ColorAreaProps>(function ColorArea(
  {
    value,
    defaultValue,
    xChannel = "saturation",
    yChannel = "brightness",
    isDisabled,
    disabled,
    showDots = false,
    className,
    thumbClassName,
    name,
    isRequired,
    required,
    xName,
    yName,
    onChange,
    onChangeEnd,
  },
  forwardedRef,
) {
  const resolvedDisabled = resolveDeprecatedBooleanProp("ColorArea", "isDisabled", isDisabled, "disabled", disabled);
  const resolvedRequired = resolveDeprecatedBooleanProp("ColorArea", "isRequired", isRequired, "required", required);

  const pickerCtx = useColorPickerContext();
  const local = useColorState(pickerCtx ? {} : { value, defaultValue });
  const rawColor = pickerCtx ? pickerCtx.color : local.color;
  const color = useMemo(
    () => rawColor.toFormat(formatForChannelPair(xChannel, yChannel)),
    [rawColor, xChannel, yChannel],
  );

  const styles = useMemo(() => colorAreaVariants({ showDots }), [showDots]);
  // Opaque (alpha=1) so the thumb's fill/border stay visible even mid-drag on
  // an alpha channel — otherwise a low-alpha color would render an invisible thumb.
  const thumbColorCss = useMemo(() => color.withChannelValue("alpha", 1).toString("css"), [color]);
  const areaBgStyle = useMemo(
    () => ({
      ...getAreaBackgroundStyle(color, xChannel, yChannel),
      position: "absolute" as const,
      inset: 0,
      borderRadius: "inherit",
    }),
    [color, xChannel, yChannel],
  );

  const areaRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  function applyColor(next: Color, commit: boolean) {
    if (pickerCtx) {
      pickerCtx.setChannels([
        { channel: xChannel, value: next.getChannelValue(xChannel) },
        { channel: yChannel, value: next.getChannelValue(yChannel) },
      ]);
    } else {
      local.setColor(next);
    }
    onChange?.(next);
    if (commit) onChangeEnd?.(next);
  }

  const colorFromPercent = useCallback(
    (pctX: number, pctY: number): Color => {
      const xRange = color.getChannelRange(xChannel);
      const yRange = color.getChannelRange(yChannel);
      const xVal = clamp(xRange.minValue + pctX * (xRange.maxValue - xRange.minValue), xRange.minValue, xRange.maxValue);
      // pctY is 0 at the bottom (min) — invert since screen Y grows downward.
      const yVal = clamp(yRange.minValue + (1 - pctY) * (yRange.maxValue - yRange.minValue), yRange.minValue, yRange.maxValue);
      return color.withChannelValue(xChannel, xVal).withChannelValue(yChannel, yVal);
    },
    [color, xChannel, yChannel],
  );

  function getPointerPercents(clientX: number, clientY: number): { x: number; y: number } {
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: rect.width === 0 ? 0 : clamp((clientX - rect.left) / rect.width, 0, 1),
      y: rect.height === 0 ? 0 : clamp((clientY - rect.top) / rect.height, 0, 1),
    };
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (resolvedDisabled) return;
    draggingRef.current = true;
    const { x, y } = getPointerPercents(event.clientX, event.clientY);
    applyColor(colorFromPercent(x, y), false);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!draggingRef.current || resolvedDisabled) return;
    const { x, y } = getPointerPercents(event.clientX, event.clientY);
    applyColor(colorFromPercent(x, y), false);
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
    onChangeEnd?.(color);
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (resolvedDisabled) return;
    const xRange = color.getChannelRange(xChannel);
    const yRange = color.getChannelRange(yChannel);
    const xStep = xRange.step || 1;
    const yStep = yRange.step || 1;
    let xVal = color.getChannelValue(xChannel);
    let yVal = color.getChannelValue(yChannel);
    switch (event.key) {
      case "ArrowRight":
        xVal = clamp(xVal + xStep, xRange.minValue, xRange.maxValue);
        break;
      case "ArrowLeft":
        xVal = clamp(xVal - xStep, xRange.minValue, xRange.maxValue);
        break;
      case "ArrowUp":
        yVal = clamp(yVal + yStep, yRange.minValue, yRange.maxValue);
        break;
      case "ArrowDown":
        yVal = clamp(yVal - yStep, yRange.minValue, yRange.maxValue);
        break;
      default:
        return;
    }
    event.preventDefault();
    applyColor(color.withChannelValue(xChannel, xVal).withChannelValue(yChannel, yVal), true);
  }

  const xPct = (() => {
    const { minValue, maxValue } = color.getChannelRange(xChannel);
    const range = maxValue - minValue;
    return range === 0 ? 0 : ((color.getChannelValue(xChannel) - minValue) / range) * 100;
  })();
  const yPct = (() => {
    const { minValue, maxValue } = color.getChannelRange(yChannel);
    const range = maxValue - minValue;
    return range === 0 ? 0 : (1 - (color.getChannelValue(yChannel) - minValue) / range) * 100;
  })();

  return (
    <div
      ref={forwardedRef}
      className={composeClassName(styles.base(), className)}
      data-disabled={dataAttr(resolvedDisabled)}
    >
      <div ref={areaRef} style={areaBgStyle} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
        <div
          role="slider"
          tabIndex={resolvedDisabled ? -1 : 0}
          aria-label={`${xChannel} / ${yChannel}`}
          aria-valuetext={color.toString("css")}
          aria-disabled={dataAttr(resolvedDisabled)}
          aria-required={resolvedRequired || undefined}
          className={composeClassName(styles.thumb(), thumbClassName)}
          style={
            {
              position: "absolute",
              left: `${xPct}%`,
              top: `${yPct}%`,
              "--color-area-thumb-color": thumbColorCss,
            } as CSSProperties
          }
          onKeyDown={handleKeyDown}
        />
      </div>
      {name && <input type="hidden" name={xName ?? `${name}-x`} value={color.getChannelValue(xChannel)} readOnly />}
      {name && <input type="hidden" name={yName ?? `${name}-y`} value={color.getChannelValue(yChannel)} readOnly />}
    </div>
  );
});
