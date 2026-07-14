import type { RadioGroupVariants, RadioVariants } from "@auronui/styles";
import { createStrictContext } from "../../utils";

/**
 * Radio dual-context (mirrors CANONICAL DUAL-CONTEXT TEMPLATE from
 * components/checkbox/checkbox-group.context.ts).
 *
 * Unlike the Vue port — where selection state is owned by Reka UI's
 * `RadioGroupRoot` and this context only carries `variant`/`disabled` for
 * propagation — the React port implements Radio directly with native
 * `<input type="radio">` elements (no Reka UI dependency), so this context
 * additionally owns the selection itself (`selectedValue`/`selectValue`) and
 * the shared `name` every native radio in the group must use to form a
 * single browser-native mutually-exclusive group (which is also what gives
 * native arrow-key navigation between radios for free, matching Reka's own
 * roving-tabindex behavior without any extra code).
 *
 * Contract:
 * - Group provides a context value via `Provider`
 * - Child unconditionally calls `useRadioGroupContext(fallback)` with
 *   sensible defaults (a Radio used outside a RadioGroup is inert, same as
 *   in the Vue port where a standalone RadioGroupItem has no root to bind to)
 * - Prop precedence: group.disabled wins; child.variant wins over group.variant
 */
export interface RadioGroupContext {
  variant: RadioGroupVariants["variant"];
  color: RadioVariants["color"];
  disabled: boolean;
  isInvalid: boolean;
  name: string;
  selectedValue: string | undefined;
  selectValue: (value: string) => void;
}

export const DEFAULT_RADIO_GROUP_CONTEXT: RadioGroupContext = {
  variant: undefined,
  color: "primary",
  disabled: false,
  isInvalid: false,
  name: "",
  selectedValue: undefined,
  selectValue: () => {},
};

export const {
  Provider: RadioGroupProvider,
  useStrictContext: useRadioGroupContext,
} = createStrictContext<RadioGroupContext>("RadioGroup");
