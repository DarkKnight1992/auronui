import { useEffect, useRef, useState, type ReactNode } from "react";
import { useController, useWatch, type FieldValues } from "react-hook-form";
import { useFormInject, type ValidationMode } from "./form.context";
import { buildRHFValidate, runValidation, type CustomValidator, type FieldRules } from "./validation";

export interface FieldProps {
  name: string;
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  isInvalid: boolean;
  errorMessage: string | undefined;
  isDisabled: boolean;
}

export interface FormFieldRenderProps {
  fieldProps: FieldProps;
  touched: boolean;
  dirty: boolean;
  error: string | undefined;
  isInvalid: boolean;
}

export interface FormFieldProps {
  name: string;
  defaultValue?: unknown;
  rules?: FieldRules;
  validate?: CustomValidator;
  /** Override validation mode for this field. */
  validationMode?: ValidationMode;
  /** Field names whose changes trigger re-validation of this field. */
  deps?: string[];
  children: (props: FormFieldRenderProps) => ReactNode;
}

/**
 * FormField (inside a <Form>) — value/error/dirty/touched storage is fully
 * delegated to react-hook-form's `useController` (the Vue port hand-built
 * all of this in useField.ts; RHF already provides it). The only custom
 * logic layered on top is:
 *   - the FieldRules/CustomValidator → RHF `validate` adapter (validation.ts)
 *   - `deps`: cross-field re-validation via `useWatch` + `trigger()`, since
 *     RHF has no built-in "revalidate me when a sibling changes" primitive
 *   - a field-level `validationMode` override: RHF's `mode`/`reValidateMode`
 *     are form-global, so an explicit per-field override is applied by
 *     manually calling `trigger(name)` after change/blur when this field's
 *     resolved mode differs from timing RHF would apply on its own
 */
export function FormField({ name, defaultValue, rules, validate, validationMode, deps, children }: FormFieldProps) {
  const ctx = useFormInject();

  if (ctx) {
    return (
      <ConnectedFormField
        name={name}
        defaultValue={defaultValue}
        rules={rules}
        validate={validate}
        validationMode={validationMode}
        deps={deps}
      >
        {children}
      </ConnectedFormField>
    );
  }

  return (
    <StandaloneFormField name={name} defaultValue={defaultValue} rules={rules} validate={validate} validationMode={validationMode}>
      {children}
    </StandaloneFormField>
  );
}

function ConnectedFormField({
  name,
  defaultValue,
  rules,
  validate,
  validationMode,
  deps,
  children,
}: FormFieldProps) {
  const ctx = useFormInject<FieldValues>()!;
  const { form } = ctx;
  const effectiveMode = validationMode ?? ctx.validationMode;

  const { field, fieldState } = useController({
    name,
    control: form.control,
    defaultValue: defaultValue as never,
    rules: { validate: buildRHFValidate(rules, validate, () => form.getValues()) },
  });

  // ── deps: revalidate this field when a dependency's value changes ────────
  const depValues = useWatch({ control: form.control, name: deps ?? [] });
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    if (deps?.length) void form.trigger(name as never);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-run only when the watched dep VALUES change, not on every render
  }, [JSON.stringify(depValues)]);

  function handleChange(value: unknown) {
    field.onChange(value);
    if (effectiveMode === "on-change") void form.trigger(name as never);
  }

  function handleBlur() {
    field.onBlur();
    if (effectiveMode === "on-blur") void form.trigger(name as never);
  }

  const fieldProps: FieldProps = {
    name,
    value: field.value,
    onChange: handleChange,
    onBlur: handleBlur,
    isInvalid: !!fieldState.error,
    errorMessage: fieldState.error?.message,
    isDisabled: ctx.isDisabled,
  };

  return (
    <>
      {children({
        fieldProps,
        touched: fieldState.isTouched,
        dirty: fieldState.isDirty,
        error: fieldState.error?.message,
        isInvalid: !!fieldState.error,
      })}
    </>
  );
}

/** Standalone mode (no <Form> ancestor) — local state, no RHF involved, mirrors the Vue port's `!ctx` branch. */
function StandaloneFormField({
  name,
  defaultValue,
  rules,
  validate,
  validationMode = "on-submit",
  children,
}: Omit<FormFieldProps, "deps">) {
  const [value, setValue] = useState<unknown>(defaultValue);
  const [error, setError] = useState<string | undefined>(undefined);
  const [touched, setTouched] = useState(false);
  const hasBeenInvalidRef = useRef(false);

  const dirty = value !== defaultValue;

  async function triggerValidation(val: unknown) {
    const message = await runValidation(val, rules, validate);
    if (message) hasBeenInvalidRef.current = true;
    setError(message);
  }

  function handleChange(val: unknown) {
    setValue(val);
    if (validationMode === "on-change" || hasBeenInvalidRef.current) void triggerValidation(val);
  }

  function handleBlur() {
    setTouched(true);
    if (validationMode === "on-blur") void triggerValidation(value);
  }

  const fieldProps: FieldProps = {
    name,
    value,
    onChange: handleChange,
    onBlur: handleBlur,
    isInvalid: !!error,
    errorMessage: error,
    isDisabled: false,
  };

  return (
    <>
      {children({ fieldProps, touched, dirty, error, isInvalid: !!error })}
    </>
  );
}
