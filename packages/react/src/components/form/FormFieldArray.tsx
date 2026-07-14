import { useEffect, type ReactNode } from "react";
import { useFieldArray, type FieldValues, type UseFieldArrayReturn } from "react-hook-form";
import { useFormInject } from "./form.context";
import { runValidation, type FieldRules } from "./validation";

export interface FormFieldArrayRow {
  /** Stable react-hook-form row id — use as the `key` in `.map()`, never the index. */
  id: string;
  /** Display-only current position. Also the segment to build a cell's field name with. */
  index: number;
}

export interface FormFieldArrayRenderProps {
  fields: FormFieldArrayRow[];
  /** Builds the dotted field name for a cell in a row: fieldName(row.index, 'email') -> "contacts.0.email" */
  fieldName: (index: number, key: string) => string;
  append: UseFieldArrayReturn["append"];
  prepend: UseFieldArrayReturn["prepend"];
  insert: UseFieldArrayReturn["insert"];
  /**
   * Removes the row at `index` (react-hook-form's own signature — unlike
   * the Vue port's id-based `remove(id)`, RHF's `useFieldArray` only
   * accepts a position; callers already have `row.index` from `fields`).
   */
  remove: UseFieldArrayReturn["remove"];
  move: UseFieldArrayReturn["move"];
  swap: UseFieldArrayReturn["swap"];
  replace: UseFieldArrayReturn["replace"];
  error: string | undefined;
}

export interface FormFieldArrayProps {
  name: string;
  defaultValue?: Record<string, unknown>[];
  /** Row-count rules (required/minLength/maxLength/min/max) — evaluated against the array of rows. */
  rules?: FieldRules;
  children: (props: FormFieldArrayRenderProps) => ReactNode;
}

function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

/**
 * FormFieldArray — thin wrapper around react-hook-form's own `useFieldArray`,
 * which already provides everything the Vue port's hand-built
 * useFieldArray.ts (stable row ids, append/prepend/insert/remove/move/
 * swap/replace, focus retention across reorder) implemented from scratch.
 * The only custom logic added here is array-level row-count validation
 * (required/minLength/maxLength), since RHF has no rule for "the array
 * itself" — only per-item field rules. That error is stored under
 * `${name}.root`, RHF's own documented convention for field-array-level
 * errors (see RHF docs: `setError("fieldArrayName.root", ...)`) so it
 * doesn't collide with per-row errors living under `${name}.{index}.*`.
 */
export function FormFieldArray({ name, defaultValue, rules, children }: FormFieldArrayProps) {
  const ctx = useFormInject<FieldValues>();
  if (!ctx) {
    throw new Error(
      "[Auron] FormFieldArray must be used inside a <Form> — react-hook-form's useFieldArray requires a `control`.",
    );
  }
  const { form } = ctx;
  const { fields, append, prepend, insert, remove, move, swap, replace } = useFieldArray({
    control: form.control,
    name: name as never,
  });

  const errorKey = `${name}.root`;

  // Field-array-level default distinct from the form's own defaultValues —
  // seeded once on mount, mirroring the Vue port's defaultValue precedence.
  useEffect(() => {
    if (defaultValue !== undefined) replace(defaultValue as never);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only seed
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const ids = fields.map((f) => f.id);
      const message = await runValidation(ids, rules, undefined);
      if (cancelled) return;
      if (message) {
        form.setError(errorKey as never, { type: "manual", message });
      } else {
        form.clearErrors(errorKey as never);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-run only when row count or the rules object changes
  }, [fields.length, JSON.stringify(rules)]);

  const rows: FormFieldArrayRow[] = fields.map((f, index) => ({ id: f.id, index }));
  const fieldName = (index: number, key: string) => `${name}.${index}.${key}`;
  const error = (getByPath(form.formState.errors, errorKey) as { message?: string } | undefined)?.message;

  return (
    <>{children({ fields: rows, fieldName, append, prepend, insert, remove, move, swap, replace, error })}</>
  );
}
