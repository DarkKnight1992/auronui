import { forwardRef, useMemo, type ComponentPropsWithoutRef } from "react";
import { inputGroupVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { DEFAULT_INPUT_GROUP_CONTEXT, useInputGroupContext } from "./input-group.context";

/**
 * InputGroupInput — bare native <input>, borderless and transparent so it
 * visually merges into its parent InputGroup's box. Not meant to be used
 * standalone (use Input for a self-contained field); this is the "use
 * AuronUI, not raw HTML" answer specifically for InputGroup's own <input>.
 *
 * Adopts the parent InputGroup's generated field id and aria-describedby
 * (pointing at its label/description/error) automatically — the same
 * wiring Input.tsx does internally for its own single owned <input>, just
 * split across two components here since InputGroup can hold more than one
 * input-like child. An explicit `id` or `aria-describedby` prop always
 * wins over the inherited one.
 */

export interface InputGroupInputOwnProps {
  /** Overrides the parent InputGroup's isDisabled for this input specifically. */
  isDisabled?: boolean;
  className?: ClassValue;
}

export type InputGroupInputProps = InputGroupInputOwnProps &
  Omit<ComponentPropsWithoutRef<"input">, keyof InputGroupInputOwnProps>;

export const InputGroupInput = forwardRef<HTMLInputElement, InputGroupInputProps>(function InputGroupInput(
  { type = "text", id, "aria-describedby": ariaDescribedByProp, isDisabled, className, ...rest },
  ref,
) {
  const ctx = useInputGroupContext(DEFAULT_INPUT_GROUP_CONTEXT);

  const resolvedIsDisabled = isDisabled ?? ctx.isDisabled;
  const inputId = id ?? ctx.fieldId;
  const ariaDescribedBy = ariaDescribedByProp ?? ctx.ariaDescribedBy;
  const slotFns = useMemo(() => inputGroupVariants({ size: ctx.size }), [ctx.size]);

  return (
    <input
      {...rest}
      ref={ref}
      id={inputId}
      type={type}
      disabled={resolvedIsDisabled || undefined}
      aria-invalid={ctx.isInvalid || undefined}
      aria-describedby={ariaDescribedBy}
      className={composeClassName(slotFns.input(), className)}
      data-slot="input-group-input"
    />
  );
});
