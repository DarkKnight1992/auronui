import type { ReactNode } from "react";
import { Button as RACButton, SelectValue as RACSelectValue } from "react-aria-components";
import { composeClassName, dataAttr, type ClassValue } from "../../utils";
import { useSelectContext } from "./Select.context";

export interface SelectTriggerProps {
  className?: ClassValue;
  classNames?: Partial<{
    trigger: ClassValue;
    label: ClassValue;
    startContent: ClassValue;
  }>;
  startContent?: ReactNode;
  /** Custom chevron/selector icon. */
  selectorIcon?: ReactNode;
  children?: ReactNode;
}

const DEFAULT_CHEVRON = (
  <svg
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
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export function SelectTrigger({ className, classNames, startContent, selectorIcon, children }: SelectTriggerProps) {
  const ctx = useSelectContext();
  const showInsideLabel = ctx.hasLabel && ctx.labelPlacement === "inside";

  return (
    <RACButton
      id={ctx.triggerId}
      className={composeClassName(ctx.slots.trigger(), className, classNames?.trigger)}
      data-filled={dataAttr(ctx.isFilled)}
      data-invalid={dataAttr(ctx.isInvalid)}
      data-readonly={dataAttr(ctx.isReadonly)}
      aria-invalid={ctx.isInvalid || undefined}
      aria-describedby={ctx.ariaDescribedBy}
      isDisabled={ctx.isDisabled}
      data-slot="trigger"
    >
      {showInsideLabel && (
        <span className={composeClassName(ctx.slots.label(), classNames?.label)} data-slot="label">
          {ctx.label}
          {ctx.isRequired && <span aria-hidden="true"> *</span>}
        </span>
      )}
      {startContent && (
        <span className={composeClassName(ctx.slots.startContent(), classNames?.startContent)} data-slot="start-content">
          {startContent}
        </span>
      )}
      {children ?? <RACSelectValue className={ctx.slots.value()} data-slot="value" />}
      <span className={ctx.slots.indicator()} data-slot="select-default-indicator" aria-hidden="true">
        {selectorIcon ?? DEFAULT_CHEVRON}
      </span>
    </RACButton>
  );
}
