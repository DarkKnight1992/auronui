import { useCallback, useMemo, type FormEvent, type ReactNode } from "react";
import { useWatch, type FieldErrors, type FieldValues } from "react-hook-form";
import { composeClassName, type ClassValue } from "../../utils";
import { FormContextProvider, type ValidationMode } from "./form.context";
import { useForm, type UseFormOptions } from "./useForm";
import type { UseFormReturn } from "react-hook-form";

/**
 * Flattens react-hook-form's nested `FieldErrors` tree into a flat,
 * dotted-path `Record<string, string>` (e.g. `"contacts.0.email"`,
 * `"contacts.root"`) — mirrors the flat error map shape the Vue port's
 * `onInvalid`/`errors` slot prop exposed, since RHF's own tree shape isn't
 * a drop-in match for that flat contract.
 */
function flattenErrors(errors: FieldErrors, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(errors)) {
    if (!value || typeof value !== "object") continue;
    const path = prefix ? `${prefix}.${key}` : key;
    const node = value as Record<string, unknown>;
    if (typeof node.message === "string" && node.message) {
      result[path] = node.message;
    }
    for (const [childKey, childValue] of Object.entries(node)) {
      if (childKey === "type" || childKey === "message" || childKey === "ref" || childKey === "types") continue;
      if (childValue && typeof childValue === "object") {
        Object.assign(result, flattenErrors({ [childKey]: childValue } as FieldErrors, path));
      }
    }
  }
  return result;
}

export interface FormRenderProps<TValues extends FieldValues = FieldValues> {
  values: TValues;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitCount: number;
  isDisabled: boolean;
  isValid: boolean;
  isDirty: boolean;
  isTouched: boolean;
  errors: Record<string, string>;
  getValues: () => TValues;
  setValue: (name: string, value: unknown) => void;
  setErrors: (errors: Record<string, string>) => void;
  setError: (name: string, message: string) => void;
  clearErrors: (name?: string) => void;
  trigger: (name?: string) => Promise<boolean>;
  reset: () => void;
}

export interface FormProps<TValues extends FieldValues = FieldValues> {
  /** External form handle from useForm(). When provided, Form uses it instead of creating its own. */
  form?: UseFormReturn<TValues>;
  /** Centralized default values. Field-level defaultValue prop wins if both set. */
  defaultValues?: UseFormOptions<TValues>["defaultValues"];
  validationMode?: ValidationMode;
  isDisabled?: boolean;
  className?: ClassValue;
  onSubmit?: (payload: {
    values: TValues;
    setErrors: (errors: Record<string, string>) => void;
  }) => void | Promise<void>;
  onInvalid?: (errors: Record<string, string>) => void;
  onReset?: () => void;
  children?: ReactNode | ((props: FormRenderProps<TValues>) => ReactNode);
}

export function Form<TValues extends FieldValues = FieldValues>({
  form: externalForm,
  defaultValues,
  validationMode = "on-submit",
  isDisabled = false,
  className,
  onSubmit,
  onInvalid,
  onReset,
  children,
}: FormProps<TValues>) {
  // Always call useForm (rules-of-hooks) — the resulting instance is simply
  // discarded when an external `form` handle is supplied, mirroring the Vue
  // port's `props.form ?? createFormState()` contract.
  const internalForm = useForm<TValues>({ defaultValues, validationMode });
  const form = externalForm ?? internalForm;

  const setErrors = useCallback(
    (errors: Record<string, string>) => {
      for (const [name, message] of Object.entries(errors)) {
        form.setError(name as never, { type: "manual", message });
      }
    },
    [form],
  );

  const setError = useCallback(
    (name: string, message: string) => form.setError(name as never, { type: "manual", message }),
    [form],
  );

  const clearErrors = useCallback(
    (name?: string) => form.clearErrors(name as never),
    [form],
  );

  const trigger = useCallback((name?: string) => form.trigger(name as never), [form]);

  const reset = useCallback(() => {
    form.reset();
    onReset?.();
  }, [form, onReset]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const validRegisteredFields = await form.trigger();
      const errors = flattenErrors(form.formState.errors);
      if (!validRegisteredFields || Object.keys(errors).length > 0) {
        onInvalid?.(errors);
        return;
      }
      await onSubmit?.({ values: form.getValues(), setErrors });
    },
    [form, onInvalid, onSubmit, setErrors],
  );

  const handleReset = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      reset();
    },
    [reset],
  );

  const contextValue = useMemo(
    () => ({ form: form as UseFormReturn<FieldValues>, validationMode, isDisabled }),
    [form, validationMode, isDisabled],
  );

  // Reactive nested values snapshot — mirrors the Vue port's `values` computed.
  const watchedValues = useWatch({ control: form.control }) as TValues;
  const flatErrors = flattenErrors(form.formState.errors);
  const isTouched = Object.keys(form.formState.touchedFields).length > 0;

  const renderProps: FormRenderProps<TValues> = {
    values: watchedValues ?? form.getValues(),
    isSubmitting: form.formState.isSubmitting,
    isSubmitted: form.formState.isSubmitted,
    submitCount: form.formState.submitCount,
    isDisabled,
    isValid: Object.keys(flatErrors).length === 0,
    isDirty: form.formState.isDirty,
    isTouched,
    errors: flatErrors,
    getValues: () => form.getValues(),
    setValue: (name, value) => form.setValue(name as never, value as never, { shouldDirty: true, shouldTouch: true }),
    setErrors,
    setError,
    clearErrors,
    trigger,
    reset,
  };

  return (
    <FormContextProvider value={contextValue}>
      <form className={composeClassName(className)} noValidate onSubmit={handleSubmit} onReset={handleReset}>
        {typeof children === "function" ? children(renderProps) : children}
      </form>
    </FormContextProvider>
  );
}
