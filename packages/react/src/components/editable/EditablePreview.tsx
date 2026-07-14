import { forwardRef, useMemo, type ComponentPropsWithoutRef } from "react";
import { editableVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { DEFAULT_EDITABLE_CONTEXT, useEditableContext } from "./editable.context";

export interface EditablePreviewOwnProps {
  className?: ClassValue;
}

export type EditablePreviewProps = EditablePreviewOwnProps &
  Omit<ComponentPropsWithoutRef<"span">, keyof EditablePreviewOwnProps>;

/**
 * Read-only text display, shown while the Editable is in "preview" state.
 * Activates edit mode via focus or double-click depending on the parent's
 * `activationMode` ('none' disables both).
 *
 * Mirrors reka-ui's EditablePreview exactly: a focusable/dbl-clickable
 * span with no ARIA `role` of its own (the real form control is
 * EditableInput, which only exists in the DOM while editing — giving this
 * preview a `role="textbox"` without an accessible name would be an axe
 * violation, since it's just a display surface, not an input).
 */
export const EditablePreview = forwardRef<HTMLSpanElement, EditablePreviewProps>(function EditablePreview(
  { className, onFocus, onDoubleClick, ...rest },
  ref,
) {
  const ctx = useEditableContext(DEFAULT_EDITABLE_CONTEXT);
  const slotFns = useMemo(() => editableVariants(), []);

  if (ctx.isEditing) return null;

  const previewPlaceholder =
    typeof ctx.placeholder === "string" ? ctx.placeholder : ctx.placeholder?.preview;

  return (
    <span
      {...rest}
      ref={ref}
      tabIndex={ctx.isDisabled ? undefined : 0}
      className={composeClassName(slotFns.preview(), className)}
      data-slot="editable-preview"
      data-placeholder-shown={ctx.value === "" || undefined}
      onFocus={(event) => {
        if (ctx.activationMode === "focus") ctx.edit();
        onFocus?.(event);
      }}
      onDoubleClick={(event) => {
        if (ctx.activationMode === "dblclick") ctx.edit();
        onDoubleClick?.(event);
      }}
    >
      {ctx.value || previewPlaceholder}
    </span>
  );
});
