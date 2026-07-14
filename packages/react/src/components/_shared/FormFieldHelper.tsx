export interface FormFieldHelperProps {
  hasHelper: boolean;
  showError: boolean;
  showDescription: boolean;
  errorMessage?: string;
  description?: string;
  errorMessageId: string;
  descriptionId: string;
  /** Already-composed class strings (run through composeClassName by the caller). */
  wrapperClassName?: string;
  errorClassName?: string;
  descriptionClassName?: string;
  /**
   * Optional `role` for the error message element (e.g. `"alert"` so
   * assistive tech announces it as a live region). Omitted by default to
   * match components that don't set one.
   */
  errorRole?: string;
}

/**
 * Presentational description/error helper used by every form-field
 * component. Mirrors the Vue package's FormFieldHelper.vue.
 */
export function FormFieldHelper({
  hasHelper,
  showError,
  showDescription,
  errorMessage,
  description,
  errorMessageId,
  descriptionId,
  wrapperClassName,
  errorClassName,
  descriptionClassName,
  errorRole,
}: FormFieldHelperProps) {
  if (!hasHelper) return null;

  return (
    <div className={wrapperClassName}>
      {showError ? (
        <div id={errorMessageId} className={errorClassName} role={errorRole}>
          {errorMessage}
        </div>
      ) : showDescription ? (
        <div id={descriptionId} className={descriptionClassName}>
          {description}
        </div>
      ) : null}
    </div>
  );
}
