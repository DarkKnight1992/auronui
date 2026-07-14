import { forwardRef, useMemo, type ComponentPropsWithoutRef, type CSSProperties } from "react";
import { progressBarVariants, type ProgressBarVariants } from "@auronui/styles";
import { composeClassName, dataAttr, type ClassValue } from "../../utils";

export interface ProgressBarOwnProps {
  value?: number | null;
  minValue?: number;
  maxValue?: number;
  label?: string;
  valueLabel?: string;
  showValueLabel?: boolean;
  formatOptions?: Intl.NumberFormatOptions;
  size?: ProgressBarVariants["size"];
  color?: ProgressBarVariants["color"];
  radius?: ProgressBarVariants["radius"];
  isStriped?: boolean;
  isIndeterminate?: boolean;
  isDisabled?: boolean;
  /** Function to get the accessible label for the current value. */
  getValueLabel?: (value: number | null | undefined, max: number) => string | undefined;
  className?: ClassValue;
  classNames?: Partial<{
    base: ClassValue;
    labelWrapper: ClassValue;
    label: ClassValue;
    value: ClassValue;
    track: ClassValue;
    indicator: ClassValue;
  }>;
}

export type ProgressBarProps = ProgressBarOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof ProgressBarOwnProps>;

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(function ProgressBar(
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
    radius,
    isStriped = false,
    isIndeterminate = false,
    isDisabled = false,
    getValueLabel,
    className,
    classNames,
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

  const slotFns = useMemo(
    () =>
      progressBarVariants({
        size,
        color,
        radius,
        isStriped,
        isIndeterminate: isInd,
        isDisabled,
      }),
    [size, color, radius, isStriped, isInd, isDisabled],
  );

  const formattedValue = useMemo(() => {
    if (valueLabel) return valueLabel;
    if (value === null || value === undefined) return "";
    if (formatOptions) {
      return new Intl.NumberFormat(undefined, formatOptions).format(value);
    }
    return `${Math.round(percentage)}%`;
  }, [valueLabel, value, formatOptions, percentage]);

  const accessibleValueLabel = getValueLabel?.(isInd ? null : value, maxValue) ?? formattedValue;

  const style = isInd
    ? undefined
    : ({ "--progress-bar-value": `${percentage}%` } as CSSProperties);

  return (
    <div
      ref={ref}
      className={composeClassName(slotFns.base(), className, classNames?.base)}
      data-disabled={isDisabled ? "" : undefined}
      style={style}
      {...rest}
    >
      {(label || showValueLabel) && (
        <div className={composeClassName(slotFns.labelWrapper(), classNames?.labelWrapper)}>
          {label && <span className={composeClassName(slotFns.label(), classNames?.label)}>{label}</span>}
          {showValueLabel && (
            <span className={composeClassName(slotFns.value(), classNames?.value)}>{formattedValue}</span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuemin={minValue}
        aria-valuemax={maxValue}
        aria-valuenow={isInd ? undefined : (value as number)}
        aria-valuetext={isInd ? undefined : accessibleValueLabel}
        aria-label={label || "Progress"}
        data-disabled={dataAttr(isDisabled)}
        className={composeClassName(slotFns.track(), classNames?.track)}
      >
        <div className={composeClassName(slotFns.indicator(), classNames?.indicator)} />
      </div>
    </div>
  );
});
