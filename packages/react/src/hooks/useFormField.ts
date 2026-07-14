export interface UseFormFieldInput {
  fieldId: string;
  label: string | undefined;
  description: string | undefined;
  errorMessage: string | undefined;
  isInvalid: boolean;
  isDisabled: boolean;
  isReadOnly: boolean;
  isRequired: boolean;
  labelPlacement: "inside" | "outside" | "outside-left";
}

export interface UseFormFieldReturn {
  descriptionId: string;
  errorMessageId: string;
  showError: boolean;
  showDescription: boolean;
  hasHelper: boolean;
  ariaDescribedBy: string | undefined;
  hasLabel: boolean;
  showOutsideLabel: boolean;
  showInsideLabel: boolean;
  rootDataAttrs: Record<string, boolean | undefined>;
}

/**
 * Shared "labelled field with helper/error" state machine used by every
 * form-field component (Input, Textarea, Select, Autocomplete, and the
 * date/time field family). Centralizes description/error precedence,
 * aria-describedby wiring, label-placement visibility, and the field's
 * 6 root data-attributes.
 *
 * Unlike the Vue version — whose inputs are getters (`() => value`) so its
 * `computed`s stay reactive to prop changes — this hook takes plain values.
 * React components already re-run their whole function body (and therefore
 * this hook) on every re-render, so there is no reactivity gap to bridge
 * with getters; the derived values below are just recomputed inline each call.
 */
export function useFormField(input: UseFormFieldInput): UseFormFieldReturn {
  const descriptionId = `${input.fieldId}-description`;
  const errorMessageId = `${input.fieldId}-error`;
  const showError = input.isInvalid && !!input.errorMessage;
  const showDescription = !!input.description && !showError;
  const hasHelper = showError || showDescription;
  const ariaDescribedBy = showError ? errorMessageId : showDescription ? descriptionId : undefined;
  const hasLabel = !!input.label;
  const showOutsideLabel = hasLabel && input.labelPlacement !== "inside";
  const showInsideLabel = hasLabel && input.labelPlacement === "inside";
  const rootDataAttrs: Record<string, boolean | undefined> = {
    "data-invalid": input.isInvalid || undefined,
    "data-disabled": input.isDisabled || undefined,
    "data-readonly": input.isReadOnly || undefined,
    "data-required": input.isRequired || undefined,
    "data-has-label": hasLabel || undefined,
    "data-has-helper": hasHelper || undefined,
  };

  return {
    descriptionId,
    errorMessageId,
    showError,
    showDescription,
    hasHelper,
    ariaDescribedBy,
    hasLabel,
    showOutsideLabel,
    showInsideLabel,
    rootDataAttrs,
  };
}
