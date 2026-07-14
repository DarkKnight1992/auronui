import {
  forwardRef,
  useMemo,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type FocusEvent,
  type KeyboardEvent,
  type MutableRefObject,
} from "react";
import { editableVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { DEFAULT_EDITABLE_CONTEXT, useEditableContext } from "./editable.context";

export interface EditableInputOwnProps {
  className?: ClassValue;
}

export type EditableInputProps = EditableInputOwnProps &
  Omit<ComponentPropsWithoutRef<"input">, keyof EditableInputOwnProps>;

/**
 * The actual text input, shown only while the Editable is in "edit" state.
 * Commits per the parent's `submitMode` (blur / Enter / both / none) and
 * always cancels on Escape.
 */
export const EditableInput = forwardRef<HTMLInputElement, EditableInputProps>(function EditableInput(
  { className, onChange, onKeyDown, onBlur, ...rest },
  forwardedRef,
) {
  const ctx = useEditableContext(DEFAULT_EDITABLE_CONTEXT);
  const slotFns = useMemo(() => editableVariants(), []);

  if (!ctx.isEditing) return null;

  const editPlaceholder = typeof ctx.placeholder === "string" ? ctx.placeholder : ctx.placeholder?.edit;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    ctx.setInputValue(event.target.value);
    onChange?.(event);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && (ctx.submitMode === "enter" || ctx.submitMode === "both")) {
      event.preventDefault();
      ctx.submit();
    } else if (event.key === "Escape") {
      event.preventDefault();
      ctx.cancel();
    }
    onKeyDown?.(event);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    // Mirrors reka-ui's pointerdown-outside/focus-outside dismissal: only
    // treat this as "leaving the field" (and thus commit on blur) when
    // focus is moving OUTSIDE the whole Editable root — not when it's
    // moving to a sibling trigger button (Submit/Cancel/Edit) inside the
    // same root, which would otherwise always win the race against that
    // button's own click handler.
    const root = (event.currentTarget as HTMLElement).closest('[data-slot="editable-root"]');
    const next = event.relatedTarget as Node | null;
    const stillInside = !!(root && next && root.contains(next));
    if (!stillInside && (ctx.submitMode === "blur" || ctx.submitMode === "both")) {
      ctx.submit();
    }
    onBlur?.(event);
  }

  return (
    <input
      {...rest}
      ref={(node) => {
        (ctx.inputRef as MutableRefObject<HTMLInputElement | null>).current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      }}
      id={ctx.inputId}
      value={ctx.value}
      placeholder={editPlaceholder}
      maxLength={ctx.maxLength}
      disabled={ctx.isDisabled || undefined}
      readOnly={ctx.isReadOnly || undefined}
      className={composeClassName(slotFns.input(), className)}
      data-slot="editable-input"
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    />
  );
});
