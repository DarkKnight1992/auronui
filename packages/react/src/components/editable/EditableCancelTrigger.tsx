import { forwardRef, useMemo, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { editableVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { DEFAULT_EDITABLE_CONTEXT, useEditableContext } from "./editable.context";

export interface EditableCancelTriggerOwnProps {
  className?: ClassValue;
  children?: ReactNode;
}

export type EditableCancelTriggerProps = EditableCancelTriggerOwnProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof EditableCancelTriggerOwnProps>;

export const EditableCancelTrigger = forwardRef<HTMLButtonElement, EditableCancelTriggerProps>(
  function EditableCancelTrigger({ className, children, onClick, ...rest }, ref) {
    const ctx = useEditableContext(DEFAULT_EDITABLE_CONTEXT);
    const slotFns = useMemo(() => editableVariants(), []);

    if (!ctx.isEditing) return null;

    return (
      <button
        {...rest}
        ref={ref}
        type="button"
        className={composeClassName(slotFns.cancelTrigger(), className)}
        aria-label="Cancel"
        onClick={(event) => {
          ctx.cancel();
          onClick?.(event);
        }}
      >
        {children ?? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        )}
      </button>
    );
  },
);
