import { forwardRef, useMemo, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { editableVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { DEFAULT_EDITABLE_CONTEXT, useEditableContext } from "./editable.context";

export interface EditableSubmitTriggerOwnProps {
  className?: ClassValue;
  children?: ReactNode;
}

export type EditableSubmitTriggerProps = EditableSubmitTriggerOwnProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof EditableSubmitTriggerOwnProps>;

export const EditableSubmitTrigger = forwardRef<HTMLButtonElement, EditableSubmitTriggerProps>(
  function EditableSubmitTrigger({ className, children, onClick, ...rest }, ref) {
    const ctx = useEditableContext(DEFAULT_EDITABLE_CONTEXT);
    const slotFns = useMemo(() => editableVariants(), []);

    if (!ctx.isEditing) return null;

    return (
      <button
        {...rest}
        ref={ref}
        type="button"
        className={composeClassName(slotFns.submitTrigger(), className)}
        aria-label="Save"
        onClick={(event) => {
          ctx.submit();
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
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>
    );
  },
);
