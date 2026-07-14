import { forwardRef, useId, useMemo, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { inputGroupVariants, type InputGroupVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { FieldLabel } from "../_shared/FieldLabel";
import { FormFieldHelper } from "../_shared/FormFieldHelper";
import { useFormField } from "../../hooks";
import { InputGroupProvider } from "./input-group.context";

/**
 * InputGroup — generic bordered box that visually merges arbitrary content
 * (icons, buttons, an InputGroupInput) into a single field-styled unit.
 *
 * Mirrors @auronui/vue's InputGroup.vue: owns label/description/errorMessage
 * (via the same useFormField machinery Input uses) and exposes the
 * generated field id + aria-describedby through context so a contained
 * InputGroupInput wires itself up automatically.
 *
 * Label is always rendered outside (above the box) — there's no "inside
 * floating label" mode, since that only makes sense for a single owned
 * <input>, not an arbitrary collection of addons/inputs.
 */

export interface InputGroupOwnProps {
  /** Visual style of the group. @default 'flat' */
  variant?: InputGroupVariants["variant"];
  /** Field height. @default 'md' */
  size?: InputGroupVariants["size"];
  /** Accent color applied to the focus ring. @default 'default' */
  color?: InputGroupVariants["color"];
  /** Marks the group as invalid. Triggers danger styling and enables `errorMessage`. @default false */
  isInvalid?: boolean;
  /** Disables the group and everything inside it. @default false */
  isDisabled?: boolean;
  /** Adds a required asterisk next to the label. @default false */
  isRequired?: boolean;
  /** Stretches the group to 100% width. @default false */
  fullWidth?: boolean;
  /** Label rendered above the box. */
  label?: string;
  /** Helper text displayed below the box. Suppressed when `isInvalid && errorMessage` is shown. */
  description?: string;
  /** Error text displayed below the box. Only rendered when `isInvalid` is also true. Takes precedence over `description`. */
  errorMessage?: string;
  /** Extra classes merged onto the box. */
  className?: ClassValue;
  /** Per-slot class overrides. */
  classNames?: Partial<{
    root: ClassValue;
    base: ClassValue;
    label: ClassValue;
    helperWrapper: ClassValue;
    description: ClassValue;
    errorMessage: ClassValue;
  }>;
  children?: ReactNode;
}

export type InputGroupProps = InputGroupOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof InputGroupOwnProps | "color">;

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(function InputGroup(
  {
    variant = "flat",
    size = "md",
    color = "default",
    isInvalid = false,
    isDisabled = false,
    isRequired = false,
    fullWidth = false,
    label,
    description,
    errorMessage,
    className,
    classNames,
    children,
    ...rest
  },
  ref,
) {
  const generatedId = useId();

  const { descriptionId, errorMessageId, showError, showDescription, hasHelper, ariaDescribedBy, hasLabel, rootDataAttrs } =
    useFormField({
      fieldId: generatedId,
      label,
      description,
      errorMessage,
      isInvalid,
      isDisabled,
      isReadOnly: false,
      isRequired,
      labelPlacement: "outside",
    });

  const slotFns = useMemo(
    () => inputGroupVariants({ variant, size, color, fullWidth }),
    [variant, size, color, fullWidth],
  );

  const contextValue = useMemo(
    () => ({
      size,
      isInvalid,
      isDisabled,
      fieldId: generatedId,
      ariaDescribedBy,
    }),
    [size, isInvalid, isDisabled, generatedId, ariaDescribedBy],
  );

  return (
    <div
      {...rest}
      ref={ref}
      className={composeClassName(slotFns.root(), classNames?.root)}
      data-slot="input-group-root"
      {...rootDataAttrs}
    >
      {hasLabel && (
        <FieldLabel
          htmlFor={generatedId}
          label={label}
          isRequired={isRequired}
          className={composeClassName(slotFns.label(), classNames?.label)}
        />
      )}
      <div
        className={composeClassName(slotFns.base(), className, classNames?.base)}
        data-slot="input-group"
        data-invalid={isInvalid || undefined}
        data-disabled={isDisabled || undefined}
      >
        <InputGroupProvider value={contextValue}>{children}</InputGroupProvider>
      </div>
      <FormFieldHelper
        hasHelper={hasHelper}
        showError={showError}
        showDescription={showDescription}
        errorMessage={errorMessage}
        description={description}
        errorMessageId={errorMessageId}
        descriptionId={descriptionId}
        wrapperClassName={composeClassName(slotFns.helperWrapper(), classNames?.helperWrapper)}
        errorClassName={composeClassName(slotFns.errorMessage(), classNames?.errorMessage)}
        descriptionClassName={composeClassName(slotFns.description(), classNames?.description)}
      />
    </div>
  );
});
