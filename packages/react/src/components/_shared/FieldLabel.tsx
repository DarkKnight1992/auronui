export interface FieldLabelProps {
  htmlFor: string;
  label?: string;
  isRequired?: boolean;
  /** Already-composed class string (run through composeClassName by the caller). */
  className?: string;
  /**
   * Optional id on the rendered label element itself — needed when a
   * consumer (e.g. a non-native widget root) points `aria-labelledby` at
   * this label instead of relying solely on `for`/`id` association.
   */
  id?: string;
}

/**
 * Presentational label used by every form-field component (Input, Textarea,
 * InputGroup, SearchField, …). Mirrors the Vue package's FieldLabel.vue.
 */
export function FieldLabel({ htmlFor, label, isRequired, className, id }: FieldLabelProps) {
  if (!label) return null;

  return (
    <label id={id} htmlFor={htmlFor} className={className}>
      {label}
      {isRequired && <span aria-hidden="true"> *</span>}
    </label>
  );
}
