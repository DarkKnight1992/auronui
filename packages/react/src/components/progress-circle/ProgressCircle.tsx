import { forwardRef, useMemo, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { progressCircleVariants, type ProgressCircleVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface ProgressCircleOwnProps {
  value?: number | null;
  minValue?: number;
  maxValue?: number;
  label?: string;
  valueLabel?: string;
  showValueLabel?: boolean;
  formatOptions?: Intl.NumberFormatOptions;
  size?: ProgressCircleVariants["size"];
  color?: ProgressCircleVariants["color"];
  strokeWidth?: number;
  isIndeterminate?: boolean;
  isDisabled?: boolean;
  /** Function to get the accessible label for the current value. */
  getValueLabel?: (value: number | null | undefined, max: number) => string | undefined;
  className?: ClassValue;
  classNames?: Partial<{
    base: ClassValue;
    svg: ClassValue;
    track: ClassValue;
    indicator: ClassValue;
    value: ClassValue;
  }>;
  children?: ReactNode;
}

export type ProgressCircleProps = ProgressCircleOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof ProgressCircleOwnProps>;

export const ProgressCircle = forwardRef<HTMLDivElement, ProgressCircleProps>(function ProgressCircle(
  {
    value,
    minValue = 0,
    maxValue = 100,
    label,
    valueLabel,
    showValueLabel = false,
    formatOptions,
    size,
    color,
    strokeWidth = 3,
    isIndeterminate = false,
    isDisabled = false,
    getValueLabel,
    className,
    classNames,
    children,
    ...rest
  },
  ref,
) {
  const isInd = isIndeterminate || value === null || value === undefined;

  const percentage = useMemo(() => {
    if (isInd) return 0;
    const val = value as number;
    return ((val - minValue) / (maxValue - minValue)) * 100;
  }, [isInd, value, minValue, maxValue]);

  const radius = 16 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = isInd ? circumference * 0.25 : circumference * (1 - percentage / 100);

  const slotFns = useMemo(
    () =>
      progressCircleVariants({
        size,
        color,
        isIndeterminate: isInd,
        isDisabled,
      }),
    [size, color, isInd, isDisabled],
  );

  const formattedValue = useMemo(() => {
    if (valueLabel) return valueLabel;
    if (value === null || value === undefined) return "";
    if (formatOptions) {
      return new Intl.NumberFormat(undefined, formatOptions).format(value);
    }
    return String(Math.round(value as number));
  }, [valueLabel, value, formatOptions]);

  const accessibleValueLabel = getValueLabel?.(isInd ? null : value, maxValue) ?? formattedValue;

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={minValue}
      aria-valuemax={maxValue}
      aria-valuenow={isInd ? undefined : (value as number)}
      aria-valuetext={isInd ? undefined : accessibleValueLabel}
      aria-label={label || "Progress"}
      data-disabled={isDisabled ? "" : undefined}
      className={composeClassName(slotFns.base(), className, classNames?.base)}
      {...rest}
    >
      <svg className={composeClassName(slotFns.svg(), classNames?.svg)} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle
          className={composeClassName(slotFns.track(), classNames?.track)}
          cx={16}
          cy={16}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          className={composeClassName(slotFns.indicator(), classNames?.indicator)}
          cx={16}
          cy={16}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 16 16)"
          style={{ transition: "stroke-dashoffset 300ms ease-out" }}
        />
      </svg>
      {(showValueLabel || label) && (
        <span className={composeClassName(slotFns.value(), classNames?.value)}>
          {children ?? formattedValue}
        </span>
      )}
    </div>
  );
});
