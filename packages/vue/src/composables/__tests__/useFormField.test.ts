import { describe, it, expect } from "vitest";
import { ref } from "vue";
import { useFormField } from "../useFormField";

describe("useFormField", () => {
  it("derives descriptionId and errorMessageId from fieldId", () => {
    const result = useFormField({
      fieldId: () => "my-field",
      label: () => undefined,
      description: () => undefined,
      errorMessage: () => undefined,
      isInvalid: () => false,
      isDisabled: () => false,
      isReadOnly: () => false,
      isRequired: () => false,
      labelPlacement: () => "inside",
    });
    expect(result.descriptionId.value).toBe("my-field-description");
    expect(result.errorMessageId.value).toBe("my-field-error");
  });

  it("shows error only when isInvalid and errorMessage are both set", () => {
    const result = useFormField({
      fieldId: () => "f",
      label: () => undefined,
      description: () => "a description",
      errorMessage: () => "an error",
      isInvalid: () => true,
      isDisabled: () => false,
      isReadOnly: () => false,
      isRequired: () => false,
      labelPlacement: () => "inside",
    });
    expect(result.showError.value).toBe(true);
    expect(result.showDescription.value).toBe(false);
    expect(result.hasHelper.value).toBe(true);
    expect(result.ariaDescribedBy.value).toBe("f-error");
  });

  it("falls back to description when isInvalid is false", () => {
    const result = useFormField({
      fieldId: () => "f",
      label: () => undefined,
      description: () => "a description",
      errorMessage: () => "an error",
      isInvalid: () => false,
      isDisabled: () => false,
      isReadOnly: () => false,
      isRequired: () => false,
      labelPlacement: () => "inside",
    });
    expect(result.showError.value).toBe(false);
    expect(result.showDescription.value).toBe(true);
    expect(result.ariaDescribedBy.value).toBe("f-description");
  });

  it("ariaDescribedBy is undefined when neither error nor description show", () => {
    const result = useFormField({
      fieldId: () => "f",
      label: () => undefined,
      description: () => undefined,
      errorMessage: () => undefined,
      isInvalid: () => false,
      isDisabled: () => false,
      isReadOnly: () => false,
      isRequired: () => false,
      labelPlacement: () => "inside",
    });
    expect(result.hasHelper.value).toBe(false);
    expect(result.ariaDescribedBy.value).toBeUndefined();
  });

  it("hasLabel, showOutsideLabel, showInsideLabel reflect label presence and placement", () => {
    const placement = ref<"inside" | "outside" | "outside-left">("inside");
    const result = useFormField({
      fieldId: () => "f",
      label: () => "My Label",
      description: () => undefined,
      errorMessage: () => undefined,
      isInvalid: () => false,
      isDisabled: () => false,
      isReadOnly: () => false,
      isRequired: () => false,
      labelPlacement: () => placement.value,
    });
    expect(result.hasLabel.value).toBe(true);
    expect(result.showInsideLabel.value).toBe(true);
    expect(result.showOutsideLabel.value).toBe(false);

    placement.value = "outside";
    expect(result.showInsideLabel.value).toBe(false);
    expect(result.showOutsideLabel.value).toBe(true);
  });

  it("hasLabel is false when label is unset, regardless of placement", () => {
    const result = useFormField({
      fieldId: () => "f",
      label: () => undefined,
      description: () => undefined,
      errorMessage: () => undefined,
      isInvalid: () => false,
      isDisabled: () => false,
      isReadOnly: () => false,
      isRequired: () => false,
      labelPlacement: () => "outside",
    });
    expect(result.hasLabel.value).toBe(false);
    expect(result.showOutsideLabel.value).toBe(false);
  });

  it("rootDataAttrs reflects all 6 flags as boolean-or-undefined (Vue attribute-binding convention)", () => {
    const result = useFormField({
      fieldId: () => "f",
      label: () => "L",
      description: () => undefined,
      errorMessage: () => "err",
      isInvalid: () => true,
      isDisabled: () => true,
      isReadOnly: () => false,
      isRequired: () => true,
      labelPlacement: () => "inside",
    });
    expect(result.rootDataAttrs.value).toEqual({
      "data-invalid": true,
      "data-disabled": true,
      "data-readonly": undefined,
      "data-required": true,
      "data-has-label": true,
      "data-has-helper": true,
    });
  });

  it("stays reactive to changes in the underlying getter sources", () => {
    const isInvalid = ref(false);
    const errorMessage = ref<string | undefined>("err");
    const result = useFormField({
      fieldId: () => "f",
      label: () => undefined,
      description: () => undefined,
      errorMessage: () => errorMessage.value,
      isInvalid: () => isInvalid.value,
      isDisabled: () => false,
      isReadOnly: () => false,
      isRequired: () => false,
      labelPlacement: () => "inside",
    });
    expect(result.showError.value).toBe(false);
    isInvalid.value = true;
    expect(result.showError.value).toBe(true);
  });
});
