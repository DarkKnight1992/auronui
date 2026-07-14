import { createContext, useContext } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

export type ValidationMode = "on-submit" | "on-blur" | "on-change";

export type { FieldRules, CustomValidator, ValidationContext } from "./validation";

/**
 * Auron's own thin context layered on top of react-hook-form's `control`.
 *
 * Unlike the Vue port (which hand-built a full field/value/error state
 * machine in form.state.ts), the React port delegates value storage,
 * dirty/touched tracking, and error storage entirely to react-hook-form's
 * `UseFormReturn` — this context only carries the two Auron-specific
 * concepts RHF doesn't have: a declarative `validationMode` (mapped to
 * RHF's `mode`/`reValidateMode`) and a form-wide `isDisabled` flag that
 * every `FormField` reads to disable its rendered control.
 */
export interface FormContextValue<TValues extends FieldValues = FieldValues> {
  form: UseFormReturn<TValues>;
  validationMode: ValidationMode;
  isDisabled: boolean;
}

const FormContext = createContext<FormContextValue<FieldValues> | null>(null);

export const FormContextProvider = FormContext.Provider;

/**
 * Read the nearest Form context. Returns null when called outside a
 * <Form> — callers (FormField, FormFieldArray) handle standalone mode
 * themselves, mirroring the Vue port's `useFormInject()` contract.
 */
export function useFormInject<TValues extends FieldValues = FieldValues>(): FormContextValue<TValues> | null {
  return useContext(FormContext) as FormContextValue<TValues> | null;
}
