import {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { sliderVariants, type SliderVariants } from "@auronui/styles";
import { composeClassName, dataAttr, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";

export type SliderValue = number | number[];

export interface SliderOwnProps {
  /** Controlled value. Number for a single thumb, number[] for a range. */
  value?: SliderValue;
  /** Uncontrolled initial value. */
  defaultValue?: SliderValue;
  min?: number;
  max?: number;
  step?: number;
  /** Minimum number of steps required between two thumbs in range mode. */
  minStepsBetweenThumbs?: number;
  orientation?: "horizontal" | "vertical";
  size?: SliderVariants["size"];
  color?: SliderVariants["color"];
  radius?: SliderVariants["radius"];
  label?: string;
  showSteps?: boolean;
  marks?: Array<{ value: number; label?: string }>;
  formatOptions?: Intl.NumberFormatOptions;
  hideValue?: boolean;
  hideThumb?: boolean;
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  inverted?: boolean;
  isRequired?: boolean;
  /** @deprecated Use isRequired instead. */
  required?: boolean;
  name?: string;
  className?: ClassValue;
  /** Override classes for individual slots (base, output, track, fill, marks, thumb) */
  classNames?: Partial<{
    base: ClassValue;
    output: ClassValue;
    track: ClassValue;
    fill: ClassValue;
    marks: ClassValue;
    thumb: ClassValue;
  }>;
  startContent?: ReactNode;
  endContent?: ReactNode;
  onValueChange?: (value: SliderValue) => void;
  onValueCommit?: (value: SliderValue) => void;
}

export type SliderProps = SliderOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof SliderOwnProps | "onChange">;

function toArray(v: SliderValue | undefined, min: number, max: number): number[] {
  if (v === undefined) return [Math.round((min + max) / 2)];
  return Array.isArray(v) ? [...v] : [v];
}

function roundToStep(raw: number, min: number, step: number): number {
  if (step <= 0) return raw;
  const steps = Math.round((raw - min) / step);
  // avoid floating point drift, e.g. 0.1 + 0.2
  return Math.round((min + steps * step) * 1e10) / 1e10;
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

export const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
  {
    value,
    defaultValue,
    min = 0,
    max = 100,
    step = 1,
    minStepsBetweenThumbs = 0,
    orientation = "horizontal",
    size,
    color,
    radius,
    label,
    showSteps = false,
    marks,
    formatOptions,
    hideValue = false,
    hideThumb = false,
    isDisabled,
    disabled,
    inverted = false,
    isRequired,
    required,
    name,
    className,
    classNames,
    startContent,
    endContent,
    onValueChange,
    onValueCommit,
    ...rest
  },
  forwardedRef,
) {
  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "Slider",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );
  const resolvedRequired = resolveDeprecatedBooleanProp(
    "Slider",
    "isRequired",
    isRequired,
    "required",
    required,
  );

  const isRange = Array.isArray(value) || Array.isArray(defaultValue);
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<number[]>(() =>
    toArray(defaultValue, min, max),
  );
  const currentArray = isControlled ? toArray(value, min, max) : uncontrolledValue;

  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef<number | null>(null);

  const slotFns = useMemo(
    () => sliderVariants({ size, color, radius }),
    [size, color, radius],
  );

  const valueToRenderPercent = useCallback(
    (v: number): number => {
      const range = max - min;
      const normalized = range === 0 ? 0 : (clamp(v, min, max) - min) / range;
      return (inverted ? 1 - normalized : normalized) * 100;
    },
    [min, max, inverted],
  );

  const renderPercentToValue = useCallback(
    (pct: number): number => {
      const normalized = inverted ? 1 - pct : pct;
      const raw = min + normalized * (max - min);
      return clamp(roundToStep(raw, min, step), min, max);
    },
    [min, max, step, inverted],
  );

  function formatValue(v: number): string {
    if (formatOptions) return new Intl.NumberFormat(undefined, formatOptions).format(v);
    return String(v);
  }

  const formatted = currentArray.map(formatValue).join(" – ");

  function emitChange(next: number[], commit: boolean) {
    if (!isControlled) setUncontrolledValue(next);
    const out: SliderValue = isRange ? next : next[0];
    onValueChange?.(out);
    if (commit) onValueCommit?.(out);
  }

  function updateValueAtIndex(idx: number, rawValue: number, commit: boolean) {
    const next = [...currentArray];
    let newV = clamp(roundToStep(rawValue, min, step), min, max);
    const gap = minStepsBetweenThumbs * step;
    const prevThumb = next[idx - 1];
    const nextThumb = next[idx + 1];
    if (prevThumb !== undefined) newV = Math.max(newV, prevThumb + gap);
    if (nextThumb !== undefined) newV = Math.min(newV, nextThumb - gap);
    newV = clamp(newV, min, max);
    next[idx] = newV;
    emitChange(next, commit);
  }

  function getPointerPercent(clientX: number, clientY: number): number {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    if (orientation === "vertical") {
      return rect.height === 0 ? 0 : clamp((rect.bottom - clientY) / rect.height, 0, 1);
    }
    return rect.width === 0 ? 0 : clamp((clientX - rect.left) / rect.width, 0, 1);
  }

  function nearestThumbIndex(targetValue: number): number {
    let closest = 0;
    let closestDist = Infinity;
    currentArray.forEach((v, i) => {
      const dist = Math.abs(v - targetValue);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    return closest;
  }

  function handleTrackPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (resolvedDisabled) return;
    // getPointerPercent already returns a normalized 0..1 fraction (despite the
    // name) — renderPercentToValue expects that same 0..1 range, so dividing by
    // 100 here made every click/drag resolve to a value near `min` regardless
    // of pointer position (rounding up to the first step above it and never
    // moving from there).
    const pct = getPointerPercent(event.clientX, event.clientY);
    const targetValue = renderPercentToValue(pct);
    const idx = nearestThumbIndex(targetValue);
    activeIndexRef.current = idx;
    updateValueAtIndex(idx, targetValue, false);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleTrackPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (resolvedDisabled || activeIndexRef.current === null) return;
    // getPointerPercent already returns a normalized 0..1 fraction (despite the
    // name) — renderPercentToValue expects that same 0..1 range, so dividing by
    // 100 here made every click/drag resolve to a value near `min` regardless
    // of pointer position (rounding up to the first step above it and never
    // moving from there).
    const pct = getPointerPercent(event.clientX, event.clientY);
    const targetValue = renderPercentToValue(pct);
    updateValueAtIndex(activeIndexRef.current, targetValue, false);
  }

  function handleTrackPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (activeIndexRef.current === null) return;
    const idx = activeIndexRef.current;
    activeIndexRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    onValueCommit?.(isRange ? currentArray : currentArray[0]);
    void idx;
  }

  function handleThumbKeyDown(idx: number, event: ReactKeyboardEvent<HTMLDivElement>) {
    if (resolvedDisabled) return;
    const bigStep = step * 10;
    const current = currentArray[idx];
    // The "forward" direction always increases the value, regardless of
    // orientation/inversion — ArrowRight/ArrowUp are forward unless inverted.
    const forwardKeys = orientation === "vertical" ? ["ArrowUp", "ArrowRight"] : ["ArrowRight", "ArrowUp"];
    const backwardKeys = orientation === "vertical" ? ["ArrowDown", "ArrowLeft"] : ["ArrowLeft", "ArrowDown"];
    let next: number | null = null;
    if (forwardKeys.includes(event.key)) {
      next = current + (inverted ? -step : step);
    } else if (backwardKeys.includes(event.key)) {
      next = current + (inverted ? step : -step);
    } else if (event.key === "PageUp") {
      next = current + bigStep;
    } else if (event.key === "PageDown") {
      next = current - bigStep;
    } else if (event.key === "Home") {
      next = min;
    } else if (event.key === "End") {
      next = max;
    } else {
      return;
    }
    event.preventDefault();
    updateValueAtIndex(idx, next, true);
  }

  const positionAxis = orientation === "vertical" ? "bottom" : "left";
  const showLabelWrapper = !!label || !hideValue;

  const tickPositions: number[] = [];
  if (showSteps && step > 0) {
    let v = min;
    while (v <= max) {
      const range = max - min;
      tickPositions.push(range === 0 ? 0 : ((v - min) / range) * 100);
      v = Math.round((v + step) * 1e10) / 1e10;
    }
  }

  const renderPercents = currentArray.map(valueToRenderPercent);
  const fillStyle =
    isRange && currentArray.length > 1
      ? {
          [positionAxis]: `${Math.min(...renderPercents)}%`,
          [orientation === "vertical" ? "height" : "width"]: `${Math.max(...renderPercents) - Math.min(...renderPercents)}%`,
        }
      : {
          [positionAxis]: "0%",
          [orientation === "vertical" ? "height" : "width"]: `${renderPercents[0] ?? 0}%`,
        };

  return (
    <div
      ref={forwardedRef}
      className={composeClassName(slotFns.base(), className, classNames?.base)}
      data-orientation={orientation}
      data-disabled={dataAttr(resolvedDisabled)}
      {...rest}
    >
      {showLabelWrapper && (
        <>
          {label && <label data-slot="label">{label}</label>}
          {!hideValue && (
            <output className={composeClassName(slotFns.output(), classNames?.output)}>
              {formatted}
            </output>
          )}
        </>
      )}

      <div className="relative flex items-center gap-2">
        {startContent}

        <div
          className="relative flex items-center select-none touch-none w-full"
          data-orientation={orientation}
        >
          <div
            ref={trackRef}
            className={composeClassName(slotFns.track(), classNames?.track)}
            onPointerDown={handleTrackPointerDown}
            onPointerMove={handleTrackPointerMove}
            onPointerUp={handleTrackPointerUp}
          >
            <div
              className={composeClassName(slotFns.fill(), classNames?.fill)}
              style={{ position: "absolute", ...fillStyle }}
            />

            {tickPositions.map((pct, i) => (
              <span
                key={`tick-${i}`}
                style={{ [positionAxis]: `${pct}%` }}
                aria-hidden="true"
                data-slider-tick
                className="absolute pointer-events-none"
              />
            ))}

            {(marks ?? []).map((mark) => (
              <span
                key={`mark-${mark.value}`}
                className={composeClassName(slotFns.marks(), classNames?.marks)}
                style={{ [positionAxis]: `${valueToRenderPercent(mark.value)}%` }}
                data-slider-mark
              >
                {mark.label}
              </span>
            ))}

            {!hideThumb &&
              currentArray.map((v, idx) => (
                <div
                  key={idx}
                  role="slider"
                  tabIndex={resolvedDisabled ? -1 : 0}
                  aria-valuenow={v}
                  aria-valuemin={min}
                  aria-valuemax={max}
                  aria-orientation={orientation}
                  aria-label={label || "Value"}
                  aria-disabled={dataAttr(resolvedDisabled)}
                  aria-required={resolvedRequired || undefined}
                  className={composeClassName(slotFns.thumb(), classNames?.thumb)}
                  style={{ position: "absolute", [positionAxis]: `${renderPercents[idx]}%` }}
                  onKeyDown={(e) => handleThumbKeyDown(idx, e)}
                  data-disabled={dataAttr(resolvedDisabled)}
                />
              ))}
          </div>
        </div>

        {endContent}
      </div>

      {name && (
        <input type="hidden" name={name} value={isRange ? currentArray.join(",") : currentArray[0]} readOnly />
      )}
    </div>
  );
});
