import { useForm as useRHFForm, type FieldValues, type UseFormProps, type UseFormReturn } from "react-hook-form";
import type { ValidationMode } from "./form.context";

const MODE_MAP: Record<ValidationMode, "onSubmit" | "onBlur" | "onChange"> = {
  "on-submit": "onSubmit",
  "on-blur": "onBlur",
  "on-change": "onChange",
};

export interface UseFormOptions<TValues extends FieldValues = FieldValues>
  extends Omit<UseFormProps<TValues>, "mode" | "reValidateMode"> {
  /** Maps to react-hook-form's `mode` — when a field first validates. */
  validationMode?: ValidationMode;
}

/**
 * Thin wrapper around react-hook-form's own `useForm`. Unlike the Vue port
 * (which hand-rolled the entire field/value/error state machine in
 * form.state.ts), the React port leans on react-hook-form directly for
 * value storage, dirty/touched tracking, and error state — this wrapper
 * only translates Auron's `validationMode` vocabulary ('on-submit' |
 * 'on-blur' | 'on-change') into RHF's `mode`, and fixes `reValidateMode`
 * to `'onChange'` (RHF's own default) — which is what gives every mode
 * the "once a field has errored, clear the error as soon as the user
 * types a fix" behavior the Vue port implemented by hand via a
 * `hasBeenInvalid` flag.
 */
export function useForm<TValues extends FieldValues = FieldValues>(
  options: UseFormOptions<TValues> = {},
): UseFormReturn<TValues> {
  const { validationMode = "on-submit", ...rest } = options;
  return useRHFForm<TValues>({
    mode: MODE_MAP[validationMode],
    reValidateMode: "onChange",
    ...rest,
  });
}
