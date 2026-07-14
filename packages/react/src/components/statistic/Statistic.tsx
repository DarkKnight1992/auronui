/**
 * Statistic — single-number KPI/metric display: label + big value +
 * optional prefix/suffix, description, and trend indicator.
 *
 * Pure presentational, no headless primitive involved — matches the
 * complexity level of Meter/ProgressBar, not a compound component.
 *
 * Deviation from the Vue port: the Vue version's loading state reuses the
 * `Skeleton` component, which has not been ported to @auronui/react yet.
 * Until it lands, the loading state renders an inline pulsing placeholder
 * with the same dimensions instead of importing a component that doesn't exist.
 */
import { forwardRef, useMemo, type ComponentPropsWithoutRef } from "react";
import { statisticVariants, type StatisticVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface StatisticOwnProps {
  label: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  description?: string;
  /** Decimal places applied when `value` is a number. */
  precision?: number;
  isLoading?: boolean;
  color?: StatisticVariants["color"];
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: ClassValue;
  classNames?: Partial<{
    base: ClassValue;
    label: ClassValue;
    valueWrapper: ClassValue;
    value: ClassValue;
    affix: ClassValue;
    description: ClassValue;
    trend: ClassValue;
  }>;
}

export type StatisticProps = StatisticOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof StatisticOwnProps>;

export const Statistic = forwardRef<HTMLDivElement, StatisticProps>(function Statistic(
  {
    label,
    value,
    prefix,
    suffix,
    description,
    precision,
    isLoading = false,
    color = "default",
    trend,
    trendValue,
    className,
    classNames,
    ...rest
  },
  ref,
) {
  const formattedValue = useMemo(() => {
    if (typeof value === "number" && precision !== undefined) {
      return value.toFixed(precision);
    }
    return String(value);
  }, [value, precision]);

  const slotFns = useMemo(() => statisticVariants({ color }), [color]);

  return (
    <div
      ref={ref}
      className={composeClassName(slotFns.base(), className, classNames?.base)}
      data-slot="statistic"
      {...rest}
    >
      <span className={composeClassName(slotFns.label(), classNames?.label)} data-slot="statistic-label">
        {label}
      </span>

      {isLoading ? (
        <div
          data-slot="statistic-loading"
          aria-hidden="true"
          className="animate-pulse rounded-md bg-default-200"
          style={{ height: "2.25rem", width: "6rem", borderRadius: "0.375rem" }}
        />
      ) : (
        <div
          className={composeClassName(slotFns.valueWrapper(), classNames?.valueWrapper)}
          data-slot="statistic-value-wrapper"
        >
          {prefix && (
            <span className={composeClassName(slotFns.affix(), classNames?.affix)} data-slot="statistic-prefix">
              {prefix}
            </span>
          )}
          <span className={composeClassName(slotFns.value(), classNames?.value)} data-slot="statistic-value">
            {formattedValue}
          </span>
          {suffix && (
            <span className={composeClassName(slotFns.affix(), classNames?.affix)} data-slot="statistic-suffix">
              {suffix}
            </span>
          )}
          {trend && (
            <span
              className={composeClassName(slotFns.trend(), classNames?.trend)}
              data-slot="statistic-trend"
              data-trend={trend}
            >
              {trend === "up" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 17 17 7M7 7h10v10" />
                </svg>
              )}
              {trend === "down" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 7 17 17M17 7v10H7" />
                </svg>
              )}
              {trend === "neutral" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                </svg>
              )}
              {trendValue && <span>{trendValue}</span>}
            </span>
          )}
        </div>
      )}

      {description && (
        <span
          className={composeClassName(slotFns.description(), classNames?.description)}
          data-slot="statistic-description"
        >
          {description}
        </span>
      )}
    </div>
  );
});
