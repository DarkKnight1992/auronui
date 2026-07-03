import { computed, type ComputedRef } from "vue";

export interface UseFormFieldInput {
  fieldId: () => string;
  label: () => string | undefined;
  description: () => string | undefined;
  errorMessage: () => string | undefined;
  isInvalid: () => boolean;
  isDisabled: () => boolean;
  isReadOnly: () => boolean;
  isRequired: () => boolean;
  labelPlacement: () => "inside" | "outside" | "outside-left";
}

export interface UseFormFieldReturn {
  descriptionId: ComputedRef<string>;
  errorMessageId: ComputedRef<string>;
  showError: ComputedRef<boolean>;
  showDescription: ComputedRef<boolean>;
  hasHelper: ComputedRef<boolean>;
  ariaDescribedBy: ComputedRef<string | undefined>;
  hasLabel: ComputedRef<boolean>;
  showOutsideLabel: ComputedRef<boolean>;
  showInsideLabel: ComputedRef<boolean>;
  rootDataAttrs: ComputedRef<Record<string, boolean | undefined>>;
}

/**
 * Shared "labelled field with helper/error" state machine used by every
 * form-field component (Input, Textarea, Select, Autocomplete, and the
 * date/time field family). Centralizes description/error precedence,
 * aria-describedby wiring, label-placement visibility, and the field's
 * 6 root data-attributes.
 *
 * All inputs are getters — not passed by value — so the returned computeds
 * stay reactive. `fieldId` must be the caller's already-resolved field id
 * (the one that honors a caller-supplied `id` attribute), never a raw
 * internal id generator, or aria-describedby silently stops tracking an
 * overridden `id`.
 */
export function useFormField(input: UseFormFieldInput): UseFormFieldReturn {
  const descriptionId = computed(() => `${input.fieldId()}-description`);
  const errorMessageId = computed(() => `${input.fieldId()}-error`);
  const showError = computed(() => input.isInvalid() && !!input.errorMessage());
  const showDescription = computed(() => !!input.description() && !showError.value);
  const hasHelper = computed(() => showError.value || showDescription.value);
  const ariaDescribedBy = computed<string | undefined>(() => {
    if (showError.value) return errorMessageId.value;
    if (showDescription.value) return descriptionId.value;
    return undefined;
  });
  const hasLabel = computed(() => !!input.label());
  const showOutsideLabel = computed(() => hasLabel.value && input.labelPlacement() !== "inside");
  const showInsideLabel = computed(() => hasLabel.value && input.labelPlacement() === "inside");
  const rootDataAttrs = computed<Record<string, boolean | undefined>>(() => ({
    "data-invalid": input.isInvalid() || undefined,
    "data-disabled": input.isDisabled() || undefined,
    "data-readonly": input.isReadOnly() || undefined,
    "data-required": input.isRequired() || undefined,
    "data-has-label": hasLabel.value || undefined,
    "data-has-helper": hasHelper.value || undefined,
  }));

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
