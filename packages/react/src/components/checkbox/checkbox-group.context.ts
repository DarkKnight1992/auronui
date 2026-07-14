import type { CheckboxVariants } from "@auronui/styles";
import { createStrictContext } from "../../utils";

/**
 * CANONICAL DUAL-CONTEXT TEMPLATE (mirrors the Vue package's
 * checkbox-group.context.ts, itself the reference implementation for every
 * group component in the Vue port).
 *
 * Contract:
 * - Group provides a context value via `Provider`
 * - Child unconditionally calls `useCheckboxGroupContext(fallback)` with
 *   sensible defaults (standalone mode)
 * - Prop precedence: group.disabled wins; child.variant wins over group.variant
 */
export interface CheckboxGroupContext {
  variant: CheckboxVariants["variant"];
  color: CheckboxVariants["color"];
  disabled: boolean;
  isInvalid: boolean;
  selectedValues: string[];
  toggleValue: (value: string) => void;
  name: string | undefined;
}

export const DEFAULT_CHECKBOX_GROUP_CONTEXT: CheckboxGroupContext = {
  variant: "primary",
  color: "primary",
  disabled: false,
  isInvalid: false,
  selectedValues: [],
  toggleValue: () => {},
  name: undefined,
};

export const {
  Provider: CheckboxGroupProvider,
  useStrictContext: useCheckboxGroupContext,
} = createStrictContext<CheckboxGroupContext>("CheckboxGroup");
