import { forwardRef, useMemo, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { editableVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { DEFAULT_EDITABLE_CONTEXT, useEditableContext } from "./editable.context";

export interface EditableEditTriggerOwnProps {
  className?: ClassValue;
  children?: ReactNode;
}

export type EditableEditTriggerProps = EditableEditTriggerOwnProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof EditableEditTriggerOwnProps>;

export const EditableEditTrigger = forwardRef<HTMLButtonElement, EditableEditTriggerProps>(
  function EditableEditTrigger({ className, children, onClick, ...rest }, ref) {
    const ctx = useEditableContext(DEFAULT_EDITABLE_CONTEXT);
    const slotFns = useMemo(() => editableVariants(), []);

    if (ctx.isEditing) return null;

    return (
      <button
        {...rest}
        ref={ref}
        type="button"
        className={composeClassName(slotFns.editTrigger(), className)}
        aria-label="Edit"
        disabled={ctx.isDisabled || undefined}
        onClick={(event) => {
          ctx.edit();
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
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
        )}
      </button>
    );
  },
);
