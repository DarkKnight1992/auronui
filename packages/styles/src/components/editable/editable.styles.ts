import type {VariantProps} from "../../utils";

import {tv} from "tailwind-variants";

export const editableVariants = tv({
  slots: {
    /** Root container */
    base: "editable",
    /** Area wrapping both preview and input */
    area: "editable__area",
    /** Read-only text display */
    preview: "editable__preview",
    /** Editable text input */
    input: "editable__input",
    /** Edit (pencil) trigger button */
    editTrigger: "editable__edit-trigger",
    /** Submit (checkmark) trigger button */
    submitTrigger: "editable__submit-trigger",
    /** Cancel (×) trigger button */
    cancelTrigger: "editable__cancel-trigger",
  },
});

export type EditableVariants = VariantProps<typeof editableVariants>;
