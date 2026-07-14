import { useMemo, useRef, useState, type ReactNode } from "react";
import { DialogTrigger, Button as RACButton, Popover, Dialog } from "react-aria-components";
import { Time, getLocalTimeZone, now as internationalizedNow } from "@internationalized/date";
import { timePickerVariants, type TimeFieldVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { TimeField } from "../time-field";
import { TimeScroller } from "../_shared/TimeScroller";
import { Button } from "../button";

/**
 * TimePicker — a TimeField with a scroller-wheel popover.
 * Ports @auronui/vue's TimePicker.vue (reka-ui Popover + TimeScroller).
 * RAC has no bundled "TimePicker" component (only the bare `TimeField`),
 * so the trigger/popover is composed directly from RAC's `DialogTrigger` +
 * `Popover` + `Dialog` (the same primitives `Calendar`'s popover consumers
 * would use), placed in `TimeField`'s `endContent` slot exactly like the
 * Vue source nests `TimePickerTrigger` inside `DateInput`'s endContent slot.
 */

export interface TimePickerOwnProps {
  variant?: TimeFieldVariants["variant"];
  size?: TimeFieldVariants["size"];
  color?: TimeFieldVariants["color"];
  labelPlacement?: TimeFieldVariants["labelPlacement"];
  fullWidth?: boolean;

  value?: Time | null;
  defaultValue?: Time;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholderValue?: Time;
  minValue?: Time;
  maxValue?: Time;
  locale?: string;
  granularity?: "hour" | "minute" | "second";
  hourCycle?: 12 | 24;
  label?: string;
  description?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  name?: string;
  hideTimeZone?: boolean;
  closeOnSelect?: boolean;
  doneLabel?: string;
  onChange?: (value: Time | null) => void;

  className?: ClassValue;
  classNames?: Partial<{
    base: ClassValue;
    trigger: ClassValue;
    triggerIndicator: ClassValue;
    popover: ClassValue;
    panel: ClassValue;
    timeDone: ClassValue;
    timeField: Partial<{
      label: ClassValue;
      mainWrapper: ClassValue;
      inputWrapper: ClassValue;
      startContent: ClassValue;
      segmentList: ClassValue;
      segment: ClassValue;
      endContent: ClassValue;
      helperWrapper: ClassValue;
      errorMessage: ClassValue;
      description: ClassValue;
    }>;
    timeScroller: Partial<{
      scrollerWrap: ClassValue;
      scrollerColumn: ClassValue;
      scrollerItem: ClassValue;
    }>;
  }>;
  selectorIcon?: ReactNode;
  footer?: (opts: { close: () => void }) => ReactNode;
}

export type TimePickerProps = TimePickerOwnProps;

function DefaultClockIcon({ className }: { className: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function TimePicker({
  variant = "flat",
  size = "md",
  color = "default",
  labelPlacement = "inside",
  fullWidth = false,
  value,
  defaultValue,
  open,
  defaultOpen = false,
  onOpenChange,
  placeholderValue,
  minValue,
  maxValue,
  locale,
  granularity = "minute",
  hourCycle = 24,
  label,
  description,
  errorMessage,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  name,
  hideTimeZone = false,
  closeOnSelect = true,
  doneLabel = "Done",
  onChange,
  className,
  classNames,
  selectorIcon,
  footer,
}: TimePickerProps) {
  void closeOnSelect;

  const _now = internationalizedNow(getLocalTimeZone());
  const [internalValue, setInternalValue] = useState<Time>(() => value ?? defaultValue ?? new Time(_now.hour, _now.minute));
  const lastValueRef = useRef(value);
  if (lastValueRef.current !== value) {
    lastValueRef.current = value;
    // Duck-typed, not `instanceof Time` — react-aria-components resolves its own
    // copy of @internationalized/date, so a value it hands back can be a `Time`
    // from a different module instance than the one imported here.
    if (value && typeof value === "object" && "hour" in value) setInternalValue(value);
  }

  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpenControlled = open !== undefined;
  const isOpen = isOpenControlled ? open : uncontrolledOpen;
  function setOpen(next: boolean) {
    if (!isOpenControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }

  function handleFieldChange(v: Time | null) {
    if (!v || typeof v !== "object" || !("hour" in v)) return;
    setInternalValue(v as Time);
    onChange?.(v as Time);
  }

  function handleScrollerChange(v: Time) {
    setInternalValue(v);
    onChange?.(v);
  }

  const slotFns = useMemo(
    () => timePickerVariants({ isInvalid, isDisabled, fullWidth }),
    [isInvalid, isDisabled, fullWidth],
  );

  return (
    <div className={composeClassName(slotFns.base(), className, classNames?.base)} data-slot="time-picker">
      <TimeField
        variant={variant}
        size={size}
        color={color}
        labelPlacement={labelPlacement}
        fullWidth={fullWidth}
        value={internalValue}
        defaultValue={defaultValue}
        placeholderValue={placeholderValue}
        minValue={minValue}
        maxValue={maxValue}
        granularity={granularity}
        hourCycle={hourCycle}
        locale={locale}
        label={label}
        description={description}
        errorMessage={errorMessage}
        isInvalid={isInvalid}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        isRequired={isRequired}
        name={name}
        hideTimeZone={hideTimeZone}
        classNames={classNames?.timeField}
        onChange={handleFieldChange}
        endContent={
          <DialogTrigger isOpen={isOpen} onOpenChange={setOpen}>
            <RACButton
              className={composeClassName(slotFns.trigger(), classNames?.trigger)}
              aria-label="Open time picker"
              isDisabled={isDisabled}
            >
              {selectorIcon ?? <DefaultClockIcon className={composeClassName(slotFns.triggerIndicator(), classNames?.triggerIndicator)} />}
            </RACButton>
            <Popover className={composeClassName(slotFns.popover(), classNames?.popover)} data-slot="popover">
              <Dialog>
                <div className={composeClassName(slotFns.panel(), classNames?.panel)} data-slot="panel">
                  <TimeScroller
                    value={internalValue}
                    onChange={(v) => handleScrollerChange(v as Time)}
                    granularity={granularity === "hour" ? "minute" : granularity}
                    hourCycle={hourCycle}
                    classNames={classNames?.timeScroller}
                  />

                  <div className={composeClassName(slotFns.timeDone(), classNames?.timeDone)} data-slot="time-done">
                    {footer ? (
                      footer({ close: () => setOpen(false) })
                    ) : (
                      <Button size="sm" color="primary" data-slot="done-button" onClick={() => setOpen(false)}>
                        {doneLabel}
                      </Button>
                    )}
                  </div>
                </div>
              </Dialog>
            </Popover>
          </DialogTrigger>
        }
      />
    </div>
  );
}
