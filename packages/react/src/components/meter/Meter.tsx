/**
 * Meter — A quantity indicator within a known range.
 *
 * Implementation note: Although HTML provides a native <meter> element, it is
 * notoriously difficult to style cross-browser and does NOT reliably expose the
 * ARIA `meter` role to all assistive technologies. This component therefore uses
 * a <div role="meter"> with explicit aria-valuenow / aria-valuemin / aria-valuemax
 * attributes, matching the Vue port's approach (and React Aria's useMeter → div-based).
 * This is fully compliant with the ARIA 1.1 specification.
 */
import { forwardRef, useMemo, type ComponentPropsWithoutRef } from "react";
import { meterVariants, type MeterVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface MeterOwnProps {
  value?: number;
  minValue?: number;
  maxValue?: number;
  label?: string;
  valueLabel?: string;
  showValueLabel?: boolean;
  formatOptions?: Intl.NumberFormatOptions;
  size?: MeterVariants["size"];
  color?: MeterVariants["color"];
  className?: ClassValue;
  classNames?: Partial<{
    base: ClassValue;
    label: ClassValue;
    output: ClassValue;
    track: ClassValue;
    fill: ClassValue;
  }>;
}

export type MeterProps = MeterOwnProps & Omit<ComponentPropsWithoutRef<"div">, keyof MeterOwnProps>;

export const Meter = forwardRef<HTMLDivElement, MeterProps>(function Meter(
  {
    value = 0,
    minValue = 0,
    maxValue = 100,
    label,
    valueLabel,
    showValueLabel = false,
    formatOptions,
    size,
    color,
    className,
    classNames,
    ...rest
  },
  ref,
) {
  const percentage = useMemo(() => {
    const raw = ((value - minValue) / (maxValue - minValue)) * 100;
    return Math.min(100, Math.max(0, raw));
  }, [value, minValue, maxValue]);

  const formattedValue = useMemo(() => {
    if (valueLabel) return valueLabel;
    if (formatOptions) {
      return new Intl.NumberFormat(undefined, formatOptions).format(value);
    }
    return `${Math.round(percentage)}%`;
  }, [valueLabel, formatOptions, value, percentage]);

  const slotFns = useMemo(() => meterVariants({ size, color }), [size, color]);

  return (
    <div ref={ref} className={composeClassName(slotFns.base(), className, classNames?.base)} {...rest}>
      {label && (
        <span data-slot="label" className={composeClassName(slotFns.label(), classNames?.label)}>
          {label}
        </span>
      )}
      {showValueLabel && (
        <output className={composeClassName(slotFns.output(), classNames?.output)}>{formattedValue}</output>
      )}
      <div
        role="meter"
        aria-valuenow={value}
        aria-valuemin={minValue}
        aria-valuemax={maxValue}
        aria-valuetext={formattedValue}
        aria-label={label || "Meter"}
        className={composeClassName(slotFns.track(), classNames?.track)}
      >
        <div className={composeClassName(slotFns.fill(), classNames?.fill)} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
});
