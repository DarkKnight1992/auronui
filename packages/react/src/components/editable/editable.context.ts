import type { RefObject } from "react";
import { createStrictContext } from "../../utils";

export interface EditableContextValue {
  value: string;
  isEditing: boolean;
  isDisabled: boolean;
  isReadOnly: boolean;
  placeholder: string | { edit?: string; preview?: string } | undefined;
  maxLength: number | undefined;
  selectOnFocus: boolean;
  activationMode: "focus" | "dblclick" | "none";
  submitMode: "blur" | "enter" | "none" | "both";
  inputId: string | undefined;
  inputRef: RefObject<HTMLInputElement | null>;
  setInputValue: (next: string) => void;
  edit: () => void;
  submit: () => void;
  cancel: () => void;
}

export const DEFAULT_EDITABLE_CONTEXT: EditableContextValue = {
  value: "",
  isEditing: false,
  isDisabled: false,
  isReadOnly: false,
  placeholder: undefined,
  maxLength: undefined,
  selectOnFocus: false,
  activationMode: "focus",
  submitMode: "blur",
  inputId: undefined,
  inputRef: { current: null },
  setInputValue: () => {},
  edit: () => {},
  submit: () => {},
  cancel: () => {},
};

export const {
  Provider: EditableProvider,
  useStrictContext: useEditableContext,
} = createStrictContext<EditableContextValue>("Editable");
