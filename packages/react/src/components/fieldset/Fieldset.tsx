import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { fieldsetVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";

/**
 * Fieldset component — semantic HTML grouping for related form controls.
 *
 * Renders a <fieldset> with an optional <legend> for labeling the group.
 * Fieldset is purely structural and does not participate in form validation
 * directly. Its primary purpose is to group related form controls with
 * correct ARIA semantics for screen readers.
 *
 * Accessibility: <fieldset> + <legend> is the canonical HTML way to associate
 * a group label with its contained controls. Screen readers announce the
 * legend when entering the group.
 *
 * @example
 * <Fieldset legend="Personal Information">
 *   <Input name="firstName" label="First Name" />
 *   <Input name="lastName" label="Last Name" />
 * </Fieldset>
 */
export interface FieldsetOwnProps {
  /** Text content for the <legend> element; omit to render fieldset without a legend */
  legend?: string;
  /** When true, disables all form controls inside this fieldset */
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  className?: ClassValue;
  children?: ReactNode;
}

export type FieldsetProps = FieldsetOwnProps &
  Omit<ComponentPropsWithoutRef<"fieldset">, keyof FieldsetOwnProps>;

export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(function Fieldset(
  { legend, isDisabled, disabled, className, children, ...rest },
  ref,
) {
  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "Fieldset",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );

  const styles = fieldsetVariants();
  const baseClass = composeClassName(styles.base(), className);

  return (
    <fieldset ref={ref} className={baseClass} disabled={resolvedDisabled || undefined} {...rest}>
      {legend !== undefined && <legend className={styles.legend()}>{legend}</legend>}
      {children}
    </fieldset>
  );
});
